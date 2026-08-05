import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Star,
  Target,
  Edit,
  Trash2,
  AlertCircle,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Eye,
  Pencil,
  Calendar as CalendarIcon,
  Upload,
  Image as ImageIcon,
  FileText,
  Clock,
  Zap,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import {
  getNonEmptyReportItems,
  getReportItemText,
  buildItemSourceRef,
  fmtDate,
  fmtHours,
  getOverdueLabel,
  getPriorityColors,
  isImageFile,
} from "../utils";
import type { AttachmentFile, DailyReport } from "../types";
import { useDailyReport } from "../context/DailyReportContext";

const renderItemSourceBadge = (sourceType?: string) =>
  cn(
    "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0",
    sourceType === "task"
      ? "bg-[#DA7756] text-white"
      : sourceType === "issue"
        ? "bg-violet-600 text-white"
        : sourceType === "todo"
          ? "bg-amber-500 text-white"
          : "bg-gray-500 text-white"
  );

export const HistoryView = () => {
  const {
    isHistoryLoading,
    reportsList,
    user,
    handleDeleteReport,
    handleViewReportItem,
    handleEditReportItem,
    setStartDate,
    setSelectedDate,
    setSelectedMonth,
    setSelectedYear,
    setCurrentReportId,
    setAccomplishments,
    setPlanningItems,
    setKpiEntries,
    setIsAbsent,
    setAbsenceReason,
    setSelfRating,
    setActiveTab,
  } = useDailyReport();

  return (
    <TabsContent value="history" className="mt-0 pt-0">
      {isHistoryLoading ? (
        <Card className="bc-history-empty-card">
          <Loader2
            size={40}
            className="text-[#DA7756]/40 animate-spin mb-4"
          />
          <p className="text-gray-500 font-bold">
            Loading your report history...
          </p>
        </Card>
      ) : reportsList.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-5">
            {reportsList.map((report) => (
              <Card key={report.id} className="bc-history-card">
                <div className="bc-history-card-body">
                  <div className="bc-history-card-header">
                    <div className="min-w-0">
                      <div className="bc-history-title-row">
                        <h2 className="bc-history-title">
                          {new Date(report.start_date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </h2>
                        <Badge
                          variant="outline"
                          className="bc-history-time-badge"
                        >
                          {new Date(report.created_at).toLocaleTimeString(
                            "en-US",
                            { hour: "numeric", minute: "2-digit" }
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1.5">
                        By: {user?.firstname} {user?.lastname}
                      </p>
                    </div>
                    <div className="bc-history-actions-wrap">
                      <div className="bc-history-badges">
                        <Badge className="bc-history-rating-badge">
                          <Star size={12} className="fill-white" />
                          {report.report_data?.details?.self_rating ??
                            report.report_data?.self_rating ??
                            report.self_rating ??
                            0}
                          /10
                        </Badge>
                        <Badge className="bc-history-score-badge">
                          <Target size={12} className="fill-white" />
                          {report.report_data?.total_score || 0}/100
                        </Badge>
                      </div>
                      <div className="bc-history-action-buttons">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bc-history-action-btn text-[#DA7756] border-[#DA7756]/30 hover:bg-[#DA7756]/5 text-xs font-medium rounded-[4px] shadow-sm"
                          onClick={() => {
                            const date = new Date(report.start_date);
                            const formattedDate =
                              date.toLocaleDateString("en-CA");
                            setStartDate(formattedDate);
                            setSelectedDate(
                              date.getDate().toString().padStart(2, "0")
                            );
                            setSelectedMonth(
                              date.toLocaleString("default", {
                                month: "long",
                              })
                            );
                            setSelectedYear(
                              date.getFullYear().toString()
                            );
                            setCurrentReportId(report.id);
                            if (report.report_data?.accomplishments?.items) {
                              setAccomplishments(
                                getNonEmptyReportItems(
                                  report.report_data.accomplishments.items
                                ).map((ach: any, idx: number) => ({
                                  id: `fetched-ach-${idx}`,
                                  text: getReportItemText(ach),
                                  completed: true,
                                  starred: false,
                                  fromYesterday: false,
                                  ...buildItemSourceRef(ach),
                                }))
                              );
                            } else {
                              setAccomplishments([]);
                            }
                            if (report.report_data?.tomorrow_plan) {
                              setPlanningItems(
                                getNonEmptyReportItems(
                                  report.report_data.tomorrow_plan
                                ).map((p: any, idx: number) => ({
                                  id: `fetched-plan-${idx}`,
                                  text: getReportItemText(p),
                                  starred: false,
                                  ...buildItemSourceRef(p),
                                }))
                              );
                            } else {
                              setPlanningItems([]);
                            }
                            if (report.report_data?.past_kpis) {
                              const entries: { [key: number]: string } = {};
                              report.report_data.past_kpis.forEach(
                                (kpiEntry: any) => {
                                  entries[kpiEntry.kpi_id] =
                                    kpiEntry.actual_value.toString();
                                }
                              );
                              setKpiEntries(entries);
                            } else {
                              setKpiEntries({});
                            }
                            if (report.is_absent !== undefined)
                              setIsAbsent(report.is_absent);
                            if (report.description)
                              setAbsenceReason(report.description);
                            if (report.self_rating !== undefined)
                              setSelfRating([report.self_rating]);
                            setActiveTab("submit");
                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          <Edit size={14} className="text-[#DA7756]" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bc-history-action-btn text-red-600 border-gray-200 hover:bg-red-50 text-xs font-medium rounded-[4px] shadow-sm"
                          onClick={() => handleDeleteReport(report)}
                        >
                          <Trash2 size={14} className="text-red-500" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {report.is_absent && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 mb-4">
                      <AlertCircle
                        size={16}
                        className="text-red-500 shrink-0 mt-0.5"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-red-700">
                          Absent
                        </p>
                        {report.description && (
                          <p className="text-xs text-red-600 mt-0.5 break-words">
                            {report.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {!report.is_absent && (
                    <div className="bc-history-score-panel">
                      <div className="bc-history-section-header">
                        <div className="flex items-center gap-2">
                          <BarChart3
                            size={14}
                            className="text-[#DA7756]"
                          />
                          <span className="text-xs font-bold text-[#1a1a1a]">
                            Score Breakdown
                          </span>
                        </div>
                        <span className="text-sm font-black text-[#DA7756]">
                          Total: {report.report_data?.total_score ?? 0}/100
                        </span>
                      </div>
                      <div className="bc-live-score-metrics">
                        {[
                          {
                            label: "KPIs",
                            value:
                              report.report_data?.sections
                                ?.kpi_achievement ?? 0,
                          },
                          {
                            label: "Accomplishments",
                            value:
                              report.report_data?.sections
                                ?.accomplishments ?? 0,
                          },
                          {
                            label: "Tasks",
                            value:
                              report.report_data?.sections
                                ?.tasks_issues_todos ?? 0,
                          },
                          {
                            label: "Planning",
                            value:
                              report.report_data?.sections?.planning ?? 0,
                          },
                          {
                            label: "Timing",
                            value:
                              report.report_data?.sections?.timing ?? 0,
                          },
                        ].map(({ label, value }) => (
                          <div key={label} className="bc-live-metric">
                            <p className="bc-live-metric-label">{label}</p>
                            <p className="bc-live-metric-value">
                              {value}/20
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.report_data?.past_kpis &&
                    report.report_data.past_kpis.length > 0 && (
                      <div className="bc-history-section-card mb-6">
                        <div className="bc-history-section-header">
                          <div className="flex items-center gap-2">
                            <TrendingUp
                              size={14}
                              className="text-[#DA7756]"
                            />
                            <span className="text-xs font-bold text-[#1a1a1a]">
                              Daily KPIs
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {report.report_data.past_kpis.map(
                            (kpi: any, idx: number) => {
                              const achievement =
                                parseFloat(kpi.target_value) > 0
                                  ? (parseFloat(kpi.actual_value) /
                                      parseFloat(kpi.target_value)) *
                                    100
                                  : 0;
                              const displayAchievement = Math.min(
                                achievement,
                                100
                              );
                              return (
                                <div
                                  key={idx}
                                  className="bc-history-list-item"
                                >
                                  <div className="flex min-w-0 items-center justify-between gap-3 mb-2">
                                    <span className="min-w-0 truncate text-sm font-semibold text-gray-800">
                                      {kpi.notes}
                                    </span>
                                    <Badge className="bg-[#DA7756]/10 text-[#DA7756] text-[10px] font-bold px-2 py-0.5 border-none rounded-[4px]">
                                      {displayAchievement.toFixed(0)}%
                                    </Badge>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-gradient-to-r from-[#DA7756] to-[#c45f3a] h-full rounded-full transition-all"
                                      style={{
                                        width: `${displayAchievement}%`,
                                      }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {kpi.actual_value} / {kpi.target_value}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                  {!report.is_absent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bc-history-section-card">
                        <div className="px-4 py-3 border-b border-[#DA7756]/20 flex items-center gap-2">
                          <CheckCircle2
                            size={16}
                            className="text-[#DA7756]"
                          />
                          <span className="text-sm font-semibold text-[#1a1a1a]">
                            Accomplishments
                          </span>
                        </div>
                        <div className="p-4">
                          {getNonEmptyReportItems(
                            report.report_data?.accomplishments?.items
                          ).length ? (
                            <div className="space-y-3">
                              {getNonEmptyReportItems(
                                report.report_data?.accomplishments?.items
                              ).map((ach: any, idx: number) => {
                                const sourceType =
                                  ach.source_type ??
                                  ach.originalData?.source_type ??
                                  ach.type;
                                const sourceId =
                                  ach.source_id ?? ach.originalData?.id;
                                const itemText = getReportItemText(ach);
                                const itemDate = fmtDate(
                                  ach.originalData?.target_date ||
                                    ach.originalData?.due_date ||
                                    ach.originalData?.end_date ||
                                    ach.originalData?.completed_at ||
                                    ach.originalData?.updated_at
                                );
                                const estimatedHours = fmtHours(
                                  ach.originalData?.total_allocated_hours ||
                                    ach.originalData?.estimated_hour
                                );

                                return (
                                  <div
                                    key={idx}
                                    className="relative group animate-in fade-in duration-200"
                                  >
                                    <div className="flex flex-col gap-1 bg-white border rounded-[10px] p-3 transition-all border-[#DA7756]/10 bg-[#DA7756]/10">
                                      <div className="flex items-center gap-2">
                                        {(sourceType || sourceId) && (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleViewReportItem(ach)
                                              }
                                              className="p-1 hover:bg-white/60 rounded-[6px] transition-colors shrink-0"
                                              title={`View ${sourceType || "item"} details`}
                                            >
                                              <Eye
                                                size={14}
                                                className="text-[#DA7756]"
                                              />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleEditReportItem(ach)
                                              }
                                              className="p-1 text-gray-500 hover:text-[#DA7756] transition-colors shrink-0"
                                              title={`Edit ${sourceType || "item"}`}
                                            >
                                              <Pencil size={13} />
                                            </button>
                                          </>
                                        )}
                                        <span
                                          className={renderItemSourceBadge(
                                            sourceType
                                          )}
                                        >
                                          {sourceType ?? "Note"}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-400 line-through truncate select-none">
                                            {itemText}
                                          </p>
                                        </div>
                                        {ach.originalData?.priority && (
                                          <span
                                            className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                                            style={{
                                              backgroundColor:
                                                getPriorityColors(
                                                  ach.originalData.priority
                                                ).bg,
                                              color: getPriorityColors(
                                                ach.originalData.priority
                                              ).color,
                                            }}
                                          >
                                            {ach.originalData.priority}
                                          </span>
                                        )}
                                      </div>
                                      {(() => {
                                        const d = ach.originalData;
                                        const completedDate = fmtDate(
                                          report.start_date
                                        );
                                        const dueDate = d
                                          ? fmtDate(
                                              d?.target_date ||
                                                d?.due_date ||
                                                d?.end_date
                                            )
                                          : null;
                                        const effortEst = d
                                          ? fmtHours(
                                              d?.total_allocated_hours ||
                                                d?.estimated_hour
                                            )
                                          : null;
                                        let issueEffort: string | null = null;
                                        if (
                                          sourceType === "issue" &&
                                          d &&
                                          Array.isArray(
                                            d?.issue_allocation_times
                                          ) &&
                                          d.issue_allocation_times.length > 0
                                        ) {
                                          const totalMin =
                                            d.issue_allocation_times.reduce(
                                              (sum: number, t: any) =>
                                                sum +
                                                t.hours * 60 +
                                                t.minutes,
                                              0
                                            );
                                          if (totalMin > 0) {
                                            const h = Math.floor(
                                              totalMin / 60
                                            );
                                            const m = totalMin % 60;
                                            issueEffort =
                                              h > 0 && m > 0
                                                ? `${h}h ${m}m`
                                                : h > 0
                                                  ? `${h}h`
                                                  : `${m}m`;
                                          }
                                        }
                                        return (
                                          <div className="flex items-center gap-3 px-1 pt-1 flex-wrap">
                                            {completedDate && (
                                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                <CalendarIcon
                                                  size={9}
                                                  className="shrink-0"
                                                />
                                                {completedDate}
                                              </span>
                                            )}
                                            {effortEst && (
                                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
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
                                            {sourceType === "task" &&
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
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="bg-white border border-[#DA7756]/20 rounded-[6px] px-3 py-2 text-sm shadow-sm">
                              <p className="text-gray-400 italic">
                                No accomplishments.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bc-history-section-card">
                        <div className="px-4 py-3 border-b border-[#DA7756]/20 flex items-center gap-2">
                          <Calendar size={16} className="text-[#DA7756]" />
                          <span className="text-sm font-semibold text-[#1a1a1a]">
                            Tomorrow's Plan
                          </span>
                        </div>
                        <div className="p-4">
                          {getNonEmptyReportItems(
                            report.report_data?.tomorrow_plan
                          ).length ? (
                            <div className="space-y-3">
                              {getNonEmptyReportItems(
                                report.report_data?.tomorrow_plan
                              ).map((task: any, idx: number) => {
                                const sourceType =
                                  task.source_type ??
                                  task.originalData?.source_type ??
                                  task.type;
                                const sourceId =
                                  task.source_id ?? task.originalData?.id;
                                const itemText = getReportItemText(task);
                                const itemDate = fmtDate(
                                  task.originalData?.target_date ||
                                    task.originalData?.due_date ||
                                    task.originalData?.end_date ||
                                    task.originalData?.completed_at ||
                                    task.originalData?.updated_at
                                );
                                const estimatedHours = fmtHours(
                                  task.originalData?.total_allocated_hours ||
                                    task.originalData?.estimated_hour
                                );
                                const livePriority =
                                  task.originalData?.priority;

                                return (
                                  <div
                                    key={idx}
                                    className="relative group animate-in fade-in duration-200"
                                  >
                                    <div className="flex flex-col overflow-hidden bg-[#fafafa] border border-[#f3f4f6] rounded-[10px] p-3 shadow-sm hover:bg-[#f9fafb] hover:border-[#DA7756]/30 transition-all">
                                      <div className="flex min-w-0 items-center gap-2">
                                        {(sourceType || sourceId) && (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleViewReportItem(task)
                                              }
                                              className="p-1 hover:bg-white/60 rounded-[6px] transition-colors shrink-0"
                                              title={`View ${sourceType || "item"} details`}
                                            >
                                              <Eye
                                                size={14}
                                                className="text-amber-600"
                                              />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleEditReportItem(task)
                                              }
                                              className="p-1 text-gray-500 hover:text-amber-600 transition-colors shrink-0"
                                              title={`Edit ${sourceType || "item"}`}
                                            >
                                              <Pencil size={13} />
                                            </button>
                                          </>
                                        )}
                                        <span
                                          className={cn(
                                            "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0",
                                            sourceType === "task"
                                              ? "bg-[#DA7756]/10 text-[#9e4f36]"
                                              : sourceType === "issue"
                                                ? "bg-violet-100 text-violet-700"
                                                : sourceType === "todo"
                                                  ? "bg-yellow-100 text-yellow-700"
                                                  : "bg-gray-500 text-white"
                                          )}
                                        >
                                          {sourceType ?? "Note"}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-700 truncate">
                                            {itemText}
                                          </p>
                                        </div>
                                        {livePriority && (
                                          <span
                                            className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                                            style={{
                                              backgroundColor:
                                                getPriorityColors(
                                                  livePriority
                                                ).bg,
                                              color: getPriorityColors(
                                                livePriority
                                              ).color,
                                            }}
                                          >
                                            {livePriority}
                                          </span>
                                        )}
                                      </div>
                                      {(() => {
                                        const d = task.originalData;
                                        const overdueLabel = d
                                          ? getOverdueLabel(
                                              d?.target_date ||
                                                d?.due_date ||
                                                d?.end_date
                                            )
                                          : null;
                                        let timeLeftLabel: string | null = null;
                                        if (
                                          sourceType === "issue" &&
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
                                            timeLeftLabel =
                                              days > 0
                                                ? `${days}d ${hrs}h left`
                                                : hrs > 0
                                                  ? `${hrs}h ${mins}m left`
                                                  : `${mins}m left`;
                                          }
                                        }
                                        let issueEffort: string | null = null;
                                        if (
                                          sourceType === "issue" &&
                                          d &&
                                          Array.isArray(
                                            d?.issue_allocation_times
                                          ) &&
                                          d.issue_allocation_times.length > 0
                                        ) {
                                          const totalMin =
                                            d.issue_allocation_times.reduce(
                                              (sum: number, t: any) =>
                                                sum +
                                                t.hours * 60 +
                                                t.minutes,
                                              0
                                            );
                                          if (totalMin > 0) {
                                            const h = Math.floor(
                                              totalMin / 60
                                            );
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
                                          itemDate ||
                                          estimatedHours ||
                                          overdueLabel ||
                                          timeLeftLabel ||
                                          issueEffort ||
                                          (sourceType === "task" &&
                                            d?.active_time_till_now);
                                        if (!hasInfo) return null;
                                        return (
                                          <div className="flex items-center gap-3 pl-7 pt-1 flex-wrap">
                                            {itemDate && (
                                              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                                <CalendarIcon
                                                  size={9}
                                                  className="shrink-0"
                                                />
                                                {itemDate}
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
                                            {estimatedHours && (
                                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                <Clock
                                                  size={9}
                                                  className="shrink-0"
                                                />
                                                Est: {estimatedHours}
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
                                            {sourceType === "task" &&
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
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="bg-white border border-[#DA7756]/20 rounded-[6px] px-3 py-2 text-sm shadow-sm">
                              <p className="text-gray-400 italic">
                                No plan for tomorrow.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {report.attachments && report.attachments.length > 0 && (
                    <div className="space-y-3 mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Upload size={16} className="text-[#DA7756]" />
                        <span className="text-sm font-bold text-[#1a1a1a]">
                          Linked Files ({report.attachments.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {report.attachments.map(
                          (attachment: AttachmentFile, idx: number) => {
                            const isImage = isImageFile(
                              attachment.document_file_name,
                              attachment.document_content_type
                            );
                            return (
                              <div
                                key={attachment.id || idx}
                                className="flex items-center justify-between bg-[#DA7756]/5 p-4 rounded-[10px] border border-[#DA7756]/20 hover:shadow-md transition-all group cursor-pointer"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {isImage ? (
                                    <ImageIcon
                                      size={20}
                                      className="text-[#DA7756] shrink-0"
                                    />
                                  ) : (
                                    <FileText
                                      size={20}
                                      className="text-[#DA7756] shrink-0"
                                    />
                                  )}
                                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <a
                                      href={attachment.document_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-semibold text-[#DA7756] hover:text-[#c45f3a] hover:underline line-clamp-2"
                                    >
                                      {attachment.document_file_name}
                                    </a>
                                    <span className="text-[11px] text-gray-600 font-medium">
                                      {attachment.relation} •{" "}
                                      {(
                                        attachment.document_file_size / 1024
                                      ).toFixed(2)}{" "}
                                      KB •{" "}
                                      {new Date(
                                        attachment.document_updated_at
                                      ).toLocaleDateString("en-US", {
                                        month: "numeric",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <Badge className="bg-[#DA7756]/10 text-[#DA7756] border-none px-2.5 py-0.5 text-[10px] font-bold rounded-[4px] whitespace-nowrap">
                                  {attachment.active
                                    ? "Active"
                                    : "Inactive"}
                                </Badge>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="bc-history-empty-card">
          <CalendarIcon size={48} className="text-[#DA7756]/15 mb-2" />
          <p className="text-lg font-bold text-gray-400 tracking-tight">
            No report history found for this period
          </p>
          <p className="text-sm font-medium text-gray-400/80">
            Try selecting a different month or year
          </p>
        </Card>
      )}
    </TabsContent>
  );
};
