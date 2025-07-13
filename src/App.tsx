
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { SetupLayout } from './components/SetupLayout';
import { HomePage } from './pages/HomePage';
import NotFound from './pages/NotFound';
import ApprovalMatrixSetupPage from './pages/settings/ApprovalMatrixSetupPage';
import { AssetGroupsPage } from './pages/settings/AssetGroupsPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/settings/approval-matrix/setup" element={<ApprovalMatrixSetupPage />} />
            <Route path="/settings/asset-setup/asset-groups" element={<AssetGroupsPage />} />
          </Route>
          <Route path="/setup" element={<SetupLayout />}>
            {/* Setup routes can go here if needed */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
