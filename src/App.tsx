import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './layout';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { ScheduleDashboard } from './pages/ScheduleDashboard';
import { CopySchedulePage } from './pages/CopySchedulePage';
import { AddTaskDashboard } from './pages/AddTaskDashboard';
import { TaskDetailsDashboard } from './pages/TaskDetailsDashboard';
import { EditTaskDashboard } from './pages/EditTaskDashboard';
import { WODashboard } from './pages/WODashboard';
import { AddWODashboard } from './pages/AddWODashboard';
import { EditWODashboard } from './pages/EditWODashboard';
import { PreventiveDashboard } from './pages/PreventiveDashboard';
import { AddPreventiveDashboard } from './pages/AddPreventiveDashboard';
import { EditPreventiveDashboard } from './pages/EditPreventiveDashboard';
import { PatrollingDashboard } from './pages/PatrollingDashboard';
import { AddPatrollingDashboard } from './pages/AddPatrollingDashboard';
import { EditPatrollingDashboard } from './pages/EditPatrollingDashboard';
import { OccupantRequestDashboard } from './pages/OccupantRequestDashboard';
import { AddOccupantRequestDashboard } from './pages/AddOccupantRequestDashboard';
import { EditOccupantRequestDashboard } from './pages/EditOccupantRequestDashboard';
import { Layout } from './components/layout/Layout';
import { QueryClient } from './query-client';
import { ScheduledTaskDashboard } from './pages/maintenance/ScheduledTaskDashboard';

function App() {
  return (
    <QueryClient>
      <LayoutProvider>
        <BrowserRouter>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

            {/* Schedule Routes */}
            <Route path="/finance" element={<Layout><div /></Layout>}>
              <Route path="/finance/schedule" element={<ScheduleDashboard />} />
            </Route>

            {/* Maintenance Routes */}
            <Route path="/maintenance" element={<Layout><div /></Layout>}>
              <Route path="/maintenance/schedule" element={<ScheduleDashboard />} />
              <Route path="/maintenance/schedule/copy/:id" element={<CopySchedulePage />} />
              <Route path="/maintenance/task" element={<ScheduledTaskDashboard />} />
              <Route path="/maintenance/task/add" element={<AddTaskDashboard />} />
              <Route path="/maintenance/task/details/:id" element={<TaskDetailsDashboard />} />
              <Route path="/maintenance/task/edit/:id" element={<EditTaskDashboard />} />
              <Route path="/maintenance/work-order" element={<WODashboard />} />
              <Route path="/maintenance/work-order/add" element={<AddWODashboard />} />
              <Route path="/maintenance/work-order/edit/:id" element={<EditWODashboard />} />
              <Route path="/maintenance/preventive" element={<PreventiveDashboard />} />
              <Route path="/maintenance/preventive/add" element={<AddPreventiveDashboard />} />
              <Route path="/maintenance/preventive/edit/:id" element={<EditPreventiveDashboard />} />
              <Route path="/maintenance/patrolling" element={<PatrollingDashboard />} />
              <Route path="/maintenance/patrolling/add" element={<AddPatrollingDashboard />} />
              <Route path="/maintenance/patrolling/edit/:id" element={<EditPatrollingDashboard />} />
              <Route path="/maintenance/occupant-request" element={<OccupantRequestDashboard />} />
              <Route path="/maintenance/occupant-request/add" element={<AddOccupantRequestDashboard />} />
              <Route path="/maintenance/occupant-request/edit/:id" element={<EditOccupantRequestDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </LayoutProvider>
    </QueryClient>
  );
}

export default App;
