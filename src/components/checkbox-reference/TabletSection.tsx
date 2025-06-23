
import React from 'react';
import { SectionHeader } from './SectionHeader';
import { CheckboxTable } from './CheckboxTable';
import { PropertyBadges } from './PropertyBadges';

const tabletTableRows = [
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

const tabletProperties = [
  'Width: 12',
  'Height: 12',
  'Border: 1px solid #C72030',
  'Background: White'
];

export const TabletSection = () => {
  return (
    <div>
      <SectionHeader title="Tablet" />
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
        <CheckboxTable rows={tabletTableRows} isTablet />
        
        <div className="flex gap-3 text-sm">
          <span>Mandatory</span>
          <span>Bookings</span>
          <span>Any Text</span>
        </div>

        <PropertyBadges 
          title="Tablet Checkbox Properties" 
          properties={tabletProperties} 
        />
      </div>
    </div>
  );
};
