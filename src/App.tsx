
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';

// Transitioning Pages
import { HOTODashboard } from './pages/HOTODashboard';
import { SnaggingDashboard } from './pages/SnaggingDashboard';
import { SnaggingDetailsPage } from './pages/SnaggingDetailsPage';
import { DesignInsightsDashboard } from './pages/DesignInsightsDashboard';
import { DesignInsightDetailsDashboard } from './pages/DesignInsightDetailsDashboard';
import { AddDesignInsightDashboard } from './pages/AddDesignInsightDashboard';
import { EditDesignInsightDashboard } from './pages/EditDesignInsightDashboard';
import { DesignInsightsSetupDashboard } from './pages/DesignInsightsSetupDashboard';
import { FitoutSetupDashboard } from './pages/FitoutSetupDashboard';
import { FitoutRequestListDashboard } from './pages/FitoutRequestListDashboard';
import { FitoutChecklistDashboard } from './pages/FitoutChecklistDashboard';
import { FitoutViolationDashboard } from './pages/FitoutViolationDashboard';

// Maintenance Pages
import { AssetDashboard } from './pages/AssetDashboard';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import { AddAssetDashboard } from './pages/AddAssetDashboard';
import { EditAssetDetailsPage } from './pages/EditAssetDetailsPage';
import { InActiveAssetsDashboard } from './pages/InActiveAssetsDashboard';
import { AMCDashboard } from './pages/AMCDashboard';
import { AMCDetailsPage } from './pages/AMCDetailsPage';
import { AddAMCPage } from './pages/AddAMCPage';
import { EditAMCPage } from './pages/EditAMCPage';
import { ServiceDashboard } from './pages/ServiceDashboard';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { AddServicePage } from './pages/AddServicePage';
import { EditServicePage } from './pages/EditServicePage';
import { AttendanceDashboard } from './pages/AttendanceDashboard';
import { AttendanceDetailsPage } from './pages/AttendanceDetailsPage';
import { InventoryDashboard } from './pages/InventoryDashboard';
import { InventoryDetailsPage } from './pages/InventoryDetailsPage';
import { InventoryFeedsPage } from './pages/InventoryFeedsPage';
import { AddInventoryPage } from './pages/AddInventoryPage';
import { TicketDashboard } from './pages/TicketDashboard';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { TicketFeedsPage } from './pages/TicketFeedsPage';
import { TicketListDashboard } from './pages/TicketListDashboard';
import { AddTicketDashboard } from './pages/AddTicketDashboard';
import { TicketTagVendorPage } from './pages/TicketTagVendorPage';
import { TicketDiscountsPage } from './pages/TicketDiscountsPage';
import { TaskDashboard } from './pages/TaskDashboard';
import { TaskDetailsPage } from './pages/TaskDetailsPage';
import { TaskListDashboard } from './pages/TaskListDashboard';
import { ScheduleDashboard } from './pages/ScheduleDashboard';
import { ScheduleListDashboard } from './pages/ScheduleListDashboard';
import { AddSchedulePage } from './pages/AddSchedulePage';
import { EditSchedulePage } from './pages/EditSchedulePage';
import { CopySchedulePage } from './pages/CopySchedulePage';
import { ViewSchedulePage } from './pages/ViewSchedulePage';
import { ScheduleExportPage } from './pages/ScheduleExportPage';
import { OperationalAuditScheduledDashboard } from './pages/OperationalAuditScheduledDashboard';
import { OperationalAuditConductedDashboard } from './pages/OperationalAuditConductedDashboard';
import { OperationalAuditMasterChecklistsDashboard } from './pages/OperationalAuditMasterChecklistsDashboard';
import { AddOperationalAuditSchedulePage } from './pages/AddOperationalAuditSchedulePage';
import { VendorAuditScheduledDashboard } from './pages/VendorAuditScheduledDashboard';
import { VendorAuditConductedDashboard } from './pages/VendorAuditConductedDashboard';
import { AddVendorAuditSchedulePage } from './pages/AddVendorAuditSchedulePage';
import { AddVendorAuditPage } from './pages/AddVendorAuditPage';
import { ViewVendorAuditPage } from './pages/ViewVendorAuditPage';
import { AssetAuditDashboard } from './pages/AssetAuditDashboard';
import { AssetAuditDetailsPage } from './pages/AssetAuditDetailsPage';
import { AddAssetAuditPage } from './pages/AddAssetAuditPage';
import { EditAssetAuditPage } from './pages/EditAssetAuditPage';
import { UtilityWasteGenerationDashboard } from './pages/UtilityWasteGenerationDashboard';
import { UtilityWasteGenerationSetupDashboard } from './pages/UtilityWasteGenerationSetupDashboard';
import { AddWasteGenerationPage } from './pages/AddWasteGenerationPage';
import { SurveyListDashboard } from './pages/SurveyListDashboard';
import { SurveyMappingDashboard } from './pages/SurveyMappingDashboard';
import { SurveyResponseDashboard } from './pages/SurveyResponseDashboard';
import { AddSurveyForm } from './pages/AddSurveyForm';

