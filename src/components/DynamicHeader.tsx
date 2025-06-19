
import React from 'react';
import { useLayout } from '../contexts/LayoutContext';

const packages = [
  'Transitioning',
  'Maintenance',
  'Finance',
  'CRM',
  'Utility',
  'Security',
  'Value Added Services',
  'Settings'
];

export const DynamicHeader = () => {
  const { currentSection, setCurrentSection } = useLayout();

  return (
    <div className="h-12 bg-blue-800 border-b border-blue-700 fixed top-16 right-0 left-64 z-20">
      <div className="flex items-center h-full px-6">
        <div className="flex items-center gap-6">
          {packages.map((packageName) => (
            <button
              key={packageName}
              onClick={() => setCurrentSection(packageName)}
              className={`pb-3 transition-colors text-sm ${
                currentSection === packageName
                  ? 'text-white border-b-2 border-white font-medium'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              {packageName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
