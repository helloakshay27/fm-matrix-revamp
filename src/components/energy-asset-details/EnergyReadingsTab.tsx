
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export const EnergyReadingsTab = () => {
  const [dateRange, setDateRange] = useState('05/21/2025 - 06/19/2025');

  const tableHeaders = [
    'Particulars', 'UOM', 'MF', 'Balance',
    '21 MAY', '22 MAY', '23 MAY', '24 MAY', '25 MAY', '26 MAY', '27 MAY', '28 MAY', 
    '29 MAY', '30 MAY', '31 MAY', '01 JUN', '02 JUN', '03 JUN', '04 JUN', '05 JUN', '06 JUN', '07 JUN', '08 JUN', '09 JUN', '10 JUN', '11 JUN', '12 JUN', '13 JUN', '14 JUN', '15 JUN', '16 JUN', '17 JUN', '18 JUN', '19 JUN'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 min-w-64"
          placeholder="Select date range"
        />
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Apply
        </Button>
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          Reset
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        (Maximum allowed days are 30)
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✕</span>
            </div>
            <h3 className="text-lg font-semibold text-[#C72030] uppercase">Consumption</h3>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 last:border-r-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  <tr>
                    <td colSpan={tableHeaders.length} className="h-8"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✕</span>
            </div>
            <h3 className="text-lg font-semibold text-[#C72030] uppercase">Consumption</h3>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">Particulars</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">UOM</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">21 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">22 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">23 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">24 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">25 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">26 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">27 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">28 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">29 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">30 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">31 MAY</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">01 JUN</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">02 JUN</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">03 JUN</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">04 JUN</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">05 JUN</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">06 JUN</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">19 JUN</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  <tr>
                    <td colSpan={20} className="h-8"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
