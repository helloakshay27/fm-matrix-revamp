import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { Dashboard } from '@/pages/Dashboard';
import { AssetRegister } from '@/pages/AssetRegister';
import { AssetTransfer } from '@/pages/AssetTransfer';
import { AssetDisposal } from '@/pages/AssetDisposal';
import { AMC } from '@/pages/AMC';
import { Warranty } from '@/pages/Warranty';
import { WorkOrder } from '@/pages/WorkOrder';
import { PPM } from '@/pages/PPM';
import { Breakdown } from '@/pages/Breakdown';
import { Checklist } from '@/pages/Checklist';
import { Attendance } from '@/pages/Attendance';
import { StockManagement } from '@/pages/StockManagement';
import { PurchaseOrder } from '@/pages/PurchaseOrder';
import { VendorManagement } from '@/pages/VendorManagement';
import { EnergyDashboard } from '@/pages/EnergyDashboard';
import { ConsumptionAnalysis } from '@/pages/ConsumptionAnalysis';
import { Master } from '@/pages/Master';
import { AssetReports } from '@/pages/AssetReports';
import { MaintenanceReports } from '@/pages/MaintenanceReports';
import { InventoryReports } from '@/pages/InventoryReports';
import { Login } from '@/pages/Login';
import { SettingsAccount } from '@/pages/SettingsAccount';
import { SettingsProfile } from '@/pages/SettingsProfile';
import { SettingsNotifications } from '@/pages/SettingsNotifications';
import { AuthGuard } from './AuthGuard';
import { Building } from '@/pages/Building';
import { Wing } from '@/pages/Wing';
import { Area } from '@/pages/Area';
import { Floor } from '@/pages/Floor';
import { Unit } from '@/pages/Unit';
import { Room } from '@/pages/Room';
import { FMUsers } from '@/pages/FMUsers';
import { OccupantUsers } from '@/pages/OccupantUsers';
import { ChecklistMaster } from '@/pages/ChecklistMaster';
import { AddressMaster } from '@/pages/AddressMaster';
import { UnitMasterByDefault } from '@/pages/UnitMasterByDefault';
import { MaterialEBom } from '@/pages/MaterialEBom';
import { MSafePage } from '@/pages/maintenance/MSafePage';
import { MSafeDashboard } from '@/pages/MSafeDashboard';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const handleContextmenu = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextmenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
    };
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LayoutProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
                <Route path="/asset-management/asset-register" element={<AuthGuard><AssetRegister /></AuthGuard>} />
                <Route path="/asset-management/asset-transfer" element={<AuthGuard><AssetTransfer /></AuthGuard>} />
                <Route path="/asset-management/asset-disposal" element={<AuthGuard><AssetDisposal /></AuthGuard>} />
                <Route path="/asset-management/amc" element={<AuthGuard><AMC /></AuthGuard>} />
                <Route path="/asset-management/warranty" element={<AuthGuard><Warranty /></AuthGuard>} />
                <Route path="/maintenance/work-order" element={<AuthGuard><WorkOrder /></AuthGuard>} />
                <Route path="/maintenance/ppm" element={<AuthGuard><PPM /></AuthGuard>} />
                <Route path="/maintenance/breakdown" element={<AuthGuard><Breakdown /></AuthGuard>} />
                <Route path="/maintenance/checklist" element={<AuthGuard><Checklist /></AuthGuard>} />
                <Route path="/maintenance/attendance" element={<AuthGuard><Attendance /></AuthGuard>} />
                <Route path="/inventory/stock-management" element={<AuthGuard><StockManagement /></AuthGuard>} />
                <Route path="/inventory/purchase-order" element={<AuthGuard><PurchaseOrder /></AuthGuard>} />
                <Route path="/inventory/vendor-management" element={<AuthGuard><VendorManagement /></AuthGuard>} />
                <Route path="/energy/dashboard" element={<AuthGuard><EnergyDashboard /></AuthGuard>} />
                <Route path="/energy/consumption" element={<AuthGuard><ConsumptionAnalysis /></AuthGuard>} />
                <Route path="/master" element={<AuthGuard><Master /></AuthGuard>} />
                <Route path="/reports/asset" element={<AuthGuard><AssetReports /></AuthGuard>} />
                <Route path="/reports/maintenance" element={<AuthGuard><MaintenanceReports /></AuthGuard>} />
                <Route path="/reports/inventory" element={<AuthGuard><InventoryReports /></AuthGuard>} />
                <Route path="/settings/account" element={<AuthGuard><SettingsAccount /></AuthGuard>} />
                <Route path="/settings/profile" element={<AuthGuard><SettingsProfile /></AuthGuard>} />
                <Route path="/settings/notifications" element={<AuthGuard><SettingsNotifications /></AuthGuard>} />
                <Route path="/master/location/building" element={<AuthGuard><Building /></AuthGuard>} />
                <Route path="/master/location/wing" element={<AuthGuard><Wing /></AuthGuard>} />
                <Route path="/master/location/area" element={<AuthGuard><Area /></AuthGuard>} />
                <Route path="/master/location/floor" element={<AuthGuard><Floor /></AuthGuard>} />
                <Route path="/master/location/unit" element={<AuthGuard><Unit /></AuthGuard>} />
                <Route path="/master/location/room" element={<AuthGuard><Room /></AuthGuard>} />
                <Route path="/master/user/fm-users" element={<AuthGuard><FMUsers /></AuthGuard>} />
                <Route path="/master/user/occupant-users" element={<AuthGuard><OccupantUsers /></AuthGuard>} />
                <Route path="/master/checklist" element={<AuthGuard><ChecklistMaster /></AuthGuard>} />
                <Route path="/master/address" element={<AuthGuard><AddressMaster /></AuthGuard>} />
                <Route path="/master/unit-default" element={<AuthGuard><UnitMasterByDefault /></AuthGuard>} />
                <Route path="/master/material-ebom" element={<AuthGuard><MaterialEBom /></AuthGuard>} />
                
                {/* M Safe Routes */}
                <Route path="/maintenance/m-safe" element={<AuthGuard><MSafePage /></AuthGuard>} />
                <Route path="/maintenance/m-safe" element={<AuthGuard><MSafeDashboard /></AuthGuard>} />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <Toaster />
              <Sonner />
            </div>
          </Router>
        </LayoutProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
