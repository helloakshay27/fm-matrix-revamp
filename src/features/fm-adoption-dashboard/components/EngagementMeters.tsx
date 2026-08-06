import { Meter } from "./Meter";
import { formatPercent } from "../utils/format";
import type { EngagementResponse } from "@/services/fmAdoptionApi";

interface EngagementMetersProps {
  engagement: EngagementResponse;
}

export function EngagementMeters({ engagement }: EngagementMetersProps) {
  const { stickiness, module_breadth } = engagement;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Meter
        label="Stickiness (DAU / MAU)"
        value={stickiness.value}
        valueLabel={formatPercent(stickiness.value)}
        sublabel={`${stickiness.avg_dau.toLocaleString()} avg. daily users of ${stickiness.mau.toLocaleString()} monthly users`}
      />
      <Meter
        label="Module breadth"
        value={module_breadth.total > 0 ? module_breadth.in_use / module_breadth.total : 0}
        valueLabel={`${module_breadth.in_use} / ${module_breadth.total}`}
        sublabel="modules with at least one recorded event"
      />
    </div>
  );
}
