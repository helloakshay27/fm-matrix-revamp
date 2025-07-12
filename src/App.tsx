
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { SetupLayout } from './components/SetupLayout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { AddFacilityBookingPage } from './pages/AddFacilityBookingPage';
import { ChecklistGroupDashboard } from './pages/setup/ChecklistGroupDashboard';
import { GroupsPage } from './pages/setup/GroupsPage';

const App = () => {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-facility-booking" element={<AddFacilityBookingPage />} />
          </Route>
          <Route path="/setup/*" element={<SetupLayout />}>
            <Route path="checklist-group" element={<ChecklistGroupDashboard />} />
            <Route path="groups" element={<GroupsPage />} />
          </Route>
          <Route path="/settings/checklist-setup/group" element={<GroupsPage />} />
        </Routes>
      </Router>
    </LayoutProvider>
  );
};

export default App;
