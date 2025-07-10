
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';
import { NotFound } from './pages/NotFound';
import { AssetGroupsPage } from './pages/setup/AssetGroupsPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="settings/asset-setup/asset-groups" element={<AssetGroupsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
