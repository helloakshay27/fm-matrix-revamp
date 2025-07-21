import React, { useState } from 'react';
import { Star, MessageSquare, Flag, ChevronRight, Building2, User, Globe, RotateCcw, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const recentAttendance = [{
  id: 'ATT-001',
  title: 'Security Team Attendance',
  employee_name: 'John Smith',
  department: 'Security',
  site: 'GoPhygital',
  priority: 'P1',
  status: 'Present',
  nextStatus: 'Break Due',
  handledBy: 'HR Manager',
  check_in: '09:00 AM',
  shift: 'Morning'
}, {
  id: 'ATT-002',
  title: 'Cleaning Staff Attendance',
  employee_name: 'Sarah Johnson',
  department: 'Housekeeping',
  site: 'GoPhygital',
  priority: 'P2',
  status: 'Present',
  nextStatus: 'Shift End',
  handledBy: 'Facility Manager',
  check_in: '08:30 AM',
  shift: 'Day'
}, {
  id: 'ATT-003',
  title: 'Maintenance Team Late',
  employee_name: 'Mike Wilson',
  department: 'Maintenance',
  site: 'GoPhygital',
  priority: 'P1',
  status: 'Late',
  nextStatus: 'Follow Up',
  handledBy: 'Team Lead',
  check_in: '09:45 AM',
  shift: 'Morning'
}, {
  id: 'ATT-004',
  title: 'Security Night Shift',
  employee_name: 'Lisa Chen',
  department: 'Security',
  site: 'GoPhygital',
  priority: 'P1',
  status: 'Present',
  nextStatus: 'Shift End',
  handledBy: 'Security Head',
  check_in: '10:00 PM',
  shift: 'Night'
}, {
  id: 'ATT-005',
  title: 'Admin Staff Absent',
  employee_name: 'David Miller',
  department: 'Administration',
  site: 'GoPhygital',
  priority: 'P3',
  status: 'Absent',
  nextStatus: 'Contact Required',
  handledBy: 'HR Manager',
  check_in: '-',
  shift: 'Day'
}];

export function RecentAttendanceSidebar() {
  const [flaggedAttendance, setFlaggedAttendance] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleAddComment = (attendanceId: string) => {
    console.log('Add comment for attendance:', attendanceId);
    // Add comment functionality
  };

  const handleFlag = (attendanceId: string) => {
    setFlaggedAttendance(prev => {
      const newSet = new Set(prev);
      if (newSet.has(attendanceId)) {
        newSet.delete(attendanceId);
      } else {
        newSet.add(attendanceId);
      }
      return newSet;
    });
  };

  const handleViewDetails = (attendanceId: string) => {
    navigate(`/maintenance/attendance/details/${attendanceId}`);
  };

  return (
    <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Recent Attendance
        </h2>
        <div className="text-sm font-medium text-gray-800">
          {new Date().toLocaleDateString('en-GB')}
        </div>
      </div>
      
      {/* Attendance List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {recentAttendance.map((attendance, index) => (
          <div 
            key={`${attendance.id}-${index}`} 
            className="bg-[#C4B89D]/20 rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60" 
            style={{ borderWidth: '0.6px' }}
          >
            {/* Header with ID, Star, and Priority */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-800 text-sm">{attendance.id}</span>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="bg-pink-300 text-pink-800 px-2 py-1 rounded text-xs font-medium">
                  {attendance.priority}
                </span>
              </div>
            </div>
            
            {/* Title and Status */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-base">{attendance.title}</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">Status :</span>
                <span className="text-sm font-bold text-blue-600">"{attendance.status}"</span>
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Employee</span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900">{attendance.employee_name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Department</span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900">{attendance.department}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Check In</span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900">{attendance.check_in}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Site</span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900">{attendance.site}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">Update</span>
                <span className="text-sm text-gray-700">:</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="italic text-gray-600">{attendance.status}</span>
                  <ChevronRight className="h-3 w-3 text-gray-600" />
                  <span className="italic text-gray-600">{attendance.nextStatus}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 ml-7">
                (Handled By {attendance.handledBy})
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <button 
                  className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80" 
                  onClick={() => handleAddComment(attendance.id)}
                >
                  <MessageSquare className="h-4 w-4 text-red-500" />
                  Add Comment
                </button>
                
                <button 
                  className={`flex items-center gap-2 text-black text-sm font-medium hover:opacity-80 ${flaggedAttendance.has(attendance.id) ? 'opacity-60' : ''}`} 
                  onClick={() => handleFlag(attendance.id)}
                >
                  <Flag className="h-4 w-4 text-red-500" />
                  Flag Issue
                </button>
              </div>
              
              <button 
                className="text-blue-600 text-sm font-medium underline hover:text-blue-800" 
                onClick={() => handleViewDetails(attendance.id)}
              >
                View Detail&gt;&gt;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}