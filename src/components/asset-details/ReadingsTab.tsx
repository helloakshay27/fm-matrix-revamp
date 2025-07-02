
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';

export const ReadingsTab = () => {
  const [fromDate, setFromDate] = useState('2025-05-19');
  const [toDate, setToDate] = useState('2025-06-17');

  const handleApply = () => {
    console.log('Apply date range:', { fromDate, toDate });
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
  };

  const tableHeaders = [
    'Particulars', 'UOM', 'MF', 'Balance',
    '19 MAY', '20 MAY', '21 MAY', '22 MAY', '23 MAY', '24 MAY', '25 MAY', '26 MAY', 
    '27 MAY', '28 MAY', '29 MAY', '30 MAY', '31 MAY', '01 JUN', '02 JUN', '03 JUN', '04 JUN'
  ];

  return (
    <div className="space-y-6">
      {/* Date Range and Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <MaterialDatePicker
            value={fromDate}
            onChange={setFromDate}
            placeholder="From Date"
            className="w-48"
          />
          <span className="text-gray-500">-</span>
          <MaterialDatePicker
            value={toDate}
            onChange={setToDate}
            placeholder="To Date"
            className="w-48"
          />
        </div>
        <Button 
          onClick={handleApply}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          Apply
        </Button>
        <Button 
          onClick={handleReset}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Reset
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        (Maximum allowed days are 30)
      </div>

      {/* Consumption Tables */}
      <div className="space-y-8">
        {/* First Consumption Table */}
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
                      <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-now border-r border-gray-200 last:border-r-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {/* Empty row for spacing */}
                  <tr>
                    <td colSpan={tableHeaders.length} className="h-8"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Second Consumption Table */}
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
                  {/* Empty row for spacing */}
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
