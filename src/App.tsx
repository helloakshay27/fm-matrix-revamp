import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutProvider } from "./contexts/LayoutContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import { ServiceDashboard } from "./pages/ServiceDashboard";
import { SupplierDashboard } from "./pages/SupplierDashboard";
import { ScheduleDashboard } from "./pages/ScheduleDashboard";
import { AMCDashboard } from "./pages/AMCDashboard";
import { AttendanceDashboard } from "./pages/AttendanceDashboard";
import { SurveyListDashboard } from "./pages/SurveyListDashboard";
import { SurveyMappingDashboard } from "./pages/SurveyMappingDashboard";
import { SurveyResponseDashboard } from "./pages/SurveyResponseDashboard";
import { TaskDashboard } from "./pages/TaskDashboard";
import { InActiveAssetsDashboard } from "./pages/InActiveAssetsDashboard";
import { SetupDashboard } from "./pages/SetupDashboard";
import NotFound from "./pages/NotFound";
import { VehicleParkingDashboard } from "./pages/VehicleParkingDashboard";
import { VisitorsDashboard } from "./pages/VisitorsDashboard";
import { VisitorsHistoryDashboard } from "./pages/VisitorsHistoryDashboard";
import { RVehiclesDashboard } from "./pages/RVehiclesDashboard";
import { RVehiclesHistoryDashboard } from "./pages/RVehiclesHistoryDashboard";
import { GVehiclesDashboard } from "./pages/GVehiclesDashboard";
import { StaffsDashboard } from "./pages/StaffsDashboard";
import { MaterialsDashboard } from "./pages/MaterialsDashboard";
import { PatrollingDashboard } from "./pages/PatrollingDashboard";
import { PatrollingPendingDashboard } from "./pages/PatrollingPendingDashboard";
import { GoodsInOutDashboard } from "./pages/GoodsInOutDashboard";
import { InwardsDashboard } from "./pages/InwardsDashboard";
import { OutwardsDashboard } from "./pages/OutwardsDashboard";
import EventsDashboard from "./pages/EventsDashboard";
import { BroadcastDashboard } from "./pages/BroadcastDashboard";
import { DocumentsUnitDashboard } from "./pages/DocumentsUnitDashboard";
import { DocumentsCommonDashboard } from "./pages/DocumentsCommonDashboard";
import { BusinessDirectoryDashboard } from "./pages/BusinessDirectoryDashboard";
import { BusinessSetupDashboard } from "./pages/BusinessSetupDashboard";
import { ProjectsDashboard } from "./pages/ProjectsDashboard";
import { ProjectDashboard } from "./pages/ProjectDashboard";
import { AddProjectDashboard } from "./pages/AddProjectDashboard";
import { FitoutSetupDashboard } from "./pages/FitoutSetupDashboard";
import { OutstationDashboard } from "./pages/OutstationDashboard";
import { AirlineDashboard } from "./pages/AirlineDashboard";
import { RailDashboard } from "./pages/RailDashboard";
import { HotelDashboard } from "./pages/HotelDashboard";
import { SelfTravelDashboard } from "./pages/SelfTravelDashboard";
import { TestimonialsSetupDashboard } from "./pages/TestimonialsSetupDashboard";
import { CompanyPartnersSetupDashboard } from "./pages/CompanyPartnersSetupDashboard";
import { MaterialPRDashboard } from "./pages/MaterialPRDashboard";
import { AddMaterialPRDashboard } from "./pages/AddMaterialPRDashboard";
import { ServicePRDashboard } from "./pages/ServicePRDashboard";
import { AddServicePRDashboard } from "./pages/AddServicePRDashboard";
import { PODashboard } from "./pages/PODashboard";
import { AddPODashboard } from "./pages/AddPODashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LayoutProvider>
          <Routes>
            {/* Setup route - standalone layout without dynamic header */}
            <Route path="/setup" element={<SetupDashboard />} />
            
            {/* Main app routes with Layout wrapper */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<ServiceDashboard />} />
                  <Route path="/supplier" element={<SupplierDashboard />} />
                  <Route path="/schedule" element={<ScheduleDashboard />} />
                  <Route path="/amc" element={<AMCDashboard />} />
                  <Route path="/attendance" element={<AttendanceDashboard />} />
                  <Route path="/tasks" element={<TaskDashboard />} />
                  <Route path="/surveys/list" element={<SurveyListDashboard />} />
                  <Route path="/surveys/mapping" element={<SurveyMappingDashboard />} />
                  <Route path="/surveys/response" element={<SurveyResponseDashboard />} />
                  <Route path="/assets/inactive" element={<InActiveAssetsDashboard />} />
                  <Route path="/projects" element={<ProjectDashboard />} />
                  <Route path="/projects/fitout-setup" element={<FitoutSetupDashboard />} />
                  <Route path="/projects/add" element={<AddProjectDashboard />} />
                  <Route path="/finance/material-pr" element={<MaterialPRDashboard />} />
                  <Route path="/finance/material-pr/add" element={<AddMaterialPRDashboard />} />
                  <Route path="/finance/service-pr" element={<ServicePRDashboard />} />
                  <Route path="/finance/service-pr/add" element={<AddServicePRDashboard />} />
                  <Route path="/finance/po" element={<PODashboard />} />
                  <Route path="/finance/po/add" element={<AddPODashboard />} />
                  <Route path="/visitors/visitors" element={<VisitorsDashboard />} />
                  <Route path="/visitors/history" element={<VisitorsHistoryDashboard />} />
                  <Route path="/visitors/r-vehicles" element={<RVehiclesDashboard />} />
                  <Route path="/visitors/r-vehicles/history" element={<RVehiclesHistoryDashboard />} />
                  <Route path="/visitors/g-vehicles" element={<GVehiclesDashboard />} />
                  <Route path="/visitors/staffs" element={<StaffsDashboard />} />
                  <Route path="/visitors/materials" element={<MaterialsDashboard />} />
                  <Route path="/visitors/patrolling" element={<PatrollingDashboard />} />
                  <Route path="/visitors/patrolling-pending" element={<PatrollingPendingDashboard />} />
                  <Route path="/visitors/goods" element={<GoodsInOutDashboard />} />
                  <Route path="/visitors/goods/inwards" element={<InwardsDashboard />} />
                  <Route path="/visitors/goods/outwards" element={<OutwardsDashboard />} />
                  <Route path="/visitors/vehicle-parkings" element={<VehicleParkingDashboard />} />
                  <Route path="/experience/events" element={<EventsDashboard />} />
                  <Route path="/experience/broadcast" element={<BroadcastDashboard />} />
                  <Route path="/experience/business" element={<BusinessDirectoryDashboard />} />
                  <Route path="/experience/business/setup" element={<BusinessSetupDashboard />} />
                  <Route path="/experience/documents/unit" element={<DocumentsUnitDashboard />} />
                  <Route path="/experience/documents/common" element={<DocumentsCommonDashboard />} />
                  <Route path="/experience/transport/outstation" element={<OutstationDashboard />} />
                  <Route path="/experience/transport/airline" element={<AirlineDashboard />} />
                  <Route path="/experience/transport/rail" element={<RailDashboard />} />
                  <Route path="/experience/transport/hotel" element={<HotelDashboard />} />
                  <Route path="/experience/transport/self-travel" element={<SelfTravelDashboard />} />
                  <Route path="/experience/testimonials" element={<TestimonialsSetupDashboard />} />
                  <Route path="/experience/company-partners" element={<CompanyPartnersSetupDashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </LayoutProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
