export function Footer() {
  return (
    <div className="footer">
      <b>Data note.</b> Every number on this page comes from the FM Adoption Analytics API
      (<code>/fm/adoption/*</code>), computed from PostHog autocapture events for this tenant only —
      no cross-tenant data. Because only autocapture is instrumented, some metrics are documented
      proxies rather than exact measures: <code>U6</code> bounce is a session with ≤ 1 pageview,
      <code>A4</code> dormancy uses a single 14-day cut, <code>A5</code> activation treats the first
      event in range as first-seen, and all Layer-3 funnel steps are inferred from{' '}
      <code>$pathname</code> patterns rather than <code>flow_started</code>/<code>flow_completed</code>{' '}
      events. <code>A1</code> needs a licensed-seat count (billing data, entered in the control bar)
      and <code>A8</code> shows share-of-active rather than share-of-provisioned. Modules and
      sub-modules are derived dynamically from real path segments — nothing is hardcoded.
    </div>
  );
}
