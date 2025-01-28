-- Update storage configuration and policies for better file access
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
    DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Service role can manage resume storage" ON storage.objects;
    DROP POLICY IF EXISTS "Users can manage their own resumes" ON storage.objects;
    
    -- Create new policies with improved access control
    
    -- Allow unrestricted public read access
    CREATE POLICY "Public can read resumes"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'resumes');

    -- Allow authenticated users to manage files
    CREATE POLICY "Users can manage resumes"
        ON storage.objects
        FOR ALL
        TO authenticated
        USING (bucket_id = 'resumes')
        WITH CHECK (bucket_id = 'resumes');

    -- Allow service role full access
    CREATE POLICY "Service role can manage resumes"
        ON storage.objects
        FOR ALL
        TO service_role
        USING (bucket_id = 'resumes')
        WITH CHECK (bucket_id = 'resumes');
END $$;

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;

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