const supabase = require('./supabaseClient');

async function verifyPrices() {
    console.log('💰 Checking prices in Supabase...');
    const { data, error } = await supabase
        .from('cars')
        .select('id, make, model, priceinr')
        .limit(5);

    if (error) {
        console.error('Error fetching prices:', error.message);
    } else {
        console.table(data);
        const zeroPrices = data.filter(c => c.priceinr === 0);
        if (zeroPrices.length > 0) {
            console.error('❌ Found cars with 0 price!');
        } else {
            console.log('✅ Prices are correctly populated.');
        }
    }
}

verifyPrices();
