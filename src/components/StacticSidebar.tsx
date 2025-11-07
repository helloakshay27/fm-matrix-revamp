import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
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
  Ticket,
  PackagePlus,
  FolderTree,
  Wallet,
  Trash,
  ChartColumnIncreasing,
  IndianRupee,
  Circle,
} from "lucide-react";
import { template } from "lodash";

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
          { name: "Lock Module", href: "/settings/account/role-config" },
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
          { name: "Icons", href: "/settings/visitor-management/icons" },
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
  "Club Management": [
    {
      name: "Club Membership",
      icon: Star,
      href: "/club-management/membership",
    },
    {
      name: "User Management",
      icon: Users,
      href: "/club-management/users",
      subItems: [
        {
          name: "Staff",
          href: "/club-management/users/fm-users",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Members",
          href: "/club-management/users/occupant-users",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Ticket", icon: FileText,
      href: "/club-management/helpdesk",
    },
    {
      name: "Amenities Booking",
      icon: Calendar,
      href: "/club-management/amenities-booking",
    },
    {
      name: "Broadcast",
      icon: Bell,
      href: "/club-management/broadcast",
    },
    {
      name: "Event",
      icon: Calendar,
      href: "/club-management/events",
    },
    {
      name: "Payments",
      icon: Package,
      href: "/club-management/accounting",
    },
     {
      name: "Accounting",
      icon: Calculator,
      href: "https://app.lockated.com/lock_accounts",
      blank: true,
    },

      {
      name: "Facility Setup",
      icon: Calculator,
      href: "/club-management/vas/booking/setup",
    },
    
  ],
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
        // { name: 'Permit Checklist', href: '/safety/permit/checklist', color: 'text-[#1a1a1a]' }
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
      name: 'Report',
      icon: Download,
      href: '/safety/report',
      subItems: [
        { name: 'Msafe User Report', icon: Download, href: '/safety/report/msafe-report' },
        { name: 'Msafe Detail Report', icon: Download, href: '/safety/report/msafe-detail-report' },
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
      ]
    }
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
      ]
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
      subItems: [
        { name: "Currency", href: "/settings/currency" },
      ]
    },
    {
      icon: Circle,
      name: "Circle",
      href: "/safety/m-safe/circle",
    },
  ],
};

export const StacticSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentSection,
    setCurrentSection,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useLayout();
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
    } else if (path.startsWith("/club-management")) {
      setCurrentSection("Club Management");
    }
  }, [location.pathname, setCurrentSection]);

  const currentModules = modulesByPackage[currentSection] || [];

  const isActiveRoute = (href: string, mode: "exact" | "prefix" = "exact") => {
    const currentPath = location.pathname;
    const exactMatch = currentPath === href;
    const prefixMatch = currentPath.startsWith(href + "/");
    const isActive = mode === "prefix" ? (exactMatch || prefixMatch) : exactMatch;

    // Debug logging for Services
    if (href === "/maintenance/service") {
      console.log("Services route check:", {
        currentPath,
        href,
        exactMatch,
        prefixMatch,
        mode,
        isActive,
      });
    }

    return isActive;
  };

  // Auto-expand functionality for all sections
  React.useEffect(() => {
    // Determine which items to expand based on current route
    const path = location.pathname;
    const currentSectionItems = modulesByPackage[currentSection];
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
  }, [currentSection, location.pathname]);

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const showDropdowns =
      item.hasDropdowns && item.href && location.pathname === item.href;
    const isActive = item.href ? isActiveRoute(item.href, "prefix") : false;

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
              {item.subItems.map((subItem: any) => (
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
                        {subItem.href && isActiveRoute(subItem.href, "exact") && (
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
                          {subItem.subItems.map((nestedItem: any) => (
                            <button
                              key={nestedItem.name}
                              onClick={() => handleNavigation(nestedItem.href)}
                              className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[#DBC2A9] relative ${nestedItem.color || "text-[#1a1a1a]"
                                }`}
                            >
                              {isActiveRoute(nestedItem.href, "exact") && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                              )}
                              {nestedItem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        handleNavigation(subItem.href, currentSection)
                      }
                      className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${subItem.color || "text-[#1a1a1a]"
                        }`}
                    >
                      {isActiveRoute(subItem.href, "exact") && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                      )}
                      {subItem.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // External link handling
    if (item.blank && item.href) {
      return (
        <div key={item.name}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${item.color || "text-[#1a1a1a]"}`}
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
          </a>
        </div>
      );
    }

    return (
      <div key={item.name}>
        <button
          onClick={() =>
            item.href && handleNavigation(item.href, currentSection)
          }
          className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${item.color || "text-[#1a1a1a]"}`}
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
    const active = module.href ? isActiveRoute(module.href, "prefix") : false;

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
          className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${active || isExpanded
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
              className={`w-5 h-5 ${active || isExpanded ? "text-[#C72030]" : "text-[#1a1a1a]"
                }`}
            />
          ) : (
            <div
              className={`w-${3 - level} h-${3 - level
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
      className={`${isSidebarCollapsed ? "w-16" : "w-64"
        } bg-[#f6f4ee] border-r border-\[\#D5DbDB\]  fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
      style={{ top: "4rem", height: "calc(100vh - 65px)" }}
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
              className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${isSidebarCollapsed ? "text-center" : "tracking-wide"
                }`}
            >
              {isSidebarCollapsed ? "" : currentSection}
            </h3>
          </div>
        )}

        <nav className="space-y-2">
          {currentSection === "Settings" ? (
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
                  className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${isActiveRoute(module.href, "prefix")
                    ? "bg-[#f0e8dc] shadow-inner"
                    : "hover:bg-[#DBC2A9]"
                    }`}
                  title={module.name}
                >
                  {isActiveRoute(module.href, "prefix") && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
                  )}
                  <module.icon
                    className={`w-5 h-5 ${isActiveRoute(module.href, "prefix")
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
