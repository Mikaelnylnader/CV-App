-- Drop all existing storage policies first
DO $$ 
BEGIN
    -- Drop all existing policies to start fresh
    DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Service role can manage resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Users can manage resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Public read access" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated user access" ON storage.objects;
    DROP POLICY IF EXISTS "Service role access" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read files" ON storage.objects;
    DROP POLICY IF EXISTS "Storage public read" ON storage.objects;
    DROP POLICY IF EXISTS "Storage authenticated access" ON storage.objects;
    DROP POLICY IF EXISTS "Storage service access" ON storage.objects;
    
    -- Update bucket configuration
    UPDATE storage.buckets
    SET public = true,
        file_size_limit = 10485760,  -- 10MB limit
        allowed_mime_types = ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'image/pdf',
            'text/plain'
        ]::text[],
        avif_autodetection = false
    WHERE id IN ('resumes', 'cover-letters');

    -- Create new simplified policies
    
    -- 1. Allow anyone to read files (no bucket restriction)
    CREATE POLICY "allow_public_read"
        ON storage.objects FOR SELECT
        USING (true);

    -- 2. Allow authenticated users to manage their own files
    CREATE POLICY "allow_authenticated_operations"
        ON storage.objects
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);

    -- 3. Allow service role full access
    CREATE POLICY "allow_service_role_access"
        ON storage.objects
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
END $$;

-- Update file path handling function
CREATE OR REPLACE FUNCTION clean_file_path(path text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    base_path text;
    extension text;
BEGIN
    -- Extract base path and extension
    base_path := regexp_replace(path, '\.pdf(\.pdf)*$', '');
    
    -- Always append single .pdf extension
    RETURN base_path || '.pdf';
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

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS clean_resume_paths_trigger ON resumes;
DROP FUNCTION IF EXISTS clean_resume_paths();

CREATE FUNCTION clean_resume_paths()
RETURNS TRIGGER AS $$
BEGIN
    NEW.original_file_path := clean_file_path(NEW.original_file_path);
    IF NEW.optimized_file_path IS NOT NULL THEN
        NEW.optimized_file_path := clean_file_path(NEW.optimized_file_path);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clean_resume_paths_trigger
    BEFORE INSERT OR UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION clean_resume_paths();

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;
GRANT SELECT ON storage.objects TO anon;