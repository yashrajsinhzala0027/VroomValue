-- 1. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

-- 2. "cars" table policies
-- Allow public read-only access
DROP POLICY IF EXISTS "Allow public select on cars" ON cars;
CREATE POLICY "Allow public select on cars" 
ON cars FOR SELECT 
TO public 
USING (true);

-- Remove old permissive policies (if they exist)
DROP POLICY IF EXISTS "Allow backend update on cars" ON cars;
DROP POLICY IF EXISTS "Allow backend insert on cars" ON cars;

-- Note: UPDATE and INSERT operations are handled by the backend using the service_role key,
-- which automatically bypasses RLS. No additional policies needed.

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

-- ADMIN POLICIES: Required for Approval/Rejection workflow
DROP POLICY IF EXISTS "Allow admins to delete sell_requests" ON "public"."sell_requests";
CREATE POLICY "Allow admins to delete sell_requests" ON "public"."sell_requests"
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Allow admins to update sell_requests" ON "public"."sell_requests";
CREATE POLICY "Allow admins to update sell_requests" ON "public"."sell_requests"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
  )
);

-- test_drives table
-- 1. Permit anyone to book a test drive (Guests and Users)
-- Refined to satisfy security linter while allowing guest access
DROP POLICY IF EXISTS "Allow public insert on test_drives" ON test_drives;
CREATE POLICY "Allow public insert on test_drives" 
ON test_drives FOR INSERT 
TO public 
WITH CHECK (
  status = 'pending' AND 
  (userid IS NULL OR userid::text = auth.uid()::text)
);

-- 2. Permit admins to manage all test drives
DROP POLICY IF EXISTS "Allow admins full access on test_drives" ON test_drives;
CREATE POLICY "Allow admins full access on test_drives" 
ON test_drives FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
  )
);

-- 3. Permit users to see their own requests
DROP POLICY IF EXISTS "Allow users to view own test_drives" ON test_drives;
CREATE POLICY "Allow users to view own test_drives" 
ON test_drives FOR SELECT 
TO authenticated
USING (userid::text = auth.uid()::text);
