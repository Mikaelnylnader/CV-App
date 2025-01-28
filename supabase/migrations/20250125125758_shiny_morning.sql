-- Update bucket configurations and policies for unrestricted access
DO $$ 
BEGIN
    -- Update bucket configurations
    UPDATE storage.buckets
    SET public = true,
        file_size_limit = 10485760,  -- 10MB limit
        allowed_mime_types = ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'image/pdf',
            'text/plain',
            '*/*'  -- Allow any MIME type as fallback
        ]::text[],
        avif_autodetection = false
    WHERE id IN ('resumes', 'cover-letters');

    -- Drop all existing policies
    DROP POLICY IF EXISTS "allow_read" ON storage.objects;
    DROP POLICY IF EXISTS "allow_write" ON storage.objects;
    DROP POLICY IF EXISTS "allow_service" ON storage.objects;
    DROP POLICY IF EXISTS "allow_buckets" ON storage.buckets;
    
    -- Create maximally permissive policies for testing
    
    -- Allow unrestricted public read access
    CREATE POLICY "allow_public_select"
        ON storage.objects FOR SELECT
        USING (true);

    -- Allow authenticated users full access
    CREATE POLICY "allow_authenticated_all"
        ON storage.objects
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);

    -- Allow service role full access
    CREATE POLICY "allow_service_role_all"
        ON storage.objects
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);

    -- Allow bucket access
    CREATE POLICY "allow_public_buckets"
        ON storage.buckets FOR SELECT
        USING (true);

    -- Grant permissions
    GRANT SELECT ON storage.objects TO anon;
    GRANT ALL ON storage.objects TO authenticated;
    GRANT ALL ON storage.objects TO service_role;
END $$;