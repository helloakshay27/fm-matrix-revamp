import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  EmptyState,
  RenewableCardFrame,
  RenewableEnergyCardProps,
  useRenewableAreaFilter,
  useRenewableEndpoint,
  yearFromDate,
} from "./renewableEnergyShared";

interface BreakdownResponse {
  data?: { wind?: number; solar?: number; hydro?: number; iex_gdam?: number };
}

const SLICES = [
  { key: "hydro", name: "Total Hydro Per", color: "#76CDC1" },
  { key: "iex_gdam", name: "Total IEX GDAM Perc", color: "#CDCAF5" },
  { key: "solar", name: "Total Solar Perc", color: "#E39090" },
  { key: "wind", name: "Total wind Perc", color: "#EDC488" },
] as const;

const RenewableEnergyBreakdownCard: React.FC<RenewableEnergyCardProps> = ({
  startDate,
  endDate,
  siteName,
}) => {
  const { areas, area, setArea, areaParam } = useRenewableAreaFilter(siteName, yearFromDate(endDate));
  const { data, loading, error, reload } = useRenewableEndpoint<BreakdownResponse>(
    "/pms/assets/renewable_energy_breakdown.json",
    { from_date: startDate, to_date: endDate, site: siteName, area: areaParam }
  );

  const chartData = SLICES.map((s) => ({
    name: s.name,
    color: s.color,
    value: Number(data?.data?.[s.key] ?? 0),
  }));
  const slices = chartData.filter((d) => d.value > 0);
  const hasData = slices.length > 0;

  return (
    <RenewableCardFrame
      title="Total Renewable Energy Breakdown"
      info="Share of renewable energy by source (hydro, IEX GDAM, solar, wind) for the selected period"
      areas={areas}
      area={area}
      onAreaChange={setArea}
      loading={loading}
      error={error}
      onRefresh={reload}
    >
      {!hasData ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={slices}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} (${Number(value).toFixed(1)}%)`}
              outerRadius={90}
              innerRadius={45}
              dataKey="value"
              nameKey="name"
              stroke="#FFFFFF"
              strokeWidth={2}
            >
              {slices.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${Number(value).toFixed(2)}%`, name]}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </RenewableCardFrame>
  );
};

export default RenewableEnergyBreakdownCard;
