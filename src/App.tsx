
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { Index } from './pages/Index';
import NotFound from './pages/NotFound';
import { WBSElementDashboard } from './pages/WBSElementDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="finance/wbs" element={<WBSElementDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
