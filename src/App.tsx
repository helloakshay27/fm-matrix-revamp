import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';
import Index from './pages/Index';
import { TicketDashboard } from './pages/TicketDashboard';
import { TicketDetails } from './pages/TicketDetails';
import { AddTicket } from './pages/AddTicket';
import { AssetDashboard } from './pages/AssetDashboard';
import { OperationalDashboard } from './pages/OperationalDashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { WasteDashboard } from './pages/WasteDashboard';
import { SurveyDashboard } from './pages/SurveyDashboard';
import { GeneralSettings } from './pages/GeneralSettings';
import { AccountSettings } from './pages/AccountSettings';
import { UserSettings } from './pages/UserSettings';
import { RolesRACI } from './pages/RolesRACI';
import { ApprovalMatrix } from './pages/ApprovalMatrix';
import { Module1 } from './pages/Module1';
import { Module2 } from './pages/Module2';
import { ChecklistMaster } from './pages/ChecklistMaster';
import { UnitMaster } from './pages/UnitMaster';
import { AddressMaster } from './pages/AddressMaster';
import { Hoto } from './pages/Hoto';
import { Snagging } from './pages/Snagging';
import { DesignInsight } from './pages/DesignInsight';
import { Fitout } from './pages/Fitout';
import { FitoutSetup } from './pages/FitoutSetup';
import { FitoutRequest } from './pages/FitoutRequest';
import { FitoutChecklist } from './pages/FitoutChecklist';
import { FitoutViolation } from './pages/FitoutViolation';
import { Asset } from './pages/Asset';
import { Amc } from './pages/Amc';
import { Services } from './pages/Services';
import { Attendance } from './pages/Attendance';
import { Inventory } from './pages/Inventory';
import { Task } from './pages/Task';
import { Schedule } from './pages/Schedule';
import { Operational } from './pages/Operational';
import { Scheduled } from './pages/Scheduled';
import { Conducted } from './pages/Conducted';
import { MasterChecklists } from './pages/MasterChecklists';
import { Vendor } from './pages/Vendor';
import { VendorScheduled } from './pages/VendorScheduled';
import { VendorConducted } from './pages/VendorConducted';
import { Assets } from './pages/Assets';
import { WasteGeneration } from './pages/WasteGeneration';
import { Setup } from './pages/Setup';
import { SurveyList } from './pages/SurveyList';
import { Mapping } from './pages/Mapping';
import { Response } from './pages/Response';
import { Incident } from './pages/Incident';
import { Permit } from './pages/Permit';
import { Msafe } from './pages/Msafe';
import { TrainingList } from './pages/TrainingList';
import { Procurement } from './pages/Procurement';
import { PrSr } from './pages/PrSr';
import { MaterialPr } from './pages/MaterialPr';
import { ServicePr } from './pages/ServicePr';
import { PoWo } from './pages/PoWo';
import { Po } from './pages/Po';
import { Wo } from './pages/Wo';
import { GrnSrn } from './pages/GrnSrn';
import { AutoSavedPr } from './pages/AutoSavedPr';
import { Invoices } from './pages/Invoices';
import { BillBooking } from './pages/BillBooking';
import { Accounting } from './pages/Accounting';
import { CostCenter } from './pages/CostCenter';
import { Budgeting } from './pages/Budgeting';
import { PendingApprovals } from './pages/PendingApprovals';
import { Wbs } from './pages/Wbs';
import { Lead } from './pages/Lead';
import { Opportunity } from './pages/Opportunity';
import { Crm } from './pages/Crm';
import { Events } from './pages/Events';
import { Broadcast } from './pages/Broadcast';
import { Groups } from './pages/Groups';
import { Polls } from './pages/Polls';
import { Campaign } from './pages/Campaign';
import { Energy } from './pages/Energy';
import { Water } from './pages/Water';
import { Stp } from './pages/Stp';
import { EvConsumption } from './pages/EvConsumption';
import { SolarGenerator } from './pages/SolarGenerator';
import { GatePass } from './pages/GatePass';
import { Inwards } from './pages/Inwards';
import { Outwards } from './pages/Outwards';
import { Visitor } from './pages/Visitor';
import { Staff } from './pages/Staff';
import { Vehicle } from './pages/Vehicle';
import { RVehicles } from './pages/RVehicles';
import { All } from './pages/All';
import { History } from './pages/History';
import { GVehicles } from './pages/GVehicles';
import { Patrolling } from './pages/Patrolling';
import { Fnb } from './pages/Fnb';
import { Parking } from './pages/Parking';
import { Osr } from './pages/Osr';
import { SpaceManagement } from './pages/SpaceManagement';
import { Bookings } from './pages/Bookings';
import { SeatRequests } from './pages/SeatRequests';
import { SetupSM } from './pages/SetupSM';
import { SeatType } from './pages/SeatType';
import { SeatSetup } from './pages/SeatSetup';
import { Shift } from './pages/Shift';
import { Roster } from './pages/Roster';
import { Employees } from './pages/Employees';
import { CheckInMargin } from './pages/CheckInMargin';
import { RosterCalendar } from './pages/RosterCalendar';
import { Export } from './pages/Export';
import { RedemonectionMarketplace } from './pages/RedemonectionMarketplace';

