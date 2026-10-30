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
  children?: (type: ChartKind) => ReactNode;
}

export function ChartCard({ title, sub, spec, options, info, compactDonut = false, children }: ChartCardProps) {
  const [type, setType] = useState<ChartKind>(spec.defaultType);

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
        <div className="card-actions-row">
          <ChartSwitch options={options} value={type} onChange={setType} />
        </div>
      </div>
      {children ? (
        children(type)
      ) : (
        <div className="chart-wrap">
          <AuditChart spec={spec} type={type} compactDonut={compactDonut} />
        </div>
      )}
    </div>
  );
}
