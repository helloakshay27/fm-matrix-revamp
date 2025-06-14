import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText,
  Settings,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Users,
  Calendar,
  Car,
  Archive,
  UserCheck,
  ClipboardList,
  Shield,
  Eye,
  Mail,
  Target,
  BookOpen,
  Receipt,
  Home,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Building2,
  Wrench,
  MapPin,
  Calendar as CalendarIcon,
  DollarSign,
  HeadphonesIcon,
  TicketIcon,
  PlusCircle,
  Hammer,
  FileIcon
} from 'lucide-react';

const maintenanceItems = [
  { name: 'Preventive Maintenance', href: '/maintenance/preventive' },
  { name: 'Corrective Maintenance', href: '/maintenance/corrective' },
  { name: 'Breakdown Maintenance', href: '/maintenance/breakdown' },
  { name: 'Checklist', href: '/maintenance/checklist' },
  { name: 'Vendor Audit Scheduled', href: '/maintenance/vendor-audit/scheduled' },
  { name: 'Vendor Audit Conducted', href: '/maintenance/vendor-audit/conducted' },
  { name: 'Incident Setup', href: '/maintenance/incident/setup' },
  { name: 'Incident List', href: '/maintenance/incident/list' },
  { name: 'Permit Setup', href: '/maintenance/permit/setup' },
  { name: 'Permit List', href: '/maintenance/permit/list' },
  { name: 'Permit Pending Approvals', href: '/maintenance/permit/pending-approvals' },
  { name: 'Design Insights List', href: '/maintenance/design-insights/list' },
  { name: 'Design Insights Setup', href: '/maintenance/design-insights/setup' },
];

const financeItems = [
  { name: 'Material PR', href: '/finance/material-pr' },
  { name: 'Service PR', href: '/finance/service-pr' },
  { name: 'PO', href: '/finance/po' },
  { name: 'WO', href: '/finance/wo' },
  { name: 'GRN', href: '/finance/grn' },
  { name: 'Invoices (SES)', href: '/finance/invoices-ses' },
  { name: 'Pending Approvals', href: '/finance/pending-approvals' },
  { name: 'GDN', href: '/finance/gdn' },
  { name: 'GDN Pending Approvals', href: '/finance/gdn/pending-approvals' },
  { name: 'Auto Saved PR', href: '/finance/auto-saved-pr' },
  { name: 'WBS Element', href: '/finance/wbs-element' },
  { name: 'Other Bills', href: '/finance/other-bills' },
  { name: 'Accounting', href: '/finance/accounting' },
  { name: 'Customer Bills', href: '/finance/customer-bills' },
  { name: 'My Bills', href: '/finance/my-bills' },
];

const propertyItems = [
  { name: 'Space Booking', href: '/property/space/bookings' },
  { name: 'Booking Setup', href: '/property/booking/setup' },
  { name: 'Seat Type', href: '/property/space/seat-type' },
];

const crmItems = [
  { name: 'Clients', href: '/crm/clients' },
  { name: 'Leads', href: '/crm/leads' },
  { name: 'Contacts', href: '/crm/contacts' },
  { name: 'Deals', href: '/crm/deals' },
  { name: 'Campaigns', href: '/crm/campaigns' },
  { name: 'Reports', href: '/crm/reports' },
];

const utilityItems = [
  { name: 'Energy Consumption', href: '/utility/energy-consumption' },
  { name: 'Water Consumption', href: '/utility/water-consumption' },
  { name: 'Waste Management', href: '/utility/waste-management' },
  { name: 'Sustainability Reports', href: '/utility/sustainability-reports' },
];

const visitorItems = [
  { name: 'Visitors', href: '/visitors/visitors' },
  { name: 'History', href: '/visitors/history' },
  { name: 'Registered Vehicles', href: '/visitors/r-vehicles' },
  { name: 'Guest Vehicles', href: '/visitors/g-vehicles' },
  { name: 'Staffs', href: '/visitors/staffs' },
  { name: 'Materials', href: '/visitors/materials' },
  { name: 'Patrolling', href: '/visitors/patrolling' },
  { name: 'Goods In/Out', href: '/visitors/goods' },
  { name: 'Vehicle Parking', href: '/visitors/vehicle-parkings' },
];

const experienceItems = [
  { name: 'Events', href: '/experience/events' },
  { name: 'Broadcast', href: '/experience/broadcast' },
  { name: 'Business Directory', href: '/experience/business' },
  { name: 'Documents', href: '/experience/documents/unit' },
  { name: 'Transport', href: '/experience/transport/outstation' },
  { name: 'Testimonials', href: '/experience/testimonials' },
  { name: 'Company Partners', href: '/experience/company-partners' },
];

export const Sidebar = () => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({
    maintenance: false,
    project: false,
    finance: false,
    property: false,
    crm: false,
    utility: false,
    visitors: false,
    experience: false,
  });

  const isActive = (path: string) => location.pathname === path;

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">FM</span>
        </div>
        
        <nav className="space-y-2">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/') 
                ? 'bg-[#DBC2A9] text-[#1a1a1a]' 
                : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
            }`}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>

          {/* Maintenance Section */}
          <div>
            <button
              onClick={() => toggleDropdown('maintenance')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                Maintenance
              </div>
              {openDropdowns.maintenance ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openDropdowns.maintenance && (
              <div className="ml-8 mt-1 space-y-1">
                {maintenanceItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Project Section with Fitout Pages */}
          <div>
            <button
              onClick={() => toggleDropdown('project')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5" />
                Project
              </div>
              {openDropdowns.project ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openDropdowns.project && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/projects/fitout-setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/fitout-setup')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Fitout Setup
                </Link>
                <Link
                  to="/projects/fitout-request"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/fitout-request')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Fitout Request
                </Link>
                <Link
                  to="/projects/fitout-checklist"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/fitout-checklist')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Fitout Checklist
                </Link>
                <Link
                  to="/projects/fitout-violation"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/fitout-violation')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Fitout Violation
                </Link>
              </div>
            )}
          </div>

          {/* Finance Section */}
          <div>
            <button
              onClick={() => toggleDropdown('finance')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5" />
                Finance
              </div>
              {openDropdowns.finance ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openDropdowns.finance && (
              <div className="ml-8 mt-1 space-y-1">
                {financeItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Property Section */}
          <div>
            <button
              onClick={() => toggleDropdown('property')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5" />
                Property
              </div>
              {openDropdowns.property ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openDropdowns.property && (
              <div className="ml-8 mt-1 space-y-1">
                {propertyItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CRM Section */}
          <div>
            <button
              onClick={() => toggleDropdown('crm')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                CRM
              </div>
              {openDropdowns.crm ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openDropdowns.crm && (
              <div className="ml-8 mt-1 space-y-1">
                {crmItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Utility Section */}
          <div>
            <button
              onClick={() => toggleDropdown('utility')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5" />
                Utility
              </div>
              {openDropdowns.utility ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openDropdowns.utility && (
              <div className="ml-8 mt-1 space-y-1">
                {utilityItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Visitors Section */}
          <div>
            <button
              onClick={() => toggleDropdown('visitors')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5" />
                Visitors
              </div>
              {openDropdowns.visitors ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openDropdowns.visitors && (
              <div className="ml-8 mt-1 space-y-1">
                {visitorItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Experience Section */}
          <div>
            <button
              onClick={() => toggleDropdown('experience')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <HeadphonesIcon className="w-5 h-5" />
                Experience
              </div>
              {openDropdowns.experience ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openDropdowns.experience && (
              <div className="ml-8 mt-1 space-y-1">
                {experienceItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#DBC2A9] text-[#1a1a1a]'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};
