
-- MASTER SCHEMA FIX FOR VROOMVALUE
-- Run this in your Supabase SQL Editor

-- 1. Ensure sell_requests has priceinr
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sell_requests' AND column_name='priceinr') THEN
        ALTER TABLE sell_requests ADD COLUMN priceinr BIGINT DEFAULT 0;
    END IF;
END $$;

-- 2. Fix test_drives table (Adding missing columns)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_drives' AND column_name='carid') THEN
        ALTER TABLE test_drives ADD COLUMN carid BIGINT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_drives' AND column_name='userid') THEN
        ALTER TABLE test_drives ADD COLUMN userid BIGINT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_drives' AND column_name='customername') THEN
        ALTER TABLE test_drives ADD COLUMN customername TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_drives' AND column_name='customerphone') THEN
        ALTER TABLE test_drives ADD COLUMN customerphone TEXT;
    END IF;
END $$;

-- 3. Ensure cars table has all necessary mapping columns
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cars' AND column_name='priceinr') THEN
        ALTER TABLE cars ADD COLUMN priceinr BIGINT DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cars' AND column_name='buyer_details') THEN
        ALTER TABLE cars ADD COLUMN buyer_details JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cars' AND column_name='reserve_details') THEN
        ALTER TABLE cars ADD COLUMN reserve_details JSONB;
    END IF;
END $$;
