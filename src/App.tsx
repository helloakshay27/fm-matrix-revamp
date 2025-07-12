
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { NotFound } from './pages/NotFound';
import { ScheduledTaskDashboard } from './pages/maintenance/ScheduledTaskDashboard';
import { TaskDetailsPage } from './pages/TaskDetailsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="maintenance/task" element={<ScheduledTaskDashboard />} />
            <Route path="task-details/:id" element={<TaskDetailsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
