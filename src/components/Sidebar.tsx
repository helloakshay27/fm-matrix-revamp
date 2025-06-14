import React, { useState } from 'react';
import { 
  Home, 
  Wrench, 
  Package, 
  Users, 
  Calendar, 
  ClipboardList, 
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Building,
  UserCheck,
  Car,
  MapPin,
  Zap,
  Recycle,
  Eye,
  Coffee,
  BookOpen,
  Truck,
  MessageSquare,
  Target,
  Space,
  Mail,
  DollarSign,
  Receipt,
  CreditCard,
  Banknote,
  History,
  UserX,
  Boxes,
  Shield,
  Search,
  UserCog
} from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';

const maintenanceItems = [
  { name: 'Asset', icon: Package, href: '/', current: window.location.pathname === '/' },
  { name: 'AMC', icon: Wrench, href: '/amc', current: window.location.pathname === '/amc' },
  { name: 'Services', icon: Settings, href: '/services', current: window.location.pathname === '/services' },
];

const surveyItems = [
  { name: 'Survey List', href: '/surveys/list' },
  { name: 'Mapping', href: '/surveys/mapping' },
  { name: 'Response', href: '/surveys/response' },
];

const operationalAuditItems = [
  { name: 'Scheduled', href: '/operational-audit/scheduled' },
  { name: 'Conducted', href: '/operational-audit/conducted' },
  { name: 'Master Checklists', href: '/operational-audit/master-checklists' },
];

const projectItems = [
  { name: 'Projects', href: '/projects' },
  { name: 'Add Project', href: '/projects/add' },
];

const crmItems = [
  { name: 'Customers', href: '/crm/customers' },
  { name: 'FM Users', href: '/crm/fm-users' },
  { name: 'Occupant Users', href: '/crm/occupant-users' },
];

const utilityItems = [
  { name: 'Dashboard', href: '/utility/dashboard' },
  { name: 'Energy Meters', href: '/utility/energy-meters' },
  { name: 'Daily Readings', href: '/utility/daily-readings' },
  { name: 'Utility Consumption', href: '/utility/consumption' },
  { name: 'Utility Request', href: '/utility/request' },
];

const wasteGenerationItems = [
  { name: 'Waste Generation', href: '/utility/waste-generation' },
  { name: 'Setup', href: '/utility/waste-setup' },
];

const visitorsItems = [
  { name: 'Visitors', href: '/visitors/visitors', icon: Eye },
  { name: 'Visitors History', href: '/visitors/history', icon: History },
  { name: 'R Vehicles', href: '/visitors/r-vehicles', icon: Car },
  { name: 'G Vehicles', href: '/visitors/g-vehicles', icon: Car },
  { name: 'Staffs', href: '/visitors/staffs', icon: Users },
  { name: 'Materials', href: '/visitors/materials', icon: Boxes },
  { name: 'Patrolling', href: '/visitors/patrolling', icon: Shield },
  { name: 'Patrolling Pending Approvals', href: '/visitors/patrolling-pending', icon: UserX },
  { name: 'Goods In/Out', href: '/visitors/goods', icon: Package },
];

const rVehiclesSubItems = [
  { name: 'All', href: '/visitors/r-vehicles' },
  { name: 'History', href: '/visitors/r-vehicles/history' },
];

const goodsInOutSubItems = [
  { name: 'Inwards', href: '/visitors/goods/inwards' },
  { name: 'Outwards', href: '/visitors/goods/outwards' },
];

const experienceItems = [
  { name: 'Events', href: '/experience/events' },
  { name: 'Broadcast', href: '/experience/broadcast' },
];

const documentsItems = [
  { name: 'Unit Related', href: '/experience/documents/unit' },
  { name: 'Common', href: '/experience/documents/common' },
];

const transportItems = [
  { name: 'Outstation', href: '/experience/transport/outstation' },
  { name: 'Airline', href: '/experience/transport/airline' },
  { name: 'Rail', href: '/experience/transport/rail' },
  { name: 'Hotel', href: '/experience/transport/hotel' },
];

const selfTravelItems = [
  { name: 'Self Travel Option 1', href: '/experience/transport/self-1' },
  { name: 'Self Travel Option 2', href: '/experience/transport/self-2' },
];

