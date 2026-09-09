import React from 'react';

export const AlertBar: React.FC = () => (
  <div className="alertbar">
    <div className="tag">Act Now</div>
    <div className="alerts">
      <div className="aitem"><span className="dot" style={{ background: '#E7848E' }} />Branch D net membership negative 3 consecutive months – churn 4.9% – intervene</div>
      <div className="aitem"><span className="dot" style={{ background: '#EDC488' }} />₹1.07L renewals at risk across 26 members – escalate</div>
      <div className="aitem"><span className="dot" style={{ background: '#E7848E' }} />Vendor payables ₹3.1L – Branch C oldest 30 days – release POs</div>
    </div>
  </div>
);
