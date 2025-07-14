
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SeatSetupDashboard } from './pages/setup/SeatSetupDashboard';
import { AddSeatSetupDashboard } from './pages/setup/AddSeatSetupDashboard';
import { SeatSetup } from './pages/settings/vas/space-management/SeatSetup';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50">
          <Header />
          <Sidebar />
          <main className="flex-1 ml-64 mt-16">
            <Routes>
              <Route path="/" element={<Navigate to="/vas/space-management/setup/seat-setup" replace />} />
              <Route path="/vas/space-management/setup/seat-setup" element={<SeatSetupDashboard />} />
              <Route path="/vas/space-management/setup/seat-setup/add" element={<AddSeatSetupDashboard />} />
              <Route path="/vas/space-management/setup/seat-setup/edit/:id" element={<AddSeatSetupDashboard />} />
              <Route path="/settings/vas/space-management/seat-setup" element={<SeatSetup />} />
              <Route path="/settings/vas/mom/client-tag-setup" element={<div className="p-6"><h1 className="text-2xl font-bold">Client Tag Setup</h1></div>} />
              <Route path="/settings/vas/mom/product-tag-setup" element={<div className="p-6"><h1 className="text-2xl font-bold">Product Tag Setup</h1></div>} />
              <Route path="/settings/vas/booking/setup" element={<div className="p-6"><h1 className="text-2xl font-bold">Booking Setup</h1></div>} />
              <Route path="/settings/vas/parking-management/parking-category" element={<div className="p-6"><h1 className="text-2xl font-bold">Parking Category</h1></div>} />
              <Route path="/settings/vas/parking-management/slot-configuration" element={<div className="p-6"><h1 className="text-2xl font-bold">Slot Configuration</h1></div>} />
              <Route path="/settings/vas/parking-management/time-slot-setup" element={<div className="p-6"><h1 className="text-2xl font-bold">Time Slot Setup</h1></div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;
