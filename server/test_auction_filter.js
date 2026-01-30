import axios from 'axios';

async function test() {
    try {
        const response = await axios.get('http://localhost:5005/api/cars?isAuction=true');
        console.log('Cars returned with isAuction=true:', response.data.length);
        response.data.forEach((c, i) => {
            if (i < 5) console.log(`  ${i + 1}. ${c.make} ${c.model} - Auction: ${c.auction?.isAuction}`);
        });
    } catch (e) {
        console.log('ERROR:', e.message);
    }
}

test();
