
import React from 'react';
import { AttendanceTable } from '../components/AttendanceTable';

export const AttendanceDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Attendance &gt; Attendance List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">ATTENDANCE LIST</h1>
        </div>
      </div>
      
      {/* Attendance Table */}
      <AttendanceTable />
    </div>
  );
};
