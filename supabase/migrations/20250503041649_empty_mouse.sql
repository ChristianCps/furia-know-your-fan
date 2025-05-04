/*
  # Fix Storage Policies for Document Uploads

  1. Storage Configuration
    - Creates documents bucket if it doesn't exist
    - Enables RLS on storage.objects
    - Sets up proper policies for document management
  
  2. Security
    - Adds policies for authenticated users to:
      - Upload documents to their own folder
      - Read their own documents
      - Delete their own documents
    - Adds policy for document record insertion
*/

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'documents'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('documents', 'documents', false);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can insert document records" ON public.documents;

-- Create policy to allow authenticated users to upload documents
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to read their own documents
CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to insert document records
CREATE POLICY "Users can insert document records"
ON public.documents FOR INSERT TO authenticated
WITH CHECK (true);