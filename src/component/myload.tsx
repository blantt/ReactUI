import React from 'react';

interface LoadingProps {
  isLoading: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  );
};

const LoadingInline: React.FC<LoadingProps> = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p className="text-gray-700 text-sm">{message}</p>
      </div>
    </div>
  );
};

export { LoadingInline };
export default Loading;