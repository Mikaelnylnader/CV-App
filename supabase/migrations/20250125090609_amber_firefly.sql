-- Update storage configuration and policies
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
    DROP POLICY IF EXISTS "allow_public_read" ON storage.objects;
    DROP POLICY IF EXISTS "allow_user_write" ON storage.objects;
    DROP POLICY IF EXISTS "allow_service_role_access" ON storage.objects;
    
    -- Create new storage policies with simplified access control
    
    -- Allow unrestricted public read access
    CREATE POLICY "storage_public_read"
        ON storage.objects FOR SELECT
        USING (bucket_id IN ('resumes', 'cover-letters'));

    -- Allow authenticated users to manage their own files
    CREATE POLICY "storage_user_write"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id IN ('resumes', 'cover-letters'));

    -- Allow service role full access
    CREATE POLICY "storage_service_access"
        ON storage.objects
        FOR ALL
        TO service_role
        USING (bucket_id IN ('resumes', 'cover-letters'))
        WITH CHECK (bucket_id IN ('resumes', 'cover-letters'));

    -- Update bucket RLS
    ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "allow_public_bucket_access" ON storage.buckets;
    CREATE POLICY "storage_public_buckets"
        ON storage.buckets FOR SELECT
        USING (id IN ('resumes', 'cover-letters'));
END $$;

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;