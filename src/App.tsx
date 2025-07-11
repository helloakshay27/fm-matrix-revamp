
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChecklistGroupDashboard } from './pages/setup/ChecklistGroupDashboard';
import { ChecklistMasterDashboard } from './pages/ChecklistMasterDashboard';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Sidebar />
          <Routes>
            <Route path="/" element={<ChecklistGroupDashboard />} />
            <Route path="/settings/checklist-setup/group" element={<ChecklistGroupDashboard />} />
            <Route path="/settings/masters/checklist" element={<ChecklistMasterDashboard />} />
            <Route path="/settings/masters/checklist-master/add" element={<div>Add Checklist Master</div>} />
            <Route path="/settings/masters/checklist-master/edit/:id" element={<div>Edit Checklist Master</div>} />
            <Route path="/settings/masters/checklist-master/view/:id" element={<div>View Checklist Master</div>} />
          </Routes>
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;
