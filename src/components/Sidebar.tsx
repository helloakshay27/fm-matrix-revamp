import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight,
  Home,
  Building2,
  Wrench,
  DollarSign,
  Users,
  MapPin,
  Sparkles,
  Building,
  Calendar,
  ClipboardList,
  UserCheck,
  FileText,
  ClipboardCheck,
  Eye,
  AlertTriangle,
  Shield,
  Clipboard,
  TrendingUp,
  Car,
  User,
  Package,
  Route,
  Truck,
  Mail,
  FileImage,
  Bus,
  Plane,
  Train,
  Hotel,
  Settings
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    maintenance: true,
    finance: false,
    property: false,
    visitors: false,
    experience: false,
    crm: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-[#1a1a1a] text-white fixed left-0 top-16 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-1">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            Asset Dashboard
          </Link>

          {/* CRM Section */}
          <div>
            <button
              onClick={() => toggleSection('crm')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                CRM
              </div>
              {expandedSections.crm ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.crm && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/crm/customer"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/crm/customer') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Customer
                </Link>
                <Link
                  to="/crm/fm-users"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/crm/fm-users') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  FM Users
                </Link>
                <Link
                  to="/crm/occupant-users"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/crm/occupant-users') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Occupant Users
                </Link>
              </div>
            )}
          </div>

          {/* Maintenance Section */}
          <div>
            <button
              onClick={() => toggleSection('maintenance')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                Maintenance
              </div>
              {expandedSections.maintenance ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.maintenance && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/services"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/services') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Services
                </Link>
                <Link
                  to="/supplier"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/supplier') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Supplier
                </Link>
                <Link
                  to="/schedule"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/schedule') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Schedule
                </Link>
                <Link
                  to="/amc"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/amc') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  AMC
                </Link>
                <Link
                  to="/attendance"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/attendance') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Attendance
                </Link>
                <Link
                  to="/tasks"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/tasks') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Tasks
                </Link>
                <Link
                  to="/vendor"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/vendor') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Vendor
                </Link>
                <Link
                  to="/schedule-list"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/schedule-list') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Schedule List
                </Link>
                <Link
                  to="/task-list"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/task-list') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Task List
                </Link>
                <Link
                  to="/tickets"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/tickets') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Tickets
                </Link>
                <Link
                  to="/operational-audit/scheduled"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/operational-audit/scheduled') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Operational Audit (Scheduled)
                </Link>
                <Link
                  to="/operational-audit/conducted"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/operational-audit/conducted') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Operational Audit (Conducted)
                </Link>
                <Link
                  to="/operational-audit/master-checklists"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/operational-audit/master-checklists') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Master Checklists
                </Link>
                <Link
                  to="/maintenance/vendor-audit/scheduled"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/vendor-audit/scheduled') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Vendor Audit (Scheduled)
                </Link>
                <Link
                  to="/maintenance/vendor-audit/conducted"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/vendor-audit/conducted') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Vendor Audit (Conducted)
                </Link>
                <Link
                  to="/maintenance/incident/setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/incident/setup') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Incident Setup
                </Link>
                <Link
                  to="/maintenance/incident/list"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/incident/list') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Incident List
                </Link>
                <Link
                  to="/maintenance/permit/setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/permit/setup') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Permit Setup
                </Link>
                <Link
                  to="/maintenance/permit/list"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/permit/list') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Permit List
                </Link>
                <Link
                  to="/maintenance/permit/pending-approvals"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/permit/pending-approvals') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Permit Pending Approvals
                </Link>
                <Link
                  to="/maintenance/design-insights/list"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/design-insights/list') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Design Insights
                </Link>
                <Link
                  to="/maintenance/design-insights/setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/maintenance/design-insights/setup') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Design Insights Setup
                </Link>
                <Link
                  to="/surveys/list"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/surveys/list') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Survey List
                </Link>
                <Link
                  to="/surveys/mapping"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/surveys/mapping') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Survey Mapping
                </Link>
                <Link
                  to="/surveys/response"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/surveys/response') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Survey Response
                </Link>
                <Link
                  to="/assets/inactive"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/assets/inactive') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Inactive Assets
                </Link>
              </div>
            )}
          </div>

          {/* Finance Section */}
          <div>
            <button
              onClick={() => toggleSection('finance')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5" />
                Finance
              </div>
              {expandedSections.finance ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.finance && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/projects"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Projects
                </Link>
                <Link
                  to="/projects/fitout-setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/fitout-setup') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Fitout Setup
                </Link>
                <Link
                  to="/projects/add"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/projects/add') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Add Project
                </Link>
                <Link
                  to="/finance/material-pr"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/material-pr') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Material PR
                </Link>
                <Link
                  to="/finance/material-pr/add"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/material-pr/add') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Add Material PR
                </Link>
                <Link
                  to="/finance/service-pr"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/service-pr') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Service PR
                </Link>
                <Link
                  to="/finance/service-pr/add"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/service-pr/add') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Add Service PR
                </Link>
                <Link
                  to="/finance/po"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/po') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  PO
                </Link>
                <Link
                  to="/finance/po/add"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/po/add') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Add PO
                </Link>
                <Link
                  to="/finance/wo"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/wo') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  WO
                </Link>
                <Link
                  to="/finance/grn"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/grn') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  GRN
                </Link>
                <Link
                  to="/finance/grn/add"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/grn/add') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Add GRN
                </Link>
                <Link
                  to="/finance/invoices-ses"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/invoices-ses') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Invoices SES
                </Link>
                <Link
                  to="/finance/pending-approvals"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/pending-approvals') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Pending Approvals
                </Link>
                <Link
                  to="/finance/gdn"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/gdn') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  GDN
                </Link>
                <Link
                  to="/finance/gdn/pending-approvals"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/gdn/pending-approvals') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  GDN Pending Approvals
                </Link>
                <Link
                  to="/finance/auto-saved-pr"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/auto-saved-pr') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Auto Saved PR
                </Link>
                <Link
                  to="/finance/wbs-element"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/wbs-element') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  WBS Element
                </Link>
                <Link
                  to="/finance/other-bills"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/other-bills') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Other Bills
                </Link>
                <Link
                  to="/finance/other-bills/add"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/other-bills/add') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Add New Bill
                </Link>
                <Link
                  to="/finance/accounting"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/accounting') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Accounting
                </Link>
                <Link
                  to="/finance/customer-bills"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/customer-bills') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Customer Bills
                </Link>
                <Link
                  to="/finance/my-bills"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/finance/my-bills') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  My Bills
                </Link>
              </div>
            )}
          </div>

          {/* Property Section */}
          <div>
            <button
              onClick={() => toggleSection('property')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5" />
                Property
              </div>
              {expandedSections.property ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.property && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/property/space/bookings"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/property/space/bookings') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Bookings
                </Link>
                <Link
                  to="/property/booking/setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/property/booking/setup') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Booking Setup
                </Link>
                <Link
                  to="/property/space/seat-type"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/property/space/seat-type') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Seat Type
                </Link>
              </div>
            )}
          </div>

          {/* Visitors Section */}
          <div>
            <button
              onClick={() => toggleSection('visitors')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                Visitors
              </div>
              {expandedSections.visitors ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.visitors && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/visitors/visitors"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/visitors') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Visitors
                </Link>
                <Link
                  to="/visitors/history"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/history') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Visitors History
                </Link>
                <Link
                  to="/visitors/r-vehicles"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/r-vehicles') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  R Vehicles
                </Link>
                <Link
                  to="/visitors/r-vehicles/history"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/r-vehicles/history') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  R Vehicles History
                </Link>
                <Link
                  to="/visitors/g-vehicles"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/g-vehicles') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  G Vehicles
                </Link>
                <Link
                  to="/visitors/staffs"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/staffs') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Staffs
                </Link>
                <Link
                  to="/visitors/materials"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/materials') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Materials
                </Link>
                <Link
                  to="/visitors/patrolling"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/patrolling') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Patrolling
                </Link>
                <Link
                  to="/visitors/patrolling-pending"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/patrolling-pending') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Patrolling Pending
                </Link>
                <Link
                  to="/visitors/goods"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/goods') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Goods In/Out
                </Link>
                <Link
                  to="/visitors/goods/inwards"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/goods/inwards') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Inwards
                </Link>
                <Link
                  to="/visitors/goods/outwards"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/goods/outwards') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Outwards
                </Link>
                <Link
                  to="/visitors/vehicle-parkings"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/visitors/vehicle-parkings') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Vehicle Parkings
                </Link>
              </div>
            )}
          </div>

          {/* Experience Section */}
          <div>
            <button
              onClick={() => toggleSection('experience')}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Experience
              </div>
              {expandedSections.experience ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedSections.experience && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/experience/events"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/events') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Events
                </Link>
                <Link
                  to="/experience/broadcast"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/broadcast') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Broadcast
                </Link>
                <Link
                  to="/experience/business"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/business') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Business Directory
                </Link>
                <Link
                  to="/experience/business/setup"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/business/setup') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Business Setup
                </Link>
                <Link
                  to="/experience/documents/unit"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/documents/unit') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Documents Unit
                </Link>
                <Link
                  to="/experience/documents/common"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/documents/common') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Documents Common
                </Link>
                <Link
                  to="/experience/transport/outstation"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/outstation') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Outstation
                </Link>
                <Link
                  to="/experience/transport/airline"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/airline') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Airline
                </Link>
                <Link
                  to="/experience/transport/rail"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/rail') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Rail
                </Link>
                <Link
                  to="/experience/transport/hotel"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/hotel') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Hotel
                </Link>
                <Link
                  to="/experience/transport/self-travel"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/transport/self-travel') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Self Travel
                </Link>
                <Link
                  to="/experience/testimonials"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/testimonials') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Testimonials
                </Link>
                <Link
                  to="/experience/company-partners"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/experience/company-partners') ? 'bg-[#C72030] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
