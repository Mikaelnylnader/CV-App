-- Update storage configuration to allow upserts
DO $$ 
BEGIN
    -- Update resumes bucket configuration
    UPDATE storage.buckets
    SET public = true,
        file_size_limit = 10485760,  -- 10MB limit
        allowed_mime_types = ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'image/pdf'
        ]::text[],
        avif_autodetection = false
    WHERE id = 'resumes';

    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Service role can upload files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Service role can update files" ON storage.objects;
    
    -- Create new policies that allow upserts
    CREATE POLICY "Users can upload their own resumes"
        ON storage.objects 
        FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'resumes' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );

    CREATE POLICY "Service role can upload files"
        ON storage.objects 
        FOR INSERT 
        TO service_role
        WITH CHECK (bucket_id = 'resumes');

    -- Add UPDATE policies to allow overwriting files
    CREATE POLICY "Users can update their own resumes"
        ON storage.objects 
        FOR UPDATE
        TO authenticated
        USING (
            bucket_id = 'resumes' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        )
        WITH CHECK (
            bucket_id = 'resumes' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );

    CREATE POLICY "Service role can update files"
        ON storage.objects 
        FOR UPDATE
        TO service_role
        USING (bucket_id = 'resumes')
        WITH CHECK (bucket_id = 'resumes');
END $$;