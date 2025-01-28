-- Add original_filename column to resumes table
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS original_filename text;

-- Update existing rows to use filename from path (if needed)
UPDATE resumes 
SET original_filename = split_part(original_file_path, '/', 2)
WHERE original_filename IS NULL;