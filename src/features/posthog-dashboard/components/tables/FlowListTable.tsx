import { fmtC, pctVal } from '../../data/format';
import type { FlowRow } from '../../data/metrics';

export function FlowListTable({ rows }: { rows: FlowRow[] }) {
  return (
    <>
      <thead>
        <tr>
          <th>Path</th>
          <th className="num">Users</th>
          <th className="num">Events</th>
          <th className="num">Sessions</th>
          <th className="num">F-comp</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((f) => (
          <tr key={f.path}>
            <td className="strong">{f.path}</td>
            <td className="num">{fmtC(f.users)}</td>
            <td className="num">{fmtC(f.events)}</td>
            <td className="num">{fmtC(f.sessions)}</td>
            <td className="num" title={f.comp == null ? 'Per-path completion needs a flow_key event property (not instrumented)' : undefined}>
              {pctVal(f.comp)}
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
}
