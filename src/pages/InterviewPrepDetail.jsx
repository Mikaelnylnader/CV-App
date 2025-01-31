import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function InterviewPrepDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interview, setInterview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    position: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (id && user) {
      fetchInterviewDetails();
    }
  }, [id, user]);

  const fetchInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('interview_prep')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setInterview(data);
        setFormData({
          title: data.title || '',
          company: data.company || '',
          position: data.position || '',
          date: new Date(data.date).toISOString().split('T')[0],
          notes: data.notes || '',
        });
      }
    } catch (err) {
      console.error('Error fetching interview details:', err);
      setError('Failed to load interview details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('interview_prep')
        .update({
          title: formData.title,
          company: formData.company,
          position: formData.position,
          date: formData.date,
          notes: formData.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchInterviewDetails();
    } catch (err) {
      console.error('Error updating interview:', err);
      setError('Failed to update interview details');
    } finally {
      setLoading(false);
    }
  };

  const startPractice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Here you would integrate with your AI service to generate questions
      const mockQuestions = [
        { question: "Tell me about yourself", type: "general" },
        { question: "Why are you interested in this position?", type: "motivation" },
        { question: "What are your greatest strengths?", type: "personal" },
      ];

      const { error: updateError } = await supabase
        .from('interview_prep')
        .update({
          questions: mockQuestions,
          status: 'in_progress',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchInterviewDetails();
    } catch (err) {
      console.error('Error starting practice:', err);
      setError('Failed to start practice session');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to access interview preparations.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/interview-prep')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Interview Prep
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading interview details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchInterviewDetails}
              className="text-red-600 hover:text-red-700 font-medium underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Interview Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      id="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Add any notes or topics you want to cover..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={startPractice}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    Start Practice
                  </button>
                </div>
              </form>
            </div>

            {interview?.questions?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Questions</h3>
                <div className="space-y-4">
                  {interview.questions.map((q, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{q.question}</p>
                      <p className="text-sm text-gray-500 mt-1">Type: {q.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 