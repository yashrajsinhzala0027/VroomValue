const { exec } = require('child_process');

console.log("🧹 Deep Cleaning VroomValue Processes...");

const commands = [
    'taskkill /F /IM node.exe /T',
    'taskkill /F /IM cmd.exe /T',
    'npx kill-port 5000',
    'npx kill-port 5173'
];

let count = 0;
commands.forEach(cmd => {
    exec(cmd, (err, stdout, stderr) => {
        count++;
        console.log(`Executed: ${cmd}`);
        if (count === commands.length) {
            console.log("\n✅ ALL CLEAR! Now follow these steps:");
            console.log("1. Open ONE terminal.");
            console.log("2. Run: node server/index.js");
            console.log("3. Open SECOND terminal.");
            console.log("4. Run: npm run dev");
            console.log("5. Refresh your browser.");
        }
    });
});
