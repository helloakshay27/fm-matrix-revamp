import React from 'react';
import { AiInsightBlock } from './AiInsightBlock';
import { InfoTooltip } from './InfoTooltip';
import { D, HEAT_COURTS, HEAT_DATA, HEAT_HOURS, CHART_CTX, getInfo } from '../clubDashboardData';
import { useDrill } from '../DrillContext';
import { occupancyHTML } from '../drillTemplates';

function heatColor(v: number) {
  if (v === 0) return '#E7848E';
  if (v === 1) return '#EDC488';
  if (v <= 4) return '#9EC8BA';
  return '#108C72';
}

export const AvailableSlotsHeatmap: React.FC = () => {
  const { openDrill } = useDrill();
  return (
    <div className="card">
      <div className="card-title">
        Available Slots – Today <span className="muted">empty bookable slots per court per hour</span>
        <InfoTooltip info={getInfo('Available Slots')} />
      </div>
      <div className="chart-sub">0 = fully booked · 1 = last slot · 2-4 = limited · 5+ = open.</div>
      <div className="heatgrid" style={{ gridTemplateColumns: '78px repeat(12,1fr)' }}>
        <div />
        {HEAT_HOURS.map((h) => (
          <div className="hhead" key={h}>{h}</div>
        ))}
        {HEAT_COURTS.map((court, ci) => (
          <React.Fragment key={court}>
            <div className="hlabel">{court}</div>
            {HEAT_HOURS.map((h, hi) => {
              const v = HEAT_DATA[ci][hi];
              return (
                <div
                  key={h}
                  className="hcell"
                  style={{ background: heatColor(v) }}
                  onClick={() => openDrill(`${court} – ${h}`, v === 0 ? 'Fully booked' : `${v} slot${v > 1 ? 's' : ''} available`, occupancyHTML())}
                >
                  {v === 0 ? 'Full' : v}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="heatmap-legend">
        <span><span className="leg-dot" style={{ background: '#E7848E' }} />Full</span>
        <span><span className="leg-dot" style={{ background: '#EDC488' }} />Last slot</span>
        <span><span className="leg-dot" style={{ background: '#9EC8BA' }} />Limited</span>
        <span><span className="leg-dot" style={{ background: '#108C72' }} />Open</span>
      </div>
      <AiInsightBlock ctxText={CHART_CTX.heatmap} />
    </div>
  );
};

export const CapacityAnalysisCard: React.FC = () => {
  const { openDrill } = useDrill();
  return (
    <div className="card">
      <div className="card-title">Amenity Utilisation Analysis</div>
      <div className="chart-sub">Padel near capacity. Chess and Kabaddi chronically underutilised.</div>
      <div>
        {D.amenNames.map((n, i) => {
          const v = D.capacity[i];
          const color = v > 75 ? '#E7848E' : v > 50 ? '#EDC488' : '#108C72';
          return (
            <div key={n} className="hbar-row" style={{ cursor: 'pointer' }} onClick={() => openDrill(n, `Avg utilisation ${v}%`, occupancyHTML())}>
              <div className="hbar-lbl">{n}</div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: `${v}%`, background: color }} />
              </div>
              <div className="hbar-val" style={{ color }}>{v}%</div>
            </div>
          );
        })}
      </div>
      <AiInsightBlock ctxText={CHART_CTX.capacityBars} />
    </div>
  );
};
