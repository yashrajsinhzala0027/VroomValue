
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
export const isMockConfigured = import.meta.env.VITE_USE_MOCK === 'true';

if (!supabaseUrl || !supabaseAnonKey) {
    if (!isMockConfigured) {
        console.warn('Supabase credentials missing! Operating in local inventory mode.');
    } else {
        console.info('Operating in Local Mock Data mode.');
    }
}

// Provide client with safe background auth settings when offline or in mock mode
export const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder",
    {
        auth: {
            persistSession: true,
            autoRefreshToken: !isMockConfigured,
            detectSessionInUrl: !isMockConfigured
        }
    }
);
