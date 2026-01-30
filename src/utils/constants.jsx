
// Mock Data & Constants

export const CITIES = [
    "New Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad",
    "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh",
    "Lucknow", "Kochi", "Indore", "Gurgaon", "Noida"
];

export const MAKES = [
    "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Honda",
    "Toyota", "Kia", "Renault", "Volkswagen", "Skoda",
    "MG", "Nissan", "Ford", "Jeep"
];

export const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric"];
export const TRANSMISSIONS = ["Manual", "Automatic", "IMT", "CVT", "DCT"];
export const BODY_TYPES = ["Hatchback", "Sedan", "SUV", "Compact SUV", "MUV/MPV"];
export const RTO_REGIONS = ["DL - Delhi", "HR - Haryana", "UP - Uttar Pradesh", "MH - Maharashtra", "KA - Karnataka", "TS - Telangana", "TN - Tamil Nadu", "WB - West Bengal", "GJ - Gujarat"];
export const INSURANCE_TYPES = ["Comprehensive", "Third Party", "Zero Depreciation", "Expired", "No Insurance"];

export const EXCLUDED_BRANDS = [
    "Mercedes-Benz", "BMW", "Audi", "Jaguar", "Land Rover", "Volvo", "Lexus", "Porsche", "Ferrari", "Lamborghini", "Rolls-Royce", "Bentley", "Maserati", "Aston Martin", "Tesla"
];

// Added for Advanced Filters
export const COLORS = [
    { name: "White", code: "#ffffff" },
    { name: "Silver", code: "#c0c0c0" },
    { name: "Grey", code: "#808080" },
    { name: "Black", code: "#000000" },
    { name: "Blue", code: "#2563eb" },
    { name: "Red", code: "#dc2626" },
    { name: "Brown", code: "#92400e" },
    { name: "Beige", code: "#ddd0b6" },
    { name: "Gold", code: "#fbbf24" },
    { name: "Green", code: "#16a34a" }
];

export const FEATURES = [
    "Sunroof", "Keyless start", "ABS", "Airbags",
    "Rear camera", "Rear parking sensor", "Power windows", "Power steering"
];

export const SEATS = ["4 seater", "5 seater", "6+ seater"];
export const OWNERS = ["1st owner", "2nd owner", "3rd owner"];
export const YEARS = [2024, 2022, 2020, 2018, 2016, 2014];

export const EXCLUDED_MODELS = [
    "Fortuner Legender", "Camry", "Superb", "Vellfire"
];

// REAL ASSETS FROM CARS24 & WIKIMEDIA COMMONS
// We prioritize the commercial look.
const REAL_IMAGES = {
    dzire: "https://fastly-production.24c.in/cars24/car/179/10067369773/100673697730/0_small.jpg?v=9",
    tuv300: "https://fastly-production.24c.in/cars24/car/72/10051360772/100513607720/0_small.jpg?v=7",
    swift: "https://fastly-production.24c.in/cars24/car/94/10012464794/100124647940/0_small.jpg?v=9",
    // Wikimedia Commons High Quality
    creta: "https://upload.wikimedia.org/wikipedia/commons/2/2f/2022_Hyundai_Creta_1.6_Plus_%28Chile%29_front_view.jpg",
    nexon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/2023_Tata_Nexon_Fearless_%2B_S_restyle_front_view.jpg/800px-2023_Tata_Nexon_Fearless_%2B_S_restyle_front_view.jpg",
    thar: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Mahindra_Thar_Photoshoot_At_Perupalem_Beach_%28West_Godavari_District%2CAP%2CIndia_%29_Djdavid.jpg",
    city: "https://upload.wikimedia.org/wikipedia/commons/2/23/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg",
    fortuner: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Toyota_Fortuner_India.jpg"
};

const INTERIOR_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/2/25/Close-up_of_engine_oil_temperature_gauge_on_car_dashboard_%2849006320293%29.jpg";

