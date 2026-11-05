export function DataState({ label = "Loading…" }: { label?: string }) {
  return <div style={{ fontSize: 12, color: "var(--sage)", padding: "24px 0", textAlign: "center" }}>{label}</div>;
}
