const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function fixData() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    const colors = ["White", "Silver", "Grey", "Black", "Blue", "Red", "Brown", "Beige", "Gold", "Green"];
    const seats_options = [4, 5, 7];
    const owners = [1, 2, 3];
    const cities = ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Gurgaon", "Noida"];

    console.log("Cleaning up and diversifying car data...");

    // 1. Fix City Names (e.g., Delhi -> New Delhi)
    await db.execute("UPDATE cars SET city = 'New Delhi' WHERE city = 'Delhi'");
    await db.execute("UPDATE cars SET city = 'Mumbai' WHERE city = 'Bombay'");

    const [cars] = await db.execute('SELECT id, model, bodyType, city FROM cars');

    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];

        // Randomize Color
        const color = colors[i % colors.length];

        // Randomize Seats based on body type
        let seats = 5;
        if (car.bodyType === 'SUV' || car.bodyType === 'MUV/MPV') {
            seats = (i % 3 === 0) ? 7 : 5;
        } else if (car.bodyType === 'Hatchback' && i % 5 === 0) {
            seats = 4;
        }

        // Randomize Owner
        const owner = owners[i % owners.length];

        // Randomize KMS to include low values
        let kms = 15000 + (Math.floor(Math.random() * 60) * 1000);
        if (i % 7 === 0) kms = 5000 + (Math.floor(Math.random() * 4) * 1000); // Rare low-KM cars

        // Randomize City if it's not in our primary list
        let city = car.city;
        if (!cities.includes(city)) {
            city = cities[i % cities.length];
        }

        await db.execute(
            'UPDATE cars SET color = ?, seats = ?, owner = ?, city = ?, kms = ? WHERE id = ?',
            [color, seats, owner, city, kms, car.id]
        );
    }

    console.log(`✅ Diversified ${cars.length} cars.`);
    await db.end();
}

fixData().catch(console.error);
