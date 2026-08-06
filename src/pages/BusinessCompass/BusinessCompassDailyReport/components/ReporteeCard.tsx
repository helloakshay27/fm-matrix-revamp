import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  ListTodo,
  Loader2,
  Plus,
  Users,
} from "lucide-react";
import { COMPLETED_STATUSES } from "../constants";
import { useDailyReport } from "../context/DailyReportContext";
import { fmtDate, fmtHours, getOverdueLabel } from "../utils";

export const ReporteeCard = () => {
  const {
    isReporteeLoading,
    reporteeSummary,
    reporteeError,
    reporteeManagerName,
    reporteeMembers,
    expandedReportees,
    toggleReportee,
    formattedSelectedDate,
    handleViewReportItem,
    getBorrowedItemKey,
    toggleBorrowedAccomplishment,
    toggleBorrowedPlanItem,
    accomplishments,
    planningItems,
  } = useDailyReport();

  if (!isReporteeLoading && reporteeSummary.total === 0 && !reporteeError) {
    return null;
  }

  return (
    <div className="bc-daily-card">
      <div className="bc-daily-card-header">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <h3 className="min-w-0 text-xs font-extrabold uppercase tracking-wider text-neutral-700">
              Reportee Reports
            </h3>
            <p className="text-[10px] font-medium text-neutral-400">
              Reports submitted under {reporteeManagerName || "your team"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          {reporteeSummary.total > 0 && (
            <>
              <span className="shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600">
                {reporteeSummary.total} Reportee
                {reporteeSummary.total === 1 ? "" : "s"}
              </span>
              {reporteeSummary.submitted > 0 && (
                <span className="shrink-0 rounded-full border border-green-100 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                  {reporteeSummary.submitted} Submitted
                </span>
              )}
              {reporteeSummary.missed > 0 && (
                <span className="shrink-0 rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-600">
                  {reporteeSummary.missed} Missed
                </span>
              )}
            </>
          )}
          {reporteeSummary.total === 0 && !isReporteeLoading && (
            <span className="shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600">
              0 Reportees
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 p-3">
        {isReporteeLoading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-xs font-semibold text-slate-400">
            <Loader2 size={14} className="animate-spin" />
            Loading reportee reports...
          </div>
        ) : reporteeError ? (
          <p className="py-6 text-center text-xs font-semibold text-red-500">
            {reporteeError}
          </p>
        ) : reporteeMembers.length === 0 ? (
          <p className="py-6 text-center text-xs font-semibold italic text-slate-400">
            No reportee reports for {formattedSelectedDate}.
          </p>
        ) : (
          reporteeMembers.map((member: any, memberIndex: number) => {
            const memberKey = String(member?.user_id ?? memberIndex);
            const isMemberExpanded = expandedReportees.includes(memberKey);
            const memberStatus = String(member?.status || "").toLowerCase();
            const isMemberSubmitted =
              memberStatus !== "missed" && memberStatus !== "pending";
            const sections = member?.sections || {};
            const hasSubmittedData = Object.keys(sections).length > 0;
            const totalScore =
              member?.score != null
                ? Number(member.score)
                : hasSubmittedData
                  ? Object.values(sections).reduce(
                      (sum: number, v: any) => sum + (Number(v) || 0),
                      0
                    )
                  : 0;
            const scoreChips = [
              {
                label: "KPI",
                value: Number(sections.kpi_achievement ?? 0),
              },
              {
                label: "Tasks & Todos",
                value: Number(sections.tasks_issues_todos ?? 0),
              },
              {
                label: "Accomplishments",
                value: Number(sections.accomplishments ?? 0),
              },
              { label: "Planning", value: Number(sections.planning ?? 0) },
              { label: "Timing", value: Number(sections.timing ?? 0) },
            ];
            const columns = [
              {
                key: "accomplishments",
                title: "Accomplishments",
                Icon: CheckCircle2,
                iconClass: "text-[#798c5e]",
                items: member.accomplishments as any[],
              },
              {
                key: "tasks_issues",
                title: "Tasks, Issues & To Do",
                Icon: ListTodo,
                iconClass: "text-[#DA7756]",
                items: (member.tasks_issues as any[]).filter(
                  (item: any) =>
                    String(item?.status).toLowerCase() !== "completed" &&
                    String(item?.status).toLowerCase() !== "closed"
                ),
              },
              {
                key: "tomorrow_plan",
                title: "Tomorrow's Plan",
                Icon: CalendarCheck,
                iconClass: "text-[#6b9bcc]",
                items: member.tomorrow_plan as any[],
              },
            ];
            const submittedStamp = member?.submitted_at
              ? new Date(member.submitted_at).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              : null;

            return (
              <div
                key={memberKey}
                className="overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50/30"
              >
                <div
                  className="flex cursor-pointer flex-col gap-3 p-4 transition-colors hover:bg-indigo-50/60 sm:flex-row sm:items-start sm:justify-between"
                  onClick={() => toggleReportee(memberKey)}
                >
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-sm font-bold text-neutral-900">
                        {member?.name?.trim() || "Member"}
                      </h4>
                      {member?.department && (
                        <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                          {member.department}
                        </span>
                      )}
                      {isMemberSubmitted && (
                        <span className="shrink-0 rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                          Submitted
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-neutral-400">
                      {member?.email || "—"}
                      {submittedStamp && (
                        <span className="ml-1">- {submittedStamp}</span>
                      )}
                    </p>
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-2 self-start sm:self-center">
                    {!isMemberSubmitted ? (
                      <span className="shrink-0 rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                        Missed
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                          member?.is_absent
                            ? "border-red-100 bg-red-50 text-red-700"
                            : "border-green-100 bg-green-50 text-green-700"
                        )}
                      >
                        {member?.is_absent
                          ? `Absent${
                              member?.absent_reason
                                ? `: ${member.absent_reason}`
                                : ""
                            }`
                          : "Present"}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleReportee(memberKey);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-500"
                    >
                      <ChevronDown
                        size={15}
                        className={cn(
                          "transition-transform",
                          isMemberExpanded && "rotate-180"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {isMemberExpanded && (
                  <div className="border-t border-indigo-100 bg-white p-3">
                    {member?.is_absent && (
                      <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2">
                        <span className="mt-0.5 shrink-0 text-red-500">✕</span>
                        <div>
                          <p className="text-[11px] font-bold text-red-700">
                            Absent
                          </p>
                          {member?.absent_reason && (
                            <p className="text-[11px] text-red-500 font-medium">
                              {member.absent_reason}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {isMemberSubmitted && hasSubmittedData && (
                      <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        {scoreChips.map((chip) => (
                          <span
                            key={chip.label}
                            className="inline-flex h-[22px] items-center rounded-full bg-[#FFF3EE] px-2.5 text-[10px] font-semibold text-[#c2664a]"
                          >
                            {chip.label}
                            <span className="ml-1 font-bold">
                              {chip.value}/20
                            </span>
                          </span>
                        ))}
                        <span className="inline-flex h-[22px] items-center rounded-full bg-neutral-100 px-2.5 text-[10px] font-bold text-neutral-600">
                          Total {totalScore}
                        </span>
                      </div>
                    )}
                    {!isMemberSubmitted && !member?.is_absent && (
                      <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                        <span className="text-[11px] font-semibold text-amber-700">
                          Report not yet submitted for this date.
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      {columns.map((column) => (
                        <div
                          key={column.key}
                          className="overflow-hidden rounded-[12px] border border-[#E8E2DE] bg-white"
                        >
                          <div className="flex items-center gap-2 border-b border-[#EFE7E2] px-3 py-2.5">
                            <column.Icon
                              size={15}
                              className={cn("shrink-0", column.iconClass)}
                            />
                            <h5 className="min-w-0 flex-1 truncate text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#3E342F]">
                              {column.title}
                            </h5>
                            <span className="shrink-0 rounded-full bg-neutral-100 px-1.5 text-[10px] font-bold leading-[18px] text-neutral-500">
                              {column.items.length}
                            </span>
                          </div>
                          <div className="space-y-2 p-2.5">
                            {column.items.length === 0 ? (
                              <p className="px-1 py-2 text-[11px] italic text-slate-300">
                                {isMemberSubmitted
                                  ? "None recorded."
                                  : "Not submitted."}
                              </p>
                            ) : (
                              (() => {
                                const renderItem = (
                                  item: any,
                                  itemIndex: number
                                ) => {
                                  const itemType = String(
                                    item?.source_type ||
                                      item?.type ||
                                      "note"
                                  ).toLowerCase();
                                  const original = item?.originalData || {};
                                  const dueRaw =
                                    original?.target_date ||
                                    original?.end_date ||
                                    original?.due_date;
                                  const dueDate = fmtDate(dueRaw);
                                  const itemStatus = String(
                                    item?.status || original?.status || ""
                                  ).toLowerCase();
                                  const isAccomplishment =
                                    column.key === "accomplishments";
                                  const isItemDone =
                                    isAccomplishment ||
                                    COMPLETED_STATUSES.has(itemStatus);
                                  const overdueLabel = isItemDone
                                    ? null
                                    : getOverdueLabel(dueRaw);
                                  const statusLabel = isAccomplishment
                                    ? "completed"
                                    : itemStatus;
                                  const showStatusTag =
                                    column.key === "tomorrow_plan";
                                  const effortEst = fmtHours(
                                    original?.total_allocated_hours ||
                                      original?.estimated_hour
                                  );
                                  const projectName =
                                    original?.project_management_title ||
                                    original?.project_management_name;
                                  const isClickable = ["task", "issue", "todo"].includes(
                                    itemType
                                  );
                                  const isBorrowable =
                                    column.key === "accomplishments" ||
                                    column.key === "tomorrow_plan";
                                  const borrowedId = isBorrowable
                                    ? `${
                                        column.key === "accomplishments"
                                          ? "borrowed"
                                          : "borrowed-plan"
                                      }-${getBorrowedItemKey(member, item)}`
                                    : null;
                                  const isBorrowed = isBorrowable
                                    ? column.key === "accomplishments"
                                      ? accomplishments.some(
                                          (a) => a.id === borrowedId
                                        )
                                      : planningItems.some(
                                          (p) => p.id === borrowedId
                                        )
                                    : false;
                                  return (
                                    <div
                                      key={`${itemType}-${itemIndex}`}
                                      onClick={
                                        isClickable
                                          ? () => handleViewReportItem(item)
                                          : undefined
                                      }
                                      className={cn(
                                        "rounded-[10px] border border-[#EEF1F4] bg-white p-2.5",
                                        isClickable &&
                                          "cursor-pointer transition-colors hover:border-[#DA7756]/30 hover:bg-[#FFFAF8]"
                                      )}
                                    >
                                      <div className="mb-1.5 flex items-center gap-1.5">
                                        {itemType && (
                                          <span
                                            className={cn(
                                              "shrink-0 rounded-[4px] px-1.5 text-[9px] font-bold uppercase leading-[16px] tracking-wide",
                                              itemType === "task"
                                                ? "bg-[#FFF3EE] text-[#c2664a]"
                                                : itemType === "issue"
                                                  ? "bg-violet-50 text-violet-600"
                                                  : itemType === "todo"
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-neutral-100 text-neutral-500"
                                            )}
                                          >
                                            {itemType}
                                          </span>
                                        )}
                                        {statusLabel && showStatusTag && (
                                          <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-neutral-400">
                                            {statusLabel.replace(/_/g, " ")}
                                          </span>
                                        )}
                                        {isBorrowable && (
                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              if (
                                                column.key === "accomplishments"
                                              ) {
                                                toggleBorrowedAccomplishment(
                                                  member,
                                                  item
                                                );
                                              } else {
                                                toggleBorrowedPlanItem(
                                                  member,
                                                  item
                                                );
                                              }
                                            }}
                                            className={cn(
                                              "ml-auto flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide transition-colors",
                                              isBorrowed
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                                : "border-neutral-200 bg-white text-neutral-400 hover:border-[#DA7756] hover:text-[#DA7756]"
                                            )}
                                            title={
                                              isBorrowed
                                                ? `Added to your report (credited to ${
                                                    member?.name?.trim() ||
                                                    "this reportee"
                                                  })`
                                                : `Add to your report (credited to ${
                                                    member?.name?.trim() ||
                                                    "this reportee"
                                                  })`
                                            }
                                          >
                                            {isBorrowed ? (
                                              <Check size={10} />
                                            ) : (
                                              <Plus size={10} />
                                            )}
                                            {isBorrowed ? "Added" : "Add to mine"}
                                          </button>
                                        )}
                                      </div>

                                      <p className="break-words text-[12px] font-semibold leading-[17px] text-[#2B2F38]">
                                        {typeof item === "string"
                                          ? item
                                          : item?.title ||
                                            item?.text ||
                                            item?.name ||
                                            "—"}
                                      </p>

                                      {(dueDate ||
                                        overdueLabel ||
                                        effortEst) && (
                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                          {dueDate && (
                                            <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                              <Calendar
                                                size={10}
                                                className="shrink-0"
                                              />
                                              {dueDate}
                                            </span>
                                          )}
                                          {effortEst && (
                                            <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                              <Clock
                                                size={10}
                                                className="shrink-0"
                                              />
                                              Est {effortEst}
                                            </span>
                                          )}
                                          {overdueLabel && (
                                            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                                              <AlertCircle
                                                size={10}
                                                className="shrink-0"
                                              />
                                              {overdueLabel}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      {projectName && (
                                        <p className="mt-1 truncate text-[10px] font-medium text-slate-400">
                                          {projectName}
                                        </p>
                                      )}
                                    </div>
                                  );
                                };

                                if (column.key === "tasks_issues") {
                                  const isOverdueItem = (i: any) => {
                                    const s = String(
                                      i?.status || ""
                                    ).toLowerCase();
                                    if (COMPLETED_STATUSES.has(s)) return false;
                                    if (s.includes("overdue")) return true;
                                    const d = i?.originalData || {};
                                    return !!getOverdueLabel(
                                      d?.target_date ||
                                        d?.end_date ||
                                        d?.due_date
                                    );
                                  };
                                  const overdue = column.items.filter(
                                    isOverdueItem
                                  );
                                  const rest = column.items.filter(
                                    (i: any) => !isOverdueItem(i)
                                  );
                                  const inProgress = rest.filter((i: any) =>
                                    [
                                      "in_progress",
                                      "in progress",
                                      "started",
                                      "wip",
                                    ].includes(String(i?.status).toLowerCase())
                                  );
                                  const onHold = rest.filter((i: any) =>
                                    ["on_hold", "hold"].includes(
                                      String(i?.status).toLowerCase()
                                    )
                                  );
                                  const openItems = rest.filter((i: any) =>
                                    [
                                      "open",
                                      "pending",
                                      "reopen",
                                      "reopened",
                                      "new",
                                      "to_do",
                                      "todo",
                                    ].includes(String(i?.status).toLowerCase())
                                  );
                                  const bucketed = new Set([
                                    ...overdue,
                                    ...inProgress,
                                    ...onHold,
                                    ...openItems,
                                  ]);
                                  const others = column.items.filter(
                                    (i: any) => !bucketed.has(i)
                                  );

                                  return (
                                    <div className="space-y-4">
                                      {overdue.length > 0 && (
                                        <div className="space-y-1.5">
                                          <h6 className="flex items-center gap-1.5 px-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-red-500">
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            Overdue
                                            <span className="font-semibold text-neutral-400">
                                              ({overdue.length})
                                            </span>
                                          </h6>
                                          {overdue.map(renderItem)}
                                        </div>
                                      )}
                                      {inProgress.length > 0 && (
                                        <div className="space-y-1.5">
                                          <h6 className="flex items-center gap-1.5 px-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-sky-600">
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            In Progress
                                            <span className="font-semibold text-neutral-400">
                                              ({inProgress.length})
                                            </span>
                                          </h6>
                                          {inProgress.map(renderItem)}
                                        </div>
                                      )}
                                      {onHold.length > 0 && (
                                        <div className="space-y-1.5">
                                          <h6 className="flex items-center gap-1.5 px-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-amber-600">
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            On Hold
                                            <span className="font-semibold text-neutral-400">
                                              ({onHold.length})
                                            </span>
                                          </h6>
                                          {onHold.map(renderItem)}
                                        </div>
                                      )}
                                      {openItems.length > 0 && (
                                        <div className="space-y-1.5">
                                          <h6 className="flex items-center gap-1.5 px-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            Open
                                            <span className="font-semibold text-neutral-400">
                                              ({openItems.length})
                                            </span>
                                          </h6>
                                          {openItems.map(renderItem)}
                                        </div>
                                      )}
                                      {others.length > 0 && (
                                        <div className="space-y-1.5">
                                          <h6 className="flex items-center gap-1.5 px-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-neutral-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                            Other
                                            <span className="font-semibold text-neutral-400">
                                              ({others.length})
                                            </span>
                                          </h6>
                                          {others.map(renderItem)}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }

                                return column.items.map(renderItem);
                              })()
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
