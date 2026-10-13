import { createClient, SupabaseClient } from '@supabase/supabase-js';

const ENV_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ENV_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseCredentials(): { url: string; key: string; isConfigured: boolean } {
  let url = ENV_URL || '';
  let key = ENV_KEY || '';

  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('cbse_supabase_custom_url');
    const savedKey = localStorage.getItem('cbse_supabase_custom_key');
    if (savedUrl && savedKey) {
      url = savedUrl;
      key = savedKey;
    }
  }

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('your-supabase')
  );

  return { url, key, isConfigured };
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

// Backward-compatible exports
export const isSupabaseConfigured = Boolean(
  ENV_URL &&
  ENV_KEY &&
  ENV_URL.startsWith('https://') &&
  !ENV_URL.includes('your-supabase')
);

export const supabase = getSupabaseClient();
