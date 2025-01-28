import React, { useEffect } from 'react';

export default function Toast({ message, isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}

// Add fade-in animation to tailwind.config.js if not already present
// animation: {
//   'fade-in': 'fadeIn 0.2s ease-in-out',
// },
// keyframes: {
//   fadeIn: {
//     '0%': { opacity: '0', transform: 'translateY(-10px)' },
//     '100%': { opacity: '1', transform: 'translateY(0)' },
//   },
// }, 