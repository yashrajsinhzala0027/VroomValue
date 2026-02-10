const fs = require('fs');
const path = require('path');
const supabase = require('./supabaseClient');

async function migrate() {
    console.log('🚀 Starting Data Migration...');

    // 1. Migrate Users
    console.log('👥 Migrating Users...');
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json'), 'utf8'));
    const mappedUsers = usersData.map(u => ({
        ...u,
        dob: u.dob || null,
        phone: u.phone || null
    }));
    const { error: usersError } = await supabase.from('users').upsert(mappedUsers, { onConflict: 'email' });
    if (usersError) console.error('❌ Users Migration Error:', usersError.message);
    else console.log('✅ Users Migrated.');

    // 2. Migrate Cars
    console.log('🚗 Migrating Cars...');
    const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'cars.json'), 'utf8'));
    const mappedCars = carsData.map(car => {
        const price = Number(car.priceINR || car.priceinr || 0);
        if (price === 0) console.warn(`⚠️ Car ${car.id} has price 0`);

        return {
            id: car.id,
            make: car.make,
            model: car.model,
            variant: car.variant,
            year: car.year,
            priceinr: price,
            kms: car.kms,
            fuel: car.fuel,
            transmission: car.transmission,
            bodytype: car.bodyType || car.bodytype,
            city: car.city,
            sellertype: car.sellerType || car.sellertype,
            owner: car.owner,
            images: car.images,
            status: car.status,
            features: car.features,
            auction: car.auction,
            valuation: car.valuation,
            enginecapacity: car.engineCapacity || car.enginecapacity,
            mileagekmpl: car.mileageKmpl || car.mileagekmpl,
            seats: car.seats,
            color: car.color,
            rto: car.rto,
            insurancevalidity: car.insuranceValidity || car.insurancevalidity,
            accidental: car.accidental || false,
            servicehistory: car.serviceHistory === undefined ? true : car.serviceHistory,
            description: car.description
        };
    });

    const { error: carsError } = await supabase.from('cars').upsert(mappedCars, { onConflict: 'id' });
    if (carsError) console.error('❌ Cars Migration Error:', carsError.message);
    else console.log('✅ Cars Migrated.');

    // 3. Migrate Sell Requests
    console.log('📝 Migrating Sell Requests...');
    const sellPath = path.join(__dirname, '..', 'data', 'sell-requests.json');
    if (fs.existsSync(sellPath)) {
        const sellData = JSON.parse(fs.readFileSync(sellPath, 'utf8'));
        const mappedSell = sellData.map(req => ({
            id: req.id,
            make: req.make,
            model: req.model,
            variant: req.variant,
            year: req.year,
            fuel: req.fuel,
            transmission: req.transmission,
            kms: req.kms,
            owner: req.owner,
            city: req.city,
            enginecapacity: req.engineCapacity,
            mileagekmpl: req.mileageKmpl,
            seats: req.seats,
            color: req.color,
            rto: req.rto,
            insurancevalidity: req.insuranceValidity,
            accidental: req.accidental || false,
            servicehistory: req.serviceHistory === undefined ? true : req.serviceHistory,
            description: req.description,
            status: req.status,
            requestdate: req.requestDate,
            valuation: req.valuation,
            images: req.images
        }));
        const { error: sellError } = await supabase.from('sell_requests').upsert(mappedSell, { onConflict: 'id' });
        if (sellError) console.error('❌ Sell Requests Migration Error:', sellError.message);
        else console.log('✅ Sell Requests Migrated.');
    }

    // 4. Migrate Test Drives
    console.log('🕒 Migrating Test Drives...');
    const testPath = path.join(__dirname, '..', 'data', 'test-drives.json');
    if (fs.existsSync(testPath)) {
        const testData = JSON.parse(fs.readFileSync(testPath, 'utf8'));
        const mappedTest = testData.map(td => ({
            id: td.id,
            carid: td.carId,
            userid: td.userId,
            customername: td.customerName,
            customerphone: td.customerPhone,
            customeremail: td.customerEmail,
            date: td.date,
            time: td.time,
            status: td.status,
            requestedat: td.requestedAt
        }));
        const { error: testError } = await supabase.from('test_drives').upsert(mappedTest, { onConflict: 'id' });
        if (testError) console.error('❌ Test Drives Migration Error:', testError.message);
        else console.log('✅ Test Drives Migrated.');
    }

    console.log('🏁 Migration finished!');
}

migrate();
