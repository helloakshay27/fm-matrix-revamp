import React, { useState } from 'react';
import { 
  Home,
  Calendar,
  Users,
  Wrench,
  Building,
  Settings,
  CheckSquare,
  AlertTriangle,
  FileText,
  BarChart3,
  Shield,
  ClipboardList,
  Car,
  Megaphone,
  MapPin,
  Plane,
  Train,
  Hotel,
  Receipt,
  Package,
  CreditCard,
  Archive,
  ChevronDown,
  ChevronRight,
  Hammer,
  ClipboardCheck,
  AlertCircle,
  Construction
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const locationItems = [
  { name: 'Account', href: '/setup/location/account' },
  { name: 'Building', href: '/setup/location/building' },
  { name: 'Wing', href: '/setup/location/wing' },
  { name: 'Area', href: '/setup/location/area' },
  { name: 'Floor', href: '/setup/location/floor' },
  { name: 'Unit', href: '/setup/location/unit' },
  { name: 'Room', href: '/setup/location/room' },
];

const userRoleItems = [
  { name: 'Department', href: '/setup/user-role/department' },
  { name: 'Role', href: '/setup/user-role/role' },
];

const ticketItems = [
  { name: 'Setup', href: '/setup/ticket/setup' },
  { name: 'Escalation', href: '/setup/ticket/escalation' },
  { name: 'Cost Approval', href: '/setup/ticket/cost-approval' },
];

const maintenanceItems = [
  { name: 'Vendor Audit', subItems: [
    { name: 'Scheduled', href: '/maintenance/vendor-audit/scheduled' },
    { name: 'Conducted', href: '/maintenance/vendor-audit/conducted' },
  ]},
  { name: 'Incident', subItems: [
    { name: 'Setup', href: '/maintenance/incident/setup' },
    { name: 'List', href: '/maintenance/incident/list' },
  ]},
   { name: 'Permit', subItems: [
    { name: 'Setup', href: '/maintenance/permit/setup' },
    { name: 'List', href: '/maintenance/permit/list' },
    { name: 'Pending Approvals', href: '/maintenance/permit/pending-approvals' },
  ]},
  { name: 'Design Insights', subItems: [
    {name: 'List', href: '/maintenance/design-insights/list'},
    {name: 'Setup', href: '/maintenance/design-insights/setup'}
  ]}
];

const financeItems = [
  { name: 'Material PR', href: '/finance/material-pr' },
  { name: 'Service PR', href: '/finance/service-pr' },
  { name: 'PO', href: '/finance/po' },
  { name: 'WO', href: '/finance/wo' },
  { name: 'GRN', href: '/finance/grn' },
  { name: 'Invoices SES', href: '/finance/invoices-ses' },
  { name: 'Pending Approvals', href: '/finance/pending-approvals' },
  { name: 'GDN', href: '/finance/gdn' },
  { name: 'Auto Saved PR', href: '/finance/auto-saved-pr' },
  { name: 'WBS Element', href: '/finance/wbs-element' },
  { name: 'Other Bills', href: '/finance/other-bills' },
  { name: 'Accounting', href: '/finance/accounting' },
  { name: 'Customer Bills', href: '/finance/customer-bills' },
  { name: 'My Bills', href: '/finance/my-bills' },
];

const propertyItems = [
  { name: 'Space Bookings', href: '/property/space/bookings' },
  { name: 'Booking Setup', href: '/property/booking/setup' },
  { name: 'Seat Type', href: '/property/space/seat-type' },
];

const visitorsItems = [
  { name: 'Visitors', href: '/visitors/visitors' },
  { name: 'R Vehicles', href: '/visitors/r-vehicles' },
  { name: 'G Vehicles', href: '/visitors/g-vehicles' },
  { name: 'Staffs', href: '/visitors/staffs' },
  { name: 'Materials', href: '/visitors/materials' },
  { name: 'Patrolling', href: '/visitors/patrolling' },
  { name: 'Goods', href: '/visitors/goods' },
  { name: 'Vehicle Parkings', href: '/visitors/vehicle-parkings' },
];

const experienceItems = [
  { name: 'Events', href: '/experience/events' },
  { name: 'Broadcast', href: '/experience/broadcast' },
  { name: 'Business', href: '/experience/business' },
  { name: 'Documents', subItems: [
    { name: 'Unit', href: '/experience/documents/unit' },
    { name: 'Common', href: '/experience/documents/common' },
  ]},
  { name: 'Transport', subItems: [
    { name: 'Outstation', href: '/experience/transport/outstation' },
    { name: 'Airline', href: '/experience/transport/airline' },
    { name: 'Rail', href: '/experience/transport/rail' },
    { name: 'Hotel', href: '/experience/transport/hotel' },
    { name: 'Self Travel', href: '/experience/transport/self-travel' },
  ]},
  { name: 'Testimonials', href: '/experience/testimonials' },
  { name: 'Company Partners', href: '/experience/company-partners' },
];

export const Sidebar = () => {
  const location = useLocation();
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isPropertyOpen, setIsPropertyOpen] = useState(false);
  const [isVisitorsOpen, setIsVisitorsOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  return (
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">Project</span>
        </div>
        
        <nav className="space-y-2">
          {/* Services */}
          <Link to="/services" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/services' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <Wrench className="w-5 h-5" />
            Services
          </Link>

          {/* Supplier */}
          <Link to="/supplier" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/supplier' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <Building className="w-5 h-5" />
            Supplier
          </Link>

          {/* Schedule */}
          <Link to="/schedule" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/schedule' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <Calendar className="w-5 h-5" />
            Schedule
          </Link>

          {/* AMC */}
          <Link to="/amc" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/amc' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <FileText className="w-5 h-5" />
            AMC
          </Link>

          {/* Attendance */}
          <Link to="/attendance" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/attendance' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <Users className="w-5 h-5" />
            Attendance
          </Link>

          {/* Fitout Setup */}
          <Link to="/projects/fitout-setup" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/projects/fitout-setup' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <Settings className="w-5 h-5" />
            Fitout Setup
          </Link>

          {/* Fitout Request */}
          <Link to="/projects/fitout-request" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/projects/fitout-request' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <FileText className="w-5 h-5" />
            Fitout Request
          </Link>

          {/* Fitout Checklist */}
          <Link to="/projects/fitout-checklist" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/projects/fitout-checklist' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <ClipboardCheck className="w-5 h-5" />
            Fitout Checklist
          </Link>

          {/* Fitout Violation */}
          <Link to="/projects/fitout-violation" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/projects/fitout-violation' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <AlertCircle className="w-5 h-5" />
            Fitout Violation
          </Link>

          {/* Tasks */}
          <Link to="/tasks" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/tasks' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <CheckSquare className="w-5 h-5" />
            Tasks
          </Link>

          {/* Vendor */}
          <Link to="/vendor" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/vendor' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <Building className="w-5 h-5" />
            Vendor
          </Link>

          {/* Schedule List */}
          <Link to="/schedule-list" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/schedule-list' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <Calendar className="w-5 h-5" />
            Schedule List
          </Link>

          {/* Task List */}
          <Link to="/task-list" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/task-list' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <ClipboardList className="w-5 h-5" />
            Task List
          </Link>

          {/* Tickets */}
          <Link to="/tickets" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/tickets' 
              ? 'bg-[#C72030] text-white' 
              : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
          }`}>
            <FileText className="w-5 h-5" />
            Tickets
          </Link>

          {/* Maintenance Dropdown */}
          <div>
            <button
              onClick={() => setIsMaintenanceOpen(!isMaintenanceOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                Maintenance
              </div>
              {isMaintenanceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isMaintenanceOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {maintenanceItems.map((item) => (
                  item.subItems ? (
                    <div key={item.name}>
                      <div className="font-semibold px-3 py-2">{item.name}</div>
                      <div className="ml-4 space-y-1">
                        {item.subItems.map(subItem => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              location.pathname === subItem.href
                                ? 'bg-[#C72030] text-white'
                                : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        location.pathname === item.href
                          ? 'bg-[#C72030] text-white'
                          : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Finance Dropdown */}
          <div>
            <button
              onClick={() => setIsFinanceOpen(!isFinanceOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" />
                Finance
              </div>
              {isFinanceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isFinanceOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {financeItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === item.href
                        ? 'bg-[#C72030] text-white'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Property Dropdown */}
          <div>
            <button
              onClick={() => setIsPropertyOpen(!isPropertyOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5" />
                Property
              </div>
              {isPropertyOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isPropertyOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {propertyItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === item.href
                        ? 'bg-[#C72030] text-white'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Visitors Dropdown */}
          <div>
            <button
              onClick={() => setIsVisitorsOpen(!isVisitorsOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                Visitors
              </div>
              {isVisitorsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isVisitorsOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {visitorsItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === item.href
                        ? 'bg-[#C72030] text-white'
                        : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Experience Dropdown */}
          <div>
            <button
              onClick={() => setIsExperienceOpen(!isExperienceOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5" />
                Experience
              </div>
              {isExperienceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isExperienceOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {experienceItems.map((item) => (
                  item.subItems ? (
                    <div key={item.name}>
                      <div className="font-semibold px-3 py-2">{item.name}</div>
                      <div className="ml-4 space-y-1">
                        {item.subItems.map(subItem => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              location.pathname === subItem.href
                                ? 'bg-[#C72030] text-white'
                                : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        location.pathname === item.href
                          ? 'bg-[#C72030] text-white'
                          : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};
