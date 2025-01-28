-- Safe storage policy updates
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Users can read their own resumes" ON storage.objects;

    -- Create new upload policy
    CREATE POLICY "Users can upload their own resumes"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'resumes' 
            AND (storage.foldername(name))[1] IS NOT NULL
        );

    -- Create new read policy
    CREATE POLICY "Users can read their own resumes"
        ON storage.objects FOR SELECT
        TO authenticated
        USING (bucket_id = 'resumes');

    -- Update bucket visibility
    UPDATE storage.buckets
    SET public = true
    WHERE id = 'resumes';
END $$;