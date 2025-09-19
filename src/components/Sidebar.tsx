import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { usePermissions } from "../contexts/PermissionsContext";
import { sidebarPermissionFilter } from "../utils/sidebarPermissionFilter";
import { permissionService } from "../services/permissionService";
import {
  Users,
  Settings,
  FileText,
  Building,
  Car,
  Shield,
  DollarSign,
  Clipboard,
  AlertTriangle,
  Bell,
  Package,
  Wrench,
  BarChart3,
  Calendar,
  Clock,
  CheckSquare,
  MapPin,
  Truck,
  Phone,
  Globe,
  CreditCard,
  Receipt,
  Calculator,
  PieChart,
  UserCheck,
  Database,
  Zap,
  Droplets,
  Trash2,
  Sun,
  Battery,
  Gauge,
  Video,
  Lock,
  Key,
  Eye,
  ShieldCheck,
  Headphones,
  Gift,
  Star,
  MessageSquare,
  Coffee,
  Wifi,
  Home,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Briefcase,
  BookOpen,
  FileSpreadsheet,
  Target,
  Archive,
  TreePine,
  FlaskConical,
  Mail,
  ClipboardList,
  Currency,
  User,
  BarChart,
  UserRoundPen,
  DoorOpen,
  PackagePlus,
  Ticket,
  Trash,
} from "lucide-react";

