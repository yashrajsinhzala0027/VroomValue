const fs = require('fs');
const path = require('path');

const models = [
    { make: "Maruti Suzuki", name: "Swift", basePrice: 750000, type: "Hatchback", engine: 1197, mileage: 22.3, assets: "swift" },
    { make: "Maruti Suzuki", name: "Dzire", basePrice: 820000, type: "Sedan", engine: 1197, mileage: 23.2, assets: "dzire" },
    { make: "Hyundai", name: "Creta", basePrice: 1650000, type: "SUV", engine: 1497, mileage: 16.8, assets: "creta" },
    { make: "Tata", name: "Nexon", basePrice: 1100000, type: "Compact SUV", engine: 1199, mileage: 17.3, assets: "nexon" },
    { make: "Mahindra", name: "Thar", basePrice: 1550000, type: "SUV", engine: 2184, mileage: 15.2, assets: "thar" },
    { make: "Toyota", name: "Fortuner", basePrice: 4200000, type: "SUV", engine: 2755, mileage: 10.4, assets: "fortuner" },
    { make: "Honda", name: "City", basePrice: 1500000, type: "Sedan", engine: 1498, mileage: 17.8, assets: "city" },
    { make: "Mahindra", name: "XUV700", basePrice: 2400000, type: "SUV", engine: 2198, mileage: 13.5, assets: "thar" }
];

const cities = ["New Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Ahmedabad", "Gurgaon", "Chennai"];

const cars = [];

for (let i = 0; i < 50; i++) {
    const model = models[i % models.length];
    const year = 2018 + (i % 6);
    const age = 2025 - year;
    const kms = 10000 + (Math.floor(Math.random() * 60) * 1000);
    const depFactor = Math.pow(0.88, age);
    const price = Math.round(model.basePrice * depFactor * (1 - (kms / 300000)));

    cars.push({
        id: 1001 + i,
        make: model.make,
        model: model.name,
        variant: "Standard",
        year: year,
        kms: kms,
        fuel: (model.name === "Thar" || model.name === "Fortuner") ? "Diesel" : "Petrol",
        transmission: (i % 3 === 0) ? "Automatic" : "Manual",
        priceINR: price,
        city: cities[i % cities.length],
        bodyType: model.type,
        certified: i % 2 === 0,
        owner: 1,
        status: "approved",
        sellerType: "Velocity Certified",
        engineCapacity: model.engine,
        mileageKmpl: model.mileage,
        description: `Stunning ${model.make} ${model.name} in great condition.`,
        valuation: { fairPrice: Math.round(price * 0.95), goodPrice: Math.round(price * 1.05) },
        images: [
            { id: `${1001 + i}-f`, type: "exterior-front", src: `https://fastly-production.24c.in/cars24/car/${1001 + i}/0_small.jpg` }
        ]
    });
}

// Add specifically Thar for auctions as promised
cars[2].auction = {
    isAuction: true,
    startingBid: cars[2].priceINR * 0.8,
    currentBid: cars[2].priceINR * 0.9,
    bidCount: 5,
    highestBidder: "buyer@velocity.com",
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    minIncrement: 10000,
    reservePrice: cars[2].priceINR,
    bids: []
};

fs.writeFileSync('server/data/cars.json', JSON.stringify(cars, null, 2));
console.log("Successfully seeded 50 approved cars.");
