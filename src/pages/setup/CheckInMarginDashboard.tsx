
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface CheckInData {
  id: string;
  name: string;
  department: string;
  designation: string;
  shift: string;
  seatNo: string;
  checkInGap: string;
  status: 'Released' | 'Pending' | 'On Hold';
}

interface StatusCard {
  count: number;
  label: string;
  bgColor: string;
  icon: string;
}

export const CheckInMarginDashboard = () => {
  const [checkInData] = useState<CheckInData[]>([
    {
      id: '35413',
      name: 'Sumitra Patil',
      department: 'Admin',
      designation: '',
      shift: '',
      seatNo: 'Tech 4',
      checkInGap: '16:31:26',
      status: 'Released'
    },
    {
      id: '34411',
      name: 'Nupura Waradkar',
      department: '',
      designation: '',
      shift: '',
      seatNo: 'Tech 5',
      checkInGap: '16:31:26',
      status: 'Released'
    },
    {
      id: '29928',
      name: 'Atrayee Talapatra',
      department: 'HR',
      designation: 'Business Head',
      shift: '10:00 AM to 08:00 PM',
      seatNo: 'Tech 6',
      checkInGap: '16:31:27',
      status: 'Released'
    },
    {
      id: '47629',
      name: 'Anushree D',
      department: '',
      designation: '',
      shift: '',
      seatNo: 'Tech 7',
      checkInGap: '16:31:27',
      status: 'Pending'
    },
    {
      id: '68237',
      name: 'Mitesh Patil',
      department: 'Operations',
      designation: 'Executive',
      shift: '10:00 AM to 08:00 PM',
      seatNo: 'Tech 2',
      checkInGap: '16:31:27',
      status: 'Pending'
    },
    {
      id: '49988',
      name: 'Bhumika Navle',
      department: 'Operations Dept',
      designation: 'Client Relationship Manager',
      shift: '',
      seatNo: 'Tech 3',
      checkInGap: '16:31:27',
      status: 'On Hold'
    }
  ]);

  const statusCards: StatusCard[] = [
    { count: 40, label: 'All', bgColor: 'bg-gradient-to-r from-green-400 to-purple-600', icon: '⚙️' },
    { count: 0, label: 'Check In Records', bgColor: 'bg-gradient-to-r from-purple-600 to-purple-800', icon: '📋' },
    { count: 35, label: 'Pending', bgColor: 'bg-gradient-to-r from-orange-400 to-orange-600', icon: '⏰' },
    { count: 3, label: 'Released', bgColor: 'bg-gradient-to-r from-green-500 to-green-700', icon: '✅' },
    { count: 2, label: 'On Hold', bgColor: 'bg-gradient-to-r from-red-500 to-red-700', icon: '⏸️' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Released':
        return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Released</span>;
      case 'Pending':
        return <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-800">Pending</span>;
      case 'On Hold':
        return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">On Hold</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Check in request ( check in margin )</div>
          <h1 className="text-2xl font-bold text-gray-800">CHECK IN REQUEST</h1>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {statusCards.map((card, index) => (
            <div key={index} className={`${card.bgColor} rounded-lg p-4 text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
                  {card.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{card.count}</div>
                  <div className="text-sm opacity-90">{card.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Designation</TableHead>
                <TableHead className="font-semibold text-gray-700">Shift</TableHead>
                <TableHead className="font-semibold text-gray-700">Seat No.</TableHead>
                <TableHead className="font-semibold text-gray-700">Check In Gap</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkInData.map((record) => (
                <TableRow key={record.id} className="border-b">
                  <TableCell className="text-blue-600 font-medium">{record.id}</TableCell>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.designation}</TableCell>
                  <TableCell className="text-blue-600">{record.shift}</TableCell>
                  <TableCell className="text-blue-600">{record.seatNo}</TableCell>
                  <TableCell>{record.checkInGap}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                        Released
                      </Button>
                      <Button size="sm" variant="outline" className="text-orange-600 hover:bg-orange-50">
                        Hold
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-purple-600 text-white">
              1
            </Button>
            <Button size="sm" variant="outline" className="w-8 h-8 p-0">
              2
            </Button>
            <Button size="sm" variant="outline" className="w-8 h-8 p-0">
              3
            </Button>
            <span className="px-2">»</span>
            <Button size="sm" variant="outline" className="px-3">
              Last »
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
