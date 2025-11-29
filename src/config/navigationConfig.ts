import {
  MapPin,
  Users,
  CheckSquare,
  Package,
  FileText,
  DoorOpen,
  Ticket,
  PackagePlus,
  BarChart3,
  Wrench,
  Calendar,
  Clipboard,
  Trash2,
  FileSpreadsheet,
  UserRoundPen,
  User,
  Download,
  AlertTriangle,
  Shield,
  BookOpen,
  Briefcase,
  Receipt,
  Calculator,
  Target,
  Star,
  Bell,
  Zap,
  Droplets,
  Database,
  ClipboardList,
  Sun,
  Coffee,
  TreePine,
  Building,
  Mail,
  Globe,
  UserCheck,
  DollarSign,
  Clock,
} from "lucide-react";

export const modulesByPackage = {
  Master: [
    {
      name: "Location Master",
      icon: MapPin,
      href: "/master/location",
      subItems: [
        {
          name: "Account",
          href: "/master/location/account",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Building",
          href: "/master/location/building",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Wing",
          href: "/master/location/wing",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Area",
          href: "/master/location/area",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Floor",
          href: "/master/location/floor",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Unit",
          href: "/master/location/unit",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Room",
          href: "/master/location/room",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "User Master",
      icon: Users,
      href: "/master/user",
      subItems: [
        {
          name: "FM User",
          href: "/master/user/fm-users",
          color: "text-[#1a1a1a]",
        },
        {
          name: "OCCUPANT USERS",
          href: "/master/user/occupant-users",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Checklist Master",
      icon: CheckSquare,
      href: "/master/checklist",
    },
    {
      name: "Address Master",
      icon: MapPin,
      href: "/master/address",
    },
    {
      name: "Unit Master (By Default)",
      icon: Package,
      href: "/master/unit-default",
    },
    {
      name: "Material Master -> EBom",
      icon: FileText,
      href: "/master/material-ebom",
    },
    {
      name: "Gate Number",
      icon: DoorOpen,
      href: "/master/gate-number",
    },
  ],
  Transitioning: [
    { name: "HOTO", icon: FileText, href: "/transitioning/hoto" },
    {
      name: "Snagging",
      icon: CheckSquare,
      href: "/transitioning/snagging",
      subItems: [
        {
          name: "User Snag",
          href: "/transitioning/snagging?view=user",
          color: "text-[#1a1a1a]",
        },
        {
          name: "My Snags",
          href: "/transitioning/snagging?view=my",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Design Insight",
      icon: BarChart3,
      href: "/transitioning/design-insight",
    },
    {
      name: "Fitout",
      icon: Wrench,
      href: "/transitioning/fitout",
      subItems: [
        {
          name: "Fitout Setup",
          href: "/transitioning/fitout/setup",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Fitout Request",
          href: "/transitioning/fitout/request",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Fitout Checklist",
          href: "/transitioning/fitout/checklist",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Fitout Violation",
          href: "/transitioning/fitout/violation",
          color: "text-[#1a1a1a]",
        },
      ],
    },
  ],
  Maintenance: [
    {
      name: "Ticket",
      icon: FileText,
      href: "/maintenance/ticket",
    },
    {
      name: "Task",
      icon: CheckSquare,
      href: "/maintenance/task",
    },
    {
      name: "Schedule",
      icon: Calendar,
      href: "/maintenance/schedule",
    },
    {
      name: "Soft Services",
      icon: Wrench,
      href: "/maintenance/service",
    },
    {
      name: "Assets",
      icon: Building,
      href: "/maintenance/asset",
    },

    {
      name: "Inventory",
      icon: Package,
      href: "/maintenance/inventory",
      subItems: [
        {
          name: "Inventory Master",
          href: "/maintenance/inventory",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Inventory Consumption",
          href: "/maintenance/inventory-consumption",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "AMC",
      icon: FileText,
      href: "/maintenance/amc",
    },
    {
      name: "Attendance",
      icon: Clock,
      href: "/maintenance/attendance",
    },

    {
      name: "Audit",
      icon: Clipboard,
      href: "/maintenance/audit",
      subItems: [
        {
          name: "Operational",
          href: "/maintenance/audit/operational",
          color: "text-[#1a1a1a]",
          subItems: [
            {
              name: "Scheduled",
              href: "/maintenance/audit/operational/scheduled",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Conducted",
              href: "/maintenance/audit/operational/conducted",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Master Checklists",
              href: "/maintenance/audit/operational/master-checklists",
              color: "text-[#1a1a1a]",
            },
          ],
        },
        {
          name: "Vendor",
          href: "/maintenance/audit/vendor",
          color: "text-[#1a1a1a]",
          subItems: [
            {
              name: "Scheduled",
              href: "/maintenance/audit/vendor/scheduled",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Conducted",
              href: "/maintenance/audit/vendor/conducted",
              color: "text-[#1a1a1a]",
            },
          ],
        },
        {
          name: "Assets",
          href: "/maintenance/audit/assets",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Waste",
      icon: Trash2,
      href: "/maintenance/waste",
      subItems: [
        {
          name: "Waste Generation",
          href: "/maintenance/waste/generation",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Survey",
      icon: FileSpreadsheet,
      href: "/maintenance/survey",
      subItems: [
        {
          name: "Survey List",
          href: "/maintenance/survey/list",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Survey Mapping",
          href: "/maintenance/survey/mapping",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Response",
          href: "/maintenance/survey/response",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Vendor",
      icon: UserRoundPen,
      href: "/maintenance/vendor",
    },
    {
      name: "M-Safe",
      icon: User,
      href: "/maintenance/m-safe",
      subItems: [
        {
          name: "Internal User (FTE)",
          href: "/maintenance/m-safe/internal",
          color: "text-[#1a1a1a]",
        },
        {
          name: "External User (NON FTE)",
          href: "/maintenance/m-safe/external",
          color: "text-[#1a1a1a]",
        },
        {
          name: "LMC",
          href: "/maintenance/m-safe/lmc",
        },
        {
          name: "SMT",
          href: "/maintenance/m-safe/smt",
        },
        {
          name: "Krcc List",
          href: "/maintenance/m-safe/krcc-list",
        },
        {
          name: "Training List",
          href: "/maintenance/m-safe/training-list",
        },
        {
          name: "Reportees Reassign",
          href: "/maintenance/m-safe/reportees-reassign",
        },
      ],
    },
    {
      name: "Vi Miles",
      icon: User,
      href: "/maintenance/vi-miles",
      subItems: [
        {
          name: "Vehicle Details",
          href: "/maintenance/vi-miles/vehicle-details",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Vehicle Check In",
          href: "/maintenance/vi-miles/vehicle-check-in",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Employee Deletion History",
      icon: Trash2, // Changed from Trash to Trash2 as Trash was not imported in original file
      href: "/maintenance/employee-deletion-history",
    },

    {
      name: "Msafe Report",
      icon: Download,
      href: "/maintenance/msafe-report",
    },
    {
      name: "Msafe Detail Report",
      icon: Download,
      href: "/maintenance/msafe-detail-report",
    },
  ],
  Safety: [
    {
      name: "Incident",
      icon: AlertTriangle,
      href: "/safety/incident",
    },
    {
      name: "Permit",
      icon: FileText,
      href: "/safety/permit",
      subItems: [
        {
          name: "Permit ",
          href: "/safety/permit",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Pending Approvals",
          href: "/safety/permit/pending-approvals",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "M Safe",
      icon: Shield,
      href: "/safety/m-safe",
    },
    {
      name: "Training List",
      icon: BookOpen,
      href: "/safety/training-list",
    },
  ],
  Finance: [
    {
      name: "Procurement",
      icon: Briefcase,
      href: "/finance/procurement",
      subItems: [
        {
          name: "PR/ SR",
          href: "/finance/pr-sr",
          color: "text-[#1a1a1a]",
          subItems: [
            {
              name: "Material PR",
              href: "/finance/material-pr",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Service PR",
              href: "/finance/service-pr",
              color: "text-[#1a1a1a]",
            },
          ],
        },
        {
          name: "PO/WO",
          href: "/finance/po-wo",
          color: "text-[#1a1a1a]",
          subItems: [
            {
              name: "PO",
              href: "/finance/po",
              color: "text-[#1a1a1a]",
            },
            {
              name: "WO",
              href: "/finance/wo",
              color: "text-[#1a1a1a]",
            },
          ],
        },
        {
          name: "GRN/ SRN",
          href: "/finance/grn-srn",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Auto Saved PR",
          href: "/finance/auto-saved-pr",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Pending Approvals",
          href: "/finance/pending-approvals",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Invoices",
      icon: Receipt,
      href: "/finance/invoices",
    },
    {
      name: "Bill Booking",
      icon: Receipt,
      href: "/finance/bill-booking",
    },
    {
      name: "Accounting",
      icon: Calculator,
      href: "/finance/accounting",
      subItems: [
        {
          name: "Cost Center",
          href: "/finance/cost-center",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Budgeting",
          href: "/finance/budgeting",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "WBS",
      icon: BarChart3,
      href: "/finance/wbs",
    },
  ],
  CRM: [
    {
      name: "Lead",
      icon: Target,
      href: "/crm/lead",
    },
    {
      name: "Opportunity",
      icon: Star,
      href: "/crm/opportunity",
    },
    {
      name: "CRM",
      icon: Users,
      subItems: [
        {
          name: "Customers",
          href: "/crm/customers",
        },
        {
          name: "FM Users",
          href: "/crm/fm-users",
        },
        {
          name: "Occupant Users",
          href: "/crm/occupant-users",
        },
      ],
    },
    {
      name: "Events",
      icon: Calendar,
      href: "/crm/events",
    },
    {
      name: "Broadcast",
      icon: Bell,
      href: "/crm/broadcast",
    },
    {
      name: "Groups",
      icon: Users,
      href: "/crm/groups",
    },
    {
      name: "Polls",
      icon: BarChart3,
      href: "/crm/polls",
    },
    {
      name: "Campaign",
      icon: Target,
      href: "/crm/campaign",
    },
  ],
  Utility: [
    {
      name: "Energy",
      icon: Zap,
      href: "/utility/energy",
    },
    {
      name: "Water",
      icon: Droplets,
      href: "/utility/water",
    },
    {
      name: "STP",
      icon: Database,
      href: "/utility/stp",
    },
    {
      name: "Daily Readings",
      icon: ClipboardList,
      href: "/utility/daily-readings",
    },
    {
      name: "Utility Request",
      icon: FileText,
      href: "/utility/utility-request",
    },
    {
      name: "Utility Consumption",
      icon: BarChart3,
      href: "/utility/utility-consumption",
    },
    {
      name: "EV Consumption",
      icon: CheckSquare, // Replaced Car with CheckSquare as Car was not imported
      href: "/utility/ev-consumption",
    },
    {
      name: "Solar Generator",
      icon: Sun,
      href: "/utility/solar-generator",
    },
  ],
  Security: [
    {
      name: "Gate Pass",
      icon: Shield,
      href: "/security/gate-pass",
      subItems: [
        {
          name: "Inwards",
          href: "/security/gate-pass/inwards",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Outwards",
          href: "/security/gate-pass/outwards",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Visitor",
      icon: Users,
      href: "/security/visitor",
    },
    {
      name: "Staff",
      icon: Users,
      href: "/security/staff",
    },
    {
      name: "Vehicle",
      icon: CheckSquare, // Replaced Car with CheckSquare
      href: "/security/vehicle",
      subItems: [
        {
          name: "R Vehicles",
          href: "/security/vehicle/r-vehicles",
          color: "text-[#1a1a1a]",
          subItems: [
            {
              name: "All",
              href: "/security/vehicle/r-vehicles",
              color: "text-[#1a1a1a]",
            },
            {
              name: "History",
              href: "/security/vehicle/r-vehicles/history",
              color: "text-[#1a1a1a]",
            },
          ],
        },
        {
          name: "G Vehicles",
          href: "/security/vehicle/g-vehicles",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Patrolling",
      icon: Shield,
      href: "/security/patrolling",
    },
  ],
  "Value Added Services": [
    { name: "F&B", icon: Coffee, href: "/vas/fnb" },
    { name: "Parking", icon: CheckSquare, href: "/vas/parking" }, // Replaced Car with CheckSquare
    { name: "OSR", icon: TreePine, href: "/vas/osr" },
    {
      name: "Space Management",
      icon: Building,
      href: "/vas/space-management",
      subItems: [
        {
          name: "Bookings",
          href: "/vas/space-management/bookings",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Seat Requests",
          href: "/vas/space-management/seat-requests",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Setup",
          href: "/vas/space-management/setup",
          color: "text-[#1a1a1a]",
          subItems: [
            {
              name: "Seat Type",
              href: "/vas/space-management/setup/seat-type",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Seat Setup",
              href: "/vas/space-management/setup/seat-setup",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Shift",
              href: "/vas/space-management/setup/shift",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Roster",
              href: "/vas/space-management/setup/roster",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Employees",
              href: "/vas/space-management/setup/employees",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Check in Margin",
              href: "/vas/space-management/setup/check-in-margin",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Roster Calendar",
              href: "/vas/space-management/setup/roster-calendar",
              color: "text-[#1a1a1a]",
            },
            {
              name: "Export",
              href: "/vas/space-management/setup/export",
              color: "text-[#1a1a1a]",
            },
          ],
        },
      ],
    },
    {
      name: "Booking",
      icon: Calendar,
      href: "/vas/booking/list",
    },
    {
      name: "Mailroom",
      icon: Mail,
      href: "/vas/mailroom",
      subItems: [
        {
          name: "Inbound",
          href: "/vas/mailroom/inbound",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Outbound",
          href: "/vas/mailroom/outbound",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Redemption Marketplace",
      icon: Globe,
      href: "/vas/redemonection-marketplace",
    },
  ],
  "Market Place": [
    {
      name: "All",
      icon: Globe,
      href: "/market-place/all",
      color: "text-[#1a1a1a]",
    },
    {
      name: "Installed",
      icon: CheckSquare,
      href: "/market-place/installed",
      color: "text-[#1a1a1a]",
    },
    {
      name: "Updates",
      icon: Download,
      href: "/market-place/updates",
      color: "text-[#1a1a1a]",
    },
  ],
  Settings: [
    {
      name: "Account",
      icon: Users,
      href: "/settings/account",
      subItems: [
        { name: "General", href: "/settings/account/general" },
        {
          name: "Holiday Calendar",
          href: "/settings/account/holiday-calendar",
        },
        { name: "About", href: "/settings/account/about" },
        { name: "Language", href: "/settings/account/language" },
        {
          name: "Company Logo Upload",
          href: "/settings/account/company-logo-upload",
        },
        { name: "Report Setup", href: "/settings/account/report-setup" },
        {
          name: "Notification Setup",
          href: "/settings/account/notification-setup",
        },
        { name: "Shift", href: "/settings/account/shift" },
        { name: "Roster", href: "/settings/account/roster" },
        { name: "Lock Module", href: "/settings/account/lock-module" },
        { name: "Lock Function", href: "/settings/account/lock-function" },
        {
          name: "Lock Sub Function",
          href: "/settings/account/lock-sub-function",
        },
      ],
    },
    {
      name: "Roles (RACI)",
      icon: UserCheck,
      href: "/settings/roles",
      subItems: [
        { name: "Department", href: "/settings/roles/department" },
        { name: "Role", href: "/settings/roles/role" },
        { name: "Approval Matrix", href: "/settings/approval-matrix/setup" },
      ],
    },
    {
      name: "Maintenance",
      icon: Wrench,
      href: "/settings/maintenance",
      subItems: [
        {
          name: "Asset Setup",
          href: "/settings/asset-setup",
          subItems: [
            {
              name: "Approval Matrix",
              href: "/settings/asset-setup/approval-matrix",
            },
            {
              name: "Asset Group & Sub Group",
              href: "/settings/asset-setup/asset-groups",
            },
          ],
        },
        {
          name: "Checklist Setup",
          href: "/settings/checklist-setup",
          subItems: [
            {
              name: "Checklist Group & Sub Group",
              href: "/settings/checklist-setup/groups",
            },
            {
              name: "Email Rule",
              href: "/settings/checklist-setup/email-rule",
            },
            {
              name: "Task Escalation",
              href: "/settings/checklist-setup/task-escalation",
            },
          ],
        },
        {
          name: "Ticket Management",
          href: "/settings/ticket-management",
          subItems: [
            { name: "Setup", href: "/settings/ticket-management/setup" },
            {
              name: "Escalation Matrix",
              href: "/settings/ticket-management/escalation-matrix",
            },
            {
              name: "Cost Approval",
              href: "/settings/ticket-management/cost-approval",
            },
          ],
        },
        {
          name: "Inventory Management",
          href: "/settings/inventory-management",
          subItems: [
            {
              name: "SAC/HSN Code",
              href: "/settings/inventory-management/sac-hsn-code",
            },
          ],
        },
        {
          name: "Safety",
          href: "/settings/safety",
          subItems: [
            { name: "Permit Setup", href: "/settings/safety/permit-setup" },
            { name: "Incident Setup", href: "/settings/safety/incident" },
          ],
        },
        {
          name: "Waste Management",
          href: "/settings/waste-management",
          subItems: [
            { name: "Setup", href: "/settings/waste-management/setup" },
          ],
        },

        {
          name: "Design Insight Setup",
          icon: Target,
          subItems: [
            { name: "Setup", href: "/settings/design-insights/setup" },
          ],
        },
      ],
    },
    {
      name: "Finance",
      icon: DollarSign,
      href: "/settings/finance",
      subItems: [{ name: "Wallet Setup", href: "/finance/wallet-setup" }],
    },
    {
      name: "Security",
      icon: Shield,
      href: "/settings/security",
      subItems: [
        {
          name: "Visitor Management",
          href: "/security/visitor-management",
          subItems: [
            { name: "Setup", href: "/settings/visitor-management/setup" },
            {
              name: "Visiting Purpose",
              href: "/settings/visitor-management/visiting-purpose",
            },
            {
              name: "Support Staff",
              href: "/settings/visitor-management/support-staff",
            },
          ],
        },
        {
          name: "Gate Pass",
          href: "/security/gate-pass",
          subItems: [
            {
              name: "Materials Type",
              href: "/security/gate-pass/materials-type",
            },
            { name: "Items Name", href: "/security/gate-pass/items-name" },
          ],
        },
      ],
    },
    {
      name: "Value Added Services",
      icon: Star,
      href: "/settings/vas",
      subItems: [
        {
          name: "F&B",
          href: "/settings/vas/fnb",
          subItems: [{ name: "Setup", href: "/settings/vas/fnb/setup" }],
        },
        {
          name: "MOM",
          href: "/settings/vas/mom",
          subItems: [
            {
              name: "Client Tag Setup",
              href: "/settings/vas/mom/client-tag-setup",
            },
            {
              name: "Product Tag Setup",
              href: "/settings/vas/mom/product-tag-setup",
            },
          ],
        },
        {
          name: "Space Management",
          href: "/settings/vas/space-management",
          subItems: [
            {
              name: "Seat Setup",
              href: "/settings/vas/space-management/seat-setup",
            },
          ],
        },
        {
          name: "Booking",
          href: "/settings/vas/booking",
          subItems: [{ name: "Setup", href: "/settings/vas/booking/setup" }],
        },
        {
          name: "Parking Management",
          subItems: [
            {
              name: "Parking Category",
              href: "/settings/vas/parking-management/parking-category",
            },
            {
              name: "Slot Configuration",
              href: "/settings/vas/parking-management/slot-configuration",
            },
            {
              name: "Time Slot Setup",
              href: "/settings/vas/parking-management/time-slot-setup",
            },
          ],
        },
      ],
    },
  ],
};

// Direct mapping from sidebar item names to their expected API function names
export const sidebarToApiFunctionMapping = {
  // Main Categories - Direct function name matching
  broadcast: ["broadcast", "pms_notices"],
  ticket: ["tickets", "ticket", "pms_complaints", "pms_helpdesk_categories"],
  msafe: ["msafe", "pms_msafe", "pms_safety", "pmssafety", "m safe"],
  "m-safe": ["msafe", "pms_msafe", "pms_safety", "pmssafety", "m safe"],
  "m safe": ["msafe", "pms_msafe", "pms_safety", "pmssafety", "m safe"],
  task: ["task", "tasks", "pms_tasks"],
  tasks: ["task", "tasks", "pms_tasks"],
  schedule: ["schedule", "pms_schedule"],
  "soft services": ["service", "services", "pms_services"],
  service: ["service", "services", "pms_services"],
  services: ["service", "services", "pms_services"],
  assets: ["asset", "assets", "pms_assets"],
  inventory: ["inventory", "pms_inventories"],
  "inventory master": ["inventory", "pms_inventories"],
  "inventory consumption": ["consumption", "pms_consumption"],
  amc: ["amc", "pms_asset_amcs"],
  attendance: ["attendance", "pms_attendances"],
  vendor: ["supplier", "pms_supplier", "vendor audit", "vendor_audit"],
  supplier: ["supplier", "pms_supplier"],

  // Add more direct mappings as needed...
  // Safety specific
  incident: ["incident", "pms_incidents"],
  permit: ["permit", "permits", "cus_permits"],

  // Finance/Procurement
  po: ["po", "pms_purchase_orders"],
  wo: ["wo", "pms_work_orders"],
  grn: ["grn", "pms_grns"],

  // And so on for other categories...
};
