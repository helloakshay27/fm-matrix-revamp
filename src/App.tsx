
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from '@/components/Layout';
import { Index } from '@/pages/Index';
import { OSRGenerateReceiptPage } from '@/pages/OSRGenerateReceiptPage';
import { CRMCampaignPage } from '@/pages/CRMCampaignPage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="osr/generate-receipt" element={<OSRGenerateReceiptPage />} />
            <Route path="crm/campaign" element={<CRMCampaignPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
