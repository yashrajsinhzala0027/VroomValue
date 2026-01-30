import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, 'server', 'data', 'cars.json');

try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(rawData);
    const fixedData = data.map(car => ({
        ...car,
        status: 'approved'
    }));
    fs.writeFileSync(DATA_FILE, JSON.stringify(fixedData, null, 2));
    console.log(`Successfully fixed ${fixedData.length} cars.`);
} catch (err) {
    console.error("Error fixing cars:", err.message);
}
