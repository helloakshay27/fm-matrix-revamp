import { HomeIcon, Users, Calendar, Settings, BarChart3, FileText, Wrench, Building, Zap, Droplets, Shield, Car, Briefcase, ClipboardList, AlertTriangle, Package, DollarSign, UserCheck, MapPin, Clock, CheckSquare, TrendingUp, Building2, Eye, FileCheck } from "lucide-react";
import Index from "./pages/Index";
import { UtilityWaterDashboard } from "./pages/UtilityWaterDashboard";
import { UtilityElectricityDashboard } from "./pages/UtilityElectricityDashboard";
import { UtilityGasDashboard } from "./pages/UtilityGasDashboard";
import { UtilityChillerDashboard } from "./pages/UtilityChillerDashboard";
import { UtilitySteamDashboard } from "./pages/UtilitySteamDashboard";
import { UtilityOtherDashboard } from "./pages/UtilityOtherDashboard";
import { SpaceManagementDashboard } from "./pages/SpaceManagementDashboard";
import { SpaceManagementFloorsDashboard } from "./pages/SpaceManagementFloorsDashboard";
import { SpaceManagementSeatsDashboard } from "./pages/SpaceManagementSeatsDashboard";
import { SpaceManagementBookingsDashboard } from "./pages/SpaceManagementBookingsDashboard";
import { FinanceDashboard } from "./pages/FinanceDashboard";
import { FinanceInvoicesDashboard } from "./pages/FinanceInvoicesDashboard";
import { FinanceQuotationDashboard } from "./pages/FinanceQuotationDashboard";
import { FinanceVendorDashboard } from "./pages/FinanceVendorDashboard";
import { FinanceMaterialPRDashboard } from "./pages/FinanceMaterialPRDashboard";
import { FinanceGRNDashboard } from "./pages/FinanceGRNDashboard";
import { FinanceSRNDashboard } from "./pages/FinanceSRNDashboard";
import { AddMaterialPRDashboard } from "./pages/AddMaterialPRDashboard";
import { AddGRNDashboard } from "./pages/AddGRNDashboard";
import { AddSRNDashboard } from "./pages/AddSRNDashboard";
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
      {
        title: "Electricity",
        to: "/utility/electricity",
        icon: <Zap className="h-4 w-4" />,
        page: UtilityElectricityDashboard,
      },
      {
        title: "Gas",
        to: "/utility/gas",
        icon: <BarChart3 className="h-4 w-4" />,
        page: UtilityGasDashboard,
      },
      {
        title: "Chiller",
        to: "/utility/chiller",
        icon: <Zap className="h-4 w-4" />,
        page: UtilityChillerDashboard,
      },
      {
        title: "Steam",
        to: "/utility/steam",
        icon: <BarChart3 className="h-4 w-4" />,
        page: UtilitySteamDashboard,
      },
      {
        title: "Other",
        to: "/utility/other",
        icon: <BarChart3 className="h-4 w-4" />,
        page: UtilityOtherDashboard,
      },
    ],
  },
  {
    title: "Space Management",
    icon: <Building className="h-4 w-4" />,
    subItems: [
      {
        title: "Dashboard",
        to: "/vas/space-management",
        icon: <HomeIcon className="h-4 w-4" />,
        page: SpaceManagementDashboard,
      },
      {
        title: "Floors",
        to: "/vas/space-management/floors",
        icon: <MapPin className="h-4 w-4" />,
        page: SpaceManagementFloorsDashboard,
      },
      {
        title: "Seats",
        to: "/vas/space-management/seats",
        icon: <UserCheck className="h-4 w-4" />,
        page: SpaceManagementSeatsDashboard,
      },
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
        title: "Dashboard",
        to: "/finance",
        icon: <HomeIcon className="h-4 w-4" />,
        page: FinanceDashboard,
      },
      {
        title: "Invoices",
        to: "/finance/invoices",
        icon: <FileText className="h-4 w-4" />,
        page: FinanceInvoicesDashboard,
      },
      {
        title: "Quotation",
        to: "/finance/quotation",
        icon: <FileText className="h-4 w-4" />,
        page: FinanceQuotationDashboard,
      },
      {
        title: "Vendor",
        to: "/finance/vendor",
        icon: <Users className="h-4 w-4" />,
        page: FinanceVendorDashboard,
      },
      {
        title: "Material PR",
        to: "/finance/material-pr",
        icon: <Package className="h-4 w-4" />,
        page: FinanceMaterialPRDashboard,
      },
      {
        title: "GRN / SRN",
        to: "/finance/grn-srn",
        icon: <Package className="h-4 w-4" />,
        page: FinanceGRNDashboard,
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
        title: "Corrective",
        to: "/maintenance/corrective",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        title: "Incident",
        to: "/maintenance/incident",
        icon: <Shield className="h-4 w-4" />,
        page: IncidentDashboard,
      },
      {
        title: "Vehicle",
        to: "/maintenance/vehicle",
        icon: <Car className="h-4 w-4" />,
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
        title: "Fitout checklist",
        to: "/transitioning/fitout/checklist",
        icon: <CheckSquare className="h-4 w-4" />,
        page: FitoutChecklistDashboard,
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
