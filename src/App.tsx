
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { MSafePage } from '@/pages/maintenance/MSafePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/maintenance/m-safe" element={<MSafePage />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
