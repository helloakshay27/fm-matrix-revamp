
import React from 'react';
import { useAllocationData } from '@/hooks/useAllocationData';

interface AllocateToSectionProps {
  allocateTo: string;
  setAllocateTo: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  user: string;
  setUser: (value: string) => void;
}

export const AllocateToSection: React.FC<AllocateToSectionProps> = ({
  allocateTo,
  setAllocateTo,
  department,
  setDepartment,
  user,
  setUser,
}) => {
  const { departments, users, loading } = useAllocationData();

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Allocate To</h3>
      
      {/* Radio buttons */}
      <div className="flex gap-6 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="department"
            checked={allocateTo === 'department'}
            onChange={(e) => setAllocateTo(e.target.value)}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Department</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="user"
            checked={allocateTo === 'user'}
            onChange={(e) => setAllocateTo(e.target.value)}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">User</span>
        </label>
      </div>

      {/* Department dropdown */}
      {allocateTo === 'department' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Select Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading.departments}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id.toString()}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* User dropdown */}
      {allocateTo === 'user' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Select User
          </label>
          <select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading.users}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id.toString()}>
                {u.name} {u.email && `(${u.email})`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
