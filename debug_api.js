import http from 'http';

http.get('http://localhost:5000/api/cars', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const cars = JSON.parse(data);
            console.log("Total Cars:", cars.length);
            if (cars.length > 0) {
                console.log("First Car ID:", cars[0].id);
                console.log("Images Type:", typeof cars[0].images);
                console.log("Images Value:", cars[0].images);
            }
        } catch (e) {
            console.error("Parse Error:", e);
            console.log("Raw Data:", data.slice(0, 500));
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
