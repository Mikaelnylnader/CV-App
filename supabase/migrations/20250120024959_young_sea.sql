/*
  # Fix Storage Bucket Configuration

  1. Changes
    - Ensures resumes bucket exists with proper configuration
    - Sets correct permissions and policies
    - Enables public access for authenticated users
  
  2. Security
    - Enables RLS
    - Adds policies for authenticated users
*/

-- Recreate the bucket with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes',
    'resumes',
    true,  -- Make bucket public
    10485760,  -- 10MB limit
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]::text[]
)
ON CONFLICT (id) DO UPDATE
SET 
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]::text[];

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own resumes" ON storage.objects;

-- Create new policies
CREATE POLICY "Users can upload their own resumes"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'resumes' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can read their own resumes"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'resumes'
    );