
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const attendanceDetails = [
  { date: '05/08/2022', punchedInTime: '20:58', punchedOutTime: '06:26', duration: '09:28' },
  { date: '04/08/2022', punchedInTime: '20:02', punchedOutTime: '16:37', duration: '20:35' },
  { date: '02/08/2022', punchedInTime: '10:33', punchedOutTime: '20:14', duration: '09:40' },
  { date: '01/08/2022', punchedInTime: '20:27', punchedOutTime: '09:33', duration: '13:06' },
  { date: '30/07/2022', punchedInTime: '11:40', punchedOutTime: '14:03', duration: '02:23' },
  { date: '29/07/2022', punchedInTime: '09:51', punchedOutTime: '23:00', duration: '13:09' },
  { date: '27/07/2022', punchedInTime: '11:11', punchedOutTime: '20:01', duration: '08:49' },
  { date: '26/07/2022', punchedInTime: '10:27', punchedOutTime: '20:18', duration: '09:51' },
  { date: '25/07/2022', punchedInTime: '20:24', punchedOutTime: '10:26', duration: '14:02' },
  { date: '23/07/2022', punchedInTime: '20:12', punchedOutTime: '19:12', duration: '22:59' },
  { date: '22/07/2022', punchedInTime: '09:56', punchedOutTime: '00:38', duration: '14:42' },
  { date: '21/07/2022', punchedInTime: '08:42', punchedOutTime: '23:27', duration: '14:45' },
  { date: '20/07/2022', punchedInTime: '09:53', punchedOutTime: '20:46', duration: '10:52' },
  { date: '19/07/2022', punchedInTime: '09:59', punchedOutTime: '20:52', duration: '10:52' },
  { date: '18/07/2022', punchedInTime: '10:01', punchedOutTime: '20:18', duration: '10:17' },
  { date: '15/07/2022', punchedInTime: '21:01', punchedOutTime: '', duration: '00:00' },
  { date: '14/07/2022', punchedInTime: '22:29', punchedOutTime: '12:31', duration: '14:02' },
  { date: '13/07/2022', punchedInTime: '19:30', punchedOutTime: '23:10', duration: '03:39' },
  { date: '12/07/2022', punchedInTime: '20:04', punchedOutTime: '01:01', duration: '04:57' },
  { date: '09/07/2022', punchedInTime: '15:04', punchedOutTime: '', duration: '00:00' }
];

const attendanceUsers = [
  { id: 1, name: 'Mahendra Lungare' },
  { id: 2, name: 'Irfan Shaikh' },
  { id: 3, name: 'Atrayee Talapatra' },
  { id: 4, name: 'Mukesh Dabhi' },
  { id: 5, name: 'Sunny Vishwakarma' }
];

export const AttendanceDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Get user name based on ID, default to 'Irfan Shaikh' to match the image
  const currentUser = attendanceUsers.find(user => user.id === parseInt(id || '2')) || { name: 'Irfan Shaikh' };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/attendance')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Attendance List
        </Button>
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Attendance &gt; Attendance Details</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">ATTENDANCE DETAILS</h1>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="bg-white rounded-lg border mb-6 p-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center border-4 border-blue-200">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{currentUser.name}</h2>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Punched In Time</TableHead>
              <TableHead>Punched Out Time</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceDetails.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{record.date}</TableCell>
                <TableCell>{record.punchedInTime}</TableCell>
                <TableCell>{record.punchedOutTime}</TableCell>
                <TableCell>{record.duration}</TableCell>
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
