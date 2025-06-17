
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import { ServiceDashboard } from './pages/ServiceDashboard';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { AddServicePage } from './pages/AddServicePage';
import { EditServicePage } from './pages/EditServicePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/maintenance/asset/details/:id" element={<AssetDetailsPage />} />
          <Route path="/maintenance/service" element={<ServiceDashboard />} />
          <Route path="/maintenance/services" element={<ServiceDashboard />} />
          <Route path="/maintenance/service/details/:id" element={<ServiceDetailsPage />} />
          <Route path="/maintenance/service/add" element={<AddServicePage />} />
          <Route path="/maintenance/service/edit/:id" element={<EditServicePage />} />
        </Routes>
        <Toaster />
      </Layout>
    </Router>
  );
}

export default App;
