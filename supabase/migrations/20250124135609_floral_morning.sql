-- Create helper function to safely update resume status
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
        optimized_file_path = COALESCE(new_optimized_path, optimized_file_path),
        webhook_response = COALESCE(new_webhook_response, webhook_response),
        updated_at = now(),
        webhook_response_at = CASE WHEN new_webhook_response IS NOT NULL THEN now() ELSE webhook_response_at END,
        webhook_last_attempt_at = now(),
        webhook_attempts = webhook_attempts + 1
    WHERE id = resume_id;
END;
$$;

-- Create helper function to safely update cover letter status
CREATE OR REPLACE FUNCTION update_cover_letter_status(
    letter_id uuid,
    new_status text,
    new_generated_path text DEFAULT NULL,
    new_webhook_response jsonb DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE cover_letters
    SET 
        status = new_status::cover_letter_status,
        generated_file_path = COALESCE(new_generated_path, generated_file_path),
        webhook_response = COALESCE(new_webhook_response, webhook_response),
        updated_at = now(),
        webhook_response_at = CASE WHEN new_webhook_response IS NOT NULL THEN now() ELSE webhook_response_at END,
        webhook_last_attempt_at = now(),
        webhook_attempts = webhook_attempts + 1
    WHERE id = letter_id;
END;
$$;

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION update_resume_status TO service_role;
GRANT EXECUTE ON FUNCTION update_cover_letter_status TO service_role;