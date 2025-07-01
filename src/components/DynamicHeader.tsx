import React from 'react';
import { useLayout } from '../contexts/LayoutContext';

const packages = [
  'Transitioning',
  'Maintenance',
  'Safety',
  'Finance',
  'CRM',
  'Utility',
  'Security',
  'Value Added Services',
  'Market Place',
  'Settings'
];

export const DynamicHeader = () => {
  const { currentSection, setCurrentSection } = useLayout();

  return (
    <div className="h-12 bg-white border-b border-[#D5DbDB] fixed top-16 right-0 left-64 z-10">
      <div className="flex items-center h-full px-4">
        <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar">
          <div className="flex w-max whitespace-nowrap md:justify-between md:w-full">
            {packages.map((packageName) => (
              <button
                key={packageName}
                onClick={() => setCurrentSection(packageName)}
                className={`px-3 pb-3 text-sm transition-colors whitespace-nowrap ${
                  currentSection === packageName
                    ? 'text-[#C72030] border-b-2 border-[#C72030] font-medium'
                    : 'text-[#1a1a1a] opacity-70 hover:opacity-100'
                }`}
              >
                {packageName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
