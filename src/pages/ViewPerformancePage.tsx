
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const ViewPerformancePage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Schedule</span>
          <span>&gt;</span>
          <span>View Performance</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">meter reading</h1>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm">01/06/2025</span>
            <span className="text-sm">30/06/2025</span>
            <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">Energy Meter 1</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              style={{ backgroundColor: '#4CAF50' }}
              className="text-white"
            >
              Apply
            </Button>
            <Button 
              style={{ backgroundColor: '#FF9800' }}
              className="text-white"
            >
              Reset
            </Button>
            <Button 
              style={{ backgroundColor: '#2196F3' }}
              className="text-white"
            >
              Export
            </Button>
            <Button 
              style={{ backgroundColor: '#9C27B0' }}
              className="text-white"
            >
              Verify
            </Button>
            <Button 
              style={{ backgroundColor: '#2196F3' }}
              className="text-white"
            >
              Download Pdf
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="grid grid-cols-31 border-b">
          {/* Calendar Headers */}
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const date = `${day.toString().padStart(2, '0')}`;
            const month = 'Jun';
            const year = '2025';
            
            return (
              <div key={i} className="p-2 text-center text-xs border-r bg-gray-50">
                <div className="font-medium">{date}</div>
                <div className="text-gray-500">{month}</div>
                <div className="text-gray-500">{year}</div>
              </div>
            );
          })}
        </div>
        
        {/* Asset Row */}
        <div className="grid grid-cols-31 border-b">
          <div className="col-span-2 p-4 border-r bg-gray-50">
            <div className="font-medium">Asset Name</div>
            <div className="text-sm text-gray-600">Activity</div>
          </div>
          <div className="col-span-29 grid grid-cols-29">
            <div className="p-4 border-r">
              <div className="font-medium">Energy Meter 1</div>
              <div className="text-sm text-gray-600">Kwah</div>
            </div>
            {Array.from({ length: 28 }, (_, i) => (
              <div key={i} className="p-4 border-r">
                {/* Empty cells for other days */}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Performed By:- Function 2
          </div>
          <div className="text-sm text-gray-600">
            Approved By:-
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Button 
          onClick={() => navigate('/maintenance/schedule')}
          variant="outline"
          className="px-8"
        >
          Back to Schedule List
        </Button>
      </div>
    </div>
  );
};
