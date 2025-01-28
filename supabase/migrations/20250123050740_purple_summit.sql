-- Create status enum if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cover_letter_status') THEN
        CREATE TYPE cover_letter_status AS ENUM ('pending', 'processing', 'completed', 'failed');
    END IF;
END $$;

-- Create cover_letters table if it doesn't exist
CREATE TABLE IF NOT EXISTS cover_letters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    resume_file_path text NOT NULL,
    job_url text NOT NULL,
    generated_file_path text,
    status cover_letter_status DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    webhook_response jsonb,
    webhook_response_at timestamptz,
    webhook_attempts integer DEFAULT 0,
    webhook_last_attempt_at timestamptz,
    original_filename text,
    generated_filename text
);

-- Enable RLS
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own cover letters" ON cover_letters;
    DROP POLICY IF EXISTS "Users can create their own cover letters" ON cover_letters;
    DROP POLICY IF EXISTS "Allow webhook updates" ON cover_letters;

    CREATE POLICY "Users can view their own cover letters"
        ON cover_letters FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

    CREATE POLICY "Users can create their own cover letters"
        ON cover_letters FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Allow webhook updates"
        ON cover_letters FOR UPDATE
        USING (true)
        WITH CHECK (true);
END $$;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_cover_letter_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamp updates
DROP TRIGGER IF EXISTS update_cover_letter_timestamp ON cover_letters;
CREATE TRIGGER update_cover_letter_timestamp
    BEFORE UPDATE ON cover_letters
    FOR EACH ROW
    EXECUTE FUNCTION update_cover_letter_timestamp();

-- Create function to update webhook response timestamp
CREATE OR REPLACE FUNCTION update_cover_letter_webhook_response()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.webhook_response IS DISTINCT FROM OLD.webhook_response THEN
        NEW.webhook_response_at = CURRENT_TIMESTAMP;
        NEW.webhook_last_attempt_at = CURRENT_TIMESTAMP;
        NEW.webhook_attempts = COALESCE(OLD.webhook_attempts, 0) + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for webhook response updates
DROP TRIGGER IF EXISTS update_cover_letter_webhook_response ON cover_letters;
CREATE TRIGGER update_cover_letter_webhook_response
    BEFORE UPDATE OF webhook_response
    ON cover_letters
    FOR EACH ROW
    EXECUTE FUNCTION update_cover_letter_webhook_response();

-- Ensure storage bucket exists with proper configuration
DO $$ 
BEGIN
    -- Create or update the bucket
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'cover-letters',
        'cover-letters',
        true,
        10485760,  -- 10MB limit
        ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream',
            'image/pdf'
        ]::text[]
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        public = true,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;
END $$;

-- Recreate storage policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can upload their own cover letters" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read cover letters" ON storage.objects;
    
    -- Create new policies
    CREATE POLICY "Users can upload their own cover letters"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'cover-letters' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );

    CREATE POLICY "Public can read cover letters"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'cover-letters');
END $$;

-- Grant necessary permissions
GRANT ALL ON cover_letters TO authenticated;
GRANT ALL ON cover_letters TO service_role;