import type { CSSProperties, ReactNode } from 'react';
import {
  Users,
  FileText,
  CheckCircle2,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  ClipboardCheck,
  MapPin,
  Download,
} from 'lucide-react';
import type { AccordionKey } from '../data/constants';
import { ADMIN_KPIS } from '../data/mockData';
import { InfoButton } from './InfoButton';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

const ICONS: Record<string, ReactNode> = {
  users: <Users size={16} />,
  'krcc-filled': <FileText size={16} />,
  'krcc-approved': <CheckCircle2 size={16} />,
  'train-cat': <GraduationCap size={16} />,
  'train-user': <UserCheck size={16} />,
  'train-int': <ShieldCheck size={16} />,
  'train-ext': <ShieldCheck size={16} />,
  lmc: <ClipboardCheck size={16} />,
  smt: <MapPin size={16} />,
};

const HINT: Record<string, string> = {
  users: 'Users',
  krcc: 'KRCC',
  training: 'Training',
  lmc: 'LMC',
  smt: 'SMT',
};

export function KpiOverview() {
  const { openAcc, toggleAccordion, kpiUsers, kpiLmc, kpiSmt, showToast } = useMsafeDashboard();

  const valueFor = (id: string, fallback: string, sub?: string) => {
    if (id === 'users') return kpiUsers;
    if (id === 'lmc') return kpiLmc;
    if (id === 'smt') return kpiSmt;
    if (id === 'krcc-approved') return (
      <>
        {fallback} {sub ? <span className="kpi-val-sub">{sub}</span> : null}
      </>
    );
    if (sub) {
      return (
        <>
          {fallback} <span className="kpi-val-sub">{sub}</span>
        </>
      );
    }
    return fallback;
  };

  return (
    <div className="sec" id="sec-overview">
      <div className="sec-hd">
        <div className="sec-lbl">Overview — Compliance Snapshot</div>
        <div className="sec-line" />
      </div>
      <div className="flow-hint">
        Click any KPI to expand its full section below · numbers follow the M-Safe user journey, left to right
      </div>

      <div className="kpi-grid flow-kpi-grid">
        {ADMIN_KPIS.map((k) => {
          const active = openAcc === k.group;
          const style: CSSProperties = {};
          if (k.color) (style as Record<string, string>)['--kpi-c'] = k.color;
          if (k.tint) (style as Record<string, string>)['--kpi-tint'] = k.tint;
          return (
            <div
              key={k.id}
              className={`kpi flow-kpi ${active ? 'kpi-active' : ''}`}
              style={style}
              data-group={k.group}
              onClick={() => toggleAccordion(k.group as AccordionKey)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleAccordion(k.group as AccordionKey);
              }}
            >
              <button
                type="button"
                className="kpi-dl-btn"
                title="Download Excel"
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`Excel export started · ${k.download}`);
                }}
              >
                <Download size={14} />
              </button>
              <div className="kpi-top">
                <div className="kpi-lbl">
                  {k.label}
                  <InfoButton infoKey={k.infoKey} />
                </div>
                <div className="kpi-ico">{ICONS[k.id]}</div>
              </div>
              <div className="kpi-val">{valueFor(k.id, k.value, k.sub)}</div>
              <div className="kpi-flow-arrow">↓ tap to view {HINT[k.group]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
