import { Assignment, HomeworkFile } from '@/types/homework';
import { INITIAL_MOCK_ASSIGNMENTS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'cbse_autumn_homework_assignments_v1';

export async function fetchAssignments(): Promise<{ assignments: Assignment[]; isFromSupabase: boolean }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: assignmentsData, error: assignError } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (assignError) throw assignError;

      if (assignmentsData) {
        // Fetch files for each assignment
        const { data: filesData } = await supabase
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

        return { assignments: formattedAssignments, isFromSupabase: true };
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage mock data:', err);
    }
  }

  // Fallback to localStorage / initial mock
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { assignments: parsed, isFromSupabase: false };
        }
      } catch (e) {
        console.error('Failed to parse cached local homework data', e);
      }
    }

    // Initialize with mock data if none exists
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ASSIGNMENTS));
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

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Insert assignment into Supabase table
      const { data: createdAssignment, error: insertError } = await supabase
        .from('assignments')
        .insert({
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
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 2. Upload files to bucket 'holiday-homework'
      for (const file of rawFiles) {
        const fileExt = file.name.split('.').pop() || 'bin';
        const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const storagePath = `${generatedId}/${fileId}.${fileExt}`;

        let publicUrl = '';
        const { error: uploadError } = await supabase.storage
          .from('holiday-homework')
          .upload(storagePath, file, { cacheControl: '3600', upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('holiday-homework')
            .getPublicUrl(storagePath);
          publicUrl = urlData.publicUrl;
        } else {
          // Fallback if bucket doesn't exist yet
          publicUrl = await readFileAsDataUrl(file);
        }

        // Insert into assignment_files table
        const fileRecord = {
          id: fileId,
          assignment_id: generatedId,
          file_name: file.name,
          file_size: file.size,
          file_type: fileExt,
          storage_path: storagePath,
          public_url: publicUrl,
        };

        await supabase.from('assignment_files').insert(fileRecord);
        processedFiles.push(fileRecord);
      }

      return {
        ...newAssignment,
        id: generatedId,
        created_at: createdAt,
        files: processedFiles,
        is_verified_staff: true,
      };
    } catch (err) {
      console.warn('Supabase upload failed, saving to local storage fallback:', err);
    }
  }

  // Local storage fallback implementation
  for (const file of rawFiles) {
    const fileExt = file.name.split('.').pop() || 'file';
    const dataUrl = await readFileAsDataUrl(file);
    processedFiles.push({
      id: `file-loc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      assignment_id: generatedId,
      file_name: file.name,
      file_size: file.size,
      file_type: fileExt,
      public_url: dataUrl,
    });
  }

  const finalAssignment: Assignment = {
    ...newAssignment,
    id: generatedId,
    created_at: createdAt,
    files: processedFiles,
    is_verified_staff: true,
  };

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: Assignment[] = cached ? JSON.parse(cached) : [...INITIAL_MOCK_ASSIGNMENTS];
    list = [finalAssignment, ...list];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  return finalAssignment;
}

export async function deleteAssignment(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('assignment_files').delete().eq('assignment_id', id);
      await supabase.from('assignments').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const list: Assignment[] = JSON.parse(cached);
      const filtered = list.filter((a) => a.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    }
  }
  return true;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => {
      // Fallback empty data URL
      resolve(`data:application/octet-stream;name=${encodeURIComponent(file.name)},`);
    };
    reader.readAsDataURL(file);
  });
}
