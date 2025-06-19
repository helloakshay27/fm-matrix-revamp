
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Building,
  Wrench,
  Zap,
  Shield,
  Calendar,
  Users,
  ClipboardList,
  Car,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  {
    name: 'Transitioning',
    icon: Building,
    subItems: [
      { name: 'Snagging', href: '/transitioning/snagging' },
      { name: 'Design Insights', href: '/transitioning/design-insight' },
      { name: 'Fitout', href: '/transitioning/fitout/setup' },
    ]
  },
  {
    name: 'Maintenance',
    icon: Wrench,
    subItems: [
      { name: 'Tickets', href: '/maintenance/ticket' },
      { name: 'Incidents', href: '/maintenance/incident' },
      { name: 'Assets', href: '/maintenance/asset' },
      { name: 'AMC', href: '/maintenance/amc' },
      { name: 'Services', href: '/maintenance/service' },
      { name: 'Tasks', href: '/maintenance/task' },
      { name: 'Schedule', href: '/maintenance/schedule' },
      { name: 'Inventory', href: '/maintenance/inventory' },
      { name: 'Attendance', href: '/maintenance/attendance' },
      { name: 'Audit', href: '/maintenance/audit/operational/scheduled' },
    ]
  },
  {
    name: 'Utility',
    icon: Zap,
    subItems: [
      { name: 'Energy', href: '/utility/energy' },
      { name: 'Water', href: '/utility/water' },
      { name: 'STP', href: '/utility/stp' },
    ]
  },
  {
    name: 'Security',
    icon: Shield,
    subItems: [
      { name: 'Gate Pass', href: '/security/gate-pass' },
      { name: 'Visitors', href: '/security/visitor' },
      { name: 'Staff', href: '/security/staff' },
      { 
        name: 'Vehicles',
        subItems: [
          { name: 'R Vehicles', href: '/security/vehicle/r-vehicles' },
          { name: 'G Vehicles', href: '/security/vehicle/g-vehicles' },
        ]
      },
    ]
  },
  {
    name: 'Schedule',
    icon: Calendar,
    subItems: [
      { name: 'User Roasters', href: '/setup/user-roasters' },
      { name: 'Roster Calendar', href: '/setup/roster-calendar' },
    ]
  },
  { name: 'Space Management', href: '/space-management/bookings', icon: Users },
  { name: 'Value Added Services', href: '/value-added-services', icon: ClipboardList },
  { name: 'Parking', href: '/property/parking', icon: Car },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Setup', href: '/setup', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>(['Security', 'Vehicles']);

  const toggleItem = (itemName: string) => {
    setOpenItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const renderSubItems = (items: any[], parentName?: string) => {
    return items.map((item) => {
      if (item.subItems) {
        const isOpen = openItems.includes(item.name);
        return (
          <div key={item.name} className="ml-4">
            <button
              onClick={() => toggleItem(item.name)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <span>{item.name}</span>
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {renderSubItems(item.subItems, item.name)}
              </div>
            )}
          </div>
        );
      }

      return (
        <Link
          key={item.name}
          to={item.href}
          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
            location.pathname === item.href
              ? 'bg-[#C72030] text-white'
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}
        >
          {item.name}
        </Link>
      );
    });
  };

  const renderNavigationItem = (item: any) => {
    if (item.subItems) {
      const isOpen = openItems.includes(item.name);
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleItem(item.name)}
            className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.name}
            </div>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {isOpen && (
            <div className="ml-8 mt-1 space-y-1">
              {renderSubItems(item.subItems)}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          location.pathname === item.href
            ? 'bg-[#C72030] text-white'
            : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
        }`}
      >
        <item.icon className="w-5 h-5" />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">Facility Management</span>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map(renderNavigationItem)}
        </nav>
      </div>
    </div>
  );
};
