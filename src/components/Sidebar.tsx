import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import {
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  Users,
  Calendar,
  ClipboardList,
  Building,
  Car,
  Star,
  DollarSign,
  FileText,
  Wrench,
  BarChart3,
  Zap,
  Droplets,
  Recycle,
  BookOpen,
  Gauge,
  TrendingUp,
  Battery,
  Wind,
  ClipboardCheck,
  Trash2
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const { currentSection } = useLayout();
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    maintenance: false,
    visitors: false,
    experience: false,
    finance: false,
    property: false,
    utility: true, // Keep utility expanded by default
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path: string) => location.pathname === path;

  const renderSection = (title: string, items: any[], sectionKey: string) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
        >
          <span>{title}</span>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        {isExpanded && (
          <div className="ml-4 space-y-1">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const utilityItems = [
    { name: 'Energy Meters', path: '/utility/energy-meters', icon: Gauge },
    { name: 'Water', path: '/utility/water', icon: Droplets },
    { name: 'STP', path: '/utility/stp', icon: Recycle },
    { name: 'Daily Readings', path: '/utility/daily-readings', icon: BookOpen },
    { name: 'Consumption', path: '/utility/consumption', icon: TrendingUp },
    { name: 'EV Consumption', path: '/utility/ev-consumption', icon: Battery },
    { name: 'Solar Generator', path: '/utility/solar-generator', icon: Wind },
    { name: 'Utility Request', path: '/utility/utility-request', icon: ClipboardCheck },
    { name: 'Waste Generation', path: '/utility/waste-generation', icon: Trash2 },
  ];

  const maintenanceItems = [
    { name: 'Asset', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Settings },
    { name: 'Supplier', path: '/supplier', icon: Users },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'AMC', path: '/amc', icon: ClipboardList },
    { name: 'Attendance', path: '/attendance', icon: Users },
    { name: 'Survey List', path: '/surveys/list', icon: ClipboardList },
    { name: 'Survey Mapping', path: '/surveys/mapping', icon: ClipboardList },
    { name: 'Survey Response', path: '/surveys/response', icon: ClipboardList },
    { name: 'Tasks', path: '/tasks', icon: ClipboardList },
    { name: 'Vendor', path: '/vendor', icon: Users },
    { name: 'Schedule List', path: '/schedule-list', icon: Calendar },
    { name: 'Task List', path: '/task-list', icon: ClipboardList },
    { name: 'Tickets', path: '/tickets', icon: ClipboardList },
    { name: 'Inactive Assets', path: '/assets/inactive', icon: Building },
  ];

  const visitorsItems = [
    { name: 'Visitors', path: '/visitors/visitors', icon: Users },
    { name: 'History', path: '/visitors/history', icon: ClipboardList },
    { name: 'R-Vehicles', path: '/visitors/r-vehicles', icon: Car },
    { name: 'R-Vehicles History', path: '/visitors/r-vehicles/history', icon: Car },
    { name: 'G-Vehicles', path: '/visitors/g-vehicles', icon: Car },
    { name: 'Staffs', path: '/visitors/staffs', icon: Users },
    { name: 'Materials', path: '/visitors/materials', icon: ClipboardList },
    { name: 'Patrolling', path: '/visitors/patrolling', icon: ClipboardList },
    { name: 'Patrolling Pending', path: '/visitors/patrolling-pending', icon: ClipboardList },
    { name: 'Goods In/Out', path: '/visitors/goods', icon: ClipboardList },
    { name: 'Inwards', path: '/visitors/goods/inwards', icon: ClipboardList },
    { name: 'Outwards', path: '/visitors/goods/outwards', icon: ClipboardList },
    { name: 'Vehicle Parkings', path: '/visitors/vehicle-parkings', icon: Car },
  ];

  const experienceItems = [
    { name: 'Events', path: '/experience/events', icon: Star },
    { name: 'Broadcast', path: '/experience/broadcast', icon: ClipboardList },
    { name: 'Business Directory', path: '/experience/business', icon: Building },
    { name: 'Business Setup', path: '/experience/business/setup', icon: Settings },
    { name: 'Documents Unit', path: '/experience/documents/unit', icon: FileText },
    { name: 'Documents Common', path: '/experience/documents/common', icon: FileText },
    { name: 'Outstation', path: '/experience/transport/outstation', icon: Car },
    { name: 'Airline', path: '/experience/transport/airline', icon: Car },
    { name: 'Rail', path: '/experience/transport/rail', icon: Car },
    { name: 'Hotel', path: '/experience/transport/hotel', icon: Building },
    { name: 'Self Travel', path: '/experience/transport/self-travel', icon: Car },
    { name: 'Testimonials', path: '/experience/testimonials', icon: Star },
    { name: 'Company Partners', path: '/experience/company-partners', icon: Users },
  ];

  const financeItems = [
    { name: 'Material PR', path: '/finance/material-pr', icon: DollarSign },
    { name: 'Service PR', path: '/finance/service-pr', icon: DollarSign },
    { name: 'PO', path: '/finance/po', icon: DollarSign },
    { name: 'WO', path: '/finance/wo', icon: DollarSign },
    { name: 'GRN', path: '/finance/grn', icon: DollarSign },
    { name: 'Invoices SES', path: '/finance/invoices-ses', icon: DollarSign },
    { name: 'Pending Approvals', path: '/finance/pending-approvals', icon: DollarSign },
    { name: 'GDN', path: '/finance/gdn', icon: DollarSign },
    { name: 'GDN Pending Approvals', path: '/finance/gdn/pending-approvals', icon: DollarSign },
    { name: 'Auto Saved PR', path: '/finance/auto-saved-pr', icon: DollarSign },
    { name: 'WBS Element', path: '/finance/wbs-element', icon: DollarSign },
    { name: 'Other Bills', path: '/finance/other-bills', icon: DollarSign },
    { name: 'Accounting', path: '/finance/accounting', icon: DollarSign },
    { name: 'Customer Bills', path: '/finance/customer-bills', icon: DollarSign },
    { name: 'My Bills', path: '/finance/my-bills', icon: DollarSign },
    { name: 'My Parking', path: '/finance/my-parking', icon: Car },
  ];

  const propertyItems = [
    { name: 'Bookings', path: '/property/space/bookings', icon: Calendar },
    { name: 'Booking Setup', path: '/property/booking/setup', icon: Settings },
    { name: 'Seat Type', path: '/property/space/seat-type', icon: ClipboardList },
    { name: 'Parking', path: '/property/parking', icon: Car },
    { name: 'Parking Bookings', path: '/property/parking/bookings', icon: Calendar },
    { name: 'Mailroom Inbound', path: '/property/mailroom/inbound', icon: FileText },
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-800 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {/* Show sections based on current section */}
        {currentSection === 'Maintenance' && renderSection('Maintenance', maintenanceItems, 'maintenance')}
        {currentSection === 'Utility' && renderSection('Utility', utilityItems, 'utility')}
        {currentSection === 'Visitors' && renderSection('Visitors', visitorsItems, 'visitors')}
        {currentSection === 'Experience' && renderSection('Experience', experienceItems, 'experience')}
        {currentSection === 'Finance' && renderSection('Finance', financeItems, 'finance')}
        {currentSection === 'Property' && renderSection('Property', propertyItems, 'property')}
      </nav>
    </div>
  );
};
