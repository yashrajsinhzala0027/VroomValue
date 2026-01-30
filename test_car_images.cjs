const db = require('./server/db/db');
const https = require('https');

async function testImages() {
    const [rows] = await db.execute('SELECT id, make, model, images FROM cars');
    console.log(`Testing images for ${rows.length} cars...`);

    for (const row of rows) {
        let images;
        try {
            images = typeof row.images === 'string' ? JSON.parse(row.images) : row.images;
        } catch (e) {
            console.error(`ID ${row.id}: JSON parse error`);
            continue;
        }

        if (!Array.isArray(images) || images.length === 0) {
            console.warn(`ID ${row.id}: No images found`);
            continue;
        }

        const firstImg = images[0].src;
        try {
            await new Promise((resolve, reject) => {
                const req = https.get(firstImg, (res) => {
                    if (res.statusCode === 200) resolve();
                    else reject(new Error(`Status ${res.statusCode}`));
                });
                req.on('error', reject);
                req.setTimeout(5000, () => {
                    req.destroy();
                    reject(new Error('Timeout'));
                });
            });
        } catch (err) {
            console.error(`ID ${row.id} (${row.make} ${row.model}): BROKEN IMAGE -> ${firstImg} [${err.message}]`);
        }
    }
    console.log('Test complete.');
    process.exit(0);
}

testImages();
