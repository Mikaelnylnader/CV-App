-- Drop all existing storage policies first
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "public_read_all" ON storage.objects;
    DROP POLICY IF EXISTS "authenticated_write_own" ON storage.objects;
    DROP POLICY IF EXISTS "authenticated_update_own" ON storage.objects;
    DROP POLICY IF EXISTS "authenticated_delete_own" ON storage.objects;
    DROP POLICY IF EXISTS "service_role_all" ON storage.objects;
    
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

    -- Create new storage policies with simplified access control
    
    -- Allow public read access for all files
    CREATE POLICY "allow_public_read"
        ON storage.objects FOR SELECT
        USING (true);

    -- Allow authenticated users to manage files in their folder
    CREATE POLICY "allow_user_write"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

    -- Allow service role full access
    CREATE POLICY "allow_service_role_access"
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

DROP POLICY IF EXISTS "public_select_buckets" ON storage.buckets;
CREATE POLICY "allow_public_bucket_access"
    ON storage.buckets FOR SELECT
    USING (true);