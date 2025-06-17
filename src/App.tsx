import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { SetupLayout } from './components/SetupLayout';

// Import existing pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Import new Fitout pages
import { FitoutSetupDashboard } from './pages/FitoutSetupDashboard';
import { FitoutRequestListDashboard } from './pages/FitoutRequestListDashboard';
import { AddProjectDashboard } from './pages/AddProjectDashboard';
import { FitoutChecklistDashboard } from './pages/FitoutChecklistDashboard';
import { AddChecklistDashboard } from './pages/AddChecklistDashboard';
import { FitoutViolationDashboard } from './pages/FitoutViolationDashboard';

// Import Utility pages
import { UtilityDashboard } from './pages/UtilityDashboard';
import { AddAssetDashboard } from './pages/AddAssetDashboard';
import { AddEnergyAssetDashboard } from './pages/AddEnergyAssetDashboard';
import { InActiveAssetsDashboard } from './pages/InActiveAssetsDashboard';
import { UtilityWaterDashboard } from './pages/UtilityWaterDashboard';
import { AddWaterAssetDashboard } from './pages/AddWaterAssetDashboard';
import UtilitySTPDashboard from './pages/UtilitySTPDashboard';

// Import Visitors pages
import { VisitorsDashboard } from './pages/VisitorsDashboard';
import { VisitorsHistoryDashboard } from './pages/VisitorsHistoryDashboard';
import { PatrollingDashboard } from './pages/PatrollingDashboard';

// Import Staff pages
import { StaffsDashboard } from './pages/StaffsDashboard';

// Import Value Added Services pages
import { FnBRestaurantDashboard } from './pages/FnBRestaurantDashboard';
import ParkingDashboard from './pages/ParkingDashboard';
import ParkingBookingsDashboard from './pages/ParkingBookingsDashboard';

// Import Design Insights pages
import { DesignInsightsDashboard } from './pages/DesignInsightsDashboard';
import { AddDesignInsightDashboard } from './pages/AddDesignInsightDashboard';
import { DesignInsightDetailsDashboard } from './pages/DesignInsightDetailsDashboard';
import { EditDesignInsightDashboard } from './pages/EditDesignInsightDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><div /></Layout>}>
              <Route index element={<Index />} />
              
              {/* Design Insights Routes */}
              <Route path="/transitioning/design-insight" element={<DesignInsightsDashboard />} />
              <Route path="/transitioning/design-insight/add" element={<AddDesignInsightDashboard />} />
              <Route path="/transitioning/design-insight/details/:id" element={<DesignInsightDetailsDashboard />} />
              <Route path="/transitioning/design-insight/edit/:id" element={<EditDesignInsightDashboard />} />
              
              {/* Fitout Routes */}
              <Route path="/transitioning/fitout/setup" element={<FitoutSetupDashboard />} />
              <Route path="/transitioning/fitout/request" element={<FitoutRequestListDashboard />} />
              <Route path="/transitioning/fitout/add-project" element={<AddProjectDashboard />} />
              <Route path="/transitioning/fitout/checklist" element={<FitoutChecklistDashboard />} />
              <Route path="/transitioning/fitout/checklist/add" element={<AddChecklistDashboard />} />
              <Route path="/transitioning/fitout/violation" element={<FitoutViolationDashboard />} />
              
              {/* Utility Routes */}
              <Route path="/utility/energy" element={<UtilityDashboard />} />
              <Route path="/utility/energy/add-asset" element={<AddEnergyAssetDashboard />} />
              <Route path="/utility/water" element={<UtilityWaterDashboard />} />
              <Route path="/utility/water/add-asset" element={<AddWaterAssetDashboard />} />
              <Route path="/utility/stp" element={<UtilitySTPDashboard />} />
              <Route path="/utility/add-asset" element={<AddAssetDashboard />} />
              <Route path="/utility/inactive-assets" element={<InActiveAssetsDashboard />} />
              
              {/* Security/Visitors Routes */}
              <Route path="/security/visitor" element={<VisitorsDashboard />} />
              <Route path="/security/visitor/history" element={<VisitorsHistoryDashboard />} />
              <Route path="/security/staff" element={<StaffsDashboard />} />
              <Route path="/security/patrolling" element={<PatrollingDashboard />} />
              
              {/* Value Added Services Routes */}
              <Route path="/vas/fnb" element={<FnBRestaurantDashboard />} />
              <Route path="/vas/parking" element={<ParkingDashboard />} />
              <Route path="/property/parking/bookings" element={<ParkingBookingsDashboard />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Setup Routes */}
            <Route path="/setup" element={<SetupLayout><div /></SetupLayout>}>
              <Route path="/setup/location/account" element={<div>Location Account</div>} />
              <Route path="/setup/location/building" element={<div>Location Building</div>} />
              <Route path="/setup/location/wing" element={<div>Location Wing</div>} />
              <Route path="/setup/location/area" element={<div>Location Area</div>} />
              <Route path="/setup/location/floor" element={<div>Location Floor</div>} />
              <Route path="/setup/location/unit" element={<div>Location Unit</div>} />
              <Route path="/setup/location/room" element={<div>Location Room</div>} />
              <Route path="/setup/user-role/department" element={<div>User Role Department</div>} />
              <Route path="/setup/user-role/role" element={<div>User Role Role</div>} />
              <Route path="/setup/fm-user" element={<div>FM User</div>} />
              <Route path="/setup/occupant-users" element={<div>Occupant Users</div>} />
              <Route path="/setup/meter-type" element={<div>Meter Type</div>} />
              <Route path="/setup/asset-groups" element={<div>Asset Groups</div>} />
              <Route path="/setup/checklist-group" element={<div>Checklist Group</div>} />
              <Route path="/setup/ticket/setup" element={<div>Ticket Setup</div>} />
              <Route path="/setup/ticket/escalation" element={<div>Ticket Escalation</div>} />
              <Route path="/setup/ticket/cost-approval" element={<div>Ticket Cost Approval</div>} />
              <Route path="/setup/task-escalation" element={<div>Task Escalation</div>} />
              <Route path="/setup/approval-matrix" element={<div>Approval Matrix</div>} />
              <Route path="/setup/patrolling-approval" element={<div>Patrolling Approval</div>} />
              <Route path="/setup/email-rule" element={<div>Email Rule</div>} />
              <Route path="/setup/fm-group" element={<div>FM Group</div>} />
              <Route path="/setup/master-checklist" element={<div>Master Checklist</div>} />
              <Route path="/setup/sac-hsn-setup" element={<div>SAC/HSN Setup</div>} />
              <Route path="/setup/address" element={<div>Address</div>} />
              <Route path="/setup/tag" element={<div>Tag</div>} />
              <Route path="/setup/export" element={<div>Export</div>} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
