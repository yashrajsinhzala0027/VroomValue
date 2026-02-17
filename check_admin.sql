-- DIAGNOSTIC: Check Admin Account Status
-- Run this to see what's happening with admin@vroomvalue.in

-- 1. Check if the account exists in the users table
SELECT 
    id, 
    email, 
    name, 
    role,
    phone,
    dob
FROM public.users 
WHERE email = 'admin@vroomvalue.in';

-- 2. Check if the account exists in Supabase Auth
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at,
    confirmed_at
FROM auth.users 
WHERE email = 'admin@vroomvalue.in';

-- 3. If the account doesn't exist in public.users, create it manually
-- Uncomment and run this if the first query returns no results:
-- INSERT INTO public.users (id, email, name, role)
-- SELECT id::text, email, 'Admin', 'admin'
-- FROM auth.users 
-- WHERE email = 'admin@vroomvalue.in'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 4. If the account exists but role is wrong, fix it
UPDATE public.users 
SET role = 'admin', name = 'Admin'
WHERE email = 'admin@vroomvalue.in';

-- 5. Final verification
SELECT email, name, role FROM public.users WHERE email = 'admin@vroomvalue.in';
