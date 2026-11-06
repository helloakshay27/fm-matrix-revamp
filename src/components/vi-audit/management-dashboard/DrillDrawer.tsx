import type { DrillModel } from "./data";
import { CloseIcon } from "./icons";

interface DrillDrawerProps {
  drill: DrillModel | null;
  onClose: () => void;
}

const isNumeric = (value: string | number) => typeof value === "number" || /^[\d.,%]+$/.test(String(value));

export function DrillDrawer({ drill, onClose }: DrillDrawerProps) {
  return (
    <>
      <div className={`drill-scrim${drill ? " open" : ""}`} onClick={onClose} />
      <aside className={`drill${drill ? " open" : ""}`} aria-hidden={!drill}>
        <div className="drill-hd">
          <div>
            <div className="crumb">{drill?.crumb ?? "Audit"}</div>
            <h3>{drill?.title ?? "Details"}</h3>
          </div>
          <button type="button" className="drill-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="drill-body">
          {drill?.blocks.map((block, index) => {
            if (block.kind === "stats") {
              return (
                <div key={index} className={`dr-stats${block.items.length === 2 ? " two" : ""}`}>
                  {block.items.map(([value, label]) => (
                    <div key={label} className="dr-stat">
                      <div className="v">{value}</div>
                      <div className="l">{label}</div>
                    </div>
                  ))}
                </div>
              );
            }
            if (block.kind === "note") return <div key={index} className="dr-note">{block.text}</div>;
            if (block.kind === "heading") return <h4 key={index}>{block.text}</h4>;
            return (
              <table key={index} className="dr-tbl">
                <thead>
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className={cellIndex === 0 ? "strong" : isNumeric(cell) ? "num" : ""}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })}
        </div>
      </aside>
    </>
  );
}
