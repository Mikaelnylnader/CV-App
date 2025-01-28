-- Drop all existing storage policies first
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "allow_public_read" ON storage.objects;
    DROP POLICY IF EXISTS "allow_authenticated_operations" ON storage.objects;
    DROP POLICY IF EXISTS "allow_service_role_access" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Service role can manage resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Users can manage resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Public read access" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated user access" ON storage.objects;
    DROP POLICY IF EXISTS "Service role access" ON storage.objects;
    DROP POLICY IF EXISTS "Storage public read" ON storage.objects;
    DROP POLICY IF EXISTS "Storage authenticated access" ON storage.objects;
    DROP POLICY IF EXISTS "Storage service access" ON storage.objects;
    
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
            'text/plain'
        ]::text[],
        avif_autodetection = false
    WHERE id IN ('resumes', 'cover-letters');

    -- Create new storage policies
    
    -- Global read access for all buckets
    CREATE POLICY "global_read_access"
        ON storage.objects FOR SELECT
        USING (true);

    -- Authenticated users can manage files
    CREATE POLICY "authenticated_file_access"
        ON storage.objects
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);

    -- Service role has full access
    CREATE POLICY "service_role_access"
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
BEGIN
    -- Remove all .pdf extensions
    base_path := regexp_replace(path, '\.pdf(\.pdf)*$', '');
    
    -- Add single .pdf extension
    RETURN base_path || '.pdf';
END;
$$;

-- Clean up existing file paths
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

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS clean_resume_paths_trigger ON resumes;
DROP FUNCTION IF EXISTS clean_resume_paths();

-- Create new trigger function
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

-- Create new trigger
CREATE TRIGGER clean_resume_paths_trigger
    BEFORE INSERT OR UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION clean_resume_paths();

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;