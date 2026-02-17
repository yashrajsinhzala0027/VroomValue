-- ============================================
-- FINAL COMPLETE FIX FOR ADMIN ACCESS
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- Step 1: Fix permissions (This fixes the 406 error)
GRANT ALL ON public.users TO postgres, anon, authenticated, service_role;

-- Step 2: Check if admin profile exists
DO $$
DECLARE
    admin_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM public.users WHERE email = 'admin@vroomvalue.in') INTO admin_exists;
    
    IF admin_exists THEN
        -- Profile exists, just update the role
        UPDATE public.users 
        SET role = 'admin', name = 'Admin'
        WHERE email = 'admin@vroomvalue.in';
        RAISE NOTICE 'Admin role updated successfully';
    ELSE
        -- Profile doesn't exist, create it
        INSERT INTO public.users (id, email, name, role)
        SELECT id::text, email, 'Admin', 'admin'
        FROM auth.users 
        WHERE email = 'admin@vroomvalue.in';
        RAISE NOTICE 'Admin profile created successfully';
    END IF;
END $$;

-- Step 3: Verify the fix
SELECT 
    email, 
    name, 
    role,
    id
FROM public.users 
WHERE email = 'admin@vroomvalue.in';

-- Expected result: Should show role = 'admin'
-- After running this, refresh your website and log in!
