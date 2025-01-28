import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import { 
  BellIcon, 
  GlobeAltIcon, 
  KeyIcon, 
  UserIcon,
  ShieldCheckIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import PromoCodeSection from '../components/settings/PromoCodeSection';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
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

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleLanguageChange = (e) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value
    }));
  };

  const handleDarkModeChange = () => {
    setSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement settings save logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="Account Settings" />
      <main className="flex-1 overflow-y-auto md:ml-16">
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            
            {/* Promo Code Section */}
            <PromoCodeSection />
            
            {/* Add other settings sections here */}
          </div>
        </div>
      </main>
    </div>
  );
}