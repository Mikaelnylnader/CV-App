-- Drop all existing storage policies first
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "public_read" ON storage.objects;
    DROP POLICY IF EXISTS "authenticated_access" ON storage.objects;
    DROP POLICY IF EXISTS "service_role_access" ON storage.objects;
    
    -- Update bucket configurations
    UPDATE storage.buckets
    SET public = true,
        file_size_limit = 10485760,  -- 10MB limit
        allowed_mime_types = ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'image/pdf',
            'text/plain',
            '*/*'  -- Allow any MIME type as fallback
        ]::text[],
        avif_autodetection = false
    WHERE id IN ('resumes', 'cover-letters');

    -- Create new storage policies
    
    -- Allow unrestricted public read access
    CREATE POLICY "public_read_all"
        ON storage.objects FOR SELECT
        USING (true);

    -- Allow authenticated users to manage their own files
    CREATE POLICY "authenticated_write_own"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

    CREATE POLICY "authenticated_update_own"
        ON storage.objects
        FOR UPDATE
        TO authenticated
        USING (auth.uid()::text = (storage.foldername(name))[1])
        WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

    CREATE POLICY "authenticated_delete_own"
        ON storage.objects
        FOR DELETE
        TO authenticated
        USING (auth.uid()::text = (storage.foldername(name))[1]);

    -- Allow service role full access
    CREATE POLICY "service_role_all"
        ON storage.objects
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
END $$;

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;

-- Update bucket policies
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_public_select_buckets" ON storage.buckets;
CREATE POLICY "public_select_buckets"
    ON storage.buckets FOR SELECT
    USING (true);

-- Create function to clean file paths
CREATE OR REPLACE FUNCTION clean_file_path(path text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    -- Remove duplicate .pdf extensions
    WHILE path LIKE '%.pdf.pdf' LOOP
        path := substring(path from 1 for length(path) - 4);
    END LOOP;
    
    -- Ensure .pdf extension
    IF NOT path LIKE '%.pdf' THEN
        path := path || '.pdf';
    END IF;
    
    RETURN path;
END;
$$;

-- Update existing file paths
UPDATE resumes 
SET 
    original_file_path = clean_file_path(original_file_path),
    optimized_file_path = 
        CASE 
            WHEN optimized_file_path IS NOT NULL 
            THEN clean_file_path(optimized_file_path)
            ELSE NULL
        END;

UPDATE cover_letters
SET 
    resume_file_path = clean_file_path(resume_file_path),
    generated_file_path = 
        CASE 
            WHEN generated_file_path IS NOT NULL 
            THEN clean_file_path(generated_file_path)
            ELSE NULL
        END;