import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';
import Index from './pages/Index';
import AssetDashboard from './pages/AssetDashboard';
import InActiveAssetsDashboard from './pages/InActiveAssetsDashboard';
import AssetDetailsPage from './pages/AssetDetailsPage';
import AMCDashboard from './pages/AMCDashboard';
import ServicesDashboard from './pages/ServicesDashboard';
import AttendanceDashboard from './pages/AttendanceDashboard';
import InventoryDashboard from './pages/InventoryDashboard';
import TicketDashboard from './pages/TicketDashboard';
import TaskDashboard from './pages/TaskDashboard';
import ScheduleDashboard from './pages/ScheduleDashboard';
import IncidentListDashboard from './pages/IncidentListDashboard';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import PermitDashboard from './pages/PermitDashboard';
import MSafeDashboard from './pages/MSafeDashboard';
import TrainingListDashboard from './pages/TrainingListDashboard';
import ProcurementDashboard from './pages/ProcurementDashboard';
import InvoicesDashboard from './pages/InvoicesDashboard';
import BillBookingDashboard from './pages/BillBookingDashboard';
import AccountingDashboard from './pages/AccountingDashboard';
import WBSDashboard from './pages/WBSDashboard';
import MaterialPRDashboard from './pages/MaterialPRDashboard';
import ServicePRDashboard from './pages/ServicePRDashboard';
import PODashboard from './pages/PODashboard';
import WODashboard from './pages/WODashboard';
import GRNSRNDashboard from './pages/GRNSRNDashboard';
import AutoSavedPRDashboard from './pages/AutoSavedPRDashboard';
import LeadDashboard from './pages/LeadDashboard';
import OpportunityDashboard from './pages/OpportunityDashboard';
import CRMDashboard from './pages/CRMDashboard';
import EventsDashboard from './pages/EventsDashboard';
import BroadcastDashboard from './pages/BroadcastDashboard';
import GroupsDashboard from './pages/GroupsDashboard';
import PollsDashboard from './pages/PollsDashboard';
import CampaignDashboard from './pages/CampaignDashboard';
import EnergyDashboard from './pages/EnergyDashboard';
import EnergyAssetDetailsPage from './pages/EnergyAssetDetailsPage';
import WaterDashboard from './pages/WaterDashboard';
import WaterAssetDetailsPage from './pages/WaterAssetDetailsPage';
import STPDashboard from './pages/STPDashboard';
import EVConsumptionDashboard from './pages/EVConsumptionDashboard';
import SolarGeneratorDashboard from './pages/SolarGeneratorDashboard';
import GatePassDashboard from './pages/GatePassDashboard';
import GatePassInwardsDashboard from './pages/GatePassInwardsDashboard';
import GatePassOutwardsDashboard from './pages/GatePassOutwardsDashboard';
import VisitorDashboard from './pages/VisitorDashboard';
import StaffDashboard from './pages/StaffDashboard';
import VehicleDashboard from './pages/VehicleDashboard';
import RVehicleDashboard from './pages/RVehicleDashboard';
import RVehicleHistoryDashboard from './pages/RVehicleHistoryDashboard';
import GVehicleDashboard from './pages/GVehicleDashboard';
import PatrollingDashboard from './pages/PatrollingDashboard';
import FnBDashboard from './pages/FnBDashboard';
import ParkingDashboard from './pages/ParkingDashboard';
import OSRDashboard from './pages/OSRDashboard';
import SpaceManagementDashboard from './pages/SpaceManagementDashboard';
import BookingsDashboard from './pages/BookingsDashboard';
import SeatRequestsDashboard from './pages/SeatRequestsDashboard';
import GeneralSettings from './pages/GeneralSettings';
import AccountSettings from './pages/AccountSettings';
import UsersSettings from './pages/UsersSettings';
import RolesSettings from './pages/RolesSettings';
import ApprovalMatrixSettings from './pages/ApprovalMatrixSettings';
import SetupLayout from './pages/SetupLayout';
import MarketPlaceDashboard from './pages/MarketPlaceDashboard';
import MarketPlaceInstalled from './pages/MarketPlaceInstalled';
import MarketPlaceUpdates from './pages/MarketPlaceUpdates';
import LeaseManagementDashboard from './pages/LeaseManagementDashboard';
import LoyaltyRuleEngineDashboard from './pages/LoyaltyRuleEngineDashboard';
import CloudTelephonyDashboard from './pages/CloudTelephonyDashboard';
import MarketPlaceAccountingDashboard from './pages/MarketPlaceAccountingDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LayoutProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              
              {/* Maintenance Routes */}
              <Route path="/maintenance/asset" element={<AssetDashboard />} />
              <Route path="/maintenance/asset/inactive" element={<InActiveAssetsDashboard />} />
              <Route path="/maintenance/asset/:id" element={<AssetDetailsPage />} />
              <Route path="/maintenance/amc" element={<AMCDashboard />} />
              <Route path="/maintenance/services" element={<ServicesDashboard />} />
              <Route path="/maintenance/attendance" element={<AttendanceDashboard />} />
              <Route path="/maintenance/inventory" element={<InventoryDashboard />} />
              <Route path="/maintenance/ticket" element={<TicketDashboard />} />
              <Route path="/maintenance/task" element={<TaskDashboard />} />
              <Route path="/maintenance/schedule" element={<ScheduleDashboard />} />
              
              {/* Safety Routes */}
              <Route path="/safety/incident" element={<IncidentListDashboard />} />
              <Route path="/safety/incident/:id" element={<IncidentDetailsPage />} />
              <Route path="/safety/permit" element={<PermitDashboard />} />
              <Route path="/safety/m-safe" element={<MSafeDashboard />} />
              <Route path="/safety/training-list" element={<TrainingListDashboard />} />
              
              {/* Finance Routes */}
              <Route path="/finance/procurement" element={<ProcurementDashboard />} />
              <Route path="/finance/invoices" element={<InvoicesDashboard />} />
              <Route path="/finance/bill-booking" element={<BillBookingDashboard />} />
              <Route path="/finance/accounting" element={<AccountingDashboard />} />
              <Route path="/finance/wbs" element={<WBSDashboard />} />
              <Route path="/finance/material-pr" element={<MaterialPRDashboard />} />
              <Route path="/finance/service-pr" element={<ServicePRDashboard />} />
              <Route path="/finance/po" element={<PODashboard />} />
              <Route path="/finance/wo" element={<WODashboard />} />
              <Route path="/finance/grn-srn" element={<GRNSRNDashboard />} />
              <Route path="/finance/auto-saved-pr" element={<AutoSavedPRDashboard />} />
              
              {/* CRM Routes */}
              <Route path="/crm/lead" element={<LeadDashboard />} />
              <Route path="/crm/opportunity" element={<OpportunityDashboard />} />
              <Route path="/crm/crm" element={<CRMDashboard />} />
              <Route path="/crm/events" element={<EventsDashboard />} />
              <Route path="/crm/broadcast" element={<BroadcastDashboard />} />
              <Route path="/crm/groups" element={<GroupsDashboard />} />
              <Route path="/crm/polls" element={<PollsDashboard />} />
              <Route path="/crm/campaign" element={<CampaignDashboard />} />
              
              {/* Utility Routes */}
              <Route path="/utility/energy" element={<EnergyDashboard />} />
              <Route path="/utility/energy/:id" element={<EnergyAssetDetailsPage />} />
              <Route path="/utility/water" element={<WaterDashboard />} />
              <Route path="/utility/water/:id" element={<WaterAssetDetailsPage />} />
              <Route path="/utility/stp" element={<STPDashboard />} />
              <Route path="/utility/ev-consumption" element={<EVConsumptionDashboard />} />
              <Route path="/utility/solar-generator" element={<SolarGeneratorDashboard />} />
              
              {/* Security Routes */}
              <Route path="/security/gate-pass" element={<GatePassDashboard />} />
              <Route path="/security/gate-pass/inwards" element={<GatePassInwardsDashboard />} />
              <Route path="/security/gate-pass/outwards" element={<GatePassOutwardsDashboard />} />
              <Route path="/security/visitor" element={<VisitorDashboard />} />
              <Route path="/security/staff" element={<StaffDashboard />} />
              <Route path="/security/vehicle" element={<VehicleDashboard />} />
              <Route path="/security/vehicle/r-vehicles" element={<RVehicleDashboard />} />
              <Route path="/security/vehicle/r-vehicles/history" element={<RVehicleHistoryDashboard />} />
              <Route path="/security/vehicle/g-vehicles" element={<GVehicleDashboard />} />
              <Route path="/security/patrolling" element={<PatrollingDashboard />} />
              
              {/* Value Added Services Routes */}
              <Route path="/vas/fnb" element={<FnBDashboard />} />
              <Route path="/vas/parking" element={<ParkingDashboard />} />
              <Route path="/vas/osr" element={<OSRDashboard />} />
              <Route path="/vas/space-management" element={<SpaceManagementDashboard />} />
              <Route path="/vas/space-management/bookings" element={<BookingsDashboard />} />
              <Route path="/vas/space-management/seat-requests" element={<SeatRequestsDashboard />} />
              
              {/* Market Place Routes */}
              <Route path="/market-place" element={<MarketPlaceDashboard />} />
              <Route path="/market-place/all" element={<MarketPlaceDashboard />} />
              <Route path="/market-place/installed" element={<MarketPlaceInstalled />} />
              <Route path="/market-place/updates" element={<MarketPlaceUpdates />} />
              <Route path="/market-place/lease-management" element={<LeaseManagementDashboard />} />
              <Route path="/market-place/loyalty-rule-engine" element={<LoyaltyRuleEngineDashboard />} />
              <Route path="/market-place/cloud-telephony" element={<CloudTelephonyDashboard />} />
              <Route path="/market-place/accounting" element={<MarketPlaceAccountingDashboard />} />
              
              {/* Settings Routes */}
              <Route path="/settings" element={<SetupLayout />}>
                <Route index element={<Navigate to="/settings/general" replace />} />
                <Route path="general" element={<GeneralSettings />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="users" element={<UsersSettings />} />
                <Route path="roles" element={<RolesSettings />} />
                <Route path="approval-matrix" element={<ApprovalMatrixSettings />} />
              </Route>
            </Route>
          </Routes>
        </LayoutProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
