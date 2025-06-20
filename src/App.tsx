import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { LayoutProvider } from './contexts/LayoutContext';
import Layout from './components/Layout';
import SetupLayout from './components/SetupLayout';

// Import existing pages
import Index from './pages/Index';
import ParkingDashboard from './pages/ParkingDashboard';
import { ParkingDetailsPage } from './pages/ParkingDetailsPage';

// Import Snagging pages
import { SnaggingDashboard } from './pages/SnaggingDashboard';
import { SnaggingDetailsPage } from './pages/SnaggingDetailsPage';

// Import Ticket pages
import { TicketDashboard } from './pages/TicketDashboard';
import { AddTicketDashboard } from './pages/AddTicketDashboard';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { TicketFeedsPage } from './pages/TicketFeedsPage';
import { TicketTagVendorPage } from './pages/TicketTagVendorPage';

// Import Fitout pages
import { FitoutSetupDashboard } from './pages/FitoutSetupDashboard';
import { FitoutRequestListDashboard } from './pages/FitoutRequestListDashboard';
import { AddProjectDashboard } from './pages/AddProjectDashboard';
import { FitoutChecklistDashboard } from './pages/FitoutChecklistDashboard';
import { AddChecklistDashboard } from './pages/AddChecklistDashboard';
import { FitoutViolationDashboard } from './pages/FitoutViolationDashboard';

// Import Maintenance pages
import { AssetDashboard } from './pages/AssetDashboard';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import { AddAssetPage } from './pages/AddAssetPage';
import { InActiveAssetsDashboard } from './pages/InActiveAssetsDashboard';

// Import Incident pages
import { IncidentListDashboard } from './pages/IncidentListDashboard';
import { AddIncidentPage } from './pages/AddIncidentPage';
import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
import { EditIncidentDetailsPage } from './pages/EditIncidentDetailsPage';

// Import Inventory pages
import { InventoryDashboard } from './pages/InventoryDashboard';
import { InventoryDetailsPage } from './pages/InventoryDetailsPage';
import { InventoryFeedsPage } from './pages/InventoryFeedsPage';

// Import Task pages
import { TaskDashboard } from './pages/TaskDashboard';
import { TaskDetailsPage } from './pages/TaskDetailsPage';

// Import Utility pages
import { UtilityDashboard } from './pages/UtilityDashboard';
import { AddAssetDashboard } from './pages/AddAssetDashboard';
import { AddEnergyAssetDashboard } from './pages/AddEnergyAssetDashboard';
import { UtilityWaterDashboard } from './pages/UtilityWaterDashboard';
import { AddWaterAssetDashboard } from './pages/AddWaterAssetDashboard';
import UtilitySTPDashboard from './pages/UtilitySTPDashboard';
import AddSTPAssetDashboard from './pages/AddSTPAssetDashboard';

// Import Waste Generation pages
import UtilityWasteGenerationDashboard from './pages/UtilityWasteGenerationDashboard';
import UtilityWasteGenerationSetupDashboard from './pages/UtilityWasteGenerationSetupDashboard';
import AddWasteGenerationPage from './pages/AddWasteGenerationPage';

// Import Survey pages
import { SurveyListDashboard } from './pages/SurveyListDashboard';
import { SurveyMappingDashboard } from './pages/SurveyMappingDashboard';
import { SurveyResponseDashboard } from './pages/SurveyResponseDashboard';

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

// Import Staff pages
import { StaffsDashboard } from './pages/StaffsDashboard';

// Import Staff Details page
import { StaffDetailsPage } from './pages/StaffDetailsPage';

// Import Edit Staff page
import { EditStaffPage } from './pages/EditStaffPage';

// Import Value Added Services pages
import { FnBRestaurantDashboard } from './pages/FnBRestaurantDashboard';
import { FnBRestaurantDetailsPage } from './pages/FnBRestaurantDetailsPage';
import { ParkingBookingsDashboard } from './pages/ParkingBookingsDashboard';

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
import { EditServicePage } from './pages/EditServicePage';

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

// Import Master Checklist page
import { AddMasterChecklistPage } from './pages/AddMasterChecklistPage';

// Import RVehiclesInDashboard and RVehiclesOutDashboard
import { RVehiclesInDashboard } from './pages/RVehiclesInDashboard';
import { RVehiclesOutDashboard } from './pages/RVehiclesOutDashboard';

