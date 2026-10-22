import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  EmptyState,
  RenewableCardFrame,
  RenewableEnergyCardProps,
  useRenewableAreaFilter,
  useRenewableEndpoint,
  yearFromDate,
} from "./renewableEnergyShared";

interface OverTimeRow {
  month: string;
  wind: number;
  solar: number;
  hydro: number;
  iex_gdam: number;
}

interface OverTimeResponse {
  data?: OverTimeRow[];
}

const SERIES = [
  { key: "hydro", name: "Percentage of Hydro", color: "#6B9BCC" },
  { key: "iex_gdam", name: "Percentage of IEX GDAM", color: "#CECBF6" },
  { key: "solar", name: "Percentage of Solar", color: "#DA7756" },
  { key: "wind", name: "Percentage of Wind", color: "#9EC8BA" },
] as const;

const RenewableEnergyOverTimeCard: React.FC<RenewableEnergyCardProps> = ({
  startDate,
  endDate,
  siteName,
}) => {
  const year = yearFromDate(endDate);
  const { areas, area, setArea, areaParam } = useRenewableAreaFilter(siteName, year);
  const { data, loading, error, reload } = useRenewableEndpoint<OverTimeResponse>(
    "/pms/assets/renewable_energy_breakdown_over_time.json",
    { from_date: startDate, to_date: endDate, year: String(year), site: siteName, area: areaParam }
  );

  const rows = data?.data ?? [];

  return (
    <RenewableCardFrame
      title="Total Renewable Energy Breakdown Over Time"
      info="Monthly percentage share of each renewable source"
      areas={areas}
      area={area}
      onAreaChange={setArea}
      loading={loading}
      error={error}
      onRefresh={reload}
    >
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={rows} margin={{ top: 20, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => `${v}%`}
              label={{ value: "Percentage", angle: -90, position: "insideLeft", fontSize: 11 }}
            />
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={{ r: 3, fill: s.color }}
              >
                {s.key !== "wind" && s.key !== "iex_gdam" && (
                  <LabelList dataKey={s.key} position="top" fontSize={10} formatter={(v: number) => `${v}%`} />
                )}
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </RenewableCardFrame>
  );
};

export default RenewableEnergyOverTimeCard;
