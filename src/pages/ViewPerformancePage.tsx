
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';

export const ViewPerformancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Calendar data - June 2025
  const daysInMonth = 30;
  const startDay = 0; // Sunday (June 1, 2025 starts on Sunday)
  const today = new Date().getDate();

  const calendarDays = [];
  
  // Add empty cells for days before the month starts
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const weekDays = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
  const months = ['Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun', 'Jun'];
  const years = ['2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025', '2025'];

  const handleApply = () => {
    console.log('Apply clicked');
  };

  const handleReset = () => {
    console.log('Reset clicked');
  };

  const handleExport = () => {
    console.log('Export clicked');
  };

  const handleVerify = () => {
    console.log('Verify clicked');
  };

  const handleDownloadPdf = () => {
    console.log('Download PDF clicked');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">meter reading</h1>
          <div className="flex gap-3">
            <Button 
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Apply
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              Reset
            </Button>
            <Button 
              onClick={handleExport}
              style={{ backgroundColor: '#3B82F6' }}
              className="text-white hover:bg-blue-600"
            >
              Export
            </Button>
            <Button 
              onClick={handleVerify}
              style={{ backgroundColor: '#10B981' }}
              className="text-white hover:bg-green-600"
            >
              Verify
            </Button>
            <Button 
              onClick={handleDownloadPdf}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Download Pdf
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            01/06/2025 - 30/06/2025
          </div>
          <div className="text-sm">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Energy Meter 1</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Calendar Header Row with all 30 days */}
          <div className="grid grid-cols-30 gap-0 border-b">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center font-medium text-xs text-gray-600 p-2 border-r border-gray-200 bg-gray-50 min-w-[40px]">
                <div>{day}</div>
                <div className="text-xs">{months[index]}</div>
                <div className="text-xs">{years[index]}</div>
              </div>
            ))}
          </div>

          {/* Asset Activity Row */}
          <div className="grid grid-cols-30 gap-0">
            {/* Asset Name and Activity headers */}
            <div className="col-span-30 grid grid-cols-30 gap-0">
              {weekDays.map((day, index) => (
                <div key={index} className="border-r border-gray-200 p-2 min-h-[60px] text-center text-xs bg-white">
                  {/* Empty cells for activity data */}
                </div>
              ))}
            </div>
          </div>

          {/* Asset Info Table */}
          <div className="mt-4 mx-4 pb-4">
            <div className="grid grid-cols-2 gap-4 text-sm border">
              <div className="border-r">
                <div className="font-medium bg-gray-100 p-3 border-b">Asset Name</div>
                <div className="p-3">Energy Meter 1</div>
              </div>
              <div>
                <div className="font-medium bg-gray-100 p-3 border-b">Activity</div>
                <div className="p-3">Kwah</div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mx-4 pb-4 flex justify-between text-sm text-gray-600 border-t pt-4">
            <div>Performed By:- Function 2</div>
            <div>Approved By:-</div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6">
        <Button 
          onClick={() => navigate('/maintenance/schedule')}
          variant="outline"
          className="px-8 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Back to List
        </Button>
        <Button 
          onClick={() => navigate(`/maintenance/schedule/view/${id}`)}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90 px-8"
        >
          Back to View
        </Button>
      </div>
    </div>
  );
};
