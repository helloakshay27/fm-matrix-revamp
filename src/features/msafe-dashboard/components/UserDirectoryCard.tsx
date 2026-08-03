import { useMemo, useState, type CSSProperties } from 'react';
import { Search } from 'lucide-react';
import { ChartCard } from './ChartCard';
import { StatusDot } from './StatusDot';
import { DIRECTORY, overallStatus } from '../data/mockData';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

type Filter = 'all' | 'internal' | 'external' | 'pending' | 'cleared';

const CHIPS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All (27,438)' },
  { id: 'internal', label: 'Internal FTE (19,204)' },
  { id: 'external', label: 'External NON-FTE (8,234)' },
  { id: 'pending', label: 'Pending Any Step (3,982)' },
  { id: 'cleared', label: 'Fully Cleared (21,088)' },
];

/** Full searchable/filterable user directory — matches vi_msafe_v6.html */
export function UserDirectoryCard({ style }: { style?: CSSProperties }) {
  const { openDrill } = useMsafeDashboard();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const data = useMemo(() => {
    let rows = DIRECTORY;
    if (filter === 'internal') rows = rows.filter((u) => u.type === 'Internal');
    if (filter === 'external') rows = rows.filter((u) => u.type === 'External');
    if (filter === 'pending') rows = rows.filter((u) => u.tr !== 'ok' || u.kr !== 'ok' || u.lm !== 'ok');
    if (filter === 'cleared') rows = rows.filter((u) => u.tr === 'ok' && u.kr === 'ok' && u.lm === 'ok');
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((u) => (u.name + u.emp + u.role).toLowerCase().includes(q));
    }
    return rows;
  }, [filter, search]);

  return (
    <ChartCard
      title="All Users — with KRCC, LMC, Training status at a glance"
      sub="Search by name, email, or emp ID · click any user for full drill-down"
      infoKey="directory"
      style={style}
      tag={
        <div className="usr-search">
          <Search size={14} />
          <input
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      }
    >
      <div className="mini-filter">
        {CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`mini-chip ${filter === c.id ? 'active' : ''}`}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="tbl-scroll" style={{ maxHeight: 420 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Emp ID</th>
              <th>Type</th>
              <th>Circle</th>
              <th>Role</th>
              <th style={{ textAlign: 'center' }}>Training</th>
              <th style={{ textAlign: 'center' }}>KRCC</th>
              <th style={{ textAlign: 'center' }}>LMC</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => {
              const st = overallStatus(u);
              return (
                <tr key={u.emp + u.name} onClick={() => openDrill('user-detail', u.name)}>
                  <td className="cell-strong">{u.name}</td>
                  <td className="cell-mono">{u.emp}</td>
                  <td>
                    <span className={`badge ${u.type === 'Internal' ? 'b-info' : 'b-neutral'}`}>
                      {u.type}
                    </span>
                  </td>
                  <td>{u.circle}</td>
                  <td>{u.role}</td>
                  <td style={{ textAlign: 'center' }}>
                    <StatusDot value={u.tr} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <StatusDot value={u.kr} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <StatusDot value={u.lm} />
                  </td>
                  <td>
                    <span className={`badge ${st.c}`}>{st.t}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
