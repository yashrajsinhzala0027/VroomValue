import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function check() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await db.execute('SELECT id, auction FROM cars');
        console.log(`Total cars fetched: ${rows.length}`);

        let trueCount = 0;
        let falseCount = 0;
        let nullCount = 0;
        let malformedCount = 0;

        rows.forEach(row => {
            let data = row.auction;
            if (!data) {
                nullCount++;
                return;
            }
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    malformedCount++;
                    return;
                }
            }
            if (data && data.isAuction === true) trueCount++;
            else falseCount++;
        });

        console.log(`Summary:`);
        console.log(`- isAuction: true -> ${trueCount}`);
        console.log(`- isAuction: false/falsy -> ${falseCount}`);
        console.log(`- null/empty -> ${nullCount}`);
        console.log(`- malformed -> ${malformedCount}`);

        await db.end();
    } catch (e) {
        console.error(e.message);
    }
}

check();
