/** Ported verbatim from the wireframe's footer note. */
export function Footer() {
  return (
    <div className="footer">
      <b>Wireframe note.</b> Single-tenant gate-admin view — shows only one society&rsquo;s own gate
      staff, visitors and vehicles; no cross-society data. <b>Every number on this dashboard is
      illustrative sample data</b> — it recomputes as you change <code>device</code> and{' '}
      <code>previous period</code>, but there is no live PostHog project behind SmartSecure yet.
      The <b>module names, screen structure, and event names</b> are the real, documented events
      from the SmartSecure PostHog Events catalogue (17 modules, 180 events across 38 categories) —
      they describe intended instrumentation, but nothing is actually flowing into PostHog today,
      so every volume, rate, and trend line is a placeholder standing in for that future data.
      Hover the <code>i</code> on any tile or chart for its exact definition.
    </div>
  );
}
