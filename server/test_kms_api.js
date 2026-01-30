const axios = require('axios');

async function testKmsFilter() {
    console.log("Testing KMS Filter (maxKms = 10000)...");
    try {
        const res = await axios.get('http://localhost:5005/api/cars', {
            params: { maxKms: 10000 }
        });

        const cars = res.data;
        console.log(`Found ${cars.length} cars.`);

        const highKmsCars = cars.filter(c => c.kms > 10000);
        if (highKmsCars.length > 0) {
            console.log("❌ ERROR: Found cars with > 10000 kms!");
            highKmsCars.forEach(c => console.log(`- ID ${c.id}: ${c.kms} kms`));
        } else {
            console.log("✅ SUCCESS: All cars are <= 10000 kms.");
        }
    } catch (err) {
        console.error("Test failed:", err.message);
    }
}

testKmsFilter();
