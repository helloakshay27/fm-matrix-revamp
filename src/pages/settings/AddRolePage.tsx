import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddRolePage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/settings/roles/role');
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">Add New Role</h1>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        <p className="text-center text-gray-500">Add Role functionality coming soon...</p>
      </div>
    </div>
  );
};
