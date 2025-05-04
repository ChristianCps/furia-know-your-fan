/*
  # Add email column to fan_profiles table

  1. Changes
    - Add `email` column to `fan_profiles` table
      - Type: text
      - Not nullable
      - No default value

  2. Notes
    - This migration adds the missing email column that is required for user registration
    - The column is set as NOT NULL since email is a required field in the registration form
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'fan_profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE fan_profiles 
    ADD COLUMN email text NOT NULL;
  END IF;
END $$;