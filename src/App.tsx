
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { RedemptionMarketplacePage } from '@/pages/RedemptionMarketplacePage';
import { HotelRewardsPage } from '@/pages/HotelRewardsPage';
import { HotelDetailsPage } from '@/pages/HotelDetailsPage';
import { HotelBookingPage } from '@/pages/HotelBookingPage';
import { FnBDiscountsPage } from '@/pages/FnBDiscountsPage';
import { FnBDetailsPage } from '@/pages/FnBDetailsPage';
import { TicketDiscountsPage } from '@/pages/TicketDiscountsPage';
import { TicketDetailsPage } from '@/pages/TicketDetailsPage';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<RedemptionMarketplacePage />} />
            <Route path="/vas/redemption-marketplace" element={<RedemptionMarketplacePage />} />
            <Route path="/vas/hotels" element={<HotelRewardsPage />} />
            <Route path="/vas/hotels/details" element={<HotelDetailsPage />} />
            <Route path="/vas/hotels/booking" element={<HotelBookingPage />} />
            <Route path="/vas/fnb" element={<FnBDiscountsPage />} />
            <Route path="/vas/fnb/details" element={<FnBDetailsPage />} />
            <Route path="/vas/tickets" element={<TicketDiscountsPage />} />
            <Route path="/vas/tickets/details" element={<TicketDetailsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
