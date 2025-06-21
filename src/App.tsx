import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout';
import { Index } from '@/pages/Index';
import { UtilityDashboard } from '@/pages/UtilityDashboard';
import { UtilityWaterDashboard } from '@/pages/UtilityWaterDashboard';
import { AddUtilityAsset } from '@/pages/AddUtilityAsset';
import { AddWaterAsset } from '@/pages/AddWaterAsset';
import { InactiveAssets } from '@/pages/InactiveAssets';
import { ChecklistDashboard } from '@/pages/ChecklistDashboard';
import { AddChecklist } from '@/pages/AddChecklist';
import { EditChecklist } from '@/pages/EditChecklist';
import { TaskDashboard } from '@/pages/TaskDashboard';
import { AddTask } from '@/pages/AddTask';
import { EditTask } from '@/pages/EditTask';
import { PatrollingDashboard } from '@/pages/PatrollingDashboard';
import { AddPatrolling } from '@/pages/AddPatrolling';
import { EditPatrolling } from '@/pages/EditPatrolling';
import { PreventiveDashboard } from '@/pages/PreventiveDashboard';
import { AddPreventive } from '@/pages/AddPreventive';
import { EditPreventive } from '@/pages/EditPreventive';
import { BreakdownDashboard } from '@/pages/BreakdownDashboard';
import { AddBreakdown } from '@/pages/AddBreakdown';
import { EditBreakdown } from '@/pages/EditBreakdown';
import { OccupancyDashboard } from '@/pages/OccupancyDashboard';
import { AddOccupancy } from '@/pages/AddOccupancy';
import { EditOccupancy } from '@/pages/EditOccupancy';
import { PatrollingDetails } from '@/pages/PatrollingDetails';
import { TaskDetails } from '@/pages/TaskDetails';
import { ChecklistDetails } from '@/pages/ChecklistDetails';
import { PreventiveDetails } from '@/pages/PreventiveDetails';
import { BreakdownDetails } from '@/pages/BreakdownDetails';
import { OccupancyDetails } from '@/pages/OccupancyDetails';
import { Settings } from '@/pages/Settings';
import { WBSElementDashboard } from '@/pages/WBSElementDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/utility/energy" element={<UtilityDashboard />} />
            <Route path="/utility/water" element={<UtilityWaterDashboard />} />
            <Route path="/utility/energy/add-asset" element={<AddUtilityAsset />} />
            <Route path="/utility/water/add-asset" element={<AddWaterAsset />} />
            <Route path="/utility/inactive-assets" element={<InactiveAssets />} />
            <Route path="/checklist" element={<ChecklistDashboard />} />
            <Route path="/checklist/add-checklist" element={<AddChecklist />} />
            <Route path="/checklist/edit-checklist" element={<EditChecklist />} />
            <Route path="/task" element={<TaskDashboard />} />
            <Route path="/task/add-task" element={<AddTask />} />
            <Route path="/task/edit-task" element={<EditTask />} />
            <Route path="/patrolling" element={<PatrollingDashboard />} />
            <Route path="/patrolling/add-patrolling" element={<AddPatrolling />} />
            <Route path="/patrolling/edit-patrolling" element={<EditPatrolling />} />
            <Route path="/preventive" element={<PreventiveDashboard />} />
            <Route path="/preventive/add-preventive" element={<AddPreventive />} />
            <Route path="/preventive/edit-preventive" element={<EditPreventive />} />
            <Route path="/breakdown" element={<BreakdownDashboard />} />
            <Route path="/breakdown/add-breakdown" element={<AddBreakdown />} />
            <Route path="/breakdown/edit-breakdown" element={<EditBreakdown />} />
            <Route path="/occupancy" element={<OccupancyDashboard />} />
            <Route path="/occupancy/add-occupancy" element={<AddOccupancy />} />
            <Route path="/occupancy/edit-occupancy" element={<EditOccupancy />} />
            <Route path="/patrolling/patrolling-details" element={<PatrollingDetails />} />
            <Route path="/task/task-details" element={<TaskDetails />} />
            <Route path="/checklist/checklist-details" element={<ChecklistDetails />} />
            <Route path="/preventive/preventive-details" element={<PreventiveDetails />} />
            <Route path="/breakdown/breakdown-details" element={<BreakdownDetails />} />
            <Route path="/occupancy/occupancy-details" element={<OccupancyDetails />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* WBS Routes */}
            <Route path="/finance/wbs" element={<WBSElementDashboard />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
