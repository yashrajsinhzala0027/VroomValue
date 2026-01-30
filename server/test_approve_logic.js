const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testApprove() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        const [requests] = await db.execute('SELECT * FROM sell_requests LIMIT 1');
        if (requests.length === 0) {
            console.log('No sell requests found to test.');
            return;
        }

        const request = requests[0];
        console.log('Testing with request ID:', request.id);

        let valuationData = {};
        try {
            valuationData = typeof request.valuation === 'string' ? JSON.parse(request.valuation) : (request.valuation || {});
        } catch (e) {
            valuationData = { fairPrice: 0 };
        }
        const fairPrice = valuationData.fairPrice || 0;

        const newCarData = {
            ...request,
            priceINR: request.priceINR || fairPrice,
            kms: request.kms,
            id: Date.now(),
            status: 'approved',
            valuation: JSON.stringify(valuationData),
            features: JSON.stringify([]),
            auction: JSON.stringify({ isAuction: false }),
            images: typeof request.images === 'string' ? request.images : JSON.stringify(request.images || []),
            bodyType: request.bodyType || 'SUV',
            certified: 0,
            sellerType: 'Individual'
        };

        const validCols = [
            'id', 'make', 'model', 'variant', 'year', 'kms', 'fuel', 'transmission',
            'priceINR', 'city', 'bodyType', 'certified', 'owner', 'status', 'sellerType',
            'engineCapacity', 'mileageKmpl', 'description', 'valuation', 'features',
            'auction', 'images', 'seats', 'color', 'rto', 'insuranceValidity',
            'accidental', 'serviceHistory'
        ];

        const filteredCar = {};
        validCols.forEach(col => {
            if (newCarData[col] !== undefined) filteredCar[col] = newCarData[col];
        });

        const keys = Object.keys(filteredCar);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO cars (${keys.join(', ')}) VALUES (${placeholders})`;
        const values = keys.map(k => (typeof filteredCar[k] === 'object' && filteredCar[k] !== null) ? JSON.stringify(filteredCar[k]) : filteredCar[k]);

        console.log('SQL:', sql);
        console.log('Values:', values);

        await db.execute(sql, values);
        console.log('✅ Success!');
    } catch (err) {
        console.error('❌ ERROR:', err);
    } finally {
        await db.end();
    }
}

testApprove();
