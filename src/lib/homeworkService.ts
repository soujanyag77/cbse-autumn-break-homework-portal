import { Assignment, HomeworkFile } from '@/types/homework';
import { INITIAL_MOCK_ASSIGNMENTS } from './mockData';
import { getSupabaseClient, getSupabaseCredentials } from './supabase';
import {
  getAssignmentsFromIdb,
  saveAssignmentToIdb,
  saveAllAssignmentsToIdb,
  deleteAssignmentFromIdb,
} from './indexedDbStorage';

const LOCAL_STORAGE_KEY = 'cbse_autumn_homework_assignments_v1';

export async function fetchAssignments(): Promise<{ assignments: Assignment[]; isFromSupabase: boolean }> {
  const client = getSupabaseClient();
  const { isConfigured } = getSupabaseCredentials();

  // 1. Try Supabase Cloud Database first (Shared across all devices)
  if (isConfigured && client) {
    try {
      const { data: assignmentsData, error: assignError } = await client
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (assignError) throw assignError;

      if (assignmentsData && assignmentsData.length > 0) {
        // Fetch files for assignments
        const { data: filesData } = await client
          .from('assignment_files')
          .select('*');

        const filesMap: Record<string, HomeworkFile[]> = {};
        if (filesData) {
          filesData.forEach((f: any) => {
            if (!filesMap[f.assignment_id]) filesMap[f.assignment_id] = [];
            filesMap[f.assignment_id].push({
              id: f.id,
              assignment_id: f.assignment_id,
              file_name: f.file_name,
              file_size: f.file_size || 0,
              file_type: f.file_type || 'file',
              storage_path: f.storage_path,
              public_url: f.public_url,
            });
          });
        }

        const formattedAssignments: Assignment[] = assignmentsData.map((a: any) => ({
          id: a.id,
          created_at: a.created_at,
          teacher_name: a.teacher_name,
          teacher_phone: a.teacher_phone,
          teacher_email: a.teacher_email || '',
          class_grade: a.class_grade,
          section: a.section,
          subject: a.subject,
          title: a.title,
          instructions: a.instructions,
          due_date: a.due_date,
          files: filesMap[a.id] || [],
          is_verified_staff: true,
        }));

        // Cache into IndexedDB for instant load on refresh
        await saveAllAssignmentsToIdb(formattedAssignments);

        return { assignments: formattedAssignments, isFromSupabase: true };
      }
    } catch (err) {
      console.warn('Supabase fetch failed, checking IndexedDB cache:', err);
    }
  }

  // 2. Read from IndexedDB (Persistent across page reloads without 5MB quota limit)
  if (typeof window !== 'undefined') {
    const idbData = await getAssignmentsFromIdb();
    if (idbData && idbData.length > 0) {
      return { assignments: idbData, isFromSupabase: false };
    }

    // 3. Check legacy localStorage fallback
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migrate to IndexedDB
          await saveAllAssignmentsToIdb(parsed);
          return { assignments: parsed, isFromSupabase: false };
        }
      } catch (e) {
        console.error('Failed to parse cached local homework data', e);
      }
    }

    // 4. First run: Initialize IndexedDB with default mock data
    await saveAllAssignmentsToIdb(INITIAL_MOCK_ASSIGNMENTS);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ASSIGNMENTS));
    } catch (e) {
      // Ignore if localStorage quota exceeded
    }
  }

  return { assignments: INITIAL_MOCK_ASSIGNMENTS, isFromSupabase: false };
}

