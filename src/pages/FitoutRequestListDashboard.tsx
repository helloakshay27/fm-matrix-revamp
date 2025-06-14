
import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectLayout } from '@/components/ProjectLayout';

export const FitoutRequestListDashboard = () => {
  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          <span>Project</span>
          <span className="mx-2">&gt;</span>
          <span>Fitout Requests</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">Fitout Request List</span>
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FITOUT REQUEST LIST</h1>
          <div className="flex gap-2">
            <Button className="bg-[#C72030] hover:bg-[#A01828] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tower</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Master Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created on</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Empty state - no data shown in the image */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};
