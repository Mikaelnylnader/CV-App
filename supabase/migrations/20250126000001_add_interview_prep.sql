-- Create interview_prep table
CREATE TABLE IF NOT EXISTS interview_prep (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    title text NOT NULL,
    company text,
    position text,
    status text NOT NULL DEFAULT 'in_progress',
    date timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    questions jsonb[],
    answers jsonb[],
    feedback jsonb[],
    notes text,
    CONSTRAINT valid_status CHECK (status IN ('in_progress', 'completed', 'scheduled', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE interview_prep ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own interview preps"
    ON interview_prep
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview preps"
    ON interview_prep
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview preps"
    ON interview_prep
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview preps"
    ON interview_prep
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_interview_prep_updated_at
    BEFORE UPDATE ON interview_prep
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_interview_prep_user_id ON interview_prep(user_id);
CREATE INDEX idx_interview_prep_status ON interview_prep(status);
CREATE INDEX idx_interview_prep_created_at ON interview_prep(created_at);

-- Grant permissions
GRANT ALL ON interview_prep TO authenticated;
GRANT ALL ON interview_prep TO service_role; 