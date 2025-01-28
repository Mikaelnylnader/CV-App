-- Update cover-letters bucket configuration and policies
DO $$ 
BEGIN
    -- Ensure bucket exists with proper configuration
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'cover-letters',
        'cover-letters',
        true,  -- Make bucket public
        10485760,  -- 10MB limit
        ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'image/pdf'
        ]::text[]
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        public = true,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;

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
        FOR ALL
        TO service_role
        USING (bucket_id = 'cover-letters')
        WITH CHECK (bucket_id = 'cover-letters');
END $$;

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT, INSERT ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;