-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure the bucket exists with proper configuration
DO $$ 
BEGIN
    -- Create or update the bucket
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'resumes',
        'resumes',
        true,
        10485760,  -- 10MB limit
        ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/pdf'  -- Add support for some PDF MIME types
        ]::text[]
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        public = true,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

    -- Ensure RLS is enabled
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
END $$;

-- Recreate all storage policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Public bucket access" ON storage.buckets;
    
    -- Create new policies
    CREATE POLICY "Users can upload their own resumes"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'resumes' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );

    CREATE POLICY "Public can read resumes"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'resumes');

    CREATE POLICY "Public bucket access"
        ON storage.buckets FOR SELECT
        USING (true);
END $$;