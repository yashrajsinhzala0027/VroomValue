const db = require('./db/db');
const path = require('path');

const CITIES = [
    'New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune',
    'Gurgaon', 'Noida', 'Chandigarh', 'Jaipur', 'Lucknow', 'Indore', 'Bhopal', 'Kochi', 'Surat', 'Nagpur'
];
const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda', 'Kia', 'MG', 'Volkswagen', 'Skoda', 'BMW', 'Mercedes-Benz', 'Audi'];
const COLORS = ['Polar White', 'Midnight Black', 'Silver Frost', 'Deep Blue', 'Magma Red', 'Forest Green', 'Nexa Blue', 'Daytona Grey', 'Bronze Gold', 'Imperial Blue'];
const FUELS = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'AMT', 'DCT', 'CVT'];

const MODEL_PROFILES = {
    "Swift": { brand: "Maruti Suzuki", basePrice: 650000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1197, mileage: 22.3, assets: "swift", body: "Hatchback" },
    "Dzire": { brand: "Maruti Suzuki", basePrice: 720000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1197, mileage: 23.2, assets: "dzire", body: "Sedan" },
    "Baleno": { brand: "Maruti Suzuki", basePrice: 750000, variants: ["Sigma", "Delta", "Zeta", "Alpha"], engine: 1197, mileage: 22.9, assets: "swift", body: "Hatchback" },
    "Ertiga": { brand: "Maruti Suzuki", basePrice: 950000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1462, mileage: 20.5, assets: "fortuner", body: "MUV" },
    "Brezza": { brand: "Maruti Suzuki", basePrice: 850000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1462, mileage: 19.8, assets: "brezza", body: "SUV" },
    "Creta": { brand: "Hyundai", basePrice: 1350000, variants: ["E", "EX", "S", "SX", "SX(O)"], engine: 1497, mileage: 16.8, assets: "creta", body: "SUV" },
    "Verna": { brand: "Hyundai", basePrice: 1250000, variants: ["EX", "S", "SX", "SX(O)"], engine: 1497, mileage: 18.2, assets: "city", body: "Sedan" },
    "i20": { brand: "Hyundai", basePrice: 850000, variants: ["Magna", "Sportz", "Asta", "Asta(O)"], engine: 1197, mileage: 20.3, assets: "swift", body: "Hatchback" },
    "Venue": { brand: "Hyundai", basePrice: 950000, variants: ["E", "S", "SX", "SX(O)"], engine: 1197, mileage: 17.5, assets: "creta", body: "Compact SUV" },
    "Nexon": { brand: "Tata", basePrice: 900000, variants: ["XE", "XM", "XZ", "XZ+", "Fearless"], engine: 1199, mileage: 17.3, assets: "nexon", body: "Compact SUV" },
    "Harrier": { brand: "Tata", basePrice: 1850000, variants: ["XE", "XM", "XT", "XZ", "XZ+"], engine: 1956, mileage: 14.6, assets: "nexon", body: "SUV" },
    "Safari": { brand: "Tata", basePrice: 1950000, variants: ["XE", "XM", "XT", "XZ", "XZ+"], engine: 1956, mileage: 14.1, assets: "nexon", body: "SUV" },
    "Punch": { brand: "Tata", basePrice: 700000, variants: ["Pure", "Adventure", "Accomplished", "Creative"], engine: 1199, mileage: 18.9, assets: "nexon", body: "Compact SUV" },
    "Thar": { brand: "Mahindra", basePrice: 1350000, variants: ["AX", "AX Opt", "LX"], engine: 2184, mileage: 15.2, assets: "thar", body: "SUV" },
    "XUV700": { brand: "Mahindra", basePrice: 1650000, variants: ["MX", "AX3", "AX5", "AX7", "AX7L"], engine: 2198, mileage: 13.5, assets: "thar", body: "SUV" },
    "Scorpio-N": { brand: "Mahindra", basePrice: 1500000, variants: ["Z2", "Z4", "Z6", "Z8", "Z8L"], engine: 2198, mileage: 14.2, assets: "thar", body: "SUV" },
    "Bolero": { brand: "Mahindra", basePrice: 950000, variants: ["B4", "B6", "B6 Opt"], engine: 1493, mileage: 16.0, assets: "thar", body: "SUV" },
    "City": { brand: "Honda", basePrice: 1300000, variants: ["V", "VX", "ZX"], engine: 1498, mileage: 17.8, assets: "city", body: "Sedan" },
    "Amaze": { brand: "Honda", basePrice: 750000, variants: ["E", "S", "VX"], engine: 1199, mileage: 18.6, assets: "city", body: "Sedan" },
    "Seltos": { brand: "Kia", basePrice: 1300000, variants: ["HTE", "HTK", "HTX", "GTX+", "X-Line"], engine: 1497, mileage: 16.5, assets: "creta", body: "SUV" },
    "Sonet": { brand: "Kia", basePrice: 1000000, variants: ["HTE", "HTK", "HTX", "GTX+"], engine: 1197, mileage: 18.4, assets: "creta", body: "Compact SUV" },
    "Fortuner": { brand: "Toyota", basePrice: 3500000, variants: ["4x2", "4x4", "Legender", "GR-S"], engine: 2755, mileage: 10.0, assets: "fortuner", body: "SUV" },
    "Innova Crysta": { brand: "Toyota", basePrice: 2400000, variants: ["GX", "VX", "ZX"], engine: 2393, mileage: 12.0, assets: "fortuner", body: "MUV" },
    "A4": { brand: "Audi", basePrice: 4500000, variants: ["Premium", "Premium Plus", "Technology"], engine: 1984, mileage: 17.4, assets: "city", body: "Luxury" },
    "3 Series": { brand: "BMW", basePrice: 4800000, variants: ["330i M Sport", "320d Luxury Line"], engine: 1998, mileage: 16.1, assets: "city", body: "Luxury" },
    "C-Class": { brand: "Mercedes-Benz", basePrice: 5500000, variants: ["C 200", "C 220d", "C 300d"], engine: 1993, mileage: 16.9, assets: "city", body: "Luxury" }
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getImages = (id, type) => {
    const images = [];
    const kwMap = { 'swift': 'hatchback', 'creta': 'suv', 'nexon': 'suv', 'thar': 'jeep', 'city': 'sedan', 'fortuner': 'big-suv', 'brezza': 'suv' };
    const kw = kwMap[type] || 'car';
    const numImages = randInt(6, 8); // Updated to 6-8 images per car
    for (let i = 0; i < numImages; i++) {
        images.push({
            id: `${id}-${i}`,
            src: `https://images.unsplash.com/photo-${randInt(1500000000000, 1700000000000)}?auto=format&fit=crop&q=80&w=800&q=${kw}`,
            isMain: i === 0
        });
    }
    return JSON.stringify(images);
};

const formatSQLDate = (date) => date.toISOString().slice(0, 19).replace('T', ' ');

const seed = async () => {
    console.log('🚀 Starting Market-Dominant Production Scaling...');

    try {
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        console.log('🛠 Enforcing Schema Integrity...');

        // Ensure ALL tables use BIGINT and AUTO_INCREMENT for ID
        const tablesToFix = ['cars', 'test_drives', 'sell_requests'];
        for (const table of tablesToFix) {
            try {
                await db.execute(`ALTER TABLE ${table} MODIFY COLUMN id BIGINT(20) NOT NULL AUTO_INCREMENT`);
            } catch (e) {
                console.log(`   Table ${table} modification skipped or already correct.`);
            }
        }

        await db.execute('TRUNCATE test_drives');
        await db.execute('TRUNCATE sell_requests');
        await db.execute('DELETE FROM cars');
        await db.execute('ALTER TABLE cars AUTO_INCREMENT = 1');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✅ Tables cleaned.');

        // 1. Core Users
        const sampleUsers = [
            [1, 'admin@vroomvalue.in', 'admin123', 'Admin', '1990-01-01', '9999999999', 'admin'],
            [2, 'yash@gmail.com', 'yash123', 'Yashraj Zala', '2002-01-27', '9876543210', 'user'],
            [3, 'demo@vroomvalue.in', 'demo123', 'Demo User', '1995-10-10', '9000000000', 'user'],
            [4, 'buyer@elite.com', 'buyer123', 'Elite Buyer', '1998-05-15', '9898989898', 'user']
        ];
        for (const u of sampleUsers) {
            await db.execute('INSERT IGNORE INTO users (id, email, password, name, dob, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)', u);
        }

        // 2. 350+ Cars (Scaled Up)
        const modelNames = Object.keys(MODEL_PROFILES);
        const carRecords = [];

        console.log('🏭 Generating 350+ Premium Listings...');

        for (let i = 0; i < 355; i++) {
            const mName = getRandom(modelNames);
            const profile = MODEL_PROFILES[mName];
            const age = randInt(0, 8);
            const year = 2024 - age;
            const kms = randInt(5000, 120000);
            const depFactor = Math.pow(0.88, age) * (1 - (kms / 400000));
            const price = Math.round(profile.basePrice * depFactor / 1000) * 1000;

            const auctionChance = Math.random() < 0.15; // Increased auction inventory
            let auction = null;
            if (auctionChance) {
                const end = new Date();
                end.setDate(end.getDate() + randInt(1, 4));
                auction = {
                    isAuction: true,
                    startingBid: Math.round(price * 0.75 / 10000) * 10000,
                    currentBid: Math.round(price * 0.78 / 10000) * 10000,
                    endTime: end.toISOString(),
                    bidCount: randInt(4, 15), // Higher engagement
                    bids: []
                };
            }

            // Expanded Feature Set
            const features = ["Bluetooth", "Airbags", "ABS", "Cruise Control", "Sunroof", "Leather Seats", "Apple CarPlay", "Rear Camera", "Auto Climate", "Alloy Wheels"];
            const carFeatures = features.sort(() => 0.5 - Math.random()).slice(0, randInt(4, 9));

            carRecords.push([
                profile.brand, mName, getRandom(profile.variants), year, kms, getRandom(FUELS),
                getRandom(TRANSMISSIONS), price, getRandom(CITIES), profile.body,
                Math.random() < 0.85 ? 1 : 0, randInt(1, 2).toString(), 'VroomValue Certified',
                JSON.stringify(carFeatures), profile.engine, profile.mileage,
                `Pristine condition ${mName} (${year}) in ${getRandom(COLORS)}. Single owner, full service history at authorized center. 140-point quality check passed.`,
                JSON.stringify({ fairPrice: Math.round(price * 0.96), goodPrice: Math.round(price * 1.04), greatPrice: Math.round(price * 1.08) }),
                getImages(3000 + i, profile.assets), randInt(5, 7), getRandom(COLORS),
                getRandom(CITIES).toUpperCase().slice(0, 2) + '-' + randInt(10, 99),
                '2026-06-30', 0, 'Full Dealer Service History', auction ? JSON.stringify(auction) : null
            ]);
        }

        const sql = `INSERT INTO cars (
            make, model, variant, year, kms, fuel, transmission, priceINR, city, bodyType, 
            certified, owner, sellerType, features, engineCapacity, mileageKmpl, description, 
            valuation, images, seats, color, rto, insuranceValidity, accidental, serviceHistory, auction
        ) VALUES (${Array(26).fill('?').join(', ')})`;

        for (const carParams of carRecords) {
            await db.execute(sql, carParams);
        }

        console.log(`✅ ${carRecords.length} listings injected for market dominance.`);

        // 3. Test Drives & Social Proof
        const [insertedCars] = await db.execute('SELECT id, model, make FROM cars LIMIT 40');
        const [dbUsers] = await db.execute('SELECT name, phone FROM users WHERE role = "user" LIMIT 4');

        for (let i = 0; i < 25; i++) {
            const car = getRandom(insertedCars);
            const user = getRandom(dbUsers);
            const date = new Date();
            date.setDate(date.getDate() + randInt(1, 7));

            await db.execute(
                'INSERT INTO test_drives (carTitle, date, time, phone, name, status) VALUES (?, ?, ?, ?, ?, ?)',
                [`${car.make} ${car.model}`, formatSQLDate(date).split(' ')[0], '02:00 PM', user.phone, user.name, 'pending']
            );
        }

        console.log('✅ High-intent test drive requests seeded.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Scaling failed:', err);
        process.exit(1);
    }
};

seed();
