
import React, { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const KRCCFormListDashboard = () => {
  const [showFilters, setShowFilters] = useState(false);

  // Sample data structure based on the image
  const formData = [
    // Currently empty as shown in the image
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Krcc Forms &gt; KRCC FORM List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">KRCC FORM LIST</h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button 
          variant="outline" 
          className="border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button className="bg-[#8B5A3C] hover:bg-[#7A4A2C] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No KRCC forms found
                  </td>
                </tr>
              ) : (
                formData.map((form, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{form.action}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{form.user}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">{form.userEmail}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{form.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{form.delete}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
