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
        // Add certified column (BOOLEAN which is TINYINT(1))
        await connection.query("ALTER TABLE cars ADD COLUMN certified BOOLEAN DEFAULT FALSE;");
        console.log("✅ Added 'certified' column to cars table.");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("ℹ️ 'certified' column already exists.");
        } else {
            console.error("❌ Error altering table:", err);
        }
    } finally {
        await connection.end();
    }
}

fixSchema();