// Helper: Generate Image Set
const getImages = (id, specificType) => {
    let mainImg = REAL_IMAGES[specificType] || REAL_IMAGES.swift; // Default to swift if unknown

    return [
        { id: `${id}-f`, type: 'exterior-front', src: mainImg },
        { id: `${id}-r`, type: 'exterior-rear', src: mainImg },
        { id: `${id}-d`, type: 'interior-dashboard', src: INTERIOR_IMAGE },
    ];
};

// Generate 50 Real Cars
// MASTER MODEL PROFILES - Professional Market Data
export const MODEL_PROFILES = {
    // Maruti Suzuki - Market Leader
    "Alto": { basePrice: 400000, variants: ["STD", "LXI", "VXI", "VXI+"], engine: 796, mileage: 22.0, assets: "swift" },
    "Alto K10": { basePrice: 450000, variants: ["LXI", "VXI", "VXI+"], engine: 998, mileage: 24.0, assets: "swift" },
    "S-Presso": { basePrice: 420000, variants: ["STD", "LXI", "VXI", "VXI+"], engine: 998, mileage: 21.7, assets: "swift" },
    "WagonR": { basePrice: 550000, variants: ["LXI", "VXI", "ZXI"], engine: 998, mileage: 25.2, assets: "swift" },
    "Celerio": { basePrice: 520000, variants: ["LXI", "VXI", "ZXI"], engine: 998, mileage: 26.0, assets: "swift" },
    "Swift": { basePrice: 750000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1197, mileage: 22.3, assets: "swift" },
    "Baleno": { basePrice: 850000, variants: ["Sigma", "Delta", "Zeta", "Alpha"], engine: 1197, mileage: 22.9, assets: "swift" },
    "Dzire": { basePrice: 820000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1197, mileage: 23.2, assets: "dzire" },
    "Ciaz": { basePrice: 950000, variants: ["Sigma", "Delta", "Zeta", "Alpha"], engine: 1462, mileage: 20.6, assets: "city" },
    "Ignis": { basePrice: 550000, variants: ["Sigma", "Delta", "Zeta", "Alpha"], engine: 1197, mileage: 20.9, assets: "swift" },
    "Ertiga": { basePrice: 1050000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1462, mileage: 20.5, assets: "fortuner" },
    "XL6": { basePrice: 1250000, variants: ["Zeta", "Alpha"], engine: 1462, mileage: 20.3, assets: "fortuner" },
    "Brezza": { basePrice: 1050000, variants: ["LXI", "VXI", "ZXI", "ZXI+"], engine: 1462, mileage: 19.8, assets: "creta" },
    "Fronx": { basePrice: 850000, variants: ["Sigma", "Delta", "Zeta", "Alpha"], engine: 1197, mileage: 21.5, assets: "creta" },
    "Grand Vitara": { basePrice: 1450000, variants: ["Sigma", "Delta", "Zeta", "Alpha"], engine: 1490, mileage: 21.1, assets: "creta" },
    "Jimny": { basePrice: 1300000, variants: ["Zeta", "Alpha"], engine: 1462, mileage: 16.9, assets: "thar" },

    // Hyundai - Premium Mass Market
    "Santro": { basePrice: 480000, variants: ["D-Lite", "Era", "Magna", "Sportz"], engine: 1086, mileage: 20.3, assets: "swift" },
    "Grand i10 Nios": { basePrice: 600000, variants: ["Era", "Magna", "Sportz", "Asta"], engine: 1197, mileage: 20.7, assets: "swift" },
    "i20": { basePrice: 850000, variants: ["Magna", "Sportz", "Asta"], engine: 1197, mileage: 20.3, assets: "swift" },
    "i20 N Line": { basePrice: 1100000, variants: ["N6", "N8", "N10"], engine: 998, mileage: 20.2, assets: "swift" },
    "Aura": { basePrice: 750000, variants: ["E", "S", "SX", "SX(O)"], engine: 1197, mileage: 20.5, assets: "dzire" },
    "Verna": { basePrice: 1450000, variants: ["EX", "S", "SX", "SX(O)"], engine: 1497, mileage: 18.2, assets: "city" },
    "Elantra": { basePrice: 2000000, variants: ["SX", "SX(O)"], engine: 1999, mileage: 14.9, assets: "city" },
    "Venue": { basePrice: 1150000, variants: ["E", "S", "S+", "SX", "SX(O)"], engine: 1197, mileage: 17.5, assets: "creta" },
    "Venue N Line": { basePrice: 1350000, variants: ["N6", "N8", "N10"], engine: 998, mileage: 18.2, assets: "creta" },
    "Creta": { basePrice: 1650000, variants: ["E", "EX", "S", "SX", "SX(O)"], engine: 1497, mileage: 16.8, assets: "creta" },
    "Creta N Line": { basePrice: 1850000, variants: ["N8", "N10"], engine: 1497, mileage: 16.5, assets: "creta" },
    "Alcazar": { basePrice: 1950000, variants: ["Prestige", "Platinum", "Signature"], engine: 1497, mileage: 18.1, assets: "fortuner" },
    "Tucson": { basePrice: 3100000, variants: ["Platinum", "Signature"], engine: 1999, mileage: 16.4, assets: "creta" },
    "Kona Electric": { basePrice: 2400000, variants: ["Premium"], engine: 0, mileage: 0, assets: "creta" },

    // Tata Motors - Indian Pride
    "Tiago": { basePrice: 550000, variants: ["XE", "XM", "XT", "XZ", "XZ+"], engine: 1199, mileage: 20.0, assets: "swift" },
    "Tiago NRG": { basePrice: 700000, variants: ["XT", "XZ"], engine: 1199, mileage: 19.2, assets: "swift" },
    "Tigor": { basePrice: 650000, variants: ["XE", "XM", "XT", "XZ", "XZ+"], engine: 1199, mileage: 20.3, assets: "dzire" },
    "Tigor EV": { basePrice: 1250000, variants: ["XZ+", "XZ+ LUX"], engine: 0, mileage: 0, assets: "dzire" },
    "Altroz": { basePrice: 750000, variants: ["XE", "XM", "XT", "XZ", "XZ+"], engine: 1199, mileage: 19.0, assets: "swift" },
    "Altroz Racer": { basePrice: 950000, variants: ["R1", "R2", "R3"], engine: 1199, mileage: 18.5, assets: "swift" },
    "Punch": { basePrice: 750000, variants: ["Pure", "Adventure", "Accomplished", "Creative"], engine: 1199, mileage: 18.8, assets: "creta" },
    "Nexon": { basePrice: 1100000, variants: ["XE", "XM", "XZ", "XZ+", "Fearless"], engine: 1199, mileage: 17.3, assets: "nexon" },
    "Nexon EV": { basePrice: 1600000, variants: ["XZ+", "XZ+ LUX", "MAX"], engine: 0, mileage: 0, assets: "nexon" },
    "Harrier": { basePrice: 2200000, variants: ["XE", "XM", "XT", "XZ", "XZ+"], engine: 1956, mileage: 14.6, assets: "nexon" },
    "Safari": { basePrice: 2400000, variants: ["XE", "XM", "XT", "XZ", "XZ+"], engine: 1956, mileage: 14.1, assets: "fortuner" },

    // Mahindra - SUV Specialist
    "Bolero": { basePrice: 1000000, variants: ["B4", "B6", "B6(O)"], engine: 1493, mileage: 16.7, assets: "tuv300" },
    "Bolero Neo": { basePrice: 1100000, variants: ["N4", "N8", "N10"], engine: 1493, mileage: 17.3, assets: "tuv300" },
    "TUV300": { basePrice: 1050000, variants: ["T4", "T6", "T8", "T10"], engine: 1493, mileage: 18.4, assets: "tuv300" },
    "XUV300": { basePrice: 1100000, variants: ["W4", "W6", "W8", "W8(O)"], engine: 1497, mileage: 17.0, assets: "creta" },
    "Thar": { basePrice: 1550000, variants: ["AX", "AX Opt", "LX"], engine: 2184, mileage: 15.2, assets: "thar" },
    "Thar Roxx": { basePrice: 1850000, variants: ["MX1", "MX3", "MX5", "AX5L"], engine: 2184, mileage: 14.8, assets: "thar" },
    "Scorpio Classic": { basePrice: 1350000, variants: ["S", "S3", "S5", "S7", "S9", "S11"], engine: 2184, mileage: 15.4, assets: "thar" },
    "Scorpio N": { basePrice: 1650000, variants: ["Z2", "Z4", "Z6", "Z8", "Z8L"], engine: 2184, mileage: 15.0, assets: "thar" },
    "XUV700": { basePrice: 2400000, variants: ["MX", "AX3", "AX5", "AX7", "AX7L"], engine: 2198, mileage: 13.5, assets: "thar" },
    "XUV400": { basePrice: 1800000, variants: ["EC", "EL", "EL Pro"], engine: 0, mileage: 0, assets: "creta" },
    "Marazzo": { basePrice: 1450000, variants: ["M2", "M4", "M6", "M8"], engine: 1497, mileage: 17.3, assets: "fortuner" },

    // Honda - Reliability King
    "Amaze": { basePrice: 850000, variants: ["E", "S", "V", "VX"], engine: 1199, mileage: 18.3, assets: "dzire" },
    "City": { basePrice: 1500000, variants: ["V", "VX", "ZX"], engine: 1498, mileage: 17.8, assets: "city" },
    "City Hybrid": { basePrice: 1900000, variants: ["V", "VX", "ZX"], engine: 1498, mileage: 26.5, assets: "city" },
    "Elevate": { basePrice: 1350000, variants: ["SV", "V", "VX", "ZX"], engine: 1498, mileage: 15.3, assets: "creta" },

    // Toyota - Quality Leader
    "Glanza": { basePrice: 850000, variants: ["E", "S", "G"], engine: 1197, mileage: 22.3, assets: "swift" },
    "Urban Cruiser Taisor": { basePrice: 950000, variants: ["E", "S", "G"], engine: 1197, mileage: 21.5, assets: "creta" },
    "Rumion": { basePrice: 1250000, variants: ["S", "G"], engine: 1462, mileage: 20.5, assets: "fortuner" },
    "Innova Crysta": { basePrice: 2100000, variants: ["GX", "VX", "ZX"], engine: 2393, mileage: 11.2, assets: "fortuner" },
    "Innova Hycross": { basePrice: 2500000, variants: ["GX", "VX", "ZX"], engine: 1987, mileage: 16.1, assets: "fortuner" },
    "Fortuner": { basePrice: 4200000, variants: ["Standard", "GR-S", "Legender"], engine: 2755, mileage: 10.4, assets: "fortuner" },
    "Hilux": { basePrice: 3800000, variants: ["STD", "High"], engine: 2755, mileage: 12.0, assets: "fortuner" },
    "Land Cruiser": { basePrice: 21000000, variants: ["VX", "ZX"], engine: 3346, mileage: 8.9, assets: "fortuner" },
    "Camry": { basePrice: 4800000, variants: ["Hybrid"], engine: 2487, mileage: 19.2, assets: "city" },

    // Kia - Design Excellence
    "Sonet": { basePrice: 850000, variants: ["HTE", "HTK", "HTX", "GTX"], engine: 1197, mileage: 18.2, assets: "creta" },
    "Seltos": { basePrice: 1600000, variants: ["HTE", "HTK", "HTX", "GTX", "X-Line"], engine: 1497, mileage: 17.0, assets: "creta" },
    "Carens": { basePrice: 1450000, variants: ["Premium", "Prestige", "Prestige Plus", "Luxury", "Luxury Plus"], engine: 1497, mileage: 16.2, assets: "fortuner" },
    "EV6": { basePrice: 6500000, variants: ["GT-Line"], engine: 0, mileage: 0, assets: "creta" },
    "Carnival": { basePrice: 6400000, variants: ["Premium", "Prestige", "Limousine"], engine: 2199, mileage: 13.9, assets: "fortuner" },

    // Renault - French Flair
    "Kwid": { basePrice: 550000, variants: ["RXE", "RXL", "RXT", "Climber"], engine: 999, mileage: 22.0, assets: "swift" },
    "Triber": { basePrice: 650000, variants: ["RXE", "RXL", "RXT", "RXZ"], engine: 999, mileage: 19.0, assets: "swift" },
    "Kiger": { basePrice: 750000, variants: ["RXE", "RXL", "RXT", "RXZ"], engine: 999, mileage: 19.2, assets: "creta" },

    // Volkswagen - German Engineering
    "Polo": { basePrice: 950000, variants: ["Trendline", "Comfortline", "Highline"], engine: 999, mileage: 18.2, assets: "swift" },
    "Vento": { basePrice: 1200000, variants: ["Trendline", "Comfortline", "Highline"], engine: 1498, mileage: 16.5, assets: "city" },
    "Virtus": { basePrice: 1450000, variants: ["Comfortline", "Highline", "GT"], engine: 1498, mileage: 18.1, assets: "city" },
    "Taigun": { basePrice: 1550000, variants: ["Comfortline", "Highline", "GT"], engine: 1498, mileage: 17.5, assets: "creta" },
    "Tiguan": { basePrice: 3800000, variants: ["Elegance", "Highline"], engine: 1984, mileage: 13.0, assets: "creta" },

    // Skoda - Czech Precision
    "Kushaq": { basePrice: 1500000, variants: ["Active", "Ambition", "Style"], engine: 1498, mileage: 16.5, assets: "creta" },
    "Slavia": { basePrice: 1450000, variants: ["Active", "Ambition", "Style"], engine: 1498, mileage: 18.1, assets: "city" },
    "Kodiaq": { basePrice: 4000000, variants: ["Style", "L&K"], engine: 1984, mileage: 13.9, assets: "fortuner" },
    "Superb": { basePrice: 3800000, variants: ["Style", "L&K"], engine: 1984, mileage: 15.1, assets: "city" },

    // MG Motor - British Heritage
    "Comet EV": { basePrice: 900000, variants: ["Excite", "Exclusive"], engine: 0, mileage: 0, assets: "swift" },
    "Astor": { basePrice: 1200000, variants: ["Style", "Super", "Sharp"], engine: 1349, mileage: 14.6, assets: "creta" },
    "Hector": { basePrice: 1900000, variants: ["Style", "Super", "Sharp", "Savvy"], engine: 1451, mileage: 13.9, assets: "creta" },
    "Hector Plus": { basePrice: 2100000, variants: ["Style", "Super", "Sharp"], engine: 1451, mileage: 13.5, assets: "fortuner" },
    "ZS EV": { basePrice: 2500000, variants: ["Excite", "Exclusive"], engine: 0, mileage: 0, assets: "creta" },
    "Gloster": { basePrice: 4000000, variants: ["Super", "Smart", "Savvy"], engine: 1996, mileage: 12.3, assets: "fortuner" },

    // Nissan - Japanese Innovation
    "Magnite": { basePrice: 800000, variants: ["XE", "XL", "XV"], engine: 999, mileage: 18.8, assets: "creta" },
    "Kicks": { basePrice: 1100000, variants: ["XE", "XL", "XV"], engine: 1498, mileage: 16.0, assets: "creta" },
    "X-Trail": { basePrice: 5000000, variants: ["Acenta", "Tekna"], engine: 1497, mileage: 16.2, assets: "fortuner" },

    // Ford - American Muscle
    "Figo": { basePrice: 650000, variants: ["Ambiente", "Trend", "Titanium"], engine: 1194, mileage: 18.5, assets: "swift" },
    "Aspire": { basePrice: 850000, variants: ["Ambiente", "Trend", "Titanium"], engine: 1194, mileage: 18.2, assets: "dzire" },
    "Freestyle": { basePrice: 750000, variants: ["Ambiente", "Trend", "Titanium"], engine: 1194, mileage: 18.5, assets: "creta" },
    "EcoSport": { basePrice: 1100000, variants: ["Ambiente", "Trend", "Titanium"], engine: 1497, mileage: 15.9, assets: "creta" },
    "Endeavour": { basePrice: 3500000, variants: ["Trend", "Titanium", "Titanium+"], engine: 1996, mileage: 12.4, assets: "fortuner" },

    // Jeep - Off-Road Legend
    "Compass": { basePrice: 2200000, variants: ["Sport", "Longitude", "Limited"], engine: 1956, mileage: 14.0, assets: "creta" },
    "Meridian": { basePrice: 3200000, variants: ["Longitude", "Limited", "Model S"], engine: 1956, mileage: 13.3, assets: "fortuner" },
    "Wrangler": { basePrice: 6800000, variants: ["Unlimited"], engine: 1995, mileage: 12.1, assets: "thar" },
    "Grand Cherokee": { basePrice: 7800000, variants: ["Limited", "Summit"], engine: 1995, mileage: 11.6, assets: "fortuner" }
};

