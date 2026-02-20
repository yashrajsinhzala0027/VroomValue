// Forced deployment trigger for Supabase Migration
import { INITIAL_CARS, MODEL_PROFILES } from '../utils/constants';
import { supabase } from './supabaseClient';
import { calculateRealMarketPrice } from '../utils/valuation';
export { calculateRealMarketPrice };

// Helper to map lowercase DB keys to camelCase for frontend
const camelize = (data) => {
    if (!data) return data;
    if (Array.isArray(data)) return data.map(camelize);
    if (typeof data !== 'object') return data;

    const mapping = {
        'priceinr': 'priceINR',
        'bodytype': 'bodyType',
        'sellertype': 'sellerType',
        'requestedat': 'requestedAt',
        'requestdate': 'requestDate',
        'cartitle': 'carTitle',
        'customername': 'customerName',
        'customerphone': 'customerPhone',
        'carid': 'carId',
        'userid': 'userId',
        'buyer_details': 'buyerDetails',
        'reserve_details': 'auction'
    };

    const newObj = {};
    for (const key in data) {
        const mappedKey = mapping[key.toLowerCase()] || key;
        newObj[mappedKey] = data[key];
    }
    return newObj;
};

// Helper for snake_case for Supabase
const decamelize = (obj) => {
    if (!obj) return obj;
    const mapping = {
        'priceINR': 'priceinr',
        'bodyType': 'bodytype',
        'sellerType': 'sellertype',
        'requestedAt': 'requestedat',
        'requestDate': 'requestdate',
        'carTitle': 'cartitle',
        'customerName': 'customername',
        'customerPhone': 'customerphone',
        'carId': 'carid',
        'userId': 'userid',
        'buyerDetails': 'buyer_details',
        'auction': 'reserve_details'
    };

    const newObj = {};
    for (const key in obj) {
        const mappedKey = mapping[key] || key.toLowerCase();
        newObj[mappedKey] = obj[key];
    }
    return newObj;
};

const IS_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCars = async (filters = {}, columns = '*') => {
    if (IS_MOCK) {
        await delay(300); // Reduced delay
        let filtered = [...INITIAL_CARS];

        if (filters.make && filters.make.length > 0) {
            const makes = Array.isArray(filters.make) ? filters.make : [filters.make];
            filtered = filtered.filter(c => makes.includes(c.make));
        }
        if (filters.model && filters.model.length > 0) {
            const models = Array.isArray(filters.model) ? filters.model : [filters.model];
            filtered = filtered.filter(c => models.includes(c.model));
        }
        if (filters.fuel && filters.fuel.length > 0) {
            const fuels = Array.isArray(filters.fuel) ? filters.fuel : [filters.fuel];
            filtered = filtered.filter(c => fuels.includes(c.fuel));
        }
        if (filters.transmission && filters.transmission.length > 0) {
            const trans = Array.isArray(filters.transmission) ? filters.transmission : [filters.transmission];
            filtered = filtered.filter(c => trans.includes(c.transmission));
        }
        if (filters.bodyType && filters.bodyType.length > 0) {
            const types = Array.isArray(filters.bodyType) ? filters.bodyType : [filters.bodyType];
            filtered = filtered.filter(c => types.includes(c.bodyType));
        }
        if (filters.maxKms && filters.maxKms.length > 0) {
            const maxKms = Math.max(...filters.maxKms.map(Number));
            filtered = filtered.filter(c => c.kms <= maxKms);
        }
        if (filters.year && filters.year.length > 0) {
            const minYear = Math.min(...filters.year.map(Number));
            filtered = filtered.filter(c => c.year >= minYear);
        }

        return filtered;
    }

    try {
        let query = supabase.from('cars').select(columns);

        // Apply filters only if they exist
        if (filters.city) query = query.eq('city', filters.city);
        if (filters.make && filters.make.length > 0) {
            const makes = Array.isArray(filters.make) ? filters.make : [filters.make];
            query = query.in('make', makes);
        }
        if (filters.model && filters.model.length > 0) {
            const models = Array.isArray(filters.model) ? filters.model : [filters.model];
            query = query.in('model', models);
        }
        if (filters.fuel && filters.fuel.length > 0) {
            const fuels = Array.isArray(filters.fuel) ? filters.fuel : [filters.fuel];
            query = query.in('fuel', fuels);
        }
        if (filters.transmission && filters.transmission.length > 0) {
            const trans = Array.isArray(filters.transmission) ? filters.transmission : [filters.transmission];
            query = query.in('transmission', trans);
        }
        if (filters.bodyType && filters.bodyType.length > 0) {
            const types = Array.isArray(filters.bodyType) ? filters.bodyType : [filters.bodyType];
            query = query.in('bodytype', types);
        }
        if (filters.budget) {
            const [min, max] = filters.budget;
            if (min) query = query.gte('priceinr', min);
            if (max) query = query.lte('priceinr', max);
        }
        if (filters.kms) {
            const [min, max] = filters.kms;
            if (min) query = query.gte('kms', min);
            if (max) query = query.lte('kms', max);
        }
        if (filters.year) {
            const [min, max] = filters.year;
            if (min) query = query.gte('year', min);
            if (max) query = query.lte('year', max);
        }

        const { data, error } = await query;
        if (error) throw error;
        return camelize(data || []);
    } catch (err) {
        console.error("Supabase getCars error:", err);
        throw err; // Throw instead of fallback to mask errors
    }
};

