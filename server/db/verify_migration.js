const supabase = require('./supabaseClient');

async function verifyCounts() {
    const tables = ['users', 'cars', 'sell_requests', 'test_drives'];
    console.log('📊 Supabase Data Verification:');

    for (const table of tables) {
        const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error(`❌ ${table}: Error - ${error.message}`);
        } else {
            console.log(`✅ ${table}: ${count} rows`);
        }
    }
}

verifyCounts();