// Safety Pages
import { IncidentListDashboard } from './pages/IncidentListDashboard';
import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
import { AddIncidentPage } from './pages/AddIncidentPage';
import { EditIncidentDetailsPage } from './pages/EditIncidentDetailsPage';
import { IncidentSetupDashboard } from './pages/IncidentSetupDashboard';
import { PermitListDashboard } from './pages/PermitListDashboard';
import { PermitPendingApprovalsDashboard } from './pages/PermitPendingApprovalsDashboard';
import { PermitSetupDashboard } from './pages/PermitSetupDashboard';
import { AddPermitPage } from './pages/AddPermitPage';
import { MSafeDashboard } from './pages/MSafeDashboard';
import { TrainingListDashboard } from './pages/TrainingListDashboard';
import { AddTrainingRecordDashboard } from './pages/AddTrainingRecordDashboard';
import { TrainingRecordDetailsPage } from './pages/TrainingRecordDetailsPage';

// Finance Pages
import { MaterialPRDashboard } from './pages/MaterialPRDashboard';
import { MaterialPRDetailsPage } from './pages/MaterialPRDetailsPage';
import { MaterialPRFeedsPage } from './pages/MaterialPRFeedsPage';
import { AddMaterialPRDashboard } from './pages/AddMaterialPRDashboard';
import { EditMaterialPRDashboard } from './pages/EditMaterialPRDashboard';
import { CloneMaterialPRPage } from './pages/CloneMaterialPRPage';
import { ServicePRDashboard } from './pages/ServicePRDashboard';
import { ServicePRDetailsPage } from './pages/ServicePRDetailsPage';
import { ServicePRFeedsPage } from './pages/ServicePRFeedsPage';
import { AddServicePRDashboard } from './pages/AddServicePRDashboard';
import { EditServicePRPage } from './pages/EditServicePRPage';
import { CloneServicePRPage } from './pages/CloneServicePRPage';
import { PODashboard } from './pages/PODashboard';
import { PODetailsPage } from './pages/PODetailsPage';
import { POFeedsPage } from './pages/POFeedsPage';
import { AddPODashboard } from './pages/AddPODashboard';
import { WODashboard } from './pages/WODashboard';
import { GRNDashboard } from './pages/GRNDashboard';
import { GRNDetailsPage } from './pages/GRNDetailsPage';
import { GRNFeedsPage } from './pages/GRNFeedsPage';
import { AddGRNDashboard } from './pages/AddGRNDashboard';
import { EditGRNDashboard } from './pages/EditGRNDashboard';
import { GRNSRNDashboard } from './pages/GRNSRNDashboard';
import { AutoSavedPRDashboard } from './pages/AutoSavedPRDashboard';
import { InvoicesDashboard } from './pages/InvoicesDashboard';
import { InvoicesSESDashboard } from './pages/InvoicesSESDashboard';
import { InvoiceDashboard } from './pages/InvoiceDashboard';
import { BillBookingDashboard } from './pages/BillBookingDashboard';
import { AddBillPage } from './pages/AddBillPage';
import { AddNewBillDashboard } from './pages/AddNewBillDashboard';
import { CustomerBillsDashboard } from './pages/CustomerBillsDashboard';
import { MyBillsDashboard } from './pages/MyBillsDashboard';
import { OtherBillsDashboard } from './pages/OtherBillsDashboard';
import { AccountingDashboard } from './pages/AccountingDashboard';
import { AccountingDetailPage } from './pages/AccountingDetailPage';
import { MarketPlaceAccountingPage } from './pages/MarketPlaceAccountingPage';
import { MarketPlaceAccountingDetailsPage } from './pages/MarketPlaceAccountingDetailsPage';
import { MarketPlaceAccountingEditPage } from './pages/MarketPlaceAccountingEditPage';
import { MarketPlaceCostCenterPage } from './pages/MarketPlaceCostCenterPage';
import { PendingApprovalsDashboard } from './pages/PendingApprovalsDashboard';
import { WBSElementDashboard } from './pages/WBSElementDashboard';

