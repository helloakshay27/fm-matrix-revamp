
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { performanceRoutes } from '@/routes/performanceRoutes';
import { incidentRoutes } from '@/routes/incidentRoutes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <Routes>
            {/* Performance Routes */}
            {performanceRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            
            {/* Incident Routes */}
            {incidentRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            
            {/* Default Route */}
            <Route path="/" element={<div>Welcome to the Application</div>} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
