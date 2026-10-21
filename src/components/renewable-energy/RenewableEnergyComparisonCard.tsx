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

interface ComparisonRow {
  month: string;
  actual_consumption: number;
  renewable_purchase_obligation: number;
  renewable_power_purchased: number;
}

interface ComparisonResponse {
  unit?: string;
  data?: ComparisonRow[];
}

const SERIES = [
  { key: "actual_consumption", name: "Actual Consumption", color: "#6B9BCC" },
  { key: "renewable_power_purchased", name: "Renewable Power Purchased", color: "#798C5E" },
  { key: "renewable_purchase_obligation", name: "Renewable Purchase Obligation", color: "#DA7756" },
] as const;

const RenewableEnergyComparisonCard: React.FC<RenewableEnergyCardProps> = ({
  startDate,
  endDate,
  siteName,
}) => {
  const year = yearFromDate(endDate);
  const { areas, area, setArea, areaParam } = useRenewableAreaFilter(siteName, year);
  const { data, loading, error, reload } = useRenewableEndpoint<ComparisonResponse>(
    "/pms/assets/renewable_energy_comparison.json",
    { from_date: startDate, to_date: endDate, year: String(year), site: siteName, area: areaParam }
  );

  const rows = data?.data ?? [];
  const unit = data?.unit ?? "Million KWH";

  return (
    <RenewableCardFrame
      title="Energy Consumption vs. RE Power Purchased & Obligations"
      info="Monthly actual consumption compared with renewable power purchased and the renewable purchase obligation"
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
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              label={{ value: unit, angle: -90, position: "insideLeft", fontSize: 11 }}
            />
            <Tooltip formatter={(value: number) => `${value} ${unit}`} />
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
                <LabelList dataKey={s.key} position="top" fontSize={10} formatter={(v: number) => `${v}M`} />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </RenewableCardFrame>
  );
};

export default RenewableEnergyComparisonCard;
