import { Card, CardHead } from '../components/Card';
import { Guard } from '../components/Guard';
import { SiteHealthTable } from '../components/tables/SiteHealthTable';
import { useDashboard } from '../context/DashboardContext';

/**
 * Site-wise breakdown, shown whenever the scope is "All sites". There is no per-site
 * endpoint, so this is one `traffic_session` call per allowed site; rows appear as each
 * call lands rather than waiting for the whole fan-out.
 */
export function SiteBreakdownSection() {
  const { vm, setTier, setScope } = useDashboard();
  const { siteHealth, status, scopedSites, siteLeague } = vm;

  // Only meaningful when the scope spans more than one site — a single-site scope already
  // has these numbers in the Layer-1 tiles.
  if (scopedSites.length < 2 || siteLeague.total === 0) return null;

  /** Clicking a row drills to that single site, which is the Site Manager tier. */
  const drillToSite = (siteId: string) => {
    setTier('t1');
    setScope(siteId);
  };

  const rows = siteHealth?.rows ?? [];
  const streaming = siteLeague.loaded > 0 && siteLeague.loaded < siteLeague.total;

  return (
    <div className="phg-section" id="secSites">
      <div className="phg-section-head">
        <h2>Site-wise breakdown</h2>
        <span className="phg-layerpill">{siteLeague.total + siteLeague.skipped} sites in scope</span>
        <span className="phg-sd">Every site in the current scope, ranked by active users — click a row to drill into that site.</span>
      </div>

      <Card
        accent="green"
        infoKey="chart.siteHealth"
        aiKey="chart.siteHealth"
        bodyClassName="phg-tbl-wrap"
        head={
          <CardHead
            cr={
              <>
                Per-site traffic &amp; session
                {streaming && (
                  <span className="phg-loadnote">
                    <span className="phg-spin" /> {siteLeague.loaded} of {siteLeague.total} sites loaded…
                  </span>
                )}
                {siteLeague.failed > 0 && !streaming && (
                  <span className="phg-loadnote phg-state-err">
                    {siteLeague.failed} site(s) failed to load
                  </span>
                )}
                {siteLeague.skipped > 0 && (
                  <span className="phg-loadnote">
                    · {siteLeague.skipped} further site(s) not queried (fan-out capped at {siteLeague.total})
                  </span>
                )}
              </>
            }
            ct="Every site, busiest first"
            cd="⚑ = sudden drop (active users down 25%+ vs the previous period). Sites with no events in the range show zero."
          />
        }
      >
        <Guard
          status={{ loading: rows.length === 0 && status.siteHealth.loading, error: status.siteHealth.error }}
          empty={rows.length === 0}
          emptyLabel="No site returned activity for this filter set."
        >
          <table className="phg-league">
            <SiteHealthTable rows={rows} onSelect={drillToSite} />
          </table>
        </Guard>
      </Card>
    </div>
  );
}
