const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function listMakes() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    const [rows] = await db.execute('SELECT DISTINCT make FROM cars');
    console.log('DISTINCT MAKES IN DB:');
    rows.forEach(r => console.log(`'${r.make}'`));
    await db.end();
}

listMakes().catch(console.error);
