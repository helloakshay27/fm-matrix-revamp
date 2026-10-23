import type { DrillModel } from "./data";
import { CloseIcon } from "./icons";

export function DrillDrawer({ drill, onClose }: { drill: DrillModel | null; onClose: () => void }) {
  return (
    <>
      <div className={`drill-scrim${drill ? " open" : ""}`} onClick={onClose} />
      <aside className={`drill${drill ? " open" : ""}`} aria-hidden={!drill}>
        <div className="drill-hd">
          <div><div className="crumb">{drill?.crumb ?? "Incident"}</div><h3>{drill?.title ?? "Details"}</h3></div>
          <button type="button" className="drill-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="drill-body" dangerouslySetInnerHTML={{ __html: drill?.html ?? "" }} />
      </aside>
    </>
  );
}
