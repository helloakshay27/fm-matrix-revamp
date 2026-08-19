import { BarList } from "./BarList";

interface DeviceSplitProps {
  data: { device: string; sessions: number }[];
}

export function DeviceSplit({ data }: DeviceSplitProps) {
  const total = data.reduce((sum, d) => sum + d.sessions, 0) || 1;
  const items = data.map((d) => ({
    label: d.device,
    value: d.sessions,
    meta: `${((d.sessions / total) * 100).toFixed(0)}%`,
  }));
  return <BarList items={items} valueSuffix=" sessions" />;
}
