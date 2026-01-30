
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Fix .env path resolution (Handles running from root or server dir)
const envPath = fs.existsSync(path.join(__dirname, '.env'))
    ? path.join(__dirname, '.env')
    : path.join(__dirname, 'server', '.env'); // Fallback if running from root but .env is in server/

require('dotenv').config({ path: envPath });

const app = express();
const PORT = 5005;

const db = require('./db/db');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFileSync(path.join(__dirname, 'server_log.txt'), log);
    console.log(log.trim());
    next();
});

// JSON helpers removed in favor of DB queries

// MASTER MODEL PROFILES - Ported from Frontend
const MODEL_PROFILES = {
    "Swift": { basePrice: 750000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1197, mileage: 22.3, assets: "swift" },
    "Dzire": { basePrice: 820000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1197, mileage: 23.2, assets: "dzire" },
    "Baleno": { basePrice: 850000, variants: ["Sigma", "Delta", "Zeta", "Alpha"], engine: 1197, mileage: 22.9, assets: "swift" },
    "Creta": { basePrice: 1650000, variants: ["E", "EX", "S", "SX", "SX(O)"], engine: 1497, mileage: 16.8, assets: "creta" },
    "Seltos": { basePrice: 1600000, variants: ["HTE", "HTK", "HTX", "GTX", "X-Line"], engine: 1497, mileage: 17.0, assets: "creta" },
    "Venue": { basePrice: 1150000, variants: ["E", "S", "S+", "SX", "SX(O)"], engine: 1197, mileage: 17.5, assets: "creta" },
    "Nexon": { basePrice: 1100000, variants: ["XE", "XM", "XZ", "XZ+", "Fearless"], engine: 1199, mileage: 17.3, assets: "nexon" },
    "Harrier": { basePrice: 2200000, variants: ["XE", "XM", "XT", "XZ", "XZ+"], engine: 1956, mileage: 14.6, assets: "nexon" },
    "Thar": { basePrice: 1550000, variants: ["AX", "AX Opt", "LX"], engine: 2184, mileage: 15.2, assets: "thar" },
    "XUV700": { basePrice: 2400000, variants: ["MX", "AX3", "AX5", "AX7", "AX7L"], engine: 2198, mileage: 13.5, assets: "thar" },
    "City": { basePrice: 1500000, variants: ["V", "VX", "ZX"], engine: 1498, mileage: 17.8, assets: "city" },
    "Verna": { basePrice: 1450000, variants: ["EX", "S", "SX", "SX(O)"], engine: 1497, mileage: 18.2, assets: "city" },
    "Fortuner": { basePrice: 4200000, variants: ["Standard", "GR-S", "Legender"], engine: 2755, mileage: 10.4, assets: "fortuner" },
    "Innova": { basePrice: 2800000, variants: ["G", "GX", "VX", "ZX"], engine: 2393, mileage: 12.5, assets: "fortuner" },
    "TUV300": { basePrice: 1050000, variants: ["T4", "T6", "T8", "T10"], engine: 1493, mileage: 18.4, assets: "tuv300" },
    "Kwid": { basePrice: 550000, variants: ["RXE", "RXL", "RXT", "Climber"], engine: 999, mileage: 22.0, assets: "swift" },
    "Polo": { basePrice: 950000, variants: ["Trendline", "Comfortline", "Highline"], engine: 999, mileage: 18.2, assets: "swift" },
    "Vento": { basePrice: 1200000, variants: ["Trendline", "Comfortline", "Highline"], engine: 1498, mileage: 16.5, assets: "city" },
    "Octavia": { basePrice: 2800000, variants: ["Ambition", "Style", "L&K"], engine: 1984, mileage: 16.0, assets: "city" },
    "Kushaq": { basePrice: 1500000, variants: ["Active", "Ambition", "Style"], engine: 1498, mileage: 16.5, assets: "creta" },
    "Hector": { basePrice: 1900000, variants: ["Style", "Super", "Sharp", "Savvy"], engine: 1451, mileage: 13.9, assets: "creta" },
    "Astor": { basePrice: 1200000, variants: ["Style", "Super", "Sharp"], engine: 1349, mileage: 14.6, assets: "creta" },
    "Magnite": { basePrice: 800000, variants: ["XE", "XL", "XV"], engine: 999, mileage: 18.8, assets: "creta" },
    "Kicks": { basePrice: 1100000, variants: ["XE", "XL", "XV"], engine: 1498, mileage: 16.0, assets: "creta" },
    "EcoSport": { basePrice: 1100000, variants: ["Ambiente", "Trend", "Titanium"], engine: 1497, mileage: 15.9, assets: "creta" },
    "Endeavour": { basePrice: 3500000, variants: ["Trend", "Titanium", "Titanium+"], engine: 1996, mileage: 12.4, assets: "fortuner" },
    "Compass": { basePrice: 2200000, variants: ["Sport", "Longitude", "Limited"], engine: 1956, mileage: 14.0, assets: "creta" },
    "Meridian": { basePrice: 3200000, variants: ["Longitude", "Limited", "Model S"], engine: 1956, mileage: 13.3, assets: "fortuner" }
};