// Market Place Pages
import { MarketPlaceAllPage } from './pages/MarketPlaceAllPage';
import { MarketPlaceInstalledPage } from './pages/MarketPlaceInstalledPage';
import { MarketPlaceUpdatesPage } from './pages/MarketPlaceUpdatesPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            {/* Maintenance Routes */}
            <Route path="/maintenance/ticket" element={<TicketDashboard />} />
            <Route path="/maintenance/ticket/details/:id" element={<TicketDetails />} />
            <Route path="/maintenance/ticket/add" element={<AddTicket />} />
            <Route path="/maintenance/asset" element={<Asset />} />
            <Route path="/maintenance/amc" element={<Amc />} />
            <Route path="/maintenance/services" element={<Services />} />
            <Route path="/maintenance/attendance" element={<Attendance />} />
            <Route path="/maintenance/inventory" element={<Inventory />} />
            <Route path="/maintenance/task" element={<Task />} />
            <Route path="/maintenance/schedule" element={<Schedule />} />
            <Route path="/maintenance/audit/operational" element={<Operational />} />
            <Route path="/maintenance/audit/operational/scheduled" element={<Scheduled />} />
            <Route path="/maintenance/audit/operational/conducted" element={<Conducted />} />
            <Route path="/maintenance/audit/operational/master-checklists" element={<MasterChecklists />} />
            <Route path="/maintenance/audit/vendor" element={<Vendor />} />
            <Route path="/maintenance/audit/vendor/scheduled" element={<VendorScheduled />} />
            <Route path="/maintenance/audit/vendor/conducted" element={<VendorConducted />} />
            <Route path="/maintenance/audit/assets" element={<Assets />} />
            <Route path="/maintenance/audit/waste" element={<WasteDashboard />} />
            <Route path="/maintenance/audit/waste/generation" element={<WasteGeneration />} />
            <Route path="/maintenance/audit/waste/setup" element={<Setup />} />
            <Route path="/maintenance/audit/survey" element={<SurveyDashboard />} />
            <Route path="/maintenance/audit/survey/list" element={<SurveyList />} />
            <Route path="/maintenance/audit/survey/mapping" element={<Mapping />} />
            <Route path="/maintenance/audit/survey/response" element={<Response />} />
            {/* Transitioning Routes */}
            <Route path="/transitioning/hoto" element={<Hoto />} />
            <Route path="/transitioning/snagging" element={<Snagging />} />
            <Route path="/transitioning/design-insight" element={<DesignInsight />} />
            <Route path="/transitioning/fitout" element={<Fitout />} />
            <Route path="/transitioning/fitout/setup" element={<FitoutSetup />} />
            <Route path="/transitioning/fitout/request" element={<FitoutRequest />} />
            <Route path="/transitioning/fitout/checklist" element={<FitoutChecklist />} />
            <Route path="/transitioning/fitout/violation" element={<FitoutViolation />} />
            {/* Safety Routes */}
            <Route path="/safety/incident" element={<Incident />} />
            <Route path="/safety/permit" element={<Permit />} />
            <Route path="/safety/m-safe" element={<Msafe />} />
            <Route path="/safety/training-list" element={<TrainingList />} />
            {/* Finance Routes */}
            <Route path="/finance/procurement" element={<Procurement />} />
            <Route path="/finance/pr-sr" element={<PrSr />} />
            <Route path="/finance/material-pr" element={<MaterialPr />} />
            <Route path="/finance/service-pr" element={<ServicePr />} />
            <Route path="/finance/po-wo" element={<PoWo />} />
            <Route path="/finance/po" element={<Po />} />
            <Route path="/finance/wo" element={<Wo />} />
            <Route path="/finance/grn-srn" element={<GrnSrn />} />
            <Route path="/finance/auto-saved-pr" element={<AutoSavedPr />} />
            <Route path="/finance/invoices" element={<Invoices />} />
            <Route path="/finance/bill-booking" element={<BillBooking />} />
            <Route path="/finance/accounting" element={<Accounting />} />
            <Route path="/finance/cost-center" element={<CostCenter />} />
            <Route path="/finance/budgeting" element={<Budgeting />} />
            <Route path="/finance/pending-approvals" element={<PendingApprovals />} />
            <Route path="/finance/wbs" element={<Wbs />} />
            {/* CRM Routes */}
            <Route path="/crm/lead" element={<Lead />} />
            <Route path="/crm/opportunity" element={<Opportunity />} />
            <Route path="/crm/crm" element={<Crm />} />
            <Route path="/crm/events" element={<Events />} />
            <Route path="/crm/broadcast" element={<Broadcast />} />
            <Route path="/crm/groups" element={<Groups />} />
            <Route path="/crm/polls" element={<Polls />} />
            <Route path="/crm/campaign" element={<Campaign />} />
            {/* Utility Routes */}
            <Route path="/utility/energy" element={<Energy />} />
            <Route path="/utility/water" element={<Water />} />
            <Route path="/utility/stp" element={<Stp />} />
            <Route path="/utility/ev-consumption" element={<EvConsumption />} />
            <Route path="/utility/solar-generator" element={<SolarGenerator />} />
            {/* Security Routes */}
            <Route path="/security/gate-pass" element={<GatePass />} />
            <Route path="/security/gate-pass/inwards" element={<Inwards />} />
            <Route path="/security/gate-pass/outwards" element={<Outwards />} />
            <Route path="/security/visitor" element={<Visitor />} />
            <Route path="/security/staff" element={<Staff />} />
            <Route path="/security/vehicle" element={<Vehicle />} />
            <Route path="/security/vehicle/r-vehicles" element={<RVehicles />} />
            <Route path="/security/vehicle/r-vehicles/history" element={<History />} />
            <Route path="/security/vehicle/g-vehicles" element={<GVehicles />} />
            <Route path="/security/patrolling" element={<Patrolling />} />
            {/* Value Added Services Routes */}
            <Route path="/vas/fnb" element={<Fnb />} />
            <Route path="/vas/parking" element={<Parking />} />
            <Route path="/vas/osr" element={<Osr />} />
            <Route path="/vas/space-management" element={<SpaceManagement />} />
            <Route path="/vas/space-management/bookings" element={<Bookings />} />
            <Route path="/vas/space-management/seat-requests" element={<SeatRequests />} />
            <Route path="/vas/space-management/setup" element={<SetupSM />} />
            <Route path="/vas/space-management/setup/seat-type" element={<SeatType />} />
            <Route path="/vas/space-management/setup/seat-setup" element={<SeatSetup />} />
            <Route path="/vas/space-management/setup/shift" element={<Shift />} />
            <Route path="/vas/space-management/setup/roster" element={<Roster />} />
            <Route path="/vas/space-management/setup/employees" element={<Employees />} />
            <Route path="/vas/space-management/setup/check-in-margin" element={<CheckInMargin />} />
            <Route path="/vas/space-management/setup/roster-calendar" element={<RosterCalendar />} />
            <Route path="/vas/space-management/setup/export" element={<Export />} />
            <Route path="/vas/redemonection-marketplace" element={<RedemonectionMarketplace />} />
            {/* Settings Routes */}
            <Route path="/settings/general" element={<GeneralSettings />} />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/users" element={<UserSettings />} />
            <Route path="/settings/roles" element={<RolesRACI />} />
            <Route path="/settings/approval-matrix" element={<ApprovalMatrix />} />
            <Route path="/settings/module1" element={<Module1 />} />
            <Route path="/settings/module1/function1" element={<Module1 />} />
            <Route path="/settings/module1/function2" element={<Module1 />} />
            <Route path="/settings/module2" element={<Module2 />} />
            <Route path="/settings/module2/function1" element={<Module2 />} />
            <Route path="/settings/module2/function2" element={<Module2 />} />
             <Route path="/settings/masters/checklist" element={<ChecklistMaster />} />
             <Route path="/settings/masters/unit" element={<UnitMaster />} />
             <Route path="/settings/masters/address" element={<AddressMaster />} />
             {/* Market Place Routes */}
            <Route path="/market-place/all" element={<MarketPlaceAllPage />} />
            <Route path="/market-place/installed" element={<MarketPlaceInstalledPage />} />
            <Route path="/market-place/updates" element={<MarketPlaceUpdatesPage />} />
          </Route>
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
