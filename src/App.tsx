
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PMSPage } from '@/pages/PMSPage';
import { NewTicketPage } from '@/pages/NewTicketPage';
import { TicketDetailsPage } from '@/pages/TicketDetailsPage';
import { MyTasksPage } from '@/pages/MyTasksPage';
import { TaskDetailsPage } from '@/pages/TaskDetailsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { TicketSummaryPage } from '@/pages/TicketSummaryPage';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { MSafeDashboard } from '@/pages/MSafeDashboard';
import { MSafeUserDetailsPage } from '@/pages/MSafeUserDetailsPage';
import { SafetyPage } from '@/pages/SafetyPage';
import { NonFTEUsersPage } from '@/pages/NonFTEUsersPage';
import { KRCCFormListPage } from '@/pages/KRCCFormListPage';
import { EnergyPage } from '@/pages/EnergyPage';
import { EnergyAssetsPage } from '@/pages/EnergyAssetsPage';
import { EnergyAssetDetailsPage } from '@/pages/EnergyAssetDetailsPage';
import { NewAssetPage } from '@/pages/NewAssetPage';
import { AssetAllocationPage } from '@/pages/AssetAllocationPage';
import { MasterPage } from '@/pages/MasterPage';
import { FMUsersPage } from '@/pages/master/FMUsersPage';
import { AddFMUserPage } from '@/pages/master/AddFMUserPage';
import { EditFMUserPage } from '@/pages/master/EditFMUserPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="pms" element={<PMSPage />} />
              <Route path="pms/new-ticket" element={<NewTicketPage />} />
              <Route path="pms/ticket/:id" element={<TicketDetailsPage />} />
              <Route path="my-tasks" element={<MyTasksPage />} />
              <Route path="my-tasks/:taskId" element={<TaskDetailsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="reports/ticket-summary" element={<TicketSummaryPage />} />
              
              {/* Maintenance Routes */}
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="maintenance/m-safe" element={<MSafeDashboard />} />
              <Route path="maintenance/m-safe/user/:userId" element={<MSafeUserDetailsPage />} />
              
              {/* Safety Routes */}
              <Route path="safety" element={<SafetyPage />} />
              <Route path="safety/m-safe" element={<MSafeDashboard />} />
              <Route path="safety/m-safe/non-fte-users" element={<NonFTEUsersPage />} />
              <Route path="safety/m-safe/krcc-form-list" element={<KRCCFormListPage />} />
              
              {/* Energy Routes */}
              <Route path="energy" element={<EnergyPage />} />
              <Route path="energy/assets" element={<EnergyAssetsPage />} />
              <Route path="energy/assets/:assetId" element={<EnergyAssetDetailsPage />} />
              <Route path="energy/new-asset" element={<NewAssetPage />} />
              <Route path="energy/allocation" element={<AssetAllocationPage />} />
              
              {/* Master Routes */}
              <Route path="master" element={<MasterPage />} />
              <Route path="master/user/fm-users" element={<FMUsersPage />} />
              <Route path="master/user/fm-users/add" element={<AddFMUserPage />} />
              <Route path="master/user/fm-users/edit/:id" element={<EditFMUserPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
