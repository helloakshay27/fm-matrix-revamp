
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { ScheduleDashboard } from './pages/ScheduleDashboard';
import { CopySchedulePage } from './pages/CopySchedulePage';
import { WODashboard } from './pages/WODashboard';
import { PatrollingDashboard } from './pages/PatrollingDashboard';
import { OccupantRequestDashboard } from './pages/OccupantRequestDashboard';
import { ScheduledTaskDashboard } from './pages/maintenance/ScheduledTaskDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

        {/* Schedule Routes */}
        <Route path="/finance/schedule" element={<Layout><ScheduleDashboard /></Layout>} />

        {/* Maintenance Routes */}
        <Route path="/maintenance/schedule" element={<Layout><ScheduleDashboard /></Layout>} />
        <Route path="/maintenance/schedule/copy/:id" element={<Layout><CopySchedulePage /></Layout>} />
        <Route path="/maintenance/task" element={<Layout><ScheduledTaskDashboard /></Layout>} />
        <Route path="/maintenance/work-order" element={<Layout><WODashboard /></Layout>} />
        <Route path="/maintenance/patrolling" element={<Layout><PatrollingDashboard /></Layout>} />
        <Route path="/maintenance/occupant-request" element={<Layout><OccupantRequestDashboard /></Layout>} />

        {/* Not Found Route */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
