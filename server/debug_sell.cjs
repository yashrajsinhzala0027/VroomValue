const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/.env' });

async function checkSellRequests() {
    try {
        console.log("Connecting to DB...");
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'vroomvalue_db',
            port: process.env.DB_PORT || 3306
        });

        console.log("Connected. Checking sell_requests table...");

        // Check if table exists
        const [tables] = await db.execute("SHOW TABLES LIKE 'sell_requests'");
        if (tables.length === 0) {
            console.error("❌ Table 'sell_requests' does NOT exist!");
        } else {
            console.log("✅ Table 'sell_requests' exists.");

            // Check columns
            const [columns] = await db.execute("SHOW COLUMNS FROM sell_requests");
            console.log("Columns:", columns.map(c => c.Field).join(", "));

            // Try fetch
            const [rows] = await db.execute('SELECT * FROM sell_requests');
            console.log(`Found ${rows.length} requests.`);
            if (rows.length > 0) {
                console.log("Sample:", rows[0]);
            }
        }

        await db.end();
    } catch (err) {
        console.error('Check failed:', err);
    }
}

checkSellRequests();
