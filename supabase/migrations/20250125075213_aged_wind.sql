-- Update storage policies and configuration for cover-letters bucket
DO $$ 
BEGIN
    -- Update cover-letters bucket configuration
    UPDATE storage.buckets
    SET public = true,
        file_size_limit = 10485760,  -- 10MB limit
        allowed_mime_types = ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'image/pdf',
            'text/plain'  -- Allow text files for editing
        ]::text[],
        avif_autodetection = false
    WHERE id = 'cover-letters';

    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can upload their own cover letters" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read cover letters" ON storage.objects;
    DROP POLICY IF EXISTS "Service role can manage cover letter storage" ON storage.objects;
    DROP POLICY IF EXISTS "Users can manage their own cover letters" ON storage.objects;
    
    -- Create new policies
    
    -- Allow public read access with no restrictions
    CREATE POLICY "Public can read cover letters"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'cover-letters');

    -- Allow authenticated users to manage their own files
    CREATE POLICY "Users can manage their own cover letters"
        ON storage.objects
        FOR ALL
        TO authenticated
        USING (bucket_id = 'cover-letters')
        WITH CHECK (bucket_id = 'cover-letters');

    -- Allow service role full access
    CREATE POLICY "Service role can manage cover letter storage"
        ON storage.objects
        FOR ALL
        TO service_role
        USING (bucket_id = 'cover-letters')
        WITH CHECK (bucket_id = 'cover-letters');
END $$;

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;