const getBasePrice = (make, model) => {
    if (model && MODEL_PROFILES[model]) return MODEL_PROFILES[model].basePrice;
    const BRAND_ESTIMATES = {
        'Maruti Suzuki': 750000, 'Hyundai': 1100000, 'Tata': 1200000, 'Mahindra': 1800000,
        'Toyota': 3200000, 'Honda': 1400000, 'Kia': 1600000, 'Volkswagen': 1300000,
        'Skoda': 1400000, 'MG': 1900000, 'Nissan': 1000000, 'Renault': 850000,
        'Ford': 1500000, 'Jeep': 2800000
    };
    return BRAND_ESTIMATES[make] || 1000000;
};

const calculateRealMarketPrice = (car) => {
    const basePrice = getBasePrice(car.make, car.model);
    const age = Math.max(0, 2025 - Number(car.year));
    let ageFactor = Math.pow(0.88, age);

    // Safe Numeric Parser
    const parseNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        const cleaned = val.toString().replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    };

    // Usage depreciation
    const usageFactor = 1 - (Math.min(parseNum(car.kms), 250000) / 250000) * 0.3;

    // Owner depreciation
    const ownerNum = typeof car.owner === 'string' ? (parseInt(car.owner) || 1) : (Number(car.owner) || 1);
    const ownerFactor = 1 - (Math.max(0, ownerNum - 1) * 0.05);

    // Fuel Type Impact
    const fuelFactors = { 'Petrol': 1.0, 'Diesel': 1.05, 'CNG': 0.95, 'Electric': 0.9 };
    let fuelFactor = fuelFactors[car.fuel] || 1.0;

    // NCR Rule: Diesel cars older than 10 years and Petrol older than 15 years in NCR cities have heavy depreciation
    // NCR Cities: New Delhi, Gurgaon, Noida, Faridabad, Ghaziabad (simulated here)
    const ncrCities = ['New Delhi', 'Gurgaon', 'Noida'];
    if (ncrCities.includes(car.city)) {
        if (car.fuel === 'Diesel' && age >= 8) fuelFactor *= 0.6; // Approaching 10 year ban
        if (car.fuel === 'Petrol' && age >= 12) fuelFactor *= 0.7; // Approaching 15 year ban
    }

    // Transmission Impact
    const transFactors = { 'Automatic': 1.1, 'DCT': 1.15, 'CVT': 1.12, 'Manual': 1.0, 'IMT': 1.05 };
    const transFactor = transFactors[car.transmission] || 1.0;

    // Feature Impact (Safety features premium)
    let featureFactor = 1.0;
    if (car.features && Array.isArray(car.features)) {
        if (car.features.includes('Airbags')) featureFactor += 0.02;
        if (car.features.includes('ABS')) featureFactor += 0.01;
        if (car.features.includes('Sunroof')) featureFactor += 0.03;
    }

    const marketAvg = basePrice * ageFactor * usageFactor * ownerFactor * fuelFactor * transFactor * featureFactor;

    return {
        fairPrice: Math.round(marketAvg * 0.92),
        goodPrice: Math.round(marketAvg * 1.08)
    };
};

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    try {
        await db.execute('SELECT 1');
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
});

