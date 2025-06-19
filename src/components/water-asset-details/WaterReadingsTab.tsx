
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export const WaterReadingsTab = () => {
  const [dateRange, setDateRange] = useState('05/21/2025 - 06/19/2025');

  const tableHeaders = [
    'Particulars', 'UOM', 'MF', 'Balance',
    '21 MAY', '22 MAY', '23 MAY', '24 MAY', '25 MAY', '26 MAY', '27 MAY', '28 MAY', 
    '29 MAY', '30 MAY', '31 MAY', '01 JUN', '02 JUN', '03 JUN', '04 JUN', '05 JUN', '06 JUN', '07 JUN', '08 JUN', '09 JUN', '10 JUN', '11 JUN', '12 JUN', '13 JUN', '14 JUN', '15 JUN', '16 JUN', '17 JUN', '18 JUN', '19 JUN'
  ];

  const consumptionData = [
    { particular: 'kl', uom: 'kl', mf: '', values: Array(30).fill('0.0') },
    { particular: 'Opening', uom: 'kl', mf: '', values: Array(30).fill('0.0') },
    { particular: 'Closing', uom: 'kl', mf: '', values: Array(30).fill('0.0') },
    { particular: 'Consumption', uom: 'kl', mf: '', values: Array(30).fill('0.0') }
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
                <tbody className="bg-white divide-y divide-gray-200">
                  {consumptionData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm text-blue-600 border-r border-gray-200">{row.particular}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">{row.uom}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">{row.mf}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200">0.0</td>
                      {row.values.map((value, valueIndex) => (
                        <td key={valueIndex} className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200 last:border-r-0">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
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
                    {Array.from({length: 18}, (_, i) => (
                      <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">
                        {21 + i} MAY
                      </th>
                    ))}
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
