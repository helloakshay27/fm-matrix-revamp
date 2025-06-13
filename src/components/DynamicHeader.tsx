
import React from 'react';
import { useLayout } from '../contexts/LayoutContext';

const mainSections = [
  'Project',
  'Maintenance',
  'CRM',
  'Utility',
  'Visitors',
  'Experience',
  'Property'
];

export const DynamicHeader = () => {
  const { currentSection, setCurrentSection } = useLayout();

  return (
    <div className="h-12 bg-white border-b border-[#D5DbDB] fixed top-15 right-0 left-64 z-20">
      <div className="flex items-center h-full px-6">
        <div className="flex items-center gap-8">
          {mainSections.map((section) => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`pb-3 transition-colors ${
                currentSection === section
                  ? 'text-[#C72030] border-b-2 border-[#C72030] font-medium'
                  : 'text-[#1a1a1a] opacity-70 hover:opacity-100'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
