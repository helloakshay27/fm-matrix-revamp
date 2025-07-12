
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { 
  Settings, Users, CheckSquare, Building, Shield, FileText,
  AlertTriangle, Package, DollarSign, Car, MapPin, Mail,
  Calendar, Info, Languages, Upload, BarChart3, Bell,
  ClipboardList, Trash2, CreditCard, ChevronDown, ChevronRight,
  Home, UserCheck, Wrench
} from 'lucide-react';

const navigationStructure = {
  'Settings': {
    icon: Settings,
    items: [
      {
        name: 'Account',
        icon: Users,
        subItems: [
          { name: 'General', href: '/settings/account/general' },
          { name: 'Holiday Calendar', href: '/settings/account/holiday-calendar' },
          { name: 'About', href: '/settings/account/about', isActive: true },
          { name: 'Language', href: '/settings/account/language' },
          { name: 'Company Logo Upload', href: '/settings/account/company-logo-upload' },
          { name: 'Report Setup', href: '/settings/account/report-setup' },
          { name: 'Notification Setup', href: '/settings/account/notification-setup' }
        ]
      },
      {
        name: 'Roles (RACI)',
        icon: UserCheck,
        subItems: [
          { name: 'Department', href: '/settings/roles/department' },
          { name: 'Role', href: '/settings/roles/role' }
        ]
      },
      {
        name: 'Approval Matrix',
        icon: CheckSquare,
        subItems: [
          { name: 'Setup', href: '/settings/approval-matrix/setup' }
        ]
      }
    ]
  },
  'Maintenance': {
    icon: Wrench,
    items: [
      {
        name: 'Asset Setup',
        icon: Building,
        subItems: [
          { name: 'Approval Matrix', href: '/maintenance/asset-setup/approval-matrix' },
          { name: 'Asset Group & Sub Group', href: '/maintenance/asset-setup/asset-groups' }
        ]
      },
      {
        name: 'Checklist Setup',
        icon: CheckSquare,
        subItems: [
          { name: 'Checklist Group and Sub Group', href: '/maintenance/checklist-setup/group' },
          { name: 'Email Rule', href: '/maintenance/checklist-setup/email-rule' },
          { name: 'Task Escalation', href: '/maintenance/checklist-setup/task-escalation' }
        ]
      },
      {
        name: 'Ticket Management',
        icon: FileText,
        subItems: [
          { name: 'Setup', href: '/maintenance/ticket-management/setup' },
          { name: 'Escalation Matrix', href: '/maintenance/ticket-management/escalation-matrix' },
          { name: 'Cost Approval', href: '/maintenance/ticket-management/cost-approval' }
        ]
      },
      {
        name: 'Inventory Management',
        icon: Package,
        subItems: [
          { name: 'SAC/HSN Code', href: '/maintenance/inventory-management/sac-hsn-code' }
        ]
      },
      {
        name: 'Safety',
        icon: Shield,
        href: '/maintenance/safety'
      },
      {
        name: 'Permit',
        icon: FileText,
        subItems: [
          { name: 'Permit Setup', href: '/maintenance/permit/permit-setup' }
        ]
      },
      {
        name: 'Incident',
        icon: AlertTriangle,
        subItems: [
          { name: 'Setup', href: '/maintenance/incident/setup' }
        ]
      },
      {
        name: 'Waste Management',
        icon: Trash2,
        subItems: [
          { name: 'Setup', href: '/maintenance/waste-management/setup' }
        ]
      }
    ]
  },
  'Finance': {
    icon: DollarSign,
    items: [
      {
        name: 'Wallet Setup',
        icon: CreditCard,
        href: '/finance/wallet-setup'
      }
    ]
  },
  'Security': {
    icon: Shield,
    items: [
      {
        name: 'Visitor Management',
        icon: Users,
        subItems: [
          { name: 'Setup', href: '/security/visitor-management/setup' },
          { name: 'Visiting Purpose', href: '/security/visitor-management/visiting-purpose' },
          { name: 'Support Staff', href: '/security/visitor-management/support-staff' }
        ]
      },
      {
        name: 'Gate Pass',
        icon: Car,
        subItems: [
          { name: 'Materials Type', href: '/security/gate-pass/materials-type' },
          { name: 'Items Name', href: '/security/gate-pass/items-name' }
        ]
      }
    ]
  }
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSection, setCurrentSection } = useLayout();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Settings']);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Account']);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const toggleItem = (itemName: string) => {
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

  const renderSubItem = (subItem: any, level: number = 0) => {
    const isActive = subItem.isActive || isActiveRoute(subItem.href);
    
    return (
      <button
        key={subItem.name}
        onClick={() => handleNavigation(subItem.href)}
        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors relative ${
          isActive 
            ? 'bg-[#C72030] text-white font-medium' 
            : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
        }`}
        style={{ marginLeft: `${level * 16}px` }}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
        {subItem.name}
      </button>
    );
  };

  const renderItem = (item: any, sectionName: string) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    
    if (hasSubItems) {
      return (
        <div key={item.name} className="space-y-1">
          <button
            onClick={() => toggleItem(item.name)}
            className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              {item.name}
            </div>
            {isExpanded ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </button>
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.subItems.map((subItem: any) => renderSubItem(subItem, 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.name}
        onClick={() => handleNavigation(item.href)}
        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
          isActiveRoute(item.href) 
            ? 'bg-[#C72030] text-white' 
            : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
        }`}
      >
        {isActiveRoute(item.href) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
        <item.icon className="w-4 h-4" />
        {item.name}
      </button>
    );
  };

  const renderSection = (sectionName: string, section: any) => {
    const isExpanded = expandedSections.includes(sectionName);
    
    return (
      <div key={sectionName} className="space-y-2">
        <button
          onClick={() => toggleSection(sectionName)}
          className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
        >
          <div className="flex items-center gap-3">
            <section.icon className="w-5 h-5" />
            {sectionName}
          </div>
          {isExpanded ? 
            <ChevronDown className="w-4 h-4" /> : 
            <ChevronRight className="w-4 h-4" />
          }
        </button>
        
        {isExpanded && (
          <div className="ml-4 space-y-2">
            {section.items.map((item: any) => renderItem(item, sectionName))}
          </div>
        )}
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
        
        <nav className="space-y-3">
          {Object.entries(navigationStructure).map(([sectionName, section]) => 
            renderSection(sectionName, section)
          )}
        </nav>
      </div>
    </div>
  );
};
