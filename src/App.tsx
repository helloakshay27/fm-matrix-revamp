
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { SetupLayout } from './components/SetupLayout';
import { HomePage } from './pages/HomePage';
import NotFound from './pages/NotFound';
import ApprovalMatrixSetupPage from './pages/settings/ApprovalMatrixSetupPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          {/* Setup routes - these use SetupLayout */}
          <Route path="/setup" element={<SetupLayout><div /></SetupLayout>}>
            <Route path="approval-matrix/setup" element={<ApprovalMatrixSetupPage />} />
          </Route>
          
          {/* Settings routes - these use the main Layout */}
          <Route path="/settings/approval-matrix/setup" element={<Layout><ApprovalMatrixSetupPage /></Layout>} />
          
          {/* Main application routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          
          {/* Catch all - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
