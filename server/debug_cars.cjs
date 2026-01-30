const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/.env' });

async function checkCars() {
    try {
        console.log("Connecting to DB...");
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'vroomvalue_db',
            port: process.env.DB_PORT || 3306
        });

        console.log("Connected. Querying cars...");
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM cars');
        console.log(`--- CARS COUNT: ${rows[0].count} ---`);

        if (rows[0].count > 0) {
            const [data] = await db.execute('SELECT id, make, model FROM cars LIMIT 5');
            console.log('Sample data:', data);
        } else {
            console.log("Table is empty!");
        }

        await db.end();
    } catch (err) {
        console.error('Check failed:', err);
    }
}

checkCars();
