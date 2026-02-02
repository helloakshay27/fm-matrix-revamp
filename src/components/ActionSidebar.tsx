import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActionLayout } from "../contexts/ActionLayoutContext";
import { useLayout } from "../contexts/LayoutContext";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MapPin,
  Building,
  Users,
  CheckSquare,
  FileText,
  Package,
  DoorOpen,
  Ticket,
  Wrench,
  Target,
  Calendar,
  Clock,
  Clipboard,
  Trash2,
  FileSpreadsheet,
  UserRoundPen,
  AlertTriangle,
  Shield,
  User,
  Download,
  FolderTree,
  Trash,
  Briefcase,
  Receipt,
  Calculator,
  BarChart3,
  Star,
  Bell,
  Wallet,
  Zap,
  Droplets,
  Database,
  ClipboardList,
  Car,
  Sun,
  Coffee,
  TreePine,
  Mail,
  Folder,
  Settings,
  Globe,
  Circle,
  Upload,
} from "lucide-react";

// Icon mapping based on action_name
const actionIconMap: Record<string, any> = {
  // Master Module
  location_master: MapPin,
  location_master_account: Building,
  location_master_building: Building,
  location_master_wing: Building,
  location_master_area: MapPin,
  location_master_floor: Building,
  location_master_unit: Building,
  location_master_room: Building,
  user_master: Users,
  user_master_fm_user: Users,
  user_master_occupant_users: Users,
  checklist_master: CheckSquare,
  address_master: MapPin,
  unit_master_by_default: Package,
  material_master__ebom: FileText,
  gate_number: DoorOpen,
  gate_pass_type: Ticket,

  // Transitioning Module
  hoto: FileText,
  snagging: CheckSquare,
  snagging_user_snag: CheckSquare,
  snagging_my_snags: CheckSquare,
  design_insight: BarChart3,
  fitout: Wrench,
  fitout_fitout_setup: Settings,
  fitout_fitout_request: FileText,
  fitout_fitout_checklist: CheckSquare,
  fitout_fitout_violation: AlertTriangle,

  // Maintenance Module
  ticket: FileText,
  task: CheckSquare,
  schedule: Calendar,
  soft_services: Wrench,
  assets: Building,
  inventory: Package,
  inventory_inventory_master: Package,
  inventory_inventory_consumption: Package,
  amc: FileText,
  attendance: Clock,
  audit: Clipboard,
  audit_operational: Clipboard,
  audit_operational_scheduled: Calendar,
  audit_operational_conducted: CheckSquare,
  audit_operational_master_checklists: ClipboardList,
  audit_vendor: UserRoundPen,
  audit_vendor_scheduled: Calendar,
  audit_vendor_conducted: CheckSquare,
  audit_assets: Building,
  waste: Trash2,
  waste_waste_generation: Trash2,
  survey: FileSpreadsheet,
  survey_survey_list: FileSpreadsheet,
  survey_survey_mapping: MapPin,
  survey_response: FileText,
  vendor: UserRoundPen,

  // Safety Module
  msafe: User,
  msafe_internal_user_fte: User,
  msafe_external_user_non_fte: User,
  msafe_lmc: User,
  msafe_smt: User,
  msafe_krcc_list: ClipboardList,
  msafe_training_list: ClipboardList,
  msafe_reportees_reassign: Users,
  vi_miles: Car,
  vi_miles_vehicle_details: Car,
  vi_miles_vehicle_check_in: CheckSquare,
  employee_deletion_history: Trash,
  msafe_report: Download,
  msafe_detail_report: Download,
  incident: AlertTriangle,
  permit: FileText,
  permit_permit_: FileText,
  permit_pending_approvals: Clock,
  m_safe: User,
  training_list: ClipboardList,
  check_hierarchy_levels: FolderTree,

  // Finance Module
  procurement: Briefcase,
  "procurement_pr/_sr": FileText,
  "procurement_pr/_sr_material_pr": FileText,
  "procurement_pr/_sr_service_pr": FileText,
  "procurement_po/wo": Receipt,
  "procurement_po/wo_po": Receipt,
  "procurement_po/wo_wo": Receipt,
  "procurement_grn/_srn": ClipboardList,
  procurement_auto_saved_pr: FileText,
  procurement_pending_approvals: Clock,
  invoices: Receipt,
  bill_booking: Receipt,
  accounting: Calculator,
  accounting_cost_center: Calculator,
  accounting_budgeting: Calculator,
  wbs: BarChart3,

  // CRM Module
  lead: Target,
  opportunity: Star,
  crm: Users,
  crm_customers: Users,
  crm_fm_users: Users,
  crm_occupant_users: Users,
  events: Calendar,
  broadcast: Bell,
  groups: Users,
  polls: BarChart3,
  campaign: Target,
  wallet: Wallet,

  // Utility Module
  energy: Zap,
  water: Droplets,
  stp: Database,
  daily_readings: ClipboardList,
  utility_request: FileText,
  utility_consumption: BarChart3,
  ev_consumption: Car,
  solar_generator: Sun,

  // Security Module
  gate_pass: Shield,
  gate_pass_inwards: Shield,
  gate_pass_outwards: Shield,
  visitor: Users,
  staff: Users,
  vehicle: Car,
  vehicle_r_vehicles: Car,
  vehicle_r_vehicles_all: Car,
  vehicle_r_vehicles_history: Clock,
  vehicle_g_vehicles: Car,
  patrolling: Shield,
  patrolling_info: Shield,
  patrolling_response: FileText,

  // Value Added Services
  "f&b": Coffee,
  parking: Car,
  osr: TreePine,
  space_management: Building,
  space_management_bookings: Calendar,
  space_management_seat_requests: FileText,
  space_management_setup: Settings,
  space_management_setup_seat_type: Building,
  space_management_setup_seat_setup: Settings,
  space_management_setup_shift: Clock,
  space_management_setup_roster: Calendar,
  space_management_setup_employees: Users,
  space_management_setup_check_in_margin: Clock,
  space_management_setup_roster_calendar: Calendar,
  space_management_setup_export: Download,
  booking: Calendar,
  redemption_marketplace: Globe,
  projects_and_tasks: Briefcase,
  projects: Briefcase,
  project_tasks: CheckSquare,
  project_issues: AlertTriangle,
  project_sprint: Target,
  project_channels: Mail,
  project_minutes_of_meeting: FileText,
  opportunity_register: Star,
  project_documents: Folder,
  mailroom: Mail,
  mailroom_inbound: Mail,
  mailroom_outbound: Mail,

  // Settings Module
  account: Users,
  account_general: Settings,
  account_holiday_calendar: Calendar,
  account_about: FileText,
  account_language: Globe,
  account_company_logo_upload: Upload,
  account_report_setup: FileText,
  account_notification_setup: Bell,
  account_shift: Clock,
  account_roster: Calendar,
  account_lock_module: Shield,
  account_lock_function: Shield,
  account_lock_sub_function: Shield,
  roles_raci: Users,
  roles_raci_department: Building,
  roles_raci_role: User,
  roles_raci_approval_matrix: CheckSquare,
  maintenance: Wrench,
  maintenance_asset_setup: Building,
  maintenance_asset_setup_approval_matrix: CheckSquare,
  "maintenance_asset_setup_asset_group_&_sub_group": Building,
  maintenance_checklist_setup: CheckSquare,
  "maintenance_checklist_setup_checklist_group_&_sub_group": CheckSquare,
  maintenance_checklist_setup_email_rule: Mail,
  maintenance_checklist_setup_task_escalation: AlertTriangle,
  maintenance_ticket_management: FileText,
  maintenance_ticket_management_setup: Settings,
  maintenance_ticket_management_escalation_matrix: AlertTriangle,
  maintenance_ticket_management_cost_approval: Calculator,
  maintenance_inventory_management: Package,
  "maintenance_inventory_management_sac/hsn_code": FileText,
  maintenance_safety: Shield,
  maintenance_safety_permit_setup: FileText,
  maintenance_safety_incident_setup: AlertTriangle,
  maintenance_waste_management: Trash2,
  maintenance_waste_management_setup: Settings,
  maintenance_design_insight_setup: Target,
  finance: Calculator,
  finance_wallet_setup: Wallet,
  security: Shield,
  security_visitor_management: Users,
  security_visitor_management_setup: Settings,
  security_visitor_management_visiting_purpose: FileText,
  security_visitor_management_support_staff: Users,
  security_gate_pass: Shield,
  security_gate_pass_materials_type: Package,
  security_gate_pass_items_name: FileText,
  value_added_services: Star,
  "value_added_services_f&b": Coffee,
  "value_added_services_f&b_setup": Settings,
  value_added_services_mom: FileText,
  value_added_services_mom_client_tag_setup: Star,
  value_added_services_mom_product_tag_setup: Package,
  value_added_services_space_management: Building,
  value_added_services_space_management_seat_setup: Settings,
  value_added_services_booking: Calendar,
  value_added_services_booking_setup: Settings,
  value_added_services_parking_management: Car,
  value_added_services_parking_management_parking_category: Car,
  value_added_services_parking_management_slot_configuration: Settings,
  value_added_services_parking_management_time_slot_setup: Clock,
  value_added_services_project_and_task_setup: Briefcase,
  value_added_services_project_and_task_setup_roles: Users,
  value_added_services_project_and_task_setup_project_teams: Users,
  value_added_services_project_and_task_setup_project_status: CheckSquare,
  value_added_services_project_and_task_setup_project_groups: Building,
  value_added_services_project_and_task_setup_project_templates: FileText,
  value_added_services_project_and_task_setup_issues_type: AlertTriangle,

  // Market Place
  all: Globe,
  installed: CheckSquare,
  updates: Download,

  // Common
  circle: Circle,
};

