
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';

export const ViewPerformancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Calendar data - June 2025
  const daysInMonth = 30;
  const startDay = 0; // Sunday
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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">meter reading</h1>
          <div className="flex gap-3">
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="text-white"
            >
              Apply
            </Button>
            <Button 
              variant="outline"
              className="border-[#C72030] text-[#C72030]"
            >
              Reset
            </Button>
            <Button 
              style={{ backgroundColor: '#3B82F6' }}
              className="text-white"
            >
              Export
            </Button>
            <Button 
              style={{ backgroundColor: '#10B981' }}
              className="text-white"
            >
              Verify
            </Button>
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="text-white"
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

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-medium text-sm text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  aspect-square border border-gray-200 p-2 text-center text-sm
                  ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
                  ${day === today ? 'bg-blue-100 border-blue-300' : ''}
                `}
              >
                {day && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="font-medium">{String(day).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500">
                      {months[5]} {/* June */}
                    </div>
                    <div className="text-xs text-gray-500">2025</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Asset Activity Table */}
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium bg-gray-100 p-2">Asset Name</div>
                <div className="p-2 border">Energy Meter 1</div>
              </div>
              <div>
                <div className="font-medium bg-gray-100 p-2">Activity</div>
                <div className="p-2 border">Kwah</div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 flex justify-between text-sm text-gray-600">
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
          className="px-8"
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
