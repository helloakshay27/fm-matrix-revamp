import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Users, 
  UserCheck, 
  Package, 
  Wrench, 
  Calendar, 
  Settings, 
  FileText, 
  Shield,
  Building
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const menuItems = [
  {
    section: 'Dashboard',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        hasChildren: false
      }
    ]
  },
  {
    section: 'Visitor Management',
    items: [
      {
        name: 'Visitor Management',
        href: '/visitor-management',
        icon: UserCheck,
        hasChildren: false
      }
    ]
  },
  {
    section: 'Maintenance',
    items: [
      {
        name: 'M Safe',
        href: '/maintenance/m-safe',
        icon: Shield,
        hasChildren: false
      },
      {
        name: 'Assets',
        href: '/maintenance/assets',
        icon: Package,
        hasChildren: false
      },
      {
        name: 'PMS',
        href: '/maintenance/pms',
        icon: Wrench,
        hasChildren: false
      },
      {
        name: 'Preventive Maintenance',
        href: '/maintenance/preventive',
        icon: Calendar,
        hasChildren: false
      }
    ]
  },
  {
    section: 'Projects',
    items: [
      {
        name: 'Projects',
        href: '/projects',
        icon: Building,
        hasChildren: false
      }
    ]
  },
  {
    section: 'Settings',
    items: [
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        hasChildren: true,
        children: [
          { name: 'FM Users', href: '/settings/users' },
          { name: 'Roles & Permissions', href: '/settings/roles' },
          { name: 'System Settings', href: '/settings/system' }
        ]
      }
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
    return location.pathname === href || location.pathname.startsWith(href + '/');
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
            className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
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
      <ScrollArea className="h-full">
        <div className="p-2">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FM</span>
            </div>
            <span className="text-[#1a1a1a] font-semibold text-lg">Facility Management</span>
          </div>

          {menuItems.map((section) => (
            <div key={section.section} className="mb-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#1a1a1a] opacity-70 uppercase tracking-wide">
                  {section.section}
                </h3>
              </div>
              <nav className="space-y-2">
                {section.items.map((item) => renderMenuItem(item))}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