// CRM Pages
import { LeadDetailsPage } from './pages/LeadDetailsPage';
import { AddLeadPage } from './pages/AddLeadPage';
import { CRMCustomersDashboard } from './pages/CRMCustomersDashboard';
import { CRMEventsPage } from './pages/CRMEventsPage';
import { CRMEventDetailsPage } from './pages/CRMEventDetailsPage';
import { AddEventPage } from './pages/AddEventPage';
import { EventsDashboard } from './pages/EventsDashboard';
import { BroadcastDashboard } from './pages/BroadcastDashboard';
import { BroadcastDetailsPage } from './pages/BroadcastDetailsPage';
import { AddBroadcastPage } from './pages/AddBroadcastPage';
import { CRMGroupsPage } from './pages/CRMGroupsPage';
import { CRMGroupDetailsPage } from './pages/CRMGroupDetailsPage';
import { CRMPollsPage } from './pages/CRMPollsPage';
import { AddPollPage } from './pages/AddPollPage';
import { CRMCampaignPage } from './pages/CRMCampaignPage';

// Utility Pages
import { UtilityDashboard } from './pages/UtilityDashboard';
import { UtilityConsumptionDashboard } from './pages/UtilityConsumptionDashboard';
import { UtilityDailyReadingsDashboard } from './pages/UtilityDailyReadingsDashboard';
import { UtilityRequestDashboard } from './pages/UtilityRequestDashboard';
import { UtilityWaterDashboard } from './pages/UtilityWaterDashboard';
import { WaterAssetDetailsPage } from './pages/WaterAssetDetailsPage';
import { AddWaterAssetDashboard } from './pages/AddWaterAssetDashboard';
import { UtilitySTPDashboard } from './pages/UtilitySTPDashboard';
import { AddSTPAssetDashboard } from './pages/AddSTPAssetDashboard';
import { UtilityEVConsumptionDashboard } from './pages/UtilityEVConsumptionDashboard';
import { UtilitySolarGeneratorDashboard } from './pages/UtilitySolarGeneratorDashboard';
import { AddEnergyAssetDashboard } from './pages/AddEnergyAssetDashboard';
import { EnergyAssetDetailsPage } from './pages/EnergyAssetDetailsPage';
import { EditEnergyAssetPage } from './pages/EditEnergyAssetPage';

// Security Pages
import { GatePassInwardsDashboard } from './pages/GatePassInwardsDashboard';
import { GatePassOutwardsDashboard } from './pages/GatePassOutwardsDashboard';
import { GatePassDashboard } from './pages/GatePassDashboard';
import { InwardsDashboard } from './pages/InwardsDashboard';
import { OutwardsDashboard } from './pages/OutwardsDashboard';
import { GoodsInOutDashboard } from './pages/GoodsInOutDashboard';
import { GDNDashboard } from './pages/GDNDashboard';
import { GDNPendingApprovalsDashboard } from './pages/GDNPendingApprovalsDashboard';
import { VisitorsDashboard } from './pages/VisitorsDashboard';
import { VisitorsHistoryDashboard } from './pages/VisitorsHistoryDashboard';
import { StaffsDashboard } from './pages/StaffsDashboard';
import { StaffDetailsPage } from './pages/StaffDetailsPage';
import { EditStaffPage } from './pages/EditStaffPage';
import { RVehiclesDashboard } from './pages/RVehiclesDashboard';
import { RVehiclesHistoryDashboard } from './pages/RVehiclesHistoryDashboard';
import { RVehiclesInDashboard } from './pages/RVehiclesInDashboard';
import { RVehiclesOutDashboard } from './pages/RVehiclesOutDashboard';
import { GVehiclesDashboard } from './pages/GVehiclesDashboard';
import { GVehicleOutDashboard } from './pages/GVehicleOutDashboard';
import { PatrollingDashboard } from './pages/PatrollingDashboard';
import { PatrollingDetailsPage } from './pages/PatrollingDetailsPage';
import { PatrollingPendingDashboard } from './pages/PatrollingPendingDashboard';

