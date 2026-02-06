import React, { useEffect } from 'react';
import { useLayout } from '../contexts/LayoutContext';

export const ViDynamicHeader: React.FC = () => {
  const { currentSection, setCurrentSection, isSidebarCollapsed } = useLayout();

  // Note: Section is now automatically detected by LayoutProvider based on route
  // No need to manually set it here

  return (
    <div
      className={`h-12 border-b border-[#D5DbDB] fixed top-16 right-0 ${isSidebarCollapsed ? 'left-16' : 'left-64'} z-10 transition-all duration-300`}
      style={{ backgroundColor: '#f6f4ee' }}
    >
      <div className="flex items-center h-full px-4">
        <div className="w-full">
          <div className="flex w-full justify-between whitespace-nowrap">
            <button
              onClick={() => setCurrentSection('Maintenance')}
              className={`pb-3 text-sm transition-colors ${currentSection === 'Maintenance'
                ? 'text-[#C72030] border-b-2 border-[#C72030] font-medium'
                : 'text-[#1a1a1a] opacity-70 hover:opacity-100'
                }`}
            >
              Maintenance
            </button>
            <button
              onClick={() => setCurrentSection('Safety')}
              className={`pb-3 text-sm transition-colors ${currentSection === 'Safety'
                ? 'text-[#C72030] border-b-2 border-[#C72030] font-medium'
                : 'text-[#1a1a1a] opacity-70 hover:opacity-100'
                }`}
            >
              Safety
            </button>
            <button
              onClick={() => setCurrentSection('Security')}
              className={`pb-3 text-sm transition-colors ${currentSection === 'Security'
                ? 'text-[#C72030] border-b-2 border-[#C72030] font-medium'
                : 'text-[#1a1a1a] opacity-70 hover:opacity-100'
                }`}
            >
              Security
            </button>
            <button
              onClick={() => setCurrentSection('Value Added Services')}
              className={`pb-3 text-sm transition-colors ${currentSection === 'Value Added Services'
                ? 'text-[#C72030] border-b-2 border-[#C72030] font-medium'
                : 'text-[#1a1a1a] opacity-70 hover:opacity-100'
                }`}
            >
              Value Added Services
            </button>
            <button
              onClick={() => setCurrentSection('Settings')}
              className={`pb-3 text-sm transition-colors ${currentSection === 'Value Added Services'
                ? 'text-[#C72030] border-b-2 border-[#C72030] font-medium'
                : 'text-[#1a1a1a] opacity-70 hover:opacity-100'
                }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViDynamicHeader;
