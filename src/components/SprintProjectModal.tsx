import { FolderKanban, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { SlideTransition } from "@/components/SprintMemberModal";

export interface ProjectSummary {
  project_id: number;
  project_title: string;
  project_code?: string;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  total_issues: number;
  completed_issues: number;
  pending_issues: number;
  task_effective_minutes: number;
  task_actual_minutes: number;
  issue_effective_minutes: number;
  issue_actual_minutes: number;
  total_effective_minutes: number;
  total_actual_minutes: number;
}

interface SprintProjectModalProps {
  open: boolean;
  onClose: () => void;
  projectsSummary: ProjectSummary[];
  projectsLoading: boolean;
}

const fmtMin = (m: number) => {
  if (!m) return "\u2014";
  if (m >= 60) return `${(m / 60).toFixed(1)}h`;
  return `${m}m`;
};

const PROJECT_COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#06B6D4",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default function SprintProjectModal({
  open,
  onClose,
  projectsSummary,
  projectsLoading,
}: SprintProjectModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      TransitionComponent={SlideTransition}
      PaperProps={{
        sx: {
          width: "min(95vw, 1080px)",
          height: "100%",
          maxHeight: "100%",
          margin: 0,
          borderRadius: 0,
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
        },
      }}
      TransitionProps={{ timeout: { enter: 400, exit: 400 } }}
    >
      <DialogTitle className="relative !pb-0 !px-0 shrink-0">
        <div className="flex items-center gap-2 px-6">
          <FolderKanban size={18} className="text-[#E95420]" />
          <span className="text-sm font-medium text-gray-800">
            Sprint Projects
          </span>
          {projectsSummary.length > 0 && (
            <span className="ml-1 text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
              {projectsSummary.length}
            </span>
          )}
        </div>
        <X
          size={18}
          className="absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-gray-800"
          onClick={onClose}
        />
        <hr className="border border-[#E95420] mt-4" />
      </DialogTitle>

      <DialogContent sx={{ padding: 0, overflow: "auto" }}>
        {projectsLoading ? (
          <div className="flex items-center justify-center h-48 gap-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading projects\u2026</span>
          </div>
        ) : projectsSummary.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <FolderKanban size={36} className="opacity-30" />
            <p className="text-sm">No projects found</p>
          </div>
        ) : (
          <div>
            <table
              className="w-full text-sm border-collapse"
              style={{ minWidth: 750 }}
            >
              <thead className="sticky top-0 z-10">
                {/* Group header row */}
                <tr>
                  <th
                    rowSpan={2}
                    className="bg-[#f5f5dc] text-black text-left px-2 py-2 font-semibold text-xs tracking-wide border-r border-slate-300 align-middle"
                    style={{ minWidth: 200 }}
                  >
                    Project
                  </th>
                  <th
                    colSpan={2}
                    className="bg-[#f5f5dc] text-black text-center px-1.5 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-300"
                  >
                    Tasks
                  </th>
                  <th
                    colSpan={2}
                    className="bg-[#f5f5dc] text-black text-center px-1.5 py-2 text-xs tracking-wide border-r border-slate-300 border-l-2 border-l-slate-300"
                  >
                    Issues
                  </th>
                  <th
                    colSpan={2}
                    className="bg-[#f5f5dc] text-black text-center px-1.5 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-300"
                  >
                    Task Minutes
                  </th>
                  <th
                    colSpan={2}
                    className="bg-[#f5f5dc] text-black text-center px-1.5 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-300"
                  >
                    Issue Minutes
                  </th>
                  <th
                    colSpan={2}
                    className="text-center px-1.5 py-2 text-xs font-semibold tracking-wide border-l-2 border-l-[#E95420]"
                    style={{ backgroundColor: "#E95420", color: "#fff" }}
                  >
                    Total Minutes
                  </th>
                </tr>
                {/* Sub-header row */}
                <tr className="bg-slate-50 border-b border-slate-200">
                  {[
                    { label: "Total", border: true },
                    { label: "Completion", border: true },
                    { label: "Total", border: true },
                    { label: "Completion", border: true },
                    { label: "Effective", border: true },
                    { label: "Actual", border: true },
                    { label: "Effective", border: true },
                    { label: "Actual", border: true },
                    { label: "Effective", border: false },
                    { label: "Actual", border: false },
                  ].map((cell, ci) => {
                    const isFirstInGroup = ci === 0 || ci === 2 || ci === 4 || ci === 6 || ci === 8;
                    const isLastTwo = ci >= 8;
                    return (
                      <th
                        key={ci}
                        className={`px-1.5 py-1 text-[10px] text-center border-t border-t-slate-300 ${isFirstInGroup ? "border-l-2 border-l-slate-300" : ""} ${cell.border ? "border-r border-slate-200" : ""}`}
                        style={{
                          backgroundColor: isLastTwo ? "#fff7f5" : undefined,
                          color: isLastTwo ? "#E95420" : undefined,
                        }}
                      >
                        {cell.label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {projectsSummary.map((p, i) => (
                  <tr
                    key={p.project_id}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-50/70 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                  >
                    {/* Project */}
                    <td className="px-2 py-2 border-r border-slate-100">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center !justify-center text-white text-[11px] font-bold shrink-0 select-none"
                          style={{
                            backgroundColor:
                              PROJECT_COLORS[i % PROJECT_COLORS.length],
                          }}
                        >
                          {p.project_code
                            ? getInitials(p.project_code)
                            : getInitials(p.project_title)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-gray-800 truncate max-w-[280px]">
                            {p.project_title}
                          </p>
                          {p.project_code && (
                            <p className="text-[11px] text-gray-400 truncate">
                              {p.project_code}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Tasks */}
                    {(() => {
                      const taskPct =
                        p.total_tasks > 0
                          ? Math.round(
                            (p.completed_tasks / p.total_tasks) * 100
                          )
                          : 0;
                      const taskColor =
                        taskPct === 100
                          ? "#10B981"
                          : taskPct >= 50
                            ? "#E95420"
                            : "#ef4444";
                      return (
                        <>
                          <td className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200">
                            <span className="text-[13px] font-medium text-blue-600">
                              {p.total_tasks}
                            </span>
                          </td>
                          <td className="px-1.5 py-2 text-center border-r border-slate-300">
                            <span className="text-[13px] font-semibold text-blue-600">
                              {p.completed_tasks}
                            </span>
                            <span
                              className="ml-1 text-[11px] font-bold"
                              style={{ color: taskColor }}
                            >
                              ({taskPct}%)
                            </span>
                          </td>
                        </>
                      );
                    })()}
                    {/* Issues */}
                    {(() => {
                      const issuePct =
                        p.total_issues > 0
                          ? Math.round(
                            (p.completed_issues / p.total_issues) * 100
                          )
                          : 0;
                      const issueColor =
                        issuePct === 100
                          ? "#10B981"
                          : issuePct >= 50
                            ? "#E95420"
                            : "#ef4444";
                      return (
                        <>
                          <td className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200">
                            <span className="text-[13px] font-medium text-blue-600">
                              {p.total_issues}
                            </span>
                          </td>
                          <td className="px-1.5 py-2 text-center border-r border-slate-300">
                            <span className="text-[13px] font-semibold text-blue-600">
                              {p.completed_issues}
                            </span>
                            <span
                              className="ml-1 text-[11px] font-bold"
                              style={{ color: issueColor }}
                            >
                              ({issuePct}%)
                            </span>
                          </td>
                        </>
                      );
                    })()}
                    {/* Task Minutes */}
                    <td className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200 text-[11px] text-gray-500">
                      {fmtMin(p.task_effective_minutes)}
                    </td>
                    <td className="px-1.5 py-2 text-center border-r border-slate-200 text-[11px] text-gray-500">
                      {fmtMin(p.task_actual_minutes)}
                    </td>
                    {/* Issue Minutes */}
                    <td className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200 text-[11px] text-gray-500">
                      {fmtMin(p.issue_effective_minutes)}
                    </td>
                    <td className="px-1.5 py-2 text-center border-r border-slate-200 text-[11px] text-gray-500">
                      {fmtMin(p.issue_actual_minutes)}
                    </td>
                    {/* Total Minutes */}
                    <td className="px-1.5 py-2 text-center border-r border-orange-200 border-l-2 border-l-[#E95420] font-semibold text-[11px] text-gray-500">
                      {fmtMin(p.total_effective_minutes)}
                    </td>
                    <td className="px-1.5 py-2 text-center font-semibold text-[11px] text-gray-500">
                      {fmtMin(p.total_actual_minutes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
