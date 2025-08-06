
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Wrench, 
  Building, 
  Users, 
  CheckSquare, 
  MapPin, 
  Package, 
  FileText, 
  Calendar, 
  ClipboardList,
  UserCheck,
  MapPinHouse,
  Shield,
  Settings,
  Clock,
  AlertTriangle,
  Zap,
  Activity,
  Car,
  Home
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const menuItems = [
  {
    name: 'Dashboard',
    icon: BarChart3,
    href: '/dashboard'
  },
  {
    name: 'PMS',
    icon: Wrench,
    hasChildren: true,
    children: [
      { name: 'Task List', href: '/pms/task-list' },
      { name: 'Asset Register', href: '/pms/asset-register' },
      { name: 'AMC', href: '/pms/amc' },
      { name: 'Service Master', href: '/pms/service-master' },
      { name: 'Warranty Master', href: '/pms/warranty-master' },
      { name: 'Vendor Master', href: '/pms/vendor-master' },
      { name: 'Asset Tagging', href: '/pms/asset-tagging' }
    ]
  },
  {
    name: 'Maintenance',
    icon: Settings,
    hasChildren: true,
    children: [
      { name: 'M Safe', href: '/maintenance/m-safe' },
      { name: 'Helpdesk', href: '/maintenance/helpdesk' },
      { name: 'Visitor Management', href: '/maintenance/visitor-management' }
    ]
  },
  {
    name: 'Setup',
    icon: Settings,
    hasChildren: true,
    children: [
      { name: 'Location Master', href: '/setup/location' },
      { name: 'User Roles', href: '/setup/user-roles' },
      { name: 'Asset Groups', href: '/setup/asset-groups' },
      { name: 'Meter Types', href: '/setup/meter-types' },
      { name: 'Checklists', href: '/setup/checklists' },
      { name: 'Ticket Setup', href: '/setup/ticket-setup' },
      { name: 'Escalation', href: '/setup/escalation' },
      { name: 'Cost Approval', href: '/setup/cost-approval' },
      { name: 'Approval Matrix', href: '/setup/approval-matrix' },
      { name: 'Patrolling Approval', href: '/setup/patrolling-approval' },
      { name: 'SAC/HSN', href: '/setup/sac-hsn' },
      { name: 'Address', href: '/setup/address' },
      { name: 'Export', href: '/setup/export' }
    ]
  },
  {
    name: 'Master',
    icon: Database,
    hasChildren: true,
    children: [
      { name: 'Location Master', href: '/master/location' },
      { name: 'User Master', href: '/master/user' },
      { name: 'Checklist Master', href: '/master/checklist' },
      { name: 'Address Master', href: '/master/address' },
      { name: 'Unit Master (By Default)', href: '/master/unit-default' },
      { name: 'Material Master -> EBom', href: '/master/material-ebom' }
    ]
  }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Maintenance']);

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

        <nav className="space-y-2">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );
};
