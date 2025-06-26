
import React from 'react';
import { useLayout } from '@/contexts/LayoutContext';

export const DynamicHeader = () => {
  const { currentSection } = useLayout();

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 h-12">
      <div className="flex items-center px-6 h-full">
        <nav className="flex space-x-8">
          <button className="text-gray-600 hover:text-gray-900 text-sm">Transitioning</button>
          <button className="text-gray-600 hover:text-gray-900 text-sm">Maintenance</button>
          <button className="text-gray-600 hover:text-gray-900 text-sm">Safety</button>
          <button className="text-gray-600 hover:text-gray-900 text-sm">Finance</button>
          <button className="text-gray-600 hover:text-gray-900 text-sm">CRM</button>
          <button className="text-gray-600 hover:text-gray-900 text-sm">Utility</button>
          <button className="text-gray-600 hover:text-gray-900 text-sm">Security</button>
          <button className={`text-sm ${currentSection === 'Value Added Services' ? 'text-[#C72030] font-medium border-b-2 border-[#C72030]' : 'text-gray-600 hover:text-gray-900'}`}>
            Value Added Services
          </button>
          <button className="text-gray-600 hover:text-gray-900 text-sm">Market Place</button>
          <button className="text-gray-600 hover:text-gray-900 text-sm">Settings</button>
        </nav>
      </div>
    </div>
  );
};
