
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import Layout from './components/Layout';
import GroupsPage from './pages/setup/GroupsPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="settings/checklist-setup/group" element={<GroupsPage />} />
          </Route>
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
