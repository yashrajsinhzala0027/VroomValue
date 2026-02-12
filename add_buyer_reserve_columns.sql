-- Add missing columns to cars table for buyer and reserve functionality

-- Add buyer_details column (stores buyer information when car is sold)
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS buyer_details JSONB DEFAULT NULL;

-- Add reserve_details column (stores reservation information)
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS reserve_details JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN cars.buyer_details IS 'Stores buyer information when car is marked as sold';
COMMENT ON COLUMN cars.reserve_details IS 'Stores reservation information when car is reserved';
