import { DIR_CHIPS, ROWS, cardInfo } from "./data";
import { InfoButton } from "./InfoButton";
import { SearchIcon } from "./icons";

interface IncidentDirectoryProps {
  filter: string;
  query: string;
  onFilter: (value: string) => void;
  onQuery: (value: string) => void;
  onRow: (index: number) => void;
}

export function IncidentDirectory({ filter, query, onFilter, onQuery, onRow }: IncidentDirectoryProps) {
  const needle = query.trim().toLowerCase();
  const rows = ROWS.map((row, index) => ({ row, index })).filter(({ row }) => {
    if (needle && !row.query.toLowerCase().includes(needle)) return false;
    if (filter === "all") return true;
    if (filter === "Draft" || filter === "Open" || filter === "Closed") return row.status === filter;
    return (row.flags as readonly string[]).includes(filter);
  });

  return (
    <div className="sec" id="sec-directory">
      <div className="sec-hd"><div className="sec-lbl">Incident Directory — Unified Progress View</div><div className="sec-line" /></div>
      <div className="card">
        <div className="card-hd">
          <div>
            <div className="card-title">All Incidents — with checklist and action plan progress at a glance<InfoButton text={cardInfo("All Incidents — with checklist and action plan progress at a glance")} /></div>
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
            <thead><tr><th>Incident ID</th><th>Classification</th><th>Circle</th><th>Work Location</th><th>Reporter</th><th>Date</th><th>Injury</th><th>Items closed</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map(({ row, index }) => (
                <tr key={row.query} style={{ cursor: "pointer" }} onClick={() => onRow(index)} dangerouslySetInnerHTML={{ __html: row.html }} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
