import { supabase } from '../lib/supabaseClient';

export const resumeService = {
  async uploadResume(file, jobUrl) {
    try {
      // Clean up file path and name
      const cleanFilename = (filename) => {
        // Remove file extension and clean up name
        return filename
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/[^a-zA-Z0-9-_ ]/g, '') // Remove special chars
          .trim();
      };

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop().toLowerCase();
      const originalFileName = cleanFilename(file.name);
      const timestamp = Date.now();
      const filePath = `${user.id}/${timestamp}_${originalFileName}.${fileExt}`;

      // Map file extensions to MIME types
      const mimeTypes = {
        'pdf': ['application/pdf', 'image/pdf'],
        'doc': ['application/msword'],
        'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      };

      // Get allowed MIME types for the file extension
      const allowedMimeTypes = mimeTypes[fileExt];
      if (!allowedMimeTypes) {
        throw new Error('Unsupported file type. Please upload PDF, DOC, or DOCX files.');
      }

      // Create new blob with correct MIME type
      const fileBlob = new Blob([await file.arrayBuffer()], { 
        type: allowedMimeTypes[0] 
      });
      
      // Create new File object with correct MIME type
      const correctedFile = new File([fileBlob], `${originalFileName}.${fileExt}`, { 
        type: allowedMimeTypes[0]
      });

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, correctedFile, {
          contentType: correctedFile.type,
          cacheControl: '3600',
          upsert: true // Allow overwriting
        });

      if (uploadError) {
        console.error('File upload error:', uploadError);
        throw new Error('Failed to upload file. Please try again.');
      }

      // Create resume record in database
      const { data: resume, error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          original_file_path: filePath,
          original_filename: originalFileName,
          job_url: jobUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save resume information. Please try again.');
      }

      // Get webhook URL from environment variables
      const webhookUrl = import.meta.env.VITE_MAKE_RESUME_WEBHOOK;
      if (!webhookUrl) {
        throw new Error('Resume webhook URL not configured');
      }

      // Get the file URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // Send webhook request
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          data: {
            id: resume.id,
            user_id: user.id,
            job_url: jobUrl,
            original_filename: originalFileName,
            original_file_path: filePath,
            file_url: publicUrl,
            supabase: {
              url: import.meta.env.VITE_SUPABASE_URL,
              key: import.meta.env.VITE_SUPABASE_ANON_KEY
            }
          }
        })
      });

      if (!webhookResponse.ok) {
        const errorData = await webhookResponse.text();
        console.error('Webhook error:', errorData);
        
        throw new Error('Failed to start resume processing');
      }

      await supabase
        .from('resumes')
        .update({ 
          status: 'processing',
          webhook_last_attempt_at: new Date().toISOString(),
          webhook_attempts: 1
        })
        .eq('id', resume.id);

      return { resume };
    } catch (error) {
      console.error('Resume upload error:', error);
      throw error;
    }
  }
};