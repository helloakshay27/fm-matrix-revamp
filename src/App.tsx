
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import AuditAssetPage from './pages/AuditAssetPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<div className="p-6"><h1 className="text-2xl font-bold">Welcome to Facility Management</h1></div>} />
          <Route path="/maintenance/asset" element={<div className="p-6"><h1 className="text-2xl font-bold">Assets Dashboard</h1></div>} />
          <Route path="/maintenance/audit-asset" element={<AuditAssetPage />} />
          <Route path="/maintenance/asset/details/:id" element={<AssetDetailsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
