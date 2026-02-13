
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.env.VITE_USE_MOCK !== 'true') {
        console.error('❌ Supabase credentials missing! If you are on Vercel, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Project Settings.');
    } else {
        console.warn('⚠️ Supabase credentials missing, but using Mock Data mode.');
    }
}

// Provide fallback empty strings to prevent createClient from throwing 'supabaseKey is required'
export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder");
