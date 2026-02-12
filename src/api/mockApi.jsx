import { INITIAL_CARS, MODEL_PROFILES } from '../utils/constants';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    paramsSerializer: params => {
        const searchParams = new URLSearchParams();
        for (const key in params) {
            const value = params[key];
            if (Array.isArray(value)) {
                value.forEach(v => searchParams.append(key, v));
            } else if (value !== undefined && value !== null) {
                searchParams.append(key, value);
            }
        }
        return searchParams.toString();
    }
});

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

export const calculateRealMarketPrice = (car) => {
    const basePrice = getBasePrice(car.make, car.model);
    const age = Math.max(0, 2025 - Number(car.year));
    let ageFactor = Math.pow(0.88, age);

    // Safe Numeric Parser for strings like "1st owner" or "45,000"
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

const IS_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Helper for Mock Filtering
const filterCars = (cars, filters) => {
    return cars.filter(car => {
        // City
        if (filters.city && car.city !== filters.city) return false;

        // Make (Multi)
        if (filters.make && filters.make.length > 0) {
            const makes = Array.isArray(filters.make) ? filters.make : [filters.make];
            if (!makes.includes(car.make)) return false;
        }

        // Price
        if (filters.minPrice && car.priceINR < Number(filters.minPrice)) return false;
        if (filters.maxPrice && car.priceINR > Number(filters.maxPrice)) return false;

        // KMS (Multi - OR Logic)
        if (filters.maxKms && filters.maxKms.length > 0) {
            const kmsLimits = Array.isArray(filters.maxKms) ? filters.maxKms : [filters.maxKms];
            const matchesKms = kmsLimits.some(limit => car.kms <= Number(limit));
            if (!matchesKms) return false;
        }

        // Year (Multi - OR Logic)
        if (filters.year && filters.year.length > 0) {
            const years = Array.isArray(filters.year) ? filters.year : [filters.year];
            const matchesYear = years.some(limit => car.year >= Number(limit));
            if (!matchesYear) return false;
        }

        // Fuel (Multi)
        if (filters.fuel && filters.fuel.length > 0) {
            const fuels = Array.isArray(filters.fuel) ? filters.fuel : [filters.fuel];
            if (!fuels.includes(car.fuel)) return false;
        }

        // Body Type (Multi)
        if (filters.bodyType && filters.bodyType.length > 0) {
            const bodies = Array.isArray(filters.bodyType) ? filters.bodyType : [filters.bodyType];
            if (!bodies.includes(car.bodyType)) return false;
        }

        // Transmission (Multi)
        if (filters.transmission && filters.transmission.length > 0) {
            const trans = Array.isArray(filters.transmission) ? filters.transmission : [filters.transmission];
            if (!trans.includes(car.transmission)) return false;
        }

        // Color (Multi)
        if (filters.color && filters.color.length > 0) {
            const colors = Array.isArray(filters.color) ? filters.color : [filters.color];
            if (!colors.includes(car.color)) return false;
        }

        // Search
        if (filters.search) {
            const q = filters.search.toLowerCase();
            const text = `${car.make} ${car.model} ${car.variant}`.toLowerCase();
            if (!text.includes(q)) return false;
        }

        // Auction
        if (filters.isAuction === 'true' || filters.isAuction === true) {
            return car.auction && car.auction.isAuction === true;
        }

        return true;
    });
};

export const getCars = async (filters = {}) => {
    if (IS_MOCK) {
        // Create deep copy to avoid mutation issues
        const mockData = JSON.parse(JSON.stringify(INITIAL_CARS));

        // Enrich some cars with auction data for the Auction page
        const enrichedData = mockData.map((car, idx) => {
            if (idx % 4 === 0) { // Every 4th car is an auction car
                return {
                    ...car,
                    auction: {
                        isAuction: true,
                        currentBid: car.priceINR * 0.8,
                        endTime: new Date(Date.now() + 86400000).toISOString(), // 24h from now
                        bids: []
                    }
                };
            }
            return car;
        });

        let results = filterCars(enrichedData, filters);

        // Sorting
        if (filters.sort) {
            results.sort((a, b) => {
                const parse = (val) => Number(val) || 0;
                switch (filters.sort) {
                    case 'price_asc': return parse(a.priceINR) - parse(b.priceINR);
                    case 'price_desc': return parse(b.priceINR) - parse(a.priceINR);
                    case 'km_asc': return parse(a.kms) - parse(b.kms);
                    case 'year_desc': return parse(b.year) - parse(a.year);
                    case 'newest': return b.id - a.id;
                    default: return 0;
                }
            });
        }

        // Simulate Network Delay
        await delay(500);
        return results;
    }

    const response = await api.get('/cars', { params: filters });
    return response.data;
};

export const getCarById = async (id) => {
    if (IS_MOCK) {
        await delay(300);
        return INITIAL_CARS.find(c => c.id === Number(id)) || null;
    }
    const response = await api.get(`/cars/${id}`);
    return response.data;
};

export const createCarListing = async (carData) => {
    if (IS_MOCK) {
        await delay(800);
        return { ...carData, id: Math.floor(Math.random() * 10000) + 2000 };
    }
    const response = await api.post('/cars', carData);
    return response.data;
};

export const deleteCarListing = async (id) => {
    if (IS_MOCK) { await delay(500); return { success: true }; }
    const response = await api.delete(`/cars/${id}`);
    return response.data;
};

export const updateCarListing = async (id, updates) => {
    if (IS_MOCK) { await delay(500); return { id, ...updates }; }
    const response = await api.put(`/cars/${id}`, updates);
    return response.data;
};

export const unreserveCar = async (id) => {
    if (IS_MOCK) { await delay(500); return { id, status: 'approved' }; }
    const response = await api.post(`/cars/${id}/unreserve`);
    return response.data;
};

export const bookTestDrive = async (data) => {
    if (IS_MOCK) { await delay(1000); return { success: true, id: 999 }; }
    const response = await api.post('/test-drives', data);
    return response.data;
};

export const getTestDrives = async () => {
    if (IS_MOCK) { await delay(500); return []; }
    const response = await api.get('/test-drives');
    return response.data;
};

export const getValuation = async (details) => {
    if (IS_MOCK) {
        await delay(1500); // Simulate AI processing
        return calculateRealMarketPrice(details);
    }
    try {
        const response = await api.post('/valuation', details);
        return response.data.valuation;
    } catch (err) {
        console.error("Valuation API error:", err);
        return calculateRealMarketPrice(details);
    }
};

export const submitSellRequest = async (carData) => {
    if (IS_MOCK) { await delay(1200); return { success: true }; }
    const response = await api.post('/sell-requests', carData);
    return response.data;
};

export const getSellRequests = async () => {
    if (IS_MOCK) return [];
    const response = await api.get('/sell-requests');
    return response.data;
};

export const approveSellRequest = async (requestId, data = {}) => {
    const response = await api.post(`/sell-requests/${requestId}/approve`, data);
    return response.data;
};

export const rejectSellRequest = async (requestId) => {
    const response = await api.post(`/sell-requests/${requestId}/reject`);
    return response.data;
};

// ===== BIDDING / AUCTION SYSTEM =====

export const placeBid = async (carId, userId, bidAmount) => {
    const response = await api.post(`/cars/${carId}/bid`, { userId, amount: bidAmount });
    return response.data;
};

export const getBidHistory = async (carId) => {
    const car = await getCarById(carId);
    return car.auction ? car.auction.bids : [];
};

export const getMyBids = async (userId) => {
    // We can fetch all cars with auctions and filter on frontend or add backend support
    const allCars = await getCars({ includeExpired: true });
    const userBids = [];
    allCars.forEach(car => {
        if (car.auction && car.auction.bids) {
            const myBids = car.auction.bids.filter(b => b.userId === userId);
            if (myBids.length > 0) {
                // Find the highest bid and its timestamp
                const highestBidObj = myBids.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);

                userBids.push({
                    id: highestBidObj.id || `${car.id}-${userId}`,
                    car,
                    carId: car.id,
                    amount: highestBidObj.amount,
                    timestamp: highestBidObj.timestamp || new Date().toISOString(),
                    myHighestBid: highestBidObj.amount,
                    isWinning: car.auction.highestBidder === userId,
                    status: car.status === 'sold' ? (car.auction.highestBidder === userId ? 'won' : 'lost') : 'active'
                });
            }
        }
    });
    return userBids;
};

export const endAuction = async (carId) => {
    const response = await api.post(`/cars/${carId}/end-auction`);
    return response.data;
};

export const startAuction = async (carId, auctionDetails) => {
    const response = await api.post(`/cars/${carId}/start-auction`, auctionDetails);
    return response.data;
};

// Auth (Porting existing logic to API)
export const loginUser = async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/signup', userData);
    return response.data;
};

export const resetApp = async () => {
    // In a real app, this would be a destructive admin operation
    console.warn("ResetApp not implemented for real backend yet.");
};
