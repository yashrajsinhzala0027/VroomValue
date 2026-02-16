
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
-- Ensure users table uses TEXT for ID to match Supabase UUIDs
DO $$ 
BEGIN 
    -- 1. Correct Column Types & Existence
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id' AND data_type='bigint') THEN
        ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='dob') THEN
        ALTER TABLE users ADD COLUMN dob TEXT;
    END IF;

    -- 2. Ensure Email Uniqueness (Critical for UPSERT)
    -- We drop any old constraint name first to be sure
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
    ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);

END $$;

-- 3. The "Bulletproof" Sync Function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, phone, dob)
  VALUES (
    new.id::text, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', ''), 
    'user', 
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'dob'
  )
  ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id, -- Update ID to match Auth UUID if it was different
    name = CASE WHEN EXCLUDED.name <> '' THEN EXCLUDED.name ELSE public.users.name END,
    phone = CASE WHEN EXCLUDED.phone IS NOT NULL THEN EXCLUDED.phone ELSE public.users.phone END,
    dob = CASE WHEN EXCLUDED.dob IS NOT NULL THEN EXCLUDED.dob ELSE public.users.dob END;
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Re-apply Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS Policies (Security Hardening)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

-- users: Users can read their own profile, anyone authenticated can read basic info if needed, 
-- but for simplicity/privacy: User can only read/update their own.
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid()::text = id);
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);

-- Cars: Anyone can read, only authenticated can manage
DROP POLICY IF EXISTS "Public Read Access" ON cars;
CREATE POLICY "Public Read Access" ON cars FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated Manage Access" ON cars;
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
