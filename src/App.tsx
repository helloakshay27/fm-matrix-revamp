import { createRoot } from "react-dom/client";
import { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster, toast } from "@/components/ui/sonner";
import { LayoutProvider } from "./contexts/LayoutContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import {
  NotificationProvider,
  useNotification,
} from "./contexts/NotificationContext";
import { EnhancedSelectProvider } from "./providers/EnhancedSelectProvider";
import { initializeGlobalMUISelectSearchEnhancer } from "./utils/globalMUISelectSearchEnhancer";
import "./styles/enhanced-select.css"; // Global enhanced select styles
import { Layout } from "./components/Layout";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminLayout } from "./components/AdminLayout";
import { PWALayoutWrapper } from "./components/PWALayoutWrapper";
import { ProtectedRoute } from "./components/ProtectedRoute";
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const DashboardConfiguration = lazy(() => import("./pages/DashboardConfiguration"));
const ParkingBookingListSiteWise = lazy(() => import("./pages/ParkingBookingListSiteWise"));
const ConditionalParkingPage = lazy(() => import("./pages/ConditionalParkingPage"));

// Import existing pages
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const PaymentLinksDashboard = lazy(() => import("./pages/PaymentLinksDashboard").then(m => ({ default: m.PaymentLinksDashboard })));
const RetainerInvoicesDashboard = lazy(() => import("./pages/RetainerInvoicesDashboard").then(m => ({ default: m.RetainerInvoicesDashboard })));
const CreateRetainerInvoicePage = lazy(() => import("./pages/CreateRetainerInvoicePage").then(m => ({ default: m.CreateRetainerInvoicePage })));
const ImportRetainerInvoicesPage = lazy(() => import("./pages/ImportRetainerInvoicesPage").then(m => ({ default: m.ImportRetainerInvoicesPage })));
import { BackendLayout } from "./components/BackendLayout";
const SmsManagementPage = lazy(() => import("./pages/SmsManagementPage").then(m => ({ default: m.SmsManagementPage })));

// Import Invoice Approvals page
const InvoiceApprovalsPage = lazy(() => import("./pages/InvoiceApprovalsPage").then(m => ({ default: m.InvoiceApprovalsPage })));
const AddInvoiceApprovalsPage = lazy(() => import("./pages/settings/AddInvoiceApprovalsPage").then(m => ({ default: m.AddInvoiceApprovalsPage })));
const EditInvoiceApprovalsPage = lazy(() => import("./pages/settings/EditInvoiceApprovalsPage").then(m => ({ default: m.EditInvoiceApprovalsPage })));

// Import Asset Groups page
const AssetGroupsPage = lazy(() => import("./pages/AssetGroupsPage").then(m => ({ default: m.AssetGroupsPage })));
const AssetGroupsPageNew = lazy(() => import("./pages/AssetGroupsPageNew").then(m => ({ default: m.AssetGroupsPageNew })));
const ChecklistGroupsPage = lazy(() => import("./pages/ChecklistGroupsPage").then(m => ({ default: m.ChecklistGroupsPage })));

// Import Snagging pages
const SnaggingDashboard = lazy(() => import("./pages/SnaggingDashboard").then(m => ({ default: m.SnaggingDashboard })));
const SnaggingDetailsPage = lazy(() => import("./pages/SnaggingDetailsPage").then(m => ({ default: m.SnaggingDetailsPage })));

// Import Ticket pages
const TicketDashboard = lazy(() => import("./pages/TicketDashboard").then(m => ({ default: m.TicketDashboard })));
const AddTicketDashboard = lazy(() => import("./pages/AddTicketDashboard").then(m => ({ default: m.AddTicketDashboard })));
const TicketDetailsPage = lazy(() => import("./pages/TicketDetailsPage").then(m => ({ default: m.TicketDetailsPage })));
const TicketFeedsPage = lazy(() => import("./pages/TicketFeedsPage").then(m => ({ default: m.TicketFeedsPage })));
const TicketTagVendorPage = lazy(() => import("./pages/TicketTagVendorPage").then(m => ({ default: m.TicketTagVendorPage })));
const AssignTicketsPage = lazy(() => import("./pages/AssignTicketsPage"));
const UpdateTicketsPage = lazy(() => import("./pages/UpdateTicketsPage"));

// Import Fitout pages
const FitoutSetupDashboard = lazy(() => import("./pages/FitoutSetupDashboard").then(m => ({ default: m.FitoutSetupDashboard })));
const FitoutRequestListDashboard = lazy(() => import("./pages/FitoutRequestListDashboard").then(m => ({ default: m.FitoutRequestListDashboard })));
const AddProjectDashboard = lazy(() => import("./pages/AddProjectDashboard").then(m => ({ default: m.AddProjectDashboard })));
const FitoutChecklistDashboard = lazy(() => import("./pages/FitoutChecklistDashboard").then(m => ({ default: m.FitoutChecklistDashboard })));
const AddChecklistDashboard = lazy(() => import("./pages/AddChecklistDashboard").then(m => ({ default: m.AddChecklistDashboard })));
const FitoutViolationDashboard = lazy(() => import("./pages/FitoutViolationDashboard").then(m => ({ default: m.FitoutViolationDashboard })));
const CostApprovalPage = lazy(() => import("./pages/maintenance/CostApprovalPage").then(m => ({ default: m.CostApprovalPage })));
const CostApprovalStandalonePage = lazy(() => import("./pages/CostApprovalPage").then(m => ({ default: m.CostApprovalPage })));

// Import Maintenance pages
const AssetDashboard = lazy(() => import("./pages/AssetDashboard").then(m => ({ default: m.AssetDashboard })));
const AssetDetailsPage = lazy(() => import("./pages/AssetDetailsPage").then(m => ({ default: m.AssetDetailsPage })));
const AddAssetPage = lazy(() => import("./pages/AddAssetPage"));
const InActiveAssetsDashboard = lazy(() => import("./pages/InActiveAssetsDashboard").then(m => ({ default: m.InActiveAssetsDashboard })));
const MoveAssetPage = lazy(() => import("./pages/MoveAssetPage").then(m => ({ default: m.MoveAssetPage })));
const DisposeAssetPage = lazy(() => import("./pages/DisposeAssetPage").then(m => ({ default: m.DisposeAssetPage })));

// Import Incident pages
const IncidentListDashboard = lazy(() => import("./pages/IncidentListDashboard").then(m => ({ default: m.IncidentListDashboard })));
const AddIncidentPage = lazy(() => import("./pages/AddIncidentPage").then(m => ({ default: m.AddIncidentPage })));
const IncidentDetailsPage = lazy(() => import("./pages/IncidentDetailsPage").then(m => ({ default: m.IncidentDetailsPage })));
const EditIncidentDetailsPage = lazy(() => import("./pages/EditIncidentDetailsPage").then(m => ({ default: m.EditIncidentDetailsPage })));
const PermissionsTestPage = lazy(() => import("./pages/PermissionsTestPage"));
// import { IncidentListDashboard } from './pages/IncidentListDashboard';
// import { AddIncidentPage } from './pages/AddIncidentPage';
// import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
// import { EditIncidentDetailsPage } from './pages/EditIncidentDetailsPage';

// Import Inventory pages
const InventoryDashboard = lazy(() => import("./pages/InventoryDashboard").then(m => ({ default: m.InventoryDashboard })));
const InventoryDetailsPage = lazy(() => import("./pages/InventoryDetailsPage").then(m => ({ default: m.InventoryDetailsPage })));
const InventoryFeedsPage = lazy(() => import("./pages/InventoryFeedsPage").then(m => ({ default: m.InventoryFeedsPage })));
const EditInventoryPage = lazy(() => import("./pages/EditInventoryPage").then(m => ({ default: m.EditInventoryPage })));
const InventoryConsumptionDashboard = lazy(() => import("./pages/InventoryConsumptionDashboard"));
const InventoryConsumptionViewPage = lazy(() => import("./pages/InventoryConsumptionViewPage"));
const EcoFriendlyListPage = lazy(() => import("./pages/EcoFriendlyListPage"));
const NewInboundPage = lazy(() => import("./pages/NewInboundPage").then(m => ({ default: m.NewInboundPage })));
const NewOutboundPage = lazy(() => import("./pages/NewOutboundPage").then(m => ({ default: m.NewOutboundPage })));
const OutboundListPage = lazy(() => import("./pages/OutboundListPage").then(m => ({ default: m.OutboundListPage })));
const OutboundDetailPage = lazy(() => import("./pages/OutboundDetailPage").then(m => ({ default: m.OutboundDetailPage })));

// Import Task pages
const ScheduledTaskDashboard = lazy(() => import("./pages/maintenance/ScheduledTaskDashboard").then(m => ({ default: m.ScheduledTaskDashboard })));
const TaskDetailsPage = lazy(() => import("./pages/TaskDetailsPage").then(m => ({ default: m.TaskDetailsPage })));
const JobSheetPage = lazy(() => import("./pages/JobSheetPage").then(m => ({ default: m.JobSheetPage })));

// Import Issue pages
const IssuesListPage = lazy(() => import("./pages/IssuesListPage"));
const IssueDetailsPage = lazy(() => import("./pages/IssueDetailsPage"));

// Import Utility pages
const UtilityDashboard = lazy(() => import("./pages/UtilityDashboard").then(m => ({ default: m.UtilityDashboard })));
const AddAssetDashboard = lazy(() => import("./pages/AddAssetDashboard").then(m => ({ default: m.AddAssetDashboard })));
const AddEnergyAssetDashboard = lazy(() => import("./pages/AddEnergyAssetDashboard").then(m => ({ default: m.AddEnergyAssetDashboard })));
const UtilityWaterDashboard = lazy(() => import("./pages/UtilityWaterDashboard").then(m => ({ default: m.UtilityWaterDashboard })));
const AddWaterAssetDashboard = lazy(() => import("./pages/AddWaterAssetDashboard").then(m => ({ default: m.AddWaterAssetDashboard })));
const EditWaterAssetDashboard = lazy(() => import("./pages/EditWaterAssetDashboard").then(m => ({ default: m.EditWaterAssetDashboard })));
const UtilitySTPDashboard = lazy(() => import("./pages/UtilitySTPDashboard"));
const AddSTPAssetDashboard = lazy(() => import("./pages/AddSTPAssetDashboard"));
const UtilityEVConsumptionDashboard = lazy(() => import("./pages/UtilityEVConsumptionDashboard"));
const UtilityDailyReadingsDashboard = lazy(() => import("./pages/UtilityDailyReadingsDashboard"));
const EditMeasurementPage = lazy(() => import("./pages/EditMeasurementPage"));
const UtilitySolarGeneratorDashboard = lazy(() => import("./pages/UtilitySolarGeneratorDashboard"));
const UtilityRequestDashboard = lazy(() => import("./pages/UtilityRequestDashboard").then(m => ({ default: m.UtilityRequestDashboard })));
const UtilityRequestDetailsPage = lazy(() => import("./pages/UtilityRequestDetailsPage").then(m => ({ default: m.UtilityRequestDetailsPage })));
const AddUtilityRequestPage = lazy(() => import("./pages/AddUtilityRequestPage").then(m => ({ default: m.AddUtilityRequestPage })));
const EditUtilityRequestPage = lazy(() => import("./pages/EditUtilityRequestPage").then(m => ({ default: m.EditUtilityRequestPage })));
const UtilityConsumptionDashboard = lazy(() => import("./pages/UtilityConsumptionDashboard"));
const GenerateUtilityBillPage = lazy(() => import("./pages/GenerateUtilityBillPage").then(m => ({ default: m.GenerateUtilityBillPage })));

// Import Waste Generation pages
const UtilityWasteGenerationDashboard = lazy(() => import("./pages/UtilityWasteGenerationDashboard"));
const UtilityWasteGenerationSetupDashboard = lazy(() => import("./pages/UtilityWasteGenerationSetupDashboard").then(m => ({ default: m.UtilityWasteGenerationSetupDashboard })));
const AddWasteGenerationPage = lazy(() => import("./pages/AddWasteGenerationPage"));
const EditWasteGenerationPage = lazy(() => import("./pages/EditWasteGenerationPage"));
const WasteGenerationDetailsPage = lazy(() => import("./pages/WasteGenerationDetailsPage").then(m => ({ default: m.WasteGenerationDetailsPage })));

// Import Survey pages
const SurveyListDashboard = lazy(() => import("./pages/SurveyListDashboard").then(m => ({ default: m.SurveyListDashboard })));
const AddSurveyPage = lazy(() => import("./pages/AddSurveyPage").then(m => ({ default: m.AddSurveyPage })));
const EditSurveyPage = lazy(() => import("./pages/EditSurveyPage").then(m => ({ default: m.EditSurveyPage })));
const SurveyDetailsPage = lazy(() => import("./pages/SurveyDetailsPage").then(m => ({ default: m.SurveyDetailsPage })));
const SurveyMappingDashboard = lazy(() => import("./pages/SurveyMappingDashboard").then(m => ({ default: m.SurveyMappingDashboard })));
const AddSurveyMapping = lazy(() => import("./pages/AddSurveyMapping").then(m => ({ default: m.AddSurveyMapping })));
const EditSurveyMapping = lazy(() => import("./pages/EditSurveyMapping").then(m => ({ default: m.EditSurveyMapping })));
const SurveyMappingDetailsPage = lazy(() => import("./pages/SurveyMappingDetailsPage").then(m => ({ default: m.SurveyMappingDetailsPage })));
const SurveyResponseDashboard = lazy(() => import("./pages/SurveyResponseDashboard").then(m => ({ default: m.SurveyResponseDashboard })));
const SurveyResponsePage = lazy(() => import("./pages/SurveyResponsePage").then(m => ({ default: m.SurveyResponsePage })));
const SurveyResponseDetailPage = lazy(() => import("./pages/SurveyResponseDetailPage").then(m => ({ default: m.SurveyResponseDetailPage })));

// Import Schedule pages
const ScheduleListDashboard = lazy(() => import("./pages/ScheduleListDashboard").then(m => ({ default: m.ScheduleListDashboard })));
const AddSchedulePage = lazy(() => import("./pages/AddSchedulePage").then(m => ({ default: m.AddSchedulePage })));
const ScheduleExportPage = lazy(() => import("./pages/ScheduleExportPage").then(m => ({ default: m.ScheduleExportPage })));
const EditSchedulePage = lazy(() => import("./pages/EditSchedulePage").then(m => ({ default: m.EditSchedulePage })));
const CloneSchedulePage = lazy(() => import("./pages/CloneSchedulePage"));
const CopySchedulePage = lazy(() => import("./pages/CopySchedulePage").then(m => ({ default: m.CopySchedulePage })));
const ViewSchedulePage = lazy(() => import("./pages/ViewSchedulePage").then(m => ({ default: m.ViewSchedulePage })));

const EditEventPage = lazy(() => import("./pages/EditEventPage").then(m => ({ default: m.EditEventPage })));

// Import Visitors pages
const VisitorsDashboard = lazy(() => import("./pages/VisitorsDashboard").then(m => ({ default: m.VisitorsDashboard })));
const VisitorsHistoryDashboard = lazy(() => import("./pages/VisitorsHistoryDashboard").then(m => ({ default: m.VisitorsHistoryDashboard })));
const VisitorDetailsPage = lazy(() => import("./pages/VisitorDetailsPage").then(m => ({ default: m.VisitorDetailsPage })));
const PatrollingDashboard = lazy(() => import("./pages/PatrollingDashboard").then(m => ({ default: m.PatrollingDashboard })));
const PatrollingResponsePage = lazy(() => import("./pages/PatrollingResponsePage").then(m => ({ default: m.PatrollingResponsePage })));
const PatrollingDetailsPage = lazy(() => import("./pages/PatrollingDetailsPage").then(m => ({ default: m.PatrollingDetailsPage })));
const PatrollingCreatePage = lazy(() => import("./pages/PatrollingCreatePage").then(m => ({ default: m.PatrollingCreatePage })));
const PatrollingEditPage = lazy(() => import("./pages/PatrollingEditPage").then(m => ({ default: m.PatrollingEditPage })));
const VisitorFormPage = lazy(() => import("./pages/VisitorFormPage").then(m => ({ default: m.VisitorFormPage })));
const VisitorManagementSetup = lazy(() => import("./pages/VisitorManagementSetup").then(m => ({ default: m.VisitorManagementSetup })));
const AddVisitorGatePage = lazy(() => import("./pages/AddVisitorGatePage").then(m => ({ default: m.AddVisitorGatePage })));
const EditVisitorGatePage = lazy(() => import("./pages/EditVisitorGatePage").then(m => ({ default: m.EditVisitorGatePage })));
const SupportStaffPage = lazy(() => import("./pages/SupportStaffPage").then(m => ({ default: m.SupportStaffPage })));
const EditSupportStaffPage = lazy(() => import("./pages/EditSupportStaffPage").then(m => ({ default: m.EditSupportStaffPage })));
const VisitingPurposePage = lazy(() => import("./pages/VisitingPurposePage").then(m => ({ default: m.VisitingPurposePage })));

// Import Carpool pages
const CarpoolDashboard = lazy(() => import("./pages/pulse/CarpoolDashboard").then(m => ({ default: m.CarpoolDashboard })));

// Import Pulse Analytics Dashboard
const PulseDashboardPage = lazy(() => import("./pages/pulse/PulseDashboardPage").then(m => ({ default: m.PulseDashboardPage })));

// Import Icons pages
const IconsDashboard = lazy(() => import("./pages/IconsDashboard").then(m => ({ default: m.IconsDashboard })));
const AddIconPage = lazy(() => import("./pages/AddIconPage").then(m => ({ default: m.AddIconPage })));
const EditIconPage = lazy(() => import("./pages/EditIconPage").then(m => ({ default: m.EditIconPage })));

// Import new dashboard pages
const IncidentDashboard = lazy(() => import("./pages/IncidentDashboard").then(m => ({ default: m.IncidentDashboard })));
const PermitToWorkDashboard = lazy(() => import("./pages/PermitToWorkDashboard").then(m => ({ default: m.PermitToWorkDashboard })));
const PermitDetails = lazy(() => import("./pages/PermitDetails").then(m => ({ default: m.PermitDetails })));
const PermitSafetyCheckForm = lazy(() => import("./pages/PermitSafetyCheckForm"));
const PermitPendingApprovalsDashboard = lazy(() => import("./pages/PermitPendingApprovalsDashboard").then(m => ({ default: m.PermitPendingApprovalsDashboard })));
const VendorPermitForm = lazy(() => import("./pages/VendorPermitForm").then(m => ({ default: m.VendorPermitForm })));
const FillForm = lazy(() => import("./pages/FillForm"));
const FillJSAForm = lazy(() => import("./pages/FillJSAForm"));
const AddPermitChecklist = lazy(() => import("./pages/AddPermitChecklist").then(m => ({ default: m.AddPermitChecklist })));
const PermitChecklistList = lazy(() => import("./pages/PermitChecklistList").then(m => ({ default: m.PermitChecklistList })));
const PermitChecklistDetails = lazy(() => import("./pages/PermitChecklistDetails").then(m => ({ default: m.PermitChecklistDetails })));
const EditPermitChecklist = lazy(() => import("./pages/EditPermitCheklist").then(m => ({ default: m.EditPermitChecklist })));
const CompanySetup = lazy(() => import("./pages/CompanySetup"));
const EmployeeOfTheMonthSetup = lazy(() => import("./pages/EmployeeOfTheMonthSetup"));
const AnnouncementsSetup = lazy(() => import("./pages/AnnouncementsSetup"));
const TeamSetup = lazy(() => import("./pages/settings/company-hub/team-setup"));
const FaceAuthenticationSetup = lazy(() => import("./pages/settings/company-hub/FaceAuthenticationSetup"));
const JobsPage = lazy(() => import("./pages/CompanyHub/JobsPage"));
const EditPermitPage = lazy(() => import("./pages/EditPermitPage").then(m => ({ default: m.EditPermitPage })));

const LeadDashboard = lazy(() => import("./pages/LeadDashboard").then(m => ({ default: m.LeadDashboard })));
const EnergyDashboard = lazy(() => import("./pages/EnergyDashboard").then(m => ({ default: m.EnergyDashboard })));

// // Import Inventory pages
// import { InventoryDashboard } from "./pages/InventoryDashboard";
// import { InventoryDetailsPage } from "./pages/InventoryDetailsPage";
// import { InventoryFeedsPage } from "./pages/InventoryFeedsPage";
// import { EditInventoryPage } from "./pages/EditInventoryPage";
// import InventoryConsumptionDashboard from "./pages/InventoryConsumptionDashboard";
// import InventoryConsumptionViewPage from "./pages/InventoryConsumptionViewPage";
// import EcoFriendlyListPage from "./pages/EcoFriendlyListPage";

// // Import Task pages
// import { ScheduledTaskDashboard } from "./pages/maintenance/ScheduledTaskDashboard";
// import { TaskDetailsPage } from "./pages/TaskDetailsPage";

// // Import Utility pages
// import { UtilityDashboard } from "./pages/UtilityDashboard";
// import { AddAssetDashboard } from "./pages/AddAssetDashboard";
// import { AddEnergyAssetDashboard } from "./pages/AddEnergyAssetDashboard";
// import { UtilityWaterDashboard } from "./pages/UtilityWaterDashboard";
// import { AddWaterAssetDashboard } from "./pages/AddWaterAssetDashboard";
// import UtilitySTPDashboard from "./pages/UtilitySTPDashboard";
// import AddSTPAssetDashboard from "./pages/AddSTPAssetDashboard";
// import UtilityEVConsumptionDashboard from "./pages/UtilityEVConsumptionDashboard";
// import UtilitySolarGeneratorDashboard from "./pages/UtilitySolarGeneratorDashboard";

// // Import Waste Generation pages
// import UtilityWasteGenerationDashboard from "./pages/UtilityWasteGenerationDashboard";
// import { UtilityWasteGenerationSetupDashboard } from "./pages/UtilityWasteGenerationSetupDashboard";
// import AddWasteGenerationPage from "./pages/AddWasteGenerationPage";

// // Import Survey pages
// import { SurveyListDashboard } from "./pages/SurveyListDashboard";
// import { AddSurveyPage } from "./pages/AddSurveyPage";
// import { SurveyMappingDashboard } from "./pages/SurveyMappingDashboard";
// import { SurveyResponseDashboard } from "./pages/SurveyResponseDashboard";
// import { SurveyResponsePage } from "./pages/SurveyResponsePage";

// // Import Schedule pages
// import { ScheduleListDashboard } from "./pages/ScheduleListDashboard";
// import { AddSchedulePage } from "./pages/AddSchedulePage";
// import { ScheduleExportPage } from "./pages/ScheduleExportPage";
// import { EditSchedulePage } from "./pages/EditSchedulePage";
// import { CopySchedulePage } from "./pages/CopySchedulePage";
// import { ViewSchedulePage } from "./pages/ViewSchedulePage";
const ViewPerformancePage = lazy(() => import("./pages/ViewPerformancePage").then(m => ({ default: m.ViewPerformancePage })));

// // Import Visitors pages
// import { VisitorsDashboard } from "./pages/VisitorsDashboard";
// import { VisitorsHistoryDashboard } from "./pages/VisitorsHistoryDashboard";
// import { PatrollingDashboard } from "./pages/PatrollingDashboard";
// import { PatrollingDetailsPage } from "./pages/PatrollingDetailsPage";

// Import Staff pages
const StaffsDashboard = lazy(() => import("./pages/StaffsDashboard").then(m => ({ default: m.StaffsDashboard })));

// Import Staff Details page
const StaffDetailsPage = lazy(() => import("./pages/StaffDetailsPage").then(m => ({ default: m.StaffDetailsPage })));

// Import Edit Staff page
const EditStaffPage = lazy(() => import("./pages/EditStaffPage").then(m => ({ default: m.EditStaffPage })));

// Import Add Staff page
const AddStaffPage = lazy(() => import("./pages/AddStaffPage").then(m => ({ default: m.AddStaffPage })));

// Import Mailroom pages
const InboundListPage = lazy(() => import("./pages/InboundListPage").then(m => ({ default: m.InboundListPage })));
const InboundDetailPage = lazy(() => import("./pages/InboundDetailPage").then(m => ({ default: m.InboundDetailPage })));

const FnBRestaurantDashboard = lazy(() => import("./pages/FnBRestaurantDashboard").then(m => ({ default: m.FnBRestaurantDashboard })));
const FnBRestaurantDetailsPage = lazy(() => import("./pages/FnBRestaurantDetailsPage").then(m => ({ default: m.FnBRestaurantDetailsPage })));
const ProductSetupDetailPage = lazy(() => import("./pages/ProductSetupDetailPage").then(m => ({ default: m.ProductSetupDetailPage })));
const ProductEditPage = lazy(() => import("./pages/ProductEditPage").then(m => ({ default: m.ProductEditPage })));
const RestaurantOrderDetailPage = lazy(() => import("./pages/RestaurantOrderDetailPage").then(m => ({ default: m.RestaurantOrderDetailPage })));
const FnBDiscountsPage = lazy(() => import("./pages/FnBDiscountsPage").then(m => ({ default: m.FnBDiscountsPage })));
const AddRestaurantPage = lazy(() => import("./pages/AddRestaurantPage").then(m => ({ default: m.AddRestaurantPage })));
const ParkingDashboard = lazy(() => import("./pages/ParkingDashboard"));
const ParkingDetailsPage = lazy(() => import("./pages/ParkingDetailsPage"));
const ParkingBookingsDashboard = lazy(() => import("./pages/ParkingBookingsDashboard"));
const ParkingCreatePage = lazy(() => import("./pages/ParkingCreatePage"));
const ParkingEditPage = lazy(() => import("./pages/ParkingEditPage"));
const ParkingCategoryPage = lazy(() => import("./pages/ParkingCategoryPage").then(m => ({ default: m.ParkingCategoryPage })));
const SlotConfigurationPage = lazy(() => import("./pages/SlotConfigurationPage").then(m => ({ default: m.SlotConfigurationPage })));
const AddSlotConfigurationPage = lazy(() => import("./pages/AddSlotConfigurationPage").then(m => ({ default: m.AddSlotConfigurationPage })));
const EditSlotConfigurationPage = lazy(() => import("./pages/EditSlotConfigurationPage").then(m => ({ default: m.EditSlotConfigurationPage })));
const TimeSlotSetupPage = lazy(() => import("./pages/TimeSlotSetupPage").then(m => ({ default: m.TimeSlotSetupPage })));

// Import Design Insights pages
const DesignInsightsDashboard = lazy(() => import("./pages/DesignInsightsDashboard").then(m => ({ default: m.DesignInsightsDashboard })));
const AddDesignInsightDashboard = lazy(() => import("./pages/AddDesignInsightDashboard").then(m => ({ default: m.AddDesignInsightDashboard })));
const DesignInsightDetailsDashboard = lazy(() => import("./pages/DesignInsightDetailsDashboard").then(m => ({ default: m.DesignInsightDetailsDashboard })));
const EditDesignInsightDashboard = lazy(() => import("./pages/EditDesignInsightDashboard").then(m => ({ default: m.EditDesignInsightDashboard })));
const HOTODashboard = lazy(() => import("./pages/HOTODashboard").then(m => ({ default: m.HOTODashboard })));

// Import Security pages
const VehicleParkingDashboard = lazy(() => import("./pages/VehicleParkingDashboard").then(m => ({ default: m.VehicleParkingDashboard })));
const RVehiclesDashboard = lazy(() => import("./pages/RVehiclesDashboard").then(m => ({ default: m.RVehiclesDashboard })));
const RVehiclesHistoryDashboard = lazy(() => import("./pages/RVehiclesHistoryDashboard").then(m => ({ default: m.RVehiclesHistoryDashboard })));

// Import GVehiclesDashboard
const GVehiclesDashboard = lazy(() => import("./pages/GVehiclesDashboard").then(m => ({ default: m.GVehiclesDashboard })));

// Import GVehicleOutDashboard
const GVehicleOutDashboard = lazy(() => import("./pages/GVehicleOutDashboard").then(m => ({ default: m.GVehicleOutDashboard })));

// Import Gate Pass pages
const GatePassDashboard = lazy(() => import("./pages/GatePassDashboard").then(m => ({ default: m.GatePassDashboard })));
const GatePassInwardsDashboard = lazy(() => import("./pages/GatePassInwardsDashboard").then(m => ({ default: m.GatePassInwardsDashboard })));
const GatePassInwardsDetailPage = lazy(() => import("./pages/GatePassInwardsDetailPage").then(m => ({ default: m.GatePassInwardsDetailPage })));
const AddGatePassInwardPage = lazy(() => import("./pages/AddGatePassInwardPage").then(m => ({ default: m.AddGatePassInwardPage })));
const GatePassOutwardsDashboard = lazy(() => import("./pages/GatePassOutwardsDashboard").then(m => ({ default: m.GatePassOutwardsDashboard })));
const GatePassOutwardsAddPage = lazy(() => import("./pages/GatePassOutwardsAddPage").then(m => ({ default: m.GatePassOutwardsAddPage })));
const GatePassOutwardsDetailPage = lazy(() => import("./pages/GatePassOutwardsDetailPage").then(m => ({ default: m.GatePassOutwardsDetailPage })));

// Import Space Management pages
const SpaceManagementBookingsDashboard = lazy(() => import("./pages/SpaceManagementBookingsDashboard").then(m => ({ default: m.SpaceManagementBookingsDashboard })));
const SpaceManagementSeatRequestsDashboard = lazy(() => import("./pages/SpaceManagementSeatRequestsDashboard").then(m => ({ default: m.SpaceManagementSeatRequestsDashboard })));

// Import Seat Setup pages
const SeatSetupDashboard = lazy(() => import("./pages/setup/SeatSetupDashboard").then(m => ({ default: m.SeatSetupDashboard })));
const AddSeatSetupDashboard = lazy(() => import("./pages/setup/AddSeatSetupDashboard").then(m => ({ default: m.AddSeatSetupDashboard })));
const EditSeatSetupDashboard = lazy(() => import("./pages/setup/EditSeatSetupDashboard").then(m => ({ default: m.EditSeatSetupDashboard })));
const SeatTypeDashboard = lazy(() => import("./pages/SeatTypeDashboard").then(m => ({ default: m.SeatTypeDashboard })));

// Import Shift page
const ShiftDashboard = lazy(() => import("./pages/setup/ShiftDashboard").then(m => ({ default: m.ShiftDashboard })));
const AccountShiftDashboard = lazy(() => import("./pages/ShiftDashboard").then(m => ({ default: m.ShiftDashboard })));
const AccountRosterDashboard = lazy(() => import("./pages/RosterDashboard").then(m => ({ default: m.RosterDashboard })));
const RosterCreatePage = lazy(() => import("./pages/RosterCreatePage").then(m => ({ default: m.RosterCreatePage })));
const RosterDetailPage = lazy(() => import("./pages/RosterDetailPage").then(m => ({ default: m.RosterDetailPage })));
const RosterEditPage = lazy(() => import("./pages/RosterEditPage").then(m => ({ default: m.RosterEditPage })));

// Import Setup User pages
const FMUserDashboard = lazy(() => import("./pages/setup/FMUserDashboard").then(m => ({ default: m.FMUserDashboard })));
const AddFMUserDashboard = lazy(() => import("./pages/setup/AddFMUserDashboard").then(m => ({ default: m.AddFMUserDashboard })));
const OccupantUsersDashboard = lazy(() => import("./pages/setup/OccupantUsersDashboard").then(m => ({ default: m.OccupantUsersDashboard })));
const AddOccupantUserDashboard = lazy(() => import("./pages/setup/AddOccupantUserDashboard").then(m => ({ default: m.AddOccupantUserDashboard })));

// Import User Roasters pages
const UserRoastersDashboard = lazy(() => import("./pages/setup/UserRoastersDashboard").then(m => ({ default: m.UserRoastersDashboard })));
const CreateRosterTemplateDashboard = lazy(() => import("./pages/setup/CreateRosterTemplateDashboard").then(m => ({ default: m.CreateRosterTemplateDashboard })));

