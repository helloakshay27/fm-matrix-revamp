import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { SetupLayout } from './components/SetupLayout';

// Import all pages
import { Index } from './pages/Index';
import { NotFound } from './pages/NotFound';

// Asset Management
import { AssetDashboard } from './pages/AssetDashboard';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import { AddAssetPage } from './pages/AddAssetPage';
import { AddAssetDashboard } from './pages/AddAssetDashboard';
import { InActiveAssetsDashboard } from './pages/InActiveAssetsDashboard';

// Utility
import { UtilityDashboard } from './pages/UtilityDashboard';
import { AddEnergyAssetDashboard } from './pages/AddEnergyAssetDashboard';
import { UtilityConsumptionDashboard } from './pages/UtilityConsumptionDashboard';
import { UtilityDailyReadingsDashboard } from './pages/UtilityDailyReadingsDashboard';
import { UtilityEVConsumptionDashboard } from './pages/UtilityEVConsumptionDashboard';
import { UtilityRequestDashboard } from './pages/UtilityRequestDashboard';
import { UtilitySTPDashboard } from './pages/UtilitySTPDashboard';
import { AddSTPAssetDashboard } from './pages/AddSTPAssetDashboard';
import { UtilitySolarGeneratorDashboard } from './pages/UtilitySolarGeneratorDashboard';
import { UtilityWasteGenerationDashboard } from './pages/UtilityWasteGenerationDashboard';
import { UtilityWasteGenerationSetupDashboard } from './pages/UtilityWasteGenerationSetupDashboard';
import { UtilityWaterDashboard } from './pages/UtilityWaterDashboard';
import { AddWaterAssetDashboard } from './pages/AddWaterAssetDashboard';
import { SettingsDashboard } from './pages/SettingsDashboard';
import { ProfileDashboard } from './pages/ProfileDashboard';
import { UsersDashboard } from './pages/UsersDashboard';
import { AddUserDashboard } from './pages/AddUserDashboard';
import { RolesDashboard } from './pages/RolesDashboard';
import { AddRoleDashboard } from './pages/AddRoleDashboard';
import { AuthGuard } from './components/AuthGuard';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Setup } from './pages/Setup';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Setup route */}
          <Route path="/setup" element={<Setup />} />

          {/* Main application routes with layout */}
          <Route path="/*" element={<Layout />}>
            {/* Asset Management */}
            <Route path="assets" element={<AssetDashboard />} />
            <Route path="assets/:id" element={<AssetDetailsPage />} />
            <Route path="assets/add" element={<AddAssetPage />} />
            <Route path="asset/add" element={<AddAssetDashboard />} />
            <Route path="utility/inactive-assets" element={<InActiveAssetsDashboard />} />
            
            {/* Utility - Energy */}
            <Route path="utility/energy" element={<UtilityDashboard />} />
            <Route path="utility/energy/add-asset" element={<AddEnergyAssetDashboard />} />
            <Route path="utility/consumption" element={<UtilityConsumptionDashboard />} />
            <Route path="utility/daily-readings" element={<UtilityDailyReadingsDashboard />} />
            <Route path="utility/ev-consumption" element={<UtilityEVConsumptionDashboard />} />
            <Route path="utility/request" element={<UtilityRequestDashboard />} />
            
            {/* Utility - STP */}
            <Route path="utility/stp" element={<UtilitySTPDashboard />} />
            <Route path="utility/stp/add-asset" element={<AddSTPAssetDashboard />} />
            
            {/* Utility - Solar */}
            <Route path="utility/solar-generator" element={<UtilitySolarGeneratorDashboard />} />
            
            {/* Utility - Waste */}
            <Route path="utility/waste-generation" element={<UtilityWasteGenerationDashboard />} />
            <Route path="utility/waste-generation-setup" element={<UtilityWasteGenerationSetupDashboard />} />
            
            {/* Utility - Water */}
            <Route path="utility/water" element={<UtilityWaterDashboard />} />
            <Route path="utility/water/add-asset" element={<AddWaterAssetDashboard />} />
          
             {/* Settings and Profile */}
             <Route path="settings" element={<SettingsDashboard />} />
             <Route path="profile" element={<ProfileDashboard />} />
           
             {/* Users and Roles - accessible only with authentication */}
             <Route path="users" element={<AuthGuard><UsersDashboard /></AuthGuard>} />
             <Route path="users/add" element={<AuthGuard><AddUserDashboard /></AuthGuard>} />
             <Route path="roles" element={<AuthGuard><RolesDashboard /></AuthGuard>} />
             <Route path="roles/add" element={<AuthGuard><AddRoleDashboard /></AuthGuard>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
