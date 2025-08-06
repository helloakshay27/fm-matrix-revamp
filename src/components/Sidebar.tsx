
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wrench, 
  Shield, 
  Settings, 
  BarChart3, 
  FileText,
  Clock,
  MapPin,
  Building2,
  User,
  CheckSquare,
  Home,
  Package,
  Clipboard,
  HardHat
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const sidebarItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/'
  },
  {
    name: 'Calendar',
    icon: Calendar,
    href: '/calendar'
  },
  {
    name: 'Visitors',
    icon: Users,
    hasChildren: true,
    children: [
      { name: 'Visitors', href: '/visitors' },
      { name: 'History', href: '/visitors/history' },
    ]
  },
  {
    name: 'Maintenance',
    icon: Wrench,
    hasChildren: true,
    children: [
      { name: 'M Safe', href: '/maintenance/m-safe' },
    ]
  },
  {
    name: 'Master',
    icon: Settings,
    hasChildren: true,
    children: [
      { name: 'Location Master', href: '/master/location', hasChildren: true, 
        children: [
          { name: 'Account', href: '/settings/account' },
          { name: 'Building', href: '/master/location/building' },
          { name: 'Wing', href: '/master/location/wing' },
          { name: 'Area', href: '/master/location/area' },
          { name: 'Floor', href: '/master/location/floor' },
          { name: 'Unit', href: '/master/location/unit' },
          { name: 'Room', href: '/master/location/room' }
        ]
      },
      { name: 'User Master', href: '/master/user', hasChildren: true,
        children: [
          { name: 'FM User', href: '/master/user/fm-users' },
          { name: 'OCCUPANT USERS', href: '/master/user/occupant-users' }
        ]
      },
      { name: 'Checklist Master', href: '/master/checklist' },
      { name: 'Address Master', href: '/master/address' },
      { name: 'Unit Master (By Default)', href: '/master/unit-default' },
      { name: 'Material Master -> EBom', href: '/master/material-ebom' }
    ]
  },
  {
    name: 'Setup',
    icon: Settings,
    hasChildren: true,
    children: [
      { name: 'Employees', href: '/vas/space-management/setup/employees' },
      { name: 'FM Users', href: '/setup/fm-users' },
    ]
  },
  {
    name: 'VAS',
    icon: BarChart3,
    hasChildren: true,
    children: [
      { name: 'Space Management', href: '/vas/space-management', hasChildren: true,
        children: [
          { name: 'Setup', href: '/vas/space-management/setup', hasChildren: true,
            children: [
              { name: 'Employees', href: '/vas/space-management/setup/employees' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'PMS',
    icon: Clipboard,
    hasChildren: true,
    children: [
      { name: 'Assets', href: '/pms/assets' },
      { name: 'Services', href: '/pms/services' },
    ]
  }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const hasActiveChild = (item: any): boolean => {
    if (item.children) {
      return item.children.some((child: any) => 
        isActiveRoute(child.href) || (child.children && hasActiveChild(child))
      );
    }
    return false;
  };

  const renderMenuItem = (item: any, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.name);
    const isActive = item.href && isActiveRoute(item.href);
    const hasActive = hasActiveChild(item);

    if (item.hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative ${
              level > 0 ? 'ml-4' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {(isActive || hasActive) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
              {level === 0 && <item.icon className="w-5 h-5" />}
              {item.name}
            </div>
            {isExpanded ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </button>
          {isExpanded && (
            <div className="space-y-1 mt-1">
              {item.children.map((child: any) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.name} className={level > 0 ? 'ml-4' : ''}>
        <button
          onClick={() => item.href && handleNavigation(item.href)}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative text-[#1a1a1a] ${
            isActive ? 'bg-[#DBC2A9]' : ''
          }`}
        >
          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
          {level === 0 && <item.icon className="w-5 h-5" />}
          {item.name}
        </button>
      </div>
    );
  };

  return (
    <div
      className="w-64 bg-[#f6f4ee] border-r border-[#1a1a1a] fixed left-0 top-0 overflow-y-auto"
      style={{ top: '4rem', height: '91vh' }}
    >
      <ScrollArea className="h-full">
        <div className="p-2">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FM</span>
            </div>
            <span className="text-[#1a1a1a] font-semibold text-lg">Facility Management</span>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => renderMenuItem(item))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
};
