-- Fix cover letters storage configuration and policies
DO $$ 
BEGIN
    -- Update cover-letters bucket configuration
    UPDATE storage.buckets
    SET public = true,
        file_size_limit = 10485760,  -- 10MB limit
        allowed_mime_types = ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'image/pdf'
        ]::text[]
    WHERE id = 'cover-letters';

    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can upload their own cover letters" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read cover letters" ON storage.objects;
    DROP POLICY IF EXISTS "Service role can manage cover letter storage" ON storage.objects;

    -- Create new policies
    
    -- Allow public read access
    CREATE POLICY "Public can read cover letters"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'cover-letters');

    -- Allow authenticated users to upload
    CREATE POLICY "Users can upload their own cover letters"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'cover-letters' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );

    -- Allow service role full access
    CREATE POLICY "Service role can manage cover letter storage"
        ON storage.objects
        TO service_role
        USING (bucket_id = 'cover-letters')
        WITH CHECK (bucket_id = 'cover-letters');
END $$;

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT, INSERT ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;