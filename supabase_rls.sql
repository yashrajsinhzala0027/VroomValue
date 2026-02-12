-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

-- 1. Policies for 'cars' table
-- Allow anyone to browse cars (Public Read access)
DROP POLICY IF EXISTS "Allow public read access for cars" ON cars;
CREATE POLICY "Allow public read access for cars" 
ON cars FOR SELECT 
TO public 
USING (true);

-- 2. Explicit Restricted Policies for other tables
-- These satisfy the Supabase linter ("policy must exist") while denying public access.
-- The backend (Node.js) bypasses these using the 'service_role' key.

-- users table
DROP POLICY IF EXISTS "Allow public insert for signup" ON users;
DROP POLICY IF EXISTS "Restricted access for users" ON users;
CREATE POLICY "Restricted access for users" 
ON users FOR ALL 
TO public 
USING (false) 
WITH CHECK (false);

-- sell_requests table
DROP POLICY IF EXISTS "Allow public insert for sell requests" ON sell_requests;
DROP POLICY IF EXISTS "Restricted access for sell requests" ON sell_requests;
CREATE POLICY "Restricted access for sell requests" 
ON sell_requests FOR ALL 
TO public 
USING (false) 
WITH CHECK (false);

-- test_drives table
DROP POLICY IF EXISTS "Allow public insert for test drives" ON test_drives;
DROP POLICY IF EXISTS "Restricted access for test drives" ON test_drives;
CREATE POLICY "Restricted access for test drives" 
ON test_drives FOR ALL 
TO public 
USING (false) 
WITH CHECK (false);
