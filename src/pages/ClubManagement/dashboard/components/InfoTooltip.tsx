import React from 'react';
import type { InfoEntry } from '../clubDashboardData';

export const InfoTooltip: React.FC<{ info: InfoEntry }> = ({ info }) => (
  <span className="info-i">
    <button type="button">i</button>
    <div className="info-tip">
      <div className="it-title">{info.title}</div>
      <div className="it-label">How it's calculated</div>
      <div className="it-calc">{info.calc}</div>
      <div className="it-desc">{info.desc}</div>
    </div>
  </span>
);
