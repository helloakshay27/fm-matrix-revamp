
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { DynamicHeader } from './components/DynamicHeader';
import { Sidebar } from './components/Sidebar';
import { ApprovalMatrixDashboard } from './pages/settings/ApprovalMatrixDashboard';
import { AssetSetupApprovalMatrix } from './pages/settings/AssetSetupApprovalMatrix';
import { AssetGroups } from './pages/settings/AssetGroups';

const HomePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Welcome to Facility Management</h1>
    <p className="text-gray-600">Select a module from the sidebar to get started.</p>
  </div>
);

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-gray-600">This page is under construction.</p>
  </div>
);

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <DynamicHeader />
          <div className="flex pt-12">
            <Sidebar />
            <main className="flex-1 ml-64 pt-12">
              <Routes>
                <Route path="/" element={<HomePage />} />
                
                {/* Settings Routes */}
                <Route path="/settings/approval-matrix" element={<ApprovalMatrixDashboard />} />
                <Route path="/settings/asset-setup/approval-matrix" element={<AssetSetupApprovalMatrix />} />
                <Route path="/settings/asset-setup/groups" element={<AssetGroups />} />
                
                {/* Placeholder routes for other sections */}
                <Route path="/transitioning/*" element={<PlaceholderPage title="Transitioning" />} />
                <Route path="/maintenance/*" element={<PlaceholderPage title="Maintenance" />} />
                <Route path="/safety/*" element={<PlaceholderPage title="Safety" />} />
                <Route path="/finance/*" element={<PlaceholderPage title="Finance" />} />
                <Route path="/crm/*" element={<PlaceholderPage title="CRM" />} />
                <Route path="/utility/*" element={<PlaceholderPage title="Utility" />} />
                <Route path="/security/*" element={<PlaceholderPage title="Security" />} />
                <Route path="/vas/*" element={<PlaceholderPage title="Value Added Services" />} />
                <Route path="/market-place/*" element={<PlaceholderPage title="Market Place" />} />
                <Route path="/settings/*" element={<PlaceholderPage title="Settings" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;
