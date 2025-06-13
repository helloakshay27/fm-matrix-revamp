
import React from 'react';
import { Eye, Download, Search, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const attendanceData = [
  { name: 'Abdul Ghaffar', department: 'Operations' },
  { name: 'Aquil Husain', department: 'Manager' },
  { name: 'Aero Mall Tab 01', department: '' },
  { name: 'Prashant Bhise', department: '' },
  { name: 'Varsha Maghade', department: '' },
  { name: 'Sangeeta Wakekar', department: '' },
  { name: 'Balaji Ravale', department: '' },
  { name: 'Supriya Unde', department: '' },
  { name: 'Rahul Pardeshi', department: '' },
  { name: 'Vishant Tarachandani', department: '' }
];

export const AttendanceTable = () => {
  return (
    <div className="bg-white rounded-lg border border-[#D5DbDB]">
      {/* Table Header Actions */}
      <div className="p-4 border-b border-[#D5DbDB] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search attendance..."
              className="pl-10 pr-4 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((attendance, index) => (
            <TableRow key={index}>
              <TableCell>
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
              </TableCell>
              <TableCell className="font-medium">{attendance.name}</TableCell>
              <TableCell>{attendance.department}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
