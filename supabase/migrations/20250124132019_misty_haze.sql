-- Add storage policies for service role (webhook)
DO $$ 
BEGIN
    -- Drop existing service role policies if they exist
    DROP POLICY IF EXISTS "Service role can upload files" ON storage.objects;
    DROP POLICY IF EXISTS "Service role can read files" ON storage.objects;
    
    -- Create policies for service role
    
    -- Allow service role to upload files
    CREATE POLICY "Service role can upload files"
        ON storage.objects FOR INSERT
        TO service_role
        WITH CHECK (bucket_id = 'resumes');

    -- Allow service role to read files
    CREATE POLICY "Service role can read files"
        ON storage.objects FOR SELECT
        TO service_role
        USING (bucket_id = 'resumes');

    -- Allow service role to update files
    CREATE POLICY "Service role can update files"
        ON storage.objects FOR UPDATE
        TO service_role
        USING (bucket_id = 'resumes')
        WITH CHECK (bucket_id = 'resumes');
END $$;

-- Grant necessary permissions to service role
GRANT ALL ON storage.objects TO service_role;
GRANT ALL ON storage.buckets TO service_role;