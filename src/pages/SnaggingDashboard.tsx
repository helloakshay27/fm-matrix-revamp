
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SnaggingDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleUserSnagClick = () => {
    navigate('/transitioning/snagging/user-snag');
    setIsDropdownOpen(false);
  };

  const handleMySnagClick = () => {
    navigate('/transitioning/snagging/my-snags');
    setIsDropdownOpen(false);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">SNAGGING</h1>
        
        {/* Dropdown Navigation */}
        <div className="relative inline-block">
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90 flex items-center gap-2"
          >
            Select Snag Type
            <ChevronDown className="w-4 h-4" />
          </Button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={handleUserSnagClick}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  User Snag
                </button>
                <button
                  onClick={handleMySnagClick}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  My Snags
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Select a Snag Type</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#C72030] rounded-full"></div>
              <span><strong>User Snag:</strong> View and manage all user-reported snags</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#C72030] rounded-full"></div>
              <span><strong>My Snags:</strong> View and manage your personal snags</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
