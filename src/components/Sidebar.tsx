
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
  HandHeart, Briefcase, BookOpen, FileSpreadsheet, Target,
  Layers, Archive, UserCog, TreePine, FlaskConical
} from 'lucide-react';

const modulesByPackage = {
  'Transitioning': [
    { name: 'HOTO', icon: HandHeart, href: '/transitioning/hoto' },
    { 
      name: 'Snagging', 
      icon: CheckSquare, 
      href: '/transitioning/snagging',
      subItems: [
        { name: 'User Snag', href: '/transitioning/snagging?view=user', color: 'text-[#1a1a1a]' },
        { name: 'My Snags', href: '/transitioning/snagging?view=my', color: 'text-[#1a1a1a]' }
      ]
    },
    { name: 'Design Insight', icon: BarChart3, href: '/transitioning/design-insight' },
    { 
      name: 'Fitout', 
      icon: Wrench, 
      href: '/transitioning/fitout',
      subItems: [
        { name: 'Fitout Setup', href: '/transitioning/fitout/setup', color: 'text-[#1a1a1a]' },
        { name: 'Fitout Request', href: '/transitioning/fitout/request', color: 'text-[#1a1a1a]' },
        { name: 'Fitout Checklist', href: '/transitioning/fitout/checklist', color: 'text-[#1a1a1a]' },
        { name: 'Fitout Violation', href: '/transitioning/fitout/violation', color: 'text-[#1a1a1a]' }
      ]
    }
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
        { 
          name: 'Operational', 
          href: '/maintenance/audit/operational', 
          color: 'text-[#1a1a1a]',
          subItems: [
            { name: 'Scheduled', href: '/maintenance/audit/operational/scheduled', color: 'text-[#1a1a1a]' },
            { name: 'Conducted', href: '/maintenance/audit/operational/conducted', color: 'text-[#1a1a1a]' },
            { name: 'Master Checklists', href: '/maintenance/audit/operational/master-checklists', color: 'text-[#1a1a1a]' }
          ]
        },
        { 
          name: 'Vendor', 
          href: '/maintenance/audit/vendor', 
          color: 'text-[#1a1a1a]',
          subItems: [
            { name: 'Scheduled', href: '/maintenance/audit/vendor/scheduled', color: 'text-[#1a1a1a]' },
            { name: 'Conducted', href: '/maintenance/audit/vendor/conducted', color: 'text-[#1a1a1a]' }
          ]
        },
        { name: 'Assets', href: '/maintenance/audit/assets', color: 'text-[#1a1a1a]' },
        { 
          name: 'Waste', 
          href: '/maintenance/audit/waste', 
          color: 'text-[#1a1a1a]',
          subItems: [
            { name: 'Waste Generation', href: '/maintenance/audit/waste/generation', color: 'text-[#1a1a1a]' },
            { name: 'Setup', href: '/maintenance/audit/waste/setup', color: 'text-[#1a1a1a]' }
          ]
        },
        { 
          name: 'Survey', 
          href: '/maintenance/audit/survey', 
          color: 'text-[#1a1a1a]',
          subItems: [
            { name: 'Survey List', href: '/maintenance/audit/survey/list', color: 'text-[#1a1a1a]' },
            { name: 'Mapping', href: '/maintenance/audit/survey/mapping', color: 'text-[#1a1a1a]' },
            { name: 'Response', href: '/maintenance/audit/survey/response', color: 'text-[#1a1a1a]' }
          ]
        }
      ]
    }
  ],
  'Finance': [
    { 
      name: 'Procurement', 
      icon: Briefcase, 
      href: '/finance/procurement',
      subItems: [
        { 
          name: 'PR/ SR', 
          href: '/finance/pr-sr', 
          color: 'text-[#1a1a1a]',
          subItems: [
            { name: 'Material PR', href: '/finance/material-pr', color: 'text-[#1a1a1a]' },
            { name: 'Service PR', href: '/finance/service-pr', color: 'text-[#1a1a1a]' }
          ]
        },
        { 
          name: 'PO/WO', 
          href: '/finance/po-wo', 
          color: 'text-[#1a1a1a]',
          subItems: [
            { name: 'PO', href: '/finance/po', color: 'text-[#1a1a1a]' },
            { name: 'WO', href: '/finance/wo', color: 'text-[#1a1a1a]' }
          ]
        },
        { name: 'GRN/ SRN', href: '/finance/grn-srn', color: 'text-[#1a1a1a]' },
        { name: 'Auto Saved PR', href: '/finance/auto-saved-pr', color: 'text-[#1a1a1a]' }
      ]
    },
    { name: 'Invoices', icon: Receipt, href: '/finance/invoices' },
    { 
      name: 'Accounting', 
      icon: Calculator, 
      href: '/finance/accounting',
      subItems: [
        { name: 'Cost Center', href: '/finance/cost-center', color: 'text-[#1a1a1a]' },
        { name: 'Budgeting', href: '/finance/budgeting', color: 'text-[#1a1a1a]' },
        { name: 'Pending Approvals', href: '/finance/pending-approvals', color: 'text-[#1a1a1a]' }
      ]
    },
    { 
      name: 'Lease Management', 
      icon: FileText, 
      href: '/finance/lease-management',
      color: 'text-[#1a1a1a]'
    }
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
    { 
      name: 'Gate Pass', 
      icon: Shield, 
      href: '/security/gate-pass',
      subItems: [
        { name: 'Inwards', href: '/security/gate-pass/inwards', color: 'text-[#1a1a1a]' },
        { name: 'Outwards', href: '/security/gate-pass/outwards', color: 'text-[#1a1a1a]' }
      ]
    },
    { name: 'Visitor', icon: Users, href: '/security/visitor' },
    { name: 'Staff', icon: UserCog, href: '/security/staff' },
    { 
      name: 'Vehicle', 
      icon: Car, 
      href: '/security/vehicle',
      subItems: [
        { 
          name: 'R Vehicles', 
          href: '/security/vehicle/r-vehicles', 
          color: 'text-[#1a1a1a]',
          subItems: [
            { name: 'All', href: '/security/vehicle/r-vehicles', color: 'text-[#1a1a1a]' },
            { name: 'History', href: '/security/vehicle/r-vehicles/history', color: 'text-[#1a1a1a]' }
          ]
        },
        { name: 'G Vehicles', href: '/security/vehicle/g-vehicles', color: 'text-[#1a1a1a]' }
      ]
    },
    { name: 'Patrolling', icon: Shield, href: '/security/patrolling' }
  ],
  'Value Added Services': [
    { name: 'F&B', icon: Coffee, href: '/vas/fnb' },
    { name: 'Parking', icon: Car, href: '/vas/parking' },
    { name: 'OSR', icon: TreePine, href: '/vas/osr' },
    { 
      name: 'Space Management', 
      icon: Layers, 
      href: '/vas/space-management',
      subItems: [
        { name: 'Bookings', href: '/vas/space-management/bookings', color: 'text-[#1a1a1a]' },
        { name: 'Seat Requests', href: '/vas/space-management/seat-requests', color: 'text-[#1a1a1a]' },
        { 
          name: 'Setup', 
          href: '/vas/space-management/setup', 
          color: 'text-[#1a1a1a]',
          subItems: [
            { name: 'Seat Type', href: '/vas/space-management/setup/seat-type', color: 'text-[#1a1a1a]' },
            { name: 'Seat Setup', href: '/vas/space-management/setup/seat-setup', color: 'text-[#1a1a1a]' },
            { name: 'Shift', href: '/vas/space-management/setup/shift', color: 'text-[#1a1a1a]' },
            { name: 'Roster', href: '/vas/space-management/setup/roster', color: 'text-[#1a1a1a]' },
            { name: 'Employees', href: '/vas/space-management/setup/employees', color: 'text-[#1a1a1a]' },
            { name: 'Check in Margin', href: '/vas/space-management/setup/check-in-margin', color: 'text-[#1a1a1a]' },
            { name: 'Roster Calendar', href: '/vas/space-management/setup/roster-calendar', color: 'text-[#1a1a1a]' },
            { name: 'Export', href: '/vas/space-management/setup/export', color: 'text-[#1a1a1a]' }
          ]
        }
      ]
    },
    { name: 'Training List', icon: BookOpen, href: '/vas/training-list' }
  ],
  'Settings': [
    { name: 'General', icon: Settings, href: '/settings/general' },
    { name: 'Account', icon: UserCog, href: '/settings/account' },
    { name: 'Users', icon: Users, href: '/settings/users' },
    { 
      name: 'Roles (RACI)', 
      icon: UserCheck, 
      href: '/settings/roles',
      subItems: [
        { name: 'Department', href: '/settings/roles/department', color: 'text-[#1a1a1a]' },
        { name: 'Role', href: '/settings/roles/role', color: 'text-[#1a1a1a]' }
      ]
    },
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
  const [selectedDepartment, setSelectedRole] = useState('');
  const [selectedRole, setSelectedDepartment] = useState('');

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
    } else if (path.startsWith('/settings')) {
      setCurrentSection('Settings');
    }
  }, [location.pathname, setCurrentSection]);

  const currentModules = modulesByPackage[currentSection] || [];

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const showDropdowns = item.hasDropdowns && location.pathname === item.href;
    
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
                  {subItem.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(subItem.name)}
                        className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                      >
                        <span>{subItem.name}</span>
                        {expandedItems.includes(subItem.name) ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </button>
                      {expandedItems.includes(subItem.name) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {subItem.subItems.map((nestedItem: any) => (
                            <button
                              key={nestedItem.name}
                              onClick={() => handleNavigation(nestedItem.href, currentSection)}
                              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[#DBC2A9] ${
                                nestedItem.color || 'text-[#1a1a1a]'
                              }`}
                            >
                              {nestedItem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavigation(subItem.href, currentSection)}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] ${
                        subItem.color || 'text-[#1a1a1a]'
                      }`}
                    >
                      {subItem.name}
                    </button>
                  )}
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
        
        {/* Show dropdowns for Roles (RACI) when on that page */}
        {showDropdowns && (
          <div className="mt-4 space-y-3 px-3">
            <div>
              <label className="text-xs font-medium text-[#1a1a1a] mb-1 block">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#C72030]"
              >
                <option value="">Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="facilities">Facilities</option>
                <option value="security">Security</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-[#1a1a1a] mb-1 block">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#C72030]"
              >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="supervisor">Supervisor</option>
                <option value="technician">Technician</option>
                <option value="coordinator">Coordinator</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>
          </div>
        )}
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
