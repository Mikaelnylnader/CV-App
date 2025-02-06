import React, { useState } from 'react';
import { testConnection } from '../lib/supabaseClient';

export default function ConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runTest = async () => {
    setTesting(true);
    setError(null);
    setResults(null);

    try {
      const testResults = await testConnection();
      setResults(testResults);
    } catch (err) {
      console.error('Connection test error:', err);
      setError(err.message || 'An error occurred while testing the connection');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={runTest}
        disabled={testing}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          testing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        }`}
      >
        {testing ? 'Testing Connection...' : 'Test Connection'}
      </button>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          <p className="font-medium">Connection Error:</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-3">
          <div className={`p-4 rounded-md ${
            results.healthCheck ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <p className="font-medium">API Health Check:</p>
            <p className={results.healthCheck ? 'text-green-700' : 'text-red-700'}>
              {results.healthCheck ? 'Success' : 'Failed'}
            </p>
            {results.healthCheckError && (
              <p className="mt-1 text-red-700">{results.healthCheckError}</p>
            )}
          </div>

          <div className={`p-4 rounded-md ${
            results.authCheck ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <p className="font-medium">Authentication Check:</p>
            <p className={results.authCheck ? 'text-green-700' : 'text-red-700'}>
              {results.authCheck ? 'Success' : 'Failed'}
            </p>
            {results.authCheckError && (
              <p className="mt-1 text-red-700">{results.authCheckError}</p>
            )}
          </div>

          <div className={`p-4 rounded-md ${
            results.dbCheck ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <p className="font-medium">Database Check:</p>
            <p className={results.dbCheck ? 'text-green-700' : 'text-red-700'}>
              {results.dbCheck ? 'Success' : 'Failed'}
            </p>
            {results.dbCheckError && (
              <p className="mt-1 text-red-700">{results.dbCheckError}</p>
            )}
          </div>

          {(results.healthCheckError || results.authCheckError || results.dbCheckError) && (
            <div className="p-4 bg-yellow-100 rounded-md">
              <p className="font-medium text-yellow-800">Troubleshooting Tips:</p>
              <ul className="mt-2 list-disc list-inside text-yellow-700">
                <li>Clear your browser cache and cookies</li>
                <li>Try using an incognito/private window</li>
                <li>Disable any ad blockers or VPN</li>
                <li>Check your internet connection</li>
                <li>Try a different browser</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 