import { useState, type ReactNode } from "react";
import { AuditChart, ChartSwitch } from "./AuditChart";
import type { ChartKind, ChartSpec } from "./data";
import { InfoButton } from "./InfoButton";

interface ChartCardProps {
  title: string;
  sub: string;
  spec: ChartSpec;
  options: ChartKind[];
  info?: string;
  compactDonut?: boolean;
  loading?: boolean;
  /** The request failed, as opposed to returning an empty series. */
  unavailable?: boolean;
  children?: (type: ChartKind) => ReactNode;
}

export function ChartCard({ title, sub, spec, options, info, compactDonut = false, loading = false, unavailable = false, children }: ChartCardProps) {
  const [type, setType] = useState<ChartKind>(spec.defaultType);
  const message = loading ? "Loading…" : unavailable ? "Couldn’t load data" : spec.labels.length === 0 ? "No data for these filters" : "";

  return (
    <div className="card">
      <div className="card-hd">
        <div>
          <div className="card-title">
            {title}
            {info ? <InfoButton text={info} /> : null}
          </div>
          <div className="card-sub">{sub}</div>
        </div>
        {!message && (
          <div className="card-actions-row">
            <ChartSwitch options={options} value={type} onChange={setType} />
          </div>
        )}
      </div>
      {message ? (
        <div className="card-sub" style={{ padding: "28px 0", textAlign: "center" }}>{message}</div>
      ) : children ? (
        children(type)
      ) : (
        <div className="chart-wrap">
          <AuditChart spec={spec} type={type} compactDonut={compactDonut} />
        </div>
      )}
    </div>
  );
}
