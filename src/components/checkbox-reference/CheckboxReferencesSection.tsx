
import React from 'react';
import { CheckboxStates } from './CheckboxStates';
import { CheckboxWithLabels } from './CheckboxWithLabels';

export const CheckboxReferencesSection = () => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-3">References</h3>
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        <div>
          <p className="text-xs text-gray-600 mb-2">01 No label</p>
          <CheckboxStates />
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-2">02 With label</p>
          <CheckboxWithLabels />
        </div>
      </div>
    </div>
  );
};
