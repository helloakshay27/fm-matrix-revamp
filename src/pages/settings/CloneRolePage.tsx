
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

export const CloneRolePage = () => {
  const [fromUser, setFromUser] = useState('');
  const [toUser, setToUser] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (fromUser && toUser) {
      console.log('Cloning role from:', fromUser, 'to:', toUser);
      // Handle clone logic here
      navigate('/settings/users');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 text-white px-6 py-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings/users')}
            className="text-white hover:text-gray-200"
          >
            ← Back
          </button>
          <span className="font-medium">Setup</span>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8">
            <span className="text-gray-600">Home</span>
            <span className="text-gray-600">Dashboard</span>
            <span className="bg-orange-500 text-white px-4 py-2 rounded">Setup</span>
            <span className="text-gray-600">Executive Dashboard</span>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Handover To Section */}
              <div className="text-center">
                <div className="bg-blue-800 text-white py-3 px-6 rounded-lg mb-6">
                  <h2 className="text-lg font-semibold">Handover To</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From User
                    </label>
                    <Select value={fromUser} onValueChange={setFromUser}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kunal">Kunal Javare</SelectItem>
                        <SelectItem value="demo">zs Demo</SelectItem>
                        <SelectItem value="rabi">Rabi Narayan</SelectItem>
                        <SelectItem value="psipl">PSIPL 1</SelectItem>
                        <SelectItem value="admin">admin admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Clone To Section */}
              <div className="text-center">
                <div className="bg-gray-600 text-white py-3 px-6 rounded-lg mb-6">
                  <h2 className="text-lg font-semibold">Clone To</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To User
                    </label>
                    <Select value={toUser} onValueChange={setToUser}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kunal">Kunal Javare</SelectItem>
                        <SelectItem value="demo">zs Demo</SelectItem>
                        <SelectItem value="rabi">Rabi Narayan</SelectItem>
                        <SelectItem value="psipl">PSIPL 1</SelectItem>
                        <SelectItem value="admin">admin admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleSubmit}
                disabled={!fromUser || !toUser}
                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-2 disabled:bg-gray-300"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
