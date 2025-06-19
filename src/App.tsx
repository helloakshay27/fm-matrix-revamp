import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import AddClientPage from './pages/AddClientPage';
import EditClientPage from './pages/EditClientPage';
import MaintenancePage from './pages/MaintenancePage';
import AddMaintenancePage from './pages/AddMaintenancePage';
import EditMaintenancePage from './pages/EditMaintenancePage';
import MaintenanceDetailsPage from './pages/MaintenanceDetailsPage';
import UsersPage from './pages/UsersPage';
import AddUserPage from './pages/AddUserPage';
import EditUserPage from './pages/EditUserPage';
import UserDetailsPage from './pages/UserDetailsPage';
import RolesPage from './pages/RolesPage';
import AddRolePage from './pages/AddRolePage';
import EditRolePage from './pages/EditRolePage';
import RoleDetailsPage from './pages/RoleDetailsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import UtilityPage from './pages/UtilityPage';
import WaterPage from './pages/WaterPage';
import AddWaterAssetPage from './pages/AddWaterAssetPage';
import { WaterAssetDetailsPage } from '@/pages/WaterAssetDetailsPage';
import { EditWaterAssetPage } from '@/pages/EditWaterAssetPage';
import { AssetDetailsPage } from './pages/AssetDetailsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailsPage />} />
          <Route path="/clients/add" element={<AddClientPage />} />
          <Route path="/clients/edit/:id" element={<EditClientPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/maintenance/add" element={<AddMaintenancePage />} />
          <Route path="/maintenance/edit/:id" element={<EditMaintenancePage />} />
          <Route path="/maintenance/:id" element={<MaintenanceDetailsPage />} />
          <Route path="/maintenance/asset" element={<AssetDetailsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/add" element={<AddUserPage />} />
          <Route path="/users/edit/:id" element={<EditUserPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/roles/add" element={<AddRolePage />} />
          <Route path="/roles/edit/:id" element={<EditRolePage />} />
          <Route path="/roles/:id" element={<RoleDetailsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/utility" element={<UtilityPage />} />
          <Route path="/utility/water" element={<WaterPage />} />
          <Route path="/utility/water/add" element={<AddWaterAssetPage />} />
          <Route path="/utility/water/details/:id" element={<WaterAssetDetailsPage />} />
          <Route path="/utility/water/edit/:id" element={<EditWaterAssetPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
