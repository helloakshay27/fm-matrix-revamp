
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Eye } from 'lucide-react';

const attendanceData = [
  {
    name: 'Mahendra Lungare',
    department: ''
  },
  {
    name: 'Irfan Shaikh',
    department: 'Operations'
  },
  {
    name: 'Atrayee Talapatra',
    department: 'HR'
  },
  {
    name: 'Mukesh Dabhi',
    department: 'Office boy'
  },
  {
    name: 'Sunny Vishwakarma',
    department: ''
  },
  // Add more sample data as needed
];

export const AttendanceDashboard =() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAttendance, setFilteredAttendance] = useState(attendanceData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = attendanceData.filter(person =>
        person.name.toLowerCase().includes(value.toLowerCase()) ||
        person.department.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAttendance(filtered);
    } else {
      setFilteredAttendance(attendanceData);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Attendance &gt; Attendance List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ATTENDANCE LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search attendance..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" className="border-[#C72030] text-[#C72030]">
            Reset
          </Button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendance.map((person, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{person.name}</TableCell>
                <TableCell>{person.department}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 p-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              style={page === 1 ? { backgroundColor: '#C72030' } : {}}
              className={page === 1 ? "text-white" : ""}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm">Last »</Button>
        </div>
      </div>
    </div>
  );
};
