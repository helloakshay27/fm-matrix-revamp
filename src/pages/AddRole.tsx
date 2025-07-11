
import React from 'react';
import { Plus, Shield } from 'lucide-react';

const AddRole = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Plus className="w-6 h-6" />
        <Shield className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">Add Role</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-600">Add role functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default AddRole;
