
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed } = useLayout();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (paths: string[]) => paths.some(path => location.pathname === path);

  const menuItems = [
    {
      title: 'Asset',
      icon: '📊',
      children: [
        { title: 'Assets', path: '/assets' },
        { title: 'Inactive Assets', path: '/assets/inactive' }
      ]
    },
    {
      title: 'AMC',
      icon: '🔧',
      path: '/amc'
    },
    {
      title: 'Service',
      icon: '⚙️',
      path: '/services'
    },
    {
      title: 'Operational Audit',
      icon: '🔍',
      children: [
        { title: 'Scheduled', path: '/operational-audit/scheduled' },
        { title: 'Conducted', path: '/operational-audit/conducted' },
        { title: 'Master Checklists', path: '/operational-audit/master-checklists' }
      ]
    },
    {
      title: 'Surveys',
      icon: '📋',
      children: [
        { title: 'Survey List', path: '/surveys/list' },
        { title: 'Survey Mapping', path: '/surveys/mapping' },
        { title: 'Survey Response', path: '/surveys/response' }
      ]
    },
    {
      title: 'Vendor Audit',
      icon: '🏢',
      children: []
    },
    {
      title: 'Attendance',
      icon: '⏰',
      path: '/attendance'
    },
    {
      title: 'Incident',
      icon: '⚠️',
      children: []
    },
    {
      title: 'Permit',
      icon: '📄',
      children: []
    },
    {
      title: 'Design Insights',
      icon: '💡',
      children: []
    },
    {
      title: 'Inventory',
      icon: '📦',
      children: []
    }
  ];

  if (isCollapsed) {
    return (
      <div className="w-16 bg-[#2D1B69] text-white h-full flex flex-col py-4">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            className="flex justify-center py-3 hover:bg-[#3D2B79] cursor-pointer"
            onClick={() => item.path && navigate(item.path)}
          >
            <span className="text-lg">{item.icon}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#2D1B69] text-white h-full overflow-y-auto">
      <div className="p-4">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1">
            {item.children && item.children.length > 0 ? (
              <div>
                <div
                  className={`flex items-center justify-between p-3 rounded cursor-pointer hover:bg-[#3D2B79] ${
                    isParentActive(item.children.map(child => child.path)) ? 'bg-[#3D2B79]' : ''
                  }`}
                  onClick={() => toggleSection(item.title)}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="text-sm">{item.title}</span>
                  </div>
                  {expandedSections[item.title] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
                {expandedSections[item.title] && (
                  <div className="ml-8 mt-1">
                    {item.children.map((child, childIndex) => (
                      <div
                        key={childIndex}
                        className={`p-2 rounded cursor-pointer text-sm hover:bg-[#3D2B79] ${
                          isActive(child.path) ? 'bg-[#4D3B89] text-white' : ''
                        }`}
                        onClick={() => navigate(child.path)}
                      >
                        {child.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`flex items-center p-3 rounded cursor-pointer hover:bg-[#3D2B79] ${
                  item.path && isActive(item.path) ? 'bg-[#4D3B89]' : ''
                }`}
                onClick={() => item.path && navigate(item.path)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="text-sm">{item.title}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
