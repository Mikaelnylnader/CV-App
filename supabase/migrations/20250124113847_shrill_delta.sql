-- Add policies for INSERT and UPDATE operations on resumes table
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can insert their own resumes" ON resumes;
    DROP POLICY IF EXISTS "Users can update their own resumes" ON resumes;

    -- Create INSERT policy
    CREATE POLICY "Users can insert their own resumes"
        ON resumes FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

    -- Create UPDATE policy
    CREATE POLICY "Users can update their own resumes"
        ON resumes FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
END $$;

-- Grant necessary permissions
GRANT INSERT, UPDATE ON resumes TO authenticated;