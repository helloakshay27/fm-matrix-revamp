
import React from 'react';
import { Eye } from 'lucide-react';

export const EnergyAMCDetailsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✕</span>
        </div>
        <h3 className="text-lg font-semibold text-[#C72030] uppercase">AMC Details</h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sr.No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Supplier</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Start Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">End Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">First Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created On</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900">1</td>
              <td className="px-4 py-3 text-sm text-gray-900">Schneider</td>
              <td className="px-4 py-3 text-sm text-gray-900">12/25/2024</td>
              <td className="px-4 py-3 text-sm text-gray-900">01/05/2025</td>
              <td className="px-4 py-3 text-sm text-gray-900">17/02/2025</td>
              <td className="px-4 py-3 text-sm text-gray-900">04/02/2025</td>
              <td className="px-4 py-3">
                <button className="text-gray-500 hover:text-gray-700">
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
