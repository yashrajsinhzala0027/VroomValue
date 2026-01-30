const pool = require('./server/db/db');

async function testInsert() {
    try {
        const newRequest = {
            id: Date.now(),
            make: 'Test',
            model: 'Test',
            variant: 'Test',
            year: 2021,
            fuel: 'Petrol',
            transmission: 'Manual',
            kms: 1000,
            owner: 1,
            city: 'Test',
            engineCapacity: 1200,
            mileageKmpl: 20,
            seats: 5,
            color: 'White',
            rto: 'Test',
            insuranceValidity: 'Test',
            accidental: 0,
            serviceHistory: 1,
            description: 'Test',
            status: 'pending',
            requestDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            valuation: JSON.stringify({ fairPrice: 100000, goodPrice: 120000 }),
            images: JSON.stringify([])
        };

        const keys = Object.keys(newRequest);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO sell_requests (${keys.join(', ')}) VALUES (${placeholders})`;
        const values = keys.map(k => newRequest[k]);

        console.log("SQL:", sql);
        console.log("Values:", values);

        await pool.execute(sql, values);
        console.log("✅ Insert successful");
        process.exit(0);
    } catch (err) {
        console.error("❌ Insert failed:", err);
        process.exit(1);
    }
}

testInsert();
