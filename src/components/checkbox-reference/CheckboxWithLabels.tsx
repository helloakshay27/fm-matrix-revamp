
import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const labelOptions = [
  { id: 'label-1', text: 'Chat', checked: false },
  { id: 'label-2', text: 'Email', checked: true },
  { id: 'label-3', text: 'Call', checked: false },
  { id: 'label-4', text: 'SMS', checked: true },
  { id: 'label-5', text: 'Push', checked: false }
];

export const CheckboxWithLabels = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {labelOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox id={option.id} checked={option.checked} />
          <Label htmlFor={option.id} className="text-sm">{option.text}</Label>
        </div>
      ))}
    </div>
  );
};
