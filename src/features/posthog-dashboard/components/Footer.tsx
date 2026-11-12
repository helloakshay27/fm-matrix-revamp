export function Footer() {
  return (
    <div className="footer">
      <b>Data note.</b> Every number on this page comes from the FM Adoption Analytics API
      (<code>/commercial/fm/adoption/*</code>), computed from PostHog autocapture events for this tenant only —
      no cross-tenant data. Some metrics are documented proxies rather than exact measures:{' '}
      <code>U6</code> bounce is a session that never gets past the sign-in / home / dashboard pages,
      dormancy uses a single 14-day cut, <code>A4</code> activation treats a user's first event as
      first-seen, and Layer-3 funnel steps are found from the module's own events (ordered by when they
      happen in a session) rather than <code>flow_started</code>/<code>flow_completed</code>{' '}
      events. <code>A1</code> needs a licensed-seat count (billing data, entered in the control bar)
      and <code>A8</code> shows share-of-active rather than share-of-provisioned. Modules and
      sub-modules are derived dynamically from real path segments — nothing is hardcoded.
    </div>
  );
}
