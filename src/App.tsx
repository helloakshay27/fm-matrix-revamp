
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { AssetDashboard } from './pages/AssetDashboard';
import { UtilityWaterDashboard } from './pages/UtilityWaterDashboard';
import { WBSDashboard } from './pages/WBSDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/maintenance/asset" element={<AssetDashboard />} />
            <Route path="/utility/water" element={<UtilityWaterDashboard />} />
            <Route path="/finance/wbs" element={<WBSDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
