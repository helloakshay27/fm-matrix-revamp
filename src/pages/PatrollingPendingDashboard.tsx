
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const missedPatrollingData = [
  {
    id: 344,
    location: "Site - Locktated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA",
    scheduledTime: "June 13, 2024 at 10:00 PM",
    status: "Missed"
  },
  {
    id: 343,
    location: "Site - Locktated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA", 
    scheduledTime: "June 13, 2024 at 10:00 PM",
    status: "Missed"
  },
  {
    id: 297,
    location: "Site - Locktated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA",
    scheduledTime: "June 13, 2024 at 10:00 PM", 
    status: "Missed"
  },
  {
    id: 294,
    location: "Site - Locktated / Building - Hay / Wing - NA / Floor - NA / Room - NA",
    scheduledTime: "June 13, 2024 at 10:00 PM",
    status: "Missed"
  },
  {
    id: 293,
    location: "Site - Locktated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA",
    scheduledTime: "June 13, 2024 at 10:00 PM",
    status: "Missed"
  },
  {
    id: 291,
    location: "Site - Locktated / Building - Minoux Tower / Wing - B / Floor - NA / Room - NA",
    scheduledTime: "June 13, 2024 at 10:00 PM",
    status: "Missed"
  },
  {
    id: 290,
    location: "Site - Locktated / Building - Minoux Tower / Wing - A Wing / Floor - 1st floor / Room - NA",
    scheduledTime: "June 13, 2024 at 10:00 PM",
    status: "Missed"
  },
  {
    id: 289,
    location: "Site - Locktated / Building - Minoux Tower / Wing - A Wing / Floor - 1st floor / Room - NA", 
    scheduledTime: "June 13, 2024 at 10:00 PM",
    status: "Missed"
  },
  {
    id: 288,
    location: "Site - Locktated / Building - Minoux Tower / Wing - A Wing / Floor - 1st floor / Room - NA",
    scheduledTime: "June 13, 2024 at 10:00 PM",
    status: "Missed"
  },
  {
    id: 287,
    location: "Site - Locktated / Building - Minoux Tower / Wing - A Wing / Floor - 11th Floor / Room - NA",
    scheduledTime: "June 13, 2024 at 10:00 PM", 
    status: "Missed"
  }
];

export const PatrollingPendingDashboard = () => {
  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Patrolling Pending Approvals</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Patrolling Histories for Locktated</h1>
            <p className="text-sm text-blue-600">Showing patrollings from today 07:00 AM to 10:59 PM</p>
          </div>

          {/* Upper Table Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Patrolling Date</TableHead>
                    <TableHead>Patrolling Time</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Guard</TableHead>
                    <TableHead>Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-gray-500 py-8">
                      No patrollings found for this time period.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Missed Patrolling Section */}
          <div className="bg-red-500 text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Missed Patrolling (13)</h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missedPatrollingData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="text-sm">{item.location}</TableCell>
                    <TableCell className="text-sm">{item.scheduledTime}</TableCell>
                    <TableCell>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
