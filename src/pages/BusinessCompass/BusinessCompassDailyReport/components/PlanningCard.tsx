import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import {
  AlertCircle,
  Calendar,
  Calendar as CalendarIcon,
  Clock,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Star,
  X,
  Zap,
} from "lucide-react";
import { badgePoints } from "../constants";
import { useDailyReport } from "../context/DailyReportContext";
import {
  fmtDate,
  fmtHours,
  getOverdueLabel,
} from "../utils";

export const PlanningCard = () => {
  const {
    planningSectionRef,
    nextDayLabel,
    dailyScore,
    setPlanningMenuAnchor,
    planningItems,
    dedupedTomorrowItems,
    planningItemMatchesSourceItem,
    mergedTasksIssues,
    togglePlanningStar,
    updatePlanningText,
    removePlanningItem,
    setSelectedTodo,
    setIsDetailsModalOpen,
    navigate,
    setEditTaskData,
    setIsEditTaskModalOpen,
    setEditIssueData,
    setIsEditIssueModalOpen,
    setEditTodoData,
    setIsEditTodoModalOpen,
    tomorrowScheduledLoading,
    tomorrowFetchDone,
    toggleScheduledTomorrowStar,
    hideTomorrowScheduledItem,
  } = useDailyReport();

  return (
    <div className="bc-daily-card" ref={planningSectionRef}>
      <div className="bc-daily-card-header">
        <div className="flex min-w-0 items-center gap-2">
          <Calendar className="h-5 w-5 shrink-0 text-[#DA7756]" />
          <h3 className="min-w-0 text-sm font-bold text-[#1a1a1a]">
            Plan for {nextDayLabel || "Tomorrow"}
          </h3>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-3">
          <Badge variant="outline" className={badgePoints}>
            {dailyScore.planningScore}/20 Pts
          </Badge>
          <button
            type="button"
            className="bc-add-outline-btn"
            onClick={(e) => setPlanningMenuAnchor(e.currentTarget)}
            title="Add Task, Issue, or Todo for next day"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      <div className="bc-daily-card-body">
        {planningItems.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Your plan
            </h4>
            <div className="space-y-4">
              {planningItems
                .map((item, index) => ({ item, index }))
                .filter(
                  ({ item }) =>
                    !dedupedTomorrowItems.some((scheduledItem) =>
                      planningItemMatchesSourceItem(item, scheduledItem)
                    )
                )
                .map(({ item }) => {
                  const matchedTask =
                    item.source_id && item.source_type
                      ? mergedTasksIssues.find(
                        (t: any) =>
                          t.type === item.source_type &&
                          t.originalData?.id === item.source_id
                      )
                      : null;
                  const liveData = matchedTask?.originalData || item.originalData;
                  const livePriority =
                    matchedTask?.priority || item.originalData?.priority;

                  return (
                    <div
                      key={item.id}
                      className="relative group animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                      <div
                        className={cn(
                          "flex flex-col overflow-hidden bg-[#fafafa] border rounded-[10px] p-3 shadow-sm hover:bg-[#f9fafb] transition-all",
                          item.fromWeeklyPlan
                            ? "border-blue-200 bg-blue-50/30 hover:border-blue-300"
                            : "border-[#f3f4f6] hover:border-[#DA7756]/30"
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <Star
                            size={18}
                            className={cn(
                              "cursor-pointer transition-all shrink-0",
                              item.starred
                                ? "text-[#eab308] fill-[#eab308]"
                                : "text-gray-300 hover:text-gray-400"
                            )}
                            onClick={() => togglePlanningStar(item.id)}
                          />
                          <span
                            className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0",
                              item.source_type === "task"
                                ? "bg-[#DA7756]/10 text-[#9e4f36]"
                                : item.source_type === "issue"
                                  ? "bg-violet-100 text-violet-700"
                                  : item.source_type === "todo"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-500 text-white"
                            )}
                          >
                            {item.source_type || "Note"}
                          </span>
                          {item.ownerName && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 bg-indigo-50 text-indigo-600 border border-indigo-100"
                              title={`Credited to ${item.ownerName} in the submitted report`}
                            >
                              From {item.ownerName}
                            </span>
                          )}
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) =>
                              updatePlanningText(item.id, e.target.value)
                            }
                            placeholder="What's your strategic priority?"
                            className="min-w-0 w-0 flex-1 truncate bg-transparent border-none outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
                          />
                          {livePriority && (
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                              style={{
                                backgroundColor:
                                  livePriority === "High"
                                    ? "#fee2e2"
                                    : livePriority === "Medium"
                                      ? "#fef3c7"
                                      : "#dcfce7",
                                color:
                                  livePriority === "High"
                                    ? "#991b1b"
                                    : livePriority === "Medium"
                                      ? "#92400e"
                                      : "#166534",
                              }}
                            >
                              {livePriority}
                            </span>
                          )}
                          <div className="flex shrink-0 items-center gap-1">
                            {item.source_id && item.source_type && (
                              <>
                                <button
                                  onClick={() => {
                                    if (item.source_type === "todo") {
                                      const td =
                                        matchedTask?.originalData;
                                      if (td) {
                                        setSelectedTodo(td);
                                        setIsDetailsModalOpen(true);
                                      }
                                    } else {
                                      navigate(
                                        item.source_type === "task"
                                          ? `/vas/tasks/${item.source_id}`
                                          : `/vas/issues/${item.source_id}`
                                      );
                                    }
                                  }}
                                  className="p-1 hover:bg-white/60 rounded-[6px] transition-colors shrink-0"
                                  title={`View ${item.source_type} details`}
                                >
                                  <Eye
                                    size={14}
                                    className="text-amber-600"
                                  />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const src =
                                      matchedTask?.originalData;
                                    if (item.source_type === "task") {
                                      setEditTaskData(src);
                                      setIsEditTaskModalOpen(true);
                                    } else if (item.source_type === "issue") {
                                      setEditIssueData(src);
                                      setIsEditIssueModalOpen(true);
                                    } else if (item.source_type === "todo") {
                                      setEditTodoData(src);
                                      setIsEditTodoModalOpen(true);
                                    }
                                  }}
                                  className="p-1 text-gray-500 hover:text-amber-600 transition-colors shrink-0"
                                  title={`Edit ${item.source_type}`}
                                >
                                  <Pencil size={13} />
                                </button>
                              </>
                            )}
                            <X
                              size={18}
                              className="shrink-0 text-red-500 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                              onClick={() => removePlanningItem(item.id)}
                            />
                          </div>
                        </div>
                        {liveData &&
                          (() => {
                            const d = liveData;
                            const endDate = fmtDate(
                              d?.target_date || d?.due_date || d?.end_date
                            );
                            const effortEst = fmtHours(
                              d?.total_allocated_hours || d?.estimated_hour
                            );
                            const overdueLabel = getOverdueLabel(
                              d?.target_date || d?.due_date || d?.end_date
                            );
                            let timeLeftLabel: string | null = null;
                            if (
                              item.source_type === "issue" &&
                              d?.end_date &&
                              !overdueLabel
                            ) {
                              const now = new Date();
                              const end = new Date(d.end_date);
                              end.setHours(23, 59, 59, 999);
                              const diff = end.getTime() - now.getTime();
                              if (diff > 0) {
                                const days = Math.floor(diff / 86400000);
                                const hrs = Math.floor(
                                  (diff % 86400000) / 3600000
                                );
                                const mins = Math.floor(
                                  (diff % 3600000) / 60000
                                );
                                if (days > 0) timeLeftLabel = `${days}d ${hrs}h left`;
                                else if (hrs > 0) timeLeftLabel = `${hrs}h ${mins}m left`;
                                else timeLeftLabel = `${mins}m left`;
                              }
                            }
                            let issueEffort: string | null = null;
                            if (
                              item.source_type === "issue" &&
                              Array.isArray(d?.issue_allocation_times) &&
                              d.issue_allocation_times.length > 0
                            ) {
                              const totalMin = d.issue_allocation_times.reduce(
                                (sum: number, t: any) =>
                                  sum + t.hours * 60 + t.minutes,
                                0
                              );
                              if (totalMin > 0) {
                                const h = Math.floor(totalMin / 60);
                                const m = totalMin % 60;
                                issueEffort =
                                  h > 0 && m > 0
                                    ? `${h}h ${m}m`
                                    : h > 0
                                      ? `${h}h`
                                      : `${m}m`;
                              }
                            }
                            const hasInfo =
                              endDate ||
                              effortEst ||
                              overdueLabel ||
                              timeLeftLabel ||
                              issueEffort ||
                              (item.source_type === "task" &&
                                d?.active_time_till_now);
                            if (!hasInfo) return null;
                            return (
                              <div className="flex items-center gap-3 pl-7 pt-1 flex-wrap">
                                {endDate && (
                                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <CalendarIcon
                                      size={9}
                                      className="shrink-0"
                                    />
                                    {endDate}
                                  </span>
                                )}
                                {overdueLabel && (
                                  <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600">
                                    <AlertCircle
                                      size={9}
                                      className="shrink-0"
                                    />
                                    {overdueLabel}
                                  </span>
                                )}
                                {timeLeftLabel && (
                                  <span className="flex items-center gap-1 text-[10px] text-blue-600">
                                    <Clock size={9} className="shrink-0" />
                                    {timeLeftLabel}
                                  </span>
                                )}
                                {effortEst && (
                                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <Clock size={9} className="shrink-0" />
                                    Est: {effortEst}
                                  </span>
                                )}
                                {issueEffort && (
                                  <span className="flex items-center gap-1 text-[10px] text-purple-600">
                                    <Zap size={9} className="shrink-0" />
                                    Effort: {issueEffort}
                                  </span>
                                )}
                                {item.source_type === "task" &&
                                  d?.active_time_till_now && (
                                    <span className="flex items-center gap-1 text-[10px] text-green-600">
                                      <Zap size={9} className="shrink-0" />
                                      <ActiveTimer
                                        activeTimeTillNow={
                                          d.active_time_till_now
                                        }
                                        isStarted={d.is_started}
                                      />
                                    </span>
                                  )}
                              </div>
                            );
                          })()}
                        {item.fromWeeklyPlan && (
                          <div className="pl-7 pt-1">
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-[5px]">
                              <CalendarIcon size={10} />
                              From Weekly Report
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {(tomorrowScheduledLoading ||
          (tomorrowFetchDone && dedupedTomorrowItems.length > 0)) && (
            <div className="mb-4">
              {tomorrowScheduledLoading ? (
                <div className="flex items-center gap-2 py-3 text-gray-300">
                  <Loader2 size={13} className="animate-spin shrink-0" />
                  <span className="text-xs font-medium">
                    Fetching upcoming assignments…
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  {dedupedTomorrowItems.map((item) => {
                    const plannedItem = planningItems.find((plan) =>
                      planningItemMatchesSourceItem(plan, item)
                    );

                    return (
                      <div
                        key={item.id}
                        className="relative animate-in fade-in slide-in-from-top-1 duration-200"
                      >
                        <div className="flex flex-col bg-gray-50 border border-gray-200 rounded-[10px] p-3 transition-all hover:border-[#DA7756]/25 hover:bg-[#fafafa]">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleScheduledTomorrowStar(item)}
                              className="shrink-0 transition-transform duration-150 active:scale-110 focus:outline-none"
                              title={
                                plannedItem?.starred
                                  ? "Unstar"
                                  : "Star this priority"
                              }
                            >
                              <Star
                                size={18}
                                className={cn(
                                  "transition-colors duration-200",
                                  plannedItem?.starred
                                    ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                                    : "text-gray-300 hover:text-yellow-400"
                                )}
                              />
                            </button>
                            <span
                              className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0",
                                item.type === "task"
                                  ? "bg-[#DA7756]/10 text-[#9e4f36]"
                                  : item.type === "issue"
                                    ? "bg-violet-100 text-violet-700"
                                    : "bg-yellow-100 text-yellow-700"
                              )}
                            >
                              {item.type}
                            </span>
                            <span className="flex-1 text-sm font-medium text-gray-500 truncate">
                              {item.title}
                            </span>
                            {item.priority && (
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                                style={{
                                  backgroundColor:
                                    item.priority === "High"
                                      ? "#fee2e2"
                                      : item.priority === "Medium"
                                        ? "#fef3c7"
                                        : "#dcfce7",
                                  color:
                                    item.priority === "High"
                                      ? "#991b1b"
                                      : item.priority === "Medium"
                                        ? "#92400e"
                                        : "#166534",
                                }}
                              >
                                {item.priority}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => hideTomorrowScheduledItem(item)}
                              className="rounded-md p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          {(() => {
                            const d = item.originalData;
                            const endDate = fmtDate(
                              d?.target_date || d?.due_date || d?.end_date
                            );
                            const effortEst = fmtHours(
                              d?.total_allocated_hours || d?.estimated_hour
                            );
                            const overdueLabel = getOverdueLabel(
                              d?.target_date || d?.due_date || d?.end_date
                            );
                            let timeLeftLabel: string | null = null;
                            if (
                              item.type === "issue" &&
                              d?.end_date &&
                              !overdueLabel
                            ) {
                              const now = new Date();
                              const end = new Date(d.end_date);
                              end.setHours(23, 59, 59, 999);
                              const diff = end.getTime() - now.getTime();
                              if (diff > 0) {
                                const days = Math.floor(diff / 86400000);
                                const hrs = Math.floor(
                                  (diff % 86400000) / 3600000
                                );
                                const mins = Math.floor(
                                  (diff % 3600000) / 60000
                                );
                                if (days > 0) timeLeftLabel = `${days}d ${hrs}h left`;
                                else if (hrs > 0) timeLeftLabel = `${hrs}h ${mins}m left`;
                                else timeLeftLabel = `${mins}m left`;
                              }
                            }
                            const hasInfo =
                              endDate || effortEst || overdueLabel || timeLeftLabel;
                            if (!hasInfo) return null;
                            return (
                              <div className="flex items-center gap-3 pl-7 pt-1.5 flex-wrap">
                                {endDate && (
                                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <CalendarIcon
                                      size={9}
                                      className="shrink-0"
                                    />
                                    {endDate}
                                  </span>
                                )}
                                {overdueLabel && (
                                  <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600">
                                    <AlertCircle size={9} className="shrink-0" />
                                    {overdueLabel}
                                  </span>
                                )}
                                {timeLeftLabel && (
                                  <span className="flex items-center gap-1 text-[10px] text-blue-600">
                                    <Clock size={9} className="shrink-0" />
                                    {timeLeftLabel}
                                  </span>
                                )}
                                {effortEst && (
                                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <Clock size={9} className="shrink-0" />
                                    Est: {effortEst}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        {planningItems.length === 0 &&
          tomorrowFetchDone &&
          !tomorrowScheduledLoading &&
          dedupedTomorrowItems.length === 0 && (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
              <Calendar className="mb-3 h-8 w-8 text-[#DA7756]/10" />
              <h4 className="text-base font-black text-gray-400">
                Plan your next working day!
              </h4>
              <p className="mt-2 text-sm font-medium text-[#334155]">
                List 3-5 key tasks for {nextDayLabel || "tomorrow"} to stay
                focused.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
