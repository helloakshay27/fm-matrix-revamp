import { ChartCard } from "./ChartCard";
import { RecentAuditsCard } from "./RecentAuditsCard";
import type { ChartSpec } from "./data";
import { EMPTY_CHART, type RecentAudit } from "./viAuditDashboardApi";

interface AuditsPanelProps {
  highlighted: boolean;
  loading: boolean;
  auditFunc: ChartSpec | null;
  auditCircle: ChartSpec | null;
  recent: RecentAudit[] | null;
  recentTotal: number;
  onAudit: (audit: RecentAudit) => void;
}

export function AuditsPanel({ highlighted, loading, auditFunc, auditCircle, recent, recentTotal, onAudit }: AuditsPanelProps) {
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-audits">
      <div className="acc-hd">
        <div>
          <div className="acc-title">Audits</div>
          <div className="acc-sub">Status, volume over time, and where audits are being carried out</div>
        </div>
      </div>
      <div className="g g2">
        <ChartCard title="Audits by Function" sub="Audits, observations, CAPA assigned and CAPA closed per function" spec={auditFunc ?? EMPTY_CHART} options={["bar", "table"]} loading={loading} unavailable={!loading && !auditFunc} />
        <ChartCard title="Audits per Circle" sub="Audits, observations, CAPA assigned and CAPA closed" spec={auditCircle ?? EMPTY_CHART} options={["bar", "table"]} loading={loading} unavailable={!loading && !auditCircle} />
      </div>
      <RecentAuditsCard audits={recent} total={recentTotal} loading={loading} onAudit={onAudit} />
    </div>
  );
}
