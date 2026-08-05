import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { badgePoints } from "../constants";
import { useDailyReport } from "../context/DailyReportContext";

export const KpiCard = () => {
  const { kpis, dailyScore, kpiEntries, setKpiEntries, markDraftDirty } =
    useDailyReport();

  if (kpis.length === 0) return null;

  return (
    <Card className="rounded-[16px] border border-[#DA7756]/20 bg-white overflow-hidden shadow-sm">
      <div className="p-5 flex items-center justify-between border-b-2 border-neutral-200/40">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-[#DA7756]" />
          <h3 className="text-sm font-bold text-[#1a1a1a] tracking-tight">
            Daily KPIs
          </h3>
        </div>
        <Badge variant="outline" className={badgePoints}>
          {dailyScore.kpiScore}/20 pts
        </Badge>
      </div>
      <CardContent className="p-6 space-y-4">
        {kpis.map((kpi) => {
          const target = parseFloat(kpi.target_value) || 0;
          const actual =
            parseFloat(kpiEntries[kpi.kpi_id] || "0") || 0;
          const hasEntry =
            !!kpiEntries[kpi.kpi_id] && kpiEntries[kpi.kpi_id] !== "";

          let achievementPct = 0;
          if (target === 0 && actual > 0) {
            achievementPct = 100;
          } else if (target > 0) {
            achievementPct = Math.min((actual / target) * 100, 100);
          }

          const pctColor =
            achievementPct >= 100
              ? "bg-[#22c55e] text-white"
              : achievementPct >= 75
                ? "bg-[#84cc16] text-white"
                : achievementPct >= 50
                  ? "bg-[#f59e0b] text-white"
                  : "bg-[#ef4444] text-white";

          return (
            <div
              key={kpi.kpi_id}
              className="flex items-center gap-3 p-4 rounded-[10px] bg-[#fafafa] border border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-[#1a1a1a] truncate">
                    {kpi.kpi_name}
                  </h4>
                  {!kpi.submitted && (
                    <Badge className="bg-[#ef4444] text-white px-2 py-0.5 rounded-[4px] text-[10px] font-bold border-none shadow-sm whitespace-nowrap">
                      new
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{kpi.frequency_label}</span>
                </div>
              </div>

              <div className="flex flex-col items-center shrink-0">
                <span className="text-sm font-black text-[#6366f1]">
                  {kpi.target_value}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Target
                </span>
              </div>

              <div className="w-24 shrink-0">
                <input
                  type="number"
                  value={kpiEntries[kpi.kpi_id] || ""}
                  onChange={(e) => {
                    markDraftDirty();
                    setKpiEntries((prev) => ({
                      ...prev,
                      [kpi.kpi_id]: e.target.value,
                    }));
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[10px] text-sm font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/30 focus:border-[#f59e0b]"
                />
              </div>

              {hasEntry && (
                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1.5 rounded-[8px] text-sm font-black tracking-tight ${pctColor}`}
                  >
                    {achievementPct.toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
