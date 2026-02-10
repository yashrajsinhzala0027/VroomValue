const supabase = require('./supabaseClient');

async function testConnection() {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('cars').select('*').limit(1);

    if (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    } else {
        console.log('✅ Connection successful! Data:', data);
        process.exit(0);
    }
}

testConnection();
