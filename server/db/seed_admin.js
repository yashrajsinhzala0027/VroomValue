
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL or Key is missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAdmin() {
    console.log('🚀 Checking for existing admin...');
    const { data: existing } = await supabase.from('users').select('id').eq('email', 'admin@vroomvalue.in');
    if (existing && existing.length > 0) {
        console.log('✅ Admin already exists.');
        return;
    }

    const adminUser = {
        id: Date.now(),
        email: 'admin@vroomvalue.in',
        password: 'admin',
        name: 'System Admin',
        role: 'admin',
        dob: '1990-01-01',
        phone: '9999999999'
    };

    console.log('🚀 Seeding admin user...');
    const { data, error } = await supabase.from('users').insert([adminUser]).select();

    if (error) {
        console.error('❌ SEED ERROR:', error);
    } else {
        console.log('✅ SEED SUCCESS:', data);
    }
}

seedAdmin();
