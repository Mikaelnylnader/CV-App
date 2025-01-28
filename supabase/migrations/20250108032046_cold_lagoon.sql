/*
  # Add Job Analyses Support

  1. New Tables
    - `job_analyses`
      - `id` (uuid, primary key)
      - `job_url` (text)
      - `platform` (text)
      - `analysis_result` (jsonb)
      - `status` (enum)
      - Various timestamps and tracking columns

  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create job analysis status enum
CREATE TYPE job_analysis_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create job analyses table
CREATE TABLE job_analyses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    job_url text NOT NULL,
    platform text NOT NULL,
    analysis_result jsonb,
    status job_analysis_status DEFAULT 'pending',
    error_message text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    
    -- Webhook related fields
    webhook_response jsonb,
    webhook_response_at timestamptz,
    webhook_attempts integer DEFAULT 0,
    webhook_last_attempt_at timestamptz,
    
    -- Validation
    CONSTRAINT valid_platform CHECK (platform IN ('linkedin', 'indeed')),
    CONSTRAINT valid_job_url CHECK (job_url ~ '^https?://')
);

-- Enable RLS
ALTER TABLE job_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own job analyses"
    ON job_analyses FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create job analyses"
    ON job_analyses FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamp on analysis updates
CREATE OR REPLACE FUNCTION update_job_analysis_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamp updates
CREATE TRIGGER update_job_analysis_timestamp
    BEFORE UPDATE ON job_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_job_analysis_timestamp();