import React from 'react';

interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  ctx?: React.ReactNode;
  delta?: React.ReactNode;
  bar?: { width: number; color?: string };
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, ctx, delta, bar, onClick }) => (
  <div className="kpi" onClick={onClick}>
    <div className="label">{label}</div>
    <div className="value">{value}</div>
    {bar && (
      <div className="kpi-bar">
        <div style={{ width: `${bar.width}%`, background: bar.color || 'rgba(255,255,255,.5)' }} />
      </div>
    )}
    {ctx && <div className="ctx">{ctx}</div>}
    {delta && <div className="delta">{delta}</div>}
  </div>
);
