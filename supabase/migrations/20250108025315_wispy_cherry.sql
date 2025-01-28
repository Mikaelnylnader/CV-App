/*
  # Setup Webhook Integration

  1. New Tables
    - Add webhook_response and webhook_response_at columns to resumes table
    - Add update policy for webhook responses

  2. Security
    - Enable RLS for webhook updates
    - Add policy for webhook service to update resumes
*/

-- Add webhook response columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'resumes' AND column_name = 'webhook_response') THEN
        ALTER TABLE resumes ADD COLUMN webhook_response jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'resumes' AND column_name = 'webhook_response_at') THEN
        ALTER TABLE resumes ADD COLUMN webhook_response_at timestamptz;
    END IF;
END $$;

-- Create policy for updating resumes (for webhook service)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow webhook service to update resumes" ON resumes;
    
    CREATE POLICY "Allow webhook service to update resumes"
        ON resumes FOR UPDATE
        TO authenticated
        USING (true)
        WITH CHECK (true);
END $$;