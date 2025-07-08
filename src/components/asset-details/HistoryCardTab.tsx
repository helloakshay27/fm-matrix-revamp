
import React from 'react';
import { FileText, Clock } from 'lucide-react';

export const HistoryCardTab = () => {
  const historyData = [
    { label: 'Equipment Name', value: 'sdcsdc' },
    { label: 'Supplier', value: 'Reliance Digital' },
    { label: 'Capacity', value: '10 10' },
    { label: 'Date of Commissioning', value: '17/03/2025' },
    { label: 'Seerial Number', value: 'sdcsdc' },
    { label: 'Manufacturer', value: '-' },
    { label: 'Date of Purchase', value: '26/05/2024' },
    { label: 'Date of installation', value: '-' },
    { label: 'Model Number', value: 'tested' },
    { label: 'Asset Code', value: '026dd95aa50e6203182a' }
  ];

  const rightSideData = [
    { label: 'Manufacturer', value: '-' },
    { label: 'Date of Purchase', value: '26/05/2024' },
    { label: 'Date of installation', value: '-' },
    { label: 'Model Number', value: 'tested' },
    { label: 'Asset Code', value: '026dd95aa50e6203182a' },
    { label: 'Supplier', value: 'Haven infoline' },
    { label: 'Capacity', value: '-' },
    { label: 'Date of Commissioning', value: '17/03/2025' },
    { label: 'Seerial Number', value: 'MUM-CREST-9090' },
    { label: 'Location of Asset', value: 'Site - Loccated / Building - sebc / Wing - N/A / Floor - N/A / Area - N/A / Room - N/A' }
  ];

  return (
    <div className="space-y-12">
      {/* First History Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
            <FileText className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">History In Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-4 lg:gap-y-6">
          {historyData.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1 sm:gap-0">
              <span className="text-gray-600 text-sm">{item.label}</span>
              <span className="font-medium text-sm break-all sm:break-normal">: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Second History Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
            <Clock className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">History In Details</h3>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Type of activity</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Description</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">Performed by</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Empty table body */}
                <tr>
                  <td colSpan={4} className="px-4 sm:px-6 py-8 text-center text-gray-500 text-sm">
                    No history records available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
