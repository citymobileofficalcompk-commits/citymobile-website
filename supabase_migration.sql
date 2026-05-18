-- Add product_ids column to offers table to store attached products
ALTER TABLE offers ADD COLUMN IF NOT EXISTS product_ids text[] DEFAULT '{}';

-- Create an index to optimize product lookups if needed
-- CREATE INDEX IF NOT EXISTS idx_offers_product_ids ON offers USING gin(product_ids);
