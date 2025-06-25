
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Toaster } from 'sonner';
import { LayoutProvider } from './contexts/LayoutContext';

// Import pages
import Index from './pages/Index';
import { OSRDashboard } from './pages/OSRDashboard';
import { OSRDetailsPage } from './pages/OSRDetailsPage';
import { OSRGenerateReceiptPage } from './pages/OSRGenerateReceiptPage';
import { AccountingDashboard } from './pages/AccountingDashboard';
import { MarketPlaceAccountingPage } from './pages/MarketPlaceAccountingPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Main Routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              
              {/* Value Added Services Routes */}
              <Route path="vas/osr" element={<OSRDashboard />} />
              <Route path="vas/osr/details/:id" element={<OSRDetailsPage />} />
              <Route path="vas/osr/generate-receipt" element={<OSRGenerateReceiptPage />} />
              
              {/* Finance Routes */}
              <Route path="finance/accounting" element={<AccountingDashboard />} />
              
              {/* Market Place Routes */}
              <Route path="market-place/accounting" element={<MarketPlaceAccountingPage />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </LayoutProvider>
  );
}

export default App;
