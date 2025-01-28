-- Create status enum if it doesn't exist
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
    
    CREATE POLICY "Users can view their own resumes"
        ON resumes FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

    CREATE POLICY "Users can create their own resumes"
        ON resumes FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
END $$;

-- Create storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('resumes', 'resumes')
ON CONFLICT DO NOTHING;

-- Storage policies
DO $$ 
BEGIN 
    DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Users can read their own resumes" ON storage.objects;
    
    CREATE POLICY "Users can upload their own resumes"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

    CREATE POLICY "Users can read their own resumes"
        ON storage.objects FOR SELECT
        TO authenticated
        USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
END $$;