-- Ensure cover-letters bucket exists with proper configuration
DO $$ 
BEGIN
    -- Create or update the bucket
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'cover-letters',
        'cover-letters',
        true,
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

    -- Ensure RLS is enabled
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
END $$;

-- Recreate all storage policies for cover-letters bucket
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can upload their own cover letters" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read cover letters" ON storage.objects;
    DROP POLICY IF EXISTS "Public bucket access" ON storage.buckets;
    
    -- Create new policies
    CREATE POLICY "Users can upload their own cover letters"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'cover-letters' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );

    CREATE POLICY "Public can read cover letters"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'cover-letters');

    CREATE POLICY "Public bucket access"
        ON storage.buckets FOR SELECT
        USING (true);
END $$;

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;