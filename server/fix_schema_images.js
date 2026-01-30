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
        // Rename image to images and ensure it's JSON compatible via TEXT or JSON
        await connection.query("ALTER TABLE cars CHANGE COLUMN image images JSON;");
        console.log("✅ Renamed 'image' to 'images' and set type to JSON.");
    } catch (err) {
        if (err.code === 'ER_BAD_FIELD_ERROR') {
            // Maybe it's already done or column doesn't exist? Try adding if missing.
            try {
                await connection.query("ALTER TABLE cars ADD COLUMN images JSON;");
                console.log("✅ Added 'images' column.");
            } catch (e2) {
                console.error("❌ Error adding column:", e2);
            }
        } else {
            console.error("❌ Error altering table:", err);
        }
    } finally {
        await connection.end();
    }
}

fixSchema();
