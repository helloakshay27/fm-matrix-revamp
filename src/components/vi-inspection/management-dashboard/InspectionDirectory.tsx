import { DIR_CHIPS, DIR_COLS, ROWS, cardInfo } from "./data";
import { InfoButton } from "./InfoButton";
import { SearchIcon } from "./icons";

interface InspectionDirectoryProps {
  filter: string;
  query: string;
  onFilter: (value: string) => void;
  onQuery: (value: string) => void;
  onRow: (index: number) => void;
}

export function InspectionDirectory({ filter, query, onFilter, onQuery, onRow }: InspectionDirectoryProps) {
  const needle = query.trim().toLowerCase();
  // Same rule as the wireframe: a chip matches the row status or one of its flags (spoc / ao).
  const rows = ROWS.map((row, index) => ({ row, index })).filter(({ row }) => {
    if (needle && !row.query.toLowerCase().includes(needle)) return false;
    return filter === "all" || row.status === filter || (row.flags as readonly string[]).includes(filter);
  });

  return (
    <div className="sec" id="sec-directory">
      <div className="sec-hd"><div className="sec-lbl">Inspection Directory — Unified Progress View</div><div className="sec-line" /></div>
      <div className="card">
        <div className="card-hd">
          <div>
            <div className="card-title">All Inspections — with findings and action plan progress at a glance<InfoButton text={cardInfo("All Inspections — with findings and action plan progress at a glance")} /></div>
            <div className="card-sub">Search by ID, location or person · click any row for full drill-down</div>
          </div>
          <div className="usr-search">
            <SearchIcon />
            <input placeholder="Search…" value={query} onChange={(event) => onQuery(event.target.value)} />
          </div>
        </div>
        <div className="mini-filter">
          {DIR_CHIPS.map(([key, label]) => (
            <button key={key} type="button" className={`mini-chip${filter === key ? " active" : ""}`} onClick={() => onFilter(key)}>{label}</button>
          ))}
        </div>
        <div className="tbl-scroll" style={{ maxHeight: 420 }}>
          <table className="tbl">
            <thead><tr><th>Inspection ID</th><th>Type</th><th>Circle</th><th>Work Location</th><th>Inspector</th><th>Date</th><th>Findings</th><th>Actions closed</th><th>Status</th></tr></thead>
            <tbody>
              {rows.length ? (
                rows.map(({ row, index }) => (
                  <tr key={row.query} style={{ cursor: "pointer" }} onClick={() => onRow(index)} dangerouslySetInnerHTML={{ __html: row.html }} />
                ))
              ) : (
                <tr><td colSpan={DIR_COLS} style={{ textAlign: "center", padding: 24, color: "var(--sage)" }}>No records match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
