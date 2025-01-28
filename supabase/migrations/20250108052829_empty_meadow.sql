/*
  # Create Resumes Table

  1. New Tables
    - `resumes` table with user tracking and webhook support
  2. Security
    - Enable RLS
    - Add policies for user access and webhook updates
*/

-- Create enum type if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resume_status') THEN
        CREATE TYPE resume_status AS ENUM ('pending', 'processing', 'completed', 'failed');
    END IF;
END $$;

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    original_file_path text NOT NULL,
    job_url text NOT NULL,
    optimized_file_path text,
    status resume_status DEFAULT 'pending',
    webhook_url text,
    webhook_callback_url text,
    webhook_response jsonb,
    webhook_response_at timestamptz,
    webhook_attempts integer DEFAULT 0,
    webhook_last_attempt_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own resumes" ON resumes;
    DROP POLICY IF EXISTS "Users can create their own resumes" ON resumes;
    DROP POLICY IF EXISTS "Allow webhook updates" ON resumes;
    
    CREATE POLICY "Users can view their own resumes"
        ON resumes FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

    CREATE POLICY "Users can create their own resumes"
        ON resumes FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Allow webhook updates"
        ON resumes FOR UPDATE
        USING (true)
        WITH CHECK (true);
END $$;