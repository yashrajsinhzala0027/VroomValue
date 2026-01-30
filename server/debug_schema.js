const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    const [carCols] = await connection.execute('DESCRIBE cars');
    console.log('CARS_COLUMNS:', carCols.map(c => c.Field).join(','));

    const [sellCols] = await connection.execute('DESCRIBE sell_requests');
    console.log('SELL_REQUESTS_COLUMNS:', sellCols.map(c => c.Field).join(','));

    await connection.end();
}

checkSchema().catch(console.error);
