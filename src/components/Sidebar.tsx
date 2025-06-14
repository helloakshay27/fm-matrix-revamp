import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Home,
  Wrench,
  DollarSign,
  Building2,
  Users,
  Calendar,
  Star,
  ChevronDown,
  ChevronRight,
  Settings,
  UserCheck,
  ClipboardList,
  CheckSquare,
  AlertTriangle,
  MessageSquare,
  Truck,
  Car,
  FileText,
  Shield,
  Package,
  MapPin,
  Camera,
  BookOpen,
  Receipt,
  CreditCard,
  Archive,
  BarChart3,
  Plane,
  Train,
  Hotel,
  MessageCircle,
  Handshake,
  ShoppingCart,
  Clipboard,
  Search,
  Eye,
  TrendingUp,
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(true);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isPropertyOpen, setIsPropertyOpen] = useState(false);
  const [isVisitorsOpen, setIsVisitorsOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isOperationalAuditOpen, setIsOperationalAuditOpen] = useState(false);
  const [isVendorAuditOpen, setIsVendorAuditOpen] = useState(false);
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [isPermitOpen, setIsPermitOpen] = useState(false);
  const [isDesignInsightsOpen, setIsDesignInsightsOpen] = useState(false);
  const [isSurveysOpen, setIsSurveysOpen] = useState(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMaterialPROpen, setIsMaterialPROpen] = useState(false);
  const [isServicePROpen, setIsServicePROpen] = useState(false);
  const [isPOOpen, setIsPOOpen] = useState(false);
  const [isGRNOpen, setIsGRNOpen] = useState(false);
  const [isGDNOpen, setIsGDNOpen] = useState(false);
  const [isOtherBillsOpen, setIsOtherBillsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSpaceOpen, setIsSpaceOpen] = useState(false);
  const [isGoodsOpen, setIsGoodsOpen] = useState(false);
  const [isRVehiclesOpen, setIsRVehiclesOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-[#2D1B69] text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-white font-semibold text-lg">Phygital.work</span>
        </div>
        
        <nav className="space-y-2">
          <a href="/" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
            <Home className="w-5 h-5" />
            Home
          </a>

          {/* Maintenance Dropdown */}
          <div>
            <button
              onClick={() => setIsMaintenanceOpen(!isMaintenanceOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                Maintenance
              </div>
              {isMaintenanceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isMaintenanceOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <a href="/services" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/services') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Service
                </a>
                <a href="/supplier" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/supplier') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Supplier
                </a>
                <a href="/schedule" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/schedule') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Schedule
                </a>
                <a href="/amc" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/amc') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  AMC
                </a>

                {/* Operational Audit Dropdown */}
                <div>
                  <button
                    onClick={() => setIsOperationalAuditOpen(!isOperationalAuditOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Operational Audit</span>
                    {isOperationalAuditOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isOperationalAuditOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/operational-audit/scheduled" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/operational-audit/scheduled') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Scheduled
                      </a>
                      <a href="/operational-audit/conducted" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/operational-audit/conducted') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Conducted
                      </a>
                      <a href="/operational-audit/master-checklists" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/operational-audit/master-checklists') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Master Checklists
                      </a>
                    </div>
                  )}
                </div>

                {/* Vendor Audit Dropdown */}
                <div>
                  <button
                    onClick={() => setIsVendorAuditOpen(!isVendorAuditOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Vendor Audit</span>
                    {isVendorAuditOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isVendorAuditOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/maintenance/vendor-audit/scheduled" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/vendor-audit/scheduled') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Scheduled
                      </a>
                      <a href="/maintenance/vendor-audit/conducted" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/vendor-audit/conducted') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Conducted
                      </a>
                    </div>
                  )}
                </div>

                {/* Incident Dropdown */}
                <div>
                  <button
                    onClick={() => setIsIncidentOpen(!isIncidentOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Incident</span>
                    {isIncidentOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isIncidentOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/maintenance/incident/setup" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/incident/setup') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Setup
                      </a>
                      <a href="/maintenance/incident/list" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/incident/list') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Incident
                      </a>
                    </div>
                  )}
                </div>

                {/* Permit Dropdown */}
                <div>
                  <button
                    onClick={() => setIsPermitOpen(!isPermitOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Permit</span>
                    {isPermitOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isPermitOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/maintenance/permit/setup" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/permit/setup') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Permit Setup
                      </a>
                      <a href="/maintenance/permit/list" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/permit/list') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Permit
                      </a>
                      <a href="/maintenance/permit/pending-approvals" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/permit/pending-approvals') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Pending Approvals
                      </a>
                    </div>
                  )}
                </div>

                {/* Design Insights Dropdown */}
                <div>
                  <button
                    onClick={() => setIsDesignInsightsOpen(!isDesignInsightsOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Design Insights</span>
                    {isDesignInsightsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isDesignInsightsOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/maintenance/design-insights/list" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/design-insights/list') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Design Insights
                      </a>
                      <a href="/maintenance/design-insights/setup" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/design-insights/setup') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Setup
                      </a>
                    </div>
                  )}
                </div>

                {/* Inventory Dropdown */}
                <div>
                  <button
                    onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Inventory</span>
                    {isInventoryOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isInventoryOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/maintenance/inventory" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/inventory') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Inventory
                      </a>
                      <a href="/maintenance/inventory/consumption" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/maintenance/inventory/consumption') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Inventory Consumption
                      </a>
                    </div>
                  )}
                </div>

                <a href="/attendance" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/attendance') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Attendance
                </a>
                <a href="/tasks" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/tasks') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Tasks
                </a>
              </div>
            )}
          </div>

          {/* Surveys Dropdown */}
          <div>
            <button
              onClick={() => setIsSurveysOpen(!isSurveysOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5" />
                Surveys
              </div>
              {isSurveysOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isSurveysOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <a href="/surveys/list" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/surveys/list') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Survey List
                </a>
                <a href="/surveys/mapping" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/surveys/mapping') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Survey Mapping
                </a>
                <a href="/surveys/response" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/surveys/response') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Survey Response
                </a>
              </div>
            )}
          </div>

          {/* Assets Dropdown */}
          <div>
            <button
              onClick={() => setIsAssetsOpen(!isAssetsOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5" />
                Assets
              </div>
              {isAssetsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isAssetsOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <a href="/assets/inactive" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/assets/inactive') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  In-Active Assets
                </a>
              </div>
            )}
          </div>

          {/* Projects Dropdown */}
          <div>
            <button
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5" />
                Projects
              </div>
              {isProjectsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isProjectsOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <a href="/projects" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/projects') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Projects
                </a>
                <a href="/projects/fitout-setup" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/projects/fitout-setup') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Fitout Setup
                </a>
                <a href="/projects/add" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/projects/add') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Add Project
                </a>
              </div>
            )}
          </div>

          {/* Finance Dropdown */}
          <div>
            <button
              onClick={() => setIsFinanceOpen(!isFinanceOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5" />
                Finance
              </div>
              {isFinanceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isFinanceOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {/* Material PR Dropdown */}
                <div>
                  <button
                    onClick={() => setIsMaterialPROpen(!isMaterialPROpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Material PR</span>
                    {isMaterialPROpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isMaterialPROpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/finance/material-pr" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/material-pr') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Material PR
                      </a>
                      <a href="/finance/material-pr/add" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/material-pr/add') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Add Material PR
                      </a>
                    </div>
                  )}
                </div>

                {/* Service PR Dropdown */}
                <div>
                  <button
                    onClick={() => setIsServicePROpen(!isServicePROpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Service PR</span>
                    {isServicePROpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isServicePROpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/finance/service-pr" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/service-pr') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Service PR
                      </a>
                      <a href="/finance/service-pr/add" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/service-pr/add') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Add Service PR
                      </a>
                    </div>
                  )}
                </div>

                {/* PO Dropdown */}
                <div>
                  <button
                    onClick={() => setIsPOOpen(!isPOOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>PO</span>
                    {isPOOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isPOOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/finance/po" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/po') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        PO
                      </a>
                      <a href="/finance/po/add" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/po/add') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Add PO
                      </a>
                    </div>
                  )}
                </div>

                <a href="/finance/wo" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/wo') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  WO
                </a>

                {/* GRN Dropdown */}
                <div>
                  <button
                    onClick={() => setIsGRNOpen(!isGRNOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>GRN</span>
                    {isGRNOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isGRNOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/finance/grn" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/grn') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        GRN
                      </a>
                      <a href="/finance/grn/add" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/grn/add') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Add GRN
                      </a>
                    </div>
                  )}
                </div>

                <a href="/finance/invoices-ses" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/invoices-ses') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Invoices SES
                </a>
                <a href="/finance/pending-approvals" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/pending-approvals') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Pending Approvals
                </a>

                {/* GDN Dropdown */}
                <div>
                  <button
                    onClick={() => setIsGDNOpen(!isGDNOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>GDN</span>
                    {isGDNOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isGDNOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/finance/gdn" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/gdn') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        GDN
                      </a>
                      <a href="/finance/gdn/pending-approvals" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/gdn/pending-approvals') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Pending Approvals
                      </a>
                    </div>
                  )}
                </div>

                <a href="/finance/auto-saved-pr" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/auto-saved-pr') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Auto Saved PR
                </a>
                <a href="/finance/wbs-element" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/wbs-element') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  WBS Element
                </a>

                {/* Other Bills Dropdown */}
                <div>
                  <button
                    onClick={() => setIsOtherBillsOpen(!isOtherBillsOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Other Bills</span>
                    {isOtherBillsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isOtherBillsOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/finance/other-bills" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/other-bills') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Other Bills
                      </a>
                      <a href="/finance/other-bills/add" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/other-bills/add') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Add New Bill
                      </a>
                    </div>
                  )}
                </div>

                <a href="/finance/accounting" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/accounting') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Accounting
                </a>
                <a href="/finance/customer-bills" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/customer-bills') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Customer Bills
                </a>
                <a href="/finance/my-bills" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/finance/my-bills') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  My Bills
                </a>
              </div>
            )}
          </div>

          {/* Property Dropdown */}
          <div>
            <button
              onClick={() => setIsPropertyOpen(!isPropertyOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5" />
                Property
              </div>
              {isPropertyOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isPropertyOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {/* Booking Dropdown */}
                <div>
                  <button
                    onClick={() => setIsBookingOpen(!isBookingOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Booking</span>
                    {isBookingOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isBookingOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/property/booking/setup" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/property/booking/setup') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Setup
                      </a>
                    </div>
                  )}
                </div>

                {/* Space Dropdown */}
                <div>
                  <button
                    onClick={() => setIsSpaceOpen(!isSpaceOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Space</span>
                    {isSpaceOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isSpaceOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/property/space/bookings" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/property/space/bookings') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Bookings
                      </a>
                      <a href="/property/space/seat-type" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/property/space/seat-type') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Seat Type
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Visitors Dropdown */}
          <div>
            <button
              onClick={() => setIsVisitorsOpen(!isVisitorsOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                Visitors
              </div>
              {isVisitorsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isVisitorsOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <a href="/visitors/visitors" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/visitors') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Visitors
                </a>
                <a href="/visitors/history" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/history') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Visitors History
                </a>

                {/* R Vehicles Dropdown */}
                <div>
                  <button
                    onClick={() => setIsRVehiclesOpen(!isRVehiclesOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>R Vehicles</span>
                    {isRVehiclesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isRVehiclesOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/visitors/r-vehicles" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/r-vehicles') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        R Vehicles
                      </a>
                      <a href="/visitors/r-vehicles/history" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/r-vehicles/history') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        History
                      </a>
                    </div>
                  )}
                </div>

                <a href="/visitors/g-vehicles" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/g-vehicles') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  G Vehicles
                </a>
                <a href="/visitors/staffs" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/staffs') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Staffs
                </a>
                <a href="/visitors/materials" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/materials') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Materials
                </a>
                <a href="/visitors/patrolling" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/patrolling') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Patrolling
                </a>
                <a href="/visitors/patrolling-pending" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/patrolling-pending') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Patrolling Pending
                </a>

                {/* Goods Dropdown */}
                <div>
                  <button
                    onClick={() => setIsGoodsOpen(!isGoodsOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Goods</span>
                    {isGoodsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isGoodsOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/visitors/goods" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/goods') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Goods In & Out
                      </a>
                      <a href="/visitors/goods/inwards" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/goods/inwards') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Inwards
                      </a>
                      <a href="/visitors/goods/outwards" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/goods/outwards') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Outwards
                      </a>
                    </div>
                  )}
                </div>

                <a href="/visitors/vehicle-parkings" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/visitors/vehicle-parkings') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Vehicle Parkings
                </a>
              </div>
            )}
          </div>

          {/* Experience Dropdown */}
          <div>
            <button
              onClick={() => setIsExperienceOpen(!isExperienceOpen)}
              className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5" />
                Experience
              </div>
              {isExperienceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isExperienceOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <a href="/experience/events" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/events') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Events
                </a>
                <a href="/experience/broadcast" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/broadcast') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Broadcast
                </a>

                {/* Business Dropdown */}
                <div>
                  <button
                    onClick={() => setIsBusinessOpen(!isBusinessOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Business</span>
                    {isBusinessOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isBusinessOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/experience/business" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/business') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Business Directory
                      </a>
                      <a href="/experience/business/setup" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/business/setup') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Setup
                      </a>
                    </div>
                  )}
                </div>

                {/* Documents Dropdown */}
                <div>
                  <button
                    onClick={() => setIsDocumentsOpen(!isDocumentsOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Documents</span>
                    {isDocumentsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isDocumentsOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/experience/documents/unit" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/documents/unit') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Unit
                      </a>
                      <a href="/experience/documents/common" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/documents/common') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Common
                      </a>
                    </div>
                  )}
                </div>

                {/* Transport Dropdown */}
                <div>
                  <button
                    onClick={() => setIsTransportOpen(!isTransportOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-300 hover:bg-purple-800 hover:text-white"
                  >
                    <span>Transport</span>
                    {isTransportOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isTransportOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="/experience/transport/outstation" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/transport/outstation') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Outstation
                      </a>
                      <a href="/experience/transport/airline" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/transport/airline') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Airline
                      </a>
                      <a href="/experience/transport/rail" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/transport/rail') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Rail
                      </a>
                      <a href="/experience/transport/hotel" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/transport/hotel') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Hotel
                      </a>
                      <a href="/experience/transport/self-travel" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/transport/self-travel') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                        Self Travel
                      </a>
                    </div>
                  )}
                </div>

                <a href="/experience/testimonials" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/testimonials') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Testimonials
                </a>
                <a href="/experience/company-partners" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/experience/company-partners') ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white'}`}>
                  Company Partners
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};
