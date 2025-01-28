-- Update storage configuration and policies for unrestricted access
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

    -- Drop existing policies
    DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
    DROP POLICY IF EXISTS "storage_user_write" ON storage.objects;
    DROP POLICY IF EXISTS "storage_service_access" ON storage.objects;
    
    -- Create new storage policies with unrestricted access
    
    -- Allow completely unrestricted public read access
    CREATE POLICY "storage_public_read"
        ON storage.objects FOR SELECT
        USING (true);

    -- Allow authenticated users to write files
    CREATE POLICY "storage_user_write"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (true);

    -- Allow service role full access
    CREATE POLICY "storage_service_access"
        ON storage.objects
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);

    -- Update bucket RLS
    ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "storage_public_buckets" ON storage.buckets;
    CREATE POLICY "storage_public_buckets"
        ON storage.buckets FOR SELECT
        USING (true);
END $$;

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;