// Value Added Services Pages
import { FnBRestaurantDashboard } from './pages/FnBRestaurantDashboard';
import { FnBRestaurantDetailsPage } from './pages/FnBRestaurantDetailsPage';
import { FnBDiscountsPage } from './pages/FnBDiscountsPage';
import { ParkingDashboard } from './pages/ParkingDashboard';
import { ParkingDetailsPage } from './pages/ParkingDetailsPage';
import { ParkingBookingsDashboard } from './pages/ParkingBookingsDashboard';
import { MyParkingDashboard } from './pages/MyParkingDashboard';
import { VehicleParkingDashboard } from './pages/VehicleParkingDashboard';
import { OSRDashboard } from './pages/OSRDashboard';
import { OSRDetailsPage } from './pages/OSRDetailsPage';
import { OSRGenerateReceiptPage } from './pages/OSRGenerateReceiptPage';
import { SpaceManagementBookingsDashboard } from './pages/SpaceManagementBookingsDashboard';
import { SpaceManagementBookingDetailsPage } from './pages/SpaceManagementBookingDetailsPage';
import { SpaceManagementSeatRequestsDashboard } from './pages/SpaceManagementSeatRequestsDashboard';
import { SeatTypeDashboard } from './pages/SeatTypeDashboard';
import { BookingSetupDashboard } from './pages/BookingSetupDashboard';
import { BookingsDashboard } from './pages/BookingsDashboard';
import { RedemptionMarketplacePage } from './pages/RedemptionMarketplacePage';

// Market Place Pages
import { MarketPlaceAllPage } from './pages/MarketPlaceAllPage';
import { MarketPlaceInstalledPage } from './pages/MarketPlaceInstalledPage';
import { MarketPlaceUpdatesPage } from './pages/MarketPlaceUpdatesPage';

