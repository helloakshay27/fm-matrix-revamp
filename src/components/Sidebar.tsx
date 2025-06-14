import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Building, 
  Users, 
  Calendar, 
  ClipboardList, 
  UserCheck, 
  FileText, 
  Wrench,
  Car,
  Coffee,
  DollarSign,
  MapPin,
  ChevronDown,
  ChevronRight,
  Hammer,
  ListChecks,
  AlertTriangle
} from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const Sidebar = () => {
  const location = useLocation();
  const { currentSection } = useLayout();
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({
    'fitout-setup': true,
    'operational-audit': false,
    'vendor-audit': false,
    'incident': false,
    'permit': false,
    'design-insights': false,
    'surveys': false,
    'transport': false,
    'documents': false,
    'goods': false,
    'r-vehicles': false,
    'space': false,
    'booking': false,
    'parking': false,
    'mailroom': false,
    'material': false,
    'service': false,
    'finance-other': false,
    'gdn': false,
    'user-role': false,
  });

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const isActive = (path: string) => location.pathname === path;
  const isMenuActive = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  const maintenanceItems = [
    { path: '/services', label: 'Services', icon: Wrench },
    { path: '/supplier', label: 'Supplier', icon: Building },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/amc', label: 'AMC', icon: FileText },
    { path: '/attendance', label: 'Attendance', icon: UserCheck },
    { path: '/tasks', label: 'Tasks', icon: ClipboardList },
    { path: '/vendor', label: 'Vendor', icon: Building },
    { path: '/schedule-list', label: 'Schedule List', icon: Calendar },
    { path: '/task-list', label: 'Task List', icon: ClipboardList },
    { path: '/tickets', label: 'Tickets', icon: FileText },
  ];

  const crmItems = [
    { path: '/crm/customers', label: 'Customers', icon: Users },
    { path: '/crm/fm-users', label: 'FM Users', icon: Users },
    { path: '/crm/occupant-users', label: 'Occupant Users', icon: Users },
  ];

  const visitorsItems = [
    { path: '/visitors/visitors', label: 'Visitors', icon: Users },
    { path: '/visitors/history', label: 'History', icon: Calendar },
    { path: '/visitors/r-vehicles', label: 'R Vehicles', icon: Car },
    { path: '/visitors/r-vehicles/history', label: 'R Vehicles History', icon: Calendar },
    { path: '/visitors/g-vehicles', label: 'G Vehicles', icon: Car },
    { path: '/visitors/staffs', label: 'Staffs', icon: Users },
    { path: '/visitors/materials', label: 'Materials', icon: ClipboardList },
    { path: '/visitors/patrolling', label: 'Patrolling', icon: MapPin },
    { path: '/visitors/patrolling-pending', label: 'Patrolling Pending', icon: MapPin },
    { path: '/visitors/goods', label: 'Goods', icon: ClipboardList },
    { path: '/visitors/goods/inwards', label: 'Inwards', icon: ClipboardList },
    { path: '/visitors/goods/outwards', label: 'Outwards', icon: ClipboardList },
    { path: '/visitors/vehicle-parkings', label: 'Vehicle Parkings', icon: Car },
  ];

  const experienceItems = [
    { path: '/experience/events', label: 'Events', icon: Coffee },
    { path: '/experience/broadcast', label: 'Broadcast', icon: ClipboardList },
    { path: '/experience/business', label: 'Business Directory', icon: Building },
    { path: '/experience/business/setup', label: 'Business Setup', icon: Settings },
    { path: '/experience/documents/unit', label: 'Documents Unit', icon: FileText },
    { path: '/experience/documents/common', label: 'Documents Common', icon: FileText },
    { path: '/experience/transport/outstation', label: 'Outstation', icon: Car },
    { path: '/experience/transport/airline', label: 'Airline', icon: Car },
    { path: '/experience/transport/rail', label: 'Rail', icon: Car },
    { path: '/experience/transport/hotel', label: 'Hotel', icon: Coffee },
    { path: '/experience/transport/self-travel', label: 'Self Travel', icon: Car },
    { path: '/experience/testimonials', label: 'Testimonials Setup', icon: Users },
    { path: '/experience/company-partners', label: 'Company Partners Setup', icon: Users },
  ];

  const financeItems = [
    { path: '/finance/material-pr', label: 'Material PR', icon: ClipboardList },
    { path: '/finance/service-pr', label: 'Service PR', icon: ClipboardList },
    { path: '/finance/po', label: 'PO', icon: ClipboardList },
    { path: '/finance/wo', label: 'WO', icon: ClipboardList },
    { path: '/finance/grn', label: 'GRN', icon: ClipboardList },
    { path: '/finance/invoices-ses', label: 'Invoices SES', icon: ClipboardList },
    { path: '/finance/pending-approvals', label: 'Pending Approvals', icon: ClipboardList },
    { path: '/finance/gdn', label: 'GDN', icon: ClipboardList },
    { path: '/finance/auto-saved-pr', label: 'Auto Saved PR', icon: ClipboardList },
    { path: '/finance/wbs-element', label: 'WBS Element', icon: ClipboardList },
    { path: '/finance/other-bills', label: 'Other Bills', icon: ClipboardList },
    { path: '/finance/accounting', label: 'Accounting', icon: DollarSign },
    { path: '/finance/customer-bills', label: 'Customer Bills', icon: ClipboardList },
    { path: '/finance/my-bills', label: 'My Bills', icon: ClipboardList },
    { path: '/finance/my-parking', label: 'My Parking', icon: Car },
  ];

  const propertyItems = [
    { path: '/property/space/bookings', label: 'Bookings', icon: Calendar },
    { path: '/property/booking/setup', label: 'Booking Setup', icon: Settings },
    { path: '/property/space/seat-type', label: 'Seat Type', icon: ClipboardList },
    { path: '/property/parking', label: 'Parking', icon: Car },
    { path: '/property/parking/bookings', label: 'Parking Bookings', icon: Calendar },
    { path: '/property/mailroom/inbound', label: 'Mailroom Inbound', icon: ClipboardList },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'Maintenance':
        return (
          <>
            {maintenanceItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}

            {/* Operational Audit Submenu */}
            <Collapsible
              open={expandedMenus['operational-audit']}
              onOpenChange={() => toggleMenu('operational-audit')}
            >
              <CollapsibleTrigger className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                isMenuActive(['/operational-audit'])
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                <div className="flex items-center">
                  <ClipboardList className="mr-3 h-5 w-5" />
                  Operational Audit
                </div>
                {expandedMenus['operational-audit'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 space-y-1">
                <Link
                  to="/operational-audit/scheduled"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/operational-audit/scheduled')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Scheduled
                </Link>
                <Link
                  to="/operational-audit/conducted"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/operational-audit/conducted')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Conducted
                </Link>
                <Link
                  to="/operational-audit/master-checklists"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/operational-audit/master-checklists')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Master Checklists
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* Vendor Audit Submenu */}
            <Collapsible
              open={expandedMenus['vendor-audit']}
              onOpenChange={() => toggleMenu('vendor-audit')}
            >
              <CollapsibleTrigger className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                isMenuActive(['/maintenance/vendor-audit'])
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                <div className="flex items-center">
                  <Building className="mr-3 h-5 w-5" />
                  Vendor Audit
                </div>
                {expandedMenus['vendor-audit'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 space-y-1">
                <Link
                  to="/maintenance/vendor-audit/scheduled"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/maintenance/vendor-audit/scheduled')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Scheduled
                </Link>
                <Link
                  to="/maintenance/vendor-audit/conducted"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/maintenance/vendor-audit/conducted')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Conducted
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* Incident Submenu */}
            <Collapsible
              open={expandedMenus['incident']}
              onOpenChange={() => toggleMenu('incident')}
            >
              <CollapsibleTrigger className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                isMenuActive(['/maintenance/incident'])
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                <div className="flex items-center">
                  <AlertTriangle className="mr-3 h-5 w-5" />
                  Incident
                </div>
                {expandedMenus['incident'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 space-y-1">
                <Link
                  to="/maintenance/incident/setup"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/maintenance/incident/setup')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Setup
                </Link>
                <Link
                  to="/maintenance/incident/list"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/maintenance/incident/list')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  List
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* Permit Submenu */}
            <Collapsible
              open={expandedMenus['permit']}
              onOpenChange={() => toggleMenu('permit')}
            >
              <CollapsibleTrigger className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                isMenuActive(['/maintenance/permit'])
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                <div className="flex items-center">
                  <FileText className="mr-3 h-5 w-5" />
                  Permit
                </div>
                {expandedMenus['permit'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 space-y-1">
                <Link
                  to="/maintenance/permit/setup"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/maintenance/permit/setup')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Setup
                </Link>
                <Link
                  to="/maintenance/permit/list"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/maintenance/permit/list')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  List
                </Link>
                <Link
                  to="/maintenance/permit/pending-approvals"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/maintenance/permit/pending-approvals')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Pending Approvals
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* Design Insights Submenu */}
            <Collapsible
              open={expandedMenus['design-insights']}
              onOpenChange={() => toggleMenu('design-insights')}
            >
              <CollapsibleTrigger className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                isMenuActive(['/maintenance/design-insights'])
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                <div className="flex items-center">
                  <FileText className="mr-3 h-5 w-5" />
                  Design Insights
                </div>
                {expandedMenus['design-insights'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 space-y-1">
                <Link
                  to="/maintenance/design-insights/list"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/maintenance/design-insights/list')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  List
                </Link>
                <Link
                  to="/maintenance/design-insights/setup"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/maintenance/design-insights/setup')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Setup
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/* Surveys Submenu */}
            <Collapsible
              open={expandedMenus['surveys']}
              onOpenChange={() => toggleMenu('surveys')}
            >
              <CollapsibleTrigger className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                isMenuActive(['/surveys'])
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                <div className="flex items-center">
                  <ClipboardList className="mr-3 h-5 w-5" />
                  Surveys
                </div>
                {expandedMenus['surveys'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 space-y-1">
                <Link
                  to="/surveys/list"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/surveys/list')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Survey List
                </Link>
                <Link
                  to="/surveys/mapping"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/surveys/mapping')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Survey Mapping
                </Link>
                <Link
                  to="/surveys/response"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/surveys/response')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Survey Response
                </Link>
              </CollapsibleContent>
            </Collapsible>

            <Link
              to="/assets/inactive"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive('/assets/inactive')
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Building className="mr-3 h-5 w-5" />
              In-Active Assets
            </Link>
          </>
        );

      case 'Project':
        return (
          <>
            {/* Fitout Setup Submenu */}
            <Collapsible
              open={expandedMenus['fitout-setup']}
              onOpenChange={() => toggleMenu('fitout-setup')}
            >
              <CollapsibleTrigger className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                isMenuActive(['/projects/fitout-setup', '/fitout'])
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
                <div className="flex items-center">
                  <Hammer className="mr-3 h-5 w-5" />
                  Fitout Setup
                </div>
                {expandedMenus['fitout-setup'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 space-y-1">
                <Link
                  to="/projects/fitout-setup"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/projects/fitout-setup')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Fitout Setup
                </Link>
                <Link
                  to="/fitout/request-list"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/fitout/request-list')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Fitout Request
                </Link>
                <Link
                  to="/fitout/checklist"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/fitout/checklist')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Fitout Checklist
                </Link>
                <Link
                  to="/fitout/violation"
                  className={`block px-4 py-2 text-sm rounded-md ${
                    isActive('/fitout/violation')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Fitout Violation
                </Link>
              </CollapsibleContent>
            </Collapsible>
          </>
        );

      case 'CRM':
        return (
          <>
            {crmItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </>
        );

      case 'Visitors':
        return (
          <>
            {visitorsItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </>
        );

      case 'Experience':
        return (
          <>
            {experienceItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </>
        );

      case 'Finance':
        return (
          <>
            {financeItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </>
        );

      case 'Property':
        return (
          <>
            {propertyItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <Link to="/" className="flex items-center text-lg font-bold">
          <Home className="mr-2 h-6 w-6" />
          Dashboard
        </Link>
      </div>
      
      <nav className="space-y-2">
        {renderSection()}
      </nav>
    </div>
  );
};

export default Sidebar;