// Fallback icon
const FallbackIcon = Circle;

// Helper function to get icon for action_name
const getIconForAction = (actionName: string) => {
  return actionIconMap[actionName] || FallbackIcon;
};

export const ActionSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentModule,
    getModuleFunctions,
    setCurrentFunction,
    isActionSidebarVisible,
  } = useActionLayout();
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();
  const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(
    new Set()
  );

  // Get module functions (safe to call even if no module)
  const moduleFunctions = currentModule
    ? getModuleFunctions(currentModule)
    : [];

  // Build hierarchical structure (must be called before any conditional returns)
  const hierarchicalFunctions = useMemo(() => {
    // Helper function to check if a function has active descendants
    const hasActiveDescendant = (func: any, allFunctions: any[]): boolean => {
      // Check if the function itself is active
      if (func.function_active === 1) {
        return true;
      }

      // Find direct children
      const children = allFunctions.filter(
        (f) => f.parent_function === func.action_name
      );

      // Recursively check if any child has active descendants
      return children.some((child) => hasActiveDescendant(child, allFunctions));
    };

    const topLevel: any[] = [];

    // First pass: identify top-level functions (no parent)
    moduleFunctions.forEach((func) => {
      if (!func.parent_function || func.parent_function === "") {
        topLevel.push({ ...func, children: [] });
      }
    });

    // Second pass: recursively build children for each parent
    const buildChildren = (parent: any): void => {
      const children = moduleFunctions.filter(
        (func) => func.parent_function === parent.action_name
      );

      children.forEach((child) => {
        const childWithChildren = { ...child, children: [] };
        parent.children.push(childWithChildren);
        buildChildren(childWithChildren); // Recursive call
      });
    };

    topLevel.forEach((parent) => buildChildren(parent));

    // Filter: only include functions that are active OR have active descendants
    const filterInactive = (func: any): any | null => {
      if (!hasActiveDescendant(func, moduleFunctions)) {
        return null; // Exclude this branch entirely
      }

      // Include this function, but filter its children recursively
      const filteredChildren = func.children
        .map((child: any) => filterInactive(child))
        .filter((child: any) => child !== null);

      return { ...func, children: filteredChildren };
    };

    return topLevel
      .map((func) => filterInactive(func))
      .filter((func) => func !== null);
  }, [moduleFunctions]);

  // Don't render if not visible or no module selected
  if (!isActionSidebarVisible || !currentModule) {
    return null;
  }

  // Don't render if no functions available
  if (moduleFunctions.length === 0) {
    return null;
  }

  const handleNavigation = (link: string, functionName: string) => {
    setCurrentFunction(functionName);
    navigate(link);
  };

  const isActiveRoute = (link: string) => {
    const currentPath = location.pathname;
    return currentPath === link || currentPath.startsWith(link + "/");
  };

  const toggleExpand = (actionName: string) => {
    setExpandedFunctions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(actionName)) {
        newSet.delete(actionName);
      } else {
        newSet.add(actionName);
      }
      return newSet;
    });
  };

  const renderFunctionItem = (func: any, level: number = 0) => {
    const isActive = func.react_link ? isActiveRoute(func.react_link) : false;
    const hasChildren = func.children && func.children.length > 0;
    const isExpanded = expandedFunctions.has(func.action_name);
    const Icon = getIconForAction(func.action_name);

    return (
      <div key={func.function_id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(func.action_name);
            }
            if (func.react_link) {
              handleNavigation(func.react_link, func.function_name);
            }
          }}
          className={`flex items-center justify-between gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${
            isActive ? "bg-[#f0e8dc] text-[#C72030]" : "text-[#1a1a1a]"
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          title={func.function_name}
        >
          <div className="flex items-center gap-3 flex-1">
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
            )}
            {level === 0 && <Icon className="w-5 h-5" />}
            <span>{func.function_name}</span>
          </div>
          {hasChildren && (
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {func.children.map((child: any) =>
              renderFunctionItem(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const CollapsedFunctionItem = ({ func }: { func: any }) => {
    const isActive = func.react_link ? isActiveRoute(func.react_link) : false;
    const Icon = getIconForAction(func.action_name);

    return (
      <button
        onClick={() => {
          if (func.react_link) {
            handleNavigation(func.react_link, func.function_name);
          }
        }}
        className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${
          isActive ? "bg-[#f0e8dc] shadow-inner" : "hover:bg-[#DBC2A9]"
        }`}
        title={func.function_name}
      >
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
        )}
        <Icon
          className={`w-5 h-5 ${
            isActive ? "text-[#C72030]" : "text-[#1a1a1a]"
          }`}
        />
      </button>
    );
  };

  return (
    <div
      className={`${
        isSidebarCollapsed ? "w-16" : "w-64"
      } bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
      style={{ top: "4rem", height: "91vh" }}
    >
      <div className={`${isSidebarCollapsed ? "px-2 py-2" : "p-2"}`}>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute right-2 top-2 p-1 rounded-md hover:bg-[#DBC2A9] z-10"
        >
          {isSidebarCollapsed ? (
            <div className="flex justify-center items-center w-8 h-8 bg-[#f6f4ee] border border-[#e5e1d8] mx-auto">
              <ChevronRight className="w-4 h-4" />
            </div>
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
        {/* Add background and border below the collapse button */}
        <div className="w-full h-4 bg-[#f6f4ee] border-[#e5e1d8] mb-2"></div>

        {currentModule && (
          <div className={`mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
            <h3
              className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${
                isSidebarCollapsed ? "text-center" : "tracking-wide"
              }`}
            >
              {isSidebarCollapsed ? "" : currentModule}
            </h3>
          </div>
        )}

        <nav className="space-y-2">
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center space-y-5 pt-4">
              {hierarchicalFunctions.map((func) => (
                <CollapsedFunctionItem key={func.function_id} func={func} />
              ))}
            </div>
          ) : (
            hierarchicalFunctions.map((func) => renderFunctionItem(func))
          )}
        </nav>
      </div>
    </div>
  );
};
