const fs = require('fs');
const path = require('path');
// Handle .env path resolution (same logic as other files)
const envPath = fs.existsSync(path.join(__dirname, '..', '.env'))
    ? path.join(__dirname, '..', '.env')
    : path.join(__dirname, '..', 'server', '.env');

require('dotenv').config({ path: envPath });
const mysql = require('mysql2/promise');

async function checkUsers() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'vroomvalue_db',
            port: process.env.DB_PORT || 3306
        });

        console.log("✅ Connected to DB.");

        const [rows] = await connection.execute('SELECT id, email, password, role FROM users');
        console.log(`\nFound ${rows.length} users:`);
        console.table(rows);

        await connection.end();
    } catch (err) {
        console.error("❌ Check Failed!");
        console.error(err);
    }
}

checkUsers();
