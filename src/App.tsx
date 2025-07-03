import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';

import { IncidentListDashboard } from './pages/IncidentListDashboard';
import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
import { AddIncidentPage } from './pages/AddIncidentPage';
import { EditIncidentDetailsPage } from './pages/EditIncidentDetailsPage';
import { PermitListDashboard } from './pages/PermitListDashboard';
import { PermitPendingApprovalsDashboard } from './pages/PermitPendingApprovalsDashboard';
import { PermitSetupDashboard } from './pages/PermitSetupDashboard';
import { AddPermitPage } from './pages/AddPermitPage';
import { MSafeDashboard } from './pages/MSafeDashboard';
import { TrainingListDashboard } from './pages/TrainingListDashboard';
import { AddTrainingRecordDashboard } from './pages/AddTrainingRecordDashboard';
import { TrainingRecordDetailsPage } from './pages/TrainingRecordDetailsPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/safety/incident" element={<IncidentListDashboard />} />
            <Route path="/safety/incident/:id" element={<IncidentDetailsPage />} />
            <Route path="/safety/incident/add" element={<AddIncidentPage />} />
            <Route path="/safety/incident/edit/:id" element={<EditIncidentDetailsPage />} />
            <Route path="/safety/permit" element={<PermitListDashboard />} />
            <Route path="/safety/permit/pending" element={<PermitPendingApprovalsDashboard />} />
            <Route path="/safety/permit/setup" element={<PermitSetupDashboard />} />
            <Route path="/safety/permit/add" element={<AddPermitPage />} />
            <Route path="/safety/m-safe" element={<MSafeDashboard />} />
            <Route path="/safety/training-list" element={<TrainingListDashboard />} />
            <Route path="/safety/training-list/add" element={<AddTrainingRecordDashboard />} />
            <Route path="/safety/training-list/:id" element={<TrainingRecordDetailsPage />} />
            <Route path="/safety/training-list/edit/:id" element={<AddTrainingRecordDashboard />} />
          </Route>
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
