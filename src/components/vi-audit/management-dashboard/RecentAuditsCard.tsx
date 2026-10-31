import { useEffect, useState } from "react";
import { fmt } from "./data";
import type { RecentAudit } from "./viAuditDashboardApi";
import { StatusBadge } from "./InfoButton";
import { SearchIcon } from "./icons";
import { TablePager } from "./TablePager";

interface RecentAuditsCardProps {
  audits: RecentAudit[] | null;
  total: number;
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onAudit: (audit: RecentAudit) => void;
}

const PAGE_SIZE = 10;

export function RecentAuditsCard({ audits, total, loading, search, onSearchChange, onAudit }: RecentAuditsCardProps) {
  const [page, setPage] = useState(1);
  const list = audits ?? [];
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const rows = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, audits]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-hd">
        <div>
          <div className="card-title">Recent Audits</div>
          <div className="card-sub">
            Recently submitted audits by auditors · search by name, email or mobile number
            {!loading && total > list.length ? ` · showing ${list.length} of ${fmt(total)}` : ""}
          </div>
        </div>
        <div className="card-actions-row">
          <div className="usr-search">
            <SearchIcon />
            <input
              type="text"
              aria-label="Search recent audits by name, email or mobile"
              placeholder="Search by name, email or mobile no"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="tbl-scroll" style={{ maxHeight: 360 }}>
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
            {loading ? (
              <tr><td colSpan={10} style={{ textAlign: "center", color: "var(--sage)" }}>Loading…</td></tr>
            ) : !audits ? (
              <tr><td colSpan={10} style={{ textAlign: "center", color: "var(--sage)" }}>Couldn’t load recent audits</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: "center", color: "var(--sage)" }}>No audits match your search</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.audit_id} onClick={() => onAudit(row)}>
                  <td><b>{row.audit_id}</b></td>
                  <td>
                    <div>{row.auditor}</div>
                    <div style={{ fontSize: 10, color: "var(--sage)" }}>{[row.email, row.mobile].filter(Boolean).join(" · ")}</div>
                  </td>
                  <td>{row.circle}</td>
                  <td>{row.function_name}</td>
                  <td>{row.submitted_on}</td>
                  <td style={{ textAlign: "right" }}>{fmt(row.observations)}</td>
                  <td style={{ textAlign: "right" }}>{fmt(row.capa_count)}</td>
                  <td style={{ textAlign: "right" }}>{fmt(row.capa_closed)}</td>
                  <td style={{ textAlign: "right" }}>{fmt(row.capa_pending)}</td>
                  <td><StatusBadge status={row.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!loading && audits && (
        <TablePager page={page} totalPages={totalPages} total={list.length} pageSize={PAGE_SIZE} onPage={setPage} />
      )}
    </div>
  );
}
