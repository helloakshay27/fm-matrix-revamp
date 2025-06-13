
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LayoutProvider>
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </LayoutProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
