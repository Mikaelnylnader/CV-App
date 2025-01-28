-- Create function to clean cover letter file paths
CREATE OR REPLACE FUNCTION clean_cover_letter_path(path text)
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
    
    -- Clean up filename
    file_name := regexp_replace(file_name, '\.pdf(\.pdf)*$', '');
    file_name := file_name || '.pdf';
    
    -- Clean up URL-encoded characters
    file_name := regexp_replace(file_name, '%20', ' ', 'g');
    file_name := regexp_replace(file_name, '%28', '(', 'g');
    file_name := regexp_replace(file_name, '%29', ')', 'g');
    file_name := regexp_replace(file_name, '%2C', ',', 'g');
    
    -- Return cleaned path
    RETURN dir_path || file_name;
END;
$$;

-- Clean existing cover letter file paths
UPDATE cover_letters
SET 
    resume_file_path = clean_cover_letter_path(resume_file_path),
    generated_file_path = clean_cover_letter_path(generated_file_path)
WHERE status = 'completed';

-- Create trigger for automatic path cleaning
CREATE OR REPLACE FUNCTION clean_cover_letter_paths_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.resume_file_path := clean_cover_letter_path(NEW.resume_file_path);
    NEW.generated_file_path := clean_cover_letter_path(NEW.generated_file_path);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS clean_cover_letter_paths ON cover_letters;
CREATE TRIGGER clean_cover_letter_paths
    BEFORE INSERT OR UPDATE ON cover_letters
    FOR EACH ROW
    EXECUTE FUNCTION clean_cover_letter_paths_trigger();