const getModelInfo = (model) => {
    return MODEL_PROFILES[model] || { basePrice: 1000000, variants: ["Standard"], engine: 1498, mileage: 18.0, assets: "swift" };
};

// Generate 50 Real Cars
export const INITIAL_CARS = [
    {
        id: 1001, make: "Maruti Suzuki", model: "Swift", variant: "VXI", year: 2018, kms: 45000,
        fuel: "Petrol", transmission: "Manual", priceINR: 520000, city: "New Delhi", bodyType: "Hatchback",
        certified: true, owner: 1, sellerType: "VroomValue Certified",
        features: ["Bluetooth", "Airbags", "Power windows"], engineCapacity: 1197, mileageKmpl: 22.3,
        description: "Maruti Swift VXI in excellent condition. High mileage fuel efficient engine.",
        valuation: { fairPrice: 500000, goodPrice: 530000 },
        images: getImages(1001, 'swift')
    },
    {
        id: 1002, make: "Maruti Suzuki", model: "Dzire", variant: "ZXI", year: 2020, kms: 22000,
        fuel: "Petrol", transmission: "Manual", priceINR: 710000, city: "Gurgaon", bodyType: "Sedan",
        certified: true, owner: 1, sellerType: "VroomValue Certified",
        features: ["Push Start", "Alloys", "Airbags"], engineCapacity: 1197, mileageKmpl: 23.2,
        description: "Well maintained Dzire ZXI. Single owner, low running.",
        valuation: { fairPrice: 700000, goodPrice: 720000 },
        images: getImages(1002, 'dzire')
    },
    {
        id: 1003, make: "Mahindra", model: "Thar", variant: "LX Hard Top", year: 2021, kms: 28000,
        fuel: "Diesel", transmission: "Manual", priceINR: 1450000, city: "Pune", bodyType: "SUV",
        certified: true, owner: 1, sellerType: "VroomValue Certified",
        features: ["4x4", "Airbags", "ABS", "Alloys"], engineCapacity: 2184, mileageKmpl: 15.2,
        description: "Mahindra Thar LX - Adventure Ready! Low mileage, excellent condition.",
        valuation: { fairPrice: 1400000, goodPrice: 1500000 },
        images: getImages(1003, 'thar'),
        auction: {
            isAuction: true,
            startingBid: 1200000,
            currentBid: 1350000,
            bidCount: 8,
            highestBidder: "buyer@VroomValue.com",
            endTime: new Date(Date.now() + 60 * 1000 * 60 * 24 * 3).toISOString(), // 3 days
            minIncrement: 10000,
            reservePrice: 1400000,
            bids: [
                { id: 1, carId: 1003, userId: "buyer@VroomValue.com", amount: 1350000, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
            ]
        }
    },
    {
        id: 1004, make: "Hyundai", model: "Creta", variant: "SX", year: 2019, kms: 41000,
        fuel: "Petrol", transmission: "Automatic", priceINR: 1150000, city: "Mumbai", bodyType: "SUV",
        certified: true, owner: 1, sellerType: "VroomValue Certified",
        features: ["Sunroof", "Touchscreen", "Airbags"], engineCapacity: 1497, mileageKmpl: 16.8,
        description: "Creta SX Automatic. Premium features with Hyundai reliability.",
        valuation: { fairPrice: 1120000, goodPrice: 1180000 },
        images: getImages(1004, 'creta')
    },
    {
        id: 1005, make: "Tata", model: "Nexon", variant: "XZ+", year: 2021, kms: 15000,
        fuel: "Petrol", transmission: "Manual", priceINR: 925000, city: "Bangalore", bodyType: "Compact SUV",
        certified: true, owner: 1, sellerType: "VroomValue Certified",
        features: ["Connected Tech", "5 Star Safety", "Sunroof"], engineCapacity: 1199, mileageKmpl: 17.3,
        description: "Nexon XZ+ Dual Tone. Safest compact SUV in its segment.",
        valuation: { fairPrice: 900000, goodPrice: 950000 },
        images: getImages(1005, 'nexon')
    },

    // Dynamic Generation based on Model Profiles
    ...Array.from({ length: 45 }).map((_, index) => {
        const i = index + 1006;
        const modelNames = Object.keys(MODEL_PROFILES);
        const modelName = modelNames[index % modelNames.length];
        const profile = MODEL_PROFILES[modelName];

        const makes = {
            "Swift": "Maruti Suzuki", "Dzire": "Maruti Suzuki", "Baleno": "Maruti Suzuki",
            "Creta": "Hyundai", "Venue": "Hyundai", "Nexon": "Tata", "Harrier": "Tata",
            "Thar": "Mahindra", "XUV700": "Mahindra", "TUV300": "Mahindra",
            "City": "Honda", "Fortuner": "Toyota", "Innova": "Toyota"
        };

        const year = 2018 + (index % 7);
        const age = 2025 - year;

        // Realistic Depreciation: 10% per year + KM usage
        const kms = 15000 + (Math.floor(Math.random() * 60) * 1000);
        const depFactor = Math.pow(0.88, age);
        const calculatedPrice = Math.round(profile.basePrice * depFactor * (1 - (kms / 250000)));

        const variant = profile.variants[index % profile.variants.length];
        const bodyTypes = {
            "Swift": "Hatchback", "Baleno": "Hatchback", "Dzire": "Sedan", "City": "Sedan",
            "Creta": "SUV", "Nexon": "Compact SUV", "Venue": "Compact SUV", "Thar": "SUV",
            "XUV700": "SUV", "Fortuner": "SUV", "Innova": "MUV/MPV", "Harrier": "SUV", "TUV300": "SUV"
        };

        return {
            id: i,
            make: makes[modelName],
            model: modelName,
            variant: variant,
            year: year,
            kms: kms,
            fuel: (modelName === "Thar" || modelName === "Fortuner" || modelName === "Harrier") ? "Diesel" : "Petrol",
            transmission: (index % 3 === 0) ? "Automatic" : "Manual",
            priceINR: calculatedPrice,
            city: CITIES[index % CITIES.length],
            bodyType: bodyTypes[modelName] || "SUV",
            certified: index % 2 === 0,
            owner: (index % 5 === 0) ? 2 : 1,
            sellerType: index % 2 === 0 ? "VroomValue Certified" : "Verified Dealer",
            features: ["ABS", "Airbags", index % 2 === 0 ? "Sunroof" : "Rear camera"],
            engineCapacity: profile.engine,
            mileageKmpl: profile.mileage,
            color: COLORS[index % COLORS.length].name,
            seats: (modelName === "Fortuner" || modelName === "XUV700" || modelName === "Innova") ? "7 seater" : "5 seater",
            description: `Certified ${makes[modelName]} ${modelName} ${variant}. Well maintained family vehicle.`,
            valuation: { fairPrice: Math.round(calculatedPrice * 0.95), goodPrice: Math.round(calculatedPrice * 1.05) },
            images: getImages(i, profile.assets)
        };
    })
];

export const MOCK_DATA_VERSION = "v1.4"; 
