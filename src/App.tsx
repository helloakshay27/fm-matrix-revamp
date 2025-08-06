
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TicketsPage from './pages/TicketsPage';
import TicketDetails from './pages/TicketDetails';
import CreateTicket from './pages/CreateTicket';
import TasksPage from './pages/TasksPage';
import MaintenancePage from './pages/MaintenancePage';
import MSafeDashboard from './pages/MSafeDashboard';
import { MSafeUserDetailsPage } from './pages/MSafeUserDetailsPage';
import TaskDetails from './pages/TaskDetails';
import SafetyMainPage from './pages/SafetyMainPage';
import { SafetyDashboard } from './pages/SafetyDashboard';
import MeterReadingsPage from './pages/MeterReadingsPage';
import NonFTEUsersPage from './pages/NonFTEUsersPage';
import KRCCFormsPage from './pages/KRCCFormsPage';
import AuditPage from './pages/AuditPage';
import CompliancePage from './pages/CompliancePage';
import SparePartsPage from './pages/SparePartsPage';
import PMSPage from './pages/PMSPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tickets/:id" element={<TicketDetails />} />
              <Route path="tickets/create" element={<CreateTicket />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="tasks/:id" element={<TaskDetails />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="maintenance/m-safe" element={<MSafeDashboard />} />
              <Route path="maintenance/m-safe/user/:userId" element={<MSafeUserDetailsPage />} />
              <Route path="maintenance/meter-readings" element={<MeterReadingsPage />} />
              <Route path="maintenance/spare-parts" element={<SparePartsPage />} />
              <Route path="maintenance/pms" element={<PMSPage />} />
              <Route path="safety" element={<SafetyMainPage />} />
              <Route path="safety/dashboard" element={<SafetyDashboard />} />
              <Route path="safety/m-safe" element={<MSafeDashboard />} />
              <Route path="safety/m-safe/non-fte-users" element={<NonFTEUsersPage />} />
              <Route path="safety/m-safe/krcc-form-list" element={<KRCCFormsPage />} />
              <Route path="audit" element={<AuditPage />} />
              <Route path="compliance" element={<CompliancePage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
