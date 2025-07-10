
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import AuditAssetDashboard from './pages/AuditAssetDashboard';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Sidebar />
          <Routes>
            <Route path="/" element={<div className="p-6" style={{ marginLeft: '16rem' }}><h1 className="text-2xl font-bold">Welcome to Asset Management</h1></div>} />
            <Route path="/maintenance/asset" element={<div className="p-6" style={{ marginLeft: '16rem' }}><h1 className="text-2xl font-bold">Asset List Dashboard</h1></div>} />
            <Route path="/maintenance/audit-asset" element={<AuditAssetDashboard />} />
            <Route path="/asset/:id" element={<AssetDetailsPage />} />
          </Routes>
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;
