/*
  # Fix Webhook Integration

  1. Changes
    - Add UPDATE policy for webhook responses
    - Add webhook_callback_url column
    - Add webhook_attempts column to track retry attempts
    - Add webhook_last_attempt_at column

  2. Security
    - Add policy for webhook service to update resumes
*/

-- Add webhook tracking columns
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS webhook_callback_url text,
ADD COLUMN IF NOT EXISTS webhook_attempts integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS webhook_last_attempt_at timestamptz;

-- Create policy for updating resumes via webhook
CREATE POLICY "Allow webhook updates"
    ON resumes FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Create function to update timestamp on webhook response
CREATE OR REPLACE FUNCTION update_webhook_response_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.webhook_response_at = CURRENT_TIMESTAMP;
    NEW.webhook_last_attempt_at = CURRENT_TIMESTAMP;
    NEW.webhook_attempts = COALESCE(OLD.webhook_attempts, 0) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for webhook response updates
DROP TRIGGER IF EXISTS update_webhook_response_timestamp ON resumes;
CREATE TRIGGER update_webhook_response_timestamp
    BEFORE UPDATE OF webhook_response
    ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_webhook_response_timestamp();