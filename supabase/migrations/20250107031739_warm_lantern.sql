-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own resumes" ON storage.objects;

-- Ensure bucket exists
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('resumes', 'resumes', false)
    ON CONFLICT (id) DO UPDATE
    SET public = false;
END $$;

-- Create storage policies
CREATE POLICY "Users can upload their own resumes"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'resumes' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can read their own resumes"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'resumes' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );