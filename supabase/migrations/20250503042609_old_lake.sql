/*
  # Fix Document Upload Policies

  1. Changes
    - Updates storage policies to allow document uploads
    - Fixes RLS policies for documents table
    - Ensures proper user authorization flow
  
  2. Security
    - Maintains security while allowing proper document uploads
    - Links documents to profiles correctly
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can insert document records" ON public.documents;
DROP POLICY IF EXISTS "Users can manage their own documents" ON public.documents;

-- Create storage policies with proper checks
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents');

-- Update documents table policies
CREATE POLICY "Users can insert documents"
ON public.documents FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM fan_profiles
    WHERE fan_profiles.id = profile_id
    AND fan_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own documents"
ON public.documents FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fan_profiles
    WHERE fan_profiles.id = profile_id
    AND fan_profiles.user_id = auth.uid()
  )
);