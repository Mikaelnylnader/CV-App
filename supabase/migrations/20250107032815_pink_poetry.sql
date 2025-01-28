/*
  # Add webhook response tracking
  
  1. Changes
    - Add webhook_response column to resumes table
    - Add webhook_response_at timestamp
*/

ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS webhook_response jsonb,
ADD COLUMN IF NOT EXISTS webhook_response_at timestamptz;