import { AUDITS, DIR_CHIPS, INFO } from "./data";
import { SearchIcon } from "./icons";
import { InfoButton, StatusBadge } from "./InfoButton";

interface AuditDirectoryProps {
  filter: string;
  query: string;
  onFilter: (value: string) => void;
  onQuery: (value: string) => void;
  onAudit: (index: number) => void;
}

export function AuditDirectory({ filter, query, onFilter, onQuery, onAudit }: AuditDirectoryProps) {
  const needle = query.toLowerCase();
  const rows = AUDITS.map((audit, index) => ({ audit, index })).filter(({ audit }) => {
    const statusMatch = filter === "all" || audit.status === filter || (filter === "spoc" && audit.spocP > 0) || (filter === "ao" && audit.status === "Open" && audit.obs > audit.closed);
    const text = `${audit.id}${audit.loc}${audit.loc2}${audit.auditor}${audit.circle}`.toLowerCase();
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
          {DIR_CHIPS.map(([key, label]) => (
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
                rows.map(({ audit, index }) => (
                  <tr key={audit.id} onClick={() => onAudit(index)}>
                    <td>
                      <b>{audit.id}</b>
                    </td>
                    <td>{audit.type}</td>
                    <td>{audit.circle}</td>
                    <td>{audit.loc}</td>
                    <td>{audit.auditor}</td>
                    <td>{audit.date}</td>
                    <td style={{ textAlign: "center" }}>{audit.obs}</td>
                    <td style={{ textAlign: "center" }}>
                      {audit.closed} / {audit.obs}
                    </td>
                    <td>
                      <StatusBadge status={audit.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 24, color: "var(--sage)" }}>
                    No audits match these filters.
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
