
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { 
  Users, Settings, FileText, Building, Car, Shield, DollarSign, 
  Clipboard, AlertTriangle, Bell, Package, Wrench, BarChart3,
  Calendar, Clock, CheckSquare, MapPin, Truck, Phone, Globe,
  CreditCard, Receipt, Calculator, PieChart, UserCheck, 
  Database, Zap, Droplets, Trash2, Sun, Battery, Gauge,
  Video, Lock, Key, Eye, ShieldCheck, Headphones, Gift,
  Star, MessageSquare, Coffee, Wifi, Home, ChevronDown,
  ChevronRight, Plus, Search, Filter, Download, Upload,
  Briefcase, BookOpen, FileSpreadsheet, Target,
  Archive, TreePine, FlaskConical, Megaphone, Group, Wallet
} from 'lucide-react';

const modulesByPackage = {
  'Transitioning': [
    { name: 'HOTO', icon: FileText, href: '/transitioning/hoto' },
    { name: 'Snagging', icon: CheckSquare, href: '/transitioning/snagging' },
    { name: 'Design Insight', icon: BarChart3, href: '/transitioning/design-insight' },
    { name: 'Fitout', icon: Wrench, href: '/transitioning/fitout' }
  ],
  'Maintenance': [
    { name: 'Assets', icon: Building, href: '/maintenance/asset' },
    { name: 'AMC', icon: FileText, href: '/maintenance/amc' },
    { name: 'Services', icon: Wrench, href: '/maintenance/services' },
    { name: 'Attendance', icon: Clock, href: '/maintenance/attendance' },
    { name: 'Inventory', icon: Package, href: '/maintenance/inventory' },
    { name: 'Ticket', icon: FileText, href: '/maintenance/ticket' },
    { name: 'Task', icon: CheckSquare, href: '/maintenance/task' },
    { name: 'Schedule', icon: Calendar, href: '/maintenance/schedule' },
    { name: 'Safety', icon: Shield, href: '/maintenance/safety' },
    { name: 'Audit', icon: Clipboard, href: '/maintenance/audit' },
    { name: 'Operational', icon: CheckSquare, href: '/maintenance/operational' },
    { name: 'Vendor', icon: Users, href: '/maintenance/vendor' },
    { name: 'Assets', icon: Building, href: '/maintenance/assets' },
    { name: 'Waste', icon: Trash2, href: '/maintenance/waste' },
    { name: 'Survey', icon: FileText, href: '/maintenance/survey' }
  ],
  'Safety': [
    { name: 'Incident', icon: AlertTriangle, href: '/maintenance/incident' },
    { name: 'Permit to Work', icon: FileText, href: '/maintenance/permit' },
    { name: 'M Safe', icon: ShieldCheck, href: '/maintenance/m-safe' },
    { name: 'Training List', icon: BookOpen, href: '/vas/training-list' }
  ],
  'Finance': [
    { name: 'Procurement', icon: Briefcase, href: '/finance/procurement' },
    { name: 'PR / SR', icon: FileText, href: '/finance/pr-sr' },
    { name: 'PO / WO', icon: FileText, href: '/finance/po-wo' },
    { name: 'GRN / SRN', icon: FileText, href: '/finance/grn-srn' },
    { name: 'Invoices', icon: Receipt, href: '/finance/invoices' },
    { name: 'Bill Booking', icon: Receipt, href: '/finance/bill-booking' },
    { name: 'Cost Center', icon: Calculator, href: '/finance/cost-center' },
    { name: 'Budgeting', icon: PieChart, href: '/finance/budgeting' },
    { name: 'Pending Approvals', icon: Clock, href: '/finance/pending-approvals' },
    { name: 'Auto Saved PR', icon: FileText, href: '/finance/auto-saved-pr' },
    { name: 'WBS', icon: Archive, href: '/finance/wbs' }
  ],
  'CRM': [
    { name: 'Lead', icon: Target, href: '/crm/lead' },
    { name: 'Opportunity', icon: Star, href: '/crm/opportunity' },
    { name: 'CRM', icon: Users, href: '/crm/crm' },
    { name: 'Events', icon: Calendar, href: '/crm/events' },
    { name: 'Broadcast', icon: Megaphone, href: '/crm/broadcast' },
    { name: 'Groups', icon: Group, href: '/crm/groups' },
    { name: 'Polls', icon: BarChart3, href: '/crm/polls' },
    { name: 'Campaign', icon: MessageSquare, href: '/crm/campaign' }
  ],
  'Utility': [
    { name: 'Energy', icon: Zap, href: '/utility/energy' },
    { name: 'Water', icon: Droplets, href: '/utility/water' },
    { name: 'STP', icon: Database, href: '/utility/stp' },
    { name: 'EV Consumption', icon: Car, href: '/utility/ev-consumption' },
    { name: 'Solar Generation', icon: Sun, href: '/utility/solar-generator' }
  ],
  'Security': [
    { name: 'Gate Pass', icon: Shield, href: '/security/gate-pass' },
    { name: 'Visitor', icon: Users, href: '/security/visitor' },
    { name: 'Staff', icon: Users, href: '/security/staff' },
    { name: 'Vehicle', icon: Car, href: '/security/vehicle' },
    { name: 'Patrolling', icon: Shield, href: '/security/patrolling' }
  ],
  'Value Added Services': [
    { name: 'F&B', icon: Coffee, href: '/vas/fnb' },
    { name: 'Parking', icon: Car, href: '/vas/parking' },
    { name: 'OSR', icon: TreePine, href: '/vas/osr' },
    { name: 'Space Management', icon: Building, href: '/vas/space-management' },
    { name: 'Redemonection marketplace', icon: Globe, href: '/vas/redemonection-marketplace' },
    { name: 'Cold Wallet', icon: Wallet, href: '/vas/cold-wallet' }
  ],
  'Market Place': [
    { name: 'Lease Management', icon: FileText, href: '/marketplace/lease-management' },
    { name: 'Loyalty Rule Engine', icon: Star, href: '/marketplace/loyalty-rule-engine' },
    { name: 'Cloud Telephony', icon: Phone, href: '/marketplace/cloud-telephony' },
    { name: 'Accounting', icon: Calculator, href: '/marketplace/accounting' }
  ],
  'Settings': [
    { name: 'General', icon: Settings, href: '/settings/general' },
    { name: 'Account', icon: Users, href: '/settings/account' },
    { name: 'Users', icon: Users, href: '/settings/users' },
    { name: 'Roles (RACI)', icon: UserCheck, href: '/settings/roles' },
    { name: 'Approval Matrix', icon: CheckSquare, href: '/settings/approval-matrix' },
    { 
      name: 'Module 1', 
      icon: Package, 
      href: '/settings/module1',
      subItems: [
        { name: 'Function 1', href: '/settings/module1/function1', color: 'text-orange-600' },
        { name: 'Function 2', href: '/settings/module1/function2', color: 'text-orange-600' }
      ]
    },
    { 
      name: 'Module 2', 
      icon: Package, 
      href: '/settings/module2',
      subItems: [
        { name: 'Function 1', href: '/settings/module2/function1', color: 'text-orange-600' },
        { name: 'Function 2', href: '/settings/module2/function2', color: 'text-orange-600' }
      ]
    },
    { 
      name: 'Masters', 
      icon: Archive, 
      href: '/settings/masters',
      subItems: [
        { name: 'Checklist Master', href: '/settings/masters/checklist', color: 'text-orange-600' },
        { name: 'Unit Master', href: '/settings/masters/unit', color: 'text-orange-600' },
        { name: 'Address Master', href: '/settings/masters/address', color: 'text-orange-600' }
      ]
    }
  ]
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSection, setCurrentSection } = useLayout();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleNavigation = (href: string, section?: string) => {
    if (section && section !== currentSection) {
      setCurrentSection(section);
    }
    navigate(href);
  };

  React.useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/utility')) {
      setCurrentSection('Utility');
    } else if (path.startsWith('/transitioning')) {
      setCurrentSection('Transitioning');
    } else if (path.startsWith('/security')) {
      setCurrentSection('Security');
    } else if (path.startsWith('/vas')) {
      setCurrentSection('Value Added Services');
    } else if (path.startsWith('/finance')) {
      setCurrentSection('Finance');
    } else if (path.startsWith('/maintenance')) {
      setCurrentSection('Maintenance');
    } else if (path.startsWith('/crm')) {
      setCurrentSection('CRM');
    } else if (path.startsWith('/marketplace')) {
      setCurrentSection('Market Place');
    } else if (path.startsWith('/settings')) {
      setCurrentSection('Settings');
    }
  }, [location.pathname, setCurrentSection]);

  const currentModules = modulesByPackage[currentSection] || [];

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    
    if (hasSubItems) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
          >
            <div className="flex items-center gap-3">
              {level === 0 && <item.icon className="w-5 h-5" />}
              {item.name}
            </div>
            {isExpanded ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </button>
          {isExpanded && (
            <div className="space-y-1">
              {item.subItems.map((subItem: any) => (
                <div key={subItem.name} className="ml-8">
                  <button
                    onClick={() => handleNavigation(subItem.href, currentSection)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] ${
                      subItem.color || 'text-[#1a1a1a]'
                    }`}
                  >
                    {subItem.name}
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
          onClick={() => handleNavigation(item.href, currentSection)}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] ${
            item.color || 'text-[#1a1a1a]'
          }`}
        >
          {level === 0 && <item.icon className="w-5 h-5" />}
          {item.name}
        </button>
      </div>
    );
  };

  return (
    <div
      className="w-64 bg-[#f6f4ee] border-r border-[#1a1a1a] fixed left-0 top-0 overflow-y-auto"
      style={{ top: '10vh', height: '90vh' }}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">Facility Management</span>
        </div>
        
        {currentSection && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-[#1a1a1a] opacity-70 uppercase tracking-wide">
              {currentSection}
            </h3>
          </div>
        )}
        
        <nav className="space-y-2">
          {currentModules.map((module) => renderMenuItem(module))}
        </nav>
      </div>
    </div>
  );
};
