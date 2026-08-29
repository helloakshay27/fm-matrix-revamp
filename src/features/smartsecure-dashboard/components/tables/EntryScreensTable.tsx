import type { EntryScreenRow } from '../../data/metrics';

/** "Top entry screens" (F-entry) — org-wide, not module-filtered. */
export function EntryScreensTable({ rows }: { rows: EntryScreenRow[] }) {
  return (
    <table className="pathtbl">
      <thead>
        <tr>
          <th>Screen</th>
          <th className="num">Visitors</th>
          <th className="num">Views</th>
          <th className="num">Bounce</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.screen}>
            <td>{r.screen}</td>
            <td className="num">{r.visitors.toLocaleString()}</td>
            <td className="num">{r.views.toLocaleString()}</td>
            <td className="num">{r.bounce}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
