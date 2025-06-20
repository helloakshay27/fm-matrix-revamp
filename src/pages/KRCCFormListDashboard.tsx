
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Download } from 'lucide-react';

export const KRCCFormListDashboard = () => {
  const [forms] = useState([
    // Empty data as shown in the image
  ]);

  return (
    <div className="p-6 bg-white">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        Krcc Forms &gt; KRCC fORM List
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KRCC FORM LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {forms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                forms.map((form, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-900">{form.action}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{form.user}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{form.userEmail}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{form.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{form.delete}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
        Powered by Phygital.work
      </div>
    </div>
  );
};
