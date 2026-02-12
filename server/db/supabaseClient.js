const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Prioritize Service Role Key for backend (server-side) operations
const activeKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !activeKey) {
    console.error('❌ Supabase URL or Key is missing in .env file');
}

const supabase = createClient(supabaseUrl, activeKey);

module.exports = supabase;
