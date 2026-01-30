const mockQuery = (queryParams) => {
    let query = 'SELECT * FROM cars WHERE 1=1';
    let params = [];

    const { city, make, maxPrice, minPrice, fuel, transmission, bodyType, isAuction, includeExpired, search } = queryParams;

    if (city) {
        query += ' AND LOWER(city) = ?';
        params.push(city.toLowerCase());
    }
    if (make) {
        if (Array.isArray(make)) {
            console.log("MAKE IS ARRAY:", make);
            // This is what the current backend DOES NOT DO
            // query += ` AND make IN (${make.map(() => '?').join(',')})`;
            // params.push(...make);

            // This is what CURRENT backend DOES
            query += ' AND make = ?';
            params.push(make);
        } else {
            query += ' AND make = ?';
            params.push(make);
        }
    }

    console.log("QUERY:", query);
    console.log("PARAMS:", params);
};

console.log("--- TEST 1: SINGLE MAKE ---");
mockQuery({ make: "Maruti" });

console.log("\n--- TEST 2: MULTIPLE MAKES (ARRAY) ---");
mockQuery({ make: ["Maruti", "Hyundai"] });
