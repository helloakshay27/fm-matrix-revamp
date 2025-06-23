
import React from 'react';
import { SectionHeader } from './SectionHeader';
import { CheckboxTable } from './CheckboxTable';
import { PropertyBadges } from './PropertyBadges';

const desktopTableData = [
  {
    user: 'Wick',
    bookingId: 'Book 1',
    requestBy: 'Jack',
    facilityName: 'Conference Room',
    scheduleDate: '16/06/2024',
    scheduleTime: '9am to 12 pm',
    bookingStatus: 'Confirmed'
  },
  {
    user: 'John',
    bookingId: 'Book 2',
    requestBy: 'Jane',
    facilityName: 'Meeting Room',
    scheduleDate: '17/06/2024',
    scheduleTime: '10am to 12 pm',
    bookingStatus: 'Pending'
  },
  {
    user: 'Alice',
    bookingId: 'Book 3',
    requestBy: 'Bob',
    facilityName: 'Auditorium',
    scheduleDate: '18/06/2024',
    scheduleTime: '2pm to 5 pm',
    bookingStatus: 'Cancelled'
  }
];

const desktopProperties = [
  'Width: 16',
  'Height: 16',
  'Border: 1px solid #C72030',
  'Background: White',
  'Check Color: #C72030'
];

export const DesktopSection = () => {
  return (
    <div>
      <SectionHeader title="Desktop" showBasicInfo />
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
        <CheckboxTable data={desktopTableData} />
        
        <div className="flex gap-4 text-sm">
          <span>Any Text</span>
          <span>Bookings</span>
          <span>Mandatory</span>
        </div>

        <PropertyBadges properties={desktopProperties} />
      </div>
    </div>
  );
};
