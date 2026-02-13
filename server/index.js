
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
const PORT = process.env.PORT || 5005;

const supabase = require('./db/supabaseClient');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'up', timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    try {
        fs.appendFileSync(path.join(__dirname, 'server_log.txt'), log);
    } catch (e) {
        // Silent fail for file logging in read-only environments
    }
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
        const { error } = await supabase.from('cars').select('id').limit(1);
        if (error) throw error;
        console.log('✅ Supabase connected successfully');
    } catch (err) {
        console.error('❌ Supabase connection failed:', err.message);
    }
});

// AUTH Endpoints
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, name, dob, phone } = req.body;

        const { data: existing, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);

        if (checkError) throw checkError;
        if (existing && existing.length > 0) return res.status(400).json({ message: "User already exists" });

        const newUser = {
            id: Date.now(),
            email,
            password,
            name,
            dob,
            phone,
            role: email.includes('admin') ? 'admin' : 'user'
        };

        const { error: insertError } = await supabase
            .from('users')
            .insert([newUser]);

        if (insertError) throw insertError;

        const { password: _, ...userWithoutPass } = newUser;
        res.status(201).json(userWithoutPass);
    } catch (err) {
        const errorDetails = JSON.stringify(err, Object.getOwnPropertyNames(err));
        fs.appendFileSync(path.join(__dirname, 'signup_debug.log'), `${new Date().toISOString()} - 💥 Signup Error: ${errorDetails}\n`);

        // Helpful hint for the user
        const isMissingKey = !process.env.SUPABASE_SERVICE_ROLE_KEY;
        const msg = isMissingKey
            ? "Signup failed: SUPABASE_SERVICE_ROLE_KEY is missing in your server/.env. Please follow the instructions I gave you to add it!"
            : (err.message || "Internal Server Error");

        res.status(500).json({ message: msg });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const logMsg = `${new Date().toISOString()} - 🔑 Login attempt: ${email} / ${password}\n`;
        fs.appendFileSync(path.join(__dirname, 'login_debug.log'), logMsg);

        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password);

        if (error) throw error;

        if (!users || users.length === 0) {
            fs.appendFileSync(path.join(__dirname, 'login_debug.log'), `${new Date().toISOString()} - ❌ Failed\n`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        fs.appendFileSync(path.join(__dirname, 'login_debug.log'), `${new Date().toISOString()} - ✅ Success\n`);
        const { password: _, ...userWithoutPass } = users[0];
        res.json(userWithoutPass);
    } catch (err) {
        fs.appendFileSync(path.join(__dirname, 'login_debug.log'), `${new Date().toISOString()} - 💥 Error: ${err.stack || err}\n`);

        // Helpful hint for the user
        const isMissingKey = !process.env.SUPABASE_SERVICE_ROLE_KEY;
        const msg = isMissingKey
            ? "Login failed: SUPABASE_SERVICE_ROLE_KEY is missing in your server/.env. Please follow the instructions I gave you to add it!"
            : (err.message || "Internal Server Error");

        res.status(500).json({ message: msg });
    }
});

// 1. GET All Cars (Advanced Filtering via SQL)
// Helper to map lowercase DB keys to camelCase for frontend
const camelize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(camelize);

    const mapping = {
        priceinr: 'priceINR',
        bodytype: 'bodyType',
        sellertype: 'sellerType',
        enginecapacity: 'engineCapacity',
        mileagekmpl: 'mileageKmpl',
        insurancevalidity: 'insuranceValidity',
        requestdate: 'requestDate',
        customername: 'customerName',
        customerphone: 'customerPhone',
        customeremail: 'customerEmail',
        requestedat: 'requestedAt',
        carid: 'carId',
        userid: 'userId',
        buyer_details: 'buyerDetails',
        reserve_details: 'reserveDetails',
        buyerdetails: 'buyerDetails', // legacy/fallback
        reservedetails: 'reserveDetails' // legacy/fallback
    };

    const newObj = {};
    for (const key in obj) {
        const mappedKey = mapping[key] || key;
        newObj[mappedKey] = camelize(obj[key]);
    }
    return newObj;
};

// Reverse mapping: camelCase to snake_case for database writes
const decamelize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(decamelize);

    const reverseMapping = {
        'priceINR': 'priceinr',
        'bodyType': 'bodytype',
        'sellerType': 'sellertype',
        'engineCapacity': 'enginecapacity',
        'mileageKmpl': 'mileagekmpl',
        'insuranceValidity': 'insurancevalidity',
        'requestDate': 'requestdate',
        'customerName': 'customername',
        'customerPhone': 'customerphone',
        'customerEmail': 'customeremail',
        'requestedAt': 'requestedat',
        'carId': 'carid',
        'userId': 'userid',
        'carTitle': 'cartitle',
        'buyerDetails': 'buyer_details',
        'reserveDetails': 'reserve_details'
    };

    const newObj = {};
    for (const key in obj) {
        const mappedKey = reverseMapping[key] || key;
        newObj[mappedKey] = decamelize(obj[key]);
    }
    return newObj;
};

