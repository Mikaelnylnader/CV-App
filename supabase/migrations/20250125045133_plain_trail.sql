-- Create enum for webhook status if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'webhook_status') THEN
        CREATE TYPE webhook_status AS ENUM ('pending', 'processing', 'completed', 'failed');
    END IF;
END $$;

-- Create a generic function to validate file paths
CREATE OR REPLACE FUNCTION validate_file_path(
    file_path text,
    expected_extension text DEFAULT '.pdf'
)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    -- Remove double extensions if they exist
    WHILE file_path LIKE '%' || expected_extension || expected_extension LOOP
        file_path := substring(file_path from 1 for length(file_path) - length(expected_extension));
    END LOOP;
    
    -- Ensure the file has the correct extension
    IF NOT file_path LIKE '%' || expected_extension THEN
        file_path := file_path || expected_extension;
    END IF;
    
    RETURN file_path;
END;
$$;

-- Create a function to handle webhook responses
CREATE OR REPLACE FUNCTION handle_webhook_response(
    record_id uuid,
    table_name text,
    new_status text,
    new_file_path text DEFAULT NULL,
    new_webhook_response jsonb DEFAULT NULL,
    file_extension text DEFAULT '.pdf'
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    status_column text;
    file_path_column text;
    valid_status boolean;
BEGIN
    -- Determine the correct status column and validate the status
    CASE table_name
        WHEN 'resumes' THEN 
            status_column := 'status::resume_status';
            file_path_column := 'optimized_file_path';
            SELECT new_status::text = ANY(enum_range(NULL::resume_status)::text[]) INTO valid_status;
        WHEN 'cover_letters' THEN 
            status_column := 'status::cover_letter_status';
            file_path_column := 'generated_file_path';
            SELECT new_status::text = ANY(enum_range(NULL::cover_letter_status)::text[]) INTO valid_status;
        ELSE
            RAISE EXCEPTION 'Invalid table name: %', table_name;
    END CASE;

    -- Validate status
    IF NOT valid_status THEN
        RAISE EXCEPTION 'Invalid status: %', new_status;
    END IF;

    -- Validate and clean file path if provided
    IF new_file_path IS NOT NULL THEN
        new_file_path := validate_file_path(new_file_path, file_extension);
    END IF;

    -- Construct and execute dynamic SQL
    EXECUTE format(
        'UPDATE %I SET 
            status = $1::%s,
            %I = COALESCE($2, %I),
            webhook_response = COALESCE($3, webhook_response),
            updated_at = now(),
            webhook_response_at = CASE WHEN $3 IS NOT NULL THEN now() ELSE webhook_response_at END,
            webhook_last_attempt_at = now(),
            webhook_attempts = webhook_attempts + 1
        WHERE id = $4',
        table_name,
        status_column,
        file_path_column,
        file_path_column
    ) USING new_status, new_file_path, new_webhook_response, record_id;
END;
$$;

-- Create convenience functions for specific tables
CREATE OR REPLACE FUNCTION update_resume_webhook_status(
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
    PERFORM handle_webhook_response(
        resume_id,
        'resumes',
        new_status,
        new_optimized_path,
        new_webhook_response
    );
END;
$$;

CREATE OR REPLACE FUNCTION update_cover_letter_webhook_status(
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
    PERFORM handle_webhook_response(
        letter_id,
        'cover_letters',
        new_status,
        new_generated_path,
        new_webhook_response
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION validate_file_path TO service_role;
GRANT EXECUTE ON FUNCTION handle_webhook_response TO service_role;
GRANT EXECUTE ON FUNCTION update_resume_webhook_status TO service_role;
GRANT EXECUTE ON FUNCTION update_cover_letter_webhook_status TO service_role;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_status ON resumes(status);
CREATE INDEX IF NOT EXISTS idx_cover_letters_status ON cover_letters(status);