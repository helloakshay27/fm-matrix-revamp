
import React from 'react';

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
            <span className="text-white text-xs">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">History In Details</h3>
        </div>

        <div className="grid grid-cols-2 gap-x-16 gap-y-6">
          {historyData.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">{item.label}</span>
              <span className="font-medium text-sm">: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Second History Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
            <span className="text-white text-xs">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-[#C72030] uppercase">History In Details</h3>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type of activity</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Performed by</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty table body */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
