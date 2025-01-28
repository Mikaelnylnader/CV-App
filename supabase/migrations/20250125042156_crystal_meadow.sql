-- Create helper function to ensure PDF extension
CREATE OR REPLACE FUNCTION ensure_pdf_extension(file_path text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    -- If path ends with .txt, replace it with .pdf
    IF file_path LIKE '%.txt' THEN
        RETURN substring(file_path from 1 for length(file_path) - 4) || '.pdf';
    END IF;
    -- If path doesn't end with .pdf, append it
    IF file_path NOT LIKE '%.pdf' THEN
        RETURN file_path || '.pdf';
    END IF;
    RETURN file_path;
END;
$$;

-- Update the update_resume_status function to ensure PDF extension
CREATE OR REPLACE FUNCTION update_resume_status(
    resume_id uuid,
    new_status text,
    new_optimized_path text DEFAULT NULL,
    new_webhook_response jsonb DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE resumes
    SET 
        status = new_status::resume_status,
        optimized_file_path = CASE 
            WHEN new_optimized_path IS NOT NULL 
            THEN ensure_pdf_extension(new_optimized_path)
            ELSE optimized_file_path
        END,
        webhook_response = COALESCE(new_webhook_response, webhook_response),
        updated_at = now(),
        webhook_response_at = CASE WHEN new_webhook_response IS NOT NULL THEN now() ELSE webhook_response_at END,
        webhook_last_attempt_at = now(),
        webhook_attempts = webhook_attempts + 1
    WHERE id = resume_id;
END;
$$;

-- Update existing records to ensure PDF extension
UPDATE resumes
SET optimized_file_path = ensure_pdf_extension(optimized_file_path)
WHERE optimized_file_path IS NOT NULL;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION ensure_pdf_extension TO service_role;
GRANT EXECUTE ON FUNCTION update_resume_status TO service_role;