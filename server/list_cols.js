const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function listCols() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    const [cols] = await db.execute('DESCRIBE cars');
    console.log('--- CARS COLUMNS ---');
    cols.forEach(c => console.log(c.Field));
    await db.end();
}

listCols().catch(console.error);
