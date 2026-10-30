import { useMemo } from "react";
import { fmt } from "./data";
import { SearchIcon } from "./icons";
import { InfoButton, StatusBadge } from "./InfoButton";
import type { RecentAudit } from "./managementDashboardApi";

interface AuditDirectoryProps {
  audits: RecentAudit[];
  loading: boolean;
  filter: string;
  query: string;
  onFilter: (value: string) => void;
  onQuery: (value: string) => void;
  onAudit: (audit: RecentAudit) => void;
}

export function AuditDirectory({ audits, loading, filter, query, onFilter, onQuery, onAudit }: AuditDirectoryProps) {
  const chips = useMemo(() => {
    const count = (status: string) => audits.filter((audit) => audit.status === status).length;
    const pending = audits.filter((audit) => audit.capaPending > 0).length;
    const items: [string, string][] = [["all", `All (${fmt(audits.length)})`]];
    if (count("Draft")) items.push(["Draft", `Draft (${fmt(count("Draft"))})`]);
    items.push(["Open", `Open (${fmt(count("Open"))})`], ["Closed", `Closed (${fmt(count("Closed"))})`]);
    if (pending) items.push(["pending", `Pending CAPA (${fmt(pending)})`]);
    return items;
  }, [audits]);

  const needle = query.toLowerCase();
  const rows = audits.filter((audit) => {
    const statusMatch = filter === "all" || audit.status === filter || (filter === "pending" && audit.capaPending > 0);
    const text = `${audit.id}${audit.location}${audit.auditor}${audit.circle}${audit.functionName}${audit.type}`.toLowerCase();
    return statusMatch && (!needle || text.includes(needle));
  });

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
              <InfoButton text="Every audit returned for this filter, with its observation and CAPA progress." />
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
              {rows.length ? (
                rows.map((audit) => (
                  <tr key={audit.id} onClick={() => onAudit(audit)}>
                    <td>
                      <b>{audit.id}</b>
                    </td>
                    <td>{audit.type}</td>
                    <td>{audit.circle}</td>
                    <td>{audit.location}</td>
                    <td>{audit.auditor}</td>
                    <td>{audit.submittedOn}</td>
                    <td style={{ textAlign: "center" }}>{audit.observations}</td>
                    <td style={{ textAlign: "center" }}>
                      {audit.capaClosed} / {audit.capa}
                    </td>
                    <td>
                      <StatusBadge status={audit.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 24, color: "var(--sage)" }}>
                    {loading ? "Loading audits…" : "No audits match these filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
