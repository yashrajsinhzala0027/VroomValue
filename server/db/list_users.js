const supabase = require('./supabaseClient');

async function listUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        console.error('Error fetching users:', error.message);
    } else {
        console.log('Users in Supabase:', JSON.stringify(data, null, 2));
    }
}

listUsers();
