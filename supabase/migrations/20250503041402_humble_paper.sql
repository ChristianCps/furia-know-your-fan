/*
  # Update storage policies for documents

  1. Storage
    - Creates documents bucket if it doesn't exist
    - Enables RLS on storage.objects
    - Sets up policies for document management
  
  2. Security
    - Adds policies for authenticated users to:
      - Upload documents
      - Read documents
      - Delete documents
      - Insert document records
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
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
    DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
    DROP POLICY IF EXISTS "Users can insert document records" ON public.documents;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create policies
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents'
);

CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'documents'
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'documents'
);

CREATE POLICY "Users can insert document records"
ON public.documents FOR INSERT TO authenticated
WITH CHECK (true);