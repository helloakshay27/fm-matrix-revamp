
import React, { useEffect } from 'react';
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

  // Set "Maintenance" as the default section when the component mounts
  useEffect(() => {
    setCurrentSection('Maintenance');
  }, [setCurrentSection]);

  return (
    <div
      className="h-12 md:h-14 lg:h-16 border-b border-[#D5DbDB] fixed top-16 right-0 left-64 z-10"
      style={{ backgroundColor: '#f6f4ee' }}
    >
      <div className="flex items-center h-full px-3 md:px-6 lg:px-8">
        <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar">
          {/* Mobile: scroll + spacing; Tablet/Desktop: responsive layout */}
          <div className="flex w-max md:w-full space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-0 md:justify-between lg:justify-start lg:gap-8 whitespace-nowrap">
            {packages.map((packageName) => (
              <button
                key={packageName}
                onClick={() => setCurrentSection(packageName)}
                className={`pb-2 md:pb-3 lg:pb-4 text-xs sm:text-sm lg:text-base transition-all duration-200 whitespace-nowrap min-h-[44px] flex items-center px-1 md:px-2 lg:px-3 hover:bg-black/5 rounded-t-md ${
                  currentSection === packageName
                    ? 'text-[#C72030] border-b-2 md:border-b-3 border-[#C72030] font-semibold bg-white/20'
                    : 'text-[#1a1a1a] opacity-70 hover:opacity-100 hover:text-[#C72030] font-medium'
                }`}
              >
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {packageName}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
