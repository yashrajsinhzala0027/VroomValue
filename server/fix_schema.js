const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function fixSchema() {
    const config = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'vroomvalue_db'
    };

    const connection = await mysql.createConnection(config);
    try {
        await connection.query("ALTER TABLE cars ADD COLUMN variant VARCHAR(100);");
        console.log("✅ Added 'variant' column to cars table.");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("ℹ️ 'variant' column already exists.");
        } else {
            console.error("❌ Error altering table:", err);
        }
    } finally {
        await connection.end();
    }
}

fixSchema();