const communityModulesItems = [
  { name: 'Testimonials Setup', href: '/experience/community/testimonials' },
  { name: 'Company Partners Setup', href: '/experience/community/partners' },
  { name: 'Banners Setup', href: '/experience/community/banners' },
  { name: 'Groups and Channel Config', href: '/experience/community/groups' },
  { name: 'Amenities Setup', href: '/experience/community/amenities' },
];

const centreSetupItems = [
  { name: 'Centre Setup Option 1', href: '/experience/community/centre-1' },
  { name: 'Centre Setup Option 2', href: '/experience/community/centre-2' },
];

const propertySpaceItems = [
  { name: 'Bookings', href: '/property/space/bookings' },
  { name: 'Seat Requests', href: '/property/space/seat-requests' },
];

const propertySpaceSetupItems = [
  { name: 'Space Setup Option 1', href: '/property/space/setup-1' },
  { name: 'Space Setup Option 2', href: '/property/space/setup-2' },
];

const propertyBookingItems = [
  { name: 'Setup', href: '/property/booking/setup' },
];

const propertyMailroomItems = [
  { name: 'Inbound', href: '/property/mailroom/inbound' },
  { name: 'Outbound', href: '/property/mailroom/outbound' },
];

const propertyParkingSetupItems = [
  { name: 'Tag', href: '/property/parking/tag' },
  { name: 'Parking Categories', href: '/property/parking/categories' },
  { name: 'Parking Configurations', href: '/property/parking/configurations' },
  { name: 'Parking Slots', href: '/property/parking/slots' },
];

const financeItems = [
  { name: 'Material PR', href: '/finance/material-pr' },
  { name: 'Service PR', href: '/finance/service-pr' },
  { name: 'PO', href: '/finance/po' },
  { name: 'WO', href: '/finance/wo' },
  { name: 'GRN', href: '/finance/grn' },
  { name: 'Invoices/SES', href: '/finance/invoices-ses' },
  { name: 'Pending Approvals', href: '/finance/pending-approvals' },
];

const gdnItems = [
  { name: 'GDN', href: '/finance/gdn' },
  { name: 'Pending Approvals', href: '/finance/pending-approvals-2' },
];

const remainingFinanceItems = [
  { name: 'Auto Saved PR', href: '/finance/auto-saved-pr' },
  { name: 'WBS Element', href: '/finance/wbs-element' },
  { name: 'Other Bills', href: '/finance/other-bills' },
  { name: 'Accounting', href: '/finance/accounting' },
  { name: 'Customer Bills', href: '/finance/customer-bills' },
  { name: 'My Bills', href: '/finance/my-bills' },
];

const vendorAuditItems = [
  { name: 'Scheduled', href: '/vendor-audit/scheduled' },
  { name: 'Conducted', href: '/vendor-audit/conducted' },
];

