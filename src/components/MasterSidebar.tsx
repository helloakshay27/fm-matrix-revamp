import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Users, 
  CheckSquare, 
  MapPinHouse, 
  Package, 
  FileText 
} from 'lucide-react';

const masterItems = [
  {
    name: 'Location Master',
    icon: MapPin,
    hasChildren: true,
    children: [
      { name: 'Account', href: '/master/location/account' },
      { name: 'Building', href: '/master/location/building' },
      { name: 'Wing', href: '/master/location/wing' },
      { name: 'Area', href: '/master/location/area' },
      { name: 'Floor', href: '/master/location/floor' },
      { name: 'Unit', href: '/master/location/unit' },
      { name: 'Room', href: '/master/location/room' }
    ]
  },
  {
    name: 'User Master',
    icon: Users,
    href: '/master/user'
  },
  {
    name: 'Checklist Master',
    icon: CheckSquare,
    href: '/master/checklist'
  },
  {
    name: 'Address Master',
    icon: MapPinHouse,
    href: '/master/address'
  },
  {
    name: 'Unit Master (By Default)',
    icon: Package,
    href: '/master/unit-default'
  },
  {
    name: 'Material Master -> EBom',
    icon: FileText,
    href: '/master/material-ebom'
  }
];

export const MasterSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Location Master']);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const renderMenuItem = (item: any, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.name);
    const hasActiveChild = item.children?.some((child: any) => isActiveRoute(child.href));
    const isActive = item.href && isActiveRoute(item.href);

    return (
      <div key={item.name} className="w-full">
        <button
          onClick={() => {
            if (item.hasChildren) {
              toggleExpanded(item.name);
            } else if (item.href) {
              handleNavigation(item.href);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 ${
            isActive || hasActiveChild
              ? 'bg-[#C72030] text-white'
              : 'text-[#1a1a1a] hover:bg-gray-100'
          } ${level > 0 ? 'pl-8' : ''}`}
          style={{ marginLeft: level * 16 }}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </div>
          {item.hasChildren && (
            <div className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </button>

        {item.hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-200 ml-6">
            {item.children.map((child: any) => (
              <button
                key={child.name}
                onClick={() => handleNavigation(child.href)}
                className={`w-full flex items-center px-8 py-2 text-left transition-colors ${
                  isActiveRoute(child.href)
                    ? 'bg-[#C72030] text-white'
                    : 'text-[#1a1a1a] hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">{child.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-[#D5DbDB] fixed left-0 top-16 bottom-0 z-20">
      <div className="p-4 border-b border-[#D5DbDB]">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Master</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="py-2">
          {masterItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );
};