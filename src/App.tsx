
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';
import NotFound from './pages/NotFound';
import { AssetGroupsPage } from './pages/setup/AssetGroupsPage';
import { ApprovalMatrixPage } from './pages/settings/ApprovalMatrixPage';
import { AssetSetupApprovalMatrixPage } from './pages/setup/AssetSetupApprovalMatrixPage';
import { ChecklistGroupsPage } from './pages/settings/ChecklistGroupsPage';
import { EmailRulePage } from './pages/settings/EmailRulePage';
import { TaskEscalationPage } from './pages/settings/TaskEscalationPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="settings/asset-setup/asset-groups" element={<AssetGroupsPage />} />
            <Route path="settings/asset-setup/approval-matrix" element={<AssetSetupApprovalMatrixPage />} />
            <Route path="settings/approval-matrix" element={<ApprovalMatrixPage />} />
            <Route path="settings/checklist-setup/groups" element={<ChecklistGroupsPage />} />
            <Route path="settings/checklist-setup/email-rule" element={<EmailRulePage />} />
            <Route path="settings/checklist-setup/task-escalation" element={<TaskEscalationPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
