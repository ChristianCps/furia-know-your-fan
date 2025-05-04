/*
  # Create all required storage buckets

  1. Storage Buckets
    - Creates all necessary storage buckets for the application
    - Sets appropriate permissions and policies
  
  2. Security
    - Enables RLS on storage.objects
    - Sets up proper access policies for each bucket
*/

-- Create necessary buckets if they don't exist
DO $$
BEGIN
    -- Documents bucket
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'documents'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('documents', 'documents', false);
    END IF;

    -- Profile pictures bucket
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'avatars'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', true);
    END IF;

    -- General uploads bucket
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'uploads'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('uploads', 'uploads', false);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for documents bucket
CREATE POLICY "Give users access to own folder 1" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create policies for avatars bucket (public read, authenticated write)
CREATE POLICY "Give public access to avatars 1" ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated users to upload avatars 1" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Create policies for uploads bucket
CREATE POLICY "Give users access to own folder in uploads 1" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);