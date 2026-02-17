-- SIMPLE FIX: Set admin@vroomvalue.in as admin
-- Just run this entire file in Supabase SQL Editor

-- Update the role to admin
UPDATE public.users 
SET role = 'admin', name = 'Admin'
WHERE email = 'admin@vroomvalue.in';

-- Verify it worked
SELECT email, name, role FROM public.users WHERE email = 'admin@vroomvalue.in';

-- Expected result: Should show role = 'admin'
-- After running this, refresh your website and the Admin Dashboard link will appear!
