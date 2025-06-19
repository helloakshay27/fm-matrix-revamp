
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export const EnergyReadingsTab = () => {
  const [dateRange, setDateRange] = useState('05/19/2025 - 06/17/2025');

  const tableHeaders = [
    'Particulars', 'UOM', 'MF', 'Balance',
    '19 MAY', '20 MAY', '21 MAY', '22 MAY', '23 MAY', '24 MAY', '25 MAY', '26 MAY', 
    '27 MAY', '28 MAY', '29 MAY', '30 MAY', '31 MAY', '01 JUN', '02 JUN', '03 JUN', '04 JUN'
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
      </div>
    </div>
  );
};
