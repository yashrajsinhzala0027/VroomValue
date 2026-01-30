const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function patchCars() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    const colors = ["White", "Silver", "Grey", "Black", "Blue", "Red"];

    console.log("Patching existing cars with default values for new columns...");

    const [cars] = await db.execute('SELECT id, model, bodyType FROM cars');

    for (const car of cars) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        // Determine seats based on body type or model
        let seats = 5;
        const suvModels = ["Fortuner", "XUV700", "Innova", "Scorpio", "Safari", "Ertiga", "XL6"];
        if (suvModels.some(m => car.model?.includes(m)) || car.bodyType === 'SUV' || car.bodyType === 'MUV/MPV') {
            seats = Math.random() > 0.5 ? 7 : 5;
        }

        await db.execute(
            'UPDATE cars SET color = ?, seats = ?, rto = ?, insuranceValidity = ? WHERE id = ?',
            [randomColor, seats, 'DL-01', '2026-12-31', car.id]
        );
    }

    console.log(`✅ Patched ${cars.length} cars.`);
    await db.end();
}

patchCars().catch(console.error);
