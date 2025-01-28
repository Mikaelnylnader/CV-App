-- Drop all existing storage policies first
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "global_read_access" ON storage.objects;
    DROP POLICY IF EXISTS "authenticated_file_access" ON storage.objects;
    DROP POLICY IF EXISTS "service_role_access" ON storage.objects;
    
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
            'text/plain'
        ]::text[],
        avif_autodetection = false
    WHERE id IN ('resumes', 'cover-letters');

    -- Create new storage policies
    
    -- Allow public read access for all files
    CREATE POLICY "allow_public_select"
        ON storage.objects FOR SELECT
        USING (true);

    -- Allow authenticated users to manage their own files
    CREATE POLICY "allow_authenticated_insert"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (true);

    CREATE POLICY "allow_authenticated_update"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (true)
        WITH CHECK (true);

    CREATE POLICY "allow_authenticated_delete"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (true);

    -- Allow service role full access
    CREATE POLICY "allow_service_role_all"
        ON storage.objects
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
END $$;

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;

-- Update bucket policies
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_select_buckets"
    ON storage.buckets FOR SELECT
    USING (true);