-- Create or replace the resume webhook status update function
CREATE OR REPLACE FUNCTION public.update_resume_webhook_status(
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
    -- Validate status
    IF NOT new_status = ANY(enum_range(NULL::resume_status)::text[]) THEN
        RAISE EXCEPTION 'Invalid status: %', new_status;
    END IF;

    -- Validate and clean file path if provided
    IF new_optimized_path IS NOT NULL THEN
        -- Remove duplicate .pdf extensions
        WHILE new_optimized_path LIKE '%.pdf.pdf' LOOP
            new_optimized_path := substring(new_optimized_path from 1 for length(new_optimized_path) - 4);
        END LOOP;
        -- Ensure .pdf extension
        IF NOT new_optimized_path LIKE '%.pdf' THEN
            new_optimized_path := new_optimized_path || '.pdf';
        END IF;
    END IF;

    -- Update resume status
    UPDATE resumes
    SET 
        status = new_status::resume_status,
        optimized_file_path = COALESCE(new_optimized_path, optimized_file_path),
        webhook_response = COALESCE(new_webhook_response, webhook_response),
        updated_at = now(),
        webhook_response_at = CASE WHEN new_webhook_response IS NOT NULL THEN now() ELSE webhook_response_at END,
        webhook_last_attempt_at = now(),
        webhook_attempts = COALESCE(webhook_attempts, 0) + 1
    WHERE id = resume_id;

    -- Raise exception if resume not found
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Resume with ID % not found', resume_id;
    END IF;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.update_resume_webhook_status TO service_role;