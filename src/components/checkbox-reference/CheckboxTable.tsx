
import React from 'react';
import { Checkbox } from '../ui/checkbox';

interface TableRow {
  user: string;
  bookingId: string;
  requestBy: string;
  facilityName: string;
  scheduleDate: string;
  scheduleTime?: string;
  bookingStatus?: string;
  actions: string;
}

interface CheckboxTableProps {
  rows: TableRow[];
  isTablet?: boolean;
  isMobile?: boolean;
}

export const CheckboxTable = ({ rows, isTablet = false, isMobile = false }: CheckboxTableProps) => {
  if (isMobile) {
    return (
      <div className="bg-white rounded border p-4 space-y-3">
        {rows.slice(0, 2).map((row, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox className="h-3 w-3" />
              <span className="text-sm font-medium">{row.user}</span>
            </div>
            <span className="text-xs text-gray-500">{row.bookingId}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className={`${isTablet ? 'p-2' : 'p-3'} text-left`}>
                <Checkbox className={isTablet ? "h-3 w-3" : ""} />
              </th>
              <th className={`${isTablet ? 'p-2' : 'p-3'} text-left font-medium`}>User</th>
              <th className={`${isTablet ? 'p-2' : 'p-3'} text-left font-medium`}>Booking ID</th>
              <th className={`${isTablet ? 'p-2' : 'p-3'} text-left font-medium`}>Request By</th>
              <th className={`${isTablet ? 'p-2' : 'p-3'} text-left font-medium`}>Facility Name</th>
              <th className={`${isTablet ? 'p-2' : 'p-3'} text-left font-medium`}>Schedule Date</th>
              {!isTablet && <th className="p-3 text-left font-medium">Schedule Time</th>}
              {!isTablet && <th className="p-3 text-left font-medium">Booking Status</th>}
              <th className={`${isTablet ? 'p-2' : 'p-3'} text-left font-medium`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b">
                <td className={isTablet ? 'p-2' : 'p-3'}>
                  <Checkbox className={isTablet ? "h-3 w-3" : ""} />
                </td>
                <td className={isTablet ? 'p-2' : 'p-3'}>{row.user}</td>
                <td className={isTablet ? 'p-2' : 'p-3'}>{row.bookingId}</td>
                <td className={isTablet ? 'p-2' : 'p-3'}>{row.requestBy}</td>
                <td className={isTablet ? 'p-2' : 'p-3'}>
                  {isTablet ? row.facilityName.split(' ')[0] : row.facilityName}
                </td>
                <td className={isTablet ? 'p-2' : 'p-3'}>
                  {isTablet ? row.scheduleDate.replace('/2024', '/24') : row.scheduleDate}
                </td>
                {!isTablet && <td className="p-3">{row.scheduleTime}</td>}
                {!isTablet && <td className="p-3">{row.bookingStatus}</td>}
                <td className={isTablet ? 'p-2' : 'p-3'}>{row.actions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
