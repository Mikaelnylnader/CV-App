-- Update bucket configuration to include additional MIME types
DO $$ 
BEGIN
    -- Update bucket configuration
    UPDATE storage.buckets
    SET allowed_mime_types = ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/octet-stream',  -- Add this MIME type
        'image/pdf'  -- Keep existing allowed types
    ]::text[]
    WHERE id = 'resumes';
END $$;