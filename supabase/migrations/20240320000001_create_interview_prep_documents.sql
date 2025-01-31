-- Create interview prep documents table
CREATE TABLE interview_prep_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    job_analysis TEXT NOT NULL,
    interviewer_analysis TEXT NOT NULL,
    cv_match_analysis TEXT NOT NULL,
    prep_document TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_interview_prep_user_id ON interview_prep_documents(user_id);
CREATE INDEX idx_interview_prep_application_id ON interview_prep_documents(application_id);

-- Enable Row Level Security
ALTER TABLE interview_prep_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own interview prep documents"
    ON interview_prep_documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview prep documents"
    ON interview_prep_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview prep documents"
    ON interview_prep_documents FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview prep documents"
    ON interview_prep_documents FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_interview_prep_documents_updated_at
    BEFORE UPDATE ON interview_prep_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 