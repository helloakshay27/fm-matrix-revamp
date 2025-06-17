
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const attendanceData = [
  {
    id: 1,
    name: 'Mahendra Lungare',
    department: 'Tech'
  },
  {
    id: 2,
    name: 'Irfan Shaikh',
    department: 'Operations'
  },
  {
    id: 3,
    name: 'Atrayee Talapatra',
    department: 'HR'
  },
  {
    id: 4,
    name: 'Mukesh Dabhi',
    department: 'Office boy'
  },
  {
    id: 5,
    name: 'Sunny Vishwakarma',
    department: ''
  },
  {
    id: 6,
    name: 'Mr. Bhaushali',
    department: ''
  },
  {
    id: 7,
    name: 'Mr.Kailash Jadhav',
    department: ''
  },
  {
    id: 8,
    name: 'Deepak Gupta',
    department: 'Function 2'
  },
  {
    id: 9,
    name: 'Kalyanasundaram Jayaraman',
    department: ''
  },
  {
    id: 10,
    name: 'Nupura Warangkar',
    department: ''
  },
  {
    id: 11,
    name: 'Surinderpal Singh Chadha',
    department: ''
  },
  {
    id: 12,
    name: 'Chetan Bafna',
    department: ''
  },
  {
    id: 13,
    name: 'Aniket Parkar',
    department: ''
  },
  {
    id: 14,
    name: 'Security 12',
    department: ''
  },
  {
    id: 15,
    name: 'Devesh Jain',
    department: ''
  },
  {
    id: 16,
    name: 'Sumitra Patil',
    department: 'Admin'
  },
  {
    id: 17,
    name: 'HQ Occupant 1',
    department: ''
  },
  {
    id: 18,
    name: 'Sagar Singh',
    department: ''
  },
  {
    id: 19,
    name: 'Amit Dwivh',
    department: 'Electrical dept'
  },
  {
    id: 20,
    name: 'Anushree D',
    department: ''
  }
];

export const AttendanceDashboard = () => {
  const navigate = useNavigate();
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

  const handleReset = () => {
    setSearchTerm('');
    setFilteredAttendance(attendanceData);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/maintenance/attendance/details/${id}`);
  };

  const handleExport = () => {
    console.log('Exporting attendance data...');
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Department\n"
      + filteredAttendance.map(person => `${person.name},${person.department}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_list.csv");
    link.click();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Attendance &gt; Attendance List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ATTENDANCE LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={handleExport}
          style={{ backgroundColor: '#C72030' }} 
          className="text-white hover:bg-[#C72030]/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search attendance..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          >
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
            {filteredAttendance.map((person) => (
              <TableRow key={person.id}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(person.id)}
                    className="hover:bg-gray-100"
                  >
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
              className={page === 1 ? "text-white hover:bg-[#C72030]/90" : ""}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm">Last »</Button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};
