import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from '@/components/ui/sonner';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import existing pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Import Invoice Approvals page
import { InvoiceApprovalsPage } from './pages/InvoiceApprovalsPage';
import { AddInvoiceApprovalsPage } from './pages/settings/AddInvoiceApprovalsPage';

// Import Asset Groups page
import { AssetGroupsPage } from './pages/AssetGroupsPage';
import { AssetGroupsPageNew } from './pages/AssetGroupsPageNew';
import { ChecklistGroupsPage } from './pages/ChecklistGroupsPage';

// Import Snagging pages
import { SnaggingDashboard } from './pages/SnaggingDashboard';
import { SnaggingDetailsPage } from './pages/SnaggingDetailsPage';

// Import Ticket pages
import { TicketDashboard } from './pages/TicketDashboard';
import { AddTicketDashboard } from './pages/AddTicketDashboard';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { TicketFeedsPage } from './pages/TicketFeedsPage';
import { TicketTagVendorPage } from './pages/TicketTagVendorPage';
import AssignTicketsPage from './pages/AssignTicketsPage';
import UpdateTicketsPage from './pages/UpdateTicketsPage';

// Import Fitout pages
import { FitoutSetupDashboard } from './pages/FitoutSetupDashboard';
import { FitoutRequestListDashboard } from './pages/FitoutRequestListDashboard';
import { AddProjectDashboard } from './pages/AddProjectDashboard';
import { FitoutChecklistDashboard } from './pages/FitoutChecklistDashboard';
import { AddChecklistDashboard } from './pages/AddChecklistDashboard';
import { FitoutViolationDashboard } from './pages/FitoutViolationDashboard';
import { CostApprovalPage } from './pages/maintenance/CostApprovalPage';

// Import Maintenance pages
import { AssetDashboard } from './pages/AssetDashboard';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import AddAssetPage from './pages/AddAssetPage';
import { InActiveAssetsDashboard } from './pages/InActiveAssetsDashboard';
import { MoveAssetPage } from './pages/MoveAssetPage';
import { DisposeAssetPage } from './pages/DisposeAssetPage';

// Import Incident pages
import { IncidentListDashboard } from './pages/IncidentListDashboard';
import { AddIncidentPage } from './pages/AddIncidentPage';
import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
import { EditIncidentDetailsPage } from './pages/EditIncidentDetailsPage';

// Import Inventory pages
import { InventoryDashboard } from './pages/InventoryDashboard';
import { InventoryDetailsPage } from './pages/InventoryDetailsPage';
import { InventoryFeedsPage } from './pages/InventoryFeedsPage';
import { EditInventoryPage } from './pages/EditInventoryPage';
import InventoryConsumptionDashboard from './pages/InventoryConsumptionDashboard';
import InventoryConsumptionViewPage from './pages/InventoryConsumptionViewPage';
import EcoFriendlyListPage from './pages/EcoFriendlyListPage';

// Import Task pages
import { ScheduledTaskDashboard } from './pages/maintenance/ScheduledTaskDashboard';
import { TaskDetailsPage } from './pages/TaskDetailsPage';

// Import Utility pages
import { UtilityDashboard } from './pages/UtilityDashboard';
import { AddAssetDashboard } from './pages/AddAssetDashboard';
import { AddEnergyAssetDashboard } from './pages/AddEnergyAssetDashboard';
import { UtilityWaterDashboard } from './pages/UtilityWaterDashboard';
import { AddWaterAssetDashboard } from './pages/AddWaterAssetDashboard';
import UtilitySTPDashboard from './pages/UtilitySTPDashboard';
import AddSTPAssetDashboard from './pages/AddSTPAssetDashboard';
import UtilityEVConsumptionDashboard from './pages/UtilityEVConsumptionDashboard';
import UtilitySolarGeneratorDashboard from './pages/UtilitySolarGeneratorDashboard';

// Import Waste Generation pages
import UtilityWasteGenerationDashboard from './pages/UtilityWasteGenerationDashboard';
import { UtilityWasteGenerationSetupDashboard } from './pages/UtilityWasteGenerationSetupDashboard';
import AddWasteGenerationPage from './pages/AddWasteGenerationPage';

// Import Survey pages
import { SurveyListDashboard } from './pages/SurveyListDashboard';
import { AddSurveyPage } from './pages/AddSurveyPage';
import { EditSurveyPage } from './pages/EditSurveyPage';
import { SurveyDetailsPage } from './pages/SurveyDetailsPage';
import { SurveyMappingDashboard } from './pages/SurveyMappingDashboard';
import { SurveyResponseDashboard } from './pages/SurveyResponseDashboard';
import { SurveyResponsePage } from './pages/SurveyResponsePage';
import { SurveyResponseDetailPage } from './pages/SurveyResponseDetailPage';

// Import Schedule pages
import { ScheduleListDashboard } from './pages/ScheduleListDashboard';
import { AddSchedulePage } from './pages/AddSchedulePage';
import { ScheduleExportPage } from './pages/ScheduleExportPage';
import { EditSchedulePage } from './pages/EditSchedulePage';
import { CopySchedulePage } from './pages/CopySchedulePage';
import { ViewSchedulePage } from './pages/ViewSchedulePage';

// Import Visitors pages
import { VisitorsDashboard } from './pages/VisitorsDashboard';
import { VisitorsHistoryDashboard } from './pages/VisitorsHistoryDashboard';
import { PatrollingDashboard } from './pages/PatrollingDashboard';
import { PatrollingDetailsPage } from './pages/PatrollingDetailsPage';
import { VisitorFormPage } from './pages/VisitorFormPage';

// Import new dashboard pages
import { IncidentDashboard } from './pages/IncidentDashboard';
import { PermitToWorkDashboard } from './pages/PermitToWorkDashboard';
import { LeadDashboard } from './pages/LeadDashboard';
import { EnergyDashboard } from './pages/EnergyDashboard';

// Import Main Analytics Dashboard
import { Dashboard } from './pages/Dashboard';

// Import Staff pages
import { StaffsDashboard } from './pages/StaffsDashboard';

// Import Staff Details page
import { StaffDetailsPage } from './pages/StaffDetailsPage';

// Import Edit Staff page
import { EditStaffPage } from './pages/EditStaffPage';

// Import Value Added Services pages
import { FnBRestaurantDashboard } from './pages/FnBRestaurantDashboard';
import { FnBRestaurantDetailsPage } from './pages/FnBRestaurantDetailsPage';
import { ProductSetupDetailPage } from './pages/ProductSetupDetailPage';
import { ProductEditPage } from './pages/ProductEditPage';
import { RestaurantOrderDetailPage } from './pages/RestaurantOrderDetailPage';
import { FnBDiscountsPage } from './pages/FnBDiscountsPage';
import { AddRestaurantPage } from './pages/AddRestaurantPage';
import ParkingDashboard from './pages/ParkingDashboard';
import ParkingDetailsPage from './pages/ParkingDetailsPage';
import ParkingBookingsDashboard from './pages/ParkingBookingsDashboard';

