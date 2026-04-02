import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import {
  Star,
  Users,
  FileText,
  Calendar,
  Bell,
  Package,
  Calculator,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Settings,
  FileSpreadsheet,
  MapPin,
  ShoppingCart,
  CreditCard,
  Wallet,
  BarChart3,
  BookOpen,
  ClipboardList,
  Repeat,
  Truck,
  UserCheck,
  Tags,
  BadgePercent,
  LayoutGrid,
  Layers,
  Gem,
  TicketCheck,
  Wrench,
  CircleDollarSign,
  ScrollText,
  PieChart,
  ArrowRightLeft,
  Scale,
  IndianRupee,
  UserCog,
  Boxes,
  House,
  TrendingUp,
  Code,
} from "lucide-react";

type SidebarItem = {
  name: string;
  href?: string;
  icon?: React.ElementType<{ className?: string }>;
  subItems?: SidebarItem[];
  color?: string;
  blank?: boolean;
};

const modulesByPackage = {
  "Club Management": [
    {
      name: "Group Memberships",
      icon: Star,
      href: "/club-management/membership/groups",
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
          href: "/club-management/membership",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Guest",
          href: "/club-management/users/guest",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "Ticket",
      icon: TicketCheck,
      href: "/club-management/helpdesk",
    },
    {
      name: "Amenities Booking",
      icon: Gem,
      href: "/club-management/amenities-booking-club",
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
      icon: Wallet,
      href: "/club-management/accounting",
    },
    {
      name: "Vendor",
      icon: Truck,
      href: "/maintenance/vendor",
    }
    // {
    //     name: "Accounting",
    //     icon: Calculator,
    //     subItems: [
    //         {
    //             name: "Accountants",
    //             icon: Users,
    //             subItems: [
    //                 { name: "Manual Journals", href: "/settings/manual-journal" },
    //                 { name: "Transactions", href: "/settings/transactions" },
    //                 { name: "Chart Of Accounts", href: "/settings/chart-journal" },
    //                 { name: "Opening Balance", href: "/settings/opening-balance" },
    //                 { name: "Budget", href: "/settings/budget" },
    //                 { name: "Tax Setup", href: "/settings/tax-setup" },
    //             ],
    //         },
    //     ],
    // },
  ],

  Settings: [
    {
      name: "Amenities Setup",
      icon: Gem,
      href: "/settings/vas/booking-club/setup",
    },
    {
      name: "Membership Plan Setup",
      icon: ClipboardList,
      href: "/settings/vas/membership-plan/setup",
    },
    {
      name: "Accessories Setup",
      icon: Boxes,
      href: "/settings/accessories",
    },
    {
      name: "Payment Plan Setup",
      icon: CreditCard,
      href: "/settings/payment-plan/setup",
    },
    {
      name: "Templates",
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

    {
      name: "Ticket Management",
      icon: TicketCheck,
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
      name: "Roles (RACI)",
      icon: UserCheck,
      href: "/settings/roles",
      subItems: [
        { name: "Department", href: "/settings/roles/department" },
        { name: "Role", href: "/settings/roles/role" },
      ],
    },
    {
      name: "House Setup",
      icon: House,
      href: "/settings/house/setup",
    },
    {
      name: "HSN Code Setup",
      icon: Code,
      href: "/settings/hsn-code/setup",
    },

    // {
    //     name: "Accountants",
    //     icon: Users,
    //     subItems: [
    //         { name: "Manual Journals ", href: "/settings/manual-journal" },
    //         { name: "Transactions ", href: "/settings/transactions" },
    //         // { name: "Recurring Journals ", href: "/settings/recurring-journal" },
    //         { name: "Chart Of Accounts ", href: "/settings/chart-journal" },
    //         { name: "Opening Balance", href: "/settings/opening-balance" },
    //         { name: "Budget", href: "/settings/budget" },
    //         { name: "Tax Setup ", href: "/settings/tax-setup" },
    //     ],
    // },
  ],

  Accounting: [
    {
      name: "Items",
      icon: Boxes,
      subItems: [
        { name: "Items", href: "/accounting/items" },
        // { name: "Transactions ", href: "/settings/transactions" },
        // // { name: "Recurring Journals ", href: "/settings/recurring-journal" },
        // { name: "Chart Of Accounts ", href: "/settings/chart-journal" },
        // { name: "Opening Balance", href: "/settings/opening-balance" },
        // { name: "Budget", href: "/settings/budget" },
        // { name: "Tax Setup ", href: "/settings/tax-setup" },
      ],
    },

    {
      name: "Sales",
      icon: ShoppingCart,
      subItems: [
        { name: "Customers", href: "/accounting/customers" },
        { name: "Quotes", href: "/accounting/quotes" },
        // { name: "Retainer Invoices", href: "/accounting/retainer-invoices" },
        { name: "Sales Order", href: "/accounting/sales-order" },
        { name: "Invoices ", href: "/accounting/invoices/list" },

        { name: "Recurring Invoices ", href: "accounting/recurring-invoices" },

        // { name: "Delivery Challans", href: "/accounting/delivery-challans" },
        // { name: "Payment Links", href: "/accounting/payment-links" },
        { name: "Payments Received", href: "/accounting/payments-received" },
        { name: "Credit Note", href: "/accounting/credit-note" }
      ],
    },

    {
      name: "Purchases",
      icon: Truck,
      subItems: [
        { name: "Vendor", href: "/maintenance/vendor" },
        { name: "Expense", href: "/accounting/expense" },
        { name: "Recurring Expenses", href: "/accounting/recurring-expenses" },
        { name: "Purchase Order", href: "/accounting/purchase-order" },
        { name: "Bills", href: "/accounting/bills" },
        { name: "Recurring Bills", href: "/accounting/recurring-bills" },
        // { name: "Recurring Bill", href: "/accounting/recurring-bills/create" },
        { name: "Payments Made", href: "/accounting/payments-made" },
        { name: "Vendor Credits", href: "/accounting/vendor-credits" },
        // { name: "Recurring Expenses ", href: "/settings/recurring-journal" },
        // { name: "Chart Of Accounts ", href: "/settings/chart-journal" },
        // { name: "Opening Balance", href: "/settings/opening-balance" },
        // { name: "Budget", href: "/settings/budget" },
        // { name: "Tax Setup ", href: "/settings/tax-setup" },
      ],
    },

    {
      name: "Accountants",
      icon: BookOpen,
      subItems: [
        { name: "Manual Journals", href: "/accounting/manual-journal" },
        { name: "Transactions", href: "/accounting/transactions" },
        { name: "Chart Of Accounts", href: "/accounting/chart-journal" },
        { name: "Opening Balance", href: "/accounting/opening-balance" },
        // { name: "Budget", href: "/accounting/budget" },
        { name: "Tax Setup", href: "/accounting/tax-setup" },
      ],
    },

    {
      name: "Configuration",
      icon: Settings,
      subItems: [
        {
          name: "Sales Person",
          href: "/accounting/sales-person",
        },
        {
          name: "Payment Terms",
          href: "/accounting/payment-terms",
        },
        {
          name: "Tax Sections",
          href: "/accounting/section",
        },

        {
          name: "Direct Taxes",
          href: "/accounting/tax-setup-master",
        },
        {
          name: "Tax Rates Setup",
          href: "/accounting/tax-rates-setup",
        },
        {
          name: "Default Tax Preferences",
          href: "/accounting/default-tax-preferences",
        },
        // { name: "Charges ", href: "/accounting/charge-setup" },
        // { name: "Bill Cycles ", href: "/accounting/bill-cycles" },
      ],
    },

    {
      name: "Reports",
      icon: BarChart3,
      subItems: [
        {
          name: "Sales Reports",
          subItems: [
            {
              name: "Sales by Customer",
              href: "/accounting/reports/sales-by-customer",
            },
            {
              name: "Sales by Item",
              href: "/accounting/reports/sales-by-item",
            },
            // {
            //   name: "Sales by Sales Person",
            //   href: "/accounting/reports/sales-by-sales-person",
            // },
            {
              name: "Sales Summary",
              href: "/accounting/reports/sales-summary",
            },
          ],
        },
        {
          name: "Debtors & Creditors ",
          href: "/accounting/reports/debtors-creditors",
        },

        {
          name: "Business Overview",
          icon: TrendingUp,
          subItems: [
            {
              name: "Profit and Loss",
              href: "/accounting/reports/profit-and-loss",
            },
            {
              name: "Profit and Loss (Schedule III)",
              href: "/accounting/reports/profit-and-loss-details",
            },
            {
              name: "Horizontal Profit and Loss",
              href: "/accounting/reports/profit-and-loss",
            },
            {
              name: "Cash Flow Statement",
              href: "/accounting/reports/cash-flow-statement",
            },
            {
              name: "Balance Sheet",
              href: "/accounting/reports/balance-sheet",
            },
            {
              name: "Horizontal Balance Sheet",
              href: "/accounting/reports/balance-sheet",
            },
            {
              name: "Balance Sheet (Schedule III)",
              href: "/accounting/reports/balance-sheet-details",
            },
            {
              name: "Business Performance Ratios",
              href: "/accounting/reports/business-performance",
            },
            {
              name: "Cash Flow Forecasting",
              href: "/accounting/reports/cash-flow-statement",
            },
            {
              name: "Movement of Equity",
              href: "/accounting/reports/balance-sheet",
            },
          ],
        },




        // {
        //   name: "Account Type Summary",
        //   href: "/accounting/reports/account-type-summary",
        // },
        // {
        //   name: "Account Type Transactions",
        //   href: "/accounting/reports/account-type-transactions",
        // },
        // {
        //   name: "Account Transactions",
        //   href: "/accounting/reports/account-transactions",
        // },
        // {
        //   name: "AR Aging System",
        //   href: "/accounting/reports/ar-aging-summary",
        // },
        // {
        //   name: "AR Aging Details",
        //   href: "/accounting/reports/ar-aging-details",
        // },
        // {
        //   name: "Invoice Details",
        //   href: "/accounting/reports/invoice-details",
        // },
        // {
        //   name: "Retainer Invoice Details",
        //   href: "/accounting/reports/retainer-invoice-details",
        // },
        // {
        //   name: "Sales Order Details",
        //   href: "/accounting/reports/sales-order-details",
        // },
        // {
        //   name: "Delivery Challan Details",
        //   href: "/accounting/reports/delivery-challan-details",
        // },
        // {
        //   name: "Quote Details",
        //   href: "/accounting/reports/quote-details",
        // },
        // {
        //   name: "Customer Balance Summary",
        //   href: "/accounting/reports/customer-balance-summary",
        // },
        // {
        //   name: "Receivable Summary",
        //   href: "/accounting/reports/receivable-summary",
        // },
        // {
        //   name: "Receivable Details",
        //   href: "/accounting/reports/receivable-details",
        // },


        {
          name: "Receivables",
          subItems: [
            {
              name: "AR Aging Summary",
              href: "/accounting/reports/ar-aging-summary",
            },
            {
              name: "AR Aging Details",
              href: "/accounting/reports/ar-aging-details",
            },
            {
              name: "Invoice Details",
              href: "/accounting/reports/invoice-details",
            },
            {
              name: "Retainer Invoice Details",
              href: "/accounting/reports/retainer-invoice-details",
            },
            {
              name: "Sales Order Details",
              href: "/accounting/reports/sales-order-details",
            },
            {
              name: "Delivery Challan Details",
              href: "/accounting/reports/delivery-challan-details",
            },
            {
              name: "Quote Details",
              href: "/accounting/reports/quote-details",
            },
            {
              name: "Customer Balance Summary",
              href: "/accounting/reports/customer-balance-summary",
            },
            {
              name: "Receivable Summary",
              href: "/accounting/reports/receivable-summary",
            },
            {
              name: "Receivable Details",
              href: "/accounting/reports/receivable-details",
            },
          ],
        },
        {
          name: "Payment Received",
          // icon: IndianRupee,
          subItems: [
            {
              name: "Payments Recieved",
              href: "/accounting/reports/payments-recieved",
            },
            {
              name: "Time to Get Paid",
              href: "/accounting/reports/time-to-get-paid",
            },
            {
              name: "Credit Note Details",
              href: "/accounting/reports/credit-note-details",
            },
            {
              name: "Refund History",
              href: "/accounting/reports/refund-history",
            },

          ],
        },

        {
          name: "Recurring Invoices",
          // icon: IndianRupee,
          subItems: [
            {
              name: "Recurring Invoice Details",
              href: "/accounting/reports/recurring-invoice-details",
            },
          ],
        },
        {
          name: "Payable",
          // icon: IndianRupee,
          subItems: [
            {
              name: "Vendor Balance Summary",
              href: "/accounting/reports/vendor-balance-summary",
            },
            {
              name: "Payments Made",
              href: "/accounting/reports/payments-made",
            },
            {
              name: "Payable Details",
              href: "/accounting/reports/payable-details",
            },
            {
              name: "AP Aging Details",
              href: "/accounting/reports/ap-aging-details",
            },
            {
              name: "Refund History",
              href: "/accounting/reports/payable-refund-history",
            },
            {
              name: "Purchase Order Details",
              href: "/accounting/reports/purchase-order-details",
            },
            {
              name: "Expense Details",
              href: "/accounting/reports/expense-details",
            },
            {
              name: "Expense Summary by Category",
              href: "/accounting/reports/expense-summary-by-category",
            },
            {
              name: "Expenses by Project",
              href: "/accounting/reports/expenses-by-project",
            },
            {
              name: "Expenses by Employee",
              href: "/accounting/reports/expenses-by-employee",
            },
            {
              name: "Billable Expense Details",
              href: "/accounting/reports/billable-expense-details",
            },
            {
              name: "Purchases by Vendor",
              href: "/accounting/reports/purchase-orders-by-vendor",
            },
            {
              name: "Payable Summary",
              href: "/accounting/reports/payable-summary",
            },
            {
              name: "AP Aging Summary",
              href: "/accounting/reports/ap-aging-summary",
            },
            {
              name: "Bill Details",
              href: "/accounting/reports/bill-details",
            },
            {
              name: "Vendor Credits Details",
              href: "/accounting/reports/vendor-credits-details",
            },
          ],
        },

        {
          name: "Purchases and Expenses",
          subItems: [
            {
              name: "Purchase Order Details",
              href: "/accounting/purchases-and-expenses/purchase-order-details",
            },
            {
              name: "Expense Details",
              href: "/accounting/purchases-and-expenses/expense-details",
            },
            {
              name: "Expense Summary by Category",
              href: "/accounting/purchases-and-expenses/expense-summary-by-category",
            },
            {
              name: "Expenses by Customer",
              href: "/accounting/purchases-and-expenses/expenses-by-customer",
            },
            {
              name: "Expenses by Project",
              href: "/accounting/purchases-and-expenses/expenses-by-project",
            },
            {
              name: "Expenses by Employee",
              href: "/accounting/purchases-and-expenses/expenses-by-employee",
            },
            {
              name: "Purchases by Vendor",
              href: "/accounting/purchases-and-expenses/purchases-by-vendor",
            },
            {
              name: "Purchases by Item",
              href: "/accounting/purchases-and-expenses/purchases-by-item",
            },
            {
              name: "Billable Expense Details",
              href: "/accounting/purchases-and-expenses/billable-expense-details",
            },
          ],
        },

        {
          name: "Taxes",
          subItems: [
            {
              name: "Tax Summary",
              href: "/accounting/reports/tax-summary",
            },
            {
              name: "GSTR-7",
              href: "/accounting/reports/gstr-7",
            },
            {
              name: "GSTR-3B Summary",
              href: "/accounting/reports/gstr-3b-summary",
            },
            {
              name: "Summary of Inward Supplies",
              href: "/accounting/reports/summary-of-inward-supplies",
            },
            {
              name: "PMT-06 (Self Assessment Basis)",
              href: "/accounting/reports/pmt-06-self-assessment-basis",
            },
            {
              name: "Summary of Outward Supplies (GSTR-1)",
              href: "/accounting/reports/summary-of-outward-supplies-gstr-1",
            },
            {
              name: "Invoice Furnishing Facility (IFF)",
              href: "/accounting/reports/invoice-furnishing-facility-iff",
            },
            {
              name: "Self-invoice Summary",
              href: "/accounting/reports/self-invoice-summary",
            },
            {
              name: "TCS Summary (Form No. 27EQ)",
              href: "/accounting/reports/tcs-summary-form-27eq",
            },
            {
              name: "TDS Summary",
              href: "/accounting/reports/tds-summary",
            },
            {
              name: "TDS Receivables Summary",
              href: "/accounting/reports/tds-receivables-summary",
            },
          ],
        },

        {
          name: "Activity",
          subItems: [
            {
              name: "System Mails",
              href: "/accounting/reports/system-mails",
            },
            {
              name: "Activity Logs & Audit Trail",
              href: "/accounting/reports/activity-logs-audit-trail",
            },
            {
              name: "Exception Report",
              href: "/accounting/reports/exception-report",
            },
            {
              name: "Portal Activities",
              href: "/accounting/reports/portal-activities",
            },
            {
              name: "Customer Reviews",
              href: "/accounting/reports/customer-reviews",
            },
            {
              name: "API Usage",
              href: "/accounting/reports/api-usage",
            },
          ],
        },

        {
          name: "Account",
          subItems: [
            {
              name: "Account Transactions",
              href: "/accounting/reports/account-transactions",
            },
            {
              name: "Day Book",
              href: "/accounting/reports/day-book",
            },
            {
              name: "Journal Report",
              href: "/accounting/reports/journal-report",
            },
            {
              name: "General Ledger",
              href: "/accounting/reports/general-ledger",
            },
            {
              name: "Detailed General Ledger",
              href: "/accounting/reports/detailed-general-ledger",
            },
            {
              name: "Trial Balance",
              href: "/accounting/reports/trial-balance",
            },
          ],
        },

        {
          name: "Fixed Asset",
          subItems: [
            {
              name: "Fixed Asset Register",
              href: "/accounting/reports/fixed-asset-register",
            },
          ],
        },
        {
          name: "Project",
          subItems: [
            {
              name: "Name of Project",
              href: "/accounting/reports/name-of-project",
            },
            {
              name: "Timesheet Details",
              href: "/accounting/reports/timesheet-details",
            },
            {
              name: "Timesheet Profitability Summary",
              href: "/accounting/reports/timesheet-profitability-summary",
            },
            {
              name: "Project Summary",
              href: "/accounting/reports/project-summary",
            },
            {
              name: "Project Details",
              href: "/accounting/reports/project-details",
            },
            {
              name: "Projects Cost Summary",
              href: "/accounting/reports/projects-cost-summary",
            },
            {
              name: "Projects Revenue Summary",
              href: "/accounting/reports/projects-revenue-summary",
            },
            {
              name: "Projects Performance Summary",
              href: "/accounting/reports/projects-performance-summary",
            },
          ],
        },

      ],
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

    // {
    //     name: "Payment Plan Setup",
    //     icon: Calculator,
    //     href: "/settings/payment-plan/setup",
    // },
    // {
    //     name: "Templates",
    //     icon: FileSpreadsheet,
    //     href: "/master/communication-template",
    //     subItems: [
    //         {
    //             name: "Communication Template",
    //             href: "/master/communication-template",
    //             color: "text-[#1a1a1a]",
    //         },
    //         {
    //             name: "Root Cause Analysis",
    //             href: "/master/template/root-cause-analysis",
    //             color: "text-[#1a1a1a]",
    //         },
    //         {
    //             name: "Preventive Action",
    //             href: "/master/template/preventive-action",
    //             color: "text-[#1a1a1a]",
    //         },
    //         {
    //             name: "Short-term Impact",
    //             href: "/master/template/short-term-impact",
    //             color: "text-[#1a1a1a]",
    //         },
    //         {
    //             name: "Long-term Impact",
    //             href: "/master/template/long-term-impact",
    //             color: "text-[#1a1a1a]",
    //         },
    //         {
    //             name: "Corrective Action",
    //             href: "/master/template/corrective-action",
    //             color: "text-[#1a1a1a]",
    //         },
    //     ],
    // },

    // {
    //     name: "Ticket Management",
    //     icon: FileText,
    //     subItems: [
    //         { name: "Setup", href: "/settings/ticket-management/setup" },
    //         {
    //             name: "Escalation Matrix",
    //             href: "/settings/ticket-management/escalation-matrix",
    //         },
    //         {
    //             name: "Cost Approval",
    //             href: "/settings/ticket-management/cost-approval",
    //         },
    //     ],
    // },
    // { name: "FM Groups", icon: Users, href: "/settings/groups" },

    // {
    //     name: "Accountants",
    //     icon: Users,
    //     subItems: [
    //         { name: "Manual Journals ", href: "/settings/manual-journal" },
    //         { name: "Transactions ", href: "/settings/transactions" },
    //         // { name: "Recurring Journals ", href: "/settings/recurring-journal" },
    //         { name: "Chart Of Accounts ", href: "/settings/chart-journal" },
    //         { name: "Opening Balance", href: "/settings/opening-balance" },
    //         { name: "Budget", href: "/settings/budget" },
    //         { name: "Tax Setup ", href: "/settings/tax-setup" },
    //     ],
    // },
  ],
};

export const ClubSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    currentSection,
    setCurrentSection,
  } = useLayout();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  // // Detect section based on route if not set
  // React.useEffect(() => {
  //     const path = location.pathname;
  //     if (path.startsWith("/accounting")) {
  //         setCurrentSection && setCurrentSection("Accounting");
  //     } else if (path.startsWith("/settings")) {
  //         setCurrentSection && setCurrentSection("Settings");
  //     } else {
  //         setCurrentSection && setCurrentSection("Club Management");
  //     }
  // }, [location.pathname, setCurrentSection]);

  // Get current section modules
  const currentModules =
    modulesByPackage[currentSection as keyof typeof modulesByPackage] ||
    modulesByPackage["Club Management"] ||
    [];

  const isActiveRoute = (href: string, mode: "exact" | "prefix" = "exact") => {
    const currentPath = location.pathname;
    const exactMatch = currentPath === href;
    const prefixMatch = currentPath.startsWith(href + "/");
    return mode === "prefix" ? exactMatch || prefixMatch : exactMatch;
  };

  const handleNavigation = (href: string, blank?: boolean) => {
    if (blank) {
      window.open(href, "_blank");
    } else {
      navigate(href);
    }
  };

  // const renderMenuItem = (item: any) => {
  //     const hasSubItems = item.subItems && item.subItems.length > 0;
  //     const isExpanded = expandedItems.includes(item.name);
  //     const isActive = item.href ? isActiveRoute(item.href, "prefix") : false;

  //     if (hasSubItems) {
  //         return (
  //             <div key={item.name}>
  //                 <button
  //                     onClick={() => toggleExpand(item.name)}
  //                     className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
  //                 >
  //                     <div className="flex items-center gap-3">
  //                         {isActive && (
  //                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
  //                         )}
  //                         <item.icon className="w-5 h-5" />
  //                         <span>{item.name}</span>
  //                     </div>
  //                     {isExpanded ? (
  //                         <ChevronDown className="w-4 h-4" />
  //                     ) : (
  //                         <ChevronRight className="w-4 h-4" />
  //                     )}
  //                 </button>
  //                 {isExpanded && (
  //                     <div className="ml-8 space-y-1">
  //                         {item.subItems.map((subItem: any) => (
  //                             <button
  //                                 key={subItem.name}
  //                                 onClick={() => handleNavigation(subItem.href)}
  //                                 className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${subItem.color || "text-[#1a1a1a]"
  //                                     }`}
  //                             >
  //                                 {isActiveRoute(subItem.href, "exact") && (
  //                                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
  //                                 )}
  //                                 {subItem.name}
  //                             </button>
  //                         ))}
  //                     </div>
  //                 )}
  //             </div>
  //         );
  //     }

  //     return (
  //         <div key={item.name}>
  //             <button
  //                 onClick={() => handleNavigation(item.href, item.blank)}
  //                 className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${item.color || "text-[#1a1a1a]"
  //                     }`}
  //             >
  //                 {isActive && (
  //                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
  //                 )}
  //                 <item.icon className="w-5 h-5" />
  //                 <span>{item.name}</span>
  //             </button>
  //         </div>
  //     );
  // };

  const renderMenuItem = (item: SidebarItem) => {
    const key = item.href || item.name;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isStaticItem = !hasSubItems && !item.href;
    const isExpanded = expandedItems.includes(key);
    const isActive = item.href ? isActiveRoute(item.href, "prefix") : false;

    if (hasSubItems) {
      return (
        <div key={key}>
          <button
            onClick={() => toggleExpand(key)}
            className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold text-[#1a1a1a] hover:bg-[#DBC2A9] relative"
          >
            <div className="flex items-center gap-3">
              {item.icon && <item.icon className="w-5 h-5" />}
              <span>{item.name}</span>
            </div>

            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.subItems?.map((subItem) => renderMenuItem(subItem))}
            </div>
          )}
        </div>
      );
    }

    if (isStaticItem) {
      return (
        <div
          key={key}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${item.color || "text-[#1a1a1a]"}`}
        >
          {item.icon && <item.icon className="w-5 h-5" />}
          <span>{item.name}</span>
        </div>
      );
    }

    return (
      <button
        key={key}
        onClick={() => handleNavigation(item.href)}
        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#DBC2A9] relative ${item.color || "text-[#1a1a1a]"
          }`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]" />
        )}

        {item.icon && <item.icon className="w-5 h-5" />}
        <span>{item.name}</span>
      </button>
    );
  };

  const CollapsedMenuItem = ({ item, level = 0 }: { item: SidebarItem; level?: number }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isStaticItem = !hasSubItems && !item.href;
    const isExpanded = expandedItems.includes(item.name);
    const active = item.href ? isActiveRoute(item.href, "prefix") : false;

    if (isStaticItem) {
      return (
        <div
          key={item.name}
          className="flex items-center justify-center p-2 rounded-lg"
          title={item.name}
        >
          {level === 0 && item.icon ? (
            <item.icon className="w-5 h-5 text-[#1a1a1a]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
          )}
        </div>
      );
    }

    return (
      <>
        <button
          key={item.name}
          onClick={() => {
            if (hasSubItems) {
              toggleExpand(item.name);
            } else if (item.href) {
              handleNavigation(item.href, item.blank);
            }
          }}
          className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${active || isExpanded
            ? "bg-[#f0e8dc] shadow-inner"
            : "hover:bg-[#DBC2A9]"
            }`}
          title={item.name}
        >
          {(active || isExpanded) && (
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
          )}
          {level === 0 && item.icon ? (
            <item.icon
              className={`w-5 h-5 ${active || isExpanded ? "text-[#C72030]" : "text-[#1a1a1a]"}`}
            />
          ) : (
            <div className="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
          )}
        </button>
        {isExpanded &&
          hasSubItems &&
          item.subItems?.map((subItem) => (
            <CollapsedMenuItem
              key={`${item.name}-${subItem.name}`}
              item={subItem}
              level={level + 1}
            />
          ))}
      </>
    );
  };

  return (
    <div
      className={`${isSidebarCollapsed ? "w-16" : "w-64"
        } bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
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

        <div className="w-full h-4 bg-[#f6f4ee] border-[#e5e1d8] mb-2"></div>

        {/* Section Switcher
                {!isSidebarCollapsed && (
                    <div className="flex gap-2 mb-4">
                        <button
                            className={`text-sm font-medium px-3 py-1 rounded ${currentSection === "Club Management" ? "bg-[#DBC2A9] text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a] hover:bg-[#f0e8dc]"}`}
                            onClick={() => setCurrentSection("Club Management")}
                        >
                            Club Management
                        </button>
                        <button
                            className={`text-sm font-medium px-3 py-1 rounded ${currentSection === "Accounting" ? "bg-[#DBC2A9] text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a] hover:bg-[#f0e8dc]"}`}
                            onClick={() => setCurrentSection("Accounting")}
                        >
                            Accounting
                        </button>
                        <button
                            className={`text-sm font-medium px-3 py-1 rounded ${currentSection === "Settings" ? "bg-[#DBC2A9] text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a] hover:bg-[#f0e8dc]"}`}
                            onClick={() => setCurrentSection("Settings")}
                        >
                            Settings
                        </button>
                    </div>
                )} */}

        <div className={`mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
          <h3
            className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${isSidebarCollapsed ? "text-center" : "tracking-wide"}`}
          >
            {isSidebarCollapsed ? "" : currentSection || "Club Management"}
          </h3>
        </div>

        <nav className="space-y-2">
          {isSidebarCollapsed
            ? currentModules.map((item) => (
              <CollapsedMenuItem key={item.name} item={item} level={0} />
            ))
            : currentModules.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );
};

export default ClubSidebar;
