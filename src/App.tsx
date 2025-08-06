import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Settings } from '@/pages/Settings';
import { Setup } from '@/pages/Setup';
import { ProjectsDashboard } from '@/pages/ProjectsDashboard';
import { ProjectDetails } from '@/pages/ProjectDetails';
import { AddProject } from '@/pages/AddProject';
import { FitoutSetup } from '@/pages/FitoutSetup';
import { FMUserDashboard } from '@/pages/setup/FMUserDashboard';
import { AddressMasterDashboard } from '@/pages/setup/AddressMasterDashboard';
import { ChecklistDashboard } from '@/pages/setup/ChecklistDashboard';
import { AddressBook } from '@/pages/AddressBook';
import { MasterSidebar } from '@/components/MasterSidebar';
import { UserMasterPage } from '@/pages/master/UserMasterPage';
import { AddressMasterPage } from '@/pages/master/AddressMasterPage';
import { AddressMaster } from '@/pages/master/AddressMaster';
import { AddressMasterEdit } from '@/pages/master/AddressMasterEdit';
import { AddressMasterView } from '@/pages/master/AddressMasterView';
import { UnitMasterDefault } from '@/pages/master/UnitMasterDefault';
import { MaterialEBom } from '@/pages/master/MaterialEBom';
import { AddressMasterAdd } from '@/pages/master/AddressMasterAdd';
import { AddressMasterBuilding } from '@/pages/master/AddressMasterBuilding';
import { AddressMasterWing } from '@/pages/master/AddressMasterWing';
import { AddressMasterArea } from '@/pages/master/AddressMasterArea';
import { AddressMasterFloor } from '@/pages/master/AddressMasterFloor';
import { AddressMasterUnit } from '@/pages/master/AddressMasterUnit';
import { AddressMasterRoom } from '@/pages/master/AddressMasterRoom';
import { AddressMasterAccount } from '@/pages/master/AddressMasterAccount';
import { PMSDashboard } from '@/pages/PMSDashboard';
import { AssetsDashboard } from '@/pages/AssetsDashboard';
import { PreventiveMaintenance } from '@/pages/PreventiveMaintenance';
import { MSafeDashboard } from '@/pages/MSafeDashboard';
import { Sidebar } from '@/components/Sidebar';
import { FMUsersDashboard } from '@/pages/settings/FMUsersDashboard';
import { CloneRole } from '@/pages/settings/CloneRole';
import { EditFMUserDetails } from '@/pages/settings/EditFMUserDetails';
import { NonFTEUsers } from '@/pages/maintenance/NonFTEUsers';
import { KRCCFormList } from '@/pages/maintenance/KRCCFormList';
import { MSafePage } from '@/pages/maintenance/MSafePage';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#f6f4ee]">
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/setup" element={<Layout><Setup /></Layout>} />

          {/* Projects */}
          <Route path="/projects" element={<Layout><ProjectsDashboard /></Layout>} />
          <Route path="/projects/details" element={<Layout><ProjectDetails /></Layout>} />
          <Route path="/projects/add" element={<Layout><AddProject /></Layout>} />
          <Route path="/projects/fitout-setup" element={<Layout><FitoutSetup /></Layout>} />

          {/* Setup */}
          <Route path="/setup/fm-users" element={<Layout><FMUserDashboard /></Layout>} />
          <Route path="/setup/address-master" element={<Layout><AddressMasterDashboard /></Layout>} />
          <Route path="/setup/checklist" element={<Layout><ChecklistDashboard /></Layout>} />

          {/* Address Book */}
          <Route path="/address-book" element={<Layout><AddressBook /></Layout>} />

          {/* Master */}
          <Route path="/master/user" element={<Layout><UserMasterPage /></Layout>} />
          <Route path="/master/address" element={<Layout><AddressMasterPage /></Layout>} />
          <Route path="/master/address/add" element={<Layout><AddressMasterAdd /></Layout>} />
          <Route path="/master/address/edit/:id" element={<Layout><AddressMasterEdit /></Layout>} />
          <Route path="/master/address/view/:id" element={<Layout><AddressMasterView /></Layout>} />
          <Route path="/master/location/building" element={<Layout><AddressMasterBuilding /></Layout>} />
          <Route path="/master/location/wing" element={<Layout><AddressMasterWing /></Layout>} />
          <Route path="/master/location/area" element={<Layout><AddressMasterArea /></Layout>} />
          <Route path="/master/location/floor" element={<Layout><AddressMasterFloor /></Layout>} />
          <Route path="/master/location/unit" element={<Layout><AddressMasterUnit /></Layout>} />
          <Route path="/master/location/room" element={<Layout><AddressMasterRoom /></Layout>} />
          <Route path="/master/location/account" element={<Layout><AddressMasterAccount /></Layout>} />
          <Route path="/master/unit-default" element={<Layout><UnitMasterDefault /></Layout>} />
          <Route path="/master/material-ebom" element={<Layout><MaterialEBom /></Layout>} />
          <Route path="/master/user/fm-users" element={<Layout><FMUserDashboard /></Layout>} />
          <Route path="/master/user/occupant-users" element={<Layout><FMUserDashboard /></Layout>} />

          {/* Maintenance */}
          <Route path="/maintenance/assets" element={<Layout><AssetsDashboard /></Layout>} />
          <Route path="/maintenance/pms" element={<Layout><PMSDashboard /></Layout>} />
          <Route path="/maintenance/preventive" element={<Layout><PreventiveMaintenance /></Layout>} />

          {/* M Safe */}
          <Route path="/maintenance/m-safe" element={<Layout><MSafeDashboard /></Layout>} />
          <Route path="/maintenance/m-safe/non-fte-users" element={<Layout><NonFTEUsers /></Layout>} />
          <Route path="/maintenance/m-safe/krcc-form-list" element={<Layout><KRCCFormList /></Layout>} />
          <Route path="/maintenance/m-safe/users" element={<Layout><MSafePage /></Layout>} />

          {/* Settings */}
          <Route path="/settings/users" element={<Layout><FMUsersDashboard /></Layout>} />
          <Route path="/settings/users/clone-role" element={<Layout><CloneRole /></Layout>} />
          <Route path="/settings/users/edit-details/:id" element={<Layout><EditFMUserDetails /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
