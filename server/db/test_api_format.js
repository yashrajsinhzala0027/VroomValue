const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 5005,
    path: '/api/cars',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const cars = JSON.parse(data);
            if (cars.length > 0) {
                const firstCar = cars[0];
                console.log('Sample Car Keys:', Object.keys(firstCar));
                if (firstCar.hasOwnProperty('priceINR')) {
                    console.log('✅ Found priceINR! Value:', firstCar.priceINR);
                } else {
                    console.error('❌ priceINR NOT found. Case issue persists.');
                }
            } else {
                console.log('No cars found in DB.');
            }
        } catch (e) {
            console.error('Failed to parse response:', e.message);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
