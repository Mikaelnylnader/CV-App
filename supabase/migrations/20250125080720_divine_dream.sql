-- Update storage policies for better file access
DO $$ 
BEGIN
    -- Update resumes bucket configuration
    UPDATE storage.buckets
    SET public = true,
        file_size_limit = 10485760,  -- 10MB limit
        allowed_mime_types = ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'image/pdf'
        ]::text[],
        avif_autodetection = false
    WHERE id = 'resumes';

    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Service role can manage resume storage" ON storage.objects;
    
    -- Create new policies with improved access control
    
    -- Allow public read access with no folder restrictions
    CREATE POLICY "Public can read resumes"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'resumes');

    -- Allow authenticated users to manage their own files
    CREATE POLICY "Users can manage their own resumes"
        ON storage.objects
        FOR ALL
        TO authenticated
        USING (bucket_id = 'resumes')
        WITH CHECK (bucket_id = 'resumes');

    -- Allow service role full access
    CREATE POLICY "Service role can manage resume storage"
        ON storage.objects
        FOR ALL
        TO service_role
        USING (bucket_id = 'resumes')
        WITH CHECK (bucket_id = 'resumes');
END $$;

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;