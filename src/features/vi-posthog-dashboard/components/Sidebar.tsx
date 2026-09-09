import { useViDashboard } from '../context/viDashboardStore';
import { PAGE_TITLES, type PageKey } from '../data/pages';

const NAV_ICONS: Record<PageKey, JSX.Element> = {
  pgTraffic: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.4 12.6 6.6 7.4l3.4 3.1 4.1-5.4 3.5 4.3" />
      <path d="M2.4 16.4h15.2" />
    </svg>
  ),
  pgAdopt: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.6" cy="6.8" r="2.9" />
      <path d="M2.6 16.6c0-2.7 2.2-4.6 5-4.6s5 1.9 5 4.6" />
      <path d="M13.4 4.3a2.9 2.9 0 0 1 0 5.4M14.6 12.4c1.8.5 3 1.9 3 4.2" />
    </svg>
  ),
  pgFlows: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2.4 17.4 6 10 9.6 2.6 6Z" />
      <path d="M2.6 10 10 13.6 17.4 10" />
      <path d="M2.6 14 10 17.6 17.4 14" />
    </svg>
  ),
};

const ORDER: PageKey[] = ['pgTraffic', 'pgAdopt', 'pgFlows'];

export function Sidebar() {
  const { page, setPage } = useViDashboard();

  return (
    <aside className="sidebar">
      <h1 className="brandmark">
        <span className="bm-full">Vi my Workspace</span>
        <span className="bm-mini">VW</span>
      </h1>
      <p className="brandmark-sub">Usage analytics</p>
      <nav aria-label="Sections">
        <div className="nav-group">
          <div className="nav-label">Layers</div>
          {ORDER.map((key) => (
            <button
              key={key}
              type="button"
              className={`nav-item${page === key ? ' on' : ''}`}
              data-tip={PAGE_TITLES[key]}
              onClick={() => {
                setPage(key);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="ni-ic">{NAV_ICONS[key]}</span>
              <span className="ni-t">{PAGE_TITLES[key]}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
