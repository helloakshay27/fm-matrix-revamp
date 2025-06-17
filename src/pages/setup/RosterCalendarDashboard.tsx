
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export const RosterCalendarDashboard = () => {
  const [selectedMonth] = useState('01 Jun 2025 - 30 Jun 2025');

  const shifts = [
    '10:00 AM to 08:00 PM',
    '03:15 AM to 11:15 PM', 
    '01:00 AM to 11:00 PM',
    '10:00 AM to 11:00 AM',
    '10:30 AM to 06:30 PM',
    '09:00 AM to 06:00 PM',
    '10:00 AM to 07:00 PM',
    '10:15 AM to 07:30 PM',
    '02:00 AM to 06:00 AM',
    '08:00 AM to 05:00 PM'
  ];

  const seatTypes = [
    'Angular Ws', 'Flexi Desk', 'Cabin', 'Fixed Desk', 'IOS',
    'cabin', 'circular', 'Rectangle', 'circularchair',
    'Hot Desk', 'Fixed Angular Chair', 'Cubical', 'Cafe', 'Hotseat'
  ];

  const occupancyColors = [
    { range: '0%-25%', color: 'bg-green-200', selected: false },
    { range: '25%-50%', color: 'bg-green-300', selected: false },
    { range: '50%-75%', color: 'bg-blue-300', selected: false },
    { range: '75%-99%', color: 'bg-orange-300', selected: false },
    { range: '100%', color: 'bg-red-400', selected: true }
  ];

  // Generate calendar days (1-30)
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    return day;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Roster Calendar</div>
          <h1 className="text-2xl font-bold text-gray-800">ROSTER CALENDAR</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-r from-red-400 to-red-500 text-white p-4 rounded-lg">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-3">📊</div>
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm">Total No. of Seats</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-lg">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-3">📊</div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm">Employee Schedules</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-lg">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-3">📊</div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm">Employee Check In</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-lg">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-3">📊</div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm">No of Requests</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-lg">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-3">📊</div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm">No. of Waiting List</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <Button variant="outline" className="mb-4">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <div className="grid grid-cols-2 gap-8">
            {/* Occupancy */}
            <div>
              <h3 className="font-semibold mb-3">Occupancy</h3>
              <div className="flex flex-wrap gap-2">
                {occupancyColors.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-4 h-4 ${item.color} border`}></div>
                    <span className="text-sm">{item.range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seat Type */}
            <div>
              <h3 className="font-semibold mb-3">Seat Type</h3>
              <div className="flex flex-wrap gap-2">
                {seatTypes.map((type, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold">{selectedMonth}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 font-medium">Shift</th>
                  {calendarDays.map((day) => (
                    <th key={day} className="text-center p-2 font-medium text-sm">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, shiftIndex) => (
                  <tr key={shiftIndex} className="border-t">
                    <td className="p-2 text-sm">{shift}</td>
                    {calendarDays.map((day) => (
                      <td key={day} className="p-1">
                        <div className="w-8 h-8 bg-green-200 rounded border"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Powered by <span className="font-semibold">Physital.work</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
