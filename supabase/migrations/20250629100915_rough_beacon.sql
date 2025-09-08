/*
  # Add sort_order column to categories table

  1. Changes
    - Add `sort_order` column to `categories` table
    - Set default value to 0
    - Allow null values for backward compatibility

  2. Notes
    - This column is used for ordering navigation items in the admin interface
    - Existing categories will get the default value of 0
*/

-- Add sort_order column to categories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE categories ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
END $$;