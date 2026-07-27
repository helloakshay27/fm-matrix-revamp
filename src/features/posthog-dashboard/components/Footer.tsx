export function Footer() {
  return (
    <div className="phg-footer">
      <b>Wireframe note.</b> Single-tenant customer view — shows only this customer's own employees; no cross-tenant data, no Lockated health/churn scores (those stay in the internal dashboard). All numbers are seeded sample data that recompute as you change <code>tier</code>, <code>scope</code>, <code>date range</code>, <code>device</code> and <code>module</code>. Every metric maps to a formula and instrumented events in the specification (§6–§7). Layout adapted from PostHog Web/Product Analytics; styled in Anthropic brand colours (Poppins / Lora, orange&nbsp;#d97757).
    </div>
  );
}
