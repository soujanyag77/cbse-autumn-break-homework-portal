import { createClient, SupabaseClient } from '@supabase/supabase-js';

const ENV_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ENV_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseCredentials(): { url: string; key: string; isConfigured: boolean; isFromEnv: boolean } {
  let url = ENV_URL || '';
  let key = ENV_KEY || '';
  let isFromEnv = Boolean(ENV_URL && ENV_KEY);

  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('cbse_supabase_custom_url');
    const savedKey = localStorage.getItem('cbse_supabase_custom_key');
    if (savedUrl && savedKey) {
      url = savedUrl;
      key = savedKey;
      isFromEnv = false;
    }
  }

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('your-supabase')
  );

  return { url, key, isConfigured, isFromEnv };
}

let activeClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  if (!activeClient) {
    try {
      activeClient = createClient(url, key, {
        auth: { persistSession: false },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return activeClient;
}

export function saveSupabaseCredentials(url: string, key: string): boolean {
  if (typeof window !== 'undefined') {
    if (!url.trim() || !key.trim()) {
      localStorage.removeItem('cbse_supabase_custom_url');
      localStorage.removeItem('cbse_supabase_custom_key');
      activeClient = null;
      return true;
    }

    localStorage.setItem('cbse_supabase_custom_url', url.trim());
    localStorage.setItem('cbse_supabase_custom_key', key.trim());
    activeClient = createClient(url.trim(), key.trim(), {
      auth: { persistSession: false },
    });
    return true;
  }
  return false;
}

export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tableOk: boolean;
  bucketOk: boolean;
}> {
  const client = getSupabaseClient();
  const { isConfigured } = getSupabaseCredentials();

  if (!isConfigured || !client) {
    return {
      success: false,
      message: 'Supabase URL or Key is not configured or invalid.',
      tableOk: false,
      bucketOk: false,
    };
  }

  let tableOk = false;
  let bucketOk = false;
  const errors: string[] = [];

  // 1. Test database table 'assignments'
  try {
    const { error } = await client.from('assignments').select('id').limit(1);
    if (error) {
      errors.push(`Table 'assignments' error: ${error.message}`);
    } else {
      tableOk = true;
    }
  } catch (err: any) {
    errors.push(`Table check exception: ${err.message}`);
  }

  // 2. Test storage bucket 'holiday-homework'
  try {
    const { error } = await client.storage.from('holiday-homework').list('', { limit: 1 });
    if (error) {
      errors.push(`Bucket 'holiday-homework' error: ${error.message}`);
    } else {
      bucketOk = true;
    }
  } catch (err: any) {
    errors.push(`Bucket check exception: ${err.message}`);
  }

  const success = tableOk && bucketOk;
  return {
    success,
    message: success
      ? 'Connection Verified! Both database table and storage bucket are active and responding.'
      : errors.join(' • '),
    tableOk,
    bucketOk,
  };
}

// Backward-compatible exports
export const isSupabaseConfigured = Boolean(
  ENV_URL &&
  ENV_KEY &&
  ENV_URL.startsWith('https://') &&
  !ENV_URL.includes('your-supabase')
);

export const supabase = getSupabaseClient();
