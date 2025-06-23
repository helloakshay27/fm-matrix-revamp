
import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { SectionHeader } from './SectionHeader';
import { PropertyBadges } from './PropertyBadges';

const mobileProperties = [
  'Width: 12',
  'Height: 12',
  'Border: 1px solid #C72030'
];

export const MobileSection = () => {
  return (
    <div>
      <SectionHeader title="Mobile" showBasicInfo />
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
        <div className="bg-white rounded border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox className="h-3 w-3" />
              <span className="text-sm font-medium">Wick</span>
            </div>
            <span className="text-xs text-gray-500">Book 1</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox className="h-3 w-3" />
              <span className="text-sm font-medium">John</span>
            </div>
            <span className="text-xs text-gray-500">Book 2</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span>Any Text</span>
          <span>Bookings</span>
          <span>Mandatory</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Mobile Checkbox Properties</p>
          <PropertyBadges properties={mobileProperties} />
        </div>
      </div>
    </div>
  );
};
