
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import HomePage from './pages/HomePage';
import AssetListDashboard from './pages/AssetListDashboard';
import AssetDetailsPage from './pages/AssetDetailsPage';
import AuditAssetDashboard from './pages/AuditAssetDashboard';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Sidebar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/maintenance/asset" element={<AssetListDashboard />} />
            <Route path="/maintenance/audit-asset" element={<AuditAssetDashboard />} />
            <Route path="/asset/:id" element={<AssetDetailsPage />} />
          </Routes>
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;
