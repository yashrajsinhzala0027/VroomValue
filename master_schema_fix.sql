
-- MASTER SCHEMA FIX FOR VROOMVALUE
-- Run this in your Supabase SQL Editor

-- 0. FIX PERMISSIONS FIRST (Prevents 406 errors)
GRANT ALL ON public.users TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.cars TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.sell_requests TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.test_drives TO postgres, anon, authenticated, service_role;

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

    -- Ensure ID is PRIMARY KEY (Critical for UPSERT)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'users' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE users ADD PRIMARY KEY (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='dob') THEN
        ALTER TABLE users ADD COLUMN dob TEXT;
    END IF;

    -- 2. Remove password column (Supabase Auth handles passwords, not public.users)
    ALTER TABLE users DROP COLUMN IF EXISTS password;

    -- 3. REMOVE Email Uniqueness (Critical for UPSERT)
    -- This constraint causes 409 errors when Auth UID changes but Email remains
    -- We MUST drop it to allow upsert to work cleanly on ID
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
    -- DO NOT add it back.
    -- ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email); <--- REMOVED

END $$;

-- 3. The "Bulletproof" Sync Function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Try to insert the user profile
  INSERT INTO public.users (id, email, name, role, phone, dob)
  VALUES (
    new.id::text, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', 'User'), 
    'user', 
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'dob', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- If anything fails, don't block the signup
    -- The frontend "Self-Healing" code will create the profile on first login
    RAISE WARNING 'Failed to create user profile for %: %', new.email, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Re-apply Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS Policies & Permissions (Security Hardening)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

-- users: Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid()::text = id);
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Permissions (Fixes 406 Not Acceptable Errors)
GRANT ALL ON public.users TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.cars TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.sell_requests TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.test_drives TO postgres, anon, authenticated, service_role;

-- Cars: Anyone can read, only authenticated can manage
DROP POLICY IF EXISTS "Public Read Access" ON cars;
CREATE POLICY "Public Read Access" ON cars FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated Manage Access" ON cars;
CREATE POLICY "Authenticated Manage Access" ON cars FOR ALL USING (auth.role() = 'authenticated');

-- 6. ADMIN SECURITY: Lock admin role to admin@vroomvalue.in ONLY
-- This prevents anyone else from becoming admin

CREATE OR REPLACE FUNCTION check_admin_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' AND NEW.email != 'admin@vroomvalue.in' THEN
    RAISE EXCEPTION 'Admin role can only be assigned to admin@vroomvalue.in';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS enforce_admin_email ON public.users;
CREATE TRIGGER enforce_admin_email
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION check_admin_email();

-- Set admin@vroomvalue.in as the ONLY admin
UPDATE public.users SET role = 'admin' WHERE email = 'admin@vroomvalue.in';
UPDATE public.users SET role = 'user' WHERE email != 'admin@vroomvalue.in' AND role = 'admin';

-- Sell Requests: Public can insert (with validation), only authenticated can read/manage
DROP POLICY IF EXISTS "Allow all read" ON sell_requests;
DROP POLICY IF EXISTS "Allow all write" ON sell_requests;
DROP POLICY IF EXISTS "Public Submit Access" ON sell_requests;
DROP POLICY IF EXISTS "Authenticated View Access" ON sell_requests;
CREATE POLICY "Public Submit Access" ON sell_requests FOR INSERT WITH CHECK (email IS NOT NULL);
CREATE POLICY "Authenticated View Access" ON sell_requests FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all read" ON test_drives;
DROP POLICY IF EXISTS "Allow all write" ON test_drives;
DROP POLICY IF EXISTS "Public Request Access" ON test_drives;
DROP POLICY IF EXISTS "Authenticated View Access" ON test_drives;
CREATE POLICY "Public Request Access" ON test_drives FOR INSERT WITH CHECK (customerphone IS NOT NULL);
CREATE POLICY "Authenticated View Access" ON test_drives FOR SELECT USING (auth.role() = 'authenticated');

-- 7. FINAL STEP: Create/Update Admin Profile
-- This ensures admin@vroomvalue.in has admin access
DO $$
DECLARE
    admin_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM public.users WHERE email = 'admin@vroomvalue.in') INTO admin_exists;
    
    IF admin_exists THEN
        UPDATE public.users 
        SET role = 'admin', name = 'Admin'
        WHERE email = 'admin@vroomvalue.in';
        RAISE NOTICE 'Admin role updated successfully';
    ELSE
        INSERT INTO public.users (id, email, name, role)
        SELECT id::text, email, 'Admin', 'admin'
        FROM auth.users 
        WHERE email = 'admin@vroomvalue.in';
        RAISE NOTICE 'Admin profile created successfully';
    END IF;
END $$;
