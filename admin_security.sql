-- ============================================
-- ADMIN SECURITY: Lock Admin Role to Single Email
-- ============================================
-- This ensures ONLY admin@vroomvalue.in can have admin privileges
-- No other user can be made admin, even through SQL

-- Step 1: Create a constraint function
CREATE OR REPLACE FUNCTION check_admin_email()
RETURNS TRIGGER AS $$
BEGIN
  -- If someone tries to set role = 'admin'
  IF NEW.role = 'admin' THEN
    -- Only allow if email is admin@vroomvalue.in
    IF NEW.email != 'admin@vroomvalue.in' THEN
      RAISE EXCEPTION 'Admin role can only be assigned to admin@vroomvalue.in';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Apply the constraint as a trigger
DROP TRIGGER IF EXISTS enforce_admin_email ON public.users;
CREATE TRIGGER enforce_admin_email
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION check_admin_email();

-- Step 3: Set admin@vroomvalue.in as admin (if account exists)
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@vroomvalue.in';

-- Step 4: Remove admin from any other accounts
UPDATE public.users 
SET role = 'user' 
WHERE email != 'admin@vroomvalue.in' AND role = 'admin';

-- Verification: Check who has admin role
SELECT email, role FROM public.users WHERE role = 'admin';