// Import Space Management booking details page
import { SpaceManagementBookingDetailsPage } from './pages/SpaceManagementBookingDetailsPage';

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
import { PendingApprovalsDashboard } from './pages/PendingApprovalsDashboard';

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

// Import Department Dashboard for Setup
import { DepartmentDashboard as SetupDepartmentDashboard } from './pages/setup/DepartmentDashboard';

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
import { NonFTEUsersDashboard } from './pages/NonFTEUsersDashboard';
import { KRCCFormListDashboard } from './pages/KRCCFormListDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Layout Routes */}
            <Route path="/*" element={<Layout />}>
              {/* Property Routes */}
              <Route path="property/parking" element={<ParkingDashboard />} />
              <Route path="property/parking/details/:clientId" element={<ParkingDetailsPage />} />
              
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
              <Route path="/maintenance/ticket/details/:id" element={<TicketDetailsPage />} />
              <Route path="/maintenance/ticket/:id/feeds" element={<TicketFeedsPage />} />
              <Route path="/maintenance/ticket/:id/tag-vendor" element={<TicketTagVendorPage />} />
              
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
              
              {/* Waste Generation Routes */}
              <Route path="/maintenance/audit/waste/generation" element={<UtilityWasteGenerationDashboard />} />
              <Route path="/maintenance/audit/waste/setup" element={<UtilityWasteGenerationSetupDashboard />} />
              <Route path="/maintenance/audit/waste/generation/add" element={<AddWasteGenerationPage />} />
              
              {/* Survey Routes */}
              <Route path="/maintenance/audit/survey/list" element={<SurveyListDashboard />} />
              <Route path="/maintenance/audit/survey/mapping" element={<SurveyMappingDashboard />} />
              <Route path="/maintenance/audit/survey/response" element={<SurveyResponseDashboard />} />
              
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
              <Route path="/finance/invoices" element={<InvoicesSESDashboard />} />
              <Route path="/finance/bill-booking" element={<BillBookingDashboard />} />
              <Route path="/finance/bill-booking/add" element={<AddNewBillDashboard />} />
              <Route path="/finance/pending-approvals" element={<PendingApprovalsDashboard />} />
              
              {/* Maintenance Routes */}
              <Route path="/maintenance/asset" element={<AssetDashboard />} />
              <Route path="/maintenance/asset/details/:id" element={<AssetDetailsPage />} />
              <Route path="/maintenance/asset/edit/:id" element={<EditAssetDetailsPage />} />
              <Route path="/maintenance/asset/add" element={<AddAssetPage />} />
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
              <Route path="/maintenance/inventory/feeds/:id" element={<InventoryFeedsPage />} />
              
              {/* Task Routes */}
              <Route path="/maintenance/task" element={<TaskDashboard />} />
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
              <Route path="/vas/fnb/details/:id" element={<FnBRestaurantDetailsPage />} />
              <Route path="/vas/parking" element={<ParkingDashboard />} />
              <Route path="/vas/parking/bookings" element={<ParkingBookingsDashboard />} />
              
              {/* Space Management Routes */}
              <Route path="/vas/space-management/bookings" element={<SpaceManagementBookingsDashboard />} />
              <Route path="/vas/space-management/bookings/details/:id" element={<SpaceManagementBookingDetailsPage />} />
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
              <Route path="/vas/space-management/setup/employees" element={<EmployeesDashboard />} />
              <Route path="/vas/space-management/setup/employees/add" element={<AddEmployeeDashboard />} />
              <Route path="/vas/space-management/setup/employees/edit/:id" element={<EditEmployeePage />} />
              <Route path="/vas/space-management/setup/employees/details/:id" element={<EmployeeDetailsPage />} />
              <Route path="/vas/space-management/setup/check-in-margin" element={<CheckInMarginDashboard />} />
              <Route path="/vas/space-management/setup/roster-calendar" element={<RosterCalendarDashboard />} />
              <Route path="/vas/space-management/setup/export" element={<ExportDashboard />} />
              
              {/* M Safe Routes */}
              <Route path="/maintenance/m-safe" element={<MSafeDashboard />} />
              <Route path="/maintenance/m-safe/non-fte-users" element={<NonFTEUsersDashboard />} />
              <Route path="/maintenance/m-safe/krcc-form-list" element={<KRCCFormListDashboard />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Setup Routes */}
            <Route path="/setup/*" element={<SetupLayout />}>
              {/* ... keep existing code (all setup routes) */}
            </Route>
          </Routes>
        </Router>
      </LayoutProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
