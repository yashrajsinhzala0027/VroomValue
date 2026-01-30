const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const fs = require('fs');
const mysql = require('mysql2/promise');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

async function initialize() {
    console.log("🚀 Starting MySQL Initialization...");

    const config = {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT || 3306
    };
    console.log("🔌 Connecting with:", { ...config, password: '****' });

    const connection = await mysql.createConnection(config);

    console.log("✅ Connected to MySQL Server.");

    // 2. Run Schema
    const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
    const queries = schema.split(';').filter(q => q.trim());

    for (let query of queries) {
        if (!query.trim()) continue;
        await connection.query(query);
    }
    console.log("✅ Database and Tables created.");

    // 3. Connect to the specific DB for migration
    await connection.changeUser({ database: process.env.DB_NAME || 'vroomvalue_db' });

    // 4. Migration Helper
    const migrate = async (filename, table, transformer = (x) => x) => {
        const filePath = path.join(DATA_DIR, filename);
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ Skip: ${filename} not found.`);
            return;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`📦 Migrating ${data.length} records to ${table}...`);

        for (let item of data) {
            const transformed = transformer(item);
            const keys = Object.keys(transformed);
            const values = Object.values(transformed).map(v =>
                typeof v === 'object' ? JSON.stringify(v) : v
            );

            const placeholders = keys.map(() => '?').join(', ');
            const sql = `INSERT IGNORE INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

            try {
                await connection.execute(sql, values);
            } catch (err) {
                console.error(`❌ Error inserting into ${table}:`, err.message);
            }
        }
        console.log(`✅ ${table} migration complete.`);
    };

    // 5. Run Migrations
    await migrate('users.json', 'users');
    await migrate('cars.json', 'cars');
    await migrate('sell-requests.json', 'sell_requests');
    await migrate('test-drives.json', 'test_drives', (td) => ({
        ...td,
        date: td.date ? new Date(td.date).toISOString().slice(0, 19).replace('T', ' ') : null
    }));

    await connection.end();
    console.log("\n🎉 MySQL Migration Finished Successfully!");
}

initialize().catch(err => {
    console.error("\n💥 Initialization failed!");
    console.error("Error Detail:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    process.exit(1);
});
