
import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

export const CheckboxReferencesSection = () => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-3">References</h3>
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        {/* No label example */}
        <div>
          <p className="text-xs text-gray-600 mb-2">01 No label</p>
          <div className="flex items-center space-x-2">
            <Checkbox id="no-label-1" />
            <Checkbox id="no-label-2" checked />
            <Checkbox id="no-label-3" />
            <Checkbox id="no-label-4" checked />
            <Checkbox id="no-label-5" />
          </div>
        </div>

        {/* With label example */}
        <div>
          <p className="text-xs text-gray-600 mb-2">02 With label</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="label-1" />
              <Label htmlFor="label-1" className="text-sm">Chat</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="label-2" checked />
              <Label htmlFor="label-2" className="text-sm">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="label-3" />
              <Label htmlFor="label-3" className="text-sm">Call</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="label-4" checked />
              <Label htmlFor="label-4" className="text-sm">SMS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="label-5" />
              <Label htmlFor="label-5" className="text-sm">Push</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
