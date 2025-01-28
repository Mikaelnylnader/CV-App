import React, { useState } from 'react';
import { promoCodeService } from '../../services/promoCodeService';

export default function PromoCodeSection() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await promoCodeService.redeemCode(code);
      setSuccess(result.message);
      setCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Redeem Promo Code</h3>
      
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700">
            Enter Promo Code
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="promo-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="BETA2024-XXX"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            (loading || !code.trim()) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Redeeming...' : 'Redeem Code'}
        </button>
      </form>
    </div>
  );
} 