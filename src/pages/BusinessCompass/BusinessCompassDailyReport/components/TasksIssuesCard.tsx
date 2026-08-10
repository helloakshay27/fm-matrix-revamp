import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckSquare,
  ChevronRight,
  Clock,
  Eye,
  Loader2,
  Pause,
  Pencil,
  Play,
  Plus,
  Zap,
} from "lucide-react";
import { badgePoints } from "../constants";
import { useDailyReport } from "../context/DailyReportContext";
import { fmtDate, fmtHours, getOverdueLabel, getPriorityColors } from "../utils";

const TASK_GROUPS = [
  {
    key: "overdue",
    label: "Overdue",
    statuses: ["overdue", "overdued"],
    colorClass: "text-red-700",
    bgItem: "bg-red-50/60 border-red-200",
    headerBg: "bg-red-50 hover:bg-red-100",
    pillBg: "bg-red-100 text-red-700",
    showAddToTomorrow: true,
    showBulkAdd: true,
  },
  {
    key: "in_progress",
    label: "In Progress",
    statuses: ["in_progress", "started"],
    colorClass: "text-sky-700",
    bgItem: "bg-sky-50/60 border-sky-200",
    headerBg: "bg-sky-50 hover:bg-sky-100",
    pillBg: "bg-sky-100 text-sky-700",
    showAddToTomorrow: true,
    showBulkAdd: false,
  },
  {
    key: "pending",
    label: "Open",
    statuses: ["open", "pending"],
    colorClass: "text-slate-600",
    bgItem: "bg-slate-50/60 border-slate-200",
    headerBg: "bg-slate-50 hover:bg-slate-100",
    pillBg: "bg-slate-100 text-slate-600",
    showAddToTomorrow: true,
    showBulkAdd: false,
  },
  {
    key: "on_hold",
    label: "On Hold",
    statuses: ["on_hold"],
    colorClass: "text-orange-700",
    bgItem: "bg-orange-50/60 border-orange-200",
    headerBg: "bg-orange-50 hover:bg-orange-100",
    pillBg: "bg-orange-100 text-orange-700",
    showAddToTomorrow: true,
    showBulkAdd: false,
  },
  {
    key: "reopened",
    label: "Reopened",
    statuses: ["reopen", "reopened"],
    colorClass: "text-fuchsia-700",
    bgItem: "bg-fuchsia-50 border-fuchsia-200",
    headerBg: "bg-fuchsia-50 hover:bg-fuchsia-100",
    pillBg: "bg-fuchsia-100 text-fuchsia-700",
    showAddToTomorrow: true,
    showBulkAdd: false,
  },
] as const;

