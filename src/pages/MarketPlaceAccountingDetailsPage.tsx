
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MarketPlaceAccountingDetailsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-medium text-gray-800 mb-4">ACCOUNT EDIT/DETAIL</h1>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 text-sm mb-6">
            Look account was successfully created.
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4 text-sm">
          <div className="flex">
            <span className="font-medium w-32">Uniq:</span>
            <span>uso24bn</span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">As of:</span>
            <span>Pma-Site</span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">As of:</span>
            <span>2189</span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">Name:</span>
            <span>nadia</span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">Country:</span>
            <span></span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">State:</span>
            <span></span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">City:</span>
            <span></span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">Time zone:</span>
            <span></span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">Currency code:</span>
            <span></span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">Language:</span>
            <span></span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">Get registered:</span>
            <span></span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">Client portal:</span>
            <span></span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">Active:</span>
            <span>true</span>
          </div>
          
          <div className="flex">
            <span className="font-medium w-32">Is delete:</span>
            <span></span>
          </div>
        </div>

        {/* Action Links */}
        <div className="mt-8 space-x-2">
          <button 
            onClick={() => navigate('/market-place/accounting')}
            className="text-blue-600 hover:underline text-sm"
          >
            Edit
          </button>
          <span className="text-gray-400">|</span>
          <button 
            onClick={() => navigate('/market-place')}
            className="text-blue-600 hover:underline text-sm"
          >
            Back
          </button>
        </div>

        {/* Footer with LOCKATED branding */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Powered by</span>
            <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-xs">L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
