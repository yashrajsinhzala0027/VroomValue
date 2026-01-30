import { getCars } from '../api/mockApi';

/**
 * Stable Intent-Based Engine (Reverted)
 */
const INTENTS = [
    {
        id: 'GREETING',
        patterns: [/hi/i, /hello/i, /hey/i, /who are you/i, /good morning/i, /good afternoon/i],
        responses: [
            "Hello! I'm your VroomValue AI assistant. I can help you find cars, check valuations, or guide you through the buying process. What's on your mind?",
            "Hi there! Welcome to VroomValue. How can I assist you with your car search today?",
            "Greetings! I'm VroomValue AI. Looking for a new ride or want to sell your current one? I'm here to help!"
        ]
    },
    {
        id: 'BUYING_PROCESS',
        patterns: [/how to buy/i, /buying process/i, /purchase/i, /book car/i, /test drive/i, /schedule/i],
        responses: [
            "Buying with VroomValue is seamless. **Browse** our collection, **schedule a doorstep test drive**, and if you love it, we handle all the **documentation and transfer** for you!",
            "To get started, just find a car you like in our 'Buy Car' section. You can book a test drive directly from the car's page. We ensure a transparent and paperless experience."
        ]
    },
    {
        id: 'SELLING_PROCESS',
        patterns: [/sell/i, /how to sell/i, /list my car/i, /get value/i, /valuation/i],
        responses: [
            "Selling is simple! Head to our **'Sell Car'** page. We provide an instant AI-powered valuation and can help you find a buyer in as little as 24 hours.",
            "Want to sell? Just give us a few details about your car on the 'Sell' page. We'll give you a competitive offer and handle the entire inspection process."
        ]
    },
    {
        id: 'CERTIFICATION',
        patterns: [/certified/i, /warranty/i, /quality/i, /inspection/i, /trust/i, /assurance/i],
        responses: [
            "Every **VroomValue Certified** car undergoes a rigorous 200-point inspection. We're so confident in our quality that we provide a 12-month warranty and a 5-day money-back guarantee.",
            "Our certification means peace of mind. Only the top 5% of cars we inspect make it to our 'Certified' list."
        ]
    },
    {
        id: 'FINANCE',
        patterns: [/loan/i, /emi/i, /finance/i, /payment/i, /budget/i, /downpayment/i],
        responses: [
            "We offer flexible financing options with starting EMIs as low as ₹5,999. Our partners include all major banks to ensure you get the best interest rates.",
            "Need a loan? We provide instant approval for eligible customers. You can check your EMI options directly on any car listing page."
        ]
    },
    {
        id: 'LOCATIONS',
        patterns: [/where/i, /location/i, /city/i, /address/i, /office/i, /service area/i],
        responses: [
            "Our main office is located in **Ahmedabad, Gujarat**. We also offer doorstep deliveries and test drives in major cities like Mumbai, Bangalore, and Delhi!",
            "VroomValue's headquarters is in **Ahmedabad**. We're currently serving tier-1 cities across India with our premium doorstep service!"
        ]
    },
    {
        id: 'HELP',
        patterns: [/help/i, /support/i, /assist/i, /how to use/i, /guide/i, /contact/i],
        responses: [
            "I'm here to help! You can ask me to **find cars** (e.g., 'SUV in Mumbai'), **check valuations**, or ask about our **certified warranty**. What do you need assistance with?",
            "Need a hand? I can guide you through **buying**, **selling**, or **financing** a car at VroomValue. Just tell me what's on your mind!"
        ]
    }
];

const getRandomResponse = (responses) => responses[Math.floor(Math.random() * responses.length)];

let lastContext = {
    carId: null,
    lastIntent: null
};

export const analyzeRequest = async (userMessage) => {
    const msg = userMessage.toLowerCase().trim();
    const cars = await getCars({});

    // 1. INTENT MATCHING
    let matchedIntent = null;
    let maxConfidence = 0;

    for (const intent of INTENTS) {
        let confidence = 0;
        intent.patterns.forEach(pattern => {
            if (pattern.test(msg)) confidence += 10;
        });

        if (confidence > maxConfidence) {
            maxConfidence = confidence;
            matchedIntent = intent;
        }
    }

    // 2. DATA EXTRACTION
    let filters = {
        maxPrice: Infinity,
        minPrice: 0,
        city: null,
        make: null,
        model: null
    };

    const cities = ["new delhi", "delhi", "mumbai", "bangalore", "pune", "ahmedabad", "gurgaon", "noida"];
    cities.forEach(city => { if (msg.includes(city)) filters.city = city; });
    const knownBrands = ["maruti", "suzuki", "mahindra", "hyundai", "toyota", "honda", "tata", "kia", "mg"];
    knownBrands.forEach(brand => { if (msg.includes(brand)) filters.make = brand; });

    const allModels = Array.from(new Set(cars.map(c => c.model.toLowerCase())));
    let targetModel = null;
    allModels.forEach(model => { if (msg.includes(model)) targetModel = model; });

    const priceMatch = msg.match(/(\d+(\.\d+)?)\s*(lakh|l|cr|k)?/i);
    if (priceMatch) {
        let val = parseFloat(priceMatch[1]);
        const unit = priceMatch[3]?.toLowerCase();
        if (unit === 'lakh' || unit === 'l') val *= 100000;
        else if (unit === 'cr') val *= 10000000;
        else if (unit === 'k') val *= 1000;
        else if (val < 100) val *= 100000;

        if (msg.includes('under') || msg.includes('below')) filters.maxPrice = val;
        else if (msg.includes('above') || msg.includes('over')) filters.minPrice = val;
        else filters.maxPrice = val * 1.1;
    }

    // 3. RECOMMENDATIONS
    const hasFilters = filters.city || filters.make || targetModel || filters.maxPrice !== Infinity;

    const recommendations = hasFilters ? cars
        .filter(car => {
            if (filters.city && !car.city.toLowerCase().includes(filters.city)) return false;
            if (filters.make && !car.make.toLowerCase().includes(filters.make)) return false;
            if (targetModel && car.model.toLowerCase() !== targetModel) return false;
            if (car.priceINR > filters.maxPrice || car.priceINR < filters.minPrice) return false;
            return true;
        })
        .sort((a, b) => (b.certified ? 1 : 0) - (a.certified ? 1 : 0))
        .slice(0, 3) : [];

    // 4. RESPONSE GENERATION
    let finalText = "";

    if (targetModel && recommendations.length > 0) {
        const car = recommendations[0];
        finalText = `The **${car.make} ${car.model}** is an excellent choice. Our current listings have it for around **₹${(car.priceINR / 100000).toFixed(1)} Lakh**. It features a **${car.engineCapacity}cc** engine and gives a mileage of **${car.mileageKmpl} kmpl**. Would you like to see more details?`;
    } else if (recommendations.length > 0) {
        const topCar = recommendations[0];
        finalText = `I've found ${recommendations.length} cars that match your search. I highly recommend the **${topCar.make} ${topCar.model}** in ${topCar.city}. It's a ${topCar.certified ? 'Certified' : 'verified'} car with ${topCar.kms.toLocaleString()} km on the clock.`;
    } else if (matchedIntent) {
        finalText = getRandomResponse(matchedIntent.responses);
    } else {
        finalText = "I'm not quite sure I understood that. You can ask me things like 'Show me SUVs under 10 lakh', 'How do I sell my car?', or ask about our **Ahmedabad office**. How can I help?";
    }

    lastContext.lastIntent = matchedIntent?.id;
    if (recommendations.length > 0) lastContext.carId = recommendations[0].id;

    return {
        message: finalText,
        cars: recommendations
    };
};
