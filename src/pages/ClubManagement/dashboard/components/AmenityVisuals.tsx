import React from 'react';
import { AiInsightBlock } from './AiInsightBlock';
import { InfoTooltip } from './InfoTooltip';
import { CHART_CTX, getInfo } from '../clubDashboardData';
import { useDrill } from '../DrillContext';
import { occupancyHTML } from '../drillTemplates';
import type { AvailableSlotsByDay, AmenityUtilisationRow } from '@/services/clubDashboardApi';

function heatColor(v: number) {
  if (v === 0) return '#E7848E';
  if (v === 1) return '#EDC488';
  if (v <= 4) return '#9EC8BA';
  return '#108C72';
}

export const AvailableSlotsHeatmap: React.FC<{ data?: AvailableSlotsByDay }> = ({ data }) => {
  const { openDrill } = useDrill();
  const hours = data?.hours ?? [];
  const facilities = data?.facilities ?? [];

  return (
    <div className="card">
      <div className="card-title">
        Available Slots – Today <span className="muted">empty bookable slots per court per hour</span>
        <InfoTooltip info={getInfo('Available Slots')} />
      </div>
      <div className="chart-sub">0 = fully booked · 1 = last slot · 2-4 = limited · 5+ = open.</div>
      {facilities.length > 0 ? (
        <div className="heatgrid" style={{ gridTemplateColumns: `78px repeat(${hours.length},1fr)` }}>
          <div />
          {hours.map((h) => (
            <div className="hhead" key={h}>{h}</div>
          ))}
          {facilities.map((facility) => (
            <React.Fragment key={facility.facility_id}>
              <div className="hlabel">{facility.facility_name}</div>
              {hours.map((h) => {
                const slot = facility.slots.find((s) => s.hour === h);
                const v = slot?.available ?? 0;
                return (
                  <div
                    key={h}
                    className="hcell"
                    style={{ background: heatColor(v) }}
                    onClick={() => openDrill(`${facility.facility_name} – ${h}:00`, v === 0 ? 'Fully booked' : `${v} slot${v > 1 ? 's' : ''} available`, occupancyHTML())}
                  >
                    {v === 0 ? 'Full' : v}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="chart-sub">No data for this date.</div>
      )}
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

export const CapacityAnalysisCard: React.FC<{ data: AmenityUtilisationRow[] }> = ({ data }) => {
  const { openDrill } = useDrill();
  return (
    <div className="card">
      <div className="card-title">Amenity Utilisation Analysis</div>
      <div className="chart-sub">Average utilisation per amenity for the selected range.</div>
      <div>
        {data.map((row) => {
          const v = Math.round(row.average_utilization_percentage * 10) / 10;
          const color = v > 75 ? '#E7848E' : v > 50 ? '#EDC488' : '#108C72';
          return (
            <div key={row.amenity_name} className="hbar-row" style={{ cursor: 'pointer' }} onClick={() => openDrill(row.amenity_name, `Avg utilisation ${v}%`, occupancyHTML())}>
              <div className="hbar-lbl">{row.amenity_name}</div>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: `${Math.min(v, 100)}%`, background: color }} />
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
