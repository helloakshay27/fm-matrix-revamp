import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RedemptionMarketplacePage } from './pages/RedemptionMarketplacePage';
import { HotelRewardsPage } from './pages/HotelRewardsPage';
import { FnBDiscountsPage } from './pages/FnBDiscountsPage';
import { TicketDiscountsPage } from './pages/TicketDiscountsPage';
import { HotelDetailsPage } from './pages/HotelDetailsPage';
import { HotelBookingPage } from './pages/HotelBookingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Hotel booking flow routes */}
        <Route path="/vas/hotels/details" element={<HotelDetailsPage />} />
        <Route path="/vas/hotels/booking" element={<HotelBookingPage />} />
        
        {/* Existing VAS routes */}
        <Route path="/vas/hotels/rewards" element={<HotelRewardsPage />} />
        <Route path="/vas/fnb/discounts" element={<FnBDiscountsPage />} />
        <Route path="/vas/tickets/discounts" element={<TicketDiscountsPage />} />
        <Route path="/vas/redemption-marketplace" element={<RedemptionMarketplacePage />} />
        
        {/* Handle the typo URL */}
        <Route path="/vas/redemonection-marketplace" element={<Navigate to="/vas/redemption-marketplace" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