// Settings Pages
import { SetupDashboard } from './pages/SetupDashboard';
import { AccountDashboard } from './pages/settings/AccountDashboard';
import { FMUsersDashboard } from './pages/settings/FMUsersDashboard';
import { EditFMUserDetailsPage } from './pages/settings/EditFMUserDetailsPage';
import { DepartmentDashboard } from './pages/settings/DepartmentDashboard';
import { RoleDashboard } from './pages/settings/RoleDashboard';
import { CloneRolePage } from './pages/settings/CloneRolePage';
import { ApprovalMatrixDashboard } from './pages/settings/ApprovalMatrixDashboard';
import { AddApprovalMatrixDashboard } from './pages/settings/AddApprovalMatrixDashboard';
import { EditApprovalMatrixDashboard } from './pages/settings/EditApprovalMatrixDashboard';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Transitioning Routes */}
            <Route path="/transitioning/hoto" element={<HOTODashboard />} />
            <Route path="/transitioning/snagging" element={<SnaggingDashboard />} />
            <Route path="/transitioning/snagging/:id" element={<SnaggingDetailsPage />} />
            <Route path="/transitioning/design-insight" element={<DesignInsightsDashboard />} />
            <Route path="/transitioning/design-insight/:id" element={<DesignInsightDetailsDashboard />} />
            <Route path="/transitioning/design-insight/add" element={<AddDesignInsightDashboard />} />
            <Route path="/transitioning/design-insight/edit/:id" element={<EditDesignInsightDashboard />} />
            <Route path="/transitioning/design-insight/setup" element={<DesignInsightsSetupDashboard />} />
            <Route path="/transitioning/fitout/setup" element={<FitoutSetupDashboard />} />
            <Route path="/transitioning/fitout/request" element={<FitoutRequestListDashboard />} />
            <Route path="/transitioning/fitout/checklist" element={<FitoutChecklistDashboard />} />
            <Route path="/transitioning/fitout/violation" element={<FitoutViolationDashboard />} />

            {/* Maintenance Routes */}
            <Route path="/maintenance/asset" element={<AssetDashboard />} />
            <Route path="/maintenance/asset/:id" element={<AssetDetailsPage />} />
            <Route path="/maintenance/asset/add" element={<AddAssetDashboard />} />
            <Route path="/maintenance/asset/edit/:id" element={<EditAssetDetailsPage />} />
            <Route path="/maintenance/asset/inactive" element={<InActiveAssetsDashboard />} />
            <Route path="/maintenance/amc" element={<AMCDashboard />} />
            <Route path="/maintenance/amc/:id" element={<AMCDetailsPage />} />
            <Route path="/maintenance/amc/add" element={<AddAMCPage />} />
            <Route path="/maintenance/amc/edit/:id" element={<EditAMCPage />} />
            <Route path="/maintenance/services" element={<ServiceDashboard />} />
            <Route path="/maintenance/services/:id" element={<ServiceDetailsPage />} />
            <Route path="/maintenance/services/add" element={<AddServicePage />} />
            <Route path="/maintenance/services/edit/:id" element={<EditServicePage />} />
            <Route path="/maintenance/attendance" element={<AttendanceDashboard />} />
            <Route path="/maintenance/attendance/:id" element={<AttendanceDetailsPage />} />
            <Route path="/maintenance/inventory" element={<InventoryDashboard />} />
            <Route path="/maintenance/inventory/:id" element={<InventoryDetailsPage />} />
            <Route path="/maintenance/inventory/feeds" element={<InventoryFeedsPage />} />
            <Route path="/maintenance/inventory/add" element={<AddInventoryPage />} />
            <Route path="/maintenance/ticket" element={<TicketDashboard />} />
            <Route path="/maintenance/ticket/:id" element={<TicketDetailsPage />} />
            <Route path="/maintenance/ticket/feeds" element={<TicketFeedsPage />} />
            <Route path="/maintenance/ticket/list" element={<TicketListDashboard />} />
            <Route path="/maintenance/ticket/add" element={<AddTicketDashboard />} />
            <Route path="/maintenance/ticket/tag-vendor" element={<TicketTagVendorPage />} />
            <Route path="/maintenance/ticket/discounts" element={<TicketDiscountsPage />} />
            <Route path="/maintenance/task" element={<TaskDashboard />} />
            <Route path="/maintenance/task/:id" element={<TaskDetailsPage />} />
            <Route path="/maintenance/task/list" element={<TaskListDashboard />} />
            <Route path="/maintenance/schedule" element={<ScheduleDashboard />} />
            <Route path="/maintenance/schedule/list" element={<ScheduleListDashboard />} />
            <Route path="/maintenance/schedule/add" element={<AddSchedulePage />} />
            <Route path="/maintenance/schedule/edit/:id" element={<EditSchedulePage />} />
            <Route path="/maintenance/schedule/copy/:id" element={<CopySchedulePage />} />
            <Route path="/maintenance/schedule/view/:id" element={<ViewSchedulePage />} />
            <Route path="/maintenance/schedule/export" element={<ScheduleExportPage />} />
            <Route path="/maintenance/audit/operational/scheduled" element={<OperationalAuditScheduledDashboard />} />
            <Route path="/maintenance/audit/operational/conducted" element={<OperationalAuditConductedDashboard />} />
            <Route path="/maintenance/audit/operational/master-checklists" element={<OperationalAuditMasterChecklistsDashboard />} />
            <Route path="/maintenance/audit/operational/add" element={<AddOperationalAuditSchedulePage />} />
            <Route path="/maintenance/audit/vendor/scheduled" element={<VendorAuditScheduledDashboard />} />
            <Route path="/maintenance/audit/vendor/conducted" element={<VendorAuditConductedDashboard />} />
            <Route path="/maintenance/audit/vendor/add" element={<AddVendorAuditSchedulePage />} />
            <Route path="/maintenance/audit/vendor/add-audit" element={<AddVendorAuditPage />} />
            <Route path="/maintenance/audit/vendor/view/:id" element={<ViewVendorAuditPage />} />
            <Route path="/maintenance/audit/assets" element={<AssetAuditDashboard />} />
            <Route path="/maintenance/audit/assets/:id" element={<AssetAuditDetailsPage />} />
            <Route path="/maintenance/audit/assets/add" element={<AddAssetAuditPage />} />
            <Route path="/maintenance/audit/assets/edit/:id" element={<EditAssetAuditPage />} />
            <Route path="/maintenance/audit/waste/generation" element={<UtilityWasteGenerationDashboard />} />
            <Route path="/maintenance/audit/waste/setup" element={<UtilityWasteGenerationSetupDashboard />} />
            <Route path="/maintenance/audit/waste/add" element={<AddWasteGenerationPage />} />
            <Route path="/maintenance/audit/survey/list" element={<SurveyListDashboard />} />
            <Route path="/maintenance/audit/survey/mapping" element={<SurveyMappingDashboard />} />
            <Route path="/maintenance/audit/survey/response" element={<SurveyResponseDashboard />} />
            <Route path="/maintenance/audit/survey/add" element={<AddSurveyForm />} />

            {/* Safety Routes */}
            <Route path="/safety/incident" element={<IncidentListDashboard />} />
            <Route path="/safety/incident/:id" element={<IncidentDetailsPage />} />
            <Route path="/safety/incident/add" element={<AddIncidentPage />} />
            <Route path="/safety/incident/edit/:id" element={<EditIncidentDetailsPage />} />
            <Route path="/safety/incident/setup" element={<IncidentSetupDashboard />} />
            <Route path="/safety/permit" element={<PermitListDashboard />} />
            <Route path="/safety/permit/pending" element={<PermitPendingApprovalsDashboard />} />
            <Route path="/safety/permit/setup" element={<PermitSetupDashboard />} />
            <Route path="/safety/permit/add" element={<AddPermitPage />} />
            <Route path="/safety/m-safe" element={<MSafeDashboard />} />
            <Route path="/safety/training-list" element={<TrainingListDashboard />} />
            <Route path="/safety/training-list/add" element={<AddTrainingRecordDashboard />} />
            <Route path="/safety/training-list/:id" element={<TrainingRecordDetailsPage />} />
            <Route path="/safety/training-list/edit/:id" element={<AddTrainingRecordDashboard />} />

            {/* Finance Routes */}
            <Route path="/finance/material-pr" element={<MaterialPRDashboard />} />
            <Route path="/finance/material-pr/:id" element={<MaterialPRDetailsPage />} />
            <Route path="/finance/material-pr/feeds" element={<MaterialPRFeedsPage />} />
            <Route path="/finance/material-pr/add" element={<AddMaterialPRDashboard />} />
            <Route path="/finance/material-pr/edit/:id" element={<EditMaterialPRDashboard />} />
            <Route path="/finance/material-pr/clone/:id" element={<CloneMaterialPRPage />} />
            <Route path="/finance/service-pr" element={<ServicePRDashboard />} />
            <Route path="/finance/service-pr/:id" element={<ServicePRDetailsPage />} />
            <Route path="/finance/service-pr/feeds" element={<ServicePRFeedsPage />} />
            <Route path="/finance/service-pr/add" element={<AddServicePRDashboard />} />
            <Route path="/finance/service-pr/edit/:id" element={<EditServicePRPage />} />
            <Route path="/finance/service-pr/clone/:id" element={<CloneServicePRPage />} />
            <Route path="/finance/po" element={<PODashboard />} />
            <Route path="/finance/po/:id" element={<PODetailsPage />} />
            <Route path="/finance/po/feeds" element={<POFeedsPage />} />
            <Route path="/finance/po/add" element={<AddPODashboard />} />
            <Route path="/finance/wo" element={<WODashboard />} />
            <Route path="/finance/grn-srn" element={<GRNSRNDashboard />} />
            <Route path="/finance/grn" element={<GRNDashboard />} />
            <Route path="/finance/grn/:id" element={<GRNDetailsPage />} />
            <Route path="/finance/grn/feeds" element={<GRNFeedsPage />} />
            <Route path="/finance/grn/add" element={<AddGRNDashboard />} />
            <Route path="/finance/grn/edit/:id" element={<EditGRNDashboard />} />
            <Route path="/finance/auto-saved-pr" element={<AutoSavedPRDashboard />} />
            <Route path="/finance/invoices" element={<InvoicesDashboard />} />
            <Route path="/finance/invoices/ses" element={<InvoicesSESDashboard />} />
            <Route path="/finance/invoice" element={<InvoiceDashboard />} />
            <Route path="/finance/bill-booking" element={<BillBookingDashboard />} />
            <Route path="/finance/bill/add" element={<AddBillPage />} />
            <Route path="/finance/bill/new" element={<AddNewBillDashboard />} />
            <Route path="/finance/bills/customer" element={<CustomerBillsDashboard />} />
            <Route path="/finance/bills/my" element={<MyBillsDashboard />} />
            <Route path="/finance/bills/other" element={<OtherBillsDashboard />} />
            <Route path="/finance/cost-center" element={<MarketPlaceCostCenterPage />} />
            <Route path="/finance/budgeting" element={<MarketPlaceAccountingPage />} />
            <Route path="/finance/budgeting/:id" element={<MarketPlaceAccountingDetailsPage />} />
            <Route path="/finance/budgeting/edit/:id" element={<MarketPlaceAccountingEditPage />} />
            <Route path="/finance/pending-approvals" element={<PendingApprovalsDashboard />} />
            <Route path="/finance/wbs" element={<WBSElementDashboard />} />
            <Route path="/finance/accounting" element={<AccountingDashboard />} />
            <Route path="/finance/accounting/:id" element={<AccountingDetailPage />} />

            {/* CRM Routes */}
            <Route path="/crm/lead" element={<LeadDetailsPage />} />
            <Route path="/crm/lead/add" element={<AddLeadPage />} />
            <Route path="/crm/opportunity" element={<CRMCustomersDashboard />} />
            <Route path="/crm/crm" element={<CRMCustomersDashboard />} />
            <Route path="/crm/events" element={<CRMEventsPage />} />
            <Route path="/crm/events/:id" element={<CRMEventDetailsPage />} />
            <Route path="/crm/events/add" element={<AddEventPage />} />
            <Route path="/crm/events/dashboard" element={<EventsDashboard />} />
            <Route path="/crm/broadcast" element={<BroadcastDashboard />} />
            <Route path="/crm/broadcast/:id" element={<BroadcastDetailsPage />} />
            <Route path="/crm/broadcast/add" element={<AddBroadcastPage />} />
            <Route path="/crm/groups" element={<CRMGroupsPage />} />
            <Route path="/crm/groups/:id" element={<CRMGroupDetailsPage />} />
            <Route path="/crm/polls" element={<CRMPollsPage />} />
            <Route path="/crm/polls/add" element={<AddPollPage />} />
            <Route path="/crm/campaign" element={<CRMCampaignPage />} />

            {/* Utility Routes */}
            <Route path="/utility/energy" element={<UtilityDashboard />} />
            <Route path="/utility/energy/consumption" element={<UtilityConsumptionDashboard />} />
            <Route path="/utility/energy/daily-readings" element={<UtilityDailyReadingsDashboard />} />
            <Route path="/utility/energy/request" element={<UtilityRequestDashboard />} />
            <Route path="/utility/energy/asset/add" element={<AddEnergyAssetDashboard />} />
            <Route path="/utility/energy/asset/:id" element={<EnergyAssetDetailsPage />} />
            <Route path="/utility/energy/asset/edit/:id" element={<EditEnergyAssetPage />} />
            <Route path="/utility/water" element={<UtilityWaterDashboard />} />
            <Route path="/utility/water/asset/:id" element={<WaterAssetDetailsPage />} />
            <Route path="/utility/water/asset/add" element={<AddWaterAssetDashboard />} />
            <Route path="/utility/stp" element={<UtilitySTPDashboard />} />
            <Route path="/utility/stp/asset/add" element={<AddSTPAssetDashboard />} />
            <Route path="/utility/ev-consumption" element={<UtilityEVConsumptionDashboard />} />
            <Route path="/utility/solar-generator" element={<UtilitySolarGeneratorDashboard />} />

            {/* Security Routes */}
            <Route path="/security/gate-pass/inwards" element={<GatePassInwardsDashboard />} />
            <Route path="/security/gate-pass/outwards" element={<GatePassOutwardsDashboard />} />
            <Route path="/security/gate-pass" element={<GatePassDashboard />} />
            <Route path="/security/gate-pass/goods-in" element={<InwardsDashboard />} />
            <Route path="/security/gate-pass/goods-out" element={<OutwardsDashboard />} />
            <Route path="/security/gate-pass/goods" element={<GoodsInOutDashboard />} />
            <Route path="/security/gate-pass/gdn" element={<GDNDashboard />} />
            <Route path="/security/gate-pass/gdn/pending" element={<GDNPendingApprovalsDashboard />} />
            <Route path="/security/visitor" element={<VisitorsDashboard />} />
            <Route path="/security/visitor/history" element={<VisitorsHistoryDashboard />} />
            <Route path="/security/staff" element={<StaffsDashboard />} />
            <Route path="/security/staff/:id" element={<StaffDetailsPage />} />
            <Route path="/security/staff/edit/:id" element={<EditStaffPage />} />
            <Route path="/security/vehicle/r-vehicles" element={<RVehiclesDashboard />} />
            <Route path="/security/vehicle/r-vehicles/history" element={<RVehiclesHistoryDashboard />} />
            <Route path="/security/vehicle/r-vehicles/in" element={<RVehiclesInDashboard />} />
            <Route path="/security/vehicle/r-vehicles/out" element={<RVehiclesOutDashboard />} />
            <Route path="/security/vehicle/g-vehicles" element={<GVehiclesDashboard />} />
            <Route path="/security/vehicle/g-vehicles/out" element={<GVehicleOutDashboard />} />
            <Route path="/security/patrolling" element={<PatrollingDashboard />} />
            <Route path="/security/patrolling/:id" element={<PatrollingDetailsPage />} />
            <Route path="/security/patrolling/pending" element={<PatrollingPendingDashboard />} />

            {/* Value Added Services Routes */}
            <Route path="/vas/fnb" element={<FnBRestaurantDashboard />} />
            <Route path="/vas/fnb/:id" element={<FnBRestaurantDetailsPage />} />
            <Route path="/vas/fnb/discounts" element={<FnBDiscountsPage />} />
            <Route path="/vas/parking" element={<ParkingDashboard />} />
            <Route path="/vas/parking/:id" element={<ParkingDetailsPage />} />
            <Route path="/vas/parking/bookings" element={<ParkingBookingsDashboard />} />
            <Route path="/vas/parking/my" element={<MyParkingDashboard />} />
            <Route path="/vas/parking/vehicle" element={<VehicleParkingDashboard />} />
            <Route path="/vas/osr" element={<OSRDashboard />} />
            <Route path="/vas/osr/:id" element={<OSRDetailsPage />} />
            <Route path="/vas/osr/receipt/:id" element={<OSRGenerateReceiptPage />} />
            <Route path="/vas/space-management/bookings" element={<SpaceManagementBookingsDashboard />} />
            <Route path="/vas/space-management/bookings/:id" element={<SpaceManagementBookingDetailsPage />} />
            <Route path="/vas/space-management/seat-requests" element={<SpaceManagementSeatRequestsDashboard />} />
            <Route path="/vas/space-management/setup/seat-type" element={<SeatTypeDashboard />} />
            <Route path="/vas/space-management/setup/seat-setup" element={<BookingSetupDashboard />} />
            <Route path="/vas/space-management/setup/bookings" element={<BookingsDashboard />} />
            <Route path="/vas/redemonection-marketplace" element={<RedemptionMarketplacePage />} />

            {/* Market Place Routes */}
            <Route path="/market-place/all" element={<MarketPlaceAllPage />} />
            <Route path="/market-place/installed" element={<MarketPlaceInstalledPage />} />
            <Route path="/market-place/updates" element={<MarketPlaceUpdatesPage />} />

            {/* Settings Routes */}
            <Route path="/settings/general" element={<SetupDashboard />} />
            <Route path="/settings/account" element={<AccountDashboard />} />
            <Route path="/settings/users" element={<FMUsersDashboard />} />
            <Route path="/settings/users/edit/:id" element={<EditFMUserDetailsPage />} />
            <Route path="/settings/roles/department" element={<DepartmentDashboard />} />
            <Route path="/settings/roles/role" element={<RoleDashboard />} />
            <Route path="/settings/roles/clone/:id" element={<CloneRolePage />} />
            <Route path="/settings/approval-matrix" element={<ApprovalMatrixDashboard />} />
            <Route path="/settings/approval-matrix/add" element={<AddApprovalMatrixDashboard />} />
            <Route path="/settings/approval-matrix/edit/:id" element={<EditApprovalMatrixDashboard />} />
          </Route>
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
