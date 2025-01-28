import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UpgradeModal({ feature, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Upgrade Required</h3>
        <p className="text-gray-600 mb-6">
          This feature requires a Pro or Lifetime subscription. Upgrade your plan to access:
          {feature && <span className="block font-medium mt-2">• {feature}</span>}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate('/#pricing')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}