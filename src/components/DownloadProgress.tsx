import React from 'react';

interface DownloadProgressProps {
  progress: number;
  filename: string;
}

export default function DownloadProgress({ progress, filename }: DownloadProgressProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Downloading {filename}
        </span>
        <span className="text-sm text-gray-500">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}