app.get('/api/cars', async (req, res) => {
    console.log(`[GET /api/cars] URL: ${req.url}`);
    try {
        let sbQuery = supabase.from('cars').select('*');

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

        // Status filter
        if (includeExpired) {
            sbQuery = sbQuery.in('status', ['approved', 'sold', 'reserved']);
        } else {
            sbQuery = sbQuery.eq('status', 'approved');
        }

        if (city) {
            sbQuery = sbQuery.ilike('city', `%${city}%`);
        }

        if (make) sbQuery = sbQuery.in('make', Array.isArray(make) ? make : [make]);
        if (fuel) sbQuery = sbQuery.in('fuel', Array.isArray(fuel) ? fuel : [fuel]);
        if (transmission) sbQuery = sbQuery.in('transmission', Array.isArray(transmission) ? transmission : [transmission]);
        if (bodyType) sbQuery = sbQuery.in('bodyType', Array.isArray(bodyType) ? bodyType : [bodyType]);
        if (color) sbQuery = sbQuery.in('color', Array.isArray(color) ? color : [color]);

        const parseNumFilter = (column, value, op) => {
            if (!value) return;
            const vals = Array.isArray(value) ? value : [value];
            vals.forEach(val => {
                const num = parseInt(String(val).match(/\d+/)?.[0] || val);
                if (!isNaN(num)) {
                    if (op === 'eq') sbQuery = sbQuery.eq(column, num);
                    if (op === 'gte') sbQuery = sbQuery.gte(column, num);
                    if (op === 'lte') sbQuery = sbQuery.lte(column, num);
                }
            });
        };

        if (owner) parseNumFilter('owner', owner, 'eq');
        if (seats) parseNumFilter('seats', seats, 'eq');
        if (minPrice) sbQuery = sbQuery.gte('priceinr', parseInt(minPrice));
        if (maxPrice) sbQuery = sbQuery.lte('priceinr', parseInt(maxPrice));

        if (maxKms) {
            const kms = Array.isArray(maxKms) ? maxKms : [maxKms];
            sbQuery = sbQuery.lte('kms', Math.max(...kms.map(k => parseInt(k))));
        }

        if (year) {
            const years = Array.isArray(year) ? year : [year];
            sbQuery = sbQuery.gte('year', Math.min(...years.map(y => parseInt(y))));
        }

        if (isAuction === 'true') {
            sbQuery = sbQuery.eq('auction->>isAuction', 'true');
        }

        if (features) {
            const featList = Array.isArray(features) ? features : [features];
            // Match ANY feature using or
            const orConditions = featList.map(f => `features->>contains.${f}`).join(',');
            // Supabase doesn't have a direct 'contains in array' for or-any easily without filter 
            // Simplified: Filter by first feature if or is complex, or use raw filter if needed.
            // Using a simpler approach for now: eq search in JSONB
            featList.forEach(f => {
                sbQuery = sbQuery.filter('features', 'cs', JSON.stringify([f]));
            });
        }

        if (search) {
            sbQuery = sbQuery.or(`model.ilike.%${search}%,make.ilike.%${search}%,city.ilike.%${search}%`);
        }

        const { data: cars, error } = await sbQuery;

        if (error) throw error;
        console.log(`[GET /api/cars] Found ${cars ? cars.length : 0} results.`);

        res.json(camelize(cars) || []);
    } catch (err) {
        console.error("FILTER ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

// 2. GET Single Car
app.get('/api/cars/:id', async (req, res) => {
    const carId = parseInt(req.params.id);
    if (isNaN(carId)) return res.status(400).json({ message: "Invalid Car ID format" });

    try {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('id', carId)
            .single();

        if (error || !data) {
            console.log(`[GET /api/cars/${carId}] NOT FOUND`);
            return res.status(404).json({ message: "Car not found" });
        }

        console.log(`[GET /api/cars/${carId}] Car retrieved successfully`);
        res.json(camelize(data));
    } catch (err) {
        console.error(`💥 [GET /api/cars/${req.params.id}] ERROR:`, err.stack);
        res.status(500).json({ message: "Internal Server Error", details: err.message });
    }
});

// 3. POST Bidding Logic
app.post('/api/cars/:id/bid', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const carId = req.params.id;

        const { data: car, error: fetchError } = await supabase
            .from('cars')
            .select('*')
            .eq('id', carId)
            .single();

        if (fetchError || !car) return res.status(404).json({ message: "Car not found" });

        let auction = car.auction;

        if (!auction || !auction.isAuction) return res.status(400).json({ message: "Not an auction" });
        if (new Date(auction.endTime) < new Date()) return res.status(400).json({ message: "Auction ended" });
        if (amount <= (auction.currentBid || 0)) return res.status(400).json({ message: "Bid too low" });

        auction.currentBid = amount;
        auction.highestBidder = userId;
        auction.bidCount = (auction.bidCount || 0) + 1;
        auction.bids = auction.bids || [];
        auction.bids.unshift({ id: Date.now(), carId: car.id, userId, amount, timestamp: new Date().toISOString() });

        const { error: updateError } = await supabase
            .from('cars')
            .update({ auction })
            .eq('id', carId);

        if (updateError) throw updateError;
        res.json(camelize({ ...car, auction }));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unreserve a car (Admin only)
app.post('/api/cars/:id/unreserve', async (req, res) => {
    try {
        const carId = req.params.id;

        console.log(`[POST /api/cars/${carId}/unreserve] Unreserving car`);

        const { data, error } = await supabase
            .from('cars')
            .update({
                status: 'approved',
                reserve_details: null
            })
            .eq('id', carId)
            .select();

        if (error) {
            console.error(`[POST /api/cars/${carId}/unreserve] Error:`, error);
            throw error;
        }

        console.log(`[POST /api/cars/${carId}/unreserve] Successfully unreserved`);
        res.json({ message: "Car unreserved successfully", data: camelize(data[0]) });
    } catch (err) {
        console.error(`[POST /api/cars/${req.params.id}/unreserve] ERROR:`, err.message);
        res.status(500).json({ message: err.message });
    }
});

// 4. GET Sell Requests
app.get('/api/sell-requests', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sell_requests')
            .select('*')
            .eq('status', 'pending');

        if (error) throw error;
        res.json(camelize(data) || []);
    } catch (err) {
        fs.appendFileSync(path.join(__dirname, 'error.log'), `${new Date().toISOString()} - ${err.stack}\n`);
        res.status(500).json({ message: err.message });
    }
});

// 5. POST Submit Sell Request
app.post('/api/sell-requests', async (req, res) => {
    try {
        console.log("DEBUG: Incoming Sell Request Body:", JSON.stringify(req.body, null, 2));
        const valuation = calculateRealMarketPrice(req.body);
        console.log("DEBUG: Calculated Valuation:", valuation);
        const newRequest = {
            id: Date.now(),
            make: req.body.make || 'Unknown',
            model: req.body.model || 'Unknown',
            priceinr: Number(req.body.priceINR) || 0, // Added price field
            variant: req.body.variant || '',
            year: Number(req.body.year) || new Date().getFullYear(),
            fuel: req.body.fuel || 'Petrol',
            transmission: req.body.transmission || 'Manual',
            kms: Number(req.body.kms) || 0,
            owner: typeof req.body.owner === 'string' ? (parseInt(req.body.owner) || 1) : (req.body.owner || 1),
            city: req.body.city || 'Default',
            enginecapacity: Number(req.body.engineCapacity) || 0,
            mileagekmpl: Number(req.body.mileageKmpl) || 0,
            seats: typeof req.body.seats === 'string' ? (parseInt(req.body.seats) || 5) : (req.body.seats || 5),
            color: req.body.color || 'White',
            rto: req.body.rto || '',
            insurancevalidity: req.body.insuranceValidity || '',
            accidental: req.body.accidental ? true : false,
            servicehistory: req.body.serviceHistory ? true : false,
            description: req.body.description || '',
            status: 'pending',
            requestdate: new Date().toISOString(),
            valuation: valuation,
            images: req.body.images || []
        };

        console.log("DEBUG: Final Insert Object:", JSON.stringify(newRequest, null, 2));

        const { error } = await supabase
            .from('sell_requests')
            .insert([newRequest]);

        if (error) throw error;
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
        const { data: request, error: fetchError } = await supabase
            .from('sell_requests')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !request) {
            console.log(`[APPROVE] Request not found: ${req.params.id}`);
            return res.status(404).json({ message: "Request not found" });
        }

        const overrides = req.body || {};
        const valuationData = request.valuation || { fairPrice: 0 };
        const fairPrice = valuationData.fairPrice || 0;

        // Update request status
        await supabase
            .from('sell_requests')
            .update({ status: 'approved' })
            .eq('id', req.params.id);

        const newCarData = {
            ...request,
            priceinr: overrides.priceINR ? Number(overrides.priceINR) : (request.priceinr || fairPrice),
            kms: overrides.kms ? Number(overrides.kms) : request.kms,
            id: Date.now(),
            status: 'approved',
            valuation: valuationData,
            features: [],
            auction: { isAuction: false },
            images: request.images || [],
            bodytype: request.bodytype || 'SUV',
            certified: false,
            sellertype: 'Individual'
        };

        const validCols = [
            'id', 'make', 'model', 'variant', 'year', 'kms', 'fuel', 'transmission',
            'priceinr', 'city', 'bodytype', 'certified', 'owner', 'status', 'sellertype',
            'enginecapacity', 'mileagekmpl', 'description', 'valuation', 'features',
            'auction', 'images', 'seats', 'color', 'rto', 'insurancevalidity',
            'accidental', 'servicehistory', 'buyerdetails', 'reservedetails'
        ];

        const filteredCar = {};
        validCols.forEach(col => {
            if (newCarData[col] !== undefined) filteredCar[col] = newCarData[col];
        });

        const { error: insertError } = await supabase
            .from('cars')
            .insert([filteredCar]);

        if (insertError) throw insertError;

        res.json({ message: "Request approved and car moved to inventory", carId: newCarData.id });
    } catch (err) {
        console.error("APPROVE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/sell-requests/:id/reject', async (req, res) => {
    try {
        const { error } = await supabase
            .from('sell_requests')
            .update({ status: 'rejected' })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: "Request rejected" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. Auction Management
app.post('/api/cars/:id/end-auction', async (req, res) => {
    try {
        const { data: car, error: fetchError } = await supabase
            .from('cars')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !car) return res.status(404).json({ message: "Car not found" });

        let auction = car.auction || { isAuction: false };
        auction.isAuction = false;
        auction.ended = true;

        const { error: updateError } = await supabase
            .from('cars')
            .update({ status: 'sold', auction })
            .eq('id', req.params.id);

        if (updateError) throw updateError;
        res.json(camelize({ ...car, auction }));
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
            images: req.body.images || [],
            features: req.body.features || [],
            valuation: req.body.valuation || {},
            auction: req.body.auction || { isAuction: false },
            buyerdetails: req.body.buyerDetails || null,
            reservedetails: req.body.reserveDetails || null
        };

        const { error } = await supabase
            .from('cars')
            .insert([carData]);

        if (error) throw error;
        res.status(201).json(carData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/cars/:id', async (req, res) => {
    try {
        const carId = req.params.id;
        const updates = req.body;

        console.log(`[PUT /api/cars/${carId}] Attempting update with:`, Object.keys(updates));

        // Convert camelCase to snake_case for database
        const dbUpdates = decamelize(updates);
        console.log(`[PUT /api/cars/${carId}] Converted to DB format:`, Object.keys(dbUpdates));

        const { data, error } = await supabase
            .from('cars')
            .update(dbUpdates)
            .eq('id', carId)
            .select();

        if (error) {
            console.error(`[PUT /api/cars/${carId}] Supabase error:`, error);
            throw error;
        }

        console.log(`[PUT /api/cars/${carId}] Update successful`);
        res.json({ message: "Car updated successfully", data: camelize(data) });
    } catch (err) {
        console.error(`[PUT /api/cars/${req.params.id}] ERROR:`, err.message);
        fs.appendFileSync(path.join(__dirname, 'server_log.txt'), `${new Date().toISOString()} - PUT /api/cars/${req.params.id} ERROR: ${err.message}\n`);
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/cars/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('cars')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: "Car deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/cars/:id/start-auction', async (req, res) => {
    try {
        const auction = {
            isAuction: true,
            ...req.body,
            currentBid: req.body.startingBid,
            bidCount: 0,
            bids: []
        };

        const { error } = await supabase
            .from('cars')
            .update({ auction })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: "Auction started", auction });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Test Drives
app.get('/api/test-drives', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('test_drives')
            .select('*');

        if (error) throw error;
        res.json(camelize(data) || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/test-drives', async (req, res) => {
    try {
        const decamelizedBody = decamelize(req.body);
        const newDrive = {
            id: Date.now(),
            ...decamelizedBody,
            status: 'pending',
            requestedat: new Date().toISOString()
        };

        const { error } = await supabase
            .from('test_drives')
            .insert([newDrive]);

        if (error) throw error;
        res.status(201).json(newDrive);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