const navigationStructure = {
  Settings: {
    icon: Settings,
    items: [
      {
        name: "Account",
        icon: Users,
        subItems: [
          { name: "General", href: "/settings/account/general" },
          {
            name: "Holiday Calendar",
            href: "/settings/account/holiday-calendar",
          },
          { name: "About", href: "/settings/account/about", isActive: true },
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
        subItems: [
          { name: "Department", href: "/settings/roles/department" },
          { name: "Role", href: "/settings/roles/role" },
        ],
      },
      {
        name: "Approval Matrix",
        icon: CheckSquare,
        subItems: [{ name: "Setup", href: "/settings/approval-matrix/setup" }],
      },
      {
        name: "Value Added Services",
        icon: Star,
        subItems: [
          {
            name: "MOM",
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
            subItems: [
              {
                name: "Seat Setup",
                href: "/settings/vas/space-management/seat-setup",
              },
            ],
          },
          {
            name: "Booking",
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
  },
  Maintenance: {
    icon: Wrench,
    items: [
      {
        name: "Asset Setup",
        icon: Building,
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
        icon: CheckSquare,
        subItems: [
          {
            name: "Checklist Group & Sub Group",
            href: "/settings/checklist-setup/groups",
          },
          { name: "Email Rule", href: "/settings/checklist-setup/email-rule" },
          {
            name: "Task Escalation",
            href: "/settings/checklist-setup/task-escalation",
          },
        ],
      },
      {
        name: "Ticket Management",
        icon: FileText,
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
        icon: Package,
        subItems: [
          {
            name: "SAC/HSN Code",
            href: "/settings/inventory-management/sac-hsn-code",
          },
        ],
      },
      {
        name: "Safety",
        icon: Shield,
        href: "/maintenance/safety",
      },
      {
        name: "Permit",
        icon: FileText,
        subItems: [
          { name: "Permit Setup", href: "/settings/safety/permit-setup" },
        ],
      },
      {
        name: "Incident",
        icon: AlertTriangle,
        subItems: [{ name: "Setup", href: "/settings/safety/incident" }],
      },
      {
        name: "Waste Management",
        icon: Trash2,
        subItems: [{ name: "Setup", href: "/settings/waste-management/setup" }],
      },
    ],
  },
  Finance: {
    icon: DollarSign,
    items: [
      {
        name: "Wallet Setup",
        icon: CreditCard,
        href: "/finance/wallet-setup",
      },
    ],
  },
  Security: {
    icon: Shield,
    items: [
      {
        name: "Visitor Management",
        icon: Users,
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
           {
            name: "Icons",
            href: "/settings/visitor-management/icons",
          },
        ],
      },
      {
        name: "Gate Pass",
        icon: Car,
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
};

const modulesByPackage = {
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
        name: 'Gate Number',
        icon: DoorOpen,
        href: '/master/gate-number'
      },
      // {
      //   name: 'Gate Pass Type',
      //   icon: Ticket,
      //   href: '/master/gate-pass-type'
      // }
      // {
      //   name: 'Inventory Type',
      //   icon: Package,
      //   href: '/master/inventory-type'
      // },
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
        // { name: 'Eco-Friendly List', href: '/maintenance/eco-friendly-list', color: 'text-[#1a1a1a]' }
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
            { name: 'Employee Deletion History', icon: Trash, href: '/maintenance/employee-deletion-history' },

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

    // { name: 'SMT', icon: BarChart, href: '/maintenance/smt' },

    // { name: 'Design Insight Setup', icon: Target, href: '/settings/design-insights/setup' }
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
      icon: Car,
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
    {
      name: "Patrolling",
      icon: Shield,
      href: "/security/patrolling",
    },
  ],
  "Value Added Services": [
    { name: "F&B", icon: Coffee, href: "/vas/fnb" },
    { name: "Parking", icon: Car, href: "/vas/parking" },
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
    // {
    //   name: 'Currency',
    //   icon: Currency,
    //   href: '/settings/currency',
    // }
  ],
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentSection,
    setCurrentSection,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useLayout();
  const {
    userRole,
    loading: permissionsLoading,
    hasPermissionForPath,
  } = usePermissions();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedDepartment, setSelectedRole] = useState("");
  const [selectedRole, setSelectedDepartment] = useState("");

  // Helper function to find the deepest navigable sub-item
  const findDeepestNavigableItem = (item: any): string | null => {
    if (!item.subItems || item.subItems.length === 0) {
      return item.href || null;
    }
    
    // Check if any sub-item has further sub-items
    for (const subItem of item.subItems) {
      if (subItem.subItems && subItem.subItems.length > 0) {
        // Recursively find the deepest item
        const deepest = findDeepestNavigableItem(subItem);
        if (deepest) return deepest;
      }
    }
    
    // If no deeper items, return the first sub-item's href
    return item.subItems[0]?.href || null;
  };

  // Smart dynamic permission check using actual API response
  const checkPermission = React.useCallback((checkItem: any) => {
    // If no user role data, show all items
    if (!userRole) {
      return true;
    }

    // Extract active functions from the API response
    const activeFunctions = [];
    
    // Check if we have the new flat structure (activeFunctions)
    if (userRole.activeFunctions && Array.isArray(userRole.activeFunctions)) {
      activeFunctions.push(...userRole.activeFunctions);
    }
    
    // Also check the old lock_modules structure as fallback
    if (userRole.lock_modules && Array.isArray(userRole.lock_modules)) {
      userRole.lock_modules.forEach(module => {
        if (module.module_active && module.lock_functions) {
          module.lock_functions.forEach(func => {
            if (func.function_active) {
              activeFunctions.push({
                functionName: func.function_name,
                actionName: func.function_name.toLowerCase().replace(/\s+/g, '_')
              });
            }
          });
        }
      });
    }

    // If no active functions found, show all items
    if (activeFunctions.length === 0) {
      return true;
    }

    // Function to create search variants for matching
    const createSearchVariants = (name: string): string[] => {
      const variants = new Set([name]);
      const normalized = name.toLowerCase();
      
      variants.add(normalized);
      variants.add(normalized.replace(/\s+/g, '_'));
      variants.add(normalized.replace(/\s+/g, '-'));
      variants.add(normalized.replace(/\s+/g, ''));
      variants.add(normalized.replace(/_/g, ' '));
      variants.add(normalized.replace(/_/g, '-'));
      variants.add(normalized.replace(/-/g, ' '));
      variants.add(normalized.replace(/-/g, '_'));
      
      return Array.from(variants);
    };

    // Create mapping of sidebar item names to their potential function matches
    const sidebarMappings = {
      // Main Categories
      'broadcast': ['broadcast', 'pms_notices'],
      'ticket': ['tickets', 'ticket', 'pms_complaints', 'pms_helpdesk_categories'],
      'msafe': ['msafe', 'pms_msafe', 'pms_safety', 'pmssafety'],
      'm-safe': ['msafe', 'pms_msafe', 'pms_safety', 'pmssafety'],
      'm safe': ['msafe', 'pms_msafe', 'pms_safety', 'pmssafety'],
      'task': ['task', 'tasks', 'pms_tasks'],
      'tasks': ['task', 'tasks', 'pms_tasks'],
      'schedule': ['schedule', 'pms_schedule'],
      'soft services': ['service', 'services', 'pms_services'],
      'service': ['service', 'services', 'pms_services'],
      'services': ['service', 'services', 'pms_services'],
      'assets': ['asset', 'assets', 'pms_assets'],
      'inventory': ['inventory', 'pms_inventories'],
      'inventory master': ['inventory', 'pms_inventories'],
      'inventory consumption': ['consumption', 'pms_consumption'],
      'amc': ['amc', 'pms_asset_amcs'],
      'attendance': ['attendance', 'pms_attendances'],
      'vendor': ['supplier', 'pms_supplier', 'vendor audit', 'vendor_audit'],
      'supplier': ['supplier', 'pms_supplier'],
      
      // Master Data
      'location master': ['account', 'pms_setup'],
      'user master': ['user & roles', 'pms_user_roles', 'occupant users', 'pms_occupant_users'],
      'fm user': ['user & roles', 'pms_user_roles'],
      'occupant users': ['occupant users', 'pms_occupant_users'],
      'checklist master': ['master checklist', 'pms_master_checklist'],
      'address master': ['addresses', 'pms_billing_addresses'],
      'unit master (by default)': ['pms_setup'],
      'material master -> ebom': ['materials', 'pms_materials'],
      'gate number': ['gate', 'gate_number'],
      
      // Building/Location Elements
      'account': ['account', 'accounts', 'pms_accounts', 'pms_setup'],
      'building': ['building', 'buildings'],
      'wing': ['wing', 'wings'],
      'area': ['area', 'areas'],
      'floor': ['floor', 'floors'],
      'unit': ['unit', 'units'],
      'room': ['room', 'rooms'],
      
      // Transitioning
      'hoto': ['hoto'],
      'snagging': ['snagging'],
      'user snag': ['snagging'],
      'my snags': ['snagging'],
      'design insight': ['design insight', 'pms_design_inputs'],
      'fitout': ['fitout'],
      'fitout setup': ['fitout'],
      'fitout request': ['fitout'],
      'fitout checklist': ['fitout'],
      'fitout violation': ['fitout'],
      
      // Audit
      'audit': ['operational audit', 'operational_audits', 'vendor audit', 'vendor_audit'],
      'operational': ['operational audit', 'operational_audits'],
      'operational audit': ['operational audit', 'operational_audits'],
      'vendor audit': ['vendor audit', 'vendor_audit'],
      'scheduled': ['schedule', 'pms_schedule'],
      'conducted': ['conducted'],
      'master checklists': ['master checklist', 'pms_master_checklist'],
      
      // Waste Management
      'waste': ['waste generation', 'waste_generation'],
      'waste generation': ['waste generation', 'waste_generation'],
      
      // Survey
      'survey': ['survey'],
      'survey list': ['survey'],
      'survey mapping': ['survey'],
      'response': ['survey'],
      
      // M-Safe specific
      'internal user (fte)': ['msafe', 'pms_msafe'],
      'external user (non fte)': ['non fte users', 'non_fte_users'],
      'lmc': ['line manager check', 'line_manager_check'],
      'smt': ['senior management tour', 'senior_manager_tour'],
      'krcc list': ['krcc list', 'krcc_list', 'krcc'],
      'training list': ['training list', 'training_list', 'pms_training'],
      'reportees reassign': ['reportees reassign'],
      
      // Vi Miles
      'vi miles': ['vi miles', 'vi_miles'],
      'vehicle details': ['vi miles', 'vi_miles'],
      'vehicle check in': ['vi miles', 'vi_miles'],
      
      // Reports
      'employee deletion history': ['employee deletion history'],
      'msafe report': ['download msafe report', 'download_msafe_report'],
      'msafe detail report': ['download msafe detailed report', 'download_msafe_detailed_report'],
      
      // Safety
      'incident': ['pms incidents', 'pms_incidents'],
      'permit': ['permits', 'cus_permits'],
      'pending approvals': ['pending approvals', 'pending_approvals'],
      'training': ['training', 'training_list', 'pms_training'],
      
      // Finance/Procurement
      'procurement': ['po', 'pms_purchase_orders', 'wo', 'pms_work_orders'],
      'pr/ sr': ['procurement'],
      'material pr': ['po', 'pms_purchase_orders'],
      'service pr': ['wo', 'pms_work_orders'],
      'po/wo': ['po', 'pms_purchase_orders', 'wo', 'pms_work_orders'],
      'po': ['po', 'pms_purchase_orders'],
      'wo': ['wo', 'pms_work_orders'],
      'grn/ srn': ['grn', 'pms_grns', 'srns', 'pms_srns'],
      'grn': ['grn', 'pms_grns'],
      'srns': ['srns', 'pms_srns'],
      'auto saved pr': ['po', 'pms_purchase_orders'],
      'invoices': ['wo invoices', 'pms_work_order_invoices'],
      'wo invoices': ['wo invoices', 'pms_work_order_invoices'],
      'bill booking': ['bill', 'pms_bills'],
      'bill': ['bill', 'pms_bills'],
      'accounting': ['accounts', 'pms_accounts'],
      'cost center': ['accounts', 'pms_accounts'],
      'budgeting': ['accounts', 'pms_accounts'],
      'wbs': ['wbs'],
      
      // CRM
      'lead': ['lead'],
      'opportunity': ['opportunity'],
      'crm': ['customers'],
      'customers': ['customers'],
      'fm users': ['user & roles', 'pms_user_roles'],
      'events': ['events', 'pms_events'],
      'groups': ['groups'],
      'polls': ['polls'],
      'campaign': ['campaign'],
      
      // Utility
      'energy': ['meters', 'pms_energy'],
      'meters': ['meters', 'pms_energy'],
      'water': ['water', 'pms_water'],
      'stp': ['stp', 'pms_stp'],
      'daily readings': ['daily readings', 'daily_readings'],
      'utility request': ['utility request', 'utility_request'],
      'utility consumption': ['utility consumption', 'utility_consumption'],
      'ev consumption': ['ev consumption', 'ev_consumption'],
      'solar generator': ['solar generator', 'solar_generators'],
      
      // Security
      'gate pass': ['gate pass'],
      'inwards': ['gate pass'],
      'outwards': ['gate pass'],
      'visitor': ['visitors', 'pms_visitors'],
      'visitors': ['visitors', 'pms_visitors'],
      'staff': ['staffs', 'pms_staffs'],
      'staffs': ['staffs', 'pms_staffs'],
      'vehicle': ['r vehicles', 'pms_rvehicles', 'g vehicles', 'pms_gvehicles'],
      'r vehicles': ['r vehicles', 'pms_rvehicles'],
      'g vehicles': ['g vehicles', 'pms_gvehicles'],
      'all': ['r vehicles', 'pms_rvehicles'],
      'history': ['r vehicles', 'pms_rvehicles'],
      'patrolling': ['patrolling', 'pms_patrolling'],
      
      // Value Added Services
      'f&b': ['fnb'],
      'parking': ['parking', 'cus_parkings'],
      'osr': ['osr'],
      'space management': ['space'],
      'space': ['space'],
      'bookings': ['booking'],
      'seat requests': ['seat requests'],
      'setup': ['setup'],
      'seat type': ['seat type'],
      'seat setup': ['seat setup'],
      'shift': ['shift'],
      'roster': ['roster'],
      'employees': ['employees'],
      'check in margin': ['check in margin'],
      'roster calendar': ['roster calendar'],
      'export': ['export', 'pms_export'],
      'booking': ['booking'],
      'redemption marketplace': ['marketplace'],
      
      // Market Place
      'marketplace_all': ['marketplace'],
      'installed': ['marketplace'],
      'updates': ['marketplace'],
      
      // Settings
      'general': ['general'],
      'holiday calendar': ['holiday calendar'],
      'about': ['about'],
      'language': ['language'],
      'company logo upload': ['company logo'],
      'report setup': ['report setup'],
      'notification setup': ['notification setup'],
      'lock module': ['lock module'],
      'lock function': ['lock function'],
      'lock sub function': ['lock sub function'],
      'roles (raci)': ['user roles', 'pms_user_roles'],
      'user roles': ['user roles', 'pms_user_roles'],
      'department': ['department'],
      'role': ['role'],
      'approval matrix': ['approval matrix'],
      'maintenance': ['maintenance'],
      'asset setup': ['asset setup'],
      'asset group & sub group': ['asset groups', 'pms_asset_groups'],
      'checklist setup': ['checklist setup'],
      'checklist group & sub group': ['checklist setup'],
      'email rule': ['email rule', 'pms_email_rule_setup'],
      'task escalation': ['task escalation'],
      'ticket management': ['ticket management'],
      'escalation matrix': ['escalation matrix'],
      'cost approval': ['cost approval'],
      'inventory management': ['inventory management'],
      'sac/hsn code': ['sac/hsn setup', 'pms_hsns'],
      'permit setup': ['permit setup'],
      'incident setup': ['incident setup'],
      'waste management': ['waste management'],
      'design insight setup': ['design insight setup'],
      'finance': ['finance'],
      'wallet setup': ['wallet setup'],
      'security': ['security'],
      'visitor management': ['visitor management'],
      'visiting purpose': ['visiting purpose'],
      'support staff': ['support staff'],
      'materials type': ['materials type'],
      'items name': ['items name'],
      'value added services': ['value added services'],
      'mom': ['mom details', 'mom_details'],
      'client tag setup': ['client tag setup'],
      'product tag setup': ['product tag setup'],
      'parking management': ['parking management'],
      'parking category': ['parking category'],
      'slot configuration': ['slot configuration'],
      'time slot setup': ['time slot setup'],
      
      // Additional mappings from your list
      'local travel module': ['local travel module', 'ltm'],
      'krcc': ['krcc', 'krcc_list'],
      'approve krcc': ['approve krcc', 'approve_krcc'],
      'vi register user': ['vi register user', 'vi_register_user'],
      'vi deregister user': ['vi deregister user', 'vi_deregister_user'],
      'goods in out': ['goods in out', 'goods_in_out'],
      'documents': ['documents', 'pms_documents'],
      'materials': ['materials', 'pms_materials'],
      'meter types': ['meter types', 'pms_meter_types'],
      'fm groups': ['fm groups', 'pms_usergroups'],
      'addresses': ['addresses', 'pms_billing_addresses'],
      'reports': ['reports', 'pms_complaint_reports'],
      'business directory': ['business directory', 'pms_business_directories'],
      'po approval': ['po approval', 'pms_purchase_orders_approval'],
      'accounts': ['accounts', 'pms_accounts'],
      'bi reports': ['bi reports', 'pms_bi_reports'],
      'dashboard': ['dashboard', 'pms_dashboard', 'ceo dashboard', 'pms_ceo_dashboard'],
      'tracing': ['tracing', 'pms_tracings'],
      'consumption': ['consumption', 'pms_consumption'],
      'restaurants': ['restaurants', 'pms_restaurants'],
      'my ledgers': ['my ledgers', 'pms_my_ledgers'],
      'letter of indent': ['letter of indent', 'pms_loi'],
      'engineering reports': ['engineering reports', 'pms_engineering_reports'],
      'ceo dashboard': ['ceo dashboard', 'pms_ceo_dashboard'],
      'pms design inputs': ['pms design inputs', 'pms_design_inputs'],
      'task management': ['task management', 'task_management'],
      'quikgate report': ['quikgate report', 'quikgate_report'],
      'customer bills': ['customer bills', 'customer_bills'],
      'my bills': ['my bills', 'my_bills'],
      'project management': ['project management', 'project_management'],
      'pms incidents': ['pms incidents', 'pms_incidents'],
      'site dashboard': ['site dashboard', 'site_dashboard'],
      'stepathone dashboard': ['stepathone dashboard', 'stepathone_dashboard'],
      'transport': ['transport'],
      'gdn': ['gdn'],
      'gdn dispatch': ['gdn dispatch', 'gdn_dispatch'],
      'permit extend': ['permit extend', 'permit_extend'],
      'line manager chec': ['line manager chec', 'line_manager_check'],
      'senior management tour': ['senior management tour', 'senior_manager_tour'],
      'customer parkings': ['customer parkings', 'cus_parkings'],
      'customer wallet': ['customer wallet', 'customer_wallet'],
      'site banner': ['site banner', 'site_banners'],
      'testimonials': ['testimonials', 'testimonial'],
      'group and channel config': ['group and channel config', 'group_and_chanel_config'],
      'resume permit': ['resume permit', 'permit_resume'],
      'non fte users': ['non fte users', 'non_fte_users'],
      'download msafe report': ['download msafe report', 'download_msafe_report'],
      'download msafe detailed report': ['download msafe detailed report', 'download_msafe_detailed_report'],
      'vi msafe dashboard': ['vi msafe dashboard', 'vi_msafe_dashboard'],
      'vi miles dashboard': ['vi miles dashboard', 'vi_miles_dashboard'],



      'pms usergroups': ['pms usergroups', 'fm groups'],
      'pms occupant users': ['pms occupant users', 'occupant users'],
      'pms user roles': ['pms user roles', 'user & roles', 'user roles'],
      'pms_setup': ['pms_setup', 'account', 'location master', 'unit master (by default)'],
      'pms_billing_addresses': ['pms_billing_addresses', 'addresses', 'address master'],
      'pms_materials': ['pms_materials', 'materials', 'material master -> ebom'],
      'pms_master_checklist': ['pms_master_checklist', 'master checklist', 'checklist master'],
      'pms_energy': ['pms_energy', 'energy', 'meters'],
      'pms_meter_types': ['pms_meter_types', 'meter types'],
      'pms_water': ['pms_water', 'water'],
      'pms_stp': ['pms_stp', 'stp'],
      'pms_daily_readings': ['pms_daily_readings', 'daily readings'],
      'pms_solar_generators': ['pms_solar_generators', 'solar generator'],
      'pms_tracings': ['pms_tracings', 'tracing'],
      'pms_services': ['pms_services', 'service', 'services', 'soft services'],
      'pms_tasks': ['pms_tasks', 'task', 'tasks'],
      'pms_accounts': ['pms_accounts', 'account', 'accounts', 'cost center', 'budgeting'],
      'pms_assets': ['pms_assets', 'asset', 'assets'],
      'pms_asset_amcs': ['pms_asset_amcs', 'amc'],
      'pms_attendances': ['pms_attendances', 'attendance'],
      'pms_supplier': ['pms_supplier', 'supplier', 'vendor'],
      'pms_complaints': ['pms_complaints', 'ticket', 'tickets'],
      'pms_complaint_reports': ['pms_complaint_reports', 'reports'],
      'pms_documents': ['pms_documents', 'documents'],
      'pms_purchase_orders': ['pms_purchase_orders', 'po', 'purchase orders'],
      'pms_purchase_orders_approval': ['pms_purchase_orders_approval', 'po approval'],
      'pms_work_orders': ['pms_work_orders', 'wo', 'work orders'],
      'pms_grns': ['pms_grns', 'grn'],
      'pms_srns': ['pms_srns', 'srns'],
      'pms_work_order_invoices': ['pms_work_order_invoices', 'wo invoices'],
      'pms_bills': ['pms_bills', 'bill'],
      'pms_budget_heads': ['pms_budget_heads', 'budget heads'],
      'pms_wbs': ['pms_wbs', 'wbs'],
      'pms_events': ['pms_events', 'events'],
      'pms_leads': ['pms_leads', 'lead'],
      'pms_opportunities': ['pms_opportunities', 'opportunity'],
      'pms_customers': ['pms_customers', 'customers'],
      'pms_groups': ['pms_groups', 'groups'],
      'pms_polls': ['pms_polls', 'polls'],
      'pms_campaigns': ['pms_campaigns', 'campaign'],
      'pms_visitors': ['pms_visitors', 'visitors', 'visitor'],
      'pms_staffs': ['pms_staffs', 'staffs', 'staff'],
      'pms_rvehicles': ['pms_rvehicles', 'r vehicles'],
      'pms_gvehicles': ['pms_gvehicles', 'g vehicles'],
      'pms_patrolling': ['pms_patrolling', 'patrolling'],
      'pms_occupant_users': ['pms_occupant_users', 'occupant users'],
      'pms_msafe': ['pms_msafe', 'msafe', 'm-safe', 'm safe'],
      'pms_safety': ['pms_safety', 'safety'],
      'pms_incidents': ['pms_incidents', 'incident'],
      'cus_permits': ['cus_permits', 'permit'],
      'cus_parkings': ['cus_parkings', 'parking', 'customer parkings'],
      'customer_wallet': ['customer_wallet', 'customer wallet'],
      'pms_training': ['pms_training', 'training', 'training list'],
      'pms_design_inputs': ['pms_design_inputs', 'design insight', 'design insights'],
      'pms_asset_groups': ['pms_asset_groups', 'asset groups', 'asset group & sub group'],
      'pms_email_rule_setup': ['pms_email_rule_setup', 'email rule setup'],
    };
    // Get the item name for checking
    const itemNameLower = checkItem.name.toLowerCase();
    
    // Find potential matches for this sidebar item
    let potentialMatches = sidebarMappings[itemNameLower] || [];
    
    // Also add the item name itself as a potential match
    potentialMatches.push(...createSearchVariants(checkItem.name));

    // Check if any active function matches this sidebar item
    const hasPermission = activeFunctions.some(activeFunc => {
      const funcVariants = createSearchVariants(activeFunc.functionName);
      const actionVariants = createSearchVariants(activeFunc.actionName);
      
      return potentialMatches.some(match => {
        const matchVariants = createSearchVariants(match);
        return (
          funcVariants.some(fv => matchVariants.some(mv => 
            fv.includes(mv) || mv.includes(fv) || fv === mv
          )) ||
          actionVariants.some(av => matchVariants.some(mv => 
            av.includes(mv) || mv.includes(av) || av === mv
          ))
        );
      });
    });

    // If item has no specific mapping and no href, show it (likely a parent category)
    if (!checkItem.href && potentialMatches.length <= createSearchVariants(checkItem.name).length) {
      return true;
    }

    return hasPermission;
  }, [userRole]);

  // Filter modules based on user permissions
  const filteredModulesByPackage = React.useMemo(() => {
    if (!userRole) {
      console.log("📊 Available sidebar sections: ALL (no user role)");
      return modulesByPackage;
    }
    
    // Convert object to format that can be filtered
    const filtered = {};
    
    Object.entries(modulesByPackage).forEach(([sectionName, items]) => {
      const filteredItems = items
        .map((item) => ({
          ...item,
          subItems: item.subItems ? item.subItems.filter(checkPermission) : [],
        }))
        .filter(checkPermission);
        
      if (filteredItems.length > 0) {
        filtered[sectionName] = filteredItems;
      }
    });
    
    // Debug output for filtered results
    console.log("🎯 Sidebar Filtering Results:");
    Object.entries(filtered).forEach(([sectionName, items]: [string, any[]]) => {
      console.log(`📦 ${sectionName}: ${items.length} items`);
      items.forEach(item => {
        console.log(`  ✅ ${item.name}${item.subItems && item.subItems.length > 0 ? ` (${item.subItems.length} sub-items)` : ''}`);
      });
    });
    
    return filtered;
  }, [modulesByPackage, userRole, checkPermission]);

  // Reset expanded items on page load/refresh
  React.useEffect(() => {
    setExpandedItems([]);
  }, []);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  // Close all expanded items when sidebar is collapsed
  React.useEffect(() => {
    if (isSidebarCollapsed) {
      setExpandedItems([]);
    }
  }, [isSidebarCollapsed]);

  const handleNavigation = (href: string, section?: string) => {
    if (section && section !== currentSection) {
      setCurrentSection(section);
    }
    navigate(href);
  };

  React.useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/settings")) {
      setCurrentSection("Settings");
    } else if (path.startsWith("/utility")) {
      setCurrentSection("Utility");
    } else if (path.startsWith("/transitioning")) {
      setCurrentSection("Transitioning");
    } else if (path.startsWith("/security")) {
      setCurrentSection("Security");
    } else if (path.startsWith("/vas")) {
      setCurrentSection("Value Added Services");
    } else if (path.startsWith("/finance")) {
      setCurrentSection("Finance");
    } else if (path.startsWith("/maintenance")) {
      setCurrentSection("Maintenance");
    } else if (path.startsWith("/safety")) {
      setCurrentSection("Safety");
    } else if (path.startsWith("/crm")) {
      setCurrentSection("CRM");
    } else if (path.startsWith("/market-place")) {
      setCurrentSection("Market Place");
    } else if (path.startsWith("/master")) {
      setCurrentSection("Master");
    }
  }, [location.pathname, setCurrentSection]);

  const currentModules = filteredModulesByPackage[currentSection] || [];

  const isActiveRoute = (href: string) => {
    const currentPath = location.pathname;
    const isActive = currentPath === href || currentPath.startsWith(href + "/");

    // Debug logging for Services
    if (href === "/maintenance/service") {
      console.log("Services route check:", {
        currentPath,
        href,
        exactMatch: currentPath === href,
        prefixMatch: currentPath.startsWith(href + "/"),
        isActive,
      });
    }

    return isActive;
  };

  // Auto-expand functionality for all sections
  React.useEffect(() => {
    // Determine which items to expand based on current route
    const path = location.pathname;
    const currentSectionItems = filteredModulesByPackage[currentSection];
    const itemsToExpand = [];

    if (currentSectionItems) {
      // Find the active item and its parent
      currentSectionItems.forEach((item) => {
        if (item.href && path.startsWith(item.href)) {
          itemsToExpand.push(item.name);
        }
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            if (subItem.href && path.startsWith(subItem.href)) {
              itemsToExpand.push(item.name); // Add parent
              itemsToExpand.push(subItem.name);

              // If there are nested items
              if ((subItem as any).subItems) {
                (subItem as any).subItems.forEach((nestedItem: any) => {
                  if (nestedItem.href && path.startsWith(nestedItem.href)) {
                    itemsToExpand.push(subItem.name);
                  }
                });
              }
            } else if ((subItem as any).subItems) {
              // Check nested items for parking management and other nested structures
              (subItem as any).subItems.forEach((nestedItem: any) => {
                if (nestedItem.href && path.startsWith(nestedItem.href)) {
                  itemsToExpand.push(item.name); // Add top parent (Value Added Services)
                  itemsToExpand.push(subItem.name); // Add middle parent (Parking Management)
                }
              });
            }
          });
        }
      });

      // Update expanded items state with only the active path
      setExpandedItems(itemsToExpand);
    }
    
    // Debug logging for API response structure
    if (userRole) {
      console.log("🔍 User Role API Response Structure:");
      
      // Check for new flat structure
      if (userRole.activeFunctions) {
        console.log("📋 Active Functions (new structure):", userRole.activeFunctions.slice(0, 5), userRole.activeFunctions.length > 5 ? `... and ${userRole.activeFunctions.length - 5} more` : '');
      }
      
      // Check for old lock_modules structure
      if (userRole.lock_modules) {
        console.log("📦 Lock Modules (old structure):");
        userRole.lock_modules.forEach((module, idx) => {
          if (idx < 3) { // Show first 3 modules
            console.log(`  - ${module.module_name} (active: ${module.module_active})`);
            if (module.lock_functions && module.lock_functions.length > 0) {
              module.lock_functions.slice(0, 2).forEach(func => {
                console.log(`    - ${func.function_name} (active: ${func.function_active})`);
              });
            }
          }
        });
        if (userRole.lock_modules.length > 3) {
          console.log(`  ... and ${userRole.lock_modules.length - 3} more modules`);
        }
      }
    }
    
    // Debug logs (commented out to reduce console noise)
    // console.log("currentSection:", JSON.stringify({ currentSection }, null, 2));
    // console.log("itemsToExpand:", JSON.stringify({ itemsToExpand }, null, 2));
    // console.log("path:", JSON.stringify({ path }, null, 2));
    // console.log("expandedItems:", JSON.stringify({ expandedItems }, null, 2));
    // console.log("currentSectionItems:", JSON.stringify({ currentSectionItems }, null, 2));
    // console.log("locationPathname:", JSON.stringify({ locationPathname: location.pathname }, null, 2));
    // console.log("filteredModulesByPackage:", JSON.stringify({ filteredModulesByPackage }, null, 2));
    // console.log("modulesByPackage:", JSON.stringify({ modulesByPackage }, null, 2));
    // console.log("userRole:", JSON.stringify({ userRole }, null, 2));
    // console.log("hasPermissionForPath:", JSON.stringify({ hasPermissionForPath }, null, 2));
    // console.log("permissionsLoading:", JSON.stringify({ permissionsLoading }, null, 2));

  }, [currentSection, location.pathname]);

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const showDropdowns =
      item.hasDropdowns && item.href && location.pathname === item.href;
    const isActive = item.href ? isActiveRoute(item.href) : false;

    // Check permission for current item
    if (!checkPermission(item)) {
      return null; // Don't render if no permission
    }

    if (hasSubItems) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
          >
            <div className="flex items-center gap-3">
              {level === 0 && (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                  )}
                  <item.icon className="w-5 h-5" />
                </>
              )}
              {item.name}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="space-y-1">
              {item.subItems.map((subItem: any) => {
                // Check permission for sub-item
                if (!checkPermission(subItem)) {
                  return null; // Don't render if no permission
                }

                return (
                  <div
                    key={subItem.name}
                    className={level === 0 ? "ml-8" : "ml-4"}
                  >
                    {subItem.subItems ? (
                      <div>
                        <button
                          onClick={() => toggleExpanded(subItem.name)}
                          className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
                        >
                          {subItem.href && isActiveRoute(subItem.href) && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                          )}
                          <span>{subItem.name}</span>
                          {expandedItems.includes(subItem.name) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        {expandedItems.includes(subItem.name) && (
                          <div className="ml-4 mt-1 space-y-1">
                            {subItem.subItems.map((nestedItem: any) => {
                              // Check permission for nested item
                              if (!checkPermission(nestedItem)) {
                                return null; // Don't render if no permission
                              }

                              return (
                                <button
                                  key={nestedItem.name}
                                  onClick={() =>
                                    handleNavigation(nestedItem.href)
                                  }
                                  className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[#DBC2A9] relative ${
                                    nestedItem.color || "text-[#1a1a1a]"
                                  }`}
                                >
                                  {isActiveRoute(nestedItem.href) && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                                  )}
                                  {nestedItem.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleNavigation(subItem.href, currentSection)
                        }
                        className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${
                          subItem.color || "text-[#1a1a1a]"
                        }`}
                      >
                        {isActiveRoute(subItem.href) && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                        )}
                        {subItem.name}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.name}>
        <button
          onClick={() =>
            item.href && handleNavigation(item.href, currentSection)
          }
          className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${
            item.color || "text-[#1a1a1a]"
          }`}
        >
          {level === 0 && (
            <>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
              )}
              <item.icon className="w-5 h-5" />
            </>
          )}
          {item.name}
        </button>

        {/* Show dropdowns for Roles (RACI) when on that page */}
        {showDropdowns && (
          <div className="mt-4 space-y-3 px-3">
            <div>
              <label className="text-xs font-medium text-[#1a1a1a] mb-1 block">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="!w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#C72030]"
              >
                <option value="">Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="facilities">Facilities</option>
                <option value="security">Security</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#1a1a1a] mb-1 block">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="!w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#C72030]"
              >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="supervisor">Supervisor</option>
                <option value="technician">Technician</option>
                <option value="coordinator">Coordinator</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CollapsedMenuItem = ({ module, level = 0 }) => {
    const hasSubItems = module.subItems && module.subItems.length > 0;
    const isExpanded = expandedItems.includes(module.name);
    const active = module.href ? isActiveRoute(module.href) : false;

    return (
      <>
        <button
          key={module.name}
          onClick={() => {
            if (hasSubItems) {
              // Navigate to the deepest navigable sub-item's href if it exists
              const deepestHref = findDeepestNavigableItem(module);
              if (deepestHref) {
                handleNavigation(deepestHref, currentSection);
              } else {
                toggleExpanded(module.name);
              }
            } else if (module.href) {
              handleNavigation(module.href, currentSection);
            }
          }}
          className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${
            active || isExpanded
              ? "bg-[#f0e8dc] shadow-inner"
              : "hover:bg-[#DBC2A9]"
          }`}
          title={module.name}
        >
          {(active || isExpanded) && (
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
          )}
          {level === 0 ? (
            <module.icon
              className={`w-5 h-5 ${
                active || isExpanded ? "text-[#C72030]" : "text-[#1a1a1a]"
              }`}
            />
          ) : (
            <div
              className={`w-${3 - level} h-${
                3 - level
              } rounded-full bg-[#1a1a1a]`}
            ></div>
          )}
        </button>
        {isExpanded &&
          hasSubItems &&
          module.subItems.map((subItem) => (
            <CollapsedMenuItem
              key={`${module.name}-${subItem.name}`}
              module={subItem}
              level={level + 1}
            />
          ))}
      </>
    );
  };

  return (
    <div
      className={`${
        isSidebarCollapsed ? "w-16" : "w-64"
      } bg-[#f6f4ee] border-r border-\[\#D5DbDB\]  fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
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
        <div className="w-full h-4 bg-[#f6f4ee]  border-[#e5e1d8] mb-2"></div>

        {currentSection && (
          <div className={`mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
            <h3
              className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${
                isSidebarCollapsed ? "text-center" : "tracking-wide"
              }`}
            >
              {isSidebarCollapsed ? "" : currentSection}
            </h3>
          </div>
        )}

        <nav className="space-y-2">
          {permissionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-[#1a1a1a] opacity-70">
                Loading permissions...
              </div>
            </div>
          ) : currentSection === "Settings" ? (
            isSidebarCollapsed ? (
              <div className="flex flex-col items-center space-y-3 pt-4">
                {currentModules.map((module) => (
                  <CollapsedMenuItem key={module.name} module={module} />
                ))}
              </div>
            ) : (
              currentModules.map((module) => renderMenuItem(module))
            )
          ) : isSidebarCollapsed ? (
            <div className="flex flex-col items-center space-y-5 pt-4">
              {currentModules.map((module) => (
                <button
                  key={module.name}
                  onClick={() => {
                    if (module.subItems && module.subItems.length > 0) {
                      // Navigate to the deepest navigable sub-item's href if it exists
                      const deepestHref = findDeepestNavigableItem(module);
                      if (deepestHref) {
                        handleNavigation(deepestHref, currentSection);
                      } else if (module.href) {
                        handleNavigation(module.href, currentSection);
                      }
                    } else if (module.href) {
                      handleNavigation(module.href, currentSection);
                    }
                  }}
                  className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${
                    isActiveRoute(module.href)
                      ? "bg-[#f0e8dc] shadow-inner"
                      : "hover:bg-[#DBC2A9]"
                  }`}
                  title={module.name}
                >
                  {isActiveRoute(module.href) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
                  )}
                  <module.icon
                    className={`w-5 h-5 ${
                      isActiveRoute(module.href)
                        ? "text-[#C72030]"
                        : "text-[#1a1a1a]"
                    }`}
                  />
                </button>
              ))}
            </div>
          ) : (
            currentModules.map((module) => renderMenuItem(module))
          )}
        </nav>
      </div>
    </div>
  );
};
