
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { SetupLayout } from './components/SetupLayout';

// Import existing pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';

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
import { AMCDashboard } from './pages/AMCDashboard';
import { ServiceDashboard } from './pages/ServiceDashboard';
import { AddServicePage } from './pages/AddServicePage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { EditServicePage } from './pages/EditServicePage';
import { AttendanceDashboard } from './pages/AttendanceDashboard';
import { AttendanceDetailsPage } from './pages/AttendanceDetailsPage';

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
import { InActiveAssetsDashboard } from './pages/InActiveAssetsDashboard';
import { UtilityWaterDashboard } from './pages/UtilityWaterDashboard';
import { AddWaterAssetDashboard } from './pages/AddWaterAssetDashboard';
import UtilitySTPDashboard from './pages/UtilitySTPDashboard';
import AddSTPAssetDashboard from './pages/AddSTPAssetDashboard';

// Import Waste Generation pages
import UtilityWasteGenerationDashboard from './pages/UtilityWasteGenerationDashboard';
import UtilityWasteGenerationSetupDashboard from './pages/UtilityWasteGenerationSetupDashboard';

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
import ParkingDashboard from './pages/ParkingDashboard';
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
import { AddAMCPage } from './pages/AddAMCPage';
import { AMCDetailsPage } from './pages/AMCDetailsPage';
import { EditAMCPage } from './pages/EditAMCPage';

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
import { ServicePRDashboard } from './pages/ServicePRDashboard';
import { AddMaterialPRDashboard } from './pages/AddMaterialPRDashboard';
import { AddServicePRDashboard } from './pages/AddServicePRDashboard';
import { PODashboard } from './pages/PODashboard';
import { WODashboard } from './pages/WODashboard';
import { GRNDashboard } from './pages/GRNDashboard';
import { AutoSavedPRDashboard } from './pages/AutoSavedPRDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><div /></Layout>}>
              <Route index element={<Index />} />
              
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
              
              {/* Survey Routes */}
              <Route path="/maintenance/audit/survey/list" element={<SurveyListDashboard />} />
              <Route path="/maintenance/audit/survey/mapping" element={<SurveyMappingDashboard />} />
              <Route path="/maintenance/audit/survey/response" element={<SurveyResponseDashboard />} />
              
              {/* Finance Routes */}
              <Route path="/finance/material-pr" element={<MaterialPRDashboard />} />
              <Route path="/finance/material-pr/add" element={<AddMaterialPRDashboard />} />
              <Route path="/finance/service-pr" element={<ServicePRDashboard />} />
              <Route path="/finance/service-pr/add" element={<AddServicePRDashboard />} />
              <Route path="/finance/po" element={<PODashboard />} />
              <Route path="/finance/wo" element={<WODashboard />} />
              <Route path="/finance/grn-srn" element={<GRNDashboard />} />
              <Route path="/finance/auto-saved-pr" element={<AutoSavedPRDashboard />} />
              
              {/* Maintenance Routes */}
              <Route path="/maintenance/asset" element={<AssetDashboard />} />
              <Route path="/maintenance/asset/details/:id" element={<AssetDetailsPage />} />
              <Route path="/maintenance/asset/add" element={<AddAssetPage />} />
              <Route path="/maintenance/asset/inactive" element={<InActiveAssetsDashboard />} />
              <Route path="/maintenance/amc" element={<AMCDashboard />} />
              <Route path="/maintenance/amc/add" element={<AddAMCPage />} />
              <Route path="/maintenance/amc/details/:id" element={<AMCDetailsPage />} />
              <Route path="/maintenance/amc/edit/:id" element={<EditAMCPage />} />
              <Route path="/maintenance/service" element={<ServiceDashboard />} />
              <Route path="/maintenance/service/add" element={<AddServicePage />} />
              <Route path="/maintenance/service/details/:id" element={<ServiceDetailsPage />} />
              <Route path="/maintenance/service/edit/:id" element={<EditServicePage />} />
              <Route path="/maintenance/services" element={<ServiceDashboard />} />
              <Route path="/maintenance/attendance" element={<AttendanceDashboard />} />
              <Route path="/maintenance/attendance/details/:id" element={<AttendanceDetailsPage />} />
              
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
              
              {/* Inventory Routes */}
              <Route path="/maintenance/inventory" element={<InventoryDashboard />} />
              <Route path="/maintenance/inventory/details/:id" element={<InventoryDetailsPage />} />
              <Route path="/maintenance/inventory/feeds/:id" element={<InventoryFeedsPage />} />
              
              {/* Utility Routes */}
              <Route path="/utility/energy" element={<UtilityDashboard />} />
              <Route path="/utility/energy/add-asset" element={<AddEnergyAssetDashboard />} />
              <Route path="/utility/inactive-assets" element={<InActiveAssetsDashboard />} />
              <Route path="/utility/water" element={<UtilityWaterDashboard />} />
              <Route path="/utility/water/add-asset" element={<AddWaterAssetDashboard />} />
              <Route path="/utility/stp" element={<UtilitySTPDashboard />} />
              <Route path="/utility/stp/add-asset" element={<AddSTPAssetDashboard />} />
              <Route path="/utility/add-asset" element={<AddAssetDashboard />} />
              
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
              <Route path="/vas/parking" element={<ParkingDashboard />} />
              <Route path="/vas/parking/bookings" element={<ParkingBookingsDashboard />} />
              
              {/* Space Management Routes */}
              <Route path="/vas/space-management/bookings" element={<SpaceManagementBookingsDashboard />} />
              <Route path="/vas/space-management/bookings/details/:id" element={<SpaceManagementBookingDetailsPage />} />
              <Route path="/vas/space-management/seat-requests" element={<SpaceManagementSeatRequestsDashboard />} />
              <Route path="/space-management/bookings" element={<SpaceManagementBookingsDashboard />} />
              <Route path="/space-management/seat-requests" element={<SpaceManagementSeatRequestsDashboard />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Setup Routes */}
            <Route path="/setup" element={<SetupLayout><div /></SetupLayout>}>
              <Route path="/setup/location/account" element={<div>Location Account</div>} />
              <Route path="/setup/location/building" element={<div>Location Building</div>} />
              <Route path="/setup/location/wing" element={<div>Location Wing</div>} />
              <Route path="/setup/location/area" element={<div>Location Area</div>} />
              <Route path="/setup/location/floor" element={<div>Location Floor</div>} />
              <Route path="/setup/location/unit" element={<div>Location Unit</div>} />
              <Route path="/setup/location/room" element={<div>Location Room</div>} />
              <Route path="/setup/user-role/department" element={<div>User Role Department</div>} />
              <Route path="/setup/user-role/role" element={<div>User Role Role</div>} />
              <Route path="/setup/fm-user" element={<div>FM User</div>} />
              <Route path="/setup/occupant-users" element={<div>Occupant Users</div>} />
              <Route path="/setup/meter-type" element={<div>Meter Type</div>} />
              <Route path="/setup/asset-groups" element={<div>Asset Groups</div>} />
              <Route path="/setup/checklist-group" element={<div>Checklist Group</div>} />
              <Route path="/setup/ticket/setup" element={<div>Ticket Setup</div>} />
              <Route path="/setup/ticket/escalation" element={<div>Ticket Escalation</div>} />
              <Route path="/setup/ticket/cost-approval" element={<div>Ticket Cost Approval</div>} />
              <Route path="/setup/task-escalation" element={<div>Task Escalation</div>} />
              <Route path="/setup/approval-matrix" element={<div>Approval Matrix</div>} />
              <Route path="/setup/patrolling-approval" element={<div>Patrolling Approval</div>} />
              <Route path="/setup/email-rule" element={<div>Email Rule</div>} />
              <Route path="/setup/fm-group" element={<div>FM Group</div>} />
              <Route path="/setup/master-checklist" element={<div>Master Checklist</div>} />
              <Route path="/setup/sac-hsn-setup" element={<div>SAC/HSN Setup</div>} />
              <Route path="/setup/address" element={<div>Address</div>} />
              <Route path="/setup/tag" element={<div>Tag</div>} />
              <Route path="/setup/export" element={<ExportDashboard />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
