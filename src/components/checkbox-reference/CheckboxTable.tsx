
import React from 'react';
import { Checkbox } from '../ui/checkbox';

interface TableRow {
  user: string;
  bookingId: string;
  requestBy: string;
  facilityName: string;
  scheduleDate: string;
  scheduleTime?: string;
  bookingStatus: string;
}

interface CheckboxTableProps {
  data: TableRow[];
  size?: 'default' | 'small';
  showAllColumns?: boolean;
}

export const CheckboxTable = ({ 
  data, 
  size = 'default', 
  showAllColumns = true 
}: CheckboxTableProps) => {
  const checkboxSize = size === 'small' ? 'h-3 w-3' : '';
  const padding = size === 'small' ? 'p-2' : 'p-3';

  return (
    <div className="bg-white rounded border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className={`${padding} text-left`}>
                <Checkbox className={checkboxSize} />
              </th>
              <th className={`${padding} text-left font-medium`}>User</th>
              <th className={`${padding} text-left font-medium`}>Booking ID</th>
              <th className={`${padding} text-left font-medium`}>Request By</th>
              <th className={`${padding} text-left font-medium`}>Facility Name</th>
              <th className={`${padding} text-left font-medium`}>Schedule Date</th>
              {showAllColumns && (
                <>
                  <th className={`${padding} text-left font-medium`}>Schedule Time</th>
                  <th className={`${padding} text-left font-medium`}>Booking Status</th>
                  <th className={`${padding} text-left font-medium`}>Actions</th>
                </>
              )}
              {!showAllColumns && (
                <th className={`${padding} text-left font-medium`}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b">
                <td className={padding}>
                  <Checkbox className={checkboxSize} />
                </td>
                <td className={padding}>{row.user}</td>
                <td className={padding}>{row.bookingId}</td>
                <td className={padding}>{row.requestBy}</td>
                <td className={padding}>{row.facilityName}</td>
                <td className={padding}>{row.scheduleDate}</td>
                {showAllColumns && (
                  <>
                    <td className={padding}>{row.scheduleTime}</td>
                    <td className={padding}>{row.bookingStatus}</td>
                  </>
                )}
                <td className={padding}>...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