export const getCarById = async (id) => {
    if (IS_MOCK) {
        await delay(500);
        return INITIAL_CARS.find(c => String(c.id) === String(id));
    }

    try {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('id', id)
            .maybeSingle(); // Better than .single() if it might not exist

        if (error) throw error;
        return camelize(data);
    } catch (err) {
        console.error("Supabase getCarById error:", err);
        throw err;
    }
};

export const createCarListing = async (data) => {
    if (IS_MOCK) { await delay(1000); return { id: Date.now(), ...data }; }
    try {
        // Safe ID generation (Auto-increment fallback)
        const { data: lastCar } = await supabase
            .from('cars')
            .select('id')
            .order('id', { ascending: false })
            .limit(1)
            .maybeSingle();

        const nextId = (lastCar?.id || 0) + 1;

        const decamelizedData = decamelize(data);
        const { data: inserted, error } = await supabase
            .from('cars')
            .insert([{ ...decamelizedData, id: nextId }])
            .select()
            .single();

        if (error) throw error;
        return camelize(inserted);
    } catch (err) {
        console.error("Supabase createCarListing error:", err);
        throw err;
    }
};

export const updateCarListing = async (id, data) => {
    if (IS_MOCK) { await delay(1000); return { success: true }; }

    try {
        const decamelizedData = decamelize(data);
        const { data: updated, error } = await supabase
            .from('cars')
            .update(decamelizedData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return camelize(updated);
    } catch (err) {
        console.error("Supabase updateCarListing error:", err);
        throw err;
    }
};

export const deleteCarListing = async (id) => {
    if (IS_MOCK) { await delay(500); return { success: true }; }
    try {
        const { error } = await supabase.from('cars').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (err) {
        console.error("Supabase deleteCarListing error:", err);
        throw err;
    }
};

export const unreserveCar = async (id) => {
    if (IS_MOCK) { await delay(500); return { id, status: 'approved' }; }
    try {
        const { data, error } = await supabase
            .from('cars')
            .update({ status: 'approved', reserve_details: null })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return camelize(data);
    } catch (err) {
        console.error("Supabase unreserveCar error:", err);
        throw err;
    }
};

export const bookTestDrive = async (data) => {
    if (IS_MOCK) { await delay(1000); return { success: true }; }
    try {
        const decamelizedData = decamelize(data);
        const { error } = await supabase.from('test_drives').insert([{
            ...decamelizedData,
            status: 'pending',
            requestedat: new Date().toISOString()
        }]);
        if (error) throw error;
        return { success: true };
    } catch (err) {
        console.error("Supabase bookTestDrive error:", err);
        throw err;
    }
};

export const getTestDrives = async () => {
    if (IS_MOCK) { await delay(300); return []; }
    try {
        const { data, error } = await supabase.from('test_drives').select('id, date, name, phone, cartitle, time');
        if (error) throw error;
        return camelize(data);
    } catch (err) {
        console.error("Supabase getTestDrives error:", err);
        throw err;
    }
};

export const submitSellRequest = async (data) => {
    if (IS_MOCK) { await delay(1500); return { id: Date.now() }; }
    try {
        const valuation = calculateRealMarketPrice(data);
        const decamelizedData = decamelize(data);
        const newRequest = {
            ...decamelizedData,
            priceinr: valuation.fairPrice,
            status: 'pending',
            requestdate: new Date().toISOString()
        };
        const { error } = await supabase.from('sell_requests').insert([newRequest]);
        if (error) throw error;
        return { success: true };
    } catch (err) {
        console.error("Supabase submitSellRequest error:", err);
        throw err;
    }
};

export const getSellRequests = async () => {
    if (IS_MOCK) { await delay(400); return []; }
    try {
        const { data, error } = await supabase.from('sell_requests').select('*');
        if (error) throw error;
        return camelize(data);
    } catch (err) {
        console.error("Supabase getSellRequests error:", err);
        throw err;
    }
};

// Whitelist of valid columns in 'cars' table 
const VALID_CAR_COLUMNS = [
    'make', 'model', 'variant', 'year', 'priceinr', 'kms', 'fuel',
    'transmission', 'owners', 'color', 'insurance', 'regstate',
    'rtonumber', 'location', 'description', 'images', 'features',
    'safetyfeatures', 'status', 'sellertype'
];

export const approveSellRequest = async (id, data) => {
    if (IS_MOCK) { await delay(1200); return { success: true }; }
    try {
        // Step 1: Update request status
        await supabase.from('sell_requests').update({ status: 'approved' }).eq('id', id);

        // Step 2: Get next ID (Manual generation needed as per previous NULL constraint fix)
        const { data: lastCar } = await supabase
            .from('cars')
            .select('id')
            .order('id', { ascending: false })
            .limit(1)
            .maybeSingle();

        const nextId = (lastCar?.id || 0) + 1;

        // Step 3: Prepare valid car payload
        const decamelizedData = decamelize(data);
        const finalCarPayload = {};

        // Filter: Only allow columns that exist in cars table
        Object.keys(decamelizedData).forEach(key => {
            if (VALID_CAR_COLUMNS.includes(key)) {
                finalCarPayload[key] = decamelizedData[key];
            }
        });

        // Add mandatory system fields
        finalCarPayload.id = nextId;
        finalCarPayload.status = 'approved';
        finalCarPayload.sellertype = 'VroomValue Certified';

        // Step 4: Insert valid record
        const { error } = await supabase.from('cars').insert([finalCarPayload]);

        if (error) {
            console.error("Insert failed with payload:", finalCarPayload);
            throw error;
        }

        return { success: true };
    } catch (err) {
        console.error("Supabase approveSellRequest error:", err);
        throw err;
    }
};

export const rejectSellRequest = async (id) => {
    if (IS_MOCK) { await delay(500); return { success: true }; }
    try {
        const { error } = await supabase
            .from('sell_requests')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (err) {
        console.error("Supabase rejectSellRequest error:", err);
        throw err;
    }
};

export const getValuation = async (details) => {
    await delay(1000);
    return calculateRealMarketPrice(details);
};

// ===== BIDDING / AUCTION SYSTEM =====

export const placeBid = async (carId, userId, bidAmount) => {
    if (IS_MOCK) { await delay(500); return { success: true }; }
    try {
        const { data: car, error: fetchError } = await supabase
            .from('cars')
            .select('reserve_details')
            .eq('id', carId)
            .single();

        if (fetchError) throw fetchError;

        const reserve_details = car.reserve_details || { bids: [] };
        const newBid = {
            id: Date.now(),
            userId,
            amount: bidAmount,
            timestamp: new Date().toISOString()
        };

        const updatedBids = [...(reserve_details.bids || []), newBid];

        const { data: updated, error } = await supabase
            .from('cars')
            .update({
                reserve_details: {
                    ...reserve_details,
                    currentBid: bidAmount,
                    highestBidder: userId,
                    bids: updatedBids
                }
            })
            .eq('id', carId)
            .select()
            .single();

        if (error) throw error;
        return camelize(updated);
    } catch (err) {
        console.error("Supabase placeBid error:", err);
        throw err;
    }
};

export const getBidHistory = async (carId) => {
    const car = await getCarById(carId);
    return car.auction?.bids || [];
};

export const getMyBids = async (userId) => {
    const allCars = await getCars();
    const userBids = [];
    allCars.forEach(car => {
        const bids = car.auction?.bids || [];
        const myBids = bids.filter(b => b.userId === userId);
        if (myBids.length > 0) {
            const highestBidObj = myBids.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
            userBids.push({
                id: highestBidObj.id || `${car.id}-${userId}`,
                car,
                carId: car.id,
                amount: highestBidObj.amount,
                timestamp: highestBidObj.timestamp || new Date().toISOString(),
                myHighestBid: highestBidObj.amount,
                isWinning: car.auction?.highestBidder === userId,
                status: car.status === 'sold' ? (car.auction?.highestBidder === userId ? 'won' : 'lost') : 'active'
            });
        }
    });
    return userBids;
};

export const startAuction = async (carId, auctionDetails) => {
    if (IS_MOCK) { await delay(500); return { success: true }; }
    try {
        const { data, error } = await supabase
            .from('cars')
            .update({
                reserve_details: {
                    isAuction: true,
                    ...auctionDetails,
                    bids: []
                }
            })
            .eq('id', carId)
            .select()
            .single();
        if (error) throw error;
        return camelize(data);
    } catch (err) {
        console.error("Supabase startAuction error:", err);
        throw err;
    }
};

export const endAuction = async (carId) => {
    if (IS_MOCK) { await delay(500); return { success: true }; }
    try {
        const { data, error } = await supabase
            .from('cars')
            .update({ status: 'sold' })
            .eq('id', carId)
            .select()
            .single();
        if (error) throw error;
        return camelize(data);
    } catch (err) {
        console.error("Supabase endAuction error:", err);
        throw err;
    }
};

// Auth
export const loginUser = async ({ email, password }) => {
    console.log("Attempting login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Supabase Login Error:", error.message, error.status);
        throw error;
    }

    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (profileError) {
        console.warn("User profile not found in 'users' table. Error:", profileError.message);
    }

    const safeProfile = profile || {};
    return {
        ...(camelize(safeProfile)),
        id: safeProfile.id || data.user?.id,
        email: safeProfile.email || email,
        role: safeProfile.role || 'user',
        token: data.session.access_token
    };
};

export const registerUser = async (userData) => {
    console.log("Attempting signup for:", userData.email);
    const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                name: userData.name,
                phone: userData.phone,
                dob: userData.dob
            }
        }
    });

    if (error) {
        console.error("Supabase Signup Error:", error.message, error.status);
        throw error;
    }

    console.log("Signup success! User ID:", data.user?.id);
    return { success: true };
};

export const resetApp = async () => {
    console.warn("ResetApp not supported in production.");
};
