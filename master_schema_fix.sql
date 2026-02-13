
-- MASTER SCHEMA FIX FOR VROOMVALUE
-- Run this in your Supabase SQL Editor

-- 1. Ensure sell_requests table is complete
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sell_requests' AND column_name='priceinr') THEN
        ALTER TABLE sell_requests ADD COLUMN priceinr BIGINT DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sell_requests' AND column_name='email') THEN
        ALTER TABLE sell_requests ADD COLUMN email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sell_requests' AND column_name='phone') THEN
        ALTER TABLE sell_requests ADD COLUMN phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sell_requests' AND column_name='name') THEN
        ALTER TABLE sell_requests ADD COLUMN name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sell_requests' AND column_name='status') THEN
        ALTER TABLE sell_requests ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- 2. Fix test_drives table (Adding all necessary columns)
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
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_drives' AND column_name='cartitle') THEN
        ALTER TABLE test_drives ADD COLUMN cartitle TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_drives' AND column_name='date') THEN
        ALTER TABLE test_drives ADD COLUMN date TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_drives' AND column_name='time') THEN
        ALTER TABLE test_drives ADD COLUMN time TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_drives' AND column_name='name') THEN
        ALTER TABLE test_drives ADD COLUMN name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_drives' AND column_name='phone') THEN
        ALTER TABLE test_drives ADD COLUMN phone TEXT;
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
-- 4. Fix users table and add Auth Sync Trigger
-- Ensure users table uses UUID to match auth.users (Standard Supabase Pattern)
DO $$ 
BEGIN 
    -- If id is BIGINT (legacy), we might need to change it to UUID if using Supabase Auth
    -- However, for the smoothest migration, we'll try to keep it as TEXT/UUID
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id' AND data_type='bigint') THEN
        ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::text;
    END IF;
END $$;

-- Enable the trigger to sync Supabase Auth users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, phone)
  VALUES (new.id::text, new.email, new.raw_user_meta_data->>'name', 'user', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS Policies (Security Hardening)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

-- Refined Policies to satisfy security warnings
-- Cars: Anyone can read, only authenticated can manage
DROP POLICY IF EXISTS "Allow all read" ON cars;
DROP POLICY IF EXISTS "Allow all write" ON cars;
DROP POLICY IF EXISTS "Public Read Access" ON cars;
DROP POLICY IF EXISTS "Authenticated Manage Access" ON cars;
CREATE POLICY "Public Read Access" ON cars FOR SELECT USING (true);
CREATE POLICY "Authenticated Manage Access" ON cars FOR ALL USING (auth.role() = 'authenticated');

-- Sell Requests: Public can insert (with validation), only authenticated can read/manage
DROP POLICY IF EXISTS "Allow all read" ON sell_requests;
DROP POLICY IF EXISTS "Allow all write" ON sell_requests;
DROP POLICY IF EXISTS "Public Submit Access" ON sell_requests;
DROP POLICY IF EXISTS "Authenticated View Access" ON sell_requests;
CREATE POLICY "Public Submit Access" ON sell_requests FOR INSERT WITH CHECK (email IS NOT NULL);
CREATE POLICY "Authenticated View Access" ON sell_requests FOR SELECT USING (auth.role() = 'authenticated');

-- Test Drives: Public can insert (with validation), only authenticated can read/manage
DROP POLICY IF EXISTS "Allow all read" ON test_drives;
DROP POLICY IF EXISTS "Allow all write" ON test_drives;
DROP POLICY IF EXISTS "Public Request Access" ON test_drives;
DROP POLICY IF EXISTS "Authenticated View Access" ON test_drives;
CREATE POLICY "Public Request Access" ON test_drives FOR INSERT WITH CHECK (customerphone IS NOT NULL);
CREATE POLICY "Authenticated View Access" ON test_drives FOR SELECT USING (auth.role() = 'authenticated');
