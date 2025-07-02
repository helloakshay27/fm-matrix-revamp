
import React from 'react';
import { Building, Plus, Search, Filter } from 'lucide-react';

const SpaceManagementDashboard = () => {
  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Space Management</h1>
        <p className="text-gray-600">Manage workspace and facility spaces</p>
      </div>

      <div className="mb-6 flex gap-4 items-center">
        <button className="bg-[#C72030] hover:bg-[#A01828] text-white px-4 py-2 rounded-md font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Space
        </button>
        <div className="flex gap-2 ml-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search spaces..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-sm w-64"
            />
          </div>
          <button className="border border-gray-300 px-3 py-2 rounded-md bg-white text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No spaces found</h3>
            <p className="text-sm">Start by adding your first space</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SpaceManagementDashboard };
