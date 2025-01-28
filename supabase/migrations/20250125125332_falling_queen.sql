-- Create function to clean file paths
CREATE OR REPLACE FUNCTION clean_file_path(path text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    base_path text;
    file_name text;
BEGIN
    IF path IS NULL THEN
        RETURN NULL;
    END IF;

    -- Split path into directory and filename
    base_path := regexp_replace(path, '[^/]+$', '');
    file_name := regexp_replace(path, '^.*/', '');
    
    -- Remove all .pdf extensions and add a single one
    file_name := regexp_replace(file_name, '\.pdf(\.pdf)*$', '');
    file_name := file_name || '.pdf';
    
    -- Return cleaned path
    RETURN base_path || file_name;
END;
$$;

-- Create trigger function
CREATE OR REPLACE FUNCTION clean_file_paths_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Clean file paths before insert/update
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

-- Clean existing file paths
UPDATE resumes 
SET 
    original_file_path = clean_file_path(original_file_path),
    optimized_file_path = clean_file_path(optimized_file_path);

UPDATE cover_letters
SET 
    resume_file_path = clean_file_path(resume_file_path),
    generated_file_path = clean_file_path(generated_file_path);