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