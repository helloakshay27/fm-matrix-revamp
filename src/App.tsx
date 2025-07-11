
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { LayoutProvider } from './contexts/LayoutContext';
import { BookingSetupDashboard } from './pages/BookingSetupDashboard';
import { BookingListDashboard } from './pages/BookingListDashboard';
import { FacilityBooking } from './pages/FacilityBooking';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 ml-64 overflow-auto">
            <Routes>
              <Route path="/" element={<div className="p-6"><h1 className="text-2xl font-bold">Welcome to Facility Management</h1></div>} />
              <Route path="/vas/booking/setup" element={<BookingSetupDashboard />} />
              <Route path="/vas/booking/list" element={<BookingListDashboard />} />
              <Route path="/vas/booking/add" element={<FacilityBooking />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;
