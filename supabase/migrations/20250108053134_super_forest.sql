/*
  # Fix Webhook Permissions
  
  1. Security Changes
    - Add service role access for webhook updates
    - Update webhook policy
*/

-- Update webhook policy to allow service role access
DROP POLICY IF EXISTS "Allow webhook updates" ON resumes;

CREATE POLICY "Allow webhook updates"
    ON resumes FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add policy for webhook service to read resumes
CREATE POLICY "Allow webhook service to read resumes"
    ON resumes FOR SELECT
    TO service_role
    USING (true);