// Import Design Insights pages
import { DesignInsightsDashboard } from './pages/DesignInsightsDashboard';
import { AddDesignInsightDashboard } from './pages/AddDesignInsightDashboard';
import { DesignInsightDetailsDashboard } from './pages/DesignInsightDetailsDashboard';
import { EditDesignInsightDashboard } from './pages/EditDesignInsightDashboard';

// Import Security pages  
import { VehicleParkingDashboard } from './pages/VehicleParkingDashboard';
import { RVehiclesDashboard } from './pages/RVehiclesDashboard';
import { RVehiclesHistoryDashboard } from './pages/RVehiclesHistoryDashboard';

// Import GVehiclesDashboard
import { GVehiclesDashboard } from './pages/GVehiclesDashboard';

// Import GVehicleOutDashboard
import { GVehicleOutDashboard } from './pages/GVehicleOutDashboard';

// Import Gate Pass pages
import { GatePassDashboard } from './pages/GatePassDashboard';
import { GatePassInwardsDashboard } from './pages/GatePassInwardsDashboard';
import { GatePassOutwardsDashboard } from './pages/GatePassOutwardsDashboard';

// Import Space Management pages
import { SpaceManagementBookingsDashboard } from './pages/SpaceManagementBookingsDashboard';
import { SpaceManagementSeatRequestsDashboard } from './pages/SpaceManagementSeatRequestsDashboard';

// Import Seat Setup pages
import { SeatSetupDashboard } from './pages/setup/SeatSetupDashboard';
import { AddSeatSetupDashboard } from './pages/setup/AddSeatSetupDashboard';
import { EditSeatSetupDashboard } from './pages/setup/EditSeatSetupDashboard';
import { SeatTypeDashboard } from './pages/SeatTypeDashboard';

// Import Shift page
import { ShiftDashboard } from './pages/setup/ShiftDashboard';

// Import Setup User pages
import { FMUserDashboard } from './pages/setup/FMUserDashboard';
import { AddFMUserDashboard } from './pages/setup/AddFMUserDashboard';
import { OccupantUsersDashboard } from './pages/setup/OccupantUsersDashboard';
import { AddOccupantUserDashboard } from './pages/setup/AddOccupantUserDashboard';

// Import User Roasters pages
import { UserRoastersDashboard } from './pages/setup/UserRoastersDashboard';
import { CreateRosterTemplateDashboard } from './pages/setup/CreateRosterTemplateDashboard';

// Import Employee pages
import { EmployeesDashboard } from './pages/setup/EmployeesDashboard';
import { AddEmployeeDashboard } from './pages/setup/AddEmployeeDashboard';
import { EditEmployeePage } from './pages/setup/EditEmployeePage';

// Import Check In Margin page
import { CheckInMarginDashboard } from './pages/setup/CheckInMarginDashboard';

// Import AMC pages
import { AMCDashboard } from './pages/AMCDashboard';
import { AddAMCPage } from './pages/AddAMCPage';
import { AMCDetailsPage } from './pages/AMCDetailsPage';
import { EditAMCPage } from './pages/EditAMCPage';

// Import Service pages
import { ServiceDashboard } from './pages/ServiceDashboard';
import { AddServicePage } from './pages/AddServicePage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import EditServicePage from './pages/EditServicePage';

// Import Attendance pages
import { AttendanceDashboard } from './pages/AttendanceDashboard';
import { AttendanceDetailsPage } from './pages/AttendanceDetailsPage';

// Import Roster Calendar page
import { RosterCalendarDashboard } from './pages/setup/RosterCalendarDashboard';

// Import Export page
import { ExportDashboard } from './pages/setup/ExportDashboard';

// Import Employee Details page
import { EmployeeDetailsPage } from './pages/setup/EmployeeDetailsPage';

// Import Permit pages
import { PermitListDashboard } from './pages/PermitListDashboard';
import { AddPermitPage } from './pages/AddPermitPage';

// Import Operational Audit pages
import { OperationalAuditScheduledDashboard } from './pages/OperationalAuditScheduledDashboard';
import { AddOperationalAuditSchedulePage } from './pages/AddOperationalAuditSchedulePage';
import { OperationalAuditConductedDashboard } from './pages/OperationalAuditConductedDashboard';
import { OperationalAuditMasterChecklistsDashboard } from './pages/OperationalAuditMasterChecklistsDashboard';

// Import Vendor Audit pages
import { VendorAuditScheduledDashboard } from './pages/VendorAuditScheduledDashboard';
import { VendorAuditConductedDashboard } from './pages/VendorAuditConductedDashboard';
import { AddVendorAuditSchedulePage } from './pages/AddVendorAuditSchedulePage';
import { AddVendorAuditPage } from './pages/AddVendorAuditPage';
import { ViewVendorAuditPage } from './pages/ViewVendorAuditPage';

// Import Asset Audit pages
import { AssetAuditDashboard } from './pages/AssetAuditDashboard';
import { AddAssetAuditPage } from './pages/AddAssetAuditPage';
import { EditAssetAuditPage } from './pages/EditAssetAuditPage';
import { AssetAuditDetailsPage } from './pages/AssetAuditDetailsPage';

// Import Master Checklist page
import { AddMasterChecklistPage } from './pages/AddMasterChecklistPage';

// Import Checklist Master pages
import { ChecklistMasterDashboard } from './pages/ChecklistMasterDashboard';
import { AddChecklistMasterPage } from './pages/AddChecklistMasterPage';
import { ChecklistListPage } from './pages/ChecklistListPage';
import { ChecklistMasterPage } from './pages/ChecklistMasterPage';

// Import Master User pages
import { FMUserMasterDashboard } from './pages/master/FMUserMasterDashboard';
import { OccupantUserMasterDashboard } from './pages/master/OccupantUserMasterDashboard';
import { AddFMUserPage } from './pages/master/AddFMUserPage';
import { EditFMUserPage } from './pages/master/EditFMUserPage';
import { ViewFMUserPage } from './pages/master/ViewFMUserPage';

// Import Material Master page
import { MaterialMasterPage } from './pages/MaterialMasterPage';

// Import RVehiclesInDashboard and RVehiclesOutDashboard
import { RVehiclesInDashboard } from './pages/RVehiclesInDashboard';
import { RVehiclesOutDashboard } from './pages/RVehiclesOutDashboard';

