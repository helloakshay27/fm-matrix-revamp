
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LayoutProvider } from '@/contexts/LayoutContext';
import Index from '@/pages/Index';
import { UtilityDashboard } from '@/pages/UtilityDashboard';
import UtilityEVConsumptionDashboard from '@/pages/UtilityEVConsumptionDashboard';
import UtilitySolarGeneratorDashboard from '@/pages/UtilitySolarGeneratorDashboard';
import UtilityWaterDashboard from '@/pages/UtilityWaterDashboard';
import { UtilitySTPDashboard } from '@/pages/UtilitySTPDashboard';
import { WBSElementDashboard } from '@/pages/WBSElementDashboard';
import { InvoicesSESDashboard } from '@/pages/InvoicesSESDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Index /> },
      { path: '/utility/energy', element: <UtilityDashboard /> },
      { path: '/utility/water', element: <UtilityWaterDashboard /> },
      { path: '/utility/stp', element: <UtilitySTPDashboard /> },
      { path: '/utility/ev-consumption', element: <UtilityEVConsumptionDashboard /> },
      { path: '/utility/solar-generator', element: <UtilitySolarGeneratorDashboard /> },
      { path: '/finance/wbs', element: <WBSElementDashboard /> },
      { path: '/finance/invoices-ses', element: <InvoicesSESDashboard /> },
    ]
  }
]);

function App() {
  return (
    <LayoutProvider>
      <RouterProvider router={router} />
    </LayoutProvider>
  );
}

export default App;
