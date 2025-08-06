
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from './components/Layout';
import { MasterLayout } from './components/MasterLayout';
import { Dashboard } from './pages/Dashboard';
import { TaskListDashboard } from './pages/TaskListDashboard';
import { AssetRegisterDashboard } from './pages/AssetRegisterDashboard';
import { PMSDashboard } from './pages/PMSDashboard';
import { AMCDashboard } from './pages/AMCDashboard';
import { ServiceMasterDashboard } from './pages/ServiceMasterDashboard';
import { WarrantyMasterDashboard } from './pages/WarrantyMasterDashboard';
import { VendorMasterDashboard } from './pages/VendorMasterDashboard';
import { AssetTaggingDashboard } from './pages/AssetTaggingDashboard';
import { MSafeDashboard } from './pages/MSafeDashboard';
import { MSafeUsersPage } from './pages/maintenance/MSafeUsersPage';
import { HelpdeskDashboard } from './pages/HelpdeskDashboard';
import { VisitorManagementDashboard } from './pages/VisitorManagementDashboard';
import { VisitorsHistoryDashboard } from './pages/VisitorsHistoryDashboard';
import { SetupDashboard } from './pages/SetupDashboard';
import { FMUsersDashboard } from './pages/settings/FMUsersDashboard';
import { BuildingPage } from './pages/master/BuildingPage';
import { WingPage } from './pages/master/WingPage';
import { AreaPage } from './pages/master/AreaPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pms" element={<PMSDashboard />} />
            <Route path="pms/task-list" element={<TaskListDashboard />} />
            <Route path="pms/asset-register" element={<AssetRegisterDashboard />} />
            <Route path="pms/amc" element={<AMCDashboard />} />
            <Route path="pms/service-master" element={<ServiceMasterDashboard />} />
            <Route path="pms/warranty-master" element={<WarrantyMasterDashboard />} />
            <Route path="pms/vendor-master" element={<VendorMasterDashboard />} />
            <Route path="pms/asset-tagging" element={<AssetTaggingDashboard />} />
            
            {/* Maintenance Routes */}
            <Route path="maintenance/m-safe" element={<MSafeDashboard />} />
            <Route path="maintenance/m-safe/users" element={<MSafeUsersPage />} />
            <Route path="maintenance/helpdesk" element={<HelpdeskDashboard />} />
            <Route path="maintenance/visitor-management" element={<VisitorManagementDashboard />} />
            <Route path="maintenance/visitor-management/history" element={<VisitorsHistoryDashboard />} />
            
            {/* Setup Routes */}
            <Route path="setup" element={<SetupDashboard />} />
            <Route path="settings/users/fm-users" element={<FMUsersDashboard />} />
          </Route>
          
          {/* Master Routes with MasterLayout */}
          <Route path="/master/*" element={<MasterLayout />}>
            <Route path="location/building" element={<BuildingPage />} />
            <Route path="location/wing" element={<WingPage />} />
            <Route path="location/area" element={<AreaPage />} />
            <Route path="user/fm-users" element={<FMUsersDashboard />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
