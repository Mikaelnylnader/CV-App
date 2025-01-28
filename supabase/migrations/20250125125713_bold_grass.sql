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
    
    -- Clean up any URL-encoded characters
    file_name := regexp_replace(file_name, '%20', ' ', 'g');
    file_name := regexp_replace(file_name, '%28', '(', 'g');
    file_name := regexp_replace(file_name, '%29', ')', 'g');
    file_name := regexp_replace(file_name, '%2C', ',', 'g');
    file_name := regexp_replace(file_name, '%27', '''', 'g');
    file_name := regexp_replace(file_name, '%22', '"', 'g');
    file_name := regexp_replace(file_name, '%26', '&', 'g');
    
    RETURN dir_path || file_name;
END;
$$;

-- Clean existing file paths
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