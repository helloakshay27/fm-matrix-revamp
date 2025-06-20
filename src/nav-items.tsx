
import { HomeIcon, Users, Calendar, Settings, BarChart3, FileText, Wrench, Building, Zap, Droplets, Shield, Car, Briefcase, ClipboardList, AlertTriangle, Package, DollarSign, UserCheck, MapPin, Clock, CheckSquare, TrendingUp, Building2, Eye, FileCheck } from "lucide-react";
import Index from "./pages/Index";
import { UtilityWaterDashboard } from "./pages/UtilityWaterDashboard";
import { SpaceManagementBookingsDashboard } from "./pages/SpaceManagementBookingsDashboard";
import { AddMaterialPRDashboard } from "./pages/AddMaterialPRDashboard";
import { AddGRNDashboard } from "./pages/AddGRNDashboard";
import { AddVendorDashboard } from "./pages/AddVendorDashboard";
import { AddQuotationDashboard } from "./pages/AddQuotationDashboard";
import { AddInvoiceDashboard } from "./pages/AddInvoiceDashboard";
import { AddDesignInsightDashboard } from "./pages/AddDesignInsightDashboard";
import { DesignInsightDashboard } from "./pages/DesignInsightDashboard";
import { FitoutChecklistDashboard } from "./pages/FitoutChecklistDashboard";
import { AddChecklistDashboard } from "./pages/AddChecklistDashboard";
import { SnaggingDashboard } from "./pages/SnaggingDashboard";
import { UserSnagPage } from "./pages/UserSnagPage";
import { MySnagPage } from "./pages/MySnagPage";
import { IncidentDashboard } from "./pages/IncidentDashboard";
import { AddIncidentPage } from "./pages/AddIncidentPage";
import { MasterChecklistDashboard } from "./pages/MasterChecklistDashboard";
import { AddMasterChecklistPage } from "./pages/AddMasterChecklistPage";
import { OperationalDashboard } from "./pages/OperationalDashboard";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: Index,
  },
  {
    title: "Utility",
    icon: <Zap className="h-4 w-4" />,
    subItems: [
      {
        title: "Water",
        to: "/utility/water",
        icon: <Droplets className="h-4 w-4" />,
        page: UtilityWaterDashboard,
      },
    ],
  },
  {
    title: "Space Management",
    icon: <Building className="h-4 w-4" />,
    subItems: [
      {
        title: "Bookings",
        to: "/vas/space-management/bookings",
        icon: <ClipboardList className="h-4 w-4" />,
        page: SpaceManagementBookingsDashboard,
      },
    ],
  },
  {
    title: "Finance",
    icon: <DollarSign className="h-4 w-4" />,
    subItems: [
      {
        title: "Material PR",
        to: "/finance/material-pr",
        icon: <Package className="h-4 w-4" />,
        page: AddMaterialPRDashboard,
      },
      {
        title: "GRN / SRN",
        to: "/finance/grn-srn",
        icon: <Package className="h-4 w-4" />,
        page: AddGRNDashboard,
      },
      {
        title: "Add Vendor",
        to: "/finance/add-vendor",
        icon: <Users className="h-4 w-4" />,
        page: AddVendorDashboard,
      },
      {
        title: "Add Quotation",
        to: "/finance/add-quotation",
        icon: <FileText className="h-4 w-4" />,
        page: AddQuotationDashboard,
      },
      {
        title: "Add Invoice",
        to: "/finance/add-invoice",
        icon: <FileText className="h-4 w-4" />,
        page: AddInvoiceDashboard,
      },
    ],
  },
  {
    title: "Maintenance",
    icon: <Wrench className="h-4 w-4" />,
    subItems: [
      {
        title: "Preventive",
        to: "/maintenance/preventive",
        icon: <Clock className="h-4 w-4" />,
        subItems: [
          {
            title: "Master Checklist",
            to: "/maintenance/audit/preventive/master-checklists",
            icon: <ClipboardList className="h-4 w-4" />,
            page: MasterChecklistDashboard,
          },
          {
            title: "Operational",
            to: "/maintenance/audit/preventive/operational",
            icon: <TrendingUp className="h-4 w-4" />,
            page: OperationalDashboard,
          },
        ],
      },
      {
        title: "Incident",
        to: "/maintenance/incident",
        icon: <Shield className="h-4 w-4" />,
        page: IncidentDashboard,
      },
      {
        title: "Add Incident",
        to: "/maintenance/add-incident",
        icon: <AlertTriangle className="h-4 w-4" />,
        page: AddIncidentPage,
      },
      {
        title: "Add Master Checklist",
        to: "/maintenance/add-master-checklist",
        icon: <ClipboardList className="h-4 w-4" />,
        page: AddMasterChecklistPage,
      },
    ],
  },
  {
    title: "Transitioning",
    icon: <Building2 className="h-4 w-4" />,
    subItems: [
      {
        title: "Snagging",
        to: "/transitioning/snagging",
        icon: <Eye className="h-4 w-4" />,
        page: SnaggingDashboard,
        subItems: [
          {
            title: "User Snag",
            to: "/transitioning/snagging/user-snag",
            icon: <FileCheck className="h-4 w-4" />,
            page: UserSnagPage,
          },
          {
            title: "My Snags",
            to: "/transitioning/snagging/my-snags", 
            icon: <FileCheck className="h-4 w-4" />,
            page: MySnagPage,
          },
        ]
      },
      {
        title: "Design Insight",
        to: "/transitioning/design-insight",
        icon: <Eye className="h-4 w-4" />,
        page: DesignInsightDashboard,
      },
      {
        title: "Add Design Insight",
        to: "/transitioning/add-design-insight",
        icon: <Eye className="h-4 w-4" />,
        page: AddDesignInsightDashboard,
      },
      {
        title: "Fitout checklist",
        to: "/transitioning/fitout/checklist",
        icon: <CheckSquare className="h-4 w-4" />,
        page: FitoutChecklistDashboard,
      },
      {
        title: "Add Checklist",
        to: "/transitioning/add-checklist",
        icon: <ClipboardList className="h-4 w-4" />,
        page: AddChecklistDashboard,
      },
    ]
  },
  {
    title: "Directory",
    icon: <Briefcase className="h-4 w-4" />,
    subItems: [
      {
        title: "Employee",
        to: "/directory/employee",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Vendor",
        to: "/directory/vendor",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Assets",
        to: "/directory/assets",
        icon: <Package className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];
