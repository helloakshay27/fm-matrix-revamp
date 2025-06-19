
import React from 'react';
import { Eye } from 'lucide-react';

export const EnergyAMCDetailsTab = () => {
  const amcData = [
    {
      srNo: 1,
      supplier: 'Schindler',
      startDate: '12/12/2024',
      endDate: '01/05/2025',
      firstService: '17/02/2025',
      createdOn: '04/02/2025'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✗</div>
        <h3 className="text-lg font-semibold text-orange-500 uppercase">AMC Details</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">S.No</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Supplier</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Start Date</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">End Date</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">First Service</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Created On</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {amcData.map((amc) => (
              <tr key={amc.srNo} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2 text-sm">{amc.srNo}</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-blue-600">{amc.supplier}</td>
                <td className="border border-gray-200 px-4 py-2 text-sm">{amc.startDate}</td>
                <td className="border border-gray-200 px-4 py-2 text-sm">{amc.endDate}</td>
                <td className="border border-gray-200 px-4 py-2 text-sm">{amc.firstService}</td>
                <td className="border border-gray-200 px-4 py-2 text-sm">{amc.createdOn}</td>
                <td className="border border-gray-200 px-4 py-2 text-sm">
                  <button className="text-gray-600 hover:text-gray-800">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