export const Sidebar = () => {
  const { currentSection } = useLayout();
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isOperationalAuditOpen, setIsOperationalAuditOpen] = useState(false);
  const [isVendorAuditOpen, setIsVendorAuditOpen] = useState(false);
  const [isWasteGenerationOpen, setIsWasteGenerationOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isSelfTravelOpen, setIsSelfTravelOpen] = useState(false);
  const [isCommunityModulesOpen, setIsCommunityModulesOpen] = useState(false);
  const [isCentreSetupOpen, setIsCentreSetupOpen] = useState(false);
  const [isSpaceOpen, setIsSpaceOpen] = useState(false);
  const [isSpaceSetupOpen, setIsSpaceSetupOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMailroomOpen, setIsMailroomOpen] = useState(false);
  const [isParkingSetupOpen, setIsParkingSetupOpen] = useState(false);
  const [isGrnOpen, setIsGrnOpen] = useState(false);
  const [isGdnOpen, setIsGdnOpen] = useState(false);
  const [isRVehiclesOpen, setIsRVehiclesOpen] = useState(false);
  const [isGoodsInOutOpen, setIsGoodsInOutOpen] = useState(false);

  const currentPath = window.location.pathname;

  const renderNavigationItems = () => {
    switch (currentSection) {
      case 'Maintenance':
        return (
          <nav className="space-y-2">
            {/* Maintenance Items */}
            {maintenanceItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-[#C72030] text-white'
                    : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </a>
            ))}
            
            {/* Operational Audit Dropdown */}
            <div>
              <button
                onClick={() => setIsOperationalAuditOpen(!isOperationalAuditOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5" />
                  Operational Audit
                </div>
                {isOperationalAuditOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isOperationalAuditOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {operationalAuditItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Vendor Audit Dropdown */}
            <div>
              <button
                onClick={() => setIsVendorAuditOpen(!isVendorAuditOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <UserCog className="w-5 h-5" />
                  Vendor Audit
                </div>
                {isVendorAuditOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isVendorAuditOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {vendorAuditItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            {/* Survey Dropdown */}
            <div>
              <button
                onClick={() => setIsSurveyOpen(!isSurveyOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5" />
                  Surveys
                </div>
                {isSurveyOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isSurveyOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {surveyItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Other Maintenance Items */}
            <a href="/attendance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <Users className="w-5 h-5" />
              Attendance
            </a>
            <a href="/inventory" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <Package className="w-5 h-5" />
              Inventory
            </a>
            <a href="/inventory-consumption" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <Package className="w-5 h-5" />
              Inventory Consumption
            </a>
            <a href="/eco-friendly" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <Recycle className="w-5 h-5" />
              Eco-Friendly
            </a>
            <a href="/vendor" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <Building className="w-5 h-5" />
              Vendor
            </a>
            <a href="/schedule" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <Calendar className="w-5 h-5" />
              Schedule
            </a>
            <a href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <ClipboardList className="w-5 h-5" />
              Tasks
            </a>
            <a href="/tickets" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <FileText className="w-5 h-5" />
              Tickets
            </a>
          </nav>
        );

      case 'Project':
        return (
          <nav className="space-y-2">
            {projectItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <Building className="w-5 h-5" />
                {item.name}
              </a>
            ))}
          </nav>
        );

      case 'CRM':
        return (
          <nav className="space-y-2">
            {crmItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <Users className="w-5 h-5" />
                {item.name}
              </a>
            ))}
          </nav>
        );

      case 'Utility':
        return (
          <nav className="space-y-2">
            {utilityItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <Zap className="w-5 h-5" />
                {item.name}
              </a>
            ))}
            
            {/* Waste Generation Dropdown */}
            <div>
              <button
                onClick={() => setIsWasteGenerationOpen(!isWasteGenerationOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <Recycle className="w-5 h-5" />
                  Waste Generation
                </div>
                {isWasteGenerationOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isWasteGenerationOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {wasteGenerationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>
        );

      case 'Visitors':
        return (
          <nav className="space-y-2">
            {visitorsItems.map((item) => {
              const isActive = currentPath === item.href;
              
              // Special handling for R Vehicles with dropdown
              if (item.name === 'R Vehicles') {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsRVehiclesOpen(!isRVehiclesOpen)}
                      className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive || currentPath.startsWith('/visitors/r-vehicles')
                          ? 'bg-[#C72030] text-white'
                          : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </div>
                      {isRVehiclesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {isRVehiclesOpen && (
                      <div className="ml-8 mt-1 space-y-1">
                        {rVehiclesSubItems.map((subItem) => {
                          const isSubActive = currentPath === subItem.href;
                          return (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                isSubActive
                                  ? 'bg-[#C72030] text-white'
                                  : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                              }`}
                            >
                              {subItem.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Special handling for Goods In/Out with dropdown
              if (item.name === 'Goods In/Out') {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsGoodsInOutOpen(!isGoodsInOutOpen)}
                      className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive || currentPath.startsWith('/visitors/goods')
                          ? 'bg-[#C72030] text-white'
                          : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </div>
                      {isGoodsInOutOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {isGoodsInOutOpen && (
                      <div className="ml-8 mt-1 space-y-1">
                        {goodsInOutSubItems.map((subItem) => {
                          const isSubActive = currentPath === subItem.href;
                          return (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                isSubActive
                                  ? 'bg-[#C72030] text-white'
                                  : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                              }`}
                            >
                              {subItem.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C72030] text-white'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>
        );

      case 'Experience':
        return (
          <nav className="space-y-2">
            {experienceItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <Coffee className="w-5 h-5" />
                {item.name}
              </a>
            ))}
            
            {/* Documents Dropdown */}
            <div>
              <button
                onClick={() => setIsDocumentsOpen(!isDocumentsOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  Documents
                </div>
                {isDocumentsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isDocumentsOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {documentsItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/experience/business" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <Building className="w-5 h-5" />
              Business
            </a>

            {/* Transport Dropdown */}
            <div>
              <button
                onClick={() => setIsTransportOpen(!isTransportOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5" />
                  Transport
                </div>
                {isTransportOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isTransportOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {transportItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  {/* Self Travel Dropdown */}
                  <div>
                    <button
                      onClick={() => setIsSelfTravelOpen(!isSelfTravelOpen)}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      <span>Self Travel</span>
                      {isSelfTravelOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                    {isSelfTravelOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {selfTravelItems.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="block px-3 py-2 rounded-lg text-xs transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Community Modules Dropdown */}
            <div>
              <button
                onClick={() => setIsCommunityModulesOpen(!isCommunityModulesOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  Community Modules
                </div>
                {isCommunityModulesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isCommunityModulesOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {communityModulesItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  {/* Centre Setup Dropdown */}
                  <div>
                    <button
                      onClick={() => setIsCentreSetupOpen(!isCentreSetupOpen)}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      <span>Centre Setup</span>
                      {isCentreSetupOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                    {isCentreSetupOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {centreSetupItems.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="block px-3 py-2 rounded-lg text-xs transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <a href="/experience/setup" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <Settings className="w-5 h-5" />
              Setup
            </a>
          </nav>
        );

      case 'Finance':
        return (
          <nav className="space-y-2">
            {/* Basic Finance Items including GRN, Invoices/SES, Pending Approvals */}
            {financeItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <DollarSign className="w-5 h-5" />
                {item.name}
              </a>
            ))}

            {/* GDN Dropdown */}
            <div>
              <button
                onClick={() => setIsGdnOpen(!isGdnOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  GDN
                </div>
                {isGdnOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isGdnOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {gdnItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Remaining Finance Items */}
            {remainingFinanceItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <DollarSign className="w-5 h-5" />
                {item.name}
              </a>
            ))}
          </nav>
        );

      case 'Property':
        return (
          <nav className="space-y-2">
            {/* Space Dropdown */}
            <div>
              <button
                onClick={() => setIsSpaceOpen(!isSpaceOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <Space className="w-5 h-5" />
                  Space
                </div>
                {isSpaceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isSpaceOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {propertySpaceItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  {/* Setup Dropdown */}
                  <div>
                    <button
                      onClick={() => setIsSpaceSetupOpen(!isSpaceSetupOpen)}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      <span>Setup</span>
                      {isSpaceSetupOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                    {isSpaceSetupOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {propertySpaceSetupItems.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="block px-3 py-2 rounded-lg text-xs transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Dropdown */}
            <div>
              <button
                onClick={() => setIsBookingOpen(!isBookingOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  Booking
                </div>
                {isBookingOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isBookingOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {propertyBookingItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Mailroom Dropdown */}
            <div>
              <button
                onClick={() => setIsMailroomOpen(!isMailroomOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  Mailroom
                </div>
                {isMailroomOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isMailroomOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {propertyMailroomItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/property/parking" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]">
              <Car className="w-5 h-5" />
              Parking
            </a>

            {/* Setup Dropdown */}
            <div>
              <button
                onClick={() => setIsParkingSetupOpen(!isParkingSetupOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Setup
                </div>
                {isParkingSetupOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isParkingSetupOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {propertyParkingSetupItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>
        );

      default:
        return (
          <nav className="space-y-2">
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              Select a section from the header to view navigation options
            </div>
          </nav>
        );
    }
  };

  return (
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">FacilityPro</span>
        </div>
        
        {renderNavigationItems()}
      </div>
    </div>
  );
};
