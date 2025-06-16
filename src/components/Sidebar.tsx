
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
  ChevronRight, Plus, Search, Filter, Download, Upload
} from 'lucide-react';

const modulesByPackage = {
  'Transitioning': [
    { name: 'Projects', icon: Building, href: '/projects' },
    { name: 'Assets', icon: Package, href: '/assets' },
    { name: 'Fit-out', icon: Wrench, href: '/fitout' },
  ],
  'Maintenance': [
    { name: 'Services', icon: Wrench, href: '/services' },
    { name: 'Supplier', icon: Users, href: '/supplier' },
    { name: 'Schedule', icon: Calendar, href: '/schedule' },
    { name: 'AMC', icon: FileText, href: '/amc' },
    { name: 'Attendance', icon: Clock, href: '/attendance' },
    { name: 'Tasks', icon: CheckSquare, href: '/tasks' },
    { name: 'Vendor', icon: Users, href: '/vendor' },
    { name: 'Operational Audit', icon: Clipboard, href: '/operational-audit', 
      subItems: [
        { name: 'Scheduled', href: '/operational-audit/scheduled' },
        { name: 'Conducted', href: '/operational-audit/conducted' },
        { name: 'Master Checklists', href: '/operational-audit/master-checklists' }
      ]
    },
    { name: 'Vendor Audit', icon: Users, href: '/maintenance/vendor-audit',
      subItems: [
        { name: 'Scheduled', href: '/maintenance/vendor-audit/scheduled' },
        { name: 'Conducted', href: '/maintenance/vendor-audit/conducted' }
      ]
    },
    { name: 'Incident', icon: AlertTriangle, href: '/maintenance/incident',
      subItems: [
        { name: 'Setup', href: '/maintenance/incident/setup' },
        { name: 'List', href: '/maintenance/incident/list' }
      ]
    },
    { name: 'Permit', icon: FileText, href: '/maintenance/permit',
      subItems: [
        { name: 'Setup', href: '/maintenance/permit/setup' },
        { name: 'List', href: '/maintenance/permit/list' },
        { name: 'Pending Approvals', href: '/maintenance/permit/pending-approvals' }
      ]
    },
    { name: 'Design Insights', icon: BarChart3, href: '/maintenance/design-insights',
      subItems: [
        { name: 'List', href: '/maintenance/design-insights/list' },
        { name: 'Setup', href: '/maintenance/design-insights/setup' }
      ]
    }
  ],
  'Finance': [
    { name: 'Material PR', icon: Package, href: '/finance/material-pr' },
    { name: 'Service PR', icon: Wrench, href: '/finance/service-pr' },
    { name: 'PO', icon: FileText, href: '/finance/po' },
    { name: 'WO', icon: Wrench, href: '/finance/wo' },
    { name: 'GRN', icon: Receipt, href: '/finance/grn' },
    { name: 'Invoices SES', icon: Receipt, href: '/finance/invoices-ses' },
    { name: 'Pending Approvals', icon: Clock, href: '/finance/pending-approvals' },
    { name: 'GDN', icon: FileText, href: '/finance/gdn' },
    { name: 'Auto Saved PR', icon: FileText, href: '/finance/auto-saved-pr' },
    { name: 'WBS Element', icon: BarChart3, href: '/finance/wbs-element' },
    { name: 'Other Bills', icon: CreditCard, href: '/finance/other-bills' },
    { name: 'Accounting', icon: Calculator, href: '/finance/accounting' },
    { name: 'Customer Bills', icon: Receipt, href: '/finance/customer-bills' },
    { name: 'My Bills', icon: CreditCard, href: '/finance/my-bills' },
    { name: 'My Parking', icon: Car, href: '/finance/my-parking' }
  ],
  'CRM': [
    { name: 'Customers', icon: Users, href: '/crm/customers' },
    { name: 'FM Users', icon: UserCheck, href: '/crm/fm-users' },
    { name: 'Occupant Users', icon: Users, href: '/crm/occupant-users' }
  ],
  'Utility': [
    { name: 'Energy Meters', icon: Zap, href: '/utility/energy-meters' },
    { name: 'Water', icon: Droplets, href: '/utility/water' },
    { name: 'STP', icon: Database, href: '/utility/stp' },
    { name: 'Daily Readings', icon: Gauge, href: '/utility/daily-readings' },
    { name: 'Consumption', icon: BarChart3, href: '/utility/consumption' },
    { name: 'EV Consumption', icon: Battery, href: '/utility/ev-consumption' },
    { name: 'Solar Generator', icon: Sun, href: '/utility/solar-generator' },
    { name: 'Utility Request', icon: FileText, href: '/utility/utility-request' },
    { name: 'Waste Generation', icon: Trash2, href: '/utility/waste-generation',
      subItems: [
        { name: 'Waste Generation', href: '/utility/waste-generation' },
        { name: 'Setup', href: '/utility/waste-setup' }
      ]
    }
  ],
  'Security': [
    { name: 'Visitors', icon: Users, href: '/visitors/visitors' },
    { name: 'History', icon: Clock, href: '/visitors/history' },
    { name: 'R-Vehicles', icon: Car, href: '/visitors/r-vehicles' },
    { name: 'G-Vehicles', icon: Truck, href: '/visitors/g-vehicles' },
    { name: 'Staffs', icon: Users, href: '/visitors/staffs' },
    { name: 'Materials', icon: Package, href: '/visitors/materials' },
    { name: 'Patrolling', icon: Shield, href: '/visitors/patrolling' },
    { name: 'Goods In/Out', icon: Package, href: '/visitors/goods' },
    { name: 'Vehicle Parkings', icon: Car, href: '/visitors/vehicle-parkings' }
  ],
  'Value Added Services': [
    { name: 'Events', icon: Calendar, href: '/experience/events' },
    { name: 'Broadcast', icon: Bell, href: '/experience/broadcast' },
    { name: 'Business Directory', icon: Building, href: '/experience/business' },
    { name: 'Documents', icon: FileText, href: '/experience/documents',
      subItems: [
        { name: 'Unit', href: '/experience/documents/unit' },
        { name: 'Common', href: '/experience/documents/common' }
      ]
    },
    { name: 'Transport', icon: Car, href: '/experience/transport',
      subItems: [
        { name: 'Outstation', href: '/experience/transport/outstation' },
        { name: 'Airline', href: '/experience/transport/airline' },
        { name: 'Rail', href: '/experience/transport/rail' },
        { name: 'Hotel', href: '/experience/transport/hotel' },
        { name: 'Self Travel', href: '/experience/transport/self-travel' }
      ]
    },
    { name: 'Testimonials', icon: Star, href: '/experience/testimonials' },
    { name: 'Company Partners', icon: Handshake, href: '/experience/company-partners' },
    { name: 'Property', icon: Home, href: '/property',
      subItems: [
        { name: 'Space Bookings', href: '/property/space/bookings' },
        { name: 'Booking Setup', href: '/property/booking/setup' },
        { name: 'Seat Type', href: '/property/space/seat-type' },
        { name: 'Parking', href: '/property/parking' },
        { name: 'Mailroom', href: '/property/mailroom/inbound' }
      ]
    }
  ],
  'Settings': [
    { name: 'Setup', icon: Settings, href: '/setup' }
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
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto">
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
                    className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
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
                          className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
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
