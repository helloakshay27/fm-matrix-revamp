import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
interface AttUser {
  id: number;
  name: string | null;
  email: string | null;
  department: string | null;
  profile_image: string | null;
}
interface AttendanceRecord {
  id: number;
  date: string;
  day: string;
  punched_in_time: string;
  punched_out_time: string | null;
  duration: string;
  document_url: string | null;
}
interface AttendanceResponse {
  att_user: AttUser;
  attendances: AttendanceRecord[];
}
export const AttendanceDetailsPage = () => {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const [attendanceData, setAttendanceData] = useState<AttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(getFullUrl(`/pms/attendances/${id}.json`), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader()
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        const data: AttendanceResponse = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchAttendanceData();
    }
  }, [id]);
  return <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" onClick={() => {
          console.log('Back button clicked');
          navigate('/maintenance/attendance');
        }} className="p-1 hover:bg-gray-100 mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <p className="text-[#1a1a1a] opacity-70">Attendance &gt; Attendance Details</p>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">ATTENDANCE DETAILS</h1>
        </div>
      </div>

      {loading && <div className="flex justify-center items-center py-8">
          <div className="text-lg">Loading attendance data...</div>
        </div>}

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>}

      {attendanceData && <>
          {/* User Profile Section */}
          <div className="bg-white rounded-lg border mb-6 p-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center border-4 border-blue-200">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {attendanceData.att_user.name ? attendanceData.att_user.name.split(' ').map(n => n[0]).join('') : 'N/A'}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {attendanceData.att_user.name || 'No Name'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{attendanceData.att_user.email || 'No Email'}</p>
              <p className="text-sm text-gray-600">{attendanceData.att_user.department || 'No Department'}</p>
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
                {attendanceData.attendances.length > 0 ? attendanceData.attendances.map(record => <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell>{record.punched_in_time}</TableCell>
                      <TableCell>{record.punched_out_time || '-'}</TableCell>
                      <TableCell>{record.duration}</TableCell>
                    </TableRow>) : <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No attendance records found for this user.
                    </TableCell>
                  </TableRow>}
              </TableBody>
            </Table>

            {/* New Pagination */}
            <div className="p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">4</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">5</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">6</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">7</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">8</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </>}

      {/* Footer */}
      <div className="mt-8 text-center">
        
      </div>
    </div>;
};