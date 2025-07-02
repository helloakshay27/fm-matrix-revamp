import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Index } from './pages/Index';
import {
  Login,
  ForgotPassword,
  PasswordReset,
  EmailVerification,
} from './pages/Auth';
import {
  Dashboard,
  Assets,
  AssetsDetails,
  AddAssets,
  EditAssets,
  SpaceManagement,
  HotelListing,
  HotelDetails,
  AddHotel,
  EditHotel,
  CostCenters,
  AddCostCenter,
  EditCostCenter,
  InvoiceListing,
  InvoiceDetails,
  AddInvoice,
  EditInvoice,
  WaterDashboard,
  WaterAssets,
  WaterAssetsDetails,
  AddWaterAssets,
  EditWaterAssets,
} from './pages';
import { TrainingListPage } from './pages/TrainingListPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Assets Routes */}
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/:id" element={<AssetsDetails />} />
          <Route path="/assets/add" element={<AddAssets />} />
          <Route path="/assets/edit/:id" element={<EditAssets />} />

          {/* Space Management Routes */}
          <Route path="/space-management" element={<SpaceManagement />} />

          {/* Hotel Routes */}
          <Route path="/hotel-listing" element={<HotelListing />} />
          <Route path="/hotel-listing/:id" element={<HotelDetails />} />
          <Route path="/hotel-listing/add" element={<AddHotel />} />
          <Route path="/hotel-listing/edit/:id" element={<EditHotel />} />

          {/* Cost Centers Routes */}
          <Route path="/cost-centers" element={<CostCenters />} />
          <Route path="/cost-centers/add" element={<AddCostCenter />} />
          <Route path="/cost-centers/edit/:id" element={<EditCostCenter />} />

          {/* Invoice Routes */}
          <Route path="/invoices" element={<InvoiceListing />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/invoices/add" element={<AddInvoice />} />
          <Route path="/invoices/edit/:id" element={<EditInvoice />} />

          {/* Water Dashboard Routes */}
          <Route path="/water-dashboard" element={<WaterDashboard />} />

          {/* Water Assets Routes */}
          <Route path="/water-assets" element={<WaterAssets />} />
          <Route path="/water-assets/:id" element={<WaterAssetsDetails />} />
          <Route path="/water-assets/add" element={<AddWaterAssets />} />
          <Route path="/water-assets/edit/:id" element={<EditWaterAssets />} />
          <Route path="/training-list" element={<TrainingListPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
