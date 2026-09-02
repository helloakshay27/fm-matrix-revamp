import React, { useState } from 'react';
import './ClubDashboardV6.css';
import { DrillProvider } from './DrillContext';
// import { PersonaScreen } from './components/PersonaScreen';
import { BranchManagerDashboard } from './components/BranchManagerDashboard';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AIChatWidget } from './components/AIChatWidget';

type Persona = 'branch' | 'super';

const ClubDashboardV6: React.FC = () => {
  // const [selected, setSelected] = useState<Persona | null>(null);
  // Persona-selection screen disabled for now - open straight into the Branch Manager dashboard.
  const [entered, setEntered] = useState<Persona | null>('branch');

  // const enter = () => {
  //   if (selected) setEntered(selected);
  // };

  const switchRole = () => setEntered((p) => (p === 'branch' ? 'super' : 'branch'));

  return (
    <div className="club-dashboard-v6">
      <DrillProvider>
        {/* {!entered && <PersonaScreen selected={selected} onSelect={setSelected} onEnter={enter} />} */}
        {entered === 'branch' && <BranchManagerDashboard onSwitchRole={switchRole} />}
        {entered === 'super' && <SuperAdminDashboard onSwitchRole={switchRole} />}
        {entered && <AIChatWidget persona={entered} />}
      </DrillProvider>
    </div>
  );
};

export default ClubDashboardV6;
