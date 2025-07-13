
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SetupSidebar } from './components/SetupSidebar';
import { TicketManagementSetupPage } from './pages/maintenance/TicketManagementSetupPage';
import { EscalationMatrixPage } from './pages/maintenance/EscalationMatrixPage';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#f6f4ee]">
        <SetupSidebar />
        
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Navigate to="/setup/ticket/setup" replace />} />
            <Route path="/setup/ticket/setup" element={<TicketManagementSetupPage />} />
            <Route path="/setup/ticket/escalation" element={<EscalationMatrixPage />} />
            
            {/* Placeholder routes for sidebar links */}
            <Route path="/setup/location/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Location Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/user-role/*" element={<div className="p-6"><h1 className="text-2xl font-bold">User Role Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/fm-user" element={<div className="p-6"><h1 className="text-2xl font-bold">FM User Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/occupant-users" element={<div className="p-6"><h1 className="text-2xl font-bold">Occupant Users Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/meter-type" element={<div className="p-6"><h1 className="text-2xl font-bold">Meter Type Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/asset-groups" element={<div className="p-6"><h1 className="text-2xl font-bold">Asset Groups Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/checklist-group" element={<div className="p-6"><h1 className="text-2xl font-bold">Checklist Group Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/ticket/cost-approval" element={<div className="p-6"><h1 className="text-2xl font-bold">Cost Approval Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/task-escalation" element={<div className="p-6"><h1 className="text-2xl font-bold">Task Escalation Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/approval-matrix" element={<div className="p-6"><h1 className="text-2xl font-bold">Approval Matrix Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/patrolling-approval" element={<div className="p-6"><h1 className="text-2xl font-bold">Patrolling Approval Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/email-rule" element={<div className="p-6"><h1 className="text-2xl font-bold">Email Rule Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/fm-group" element={<div className="p-6"><h1 className="text-2xl font-bold">FM Group Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/master-checklist" element={<div className="p-6"><h1 className="text-2xl font-bold">Master Checklist Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/sac-hsn-setup" element={<div className="p-6"><h1 className="text-2xl font-bold">SAC/HSN Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/address" element={<div className="p-6"><h1 className="text-2xl font-bold">Address Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/tag" element={<div className="p-6"><h1 className="text-2xl font-bold">Tag Setup</h1><p>This section is under development.</p></div>} />
            <Route path="/setup/export" element={<div className="p-6"><h1 className="text-2xl font-bold">Export Setup</h1><p>This section is under development.</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
