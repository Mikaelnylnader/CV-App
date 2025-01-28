-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Safely update bucket configuration
DO $$ 
BEGIN
    -- Create bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'resumes',
        'resumes',
        true,
        10485760,  -- 10MB limit
        ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]::text[]
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        public = EXCLUDED.public,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;
END $$;

-- Safely recreate policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Users can read their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
    
    -- Create new policies
    CREATE POLICY "Users can upload their own resumes"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'resumes' 
            AND (storage.foldername(name))[1] = auth.uid()::text
        );

    CREATE POLICY "Public can read resumes"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'resumes');
END $$;

-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Ensure buckets are accessible
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access"
    ON storage.buckets FOR SELECT
    USING (true);