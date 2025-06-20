import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutProvider } from './contexts/LayoutContext';
import { Toaster } from "@/components/ui/sonner";
import { Index } from './pages/Index';
import { NotFound } from './pages/NotFound';
import { UsersDashboard } from './pages/UsersDashboard';
import { GeneralSettingsDashboard } from './pages/GeneralSettingsDashboard';
import { AccountSettingsDashboard } from './pages/AccountSettingsDashboard';
import { RolesDashboard } from './pages/RolesDashboard';
import { DepartmentDashboard } from './pages/DepartmentDashboard';
import { ApprovalMatrixDashboard } from './pages/ApprovalMatrixDashboard';
import { Module1Dashboard } from './pages/Module1Dashboard';
import { Function1Dashboard } from './pages/Function1Dashboard';
import { Function2Dashboard } from './pages/Function2Dashboard';
import { Module2Dashboard } from './pages/Module2Dashboard';
import { ChecklistMasterDashboard } from './pages/ChecklistMasterDashboard';
import { UnitMasterDashboard } from './pages/UnitMasterDashboard';
import { AddressMasterDashboard } from './pages/AddressMasterDashboard';
import { TransitioningHotODashboard } from './pages/TransitioningHotODashboard';
import { SnaggingDashboard } from './pages/SnaggingDashboard';
import { SnaggingDetails } from './pages/SnaggingDetails';
import { DesignInsightDashboard } from './pages/DesignInsightDashboard';
import { FitoutDashboard } from './pages/FitoutDashboard';
import { FitoutSetupDashboard } from './pages/FitoutSetupDashboard';
import { FitoutRequestDashboard } from './pages/FitoutRequestDashboard';
import { FitoutChecklistDashboard } from './pages/FitoutChecklistDashboard';
import { FitoutViolationDashboard } from './pages/FitoutViolationDashboard';
import { AssetsDashboard } from './pages/AssetsDashboard';
import { AMC_Dashboard } from './pages/AMC_Dashboard';
import { ServicesDashboard } from './pages/ServicesDashboard';
import { AttendanceDashboard } from './pages/AttendanceDashboard';
import { InventoryDashboard } from './pages/InventoryDashboard';
import { TicketDashboard } from './pages/TicketDashboard';
import { TaskDashboard } from './pages/TaskDashboard';
import { ScheduleDashboard } from './pages/ScheduleDashboard';
import { SafetyDashboard } from './pages/SafetyDashboard';
import { IncidentDashboard } from './pages/IncidentDashboard';
import { PermitDashboard } from './pages/PermitDashboard';
import { MSafeDashboard } from './pages/MSafeDashboard';
import { AuditDashboard } from './pages/AuditDashboard';
import { OperationalDashboard } from './pages/OperationalDashboard';
import { ScheduledDashboard } from './pages/ScheduledDashboard';
import { ConductedDashboard } from './pages/ConductedDashboard';
import { MasterChecklistsDashboard } from './pages/MasterChecklistsDashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { AssetsAuditDashboard } from './pages/AssetsAuditDashboard';
import { WasteDashboard } from './pages/WasteDashboard';
import { WasteGenerationDashboard } from './pages/WasteGenerationDashboard';
import { WasteSetupDashboard } from './pages/WasteSetupDashboard';
import { SurveyDashboard } from './pages/SurveyDashboard';
import { SurveyListDashboard } from './pages/SurveyListDashboard';
import { MappingDashboard } from './pages/MappingDashboard';
import { ResponseDashboard } from './pages/ResponseDashboard';
import { ProcurementDashboard } from './pages/ProcurementDashboard';
import { MaterialPRDashboard } from './pages/MaterialPRDashboard';
import { ServicePRDashboard } from './pages/ServicePRDashboard';
import { PODashboard } from './pages/PODashboard';
import { WODashboard } from './pages/WODashboard';
import { GRN_SRNDashboard } from './pages/GRN_SRNDashboard';
import { AutoSavedPRDashboard } from './pages/AutoSavedPRDashboard';
import { InvoicesDashboard } from './pages/InvoicesDashboard';
import { BillBookingDashboard } from './pages/BillBookingDashboard';
import { AccountingDashboard } from './pages/AccountingDashboard';
import { CostCenterDashboard } from './pages/CostCenterDashboard';
import { BudgetingDashboard } from './pages/BudgetingDashboard';
import { PendingApprovalsDashboard } from './pages/PendingApprovalsDashboard';
import { LeaseManagementDashboard } from './pages/LeaseManagementDashboard';
import { CloudTelephonyDashboard } from './pages/CloudTelephonyDashboard';
import { LeadDashboard } from './pages/LeadDashboard';
import { OpportunityDashboard } from './pages/OpportunityDashboard';
import { CRMDashboard } from './pages/CRMDashboard';
import { EnergyDashboard } from './pages/EnergyDashboard';
import { WaterDashboard } from './pages/WaterDashboard';
import { STPDashboard } from './pages/STPDashboard';
import { GatePassDashboard } from './pages/GatePassDashboard';
import { InwardsDashboard } from './pages/InwardsDashboard';
import { OutwardsDashboard } from './pages/OutwardsDashboard';
import { VisitorDashboard } from './pages/VisitorDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { VehicleDashboard } from './pages/VehicleDashboard';
import { RVehicleDashboard } from './pages/RVehicleDashboard';
import { RVehicleHistoryDashboard } from './pages/RVehicleHistoryDashboard';
import { GVehicleDashboard } from './pages/GVehicleDashboard';
import { PatrollingDashboard } from './pages/PatrollingDashboard';
import { FnBRestaurantDashboard } from './pages/FnBRestaurantDashboard';
import { ParkingDashboard } from './pages/ParkingDashboard';
import { ParkingBookingsDashboard } from './pages/ParkingBookingsDashboard';
import { MyParkingDashboard } from './pages/MyParkingDashboard';
import { SpaceManagementBookingsDashboard } from './pages/SpaceManagementBookingsDashboard';
import { SpaceManagementBookingDetailsPage } from './pages/SpaceManagementBookingDetailsPage';
import { SpaceManagementSeatRequestsDashboard } from './pages/SpaceManagementSeatRequestsDashboard';
import { SeatTypeDashboard } from './pages/SeatTypeDashboard';
import { SeatSetupDashboard } from './pages/SeatSetupDashboard';
import { AddSeatSetupDashboard } from './pages/AddSeatSetupDashboard';
import { EditSeatSetupDashboard } from './pages/EditSeatSetupDashboard';
import { ShiftDashboard } from './pages/ShiftDashboard';
import { UserRoastersDashboard } from './pages/UserRoastersDashboard';
import { CreateRosterTemplateDashboard } from './pages/CreateRosterTemplateDashboard';
import { EmployeesDashboard } from './pages/EmployeesDashboard';
import { AddEmployeeDashboard } from './pages/AddEmployeeDashboard';
import { EditEmployeePage } from './pages/EditEmployeePage';
import { EmployeeDetailsPage } from './pages/EmployeeDetailsPage';
import { CheckInMarginDashboard } from './pages/CheckInMarginDashboard';
import { RosterCalendarDashboard } from './pages/RosterCalendarDashboard';
import { ExportDashboard } from './pages/ExportDashboard';
import { RestaurantDetailsPage } from './pages/RestaurantDetailsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Settings Routes */}
              <Route path="/settings/general" element={<GeneralSettingsDashboard />} />
              <Route path="/settings/account" element={<AccountSettingsDashboard />} />
              <Route path="/settings/users" element={<UsersDashboard />} />
              <Route path="/settings/roles" element={<RolesDashboard />} />
              <Route path="/settings/roles/department" element={<DepartmentDashboard />} />
              <Route path="/settings/roles/role" element={<RolesDashboard />} />
              <Route path="/settings/approval-matrix" element={<ApprovalMatrixDashboard />} />
              <Route path="/settings/module1" element={<Module1Dashboard />} />
              <Route path="/settings/module1/function1" element={<Function1Dashboard />} />
              <Route path="/settings/module1/function2" element={<Function2Dashboard />} />
              <Route path="/settings/module2" element={<Module2Dashboard />} />
              <Route path="/settings/masters/checklist" element={<ChecklistMasterDashboard />} />
              <Route path="/settings/masters/unit" element={<UnitMasterDashboard />} />
              <Route path="/settings/masters/address" element={<AddressMasterDashboard />} />

              {/* Transitioning Routes */}
              <Route path="/transitioning/hoto" element={<TransitioningHotODashboard />} />
              <Route path="/transitioning/snagging" element={<SnaggingDashboard />} />
              <Route path="/transitioning/snagging/details/:id" element={<SnaggingDetails />} />
              <Route path="/transitioning/design-insight" element={<DesignInsightDashboard />} />
              <Route path="/transitioning/fitout" element={<FitoutDashboard />} />
              <Route path="/transitioning/fitout/setup" element={<FitoutSetupDashboard />} />
              <Route path="/transitioning/fitout/request" element={<FitoutRequestDashboard />} />
              <Route path="/transitioning/fitout/checklist" element={<FitoutChecklistDashboard />} />
              <Route path="/transitioning/fitout/violation" element={<FitoutViolationDashboard />} />

              {/* Maintenance Routes */}
              <Route path="/maintenance/asset" element={<AssetsDashboard />} />
              <Route path="/maintenance/amc" element={<AMC_Dashboard />} />
              <Route path="/maintenance/services" element={<ServicesDashboard />} />
              <Route path="/maintenance/attendance" element={<AttendanceDashboard />} />
              <Route path="/maintenance/inventory" element={<InventoryDashboard />} />
              <Route path="/maintenance/ticket" element={<TicketDashboard />} />
              <Route path="/maintenance/task" element={<TaskDashboard />} />
              <Route path="/maintenance/schedule" element={<ScheduleDashboard />} />
              <Route path="/maintenance/safety" element={<SafetyDashboard />} />
              <Route path="/maintenance/incident" element={<IncidentDashboard />} />
              <Route path="/maintenance/permit" element={<PermitDashboard />} />
              <Route path="/maintenance/m-safe" element={<MSafeDashboard />} />
              <Route path="/maintenance/audit" element={<AuditDashboard />} />
              <Route path="/maintenance/audit/operational" element={<OperationalDashboard />} />
              <Route path="/maintenance/audit/operational/scheduled" element={<ScheduledDashboard />} />
              <Route path="/maintenance/audit/operational/conducted" element={<ConductedDashboard />} />
              <Route path="/maintenance/audit/operational/master-checklists" element={<MasterChecklistsDashboard />} />
              <Route path="/maintenance/audit/vendor" element={<VendorDashboard />} />
              <Route path="/maintenance/audit/assets" element={<AssetsAuditDashboard />} />
              <Route path="/maintenance/audit/waste" element={<WasteDashboard />} />
              <Route path="/maintenance/audit/waste/generation" element={<WasteGenerationDashboard />} />
              <Route path="/maintenance/audit/waste/setup" element={<WasteSetupDashboard />} />
              <Route path="/maintenance/audit/survey" element={<SurveyDashboard />} />
              <Route path="/maintenance/audit/survey/list" element={<SurveyListDashboard />} />
              <Route path="/maintenance/audit/survey/mapping" element={<MappingDashboard />} />
              <Route path="/maintenance/audit/survey/response" element={<ResponseDashboard />} />

              {/* Finance Routes */}
              <Route path="/finance/procurement" element={<ProcurementDashboard />} />
              <Route path="/finance/pr-sr" element={<ProcurementDashboard />} />
              <Route path="/finance/material-pr" element={<MaterialPRDashboard />} />
              <Route path="/finance/service-pr" element={<ServicePRDashboard />} />
              <Route path="/finance/po-wo" element={<ProcurementDashboard />} />
              <Route path="/finance/po" element={<PODashboard />} />
              <Route path="/finance/wo" element={<WODashboard />} />
              <Route path="/finance/grn-srn" element={<GRN_SRNDashboard />} />
              <Route path="/finance/auto-saved-pr" element={<AutoSavedPRDashboard />} />
              <Route path="/finance/invoices" element={<InvoicesDashboard />} />
              <Route path="/finance/bill-booking" element={<BillBookingDashboard />} />
              <Route path="/finance/accounting" element={<AccountingDashboard />} />
              <Route path="/finance/cost-center" element={<CostCenterDashboard />} />
              <Route path="/finance/budgeting" element={<BudgetingDashboard />} />
              <Route path="/finance/pending-approvals" element={<PendingApprovalsDashboard />} />
              <Route path="/finance/lease-management" element={<LeaseManagementDashboard />} />

              {/* CRM Routes */}
              <Route path="/crm/cloud-telephony" element={<CloudTelephonyDashboard />} />
              <Route path="/crm/lead" element={<LeadDashboard />} />
              <Route path="/crm/opportunity" element={<OpportunityDashboard />} />
              <Route path="/crm/crm" element={<CRMDashboard />} />

              {/* Utility Routes */}
              <Route path="/utility/energy" element={<EnergyDashboard />} />
              <Route path="/utility/water" element={<WaterDashboard />} />
              <Route path="/utility/stp" element={<STPDashboard />} />

              {/* Security Routes */}
              <Route path="/security/gate-pass" element={<GatePassDashboard />} />
              <Route path="/security/gate-pass/inwards" element={<InwardsDashboard />} />
              <Route path="/security/gate-pass/outwards" element={<OutwardsDashboard />} />
              <Route path="/security/visitor" element={<VisitorDashboard />} />
              <Route path="/security/staff" element={<StaffDashboard />} />
              <Route path="/security/vehicle" element={<VehicleDashboard />} />
              <Route path="/security/vehicle/r-vehicles" element={<RVehicleDashboard />} />
              <Route path="/security/vehicle/r-vehicles/history" element={<RVehicleHistoryDashboard />} />
              <Route path="/security/vehicle/g-vehicles" element={<GVehicleDashboard />} />
              <Route path="/security/patrolling" element={<PatrollingDashboard />} />
              
              {/* Value Added Services Routes */}
              <Route path="/vas/fnb" element={<FnBRestaurantDashboard />} />
              <Route path="/vas/fnb/details/:id" element={<RestaurantDetailsPage />} />
              <Route path="/vas/parking" element={<ParkingDashboard />} />
              <Route path="/vas/parking/bookings" element={<ParkingBookingsDashboard />} />
              <Route path="/vas/parking/my" element={<MyParkingDashboard />} />
              <Route path="/vas/osr" element={<div className="p-8"><h1 className="text-2xl font-bold">OSR Dashboard</h1></div>} />
              <Route path="/vas/space-management/bookings" element={<SpaceManagementBookingsDashboard />} />
              <Route path="/vas/space-management/bookings/details/:id" element={<SpaceManagementBookingDetailsPage />} />
              <Route path="/vas/space-management/seat-requests" element={<SpaceManagementSeatRequestsDashboard />} />
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
              <Route path="/vas/training-list" element={<div className="p-8"><h1 className="text-2xl font-bold">Training List Dashboard</h1></div>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
