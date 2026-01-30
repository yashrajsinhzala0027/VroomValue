const pool = require('./db/db');

async function check() {
    try {
        console.log("Checking tables...");
        const [rows] = await pool.execute("SHOW TABLES");
        console.log("Tables:", rows);

        console.log("Checking users table columns...");
        const [columns] = await pool.execute("DESCRIBE users");
        console.log("Columns:", columns.map(c => c.Field));

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

check();
