-- Drop existing policies
DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_user_write" ON storage.objects;
DROP POLICY IF EXISTS "storage_service_access" ON storage.objects;
DROP POLICY IF EXISTS "storage_public_buckets" ON storage.buckets;

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

-- Create new storage policies with simplified access

-- Allow public read access
CREATE POLICY "public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('resumes', 'cover-letters'));

-- Allow authenticated users to manage files
CREATE POLICY "authenticated_write"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id IN ('resumes', 'cover-letters'))
    WITH CHECK (bucket_id IN ('resumes', 'cover-letters'));

-- Allow service role full access
CREATE POLICY "service_role_access"
    ON storage.objects
    FOR ALL
    TO service_role
    USING (bucket_id IN ('resumes', 'cover-letters'))
    WITH CHECK (bucket_id IN ('resumes', 'cover-letters'));

-- Update bucket access
CREATE POLICY "public_bucket_access"
    ON storage.buckets FOR SELECT
    USING (id IN ('resumes', 'cover-letters'));

-- Grant permissions
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;

-- Create improved file path cleaning function
CREATE OR REPLACE FUNCTION clean_file_path(path text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    dir_path text;
    file_name text;
BEGIN
    IF path IS NULL THEN
        RETURN NULL;
    END IF;

    -- Extract directory path and filename
    dir_path := regexp_replace(path, '[^/]+$', '');
    file_name := regexp_replace(path, '^.*/', '');
    
    -- Remove all .pdf extensions and add single one
    file_name := regexp_replace(file_name, '\.pdf(\.pdf)*$', '');
    file_name := file_name || '.pdf';
    
    RETURN dir_path || file_name;
END;
$$;

-- Clean existing file paths
UPDATE resumes 
SET 
    original_file_path = clean_file_path(original_file_path),
    optimized_file_path = clean_file_path(optimized_file_path);

UPDATE cover_letters
SET 
    resume_file_path = clean_file_path(resume_file_path),
    generated_file_path = clean_file_path(generated_file_path);

-- Create trigger function
CREATE OR REPLACE FUNCTION clean_file_paths_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'resumes' THEN
        NEW.original_file_path := clean_file_path(NEW.original_file_path);
        NEW.optimized_file_path := clean_file_path(NEW.optimized_file_path);
    ELSIF TG_TABLE_NAME = 'cover_letters' THEN
        NEW.resume_file_path := clean_file_path(NEW.resume_file_path);
        NEW.generated_file_path := clean_file_path(NEW.generated_file_path);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS clean_resume_paths ON resumes;
CREATE TRIGGER clean_resume_paths
    BEFORE INSERT OR UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION clean_file_paths_trigger();

DROP TRIGGER IF EXISTS clean_cover_letter_paths ON cover_letters;
CREATE TRIGGER clean_cover_letter_paths
    BEFORE INSERT OR UPDATE ON cover_letters
    FOR EACH ROW
    EXECUTE FUNCTION clean_file_paths_trigger();