import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Calendar,
  Settings,
  FileText,
  Users,
  ShoppingCart,
  Key,
  Bell,
  Building,
  Truck,
  User,
  ClipboardList,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isPropertyOpen, setIsPropertyOpen] = useState(false);
  const [isVisitorsOpen, setIsVisitorsOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-[#1a1a1a] font-semibold text-lg">Synergy</span>
        </div>
        
        <nav className="space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/')
                ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
            }`}
          >
            <Home className="w-5 h-5" />
            Home
          </Link>

          {/* Project Dropdown */}
          <div>
            <button
              onClick={() => setIsProjectOpen(!isProjectOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5" />
                Project
              </div>
              {isProjectOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isProjectOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/projects/fitout-setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/fitout-setup')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Fitout Setup
                </Link>
                <Link
                  to="/projects/fitout-request"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/fitout-request')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Fitout Request
                </Link>
                <Link
                  to="/projects/fitout-checklist"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/fitout-checklist')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Fitout Checklist
                </Link>
                <Link
                  to="/projects/fitout-violation"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/fitout-violation')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Fitout Violation
                </Link>
              </div>
            )}
          </div>

          {/* Maintenance Dropdown */}
          <div>
            <button
              onClick={() => setIsMaintenanceOpen(!isMaintenanceOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                Maintenance
              </div>
              {isMaintenanceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isMaintenanceOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/operational-audit/scheduled"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/operational-audit/scheduled')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Operational Audit
                </Link>
                <Link
                  to="/maintenance/vendor-audit/scheduled"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/vendor-audit/scheduled')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Vendor Audit
                </Link>
                <Link
                  to="/maintenance/incident/setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/incident/setup')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Incident
                </Link>
                <Link
                  to="/maintenance/permit/setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/permit/setup')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Permit
                </Link>
                <Link
                  to="/maintenance/design-insights/list"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/design-insights/list')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Design Insights
                </Link>
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
                <FileText className="w-5 h-5" />
                Finance
              </div>
              {isFinanceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isFinanceOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/finance/material-pr"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/material-pr')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Material PR
                </Link>
                <Link
                  to="/finance/service-pr"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/service-pr')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Service PR
                </Link>
                <Link
                  to="/finance/po"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/po')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  PO
                </Link>
                <Link
                  to="/finance/wo"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/wo')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  WO
                </Link>
                <Link
                  to="/finance/grn"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/grn')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  GRN
                </Link>
                <Link
                  to="/finance/invoices-ses"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/invoices-ses')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Invoices SES
                </Link>
                 <Link
                  to="/finance/pending-approvals"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/pending-approvals')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Pending Approvals
                </Link>
                <Link
                  to="/finance/gdn"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/gdn')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  GDN
                </Link>
                <Link
                  to="/finance/auto-saved-pr"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/auto-saved-pr')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Auto Saved PR
                </Link>
                <Link
                  to="/finance/wbs-element"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/wbs-element')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  WBS Element
                </Link>
                <Link
                  to="/finance/other-bills"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/other-bills')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Other Bills
                </Link>
                <Link
                  to="/finance/accounting"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/accounting')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Accounting
                </Link>
                <Link
                  to="/finance/customer-bills"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/customer-bills')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Customer Bills
                </Link>
                <Link
                  to="/finance/my-bills"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/my-bills')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  My Bills
                </Link>
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
                <Building className="w-5 h-5" />
                Property
              </div>
              {isPropertyOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isPropertyOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/property/space/bookings"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/property/space/bookings')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Space Bookings
                </Link>
                <Link
                  to="/property/booking/setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/property/booking/setup')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Booking Setup
                </Link>
                <Link
                  to="/property/space/seat-type"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/property/space/seat-type')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Seat Type
                </Link>
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
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/visitors/visitors"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/visitors')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Visitors
                </Link>
                <Link
                  to="/visitors/history"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/history')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Visitors History
                </Link>
                <Link
                  to="/visitors/r-vehicles"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/r-vehicles')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Resident Vehicles
                </Link>
                <Link
                  to="/visitors/r-vehicles/history"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/r-vehicles/history')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Resident Vehicles History
                </Link>
                <Link
                  to="/visitors/g-vehicles"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/g-vehicles')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Guest Vehicles
                </Link>
                <Link
                  to="/visitors/staffs"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/staffs')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Staffs
                </Link>
                <Link
                  to="/visitors/materials"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/materials')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Materials
                </Link>
                <Link
                  to="/visitors/patrolling"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/patrolling')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Patrolling
                </Link>
                <Link
                  to="/visitors/patrolling-pending"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/patrolling-pending')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Patrolling Pending
                </Link>
                <Link
                  to="/visitors/goods"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/goods')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Goods In/Out
                </Link>
                <Link
                  to="/visitors/vehicle-parkings"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/vehicle-parkings')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Vehicle Parkings
                </Link>
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
                <Bell className="w-5 h-5" />
                Experience
              </div>
              {isExperienceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isExperienceOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/experience/events"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/events')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Events
                </Link>
                <Link
                  to="/experience/broadcast"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/broadcast')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Broadcast
                </Link>
                <Link
                  to="/experience/business"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/business')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Business Directory
                </Link>
                <Link
                  to="/experience/documents/unit"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/documents/unit')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Unit Documents
                </Link>
                <Link
                  to="/experience/documents/common"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/documents/common')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Common Documents
                </Link>
                 <Link
                  to="/experience/transport/outstation"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/outstation')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Outstation
                </Link>
                 <Link
                  to="/experience/transport/airline"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/airline')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Airline
                </Link>
                 <Link
                  to="/experience/transport/rail"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/rail')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Rail
                </Link>
                 <Link
                  to="/experience/transport/hotel"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/hotel')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Hotel
                </Link>
                 <Link
                  to="/experience/transport/self-travel"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/self-travel')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Self Travel
                </Link>
                 <Link
                  to="/experience/testimonials"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/testimonials')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Testimonials
                </Link>
                 <Link
                  to="/experience/company-partners"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/company-partners')
                      ? 'bg-[#DBC2A9] text-[#1a1a1a] font-medium'
                      : 'text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a]'
                  }`}
                >
                  Company Partners
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
