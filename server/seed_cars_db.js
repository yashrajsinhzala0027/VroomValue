const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = {
    host: '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vroomvalue_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const cities = ["New Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Ahmedabad", "Gurgaon", "Chennai", "Noida", "Kolkata"];

const realCars = [
    // HATCHBACKS
    { make: "Maruti Suzuki", model: "Swift", variant: "ZXI Plus", year: 2021, priceINR: 725000, kms: 28000, fuel: "Petrol", transmission: "Manual", bodyType: "Hatchback", engineCapacity: 1197, mileageKmpl: 23.2 },
    { make: "Maruti Suzuki", model: "Baleno", variant: "Alpha", year: 2020, priceINR: 780000, kms: 35000, fuel: "Petrol", transmission: "CVT", bodyType: "Hatchback", engineCapacity: 1197, mileageKmpl: 22.3 },
    { make: "Hyundai", model: "i20", variant: "Asta (O)", year: 2022, priceINR: 950000, kms: 15000, fuel: "Petrol", transmission: "IVT", bodyType: "Hatchback", engineCapacity: 1197, mileageKmpl: 20.3 },
    { make: "Tata", model: "Altroz", variant: "XZ Plus", year: 2021, priceINR: 810000, kms: 22000, fuel: "Diesel", transmission: "Manual", bodyType: "Hatchback", engineCapacity: 1497, mileageKmpl: 25.1 },
    { make: "Volkswagen", model: "Polo", variant: "GT TSI", year: 2019, priceINR: 850000, kms: 45000, fuel: "Petrol", transmission: "Automatic", bodyType: "Hatchback", engineCapacity: 999, mileageKmpl: 18.2 },
    { make: "Maruti Suzuki", model: "Wagon R", variant: "ZXI 1.2", year: 2020, priceINR: 520000, kms: 41000, fuel: "Petrol", transmission: "Manual", bodyType: "Hatchback", engineCapacity: 1197, mileageKmpl: 21.7 },
    { make: "Renault", model: "Kwid", variant: "Climber", year: 2022, priceINR: 480000, kms: 12000, fuel: "Petrol", transmission: "Automatic", bodyType: "Hatchback", engineCapacity: 999, mileageKmpl: 22.0 },
    { make: "Tata", model: "Tiago", variant: "XZ Plus", year: 2021, priceINR: 620000, kms: 26000, fuel: "Petrol", transmission: "Manual", bodyType: "Hatchback", engineCapacity: 1199, mileageKmpl: 23.8 },
    { make: "Hyundai", model: "Grand i10 Nios", variant: "Sportz", year: 2020, priceINR: 650000, kms: 32000, fuel: "Petrol", transmission: "AMT", bodyType: "Hatchback", engineCapacity: 1197, mileageKmpl: 20.7 },
    { make: "Toyota", model: "Glanza", variant: "V", year: 2021, priceINR: 790000, kms: 29000, fuel: "Petrol", transmission: "CVT", bodyType: "Hatchback", engineCapacity: 1197, mileageKmpl: 22.9 },

    // SEDANS
    { make: "Honda", model: "City", variant: "ZX CVT", year: 2021, priceINR: 1350000, kms: 25000, fuel: "Petrol", transmission: "Automatic", bodyType: "Sedan", engineCapacity: 1498, mileageKmpl: 18.4 },
    { make: "Hyundai", model: "Verna", variant: "SX (O) Turbo", year: 2020, priceINR: 1180000, kms: 38000, fuel: "Petrol", transmission: "DCT", bodyType: "Sedan", engineCapacity: 998, mileageKmpl: 19.2 },
    { make: "Maruti Suzuki", model: "Ciaz", variant: "Alpha", year: 2019, priceINR: 890000, kms: 42000, fuel: "Petrol", transmission: "Manual", bodyType: "Sedan", engineCapacity: 1462, mileageKmpl: 20.6 },
    { make: "Skoda", model: "Slavia", variant: "Style 1.5 DSG", year: 2022, priceINR: 1650000, kms: 12000, fuel: "Petrol", transmission: "Automatic", bodyType: "Sedan", engineCapacity: 1498, mileageKmpl: 18.7 },
    { make: "Volkswagen", model: "Virtus", variant: "GT Plus", year: 2023, priceINR: 1820000, kms: 5000, fuel: "Petrol", transmission: "Automatic", bodyType: "Sedan", engineCapacity: 1498, mileageKmpl: 18.6 },
    { make: "Maruti Suzuki", model: "Dzire", variant: "ZXI Plus", year: 2021, priceINR: 750000, kms: 30000, fuel: "Petrol", transmission: "AMT", bodyType: "Sedan", engineCapacity: 1197, mileageKmpl: 24.1 },
    { make: "Hyundai", model: "Aura", variant: "SX Plus Turbo", year: 2020, priceINR: 710000, kms: 34000, fuel: "Petrol", transmission: "Manual", bodyType: "Sedan", engineCapacity: 998, mileageKmpl: 20.5 },
    { make: "Honda", model: "Amaze", variant: "VX CVT", year: 2022, priceINR: 920000, kms: 18000, fuel: "Diesel", transmission: "Automatic", bodyType: "Sedan", engineCapacity: 1498, mileageKmpl: 24.7 },
    { make: "Tata", model: "Tigor", variant: "XZ Plus", year: 2021, priceINR: 680000, kms: 27000, fuel: "Petrol", transmission: "Manual", bodyType: "Sedan", engineCapacity: 1199, mileageKmpl: 20.3 },
    { make: "Skoda", model: "Octavia", variant: "L&K", year: 2021, priceINR: 2450000, kms: 21000, fuel: "Petrol", transmission: "Automatic", bodyType: "Sedan", engineCapacity: 1984, mileageKmpl: 15.8 },

    // SUVs & COMPACT SUVs
    { make: "Mahindra", model: "XUV700", variant: "AX7 L Diesel AT AWD", year: 2022, priceINR: 2550000, kms: 18000, fuel: "Diesel", transmission: "Automatic", bodyType: "SUV", engineCapacity: 2198, mileageKmpl: 16.5 },
    { make: "Tata", model: "Nexon", variant: "XZ Plus (S)", year: 2021, priceINR: 1050000, kms: 31000, fuel: "Petrol", transmission: "Manual", bodyType: "Compact SUV", engineCapacity: 1199, mileageKmpl: 17.5 },
    { make: "Hyundai", model: "Creta", variant: "SX (O) Diesel AT", year: 2020, priceINR: 1580000, kms: 45000, fuel: "Diesel", transmission: "Automatic", bodyType: "SUV", engineCapacity: 1493, mileageKmpl: 18.5 },
    { make: "Kia", model: "Seltos", variant: "GTX Plus", year: 2021, priceINR: 1620000, kms: 29000, fuel: "Petrol", transmission: "DCT", bodyType: "SUV", engineCapacity: 1353, mileageKmpl: 16.5 },
    { make: "Maruti Suzuki", model: "Brezza", variant: "ZXI Plus", year: 2022, priceINR: 1150000, kms: 14000, fuel: "Petrol", transmission: "Automatic", bodyType: "Compact SUV", engineCapacity: 1462, mileageKmpl: 19.8 },
    { make: "Tata", model: "Harrier", variant: "XZA Plus Dark Edition", year: 2021, priceINR: 1950000, kms: 26000, fuel: "Diesel", transmission: "Automatic", bodyType: "SUV", engineCapacity: 1956, mileageKmpl: 14.6 },
    { make: "Mahindra", model: "Thar", variant: "LX Hard Top Diesel AT", year: 2021, priceINR: 1680000, kms: 22000, fuel: "Diesel", transmission: "Automatic", bodyType: "SUV", engineCapacity: 2184, mileageKmpl: 13.0 },
    { make: "Toyota", model: "Fortuner", variant: "Legender 4x4", year: 2022, priceINR: 4500000, kms: 18000, fuel: "Diesel", transmission: "Automatic", bodyType: "SUV", engineCapacity: 2755, mileageKmpl: 12.0 },
    { make: "MG", model: "Hector", variant: "Sharp CVT", year: 2021, priceINR: 1750000, kms: 24000, fuel: "Petrol", transmission: "Automatic", bodyType: "SUV", engineCapacity: 1451, mileageKmpl: 13.9 },
    { make: "Jeep", model: "Compass", variant: "Model S 4x4", year: 2020, priceINR: 2300000, kms: 36000, fuel: "Diesel", transmission: "Automatic", bodyType: "SUV", engineCapacity: 1956, mileageKmpl: 14.9 },

    // MICRO SUVs & CROSSOVERS
    { make: "Tata", model: "Punch", variant: "Creative", year: 2022, priceINR: 850000, kms: 12000, fuel: "Petrol", transmission: "AMT", bodyType: "Micro SUV", engineCapacity: 1199, mileageKmpl: 18.9 },
    { make: "Nissan", model: "Magnite", variant: "XV Premium Turbo", year: 2021, priceINR: 920000, kms: 27000, fuel: "Petrol", transmission: "CVT", bodyType: "Compact SUV", engineCapacity: 999, mileageKmpl: 17.7 },
    { make: "Renault", model: "Kiger", variant: "RXZ Turbo", year: 2021, priceINR: 910000, kms: 25000, fuel: "Petrol", transmission: "CVT", bodyType: "Compact SUV", engineCapacity: 999, mileageKmpl: 18.2 },
    { make: "Maruti Suzuki", model: "Fronx", variant: "Alpha Turbo", year: 2023, priceINR: 1120000, kms: 4000, fuel: "Petrol", transmission: "Automatic", bodyType: "Compact SUV", engineCapacity: 998, mileageKmpl: 20.0 },
    { make: "Hyundai", model: "Venue", variant: "SX (O) DCT", year: 2021, priceINR: 1180000, kms: 30000, fuel: "Petrol", transmission: "DCT", bodyType: "Compact SUV", engineCapacity: 998, mileageKmpl: 17.8 },

    // MPVs
    { make: "Toyota", model: "Innova Crysta", variant: "2.4 ZX", year: 2019, priceINR: 2100000, kms: 65000, fuel: "Diesel", transmission: "Automatic", bodyType: "MPV", engineCapacity: 2393, mileageKmpl: 13.0 },
    { make: "Toyota", model: "Innova Hycross", variant: "ZX (O) Hybrid", year: 2023, priceINR: 3200000, kms: 8000, fuel: "Hybrid", transmission: "e-CVT", bodyType: "MPV", engineCapacity: 1987, mileageKmpl: 23.2 },
    { make: "Maruti Suzuki", model: "Ertiga", variant: "ZXI Plus", year: 2021, priceINR: 1050000, kms: 38000, fuel: "Petrol", transmission: "Automatic", bodyType: "MPV", engineCapacity: 1462, mileageKmpl: 19.0 },
    { make: "Kia", model: "Carens", variant: "Luxury Plus", year: 2022, priceINR: 1680000, kms: 15000, fuel: "Diesel", transmission: "Automatic", bodyType: "MPV", engineCapacity: 1493, mileageKmpl: 18.4 },
    { make: "Maruti Suzuki", model: "XL6", variant: "Alpha Plus", year: 2022, priceINR: 1320000, kms: 19000, fuel: "Petrol", transmission: "Automatic", bodyType: "MPV", engineCapacity: 1462, mileageKmpl: 19.0 },

    // LUXURY / PREMIUM
    { make: "BMW", model: "3 Series", variant: "330i M Sport", year: 2019, priceINR: 3800000, kms: 42000, fuel: "Petrol", transmission: "Automatic", bodyType: "Sedan", engineCapacity: 1998, mileageKmpl: 16.1 },
    { make: "Mercedes-Benz", model: "C-Class", variant: "C220d", year: 2018, priceINR: 3500000, kms: 50000, fuel: "Diesel", transmission: "Automatic", bodyType: "Sedan", engineCapacity: 1950, mileageKmpl: 17.0 },
    { make: "Audi", model: "A4", variant: "Premium Plus", year: 2021, priceINR: 3900000, kms: 22000, fuel: "Petrol", transmission: "Automatic", bodyType: "Sedan", engineCapacity: 1984, mileageKmpl: 17.4 },
    { make: "Volvo", model: "XC40", variant: "T4 R-Design", year: 2020, priceINR: 3400000, kms: 28000, fuel: "Petrol", transmission: "Automatic", bodyType: "SUV", engineCapacity: 1969, mileageKmpl: 14.5 },
    { make: "Toyota", model: "Fortuner", variant: "4x4 MT", year: 2018, priceINR: 2800000, kms: 75000, fuel: "Diesel", transmission: "Manual", bodyType: "SUV", engineCapacity: 2755, mileageKmpl: 12.0 },

    // OTHERS to hit 50
    { make: "Mahindra", model: "Scorpio N", variant: "Z8 L 4x4", year: 2022, priceINR: 2300000, kms: 16000, fuel: "Diesel", transmission: "Automatic", bodyType: "SUV", engineCapacity: 2184, mileageKmpl: 14.0 },
    { make: "Mahindra", model: "Bolero", variant: "B6 Opt", year: 2021, priceINR: 950000, kms: 45000, fuel: "Diesel", transmission: "Manual", bodyType: "SUV", engineCapacity: 1493, mileageKmpl: 16.0 },
    { make: "Skoda", model: "Kushaq", variant: "Monte Carlo 1.5", year: 2022, priceINR: 1780000, kms: 14000, fuel: "Petrol", transmission: "DSG", bodyType: "SUV", engineCapacity: 1498, mileageKmpl: 17.8 },
    { make: "Volkswagen", model: "Taigun", variant: "GT Plus", year: 2021, priceINR: 1690000, kms: 21000, fuel: "Petrol", transmission: "DSG", bodyType: "SUV", engineCapacity: 1498, mileageKmpl: 17.8 },
    { make: "Honda", model: "City", variant: "Hybrid ZX", year: 2022, priceINR: 1900000, kms: 15000, fuel: "Hybrid", transmission: "e-CVT", bodyType: "Sedan", engineCapacity: 1498, mileageKmpl: 27.1 },
];

async function seedCars() {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('Connected to MySQL database.');

        // Clear existing data to avoid PK conflicts and refresh images
        await connection.execute('DELETE FROM cars');
        console.log('Cleared existing cars from database.');

        const allGeneratedCars = [];

        // Pool of verified working Unsplash Car IDs
        // Map specific models to real Unsplash IDs (or closest lookalikes)
        const carImageMap = {
            // Hatchbacks
            "Swift": "/cars/swift.png",
            "Baleno": "/cars/swift.png",
            "i20": "/cars/swift.png",
            "Altroz": "/cars/swift.png",
            "Polo": "/cars/swift.png",
            "Wagon R": "/cars/kwid.png",
            "Kwid": "/cars/kwid.png",
            "Tiago": "/cars/swift.png",
            "Grand i10 Nios": "/cars/swift.png",
            "Glanza": "/cars/swift.png",
            "Alto K10": "/cars/kwid.png",
            "Alto 800": "/cars/kwid.png",
            "Celerio": "/cars/kwid.png",
            "S-Presso": "/cars/kwid.png",

            // Sedans
            "City": "/cars/city.png",
            "Verna": "/cars/verna.jpg",
            "Ciaz": "/cars/city.png",
            "Slavia": "/cars/city.png",
            "Virtus": "/cars/city.png",
            "Dzire": "/cars/city.png",
            "Aura": "/cars/city.png",
            "Amaze": "/cars/city.png",
            "Tigor": "/cars/city.png",
            "Octavia": "/cars/luxury.jpg",

            // SUVs
            "XUV700": "/cars/fortuner.jpg",
            "Nexon": "/cars/nexon.jpg",
            "Creta": "/cars/fronx.png",
            "Seltos": "/cars/fronx.png",
            "Brezza": "/cars/fronx.png",
            "Harrier": "/cars/harrier.jpg",
            "Thar": "/cars/thar.png",
            "Fortuner": "/cars/fortuner.jpg",
            "Hector": "/cars/fortuner.jpg",
            "Compass": "/cars/fronx.png",
            "Safari": "/cars/harrier.jpg",
            "Venue": "/cars/fronx.png",
            "Sonet": "/cars/fronx.png",
            "Punch": "/cars/fronx.png",
            "Exter": "/cars/fronx.png",
            "Alcazar": "/cars/harrier.jpg",
            "Astor": "/cars/fronx.png",
            "Kiger": "/cars/fronx.png",
            "Magnite": "/cars/fronx.png",

            // Premium
            "3 Series": "/cars/luxury.jpg",
            "C-Class": "/cars/luxury.jpg",
            "A4": "/cars/luxury.jpg",
            "XC40": "/cars/luxury_suv.jpg",

            // MPVs (Local Images)
            "Innova Crysta": "/cars/innova.png",
            "Innova Hycross": "/cars/innova.png",
            "Ertiga": "/cars/innova.png",
            "Carens": "/cars/innova.png",
            "XL6": "/cars/innova.png",

            // Others
            "Scorpio N": "/cars/thar.png",
            "Bolero": "/cars/thar.png",
            "Kushaq": "/cars/fronx.png",
            "Taigun": "/cars/fronx.png",
            "Fronx": "/cars/fronx.png",
            "XUV300": "/cars/fronx.png"
        };

        const defaultImages = [
            "photo-1494976388531-d1058494cdd8",
            "photo-1503376763036-066120622c74",
            "photo-1542362567-b05486f03e23"
        ];

        for (let i = 0; i < realCars.length; i++) {
            const car = realCars[i];
            const city = cities[i % cities.length];
            const carId = 2000 + i;

            // Build features
            const features = ["Airbags", "ABS", "Power Steering", "Power Windows"];
            if (car.priceINR > 1000000) features.push("Sunroof", "Alloy Wheels", "Touchscreen");
            if (car.priceINR > 2000000) features.push("Leather Seats", "360 Camera", "ADAS");

            // Pick a model-specific ID from our map, or fallback to a random default
            const baseId = carImageMap[car.model] || defaultImages[i % defaultImages.length];
            const isLocal = baseId.startsWith('/');
            const baseImg = isLocal ? baseId : `https://images.unsplash.com/${baseId}`;

            const carImages = [
                { id: `${carId}-f`, type: "exterior-front", src: isLocal ? baseImg : `${baseImg}?auto=format&fit=crop&q=80&w=800` },
                { id: `${carId}-b`, type: "exterior-back", src: isLocal ? baseImg : `${baseImg}?auto=format&fit=crop&q=80&w=800&blur=10` },
                { id: `${carId}-i`, type: "interior", src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800" },
                { id: `${carId}-s`, type: "exterior-side", src: isLocal ? baseImg : `${baseImg}?auto=format&fit=crop&q=80&w=800&flip=h` }
            ];

            const carData = {
                id: carId,
                make: car.make,
                model: car.model,
                variant: car.variant,
                year: car.year,
                kms: car.kms,
                fuel: car.fuel,
                transmission: car.transmission,
                priceINR: car.priceINR,
                city: city,
                bodyType: car.bodyType,
                certified: i % 3 === 0,
                owner: (i % 4) + 1,
                status: 'approved',
                sellerType: i % 2 === 0 ? 'Individual' : 'Dealer',
                engineCapacity: car.engineCapacity,
                mileageKmpl: car.mileageKmpl,
                description: `Well maintained ${car.year} ${car.make} ${car.model} ${car.variant} for sale in ${city}.`,
                valuation: JSON.stringify({
                    fairPrice: Math.round(car.priceINR * 0.95),
                    goodPrice: Math.round(car.priceINR * 1.05)
                }),
                features: JSON.stringify(features),
                auction: JSON.stringify(i % 5 === 0 ? {
                    isAuction: true,
                    startingBid: Math.round(car.priceINR * 0.8),
                    currentBid: Math.round(car.priceINR * 0.85),
                    highestBidder: 'user@vroomvalue.in',
                    endTime: new Date(Date.now() + (2 * 24 * 60 * 60 * 1000)).toISOString(), // 2 days from now
                    bids: [
                        { userId: 'user@vroomvalue.in', amount: Math.round(car.priceINR * 0.85), timestamp: new Date().toISOString() }
                    ]
                } : { isAuction: false }),
                images: JSON.stringify(carImages)
            };

            const keys = Object.keys(carData);
            const placeholders = keys.map(() => '?').join(', ');
            const sql = `INSERT INTO cars (${keys.join(', ')}) VALUES (${placeholders})`;
            const values = keys.map(k => carData[k]);

            await connection.execute(sql, values);
            allGeneratedCars.push({
                ...carData,
                valuation: JSON.parse(carData.valuation),
                features: JSON.parse(carData.features),
                auction: JSON.parse(carData.auction),
                images: JSON.parse(carData.images)
            });
            process.stdout.write('.');
        }

        // Sync with cars.json so setup_mysql.js is consistent
        const dataPath = path.join(__dirname, 'data', 'cars.json');
        fs.writeFileSync(dataPath, JSON.stringify(allGeneratedCars, null, 2));
        console.log(`\n✅ Synced ${allGeneratedCars.length} cars to ${dataPath}`);

        console.log('\nSuccessfully inserted 50 real Indian cars.');

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        if (connection) connection.end();
    }
}

seedCars();
