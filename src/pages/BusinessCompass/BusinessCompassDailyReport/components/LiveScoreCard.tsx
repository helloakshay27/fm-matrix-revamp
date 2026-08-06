import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { badgePoints } from "../constants";
import { useDailyReport } from "../context/DailyReportContext";

export const LiveScoreCard = () => {
  const { isAbsent, dailyScore } = useDailyReport();

  if (isAbsent) return null;

  return (
    <div className="bc-live-score-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-[#DA7756]" />
          <h3 className="text-sm font-bold text-[#1a1a1a]">
            Live Score Preview
          </h3>
        </div>
        <Badge variant="outline" className={badgePoints}>
          {Math.round(dailyScore.totalScore)}/100 Pts
        </Badge>
      </div>
      <div className="bc-live-score-metrics">
        {[
          { label: "KPIs", value: `${dailyScore.kpiScore}/20` },
          {
            label: "Accomplishments",
            value: `${dailyScore.accomplishmentsScore}/20`,
          },
          {
            label: "Tasks",
            value: `${dailyScore.tasksIssuesScore}/20`,
          },
          {
            label: "Planning",
            value: `${dailyScore.planningScore}/20`,
          },
          {
            label: "Timing",
            value: `${dailyScore.timingScore}/20`,
          },
        ].map((metric) => (
          <div key={metric.label} className="bc-live-metric">
            <div className="bc-live-metric-label">{metric.label}</div>
            <div className="bc-live-metric-value">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
