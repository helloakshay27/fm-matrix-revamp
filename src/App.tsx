
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { EmailRulePage } from './pages/settings/EmailRulePage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/settings/checklist-setup/email-rule" element={<EmailRulePage />} />
          </Routes>
        </Layout>
      </Router>
    </LayoutProvider>
  );
}

export default App;
