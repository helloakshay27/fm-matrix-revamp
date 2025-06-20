
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutProvider } from './contexts/LayoutContext';
import { Toaster } from "@/components/ui/sonner";
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { FnBRestaurantDashboard } from './pages/FnBRestaurantDashboard';
import { RestaurantDetailsPage } from './pages/RestaurantDetailsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Value Added Services Routes */}
              <Route path="/vas/fnb" element={<FnBRestaurantDashboard />} />
              <Route path="/vas/fnb/details/:id" element={<RestaurantDetailsPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
