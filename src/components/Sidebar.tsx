import React, { useState } from 'react';
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
  HandHeart, Briefcase, BookOpen, FileSpreadsheet, Target,
  Layers, Archive, UserCog, TreePine, FlaskConical
} from 'lucide-react';

const modulesByPackage = {
  'Transitioning': [
    { name: 'HOTO', icon: HandHeart, href: '/transitioning/hoto' },
    { name: 'Snagging', icon: CheckSquare, href: '/transitioning/snagging' },
    { name: 'Design Insight', icon: BarChart3, href: '/transitioning/design-insight' },
    { name: 'Fitout', icon: Wrench, href: '/transitioning/fitout' }
  ],
  'Maintenance': [
    { name: 'Assets', icon: Building, href: '/maintenance/assets' },
    { name: 'AMC', icon: FileText, href: '/maintenance/amc' },
    { name: 'Services', icon: Wrench, href: '/maintenance/services' },
    { name: 'Attendance', icon: Clock, href: '/maintenance/attendance' },
    { name: 'Inventory', icon: Package, href: '/maintenance/inventory' },
    { name: 'Ticket', icon: FileText, href: '/maintenance/ticket' },
    { name: 'Task', icon: CheckSquare, href: '/maintenance/task' },
    { name: 'Schedule', icon: Calendar, href: '/maintenance/schedule' },
    { 
      name: 'Safety', 
      icon: Shield, 
      href: '/maintenance/safety',
      subItems: [
        { name: 'Incident', href: '/maintenance/incident', color: 'text-[#1a1a1a]' },
        { name: 'Permit to Work', href: '/maintenance/permit', color: 'text-[#1a1a1a]' },
        { name: 'M Safe', href: '/maintenance/m-safe', color: 'text-[#1a1a1a]' }
      ]
    },
    { 
      name: 'Audit', 
      icon: Clipboard, 
      href: '/maintenance/audit',
      subItems: [
        { name: 'Operational', href: '/maintenance/audit/operational', color: 'text-[#1a1a1a]' },
        { name: 'Vendor', href: '/maintenance/audit/vendor', color: 'text-[#1a1a1a]' },
        { name: 'Assets', href: '/maintenance/audit/assets', color: 'text-[#1a1a1a]' },
        { name: 'Waste', href: '/maintenance/audit/waste', color: 'text-[#1a1a1a]' },
        { name: 'Survey', href: '/maintenance/audit/survey', color: 'text-[#1a1a1a]' }
      ]
    }
  ],
  'Finance': [
    { name: 'Procurement', icon: Briefcase, href: '/finance/procurement' },
    { 
      name: 'PR/ SR', 
      icon: FileText, 
      href: '/finance/pr-sr',
      color: 'text-orange-600'
    },
    { 
      name: 'PO/WO', 
      icon: FileText, 
      href: '/finance/po-wo',
      color: 'text-orange-600'
    },
    { 
      name: 'GRN/ SRN', 
      icon: Receipt, 
      href: '/finance/grn-srn',
      color: 'text-orange-600'
    },
    { name: 'Invoices', icon: Receipt, href: '/finance/invoices' },
    { name: 'Bill Booking', icon: FileText, href: '/finance/bill-booking' },
    { name: 'Accounting', icon: Calculator, href: '/finance/accounting' },
    { 
      name: 'Cost Center', 
      icon: Target, 
      href: '/finance/cost-center',
      color: 'text-orange-600'
    },
    { name: 'Budgeting', icon: BarChart3, href: '/finance/budgeting' },
    { 
      name: 'Lease Management', 
      icon: FileText, 
      href: '/finance/lease-management',
      color: 'text-orange-600'
    },
    { name: 'Pending Approvals', icon: Clock, href: '/finance/pending-approvals' },
    { name: 'Auto Saved PR', icon: FileText, href: '/finance/auto-saved-pr' }
  ],
  'CRM': [
    { name: 'Cloud Telephony', icon: Phone, href: '/crm/cloud-telephony' },
    { name: 'Lead', icon: Target, href: '/crm/lead' },
    { name: 'Opportunity', icon: Star, href: '/crm/opportunity' },
    { name: 'CRM', icon: Users, href: '/crm/crm' }
  ],
  'Utility': [
    { name: 'Energy', icon: Zap, href: '/utility/energy' },
    { name: 'Water', icon: Droplets, href: '/utility/water' },
    { name: 'STP', icon: Database, href: '/utility/stp' }
  ],
  'Security': [
    { name: 'Gate Pass', icon: Shield, href: '/security/gate-pass' },
    { name: 'Visitor', icon: Users, href: '/security/visitor' },
    { name: 'Staff', icon: UserCog, href: '/security/staff' },
    { name: 'Vehicle', icon: Car, href: '/security/vehicle' },
    { name: 'Patrolling', icon: Shield, href: '/security/patrolling' }
  ],
  'Value Added Services': [
    { name: 'F&B', icon: Coffee, href: '/vas/fnb' },
    { name: 'Parking', icon: Car, href: '/vas/parking' },
    { name: 'OSR', icon: TreePine, href: '/vas/osr' },
    { name: 'Space Management', icon: Layers, href: '/vas/space-management' },
    { name: 'Training List', icon: BookOpen, href: '/vas/training-list' }
  ],
  'Settings': [
    { name: 'General', icon: Settings, href: '/settings/general' },
    { name: 'Account', icon: UserCog, href: '/settings/account' },
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
  const { currentSection } = useLayout();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const currentModules = modulesByPackage[currentSection] || [];

  return (
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#1a1a1a] fixed left-0 top-0 overflow-y-auto">
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
          {currentModules.map((module) => (
            <div key={module.name}>
              {module.subItems ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(module.name)}
                    className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                  >
                    <div className="flex items-center gap-3">
                      <module.icon className="w-5 h-5" />
                      {module.name}
                    </div>
                    {expandedItems.includes(module.name) ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </button>
                  {expandedItems.includes(module.name) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {module.subItems.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[#DBC2A9] ${
                            subItem.color || 'text-[#1a1a1a]'
                          }`}
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={module.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] ${
                    module.color || 'text-[#1a1a1a]'
                  }`}
                >
                  <module.icon className="w-5 h-5" />
                  {module.name}
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};
