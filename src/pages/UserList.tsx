
import React from 'react';
import { Users } from 'lucide-react';

const UserList = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-600">User list functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default UserList;
