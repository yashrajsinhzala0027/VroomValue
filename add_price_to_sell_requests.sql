
-- Run this in your Supabase SQL Editor
ALTER TABLE sell_requests ADD COLUMN priceinr BIGINT DEFAULT 0;

-- Optional: If you want to populate it with existing valuation fair prices for old records
-- UPDATE sell_requests SET priceinr = (valuation->>'fairPrice')::BIGINT WHERE priceinr IS NULL OR priceinr = 0;
