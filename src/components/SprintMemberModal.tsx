import { forwardRef } from "react";
import { Users, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

export const SlideTransition = forwardRef(function SlideTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export interface MemberSummary {
  member_id: number;
  member_name: string;
  email: string;
  department_name?: string;
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

const fmtMin = (m: number) => {
  if (!m) return "\u2014";
  if (m >= 60) return `${(m / 60).toFixed(1)}h`;
  return `${m}m`;
};

const AVATAR_COLORS = [
  "#E95420",
  "#08AEEA",
  "#7BD2B5",
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#EC4899",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

interface SprintMemberModalProps {
  open: boolean;
  onClose: () => void;
  membersSummary: MemberSummary[];
  membersLoading: boolean;
  onFilterTask: (memberId: number, status?: string) => void;
  onFilterIssue: (memberId: number, status?: string) => void;
}

export default function SprintMemberModal({
  open,
  onClose,
  membersSummary,
  membersLoading,
  onFilterTask,
  onFilterIssue,
}: SprintMemberModalProps) {
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
          <Users size={18} className="text-[#E95420]" />
          <span className="text-sm font-medium text-gray-800">
            Sprint Members
          </span>
          {membersSummary.length > 0 && (
            <span className="ml-1 text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
              {membersSummary.length}
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
        {membersLoading ? (
          <div className="flex items-center justify-center h-48 gap-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading members\u2026</span>
          </div>
        ) : membersSummary.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <Users size={36} className="opacity-30" />
            <p className="text-sm">No members found</p>
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
                    style={{ width: 200, maxWidth: 300 }}
                  >
                    Member
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
                {membersSummary.map((m, i) => (
                  <tr
                    key={m.member_id}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-50/70 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                  >
                    {/* Member */}
                    <td
                      className="px-2 py-2 border-r border-slate-100 overflow-hidden"
                      style={{ width: 200, maxWidth: 300 }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center !justify-center text-white text-[11px] font-bold shrink-0 select-none"
                          style={{
                            backgroundColor:
                              AVATAR_COLORS[i % AVATAR_COLORS.length],
                          }}
                        >
                          {getInitials(m.member_name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <p
                              className="text-[13px] font-semibold text-gray-800 truncate min-w-0"
                              title={m.member_name}
                            >
                              {m.member_name}
                            </p>
                            {m.department_name && (
                              <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                {m.department_name}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-[11px] text-gray-400 truncate"
                            title={m.email}
                          >
                            {m.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Tasks */}
                    {(() => {
                      const taskPct =
                        m.total_tasks > 0
                          ? Math.round(
                            (m.completed_tasks / m.total_tasks) * 100
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
                          <td
                            className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200 cursor-pointer hover:bg-blue-50"
                            onClick={() => onFilterTask(m.member_id)}
                          >
                            <span className="text-[13px] font-medium text-blue-600">
                              {m.total_tasks}
                            </span>
                          </td>
                          <td
                            className="px-1.5 py-2 text-center border-r border-slate-300 cursor-pointer hover:bg-blue-50"
                            onClick={() => onFilterTask(m.member_id, "completed")}
                          >
                            <span className="text-[13px] font-semibold text-blue-600">
                              {m.completed_tasks}
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
                        m.total_issues > 0
                          ? Math.round(
                            (m.completed_issues / m.total_issues) * 100
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
                          <td
                            className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200 cursor-pointer hover:bg-blue-50"
                            onClick={() => onFilterIssue(m.member_id)}
                          >
                            <span className="text-[13px] font-medium text-blue-600">
                              {m.total_issues}
                            </span>
                          </td>
                          <td
                            className="px-1.5 py-2 text-center border-r border-slate-300 cursor-pointer hover:bg-blue-50"
                            onClick={() => onFilterIssue(m.member_id, "completed")}
                          >
                            <span className="text-[13px] font-semibold text-blue-600">
                              {m.completed_issues}
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
                      {fmtMin(m.task_effective_minutes)}
                    </td>
                    <td className="px-1.5 py-2 text-center border-r border-slate-200 text-[11px] text-gray-500">
                      {fmtMin(m.task_actual_minutes)}
                    </td>
                    {/* Issue Minutes */}
                    <td className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200 text-[11px] text-gray-500">
                      {fmtMin(m.issue_effective_minutes)}
                    </td>
                    <td className="px-1.5 py-2 text-center border-r border-slate-200 text-[11px] text-gray-500">
                      {fmtMin(m.issue_actual_minutes)}
                    </td>
                    {/* Total Minutes */}
                    <td className="px-1.5 py-2 text-center border-r border-orange-200 border-l-2 border-l-[#E95420] font-semibold text-[11px] text-gray-500">
                      {fmtMin(m.total_effective_minutes)}
                    </td>
                    <td className="px-1.5 py-2 text-center font-semibold text-[11px] text-gray-500">
                      {fmtMin(m.total_actual_minutes)}
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
