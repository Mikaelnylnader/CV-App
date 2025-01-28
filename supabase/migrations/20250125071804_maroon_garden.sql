-- Create or replace the cover letter webhook status update function
CREATE OR REPLACE FUNCTION public.update_cover_letter_webhook_status(
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
    -- Validate status
    IF NOT new_status = ANY(enum_range(NULL::cover_letter_status)::text[]) THEN
        RAISE EXCEPTION 'Invalid status: %', new_status;
    END IF;

    -- Validate and clean file path if provided
    IF new_generated_path IS NOT NULL THEN
        -- Remove duplicate .pdf extensions
        WHILE new_generated_path LIKE '%.pdf.pdf' LOOP
            new_generated_path := substring(new_generated_path from 1 for length(new_generated_path) - 4);
        END LOOP;
        -- Ensure .pdf extension
        IF NOT new_generated_path LIKE '%.pdf' THEN
            new_generated_path := new_generated_path || '.pdf';
        END IF;
    END IF;

    -- Update cover letter status without timestamps
    UPDATE cover_letters
    SET 
        status = new_status::cover_letter_status,
        generated_file_path = COALESCE(new_generated_path, generated_file_path),
        webhook_response = COALESCE(new_webhook_response, webhook_response),
        webhook_attempts = COALESCE(webhook_attempts, 0) + 1
    WHERE id = letter_id;

    -- Raise exception if cover letter not found
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cover letter with ID % not found', letter_id;
    END IF;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.update_cover_letter_webhook_status TO service_role;