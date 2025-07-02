import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SetupLayout } from '@/components/SetupLayout';
import { Index } from '@/pages/Index';
import { NotFound } from '@/pages/NotFound';
import { MarketPlaceInstalledPage } from '@/pages/MarketPlaceInstalledPage';
import { MarketPlaceAllPage } from '@/pages/MarketPlaceAllPage';
import { MarketPlaceUpdatesPage } from '@/pages/MarketPlaceUpdatesPage';
import { MarketPlaceAccountingPage } from '@/pages/MarketPlaceAccountingPage';
import { MarketPlaceAccountingDetailsPage } from '@/pages/MarketPlaceAccountingDetailsPage';
import { MarketPlaceAccountingEditPage } from '@/pages/MarketPlaceAccountingEditPage';
import { MarketPlaceCostCenterPage } from '@/pages/MarketPlaceCostCenterPage';
import { LeaseManagementDetailPage } from '@/pages/LeaseManagementDetailPage';
import { LoyaltyRuleEngineDetailPage } from '@/pages/LoyaltyRuleEngineDetailPage';
import { LoyaltyRuleEngineDashboard } from '@/pages/LoyaltyRuleEngineDashboard';
import { TaskDashboard } from '@/pages/TaskDashboard';
import { TaskDetailsPage } from '@/pages/TaskDetailsPage';
import { TaskListDashboard } from '@/pages/TaskListDashboard';
import { SetupWizardPage } from './pages/SetupWizardPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDetailsPage } from './pages/ClientDetailsPage';
import { ClientEditPage } from './pages/ClientEditPage';
import { AddClientPage } from './pages/AddClientPage';
import { AddUserPage } from './pages/AddUserPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { UserEditPage } from './pages/UserEditPage';
import { UsersPage } from './pages/UsersPage';
import { RolesPage } from './pages/RolesPage';
import { RoleDetailsPage } from './pages/RoleDetailsPage';
import { RoleEditPage } from './pages/RoleEditPage';
import { AddRolePage } from './pages/AddRolePage';
import { PermissionsPage } from './pages/PermissionsPage';
import { PermissionDetailsPage } from './pages/PermissionDetailsPage';
import { PermissionEditPage } from './pages/PermissionEditPage';
import { AddPermissionPage } from './pages/AddPermissionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Market Place Routes */}
        <Route path="/market-place/installed" element={<Layout><MarketPlaceInstalledPage /></Layout>} />
        <Route path="/market-place/all" element={<Layout><MarketPlaceAllPage /></Layout>} />
        <Route path="/market-place/updates" element={<Layout><MarketPlaceUpdatesPage /></Layout>} />
        <Route path="/market-place/accounting" element={<Layout><MarketPlaceAccountingPage /></Layout>} />
        <Route path="/market-place/accounting/details/:id" element={<Layout><MarketPlaceAccountingDetailsPage /></Layout>} />
        <Route path="/market-place/accounting/edit/:id" element={<Layout><MarketPlaceAccountingEditPage /></Layout>} />
        <Route path="/market-place/cost-center" element={<Layout><MarketPlaceCostCenterPage /></Layout>} />
        <Route path="/market-place/lease-management" element={<Layout><LeaseManagementDetailPage /></Layout>} />
        <Route path="/market-place/loyalty-rule-engine" element={<Layout><LoyaltyRuleEngineDetailPage /></Layout>} />
        <Route path="/create-rule-engine" element={<Layout><LoyaltyRuleEngineDashboard /></Layout>} />
        
        {/* Task Management Routes */}
        <Route path="/maintenance/task" element={<Layout><TaskDashboard /></Layout>} />
        <Route path="/maintenance/task/details/:id" element={<Layout><TaskDetailsPage /></Layout>} />
        <Route path="/maintenance/task/list" element={<Layout><TaskListDashboard /></Layout>} />
        
        {/* Setup Routes */}
        <Route path="/setup" element={<SetupLayout><SetupWizardPage /></SetupLayout>} />

        {/* Clients Routes */}
        <Route path="/clients" element={<Layout><ClientsPage /></Layout>} />
        <Route path="/clients/details/:id" element={<Layout><ClientDetailsPage /></Layout>} />
        <Route path="/clients/edit/:id" element={<Layout><ClientEditPage /></Layout>} />
        <Route path="/clients/add" element={<Layout><AddClientPage /></Layout>} />

        {/* Users Routes */}
        <Route path="/users" element={<Layout><UsersPage /></Layout>} />
        <Route path="/users/add" element={<Layout><AddUserPage /></Layout>} />
        <Route path="/users/profile/:id" element={<Layout><UserProfilePage /></Layout>} />
        <Route path="/users/edit/:id" element={<Layout><UserEditPage /></Layout>} />

        {/* Roles Routes */}
        <Route path="/roles" element={<Layout><RolesPage /></Layout>} />
        <Route path="/roles/details/:id" element={<Layout><RoleDetailsPage /></Layout>} />
        <Route path="/roles/edit/:id" element={<Layout><RoleEditPage /></Layout>} />
        <Route path="/roles/add" element={<Layout><AddRolePage /></Layout>} />

        {/* Permissions Routes */}
        <Route path="/permissions" element={<Layout><PermissionsPage /></Layout>} />
        <Route path="/permissions/details/:id" element={<Layout><PermissionDetailsPage /></Layout>} />
        <Route path="/permissions/edit/:id" element={<Layout><PermissionEditPage /></Layout>} />
        <Route path="/permissions/add" element={<Layout><AddPermissionPage /></Layout>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
