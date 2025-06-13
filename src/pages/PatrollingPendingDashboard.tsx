
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const PatrollingPendingDashboard = () => {
  const missedPatrollingData = [
    {
      id: 344,
      location: 'Site - Lockated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 343,
      location: 'Site - Lockated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 297,
      location: 'Site - Lockated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 294,
      location: 'Site - Lockated / Building - Hay / Wing - NA / Floor - NA / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 293,
      location: 'Site - Lockated / Building - Jyoti Tower / Wing - NA / Floor - NA / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 291,
      location: 'Site - Lockated / Building - Nirvana Tower / Wing - B / Floor - NA / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 290,
      location: 'Site - Lockated / Building - Nirvana Tower / Wing - A Wing / Floor - 1st flooor / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 289,
      location: 'Site - Lockated / Building - Nirvana Tower / Wing - A Wing / Floor - 1st flooor / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 288,
      location: 'Site - Lockated / Building - Nirvana Tower / Wing - A Wing / Floor - 1st flooor / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 287,
      location: 'Site - Lockated / Building - Nirvana Tower / Wing - A Wing / Floor - 11th Floor / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 285,
      location: 'Site - Lockated / Building - Nirvana Tower / Wing - A / Floor - NA / Room - NA',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    },
    {
      id: 283,
      location: 'Site - Lockated / Building - Gophygital / Wing - East & West / Floor - 6 / Room - WorkStation1',
      scheduledTime: 'June 13, 2025 at 05:00 PM',
      status: 'Missed'
    }
  ];

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Patrolling Pending Approvals</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-xl font-semibold mb-4">Patrolling Histories for Lockated</h1>
          
          {/* Info Banner */}
          <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-700 text-sm">
              Showing patrollings from today 07:00 AM to 03:00 PM
            </p>
          </div>

          {/* Main Table Header */}
          <div className="mb-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>ID</TableHead>
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
                  <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                    No patrollings found for this time period
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Missed Patrolling Section */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="bg-red-500 text-white px-4 py-2 font-semibold">
              Missed Patrolling (13)
            </div>
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missedPatrollingData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="text-blue-600">{item.location}</TableCell>
                      <TableCell>{item.scheduledTime}</TableCell>
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
    </div>
  );
};