// Import Finance pages
import { MaterialPRDashboard } from './pages/MaterialPRDashboard';
import { MaterialPRDetailsPage } from './pages/MaterialPRDetailsPage';
import { CloneMaterialPRPage } from './pages/CloneMaterialPRPage';
import { MaterialPRFeedsPage } from './pages/MaterialPRFeedsPage';
import { ServicePRDashboard } from './pages/ServicePRDashboard';
import { AddMaterialPRDashboard } from './pages/AddMaterialPRDashboard';
import { AddServicePRDashboard } from './pages/AddServicePRDashboard';
import { EditServicePRPage } from './pages/EditServicePRPage';
import { ServicePRDetailsPage } from './pages/ServicePRDetailsPage';
import { CloneServicePRPage } from './pages/CloneServicePRPage';
import { ServicePRFeedsPage } from './pages/ServicePRFeedsPage';
import { PODashboard } from './pages/PODashboard';
import { AddPODashboard } from './pages/AddPODashboard';
import { PODetailsPage } from './pages/PODetailsPage';
import { POFeedsPage } from './pages/POFeedsPage';
import { WODashboard } from './pages/WODashboard';
import { AutoSavedPRDashboard } from './pages/AutoSavedPRDashboard';
import { GRNSRNDashboard } from './pages/GRNSRNDashboard';
import { AddGRNDashboard } from './pages/AddGRNDashboard';
import { GRNDetailsPage } from './pages/GRNDetailsPage';
import { GRNFeedsPage } from './pages/GRNFeedsPage';
import { InvoicesDashboard } from './pages/InvoicesDashboard';
import { InvoicesSESDashboard } from './pages/InvoicesSESDashboard';
import { BillBookingDashboard } from './pages/BillBookingDashboard';
import { AddBillPage } from './pages/AddBillPage';
import { PendingApprovalsDashboard } from './pages/PendingApprovalsDashboard';
import InvoiceDashboard from './pages/InvoiceDashboard';

// Import WBS page
import { WBSElementDashboard } from './pages/WBSElementDashboard';

// Import Settings pages
import { FMUsersDashboard } from './pages/settings/FMUsersDashboard';
import { CloneRolePage } from './pages/settings/CloneRolePage';
import { AccountDashboard } from './pages/settings/AccountDashboard';

// Import Approval Matrix pages
import { ApprovalMatrixDashboard } from './pages/settings/ApprovalMatrixDashboard';
import { AddApprovalMatrixDashboard } from './pages/settings/AddApprovalMatrixDashboard';
import { EditApprovalMatrixDashboard } from './pages/settings/EditApprovalMatrixDashboard';

// Import Department Dashboard for Settings
import { DepartmentDashboard } from './pages/settings/DepartmentDashboard';

// Import Role Dashboard for Settings
import { RoleDashboard } from './pages/settings/RoleDashboard';
import { AddRolePage } from './pages/settings/AddRolePage';

// Import AddNewBillDashboard
import { AddNewBillDashboard } from './pages/AddNewBillDashboard';

// Import Edit FM User Details page
import { EditFMUserDetailsPage } from './pages/settings/EditFMUserDetailsPage';

// Import Energy Asset Routes
import { EnergyAssetDetailsPage } from './pages/EnergyAssetDetailsPage';
import { EditEnergyAssetPage } from './pages/EditEnergyAssetPage';

// Import Water Asset Details Route
import { WaterAssetDetailsPage } from './pages/WaterAssetDetailsPage';

// Import Edit Material PR page
import { EditMaterialPRDashboard } from './pages/EditMaterialPRDashboard';
import { GRNDashboard } from './pages/GRNDashboard';

// Import Edit GRN page
import { EditGRNDashboard } from './pages/EditGRNDashboard';
import { AddInventoryPage } from './pages/AddInventoryPage';
import { EditAssetDetailsPage } from './pages/EditAssetDetailsPage';

// Import M Safe pages
import { MSafeDashboard } from './pages/MSafeDashboard';
import { MSafeUserDetail } from './pages/MSafeUserDetail';
import { NonFTEUsersDashboard } from './pages/NonFTEUsersDashboard';
import { KRCCFormListDashboard } from './pages/KRCCFormListDashboard';

// Import Edit Roster Template page
import { EditRosterTemplatePage } from './pages/setup/EditRosterTemplatePage';

// Import Accounting Dashboard
import { AccountingDashboard } from './pages/AccountingDashboard';

// Import Loyalty Rule Engine Dashboard
import { LoyaltyRuleEngineDashboard } from './pages/LoyaltyRuleEngineDashboard';

// Import OSR pages
import { OSRDashboard } from './pages/OSRDashboard';
import { OSRDetailsPage } from './pages/OSRDetailsPage';

// Import OSR Generate Receipt page
import { OSRGenerateReceiptPage } from './pages/OSRGenerateReceiptPage';

// Import Market Place Accounting pages
import { MarketPlaceAccountingPage } from './pages/MarketPlaceAccountingPage';
import { MarketPlaceAccountingDetailsPage } from './pages/MarketPlaceAccountingDetailsPage';
import { MarketPlaceAccountingEditPage } from './pages/MarketPlaceAccountingEditPage';

// Import Market Place Cost Center page
import { MarketPlaceCostCenterPage } from './pages/MarketPlaceCostCenterPage';

// Import CRM Campaign pages
import { CRMCampaignPage } from './pages/CRMCampaignPage';
import { AddLeadPage } from './pages/AddLeadPage';
import { LeadDetailsPage } from './pages/LeadDetailsPage';
import { CRMEventsPage } from './pages/CRMEventsPage';
import { CRMEventDetailsPage } from './pages/CRMEventDetailsPage';
import { AddEventPage } from './pages/AddEventPage';

// Import CRM Groups page
import CRMGroupsPage from './pages/CRMGroupsPage';
import CRMGroupDetailsPage from './pages/CRMGroupDetailsPage';

// Import Broadcast page
import { BroadcastDashboard } from './pages/BroadcastDashboard';
import { AddBroadcastPage } from './pages/AddBroadcastPage';
import { BroadcastDetailsPage } from './pages/BroadcastDetailsPage';

// Import Redemption Marketplace page
import { RedemptionMarketplacePage } from './pages/RedemptionMarketplacePage';
import { HotelRewardsPage } from './pages/HotelRewardsPage';
import { TicketDiscountsPage } from './pages/TicketDiscountsPage';

// Import Hotel Details page
import { HotelDetailsPage } from './pages/HotelDetailsPage';

// Import Hotel Booking page
import { HotelBookingPage } from './pages/HotelBookingPage';

// Import CRM Polls page
import CRMPollsPage from './pages/CRMPollsPage';
import AddPollPage from './pages/AddPollPage';

// Import Market Place All page
import MarketPlaceAllPage from './pages/MarketPlaceAllPage';

// Import Market Place Installed page
import { MarketPlaceInstalledPage } from './pages/MarketPlaceInstalledPage';

// Import Market Place Updates page
import { MarketPlaceUpdatesPage } from './pages/MarketPlaceUpdatesPage';

// Import Lease Management Detail page
import LeaseManagementDetailPage from './pages/LeaseManagementDetailPage';

// Import Loyalty Rule Engine Detail page
import LoyaltyRuleEngineDetailPage from './pages/LoyaltyRuleEngineDetailPage';

// Import Cloud Telephony Detail page
import CloudTelephonyDetailPage from './pages/CloudTelephonyDetailPage';

// Import Accounting Detail page
import AccountingDetailPage from './pages/AccountingDetailPage';

// Import Rule List page
import { RuleListPage } from './pages/RuleListPage';
import { TrainingListDashboard } from './pages/TrainingListDashboard';
import { AddTrainingRecordDashboard } from './pages/AddTrainingRecordDashboard';
import { TrainingRecordDetailsPage } from './pages/TrainingRecordDetailsPage';

