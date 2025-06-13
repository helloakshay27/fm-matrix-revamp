
import React from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { useLocation } from 'react-router-dom';

export const DynamicSubHeader = () => {
  const { navigationSections, currentSection } = useLayout();
  const location = useLocation();
  
  const currentSectionData = navigationSections.find(section => section.id === currentSection);
  
  if (!currentSectionData?.subItems) {
    return null;
  }

  const getBreadcrumb = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Assets > Asset List';
    if (path === '/amc') return 'AMC > AMC List';
    if (path === '/services') return 'Services > Service List';
    if (path === '/surveys/list') return 'Survey > Survey List';
    if (path === '/surveys/mapping') return 'Survey > Survey Mappings';
    if (path === '/surveys/response') return 'Survey > Survey Response';
    if (path === '/attendance') return 'Attendance > Attendance List';
    if (path === '/schedule') return 'Schedule > Schedule List';
    if (path === '/supplier') return 'Supplier > Supplier List';
    
    return 'Navigation';
  };

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'ASSET LIST';
    if (path === '/amc') return 'AMC LIST';
    if (path === '/services') return 'SERVICE LIST';
    if (path === '/surveys/list') return 'SURVEY LIST';
    if (path === '/surveys/mapping') return 'SURVEY MAPPING LIST';
    if (path === '/surveys/response') return 'SURVEY RESPONSE';
    if (path === '/attendance') return 'ATTENDANCE LIST';
    if (path === '/schedule') return 'SCHEDULE LIST';
    if (path === '/supplier') return 'SUPPLIER LIST';
    
    return 'PAGE TITLE';
  };

  return (
    <div className="bg-white border-b border-[#D5DbDB] px-6 py-4 mt-24">
      <div>
        <p className="text-[#1a1a1a] opacity-70 mb-2">{getBreadcrumb()}</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">{getPageTitle()}</h1>
      </div>
    </div>
  );
};
