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
    <div
      className="h-12 border-b border-[#D5DbDB] fixed top-16 right-0 left-64 z-10"
      style={{ backgroundColor: '#f6f4ee' }}
    >
      <div className="flex items-center h-full px-4">
        <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar">
          {/* Mobile: scroll + spacing; Desktop: full width and justify-between */}
          <div className="flex w-max md:w-full space-x-4 md:space-x-0 md:justify-between whitespace-nowrap">
            {packages.map((packageName) => (
              <button
                key={packageName}
                onClick={() => setCurrentSection(packageName)}
                className={`pb-3 text-sm transition-colors whitespace-nowrap ${
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
