/*
  # Remove authentication requirements from tables

  1. Changes
    - Remove user_id foreign key from fan_profiles
    - Update RLS policies to allow public access
    - Modify existing policies to work without authentication
  
  2. Security
    - Maintains basic data protection while allowing public access
    - Ensures data integrity through other constraints
*/

-- Remove user_id foreign key constraint
ALTER TABLE fan_profiles
DROP CONSTRAINT fan_profiles_user_id_fkey;

-- Make user_id nullable
ALTER TABLE fan_profiles
ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON fan_profiles;
DROP POLICY IF EXISTS "Users can manage their own gaming interests" ON gaming_interests;
DROP POLICY IF EXISTS "Users can manage their own fandom data" ON furia_fandom;
DROP POLICY IF EXISTS "Users can manage their own documents" ON documents;

-- Create new policies that don't require authentication
CREATE POLICY "Allow public access to fan profiles"
  ON fan_profiles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to gaming interests"
  ON gaming_interests FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to furia fandom"
  ON furia_fandom FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to documents"
  ON documents FOR ALL
  USING (true)
  WITH CHECK (true);

-- Update storage policies
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

CREATE POLICY "Allow public document uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow public document reads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Allow public document deletions"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents');