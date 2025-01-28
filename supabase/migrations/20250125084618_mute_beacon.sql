-- Create function to clean file paths
CREATE OR REPLACE FUNCTION clean_file_path(path text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    base_path text;
    file_name text;
    clean_name text;
BEGIN
    -- Split path into directory and filename
    base_path := substring(path from '^(.*/)?');
    file_name := substring(path from '[^/]*$');
    
    -- Clean up filename by removing duplicate .pdf extensions
    clean_name := regexp_replace(file_name, '\.pdf(\.pdf)*$', '');
    clean_name := clean_name || '.pdf';
    
    -- Combine directory and cleaned filename
    RETURN coalesce(base_path, '') || clean_name;
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

-- Create trigger to clean file paths on insert/update
CREATE OR REPLACE FUNCTION clean_paths_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'resumes' THEN
        NEW.original_file_path := clean_file_path(NEW.original_file_path);
        IF NEW.optimized_file_path IS NOT NULL THEN
            NEW.optimized_file_path := clean_file_path(NEW.optimized_file_path);
        END IF;
    ELSIF TG_TABLE_NAME = 'cover_letters' THEN
        NEW.resume_file_path := clean_file_path(NEW.resume_file_path);
        IF NEW.generated_file_path IS NOT NULL THEN
            NEW.generated_file_path := clean_file_path(NEW.generated_file_path);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
DROP TRIGGER IF EXISTS clean_resume_paths_trigger ON resumes;
CREATE TRIGGER clean_resume_paths_trigger
    BEFORE INSERT OR UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION clean_paths_trigger();

DROP TRIGGER IF EXISTS clean_cover_letter_paths_trigger ON cover_letters;
CREATE TRIGGER clean_cover_letter_paths_trigger
    BEFORE INSERT OR UPDATE ON cover_letters
    FOR EACH ROW
    EXECUTE FUNCTION clean_paths_trigger();