
import React from 'react';
import { CheckboxReferencesSection } from './checkbox-reference/CheckboxReferencesSection';
import { DesktopSection } from './checkbox-reference/DesktopSection';
import { TabletSection } from './checkbox-reference/TabletSection';
import { MobileSection } from './checkbox-reference/MobileSection';
import { UseCasesSection } from './checkbox-reference/UseCasesSection';

export const CheckboxReference = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">CHECKBOXES</h1>
        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          <span>Desktop</span>
          <span>Tablet</span>
          <span>Mobile</span>
        </div>
      </div>

      <div className="space-y-8">
        <CheckboxReferencesSection />
        <DesktopSection />
        <TabletSection />
        <MobileSection />
        <UseCasesSection />
      </div>
    </div>
  );
};
