
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout';
import Index from '@/pages/Index';
import { UtilityDashboard } from '@/pages/UtilityDashboard';
import { UtilityWaterDashboard } from '@/pages/UtilityWaterDashboard';
import { WBSElementDashboard } from '@/pages/WBSElementDashboard';
import { BillBookingDashboard } from '@/pages/BillBookingDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/utility/energy" element={<UtilityDashboard />} />
            <Route path="/utility/water" element={<UtilityWaterDashboard />} />
            <Route path="/finance/wbs" element={<WBSElementDashboard />} />
            <Route path="/finance/bill-booking" element={<BillBookingDashboard />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
