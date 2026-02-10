const supabase = require('./supabaseClient');

async function testUpdate() {
    const { data, error } = await supabase
        .from('cars')
        .update({ priceinr: 725000 })
        .eq('id', 2000)
        .select();

    if (error) {
        console.error('Error updating price:', error.message);
    } else {
        console.log('Update success:', JSON.stringify(data, null, 2));
    }
}

testUpdate();
