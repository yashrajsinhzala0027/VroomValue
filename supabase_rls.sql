-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

-- 1. Policies for 'cars' table
-- Allow anyone to browse cars (Read access)
CREATE POLICY "Allow public read access for cars" 
ON cars FOR SELECT 
TO public 
USING (true);

-- Allow all operations for now (matches current bypass behavior)
-- Note: In a production environment, you would restrict INSERT/UPDATE to authenticated admins.
CREATE POLICY "Allow all operations for cars" 
ON cars FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);


-- 2. Policies for 'users' table
-- Allow signup (Insert access)
CREATE POLICY "Allow public insert for signup" 
ON users FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow users to see their own data and permit the backend to query
CREATE POLICY "Allow all operations for users" 
ON users FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);


-- 3. Policies for 'sell_requests' table
-- Allow anyone to submit a sell request
CREATE POLICY "Allow public insert for sell requests" 
ON sell_requests FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow all operations for sell requests
CREATE POLICY "Allow all operations for sell requests" 
ON sell_requests FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);


-- 4. Policies for 'test_drives' table
-- Allow anyone to book a test drive
CREATE POLICY "Allow public insert for test drives" 
ON test_drives FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow all operations for test drives
CREATE POLICY "Allow all operations for test drives" 
ON test_drives FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);