// AUTH Endpoints
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, name, dob, phone } = req.body;
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: "User already exists" });

        const newUser = {
            id: Date.now(),
            email,
            password,
            name,
            dob,
            phone,
            role: email.includes('admin') ? 'admin' : 'user'
        };

        await db.execute(
            'INSERT INTO users (id, email, password, name, dob, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [newUser.id, email, password, name, dob, phone, newUser.role]
        );

        const { password: _, ...userWithoutPass } = newUser;
        res.status(201).json(userWithoutPass);
    } catch (err) {
        const errorDetails = JSON.stringify(err, Object.getOwnPropertyNames(err));
        fs.appendFileSync(path.join(__dirname, 'signup_debug.log'), `${new Date().toISOString()} - 💥 Signup Error: ${errorDetails}\n`);
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const logMsg = `${new Date().toISOString()} - 🔑 Login attempt: ${email} / ${password}\n`;
        fs.appendFileSync(path.join(__dirname, 'login_debug.log'), logMsg);

        const [users] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        if (users.length === 0) {
            fs.appendFileSync(path.join(__dirname, 'login_debug.log'), `${new Date().toISOString()} - ❌ Failed\n`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        fs.appendFileSync(path.join(__dirname, 'login_debug.log'), `${new Date().toISOString()} - ✅ Success\n`);
        const { password: _, ...userWithoutPass } = users[0];
        res.json(userWithoutPass);
    } catch (err) {
        fs.appendFileSync(path.join(__dirname, 'login_debug.log'), `${new Date().toISOString()} - 💥 Error: ${err.stack || err}\n`);
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
});

// 1. GET All Cars (Advanced Filtering via SQL)
app.get('/api/cars', async (req, res) => {
    console.log(`[GET /api/cars] URL: ${req.url}`);
    try {
        let query = 'SELECT * FROM cars WHERE 1=1';
        let params = [];

        // Helper to get param regardless of key or key[]
        const getParam = (key) => req.query[key] || req.query[`${key}[]`];

        const city = getParam('city');
        const make = getParam('make');
        const maxPrice = getParam('maxPrice');
        const minPrice = getParam('minPrice');
        const fuel = getParam('fuel');
        const transmission = getParam('transmission');
        const bodyType = getParam('bodyType');
        const isAuction = getParam('isAuction');
        const includeExpired = getParam('includeExpired');
        const search = getParam('search');
        const maxKms = getParam('maxKms');
        const year = getParam('year');
        const color = getParam('color');
        const features = getParam('features');
        const seats = getParam('seats');
        const owner = getParam('owner');

        // Helper for multi-value filters
        const addMultiFilter = (column, values, mapper = null) => {
            if (!values) return;
            let vals = Array.isArray(values) ? values : [values];
            if (vals.length === 0) return;
            if (mapper) vals = vals.map(mapper);

            query += ` AND \`${column}\` IN (${vals.map(() => '?').join(',')})`;
            params.push(...vals);
        };

        // Status filter: Public should ONLY see approved cars
        query += ' AND `status` = "approved"';

        if (!includeExpired) {
            query += ' AND (auction IS NULL OR JSON_EXTRACT(auction, "$.endTime") > NOW() OR status = "approved")';
        }

        if (city) {
            query += ' AND LOWER(`city`) LIKE ?';
            params.push(`%${city.toLowerCase()}%`);
        }

        addMultiFilter('make', make);
        addMultiFilter('fuel', fuel);
        addMultiFilter('transmission', transmission);
        addMultiFilter('bodyType', bodyType);
        addMultiFilter('color', color);

        // Map string filters to DB types - Handle "1st owner" -> 1
        addMultiFilter('owner', owner, (o) => {
            if (typeof o === 'number') return o;
            const match = String(o).match(/\d+/);
            return parseInt(match ? match[0] : o);
        });

        // Handle "5 seater" -> 5
        addMultiFilter('seats', seats, (s) => {
            if (typeof s === 'number') return s;
            const match = String(s).match(/\d+/);
            return parseInt(match ? match[0] : s);
        });

        if (minPrice) {
            query += ' AND `priceINR` >= ?';
            params.push(parseInt(minPrice));
        }
        if (maxPrice) {
            query += ' AND `priceINR` <= ?';
            params.push(parseInt(maxPrice));
        }

        // Handle maxKms as array (OR logic - match ANY selected KMS range)
        if (maxKms) {
            const kmsValues = Array.isArray(maxKms) ? maxKms : [maxKms];
            if (kmsValues.length > 0) {
                const kmsConditions = kmsValues.map(() => '`kms` <= ?');
                query += ` AND (${kmsConditions.join(' OR ')})`;
                params.push(...kmsValues.map(k => parseInt(k)));
            }
        }

        // Handle year as array (OR logic - match ANY selected year range)
        if (year) {
            const yearValues = Array.isArray(year) ? year : [year];
            if (yearValues.length > 0) {
                const yearConditions = yearValues.map(() => '`year` >= ?');
                query += ` AND (${yearConditions.join(' OR ')})`;
                params.push(...yearValues.map(y => parseInt(y)));
            }
        }


        if (isAuction === 'true') {
            query += ' AND JSON_EXTRACT(`auction`, "$.isAuction") = true';
        }

        if (features) {
            const featList = Array.isArray(features) ? features : [features];
            if (featList.length > 0) {
                const featConditions = featList.map(() => 'JSON_CONTAINS(`features`, ?)');
                query += ` AND (${featConditions.join(' OR ')})`; // Match ANY, not ALL
                params.push(...featList.map(f => JSON.stringify(f)));
            }
        }

        if (search) {
            query += ' AND (LOWER(`model`) LIKE ? OR LOWER(`make`) LIKE ? OR LOWER(`city`) LIKE ?)';
            params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
        }

        console.log(`[GET /api/cars] Executing SQL: ${query}`);
        console.log(`[GET /api/cars] With Params:`, params);

        const [cars] = await db.execute(query, params);
        console.log(`[GET /api/cars] Found ${cars.length} results.`);

        // Parse JSON fields
        const parsedCars = cars.map(car => ({
            ...car,
            images: typeof car.images === 'string' ? JSON.parse(car.images) : car.images,
            features: typeof car.features === 'string' ? JSON.parse(car.features) : car.features,
            valuation: typeof car.valuation === 'string' ? JSON.parse(car.valuation) : car.valuation,
            auction: typeof car.auction === 'string' ? JSON.parse(car.auction) : car.auction
        }));

        res.json(parsedCars);
    } catch (err) {
        console.error("FILTER ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

// 2. GET Single Car
app.get('/api/cars/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM cars WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Car not found" });

        const car = rows[0];
        // Parse JSON fields
        const parsedCar = {
            ...car,
            images: typeof car.images === 'string' ? JSON.parse(car.images) : car.images,
            features: typeof car.features === 'string' ? JSON.parse(car.features) : car.features,
            valuation: typeof car.valuation === 'string' ? JSON.parse(car.valuation) : car.valuation,
            auction: typeof car.auction === 'string' ? JSON.parse(car.auction) : car.auction
        };

        res.json(parsedCar);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. POST Bidding Logic
app.post('/api/cars/:id/bid', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const [rows] = await db.execute('SELECT * FROM cars WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Car not found" });

        const car = rows[0];
        let auction = typeof car.auction === 'string' ? JSON.parse(car.auction) : car.auction;

        if (!auction || !auction.isAuction) return res.status(400).json({ message: "Not an auction" });
        if (new Date(auction.endTime) < new Date()) return res.status(400).json({ message: "Auction ended" });
        if (amount <= (auction.currentBid || 0)) return res.status(400).json({ message: "Bid too low" });

        auction.currentBid = amount;
        auction.highestBidder = userId;
        auction.bidCount = (auction.bidCount || 0) + 1;
        auction.bids = auction.bids || [];
        auction.bids.unshift({ id: Date.now(), carId: car.id, userId, amount, timestamp: new Date().toISOString() });

        await db.execute('UPDATE cars SET auction = ? WHERE id = ?', [JSON.stringify(auction), car.id]);
        res.json({ ...car, auction });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. GET Sell Requests
app.get('/api/sell-requests', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM sell_requests WHERE status = "pending"');
        const parsed = rows.map(r => ({
            ...r,
            valuation: typeof r.valuation === 'string' ? JSON.parse(r.valuation) : r.valuation,
            images: (typeof r.images === 'string' ? JSON.parse(r.images) : r.images) || []
        }));
        res.json(parsed);
    } catch (err) {
        fs.appendFileSync(path.join(__dirname, 'error.log'), `${new Date().toISOString()} - ${err.stack}\n`);
        res.status(500).json({ message: err.message });
    }
});

// 5. POST Submit Sell Request
app.post('/api/sell-requests', async (req, res) => {
    try {
        const valuation = calculateRealMarketPrice(req.body);
        const newRequest = {
            id: Date.now(),
            make: req.body.make || 'Unknown',
            model: req.body.model || 'Unknown',
            variant: req.body.variant || '',
            year: Number(req.body.year) || new Date().getFullYear(),
            fuel: req.body.fuel || 'Petrol',
            transmission: req.body.transmission || 'Manual',
            kms: Number(req.body.kms) || 0,
            owner: typeof req.body.owner === 'string' ? (parseInt(req.body.owner) || 1) : (req.body.owner || 1),
            city: req.body.city || 'Default',
            engineCapacity: Number(req.body.engineCapacity) || 0,
            mileageKmpl: Number(req.body.mileageKmpl) || 0,
            seats: typeof req.body.seats === 'string' ? (parseInt(req.body.seats) || 5) : (req.body.seats || 5),
            color: req.body.color || 'White',
            rto: req.body.rto || '',
            insuranceValidity: req.body.insuranceValidity || '',
            accidental: req.body.accidental ? 1 : 0,
            serviceHistory: req.body.serviceHistory ? 1 : 0,
            description: req.body.description || '',
            status: 'pending',
            requestDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            valuation: JSON.stringify(valuation),
            images: JSON.stringify(req.body.images || [])
        };

        const keys = Object.keys(newRequest);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO sell_requests (${keys.join(', ')}) VALUES (${placeholders})`;
        const values = keys.map(k => newRequest[k]);

        await db.execute(sql, values);
        res.status(201).json(newRequest);
    } catch (err) {
        fs.appendFileSync(path.join(__dirname, 'error.log'), `${new Date().toISOString()} - SELL_REQ ERROR: ${err.stack}\n`);
        res.status(500).json({ message: err.message });
    }
});

// 5b. POST Fetch Valuation
app.post('/api/valuation', (req, res) => {
    const valuation = calculateRealMarketPrice(req.body);
    res.json({ valuation });
});

// 6. POST Approve/Reject Sell Request
app.post('/api/sell-requests/:id/approve', async (req, res) => {
    console.log(`[APPROVE] Starting approval for request ID: ${req.params.id}`);
    try {
        console.log(`[APPROVE] Fetching request...`);
        const [requests] = await db.execute('SELECT * FROM sell_requests WHERE id = ?', [req.params.id]);
        if (requests.length === 0) {
            console.log(`[APPROVE] Request not found: ${req.params.id}`);
            return res.status(404).json({ message: "Request not found" });
        }

        const request = requests[0];
        const overrides = req.body || {};
        console.log(`[APPROVE] Request data found for ${request.make} ${request.model}`);
        console.log(`[APPROVE] Overrides:`, JSON.stringify(overrides));

        // Update request status
        console.log(`[APPROVE] Updating status to approved...`);
        await db.execute('UPDATE sell_requests SET status = "approved" WHERE id = ?', [req.params.id]);

        // Parse valuation for price fallback
        let valuationData = {};
        try {
            valuationData = typeof request.valuation === 'string' ? JSON.parse(request.valuation) : (request.valuation || {});
        } catch (e) {
            console.log(`[APPROVE] Valuation parse error, using defaults`);
            valuationData = { fairPrice: 0 };
        }
        const fairPrice = valuationData.fairPrice || 0;

        // Move to cars table with filtering
        const newCarData = {
            ...request,
            priceINR: overrides.priceINR ? Number(overrides.priceINR) : (request.priceINR || fairPrice),
            kms: overrides.kms ? Number(overrides.kms) : request.kms,
            id: Date.now(),
            status: 'approved',
            valuation: JSON.stringify(valuationData),
            features: JSON.stringify([]),
            auction: JSON.stringify({ isAuction: false }),
            images: typeof request.images === 'string' ? request.images : JSON.stringify(request.images || []),
            bodyType: request.bodyType || 'SUV',
            certified: 0,
            sellerType: 'Individual'
        };

        const validCols = [
            'id', 'make', 'model', 'variant', 'year', 'kms', 'fuel', 'transmission',
            'priceINR', 'city', 'bodyType', 'certified', 'owner', 'status', 'sellerType',
            'engineCapacity', 'mileageKmpl', 'description', 'valuation', 'features',
            'auction', 'images', 'seats', 'color', 'rto', 'insuranceValidity',
            'accidental', 'serviceHistory'
        ];

        const filteredCar = {};
        validCols.forEach(col => {
            if (newCarData[col] !== undefined) filteredCar[col] = newCarData[col];
        });

        const keys = Object.keys(filteredCar);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO cars (${keys.join(', ')}) VALUES (${placeholders})`;
        const values = keys.map(k => (typeof filteredCar[k] === 'object' && filteredCar[k] !== null) ? JSON.stringify(filteredCar[k]) : filteredCar[k]);

        console.log(`[APPROVE] Executing SQL INSERT...`);

        try {
            await db.execute(sql, values);
            console.log(`[APPROVE] Car inserted successfully!`);
        } catch (insertErr) {
            console.error(`[APPROVE] INSERT FAILED:`, insertErr);
            throw insertErr;
        }

        res.json({ message: "Request approved and car moved to inventory", carId: newCarData.id });
    } catch (err) {
        console.error("APPROVE ERROR:", err);
        try {
            fs.appendFileSync(path.join(__dirname, 'error.log'), `${new Date().toISOString()} - APPROVE ERROR: ${err.message}\n${err.stack}\n`);
        } catch (logErr) {
            console.error("LOGGING ERROR:", logErr);
        }
        res.status(500).json({
            message: err.message,
            stack: err.stack,
            step: "Final catch"
        });
    }
});

app.post('/api/sell-requests/:id/reject', async (req, res) => {
    try {
        await db.execute('UPDATE sell_requests SET status = "rejected" WHERE id = ?', [req.params.id]);
        res.json({ message: "Request rejected" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. Auction Management
app.post('/api/cars/:id/end-auction', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM cars WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Car not found" });

        const car = rows[0];
        let auction = typeof car.auction === 'string' ? JSON.parse(car.auction) : car.auction;
        if (!auction) auction = { isAuction: false };

        auction.isAuction = false;
        auction.ended = true;

        await db.execute('UPDATE cars SET status = "sold", auction = ? WHERE id = ?', [JSON.stringify(auction), car.id]);
        res.json({ ...car, auction });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/cars', async (req, res) => {
    try {
        const carData = {
            id: Date.now(),
            ...req.body,
            status: req.body.status || 'approved',
            images: JSON.stringify(req.body.images || []),
            features: JSON.stringify(req.body.features || []),
            valuation: JSON.stringify(req.body.valuation || {}),
            auction: JSON.stringify(req.body.auction || { isAuction: false })
        };
        const keys = Object.keys(carData);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO cars (${keys.join(', ')}) VALUES (${placeholders})`;
        const values = keys.map(k => carData[k]);
        await db.execute(sql, values);
        res.status(201).json(carData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/cars/:id', async (req, res) => {
    try {
        const updates = req.body;
        const keys = Object.keys(updates);
        if (keys.length === 0) return res.status(400).json({ message: "No fields to update" });

        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => (typeof updates[k] === 'object' && updates[k] !== null) ? JSON.stringify(updates[k]) : updates[k]);
        values.push(req.params.id);

        const sql = `UPDATE cars SET ${setClause} WHERE id = ?`;
        await db.execute(sql, values);
        res.json({ message: "Car updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/cars/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM cars WHERE id = ?', [req.params.id]);
        res.json({ message: "Car deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/cars/:id/start-auction', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM cars WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Car not found" });

        const auction = {
            isAuction: true,
            ...req.body,
            currentBid: req.body.startingBid,
            bidCount: 0,
            bids: []
        };

        await db.execute('UPDATE cars SET auction = ? WHERE id = ?', [JSON.stringify(auction), req.params.id]);
        res.json({ ...rows[0], auction });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Test Drives
app.get('/api/test-drives', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM test_drives');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/test-drives', async (req, res) => {
    try {
        const newDrive = {
            id: Date.now(),
            ...req.body,
            status: 'pending',
            date: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        const keys = Object.keys(newDrive);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO test_drives (${keys.join(', ')}) VALUES (${placeholders})`;
        const values = keys.map(k => newDrive[k]);

        await db.execute(sql, values);
        res.status(201).json(newDrive);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


