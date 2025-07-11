
import React from 'react';
import { Shield } from 'lucide-react';

const RoleList = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-600">Role list functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default RoleList;
