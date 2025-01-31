import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { jobApplicationService } from '../../services/jobApplicationService';
import AddApplicationModal from './AddApplicationModal';
import {
  PlusIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export default function JobApplicationTracker() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const statusColors = {
    SAVED: 'bg-gray-100 text-gray-800',
    APPLIED: 'bg-blue-100 text-blue-800',
    IN_REVIEW: 'bg-yellow-100 text-yellow-800',
    INTERVIEW_SCHEDULED: 'bg-purple-100 text-purple-800',
    INTERVIEW_COMPLETED: 'bg-indigo-100 text-indigo-800',
    OFFER_RECEIVED: 'bg-green-100 text-green-800',
    ACCEPTED: 'bg-green-200 text-green-900',
    REJECTED: 'bg-red-100 text-red-800',
    WITHDRAWN: 'bg-gray-200 text-gray-900'
  };

  useEffect(() => {
    loadApplications();
    loadAnalytics();
  }, [user]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await jobApplicationService.getApplications(user.id);
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await jobApplicationService.getAnalytics(user.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleAddApplication = async (applicationData) => {
    try {
      await jobApplicationService.createApplication({
        ...applicationData,
        user_id: user.id
      });
      loadApplications();
      loadAnalytics();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding application:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Application
        </button>
      </div>

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="w-12 h-12 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalApplications}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CalendarIcon className="w-12 h-12 text-green-500" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Applications</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.statusBreakdown?.IN_REVIEW || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="w-12 h-12 text-purple-500" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.responseRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BellIcon className="w-12 h-12 text-yellow-500" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Pending Actions</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {applications.filter(app => 
                    app.application_reminders?.some(reminder => !reminder.is_completed)
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedStatus === 'all' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          All
        </button>
        {Object.keys(statusColors).map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedStatus === status 
                ? statusColors[status] 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading applications...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications
                .filter(app => selectedStatus === 'all' || app.status === selectedStatus)
                .map(application => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.company_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.job_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[application.status]
                      }`}>
                        {application.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(application.application_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.application_reminders
                        ?.filter(reminder => !reminder.is_completed)
                        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0]?.description || 
                        <span className="text-gray-400">No pending actions</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddApplication}
        />
      )}
    </div>
  );
} 