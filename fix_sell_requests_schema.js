const pool = require('./server/db/db');

async function fixSchema() {
    try {
        console.log("Checking sell_requests table columns...");
        const [columns] = await pool.execute("SHOW COLUMNS FROM sell_requests");
        const columnNames = columns.map(c => c.Field);

        const updates = [
            { name: 'bodyType', type: 'VARCHAR(50)' },
            { name: 'features', type: 'JSON' },
            { name: 'priceINR', type: 'BIGINT' }
        ];

        for (const col of updates) {
            if (!columnNames.includes(col.name)) {
                console.log(`Adding column ${col.name}...`);
                await pool.execute(`ALTER TABLE sell_requests ADD COLUMN ${col.name} ${col.type}`);
            }
        }

        console.log("✅ Schema updated successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Schema update failed:", err.message);
        process.exit(1);
    }
}

fixSchema();
