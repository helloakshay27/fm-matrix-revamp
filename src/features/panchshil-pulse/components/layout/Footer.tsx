import React from "react";

export const Footer: React.FC = () => {
  return (
    <div className="footer">
      <b>Live data note.</b> Single-tenant resident view &mdash; shows only Panchshil Pulse&rsquo;s own registered residents; no cross-tenant data. Every number on this dashboard is pulled live from the PostHog adoption analytics API at <code>posthog-api.lockated.com</code> and scoped to the tenant in <code>VITE_FM_ADOPTION_TENANT_URL</code>. Device filter, date range and the per-site scope change the API&rsquo;s <code>from</code>/<code>to</code>, <code>site_id</code> and <code>device_type</code> params; <b>Refresh</b> refetches everything. Modules, screens, funnels and entry points are the real instrumented <code>$pathname</code> tree. Hover the <code>i</code> on any tile or chart for its exact definition.
    </div>
  );
};
