import React from 'react';

type Persona = 'branch' | 'super';

interface PersonaScreenProps {
  selected: Persona | null;
  onSelect: (p: Persona) => void;
  onEnter: () => void;
}

export const PersonaScreen: React.FC<PersonaScreenProps> = ({ selected, onSelect, onEnter }) => (
  <div id="personaScreen">
    <div className="persona-head">
      <div className="eyebrow">Club Management · Insights Layer v6</div>
      <h1>Who's looking at this dashboard?</h1>
      <p>Select a role to enter your view. Wireframe · v6 · The Recess Club.</p>
    </div>
    <div className="persona-cards" style={{ justifyContent: 'center' }}>
      <div className={'persona-card' + (selected === 'branch' ? ' selected' : '')} onClick={() => onSelect('branch')}>
        <div className="icon" style={{ background: 'rgba(23,87,44,.1)' }}>🏢</div>
        <h3>Branch Manager</h3>
        <div className="scope">Single Branch · Locked</div>
        <ul>
          <li>Financial overview, collections, pending payments</li>
          <li>Membership intelligence with period filter</li>
          <li>Bookings, available slots, coach schedule</li>
          <li>Capacity blocks, tickets, events</li>
        </ul>
      </div>
      <div className={'persona-card' + (selected === 'super' ? ' selected' : '')} onClick={() => onSelect('super')}>
        <div className="icon" style={{ background: 'rgba(23,87,44,.1)' }}>🏛️</div>
        <h3>Super Admin</h3>
        <div className="scope">All Branches · Comparison</div>
        <ul>
          <li>Branch health scorecard, ARPU, churn</li>
          <li>Revenue intelligence cross-branch</li>
          <li>Payment failure, renewal conversion trends</li>
        </ul>
      </div>
    </div>
    <button id="enterBtn" className={selected ? 'ready' : ''} onClick={onEnter}>
      {selected ? `Enter as ${selected === 'branch' ? 'Branch Manager' : 'Super Admin'} →` : 'Select a role to continue →'}
    </button>
  </div>
);