export const TasksIssuesCard = () => {
  const {
    tasksSectionRef,
    dailyScore,
    setTaskIssueMenuAnchor,
    openAllTaskIssueGroups,
    openOnlyTaskIssueGroup,
    taskIssueCounts,
    tasksLoading,
    issuesLoading,
    mergedTasksIssues,
    scrollContainerRef,
    yesterdaySourceIds,
    noteMatchedTaskIssueIds,
    playingTaskIds,
    collapsedGroups,
    setCollapsedGroups,
    selectedTasksIssues,
    setSelectedTasksIssues,
    setPendingConfirmAction,
    handleCompleteItem,
    markDraftDirty,
    setSelectedTodo,
    setIsDetailsModalOpen,
    navigate,
    setEditTaskData,
    setIsEditTaskModalOpen,
    setEditIssueData,
    setIsEditIssueModalOpen,
    setEditTodoData,
    setIsEditTodoModalOpen,
    setPendingPauseTaskId,
    setPendingPlayTaskId,
    setPendingPauseIssueId,
    setPendingPlayIssueId,
    addAllOverdueToTomorrow,
    addedToTomorrowIds,
    addItemToTomorrow,
    removeItemFromTomorrow,
    isLoadingMore,
  } = useDailyReport();

  return (
    <div
      className="bc-daily-card bc-tasks-card-wrap flex flex-1 flex-col"
      ref={tasksSectionRef}
    >
      <div className="bc-daily-card-header">
        <div className="flex min-w-0 items-center gap-2">
          <CheckSquare className="h-5 w-5 shrink-0 text-[#DA7756]" />
          <h3 className="min-w-0 text-sm font-bold text-[#1a1a1a]">
            Tasks, Issues & To Do's
          </h3>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-3">
          <Badge variant="outline" className={badgePoints}>
            {dailyScore.tasksIssuesScore}/20 Pts
          </Badge>
          <button
            type="button"
            className="bc-add-outline-btn"
            onClick={(e) => setTaskIssueMenuAnchor(e.currentTarget)}
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>
      <div className="space-y-4 p-3">
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge
            variant="outline"
            role="button"
            tabIndex={0}
            onClick={openAllTaskIssueGroups}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openAllTaskIssueGroups();
              }
            }}
            className="cursor-pointer border-0 bg-[#fef6f4] px-3 py-1 text-[10px] font-bold text-[#DA7756] transition-colors hover:bg-[#fde9e1]"
          >
            All: {taskIssueCounts.total}
          </Badge>
          <Badge
            variant="outline"
            role="button"
            tabIndex={0}
            onClick={() => openOnlyTaskIssueGroup("pending")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openOnlyTaskIssueGroup("pending");
              }
            }}
            className="cursor-pointer border-0 bg-sky-100 px-3 py-1 text-[10px] font-bold text-sky-800 transition-colors hover:bg-sky-200"
          >
            Open: {taskIssueCounts.open}
          </Badge>
          <Badge
            variant="outline"
            role="button"
            tabIndex={0}
            onClick={() => openOnlyTaskIssueGroup("overdue")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openOnlyTaskIssueGroup("overdue");
              }
            }}
            className="cursor-pointer border-0 bg-red-100 px-3 py-1 text-[10px] font-bold text-red-800 transition-colors hover:bg-red-200"
          >
            Overdue: {taskIssueCounts.overdue}
          </Badge>
          <Badge
            variant="outline"
            role="button"
            tabIndex={0}
            onClick={() => openOnlyTaskIssueGroup("in_progress")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openOnlyTaskIssueGroup("in_progress");
              }
            }}
            className="cursor-pointer border-0 bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800 transition-colors hover:bg-amber-200"
          >
            In Progress: {taskIssueCounts.inProgress}
          </Badge>
          <Badge
            variant="outline"
            role="button"
            tabIndex={0}
            onClick={() => openOnlyTaskIssueGroup("on_hold")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openOnlyTaskIssueGroup("on_hold");
              }
            }}
            className="cursor-pointer border-0 bg-gray-200 px-3 py-1 text-[10px] font-bold text-gray-800 transition-colors hover:bg-gray-300"
          >
            On Hold: {taskIssueCounts.onHold}
          </Badge>
        </div>

        {tasksLoading || issuesLoading ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2
              size={40}
              className="text-[#b91c1c]/30 animate-spin mb-3"
            />
            <p className="text-sm font-bold text-gray-500">
              Loading tasks and issues...
            </p>
          </div>
        ) : mergedTasksIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="flex flex-col items-center gap-3 opacity-30">
              <CheckSquare size={40} className="text-[#DA7756]/20" />
              <p className="text-base font-bold text-gray-400 tracking-tight">
                No open tasks or issues
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pr-1" ref={scrollContainerRef}>
            {(yesterdaySourceIds.size > 0 ||
              noteMatchedTaskIssueIds.size > 0) &&
              (() => {
                const yItems = mergedTasksIssues.filter(
                  (item: any) =>
                    (yesterdaySourceIds.has(item.id) ||
                      noteMatchedTaskIssueIds.has(item.id)) &&
                    item.status !== "completed" &&
                    item.status !== "closed" &&
                    !(
                      item.originalData?.is_started ||
                      item.is_started ||
                      playingTaskIds.has(item.originalData?.id)
                    )
                );
                if (yItems.length === 0) return null;
                const isCollapsed = collapsedGroups.has("from_yesterday");
                return (
                  <div key="from_yesterday">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] transition-all mb-1.5 bg-amber-50 hover:bg-amber-100"
                      onClick={() =>
                        setCollapsedGroups((prev) => {
                          const next = new Set(prev);
                          if (next.has("from_yesterday"))
                            next.delete("from_yesterday");
                          else next.add("from_yesterday");
                          return next;
                        })
                      }
                    >
                      <CalendarIcon
                        size={12}
                        className="text-amber-700 shrink-0"
                      />
                      <span className="text-xs font-black uppercase tracking-wider flex-1 text-left text-amber-700">
                        Plan for Today
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        {yItems.length}
                      </span>
                      <ChevronRight
                        size={14}
                        className={cn(
                          "transition-transform duration-200 ml-1 text-amber-700",
                          !isCollapsed && "rotate-90"
                        )}
                      />
                    </button>
                    {!isCollapsed && (
                      <div className="space-y-1.5 pl-1">
                        {yItems.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex flex-col rounded-[10px] border transition-all group bg-amber-50/60 border-amber-200"
                          >
                            <div className="flex flex-wrap items-center gap-2 p-2.5">
                              <Checkbox
                                checked={
                                  selectedTasksIssues[item.id] ||
                                  item.status === "completed" ||
                                  item.status === "closed"
                                }
                                onCheckedChange={(checked) => {
                                  if (
                                    checked &&
                                    item.status !== "completed" &&
                                    item.status !== "closed"
                                  ) {
                                    setPendingConfirmAction({
                                      fn: () => handleCompleteItem(item),
                                      label: `complete this ${item.type}`,
                                    });
                                  } else {
                                    markDraftDirty();
                                    setSelectedTasksIssues((prev) => ({
                                      ...prev,
                                      [item.id]: checked as boolean,
                                    }));
                                  }
                                }}
                                className="h-4 w-4 rounded-[4px] border-gray-300 data-[state=checked]:bg-[#1a1a1a] data-[state=checked]:border-[#1a1a1a] shrink-0"
                              />
                              <button
                                onClick={() => {
                                  if (item.type === "todo") {
                                    setSelectedTodo(item.originalData);
                                    setIsDetailsModalOpen(true);
                                  } else {
                                    navigate(
                                      item.type === "task"
                                        ? `/business-compass/tasks/${item?.id.split("-")[1]}`
                                        : `/business-compass/issues/${item?.id.split("-")[1]}`
                                    );
                                  }
                                }}
                                className="p-1 hover:bg-white/60 rounded-[6px] transition-colors shrink-0"
                                title={`View ${item.type} details`}
                              >
                                <Eye
                                  size={14}
                                  className="text-amber-600"
                                />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (item.type === "task") {
                                    setEditTaskData(item.originalData);
                                    setIsEditTaskModalOpen(true);
                                  } else if (item.type === "issue") {
                                    setEditIssueData(item.originalData);
                                    setIsEditIssueModalOpen(true);
                                  } else if (item.type === "todo") {
                                    setEditTodoData(item.originalData);
                                    setIsEditTodoModalOpen(true);
                                  }
                                }}
                                className="p-1 text-gray-500 hover:text-amber-600 transition-colors shrink-0"
                                title={`Edit ${item.type}`}
                              >
                                <Pencil size={13} />
                              </button>
                              {item.type === "task" &&
                                item.status !== "completed" &&
                                item.status !== "closed" &&
                                (item.originalData?.is_started ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPendingPauseTaskId(
                                        item.originalData.id
                                      );
                                    }}
                                    className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                    title="Pause task"
                                    disabled={playingTaskIds.has(
                                      item.originalData.id
                                    )}
                                  >
                                    <Pause
                                      size={14}
                                      className="text-red-500"
                                    />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPendingPlayTaskId(
                                        item.originalData.id
                                      );
                                    }}
                                    className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                    title="Start task"
                                    disabled={playingTaskIds.has(
                                      item.originalData.id
                                    )}
                                  >
                                    {playingTaskIds.has(
                                      item.originalData.id
                                    ) ? (
                                      <Loader2
                                        size={14}
                                        className="text-green-600 animate-spin"
                                      />
                                    ) : (
                                      <Play
                                        size={14}
                                        className="text-green-600"
                                      />
                                    )}
                                  </button>
                                ))}
                              {item.type === "issue" &&
                                item.status !== "completed" &&
                                item.status !== "closed" &&
                                (item.originalData?.is_started ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPendingPauseIssueId(
                                        item.originalData.id
                                      );
                                    }}
                                    className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                    title="Pause issue"
                                    disabled={playingTaskIds.has(
                                      item.originalData.id
                                    )}
                                  >
                                    <Pause
                                      size={14}
                                      className="text-red-500"
                                    />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPendingPlayIssueId(
                                        item.originalData.id
                                      );
                                    }}
                                    className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                    title="Start issue"
                                    disabled={playingTaskIds.has(
                                      item.originalData.id
                                    )}
                                  >
                                    {playingTaskIds.has(
                                      item.originalData.id
                                    ) ? (
                                      <Loader2
                                        size={14}
                                        className="text-green-600 animate-spin"
                                      />
                                    ) : (
                                      <Play
                                        size={14}
                                        className="text-green-600"
                                      />
                                    )}
                                  </button>
                                ))}
                              {item.type === "todo" &&
                                item.originalData?.task_management_id &&
                                item.status !== "completed" &&
                                item.status !== "closed" &&
                                (item.originalData?.task_management
                                  ?.is_started ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPendingPauseTaskId(
                                        item.originalData.task_management_id
                                      );
                                    }}
                                    className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                    title="Pause task"
                                    disabled={playingTaskIds.has(
                                      item.originalData.task_management_id
                                    )}
                                  >
                                    <Pause
                                      size={14}
                                      className="text-red-500"
                                    />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPendingPlayTaskId(
                                        item.originalData.task_management_id
                                      );
                                    }}
                                    className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                    title="Start task"
                                    disabled={playingTaskIds.has(
                                      item.originalData.task_management_id
                                    )}
                                  >
                                    {playingTaskIds.has(
                                      item.originalData.task_management_id
                                    ) ? (
                                      <Loader2
                                        size={14}
                                        className="text-green-600 animate-spin"
                                      />
                                    ) : (
                                      <Play
                                        size={14}
                                        className="text-green-600"
                                      />
                                    )}
                                  </button>
                                ))}
                              <span
                                className={cn(
                                  "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0",
                                  item.type === "task"
                                    ? "bg-[#DA7756] text-white"
                                    : item.type === "issue"
                                      ? "bg-violet-600 text-white"
                                      : "bg-amber-500 text-white"
                                )}
                              >
                                {item.type}
                              </span>
                              <div className="flex-1 min-w-[90px] basis-[120px]">
                                <p
                                  className={cn(
                                    "text-sm font-medium truncate",
                                    (item.status === "completed" ||
                                      item.status === "closed") &&
                                    "line-through opacity-60"
                                  )}
                                >
                                  {item.title}
                                </p>
                              </div>
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                                style={{
                                  backgroundColor: getPriorityColors(
                                    item.priority
                                  ).bg,
                                  color: getPriorityColors(item.priority)
                                    .color,
                                }}
                              >
                                {item.priority}
                              </span>
                              <button
                                onClick={() =>
                                  addedToTomorrowIds.has(item.id)
                                    ? removeItemFromTomorrow(item)
                                    : addItemToTomorrow(item)
                                }
                                className={cn(
                                  "shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-[6px] transition-all border whitespace-nowrap",
                                  addedToTomorrowIds.has(item.id)
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                    : "bg-white border-gray-200 text-gray-500 hover:border-[#DA7756] hover:text-[#DA7756] hover:bg-[#DA7756]/5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                )}
                                title={
                                  addedToTomorrowIds.has(item.id)
                                    ? "Remove from tomorrow's plan"
                                    : "Add to tomorrow's plan"
                                }
                              >
                                {addedToTomorrowIds.has(item.id)
                                  ? "Added ✓"
                                  : "+ Tomorrow"}
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
                              let issueEffort: string | null = null;
                              if (
                                item.type === "issue" &&
                                Array.isArray(d?.issue_allocation_times) &&
                                d.issue_allocation_times.length > 0
                              ) {
                                const totalMin =
                                  d.issue_allocation_times.reduce(
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
                                  timeLeftLabel =
                                    days > 0
                                      ? `${days}d ${hrs}h left`
                                      : hrs > 0
                                        ? `${hrs}h ${mins}m left`
                                        : `${mins}m left`;
                                }
                              }
                              const hasInfo =
                                endDate ||
                                effortEst ||
                                issueEffort ||
                                timeLeftLabel ||
                                (item.type === "task" &&
                                  d?.active_time_till_now);
                              if (!hasInfo) return null;
                              return (
                                <div className="flex items-center gap-3 px-3 pb-2 flex-wrap">
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
                                  {item.type === "task" &&
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
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

            {TASK_GROUPS.map((group) => {
              const items = mergedTasksIssues.filter((item: any) => {
                const isPlayedOrStarted =
                  item.originalData?.is_started ||
                  item.is_started ||
                  playingTaskIds.has(item.originalData?.id);
                const isDone = ["completed", "closed", "done"].includes(
                  item.status
                );
                const effectiveStatus =
                  isPlayedOrStarted && !isDone
                    ? "in_progress"
                    : item.status;
                return (
                  (group.statuses as readonly string[]).includes(
                    effectiveStatus
                  ) &&
                  !(
                    (yesterdaySourceIds.has(item.id) ||
                      noteMatchedTaskIssueIds.has(item.id)) &&
                    !isPlayedOrStarted
                  ) &&
                  !addedToTomorrowIds.has(item.id)
                );
              });
              if (items.length === 0) return null;
              const isCollapsed = collapsedGroups.has(group.key);

              return (
                <div key={group.key}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-[8px] transition-all mb-1.5",
                      group.headerBg
                    )}
                    onClick={() =>
                      setCollapsedGroups((prev) => {
                        const next = new Set(prev);
                        if (next.has(group.key)) next.delete(group.key);
                        else next.add(group.key);
                        return next;
                      })
                    }
                  >
                    <span
                      className={cn(
                        "text-xs font-black uppercase tracking-wider flex-1 text-left",
                        group.colorClass
                      )}
                    >
                      {group.label}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        group.pillBg
                      )}
                    >
                      {items.length}
                    </span>
                    {group.showBulkAdd && items.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addAllOverdueToTomorrow();
                        }}
                        className="text-[10px] font-bold text-red-700 bg-white hover:bg-red-50 border border-red-200 px-2 py-1 rounded-[6px] transition-all ml-1"
                      >
                        Add all to tomorrow
                      </button>
                    )}
                    <ChevronRight
                      size={14}
                      className={cn(
                        "transition-transform duration-200 ml-1",
                        group.colorClass,
                        !isCollapsed && "rotate-90"
                      )}
                    />
                  </button>

                  {!isCollapsed && (
                    <div className="space-y-1.5 pl-1">
                      {items.map((item: any) => (
                        <div
                          key={item.id}
                          className={cn(
                            "flex flex-col rounded-[10px] border transition-all group",
                            group.bgItem
                          )}
                        >
                          <div className="flex flex-wrap items-center gap-2 p-2.5">
                            <Checkbox
                              checked={
                                selectedTasksIssues[item.id] ||
                                item.status === "completed" ||
                                item.status === "closed"
                              }
                              onCheckedChange={(checked) => {
                                if (
                                  checked &&
                                  item.status !== "completed" &&
                                  item.status !== "closed"
                                ) {
                                  setPendingConfirmAction({
                                    fn: () =>
                                      handleCompleteItem(item),
                                    label: `complete this ${item.type}`,
                                  });
                                } else {
                                  markDraftDirty();
                                  setSelectedTasksIssues((prev) => ({
                                    ...prev,
                                    [item.id]: checked as boolean,
                                  }));
                                }
                              }}
                              className="h-4 w-4 rounded-[4px] border-gray-300 data-[state=checked]:bg-[#1a1a1a] data-[state=checked]:border-[#1a1a1a] shrink-0"
                            />

                            <button
                              onClick={() => {
                                if (item.type === "todo") {
                                  setSelectedTodo(item.originalData);
                                  setIsDetailsModalOpen(true);
                                } else {
                                  navigate(
                                    item.type === "task"
                                      ? `/business-compass/tasks/${item?.id.split("-")[1]}`
                                      : `/business-compass/issues/${item?.id.split("-")[1]}`
                                  );
                                }
                              }}
                              className="p-1 hover:bg-white/60 rounded-[6px] transition-colors shrink-0"
                              title={`View ${item.type} details`}
                            >
                              <Eye
                                size={14}
                                className="text-[#DA7756]"
                              />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.type === "task") {
                                  setEditTaskData(item.originalData);
                                  setIsEditTaskModalOpen(true);
                                } else if (item.type === "issue") {
                                  setEditIssueData(
                                    item.originalData
                                  );
                                  setIsEditIssueModalOpen(true);
                                } else if (item.type === "todo") {
                                  setEditTodoData(item.originalData);
                                  setIsEditTodoModalOpen(true);
                                }
                              }}
                              className="p-1 text-gray-500 hover:text-[#DA7756] transition-colors shrink-0"
                              title={`Edit ${item.type}`}
                            >
                              <Pencil size={13} />
                            </button>

                            {item.type === "task" &&
                              item.status !== "completed" &&
                              item.status !== "closed" &&
                              (item.originalData?.is_started ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPendingPauseTaskId(
                                      item.originalData.id
                                    );
                                  }}
                                  className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                  title="Pause task"
                                  disabled={playingTaskIds.has(
                                    item.originalData.id
                                  )}
                                >
                                  <Pause
                                    size={14}
                                    className="text-red-500"
                                  />
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPendingPlayTaskId(
                                      item.originalData.id
                                    );
                                  }}
                                  className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                  title="Start task"
                                  disabled={playingTaskIds.has(
                                    item.originalData.id
                                  )}
                                >
                                  {playingTaskIds.has(
                                    item.originalData.id
                                  ) ? (
                                    <Loader2
                                      size={14}
                                      className="text-green-600 animate-spin"
                                    />
                                  ) : (
                                    <Play
                                      size={14}
                                      className="text-green-600"
                                    />
                                  )}
                                </button>
                              ))}

                            {item.type === "issue" &&
                              item.status !== "completed" &&
                              item.status !== "closed" &&
                              (item.originalData?.is_started ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPendingPauseIssueId(
                                      item.originalData.id
                                    );
                                  }}
                                  className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                  title="Pause issue"
                                  disabled={playingTaskIds.has(
                                    item.originalData.id
                                  )}
                                >
                                  <Pause
                                    size={14}
                                    className="text-red-500"
                                  />
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPendingPlayIssueId(
                                      item.originalData.id
                                    );
                                  }}
                                  className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                  title="Start issue"
                                  disabled={playingTaskIds.has(
                                    item.originalData.id
                                  )}
                                >
                                  {playingTaskIds.has(
                                    item.originalData.id
                                  ) ? (
                                    <Loader2
                                      size={14}
                                      className="text-green-600 animate-spin"
                                    />
                                  ) : (
                                    <Play
                                      size={14}
                                      className="text-green-600"
                                    />
                                  )}
                                </button>
                              ))}
                            {item.type === "todo" &&
                              item.originalData?.task_management_id &&
                              item.status !== "completed" &&
                              item.status !== "closed" &&
                              (item.originalData?.task_management
                                ?.is_started ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPendingPauseTaskId(
                                      item.originalData
                                        .task_management_id
                                    );
                                  }}
                                  className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                  title="Pause task"
                                  disabled={playingTaskIds.has(
                                    item.originalData
                                      .task_management_id
                                  )}
                                >
                                  <Pause
                                    size={14}
                                    className="text-red-500"
                                  />
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPendingPlayTaskId(
                                      item.originalData
                                        .task_management_id
                                    );
                                  }}
                                  className="p-1 hover:bg-white/60 rounded transition shrink-0"
                                  title="Start task"
                                  disabled={playingTaskIds.has(
                                    item.originalData
                                      .task_management_id
                                  )}
                                >
                                  {playingTaskIds.has(
                                    item.originalData
                                      .task_management_id
                                  ) ? (
                                    <Loader2
                                      size={14}
                                      className="text-green-600 animate-spin"
                                    />
                                  ) : (
                                    <Play
                                      size={14}
                                      className="text-green-600"
                                    />
                                  )}
                                </button>
                              ))}

                            <span
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0",
                                item.type === "task"
                                  ? "bg-[#DA7756] text-white"
                                  : item.type === "issue"
                                    ? "bg-violet-600 text-white"
                                    : "bg-amber-500 text-white"
                              )}
                            >
                              {item.type}
                            </span>

                            <div className="flex-1 min-w-[90px] basis-[120px]">
                              <p
                                className={cn(
                                  "text-sm font-medium truncate",
                                  (item.status === "completed" ||
                                    item.status === "closed") &&
                                  "line-through opacity-60"
                                )}
                              >
                                {item.title}
                              </p>
                            </div>

                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                              style={{
                                backgroundColor: getPriorityColors(
                                  item.priority
                                ).bg,
                                color: getPriorityColors(
                                  item.priority
                                ).color,
                              }}
                            >
                              {item.priority}
                            </span>

                            {group.showAddToTomorrow && (
                              <button
                                onClick={() =>
                                  addedToTomorrowIds.has(item.id)
                                    ? removeItemFromTomorrow(item)
                                    : addItemToTomorrow(item)
                                }
                                className={cn(
                                  "shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-[6px] transition-all border whitespace-nowrap",
                                  addedToTomorrowIds.has(item.id)
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                    : "bg-white border-gray-200 text-gray-500 hover:border-[#DA7756] hover:text-[#DA7756] hover:bg-[#DA7756]/5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                )}
                                title={
                                  addedToTomorrowIds.has(item.id)
                                    ? "Remove from tomorrow's plan"
                                    : "Add to tomorrow's plan"
                                }
                              >
                                {addedToTomorrowIds.has(item.id)
                                  ? "Added ✓"
                                  : "+ Tomorrow"}
                              </button>
                            )}
                          </div>

                          {(() => {
                            const d = item.originalData;
                            const endDate = fmtDate(
                              d?.target_date ||
                              d?.due_date ||
                              d?.end_date
                            );
                            const effortEst = fmtHours(
                              d?.total_allocated_hours ||
                              d?.estimated_hour
                            );
                            const overdueLabel = getOverdueLabel(
                              d?.target_date ||
                              d?.due_date ||
                              d?.end_date
                            );

                            let issueEffort: string | null = null;
                            if (
                              item.type === "issue" &&
                              Array.isArray(d?.issue_allocation_times) &&
                              d.issue_allocation_times.length > 0
                            ) {
                              const totalMin =
                                d.issue_allocation_times.reduce(
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

                            let timeLeftLabel: string | null = null;
                            if (
                              item.type === "issue" &&
                              d?.end_date &&
                              !overdueLabel
                            ) {
                              const now = new Date();
                              const end = new Date(d.end_date);
                              end.setHours(23, 59, 59, 999);
                              const diff =
                                end.getTime() - now.getTime();
                              if (diff > 0) {
                                const days = Math.floor(
                                  diff / 86400000
                                );
                                const hrs = Math.floor(
                                  (diff % 86400000) / 3600000
                                );
                                const mins = Math.floor(
                                  (diff % 3600000) / 60000
                                );
                                if (days > 0)
                                  timeLeftLabel = `${days}d ${hrs}h left`;
                                else if (hrs > 0)
                                  timeLeftLabel = `${hrs}h ${mins}m left`;
                                else timeLeftLabel = `${mins}m left`;
                              }
                            }

                            const hasInfo =
                              endDate ||
                              effortEst ||
                              issueEffort ||
                              timeLeftLabel ||
                              (item.type === "task" &&
                                d?.active_time_till_now);
                            if (!hasInfo) return null;
                            return (
                              <div className="flex items-center gap-3 px-3 pb-2 flex-wrap">
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
                                    <Clock
                                      size={9}
                                      className="shrink-0"
                                    />
                                    {timeLeftLabel}
                                  </span>
                                )}
                                {effortEst && (
                                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <Clock
                                      size={9}
                                      className="shrink-0"
                                    />
                                    Est: {effortEst}
                                  </span>
                                )}
                                {issueEffort && (
                                  <span className="flex items-center gap-1 text-[10px] text-purple-600">
                                    <Zap
                                      size={9}
                                      className="shrink-0"
                                    />
                                    Effort: {issueEffort}
                                  </span>
                                )}
                                {item.type === "task" &&
                                  d?.active_time_till_now && (
                                    <span className="flex items-center gap-1 text-[10px] text-green-600">
                                      <Zap
                                        size={9}
                                        className="shrink-0"
                                      />
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoadingMore && (
              <div className="flex items-center justify-center py-4">
                <Loader2
                  size={20}
                  className="text-[#b91c1c]/50 animate-spin mr-2"
                />
                <p className="text-xs text-gray-500 font-medium">
                  Loading more...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
