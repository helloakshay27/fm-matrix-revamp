import { eachDayOfInterval, format as formatDate } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatShortDate } from "../utils/format";

const PRIMARY = "#DA7756"; // --color-primary

interface TimeseriesChartsProps {
  series: { day: string; users: number; views: number; sessions: number }[];
  fromDate: string;
  toDate: string;
}

interface DayPoint {
  day: string;
  users: number;
  views: number;
  sessions: number;
}

function zeroFillDays(series: TimeseriesChartsProps["series"], fromDate: string, toDate: string): DayPoint[] {
  const byDay = new Map(series.map((s) => [s.day, s]));
  const days = eachDayOfInterval({ start: new Date(`${fromDate}T00:00:00`), end: new Date(`${toDate}T00:00:00`) });
  return days.map((d) => {
    const key = formatDate(d, "yyyy-MM-dd");
    const found = byDay.get(key);
    return { day: key, users: found?.users ?? 0, views: found?.views ?? 0, sessions: found?.sessions ?? 0 };
  });
}

function CustomTooltip({ active, payload, label, seriesLabel }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-brand-border bg-white px-3 py-2 shadow-brand-card">
      <div className="text-brand-body-5 text-brand-text-light">{formatShortDate(label)}</div>
      <div className="mt-0.5 text-brand-body-4 font-semibold text-brand-text">
        {payload[0].value.toLocaleString()} <span className="font-normal text-brand-text-light">{seriesLabel}</span>
      </div>
    </div>
  );
}

function MiniAreaChart({ data, dataKey, label, gradientId }: { data: DayPoint[]; dataKey: keyof DayPoint; label: string; gradientId: string }) {
  return (
    <div className="rounded-lg border border-brand-border bg-brand-bg p-3">
      <div className="mb-1 text-brand-body-5 font-medium text-brand-text-light">{label}</div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.28} />
              <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#E5E1D8" />
          <XAxis
            dataKey="day"
            tickFormatter={formatShortDate}
            tick={{ fontSize: 11, fill: "#888780" }}
            axisLine={false}
            tickLine={false}
            minTickGap={28}
          />
          <YAxis tick={{ fontSize: 11, fill: "#888780" }} axisLine={false} tickLine={false} width={42} allowDecimals={false} />
          <Tooltip content={<CustomTooltip seriesLabel={label.toLowerCase()} />} cursor={{ stroke: "#C4B89D", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={PRIMARY}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TimeseriesCharts({ series, fromDate, toDate }: TimeseriesChartsProps) {
  const data = zeroFillDays(series, fromDate, toDate);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MiniAreaChart data={data} dataKey="users" label="Active users" gradientId="fillUsers" />
      <MiniAreaChart data={data} dataKey="views" label="Screen views" gradientId="fillViews" />
      <MiniAreaChart data={data} dataKey="sessions" label="Sessions" gradientId="fillSessions" />
    </div>
  );
}
