-- Add policies for service role to perform INSERT and UPDATE operations
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Service role can insert resumes" ON resumes;
    DROP POLICY IF EXISTS "Service role can update resumes" ON resumes;

    -- Create INSERT policy for service role
    CREATE POLICY "Service role can insert resumes"
        ON resumes FOR INSERT
        TO service_role
        WITH CHECK (true);

    -- Create UPDATE policy for service role
    CREATE POLICY "Service role can update resumes"
        ON resumes FOR UPDATE
        TO service_role
        USING (true)
        WITH CHECK (true);
END $$;

-- Grant necessary permissions to service role
GRANT ALL ON resumes TO service_role;