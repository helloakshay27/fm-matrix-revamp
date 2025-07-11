
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { LayoutProvider } from './contexts/LayoutContext';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import RoleList from './pages/RoleList';
import BookingList from './pages/BookingList';
import BookingSetupList from './pages/BookingSetupList';
import AddRole from './pages/AddRole';
import AddUser from './pages/AddUser';
import BookingListDashboard from './pages/BookingListDashboard';
import { BookingSetupForm } from './components/BookingSetupForm';
import FacilityBooking from './pages/FacilityBooking';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/roles" element={<RoleList />} />
                <Route path="/bookings" element={<BookingList />} />
                <Route path="/booking-setups" element={<BookingSetupList />} />
                <Route path="/add-role" element={<AddRole />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/vas/booking/list" element={<BookingListDashboard />} />
                <Route path="/vas/booking/setup" element={<BookingSetupForm onClose={() => {}} />} />
                <Route path="/vas/booking/add" element={<FacilityBooking />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;
