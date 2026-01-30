const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function clearCars() {
    const config = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'vroomvalue_db'
    };

    const connection = await mysql.createConnection(config);
    try {
        await connection.query("TRUNCATE TABLE cars;");
        console.log("✅ Cleared 'cars' table.");
    } catch (err) {
        console.error("❌ Error clearing table:", err);
    } finally {
        await connection.end();
    }
}

clearCars();
