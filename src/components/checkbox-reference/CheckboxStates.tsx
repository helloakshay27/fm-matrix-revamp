
import React from 'react';
import { Checkbox } from '../ui/checkbox';

export const CheckboxStates = () => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="no-label-1" />
      <Checkbox id="no-label-2" checked />
      <Checkbox id="no-label-3" />
      <Checkbox id="no-label-4" checked />
      <Checkbox id="no-label-5" />
    </div>
  );
};
