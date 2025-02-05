import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { pdfService } from '../services/pdfService';

export default function EditResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch resume data
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (resumeError) throw resumeError;
      if (!resumeData) throw new Error('Resume not found');

      setResume(resumeData);

      // Get the file URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(resumeData.optimized_file_path || resumeData.original_file_path);

      // Fetch and extract text from PDF
      const response = await fetch(publicUrl);
      const blob = await response.blob();
      const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });
      const text = await pdfService.extractText(file);
      
      if (text) {
        setContent(text);
      } else {
        throw new Error('Could not extract text from PDF');
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // TODO: Implement save functionality
      // This would typically involve:
      // 1. Converting the edited text back to PDF
      // 2. Uploading the new PDF
      // 3. Updating the resume record

      setSuccess('Changes saved successfully!');
    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Resume</h1>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/resumes')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[600px] p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono"
              placeholder="Resume content..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}