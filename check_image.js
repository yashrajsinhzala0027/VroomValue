import https from 'https';

const url = 'https://fastly-production.24c.in/cars24/car/1001/0_small.jpg';

https.get(url, (res) => {
    console.log('StatusCode:', res.statusCode);
    console.log('Headers:', res.headers);
}).on('error', (e) => {
    console.error(e);
});
