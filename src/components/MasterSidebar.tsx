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
  FileText,
  DoorOpen,
  PackagePlus,
  Ticket,
  Wallet
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const masterItems = [
  {
    name: 'Location Master',
    icon: MapPin,
    hasChildren: true,
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
  {
    name: 'User Master',
    icon: Users,
    hasChildren: true,
    children: [
      { name: 'FM User', href: '/master/user/fm-users' },
      { name: 'OCCUPANT USERS', href: '/master/user/occupant-users' }
    ]
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
  },
  {
    name: 'Finance Master',
    icon: Wallet,
    href: '/master/finance'
  },
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

    if (item.hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
          >
            <div className="flex items-center gap-3">
              {(isActive || hasActiveChild) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
              <item.icon className="w-5 h-5" />
              {item.name}
            </div>
            {isExpanded ?
              <ChevronDown className="w-4 h-4" /> :
              <ChevronRight className="w-4 h-4" />
            }
          </button>
          {isExpanded && (
            <div className="space-y-1">
              {item.children.map((child: any) => (
                <div key={child.name} className="ml-8">
                  <button
                    onClick={() => handleNavigation(child.href)}
                    className="flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative text-[#1a1a1a]"
                  >
                    {isActiveRoute(child.href) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
                    {child.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.name}>
        <button
          onClick={() => item.href && handleNavigation(item.href)}
          className="flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative text-[#1a1a1a]"
        >
          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
          <item.icon className="w-5 h-5" />
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
      <div className="p-2">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">Facility Management</span>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-[#1a1a1a] opacity-70 uppercase tracking-wide">
            Master
          </h3>
        </div>

        <nav className="space-y-2">
          {masterItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );
};