-- 1. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

-- 2. "cars" table: Allow public read-only access (Common and accepted)
DROP POLICY IF EXISTS "Allow public select on cars" ON cars;
CREATE POLICY "Allow public select on cars" 
ON cars FOR SELECT 
TO public 
USING (true);

-- 3. tables with STRICT restrictions (Deny Public Access)
-- These satisfy the Supabase "Policy must exist" check without allowing public access.
-- The backend uses 'service_role' which bypasses these automatically.

-- users table
DROP POLICY IF EXISTS "Allow public select on users" ON users;
DROP POLICY IF EXISTS "Allow public insert on users" ON users;
DROP POLICY IF EXISTS "Deny public access on users" ON users;
CREATE POLICY "Deny public access on users" 
ON users FOR ALL 
TO public 
USING (false) 
WITH CHECK (false);

-- sell_requests table
DROP POLICY IF EXISTS "Allow public select on sell_requests" ON sell_requests;
DROP POLICY IF EXISTS "Allow public insert on sell_requests" ON sell_requests;
DROP POLICY IF EXISTS "Deny public access on sell_requests" ON sell_requests;
CREATE POLICY "Deny public access on sell_requests" 
ON sell_requests FOR ALL 
TO public 
USING (false) 
WITH CHECK (false);

-- test_drives table
DROP POLICY IF EXISTS "Allow public select on test_drives" ON test_drives;
DROP POLICY IF EXISTS "Allow public insert on test_drives" ON test_drives;
DROP POLICY IF EXISTS "Deny public access on test_drives" ON test_drives;
CREATE POLICY "Deny public access on test_drives" 
ON test_drives FOR ALL 
TO public 
USING (false) 
WITH CHECK (false);
