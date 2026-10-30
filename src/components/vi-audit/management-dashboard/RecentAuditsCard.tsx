import { useMemo, useState } from "react";
import { AUDITS, CAPA_INITIATED_RATIO, FUNCTIONS, type AuditRow } from "./data";
import { StatusBadge } from "./InfoButton";
import { SearchIcon } from "./icons";

interface RecentAuditsCardProps {
  onAudit: (index: number) => void;
}

interface RecentAudit {
  index: number;
  audit: AuditRow;
  func: string;
  email: string;
  mobile: string;
  submittedAt: number;
  capa: number;
  capaClosed: number;
  capaPending: number;
}

const PAGE_SIZE = 10;

const parseDate = (value: string) => {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
};

// Contact details and function are not part of the audit mock data, so they are derived per audit.
const RECENT: RecentAudit[] = AUDITS.map((audit, index) => {
  const capa = Math.round(audit.obs * CAPA_INITIATED_RATIO);
  const capaClosed = Math.min(audit.closed, capa);
  return {
    index,
    audit,
    func: FUNCTIONS[index % FUNCTIONS.length],
    email: `${audit.auditor.toLowerCase().replace(/[^a-z]+/g, ".")}@vimail.example`,
    mobile: `98${String(20000000 + index * 7919).slice(-8)}`,
    submittedAt: parseDate(audit.date),
    capa,
    capaClosed,
    capaPending: capa - capaClosed,
  };
})
  .filter((row) => row.audit.status !== "Draft")
  .sort((a, b) => b.submittedAt - a.submittedAt);

export function RecentAuditsCard({ onAudit }: RecentAuditsCardProps) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = term
      ? RECENT.filter((row) => [row.audit.circle, row.audit.auditor, row.email, row.mobile, row.func].some((field) => field.toLowerCase().includes(term)))
      : RECENT;
    return matches.slice(0, PAGE_SIZE);
  }, [query]);

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-hd">
        <div>
          <div className="card-title">Recent Audits</div>
          <div className="card-sub">Recently submitted audits by auditors · search by circle, function, name, email ID or mobile number</div>
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
                  No audits match your search
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.audit.id} onClick={() => onAudit(row.index)}>
                  <td>
                    <b>{row.audit.id}</b>
                  </td>
                  <td>
                    <div>{row.audit.auditor}</div>
                    <div style={{ fontSize: 10, color: "var(--sage)" }}>
                      {row.email} · {row.mobile}
                    </div>
                  </td>
                  <td>{row.audit.circle}</td>
                  <td>{row.func}</td>
                  <td>{row.audit.date}</td>
                  <td style={{ textAlign: "right" }}>{row.audit.obs}</td>
                  <td style={{ textAlign: "right" }}>{row.capa}</td>
                  <td style={{ textAlign: "right" }}>{row.capaClosed}</td>
                  <td style={{ textAlign: "right" }}>{row.capaPending}</td>
                  <td>
                    <StatusBadge status={row.audit.status} />
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
