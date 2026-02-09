const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/.env' });

async function updateAdminName() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'vroomvalue_db',
            port: process.env.DB_PORT || 3306
        });

        const [result] = await db.execute(
            'UPDATE users SET name = ? WHERE email = ?',
            ['Admin', 'admin@vroomvalue.in']
        );

        console.log('Update result:', result.affectedRows, 'row(s) affected.');

        const [rows] = await db.execute('SELECT email, name FROM users WHERE email = ?', ['admin@vroomvalue.in']);
        console.log('Current Admin Info:', rows[0]);

        await db.end();
    } catch (err) {
        console.error('Update failed:', err);
    }
}

updateAdminName();
