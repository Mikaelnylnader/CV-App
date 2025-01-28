-- Ensure the bucket exists with proper configuration
DO $$
BEGIN
    -- Create the bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'resumes',
        'resumes',
        false,
        10485760,  -- 10MB limit
        ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[]
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        public = false,
        file_size_limit = 10485760,
        allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[];

    -- Ensure RLS is enabled
    UPDATE storage.buckets
    SET owner = null,
        public = false
    WHERE id = 'resumes';
END $$;

-- Recreate storage policies
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own resumes" ON storage.objects;

CREATE POLICY "Users can upload their own resumes"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'resumes' 
        AND auth.uid()::text = (storage.foldername(name))[1]
        AND array_length(string_to_array(name, '/'), 1) = 2
    );

CREATE POLICY "Users can read their own resumes"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'resumes' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );