import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Assets } from './pages/Assets';
import { SetupLayout } from './components/SetupLayout';
import { General } from './pages/setup/General';
import { Sites } from './pages/setup/Sites';
import { Buildings } from './pages/setup/Buildings';
import { Wings } from './pages/setup/Wings';
import { Floors } from './pages/setup/Floors';
import { Areas } from './pages/setup/Areas';
import { Rooms } from './pages/setup/Rooms';
import { Groups } from './pages/setup/Groups';
import { SubGroups } from './pages/setup/SubGroups';
import { AssetTypes } from './pages/setup/AssetTypes';
import { Maintenance } from './pages/Maintenance';
import { ChecklistSetup } from './pages/maintenance/ChecklistSetup';
import { EmailRuleSetupPage } from './pages/maintenance/EmailRuleSetupPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
        </Route>

        <Route path="/setup" element={<SetupLayout />}>
          <Route index element={<General />} />
          <Route path="general" element={<General />} />
          <Route path="sites" element={<Sites />} />
          <Route path="buildings" element={<Buildings />} />
          <Route path="wings" element={<Wings />} />
          <Route path="floors" element={<Floors />} />
          <Route path="areas" element={<Areas />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="groups" element={<Groups />} />
          <Route path="sub-groups" element={<SubGroups />} />
          <Route path="asset-types" element={<AssetTypes />} />
        </Route>
        
        <Route path="/maintenance" element={<Layout />}>
          <Route index element={<Maintenance />} />
          <Route path="checklist-setup" element={<ChecklistSetup />} />
          <Route path="checklist-setup/email-rule" element={<EmailRuleSetupPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