export async function saveAssignment(
  newAssignment: Omit<Assignment, 'id' | 'created_at'>,
  rawFiles: File[]
): Promise<Assignment> {
  const generatedId = `assign-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const createdAt = new Date().toISOString();

  const processedFiles: HomeworkFile[] = [];
  const client = getSupabaseClient();
  const { isConfigured } = getSupabaseCredentials();

  let savedToSupabase = false;

  // 1. Process files into durable URLs
  for (const file of rawFiles) {
    const fileExt = file.name.split('.').pop() || 'file';
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    let publicUrl = '';

    // If Supabase is available, try uploading to bucket
    if (isConfigured && client) {
      try {
        const storagePath = `${generatedId}/${fileId}.${fileExt}`;
        const { error: uploadError } = await client.storage
          .from('holiday-homework')
          .upload(storagePath, file, { cacheControl: '3600', upsert: true });

        if (!uploadError) {
          const { data: urlData } = client.storage
            .from('holiday-homework')
            .getPublicUrl(storagePath);
          publicUrl = urlData.publicUrl;
        }
      } catch (e) {
        console.warn('Supabase bucket upload error, converting to local data URL:', e);
      }
    }

    // If not in Supabase storage or failed, convert to base64 Data URL for IndexedDB
    if (!publicUrl) {
      publicUrl = await readFileAsDataUrl(file);
    }

    processedFiles.push({
      id: fileId,
      assignment_id: generatedId,
      file_name: file.name,
      file_size: file.size,
      file_type: fileExt,
      public_url: publicUrl,
    });
  }

  const finalAssignment: Assignment = {
    ...newAssignment,
    id: generatedId,
    created_at: createdAt,
    files: processedFiles,
    is_verified_staff: true,
  };

  // 2. Try inserting assignment record into Supabase cloud table
  if (isConfigured && client) {
    try {
      const { error: insertError } = await client.from('assignments').insert({
        id: generatedId,
        created_at: createdAt,
        teacher_name: newAssignment.teacher_name,
        teacher_phone: newAssignment.teacher_phone,
        teacher_email: newAssignment.teacher_email,
        class_grade: newAssignment.class_grade,
        section: newAssignment.section,
        subject: newAssignment.subject,
        title: newAssignment.title,
        instructions: newAssignment.instructions,
        due_date: newAssignment.due_date,
      });

      if (!insertError) {
        savedToSupabase = true;
        // Insert file records into Supabase
        for (const fileRecord of processedFiles) {
          await client.from('assignment_files').insert({
            id: fileRecord.id,
            assignment_id: generatedId,
            file_name: fileRecord.file_name,
            file_size: fileRecord.file_size,
            file_type: fileRecord.file_type,
            public_url: fileRecord.public_url,
          });
        }
      } else {
        console.warn('Supabase assignment insert error:', insertError);
      }
    } catch (err) {
      console.warn('Supabase save error, persisting locally in IndexedDB:', err);
    }
  }

  // 3. ALWAYS Save into IndexedDB so it NEVER disappears on page refresh!
  if (typeof window !== 'undefined') {
    try {
      await saveAssignmentToIdb(finalAssignment);
    } catch (err) {
      console.error('Error saving to IndexedDB:', err);
    }

    // Also update localStorage safely without quota crash
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      let list: Assignment[] = cached ? JSON.parse(cached) : [...INITIAL_MOCK_ASSIGNMENTS];
      // Save metadata to localStorage (without giant data URLs if too big)
      const sanitizedForLocalStorage = {
        ...finalAssignment,
        files: finalAssignment.files.map((f) => ({
          ...f,
          public_url: f.public_url.startsWith('data:') && f.public_url.length > 50000
            ? f.public_url.substring(0, 100) + '...'
            : f.public_url,
        })),
      };
      list = [sanitizedForLocalStorage, ...list];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('localStorage quota reached, IndexedDB is handling full files successfully');
    }
  }

  return finalAssignment;
}

export async function deleteAssignment(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  const { isConfigured } = getSupabaseCredentials();

  if (isConfigured && client) {
    try {
      await client.from('assignment_files').delete().eq('assignment_id', id);
      await client.from('assignments').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    // Delete from IndexedDB
    await deleteAssignmentFromIdb(id);

    // Delete from localStorage
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const list: Assignment[] = JSON.parse(cached);
        const filtered = list.filter((a) => a.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      // Ignore
    }
  }
  return true;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => {
      resolve(`data:application/octet-stream;name=${encodeURIComponent(file.name)},`);
    };
    reader.readAsDataURL(file);
  });
}
