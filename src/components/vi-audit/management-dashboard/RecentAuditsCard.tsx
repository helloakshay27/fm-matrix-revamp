import { useMemo, useState } from "react";
import { StatusBadge } from "./InfoButton";
import { SearchIcon } from "./icons";
import type { RecentAudit } from "./managementDashboardApi";

interface RecentAuditsCardProps {
  audits: RecentAudit[];
  loading: boolean;
  onAudit: (audit: RecentAudit) => void;
}

const PAGE_SIZE = 10;

export function RecentAuditsCard({ audits, loading, onAudit }: RecentAuditsCardProps) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = term
      ? audits.filter((audit) =>
          [audit.id, audit.circle, audit.auditor, audit.email, audit.mobile, audit.functionName, audit.location].some((field) =>
            field.toLowerCase().includes(term),
          ),
        )
      : audits;
    return matches.slice(0, PAGE_SIZE);
  }, [audits, query]);

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-hd">
        <div>
          <div className="card-title">Recent Audits</div>
          <div className="card-sub">Recently submitted audits by auditors · search by audit ID, circle, function, name, email ID or mobile number</div>
        </div>
        <div className="card-actions-row">
          <div className="usr-search">
            <SearchIcon />
            <input
              type="text"
              aria-label="Search recent audits"
              placeholder="Search audits…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="tbl-scroll" style={{ maxHeight: 320 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Audit ID</th>
              <th>Auditor</th>
              <th>Circle</th>
              <th>Function</th>
              <th>Submitted</th>
              <th style={{ textAlign: "right" }}>Observations</th>
              <th style={{ textAlign: "right" }}>CAPA</th>
              <th style={{ textAlign: "right" }}>CAPA Closed</th>
              <th style={{ textAlign: "right" }}>CAPA Pending</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", color: "var(--sage)" }}>
                  {loading ? "Loading recent audits…" : "No audits match your search"}
                </td>
              </tr>
            ) : (
              rows.map((audit) => (
                <tr key={audit.id} onClick={() => onAudit(audit)}>
                  <td>
                    <b>{audit.id}</b>
                  </td>
                  <td>
                    <div>{audit.auditor}</div>
                    <div style={{ fontSize: 10, color: "var(--sage)" }}>
                      {audit.email} · {audit.mobile}
                    </div>
                  </td>
                  <td>{audit.circle}</td>
                  <td>{audit.functionName}</td>
                  <td>{audit.submittedOn}</td>
                  <td style={{ textAlign: "right" }}>{audit.observations}</td>
                  <td style={{ textAlign: "right" }}>{audit.capa}</td>
                  <td style={{ textAlign: "right" }}>{audit.capaClosed}</td>
                  <td style={{ textAlign: "right" }}>{audit.capaPending}</td>
                  <td>
                    <StatusBadge status={audit.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
