const db = require('./db/db');

async function migrate() {
    try {
        console.log('🚀 Starting migration: Adding transaction columns...');

        // Add buyerDetails
        try {
            await db.execute('ALTER TABLE cars ADD COLUMN buyerDetails TEXT');
            console.log('✅ Added buyerDetails column');
        } catch (e) {
            if (e.code === 'ER_DUP_COLUMN_NAME') {
                console.log('ℹ️ buyerDetails already exists');
            } else {
                throw e;
            }
        }

        // Add reserveDetails
        try {
            await db.execute('ALTER TABLE cars ADD COLUMN reserveDetails TEXT');
            console.log('✅ Added reserveDetails column');
        } catch (e) {
            if (e.code === 'ER_DUP_COLUMN_NAME') {
                console.log('ℹ️ reserveDetails already exists');
            } else {
                throw e;
            }
        }

        console.log('✨ Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('💥 Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
