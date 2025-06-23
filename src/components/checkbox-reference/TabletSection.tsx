
import React from 'react';
import { SectionHeader } from './SectionHeader';
import { CheckboxTable } from './CheckboxTable';
import { PropertyBadges } from './PropertyBadges';

const tabletTableData = [
  {
    user: 'Wick',
    bookingId: 'Book 1',
    requestBy: 'Jack',
    facilityName: 'Conference',
    scheduleDate: '16/06/24',
    bookingStatus: 'Confirmed'
  },
  {
    user: 'John',
    bookingId: 'Book 2',
    requestBy: 'Jane',
    facilityName: 'Meeting',
    scheduleDate: '17/06/24',
    bookingStatus: 'Pending'
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
      <SectionHeader title="Tablet" showBasicInfo />
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
        <CheckboxTable 
          data={tabletTableData} 
          size="small" 
          showAllColumns={false}
        />
        
        <div className="flex gap-3 text-sm">
          <span>Mandatory</span>
          <span>Bookings</span>
          <span>Any Text</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Tablet Checkbox Properties</p>
          <PropertyBadges properties={tabletProperties} />
        </div>
      </div>
    </div>
  );
};
