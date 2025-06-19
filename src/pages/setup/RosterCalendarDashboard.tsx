
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Clock, Filter } from "lucide-react";
import { RosterCalendarFilterDialog } from "@/components/RosterCalendarFilterDialog";

export const RosterCalendarDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Statistics data
  const stats = [
    { title: 'Total No. of Seats', value: '73', color: 'bg-purple-500' },
    { title: 'Employee Schedules', value: '12', color: 'bg-orange-400' },
    { title: 'Employee Check In', value: '0', color: 'bg-orange-500' },
    { title: 'No of Requests', value: '0', color: 'bg-gray-600' },
    { title: 'No of Waiting List', value: '0', color: 'bg-green-500' }
  ];

  // Occupancy legend
  const occupancyLegend = [
    { label: '0%-25%', color: 'bg-green-200' },
    { label: '25%-50%', color: 'bg-blue-200' },
    { label: '50%-75%', color: 'bg-yellow-200' },
    { label: '75%-99%', color: 'bg-orange-200' },
    { label: '100%', color: 'bg-red-200' }
  ];

  // Seat types
  const seatTypes = ['Linear WS', 'Angular WS', 'Common', 'PMT', 'test Seat'];

  // Generate dates for June 2025
  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 30; i++) {
      dates.push(i.toString().padStart(2, '0'));
    }
    return dates;
  };

  // Sample shift data
  const shifts = [
    '00:30 AM to 01:30 PM',
    '02:45 PM to 11:45 PM',
    '10:00 AM to 07:00 PM',
    '05:15 PM to 07:00 PM',
    '06:30 PM to 10:30 PM',
    '09:00 AM to 01:30 PM',
    '08:00 AM to 12:00 PM',
    '12:45 PM to 03:45 PM',
    '12:00 PM to 04:00 PM',
    '07:00 AM to 12:00 PM',
    '11:30 AM to 05:30 PM',
    '07:00 PM to 11:30 PM',
    '07:00 AM to 12:00 PM',
    '07:30 AM to 12:00 PM',
    '05:00 AM to 11:00 AM',
    '10:30 AM to 02:30 PM',
    '10:45 AM to 02:45 PM',
    '11:45 AM to 02:45 PM',
    '12:30 PM to 05:30 PM',
    '04:00 PM to 11:00 PM',
    '04:30 PM to 11:30 PM',
    '06:00 PM to 10:00 PM',
    '11:00 AM to 01:00 PM',
    '03:45 PM to 06:15 PM',
    '05:30 PM to 07:00 PM',
    '03:15 PM to 06:15 PM',
    '08:00 PM to 11:00 PM',
    '06:45 PM to 11:00 PM',
    '07:15 PM to 11:15 PM',
    '01:45 PM to 04:30 PM',
    '10:00 AM to 11:00 AM',
    '10:00 AM to 02:00 PM',
    '10:00 AM to 07:00 PM',
    '09:00 AM to 06:00 PM',
    '03:30 PM to 11:00 PM',
    '12:15 PM to 09:15 PM',
    '08:00 AM to 07:00 PM'
  ];

  const dates = generateDates();

  const handleFilterApply = (filters: {
    location: string;
    floor: string;
    startDate: string;
    endDate: string;
  }) => {
    console.log('Applied roster calendar filters:', filters);
    // Apply filter logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className={`${stat.color} text-white`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm opacity-90">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Button */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Legend Section */}
        <div className="mb-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="font-medium">Occupancy</span>
            {occupancyLegend.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${item.color} border`}></div>
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium">Seat Type</span>
            {seatTypes.map((type, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold">01 Jun 2025 - 30 Jun 2025</h2>
        </div>

        {/* Roster Grid */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium w-48">Shift</th>
                    {dates.map((date) => (
                      <th key={date} className="text-center p-2 min-w-[40px] font-medium text-sm">
                        {date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift, shiftIndex) => (
                    <tr key={shiftIndex} className={shiftIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 text-sm font-medium border-r">
                        {shift}
                      </td>
                      {dates.map((date) => (
                        <td key={date} className="p-1">
                          <div className="w-8 h-8 bg-green-200 rounded"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold">Phygitalwork</span>
          </p>
        </div>

        <RosterCalendarFilterDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={handleFilterApply}
        />
      </div>
    </div>
  );
};
