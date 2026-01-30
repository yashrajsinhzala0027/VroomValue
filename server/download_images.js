const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'public', 'cars');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Premium High-Res Unsplash IDs
const images = {
    'swift.jpg': 'https://images.unsplash.com/photo-1542362567-b05486f03e23?q=80&w=1000',
    'city.jpg': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
    'creta.jpg': 'https://images.unsplash.com/photo-1615822606412-2c6c0b396e95?q=80&w=1000', // Better Creta
    'thar.jpg': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000', // Serious Offroad
    'fortuner.jpg': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000', // Big SUV
    'luxury.jpg': 'https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=1000', // Premium BMW
    'innova.jpg': 'https://images.unsplash.com/photo-1632245889027-e8c3cbda117d?q=80&w=1000', // Elite Van
    'fronx.jpg': 'https://images.unsplash.com/photo-1621370217578-1a55928d3bd8?q=80&w=1000', // Modern Crossover
    'kwid.jpg': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000' // Stylish City car
};

console.log(`Starting premium image download to ${targetDir}...`);

async function download(filename, url) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(targetDir, filename);
        const file = fs.createWriteStream(filePath);

        https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    const stats = fs.statSync(filePath);
                    if (stats.size > 200) {
                        console.log(`✅ ${filename} downloaded (${Math.round(stats.size / 1024)} KB)`);
                        resolve();
                    } else {
                        fs.unlinkSync(filePath);
                        reject(new Error(`File too small: ${stats.size} bytes`));
                    }
                });
            } else {
                file.close();
                fs.unlinkSync(filePath);
                reject(new Error(`Status ${response.statusCode}`));
            }
        }).on('error', (err) => {
            file.close();
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            reject(err);
        });
    });
}

async function run() {
    for (const [filename, url] of Object.entries(images)) {
        try {
            await download(filename, url);
        } catch (err) {
            console.error(`❌ Failed ${filename}: ${err.message}`);
            // Fallback for key ones
            if (filename === 'creta.jpg' || filename === 'thar.jpg') {
                console.log(`Refining ${filename} search...`);
                try {
                    await download(filename, 'https://images.unsplash.com/photo-1542362567-b05486f03e23?q=80&w=1000');
                } catch (e) {
                    console.error(`Double fail ${filename}`);
                }
            }
        }
    }
    console.log("Download complete.");
}

run();
