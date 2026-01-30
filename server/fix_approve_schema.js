const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function fix() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('Connected to DB. Adding columns...');

        await db.execute('ALTER TABLE cars ADD COLUMN IF NOT EXISTS seats INT DEFAULT 5');
        await db.execute('ALTER TABLE cars ADD COLUMN IF NOT EXISTS color VARCHAR(50)');
        await db.execute('ALTER TABLE cars ADD COLUMN IF NOT EXISTS rto VARCHAR(50)');
        await db.execute('ALTER TABLE cars ADD COLUMN IF NOT EXISTS insuranceValidity VARCHAR(100)');
        await db.execute('ALTER TABLE cars ADD COLUMN IF NOT EXISTS accidental TINYINT DEFAULT 0');
        await db.execute('ALTER TABLE cars ADD COLUMN IF NOT EXISTS serviceHistory TINYINT DEFAULT 1');

        console.log('✅ Schema updated successfully');
        await db.end();
    } catch (err) {
        console.error('❌ Error updating schema:', err.message);
        process.exit(1);
    }
}

fix();
