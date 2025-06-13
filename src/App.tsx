
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { ServiceDashboard } from "./pages/ServiceDashboard";
import { SupplierDashboard } from "./pages/SupplierDashboard";
import { ScheduleDashboard } from "./pages/ScheduleDashboard";
import { AMCDashboard } from "./pages/AMCDashboard";
import { AttendanceDashboard } from "./pages/AttendanceDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServiceDashboard />} />
          <Route path="/supplier" element={<SupplierDashboard />} />
          <Route path="/schedule" element={<ScheduleDashboard />} />
          <Route path="/amc" element={<AMCDashboard />} />
          <Route path="/attendance" element={<AttendanceDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
