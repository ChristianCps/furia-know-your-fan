/*
  # Create documents storage bucket

  1. New Storage Bucket
    - Creates a new storage bucket named 'documents' for storing user identification documents
  
  2. Security
    - Enables RLS on the bucket
    - Adds policies for authenticated users to:
      - Upload their own documents
      - Read only their own documents
      - Delete their own documents
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to read their own documents
CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);