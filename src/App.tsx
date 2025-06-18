
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScheduleListDashboard } from './pages/ScheduleListDashboard';
import { TicketListDashboard } from './pages/TicketListDashboard';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { ViewSchedulePage } from './pages/ViewSchedulePage';
import { EditSchedulePage } from './pages/EditSchedulePage';
import { AddSchedulePage } from './pages/AddSchedulePage';
import { CopySchedulePage } from './pages/CopySchedulePage';
import { ViewPerformancePage } from './pages/ViewPerformancePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default redirect to ticket list */}
          <Route path="/" element={<Navigate to="/maintenance/ticket" replace />} />
          
          {/* Schedule routes */}
          <Route path="/maintenance/schedule" element={<ScheduleListDashboard />} />
          <Route path="/maintenance/schedule/add" element={<AddSchedulePage />} />
          <Route path="/maintenance/schedule/edit/:id" element={<EditSchedulePage />} />
          <Route path="/maintenance/schedule/copy/:id" element={<CopySchedulePage />} />
          <Route path="/maintenance/schedule/view/:id" element={<ViewSchedulePage />} />
          <Route path="/maintenance/schedule/performance/:id" element={<ViewPerformancePage />} />
          
          {/* Ticket routes */}
          <Route path="/maintenance/ticket" element={<TicketListDashboard />} />
          <Route path="/maintenance/ticket/:id" element={<TicketDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
