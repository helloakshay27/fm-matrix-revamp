import { useState, type ReactNode } from "react";
import { cardInfo, type ChartKind, type ChartSpec } from "./data";
import { ChartSwitch, IncidentChart } from "./IncidentChart";
import { InfoButton } from "./InfoButton";

interface ChartCardProps {
  title: string;
  sub: string;
  spec: ChartSpec;
  options: ChartKind[];
  children?: (type: ChartKind) => ReactNode;
}

export function ChartCard({ title, sub, spec, options, children }: ChartCardProps) {
  const [type, setType] = useState<ChartKind>(spec.defaultType);
  const info = cardInfo(title);

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
      {children ? children(type) : (
        <div className="chart-wrap">
          <IncidentChart spec={spec} type={type} />
        </div>
      )}
    </div>
  );
}
