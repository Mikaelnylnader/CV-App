-- Create enum for application status
CREATE TYPE application_status AS ENUM (
    'SAVED',
    'APPLIED',
    'IN_REVIEW',
    'INTERVIEW_SCHEDULED',
    'INTERVIEW_COMPLETED',
    'OFFER_RECEIVED',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN'
);

-- Create job applications table
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_description TEXT,
    job_url TEXT,
    status application_status DEFAULT 'SAVED',
    salary_range TEXT,
    location TEXT,
    application_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create application documents table (for storing different versions of resumes and cover letters)
CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'RESUME' or 'COVER_LETTER'
    version_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create interview tracking table
CREATE TABLE application_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    interview_type TEXT NOT NULL, -- 'PHONE', 'VIDEO', 'ONSITE', etc.
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    interviewer_names TEXT[],
    notes TEXT,
    feedback TEXT,
    status TEXT, -- 'SCHEDULED', 'COMPLETED', 'CANCELLED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create reminders table
CREATE TABLE application_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL, -- 'FOLLOW_UP', 'INTERVIEW_PREP', 'DEADLINE', etc.
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own job applications"
    ON job_applications FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own application documents"
    ON application_documents FOR ALL
    TO authenticated
    USING (application_id IN (
        SELECT id FROM job_applications WHERE user_id = auth.uid()
    ))
    WITH CHECK (application_id IN (
        SELECT id FROM job_applications WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage their own interviews"
    ON application_interviews FOR ALL
    TO authenticated
    USING (application_id IN (
        SELECT id FROM job_applications WHERE user_id = auth.uid()
    ))
    WITH CHECK (application_id IN (
        SELECT id FROM job_applications WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage their own reminders"
    ON application_reminders FOR ALL
    TO authenticated
    USING (application_id IN (
        SELECT id FROM job_applications WHERE user_id = auth.uid()
    ))
    WITH CHECK (application_id IN (
        SELECT id FROM job_applications WHERE user_id = auth.uid()
    ));

-- Create indexes
CREATE INDEX job_applications_user_id_idx ON job_applications(user_id);
CREATE INDEX job_applications_status_idx ON job_applications(status);
CREATE INDEX application_documents_application_id_idx ON application_documents(application_id);
CREATE INDEX application_interviews_application_id_idx ON application_interviews(application_id);
CREATE INDEX application_reminders_application_id_idx ON application_reminders(application_id);
CREATE INDEX application_reminders_due_date_idx ON application_reminders(due_date); 