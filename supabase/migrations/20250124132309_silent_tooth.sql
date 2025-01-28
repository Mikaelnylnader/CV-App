-- Add policies for Resume from URL webhook
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Service role can manage resumes" ON resumes;
    DROP POLICY IF EXISTS "Service role can manage resume storage" ON storage.objects;

    -- Create policy for service role to manage resumes table
    CREATE POLICY "Service role can manage resumes"
        ON resumes FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);

    -- Create policy for service role to manage resume files
    CREATE POLICY "Service role can manage resume storage"
        ON storage.objects
        TO service_role
        USING (bucket_id = 'resumes')
        WITH CHECK (bucket_id = 'resumes');
END $$;

-- Add policies for Cover Letter from CV webhook
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Service role can manage cover letters" ON cover_letters;
    DROP POLICY IF EXISTS "Service role can manage cover letter storage" ON storage.objects;

    -- Create policy for service role to manage cover_letters table
    CREATE POLICY "Service role can manage cover letters"
        ON cover_letters FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);

    -- Create policy for service role to manage cover letter files
    CREATE POLICY "Service role can manage cover letter storage"
        ON storage.objects
        TO service_role
        USING (bucket_id = 'cover-letters')
        WITH CHECK (bucket_id = 'cover-letters');
END $$;

-- Grant necessary permissions to service role
GRANT ALL ON resumes TO service_role;
GRANT ALL ON cover_letters TO service_role;
GRANT ALL ON storage.objects TO service_role;
GRANT ALL ON storage.buckets TO service_role;