// Import Employee pages
const EmployeesDashboard = lazy(() => import("./pages/setup/EmployeesDashboard").then(m => ({ default: m.EmployeesDashboard })));
const EmployeeDashboard = lazy(() => import("./pages/EmployeeDashboard").then(m => ({ default: m.EmployeeDashboard })));
const EmployeeCalendarPage = lazy(() => import("./pages/EmployeeCalendarPage").then(m => ({ default: m.EmployeeCalendarPage })));
const AddEmployeeDashboard = lazy(() => import("./pages/setup/AddEmployeeDashboard").then(m => ({ default: m.AddEmployeeDashboard })));
const EditEmployeePage = lazy(() => import("./pages/setup/EditEmployeePage").then(m => ({ default: m.EditEmployeePage })));
const CompanyHub = lazy(() => import("./pages/CompanyHub"));
const CompanyHubNew = lazy(() => import("./pages/CompanyHubNew"));
const BusinessPlan = lazy(() => import("./pages/BusinessPlan"));
const OurGroup = lazy(() => import("./pages/OurGroup"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const DocumentDrive = lazy(() => import("./pages/DocumentDrive"));
const CustomerAppPage = lazy(() => import("./pages/products/CustomerAppPage.tsx"));
const CustomerPostPossessionPage = lazy(() => import("./pages/products/CustomerPostPossessionPage"));
const HiSocietyPage = lazy(() => import("./pages/products/HiSocietyPage"));
const Snag360Page = lazy(() => import("./pages/products/Snag360Page"));
const Snag360NewPage = lazy(() => import("./pages/products/snag360-new").then(m => ({ default: m.Snag360NewPage })));
const QCPage = lazy(() => import("./pages/products/QCPage"));
const RHBPage = lazy(() => import("./pages/products/RHBPage"));
const BrokersPage = lazy(() => import("./pages/products/BrokersPage"));
const FMMatrixPage = lazy(() => import("./pages/products/FMMatrixPage"));
const GoPhygitalCorporatePage = lazy(() => import("./pages/products/GoPhygitalCorporatePage"));
const GoPhygitalCoworkingPage = lazy(() => import("./pages/products/GoPhygitalCoworkingPage"));
const TaskManagerPage = lazy(() => import("./pages/products/TaskManagerPage"));
const CPManagementPage = lazy(() => import("./pages/products/CPManagementPage"));
const VendorManagementPage = lazy(() => import("./pages/products/VendorManagementPage"));
const ProcurementPage = lazy(() => import("./pages/products/ProcurementPage"));
const LoyaltyEnginePage = lazy(() => import("./pages/products/LoyaltyEnginePage"));
const MSafePage = lazy(() => import("./pages/products/MSafePage"));
const IncidentManagementPage = lazy(() => import("./pages/products/IncidentManagementPage"));
const AppointmentsPage = lazy(() => import("./pages/products/AppointmentsPage"));
const HSEAppPage = lazy(() => import("./pages/products/HSEAppPage"));
const ClubManagementPage = lazy(() => import("./pages/products/ClubManagementPage"));
const GoPhygitalTenantsPage = lazy(() => import("./pages/products/GoPhygitalTenantsPage"));
const PTWPage = lazy(() => import("./pages/products/PTWPage"));
const ParkingPage = lazy(() => import("./pages/products/ParkingPage"));
const FacilityManagementPage = lazy(() => import("./pages/products/FacilityManagementPage"));
const CustomerAppPreSalesPage = lazy(() => import("./pages/products/CustomerAppPreSalesPage"));
// OLD: import LeaseManagementPage from './pages/products/LeaseManagementPage';
// NEW: Isolated Lease Management Page
const LeaseManagementPage = lazy(() => import("./pages/products/lease-management/LeaseManagementPage"));
const LifeCompassPage = lazy(() => import("./pages/products/LifeCompassPage"));
const BusinessCompassPage = lazy(() => import("./pages/products/BusinessCompassPage"));
const GateManagementPage = lazy(() => import("./pages/products/GateManagementPage"));
const SurveyManagementPage = lazy(() => import("./pages/products/SurveyManagementPage"));
const PTWManagementPage = lazy(() => import("./pages/products/PTWManagementPage"));
const TenantManagementPage = lazy(() => import("./pages/products/TenantManagementPage"));
const SurveysPage = lazy(() => import("./pages/products/SurveysPage"));
const LMSSalesCRMPage = lazy(() => import("./pages/products/LMSSalesCRMPage"));
const SupportCRMPage = lazy(() => import("./pages/products/SupportCRMPage"));
const RealEstateCRMPage = lazy(() => import("./pages/products/RealEstateCRMPage"));
const AccountingPage = lazy(() => import("./pages/products/AccountingPage"));
const MOMPhoneMicPage = lazy(() => import("./pages/products/MOMPhoneMicPage"));
const HRMSPage = lazy(() => import("./pages/products/HRMSPage"));
const ESGPage = lazy(() => import("./pages/products/ESGPage"));
const MailingPage = lazy(() => import("./pages/products/MailingPage"));
const OfficeAlternativePage = lazy(() => import("./pages/products/OfficeAlternativePage"));
const BudgetingWBSPage = lazy(() => import("./pages/products/BudgetingWBSPage"));
const LiquidtextPage = lazy(() => import("./pages/products/LiquidtextPage"));
const ViMilesPage = lazy(() => import("./pages/products/ViMilesPage"));
const ProductAccessGate = lazy(() => import("./pages/products/ProductAccessGate"));
const ProductLandingPage = lazy(() => import("./pages/products/ProductLandingPage"));
const HRPolicies = lazy(() => import("./pages/HRPolicies"));
const Directory = lazy(() => import("./pages/Directory"));
const EmployeeFAQ = lazy(() => import("./pages/EmployeeFAQ"));

// Import Check In Margin page
const CheckInMarginDashboard = lazy(() => import("./pages/setup/CheckInMarginDashboard").then(m => ({ default: m.CheckInMarginDashboard })));

// Import AMC pages
const AMCDashboard = lazy(() => import("./pages/AMCDashboard").then(m => ({ default: m.AMCDashboard })));
const AddAMCPage = lazy(() => import("./pages/AddAMCPage").then(m => ({ default: m.AddAMCPage })));
const AMCDetailsPage = lazy(() => import("./pages/AMCDetailsPage").then(m => ({ default: m.AMCDetailsPage })));
const EditAMCPage = lazy(() => import("./pages/EditAMCPage").then(m => ({ default: m.EditAMCPage })));

// Import Service pages
const ServiceDashboard = lazy(() => import("./pages/ServiceDashboard").then(m => ({ default: m.ServiceDashboard })));
const AddServicePage = lazy(() => import("./pages/AddServicePage").then(m => ({ default: m.AddServicePage })));
const ServiceDetailsPage = lazy(() => import("./pages/ServiceDetailsPage").then(m => ({ default: m.ServiceDetailsPage })));
const EditServicePage = lazy(() => import("./pages/EditServicePage"));

// Import Attendance pages
const AttendanceDashboard = lazy(() => import("./pages/AttendanceDashboard").then(m => ({ default: m.AttendanceDashboard })));
const AttendanceDetailsPage = lazy(() => import("./pages/AttendanceDetailsPage").then(m => ({ default: m.AttendanceDetailsPage })));

// Import Roster Calendar page
const RosterCalendarDashboard = lazy(() => import("./pages/setup/RosterCalendarDashboard").then(m => ({ default: m.RosterCalendarDashboard })));

// Import Export page
const ExportDashboard = lazy(() => import("./pages/setup/ExportDashboard").then(m => ({ default: m.ExportDashboard })));

// Import Employee Details page
const EmployeeDetailsPage = lazy(() => import("./pages/setup/EmployeeDetailsPage").then(m => ({ default: m.EmployeeDetailsPage })));

// Import Permit pages
const PermitListDashboard = lazy(() => import("./pages/PermitListDashboard").then(m => ({ default: m.PermitListDashboard })));
const AddPermitPage = lazy(() => import("./pages/AddPermitPage").then(m => ({ default: m.AddPermitPage })));

// Import Operational Audit pages
const OperationalAuditScheduledDashboard = lazy(() => import("./pages/OperationalAuditScheduledDashboard").then(m => ({ default: m.OperationalAuditScheduledDashboard })));
const ViewOperationalAuditSchedulePage = lazy(() => import("./pages/ViewOperationalAuditSchedulePage").then(m => ({ default: m.ViewOperationalAuditSchedulePage })));
const ViewOperationalAuditSchedulePerformancePage = lazy(() => import("./pages/ViewOperationalAuditSchedulePerformancePage").then(m => ({ default: m.ViewOperationalAuditSchedulePerformancePage })));
const AddOperationalAuditSchedulePage = lazy(() => import("./pages/AddOperationalAuditSchedulePage").then(m => ({ default: m.AddOperationalAuditSchedulePage })));
const OperationalAuditConductedDashboard = lazy(() => import("./pages/OperationalAuditConductedDashboard").then(m => ({ default: m.OperationalAuditConductedDashboard })));
const OperationalAuditMasterChecklistsDashboard = lazy(() => import("./pages/OperationalAuditMasterChecklistsDashboard").then(m => ({ default: m.OperationalAuditMasterChecklistsDashboard })));

// Import Vendor Audit pages
const VendorAuditScheduledDashboard = lazy(() => import("./pages/VendorAuditScheduledDashboard").then(m => ({ default: m.VendorAuditScheduledDashboard })));
const VendorAuditConductedDashboard = lazy(() => import("./pages/VendorAuditConductedDashboard").then(m => ({ default: m.VendorAuditConductedDashboard })));
const AddVendorAuditSchedulePage = lazy(() => import("./pages/AddVendorAuditSchedulePage").then(m => ({ default: m.AddVendorAuditSchedulePage })));
const AddVendorAuditPage = lazy(() => import("./pages/AddVendorAuditPage").then(m => ({ default: m.AddVendorAuditPage })));
const ViewVendorAuditPage = lazy(() => import("./pages/ViewVendorAuditPage").then(m => ({ default: m.ViewVendorAuditPage })));
const ViewVendorAuditSchedulePerformancePage = lazy(() => import("./pages/ViewVendorAuditSchedulePerformancePage").then(m => ({ default: m.ViewVendorAuditSchedulePerformancePage })));

// Import Training Audit pages
const TrainingScheduledDashboard = lazy(() => import("./pages/TrainingScheduledDashboard").then(m => ({ default: m.TrainingScheduledDashboard })));
const ViewTrainingSchedule = lazy(() => import("./pages/ViewTraningSchedule").then(m => ({ default: m.ViewTrainingSchedule })));
const ViewTrainingPerformancePage = lazy(() => import("./ViewTrainingPerformance"));
const AddTrainingSchedulePage = lazy(() => import("./pages/AddTrainingSchedulePage").then(m => ({ default: m.AddTrainingSchedulePage })));
const TrainingConductedDashboard = lazy(() => import("./pages/TrainingConductedDashboard").then(m => ({ default: m.TrainingConductedDashboard })));

// Import Asset Audit pages
const AssetAuditDashboard = lazy(() => import("./pages/AssetAuditDashboard").then(m => ({ default: m.AssetAuditDashboard })));
const AddAssetAuditPage = lazy(() => import("./pages/AddAssetAuditPage").then(m => ({ default: m.AddAssetAuditPage })));
const EditAssetAuditPage = lazy(() => import("./pages/EditAssetAuditPage").then(m => ({ default: m.EditAssetAuditPage })));
const AssetAuditDetailsPage = lazy(() => import("./pages/AssetAuditDetailsPage").then(m => ({ default: m.AssetAuditDetailsPage })));
const AssetAuditReportPage = lazy(() => import("./pages/AssetAuditReportPage").then(m => ({ default: m.AssetAuditReportPage })));

// Import Master Checklist page
const AddMasterChecklistPage = lazy(() => import("./pages/AddMasterChecklistPage").then(m => ({ default: m.AddMasterChecklistPage })));

// Import Checklist Master pages
const ChecklistMasterDashboard = lazy(() => import("./pages/ChecklistMasterDashboard").then(m => ({ default: m.ChecklistMasterDashboard })));
const AddChecklistMasterPage = lazy(() => import("./pages/AddChecklistMasterPage").then(m => ({ default: m.AddChecklistMasterPage })));
const ChecklistListPage = lazy(() => import("./pages/ChecklistListPage").then(m => ({ default: m.ChecklistListPage })));
const ChecklistMasterPage = lazy(() => import("./pages/ChecklistMasterPage").then(m => ({ default: m.ChecklistMasterPage })));

// Import Master User pages
const FMUserMasterDashboard = lazy(() => import("./pages/master/FMUserMasterDashboard").then(m => ({ default: m.FMUserMasterDashboard })));
const OccupantUserMasterDashboard = lazy(() => import("./pages/master/OccupantUserMasterDashboard").then(m => ({ default: m.OccupantUserMasterDashboard })));
const AddFMUserPage = lazy(() => import("./pages/master/AddFMUserPage").then(m => ({ default: m.AddFMUserPage })));
const EditFMUserPage = lazy(() => import("./pages/master/EditFMUserPage").then(m => ({ default: m.EditFMUserPage })));
const ViewFMUserPage = lazy(() => import("./pages/master/ViewFMUserPage").then(m => ({ default: m.ViewFMUserPage })));
const ViUsersMasterDashboard = lazy(() => import("./pages/master/ViUsersMasterDashboard").then(m => ({ default: m.ViUsersMasterDashboard })));
const ViewViUserPage = lazy(() => import("./pages/master/ViewViUserPage").then(m => ({ default: m.ViewViUserPage })));
const EditViUserPage = lazy(() => import("./pages/master/EditViUserPage").then(m => ({ default: m.EditViUserPage })));

// Import Material Master page
const MaterialMasterPage = lazy(() => import("./pages/MaterialMasterPage").then(m => ({ default: m.MaterialMasterPage })));

// Import Plant Detail Setup page
const PlantDetailSetupPage = lazy(() => import("./pages/PlantDetailSetupPage").then(m => ({ default: m.PlantDetailSetupPage })));

// Import RVehiclesInDashboard and RVehiclesOutDashboard
const RVehiclesInDashboard = lazy(() => import("./pages/RVehiclesInDashboard").then(m => ({ default: m.RVehiclesInDashboard })));
const RVehiclesOutDashboard = lazy(() => import("./pages/RVehiclesOutDashboard").then(m => ({ default: m.RVehiclesOutDashboard })));

// Import Finance pages
const MaterialPRDashboard = lazy(() => import("./pages/MaterialPRDashboard").then(m => ({ default: m.MaterialPRDashboard })));
const MaterialPRDetailsPage = lazy(() => import("./pages/MaterialPRDetailsPage").then(m => ({ default: m.MaterialPRDetailsPage })));
const CloneMaterialPRPage = lazy(() => import("./pages/CloneMaterialPRPage").then(m => ({ default: m.CloneMaterialPRPage })));
const MaterialPRFeedsPage = lazy(() => import("./pages/MaterialPRFeedsPage").then(m => ({ default: m.MaterialPRFeedsPage })));
const ServicePRDashboard = lazy(() => import("./pages/ServicePRDashboard").then(m => ({ default: m.ServicePRDashboard })));
const AddMaterialPRDashboard = lazy(() => import("./pages/AddMaterialPRDashboard").then(m => ({ default: m.AddMaterialPRDashboard })));
const AddServicePRDashboard = lazy(() => import("./pages/AddServicePRDashboard").then(m => ({ default: m.AddServicePRDashboard })));
const EditServicePRPage = lazy(() => import("./pages/EditServicePRPage").then(m => ({ default: m.EditServicePRPage })));
const ServicePRDetailsPage = lazy(() => import("./pages/ServicePRDetailsPage").then(m => ({ default: m.ServicePRDetailsPage })));
const CloneServicePRPage = lazy(() => import("./pages/CloneServicePRPage").then(m => ({ default: m.CloneServicePRPage })));
const ServicePRFeedsPage = lazy(() => import("./pages/ServicePRFeedsPage").then(m => ({ default: m.ServicePRFeedsPage })));
const PODashboard = lazy(() => import("./pages/PODashboard").then(m => ({ default: m.PODashboard })));
const AddPODashboard = lazy(() => import("./pages/AddPODashboard").then(m => ({ default: m.AddPODashboard })));
const PODetailsPage = lazy(() => import("./pages/PODetailsPage").then(m => ({ default: m.PODetailsPage })));
const POFeedsPage = lazy(() => import("./pages/POFeedsPage").then(m => ({ default: m.POFeedsPage })));
const WODashboard = lazy(() => import("./pages/WODashboard").then(m => ({ default: m.WODashboard })));
const WODetailsPage = lazy(() => import("./pages/WODetailsPage").then(m => ({ default: m.WODetailsPage })));
const AutoSavedPRDashboard = lazy(() => import("./pages/AutoSavedPRDashboard").then(m => ({ default: m.AutoSavedPRDashboard })));
const GRNSRNDashboard = lazy(() => import("./pages/GRNSRNDashboard").then(m => ({ default: m.GRNSRNDashboard })));
const AddGRNDashboard = lazy(() => import("./pages/AddGRNDashboard").then(m => ({ default: m.AddGRNDashboard })));
const GRNDetailsPage = lazy(() => import("./pages/GRNDetailsPage").then(m => ({ default: m.GRNDetailsPage })));
const GRNFeedsPage = lazy(() => import("./pages/GRNFeedsPage").then(m => ({ default: m.GRNFeedsPage })));
const InvoicesDashboard = lazy(() => import("./pages/InvoicesDashboard").then(m => ({ default: m.InvoicesDashboard })));
const InvoicesSESDashboard = lazy(() => import("./pages/InvoicesSESDashboard").then(m => ({ default: m.InvoicesSESDashboard })));
const BillBookingDashboard = lazy(() => import("./pages/BillBookingDashboard").then(m => ({ default: m.BillBookingDashboard })));
const AddBillPage = lazy(() => import("./pages/AddBillPage").then(m => ({ default: m.AddBillPage })));
const PendingApprovalsDashboard = lazy(() => import("./pages/PendingApprovalsDashboard").then(m => ({ default: m.PendingApprovalsDashboard })));
const GDNDashboard = lazy(() => import("./pages/GDNDashboard").then(m => ({ default: m.GDNDashboard })));
const AddGDNPage = lazy(() => import("./pages/AddGDNPage").then(m => ({ default: m.AddGDNPage })));
const GDNDetailsPage = lazy(() => import("./pages/GDNDetailsPage").then(m => ({ default: m.GDNDetailsPage })));
const GDNPendingApprovalsDashboard = lazy(() => import("./pages/GDNPendingApprovalsDashboard").then(m => ({ default: m.GDNPendingApprovalsDashboard })));
const GDNPendingApprovalsDetails = lazy(() => import("./pages/GDNPendingApprovalsDetails").then(m => ({ default: m.GDNPendingApprovalsDetails })));
const InvoiceDashboard = lazy(() => import("./pages/InvoiceDashboard"));

// Import WBS page
const WBSElementDashboard = lazy(() => import("./pages/WBSElementDashboard").then(m => ({ default: m.WBSElementDashboard })));

// Import Work Order pages

// Import Settings pages
const FMUsersDashboard = lazy(() => import("./pages/settings/FMUsersDashboard").then(m => ({ default: m.FMUsersDashboard })));
const CloneRolePage = lazy(() => import("./pages/settings/CloneRolePage").then(m => ({ default: m.CloneRolePage })));
const AccountDashboard = lazy(() => import("./pages/settings/AccountDashboard").then(m => ({ default: m.AccountDashboard })));

// Import Approval Matrix pages
const ApprovalMatrixDashboard = lazy(() => import("./pages/settings/ApprovalMatrixDashboard").then(m => ({ default: m.ApprovalMatrixDashboard })));
const AddApprovalMatrixDashboard = lazy(() => import("./pages/settings/AddApprovalMatrixDashboard").then(m => ({ default: m.AddApprovalMatrixDashboard })));
const EditApprovalMatrixDashboard = lazy(() => import("./pages/settings/EditApprovalMatrixDashboard").then(m => ({ default: m.EditApprovalMatrixDashboard })));

// Import Department Dashboard for Settings
const DepartmentDashboard = lazy(() => import("./pages/settings/DepartmentDashboard").then(m => ({ default: m.DepartmentDashboard })));

// Import Role Dashboard for Settings
const RoleDashboard = lazy(() => import("./pages/settings/RoleDashboard").then(m => ({ default: m.RoleDashboard })));
const AddRolePage = lazy(() => import("./pages/settings/AddRolePage").then(m => ({ default: m.AddRolePage })));

// Import AddNewBillDashboard
const AddNewBillDashboard = lazy(() => import("./pages/AddNewBillDashboard").then(m => ({ default: m.AddNewBillDashboard })));

// Import Edit FM User Details page
const EditFMUserDetailsPage = lazy(() => import("./pages/settings/EditFMUserDetailsPage").then(m => ({ default: m.EditFMUserDetailsPage })));

// Import Energy Asset Routes
const EnergyAssetDetailsPage = lazy(() => import("./pages/EnergyAssetDetailsPage").then(m => ({ default: m.EnergyAssetDetailsPage })));
const EditEnergyAssetPage = lazy(() => import("./pages/EditEnergyAssetPage").then(m => ({ default: m.EditEnergyAssetPage })));

// Import Water Asset Details Route
const WaterAssetDetailsPage = lazy(() => import("./pages/WaterAssetDetailsPage").then(m => ({ default: m.WaterAssetDetailsPage })));

// Import Edit Material PR page
const EditMaterialPRDashboard = lazy(() => import("./pages/EditMaterialPRDashboard").then(m => ({ default: m.EditMaterialPRDashboard })));
const GRNDashboard = lazy(() => import("./pages/GRNDashboard").then(m => ({ default: m.GRNDashboard })));

// Import Edit GRN page
const EditGRNDashboard = lazy(() => import("./pages/EditGRNDashboard").then(m => ({ default: m.EditGRNDashboard })));
const AddInventoryPage = lazy(() => import("./pages/AddInventoryPage").then(m => ({ default: m.AddInventoryPage })));
const EditAssetDetailsPage = lazy(() => import("./pages/EditAssetDetailsPage").then(m => ({ default: m.EditAssetDetailsPage })));

// Import M Safe pages

const MSafeDashboard = lazy(() => import("./pages/MSafeDashboard").then(m => ({ default: m.MSafeDashboard })));
const MSafeUserDetail = lazy(() => import("./pages/MSafeUserDetail").then(m => ({ default: m.MSafeUserDetail })));
const ExternalUserDetail = lazy(() => import("./pages/ExternalUserDetail").then(m => ({ default: m.ExternalUserDetail })));
const EditExternalUserPage = lazy(() => import("./pages/EditExternalUserPage").then(m => ({ default: m.EditExternalUserPage })));
const NonFTEUsersDashboard = lazy(() => import("./pages/NonFTEUsersDashboard").then(m => ({ default: m.NonFTEUsersDashboard })));
const ExternalUsersDashboard = lazy(() => import("./pages/ExternalUsersDashboard").then(m => ({ default: m.ExternalUsersDashboard })));
const KRCCFormListDashboard = lazy(() => import("./pages/KRCCFormListDashboard").then(m => ({ default: m.KRCCFormListDashboard })));
const KRCCFormDetail = lazy(() => import("./pages/KRCCFormDetail").then(m => ({ default: m.KRCCFormDetail })));

// Import Edit Roster Template page
const EditRosterTemplatePage = lazy(() => import("./pages/setup/EditRosterTemplatePage").then(m => ({ default: m.EditRosterTemplatePage })));

// Import Accounting Dashboard
const AccountingDashboard = lazy(() => import("./pages/AccountingDashboard").then(m => ({ default: m.AccountingDashboard })));

// Import Loyalty Rule Engine Dashboard
const LoyaltyRuleEngineDashboard = lazy(() => import("./pages/LoyaltyRuleEngineDashboard").then(m => ({ default: m.LoyaltyRuleEngineDashboard })));

// Import OSR pages
const OSRDashboard = lazy(() => import("./pages/OSRDashboard").then(m => ({ default: m.OSRDashboard })));
const OSRDetailsPage = lazy(() => import("./pages/OSRDetailsPage").then(m => ({ default: m.OSRDetailsPage })));

// Import OSR Generate Receipt page
const OSRGenerateReceiptPage = lazy(() => import("./pages/OSRGenerateReceiptPage").then(m => ({ default: m.OSRGenerateReceiptPage })));

// Import Market Place Accounting pages
const MarketPlaceAccountingPage = lazy(() => import("./pages/MarketPlaceAccountingPage").then(m => ({ default: m.MarketPlaceAccountingPage })));
const MarketPlaceAccountingDetailsPage = lazy(() => import("./pages/MarketPlaceAccountingDetailsPage").then(m => ({ default: m.MarketPlaceAccountingDetailsPage })));
const MarketPlaceAccountingEditPage = lazy(() => import("./pages/MarketPlaceAccountingEditPage").then(m => ({ default: m.MarketPlaceAccountingEditPage })));

// Import Market Place Cost Center page
const MarketPlaceCostCenterPage = lazy(() => import("./pages/MarketPlaceCostCenterPage").then(m => ({ default: m.MarketPlaceCostCenterPage })));

// Import CRM Campaign pages
const CRMCampaignPage = lazy(() => import("./pages/CRMCampaignPage").then(m => ({ default: m.CRMCampaignPage })));
const AddLeadPage = lazy(() => import("./pages/AddLeadPage").then(m => ({ default: m.AddLeadPage })));
const LeadDetailsPage = lazy(() => import("./pages/LeadDetailsPage").then(m => ({ default: m.LeadDetailsPage })));
const CRMEventsPage = lazy(() => import("./pages/CRMEventsPage").then(m => ({ default: m.CRMEventsPage })));
const CRMEventDetailsPage = lazy(() => import("./pages/CRMEventDetailsPage").then(m => ({ default: m.CRMEventDetailsPage })));
const AddEventPage = lazy(() => import("./pages/AddEventPage").then(m => ({ default: m.AddEventPage })));

// Import CRM Groups page
const CRMGroupsPage = lazy(() => import("./pages/CRMGroupsPage"));
const CRMGroupDetailsPage = lazy(() => import("./pages/CRMGroupDetailsPage"));

// Import Broadcast page
const BroadcastDashboard = lazy(() => import("./pages/BroadcastDashboard").then(m => ({ default: m.BroadcastDashboard })));
const AddBroadcastPage = lazy(() => import("./pages/AddBroadcastPage").then(m => ({ default: m.AddBroadcastPage })));
const EditBroadcastPage = lazy(() => import("./pages/EditBroadcastPage").then(m => ({ default: m.EditBroadcastPage })));
const BroadcastDetailsPage = lazy(() => import("./pages/BroadcastDetailsPage").then(m => ({ default: m.BroadcastDetailsPage })));

// Import Redemption Marketplace page
const RedemptionMarketplacePage = lazy(() => import("./pages/RedemptionMarketplacePage").then(m => ({ default: m.RedemptionMarketplacePage })));
const HotelRewardsPage = lazy(() => import("./pages/HotelRewardsPage").then(m => ({ default: m.HotelRewardsPage })));
const TicketDiscountsPage = lazy(() => import("./pages/TicketDiscountsPage").then(m => ({ default: m.TicketDiscountsPage })));

// Import Hotel Details page
const HotelDetailsPage = lazy(() => import("./pages/HotelDetailsPage").then(m => ({ default: m.HotelDetailsPage })));

// Import Hotel Booking page
const HotelBookingPage = lazy(() => import("./pages/HotelBookingPage").then(m => ({ default: m.HotelBookingPage })));

// Import CRM Polls page
const CRMPollsPage = lazy(() => import("./pages/CRMPollsPage"));
const AddPollPage = lazy(() => import("./pages/AddPollPage"));

// Import CRM Occupant User Detail page
const CRMOccupantUserDetailPage = lazy(() => import("./pages/CRMOccupantUserDetailPage").then(m => ({ default: m.CRMOccupantUserDetailPage })));
const CRMOccupantUserEditPage = lazy(() => import("./pages/CRMOccupantUserEditPage").then(m => ({ default: m.CRMOccupantUserEditPage })));

// Import Market Place All page
const MarketPlaceAllPage = lazy(() => import("./pages/MarketPlaceAllPage"));

// Import Market Place Installed page
const MarketPlaceInstalledPage = lazy(() => import("./pages/MarketPlaceInstalledPage").then(m => ({ default: m.MarketPlaceInstalledPage })));

// Import Market Place Updates page
const MarketPlaceUpdatesPage = lazy(() => import("./pages/MarketPlaceUpdatesPage").then(m => ({ default: m.MarketPlaceUpdatesPage })));

// Import Lease Management Detail page
const LeaseManagementDetailPage = lazy(() => import("./pages/LeaseManagementDetailPage"));

// Import Loyalty Rule Engine Detail page
const LoyaltyRuleEngineDetailPage = lazy(() => import("./pages/LoyaltyRuleEngineDetailPage"));

// Import Cloud Telephony Detail page
const CloudTelephonyDetailPage = lazy(() => import("./pages/CloudTelephonyDetailPage"));

// Import Accounting Detail page
const AccountingDetailPage = lazy(() => import("./pages/AccountingDetailPage"));

// Import Rule List page
const RuleListPage = lazy(() => import("./pages/RuleListPage").then(m => ({ default: m.RuleListPage })));
const TrainingListDashboard = lazy(() => import("./pages/TrainingListDashboard").then(m => ({ default: m.TrainingListDashboard })));
const AddTrainingRecordDashboard = lazy(() => import("./pages/AddTrainingRecordDashboard").then(m => ({ default: m.AddTrainingRecordDashboard })));
const TrainingRecordDetailsPage = lazy(() => import("./pages/TrainingRecordDetailsPage").then(m => ({ default: m.TrainingRecordDetailsPage })));

// Import Edit Checklist Master page
const EditChecklistMasterPage = lazy(() => import("./pages/EditChecklistMasterPage").then(m => ({ default: m.EditChecklistMasterPage })));

// Import View Checklist Master page
const ViewChecklistMasterPage = lazy(() => import("./pages/ViewChecklistMasterPage").then(m => ({ default: m.ViewChecklistMasterPage })));

// Import Unit Master page
const UnitMasterPage = lazy(() => import("./pages/UnitMasterPage").then(m => ({ default: m.UnitMasterPage })));

// Import Location Master pages
const GoldenQrSetupPage = lazy(() => import("./pages/master/GoldenQrSetupPage").then(m => ({ default: m.GoldenQrSetupPage })));
const BuildingPage = lazy(() => import("./pages/master/BuildingPage").then(m => ({ default: m.BuildingPage })));
const WingPage = lazy(() => import("./pages/master/WingPage").then(m => ({ default: m.WingPage })));
const AreaPage = lazy(() => import("./pages/master/AreaPage").then(m => ({ default: m.AreaPage })));
const FloorPage = lazy(() => import("./pages/master/FloorPage").then(m => ({ default: m.FloorPage })));
const UnitPage = lazy(() => import("./pages/master/UnitPage").then(m => ({ default: m.UnitPage })));
const RoomPage = lazy(() => import("./pages/master/RoomPage").then(m => ({ default: m.RoomPage })));
const OpsAccountPage = lazy(() => import("./pages/master/OpsAccountPage").then(m => ({ default: m.OpsAccountPage })));
const OrganizationDetailsPage = lazy(() => import("./pages/master/OrganizationDetailsPage").then(m => ({ default: m.OrganizationDetailsPage })));
const CompanyDetailsPage = lazy(() => import("./pages/master/CompanyDetailsPage").then(m => ({ default: m.CompanyDetailsPage })));
const HeadquartersDetailsPage = lazy(() => import("./pages/master/HeadquartersDetailsPage"));
const SiteDetailsPage = lazy(() => import("./pages/master/SiteDetailsPage"));

// Import Address Master page
const AddressMasterPage = lazy(() => import("./pages/AddressMasterPage").then(m => ({ default: m.AddressMasterPage })));

// Import new master pages
const UnitMasterByDefaultPage = lazy(() => import("./pages/UnitMasterByDefaultPage").then(m => ({ default: m.UnitMasterByDefaultPage })));
const CommunicationTemplatePage = lazy(() => import("./pages/CommunicationTemplatePage").then(m => ({ default: m.CommunicationTemplatePage })));

// Import Add Address page
const AddAddressPage = lazy(() => import("./pages/AddAddressPage").then(m => ({ default: m.AddAddressPage })));

// Import Edit Address page
const EditAddressPage = lazy(() => import("./pages/EditAddressPage").then(m => ({ default: m.EditAddressPage })));

// Import ChecklistGroupDashboard for setup and settings
const ChecklistGroupDashboard = lazy(() => import("./pages/setup/ChecklistGroupDashboard").then(m => ({ default: m.ChecklistGroupDashboard })));

// Import Booking Setup Dashboard
const BookingSetupDashboard = lazy(() => import("./pages/BookingSetupDashboard").then(m => ({ default: m.BookingSetupDashboard })));
const BookingSetupDetailPage = lazy(() => import("./pages/BookingSetupDetailPage").then(m => ({ default: m.BookingSetupDetailPage })));
const AddBookingSetupPage = lazy(() => import("./pages/AddBookingSetupPage").then(m => ({ default: m.AddBookingSetupPage })));

// Import Add Facility Booking page
const AddFacilityBookingPage = lazy(() => import("./pages/AddFacilityBookingPage").then(m => ({ default: m.AddFacilityBookingPage })));
const PaymentRedirectPage = lazy(() => import("./pages/PaymentRedirectPage").then(m => ({ default: m.PaymentRedirectPage })));
const AssetGroupsDashboard = lazy(() => import("./pages/setup/AssetGroupsDashboard").then(m => ({ default: m.AssetGroupsDashboard })));

const PaymentsMadePage = lazy(() => import("./pages/PaymentsMadePage").then(m => ({ default: m.PaymentsMadePage })));
const CreatePaymentPage = lazy(() => import("./pages/CreatePaymentPage").then(m => ({ default: m.CreatePaymentPage })));

const ApprovalMatrixSetupPage = lazy(() => import("./pages/settings/ApprovalMatrixSetupPage"));
const AddApprovalMatrixPage = lazy(() => import("./pages/settings/AddApprovalMatrixPage"));

const MobileAdminOrderDetailsPage = lazy(() => import("./pages/MobileAdminOrderDetailsPage"));
const MobileSurveyPage = lazy(() => import("./pages/mobile/MobileSurveyPage").then(m => ({ default: m.MobileSurveyPage })));

const MobileOrderPlaced = lazy(() => import("./components/mobile/MobileOrderPlaced").then(m => ({ default: m.MobileOrderPlaced })));
const ExternalFlowTester = lazy(() => import("./components/mobile/ExternalFlowTester").then(m => ({ default: m.ExternalFlowTester })));
const EmailRuleSetupPage = lazy(() => import("./pages/maintenance/EmailRuleSetupPage").then(m => ({ default: m.EmailRuleSetupPage })));
const TaskEscalationPage = lazy(() => import("./pages/maintenance/TaskEscalationPage").then(m => ({ default: m.TaskEscalationPage })));
const TicketManagementSetupPage = lazy(() => import("./pages/maintenance/TicketManagementSetupPage").then(m => ({ default: m.TicketManagementSetupPage })));
const MobileTicketsPage = lazy(() => import("./pages/mobile/MobileTicketsPage").then(m => ({ default: m.MobileTicketsPage })));
const MobileNewTicketPage = lazy(() => import("./pages/mobile/MobileNewTicketPage").then(m => ({ default: m.MobileNewTicketPage })));
const TicketListPage = lazy(() => import("./pages/TicketListPage").then(m => ({ default: m.TicketListPage })));
const MobileRestaurantPage = lazy(() => import("./pages/mobile/MobileRestaurantPage").then(m => ({ default: m.MobileRestaurantPage })));
const MobileAssetPage = lazy(() => import("./pages/mobile/MobileAssetPage").then(m => ({ default: m.MobileAssetPage })));
const MobileOwnerCostAssetPage = lazy(() => import("./pages/mobile/MobileOwnerCostAssetPage").then(m => ({ default: m.MobileOwnerCostAssetPage })));
const MobileOrdersPage = lazy(() => import("./components/mobile/MobileOrdersPage").then(m => ({ default: m.MobileOrdersPage })));
const QRTestPage = lazy(() => import("./pages/QRTestPage").then(m => ({ default: m.QRTestPage })));

const EscalationMatrixPage = lazy(() => import("./pages/maintenance/EscalationMatrixPage").then(m => ({ default: m.EscalationMatrixPage })));

// Import Setup pages
const PermitSetupDashboard = lazy(() => import("./pages/PermitSetupDashboard").then(m => ({ default: m.PermitSetupDashboard })));
const IncidentSetupDashboard = lazy(() => import("./pages/IncidentSetupDashboard").then(m => ({ default: m.IncidentSetupDashboard })));
const IncidentNewDetails = lazy(() => import("./pages/IncidentNewDetails").then(m => ({ default: m.IncidentNewDetails })));

// Import Holiday Calendar page
const SettingsHolidayCalendarPage = lazy(() => import("./pages/settings/HolidayCalendarPage").then(m => ({ default: m.HolidayCalendarPage })));
const HolidayCalendarPage = lazy(() => import("./pages/HolidayCalendarPage").then(m => ({ default: m.HolidayCalendarPage })));

const LoginPage = lazy(() => import("@/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const OTPVerificationPage = lazy(() => import("@/pages/OTPVerificationPage").then(m => ({ default: m.OTPVerificationPage })));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const ForgotPasswordOTPPage = lazy(() => import("@/pages/ForgotPasswordOTPPage").then(m => ({ default: m.ForgotPasswordOTPPage })));
const NewPasswordPage = lazy(() => import("@/pages/NewPasswordPage").then(m => ({ default: m.NewPasswordPage })));
const LoginSuccessPage = lazy(() => import("@/pages/LoginSuccessPage").then(m => ({ default: m.LoginSuccessPage })));
const PasswordResetSuccessPage = lazy(() => import("@/pages/PasswordResetSuccessPage").then(m => ({ default: m.PasswordResetSuccessPage })));
import { isAuthenticated } from "@/utils/auth";
const BookingDetailsPage = lazy(() => import("./pages/BookingDetailsPage").then(m => ({ default: m.BookingDetailsPage })));
const RestaurantOrdersTable = lazy(() => import("./components/RestaurantOrdersTable").then(m => ({ default: m.RestaurantOrdersTable })));
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getCurrency } from "./store/slices/currencySlice";
const EditBookingSetupPage = lazy(() => import("./pages/setup/EditBookingSetupPage").then(m => ({ default: m.EditBookingSetupPage })));
const MobileAdminOrdersPage = lazy(() => import("./pages/MobileAdminOrdersPage").then(m => ({ default: m.MobileAdminOrdersPage })));
const DesignInsightsSetupDashboard = lazy(() => import("./pages/DesignInsightsSetupDashboard"));
const CRMOccupantUsersDashboard = lazy(() => import("./pages/CRMOccupantUsersDashboard"));
const CRMFMUserDashboard = lazy(() => import("./pages/CRMFMUserDashboard"));
const CRMCustomersDashboard = lazy(() => import("./pages/CRMCustomersDashboard"));
const PatrollingDetailPage = lazy(() => import("./pages/PatrollingDetailPage").then(m => ({ default: m.PatrollingDetailPage })));
const WorkOrderAddPage = lazy(() => import("./pages/WorkOrderAddPage").then(m => ({ default: m.WorkOrderAddPage })));
const LMCDashboard = lazy(() => import("./pages/LMCDashboard"));
const LMCUserDetail = lazy(() => import("./pages/LMCUserDetail"));
const TrainingDashboard = lazy(() => import("./pages/TrainingDashboard"));
const TrainingUserDetailPage = lazy(() => import("./pages/TrainingUserDetailPage"));
const TrainingDetailPage = lazy(() => import("./pages/TrainingDetailPage"));
const SMTDashboard = lazy(() => import("./pages/SMTDashboard"));
const SMTDetailPage = lazy(() => import("./pages/SMTDetailPage"));
const RoleConfigList = lazy(() => import("./pages/settings/RoleConfigList").then(m => ({ default: m.RoleConfigList })));
const RoleConfigView = lazy(() => import("./pages/settings/RoleConfigView").then(m => ({ default: m.RoleConfigView })));
const RoleConfigEdit = lazy(() => import("./pages/settings/RoleConfigEdit").then(m => ({ default: m.RoleConfigEdit })));
const LockFunctionList = lazy(() => import("./pages/settings/LockFunctionList").then(m => ({ default: m.LockFunctionList })));
const LockFunctionView = lazy(() => import("./pages/settings/LockFunctionView").then(m => ({ default: m.LockFunctionView })));
const LockFunctionEdit = lazy(() => import("./pages/settings/LockFunctionEdit").then(m => ({ default: m.LockFunctionEdit })));
const LockModuleList = lazy(() => import("./pages/settings/LockModuleList").then(m => ({ default: m.LockModuleList })));
const LockSubFunctionList = lazy(() => import("./pages/settings/LockSubFunctionList").then(m => ({ default: m.LockSubFunctionList })));
const LockSubFunctionView = lazy(() => import("./pages/settings/LockSubFunctionView").then(m => ({ default: m.LockSubFunctionView })));
const LockSubFunctionEdit = lazy(() => import("./pages/settings/LockSubFunctionEdit").then(m => ({ default: m.LockSubFunctionEdit })));
const CrmCustomerDetails = lazy(() => import("./pages/CrmCustomerDetails").then(m => ({ default: m.CrmCustomerDetails })));
const EditCrmCustomer = lazy(() => import("./pages/EditCrmCustomer").then(m => ({ default: m.EditCrmCustomer })));
const MultipleUserDeletePage = lazy(() => import("./pages/MultipleUserDeletePage"));
const ReporteesReassignPage = lazy(() => import("./pages/ReporteesReassignPage"));
const InvoiceDetails = lazy(() => import("./pages/InvoiceDetails").then(m => ({ default: m.InvoiceDetails })));
const VehicleDetails = lazy(() => import("./components/VehicleDetails"));
const VehicleCheckIn = lazy(() => import("./components/VehicleCheckIn"));
const UpdateVehicleHistoryPage = lazy(() => import("./pages/UpdateVehicleHistoryPage"));
const SacHsn = lazy(() => import("./pages/SacHsn"));
const DetailPageSacHsn = lazy(() => import("./pages/DetailPageSacHsn"));
const AddSacHsn = lazy(() => import("./pages/AddSacHsn"));
const WOFeedsPage = lazy(() => import("./pages/WOFeedsPage").then(m => ({ default: m.WOFeedsPage })));
const VendorPage = lazy(() => import("./pages/VendorPage").then(m => ({ default: m.VendorPage })));
const AddVendorPage = lazy(() => import("./pages/AddVendorPage").then(m => ({ default: m.AddVendorPage })));
const EditVendorPage = lazy(() => import("./pages/EditVendorPage").then(m => ({ default: m.EditVendorPage })));
const FinanceMasterPage = lazy(() => import("./pages/FinanceMasterPage").then(m => ({ default: m.FinanceMasterPage })));
const MsafeReportDownload = lazy(() => import("./pages/MsafeReportDownload"));
const MsafeDetailReportDownload = lazy(() => import("./pages/MsafeDetailReportDownload"));
const DetailsVendorPage = lazy(() => import("./pages/DetailsVendorPage"));
const EditPODashboard = lazy(() => import("./pages/EditPODashboard").then(m => ({ default: m.EditPODashboard })));
const EditWODashboard = lazy(() => import("./pages/EditWODashboard").then(m => ({ default: m.EditWODashboard })));
const GateNumberPage = lazy(() => import("./pages/master/GateNumberPage"));
const FieldsSetupPage = lazy(() => import("./pages/master/FieldsSetupPage"));
const GatePassTypePage = lazy(() => import("./pages/master/GatePassTypePage"));
const InventoryTypePage = lazy(() => import("./pages/master/InventoryTypePage"));
const InventorySubTypePage = lazy(() => import("./pages/master/InventorySubTypePage"));
const AddGateNumberPage = lazy(() => import("./pages/master/AddGateNumberPage"));
const AddGatePassTypePage = lazy(() => import("./pages/master/AddGatePassTypePage"));
const EditGateNumberPage = lazy(() => import("./pages/master/EditGateNumberPage"));
const EditGatePassTypePage = lazy(() => import("./pages/master/EditGatePassTypePage"));
const CommunicationTemplateListPage = lazy(() => import("./pages/master/CommunicationTemplateListPage"));
const AddCommunicationTemplatePage = lazy(() => import("./pages/master/AddCommunicationTemplatePage"));
const EditCommunicationTemplatePage = lazy(() => import("./pages/master/EditCommunicationTemplatePage"));
const DocumentCategoryListPage = lazy(() => import("./pages/master/DocumentCategoryListPage"));
const AddDocumentCategoryPage = lazy(() => import("./pages/master/AddDocumentCategoryPage"));
const EditDocumentCategoryPage = lazy(() => import("./pages/master/EditDocumentCategoryPage"));

// Import Template pages
const RootCauseAnalysisListPage = lazy(() => import("./pages/master/template/RootCauseAnalysisListPage"));
const AddRootCauseAnalysisPage = lazy(() => import("./pages/master/template/AddRootCauseAnalysisPage"));
const EditRootCauseAnalysisPage = lazy(() => import("./pages/master/template/EditRootCauseAnalysisPage"));
const PreventiveActionListPage = lazy(() => import("./pages/master/template/PreventiveActionListPage"));
const AddPreventiveActionPage = lazy(() => import("./pages/master/template/AddPreventiveActionPage"));
const EditPreventiveActionPage = lazy(() => import("./pages/master/template/EditPreventiveActionPage"));
const ShortTermImpactListPage = lazy(() => import("./pages/master/template/ShortTermImpactListPage"));
const AddShortTermImpactPage = lazy(() => import("./pages/master/template/AddShortTermImpactPage"));
const EditShortTermImpactPage = lazy(() => import("./pages/master/template/EditShortTermImpactPage"));
const LongTermImpactListPage = lazy(() => import("./pages/master/template/LongTermImpactListPage"));
const AddLongTermImpactPage = lazy(() => import("./pages/master/template/AddLongTermImpactPage"));
const EditLongTermImpactPage = lazy(() => import("./pages/master/template/EditLongTermImpactPage"));
const CorrectiveActionListPage = lazy(() => import("./pages/master/template/CorrectiveActionListPage"));
const AddCorrectiveActionPage = lazy(() => import("./pages/master/template/AddCorrectiveActionPage"));
const EditCorrectiveActionPage = lazy(() => import("./pages/master/template/EditCorrectiveActionPage"));

const AddInventoryTypePage = lazy(() => import("./pages/master/AddInventoryTypePage"));
const EditInventoryTypePage = lazy(() => import("./pages/master/EditInventoryTypePage"));
const AddInventorySubTypePage = lazy(() => import("./pages/master/AddInventorySubTypePage"));
const EditInventorySubTypePage = lazy(() => import("./pages/master/EditInventorySubTypePage"));
const AddOccupantUserPage = lazy(() => import("./pages/master/AddOccupantUserPage"));
const EditOccupantUserPage = lazy(() => import("./pages/master/EditOccupantUserPage"));
const AddCRMCustomerPage = lazy(() => import("./pages/AddCRMCustomerPage").then(m => ({ default: m.AddCRMCustomerPage })));
const CheckHierarchy = lazy(() => import("./components/CheckHierarchy"));
const InvoiceFeeds = lazy(() => import("./pages/InvoiceFeeds").then(m => ({ default: m.InvoiceFeeds })));
const EditApprovalMatrixPage = lazy(() => import("./pages/settings/EditApprovalMatrixPage"));
const AllContent = lazy(() => import("./components/fm-pdf/AllContent"));
const DailyReport = lazy(() => import("./components/DailyReport"));
const PDFDownloadPage = lazy(() => import("./components/PDFDownloadPage"));
const PermissionDemo = lazy(() => import("./components/PermissionDemo"));
const CRMWalletList = lazy(() => import("./pages/CRMWalletList"));
const CRMWalletPointExpiry = lazy(() => import("./pages/CRMWalletPointExpiry"));
const CRMWalletDetails = lazy(() => import("./pages/CRMWalletDetails"));
const EditCRMWalletPointExpiry = lazy(() => import("./pages/EditCRMWalletPointExpiry"));
const EmployeeDeletionHistory = lazy(() => import("./components/EmployeeDeletionHistory"));
const AddAddressMaster = lazy(() => import("./pages/master/AddAddressMaster"));
const EditAddressMaster = lazy(() => import("./pages/master/EditAddressMaster"));
const MobileLMCPage = lazy(() => import("./pages/MobileLMCPage"));
const ViBusinessCard = lazy(() => import("./pages/mobile/ViBusinessCard").then(m => ({ default: m.ViBusinessCard })));
const CompanyPartnersSetupDashboard = lazy(() => import("./pages/CompanyPartnersSetupDashboard").then(m => ({ default: m.CompanyPartnersSetupDashboard })));
const TestimonialsSetupDashboard = lazy(() => import("./pages/TestimonialsSetupDashboard").then(m => ({ default: m.TestimonialsSetupDashboard })));
const BannerListPage = lazy(() => import("./pages/BannerListPage"));
const BannerDetailsPage = lazy(() => import("./pages/BannerDetailsPage"));
const BannerAddPage = lazy(() => import("./pages/BannerAddPage"));
const BannerEditPage = lazy(() => import("./pages/BannerEditPage"));
const AmenitySetupDashboard = lazy(() => import("./pages/AmenitySetupDashboard"));
const PlusServiceDashboard = lazy(() => import("./pages/PlusServiceDashboard"));
const AddPlusServicePage = lazy(() => import("./pages/AddPlusServicePage").then(m => ({ default: m.AddPlusServicePage })));
const EditPlusServicePage = lazy(() => import("./pages/EditPlusServicePage").then(m => ({ default: m.EditPlusServicePage })));
const ServiceCategoryDashboard = lazy(() => import("./pages/ServiceCategoryDashboard"));
const AddServiceCategoryPage = lazy(() => import("./pages/AddServiceCategoryPage").then(m => ({ default: m.AddServiceCategoryPage })));
const EditServiceCategoryPage = lazy(() => import("./pages/EditServiceCategoryPage").then(m => ({ default: m.EditServiceCategoryPage })));
const TestimonialDetailsPage = lazy(() => import("./pages/TestimonialDetailsPage"));
const AmenityDetailsPage = lazy(() => import("./pages/AmenityDetailsPage"));
const ViewOccupantUserPage = lazy(() => import("./pages/master/ViewOccupantUserPage").then(m => ({ default: m.ViewOccupantUserPage })));
const WeeklyReport = lazy(() => import("./components/WeeklyReport"));
const LocationAccountPage = lazy(() => import("./pages/master/LocationAccountPage").then(m => ({ default: m.LocationAccountPage })));
const LMCPage = lazy(() => import("./pages/LMCPage"));
const ChannelsLayout = lazy(() => import("./pages/ChannelsLayout").then(m => ({ default: m.ChannelsLayout })));
const MobileChannelsLayout = lazy(() => import("./pages/MobileChannelsLayout").then(m => ({ default: m.MobileChannelsLayout })));
const MobileChannelLayout = lazy(() => import("./pages/MobileChannelLayout"));
const MobileDMConversation = lazy(() => import("./pages/MobileDMConversation"));
const MobileGroupConversation = lazy(() => import("./pages/MobileGroupConversation"));
const DMConversation = lazy(() => import("./pages/DMConversation"));
const TaskSubmissionPage = lazy(() => import("./pages/TaskSubmissionPage").then(m => ({ default: m.TaskSubmissionPage })));
const AdminUsersDashboard = lazy(() => import("./pages/admin/AdminUsersDashboard").then(m => ({ default: m.AdminUsersDashboard })));
const UsersManagementDashboard = lazy(() => import("./pages/admin/UsersManagementDashboard").then(m => ({ default: m.UsersManagementDashboard })));

const CreateAdminUserPage = lazy(() => import("./pages/admin/CreateAdminUserPage").then(m => ({ default: m.CreateAdminUserPage })));
const UserDetailsPage = lazy(() => import("./pages/admin/UserDetailsPage").then(m => ({ default: m.UserDetailsPage })));
const AdminUsersDetails = lazy(() => import("./pages/admin/AdminUsersDetails").then(m => ({ default: m.AdminUsersDetails })));
const FeedbackDashboard = lazy(() => import("./pages/admin/FeedbackDashboard"));
const SystemAndSOP = lazy(() => import("./pages/admin/SystemAndSOP"));
const DiscReport = lazy(() => import("./pages/admin/DiscReport"));
const DocumentManagement = lazy(() => import("./pages/DocumentManagement").then(m => ({ default: m.DocumentManagement })));
const AddDocumentDashboard = lazy(() => import("./pages/AddDocumentDashboard").then(m => ({ default: m.AddDocumentDashboard })));
const EditDocumentPage = lazy(() => import("./pages/EditDocumentPage").then(m => ({ default: m.EditDocumentPage })));
const FolderDetailsPage = lazy(() => import("./pages/FolderDetailsPage").then(m => ({ default: m.FolderDetailsPage })));
const DocumentDetailPage = lazy(() => import("./pages/DocumentDetailPage").then(m => ({ default: m.DocumentDetailPage })));
const CreateFolderPage = lazy(() => import("./pages/CreateFolderPage").then(m => ({ default: m.CreateFolderPage })));
const EditFolderPage = lazy(() => import("./pages/EditFolderPage").then(m => ({ default: m.EditFolderPage })));
const OnlyOfficeEditorPage = lazy(() => import("./pages/OnlyOfficeEditorPage").then(m => ({ default: m.OnlyOfficeEditorPage })));

const DocumentShareLinkPage = lazy(() => import("./pages/DocumentShareLinkPage").then(m => ({ default: m.DocumentShareLinkPage })));
const GroupConversation = lazy(() => import("./components/GroupConversation"));
const ChannelTasksAll = lazy(() => import("./pages/ChannelTasksAll"));
const ChatTaskDetailsPage = lazy(() => import("./pages/ChatTaskDetailsPage"));
const TabularResponseDetailsPage = lazy(() => import("./pages/TabularResponseDetailsPage"));
const CurrencyPage = lazy(() => import("./pages/CurrencyPage"));
const LockedUsersDashboard = lazy(() => import("./pages/settings/LockedUsersDashboard").then(m => ({ default: m.LockedUsersDashboard })));
const PRDeletionRequests = lazy(() => import("./pages/PRDeletionRequests").then(m => ({ default: m.PRDeletionRequests })));
const DirectPDFDownloadPage = lazy(() => import("./pages/DirectPDFDownloadPage").then(m => ({ default: m.DirectPDFDownloadPage })));
const DirectPDFDownloadAPIPage = lazy(() => import("./pages/DirectPDFDownloadAPIPage").then(m => ({ default: m.DirectPDFDownloadAPIPage })));
const DeletedPRs = lazy(() => import("./pages/DeletedPRs").then(m => ({ default: m.DeletedPRs })));
const MsafeDashboardVI = lazy(() => import("./pages/MsafeDashboardVI"));
const DashboardMobile = lazy(() => import("./pages/DashboardMobile").then(m => ({ default: m.DashboardMobile })));
const SafetyCheckAudit = lazy(() => import("./pages/SafetyCheckAudit"));
const MsafeCirlce = lazy(() => import("./pages/MsafeCirlce"));
const TicketJobSheetPage = lazy(() => import("./pages/TicketJobSheetPage").then(m => ({ default: m.TicketJobSheetPage })));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const BookingList = lazy(() => import("./pages/BookingList"));
const IframeDashboardMsafe = lazy(() => import("./pages/IframeDashboardMsafe"));
const ProjectsDashboard = lazy(() => import("./pages/ProjectsDashboard").then(m => ({ default: m.ProjectsDashboard })));
const ProjectDetailsPage = lazy(() => import("./pages/ProjectDetailsPage"));
const ProjectMilestones = lazy(() => import("./pages/ProjectMilestones"));
const ProjectTasksPage = lazy(() => import("./pages/ProjectTasksPage"));
const ProjectTaskDetailsPage = lazy(() => import("./pages/ProjectTaskDetailsPage"));
const SprintDashboard = lazy(() => import("./pages/SprintDashboard").then(m => ({ default: m.SprintDashboard })));
const SprintDetailsPage = lazy(() => import("./pages/SprintDetailsPage"));
const MilestoneDetailsPage = lazy(() => import("./pages/MilestoneDetailsPage"));
const ProjectTaskDetails = lazy(() => import("./pages/ProjectTaskDetails"));
const OpportunityDashboard = lazy(() => import("./pages/OpportunityDashboard"));
const OpportunityDetailsPage = lazy(() => import("./pages/OpportunityDetailsPage"));
const ProjectRoles = lazy(() => import("./pages/ProjectRoles"));
const ProjectTeams = lazy(() => import("./pages/ProjectTeams"));
const ProjectStatus = lazy(() => import("./pages/ProjectStatus"));
const ProjectGroups = lazy(() => import("./pages/ProjectGroups"));
const ProjectTemplates = lazy(() => import("./pages/ProjectTemplates"));
const ProjectIssueTypes = lazy(() => import("./pages/ProjectIssueTypes"));
const ProjectTypes = lazy(() => import("./pages/ProjectTypes"));
const ProjectTags = lazy(() => import("./pages/ProjectTags"));
const BusinessCard = lazy(() => import("./pages/mobile/BusinessCard"));
const AskAI = lazy(() => import("./pages/AskAI"));
const MinutesOfMeeting = lazy(() => import("./pages/MinutesOfMeeting"));
const AddMoMPage = lazy(() => import("./pages/AddMoMPage"));
const EditMoMPage = lazy(() => import("./pages/EditMoMPage"));
const Todo = lazy(() => import("./pages/Todo"));
const ProjectDocuments = lazy(() => import("./pages/ProjectDocuments"));
const SupersetDashboard = lazy(() => import("./components/SupersetDashboard"));
const TicketDashboardEmployee = lazy(() => import("./pages/TicketDashboardEmplooyee").then(m => ({ default: m.TicketDashboardEmployee })));
const AddTicketDashboardEmployee = lazy(() => import("./pages/AddTicketDashboardEmployee").then(m => ({ default: m.AddTicketDashboardEmployee })));
const VisitorsDashboardEmployee = lazy(() => import("./pages/VisitorsDashboardEmployee").then(m => ({ default: m.VisitorsDashboardEmployee })));
const EmployeeBookingList = lazy(() => import("./pages/EmployeeBookingList"));
const EmployeeAddBookingPage = lazy(() => import("./pages/EmployeeAddBookingPage").then(m => ({ default: m.EmployeeAddBookingPage })));
const EmployeeFnb = lazy(() => import("./pages/EmployeeFnb").then(m => ({ default: m.EmployeeFnb })));
const TicketDetailsEmployee = lazy(() => import("./pages/TicketDetailsEmployee").then(m => ({ default: m.TicketDetailsEmployee })));
// import { VisitorFormPageEmployee } from "./pages/VisitorFormPageEmployee";
const VisitorFormPageEmployeeNew = lazy(() => import("./pages/VisitorFormPageEmployeeNew").then(m => ({ default: m.VisitorFormPageEmployeeNew })));
const VisitorDetailsPageEmployee = lazy(() => import("./pages/VisitorDetailsPageEmployee"));
const SOSDirectory = lazy(() => import("./pages/SOSDirectory"));
const EditSosDirectory = lazy(() => import("./pages/EditSosDirectory"));
const AddSosDirectory = lazy(() => import("./pages/AddSosDirectory"));
const SosDirectoryDetailsPage = lazy(() => import("./pages/SosDirectoryDetailsPage"));
const SOSCategorySetupPage = lazy(() => import("./pages/SOSCategorySetupPage"));

const ParkingBookingListEmployee = lazy(() => import("./pages/ParkingBookingListEmployee"));
const ParkingBookingAddEmployee = lazy(() => import("./pages/ParkingBookingAddEmployee"));
const ProfileDetailsPage = lazy(() => import("./pages/ProfileDetailsPage"));
const PlaceFnbOrder = lazy(() => import("./pages/PlaceFnbOrder"));
const SpaceManagementBookingsDashboardEmployee = lazy(() => import("./pages/SpaceManagementBookingsDashboardEmployee").then(m => ({ default: m.SpaceManagementBookingsDashboardEmployee })));
const SpaceManagementBookingDetailsPage = lazy(() => import("./pages/SpaceManagementBookingDetailsPage").then(m => ({ default: m.SpaceManagementBookingDetailsPage })));
const SpaceManagementBookingAddEmployee = lazy(() => import("./pages/SpaceManagementBookingAddEmployee"));
const EmployeeWallet = lazy(() => import("./pages/EmployeeWallet"));
import { useWebSocket } from "./hooks/useWebSocket";
const SprintKanban = lazy(() => import("./pages/SprintKanban"));
const Communtiy = lazy(() => import("./pages/Communtiy"));
const CommunityAdd = lazy(() => import("./pages/CommunityAdd"));
const CommunityDetails = lazy(() => import("./pages/CommunityDetails"));
const CommunityReportsPage = lazy(() => import("./pages/CommunityReportsPage"));
const CommunityEdit = lazy(() => import("./pages/CommunityEdit"));
const CuratedServiceDashboard = lazy(() => import("./pages/CuratedServiceDashboard"));
const AddCuratedServicePage = lazy(() => import("./pages/AddCuratedServicePage").then(m => ({ default: m.AddCuratedServicePage })));
const EditCuratedServicePage = lazy(() => import("./pages/EditCuratedServicePage").then(m => ({ default: m.EditCuratedServicePage })));
const CuratedServiceCategoryDashboard = lazy(() => import("./pages/CuratedServiceCategoryDashboard"));
const AddCuratedServiceCategoryPage = lazy(() => import("./pages/AddCuratedServiceCategoryPage").then(m => ({ default: m.AddCuratedServiceCategoryPage })));
const EditCuratedServiceCategoryPage = lazy(() => import("./pages/EditCuratedServiceCategoryPage").then(m => ({ default: m.EditCuratedServiceCategoryPage })));
const CommunityUserDetails = lazy(() => import("./pages/CommunityUserDetails"));
const ReportsDetailsPage = lazy(() => import("./pages/ReportsDetailsPage"));
const AmenityCategorySetup = lazy(() => import("./pages/AmenityCategorySetup"));
const VisitorPassWeb = lazy(() => import("./components/VisitorPassWeb"));
const ProjectsMobileView = lazy(() => import("./pages/ProjectsMobileView"));
const MilestoneMobileView = lazy(() => import("./pages/MilestoneMobileView"));
const ProjectTasksMobileView = lazy(() => import("./pages/ProjectTasksMobileView"));
const ProjectDetailsMobile = lazy(() => import("./pages/ProjectDetailsMobile"));
const ProjectTaskDetailsMobile = lazy(() => import("./components/ProjectTaskDetailsMobile"));
const MilestoneDetailsMobile = lazy(() => import("./components/MilestoneDetailsMobile"));
const VisitorSharingFormWeb = lazy(() => import("./components/VisitorSharingFormWeb"));
const TrainingBulkUploadPage = lazy(() => import("./pages/TrainingBulkUploadPage"));
import { ActionLayoutProvider } from "./contexts/ActionLayoutContext";
const EventUserDetailsPage = lazy(() => import("./pages/EventUserDetailsPage"));
const OnlyOfficePublicEditorPage = lazy(() => import("./pages/OnlyOfficePublicEditorPage").then(m => ({ default: m.OnlyOfficePublicEditorPage })));
const TaskDetailsMobile = lazy(() => import("./pages/TaskDetailsMobile"));
const TasksMobileView = lazy(() => import("./pages/TasksMobileView"));
const IssueDetailsMobile = lazy(() => import("./pages/IssueDetailsMobile"));
const AddIssueMobileView = lazy(() => import("./pages/AddIssueMobileView"));
const IssuesMobileView = lazy(() => import("./pages/IssuesMobileView"));
const AccessoriesSetup = lazy(() => import("./pages/AccessoriesSetup"));
const AccessoriesDetailsPage = lazy(() => import("./pages/AccessoriesDetailsPage"));
const EditFacilityBookingPage = lazy(() => import("./pages/EditFacilityBookingPage"));
const CommunityNoticeDetails = lazy(() => import("./pages/CommunityNoticeDetails").then(m => ({ default: m.CommunityNoticeDetails })));
const CommunityEventDetails = lazy(() => import("./pages/CommunityEvenetDetails").then(m => ({ default: m.CommunityEventDetails })));
const CommunityDocumentDetails = lazy(() => import("./pages/CommunityDocumentDetails"));
const ContestListPage = lazy(() => import("./pages/ContestListPage").then(m => ({ default: m.ContestListPage })));
const CreateContestPage = lazy(() => import("./pages/CreateContestPage").then(m => ({ default: m.CreateContestPage })));
const ContestDetailsPage = lazy(() => import("./pages/ContestDetailsPage").then(m => ({ default: m.ContestDetailsPage })));
const EditContestPage = lazy(() => import("./pages/EditContestPage").then(m => ({ default: m.EditContestPage })));
const RunContestPage = lazy(() => import("./pages/RunContestPage").then(m => ({ default: m.RunContestPage })));

const SpinnerContest = lazy(() => import("./components/mobile/SpinnerContest").then(m => ({ default: m.SpinnerContest })));
const ScratchCard = lazy(() => import("./components/mobile/ScratchCard").then(m => ({ default: m.ScratchCard })));
const VoucherDetails = lazy(() => import("./components/mobile/VoucherDetails").then(m => ({ default: m.VoucherDetails })));
const ScratchCardListing = lazy(() => import("./components/mobile/ScratchCardListing").then(m => ({ default: m.ScratchCardListing })));
const ContestPromotion = lazy(() => import("./components/mobile/ContestPromotion").then(m => ({ default: m.ContestPromotion })));
const FlipCard = lazy(() => import("./components/mobile/FlipCard").then(m => ({ default: m.FlipCard })));
const FlipCardDetails = lazy(() => import("./components/mobile/FlipCardDetails").then(m => ({ default: m.FlipCardDetails })));
import { SpeechProvider } from "./contexts/SpeechContext";

const SupportedServiceDashboard = lazy(() => import("./pages/SupportedServiceDashboard"));
const SupportedServiceAdd = lazy(() => import("./pages/SupportedServiceAdd").then(m => ({ default: m.SupportedServiceAdd })));
const SupportedServiceEdit = lazy(() => import("./pages/SupportedServiceEdit").then(m => ({ default: m.SupportedServiceEdit })));
const SupportContactSetupPage = lazy(() => import("./pages/SupportContactSetupPage"));
const AddSupportContactPage = lazy(() => import("./pages/AddSupportContactPage").then(m => ({ default: m.AddSupportContactPage })));
const GreSiteAssignmentSetupPage = lazy(() => import("./pages/GreSiteAssignmentSetupPage"));
const AddGreSiteAssignmentPage = lazy(() => import("./pages/AddGreSiteAssignmentPage").then(m => ({ default: m.AddGreSiteAssignmentPage })));
// import RouteLogger from "./components/RouteLogger";

const AddBookingSetupClubPage = lazy(() => import("./pages/ClubManagement/AmenityBookingSetupClubAdd").then(m => ({ default: m.AddBookingSetupClubPage })));
const AddClubBroadcastPage = lazy(() => import("./pages/AddClubBroadcastPage").then(m => ({ default: m.AddClubBroadcastPage })));
const AddClubEventPage = lazy(() => import("./pages/AddClubEventPage").then(m => ({ default: m.AddClubEventPage })));
const AddFacilityBookingClubPage = lazy(() => import("./pages/ClubManagement/AmenityBookingAdd").then(m => ({ default: m.AddFacilityBookingClubPage })));
const AddGuestUserPage = lazy(() => import("./pages/ClubManagement/AddGuestUserPage").then(m => ({ default: m.AddGuestUserPage })));
const AddMembershipPlanPage = lazy(() => import("./pages/AddMembershipPlanPage").then(m => ({ default: m.AddMembershipPlanPage })));
const AddPaymentPlan = lazy(() => import("./pages/settings/AddPaymentPlan").then(m => ({ default: m.AddPaymentPlan })));
const AmenityBookingDetailsClubPage = lazy(() => import("./pages/ClubManagement/AmenityBookingDetails").then(m => ({ default: m.AmenityBookingDetailsClubPage })));
const BillCreatePage = lazy(() => import("./pages/BillCreatePage").then(m => ({ default: m.BillCreatePage })));
const BillCyclesDetails = lazy(() => import("./pages/ClubManagement/BillCyclesDetails").then(m => ({ default: m.BillCyclesDetails })));
const BillDetailPage = lazy(() => import("./pages/BillDetailPage").then(m => ({ default: m.BillDetailPage })));
const BillListPage = lazy(() => import("./pages/BillListPage").then(m => ({ default: m.BillListPage })));
const BookingSetupClubDashboard = lazy(() => import("./pages/ClubManagement/AmenityBookingSetupClub").then(m => ({ default: m.BookingSetupClubDashboard })));
const BookingSetupDetailClubPage = lazy(() => import("./pages/ClubManagement/AmenityBookingSetupClubDetails").then(m => ({ default: m.BookingSetupDetailClubPage })));
const BudgetDashboard = lazy(() => import("./pages/ClubManagement/BudgetDashboard").then(m => ({ default: m.BudgetDashboard })));
const ChargeSetupDetails = lazy(() => import("./pages/ClubManagement/ChargeSetupDetails").then(m => ({ default: m.ChargeSetupDetails })));
const ChartOfAccountDetails = lazy(() => import("./pages/ClubManagement/ChartOfAccountDetails").then(m => ({ default: m.ChartOfAccountDetails })));
const ClubBroadcastDashboard = lazy(() => import("./pages/ClubBroadcastDashboard").then(m => ({ default: m.ClubBroadcastDashboard })));
const ClubBroadcastDetailsPage = lazy(() => import("./pages/ClubBroadcastDetailsPage").then(m => ({ default: m.ClubBroadcastDetailsPage })));
const ClubEventDetailsPage = lazy(() => import("./pages/ClubEventDetailsPage").then(m => ({ default: m.ClubEventDetailsPage })));
const ClubEventsPage = lazy(() => import("./pages/ClubEventPage").then(m => ({ default: m.ClubEventsPage })));
const EditBookingSetupClubPage = lazy(() => import("./pages/ClubManagement/AmenityBookingSetupClubEdit").then(m => ({ default: m.EditBookingSetupClubPage })));
const EditGuestUserPage = lazy(() => import("./pages/ClubManagement/EditGuestUserPage").then(m => ({ default: m.EditGuestUserPage })));
const EditMembershipPlanPage = lazy(() => import("./pages/EditMembershipPlanPage").then(m => ({ default: m.EditMembershipPlanPage })));
const ExpenseCreatePage = lazy(() => import("./pages/ExpenseCreatePage").then(m => ({ default: m.ExpenseCreatePage })));
const ExpenseDetailPage = lazy(() => import("./pages/ExpenseDetailPage").then(m => ({ default: m.ExpenseDetailPage })));
const ExpenseListPage = lazy(() => import("./pages/ExpenseListPage").then(m => ({ default: m.ExpenseListPage })));
const GuestUserMasterDashboard = lazy(() => import("./pages/ClubManagement/GuestUserMasterDashboard").then(m => ({ default: m.GuestUserMasterDashboard })));
const ItemsDetails = lazy(() => import("./pages/ClubManagement/ItemsDetails").then(m => ({ default: m.ItemsDetails })));
const ManualJournalDetails = lazy(() => import("./pages/ClubManagement/ManualJournalDetails").then(m => ({ default: m.ManualJournalDetails })));
const MembershipPlanDashboard = lazy(() => import("./pages/MembershipPlanDashboard").then(m => ({ default: m.MembershipPlanDashboard })));
const MembershipPlanDetailsPage = lazy(() => import("./pages/MembershipPlanDetailsPage").then(m => ({ default: m.MembershipPlanDetailsPage })));
const PaymentDetailPage = lazy(() => import("./pages/settings/PaymentDetailPage").then(m => ({ default: m.PaymentDetailPage })));
const PaymentManagementDashboard = lazy(() => import("./pages/settings/PaymentManagementDashboard").then(m => ({ default: m.PaymentManagementDashboard })));
const PaymentPlanDetails = lazy(() => import("./pages/settings/PaymentPlanDetails").then(m => ({ default: m.PaymentPlanDetails })));
const PaymentPlanSetup = lazy(() => import("./pages/settings/PaymentPlanSetup").then(m => ({ default: m.PaymentPlanSetup })));
const PurchaseOrderCreatePage = lazy(() => import("./pages/PurchaseOrderCreatePage").then(m => ({ default: m.PurchaseOrderCreatePage })));
const PurchaseOrderDetailPage = lazy(() => import("./pages/PurchaseOrderDetailPage").then(m => ({ default: m.PurchaseOrderDetailPage })));
const PurchaseOrderListPage = lazy(() => import("./pages/PurchaseOrderListPage").then(m => ({ default: m.PurchaseOrderListPage })));
const PurchaseOrderEditPage = lazy(() => import("./pages/Accounting/PurchaseOrderEdit").then(m => ({ default: m.PurchaseOrderEditPage })));
const RecurringBillCreatePage = lazy(() => import("./pages/ClubManagement/RecurringBillCreatePage").then(m => ({ default: m.RecurringBillCreatePage })));
const RecurringBillsDashboard = lazy(() => import("./pages/ClubManagement/RecurringBillsDashboard").then(m => ({ default: m.RecurringBillsDashboard })));
const NewRecurringExpensePage = lazy(() => import("./pages/New Recurring Expense"));
const RecurringExpensesListPage = lazy(() => import("./pages/ClubManagement/RecurringExpensesListPage"));
const RecurringExpenseDetailPage = lazy(() => import("./pages/ClubManagement/RecurringExpenseDetailPage"));
const RecurringInvoicesCreatePage = lazy(() => import("./pages/ClubManagement/RecurringInvoicesCreatePage").then(m => ({ default: m.RecurringInvoicesCreatePage })));
const EditRecurringInvoicePage = lazy(() => import("./pages/EditRecurringInvoicePage").then(m => ({ default: m.EditRecurringInvoicePage })));
const RecurringInvoicesListPage = lazy(() => import("./pages/ClubManagement/RecurringInvoicesListPage").then(m => ({ default: m.RecurringInvoicesListPage })));
const RecurringBillDetails = lazy(() => import("./pages/ClubManagement/RecurringBillDetails"));
const RecurringJournalDashboard = lazy(() => import("./pages/ClubManagement/RecurringJournalDashboard").then(m => ({ default: m.RecurringJournalDashboard })));
const RecurringJournalDetails = lazy(() => import("./pages/ClubManagement/RecurringJournalDetails").then(m => ({ default: m.RecurringJournalDetails })));
const SalesOrderCreatePage = lazy(() => import("./pages/SalesOrderCreatePage").then(m => ({ default: m.SalesOrderCreatePage })));
const EditSalesOrderPage = lazy(() => import("./pages/EditSalesOrderPage").then(m => ({ default: m.EditSalesOrderPage })));
const SalesOrderDetailPage = lazy(() => import("./pages/SalesOrderDetailPage").then(m => ({ default: m.SalesOrderDetailPage })));
const SalesOrderListPage = lazy(() => import("./pages/SalesOrderListPage").then(m => ({ default: m.SalesOrderListPage })));
const TransactionsDetails = lazy(() => import("./pages/ClubManagement/TransationsDetails").then(m => ({ default: m.TransactionsDetails })));
const ViewClubOccupantUser = lazy(() => import("./pages/master/ViewClubOccupantUser").then(m => ({ default: m.ViewClubOccupantUser })));
const ViewGuestUserPage = lazy(() => import("./pages/ClubManagement/ViewGuestUserPage").then(m => ({ default: m.ViewGuestUserPage })));
const AddClubMembershipPage = lazy(() => import("./pages/ClubManagement/AddClubMembershipPage"));
const AddGroupMembershipPage = lazy(() => import("./pages/ClubManagement/AddGroupMembershipPage"));
const AmenityBookingListClub = lazy(() => import("./pages/ClubManagement/AmenityBookingList"));
const AccountTypeSummaryReport = lazy(() => import("./pages/ClubManagement/AccountTypeSummaryReport"));
const AccountTypeSummaryDetailReport = lazy(() => import("./pages/ClubManagement/AccountTypeSummaryDetailReport"));
const AccountTypeTransactionsReport = lazy(() => import("./pages/ClubManagement/AccountTypeTransactionsReport"));
const AccountTypeTransactionsDetailPage = lazy(() => import("./pages/ClubManagement/AccountTypeTransactionsDetailPage"));
const AccountTransactionsDetailPage = lazy(() => import("./pages/ClubManagement/AccountTransactionsDetailPage"));
const AccountTransactionsReport = lazy(() => import("./pages/ClubManagement/AccountTransactionsReport"));
const ARAgingSummaryReport = lazy(() => import("./pages/ClubManagement/ARAgingSummaryReport"));
const ARAgingDetailsReport = lazy(() => import("./pages/ClubManagement/ARAgingDetailsReport"));
const InvoiceDetailsReport = lazy(() => import("./pages/ClubManagement/InvoiceDetailsReport"));
const RetainerInvoiceDetailsReport = lazy(() => import("./pages/ClubManagement/RetainerInvoiceDetailsReport"));
const SalesOrderDetailsReport = lazy(() => import("./pages/ClubManagement/SalesOrderDetailsReport"));
const DeliveryChallanDetailsReport = lazy(() => import("./pages/ClubManagement/DeliveryChallanDetailsReport"));
const QuoteDetailsReport = lazy(() => import("./pages/ClubManagement/QuoteDetailsReport"));
const CustomerBalanceSummaryReport = lazy(() => import("./pages/ClubManagement/CustomerBalanceSummaryReport"));
const ReceivableSummaryReport = lazy(() => import("./pages/ClubManagement/ReceivableSummaryReport"));
const ReceivableDetailsReport = lazy(() => import("./pages/ClubManagement/ReceivableDetailsReport"));
const BalanceSheetReport = lazy(() => import("./pages/ClubManagement/BalanceSheetReport"));
const BannerSetupDashboard = lazy(() => import("./pages/BannerSetupDashboard"));
const BillCyclesAdd = lazy(() => import("./pages/ClubManagement/BillCyclesAdd"));
const BillCyclesDashboard = lazy(() => import("./pages/ClubManagement/BillCyclesDashboard"));
const BudgetAdd = lazy(() => import("./pages/ClubManagement/BudgetAdd"));
const BudgetAddNew = lazy(() => import("./pages/ClubManagement/BudgetAddNew"));
const BudgetDetails = lazy(() => import("./pages/ClubManagement/BudgetDetails"));
const ChargeSetupAdd = lazy(() => import("./pages/ClubManagement/ChargeSetupAdd"));
const ChargeSetupDashboard = lazy(() => import("./pages/ClubManagement/ChargeSetupDashboard"));
const ChartOfAccountsDashboard = lazy(() => import("./pages/ClubManagement/ChartOfAccountsDashboard"));
const ClubGroupMembershipDashboard = lazy(() => import("./pages/ClubManagement/ClubGroupMembershipDashboard"));
const ClubGroupMembershipDetails = lazy(() => import("./pages/ClubManagement/ClubGroupMembershipDetails"));
const ClubMembershipDashboard = lazy(() => import("./pages/ClubManagement/ClubMembershipDashboard"));
const ClubMembershipDetailPage = lazy(() => import("./pages/ClubManagement/ClubMembershipDetailPage"));
const CustomersAdd = lazy(() => import("./pages/ClubManagement/CustomersAdd"));
const CustomersEdit = lazy(() => import("./pages/ClubManagement/CustomersEdit"));
const CustomersDashboard = lazy(() => import("./pages/ClubManagement/CustomersDashboard"));
const DetailsSaleCustomerReport = lazy(() => import("./pages/ClubManagement/DetailsSaleCustomerReport"));
const SalesByItemReport = lazy(() => import("./pages/ClubManagement/SalesByItemReport"));
const DetailsSalesByItemReport = lazy(() => import("./pages/ClubManagement/DetailsSalesByItemReport"));
const SalesBySalesPersonReport = lazy(() => import("./pages/ClubManagement/SalesBySalesPersonReport"));
const SalesSummaryReport = lazy(() => import("./pages/ClubManagement/SalesSummaryReport"));
const SalesByCustomerReport = lazy(() => import("./pages/ClubManagement/SalesByCustomerReport"));

const EditBudget = lazy(() => import("./pages/ClubManagement/BudgetEdit"));
const GstPayableReport = lazy(() => import("./pages/ClubManagement/GstPayableReport"));
const ItemsAdd = lazy(() => import("./pages/ClubManagement/ItemsAdd"));
const ItemsDashboard = lazy(() => import("./pages/ClubManagement/ItemsDashboard"));
const ItemsEdit = lazy(() => import("./pages/ClubManagement/ItemsEdit"));
const ManualJournalAdd = lazy(() => import("./pages/ClubManagement/ManualJournalAdd"));
const ManualJournalDashboard = lazy(() => import("./pages/ClubManagement/ManualJournalDashboard"));
const ManualJournalEdit = lazy(() => import("./pages/ClubManagement/ManualJournalEdit"));
const OpeningBalance = lazy(() => import("./pages/ClubManagement/OpeningBalance"));
const ProfitAndLossReport = lazy(() => import("./pages/ClubManagement/ProfitAndLossReport"));
const RecurringJournalAdd = lazy(() => import("./pages/ClubManagement/RecurringJournalAdd"));
const TDSReceivablesSummaryDetails = lazy(() => import("./pages/ClubManagement/TDSReceivablesSummaryDetails"));
const TDSReceivablesSummaryReport = lazy(() => import("./pages/ClubManagement/TDSReceivablesSummaryReport"));
const TDSSummaryReport = lazy(() => import("./pages/ClubManagement/TDSSummaryReport"));
const TaxSetup = lazy(() => import("./pages/ClubManagement/TaxSetup"));
const TaxSummaryReport = lazy(() => import("./pages/ClubManagement/TaxSummaryReport"));
const TransactionsAdd = lazy(() => import("./pages/ClubManagement/TransationsAdd"));
const TransactionsDashboard = lazy(() => import("./pages/ClubManagement/TransactionsDashboard"));
const TransactionsEdit = lazy(() => import("./pages/ClubManagement/TransactionsEdit"));
import useRouteLogger from "./hooks/useRouteLogger";
const ClubEditOccupantUserPage = lazy(() => import("./pages/master/ClubEditOccupantUserPage"));
const ClubAddOccupantUserPage = lazy(() => import("./pages/master/ClubAddOccupantUserPage"));
const RideDetail = lazy(() => import("./pages/pulse/RideDetail").then(m => ({ default: m.RideDetail })));
import { OccupantUserListWrapper } from "./components/OccupantUserListWrapper";
import { OccupantUserDetailWrapper } from "./components/OccupantUserDetailWrapper";
import { LoginPageWrapper } from "./components/LoginPageWrapper";
import RecurringInvoiceDetailsPage from "./pages/ClubManagement/RecurringInvoiceDetails.tsx";
import PaymentMadeDetailsPage from "./pages/components/PaymentDetailView.tsx";
import RideSettingsPage from "./pages/pulse/RideSettingsPage.tsx";
const ModulesManagement = lazy(() => import("./pages/settings/ModulesManagement"));
const InvoiceAdd = lazy(() => import("./pages/ClubManagement/InvoiceAdd").then(m => ({ default: m.InvoiceAdd })));
const EditInvoicePage = lazy(() => import("./pages/EditInvoicePage").then(m => ({ default: m.EditInvoicePage })));
const InvoiceDashboardAccounting = lazy(() => import("./pages/ClubManagement/InvoiceDashboard").then(m => ({ default: m.InvoiceDashboardAccounting })));
const InvoiceDashboardDetailsPage = lazy(() => import("./pages/ClubManagement/InvoiceDashboardDetailsPage").then(m => ({ default: m.InvoiceDashboardDetailsPage })));
const QuotesDashboard = lazy(() => import("./pages/ClubManagement/QuotesDashboard").then(m => ({ default: m.QuotesDashboard })));
const QuotesAdd = lazy(() => import("./pages/ClubManagement/QuotesAdd").then(m => ({ default: m.QuotesAdd })));
const QuotesEdit = lazy(() => import("./pages/ClubManagement/QuotesEdit").then(m => ({ default: m.QuotesEdit })).catch(() => import("./pages/ClubManagement/QuotesEdit")));
const QuotesDetails = lazy(() => import("./pages/ClubManagement/QuotesDetails").then(m => ({ default: m.QuotesDetails })));
const RideReviews = lazy(() => import("./pages/pulse/RideReviews").then(m => ({ default: m.RideReviews })));
const UserDetail = lazy(() => import("./pages/pulse/UserDetail").then(m => ({ default: m.UserDetail })));
const ActiveReports = lazy(() => import("./pages/pulse/ActiveReports").then(m => ({ default: m.ActiveReports })));
const ActiveSOS = lazy(() => import("./pages/pulse/ActiveSOS").then(m => ({ default: m.ActiveSOS })));
const RideTracking = lazy(() => import("./pages/pulse/RideTracking").then(m => ({ default: m.RideTracking })));

const DeliveryChallansDashboard = lazy(() => import("./pages/ClubManagement/DeliveryChallansDashboard").then(m => ({ default: m.DeliveryChallansDashboard })));
const DeliveryChallansAdd = lazy(() => import("./pages/ClubManagement/DeliveryChallansAdd").then(m => ({ default: m.DeliveryChallansAdd })));
const PaymentsReceivedListPage = lazy(() => import("./pages/PaymentsReceivedListPage"));
const RecordPaymentPage = lazy(() => import("./pages/RecordPaymentPage"));
const EditPaymentReceivedPage = lazy(() => import("./pages/EditPaymentReceivedPage").then(m => ({ default: m.EditPaymentReceivedPage })));
const PaymentReceivedDetailsPage = lazy(() => import("./pages/PaymentReceivedDetailsPage"));
const SectionMaster = lazy(() => import("./pages/ClubManagement/SectionMaster"));
const CreditNoteListPage = lazy(() => import("./pages/ClubManagement/CreditNoteListPage"));
const CreditNoteAddPage = lazy(() => import("./pages/ClubManagement/CreditNoteAddPage").then(m => ({ default: m.CreditNoteAddPage })));
const CreditNoteDetailPage = lazy(() => import("./pages/ClubManagement/CreditNoteDetailPage"));
const VendorCreditsListPage = lazy(() => import("./pages/ClubManagement/VendorCreditsListPage"));
const VendorCreditsAdd = lazy(() => import("./pages/ClubManagement/VendorCreditsAdd").then(m => ({ default: m.VendorCreditsAdd })));
const VendorCreditsDetails = lazy(() => import("./pages/ClubManagement/VendorCreditsDetails"));
const CreditNoteEditPage = lazy(() => import("./pages/ClubManagement/CreditNoteEditPage").then(m => ({ default: m.CreditNoteEditPage })));
const VendorCreditsEdit = lazy(() => import("./pages/ClubManagement/VendorCreditsEdit").then(m => ({ default: m.VendorCreditsEdit })));
const TaxSetupMaster = lazy(() => import("./pages/ClubManagement/TaxSetupMaster"));
const TaxRateSetupPage = lazy(() => import("./pages/ClubManagement/TaxRateSetupPage"));
const DefaultTaxPreferencesPage = lazy(() => import("./pages/ClubManagement/DefaultTaxPreferencesPage"));
const SalesPersonMaster = lazy(() => import("./pages/ClubManagement/SalesPersonMaster"));
const PaymentTermsMaster = lazy(() => import("./pages/ClubManagement/PaymentTermsMaster"));
const CustomersDetails = lazy(() => import("./pages/ClubManagement/CustomersDetails").then(m => ({ default: m.CustomersDetails })));
const BillsAdd = lazy(() => import("./pages/ClubManagement/BillsAdd").then(m => ({ default: m.BillsAdd })));
const BillDetails = lazy(() => import("./pages/ClubManagement/BillDetails"));
const CreditNoteDetails = lazy(() => import("./pages/ClubManagement/CreditNoteDetails"));
const StepathonPage = lazy(() => import("./pages/StepathonPage"));
const VendorCreditDetails = lazy(() => import("./pages/ClubManagement/VendorCreditDetails"));
const MobileTodo = lazy(() => import("./pages/MobileTodo"));
const BalanceSheetDetails = lazy(() => import("./pages/ClubManagement/BalanceSheetDetails").then(m => ({ default: m.BalanceSheetDetails })));
const ProfitAndLossDetails = lazy(() => import("./pages/ClubManagement/ProfitAndLossDetails").then(m => ({ default: m.ProfitAndLossDetails })));
const CashFlowDetails = lazy(() => import("./pages/ClubManagement/CashFlowDetails").then(m => ({ default: m.CashFlowDetails })));
const GSTPayableDetails = lazy(() => import("./pages/ClubManagement/GSTPayableDetails").then(m => ({ default: m.GSTPayableDetails })));
const GstReceivableReport = lazy(() => import("./pages/ClubManagement/GSTReceivableReport"));
const GSTReceivableDetails = lazy(() => import("./pages/ClubManagement/GSTReceivableDetails").then(m => ({ default: m.GSTReceivableDetails })));
const TaxSummaryDetails = lazy(() => import("./pages/ClubManagement/TaxSummaryDetails").then(m => ({ default: m.TaxSummaryDetails })));
const TrialBalance = lazy(() => import("./pages/ClubManagement/TrialBalance"));
const TrialBalanceDetails = lazy(() => import("./pages/ClubManagement/TrialBalanceDetails").then(m => ({ default: m.TrialBalanceDetails })));
const RoleDashboardVi = lazy(() => import("./pages/settings/RoleDashboardVi").then(m => ({ default: m.RoleDashboardVi })));
const AddRolePageVi = lazy(() => import("./pages/settings/AddRolePageVi").then(m => ({ default: m.AddRolePageVi })));
const GSTR7Report = lazy(() => import("./pages/ClubManagement/GSTR-7Report"));
const GSTR3BSummary = lazy(() => import("./pages/ClubManagement/GSTR-3BSummary"));
const GSTR3BSummaryDetails = lazy(() => import("./pages/ClubManagement/GSTR3BSummaryDetails"));
const SummaryOfInwardSupplies = lazy(() => import("./pages/ClubManagement/SummaryOfInwardSupplies"));
const PMT06SelfAssessmentBasis = lazy(() => import("./pages/ClubManagement/PMT06SelfAssessmentBasis"));
const SummaryOfOutwardSuppliesGSTR1 = lazy(() => import("./pages/ClubManagement/SummaryOfOutwardSuppliesGSTR1"));
const InvoiceFurnishingFacilityIFF = lazy(() => import("./pages/ClubManagement/InvoiceFurnishingFacilityIFF"));
const DayBook = lazy(() => import("./pages/ClubManagement/DayBook"));
const JournalReport = lazy(() => import("./pages/ClubManagement/JournalReport"));
const FixedAssetReport = lazy(() => import("./pages/ClubManagement/FixedAssetReport"));
const AccountingReportStub = lazy(() => import("./pages/Accounting/AccountingReportStub"));
const TimesheetDetails = lazy(() => import("./pages/Accounting/TimesheetDetails"));
const TimesheetProfitabilitySummary = lazy(() => import("./pages/Accounting/TimesheetProfitabilitySummary"));
const ProjectSummary = lazy(() => import("./pages/Accounting/ProjectSummary"));
const ProjectDetails = lazy(() => import("./pages/Accounting/ProjectDetails"));
const ProjectsCostSummary = lazy(() => import("./pages/Accounting/ProjectsCostSummary"));
const ProjectsRevenueSummary = lazy(() => import("./pages/Accounting/ProjectsRevenueSummary"));
const ProjectsPerformanceSummary = lazy(() => import("./pages/Accounting/ProjectsPerformanceSummary"));
const SystemMails = lazy(() => import("./pages/ClubManagement/SystemMails"));
const ActivityLogsAuditTrail = lazy(() => import("./pages/ClubManagement/ActivityLogsAuditTrail"));
const ExceptionReport = lazy(() => import("./pages/ClubManagement/ExceptionReport"));
const PortalActivities = lazy(() => import("./pages/ClubManagement/PortalActivities"));
const CustomerReviews = lazy(() => import("./pages/ClubManagement/CustomerReviews"));
const APIUsage = lazy(() => import("./pages/ClubManagement/APIUsage"));
const GeneralLedger = lazy(() => import("./pages/ClubManagement/GeneralLedger"));
const DetailedGeneralLedger = lazy(() => import("./pages/ClubManagement/DetailedGeneralLedger"));
const SelfInvoiceSummary = lazy(() => import("./pages/ClubManagement/SelfInvoiceSummary"));
const TCSSummaryForm27EQ = lazy(() => import("./pages/ClubManagement/TCSSummaryForm27EQ"));
const PaymentsRecievedReport = lazy(() => import("./pages/ClubManagement/PaymentsRecievedReport"));
const PaymentsMadeReport = lazy(() => import("./pages/Accounting/PaymentsMadeReport"));
const PayableDetailsReport = lazy(() => import("./pages/Accounting/PayableDetailsReport"));
const APAgingDetailsReport = lazy(() => import("./pages/Accounting/APAgingDetailsReport"));
const PayableRefundHistoryReport = lazy(() => import("./pages/Accounting/PayableRefundHistoryReport"));
const PurchaseOrderDetailsReport = lazy(() => import("./pages/Accounting/PurchaseOrderDetailsReport"));
const ExpenseDetailsReport = lazy(() => import("./pages/Accounting/ExpenseDetailsReport"));
const ExpenseSummaryByCategoryReport = lazy(() => import("./pages/Accounting/ExpenseSummaryByCategoryReport"));
const ExpensesByCustomerReport = lazy(() => import("./pages/Accounting/ExpensesByCustomerReport"));
const ExpensesByEmployeeReport = lazy(() => import("./pages/Accounting/ExpensesByEmployeeReport"));
const ExpensesByProjectReport = lazy(() => import("./pages/Accounting/ExpensesByProjectReport"));
const PurchaseOrdersByVendorReport = lazy(() => import("./pages/Accounting/PurchaseOrdersByVendorReport"));
const PurchasesByItemReport = lazy(() => import("./pages/Accounting/PurchasesByItemReport"));
const BillableExpenseDetails = lazy(() => import("./pages/Accounting/BillableExpenseDetails"));
const PayableSummaryReport = lazy(() => import("./pages/Accounting/PayableSummaryReport"));
const TimeToGetPaidReport = lazy(() => import("./pages/ClubManagement/TimeToGetPaidReport"));
const CreditNoteDetailsReport = lazy(() => import("./pages/ClubManagement/CreditNoteDetailsReport"));
const RefundHistoryReport = lazy(() => import("./pages/ClubManagement/RefundHistoryReport"));
const RecurringInvoiceDetailsReport = lazy(() => import("./pages/ClubManagement/RecurringInvoiceDetailsReport"));
const VendorBalanceSummaryReport = lazy(() => import("./pages/ClubManagement/VendorBalanceSummaryReport"));
const APAgingSummaryReport = lazy(() => import("./pages/ClubManagement/APAgingSummaryReport"));
const BillDetailsReport = lazy(() => import("./pages/ClubManagement/BillDetailsReport"));
const VendorCreditsDetailsReport = lazy(() => import("./pages/ClubManagement/VendorCreditsDetailsReport"));
const GSTR9Summary = lazy(() => import("./pages/ClubManagement/Gstr9summary"));
const CashFlowStatementReport = lazy(() => import("./pages/ClubManagement/CashFlowStatementReport"));
const DebtorsCreditorsReport = lazy(() => import("./pages/ClubManagement/DebitorsCreditorsReport"));
const BusinessPerformanceRatioReport = lazy(() => import("./pages/ClubManagement/BusinessPerformanceRatioReport").then(m => ({ default: m.BusinessPerformanceRatioReport })));
const BusinessCompassProfile = lazy(() => import("./pages/BusinessCompass/BusinessCompassProfile"));
const BusinessCompassDashboard = lazy(() => import("./pages/BusinessCompass/BusinessCompassDashboard"));
const Feedback = lazy(() => import("./pages/BusinessCompass/Feedback"));
const Announcement = lazy(() => import("./pages/BusinessCompass/Announcement"));
const Leaderboard = lazy(() => import("./pages/BusinessCompass/Leaderboard"));
const DiscPersonalityAssessment = lazy(() => import("./pages/BusinessCompass/DiscPersonalityAssessment"));
const HelpCenter = lazy(() => import("./pages/BusinessCompass/HelpCenter"));
const WeeklyReports = lazy(() => import("./pages/BusinessCompass/WeeklyReports"));
const BusinessCompassTasksAndIssues = lazy(() => import("./pages/BusinessCompass/BusinessCompassTasksAndIssues"));
const DirectoryAndChat = lazy(() => import("./pages/BusinessCompass/DirectoryAndChat"));
const BusinessCompassDailyReport = lazy(() => import("./pages/BusinessCompass/BusinessCompassDailyReport"));
const BusinessPlanAndGoles = lazy(() => import("./pages/AdminCompass/BusinessPlanAndGoles"));
const DailyMeeting = lazy(() => import("./pages/AdminCompass/DailyMeeting"));
const KPI = lazy(() => import("./pages/AdminCompass/KPI"));
const ReportAnalytics = lazy(() => import("./pages/ReportAnalytics"));
const WeeklyMeetings = lazy(() => import("./pages/AdminCompass/WeeklyMeetings"));
const TeamDashboard = lazy(() => import("./pages/AdminCompass/TeamDashboard"));
const HouseSetupPage = lazy(() => import("./pages/HouseSetupPage"));
const HSNCodeSetup = lazy(() => import("./pages/HSNCodeSetup"));
const DashboardUI = lazy(() => import("./pages/DashboardUI"));
const OrganisationMaster = lazy(() => import("./pages/ClubManagement/OrganisationMaster"));
const MyInboxPage = lazy(() => import("./features/inbox/MyInboxPage.tsx"));
const ExpenseEditPage = lazy(() => import("./pages/ExpenseEditPage.tsx").then(m => ({ default: m.ExpenseEditPage })));
const TaxSetupTabView = lazy(() => import("./pages/ClubManagement/TaxSetupTabView.tsx"));
const BillEdit = lazy(() => import("./pages/ClubManagement/BillEdit.tsx").then(m => ({ default: m.BillEdit })));
const RecurringBillEdit = lazy(() => import("./pages/ClubManagement/RecurringBillEdit.tsx").then(m => ({ default: m.RecurringBillEdit })));
const PulseContests = lazy(() => import("./pages/PulseContests.tsx"));
const PulseContestRewards = lazy(() => import("./pages/PulseContestRewards.tsx"));
const PulseContestRewardsDetails = lazy(() => import("./pages/PulseContestRewardsDetails.tsx"));
const PulseContestRewardCreate = lazy(() => import("./pages/PulseContestRewardCreate.tsx"));

const queryClient = new QueryClient();

// WebSocket Notification Handler Component
const WebSocketNotificationInitializer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { manager: webSocketManager, connect } = useWebSocket();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const socketUrl = `wss://${localStorage.getItem("baseUrl")}/cable`;
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Connect to WebSocket
  // useEffect(() => {
  //   console.warn("🔌 WebSocket connection effect running");

  //   if (token) {
  //     console.warn("✅ Token available, connecting...");
  //     connect(token, socketUrl);
  //   } else {
  //     console.error("❌ No token available for WebSocket connection");
  //   }

  //   return () => {
  //     console.warn("🧹 Cleaning up WebSocket subscriptions");
  //   };
  // }, [token, connect, socketUrl]);

  // // Subscribe to notifications
  // useEffect(() => {
  //   const subscriptionTimer = setTimeout(() => {
  //     const sub = webSocketManager.subscribeToUserNotifications({
  //       onConnected: () => {
  //         console.warn("🎉 SUBSCRIPTION SUCCESSFUL - Notifications connected!");
  //         setIsSubscribed(true);
  //         toast.success("Real-time notifications enabled!", {
  //           duration: 2000,
  //         });
  //       },
  //       onMessageNotification: (message) => {
  //         console.warn("📨 Received notification:", message);
  //         // if (message.user_id !== currentUser.id) {
  //         //   return;
  //         // }
  //         const typeCheckMap = {
  //           conversation: message.user_id,
  //           projectspace: message.user_id,
  //           newtaskmanagement: message.responsible_person_id,
  //           newissue: message.responsible_person_id,
  //         };

  //         const relevantId = typeCheckMap[message.ntype];

  //         if (Number(relevantId) !== Number(currentUser.id)) {
  //           return;
  //         }

  //         // Add notification to context
  //         const notification = {
  //           id: message.id || Date.now(),
  //           title: message.title || "New Notification",
  //           message:
  //             message.body || message.message || "You have a new notification",
  //           ntype: message.ntype,
  //           type: message.type,
  //           time: new Date().toLocaleTimeString([], {
  //             hour: "2-digit",
  //             minute: "2-digit",
  //           }),
  //           read: false,
  //           payload: message.payload,
  //         };

  //         addNotification(notification);

  //         // Show browser notification
  //         if ("Notification" in window) {
  //           Notification.requestPermission().then((permission) => {
  //             if (permission === "granted") {
  //               const notif = new Notification(notification.title, {
  //                 body: notification.message,
  //                 icon: "/lovable-uploads/d49da91f-2f0a-4ecc-8d4b-0f2b84c1a96b.png",
  //               });

  //               notif.onclick = () => {
  //                 window.focus();
  //                 if (message.ntype === "conversation") {
  //                   navigate(
  //                     `/vas/channels/messages/${message.conversation_id}`
  //                   );
  //                 } else if (message.ntype === "projectspace") {
  //                   navigate(
  //                     `/vas/channels/groups/${message.project_space_id}`
  //                   );
  //                 }
  //               };
  //             }
  //           });
  //         }
  //       },
  //       onDisconnected: () => {
  //         console.warn("❌ Notification subscription disconnected");
  //         setIsSubscribed(false);
  //         toast.error("Real-time notifications disconnected");
  //       },
  //     });
  //     console.warn("📋 Subscription object:", sub);
  //   }, 2000); // Wait 2 seconds for connection to establish

  //   return () => {
  //     console.warn("⏰ Clearing subscription timer");
  //     clearTimeout(subscriptionTimer);
  //   };
  // }, [
  //   isSubscribed,
  //   webSocketManager,
  //   currentUser?.id,
  //   navigate,
  //   addNotification,
  // ]);

  return <>{children}</>;
};

const ProductLandingButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProductDetailPath = /^\/product\/[^/]+\/?$/.test(location.pathname);

  if (!isProductDetailPath) {
    return null;
  }

  const productPath = location.pathname.replace(/\/$/, "");

  return (
    <button
      type="button"
      onClick={() => navigate(`${productPath}/landing`)}
      className="fixed right-6 top-28 z-50 rounded-full border border-[#DA7756]/30 bg-[#DA7756] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#DA7756]/20 transition-all hover:bg-[#C9684B] focus:outline-none focus:ring-2 focus:ring-[#DA7756]/30"
    >
      Landing Page
    </button>
  );
};

function App() {
  const dispatch = useAppDispatch();
  const [baseUrl, setBaseUrl] = useState(localStorage.getItem("baseUrl"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const hostname = window.location.hostname;
  // Check if it's Oman site
  const isOmanSite = hostname.includes("oig.gophygital.work");

  const navigate = useNavigate();

  // const { manager: webSocketManager, connect } = useWebSocket();
  // const socketUrl = `wss://${localStorage.getItem("baseUrl")}/cable`;
  // const currentUser = JSON.parse(localStorage.getItem("user"));
  // const [isSubscribed, setIsSubscribed] = useState(false);

  // Initialize global MUI Select search enhancer
  useEffect(() => {
    console.warn(
      "🚀 Initializing Global MUI Select Search Enhancer from App.tsx"
    );
    const cleanup = initializeGlobalMUISelectSearchEnhancer();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  // Check authentication and fetch currency when site is available
  const selectedSite = useAppSelector((s) => s.site.selectedSite);
  useEffect(() => {
    if (!baseUrl || !token) return;
    const urlSiteId =
      new URLSearchParams(window.location.search).get("site_id") || "";
    const id =
      (selectedSite?.id ? String(selectedSite.id) : "") ||
      urlSiteId ||
      localStorage.getItem("selectedSiteId") ||
      "";
    if (!id) return;

    const fetchCurrency = async () => {
      try {
        const response = (await dispatch(
          getCurrency({ baseUrl, token, id })
        ).unwrap()) as Array<{ currency?: string; symbol?: string }>;
        const currency =
          Array.isArray(response) &&
            (response[0]?.currency as string | undefined)
            ? response[0].currency
            : "INR";
        const currencySymbol =
          Array.isArray(response) && (response[0]?.symbol as string | undefined)
            ? response[0].symbol
            : "₹";
        if (currency) localStorage.setItem("currency", currency);
        if (currencySymbol)
          localStorage.setItem("currencySymbol", currencySymbol);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrency();
  }, [baseUrl, token, selectedSite?.id, dispatch]);

  // useEffect(() => {
  //   console.warn("🔌 WebSocket connection effect running");

  //   if (token) {
  //     console.warn("✅ Token available, connecting...");
  //     connect(token, socketUrl);
  //   } else {
  //     console.error("❌ No token available for WebSocket connection");
  //   }

  //   return () => {
  //     console.warn("🧹 Cleaning up WebSocket subscriptions");
  //   };
  // }, [token, connect, socketUrl]);

  // useEffect(() => {
  //   const subscriptionTimer = setTimeout(() => {
  //     const sub = webSocketManager.subscribeToUserNotifications({
  //       onConnected: () => {
  //         console.warn("🎉 SUBSCRIPTION SUCCESSFUL - Chat connected!");
  //         setIsSubscribed(true);
  //         toast.success("Real-time connection established!", {
  //           duration: 2000,
  //         });
  //       },
  //       onMessageNotification: (message) => {
  //         console.warn(message);
  //         // if (
  //         //   (message.ntype === "conversation" ||
  //         //     message.ntype === "projectspace" ||
  //         //     message.ntype === 'newtaskmanagement' ||
  //         //     message.ntype === 'newissue') &&
  //         //   (message?.user_id !== currentUser.id && message?.responsible_person_id !== currentUser.id)
  //         // ) {
  //         //   return;
  //         // }
  //         const typeCheckMap = {
  //           conversation: message.user_id,
  //           projectspace: message.user_id,
  //           newtaskmanagement: message.responsible_person_id,
  //           newissue: message.responsible_person_id,
  //         };

  //         const relevantId = typeCheckMap[message.ntype];

  //         if (Number(relevantId) !== Number(currentUser.id)) {
  //           return;
  //         }

  //         if (!("Notification" in window)) {
  //           toast.error("Not supported");
  //           return;
  //         }

  //         Notification.requestPermission().then((permission) => {
  //           if (permission === "granted") {
  //             const notification = new Notification(message.title, {
  //               body: message.body,
  //             });

  //             notification.onclick = () => {
  //               window.focus();
  //               if (message.ntype === "conversation") {
  //                 navigate(`/vas/channels/messages/${message.conversation_id}`);
  //               } else if (message.ntype === "projectspace") {
  //                 navigate(`/vas/channels/groups/${message.project_space_id}`);
  //               }
  //             };
  //           }
  //         });
  //       },
  //       onDisconnected: () => {
  //         console.warn("❌ Chat subscription disconnected");
  //         setIsSubscribed(false);
  //         toast.error("Real-time chat disconnected");
  //       },
  //     });
  //     console.warn("📋 Subscription object:", sub);
  //   }, 2000); // Wait 2 seconds for connection to establish

  //   return () => {
  //     console.warn("⏰ Clearing subscription timer");
  //     clearTimeout(subscriptionTimer);
  //   };
  // }, [isSubscribed, webSocketManager, currentUser?.id, navigate]);

  return (
    <>
      {/* <Router> */}
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <EnhancedSelectProvider>
            <LayoutProvider>
              <PermissionsProvider>
                <SpeechProvider>
                  <ActionLayoutProvider>
                    <WebSocketNotificationInitializer>
                      <ProductLandingButton />
                      <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c72030] border-t-transparent" /></div>}>

                        <Routes>
                          {/* Public Routes - No Authentication Required */}
                          <Route
                            path="/document/share/:id"
                            element={<DocumentShareLinkPage />}
                          />
                          <Route
                            path="/documents/editor/:documentId"
                            element={<OnlyOfficePublicEditorPage />}
                          />

                          {/* Backend Routes */}
                          <Route
                            path="/backend-console"
                            element={
                              <ProtectedRoute>
                                <BackendLayout />
                              </ProtectedRoute>
                            }
                          >
                            <Route index element={<div className="p-8" />} />
                            <Route
                              path="sms-management"
                              element={<SmsManagementPage />}
                            />
                          </Route>

                          {/* Admin Routes */}
                          <Route
                            path="/ops-console"
                            element={
                              <ProtectedRoute>
                                <AdminLayout />
                              </ProtectedRoute>
                            }
                          >
                            <Route
                              path="master/location/account"
                              element={<OpsAccountPage />}
                            />
                            <Route
                              path="master/location/account/organizations/details/:id"
                              element={<OrganizationDetailsPage />}
                            />
                            <Route
                              path="master/location/account/companies/details/:id"
                              element={<CompanyDetailsPage />}
                            />
                            <Route
                              path="master/location/account/headquarters/details/:id"
                              element={<HeadquartersDetailsPage />}
                            />
                            <Route
                              path="master/location/account/sites/details/:id"
                              element={<SiteDetailsPage />}
                            />
                            <Route
                              path="admin/users"
                              element={<AdminUsersDashboard />}
                            />
                            <Route
                              path="admin/users/manage"
                              element={<UsersManagementDashboard />}
                            />
                            <Route
                              path="admin/users/:id"
                              element={<UserDetailsPage />}
                            />
                            <Route
                              path="admin/users/edit/:id"
                              element={<AdminUsersDetails />}
                            />

                            <Route
                              path="admin/create-admin-user"
                              element={<CreateAdminUserPage />}
                            />
                            <Route
                              path="admin/feedback-dashboard"
                              element={<FeedbackDashboard />}
                            />
                            <Route
                              path="admin/systems-sops"
                              element={<SystemAndSOP />}
                            />
                            <Route
                              path="admin/disc-report"
                              element={<DiscReport />}
                            />

                            <Route
                              path="master/user/fm-users"
                              element={<FMUserMasterDashboard />}
                            />
                            <Route
                              path="master/user/fm-users/add"
                              element={<AddFMUserPage />}
                            />
                            <Route
                              path="master/user/fm-users/edit/:id"
                              element={<EditFMUserPage />}
                            />
                            <Route
                              path="master/user/fm-users/view/:id"
                              element={<ViewFMUserPage />}
                            />
                            <Route
                              path="settings/roles/role"
                              element={<RoleDashboard />}
                            />
                            <Route
                              path="settings/vi-roles/role"
                              element={<RoleDashboardVi />}
                            />
                            <Route
                              path="settings/roles/role/add"
                              element={<AddRolePage />}
                            />
                            <Route
                              path="settings/vi-roles/role/add"
                              element={<AddRolePageVi />}
                            />
                            <Route
                              path="settings/account/lock-module"
                              element={<LockModuleList />}
                            />
                            <Route
                              path="settings/modules"
                              element={<ModulesManagement />}
                            />

                            {/* <Route
                      path="settings/account/lock-module/view/:id"
                      element={<LockModuleView />}
                    />
                    <Route
                      path="settings/account/lock-module/edit/:id"
                      element={<LockModuleEdit />}
                    /> */}
                            <Route
                              path="settings/account/lock-function"
                              element={<LockFunctionList />}
                            />
                            <Route
                              path="settings/account/lock-function/view/:id"
                              element={<LockFunctionView />}
                            />
                            <Route
                              path="settings/account/lock-function/edit/:id"
                              element={<LockFunctionEdit />}
                            />
                            {/* <Route
                      path="settings/account/lock-function/create"
                      element={<LockFunctionCreate />}
                    /> */}
                            <Route
                              path="settings/account/lock-sub-function"
                              element={<LockSubFunctionList />}
                            />
                            <Route
                              path="settings/account/lock-sub-function/view/:id"
                              element={<LockSubFunctionView />}
                            />
                            <Route
                              path="settings/account/lock-sub-function/edit/:id"
                              element={<LockSubFunctionEdit />}
                            />
                            <Route
                              path="settings/account/locked-users"
                              element={<LockedUsersDashboard />}
                            />

                            <Route
                              path="settings/account/user-list-otp"
                              element={<OccupantUserListWrapper />}
                            />
                            <Route
                              path="settings/account/user-list-otp/detail/:id"
                              element={<OccupantUserDetailWrapper />}
                            />

                            {/* <Route
                      path="settings/account/lock-sub-function/create"
                      element={<LockSubFunctionCreate />}
                    /> */}
                          </Route>

                          {/* Login Route */}
                          <Route path="/thepdf" element={<AllContent />} />
                          <Route path="/dailypdf" element={<DailyReport />} />
                          <Route path="/weeklypdf" element={<WeeklyReport />} />
                          <Route
                            path="/visitor/gatepass"
                            element={<VisitorPassWeb />}
                          />
                          <Route
                            path="/visitors/fill_form/:id"
                            element={<VisitorSharingFormWeb />}
                          />

                          <Route
                            path="/login"
                            element={
                              isAuthenticated() ? (
                                <Navigate to="/" replace />
                              ) : (
                                <LoginPageWrapper
                                  setBaseUrl={setBaseUrl}
                                  setToken={setToken}
                                />
                              )
                            }
                          />
                          <Route
                            path="/login-page"
                            element={
                              isAuthenticated() ? (
                                <Navigate
                                  to="/ops-console/settings/account/user-list-otp"
                                  replace
                                />
                              ) : (
                                <LoginPageWrapper
                                  setBaseUrl={setBaseUrl}
                                  setToken={setToken}
                                />
                              )
                            }
                          />
                          <Route
                            path="/otp-verification"
                            element={<OTPVerificationPage />}
                          />
                          <Route
                            path="/forgot-password"
                            element={<ForgotPasswordPage />}
                          />
                          <Route
                            path="/forgot-password-otp"
                            element={<ForgotPasswordOTPPage />}
                          />
                          <Route
                            path="/new-password"
                            element={<NewPasswordPage />}
                          />
                          <Route
                            path="/login-success"
                            element={<LoginSuccessPage />}
                          />
                          <Route
                            path="/password-reset-success"
                            element={<PasswordResetSuccessPage />}
                          />

                          <Route
                            path="/direct-pdf-download/:taskId"
                            element={<DirectPDFDownloadPage />}
                          />
                          <Route
                            path="/app/direct-pdf-download/:taskId"
                            element={<DirectPDFDownloadAPIPage />}
                          />
                          <Route
                            path="/dashboard-mobile"
                            element={<DashboardMobile />}
                          />
                          <Route path="/sitemap" element={<Sitemap />} />

                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/pulse/analytics"
                            element={
                              <ProtectedRoute>
                                <PulseDashboardPage />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/msafe-dashboard"
                            element={
                              <ProtectedRoute>
                                <IframeDashboardMsafe />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/dashboard-executive"
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/msafedashboard"
                            element={
                              <ProtectedRoute>
                                <MsafeDashboardVI />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/permissions-test"
                            element={
                              <ProtectedRoute>
                                <Layout>
                                  <PermissionsTestPage />
                                </Layout>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/PermissionDemo"
                            element={<PermissionDemo />}
                          />

                          <Route
                            path="/tickets"
                            element={
                              <ProtectedRoute>
                                <TicketDashboard />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/tickets/add"
                            element={
                              <ProtectedRoute>
                                <AddTicketDashboard />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/tickets/details/:id"
                            element={
                              <ProtectedRoute>
                                <TicketDetailsPage />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/tickets/edit/:id"
                            element={
                              <ProtectedRoute>
                                <UpdateTicketsPage />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/tickets/:id/feeds"
                            element={
                              <ProtectedRoute>
                                <TicketFeedsPage />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/visitors"
                            element={
                              <ProtectedRoute>
                                <VisitorsDashboard />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/bookings"
                            element={
                              <ProtectedRoute>
                                <BookingList />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/bookings/add"
                            element={
                              <ProtectedRoute>
                                <AddFacilityBookingPage />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/bookings/:id"
                            element={
                              <ProtectedRoute>
                                <BookingDetailsPage />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/cost-approval/:approvalId/:userId"
                            element={
                              <ProtectedRoute>
                                <CostApprovalStandalonePage />
                              </ProtectedRoute>
                            }
                          />

                          <Route
                            path="/"
                            element={
                              <ProtectedRoute>
                                <Layout>
                                  <div />
                                </Layout>
                              </ProtectedRoute>
                            }
                          >
                            <Route index element={<Index />} />
                            <Route
                              path="/bookings-overview"
                              element={
                                <ProtectedRoute>
                                  <EmployeeBookingList />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/bookings-overview/add"
                              element={
                                <ProtectedRoute>
                                  <EmployeeAddBookingPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/bookings-overview/:id"
                              element={
                                <ProtectedRoute>
                                  <BookingDetailsPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/profile"
                              element={
                                <ProtectedRoute>
                                  <ProfileDetailsPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/employee-wallet"
                              element={
                                <ProtectedRoute>
                                  <EmployeeWallet />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/parking"
                              element={
                                <ProtectedRoute>
                                  <ParkingBookingListEmployee />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/parking-booking-employee"
                              element={
                                <ProtectedRoute>
                                  <ParkingBookingListEmployee />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/parking-booking-employee/add"
                              element={
                                <ProtectedRoute>
                                  <ParkingBookingAddEmployee />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/employee/fnb"
                              element={
                                <ProtectedRoute>
                                  <EmployeeFnb needPadding={true} />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/employee/fnb/add"
                              element={
                                <ProtectedRoute>
                                  <PlaceFnbOrder />
                                </ProtectedRoute>
                              }
                            />
                            {/* <Route
                            path="/employee/company-hub"
                            element={
                              <ProtectedRoute>
                                <CompanyHub />
                              </ProtectedRoute>
                            }
                          /> */}
                            <Route
                              path="/employee/company-hub"
                              element={
                                <ProtectedRoute>
                                  <CompanyHubNew />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/vas/channels"
                              element={<ChannelsLayout />}
                            >
                              <Route
                                index
                                element={
                                  <div
                                    className={`flex justify-center items-center ${localStorage.getItem("user_role_name") === "Employee" ? "h-[calc(100vh-64px)]" : "h-[calc(100vh-112px)]"} w-[calc(100vw-32rem)]`}
                                  >
                                    Select a Chat/Group to view messages
                                  </div>
                                }
                              />
                              <Route
                                path="/vas/channels/messages/:id"
                                element={<DMConversation />}
                              />
                              <Route
                                path="/vas/channels/groups/:id"
                                element={<GroupConversation />}
                              />
                            </Route>
                            <Route
                              path="/vas/channels/tasks"
                              element={<ChannelTasksAll />}
                            />
                            <Route
                              path="/business-card"
                              element={<BusinessCard />}
                            />
                            <Route path="/ask-ai" element={<AskAI />} />
                            <Route
                              path="/vas/channels/tasks/:id"
                              element={<ChatTaskDetailsPage />}
                            />
                            <Route
                              path="/business-compass/profile"
                              element={<BusinessCompassProfile />}
                            />
                            <Route
                              path="/business-compass/dashboard"
                              element={<BusinessCompassDashboard />}
                            />
                            <Route
                              path="/business-compass/daily-report"
                              element={<BusinessCompassDailyReport />}
                            />
                            <Route
                              path="/business-compass/weekly-report"
                              element={<WeeklyReports />}
                            />
                            {/* <Route
                            path="/business-compass/tasks-and-issues"
                            element={<BusinessCompassTasksAndIssues />}
                          /> */}
                            <Route
                              path="/business-compass/tasks"
                              element={<ProjectTasksPage />}
                            />
                            <Route
                              path="/business-compass/tasks/:taskId"
                              element={<ProjectTaskDetails />}
                            />
                            <Route
                              path="/business-compass/issues"
                              element={<IssuesListPage />}
                            />
                            <Route
                              path="/business-compass/issues/:id"
                              element={<IssueDetailsPage />}
                            />
                            <Route
                              path="/business-compass/todo"
                              element={<Todo />}
                            />
                            <Route
                              path="/business-compass/channels"
                              element={<ChannelsLayout />}
                            >
                              <Route
                                index
                                element={
                                  <div
                                    className={`flex justify-center items-center ${localStorage.getItem("user_role_name") === "Employee" ? "h-[calc(100vh-64px)]" : "h-[calc(100vh-112px)]"} w-[calc(100vw-32rem)]`}
                                  >
                                    Select a Chat/Group to view messages
                                  </div>
                                }
                              />
                              <Route
                                path="/business-compass/channels/messages/:id"
                                element={<DMConversation />}
                              />
                              <Route
                                path="/business-compass/channels/groups/:id"
                                element={<GroupConversation />}
                              />
                            </Route>
                            <Route
                              path="/business-compass/directory-and-chat"
                              element={<DirectoryAndChat />}
                            />
                            <Route
                              path="/business-compass/feedback"
                              element={<Feedback />}
                            />
                            <Route
                              path="/business-compass/announcements"
                              element={<Announcement />}
                            />
                            <Route
                              path="/business-compass/leaderboard"
                              element={<Leaderboard />}
                            />
                            <Route
                              path="/business-compass/disc-personality-assessment"
                              element={<DiscPersonalityAssessment />}
                            />
                            <Route
                              path="/business-compass/help-center"
                              element={<HelpCenter />}
                            />
                            <Route
                              path="/admin-compass/business-plan-goals"
                              element={<BusinessPlanAndGoles />}
                            />
                            <Route
                              path="/admin-compass/weekly-meetings"
                              element={<WeeklyMeetings />}
                            />
                            <Route
                              path="/admin-compass/team-dashboard"
                              element={<TeamDashboard />}
                            />
                            <Route
                              path="/admin-compass/feedback-dashboard"
                              element={<FeedbackDashboard />}
                            />
                            <Route
                              path="/admin-compass/systems-sops"
                              element={<SystemAndSOP />}
                            />
                            <Route
                              path="/admin-compass/disc-report"
                              element={<DiscReport />}
                            />
                            <Route
                              path="/admin-compass/daily-meeting"
                              element={<DailyMeeting />}
                            />
                            <Route path="/admin-compass/kpi" element={<KPI />} />
                            {/* Dashboard Routes */}
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                              path="/dashboard/configuration"
                              element={<DashboardConfiguration />}
                            />
                            {/* Holiday Calendar Route */}
                            <Route
                              path="/holiday-calendar"
                              element={<HolidayCalendarPage />}
                            />
                            <Route path="/sitemap" element={<Sitemap />} />
                            {/* Rule Engine Routes */}
                            <Route
                              path="/rule-engine/rule-list"
                              element={<RuleListPage />}
                            />
                            <Route
                              path="/loyalty-rule-engine"
                              element={<LoyaltyRuleEngineDashboard />}
                            />
                            {/* Settings Routes */}
                            <Route
                              path="/settings/users"
                              element={<FMUsersDashboard />}
                            />
                            <Route
                              path="/settings/users/edit-details/:id"
                              element={<EditFMUserDetailsPage />}
                            />
                            <Route
                              path="/settings/users/clone-role"
                              element={<CloneRolePage />}
                            />
                            <Route
                              path="/settings/account"
                              element={<AccountDashboard />}
                            />
                            <Route
                              path="/settings/approval-matrix"
                              element={<ApprovalMatrixDashboard />}
                            />
                            <Route
                              path="/settings/approval-matrix/add"
                              element={<AddApprovalMatrixDashboard />}
                            />
                            <Route
                              path="/settings/approval-matrix/edit/:id"
                              element={<EditApprovalMatrixDashboard />}
                            />
                            <Route
                              path="/settings/account/report-setup"
                              element={<PDFDownloadPage />}
                            />
                            <Route
                              path="/settings/roles/department"
                              element={<DepartmentDashboard />}
                            />
                            <Route
                              path="/settings/roles/role"
                              element={<RoleDashboard />}
                            />
                            <Route
                              path="/settings/roles/role/add"
                              element={<AddRolePage />}
                            />
                            <Route
                              path="/settings/vi-roles/role/add"
                              element={<AddRolePageVi />}
                            />
                            <Route
                              path="/settings/users/edit-details/:id"
                              element={<EditFMUserDetailsPage />}
                            />
                            <Route
                              path="/settings/users/clone-role"
                              element={<CloneRolePage />}
                            />
                            <Route
                              path="/settings/account"
                              element={<AccountDashboard />}
                            />
                            <Route
                              path="/settings/account/holiday-calendar"
                              element={<SettingsHolidayCalendarPage />}
                            />
                            <Route
                              path="/settings/account/shift"
                              element={<AccountShiftDashboard />}
                            />
                            <Route
                              path="/settings/account/roster"
                              element={<AccountRosterDashboard />}
                            />
                            <Route
                              path="/settings/account/roster/create"
                              element={<RosterCreatePage />}
                            />
                            <Route
                              path="/settings/account/roster/detail/:id"
                              element={<RosterDetailPage />}
                            />
                            <Route
                              path="/settings/account/roster/edit/:id"
                              element={<RosterEditPage />}
                            />
                            <Route
                              path="/settings/approval-matrix"
                              element={<ApprovalMatrixDashboard />}
                            />
                            <Route
                              path="/settings/approval-matrix/add"
                              element={<AddApprovalMatrixDashboard />}
                            />
                            <Route
                              path="/settings/approval-matrix/edit/:id"
                              element={<EditApprovalMatrixDashboard />}
                            />
                            <Route
                              path="/settings/roles/department"
                              element={<DepartmentDashboard />}
                            />
                            <Route
                              path="/settings/roles/role"
                              element={<RoleDashboard />}
                            />
                            <Route
                              path="/settings/roles/role/add"
                              element={<AddRolePage />}
                            />
                            {/* Settings Asset Setup Routes */}
                            <Route
                              path="/settings/asset-setup/approval-matrix"
                              element={<InvoiceApprovalsPage />}
                            />
                            <Route
                              path="/settings/asset-setup/asset-groups"
                              element={<AssetGroupsPageNew />}
                            />
                            {/* Payments Made Routes */}
                            <Route
                              path="/accounting/payments-made"
                              element={<PaymentsMadePage />}
                            />
                            {/* <Route
                              path="/accounting/payments-made/:id"
                              element={<PaymentDetailPage/>}
                            /> */}
                            <Route
                              path="/accounting/payments-made/create"
                              element={<CreatePaymentPage />}
                            />
                            <Route
                              path="/accounting/payments-made/:id"
                              element={<PaymentMadeDetailsPage />}
                            />
                            -{/* Settings Checklist Setup Routes */}
                            <Route
                              path="/settings/checklist-setup/groups"
                              element={<ChecklistGroupsPage />}
                            />
                            <Route
                              path="/settings/currency"
                              element={<CurrencyPage />}
                            />
                            <Route
                              path="/master/checklist"
                              element={<ChecklistListPage />}
                            />
                            <Route
                              path="/master/checklist-master"
                              element={<ChecklistMasterDashboard />}
                            />
                            <Route
                              path="/master/checklist-master/add"
                              element={<ChecklistMasterPage />}
                            />
                            <Route
                              path="/master/checklist-master/edit/:id"
                              element={<EditChecklistMasterPage />}
                            />
                            <Route
                              path="/master/checklist-master/view/:id"
                              element={<ViewChecklistMasterPage />}
                            />
                            <Route
                              path="/master/checklist/create"
                              element={<ChecklistMasterPage />}
                            />
                            <Route
                              path="/master/checklist/edit/:id"
                              element={<ChecklistMasterPage />}
                            />
                            <Route
                              path="/settings/masters/unit"
                              element={<UnitMasterPage />}
                            />
                            <Route
                              path="/settings/masters/address"
                              element={<AddressMasterPage />}
                            />
                            <Route
                              path="/settings/masters/address/add"
                              element={<AddAddressPage />}
                            />
                            <Route
                              path="/settings/masters/address/edit"
                              element={<EditAddressPage />}
                            />
                            {/* Master Routes */}
                            <Route
                              path="/master/checklist"
                              element={<ChecklistListPage />}
                            />
                            <Route
                              path="/master/checklist/create"
                              element={<ChecklistMasterPage />}
                            />
                            <Route
                              path="/master/checklist/edit/:id"
                              element={<ChecklistMasterPage />}
                            />
                            <Route
                              path="/master/address"
                              element={<AddressMasterPage />}
                            />
                            <Route
                              path="/master/address/add"
                              element={<AddAddressMaster />}
                            />
                            <Route
                              path="/master/address/edit/:id"
                              element={<EditAddressMaster />}
                            />
                            <Route
                              path="/master/unit-default"
                              element={<UnitMasterByDefaultPage />}
                            />
                            <Route
                              path="/master/user/occupant-users/add"
                              element={<AddOccupantUserPage />}
                            />
                            <Route
                              path="/master/user/occupant-users/view/:id"
                              element={<ViewOccupantUserPage />}
                            />
                            <Route
                              path="/master/user/occupant-users/edit/:id"
                              element={<EditOccupantUserPage />}
                            />
                            {/* Finance Master Routes */}
                            <Route
                              path="/master/finance"
                              element={<FinanceMasterPage />}
                            />
                            <Route
                              path="/master/plant-detail"
                              element={<PlantDetailSetupPage />}
                            />
                            <Route
                              path="/master/fields-setup"
                              element={<FieldsSetupPage />}
                            />
                            {/* CRM Routes */}
                            <Route
                              path="/crm/campaign"
                              element={<CRMCampaignPage />}
                            />
                            <Route
                              path="/crm/campaign/add"
                              element={<AddLeadPage />}
                            />
                            <Route
                              path="/crm/campaign/details/:id"
                              element={<LeadDetailsPage />}
                            />
                            <Route
                              path="/crm/customers"
                              element={<CRMCustomersDashboard />}
                            />
                            <Route
                              path="/crm/fm-users"
                              element={<CRMFMUserDashboard />}
                            />
                            <Route
                              path="/crm/occupant-users"
                              element={<CRMOccupantUsersDashboard />}
                            />
                            <Route
                              path="/crm/events"
                              element={<CRMEventsPage />}
                            />
                            <Route
                              path="/crm/events/add"
                              element={<AddEventPage />}
                            />
                            <Route
                              path="/crm/events/details/:id"
                              element={<CRMEventDetailsPage />}
                            />
                            <Route
                              path="/crm/broadcast"
                              element={<BroadcastDashboard />}
                            />
                            <Route
                              path="/crm/broadcast/add"
                              element={<AddBroadcastPage />}
                            />
                            <Route
                              path="/crm/broadcast/details/:id"
                              element={<BroadcastDetailsPage />}
                            />
                            <Route path="/crm/polls" element={<CRMPollsPage />} />
                            <Route
                              path="/crm/polls/add"
                              element={<AddPollPage />}
                            />
                            <Route
                              path="/crm/groups/details/:id"
                              element={<CRMGroupDetailsPage />}
                            />
                            <Route
                              path="/crm/occupant-users/:id"
                              element={<CRMOccupantUserDetailPage />}
                            />
                            <Route
                              path="/crm/occupant-users/:id/edit"
                              element={<CRMOccupantUserEditPage />}
                            />
                            <Route
                              path="/crm/customers/add"
                              element={<AddCRMCustomerPage />}
                            />
                            <Route
                              path="/crm/customers/:id"
                              element={<CrmCustomerDetails />}
                            />
                            <Route
                              path="/crm/customers/edit/:id"
                              element={<EditCrmCustomer />}
                            />
                            <Route
                              path="/crm/wallet-list"
                              element={<CRMWalletList />}
                            />
                            <Route
                              path="/crm/wallet-list/:id"
                              element={<CRMWalletDetails />}
                            />
                            <Route
                              path="/crm/point-expiry"
                              element={<CRMWalletPointExpiry />}
                            />
                            <Route
                              path="/crm/point-expiry/edit"
                              element={<EditCRMWalletPointExpiry />}
                            />
                            {/* Club Management Routes */}
                            <Route
                              path="/settings/vas/booking/setup"
                              element={<BookingSetupDashboard />}
                            />
                            <Route
                              path="/settings/vas/booking/setup/add"
                              element={<AddBookingSetupPage />}
                            />
                            <Route
                              path="/settings/vas/booking/setup/details/:id"
                              element={<BookingSetupDetailPage />}
                            />
                            <Route
                              path="/settings/vas/booking/setup/edit/:id"
                              element={<EditBookingSetupPage />}
                            />
                            {/* new rountes for amenity setup for recess */}
                            <Route
                              path="/settings/vas/booking-club/setup"
                              element={<BookingSetupClubDashboard />}
                            />
                            <Route
                              path="/settings/vas/booking-club/setup/add"
                              element={<AddBookingSetupClubPage />}
                            />
                            <Route
                              path="/settings/vas/booking-club/setup/details/:id"
                              element={<BookingSetupDetailClubPage />}
                            />
                            <Route
                              path="/settings/vas/booking-club/setup/edit/:id"
                              element={<EditBookingSetupClubPage />}
                            />
                            {/* .... */}
                            <Route
                              path="/settings/vas/membership-plan/setup"
                              element={<MembershipPlanDashboard />}
                            />
                            <Route
                              path="/settings/vas/membership-plan/setup/add"
                              element={<AddMembershipPlanPage />}
                            />
                            <Route
                              path="/settings/vas/membership-plan/setup/edit/:id"
                              element={<EditMembershipPlanPage />}
                            />
                            <Route
                              path="/settings/vas/membership-plan/setup/details/:id"
                              element={<MembershipPlanDetailsPage />}
                            />
                            <Route
                              path="/settings/accessories"
                              element={<AccessoriesSetup />}
                            />
                            <Route
                              path="/settings/accessories/:id"
                              element={<AccessoriesDetailsPage />}
                            />
                            <Route
                              path="/settings/payment-plan/setup"
                              element={<PaymentPlanSetup />}
                            />
                            <Route
                              path="/settings/payment-plan/add"
                              element={<AddPaymentPlan />}
                            />
                            <Route
                              path="/settings/payment-plan/edit/:id"
                              element={<AddPaymentPlan />}
                            />
                            <Route
                              path="/settings/payment-plan/details/:id"
                              element={<PaymentPlanDetails />}
                            />
                            <Route
                              path="/settings/payment-management"
                              element={<PaymentManagementDashboard />}
                            />
                            <Route
                              path="/settings/payment-management/:id"
                              element={<PaymentDetailPage />}
                            />
                            <Route
                              path="/settings/house/setup"
                              element={<HouseSetupPage />}
                            />
                            <Route
                              path="/settings/hsn-code/setup"
                              element={<HSNCodeSetup />}
                            />
                            <Route
                              path="/club-management/membership"
                              element={<ClubMembershipDashboard />}
                            />
                            <Route
                              path="/club-management/membership/groups"
                              element={<ClubGroupMembershipDashboard />}
                            />
                            <Route
                              path="/club-management/membership/add"
                              element={<AddClubMembershipPage />}
                            />
                            <Route
                              path="/club-management/membership/add-group"
                              element={<AddGroupMembershipPage />}
                            />
                            <Route
                              path="/club-management/group-membership/:id/edit"
                              element={<AddGroupMembershipPage />}
                            />
                            <Route
                              path="/club-management/membership/group-details/:id"
                              element={<ClubGroupMembershipDetails />}
                            />
                            <Route
                              path="/club-management/membership/:id"
                              element={<ClubMembershipDetailPage />}
                            />
                            <Route
                              path="/club-management/membership/:id/edit"
                              element={<AddClubMembershipPage />}
                            />
                            {/* Club Management - FM Users */}
                            <Route
                              path="/club-management/users/fm-users"
                              element={<FMUserMasterDashboard />}
                            />
                            <Route
                              path="/club-management/users/fm-users/add"
                              element={<AddFMUserPage />}
                            />
                            <Route
                              path="/club-management/users/fm-users/edit/:id"
                              element={<EditFMUserPage />}
                            />
                            <Route
                              path="/club-management/users/fm-users/view/:id"
                              element={<ViewFMUserPage />}
                            />
                            <Route
                              path="/accounting/manual-journal"
                              element={<ManualJournalDashboard />}
                            />
                            <Route
                              path="/accounting/manual-journal/add"
                              element={<ManualJournalAdd />}
                            />
                            <Route
                              path="/accounting/manual-journal/details/:id"
                              element={<ManualJournalDetails />}
                            />
                            <Route
                              path="/accounting/manual-journal/edit/:id"
                              element={<ManualJournalEdit />}
                            />
                            <Route
                              path="/accounting/recurring-journal"
                              element={<RecurringJournalDashboard />}
                            />
                            <Route
                              path="/accounting/recurring-journal/add"
                              element={<RecurringJournalAdd />}
                            />
                            <Route
                              path="/accounting/recurring-journal/details"
                              element={<RecurringJournalDetails />}
                            />
                            <Route
                              path="/accounting/vendor-credits"
                              element={<VendorCreditsListPage />}
                            />
                            <Route
                              path="/accounting/vendor-credits/add"
                              element={<VendorCreditsAdd />}
                            />
                            <Route
                              path="/accounting/vendor-credits/details/:id"
                              element={<VendorCreditDetails />}
                            />
                            <Route
                              path="/accounting/vendor-credits/edit/:id"
                              element={<VendorCreditsEdit />}
                            />
                            <Route
                              path="/accounting/chart-journal"
                              element={<ChartOfAccountsDashboard />}
                            />
                            <Route
                              path="/accounting/chart-journal/details/:id"
                              element={<ChartOfAccountDetails />}
                            />
                            <Route
                              path="/accounting/opening-balance"
                              element={<OpeningBalance />}
                            />
                            <Route
                              path="/accounting/tax-setup"
                              element={<TaxSetup />}
                            />
                            <Route
                              path="/accounting/tax-setup-tab"
                              element={<TaxSetupTabView />}
                            />
                            <Route
                              path="/accounting/charge-setup"
                              element={<ChargeSetupDashboard />}
                            />
                            <Route
                              path="/accounting/charge-setup/add"
                              element={<ChargeSetupAdd />}
                            />
                            <Route
                              path="/accounting/charge-setup/details/:id"
                              element={<ChargeSetupDetails />}
                            />
                            <Route
                              path="/accounting/bill-cycles"
                              element={<BillCyclesDashboard />}
                            />
                            <Route
                              path="/accounting/bill-cycles/add"
                              element={<BillCyclesAdd />}
                            />
                            <Route
                              path="/accounting/bill-cycles/details/:id"
                              element={<BillCyclesDetails />}
                            />
                            <Route
                              path="/accounting/Budget"
                              element={<BudgetDashboard />}
                            />
                            {/* <Route path="/settings/Budget/add" element={<BudgetAdd />} /> */}
                            <Route
                              path="/accounting/Budget/add/new"
                              element={<BudgetAddNew />}
                            />
                            <Route
                              path="/accounting/Budget/Edit"
                              element={<EditBudget />}
                            />
                            <Route
                              path="/accounting/Budget/details"
                              element={<BudgetDetails />}
                            />
                            <Route
                              path="/accounting/asset-setup/approval-matrix"
                              element={<InvoiceApprovalsPage />}
                            />
                            <Route
                              path="/accounting/invoice-approvals/add"
                              element={<AddInvoiceApprovalsPage />}
                            />
                            <Route
                              path="/accounting/invoice-approvals/edit/:id"
                              element={<EditInvoiceApprovalsPage />}
                            />
                            <Route
                              path="/accounting/reports/balance-sheet"
                              element={<BalanceSheetReport />}
                            />
                            <Route
                              path="/accounting/reports/business-performance"
                              element={<BusinessPerformanceRatioReport />}
                            />
                            <Route
                              path="/accounting/reports/account-type-summary"
                              element={<AccountTypeSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/account-type-summary/details/:accountName"
                              element={<AccountTypeSummaryDetailReport />}
                            />
                            <Route
                              path="/accounting/reports/account-type-transactions"
                              element={<AccountTypeTransactionsReport />}
                            />
                            <Route
                              path="/accounting/reports/account-type-transactions/details"
                              element={<AccountTypeTransactionsDetailPage />}
                            />
                            <Route
                              path="/accounting/reports/account-transactions"
                              element={<AccountTransactionsReport />}
                            />
                            <Route
                              path="/accounting/reports/ar-aging-summary"
                              element={<ARAgingSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/ar-aging-details"
                              element={<ARAgingDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/invoice-details"
                              element={<InvoiceDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/retainer-invoice-details"
                              element={<RetainerInvoiceDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/sales-order-details"
                              element={<SalesOrderDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/delivery-challan-details"
                              element={<DeliveryChallanDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/quote-details"
                              element={<QuoteDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/customer-balance-summary"
                              element={<CustomerBalanceSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/receivable-summary"
                              element={<ReceivableSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/receivable-details"
                              element={<ReceivableDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/payments-recieved"
                              element={<PaymentsRecievedReport />}
                            />
                            <Route
                              path="/accounting/reports/payments-made"
                              element={<PaymentsMadeReport />}
                            />
                            <Route
                              path="/accounting/reports/payable-details"
                              element={<PayableDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/ap-aging-details"
                              element={<APAgingDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/payable-refund-history"
                              element={<PayableRefundHistoryReport />}
                            />
                            <Route
                              path="/accounting/reports/purchase-order-details"
                              element={<PurchaseOrderDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/expense-details"
                              element={<ExpenseDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/expense-summary-by-category"
                              element={<ExpenseSummaryByCategoryReport />}
                            />
                            <Route
                              path="/accounting/reports/purchase-orders-by-vendor"
                              element={<PurchaseOrdersByVendorReport />}
                            />
                            <Route
                              path="/accounting/reports/expenses-by-employee"
                              element={<ExpensesByEmployeeReport />}
                            />
                            <Route
                              path="/accounting/reports/expenses-by-project"
                              element={<ExpensesByProjectReport />}
                            />
                            <Route
                              path="/accounting/reports/billable-expense-details"
                              element={<BillableExpenseDetails />}
                            />
                            <Route
                              path="/accounting/purchases-and-expenses/purchase-order-details"
                              element={<PurchaseOrderDetailsReport />}
                            />
                            <Route
                              path="/accounting/purchases-and-expenses/expense-details"
                              element={<ExpenseDetailsReport />}
                            />
                            <Route
                              path="/accounting/purchases-and-expenses/expense-summary-by-category"
                              element={<ExpenseSummaryByCategoryReport />}
                            />
                            <Route
                              path="/accounting/purchases-and-expenses/expenses-by-customer"
                              element={<ExpensesByCustomerReport />}
                            />
                            <Route
                              path="/accounting/purchases-and-expenses/expenses-by-project"
                              element={<ExpensesByProjectReport />}
                            />
                            <Route
                              path="/accounting/purchases-and-expenses/expenses-by-employee"
                              element={<ExpensesByEmployeeReport />}
                            />
                            <Route
                              path="/accounting/purchases-and-expenses/purchases-by-vendor"
                              element={<PurchaseOrdersByVendorReport />}
                            />
                            <Route
                              path="/accounting/purchases-and-expenses/purchases-by-item"
                              element={<PurchasesByItemReport />}
                            />
                            <Route
                              path="/accounting/purchases-and-expenses/billable-expense-details"
                              element={<BillableExpenseDetails />}
                            />
                            <Route
                              path="/accounting/reports/payable-summary"
                              element={<PayableSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/time-to-get-paid"
                              element={<TimeToGetPaidReport />}
                            />
                            <Route
                              path="/accounting/reports/credit-note-details"
                              element={<CreditNoteDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/refund-history"
                              element={<RefundHistoryReport />}
                            />
                            <Route
                              path="/accounting/reports/recurring-invoice-details"
                              element={<RecurringInvoiceDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/vendor-balance-summary"
                              element={<VendorBalanceSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/ap-aging-summary"
                              element={<APAgingSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/bill-details"
                              element={<BillDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/vendor-credits-details"
                              element={<VendorCreditsDetailsReport />}
                            />
                            <Route
                              path="/accounting/reports/account-transactions/details"
                              element={<AccountTransactionsDetailPage />}
                            />
                            <Route
                              path="/accounting/reports/debtors-creditors"
                              element={<DebtorsCreditorsReport />}
                            />
                            <Route
                              path="/accounting/reports/cash-flow-statement"
                              element={<CashFlowStatementReport />}
                            />
                            <Route
                              path="/accounting/reports/sales-by-customer"
                              element={<SalesByCustomerReport />}
                            />
                            <Route
                              path="/accounting/reports/sales-by-customer/details/:customerName"
                              element={<DetailsSaleCustomerReport />}
                            />
                            <Route
                              path="/accounting/reports/sales-by-item"
                              element={<SalesByItemReport />}
                            />
                            <Route
                              path="/accounting/reports/sales-by-item/details/:itemName"
                              element={<DetailsSalesByItemReport />}
                            />
                            <Route
                              path="/accounting/reports/sales-by-sales-person"
                              element={<SalesBySalesPersonReport />}
                            />
                            <Route
                              path="/accounting/reports/sales-summary"
                              element={<SalesSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/gstr-7"
                              element={<GSTR7Report />}
                            />
                            <Route
                              path="/accounting/reports/gstr-3b-summary"
                              element={<GSTR3BSummary />}
                            />
                            <Route
                              path="/accounting/reports/gstr-3b-summary/details"
                              element={<GSTR3BSummaryDetails />}
                            />
                            <Route
                              path="/accounting/reports/summary-of-inward-supplies"
                              element={<SummaryOfInwardSupplies />}
                            />
                            <Route
                              path="/accounting/reports/pmt-06-self-assessment-basis"
                              element={<PMT06SelfAssessmentBasis />}
                            />
                            <Route
                              path="/accounting/reports/summary-of-outward-supplies-gstr-1"
                              element={<SummaryOfOutwardSuppliesGSTR1 />}
                            />
                            <Route
                              path="/accounting/reports/invoice-furnishing-facility-iff"
                              element={<InvoiceFurnishingFacilityIFF />}
                            />
                            <Route
                              path="/accounting/reports/day-book"
                              element={<DayBook />}
                            />
                            <Route
                              path="/accounting/reports/journal-report"
                              element={<JournalReport />}
                            />
                            <Route
                              path="/accounting/reports/fixed-asset"
                              element={<FixedAssetReport />}
                            />
                            <Route
                              path="/accounting/reports/fixed-asset-register"
                              element={<FixedAssetReport />}
                            />
                            <Route
                              path="/accounting/reports/name-of-project"
                              element={
                                <AccountingReportStub title="Name of Project" />
                              }
                            />
                            <Route
                              path="/accounting/reports/timesheet"
                              element={<TimesheetDetails />}
                            />
                            <Route
                              path="/accounting/reports/timesheet-details"
                              element={<TimesheetDetails />}
                            />
                            <Route
                              path="/accounting/reports/timesheet-profitability-summary"
                              element={<TimesheetProfitabilitySummary />}
                            />
                            <Route
                              path="/accounting/reports/project-summary"
                              element={<ProjectSummary />}
                            />
                            <Route
                              path="/accounting/reports/project-details"
                              element={<ProjectDetails />}
                            />
                            <Route
                              path="/accounting/reports/projects-cost-summary"
                              element={<ProjectsCostSummary />}
                            />
                            <Route
                              path="/accounting/reports/projects-revenue-summary"
                              element={<ProjectsRevenueSummary />}
                            />
                            <Route
                              path="/accounting/reports/projects-performance-summary"
                              element={<ProjectsPerformanceSummary />}
                            />
                            <Route
                              path="/accounting/reports/general-ledger"
                              element={<GeneralLedger />}
                            />
                            <Route
                              path="/accounting/reports/detailed-general-ledger"
                              element={<DetailedGeneralLedger />}
                            />
                            <Route
                              path="/accounting/reports/self-invoice-summary"
                              element={<SelfInvoiceSummary />}
                            />
                            <Route
                              path="/accounting/reports/tcs-summary-form-27eq"
                              element={<TCSSummaryForm27EQ />}
                            />
                            <Route
                              path="/accounting/reports/gstr-9"
                              element={<GSTR9Summary />}
                            />
                            <Route
                              path="/accounting/reports/balance-sheet/details/:id"
                              element={<BalanceSheetDetails />}
                            />
                            <Route
                              path="/accounting/reports/trial-balance"
                              element={<TrialBalance />}
                            />
                            <Route
                              path="/accounting/reports/trial-balance/details/:id"
                              element={<TrialBalanceDetails />}
                            />
                            {/* <Route */}
                            <Route
                              path="/accounting/reports/profit-and-loss"
                              element={<ProfitAndLossReport />}
                            />
                            <Route
                              path="/accounting/reports/profit-and-loss/details/:id"
                              element={<ProfitAndLossDetails />}
                            />
                            <Route
                              path="/accounting/reports/cash-flow-statement/details/:id"
                              element={<CashFlowDetails />}
                            />
                            {/* <Route */}
                            <Route
                              path="/accounting/reports/tax-summary"
                              element={<TaxSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/tax-summary/details/:id"
                              element={<TaxSummaryDetails />}
                            />
                            <Route
                              path="/accounting/reports/system-mails"
                              element={<SystemMails />}
                            />
                            <Route
                              path="/accounting/reports/activity"
                              element={
                                <Navigate
                                  to="/accounting/reports/system-mails"
                                  replace
                                />
                              }
                            />
                            <Route
                              path="/accounting/reports/activity-logs-audit-trail"
                              element={<ActivityLogsAuditTrail />}
                            />
                            <Route
                              path="/accounting/reports/exception-report"
                              element={<ExceptionReport />}
                            />
                            <Route
                              path="/accounting/reports/portal-activities"
                              element={<PortalActivities />}
                            />
                            <Route
                              path="/accounting/reports/customer-reviews"
                              element={<CustomerReviews />}
                            />
                            <Route
                              path="/accounting/reports/api-usage"
                              element={<APIUsage />}
                            />
                            {/* <Route */}
                            <Route
                              path="/accounting/reports/gst-payable"
                              element={<GstPayableReport />}
                            />
                            <Route
                              path="/accounting/reports/tds-summary"
                              element={<TDSSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/tds-receivables-summary"
                              element={<TDSReceivablesSummaryReport />}
                            />
                            <Route
                              path="/accounting/reports/tds-receivables-summary/details/:sectionCode"
                              element={<TDSReceivablesSummaryDetails />}
                            />
                            <Route
                              path="/accounting/reports/gst-payable/details/:id"
                              element={<GSTPayableDetails />}
                            />
                            <Route
                              path="/accounting/reports/gst-receivable"
                              element={<GstReceivableReport />}
                            />
                            <Route
                              path="/accounting/reports/gst-receivable/details/:id"
                              element={<GSTReceivableDetails />}
                            />
                            <Route
                              path="/accounting/transactions"
                              element={<TransactionsDashboard />}
                            />
                            <Route
                              path="/accounting/transactions/add"
                              element={<TransactionsAdd />}
                            />
                            <Route
                              path="/accounting/transactions/details/:id"
                              element={<TransactionsDetails />}
                            />
                            <Route
                              path="/accounting/transactions/Edit/:id"
                              element={<TransactionsEdit />}
                            />
                            <Route
                              path="/accounting/items"
                              element={<ItemsDashboard />}
                            />
                            <Route
                              path="/accounting/items/add"
                              element={<ItemsAdd />}
                            />
                            <Route
                              path="/accounting/items/details/:id"
                              element={<ItemsDetails />}
                            />
                            <Route
                              path="/accounting/items/edit/:id"
                              element={<ItemsEdit />}
                            />
                            <Route
                              path="/accounting/customers"
                              element={<CustomersDashboard />}
                            />
                            <Route
                              path="/accounting/customers/add"
                              element={<CustomersAdd />}
                            />
                            <Route
                              path="/accounting/customers/edit/:id"
                              element={<CustomersEdit />}
                            />
                            <Route
                              path="/accounting/customers/details/:id"
                              element={<CustomersDetails />}
                            />
                            {/* Sales Order Routes */}
                            <Route
                              path="/accounting/sales-order"
                              element={<SalesOrderListPage />}
                            />
                            <Route
                              path="/accounting/sales-order/create"
                              element={<SalesOrderCreatePage />}
                            />
                            <Route
                              path="/accounting/sales-order/:id"
                              element={<SalesOrderDetailPage />}
                            />
                            <Route
                              path="/accounting/sales-order/edit/:id"
                              element={<EditSalesOrderPage />}
                            />
                            <Route
                              path="/accounting/invoices/list"
                              element={<InvoiceDashboardAccounting />}
                            />
                            <Route
                              path="/accounting/invoices/add"
                              element={<InvoiceAdd />}
                            />
                            <Route
                              path="/accounting/invoices/edit/:id"
                              element={<EditInvoicePage />}
                            />
                            <Route
                              path="/accounting/dashboard/invoices/:id"
                              element={<InvoiceDashboardDetailsPage />}
                            />
                            <Route
                              path="/accounting/quotes"
                              element={<QuotesDashboard />}
                            />
                            <Route
                              path="/accounting/quotes/add"
                              element={<QuotesAdd />}
                            />
                            <Route
                              path="/accounting/quotes/edit/:id"
                              element={<QuotesEdit />}
                            />
                            <Route
                              path="/accounting/quotes/details/:id"
                              element={<QuotesDetails />}
                            />
                            <Route
                              path="/accounting/delivery-challans"
                              element={<DeliveryChallansDashboard />}
                            />
                            <Route
                              path="/accounting/delivery-challans/add"
                              element={<DeliveryChallansAdd />}
                            />
                            <Route
                              path="/accounting/recurring-invoices"
                              element={<RecurringInvoicesListPage />}
                            />
                            <Route
                              path="/accounting/recurring-invoices/create"
                              element={<RecurringInvoicesCreatePage />}
                            />
                            <Route
                              path="/accounting/recurring-invoices/edit/:id"
                              element={<EditRecurringInvoicePage />}
                            />
                            <Route
                              path="/accounting/recurring-invoices/details/:id"
                              element={<RecurringInvoiceDetailsPage />}
                            />
                            <Route
                              path="/accounting/payments-received"
                              element={<PaymentsReceivedListPage />}
                            />
                            <Route
                              path="/accounting/payments-received/create"
                              element={<RecordPaymentPage />}
                            />
                            <Route
                              path="/accounting/payments-received/edit/:id"
                              element={<EditPaymentReceivedPage />}
                            />
                            <Route
                              path="/accounting/payments-received/:id"
                              element={<PaymentReceivedDetailsPage />}
                            />
                            <Route
                              path="/accounting/credit-note"
                              element={<CreditNoteListPage />}
                            />
                            <Route
                              path="/accounting/credit-note/add"
                              element={<CreditNoteAddPage />}
                            />
                            <Route
                              path="/accounting/credit-note/:id"
                              element={<CreditNoteDetails />}
                            />
                            <Route
                              path="/accounting/credit-note/edit/:id"
                              element={<CreditNoteEditPage />}
                            />
                            {/* Purchase Order Routes */}
                            <Route
                              path="/accounting/purchase-order"
                              element={<PurchaseOrderListPage />}
                            />
                            <Route
                              path="/accounting/purchase-order/create"
                              element={<PurchaseOrderCreatePage />}
                            />
                            <Route
                              path="/accounting/purchase-order/:id"
                              element={<PurchaseOrderDetailPage />}
                            />
                            <Route
                              path="/accounting/purchase-order/edit/:id"
                              element={<PurchaseOrderEditPage />}
                            />
                            {/* Bills Routes */}
                            <Route
                              path="/accounting/bills"
                              element={<BillListPage />}
                            />
                            {/* <Route
                        path="/accounting/bills/create"
                        element={<BillCreatePage />}
                      /> */}
                            <Route
                              path="/accounting/bills/create"
                              element={<BillsAdd />}
                            />
                            {/* <Route
                        path="/accounting/bills/:id"
                        element={<BillDetailPage />}
                      /> */}
                            <Route
                              path="/accounting/bills/:id"
                              element={<BillDetails />}
                            />
                            <Route
                              path="/accounting/bills/edit/:id"
                              element={<BillEdit />}
                            />
                            {/* Recurring Bills Routes */}
                            <Route
                              path="/accounting/recurring-bills"
                              element={<RecurringBillsDashboard />}
                            />
                            <Route
                              path="/accounting/recurring-bills/create"
                              element={<RecurringBillCreatePage />}
                            />
                            <Route
                              path="/accounting/recurring-bills/details/:id"
                              element={<RecurringBillDetails />}
                            />
                            <Route
                              path="/accounting/recurring-bills/edit/:id"
                              element={<RecurringBillEdit />}
                            />
                            <Route
                              path="/accounting/recurring-expenses"
                              element={<RecurringExpensesListPage />}
                            />
                            <Route
                              path="/accounting/recurring-expenses/create"
                              element={<NewRecurringExpensePage />}
                            />
                            <Route
                              path="/accounting/recurring-expenses/:id"
                              element={<RecurringExpenseDetailPage />}
                            />
                            {/* Expense Routes */}
                            <Route
                              path="/accounting/expense"
                              element={<ExpenseListPage />}
                            />
                            <Route
                              path="/accounting/expense/create"
                              element={<ExpenseCreatePage />}
                            />
                            <Route
                              path="/accounting/expense/:id"
                              element={<ExpenseDetailPage />}
                            />
                            <Route
                              path="/accounting/expense/edit/:id"
                              element={<ExpenseEditPage />}
                            />
                            <Route
                              path="/accounting/section"
                              element={<SectionMaster />}
                            />
                            <Route
                              path="/accounting/tax-setup-master"
                              element={<TaxSetupMaster />}
                            />
                            <Route
                              path="/accounting/tax-rates-setup"
                              element={<TaxRateSetupPage />}
                            />
                            <Route
                              path="/accounting/default-tax-preferences"
                              element={<DefaultTaxPreferencesPage />}
                            />
                            <Route
                              path="/accounting/sales-person"
                              element={<SalesPersonMaster />}
                            />
                            <Route
                              path="/settings/sales-order/edit/:id"
                              element={<EditSalesOrderPage />}
                            />
                            <Route
                              path="/accounting/payment-terms"
                              element={<PaymentTermsMaster />}
                            />
                            <Route
                              path="/accounting/organisation"
                              element={<OrganisationMaster />}
                            />
                            {/* Club Management - Occupant Users */}
                            <Route
                              path="/club-management/users/occupant-users"
                              element={<OccupantUserMasterDashboard />}
                            />
                            <Route
                              path="/club-management/users/occupant-users/add"
                              element={<ClubAddOccupantUserPage />}
                            />
                            <Route
                              path="/club-management/users/occupant-users/view/:id"
                              element={<ViewClubOccupantUser />}
                            />
                            <Route
                              path="/club-management/users/occupant-users/edit/:id"
                              element={<ClubEditOccupantUserPage />}
                            />
                            <Route
                              path="/club-management/users/occupant-users/:id"
                              element={<CRMOccupantUserDetailPage />}
                            />
                            {/* Club Management - Guest Users */}
                            <Route
                              path="/club-management/users/guest"
                              element={<GuestUserMasterDashboard />}
                            />
                            <Route
                              path="/club-management/users/guest/add"
                              element={<AddGuestUserPage />}
                            />
                            <Route
                              path="/club-management/users/guest/view/:id"
                              element={<ViewGuestUserPage />}
                            />
                            <Route
                              path="/club-management/users/guest/edit/:id"
                              element={<EditGuestUserPage />}
                            />
                            {/* Club Management - Helpdesk */}
                            <Route
                              path="/club-management/helpdesk"
                              element={<TicketDashboard />}
                            />
                            <Route
                              path="/club-management/helpdesk/add"
                              element={<AddTicketDashboard />}
                            />
                            <Route
                              path="/club-management/helpdesk/details/:id"
                              element={<TicketDetailsPage />}
                            />
                            <Route
                              path="/club-management/helpdesk/edit/:id"
                              element={<UpdateTicketsPage />}
                            />
                            {/* Club Management - Amenities Booking */}
                            <Route
                              path="/club-management/amenities-booking"
                              element={<BookingList />}
                            />
                            <Route
                              path="/club-management/amenities-booking/add"
                              element={<AddFacilityBookingPage />}
                            />
                            <Route
                              path="/club-management/amenities-booking/:id"
                              element={<BookingDetailsPage />}
                            />
                            {/* Club Management - Amenities Booking seperate routes for recess */}
                            <Route
                              path="/club-management/amenities-booking-club"
                              element={<AmenityBookingListClub />}
                            />
                            <Route
                              path="/club-management/amenities-booking-club/add"
                              element={<AddFacilityBookingClubPage />}
                            />
                            <Route
                              path="/club-management/amenities-booking-club/:id"
                              element={<AmenityBookingDetailsClubPage />}
                            />
                            <Route
                              path="/vas/booking-club/list"
                              element={<AmenityBookingListClub />}
                            />
                            <Route
                              path="/vas/booking-club/add"
                              element={<AddFacilityBookingClubPage />}
                            />
                            <Route
                              path="/vas/bookings-club/details/:id"
                              element={<AmenityBookingDetailsClubPage />}
                            />
                            {/* Club Management - Broadcast */}
                            <Route
                              path="/club-management/broadcast"
                              element={<ClubBroadcastDashboard />}
                            />
                            <Route
                              path="/club-management/broadcast/add"
                              element={<AddClubBroadcastPage />}
                            />
                            <Route
                              path="/club-management/broadcast/details/:id"
                              element={<ClubBroadcastDetailsPage />}
                            />
                            {/* Club Management - Events */}
                            <Route
                              path="/club-management/events"
                              element={<ClubEventsPage />}
                            />
                            <Route
                              path="/club-management/events/add"
                              element={<AddClubEventPage />}
                            />
                            <Route
                              path="/club-management/events/details/:id"
                              element={<ClubEventDetailsPage />}
                            />
                            {/* Club Management - Accounting */}
                            <Route
                              path="/club-management/accounting"
                              element={<PaymentManagementDashboard />}
                            />
                            <Route
                              path="/club-management/accounting/details/:id"
                              element={<PaymentDetailPage />}
                            />
                            {/* Snagging Routes */}
                            <Route
                              path="/transitioning/snagging"
                              element={<SnaggingDashboard />}
                            />
                            <Route
                              path="/transitioning/snagging/details/:id"
                              element={<SnaggingDetailsPage />}
                            />
                            <Route
                              path="/transitioning/hoto"
                              element={<HOTODashboard />}
                            />
                            {/* Design Insights Routes */}
                            <Route
                              path="/transitioning/design-insight"
                              element={<DesignInsightsDashboard />}
                            />
                            <Route
                              path="/transitioning/design-insight/add"
                              element={<AddDesignInsightDashboard />}
                            />
                            <Route
                              path="/transitioning/design-insight/details/:id"
                              element={<DesignInsightDetailsDashboard />}
                            />
                            <Route
                              path="/transitioning/design-insight/edit/:id"
                              element={<EditDesignInsightDashboard />}
                            />
                            {/* Fitout Routes */}
                            <Route
                              path="/transitioning/fitout/setup"
                              element={<FitoutSetupDashboard />}
                            />
                            <Route
                              path="/transitioning/fitout/request"
                              element={<FitoutRequestListDashboard />}
                            />
                            <Route
                              path="/transitioning/fitout/add-project"
                              element={<AddProjectDashboard />}
                            />
                            <Route
                              path="/transitioning/fitout/checklist"
                              element={<FitoutChecklistDashboard />}
                            />
                            <Route
                              path="/transitioning/fitout/checklist/add"
                              element={<AddChecklistDashboard />}
                            />
                            <Route
                              path="/transitioning/fitout/violation"
                              element={<FitoutViolationDashboard />}
                            />
                            {/* Ticket Routes */}
                            <Route
                              path="/maintenance/ticket/employee"
                              element={<TicketDashboardEmployee />}
                            />
                            <Route
                              path="/employee/dashboard"
                              element={<EmployeeDashboard />}
                            />
                            <Route path="/my-inbox" element={<MyInboxPage />} />
                            <Route
                              path="/employee/calendar"
                              element={<EmployeeCalendarPage />}
                            />
                            <Route
                              path="/maintenance/ticket"
                              element={<TicketDashboard />}
                            />
                            <Route
                              path="/maintenance/ticket/add"
                              element={<AddTicketDashboard />}
                            />
                            <Route
                              path="/maintenance/ticket/employee/add"
                              element={<AddTicketDashboardEmployee />}
                            />
                            <Route
                              path="/maintenance/ticket/assign"
                              element={<AssignTicketsPage />}
                            />
                            <Route
                              path="/maintenance/ticket/update/:id"
                              element={<UpdateTicketsPage />}
                            />
                            <Route
                              path="/maintenance/ticket/debls/:id"
                              element={<TicketDetailsPage />}
                            />
                            <Route
                              path="/maintenance/ticket/:id/feeds"
                              element={<TicketFeedsPage />}
                            />
                            <Route
                              path="/maintenance/ticket/:id/tag-vendor"
                              element={<TicketTagVendorPage />}
                            />
                            <Route
                              path="/maintenance/ticket/:id/job-sheet"
                              element={<TicketJobSheetPage />}
                            />
                            <Route
                              path="/maintenance/ticket"
                              element={<TicketDashboard />}
                            />
                            <Route path="/tickets" element={<TicketListPage />} />
                            <Route
                              path="/maintenance/ticket/add"
                              element={<AddTicketDashboard />}
                            />
                            <Route
                              path="/maintenance/ticket/assign"
                              element={<AssignTicketsPage />}
                            />
                            <Route
                              path="/maintenance/ticket/update/:id"
                              element={<UpdateTicketsPage />}
                            />
                            <Route
                              path="/maintenance/ticket/details/:id"
                              element={<TicketDetailsPage />}
                            />
                            <Route
                              path="/maintenance/ticket/:id/feeds"
                              element={<TicketFeedsPage />}
                            />
                            <Route
                              path="/maintenance/ticket/:id/tag-vendor"
                              element={<TicketTagVendorPage />}
                            />
                            <Route
                              path="/maintenance/ticket/employee/details/:id"
                              element={<TicketDetailsEmployee />}
                            />
                            {/* Task Routes */}
                            <Route
                              path="/maintenance/task"
                              element={<ScheduledTaskDashboard />}
                            />
                            <Route
                              path="/maintenance/task/submit/:id"
                              element={<TaskSubmissionPage />}
                            />
                            <Route
                              path="/maintenance/task/details/:id"
                              element={<TaskDetailsPage />}
                            />
                            <Route
                              path="/maintenance/task/job-sheet/:id"
                              element={<JobSheetPage />}
                            />
                            {/* Safety Routes */}
                            <Route
                              path="/safety/incident"
                              element={<IncidentDashboard />}
                            />
                            <Route
                              path="/trainings/bulk-upload"
                              element={<TrainingBulkUploadPage />}
                            />
                            <Route
                              path="/safety/incident/add"
                              element={<AddIncidentPage />}
                            />
                            <Route
                              path="/safety/incident/:id"
                              element={<IncidentDetailsPage />}
                            />
                            <Route
                              path="/safety/incident/new-details/:id"
                              element={<IncidentNewDetails />}
                            />
                            <Route
                              path="/safety/incident/edit/:id"
                              element={<EditIncidentDetailsPage />}
                            />
                            <Route
                              path="/safety/permit"
                              element={<PermitToWorkDashboard />}
                            />
                            <Route
                              path="/safety/permit/add"
                              element={<AddPermitPage />}
                            />
                            <Route
                              path="/safety/permit/checklist"
                              element={<PermitChecklistList />}
                            />
                            <Route
                              path="/safety/permit/checklist/details/:id"
                              element={<PermitChecklistDetails />}
                            />
                            <Route
                              path="/safety/permit/checklist/edit/:id"
                              element={<EditPermitChecklist />}
                            />
                            <Route
                              path="/safety/permit-checklist/add"
                              element={<AddPermitChecklist />}
                            />
                            <Route
                              path="/safety/permit/details/:id"
                              element={<PermitDetails />}
                            />
                            <Route
                              path="/safety-check-audit"
                              element={<SafetyCheckAudit />}
                            />
                            <Route
                              path="/safety/permit/edit/:id"
                              element={
                                <ProtectedRoute>
                                  <EditPermitPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/safety/permit/safety-check-form"
                              element={<PermitSafetyCheckForm />}
                            />
                            <Route
                              path="/safety/permit/vendor-form/:id?"
                              element={<VendorPermitForm />}
                            />
                            <Route
                              path="/safety/permit/fill-form/:id?"
                              element={<FillForm />}
                            />
                            <Route
                              path="/safety/permit/fill-jsa-form/:id?"
                              element={<FillJSAForm />}
                            />
                            <Route
                              path="/safety/permit/pending-approvals"
                              element={<PermitPendingApprovalsDashboard />}
                            />
                            {/* <Route path="/safety/m-safe" element={<MSafeDashboard />} /> */}
                            <Route
                              path="/safety/m-safe/non-fte-users"
                              element={<NonFTEUsersDashboard />}
                            />
                            <Route
                              path="/safety/m-safe/krcc-form-list"
                              element={<KRCCFormListDashboard />}
                            />
                            <Route
                              path="/safety/training-list"
                              element={<TrainingListDashboard />}
                            />
                            <Route
                              path="/safety/training-list/add"
                              element={<AddTrainingRecordDashboard />}
                            />
                            <Route
                              path="/safety/training-list/:id"
                              element={<TrainingRecordDetailsPage />}
                            />
                            <Route
                              path="/safety/training-list/edit/:id"
                              element={<AddTrainingRecordDashboard />}
                            />
                            {/* New Training User Detail route (distinct from existing training detail) */}
                            <Route
                              path="/safety/m-safe/training-list/training-user-details/:id"
                              element={<TrainingUserDetailPage />}
                            />
                            {/* M-Safe Routes */}
                            <Route
                              path="/safety/m-safe/internal"
                              element={<MSafeDashboard />}
                            />
                            <Route
                              path="/safety/training-list"
                              element={<TrainingListDashboard />}
                            />
                            <Route
                              path="/safety/m-safe/circle"
                              element={<MsafeCirlce />}
                            />
                            {/* CRM Routes */}
                            <Route path="/crm/lead" element={<LeadDashboard />} />
                            {/* Utility Routes */}
                            <Route
                              path="/utility/energy"
                              element={<EnergyDashboard />}
                            />
                            {/* Security Routes */}
                            <Route
                              path="/security/visitor"
                              element={<VisitorsDashboard />}
                            />
                            <Route
                              path="/security/visitor/employee"
                              element={<VisitorsDashboardEmployee />}
                            />
                            {/* Incident Routes */}
                            <Route
                              path="/maintenance/incident"
                              element={<IncidentListDashboard />}
                            />
                            <Route
                              path="/maintenance/incident/add"
                              element={<AddIncidentPage />}
                            />
                            <Route
                              path="/maintenance/incident/:id"
                              element={<IncidentDetailsPage />}
                            />
                            <Route
                              path="/maintenance/incident/edit/:id"
                              element={<EditIncidentDetailsPage />}
                            />
                            {/* Permit Routes */}
                            <Route
                              path="/maintenance/permit"
                              element={<PermitListDashboard />}
                            />
                            <Route
                              path="/maintenance/permit/add"
                              element={<AddPermitPage />}
                            />
                            {/* Operational Audit Routes */}
                            <Route
                              path="/maintenance/audit/operational/scheduled"
                              element={<OperationalAuditScheduledDashboard />}
                            />
                            <Route
                              path="/maintenance/audit/operational/scheduled/add"
                              element={<AddOperationalAuditSchedulePage />}
                            />
                            <Route
                              path="/maintenance/audit/operational/scheduled/view/:id"
                              element={<ViewOperationalAuditSchedulePage />}
                            />
                            <Route
                              path="/maintenance/audit/operational/scheduled/performance/:id"
                              element={
                                <ViewOperationalAuditSchedulePerformancePage />
                              }
                            />
                            <Route
                              path="/maintenance/audit/operational/conducted"
                              element={<OperationalAuditConductedDashboard />}
                            />
                            {/* Training Audit Routes */}
                            <Route
                              path="/maintenance/audit/training/scheduled"
                              element={<TrainingScheduledDashboard />}
                            />
                            <Route
                              path="/maintenance/audit/training/scheduled/add"
                              element={<AddTrainingSchedulePage />}
                            />
                            <Route
                              path="/maintenance/audit/training/scheduled/view/:id"
                              element={<ViewTrainingSchedule />}
                            />
                            <Route
                              path="/maintenance/audit/training/scheduled/performance/:id"
                              element={<ViewTrainingPerformancePage />}
                            />
                            <Route
                              path="/maintenance/audit/training/conducted"
                              element={<TrainingConductedDashboard />}
                            />
                            <Route
                              path="/maintenance/audit/operational/master-checklists"
                              element={
                                <OperationalAuditMasterChecklistsDashboard />
                              }
                            />
                            <Route
                              path="/maintenance/audit/operational/master-checklists/add"
                              element={<AddMasterChecklistPage />}
                            />
                            {/* Vendor Audit Routes */}
                            <Route
                              path="/maintenance/audit/vendor/scheduled"
                              element={<VendorAuditScheduledDashboard />}
                            />
                            <Route
                              path="/maintenance/audit/vendor/scheduled/add"
                              element={<AddVendorAuditPage />}
                            />
                            <Route
                              path="/maintenance/audit/vendor/scheduled/copy"
                              element={<AddVendorAuditSchedulePage />}
                            />
                            <Route
                              path="/maintenance/audit/vendor/scheduled/view/:id"
                              element={<ViewVendorAuditPage />}
                            />
                            <Route
                              path="/maintenance/audit/vendor/scheduled/performance/:id"
                              element={<ViewVendorAuditSchedulePerformancePage />}
                            />
                            <Route
                              path="/maintenance/audit/vendor/conducted"
                              element={<VendorAuditConductedDashboard />}
                            />
                            {/* Asset Audit Routes */}
                            <Route
                              path="/maintenance/audit/assets"
                              element={<AssetAuditDashboard />}
                            />
                            <Route
                              path="/maintenance/audit/assets/add"
                              element={<AddAssetAuditPage />}
                            />
                            <Route
                              path="/maintenance/audit/assets/edit/:id"
                              element={<EditAssetAuditPage />}
                            />
                            <Route
                              path="/maintenance/audit/assets/details/:id"
                              element={<AssetAuditDetailsPage />}
                            />
                            <Route
                              path="/maintenance/audit/assets/report/:id"
                              element={<AssetAuditReportPage />}
                            />
                            {/* Waste Generation Routes */}
                            <Route
                              path="/maintenance/waste/generation"
                              element={<UtilityWasteGenerationDashboard />}
                            />
                            <Route
                              path="/maintenance/waste/setup"
                              element={<UtilityWasteGenerationSetupDashboard />}
                            />
                            <Route
                              path="/maintenance/waste/generation/add"
                              element={<AddWasteGenerationPage />}
                            />
                            <Route
                              path="/maintenance/waste/generation/edit/:id"
                              element={<EditWasteGenerationPage />}
                            />
                            <Route
                              path="/maintenance/waste/generation/:id"
                              element={<WasteGenerationDetailsPage />}
                            />
                            {/* Survey Routes */}
                            <Route
                              path="/maintenance/survey/list"
                              element={<SurveyListDashboard />}
                            />
                            <Route
                              path="/master/survey/list"
                              element={<SurveyListDashboard />}
                            />
                            <Route
                              path="/maintenance/survey/add"
                              element={<AddSurveyPage />}
                            />
                            <Route
                              path="/master/survey/add"
                              element={<AddSurveyPage />}
                            />
                            <Route
                              path="/maintenance/survey/mapping"
                              element={<SurveyMappingDashboard />}
                            />
                            <Route
                              path="/maintenance/survey/response"
                              element={<SurveyResponsePage />}
                            />
                            <Route
                              path="/maintenance/survey/response/dashboard"
                              element={<SurveyResponseDashboard />}
                            />
                            <Route
                              path="/maintenance/survey/list"
                              element={<SurveyListDashboard />}
                            />
                            <Route
                              path="/maintenance/survey/add"
                              element={<AddSurveyPage />}
                            />
                            <Route
                              path="/maintenance/survey/edit/:id"
                              element={<EditSurveyPage />}
                            />
                            <Route
                              path="/maintenance/survey/details/:id"
                              element={<SurveyDetailsPage />}
                            />
                            <Route
                              path="/master/survey/details/:id"
                              element={<SurveyDetailsPage />}
                            />
                            <Route
                              path="/master/survey/edit/:id"
                              element={<EditSurveyPage />}
                            />
                            <Route
                              path="/maintenance/survey/mapping"
                              element={<SurveyMappingDashboard />}
                            />
                            <Route
                              path="/maintenance/survey/mapping/add"
                              element={<AddSurveyMapping />}
                            />
                            <Route
                              path="/maintenance/survey/mapping/edit/:id"
                              element={<EditSurveyMapping />}
                            />
                            <Route
                              path="/maintenance/survey/mapping/details/:id"
                              element={<SurveyMappingDetailsPage />}
                            />
                            <Route
                              path="/maintenance/survey/response"
                              element={<SurveyResponsePage />}
                            />
                            <Route
                              path="/maintenance/survey/response/details/:surveyId"
                              element={<SurveyResponseDetailPage />}
                            />
                            <Route
                              path="/maintenance/survey/response/dashboard"
                              element={<SurveyResponseDashboard />}
                            />
                            <Route
                              path="/maintenance/survey/response/:surveyId/:responseId"
                              element={<TabularResponseDetailsPage />}
                            />
                            {/* Finance Routes */}
                            <Route
                              path="/finance/material-pr"
                              element={<MaterialPRDashboard />}
                            />
                            <Route
                              path="/finance/material-pr/add"
                              element={<AddMaterialPRDashboard />}
                            />
                            <Route
                              path="/finance/material-pr/edit/:id"
                              element={<EditMaterialPRDashboard />}
                            />
                            <Route
                              path="/finance/material-pr/details/:id"
                              element={<MaterialPRDetailsPage />}
                            />
                            <Route
                              path="/finance/material-pr/clone/:id"
                              element={<CloneMaterialPRPage />}
                            />
                            <Route
                              path="/finance/material-pr/feeds/:id"
                              element={<MaterialPRFeedsPage />}
                            />
                            <Route
                              path="/finance/service-pr"
                              element={<ServicePRDashboard />}
                            />
                            <Route
                              path="/finance/service-pr/add"
                              element={<AddServicePRDashboard />}
                            />
                            <Route
                              path="/finance/service-pr/edit/:id"
                              element={<EditServicePRPage />}
                            />
                            <Route
                              path="/finance/service-pr/details/:id"
                              element={<ServicePRDetailsPage />}
                            />
                            <Route
                              path="/finance/service-pr/clone/:id"
                              element={<CloneServicePRPage />}
                            />
                            <Route
                              path="/finance/service-pr/feeds/:id"
                              element={<ServicePRFeedsPage />}
                            />
                            <Route path="/finance/po" element={<PODashboard />} />
                            <Route
                              path="/finance/po/add"
                              element={<AddPODashboard />}
                            />
                            <Route
                              path="/finance/po/details/:id"
                              element={<PODetailsPage />}
                            />
                            <Route
                              path="/finance/po/edit/:id"
                              element={<EditPODashboard />}
                            />
                            <Route
                              path="/finance/po/feeds/:id"
                              element={<POFeedsPage />}
                            />
                            <Route path="/finance/wo" element={<WODashboard />} />
                            <Route
                              path="/finance/wo/add"
                              element={<WorkOrderAddPage />}
                            />
                            <Route
                              path="/finance/wo/details/:id"
                              element={<WODetailsPage />}
                            />
                            <Route
                              path="/finance/wo/edit/:id"
                              element={<EditWODashboard />}
                            />
                            <Route
                              path="/finance/wo/feeds/:id"
                              element={<WOFeedsPage />}
                            />
                            <Route
                              path="/finance/auto-saved-pr"
                              element={<AutoSavedPRDashboard />}
                            />
                            <Route
                              path="/finance/grn-srn"
                              element={<GRNSRNDashboard />}
                            />
                            <Route
                              path="/finance/grn-srn/add"
                              element={<AddGRNDashboard />}
                            />
                            <Route
                              path="/finance/grn-srn/edit/:id"
                              element={<EditGRNDashboard />}
                            />
                            <Route
                              path="/finance/grn-srn/details/:id"
                              element={<GRNDetailsPage />}
                            />
                            <Route
                              path="/finance/grn-srn/feeds/:id"
                              element={<GRNFeedsPage />}
                            />
                            <Route
                              path="/finance/invoices"
                              element={<InvoicesDashboard />}
                            />
                            <Route
                              path="/finance/invoices/:id"
                              element={<InvoiceDetails />}
                            />
                            <Route
                              path="/finance/invoice/feeds/:id"
                              element={<InvoiceFeeds />}
                            />
                            <Route
                              path="/finance/bill-booking"
                              element={<BillBookingDashboard />}
                            />
                            <Route
                              path="/finance/bill-booking/add"
                              element={<AddBillPage />}
                            />
                            <Route
                              path="/finance/pending-approvals"
                              element={<PendingApprovalsDashboard />}
                            />
                            <Route
                              path="/finance/gdn"
                              element={<GDNDashboard />}
                            />
                            <Route
                              path="/finance/gdn/request-add"
                              element={<AddGDNPage />}
                            />
                            <Route
                              path="/finance/gdn/request-list"
                              element={<GDNDashboard />}
                            />
                            <Route
                              path="/finance/gdn/details/:id"
                              element={<GDNDetailsPage />}
                            />
                            <Route
                              path="/finance/gdn/pending-approvals/details/:id"
                              element={<GDNPendingApprovalsDetails />}
                            />
                            <Route
                              path="/finance/gdn/pending-approvals"
                              element={<GDNPendingApprovalsDashboard />}
                            />
                            <Route
                              path="/finance/deletion-requests"
                              element={<PRDeletionRequests />}
                            />
                            <Route
                              path="/finance/deleted-prs"
                              element={<DeletedPRs />}
                            />
                            <Route
                              path="/finance/invoice"
                              element={<InvoiceDashboard />}
                            />
                            <Route
                              path="/finance/wbs"
                              element={<WBSElementDashboard />}
                            />
                            {/* Accounting Routes */}
                            <Route
                              path="/accounting/retainer-invoices"
                              element={<RetainerInvoicesDashboard />}
                            />
                            <Route
                              path="/accounting/retainer-invoices/new"
                              element={<CreateRetainerInvoicePage />}
                            />
                            <Route
                              path="/accounting/retainer-invoices/import"
                              element={<ImportRetainerInvoicesPage />}
                            />
                            <Route
                              path="/accounting/payment-links"
                              element={<PaymentLinksDashboard />}
                            />
                            {/* Maintenance Routes */}
                            <Route
                              path="/maintenance/asset"
                              element={<AssetDashboard />}
                            />
                            <Route
                              path="/maintenance/documents"
                              element={<DocumentManagement />}
                            />
                            <Route
                              path="/maintenance/documents/add"
                              element={<AddDocumentDashboard />}
                            />
                            <Route
                              path="/maintenance/documents/edit/:id"
                              element={<EditDocumentPage />}
                            />
                            <Route
                              path="/maintenance/documents/create-folder"
                              element={<CreateFolderPage />}
                            />
                            <Route
                              path="/maintenance/documents/folder/edit/:id"
                              element={<EditFolderPage />}
                            />
                            <Route
                              path="/maintenance/documents/folder/:id"
                              element={<FolderDetailsPage />}
                            />
                            <Route
                              path="/maintenance/documents/details/:id"
                              element={<DocumentDetailPage />}
                            />
                            <Route
                              path="/maintenance/documents/editor/:documentId"
                              element={<OnlyOfficeEditorPage />}
                            />
                            <Route
                              path="/maintenance/asset/details/:id"
                              element={<AssetDetailsPage />}
                            />
                            <Route
                              path="/maintenance/asset/edit/:id"
                              element={<EditAssetDetailsPage />}
                            />
                            <Route
                              path="/maintenance/asset/add"
                              element={<AddAssetPage />}
                            />
                            <Route
                              path="/maintenance/asset/move"
                              element={<MoveAssetPage />}
                            />
                            <Route
                              path="/maintenance/asset/dispose"
                              element={<DisposeAssetPage />}
                            />
                            <Route
                              path="/maintenance/asset/inactive"
                              element={<InActiveAssetsDashboard />}
                            />
                            {/* AMC Routes */}
                            <Route
                              path="/maintenance/amc"
                              element={<AMCDashboard />}
                            />
                            <Route
                              path="/maintenance/amc/add"
                              element={<AddAMCPage />}
                            />
                            <Route
                              path="/maintenance/amc/details/:id"
                              element={<AMCDetailsPage />}
                            />
                            <Route
                              path="/maintenance/amc/edit/:id"
                              element={<EditAMCPage />}
                            />
                            {/* Service Routes */}
                            <Route
                              path="/maintenance/service"
                              element={<ServiceDashboard />}
                            />
                            <Route
                              path="/maintenance/services"
                              element={<ServiceDashboard />}
                            />
                            <Route
                              path="/maintenance/service/add"
                              element={<AddServicePage />}
                            />
                            <Route
                              path="/maintenance/service/details/:id"
                              element={<ServiceDetailsPage />}
                            />
                            <Route
                              path="/maintenance/service/edit/:id"
                              element={<EditServicePage />}
                            />
                            {/* SAC/HSN Routes (list + detail) */}
                            {/* <Route path="/maintenance/sac-hsn" element={<SacHsn />} />
                <Route path="/maintenance/sac-hsn/details/:id" element={<DetailPageSacHsn />} /> */}
                            {/* Attendance Routes */}
                            <Route
                              path="/maintenance/attendance"
                              element={<AttendanceDashboard />}
                            />
                            <Route
                              path="/maintenance/attendance/details/:id"
                              element={<AttendanceDetailsPage />}
                            />
                            {/* Inventory Routes */}
                            <Route
                              path="/maintenance/inventory"
                              element={<InventoryDashboard />}
                            />
                            <Route
                              path="/maintenance/inventory/add"
                              element={<AddInventoryPage />}
                            />
                            <Route
                              path="/maintenance/inventory/details/:id"
                              element={<InventoryDetailsPage />}
                            />
                            <Route
                              path="/maintenance/inventory/edit/:id"
                              element={<EditInventoryPage />}
                            />
                            <Route
                              path="/maintenance/inventory/feeds/:id"
                              element={<InventoryFeedsPage />}
                            />
                            <Route
                              path="/maintenance/inventory-consumption"
                              element={<InventoryConsumptionDashboard />}
                            />
                            <Route
                              path="/maintenance/inventory-consumption/view/:id"
                              element={<InventoryConsumptionViewPage />}
                            />
                            <Route
                              path="/maintenance/eco-friendly-list"
                              element={<EcoFriendlyListPage />}
                            />
                            {/* Inventory Routes */}
                            <Route
                              path="/maintenance/inventory"
                              element={<InventoryDashboard />}
                            />
                            <Route
                              path="/maintenance/inventory/add"
                              element={<AddInventoryPage />}
                            />
                            <Route
                              path="/maintenance/inventory/details/:id"
                              element={<InventoryDetailsPage />}
                            />
                            <Route
                              path="/maintenance/inventory/edit/:id"
                              element={<EditInventoryPage />}
                            />
                            <Route
                              path="/maintenance/inventory/feeds/:id"
                              element={<InventoryFeedsPage />}
                            />
                            {/* Task Routes */}
                            <Route
                              path="/maintenance/task"
                              element={<ScheduledTaskDashboard />}
                            />
                            <Route
                              path="/maintenance/task/details/:id"
                              element={<TaskDetailsPage />}
                            />
                            <Route
                              path="/maintenance/task/job-sheet/:id"
                              element={<JobSheetPage />}
                            />
                            {/* Schedule Routes */}
                            <Route
                              path="/maintenance/schedule"
                              element={<ScheduleListDashboard />}
                            />
                            <Route
                              path="/maintenance/schedule/add"
                              element={<AddSchedulePage />}
                            />
                            <Route
                              path="/maintenance/schedule/export"
                              element={<ScheduleExportPage />}
                            />
                            <Route
                              path="/maintenance/schedule/edit/:id"
                              element={<EditSchedulePage />}
                            />
                            <Route
                              path="/maintenance/schedule/clone/:id"
                              element={<CloneSchedulePage />}
                            />
                            <Route
                              path="/maintenance/schedule/copy/:id"
                              element={<CopySchedulePage />}
                            />
                            <Route
                              path="/maintenance/schedule/view/:id"
                              element={<ViewSchedulePage />}
                            />
                            <Route
                              path="/maintenance/schedule/performance/:id"
                              element={<ViewPerformancePage />}
                            />
                            <Route
                              path="/accounting/vendor"
                              element={<VendorPage />}
                            />
                            <Route
                              path="/accounting/vendor/add"
                              element={<AddVendorPage />}
                            />
                            <Route
                              path="/accounting/vendor/view/:id"
                              element={<DetailsVendorPage />}
                            />
                            <Route
                              path="/accounting/vendor/edit/:id"
                              element={<EditVendorPage />}
                            ></Route>

                            <Route
                              path="/vas/projects"
                              element={<ProjectsDashboard />}
                            />
                            <Route
                              path="/report-analytics"
                              element={<ReportAnalytics />}
                            />
                            {/* <Route
                            path="/dashboard-UI"
                            element={<DashboardUI />} /> */}
                            <Route
                              path="/vas/projects/details/:id"
                              element={<ProjectDetailsPage />}
                            />
                            <Route
                              path="/vas/projects/:id/milestones"
                              element={<ProjectMilestones />}
                            />
                            <Route
                              path="/vas/projects/:id/milestones/:mid/tasks"
                              element={<ProjectTasksPage />}
                            />
                            <Route
                              path="/vas/tasks"
                              element={<ProjectTasksPage />}
                            />
                            <Route
                              path="/vas/projects/:id/milestones/:mid/tasks/:taskId"
                              element={<ProjectTaskDetails />}
                            />
                            <Route
                              path="/vas/tasks/:taskId"
                              element={<ProjectTaskDetails />}
                            />
                            <Route
                              path="/vas/sprint"
                              element={<SprintDashboard />}
                            />
                            <Route
                              path="/vas/sprint/details/:id"
                              element={<SprintDetailsPage />}
                            />
                            <Route
                              path="/vas/sprint/:id"
                              element={<SprintKanban />}
                            />
                            <Route
                              path="/vas/projects/:id/milestones/:mid"
                              element={<MilestoneDetailsPage />}
                            />
                            {/* Issues Routes */}
                            <Route
                              path="/vas/issues"
                              element={<IssuesListPage />}
                            />
                            <Route
                              path="/vas/issues/:id"
                              element={<IssueDetailsPage />}
                            />
                            <Route
                              path="/vas/projects/:id/issues"
                              element={<IssuesListPage />}
                            />
                            <Route
                              path="/vas/projects/:id/issues/:issueId"
                              element={<IssueDetailsPage />}
                            />
                            <Route
                              path="/vas/opportunity"
                              element={<OpportunityDashboard />}
                            />
                            <Route
                              path="/vas/opportunity/:id"
                              element={<OpportunityDetailsPage />}
                            />
                            <Route path="/vas/todo" element={<Todo />} />
                            <Route
                              path="/notifications"
                              element={<NotificationsPage />}
                            />
                            <Route
                              path="/vas/documents"
                              element={<DocumentManagement />}
                            />
                            <Route
                              path="/vas/mom"
                              element={<MinutesOfMeeting />}
                            />
                            <Route
                              path="/vas/project-dashboard"
                              element={<DashboardUI />}
                            />
                            <Route path="/vas/add-mom" element={<AddMoMPage />} />
                            <Route
                              path="/vas/edit-mom/:id"
                              element={<EditMoMPage />}
                            />
                            <Route
                              path="/settings/project-task-setup/roles"
                              element={<ProjectRoles />}
                            />
                            <Route
                              path="/settings/project-task-setup/project-types"
                              element={<ProjectTypes />}
                            />
                            <Route
                              path="/settings/project-task-setup/project-tags"
                              element={<ProjectTags />}
                            />
                            <Route
                              path="/settings/project-task-setup/project-teams"
                              element={<ProjectTeams />}
                            />
                            <Route
                              path="/settings/project-task-setup/project-status"
                              element={<ProjectStatus />}
                            />
                            <Route
                              path="/settings/project-task-setup/project-groups"
                              element={<ProjectGroups />}
                            />
                            <Route
                              path="/settings/project-task-setup/project-templates"
                              element={<ProjectTemplates />}
                            />
                            <Route
                              path="/settings/project-task-setup/issue-types"
                              element={<ProjectIssueTypes />}
                            />
                            {/* Utility Routes */}
                            <Route
                              path="/utility/energy"
                              element={<UtilityDashboard />}
                            />
                            <Route
                              path="/utility/energy/add-asset"
                              element={<AddWaterAssetDashboard />}
                            />
                            <Route
                              path="/utility/inactive-assets"
                              element={<InActiveAssetsDashboard />}
                            />
                            <Route
                              path="/utility/water"
                              element={<UtilityWaterDashboard />}
                            />
                            <Route
                              path="/utility/water/add-asset"
                              element={<AddWaterAssetDashboard />}
                            />
                            <Route
                              path="/utility/stp"
                              element={<UtilitySTPDashboard />}
                            />
                            <Route
                              path="/utility/stp/add-asset"
                              element={<AddWaterAssetDashboard />}
                            />
                            <Route
                              path="/utility/ev-consumption"
                              element={<UtilityEVConsumptionDashboard />}
                            />
                            <Route
                              path="/utility/daily-readings"
                              element={<UtilityDailyReadingsDashboard />}
                            />
                            <Route
                              path="/utility/daily-readings/edit/:id"
                              element={<EditMeasurementPage />}
                            />
                            <Route
                              path="/utility/solar-generator"
                              element={<UtilitySolarGeneratorDashboard />}
                            />
                            <Route
                              path="/utility/utility-request"
                              element={<UtilityRequestDashboard />}
                            />
                            <Route
                              path="/utility/utility-request/details/:id"
                              element={<UtilityRequestDetailsPage />}
                            />
                            <Route
                              path="/utility/utility-request/add"
                              element={<AddUtilityRequestPage />}
                            />
                            <Route
                              path="/utility/utility-request/edit/:id"
                              element={<EditUtilityRequestPage />}
                            />
                            <Route
                              path="/utility/utility-consumption"
                              element={<UtilityConsumptionDashboard />}
                            />
                            <Route
                              path="/utility/utility-consumption/generate-bill"
                              element={<GenerateUtilityBillPage />}
                            />
                            <Route
                              path="/utility/add-asset"
                              element={<AddAssetDashboard />}
                            />
                            <Route
                              path="/utility/solar-generator"
                              element={<UtilitySolarGeneratorDashboard />}
                            />
                            {/* Energy Asset Routes */}
                            <Route
                              path="/utility/energy/details/:id"
                              element={<EnergyAssetDetailsPage />}
                            />
                            <Route
                              path="/utility/energy/edit/:id"
                              element={<EditEnergyAssetPage />}
                            />
                            {/* Water Asset Details Route */}
                            <Route
                              path="/utility/water/details/:id"
                              element={<WaterAssetDetailsPage />}
                            />
                            <Route
                              path="/utility/water/edit/:id"
                              element={<EditWaterAssetDashboard />}
                            />
                            {/* Security/Visitors Routes */}
                            <Route
                              path="/security/gate-pass"
                              element={<GatePassDashboard />}
                            />
                            <Route
                              path="/security/gate-pass/inwards"
                              element={<GatePassInwardsDashboard />}
                            />
                            <Route
                              path="/security/gate-pass/outwards"
                              element={<GatePassOutwardsDashboard />}
                            />
                            <Route
                              path="/security/visitor"
                              element={<VisitorsDashboard />}
                            />
                            <Route
                              path="/security/visitor/history"
                              element={<VisitorsHistoryDashboard />}
                            />
                            <Route
                              path="/security/gate-pass"
                              element={<GatePassDashboard />}
                            />
                            <Route
                              path="/security/gate-pass/inwards"
                              element={<GatePassInwardsDashboard />}
                            />
                            <Route
                              path="/security/gate-pass/inwards/detail/:id"
                              element={<GatePassInwardsDetailPage />}
                            />
                            <Route
                              path="/security/gate-pass/inwards/add"
                              element={<AddGatePassInwardPage />}
                            />
                            <Route
                              path="/security/gate-pass/outwards"
                              element={<GatePassOutwardsDashboard />}
                            />
                            <Route
                              path="/security/gate-pass/outwards/add"
                              element={<GatePassOutwardsAddPage />}
                            />
                            <Route
                              path="/security/gate-pass/outwards/:id"
                              element={<GatePassOutwardsDetailPage />}
                            />
                            <Route
                              path="/security/visitor"
                              element={<VisitorsDashboard />}
                            />
                            <Route
                              path="/security/visitor/add"
                              element={<VisitorFormPage />}
                            />
                            <Route
                              path="/security/visitor/employee/add"
                              element={<VisitorFormPageEmployeeNew />}
                            />
                            <Route
                              path="/security/visitor/history"
                              element={<VisitorsHistoryDashboard />}
                            />
                            <Route
                              path="/security/visitor/details/:id"
                              element={<VisitorDetailsPage />}
                            />
                            <Route
                              path="/security/visitor/employee/details/:id"
                              element={<VisitorDetailsPageEmployee />}
                            />
                            <Route
                              path="/settings/visitor-management/setup"
                              element={<VisitorManagementSetup />}
                            />
                            <Route
                              path="/settings/visitor-management/setup/add-gate"
                              element={<AddVisitorGatePage />}
                            />
                            <Route
                              path="/settings/visitor-management/setup/edit/:id"
                              element={<EditVisitorGatePage />}
                            />
                            <Route
                              path="/settings/visitor-management/support-staff"
                              element={<SupportStaffPage />}
                            />
                            <Route
                              path="/settings/visitor-management/support-staff/edit/:id"
                              element={<EditSupportStaffPage />}
                            />
                            <Route
                              path="/settings/visitor-management/visiting-purpose"
                              element={<VisitingPurposePage />}
                            />
                            <Route
                              path="/settings/visitor-management/icons"
                              element={<IconsDashboard />}
                            />
                            <Route
                              path="/settings/visitor-management/icons/add"
                              element={<AddIconPage />}
                            />
                            <Route
                              path="/settings/visitor-management/icons/edit/:iconId"
                              element={<EditIconPage />}
                            />
                            <Route
                              path="/settings/staff"
                              element={<StaffsDashboard />}
                            />
                            <Route
                              path="/safety/report/msafe-report"
                              element={<MsafeReportDownload />}
                            />
                            <Route
                              path="/safety/report/msafe-detail-report"
                              element={<MsafeDetailReportDownload />}
                            />
                            <Route
                              path="/safety/employee-deletion-history"
                              element={<EmployeeDeletionHistory />}
                            />
                            <Route
                              path="/safety/check-hierarchy-levels"
                              element={<CheckHierarchy />}
                            />
                            <Route
                              path="/security/staff/details/:id"
                              element={<StaffDetailsPage />}
                            />
                            <Route
                              path="/security/staff/edit/:id"
                              element={<EditStaffPage />}
                            />
                            <Route
                              path="/security/patrolling"
                              element={<PatrollingDashboard />}
                            />
                            <Route
                              path="/security/patrolling/response"
                              element={<PatrollingResponsePage />}
                            />
                            <Route
                              path="/security/patrolling/create"
                              element={<PatrollingCreatePage />}
                            />
                            {/* <Route
                    path="/security/patrolling/edit/:id"
                    element={<PatrollingCreatePage />}
                  /> */}
                            <Route
                              path="/security/patrolling/details/:id"
                              element={<PatrollingDetailPage />}
                            />
                            <Route
                              path="/security/patrolling/response/details/:id"
                              element={<PatrollingDetailPage />}
                            />
                            <Route
                              path="/security/staff"
                              element={<StaffsDashboard />}
                            />
                            <Route
                              path="/security/staff/details/:id"
                              element={<StaffDetailsPage />}
                            />
                            <Route
                              path="/security/staff/edit/:id"
                              element={<EditStaffPage />}
                            />
                            <Route
                              path="/security/staff/add"
                              element={<AddStaffPage />}
                            />
                            <Route
                              path="/security/patrolling/create"
                              element={<PatrollingCreatePage />}
                            />
                            <Route
                              path="/security/patrolling/edit/:id"
                              element={<PatrollingEditPage />}
                            />
                            {/* Security Vehicle Routes */}
                            <Route
                              path="/security/vehicle/r-vehicles"
                              element={<RVehiclesDashboard />}
                            />
                            <Route
                              path="/security/vehicle/r-vehicles/history"
                              element={<RVehiclesHistoryDashboard />}
                            />
                            <Route
                              path="/security/vehicle/g-vehicles"
                              element={<GVehiclesDashboard />}
                            />
                            <Route
                              path="/security/vehicle/r-vehicles/in"
                              element={<RVehiclesInDashboard />}
                            />
                            <Route
                              path="/security/vehicle/r-vehicles/out"
                              element={<RVehiclesOutDashboard />}
                            />
                            {/* Value Added Services Routes */}
                            <Route
                              path="/mail-inbounds-create"
                              element={<NewInboundPage />}
                            />
                            <Route
                              path="/vas/fnb"
                              element={
                                <RestaurantOrdersTable needPadding={true} />
                              }
                            />
                            {/* <Route path="/vas/fnb/add" element={<AddRestaurantPage />} /> */}
                            <Route
                              path="/vas/fnb/details/:id"
                              element={<FnBRestaurantDetailsPage />}
                            />
                            <Route
                              path="/vas/fnb/details/:id/restaurant-menu/:mid"
                              element={<ProductSetupDetailPage />}
                            />
                            <Route
                              path="/vas/fnb/details/:id/restaurant-order/:oid"
                              element={<RestaurantOrderDetailPage />}
                            />
                            <Route
                              path="/vas/fnb/discounts"
                              element={<FnBDiscountsPage />}
                            />
                            {/* Mailroom Routes */}
                            <Route
                              path="/vas/mailroom/inbound"
                              element={<InboundListPage />}
                            />
                            <Route
                              path="/vas/mailroom/inbound/create"
                              element={<NewInboundPage />}
                            />
                            <Route
                              path="/vas/mailroom/inbound/:id"
                              element={<InboundDetailPage />}
                            />
                            <Route
                              path="/vas/mailroom/outbound"
                              element={<OutboundListPage />}
                            />
                            <Route
                              path="/vas/mailroom/outbound/create"
                              element={<NewOutboundPage />}
                            />
                            <Route
                              path="/vas/mailroom/outbound/:id"
                              element={<OutboundDetailPage />}
                            />
                            <Route
                              path="/vas/parking"
                              element={<ParkingDashboard />}
                            />
                            <Route
                              path="/vas/parking/details/:clientId"
                              element={<ParkingDetailsPage />}
                            />
                            <Route
                              path="/vas/parking/bookings"
                              element={<ParkingBookingsDashboard />}
                            />
                            <Route
                              path="/vas/parking/site-wise-bookings"
                              element={<ParkingBookingListSiteWise />}
                            />
                            <Route
                              path="/vas/parking/create"
                              element={<ParkingCreatePage />}
                            />
                            <Route
                              path="/vas/parking/edit/:clientId?"
                              element={<ParkingEditPage />}
                            />
                            <Route path="/vas/osr" element={<OSRDashboard />} />
                            <Route
                              path="/vas/osr/details/:id"
                              element={<OSRDetailsPage />}
                            />
                            <Route
                              path="/vas/osr/generate-receipt"
                              element={<OSRGenerateReceiptPage />}
                            />
                            <Route
                              path="/vas/redemption-marketplace"
                              element={<RedemptionMarketplacePage />}
                            />
                            <Route
                              path="/vas/hotels/rewards"
                              element={<HotelRewardsPage />}
                            />
                            <Route
                              path="/vas/hotels/details"
                              element={<HotelDetailsPage />}
                            />
                            <Route
                              path="/vas/hotels/booking"
                              element={<HotelBookingPage />}
                            />
                            <Route
                              path="/vas/tickets/discounts"
                              element={<TicketDiscountsPage />}
                            />
                            {/* Value Added Services Routes */}
                            {/* <Route path="/vas/fnb" element={<FnBRestaurantDashboard />} /> */}
                            <Route
                              path="/settings/approval-matrix/setup/edit/:id"
                              element={<EditApprovalMatrixPage />}
                            />
                            <Route
                              path="/vas/fnb/discounts"
                              element={<FnBDiscountsPage />}
                            />
                            <Route
                              path="/vas/parking"
                              element={<ConditionalParkingPage />}
                            />
                            <Route
                              path="/vas/parking/details/:clientId"
                              element={<ParkingDetailsPage />}
                            />
                            <Route
                              path="/vas/parking/bookings"
                              element={<ParkingBookingsDashboard />}
                            />
                            <Route path="/vas/osr" element={<OSRDashboard />} />
                            <Route
                              path="/vas/osr/details/:id"
                              element={<OSRDetailsPage />}
                            />
                            <Route
                              path="/vas/osr/generate-receipt"
                              element={<OSRGenerateReceiptPage />}
                            />
                            <Route
                              path="/vas/redemption-marketplace"
                              element={<RedemptionMarketplacePage />}
                            />
                            <Route
                              path="/vas/hotels/rewards"
                              element={<HotelRewardsPage />}
                            />
                            <Route
                              path="/vas/hotels/details"
                              element={<HotelDetailsPage />}
                            />
                            <Route
                              path="/vas/hotels/booking"
                              element={<HotelBookingPage />}
                            />
                            <Route
                              path="/vas/tickets/discounts"
                              element={<TicketDiscountsPage />}
                            />
                            {/* Handle the typo in the URL */}
                            <Route
                              path="/vas/redemonection-marketplace"
                              element={
                                <Navigate
                                  to="/vas/redemption-marketplace"
                                  replace
                                />
                              }
                            />
                            {/* Space Management Routes */}
                            <Route
                              path="/vas/space-management/bookings"
                              element={<SpaceManagementBookingsDashboard />}
                            />
                            <Route
                              path="/employee/space-management/bookings"
                              element={
                                <ProtectedRoute>
                                  <SpaceManagementBookingsDashboardEmployee />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/vas/space-management/bookings/employee/add"
                              element={
                                <ProtectedRoute>
                                  <SpaceManagementBookingAddEmployee />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/vas/space-management/bookings/details/:id"
                              element={
                                <ProtectedRoute>
                                  <SpaceManagementBookingDetailsPage />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/vas/space-management/seat-requests"
                              element={<SpaceManagementSeatRequestsDashboard />}
                            />
                            <Route
                              path="/space-management/bookings"
                              element={<SpaceManagementBookingsDashboard />}
                            />
                            <Route
                              path="/space-management/seat-requests"
                              element={<SpaceManagementSeatRequestsDashboard />}
                            />
                            {/* VAS Space Management Setup Routes - moved inside main layout */}
                            <Route
                              path="/vas/space-management/setup/seat-type"
                              element={<SeatTypeDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/seat-setup"
                              element={<SeatSetupDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/seat-setup/add"
                              element={<AddSeatSetupDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/seat-setup/edit/:id"
                              element={<EditSeatSetupDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/shift"
                              element={<ShiftDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/roster"
                              element={<UserRoastersDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/roster/create"
                              element={<CreateRosterTemplateDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/roster/edit/:id"
                              element={<EditRosterTemplatePage />}
                            />
                            <Route
                              path="/vas/space-management/setup/employees"
                              element={<EmployeesDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/employees/add"
                              element={<AddEmployeeDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/employees/edit/:id"
                              element={<EditEmployeePage />}
                            />
                            <Route
                              path="/vas/space-management/setup/employees/details/:id"
                              element={<EmployeeDetailsPage />}
                            />
                            <Route
                              path="/vas/space-management/setup/check-in-margin"
                              element={<CheckInMarginDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/roster-calendar"
                              element={<RosterCalendarDashboard />}
                            />
                            <Route
                              path="/vas/space-management/setup/export"
                              element={<ExportDashboard />}
                            />
                            {/* M Safe Routes */}
                            <Route
                              path="/safety/m-safe/non-fte-users"
                              element={<NonFTEUsersDashboard />}
                            />
                            <Route
                              path="/safety/m-safe/krcc-form-list"
                              element={<KRCCFormListDashboard />}
                            />
                            <Route
                              path="/safety/m-safe"
                              element={
                                <Navigate to="/safety/m-safe/internal" replace />
                              }
                            />
                            <Route
                              path="/safety/m-safe/external"
                              element={<ExternalUsersDashboard />}
                            />
                            <Route
                              path="/safety/m-safe/user/:userId"
                              element={<MSafeUserDetail />}
                            />
                            <Route
                              path="/safety/m-safe/external/user/:userId"
                              element={<ExternalUserDetail />}
                            />
                            <Route
                              path="/safety/m-safe/external/user/:userId/edit"
                              element={<EditExternalUserPage />}
                            />
                            <Route
                              path="/safety/m-safe/external/user/:userId/lmc-manager"
                              element={<LMCPage />}
                            />
                            <Route
                              path="/safety/m-safe/non-fte-users"
                              element={<NonFTEUsersDashboard />}
                            />
                            <Route
                              path="/safety/m-safe/krcc-list"
                              element={<KRCCFormListDashboard />}
                            />
                            <Route
                              path="/safety/m-safe/krcc-list/:id"
                              element={<KRCCFormDetail />}
                            />
                            <Route
                              path="/safety/m-safe/lmc"
                              element={<LMCDashboard />}
                            />
                            <Route
                              path="/safety/m-safe/lmc/:id"
                              element={<LMCUserDetail />}
                            />
                            <Route
                              path="/safety/m-safe/training-list"
                              element={<TrainingDashboard />}
                            />
                            <Route
                              path="/safety/m-safe/training-list/:id"
                              element={<TrainingDetailPage />}
                            />
                            <Route
                              path="/safety/m-safe/smt"
                              element={<SMTDashboard />}
                            />
                            <Route
                              path="/safety/m-safe/smt/:id"
                              element={<SMTDetailPage />}
                            />
                            <Route
                              path="/safety/m-safe/external-users/multiple-delete"
                              element={<MultipleUserDeletePage />}
                            />
                            <Route
                              path="/safety/m-safe/reportees-reassign"
                              element={<ReporteesReassignPage />}
                            />
                            <Route
                              path="/safety/vi-miles/vehicle-details"
                              element={<VehicleDetails />}
                            />
                            <Route
                              path="/safety/vi-miles/vehicle-check-in"
                              element={<VehicleCheckIn />}
                            />
                            <Route
                              path="/vehicle-history/update"
                              element={<UpdateVehicleHistoryPage />}
                            />
                            {/* Market Place Routes */}
                            <Route
                              path="/market-place/all"
                              element={<MarketPlaceAllPage />}
                            />
                            <Route
                              path="/market-place/installed"
                              element={<MarketPlaceInstalledPage />}
                            />
                            <Route
                              path="/market-place/updates"
                              element={<MarketPlaceUpdatesPage />}
                            />
                            <Route
                              path="/market-place/lease-management"
                              element={<LeaseManagementDetailPage />}
                            />
                            <Route
                              path="/market-place/loyalty-rule-engine"
                              element={<LoyaltyRuleEngineDetailPage />}
                            />
                            <Route
                              path="/market-place/cloud-telephony"
                              element={<CloudTelephonyDetailPage />}
                            />
                            <Route
                              path="/market-place/accounting"
                              element={<AccountingDetailPage />}
                            />
                            {/* VAS Booking Routes */}
                            <Route
                              path="/vas/booking/list"
                              element={<BookingList />}
                            />
                            <Route
                              path="/vas/booking/add"
                              element={<AddFacilityBookingPage />}
                            />
                            <Route
                              path="/vas/booking/edit/:id"
                              element={<EditFacilityBookingPage />}
                            />
                            <Route
                              path="/vas/bookings/details/:id"
                              element={<BookingDetailsPage />}
                            />
                            {/* <Route path="/vas/booking/setup" element={<BookingSetupDashboard />} /> */}
                            <Route
                              path="/vas/booking/setup/details/:id"
                              element={<BookingSetupDetailPage />}
                            />
                            <Route
                              path="/payment-redirect"
                              element={<PaymentRedirectPage />}
                            />
                            {/* Payments Made Routes */}
                            {/* Master Ticket Routes */}
                            <Route
                              path="/master/ticket/golden-qr"
                              element={<GoldenQrSetupPage />}
                            />
                            {/* Master Location Routes */}
                            <Route
                              path="/master/location/building"
                              element={<BuildingPage />}
                            />
                            <Route
                              path="/master/location/wing"
                              element={<WingPage />}
                            />
                            <Route
                              path="/master/location/area"
                              element={<AreaPage />}
                            />
                            <Route
                              path="/master/location/floor"
                              element={<FloorPage />}
                            />
                            <Route
                              path="/master/location/unit"
                              element={<UnitPage />}
                            />
                            <Route
                              path="/master/location/room"
                              element={<RoomPage />}
                            />
                            <Route
                              path="/master/location/account"
                              element={<LocationAccountPage />}
                            />
                            {/* Master User Routes */}
                            <Route
                              path="/master/user/fm-users"
                              element={<FMUserMasterDashboard />}
                            />
                            <Route
                              path="/master/user/fm-users/add"
                              element={<AddFMUserPage />}
                            />
                            <Route
                              path="/master/user/fm-users/edit/:id"
                              element={<EditFMUserPage />}
                            />
                            <Route
                              path="/master/user/fm-users/view/:id"
                              element={<ViewFMUserPage />}
                            />
                            <Route
                              path="/master/user/occupant-users"
                              element={<OccupantUserMasterDashboard />}
                            />
                            <Route
                              path="/master/user/vi-users"
                              element={<ViUsersMasterDashboard />}
                            />
                            <Route
                              path="/master/user/vi-users/view/:id"
                              element={<ViewViUserPage />}
                            />
                            <Route
                              path="/master/user/vi-users/edit/:id"
                              element={<EditViUserPage />}
                            />
                            <Route
                              path="/master/user/lockated-users"
                              element={<LockedUsersDashboard />}
                            />
                            {/* Material Master Route */}
                            <Route
                              path="/master/material-ebom"
                              element={<MaterialMasterPage />}
                            />
                            <Route
                              path="/master/gate-number"
                              element={<GateNumberPage />}
                            />
                            <Route
                              path="/master/gate-number/add"
                              element={<AddGateNumberPage />}
                            />
                            <Route
                              path="/master/gate-number/edit/:id"
                              element={<EditGateNumberPage />}
                            />
                            <Route
                              path="/master/communication-template"
                              element={<CommunicationTemplateListPage />}
                            />
                            <Route
                              path="/master/communication-template/add"
                              element={<AddCommunicationTemplatePage />}
                            />
                            <Route
                              path="/master/communication-template/edit/:id"
                              element={<EditCommunicationTemplatePage />}
                            />
                            <Route
                              path="/master/document-category"
                              element={<DocumentCategoryListPage />}
                            />
                            <Route
                              path="/master/document-category/add"
                              element={<AddDocumentCategoryPage />}
                            />
                            <Route
                              path="/master/document-category/edit/:id"
                              element={<EditDocumentCategoryPage />}
                            />
                            {/* Template Routes - Root Cause Analysis */}
                            <Route
                              path="/master/template/root-cause-analysis"
                              element={<RootCauseAnalysisListPage />}
                            />
                            <Route
                              path="/master/template/root-cause-analysis/add"
                              element={<AddRootCauseAnalysisPage />}
                            />
                            <Route
                              path="/master/template/root-cause-analysis/edit/:id"
                              element={<EditRootCauseAnalysisPage />}
                            />
                            {/* Template Routes - Preventive Action */}
                            <Route
                              path="/master/template/preventive-action"
                              element={<PreventiveActionListPage />}
                            />
                            <Route
                              path="/master/template/preventive-action/add"
                              element={<AddPreventiveActionPage />}
                            />
                            <Route
                              path="/master/template/preventive-action/edit/:id"
                              element={<EditPreventiveActionPage />}
                            />
                            {/* Template Routes - Short-term Impact */}
                            <Route
                              path="/master/template/short-term-impact"
                              element={<ShortTermImpactListPage />}
                            />
                            <Route
                              path="/master/template/short-term-impact/add"
                              element={<AddShortTermImpactPage />}
                            />
                            <Route
                              path="/master/template/short-term-impact/edit/:id"
                              element={<EditShortTermImpactPage />}
                            />
                            {/* Template Routes - Long-term Impact */}
                            <Route
                              path="/master/template/long-term-impact"
                              element={<LongTermImpactListPage />}
                            />
                            <Route
                              path="/master/template/long-term-impact/add"
                              element={<AddLongTermImpactPage />}
                            />
                            <Route
                              path="/master/template/long-term-impact/edit/:id"
                              element={<EditLongTermImpactPage />}
                            />
                            {/* Template Routes - Corrective Action */}
                            <Route
                              path="/master/template/corrective-action"
                              element={<CorrectiveActionListPage />}
                            />
                            <Route
                              path="/master/template/corrective-action/add"
                              element={<AddCorrectiveActionPage />}
                            />
                            <Route
                              path="/master/template/corrective-action/edit/:id"
                              element={<EditCorrectiveActionPage />}
                            />
                            <Route
                              path="/master/gate-pass-type"
                              element={<GatePassTypePage />}
                            />
                            <Route
                              path="/master/gate-pass-type/add"
                              element={<AddGatePassTypePage />}
                            />
                            <Route
                              path="/master/gate-pass-type/edit/:id"
                              element={<EditGatePassTypePage />}
                            />
                            <Route
                              path="/master/inventory-type"
                              element={<InventoryTypePage />}
                            />
                            <Route
                              path="/master/inventory-type/add"
                              element={<AddInventoryTypePage />}
                            />
                            <Route
                              path="/master/inventory-type/edit/:id"
                              element={<EditInventoryTypePage />}
                            />
                            <Route
                              path="/settings/company-hub/Company-setup"
                              element={<CompanySetup />}
                            />
                            <Route
                              path="/settings/company-hub/employee-of-the-month"
                              element={<EmployeeOfTheMonthSetup />}
                            />
                            <Route
                              path="/settings/company-hub/announcements"
                              element={<AnnouncementsSetup />}
                            />
                            <Route
                              path="/settings/company-hub/team-setup"
                              element={<TeamSetup />}
                            />
                            <Route
                              path="/settings/company-hub/face-authentication"
                              element={<FaceAuthenticationSetup />}
                            />
                            <Route
                              path="/settings/company-hub/jobs"
                              element={<JobsPage />}
                            />
                            <Route
                              path="/settings/inventory-management/inventory-type"
                              element={<InventoryTypePage />}
                            />
                            <Route
                              path="/settings/inventory-management/inventory-type/add"
                              element={<AddInventoryTypePage />}
                            />
                            <Route
                              path="/settings/inventory-management/inventory-type/edit/:id"
                              element={<EditInventoryTypePage />}
                            />
                            <Route
                              path="/master/inventory-sub-type"
                              element={<InventorySubTypePage />}
                            />
                            <Route
                              path="/master/inventory-sub-type/add"
                              element={<AddInventorySubTypePage />}
                            />
                            <Route
                              path="/master/inventory-sub-type/edit/:id"
                              element={<EditInventorySubTypePage />}
                            />
                            <Route
                              path="/maintenance/waste/generation/add"
                              element={<AddWasteGenerationPage />}
                            />
                            <Route
                              path="/maintenance/task"
                              element={<ScheduledTaskDashboard />}
                            />
                            <Route
                              path="/maintenance/task/task-details/:id"
                              element={<TaskDetailsPage />}
                            />
                            <Route
                              path="/maintenance/task/job-sheet/:id"
                              element={<JobSheetPage />}
                            />
                            <Route
                              path="/product-details/:productId"
                              element={<ProductDetails />}
                            />
                            <Route
                              path="/product/:productSlug/access"
                              element={<ProductAccessGate />}
                            />
                            <Route
                              path="/product/loyalty"
                              element={<CustomerAppPage />}
                            />
                            <Route
                              path="/product/customer-app"
                              element={<CustomerAppPage />}
                            />
                            <Route
                              path="/product/customer-app-post-possession"
                              element={<CustomerPostPossessionPage />}
                            />
                            <Route
                              path="/product/hi-society"
                              element={<HiSocietyPage />}
                            />
                            <Route
                              path="/product/snag-360"
                              element={<Snag360Page />}
                            />
                            <Route
                              path="/product/snag-360-new"
                              element={<Snag360NewPage />}
                            />
                            <Route path="/product/qc" element={<QCPage />} />
                            <Route path="/product/rhb" element={<RHBPage />} />
                            <Route
                              path="/product/brokers"
                              element={<BrokersPage />}
                            />
                            <Route
                              path="/product/fm-matrix"
                              element={<FMMatrixPage />}
                            />
                            <Route
                              path="/product/gophygital-corporate"
                              element={<GoPhygitalCorporatePage />}
                            />
                            <Route
                              path="/product/gophygital-coworking"
                              element={<GoPhygitalCoworkingPage />}
                            />
                            <Route
                              path="/product/task-manager"
                              element={<TaskManagerPage />}
                            />
                            <Route
                              path="/product/cp-management"
                              element={<CPManagementPage />}
                            />
                            <Route
                              path="/product/vendor-management"
                              element={<VendorManagementPage />}
                            />
                            <Route
                              path="/product/procurement"
                              element={<ProcurementPage />}
                            />
                            <Route
                              path="/product/loyalty-engine"
                              element={<LoyaltyEnginePage />}
                            />
                            <Route
                              path="/product/msafe"
                              element={<MSafePage />}
                            />
                            <Route
                              path="/product/incident-management"
                              element={<IncidentManagementPage />}
                            />
                            <Route
                              path="/product/appointments"
                              element={<AppointmentsPage />}
                            />
                            <Route
                              path="/product/hse-app"
                              element={<HSEAppPage />}
                            />
                            <Route
                              path="/product/club-management"
                              element={<ClubManagementPage />}
                            />
                            {/* <Route
                            path="/product/gophygital-tenants"
                            element={<GoPhygitalTenantsPage />}
                          /> */}
                            {/* <Route path="/product/ptw" element={<PTWPage />} /> */}
                            <Route
                              path="/product/parking"
                              element={<ParkingPage />}
                            />
                            <Route
                              path="/product/facility-management"
                              element={<FacilityManagementPage />}
                            />
                            <Route
                              path="/product/customer-app-pre-sales"
                              element={<CustomerAppPreSalesPage />}
                            />
                            <Route
                              path="/product/customer-app-post-sales"
                              element={<CustomerAppPage />}
                            />
                            <Route
                              path="/product/lease-management"
                              element={<LeaseManagementPage />}
                            />
                            <Route
                              path="/product/life-compass"
                              element={<LifeCompassPage />}
                            />
                            <Route
                              path="/product/business-compass"
                              element={<BusinessCompassPage />}
                            />
                            <Route
                              path="/product/gate-management"
                              element={<GateManagementPage />}
                            />
                            <Route
                              path="/product/surveys"
                              element={<SurveyManagementPage />}
                            />
                            <Route
                              path="/product/ptw"
                              element={<PTWManagementPage />}
                            />
                            <Route
                              path="/product/gophygital-tenants"
                              element={<TenantManagementPage />}
                            />
                            {/* <Route
                            path="/product/surveys"
                            element={<SurveysPage />}
                          /> */}
                            <Route
                              path="/product/lms-sales-crm"
                              element={<LMSSalesCRMPage />}
                            />
                            <Route
                              path="/product/support-crm"
                              element={<SupportCRMPage />}
                            />
                            <Route
                              path="/product/real-estate-crm"
                              element={<RealEstateCRMPage />}
                            />
                            <Route
                              path="/product/accounting"
                              element={<AccountingPage />}
                            />
                            <Route
                              path="/product/mom-phone-mic"
                              element={<MOMPhoneMicPage />}
                            />
                            <Route path="/product/hrms" element={<HRMSPage />} />
                            <Route path="/product/esg" element={<ESGPage />} />
                            <Route
                              path="/product/mailing"
                              element={<MailingPage />}
                            />
                            <Route
                              path="/product/office-alternative"
                              element={<OfficeAlternativePage />}
                            />
                            <Route
                              path="/product/budgeting-wbs"
                              element={<BudgetingWBSPage />}
                            />
                            <Route
                              path="/product/liquidtext"
                              element={<LiquidtextPage />}
                            />
                            <Route
                              path="/product/vi-miles"
                              element={<ViMilesPage />}
                            />
                            <Route
                              path="/product/:productSlug/landing"
                              element={<ProductLandingPage />}
                            />
                            <Route path="*" element={<NotFound />} />
                          </Route>

                          {/* Settings Routes */}

                          <Route
                            path="/pulse"
                            element={
                              <ProtectedRoute>
                                <Layout>
                                  <div />
                                </Layout>
                              </ProtectedRoute>
                            }
                          >
                            <Route
                              path="/pulse/community-modules/banner-list"
                              element={<BannerListPage />}
                            />
                            <Route
                              path="/pulse/community-modules/banner-list/add"
                              element={<BannerAddPage />}
                            />
                            <Route
                              path="/pulse/community-modules/banner-list/edit/:id"
                              element={<BannerEditPage />}
                            />
                            <Route
                              path="/pulse/community-modules/banner-list/:id"
                              element={<BannerDetailsPage />}
                            />
                            <Route
                              path="/pulse/stepathon"
                              element={<StepathonPage />}
                            />
                            <Route
                              path="/pulse/events"
                              element={<CRMEventsPage />}
                            />
                            <Route
                              path="/pulse/events/add"
                              element={<AddEventPage />}
                            />
                            <Route
                              path="/pulse/events/details/:id"
                              element={<CRMEventDetailsPage />}
                            />
                            <Route
                              path="/pulse/events/edit/:id"
                              element={<EditEventPage />}
                            />
                            <Route
                              path="/pulse/events/details/:id/users/:userid"
                              element={<EventUserDetailsPage />}
                            />

                            <Route
                              path="/pulse/contests"
                              element={<PulseContests />}
                            />
                            <Route
                              path="/pulse/contests/create"
                              element={<CreateContestPage />}
                            />
                            <Route
                              path="/pulse/contests/:id"
                              element={<ContestDetailsPage />}
                            />
                            <Route
                              path="/pulse/contests/:id/edit"
                              element={<EditContestPage />}
                            />
                            <Route
                              path="/pulse/contests/:id/run"
                              element={<RunContestPage />}
                            />
                            <Route
                              path="/pulse/rewards"
                              element={<PulseContestRewards />}
                            />
                            <Route
                              path="/pulse/rewards/create"
                              element={<PulseContestRewardCreate />}
                            />
                            <Route
                              path="/pulse/rewards/:id"
                              element={<PulseContestRewardsDetails />}
                            />

                            <Route
                              path="/pulse/notices"
                              element={<BroadcastDashboard />}
                            />
                            <Route
                              path="/pulse/notices/add"
                              element={<AddBroadcastPage />}
                            />
                            <Route
                              path="/pulse/notices/edit/:id"
                              element={<EditBroadcastPage />}
                            />
                            <Route
                              path="/pulse/notices/details/:id"
                              element={<BroadcastDetailsPage />}
                            />

                            <Route
                              path="/pulse/community"
                              element={<Communtiy />}
                            />

                            <Route
                              path="/pulse/community/add"
                              element={<CommunityAdd />}
                            />

                            <Route
                              path="/pulse/community/:id"
                              element={<CommunityDetails />}
                            />

                            <Route
                              path="/pulse/community/:id/reports"
                              element={<CommunityReportsPage />}
                            />

                            <Route
                              path="/pulse/community/edit/:id"
                              element={<CommunityEdit />}
                            />

                            <Route
                              path="/pulse/community/:communityId/user/:userId"
                              element={<CommunityUserDetails />}
                            />
                            <Route
                              path="/pulse/community/:communityId/reports/details/:id"
                              element={<ReportsDetailsPage />}
                            />
                            <Route
                              path="/pulse/community/notice/:id"
                              element={<CommunityNoticeDetails />}
                            />
                            <Route
                              path="/pulse/community/event/:id"
                              element={<CommunityEventDetails />}
                            />
                            <Route
                              path="/pulse/community/document/:id"
                              element={<CommunityDocumentDetails />}
                            />

                            <Route
                              path="/pulse/visitor"
                              element={<VisitorsDashboard />}
                            />
                            <Route
                              path="/pulse/visitor/add"
                              element={<VisitorFormPage />}
                            />
                            <Route
                              path="/pulse/visitor/details/:id"
                              element={<VisitorDetailsPage />}
                            />

                            {/* Document Routes */}
                            <Route
                              path="/pulse/documents"
                              element={<DocumentManagement />}
                            />
                            <Route
                              path="/pulse/documents/add"
                              element={<AddDocumentDashboard />}
                            />
                            <Route
                              path="/pulse/documents/edit/:id"
                              element={<EditDocumentPage />}
                            />
                            <Route
                              path="/pulse/documents/create-folder"
                              element={<CreateFolderPage />}
                            />
                            <Route
                              path="/pulse/documents/folder/edit/:id"
                              element={<EditFolderPage />}
                            />
                            <Route
                              path="/pulse/documents/folder/:id"
                              element={<FolderDetailsPage />}
                            />
                            <Route
                              path="/pulse/documents/details/:id"
                              element={<DocumentDetailPage />}
                            />

                            {/* Plus Service Routes */}
                            <Route
                              path="/pulse/pulse-privilege/plus-service"
                              element={<PlusServiceDashboard />}
                            />
                            <Route
                              path="/pulse/pulse-privilege/plus-service/create"
                              element={<AddPlusServicePage />}
                            />
                            <Route
                              path="/pulse/pulse-privilege/plus-service/edit/:id"
                              element={<EditPlusServicePage />}
                            />

                            {/* Service Category Routes */}
                            <Route
                              path="/pulse/pulse-privilege/service-category"
                              element={<ServiceCategoryDashboard />}
                            />
                            <Route
                              path="/pulse/pulse-privilege/service-category/create"
                              element={<AddServiceCategoryPage />}
                            />
                            <Route
                              path="/pulse/pulse-privilege/service-category/edit/:id"
                              element={<EditServiceCategoryPage />}
                            />
                            <Route
                              path="/pulse/amenity"
                              element={<BookingList />}
                            />
                            <Route
                              path="/pulse/amenity/add"
                              element={<AddFacilityBookingPage />}
                            />
                            <Route
                              path="/pulse/amenity/:id"
                              element={<BookingDetailsPage />}
                            />
                            <Route
                              path="/pulse/amenity/edit/:id"
                              element={<EditFacilityBookingPage />}
                            />
                            {/* Plus curated Service Routes */}
                            <Route
                              path="/pulse/curated-services/service"
                              element={<CuratedServiceDashboard />}
                            />
                            <Route
                              path="/pulse/curated-services/service/create"
                              element={<AddCuratedServicePage />}
                            />
                            <Route
                              path="/pulse/curated-services/service/edit/:id"
                              element={<EditCuratedServicePage />}
                            />

                            {/* Plus Support Service Routes */}
                            <Route
                              path="/pulse/supported-services/service"
                              element={<SupportedServiceDashboard />}
                            />
                            <Route
                              path="/pulse/supported-services/service/create"
                              element={<SupportedServiceAdd />}
                            />
                            <Route
                              path="/pulse/supported-services/service/edit/:id"
                              element={<SupportedServiceEdit />}
                            />

                            {/*  curated Service  Category Routes */}
                            <Route
                              path="/pulse/curated-services/service-category"
                              element={<CuratedServiceCategoryDashboard />}
                            />
                            <Route
                              path="/pulse/curated-services/service-category/create"
                              element={<AddCuratedServiceCategoryPage />}
                            />
                            <Route
                              path="/pulse/curated-services/service-category/edit/:id"
                              element={<EditCuratedServiceCategoryPage />}
                            />

                            <Route
                              path="/pulse/ride_settings"
                              element={<RideSettingsPage />}
                            />

                            {/* Carpool Routes */}
                            <Route
                              path="/pulse/carpool"
                              element={<CarpoolDashboard />}
                            />

                            <Route
                              path="/pulse/carpool/ride-detail"
                              element={<RideDetail />}
                            />
                            <Route
                              path="/pulse/carpool/ride-reviews"
                              element={<RideReviews />}
                            />

                            <Route
                              path="/pulse/carpool/user-detail"
                              element={<UserDetail />}
                            />

                            <Route
                              path="/pulse/carpool/active-reports"
                              element={<ActiveReports />}
                            />

                            <Route
                              path="/pulse/carpool/active-sos"
                              element={<ActiveSOS />}
                            />

                            <Route
                              path="/pulse/carpool/tracking"
                              element={<RideTracking />}
                            />

                            <Route
                              path="/pulse/amenity/:id"
                              element={<AmenityDetailsPage />}
                            />

                            <Route
                              path="/pulse/sos-directory"
                              element={<SOSDirectory />}
                            />

                            <Route
                              path="/pulse/sos-directory/add"
                              element={<AddSosDirectory />}
                            />

                            <Route
                              path="/pulse/sos-directory/:id/edit"
                              element={<EditSosDirectory />}
                            />

                            <Route
                              path="/pulse/sos-directory/:id"
                              element={<SosDirectoryDetailsPage />}
                            />

                            <Route
                              path="/pulse/sos-category-setup"
                              element={<SOSCategorySetupPage />}
                            />
                            <Route
                              path="/pulse/support-contact-setup"
                              element={<SupportContactSetupPage />}
                            />
                            <Route
                              path="/pulse/support-contact-setup/add"
                              element={<AddSupportContactPage />}
                            />
                            <Route
                              path="/pulse/gre-site-assignment-setup"
                              element={<GreSiteAssignmentSetupPage />}
                            />
                            <Route
                              path="/pulse/gre-site-assignment-setup/add"
                              element={<AddGreSiteAssignmentPage />}
                            />
                            <Route
                              path="/pulse/gre-site-assignment-setup/edit/:id"
                              element={<AddGreSiteAssignmentPage />}
                            />
                          </Route>

                          <Route
                            path="/settings"
                            element={
                              <ProtectedRoute>
                                <Layout>
                                  <div />
                                </Layout>
                              </ProtectedRoute>
                            }
                          >
                            <Route
                              path="/settings/approval-matrix/setup"
                              element={<ApprovalMatrixSetupPage />}
                            />
                            <Route
                              path="/settings/approval-matrix/setup/add"
                              element={<AddApprovalMatrixPage />}
                            />
                            <Route
                              path="/settings/invoice-approvals/add"
                              element={<AddInvoiceApprovalsPage />}
                            />
                            <Route
                              path="/settings/invoice-approvals/edit/:id"
                              element={<EditInvoiceApprovalsPage />}
                            />
                            <Route
                              path="/settings/design-insights/setup"
                              element={<DesignInsightsSetupDashboard />}
                            />
                            <Route
                              path="/settings/checklist-setup/group"
                              element={<ChecklistGroupsPage />}
                            />
                            <Route
                              path="/settings/checklist-setup/email-rule"
                              element={<EmailRuleSetupPage />}
                            />
                            <Route
                              path="/settings/checklist-setup/task-escalation"
                              element={<TaskEscalationPage />}
                            />
                            <Route
                              path="/settings/ticket-management/setup"
                              element={<TicketManagementSetupPage />}
                            />
                            <Route
                              path="/settings/ticket-management/escalation-matrix"
                              element={<EscalationMatrixPage />}
                            />
                            <Route
                              path="/settings/ticket-management/cost-approval"
                              element={<CostApprovalPage />}
                            />
                            <Route
                              path="/settings/inventory-management/sac-hsn-code"
                              element={<SacHsn />}
                            />
                            <Route
                              path="/settings/inventory-management/sac-hsn-code/add"
                              element={<AddSacHsn />}
                            />
                            <Route
                              path="/settings/inventory-management/sac-hsn-code/:id"
                              element={<DetailPageSacHsn />}
                            />
                            <Route
                              path="/settings/safety/permit"
                              element={<div>Safety Permit</div>}
                            />
                            <Route
                              path="/settings/safety/permit-setup"
                              element={<PermitSetupDashboard />}
                            />
                            <Route
                              path="/settings/safety/incident"
                              element={<IncidentSetupDashboard />}
                            />
                            <Route
                              path="/settings/safety/setup"
                              element={<IncidentSetupDashboard />}
                            />
                            <Route
                              path="/settings/vas/fnb/setup"
                              element={<FnBRestaurantDashboard />}
                            />
                            <Route
                              path="/settings/vas/fnb/add"
                              element={<AddRestaurantPage />}
                            />
                            <Route
                              path="/settings/vas/fnb/details/:id"
                              element={<FnBRestaurantDetailsPage />}
                            />
                            <Route
                              path="/settings/vas/booking/setup"
                              element={<BookingSetupDashboard />}
                            />
                            <Route
                              path="/settings/vas/booking/category-setup"
                              element={<AmenityCategorySetup />}
                            />
                            <Route
                              path="/settings/vas/booking/accessories-setup"
                              element={<AccessoriesSetup />}
                            />
                            <Route
                              path="/settings/accessories/:id"
                              element={<AccessoriesDetailsPage />}
                            />
                            <Route
                              path="/settings/vas/booking/setup/add"
                              element={<AddBookingSetupPage />}
                            />
                            <Route
                              path="/settings/vas/booking/setup/details/:id"
                              element={<BookingSetupDetailPage />}
                            />
                            <Route
                              path="/settings/vas/booking/setup/edit/:id"
                              element={<EditBookingSetupPage />}
                            />
                            <Route
                              path="/settings/vas/parking-management/parking-category"
                              element={<ParkingCategoryPage />}
                            />
                            <Route
                              path="/settings/vas/parking-management/slot-configuration"
                              element={<SlotConfigurationPage />}
                            />
                            <Route
                              path="/settings/vas/parking-management/slot-configuration/add"
                              element={<AddSlotConfigurationPage />}
                            />
                            <Route
                              path="/settings/vas/parking-management/slot-configuration/edit/:id"
                              element={<EditSlotConfigurationPage />}
                            />
                            <Route
                              path="/settings/vas/parking-management/time-slot-setup"
                              element={<TimeSlotSetupPage />}
                            />
                            <Route
                              path="/settings/waste-management/setup"
                              element={<UtilityWasteGenerationSetupDashboard />}
                            />
                            <Route
                              path="/settings/account/role-config"
                              element={<RoleConfigList />}
                            />
                            <Route
                              path="/settings/account/role-config/view/:id"
                              element={<RoleConfigView />}
                            />
                            <Route
                              path="/settings/account/role-config/edit/:id"
                              element={<RoleConfigEdit />}
                            />
                            <Route
                              path="/settings/account/lock-module"
                              element={<LockModuleList />}
                            />
                            <Route
                              path="/settings/account/lock-function"
                              element={<LockFunctionList />}
                            />
                            <Route
                              path="/settings/account/lock-function/view/:id"
                              element={<LockFunctionView />}
                            />
                            <Route
                              path="/settings/account/lock-function/edit/:id"
                              element={<LockFunctionEdit />}
                            />
                            <Route
                              path="/settings/account/lock-sub-function"
                              element={<LockSubFunctionList />}
                            />
                            <Route
                              path="/settings/account/lock-sub-function/view/:id"
                              element={<LockSubFunctionView />}
                            />
                            <Route
                              path="/settings/account/lock-sub-function/edit/:id"
                              element={<LockSubFunctionEdit />}
                            />
                            <Route
                              path="/settings/community-modules/testimonial-setup"
                              element={<TestimonialsSetupDashboard />}
                            />
                            <Route
                              path="/settings/community-modules/testimonial-setup/:id"
                              element={<TestimonialDetailsPage />}
                            />
                            <Route
                              path="/settings/community-modules/company-partner-setup"
                              element={<CompanyPartnersSetupDashboard />}
                            />
                            <Route
                              path="/settings/community-modules/banner-setup"
                              element={<BannerListPage />}
                            />
                            <Route
                              path="/settings/community-modules/banner-setup/:id"
                              element={<BannerDetailsPage />}
                            />
                            <Route
                              path="/settings/community-modules/amenity-setup"
                              element={<AmenitySetupDashboard />}
                            />
                            <Route
                              path="/settings/community-modules/amenity-setup/:id"
                              element={<AmenityDetailsPage />}
                            />
                            <Route
                              path="/settings/groups"
                              element={<CRMGroupsPage />}
                            />
                          </Route>

                          {/* Setup Routes - Outside of settings parent route */}
                          <Route
                            path="/setup/permit"
                            element={
                              <ProtectedRoute>
                                <PermitSetupDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/setup/incident"
                            element={
                              <ProtectedRoute>
                                <IncidentSetupDashboard />
                              </ProtectedRoute>
                            }
                          />

                          {/* Setup User Management Routes */}
                          <Route
                            path="/setup/fm-users"
                            element={
                              <ProtectedRoute>
                                <FMUserDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/setup/fm-users/add"
                            element={
                              <ProtectedRoute>
                                <AddFMUserDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/setup/occupant-users"
                            element={
                              <ProtectedRoute>
                                <OccupantUsersDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/setup/occupant-users/add"
                            element={
                              <ProtectedRoute>
                                <AddOccupantUserDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/mobile/lmc" element={<MobileLMCPage />} />
                          <Route
                            path="/vi-business-card"
                            element={<ViBusinessCard />}
                          />

                          {/* Quick Links Routes */}
                          <Route
                            path="/business-plan"
                            element={<BusinessPlan />}
                          />
                          <Route path="/our-group" element={<OurGroup />} />
                          <Route path="/products" element={<Products />} />
                          <Route
                            path="/document-drive"
                            element={<DocumentDrive />}
                          />
                          <Route path="/hr-policies" element={<HRPolicies />} />
                          <Route path="/directory" element={<Directory />} />
                          <Route path="/employee-faq" element={<EmployeeFAQ />} />

                          {/* Mobile Routes */}
                          <Route
                            path="/mobile/tickets"
                            element={<MobileTicketsPage />}
                          />
                          <Route
                            path="/mobile/tickets/new"
                            element={<MobileNewTicketPage />}
                          />
                          <Route
                            path="/mobile/orders"
                            element={<MobileOrdersPage />}
                          />
                          <Route
                            path="/mobile/admin/orders"
                            element={<MobileAdminOrdersPage />}
                          />
                          <Route
                            path="/mobile/admin/orders/:orderId"
                            element={<MobileAdminOrderDetailsPage />}
                          />
                          {/* External Flow Tester */}
                          <Route
                            path="/test-external"
                            element={<ExternalFlowTester />}
                          />
                          {/* Mobile Restaurant Routes */}
                          <Route
                            path="/mr/:restaurant/:orgId"
                            element={<MobileRestaurantPage />}
                          />
                          <Route
                            path="/mobile/restaurant/:action"
                            element={<MobileRestaurantPage />}
                          />
                          <Route
                            path="/mobile/restaurant/:restaurantId/:action"
                            element={<MobileRestaurantPage />}
                          />
                          {/* Mobile Restaurant Routes */}
                          <Route
                            path="/mobile/restaurant"
                            element={<MobileRestaurantPage />}
                          />
                          <Route
                            path="/mobile/restaurant/:action"
                            element={<MobileRestaurantPage />}
                          />
                          <Route
                            path="/mobile/restaurant/:restaurantId/:action"
                            element={<MobileRestaurantPage />}
                          />
                          {/* Mobile Survey Routes */}
                          <Route
                            path="/mobile/survey/:mappingId"
                            element={<MobileSurveyPage />}
                          />
                          <Route
                            path="/mobile/survey/:mappingId/:action"
                            element={<MobileSurveyPage />}
                          />
                          <Route
                            path="/survey_mappings/:mappingId/survey"
                            element={<MobileSurveyPage />}
                          />
                          {/* Mobile Asset Routes */}
                          <Route
                            path="/mobile/assets"
                            element={<MobileAssetPage />}
                          />
                          <Route
                            path="/mobile/assets/:assetId"
                            element={<MobileAssetPage />}
                          />
                          <Route
                            path="/mobile/assets/:assetId/breakdown"
                            element={<MobileAssetPage />}
                          />
                          {/* Mobile Owner Cost Routes */}
                          <Route
                            path="/mobile/owner-cost/:assetId"
                            element={<MobileOwnerCostAssetPage />}
                          />
                          <Route
                            path="/mo/:assetId"
                            element={<MobileOwnerCostAssetPage />}
                          />
                          {/* Mobile Permit Safety Check Routes */}
                          <Route
                            path="/mobile/permit-safety-check/:permitId"
                            element={<PermitSafetyCheckForm />}
                          />
                          <Route
                            path="/ps/:permitId"
                            element={<PermitSafetyCheckForm />}
                          />
                          {/* QR Test Route */}
                          <Route path="/qr-test" element={<QRTestPage />} />

                          <Route
                            path="/mobile-projects"
                            element={<ProjectsMobileView />}
                          />
                          <Route
                            path="/mobile-issues"
                            element={<IssuesMobileView />}
                          />
                          <Route
                            path="/mobile-issues/add"
                            element={<AddIssueMobileView />}
                          />
                          <Route
                            path="/mobile-issues/:id"
                            element={<IssueDetailsMobile />}
                          />
                          <Route
                            path="/mobile-projects/:id/milestones"
                            element={<MilestoneMobileView />}
                          />
                          <Route
                            path="/mobile-projects/:id/milestones/:mid/tasks"
                            element={<ProjectTasksMobileView />}
                          />
                          <Route
                            path="/mobile-projects/:id"
                            element={<ProjectDetailsMobile />}
                          />
                          <Route
                            path="/mobile-projects/:id/milestones/:mid"
                            element={<MilestoneDetailsMobile />}
                          />
                          <Route
                            path="/mobile-projects/:id/milestones/:mid/tasks/:taskId"
                            element={<ProjectTaskDetailsMobile />}
                          />
                          <Route
                            path="/mobile-tasks"
                            element={<TasksMobileView />}
                          />
                          <Route
                            path="/mobile-tasks/:taskId"
                            element={<TaskDetailsMobile />}
                          />

                          {/* Mail Inbound Routes */}

                          <Route path="/contests" element={<ContestListPage />} />
                          <Route
                            path="/contests/create"
                            element={<CreateContestPage />}
                          />
                          <Route
                            path="/contests/:id"
                            element={<ContestDetailsPage />}
                          />
                          <Route
                            path="/contests/:id/edit"
                            element={<EditContestPage />}
                          />
                          {/* Contest & Promotion Routes */}
                          <Route
                            path="/contest-promotion"
                            element={<ContestPromotion />}
                          />
                          {/* Spinner Contest Routes */}
                          <Route
                            path="/spinnercontest"
                            element={<SpinnerContest />}
                          />
                          <Route
                            path="/spinnercontest/:contestId"
                            element={<SpinnerContest />}
                          />
                          {/* Scratch Card Routes */}
                          {/* <Route
                      path="/scratchcards"
                      element={<ScratchCardListing />}
                    /> */}
                          <Route path="/scratchcards" element={<ScratchCard />} />
                          <Route
                            path="/scratchcard/details/:rewardId"
                            element={<VoucherDetails />}
                          />
                          <Route
                            path="/scratchcard/:cardId/voucher"
                            element={<VoucherDetails />}
                          />
                          {/* Flip Card Routes */}
                          <Route path="/flipcard" element={<FlipCard />} />
                          <Route
                            path="/flipcard/:gameId"
                            element={<FlipCard />}
                          />
                          <Route
                            path="/flipcard/details/:rewardId"
                            element={<FlipCardDetails />}
                          />
                          <Route
                            path="/flipcard/:gameId/card/:cardId"
                            element={<FlipCardDetails />}
                          />
                          <Route path="/mobile/todos" element={<MobileTodo />} />

                          {/* Mobile Channels Route */}
                          <Route
                            path="/mobile/channels"
                            element={<MobileChannelsLayout />}
                          >
                            <Route index element={<MobileChannelLayout />} />
                            <Route
                              path="/mobile/channels/messages/:id"
                              element={<MobileDMConversation />}
                            />
                            <Route
                              path="/mobile/channels/groups/:id"
                              element={<MobileGroupConversation />}
                            />
                          </Route>
                        </Routes>
                      </Suspense>
                      <Toaster />
                      <SonnerToaster
                        position="top-right"
                        richColors
                        closeButton
                        toastOptions={{
                          duration: 4000,
                          style: {
                            background: "white",
                            border: "1px solid #e5e7eb",
                            color: "#374151",
                          },
                        }}
                      />{" "}
                    </WebSocketNotificationInitializer>
                  </ActionLayoutProvider>
                </SpeechProvider>
              </PermissionsProvider>
            </LayoutProvider>
          </EnhancedSelectProvider>
        </QueryClientProvider>
      </NotificationProvider>
      {/* </Router> */}
    </>
  );
}

export default App;
