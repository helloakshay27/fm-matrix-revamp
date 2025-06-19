
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { Toaster } from './components/ui/toaster';

// Import existing pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Settings pages
import { DepartmentDashboard } from './pages/setup/DepartmentDashboard';
import { RoleDashboard } from './pages/setup/RoleDashboard';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          
          {/* Settings Routes */}
          <Route path="/settings/roles/department" element={<Layout><DepartmentDashboard /></Layout>} />
          <Route path="/settings/roles/role" element={<Layout><RoleDashboard /></Layout>} />
          
          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </LayoutProvider>
  );
}

export default App;