// Import Edit Checklist Master page
import { EditChecklistMasterPage } from './pages/EditChecklistMasterPage';

// Import View Checklist Master page
import { ViewChecklistMasterPage } from './pages/ViewChecklistMasterPage';

// Import Unit Master page
import { UnitMasterPage } from './pages/UnitMasterPage';

// Import Location Master pages
import { BuildingPage } from './pages/master/BuildingPage';
import { WingPage } from './pages/master/WingPage';
import { AreaPage } from './pages/master/AreaPage';
import { FloorPage } from './pages/master/FloorPage';
import { UnitPage } from './pages/master/UnitPage';
import { RoomPage } from './pages/master/RoomPage';
import { LocationAccountPage } from './pages/master/LocationAccountPage';

// Import Address Master page
import { AddressMasterPage } from './pages/AddressMasterPage';

// Import new master pages
import { UnitMasterByDefaultPage } from './pages/UnitMasterByDefaultPage';

// Import Add Address page
import { AddAddressPage } from './pages/AddAddressPage';

// Import Edit Address page
import { EditAddressPage } from './pages/EditAddressPage';

// Import ChecklistGroupDashboard for setup and settings
import { ChecklistGroupDashboard } from './pages/setup/ChecklistGroupDashboard';

// Import Booking List page
import BookingListDashboard from './pages/BookingListDashboard';

// Import Booking Setup Dashboard
import { BookingSetupDashboard } from './pages/BookingSetupDashboard';
import { BookingSetupDetailPage } from './pages/BookingSetupDetailPage';
import { AddBookingSetupPage } from './pages/AddBookingSetupPage';

// Import Add Facility Booking page
import { AddFacilityBookingPage } from './pages/AddFacilityBookingPage';
import { AssetGroupsDashboard } from './pages/setup/AssetGroupsDashboard';

import ApprovalMatrixSetupPage from './pages/settings/ApprovalMatrixSetupPage';
import AddApprovalMatrixPage from './pages/settings/AddApprovalMatrixPage';

import { EmailRuleSetupPage } from './pages/maintenance/EmailRuleSetupPage';
import { TaskEscalationPage } from './pages/maintenance/TaskEscalationPage';
import { TicketManagementSetupPage } from './pages/maintenance/TicketManagementSetupPage';
import { MobileTicketsPage } from './pages/mobile/MobileTicketsPage';
import { MobileRestaurantPage } from './pages/mobile/MobileRestaurantPage';
import { MobileAssetPage } from './pages/mobile/MobileAssetPage';
import { MobileOrdersPage } from './components/mobile/MobileOrdersPage';
import { QRTestPage } from './pages/QRTestPage';

import { EscalationMatrixPage } from './pages/maintenance/EscalationMatrixPage';

// Import Setup pages
import { PermitSetupDashboard } from './pages/PermitSetupDashboard';
import { IncidentSetupDashboard } from './pages/IncidentSetupDashboard';

