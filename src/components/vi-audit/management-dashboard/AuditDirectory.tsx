import { fmt, INFO } from "./data";
import { SearchIcon } from "./icons";
import { InfoButton, StatusBadge } from "./InfoButton";
import type { AuditKpi, RecentAudit } from "./viAuditDashboardApi";

interface AuditDirectoryProps {
  audits: RecentAudit[] | null;
  kpi: AuditKpi | null;
  loading: boolean;
  filter: string;
  query: string;
  onFilter: (value: string) => void;
  onQuery: (value: string) => void;
  onAudit: (audit: RecentAudit) => void;
}

export function AuditDirectory({ audits, kpi, loading, filter, query, onFilter, onQuery, onAudit }: AuditDirectoryProps) {
  const list = audits ?? [];
  const needle = query.toLowerCase();
  const rows = list.filter((audit) => {
    const statusMatch = filter === "all" || audit.status === filter;
    const text = `${audit.audit_id}${audit.audit_location}${audit.auditor}${audit.circle}${audit.function_name}`.toLowerCase();
    return statusMatch && (!needle || text.includes(needle));
  });
  const chips: [string, string][] = [
    ["all", `All (${fmt(kpi?.total_audits ?? list.length)})`],
    ["Open", `Open (${fmt(kpi?.open_audits ?? list.filter((audit) => audit.status === "Open").length)})`],
    ["Closed", `Closed (${fmt(kpi?.closed_audits ?? list.filter((audit) => audit.status === "Closed").length)})`],
  ];

  return (
    <div className="sec" id="sec-directory">
      <div className="sec-hd">
        <div className="sec-lbl">Audit Directory — Unified Progress View</div>
        <div className="sec-line" />
      </div>
      <div className="card">
        <div className="card-hd">
          <div>
            <div className="card-title">
              All Audits — with observation and action plan progress at a glance
              <InfoButton text={INFO.dir} />
            </div>
            <div className="card-sub">Search by audit ID, location or auditor · click any audit for full drill-down</div>
          </div>
          <div className="usr-search">
            <SearchIcon />
            <input placeholder="Search audits…" value={query} onChange={(event) => onQuery(event.target.value)} />
          </div>
        </div>
        <div className="mini-filter">
          {chips.map(([key, label]) => (
            <button key={key} type="button" className={`mini-chip${filter === key ? " active" : ""}`} onClick={() => onFilter(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="tbl-scroll" style={{ maxHeight: 420 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Type</th>
                <th>Circle</th>
                <th>Work Location</th>
                <th>Auditor</th>
                <th>Date</th>
                <th style={{ textAlign: "center" }}>Observations</th>
                <th style={{ textAlign: "center" }}>Actions closed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 24, color: "var(--sage)" }}>Loading…</td></tr>
              ) : !audits ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 24, color: "var(--sage)" }}>Couldn’t load audits</td></tr>
              ) : rows.length ? (
                rows.map((audit) => (
                  <tr key={audit.audit_id} onClick={() => onAudit(audit)}>
                    <td><b>{audit.audit_id}</b></td>
                    <td>{audit.audit_type}</td>
                    <td>{audit.circle}</td>
                    <td>{audit.audit_location}</td>
                    <td>{audit.auditor}</td>
                    <td>{audit.submitted_on}</td>
                    <td style={{ textAlign: "center" }}>{audit.observations}</td>
                    <td style={{ textAlign: "center" }}>{audit.capa_closed} / {audit.capa_count}</td>
                    <td><StatusBadge status={audit.status} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 24, color: "var(--sage)" }}>No audits match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
