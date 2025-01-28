-- Simplified policies for Make.com webhook integration
DO $$ 
BEGIN
    -- 1. Configure storage buckets
    UPDATE storage.buckets
    SET public = true
    WHERE id IN ('resumes', 'cover-letters');

    -- 2. Create essential storage policies
    
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Public can read files" ON storage.objects;
    DROP POLICY IF EXISTS "Service role full access" ON storage.objects;
    
    -- Public read access for both buckets
    CREATE POLICY "Public can read files"
        ON storage.objects FOR SELECT
        USING (bucket_id IN ('resumes', 'cover-letters'));

    -- Service role full access for webhooks
    CREATE POLICY "Service role full access"
        ON storage.objects
        TO service_role
        USING (bucket_id IN ('resumes', 'cover-letters'))
        WITH CHECK (bucket_id IN ('resumes', 'cover-letters'));

    -- 3. Essential table policies are already created in previous migrations
    -- No need to recreate them, just ensure permissions are granted
END $$;

-- Grant necessary permissions
GRANT ALL ON storage.objects TO service_role;
GRANT ALL ON storage.buckets TO service_role;
GRANT ALL ON resumes TO service_role;
GRANT ALL ON cover_letters TO service_role;