
export const MODEL_PROFILES = {
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

export const calculateRealMarketPrice = (car) => {
    const basePrice = getBasePrice(car.make, car.model);
    const age = Math.max(0, new Date().getFullYear() - Number(car.year));
    let ageFactor = Math.pow(0.88, age);

    const parseNum = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        const cleaned = val.toString().replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    };

    const usageFactor = 1 - (Math.min(parseNum(car.kms), 250000) / 250000) * 0.3;
    const ownerNum = typeof car.owner === 'string' ? (parseInt(car.owner) || 1) : (Number(car.owner) || 1);
    const ownerFactor = 1 - (Math.max(0, ownerNum - 1) * 0.05);

    const fuelFactors = { 'Petrol': 1.0, 'Diesel': 1.05, 'CNG': 0.95, 'Electric': 0.9 };
    let fuelFactor = fuelFactors[car.fuel] || 1.0;

    const ncrCities = ['New Delhi', 'Gurgaon', 'Noida'];
    if (ncrCities.includes(car.city)) {
        if (car.fuel === 'Diesel' && age >= 8) fuelFactor *= 0.6;
        if (car.fuel === 'Petrol' && age >= 12) fuelFactor *= 0.7;
    }

    const transFactors = { 'Automatic': 1.1, 'DCT': 1.15, 'CVT': 1.12, 'Manual': 1.0, 'IMT': 1.05 };
    const transFactor = transFactors[car.transmission] || 1.0;

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
