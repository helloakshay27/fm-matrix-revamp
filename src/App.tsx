
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';
import { Toaster } from '@/components/ui/toaster';

// Import all pages
import { Index } from './pages/Index';
import { AssetDashboard } from './pages/AssetDashboard';
import { AMCDashboard } from './pages/AMCDashboard';
import { ServiceDashboard } from './pages/ServiceDashboard';
import { AttendanceDashboard } from './pages/AttendanceDashboard';
import { ScheduleDashboard } from './pages/ScheduleDashboard';
import { TaskDashboard } from './pages/TaskDashboard';
import { TicketListDashboard } from './pages/TicketListDashboard';
import { SupplierDashboard } from './pages/SupplierDashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { SurveyListDashboard } from './pages/SurveyListDashboard';
import { SurveyMappingDashboard } from './pages/SurveyMappingDashboard';
import { SurveyResponseDashboard } from './pages/SurveyResponseDashboard';
import { ProjectsDashboard } from './pages/ProjectsDashboard';
import { AddProjectDashboard } from './pages/AddProjectDashboard';
import { VisitorsDashboard } from './pages/VisitorsDashboard';
import { VisitorsHistoryDashboard } from './pages/VisitorsHistoryDashboard';
import { RVehiclesDashboard } from './pages/RVehiclesDashboard';
import { RVehiclesHistoryDashboard } from './pages/RVehiclesHistoryDashboard';
import { GVehiclesDashboard } from './pages/GVehiclesDashboard';
import { StaffsDashboard } from './pages/StaffsDashboard';
import { MaterialsDashboard } from './pages/MaterialsDashboard';
import { PatrollingDashboard } from './pages/PatrollingDashboard';
import { PatrollingPendingDashboard } from './pages/PatrollingPendingDashboard';
import { GoodsInOutDashboard } from './pages/GoodsInOutDashboard';
import { InwardsDashboard } from './pages/InwardsDashboard';
import { OutwardsDashboard } from './pages/OutwardsDashboard';
import { EventsDashboard } from './pages/EventsDashboard';
import { BroadcastDashboard } from './pages/BroadcastDashboard';
import { DocumentsUnitDashboard } from './pages/DocumentsUnitDashboard';
import { DocumentsCommonDashboard } from './pages/DocumentsCommonDashboard';
import { BusinessDirectoryDashboard } from './pages/BusinessDirectoryDashboard';
import { OutstationDashboard } from './pages/OutstationDashboard';
import { AirlineDashboard } from './pages/AirlineDashboard';
import { RailDashboard } from './pages/RailDashboard';
import { HotelDashboard } from './pages/HotelDashboard';
import { SelfTravelDashboard } from './pages/SelfTravelDashboard';
import { TestimonialsSetupDashboard } from './pages/TestimonialsSetupDashboard';
import { CompanyPartnersSetupDashboard } from './pages/CompanyPartnersSetupDashboard';
import { MaterialPRDashboard } from './pages/MaterialPRDashboard';
import { AddMaterialPRDashboard } from './pages/AddMaterialPRDashboard';
import { ServicePRDashboard } from './pages/ServicePRDashboard';
import { AddServicePRDashboard } from './pages/AddServicePRDashboard';
import { PODashboard } from './pages/PODashboard';
import { AddPODashboard } from './pages/AddPODashboard';
import { WODashboard } from './pages/WODashboard';
import { GRNDashboard } from './pages/GRNDashboard';
import { AddGRNDashboard } from './pages/AddGRNDashboard';
import { InvoicesSESDashboard } from './pages/InvoicesSESDashboard';
import { PendingApprovalsDashboard } from './pages/PendingApprovalsDashboard';
import { GDNDashboard } from './pages/GDNDashboard';
import { GDNPendingApprovalsDashboard } from './pages/GDNPendingApprovalsDashboard';
import { AutoSavedPRDashboard } from './pages/AutoSavedPRDashboard';
import { WBSElementDashboard } from './pages/WBSElementDashboard';
import { OtherBillsDashboard } from './pages/OtherBillsDashboard';
import { AccountingDashboard } from './pages/AccountingDashboard';
import { CustomerBillsDashboard } from './pages/CustomerBillsDashboard';
import { MyBillsDashboard } from './pages/MyBillsDashboard';
import { AddNewBillDashboard } from './pages/AddNewBillDashboard';
import { BookingsDashboard } from './pages/BookingsDashboard';
import { SeatTypeDashboard } from './pages/SeatTypeDashboard';
import { BookingSetupDashboard } from './pages/BookingSetupDashboard';
import { MailroomInboundDashboard } from './pages/MailroomInboundDashboard';
import { ParkingDashboard } from './pages/ParkingDashboard';
import { ParkingBookingsDashboard } from './pages/ParkingBookingsDashboard';
import { VehicleParkingDashboard } from './pages/VehicleParkingDashboard';
import { InActiveAssetsDashboard } from './pages/InActiveAssetsDashboard';
import { OperationalAuditScheduledDashboard } from './pages/OperationalAuditScheduledDashboard';
import { OperationalAuditConductedDashboard } from './pages/OperationalAuditConductedDashboard';
import { OperationalAuditMasterChecklistsDashboard } from './pages/OperationalAuditMasterChecklistsDashboard';
import { VendorAuditScheduledDashboard } from './pages/VendorAuditScheduledDashboard';
import { VendorAuditConductedDashboard } from './pages/VendorAuditConductedDashboard';
import { IncidentSetupDashboard } from './pages/IncidentSetupDashboard';
import { IncidentListDashboard } from './pages/IncidentListDashboard';
import { PermitSetupDashboard } from './pages/PermitSetupDashboard';
import { PermitListDashboard } from './pages/PermitListDashboard';
import { PermitPendingApprovalsDashboard } from './pages/PermitPendingApprovalsDashboard';
import { DesignInsightsSetupDashboard } from './pages/DesignInsightsSetupDashboard';
import { DesignInsightsDashboard } from './pages/DesignInsightsDashboard';
import { TaskListDashboard } from './pages/TaskListDashboard';
import { ScheduleListDashboard } from './pages/ScheduleListDashboard';
import { SetupDashboard } from './pages/SetupDashboard';
import { BusinessSetupDashboard } from './pages/BusinessSetupDashboard';
import { FitoutSetupDashboard } from './pages/FitoutSetupDashboard';
import { ProjectDashboard } from './pages/ProjectDashboard';
import { MOMDashboard } from './pages/MOMDashboard';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="assets" element={<AssetDashboard />} />
                <Route path="assets/inactive" element={<InActiveAssetsDashboard />} />
                <Route path="amc" element={<AMCDashboard />} />
                <Route path="services" element={<ServiceDashboard />} />
                <Route path="attendance" element={<AttendanceDashboard />} />
                <Route path="schedule" element={<ScheduleDashboard />} />
                <Route path="schedule/list" element={<ScheduleListDashboard />} />
                <Route path="tasks" element={<TaskDashboard />} />
                <Route path="tasks/list" element={<TaskListDashboard />} />
                <Route path="tickets" element={<TicketListDashboard />} />
                <Route path="supplier" element={<SupplierDashboard />} />
                <Route path="vendor" element={<VendorDashboard />} />
                
                {/* Surveys */}
                <Route path="surveys/list" element={<SurveyListDashboard />} />
                <Route path="surveys/mapping" element={<SurveyMappingDashboard />} />
                <Route path="surveys/response" element={<SurveyResponseDashboard />} />

                {/* Operational Audit */}
                <Route path="operational-audit/scheduled" element={<OperationalAuditScheduledDashboard />} />
                <Route path="operational-audit/conducted" element={<OperationalAuditConductedDashboard />} />
                <Route path="operational-audit/master-checklists" element={<OperationalAuditMasterChecklistsDashboard />} />

                {/* Vendor Audit */}
                <Route path="maintenance/vendor-audit/scheduled" element={<VendorAuditScheduledDashboard />} />
                <Route path="maintenance/vendor-audit/conducted" element={<VendorAuditConductedDashboard />} />

                {/* Incident */}
                <Route path="maintenance/incident/setup" element={<IncidentSetupDashboard />} />
                <Route path="maintenance/incident/list" element={<IncidentListDashboard />} />

                {/* Permit */}
                <Route path="maintenance/permit/setup" element={<PermitSetupDashboard />} />
                <Route path="maintenance/permit/list" element={<PermitListDashboard />} />
                <Route path="maintenance/permit/pending-approvals" element={<PermitPendingApprovalsDashboard />} />

                {/* Design Insights */}
                <Route path="maintenance/design-insights/setup" element={<DesignInsightsSetupDashboard />} />
                <Route path="maintenance/design-insights/list" element={<DesignInsightsDashboard />} />

                {/* Projects */}
                <Route path="projects" element={<ProjectsDashboard />} />
                <Route path="projects/add" element={<AddProjectDashboard />} />
                <Route path="project" element={<ProjectDashboard />} />

                {/* Visitors */}
                <Route path="visitors/visitors" element={<VisitorsDashboard />} />
                <Route path="visitors/history" element={<VisitorsHistoryDashboard />} />
                <Route path="visitors/r-vehicles" element={<RVehiclesDashboard />} />
                <Route path="visitors/r-vehicles/history" element={<RVehiclesHistoryDashboard />} />
                <Route path="visitors/g-vehicles" element={<GVehiclesDashboard />} />
                <Route path="visitors/staffs" element={<StaffsDashboard />} />
                <Route path="visitors/materials" element={<MaterialsDashboard />} />
                <Route path="visitors/patrolling" element={<PatrollingDashboard />} />
                <Route path="visitors/patrolling-pending" element={<PatrollingPendingDashboard />} />
                <Route path="visitors/goods" element={<GoodsInOutDashboard />} />
                <Route path="visitors/goods/inwards" element={<InwardsDashboard />} />
                <Route path="visitors/goods/outwards" element={<OutwardsDashboard />} />

                {/* Experience */}
                <Route path="experience/events" element={<EventsDashboard />} />
                <Route path="experience/broadcast" element={<BroadcastDashboard />} />
                <Route path="experience/documents/unit" element={<DocumentsUnitDashboard />} />
                <Route path="experience/documents/common" element={<DocumentsCommonDashboard />} />
                <Route path="experience/business" element={<BusinessDirectoryDashboard />} />
                <Route path="experience/transport/outstation" element={<OutstationDashboard />} />
                <Route path="experience/transport/airline" element={<AirlineDashboard />} />
                <Route path="experience/transport/rail" element={<RailDashboard />} />
                <Route path="experience/transport/hotel" element={<HotelDashboard />} />
                <Route path="experience/transport/self-1" element={<SelfTravelDashboard />} />
                <Route path="experience/transport/self-2" element={<SelfTravelDashboard />} />
                <Route path="experience/mom" element={<MOMDashboard />} />
                <Route path="experience/community/testimonials" element={<TestimonialsSetupDashboard />} />
                <Route path="experience/community/partners" element={<CompanyPartnersSetupDashboard />} />
                <Route path="experience/setup" element={<SetupDashboard />} />

                {/* Finance */}
                <Route path="finance/material-pr" element={<MaterialPRDashboard />} />
                <Route path="finance/material-pr/add" element={<AddMaterialPRDashboard />} />
                <Route path="finance/service-pr" element={<ServicePRDashboard />} />
                <Route path="finance/service-pr/add" element={<AddServicePRDashboard />} />
                <Route path="finance/po" element={<PODashboard />} />
                <Route path="finance/po/add" element={<AddPODashboard />} />
                <Route path="finance/wo" element={<WODashboard />} />
                <Route path="finance/grn" element={<GRNDashboard />} />
                <Route path="finance/grn/add" element={<AddGRNDashboard />} />
                <Route path="finance/invoices-ses" element={<InvoicesSESDashboard />} />
                <Route path="finance/pending-approvals" element={<PendingApprovalsDashboard />} />
                <Route path="finance/gdn" element={<GDNDashboard />} />
                <Route path="finance/pending-approvals-2" element={<GDNPendingApprovalsDashboard />} />
                <Route path="finance/auto-saved-pr" element={<AutoSavedPRDashboard />} />
                <Route path="finance/wbs-element" element={<WBSElementDashboard />} />
                <Route path="finance/other-bills" element={<OtherBillsDashboard />} />
                <Route path="finance/accounting" element={<AccountingDashboard />} />
                <Route path="finance/customer-bills" element={<CustomerBillsDashboard />} />
                <Route path="finance/my-bills" element={<MyBillsDashboard />} />
                <Route path="finance/add-new-bill" element={<AddNewBillDashboard />} />

                {/* Property */}
                <Route path="property/space/bookings" element={<BookingsDashboard />} />
                <Route path="property/space/seat-requests" element={<SeatTypeDashboard />} />
                <Route path="property/booking/setup" element={<BookingSetupDashboard />} />
                <Route path="property/mailroom/inbound" element={<MailroomInboundDashboard />} />
                <Route path="property/parking" element={<ParkingDashboard />} />
                <Route path="property/parking/bookings" element={<ParkingBookingsDashboard />} />
                <Route path="property/parking/vehicles" element={<VehicleParkingDashboard />} />

                {/* Setup */}
                <Route path="setup" element={<SetupDashboard />} />
                <Route path="setup/business" element={<BusinessSetupDashboard />} />
                <Route path="setup/fitout" element={<FitoutSetupDashboard />} />
              </Route>
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