import { SpaceManagementBookingDetailsPage } from '@/pages/SpaceManagementBookingDetailsPage';
import { LoginPage } from '@/pages/LoginPage';
import { OTPVerificationPage } from '@/pages/OTPVerificationPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ForgotPasswordOTPPage } from '@/pages/ForgotPasswordOTPPage';
import { NewPasswordPage } from '@/pages/NewPasswordPage';
import { LoginSuccessPage } from '@/pages/LoginSuccessPage';
import { PasswordResetSuccessPage } from '@/pages/PasswordResetSuccessPage';
import { isAuthenticated } from '@/utils/auth';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <Router>
        <QueryClientProvider client={queryClient}>
          <LayoutProvider>
            <Routes>
              {/* Login Route */}

                <Route 
              path="/login" 
              element={
                isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />
              } 
            />
            <Route path="/otp-verification" element={<OTPVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/forgot-password-otp" element={<ForgotPasswordOTPPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
            <Route path="/login-success" element={<LoginSuccessPage />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />

              <Route path="/" element={<ProtectedRoute><Layout><div /></Layout></ProtectedRoute>}>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Rule Engine Routes */}
                <Route path="/rule-engine/rule-list" element={<RuleListPage />} />
                <Route path="/loyalty-rule-engine" element={<LoyaltyRuleEngineDashboard />} />

                {/* Settings Routes */}
                <Route path="/settings/users" element={<FMUsersDashboard />} />
                <Route path="/settings/users/edit-details/:id" element={<EditFMUserDetailsPage />} />
                <Route path="/settings/users/clone-role" element={<CloneRolePage />} />
                <Route path="/settings/account" element={<AccountDashboard />} />
                <Route path="/settings/approval-matrix" element={<ApprovalMatrixDashboard />} />
                <Route path="/settings/approval-matrix/add" element={<AddApprovalMatrixDashboard />} />
                <Route path="/settings/approval-matrix/edit/:id" element={<EditApprovalMatrixDashboard />} />
                <Route path="/settings/roles/department" element={<DepartmentDashboard />} />
                <Route path="/settings/roles/role" element={<RoleDashboard />} />
                <Route path="/settings/roles/role/add" element={<AddRolePage />} />

                {/* Settings Asset Setup Routes */}
                <Route path="/settings/asset-setup/approval-matrix" element={<InvoiceApprovalsPage />} />
                <Route path="/settings/asset-setup/asset-groups" element={<AssetGroupsPageNew />} />

                {/* Settings Checklist Setup Routes */}
                <Route path="/settings/checklist-setup/groups" element={<ChecklistGroupsPage />} />

                {/* Settings Masters Routes */}
                <Route path="/settings/masters/checklist" element={<ChecklistMasterDashboard />} />
                <Route path="/settings/masters/checklist-master" element={<ChecklistMasterDashboard />} />
                <Route path="/settings/masters/checklist-master/add" element={<AddChecklistMasterPage />} />
                <Route path="/settings/masters/checklist-master/edit/:id" element={<EditChecklistMasterPage />} />
                <Route path="/settings/masters/checklist-master/view/:id" element={<ViewChecklistMasterPage />} />
                <Route path="/settings/masters/unit" element={<UnitMasterPage />} />
                <Route path="/settings/masters/address" element={<AddressMasterPage />} />
                <Route path="/settings/masters/address/add" element={<AddAddressPage />} />
                <Route path="/settings/masters/address/edit" element={<EditAddressPage />} />

                {/* Master Routes */}
                <Route path="/master/checklist" element={<ChecklistListPage />} />
                <Route path="/master/checklist/create" element={<ChecklistMasterPage />} />
                <Route path="/master/checklist/edit/:id" element={<ChecklistMasterPage />} />
                <Route path="/master/address" element={<AddressMasterPage />} />
                <Route path="/master/unit-default" element={<UnitMasterByDefaultPage />} />

                {/* CRM Routes */}
                <Route path="/crm/campaign" element={<CRMCampaignPage />} />
                <Route path="/crm/campaign/add" element={<AddLeadPage />} />
                <Route path="/crm/campaign/details/:id" element={<LeadDetailsPage />} />
                <Route path="/crm/events" element={<CRMEventsPage />} />
                <Route path="/crm/events/add" element={<AddEventPage />} />
                <Route path="/crm/events/details/:id" element={<CRMEventDetailsPage />} />
                <Route path="/crm/broadcast" element={<BroadcastDashboard />} />
                <Route path="/crm/broadcast/add" element={<AddBroadcastPage />} />
                <Route path="/crm/broadcast/details/:id" element={<BroadcastDetailsPage />} />
                <Route path="/crm/polls" element={<CRMPollsPage />} />
                <Route path="/crm/polls/add" element={<AddPollPage />} />
                <Route path="/crm/groups" element={<CRMGroupsPage />} />
                <Route path="/crm/groups/details/:id" element={<CRMGroupDetailsPage />} />

                {/* Snagging Routes */}
                <Route path="/transitioning/snagging" element={<SnaggingDashboard />} />
                <Route path="/transitioning/snagging/details/:id" element={<SnaggingDetailsPage />} />

                {/* Design Insights Routes */}
                <Route path="/transitioning/design-insight" element={<DesignInsightsDashboard />} />
                <Route path="/transitioning/design-insight/add" element={<AddDesignInsightDashboard />} />
                <Route path="/transitioning/design-insight/details/:id" element={<DesignInsightDetailsDashboard />} />
                <Route path="/transitioning/design-insight/edit/:id" element={<EditDesignInsightDashboard />} />

                {/* Fitout Routes */}
                <Route path="/transitioning/fitout/setup" element={<FitoutSetupDashboard />} />
                <Route path="/transitioning/fitout/request" element={<FitoutRequestListDashboard />} />
                <Route path="/transitioning/fitout/add-project" element={<AddProjectDashboard />} />
                <Route path="/transitioning/fitout/checklist" element={<FitoutChecklistDashboard />} />
                <Route path="/transitioning/fitout/checklist/add" element={<AddChecklistDashboard />} />
                <Route path="/transitioning/fitout/violation" element={<FitoutViolationDashboard />} />

                {/* Ticket Routes */}
                <Route path="/maintenance/ticket" element={<TicketDashboard />} />
                <Route path="/maintenance/ticket/add" element={<AddTicketDashboard />} />
                <Route path="/maintenance/ticket/assign" element={<AssignTicketsPage />} />
                <Route path="/maintenance/ticket/update/:id" element={<UpdateTicketsPage />} />
                <Route path="/maintenance/ticket/details/:id" element={<TicketDetailsPage />} />
                <Route path="/maintenance/ticket/:id/feeds" element={<TicketFeedsPage />} />
                <Route path="/maintenance/ticket/:id/tag-vendor" element={<TicketTagVendorPage />} />

                {/* Task Routes */}
                <Route path="/maintenance/task" element={<ScheduledTaskDashboard />} />
                <Route path="/maintenance/task/details/:id" element={<TaskDetailsPage />} />

                {/* Safety Routes */}
                <Route path="/safety/incident" element={<IncidentDashboard />} />
                <Route path="/safety/incident/add" element={<AddIncidentPage />} />
                <Route path="/safety/incident/:id" element={<IncidentDetailsPage />} />
                <Route path="/safety/incident/edit/:id" element={<EditIncidentDetailsPage />} />
                <Route path="/safety/permit" element={<PermitToWorkDashboard />} />
                <Route path="/safety/permit/add" element={<AddPermitPage />} />
                <Route path="/safety/m-safe" element={<MSafeDashboard />} />
                <Route path="/safety/training-list" element={<TrainingListDashboard />} />

                {/* CRM Routes */}
                <Route path="/crm/lead" element={<LeadDashboard />} />

                {/* Utility Routes */}
                <Route path="/utility/energy" element={<EnergyDashboard />} />

                {/* Security Routes */}
                <Route path="/security/visitor" element={<VisitorsDashboard />} />
                <Route path="/safety/m-safe/non-fte-users" element={<NonFTEUsersDashboard />} />
                <Route path="/safety/m-safe/krcc-form-list" element={<KRCCFormListDashboard />} />
                <Route path="/safety/training-list" element={<TrainingListDashboard />} />
                <Route path="/safety/training-list/add" element={<AddTrainingRecordDashboard />} />
                <Route path="/safety/training-list/:id" element={<TrainingRecordDetailsPage />} />
                <Route path="/safety/training-list/edit/:id" element={<AddTrainingRecordDashboard />} />

                {/* Incident Routes */}
                <Route path="/maintenance/incident" element={<IncidentListDashboard />} />
                <Route path="/maintenance/incident/add" element={<AddIncidentPage />} />
                <Route path="/maintenance/incident/:id" element={<IncidentDetailsPage />} />
                <Route path="/maintenance/incident/edit/:id" element={<EditIncidentDetailsPage />} />

                {/* Permit Routes */}
                <Route path="/maintenance/permit" element={<PermitListDashboard />} />
                <Route path="/maintenance/permit/add" element={<AddPermitPage />} />

                {/* Operational Audit Routes */}
                <Route path="/maintenance/audit/operational/scheduled" element={<OperationalAuditScheduledDashboard />} />
                <Route path="/maintenance/audit/operational/scheduled/add" element={<AddOperationalAuditSchedulePage />} />
                <Route path="/maintenance/audit/operational/conducted" element={<OperationalAuditConductedDashboard />} />
                <Route path="/maintenance/audit/operational/master-checklists" element={<OperationalAuditMasterChecklistsDashboard />} />
                <Route path="/maintenance/audit/operational/master-checklists/add" element={<AddMasterChecklistPage />} />

                {/* Vendor Audit Routes */}
                <Route path="/maintenance/audit/vendor/scheduled" element={<VendorAuditScheduledDashboard />} />
                <Route path="/maintenance/audit/vendor/scheduled/add" element={<AddVendorAuditPage />} />
                <Route path="/maintenance/audit/vendor/scheduled/copy" element={<AddVendorAuditSchedulePage />} />
                <Route path="/maintenance/audit/vendor/scheduled/view/:id" element={<ViewVendorAuditPage />} />
                <Route path="/maintenance/audit/vendor/conducted" element={<VendorAuditConductedDashboard />} />

                {/* Asset Audit Routes */}
                <Route path="/maintenance/audit/assets" element={<AssetAuditDashboard />} />
                <Route path="/maintenance/audit/assets/add" element={<AddAssetAuditPage />} />
                <Route path="/maintenance/audit/assets/edit/:id" element={<EditAssetAuditPage />} />
                <Route path="/maintenance/audit/assets/details/:id" element={<AssetAuditDetailsPage />} />

                {/* Waste Generation Routes */}
                <Route path="/maintenance/waste/generation" element={<UtilityWasteGenerationDashboard />} />
                <Route path="/maintenance/waste/setup" element={<UtilityWasteGenerationSetupDashboard />} />
                <Route path="/maintenance/waste/generation/add" element={<AddWasteGenerationPage />} />

                {/* Survey Routes */}
                <Route path="/maintenance/survey/list" element={<SurveyListDashboard />} />
                <Route path="/maintenance/survey/add" element={<AddSurveyPage />} />
                <Route path="/maintenance/survey/edit/:id" element={<EditSurveyPage />} />
                <Route path="/maintenance/survey/details/:id" element={<SurveyDetailsPage />} />
                <Route path="/maintenance/survey/mapping" element={<SurveyMappingDashboard />} />
                <Route path="/maintenance/survey/response" element={<SurveyResponsePage />} />
                <Route path="/maintenance/survey/response/details/:surveyId" element={<SurveyResponseDetailPage />} />
                <Route path="/maintenance/survey/response/dashboard" element={<SurveyResponseDashboard />} />

                {/* Finance Routes */}
                <Route path="/finance/material-pr" element={<MaterialPRDashboard />} />
                <Route path="/finance/material-pr/add" element={<AddMaterialPRDashboard />} />
                <Route path="/finance/material-pr/edit/:id" element={<EditMaterialPRDashboard />} />
                <Route path="/finance/material-pr/details/:id" element={<MaterialPRDetailsPage />} />
                <Route path="/finance/material-pr/clone/:id" element={<CloneMaterialPRPage />} />
                <Route path="/finance/material-pr/feeds/:id" element={<MaterialPRFeedsPage />} />
                <Route path="/finance/service-pr" element={<ServicePRDashboard />} />
                <Route path="/finance/service-pr/add" element={<AddServicePRDashboard />} />
                <Route path="/finance/service-pr/edit/:id" element={<EditServicePRPage />} />
                <Route path="/finance/service-pr/details/:id" element={<ServicePRDetailsPage />} />
                <Route path="/finance/service-pr/clone/:id" element={<CloneServicePRPage />} />
                <Route path="/finance/service-pr/feeds/:id" element={<ServicePRFeedsPage />} />
                <Route path="/finance/po" element={<PODashboard />} />
                <Route path="/finance/po/add" element={<AddPODashboard />} />
                <Route path="/finance/po/details/:id" element={<PODetailsPage />} />
                <Route path="/finance/po/feeds/:id" element={<POFeedsPage />} />
                <Route path="/finance/wo" element={<WODashboard />} />
                <Route path="/finance/auto-saved-pr" element={<AutoSavedPRDashboard />} />
                <Route path="/finance/grn-srn" element={<GRNSRNDashboard />} />
                <Route path="/finance/grn-srn/add" element={<AddGRNDashboard />} />
                <Route path="/finance/grn-srn/edit/:id" element={<EditGRNDashboard />} />
                <Route path="/finance/grn-srn/details/:id" element={<GRNDetailsPage />} />
                <Route path="/finance/grn-srn/feeds/:id" element={<GRNFeedsPage />} />
                <Route path="/finance/invoices" element={<InvoicesDashboard />} />
                <Route path="/finance/bill-booking" element={<BillBookingDashboard />} />
                <Route path="/finance/bill-booking/add" element={<AddBillPage />} />
                <Route path="/finance/pending-approvals" element={<PendingApprovalsDashboard />} />
                <Route path="/finance/invoice" element={<InvoiceDashboard />} />
                <Route path="/finance/wbs" element={<WBSElementDashboard />} />

                {/* Maintenance Routes */}
                <Route path="/maintenance/asset" element={<AssetDashboard />} />
                <Route path="/maintenance/asset/details/:id" element={<AssetDetailsPage />} />
                <Route path="/maintenance/asset/edit/:id" element={<EditAssetDetailsPage />} />
                <Route path="/maintenance/asset/add" element={<AddAssetPage />} />
                <Route path="/maintenance/asset/move" element={<MoveAssetPage />} />
                <Route path="/maintenance/asset/dispose" element={<DisposeAssetPage />} />
                <Route path="/maintenance/asset/inactive" element={<InActiveAssetsDashboard />} />

                {/* AMC Routes */}
                <Route path="/maintenance/amc" element={<AMCDashboard />} />
                <Route path="/maintenance/amc/add" element={<AddAMCPage />} />
                <Route path="/maintenance/amc/details/:id" element={<AMCDetailsPage />} />
                <Route path="/maintenance/amc/edit/:id" element={<EditAMCPage />} />

                {/* Service Routes */}
                <Route path="/maintenance/service" element={<ServiceDashboard />} />
                <Route path="/maintenance/services" element={<ServiceDashboard />} />
                <Route path="/maintenance/service/add" element={<AddServicePage />} />
                <Route path="/maintenance/service/details/:id" element={<ServiceDetailsPage />} />
                <Route path="/maintenance/service/edit/:id" element={<EditServicePage />} />

                {/* Attendance Routes */}
                <Route path="/maintenance/attendance" element={<AttendanceDashboard />} />
                <Route path="/maintenance/attendance/details/:id" element={<AttendanceDetailsPage />} />
                {/* Inventory Routes */}
                <Route path="/maintenance/inventory" element={<InventoryDashboard />} />
                <Route path="/maintenance/inventory/add" element={<AddInventoryPage />} />
                <Route path="/maintenance/inventory/details/:id" element={<InventoryDetailsPage />} />
                <Route path="/maintenance/inventory/edit/:id" element={<EditInventoryPage />} />
                <Route path="/maintenance/inventory/feeds/:id" element={<InventoryFeedsPage />} />
                <Route path="/maintenance/inventory-consumption" element={<InventoryConsumptionDashboard />} />
                <Route path="/maintenance/inventory-consumption/view/:id" element={<InventoryConsumptionViewPage />} />
                <Route path="/maintenance/eco-friendly-list" element={<EcoFriendlyListPage />} />

                {/* Inventory Routes */}
                <Route path="/maintenance/inventory" element={<InventoryDashboard />} />
                <Route path="/maintenance/inventory/add" element={<AddInventoryPage />} />
                <Route path="/maintenance/inventory/details/:id" element={<InventoryDetailsPage />} />
                <Route path="/maintenance/inventory/edit/:id" element={<EditInventoryPage />} />
                <Route path="/maintenance/inventory/feeds/:id" element={<InventoryFeedsPage />} />

                {/* Task Routes */}
                <Route path="/maintenance/task" element={<ScheduledTaskDashboard />} />
                <Route path="/maintenance/task/details/:id" element={<TaskDetailsPage />} />

                {/* Schedule Routes */}
                <Route path="/maintenance/schedule" element={<ScheduleListDashboard />} />
                <Route path="/maintenance/schedule/add" element={<AddSchedulePage />} />
                <Route path="/maintenance/schedule/export" element={<ScheduleExportPage />} />
                <Route path="/maintenance/schedule/edit/:id" element={<EditSchedulePage />} />
                <Route path="/maintenance/schedule/copy/:id" element={<CopySchedulePage />} />
                <Route path="/maintenance/schedule/view/:id" element={<ViewSchedulePage />} />

                {/* Utility Routes */}
                <Route path="/utility/energy" element={<UtilityDashboard />} />
                <Route path="/utility/energy/add-asset" element={<AddEnergyAssetDashboard />} />
                <Route path="/utility/inactive-assets" element={<InActiveAssetsDashboard />} />
                <Route path="/utility/water" element={<UtilityWaterDashboard />} />
                <Route path="/utility/water/add-asset" element={<AddWaterAssetDashboard />} />
                <Route path="/utility/stp" element={<UtilitySTPDashboard />} />
                <Route path="/utility/stp/add-asset" element={<AddSTPAssetDashboard />} />
                <Route path="/utility/ev-consumption" element={<UtilityEVConsumptionDashboard />} />
                <Route path="/utility/solar-generator" element={<UtilitySolarGeneratorDashboard />} />
                <Route path="/utility/add-asset" element={<AddAssetDashboard />} />

                {/* Energy Asset Routes */}
                <Route path="/utility/energy/details/:id" element={<EnergyAssetDetailsPage />} />
                <Route path="/utility/energy/edit/:id" element={<EditEnergyAssetPage />} />

                {/* Water Asset Details Route */}
                <Route path="/utility/water/details/:id" element={<WaterAssetDetailsPage />} />

                {/* Security/Visitors Routes */}
                <Route path="/security/gate-pass" element={<GatePassDashboard />} />
                <Route path="/security/gate-pass/inwards" element={<GatePassInwardsDashboard />} />
                <Route path="/security/gate-pass/outwards" element={<GatePassOutwardsDashboard />} />
                <Route path="/security/visitor" element={<VisitorsDashboard />} />
                <Route path="/visitor-form" element={<VisitorFormPage />} />
                <Route path="/security/visitor/history" element={<VisitorsHistoryDashboard />} />
                <Route path="/security/staff" element={<StaffsDashboard />} />
                <Route path="/security/staff/details/:id" element={<StaffDetailsPage />} />
                <Route path="/security/staff/edit/:id" element={<EditStaffPage />} />
                <Route path="/security/patrolling" element={<PatrollingDashboard />} />
                <Route path="/security/patrolling/details/:id" element={<PatrollingDetailsPage />} />

                {/* Security Vehicle Routes */}
                <Route path="/security/vehicle/r-vehicles" element={<RVehiclesDashboard />} />
                <Route path="/security/vehicle/r-vehicles/history" element={<RVehiclesHistoryDashboard />} />
                <Route path="/security/vehicle/g-vehicles" element={<GVehiclesDashboard />} />

                <Route path="/security/vehicle/r-vehicles/in" element={<RVehiclesInDashboard />} />
                <Route path="/security/vehicle/r-vehicles/out" element={<RVehiclesOutDashboard />} />
                {/* Value Added Services Routes */}
                <Route path="/vas/fnb" element={<FnBRestaurantDashboard />} />
                <Route path="/vas/fnb/add" element={<AddRestaurantPage />} />
                <Route path="/vas/fnb/details/:id" element={<FnBRestaurantDetailsPage />} />
                <Route path="/vas/fnb/details/:id/restaurant-menu/:mid" element={<ProductSetupDetailPage />} />
                <Route path="/vas/fnb/restaurant-menu/edit/:id" element={<ProductEditPage />} />
                <Route path="/vas/fnb/details/:id/restaurant-order/:oid" element={<RestaurantOrderDetailPage />} />
                <Route path="/vas/fnb/discounts" element={<FnBDiscountsPage />} />
                <Route path="/vas/parking" element={<ParkingDashboard />} />
                <Route path="/vas/parking/details/:clientId" element={<ParkingDetailsPage />} />
                <Route path="/vas/parking/bookings" element={<ParkingBookingsDashboard />} />
                <Route path="/vas/osr" element={<OSRDashboard />} />
                <Route path="/vas/osr/details/:id" element={<OSRDetailsPage />} />
                <Route path="/vas/osr/generate-receipt" element={<OSRGenerateReceiptPage />} />
                <Route path="/vas/redemption-marketplace" element={<RedemptionMarketplacePage />} />
                <Route path="/vas/hotels/rewards" element={<HotelRewardsPage />} />
                <Route path="/vas/hotels/details" element={<HotelDetailsPage />} />
                <Route path="/vas/hotels/booking" element={<HotelBookingPage />} />
                <Route path="/vas/tickets/discounts" element={<TicketDiscountsPage />} />

                {/* Value Added Services Routes */}
                <Route path="/vas/fnb" element={<FnBRestaurantDashboard />} />
                <Route path="/vas/fnb/add" element={<AddRestaurantPage />} />
                <Route path="/vas/fnb/details/:id" element={<FnBRestaurantDetailsPage />} />
                <Route path="/vas/fnb/discounts" element={<FnBDiscountsPage />} />
                <Route path="/vas/parking" element={<ParkingDashboard />} />
                <Route path="/vas/parking/details/:clientId" element={<ParkingDetailsPage />} />
                <Route path="/vas/parking/bookings" element={<ParkingBookingsDashboard />} />
                <Route path="/vas/osr" element={<OSRDashboard />} />
                <Route path="/vas/osr/details/:id" element={<OSRDetailsPage />} />
                <Route path="/vas/osr/generate-receipt" element={<OSRGenerateReceiptPage />} />
                <Route path="/vas/redemption-marketplace" element={<RedemptionMarketplacePage />} />
                <Route path="/vas/hotels/rewards" element={<HotelRewardsPage />} />
                <Route path="/vas/hotels/details" element={<HotelDetailsPage />} />
                <Route path="/vas/hotels/booking" element={<HotelBookingPage />} />
                <Route path="/vas/tickets/discounts" element={<TicketDiscountsPage />} />

                {/* Handle the typo in the URL */}
                <Route path="/vas/redemonection-marketplace" element={<Navigate to="/vas/redemption-marketplace" replace />} />

                {/* Space Management Routes */}
                <Route path="/vas/space-management/bookings" element={<SpaceManagementBookingsDashboard />} />
                <Route path="/vas/space-management/seat-requests" element={<SpaceManagementSeatRequestsDashboard />} />
                <Route path="/space-management/bookings" element={<SpaceManagementBookingsDashboard />} />
                <Route path="/space-management/seat-requests" element={<SpaceManagementSeatRequestsDashboard />} />

                {/* VAS Space Management Setup Routes - moved inside main layout */}
                <Route path="/vas/space-management/setup/seat-type" element={<SeatTypeDashboard />} />
                <Route path="/vas/space-management/setup/seat-setup" element={<SeatSetupDashboard />} />
                <Route path="/vas/space-management/setup/seat-setup/add" element={<AddSeatSetupDashboard />} />
                <Route path="/vas/space-management/setup/seat-setup/edit/:id" element={<EditSeatSetupDashboard />} />
                <Route path="/vas/space-management/setup/shift" element={<ShiftDashboard />} />
                <Route path="/vas/space-management/setup/roster" element={<UserRoastersDashboard />} />
                <Route path="/vas/space-management/setup/roster/create" element={<CreateRosterTemplateDashboard />} />
                <Route path="/vas/space-management/setup/roster/edit/:id" element={<EditRosterTemplatePage />} />
                <Route path="/vas/space-management/setup/employees" element={<EmployeesDashboard />} />
                <Route path="/vas/space-management/setup/employees/add" element={<AddEmployeeDashboard />} />
                <Route path="/vas/space-management/setup/employees/edit/:id" element={<EditEmployeePage />} />
                <Route path="/vas/space-management/setup/employees/details/:id" element={<EmployeeDetailsPage />} />
                <Route path="/vas/space-management/setup/check-in-margin" element={<CheckInMarginDashboard />} />
                <Route path="/vas/space-management/setup/roster-calendar" element={<RosterCalendarDashboard />} />
                <Route path="/vas/space-management/setup/export" element={<ExportDashboard />} />

                {/* M Safe Routes */}
                <Route path="/maintenance/m-safe" element={<MSafeDashboard />} />
                <Route path="/maintenance/m-safe/user/:userId" element={<MSafeUserDetail />} />
                <Route path="/maintenance/m-safe/non-fte-users" element={<NonFTEUsersDashboard />} />
                <Route path="/maintenance/m-safe/krcc-form-list" element={<KRCCFormListDashboard />} />

                {/* Market Place Routes */}
                <Route path="/market-place/all" element={<MarketPlaceAllPage />} />
                <Route path="/market-place/installed" element={<MarketPlaceInstalledPage />} />
                <Route path="/market-place/updates" element={<MarketPlaceUpdatesPage />} />
                <Route path="/market-place/lease-management" element={<LeaseManagementDetailPage />} />
                <Route path="/market-place/loyalty-rule-engine" element={<LoyaltyRuleEngineDetailPage />} />
                <Route path="/market-place/cloud-telephony" element={<CloudTelephonyDetailPage />} />
                <Route path="/market-place/accounting" element={<AccountingDetailPage />} />

                {/* VAS Booking Routes */}
                <Route path="/vas/booking/list" element={<BookingListDashboard />} />
                <Route path="/vas/booking/add" element={<AddFacilityBookingPage />} />
                <Route path="/vas/bookings/details/:id" element={<SpaceManagementBookingDetailsPage />} />
                <Route path="/vas/booking/setup" element={<BookingSetupDashboard />} />
                <Route path="/vas/booking/setup/details/:id" element={<BookingSetupDetailPage />} />

               {/* Master Location Routes */}
               <Route path="/master/location/building" element={<BuildingPage />} />
               <Route path="/master/location/wing" element={<WingPage />} />
               <Route path="/master/location/area" element={<AreaPage />} />
               <Route path="/master/location/floor" element={<FloorPage />} />
               <Route path="/master/location/unit" element={<UnitPage />} />
               <Route path="/master/location/room" element={<RoomPage />} />
               <Route path="/master/location/account" element={<LocationAccountPage />} />

                {/* Master User Routes */}
                <Route path="/master/user/fm-users" element={<FMUserMasterDashboard />} />
                <Route path="/master/user/fm-users/add" element={<AddFMUserPage />} />
                 <Route path="/master/user/fm-users/edit/:id" element={<EditFMUserPage />} />
                 <Route path="/master/user/fm-users/view/:id" element={<ViewFMUserPage />} />
                <Route path="/master/user/occupant-users" element={<OccupantUserMasterDashboard />} />

                {/* Material Master Route */}
                <Route path="/master/material-ebom" element={<MaterialMasterPage />} />

                <Route path="/maintenance/waste/generation/add" element={<AddWasteGenerationPage />} />
                <Route path="maintenance/task" element={<ScheduledTaskDashboard />} />
                <Route path="task-details/:id" element={<TaskDetailsPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Settings Routes */}

              <Route path="/settings" element={<ProtectedRoute><Layout><div /></Layout></ProtectedRoute>}>

                <Route path="/settings/approval-matrix/setup" element={<ApprovalMatrixSetupPage />} />
                <Route path="/settings/approval-matrix/setup/add" element={<AddApprovalMatrixPage />} />
                <Route path="/settings/invoice-approvals/add" element={<AddInvoiceApprovalsPage />} />

                <Route path="/settings/checklist-setup/group" element={<ChecklistGroupsPage />} />
                <Route path="/settings/checklist-setup/email-rule" element={<EmailRuleSetupPage />} />
                <Route path="/settings/checklist-setup/task-escalation" element={<TaskEscalationPage />} />
                <Route path="/settings/ticket-management/setup" element={<TicketManagementSetupPage />} />
                <Route path="/settings/ticket-management/escalation-matrix" element={<EscalationMatrixPage />} />
                <Route path="/settings/ticket-management/cost-approval" element={<CostApprovalPage />} />
                <Route path="/settings/inventory-management/sac-hsn-code" element={<div>SAC/HSN Code</div>} />
                <Route path="/settings/safety/permit" element={<div>Safety Permit</div>} />
                <Route path="/settings/safety/permit-setup" element={<PermitSetupDashboard />} />
                <Route path="/settings/safety/incident" element={<IncidentSetupDashboard />} />
                <Route path="/settings/safety/setup" element={<IncidentSetupDashboard />} />
                <Route path="/settings/vas/booking/setup" element={<BookingSetupDashboard />} />
                <Route path="/settings/vas/booking/setup/add" element={<AddBookingSetupPage />} />
                <Route path="/settings/waste-management/setup" element={<UtilityWasteGenerationSetupDashboard />} />
              </Route>

              {/* Setup Routes - Outside of settings parent route */}
              <Route path="/setup/permit" element={<ProtectedRoute><PermitSetupDashboard /></ProtectedRoute>} />
              <Route path="/setup/incident" element={<ProtectedRoute><IncidentSetupDashboard /></ProtectedRoute>} />

              {/* Setup User Management Routes */}
              <Route path="/setup/fm-users" element={<ProtectedRoute><FMUserDashboard /></ProtectedRoute>} />
              <Route path="/setup/fm-users/add" element={<ProtectedRoute><AddFMUserDashboard /></ProtectedRoute>} />
              <Route path="/setup/occupant-users" element={<ProtectedRoute><OccupantUsersDashboard /></ProtectedRoute>} />
              <Route path="/setup/occupant-users/add" element={<ProtectedRoute><AddOccupantUserDashboard /></ProtectedRoute>} />

                
                {/* Mobile Routes */}
                <Route path="/mobile/tickets" element={<MobileTicketsPage />} />
                <Route path="/mobile/orders" element={<MobileOrdersPage />} />
                {/* Mobile Restaurant Routes */}
                <Route path="/mobile/restaurant" element={<MobileRestaurantPage />} />
                <Route path="/mobile/restaurant/:action" element={<MobileRestaurantPage />} />
                <Route path="/mobile/restaurant/:restaurantId/:action" element={<MobileRestaurantPage />} />
                {/* Mobile Asset Routes */}
                <Route path="/mobile/assets" element={<MobileAssetPage />} />
                <Route path="/mobile/assets/:assetId" element={<MobileAssetPage />} />
                {/* QR Test Route */}
                <Route path="/qr-test" element={<QRTestPage />} />
              </Routes>
            <Toaster />
          </LayoutProvider>
        </QueryClientProvider>
      </Router>
    </Provider>
  );
}

export default App;