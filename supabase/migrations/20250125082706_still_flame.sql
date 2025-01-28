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
        'text/plain'  -- Allow text files for editing
    ]::text[],
    avif_autodetection = false
WHERE id IN ('resumes', 'cover-letters');

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated user access" ON storage.objects;
DROP POLICY IF EXISTS "Service role access" ON storage.objects;
DROP POLICY IF EXISTS "Public can read files" ON storage.objects;

-- Create new policies with improved access control

-- Allow unrestricted public read access
CREATE POLICY "Storage public read"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('resumes', 'cover-letters'));

-- Allow authenticated users to manage files
CREATE POLICY "Storage authenticated access"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id IN ('resumes', 'cover-letters'))
    WITH CHECK (bucket_id IN ('resumes', 'cover-letters'));

-- Allow service role full access
CREATE POLICY "Storage service access"
    ON storage.objects
    FOR ALL
    TO service_role
    USING (bucket_id IN ('resumes', 'cover-letters'))
    WITH CHECK (bucket_id IN ('resumes', 'cover-letters'));

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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS clean_resume_paths_trigger ON resumes;

-- Drop existing function if it exists
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