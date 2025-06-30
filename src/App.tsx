import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import UtilityEVConsumptionDashboard from './pages/UtilityEVConsumptionDashboard';
import UtilitySolarGeneratorDashboard from './pages/UtilitySolarGeneratorDashboard';

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
import { FnBDiscountsPage } from './pages/FnBDiscountsPage';
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

// Import Asset Audit pages
import { AssetAuditDashboard } from './pages/AssetAuditDashboard';
import { AddAssetAuditPage } from './pages/AddAssetAuditPage';
import { EditAssetAuditPage } from './pages/EditAssetAuditPage';
import { AssetAuditDetailsPage } from './pages/AssetAuditDetailsPage';

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

// Import Cold Wallet page
import { ColdWalletPage } from './pages/ColdWalletPage';

// Import CRM Polls page
import CRMPollsPage from './pages/CRMPollsPage';
import AddPollPage from './pages/AddPollPage';

// Import ButtonShowcase component
import { ButtonShowcase } from './components/ButtonShowcase';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <ButtonShowcase />
    </div>
  );
}

export default App;
