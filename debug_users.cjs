const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'server/.env' });

async function checkUsers() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'vroomvalue_db',
            port: process.env.DB_PORT || 3306
        });

        const [rows] = await db.execute('SELECT email, password FROM users');
        console.log('--- USERS IN DB ---');
        rows.forEach(row => console.log(`${row.email} / ${row.password}`));
        console.log('-------------------');
        await db.end();
    } catch (err) {
        console.error('Check failed:', err);
    }
}

checkUsers();
