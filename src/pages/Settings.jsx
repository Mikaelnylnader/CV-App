import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import Sidebar from '../components/dashboard/Sidebar';
import { 
  BellIcon, 
  GlobeAltIcon, 
  KeyIcon, 
  UserIcon,
  ShieldCheckIcon,
  SunIcon,
  MoonIcon,
  CreditCardIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import PromoCodeSection from '../components/settings/PromoCodeSection';

export default function Settings() {
  const { user, updateEmail, updatePassword } = useAuth();
  const { subscription, cancelSubscription } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
    notifications: {
      email: true,
      browser: true,
      resume_updates: true,
      marketing: false
    },
    language: 'en',
    theme: 'light',
    darkMode: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await updatePassword(formData.currentPassword, formData.newPassword);
      setSuccess('Password updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError('Failed to update password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateEmail(formData.newEmail);
      setSuccess('Email updated successfully!');
      setFormData(prev => ({ ...prev, newEmail: '' }));
    } catch (err) {
      setError('Failed to update email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await cancelSubscription();
        setSuccess('Subscription cancelled successfully.');
      } catch (err) {
        setError('Failed to cancel subscription. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="Account Settings" />
      <main className="flex-1 overflow-y-auto md:ml-16">
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            {/* Account Security Section */}
            <section className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ShieldCheckIcon className="h-6 w-6 mr-2 text-gray-500" />
                Security Settings
              </h2>
              
              {/* Change Password Form */}
              <form onSubmit={handlePasswordChange} className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>

              {/* Change Email Form */}
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Email Address</label>
                  <input
                    type="email"
                    name="newEmail"
                    value={formData.newEmail}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Email'}
                </button>
              </form>
            </section>

            {/* Subscription Section */}
            <section className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCardIcon className="h-6 w-6 mr-2 text-gray-500" />
                Subscription
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Current Plan</h3>
                    <p className="text-gray-500">{subscription?.plan || 'Free'}</p>
                  </div>
                  {subscription?.plan !== 'Free' && (
                    <button
                      onClick={handleCancelSubscription}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Billing Cycle</h3>
                  <p className="text-gray-500">{subscription?.billingCycle || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Next Billing Date</h3>
                  <p className="text-gray-500">{subscription?.nextBillingDate || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Notifications Section */}
            <section className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BellIcon className="h-6 w-6 mr-2 text-gray-500" />
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {Object.entries(formData.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                    >
                      <span
                        className={`${
                          value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Promo Code Section */}
            <PromoCodeSection />
          </div>
        </div>
      </main>
    </div>
  );
}