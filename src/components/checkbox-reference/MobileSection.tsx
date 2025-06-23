
import React from 'react';
import { SectionHeader } from './SectionHeader';
import { CheckboxTable } from './CheckboxTable';
import { PropertyBadges } from './PropertyBadges';

const mobileTableRows = [
  {
    user: 'Wick',
    bookingId: 'Book 1',
    requestBy: 'Jack',
    facilityName: 'Conference Room',
    scheduleDate: '16/06/2024',
    actions: '...'
  },
  {
    user: 'John',
    bookingId: 'Book 2',
    requestBy: 'Jane',
    facilityName: 'Meeting Room',
    scheduleDate: '17/06/2024',
    actions: '...'
  }
];

const mobileProperties = [
  'Width: 12',
  'Height: 12',
  'Border: 1px solid #C72030'
];

export const MobileSection = () => {
  return (
    <div>
      <SectionHeader title="Mobile" />
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
        <CheckboxTable rows={mobileTableRows} isMobile />
        
        <div className="flex flex-col gap-2 text-sm">
          <span>Any Text</span>
          <span>Bookings</span>
          <span>Mandatory</span>
        </div>

        <PropertyBadges 
          title="Mobile Checkbox Properties" 
          properties={mobileProperties} 
        />
      </div>
    </div>
  );
};
