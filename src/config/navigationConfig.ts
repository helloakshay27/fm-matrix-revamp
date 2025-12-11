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
  IndianRupee,
  Circle,
  Car,
  Wallet,
  FolderTree,
  Trash,
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
          name: "FM Users",
          href: "/master/user/fm-users",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Occupant Users",
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
      name: "Question Bank",
      icon: FileSpreadsheet,
      href: "/master/survey/list",
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
    {
      name: "Gate Pass Type",
      icon: Ticket,
      href: "/master/gate-pass-type",
    },
    {
      name: "Inventory Type",
      icon: Package,
      href: "/master/inventory-type",
    },
    {
      name: "Template",
      icon: FileSpreadsheet,
      href: "/master/communication-template",
      subItems: [
        {
          name: "Communication Template",
          href: "/master/communication-template",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Root Cause Analysis",
          href: "/master/template/root-cause-analysis",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Preventive Action",
          href: "/master/template/preventive-action",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Short-term Impact",
          href: "/master/template/short-term-impact",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Long-term Impact",
          href: "/master/template/long-term-impact",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Corrective Action",
          href: "/master/template/corrective-action",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    // {
    //   name: 'Inventory Sub Type',
    //   icon: PackagePlus,
    //   href: '/master/inventory-sub-type'
    // },
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
    { name: "Ticket", icon: FileText, href: "/maintenance/ticket" },
    { name: "Task", icon: CheckSquare, href: "/maintenance/task" },
    { name: "Schedule", icon: Calendar, href: "/maintenance/schedule" },
    { name: "Soft Service", icon: Wrench, href: "/maintenance/service" },
    { name: "Assets", icon: Building, href: "/maintenance/asset" },

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
        // { name: 'Eco-Friendly List', href: '/maintenance/eco-friendly-list', color: 'text-[#1a1a1a]' }
      ],
    },
    { name: "AMC", icon: FileText, href: "/maintenance/amc" },
    { name: "Attendance", icon: Clock, href: "/maintenance/attendance" },

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
        // { name: 'Survey List', href: '/maintenance/survey/list', color: 'text-[#1a1a1a]' },
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

    // {
    //   name: 'Projects & Tasks',
    //   icon: Briefcase,
    //   href: "/maintenance/projects"
    // },
    // {
    //   name: 'Sprint',
    //   icon: Briefcase,
    //   href: "/maintenance/sprint"
    // }

    // {
    //   name: "Msafe Report",
    //   icon: Download,
    //   href: "/safety/msafe-report",
    // },
    // {
    //   name: "Msafe Detail Report",
    //   icon: Download,
    //   href: "/safety/msafe-detail-report",
    // },

    // { name: 'SMT', icon: BarChart, href: '/maintenance/smt' },

    // { name: 'Design Insight Setup', icon: Target, href: '/settings/design-insights/setup' }
  ],
  Safety: [
    { name: "Incident", icon: AlertTriangle, href: "/safety/incident" },
    {
      name: "Permit",
      icon: FileText,
      href: "/safety/permit",
      subItems: [
        { name: "Permit ", href: "/safety/permit", color: "text-[#1a1a1a]" },
        {
          name: "Pending Approvals",
          href: "/safety/permit/pending-approvals",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Permit Checklist",
          href: "/safety/permit/checklist",
          color: "text-[#1a1a1a]",
        },
      ],
    },

    {
      name: "M-Safe",
      icon: User,
      href: "/safety/m-safe",
      subItems: [
        {
          name: "Internal User (FTE)",
          href: "/safety/m-safe/internal",
          color: "text-[#1a1a1a]",
        },
        {
          name: "External User (NON FTE)",
          href: "/safety/m-safe/external",
          color: "text-[#1a1a1a]",
        },
        { name: "LMC", href: "/safety/m-safe/lmc" },
        { name: "SMT", href: "/safety/m-safe/smt" },
        { name: "Krcc List", href: "/safety/m-safe/krcc-list" },
        { name: "Training List", href: "/safety/m-safe/training-list" },
        {
          name: "Reportees Reassign",
          href: "/safety/m-safe/reportees-reassign",
        },
      ],
    },
    {
      name: "Report",
      icon: Download,
      href: "/safety/report",
      subItems: [
        {
          name: "Msafe User Report",
          icon: Download,
          href: "/safety/report/msafe-report",
        },
        {
          name: "Msafe Detail Report",
          icon: Download,
          href: "/safety/report/msafe-detail-report",
        },
      ],
    },
    // {
    //   name: "Vi Miles",
    //   icon: User,
    //   href: "/safety/vi-miles",
    //   subItems: [
    //     {
    //       name: "Vehicle Details",
    //       href: "/safety/vi-miles/vehicle-details",
    //       color: "text-[#1a1a1a]",
    //     },
    //     {
    //       name: "Vehicle Check In",
    //       href: "/safety/vi-miles/vehicle-check-in",
    //       color: "text-[#1a1a1a]",
    //     },
    //   ],
    // },
    {
      name: "Check Hierarchy Levels",
      icon: FolderTree,
      href: "/safety/check-hierarchy-levels",
    },
    {
      name: "Employee Deletion History",
      icon: Trash,
      href: "/safety/employee-deletion-history",
    },
  ],
  Finance: [
    {
      name: "Procurement",
      icon: Briefcase,
      href: "/finance/procurement",
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
        { name: "PO", href: "/finance/po", color: "text-[#1a1a1a]" },
        { name: "WO", href: "/finance/wo", color: "text-[#1a1a1a]" },
        { name: "GRN/ SRN", href: "/finance/grn-srn", color: "text-[#1a1a1a]" },
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
        {
          name: "Deletion Requests",
          href: "/finance/deletion-requests",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Deleted PRs",
          href: "/finance/deleted-prs",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    { name: "Invoices", icon: Receipt, href: "/finance/invoices" },
    { name: "Bill Booking", icon: Receipt, href: "/finance/bill-booking" },
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
    { name: "WBS", icon: BarChart3, href: "/finance/wbs" },
  ],
  CRM: [
    { name: "Lead", icon: Target, href: "/crm/lead" },
    { name: "Opportunity", icon: Star, href: "/crm/opportunity" },
    {
      name: "CRM",
      icon: Users,
      subItems: [
        { name: "Customers", href: "/crm/customers" },
        // { name: "FM Users", href: "/crm/fm-users" },
        // { name: "Occupant Users", href: "/crm/occupant-users" },
      ],
    },
    { name: "Events", icon: Calendar, href: "/crm/events" },
    { name: "Broadcast", icon: Bell, href: "/crm/broadcast" },
    { name: "Polls", icon: BarChart3, href: "/crm/polls" },
    { name: "Campaign", icon: Target, href: "/crm/campaign" },
    {
      name: "Wallet",
      icon: Wallet,
      subItems: [
        { name: "Wallet List", href: "/crm/wallet-list" },
        { name: "Point Expiry", href: "/crm/point-expiry" },
      ],
    },
  ],
  Utility: [
    { name: "Energy", icon: Zap, href: "/utility/energy" },
    { name: "Water", icon: Droplets, href: "/utility/water" },
    { name: "STP", icon: Database, href: "/utility/stp" },
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
    // { name: 'Utility Consumption', icon: BarChart3, href: '/utility/utility-consumption' },
    { name: "EV Consumption", icon: Car, href: "/utility/ev-consumption" },
    { name: "Solar Generator", icon: Sun, href: "/utility/solar-generator" },
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
    { name: "Visitor", icon: Users, href: "/security/visitor" },
    { name: "Staff", icon: Users, href: "/security/staff" },
    {
      name: "Vehicle",
      icon: Car,
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
    { name: "Patrolling", icon: Shield, href: "/security/patrolling" },
  ],
  "Value Added Services": [
    { name: "F&B", icon: Coffee, href: "/vas/fnb" },
    {
      name: "Parking",
      icon: Car,
      href: "/vas/parking",
      subItems: [
        {
          name: "Parking Allocation",
          href: "/vas/parking",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Parking Booking",
          href: "/vas/parking/site-wise-bookings",
          color: "text-[#1a1a1a]",
        },
      ],
    },
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
      // subItems: [
      //   { name: 'Booking List', href: '/vas/booking/list', color: 'text-[#1a1a1a]' },
      //   { name: 'Book Setup', href: '/vas/booking/setup', color: 'text-[#1a1a1a]' }
      // ]
    },
    {
      name: "Redemption Marketplace",
      icon: Globe,
      href: "/vas/redemonection-marketplace",
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
      name: "Collaboration",
      icon: Globe,
      subItems: [
        {
          name: "Channels",
          href: "/vas/channels",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Tasks",
          href: "/vas/channels/tasks",
          color: "text-[#1a1a1a]",
        },
      ],
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
          href: "/settings/asset-setup/approval-matrix",
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
            {
              name: "Inventory Type",
              href: "/settings/inventory-management/inventory-type",
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
          href: "/settings/visitor-management/setup",
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
            { name: "Icons", href: "/settings/visitor-management/icons" },
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
          href: "/settings/vas/fnb/setup",
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
          href: "/settings/vas/booking/setup",
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
    {
      name: "Community Modules",
      icon: Users,
      subItems: [
        {
          name: "Testimonial Setup",
          href: "/settings/community-modules/testimonial-setup",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Company Partner Setup",
          href: "/settings/community-modules/company-partner-setup",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Banner Setup",
          href: "/settings/community-modules/banner-setup",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Amenity Setup",
          href: "/settings/community-modules/amenity-setup",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    { name: "FM Groups", icon: Users, href: "/settings/groups" },
    // {
    //   name: 'Currency',
    //   icon: Currency,
    //   href: '/settings/currency',
    // }

    {
      name: "Common Modules",
      icon: IndianRupee,
      subItems: [{ name: "Currency", href: "/settings/currency" }],
    },
    {
      icon: Circle,
      name: "Circle",
      href: "/safety/m-safe/circle",
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

  "location master": ["account", "pms_setup"],
  "user master": [
    "user & roles",
    "pms_user_roles",
    "occupant users",
    "pms_occupant_users",
  ],
  "fm user": ["user & roles", "pms_user_roles"],
  "occupant users": ["occupant users", "pms_occupant_users"],
  "checklist master": ["master checklist", "pms_master_checklist"],
  "address master": ["addresses", "pms_billing_addresses"],
  "unit master (by default)": ["pms_setup"],
  "material master -> ebom": ["materials", "pms_materials"],
  "gate number": ["gate", "gate_number"],

  // Building/Location Elements
  account: ["account", "accounts", "pms_accounts", "pms_setup"],
  building: ["building", "buildings"],
  wing: ["wing", "wings"],
  area: ["area", "areas"],
  floor: ["floor", "floors"],
  unit: ["unit", "units"],
  room: ["room", "rooms"],

  // Transitioning
  hoto: ["hoto"],
  snagging: ["snagging"],
  "user snag": ["snagging"],
  "my snags": ["snagging"],
  "design insight": ["design insight", "pms_design_inputs"],
  fitout: ["fitout"],
  "fitout setup": ["fitout"],
  "fitout request": ["fitout"],
  "fitout checklist": ["fitout"],
  "fitout violation": ["fitout"],

  // Audit
  audit: [
    "operational audit",
    "operational_audits",
    "vendor audit",
    "vendor_audit",
  ],
  operational: ["operational audit", "operational_audits"],
  "operational audit": ["operational audit", "operational_audits"],
  "vendor audit": ["vendor audit", "vendor_audit"],
  scheduled: ["schedule", "pms_schedule"],
  conducted: ["conducted"],
  "master checklists": ["master checklist", "pms_master_checklist"],

  // Waste Management
  waste: ["waste generation", "waste_generation"],
  "waste generation": ["waste generation", "waste_generation"],

  // Survey
  survey: ["survey"],
  "survey list": ["survey"],
  "survey mapping": ["survey"],
  response: ["survey"],

  // M-Safe specific
  "internal user (fte)": ["msafe", "pms_msafe"],
  "external user (non fte)": ["non fte users", "non_fte_users"],
  lmc: ["line manager check", "line_manager_check"],
  smt: ["senior management tour", "senior_manager_tour"],
  "krcc list": ["krcc list", "krcc_list", "krcc"],
  "training list": ["training list", "training_list", "pms_training"],
  "reportees reassign": ["reportees reassign"],

  // Vi Miles
  "vi miles": ["vi miles", "vi_miles"],
  "vehicle details": ["vi miles", "vi_miles"],
  "vehicle check in": ["vi miles", "vi_miles"],

  // Reports
  "employee deletion history": ["employee deletion history"],
  "msafe report": ["download msafe report", "download_msafe_report"],
  "msafe detail report": [
    "download msafe detailed report",
    "download_msafe_detailed_report",
  ],

  "pending approvals": ["pending approvals", "pending_approvals"],
  training: ["training", "training_list", "pms_training"],

  // Finance/Procurement
  procurement: ["po", "pms_purchase_orders", "wo", "pms_work_orders"],
  "pr/ sr": ["procurement"],
  "material pr": ["po", "pms_purchase_orders"],
  "service pr": ["wo", "pms_work_orders"],
  "po/wo": ["po", "pms_purchase_orders", "wo", "pms_work_orders"],
  "grn/ srn": ["grn", "pms_grns", "srns", "pms_srns"],
  srns: ["srns", "pms_srns"],
  "auto saved pr": ["po", "pms_purchase_orders"],
  invoices: ["wo invoices", "pms_work_order_invoices"],
  "wo invoices": ["wo invoices", "pms_work_order_invoices"],
  "bill booking": ["bill", "pms_bills"],
  bill: ["bill", "pms_bills"],
  accounting: ["accounts", "pms_accounts"],
  "cost center": ["accounts", "pms_accounts"],
  budgeting: ["accounts", "pms_accounts"],
  wbs: ["wbs"],

  // CRM
  lead: ["lead"],
  opportunity: ["opportunity"],
  crm: ["customers"],
  customers: ["customers"],

  events: ["events", "pms_events"],
  groups: ["groups"],
  polls: ["polls"],
  campaign: ["campaign"],

  // Utility
  energy: ["meters", "pms_energy"],
  meters: ["meters", "pms_energy"],
  water: ["water", "pms_water"],
  stp: ["stp", "pms_stp"],
  "daily readings": ["daily readings", "daily_readings"],
  "utility request": ["utility request", "utility_request"],
  "utility consumption": ["utility consumption", "utility_consumption"],
  "ev consumption": ["ev consumption", "ev_consumption"],
  "solar generator": ["solar generator", "solar_generators"],

  // Security
  "gate pass": ["gate pass"],
  inwards: ["gate pass"],
  outwards: ["gate pass"],
  visitor: ["visitors", "pms_visitors"],
  visitors: ["visitors", "pms_visitors"],
  staff: ["staffs", "pms_staffs"],
  staffs: ["staffs", "pms_staffs"],
  vehicle: ["r vehicles", "pms_rvehicles", "g vehicles", "pms_gvehicles"],
  "r vehicles": ["r vehicles", "pms_rvehicles"],
  "g vehicles": ["g vehicles", "pms_gvehicles"],
  all: ["r vehicles", "pms_rvehicles"],
  history: ["r vehicles", "pms_rvehicles"],
  patrolling: ["patrolling", "pms_patrolling"],

  // Value Added Services
  "f&b": ["fnb"],
  parking: ["parking", "cus_parkings"],
  osr: ["osr"],
  "space management": ["space"],
  space: ["space"],
  bookings: ["booking"],
  "seat requests": ["seat requests"],
  setup: ["setup"],
  "seat type": ["seat type"],
  "seat setup": ["seat setup"],
  shift: ["shift"],
  roster: ["roster"],
  employees: ["employees"],
  "check in margin": ["check in margin"],
  "roster calendar": ["roster calendar"],
  export: ["export", "pms_export"],
  booking: ["booking"],
  "redemption marketplace": ["marketplace"],

  // Market Place
  marketplace_all: ["marketplace"],
  installed: ["marketplace"],
  updates: ["marketplace"],

  // Settings
  general: ["general"],
  "holiday calendar": ["holiday calendar"],
  about: ["about"],
  language: ["language"],
  "company logo upload": ["company logo"],
  "report setup": ["report setup"],
  "notification setup": ["notification setup"],
  "lock module": ["lock module"],
  "lock function": ["lock function"],
  "lock sub function": ["lock sub function"],
  "roles (raci)": ["user roles", "pms_user_roles"],
  "user roles": ["user roles", "pms_user_roles"],
  department: ["department"],
  role: ["role"],
  "approval matrix": ["approval matrix"],
  maintenance: ["maintenance"],
  "asset setup": ["asset setup"],
  "asset group & sub group": ["asset groups", "pms_asset_groups"],
  "checklist setup": ["checklist setup"],
  "checklist group & sub group": ["checklist setup"],
  "email rule": ["email rule", "pms_email_rule_setup"],
  "task escalation": ["task escalation"],
  "ticket management": ["ticket management"],
  "escalation matrix": ["escalation matrix"],
  "cost approval": ["cost approval"],
  "inventory management": ["inventory management"],
  "sac/hsn code": ["sac/hsn setup", "pms_hsns"],
  "permit setup": ["permit setup"],
  "incident setup": ["incident setup"],
  "waste management": ["waste management"],
  "design insight setup": ["design insight setup"],
  finance: ["finance"],
  "wallet setup": ["wallet setup"],
  security: ["security"],
  "visitor management": ["visitor management"],
  "visiting purpose": ["visiting purpose"],
  "support staff": ["support staff"],
  "materials type": ["materials type"],
  "items name": ["items name"],
  "value added services": ["value added services"],
  mom: ["mom details", "mom_details"],
  "client tag setup": ["client tag setup"],
  "product tag setup": ["product tag setup"],
  "parking management": ["parking management"],
  "parking category": ["parking category"],
  "slot configuration": ["slot configuration"],
  "time slot setup": ["time slot setup"],

  // Additional mappings from your list
  "local travel module": ["local travel module", "ltm"],
  krcc: ["krcc", "krcc_list"],
  "approve krcc": ["approve krcc", "approve_krcc"],
  "vi register user": ["vi register user", "vi_register_user"],
  "vi deregister user": ["vi deregister user", "vi_deregister_user"],
  "goods in out": ["goods in out", "goods_in_out"],
  documents: ["documents", "pms_documents"],
  materials: ["materials", "pms_materials"],
  "meter types": ["meter types", "pms_meter_types"],
  "fm groups": ["fm groups", "pms_usergroups"],
  addresses: ["addresses", "pms_billing_addresses"],
  reports: ["reports", "pms_complaint_reports"],
  "business directory": ["business directory", "pms_business_directories"],
  "po approval": ["po approval", "pms_purchase_orders_approval"],
  accounts: ["accounts", "pms_accounts"],
  "bi reports": ["bi reports", "pms_bi_reports"],
  dashboard: [
    "dashboard",
    "pms_dashboard",
    "ceo dashboard",
    "pms_ceo_dashboard",
  ],
  tracing: ["tracing", "pms_tracings"],
  consumption: ["consumption", "pms_consumption"],
  restaurants: ["restaurants", "pms_restaurants"],
  "my ledgers": ["my ledgers", "pms_my_ledgers"],
  "letter of indent": ["letter of indent", "pms_loi"],
  "engineering reports": ["engineering reports", "pms_engineering_reports"],
  "ceo dashboard": ["ceo dashboard", "pms_ceo_dashboard"],
  "pms design inputs": ["pms design inputs", "pms_design_inputs"],
  "task management": ["task management", "task_management"],
  "quikgate report": ["quikgate report", "quikgate_report"],
  "customer bills": ["customer bills", "customer_bills"],
  "my bills": ["my bills", "my_bills"],
  "project management": ["project management", "project_management"],
  "pms incidents": ["pms incidents", "pms_incidents"],
  "site dashboard": ["site dashboard", "site_dashboard"],
  "stepathone dashboard": ["stepathone dashboard", "stepathone_dashboard"],
  transport: ["transport"],
  gdn: ["gdn"],
  "gdn dispatch": ["gdn dispatch", "gdn_dispatch"],
  "permit extend": ["permit extend", "permit_extend"],
  "line manager chec": ["line manager chec", "line_manager_check"],
  "senior management tour": ["senior management tour", "senior_manager_tour"],
  "customer parkings": ["customer parkings", "cus_parkings"],
  "customer wallet": ["customer wallet", "customer_wallet"],
  "site banner": ["site banner", "site_banners"],
  testimonials: ["testimonials", "testimonial"],
  "group and channel config": [
    "group and channel config",
    "group_and_chanel_config",
  ],
  "resume permit": ["resume permit", "permit_resume"],
  "non fte users": ["non fte users", "non_fte_users"],
  "download msafe report": ["download msafe report", "download_msafe_report"],
  "download msafe detailed report": [
    "download msafe detailed report",
    "download_msafe_detailed_report",
  ],
  "vi msafe dashboard": ["vi msafe dashboard", "vi_msafe_dashboard"],
  "vi miles dashboard": ["vi miles dashboard", "vi_miles_dashboard"],

  "pms usergroups": ["pms usergroups", "fm groups"],
  "pms occupant users": ["pms occupant users", "occupant users"],
  "pms user roles": ["pms user roles", "user & roles", "user roles"],
  pms_setup: [
    "pms_setup",
    "account",
    "location master",
    "unit master (by default)",
  ],
  pms_billing_addresses: [
    "pms_billing_addresses",
    "addresses",
    "address master",
  ],
  pms_materials: ["pms_materials", "materials", "material master -> ebom"],
  pms_master_checklist: [
    "pms_master_checklist",
    "master checklist",
    "checklist master",
  ],
  pms_energy: ["pms_energy", "energy", "meters"],
  pms_meter_types: ["pms_meter_types", "meter types"],
  pms_water: ["pms_water", "water"],
  pms_stp: ["pms_stp", "stp"],
  pms_daily_readings: ["pms_daily_readings", "daily readings"],
  pms_solar_generators: ["pms_solar_generators", "solar generator"],
  pms_tracings: ["pms_tracings", "tracing"],
  pms_services: ["pms_services", "service", "services", "soft services"],
  pms_tasks: ["pms_tasks", "task", "tasks"],
  pms_accounts: [
    "pms_accounts",
    "account",
    "accounts",
    "cost center",
    "budgeting",
  ],
  pms_assets: ["pms_assets", "asset", "assets"],
  pms_asset_amcs: ["pms_asset_amcs", "amc"],
  pms_attendances: ["pms_attendances", "attendance"],
  pms_supplier: ["pms_supplier", "supplier", "vendor"],
  pms_complaints: ["pms_complaints", "ticket", "tickets"],
  pms_complaint_reports: ["pms_complaint_reports", "reports"],
  pms_documents: ["pms_documents", "documents"],
  pms_purchase_orders: ["pms_purchase_orders", "po", "purchase orders"],
  pms_purchase_orders_approval: ["pms_purchase_orders_approval", "po approval"],
  pms_work_orders: ["pms_work_orders", "wo", "work orders"],
  pms_grns: ["pms_grns", "grn"],
  pms_srns: ["pms_srns", "srns"],
  pms_work_order_invoices: ["pms_work_order_invoices", "wo invoices"],
  pms_bills: ["pms_bills", "bill"],
  pms_budget_heads: ["pms_budget_heads", "budget heads"],
  pms_wbs: ["pms_wbs", "wbs"],
  pms_events: ["pms_events", "events"],
  pms_leads: ["pms_leads", "lead"],
  pms_opportunities: ["pms_opportunities", "opportunity"],
  pms_customers: ["pms_customers", "customers"],
  pms_groups: ["pms_groups", "groups"],
  pms_polls: ["pms_polls", "polls"],
  pms_campaigns: ["pms_campaigns", "campaign"],
  pms_visitors: ["pms_visitors", "visitors", "visitor"],
  pms_staffs: ["pms_staffs", "staffs", "staff"],
  pms_rvehicles: ["pms_rvehicles", "r vehicles"],
  pms_gvehicles: ["pms_gvehicles", "g vehicles"],
  pms_patrolling: ["pms_patrolling", "patrolling"],
  pms_occupant_users: ["pms_occupant_users", "occupant users"],
  "fm users": ["fm user", "user_master_fm_user"],
  pms_msafe: ["pms_msafe", "msafe", "m-safe", "m safe"],
  pms_safety: ["pms_safety", "safety"],
  pms_incidents: ["pms_incidents", "incident"],
  cus_permits: ["cus_permits", "permit"],
  cus_parkings: ["cus_parkings", "parking", "customer parkings"],
  customer_wallet: ["customer_wallet", "customer wallet"],
  pms_training: ["pms_training", "training", "training list"],
  pms_design_inputs: ["pms_design_inputs", "design insight", "design insights"],
  pms_asset_groups: [
    "pms_asset_groups",
    "asset groups",
    "asset group & sub group",
  ],
  pms_email_rule_setup: ["pms_email_rule_setup", "email rule setup"],
};
