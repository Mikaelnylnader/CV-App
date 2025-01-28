-- Drop all existing storage policies for resumes bucket
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Users can read their own resumes" ON storage.objects;
    
    -- Create the two policies that match what's in Supabase UI
    
    -- 1. Public read access
    CREATE POLICY "Public can read resumes"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'resumes');

    -- 2. Authenticated users can upload their own resumes
    CREATE POLICY "Users can upload their own resumes"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'resumes' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );
END $$;

-- Ensure bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'resumes';

-- Grant necessary permissions
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT, INSERT ON storage.objects TO authenticated;