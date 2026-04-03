import React from "react";
import {
  AlertCircle,
  FileText,
  Activity,
  MousePointer2,
  ChevronRight,
  CheckSquare,
  Plus,
} from "lucide-react";
import GlassCard from "./GlassCard";
import { TaskStats } from "./types";

interface DashboardGridProps {
  taskStats: TaskStats;
  selectedMatrixQuadrant: any;
  setSelectedMatrixQuadrant: (q: any) => void;
  activeTimeView: "hourly" | "weekly" | "monthly";
  setActiveTimeView: (v: "hourly" | "weekly" | "monthly") => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  taskStats,
  selectedMatrixQuadrant,
  setSelectedMatrixQuadrant,
  activeTimeView,
  setActiveTimeView,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-2">
      {/* LEFT COLUMN: TASK PRIORITY MATRIX (Eisenhower) */}
      <div className="lg:col-span-6 flex flex-col">
        <GlassCard className="p-4 !bg-white w-full h-[335px] shadow-sm !border-none !rounded-[24px] flex flex-col transition-all duration-500 overflow-hidden">
          {!selectedMatrixQuadrant ? (
            <div className="animate-fade-in-scale h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-bold text-gray-700 tracking-tight">
                  Task Priority Matrix
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest">
                    Eisenhower
                  </p>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full h-[240px]">
                {[
                  {
                    q: "Q1",
                    label: "Important & Urgent",
                    val: taskStats.overdue_tasks || 8,
                    icon: <AlertCircle className="w-8 h-4" />,
                    color: "#E67E5F",
                  },
                  {
                    q: "Q2",
                    label: "Important not Urgent",
                    val: taskStats.open_tasks || 12,
                    icon: <FileText className="w-4 h-4" />,
                    focus: true,
                    color: "#5D56C1",
                  },
                  {
                    q: "Q3",
                    label: "Not Important Urgent",
                    val: taskStats.todo_count || 5,
                    icon: <Activity className="w-4 h-4" />,
                    color: "#F59E0B",
                  },
                  {
                    q: "Q4",
                    label: "Not Important not Urgent",
                    val: taskStats.on_hold_tasks || 3,
                    icon: <MousePointer2 className="w-4 h-4" />,
                    color: "#10B981",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setSelectedMatrixQuadrant({
                        id: item.q,
                        title: item.label,
                        description:
                          item.q === "Q1"
                            ? "High Priority: Do it now"
                            : item.q === "Q2"
                            ? "Strategic Focus: Schedule it"
                            : item.q === "Q3"
                            ? "Short-term Action: Delegate it"
                            : "Lower Priority: Review/Delegate",
                        color: item.color,
                        focus: !!item.focus,
                        tasks:
                          item.q === "Q1"
                            ? [
                                "Finalize Quarterly Budget - 10:00 AM",
                                "Client Crisis Call (Runwal) - 2:30 PM",
                                "HR Compliance Audit - 4:00 PM",
                                "Submit Monthly Tax Returns - 5:00 PM",
                                "Server Maintenance Alert - Immediate",
                                "Sign Vendor Contracts - Today",
                                "Prepare AGM Slides - Today",
                                "Resolve Customer Refund Case",
                              ]
                            : item.q === "Q2"
                            ? [
                                "Schedule quarterly strategic planning session",
                                "Design team skill development program",
                                "Research process improvement methodologies",
                                "Build relationships with key stakeholders",
                                "Create long-term product roadmap",
                                "Develop succession planning strategy",
                                "Review and update company policies",
                                "Plan team building activities",
                                "Conduct market research for new opportunities",
                                "Document best practices and workflows",
                                "Invest in professional development courses",
                                "Design customer feedback collection system",
                              ]
                            : item.q === "Q3"
                            ? [
                                "Format Internal Memos",
                                "Schedule Minor Logistics",
                                "Respond to Routine Emails",
                                "Update Office Inventory",
                                "Coordinate Printing Samples",
                              ]
                            : [
                                "Review Outdated HR Policies",
                                "Archive 2024 Audit Logs",
                                "Update Internal Wiki Fonts",
                              ],
                      })
                    }
                    className={`rounded-[20px] p-6 border cursor-pointer transition-all flex flex-col items-center justify-center relative overflow-hidden ${
                      item.focus
                        ? "bg-[radial-gradient(235.58%_575.5%_at_50%_50%,_#F6F4EE_0%,_#2C2C2A_100%)] border-[#D9D1BD]"
                        : "bg-[#FDFCFB] border-[#F2F0EA]"
                    }`}
                  >
                    {item.focus && (
                      <span className="absolute top-4 right-4 text-[9px] font-black bg-[#C6C0F3] text-[#5D56C1] px-2 py-0.5 rounded-full z-10 uppercase tracking-widest shadow-sm">
                        Focus
                      </span>
                    )}
                    <div className="flex flex-col items-center flex-1 justify-center py-2 text-center">
                      <span className="text-[12px] font-medium text-[rgba(106,114,130,1)] uppercase tracking-[0.1em] mb-1">
                        {item.q}
                      </span>
                      <p className="text-3xl font-black text-gray-800 tracking-tighter">
                        {item.val}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 tracking-tight mt-auto w-full justify-center opacity-60">
                      <span className="shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col origin-bottom-right animate-matrix-expand">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedMatrixQuadrant(null)}
                  className="flex items-center gap-2 text-[13px] font-bold text-gray-800 hover:text-[#E67E5F] transition-colors"
                >
                  <ChevronRight
                    className="w-4 h-4 rotate-180"
                    strokeWidth={3}
                  />
                  Back
                </button>
                {selectedMatrixQuadrant.focus && (
                  <span className="bg-[#E6E0F1] text-[#5D56C1] px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest opacity-80 uppercase">
                    Focus
                  </span>
                )}
              </div>
              <h2 className="text-[15px] font-black text-gray-900 tracking-tight mb-4 px-1">
                {selectedMatrixQuadrant.id} - {selectedMatrixQuadrant.title}
              </h2>
              <div className="flex-1 bg-[#FAF9F6] border border-[#E8E4D9] rounded-[20px] p-5 overflow-y-auto scrollbar-none shadow-inner">
                <ul className="space-y-3">
                  {selectedMatrixQuadrant.tasks.map((task: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E67E5F]/40 mt-1.5 shrink-0 transition-transform" />
                      <p className="text-[12px] font-bold text-gray-600 leading-tight transition-colors">
                        {typeof task === "string" ? task : task.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* RIGHT COLUMN: TODAY + TASKS/TODO STACK */}
      <div
        className={`lg:col-span-6 flex flex-col gap-8 transition-all ${
          activeTimeView === "monthly" ? "!lg:col-span-12" : ""
        }`}
      >
        {/* Today */}
        <GlassCard
          className={`px-5 ${
            activeTimeView === "monthly" ? "py-4" : "py-3"
          } !bg-white/80 backdrop-blur-sm w-full shadow-sm !border-none !rounded-[24px] flex flex-col overflow-hidden transition-all ${
            activeTimeView === "monthly" ? "h-[335px]" : "h-[155px]"
          }`}
        >
          <div
            className={`flex items-center justify-between ${
              activeTimeView === "monthly" ? "mb-2" : "mb-1"
            } px-1`}
          >
            <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">
              {activeTimeView === "monthly" ? "March 2026" : "Today"}
            </h3>
            <div className="flex gap-1 bg-[#F1F0EA]/50 h-7 backdrop-blur-md rounded-[12px] p-0.2 border border-white/20">
              {["Hourly", "Weekly", "Monthly"].map((v) => (
                <button
                  key={v}
                  onClick={() =>
                    setActiveTimeView(
                      v.toLowerCase() as "hourly" | "weekly" | "monthly"
                    )
                  }
                  className={`px-4 py-1.5 text-[11px] font-bold rounded-[8px] transition-all ${
                    activeTimeView === v.toLowerCase()
                      ? "bg-white/80 shadow-sm text-gray-900 backdrop-blur-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {v} View
                </button>
              ))}
            </div>
          </div>

          {activeTimeView === "monthly" ? (
            <div className="flex gap-4 flex-1 mt-4 overflow-hidden">
              {/* Calendar Grid */}
              <div className="flex-1 rounded-xl p-1 h-full overflow-hidden">
                <div className="grid grid-cols-7 gap-1 text-center mb-3">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                    <span
                      key={d}
                      className="text-[9px] font-black text-gray-400 opacity-60 px-1"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1 gap-x-1.5 h-full auto-rows-max">
                  {/* Empty cells for February end */}
                  {[...Array(6)].map((_, i) => (
                    <div key={`empty-${i}`} className="h-6" />
                  ))}
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    let statusClass =
                      "bg-[#FAF9F6]/80 border-[#E8E4D9] text-gray-500";
                    const textClass = "text-[10px] font-bold";
                    if (day === 12)
                      statusClass =
                        "bg-[#FDFCFB]/90 border-orange-200 text-orange-500 shadow-sm";
                    if (day === 19)
                      statusClass =
                        "bg-red-50/50 border-red-500 text-red-500 shadow-sm relative";
                    if (day === 21)
                      statusClass =
                        "bg-blue-50/50 border-blue-400 text-blue-500 shadow-sm";
                    if (day === 24 || day === 25)
                      statusClass =
                        "bg-red-50/30 border-red-200 text-red-400 shadow-sm";

                    return (
                      <div
                        key={day}
                        className={`aspect-square h-8 w-8 flex flex-col items-center justify-center rounded-[10px] border transition-all cursor-pointer ${statusClass}`}
                      >
                        <span className={textClass}>{day}</span>
                        {day === 19 && (
                          <span className="text-[6px] font-black mt-[-1px] uppercase opacity-80">
                            Today
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Event Details Sidebar */}
              <div className="w-[260px] bg-[#F9F7F2]/60 rounded-xl p-3 flex flex-col gap-2.5 border border-[#E8E4D9]/40 overflow-y-auto scrollbar-none">
                {[
                  {
                    title: "Schedule quarterly strategic planning session",
                    time: "21st March 2026 3 PM",
                    dot: "bg-blue-500",
                  },
                  {
                    title: "Client presentation prep for Runwal",
                    time: "24th March 2026 2 PM",
                    dot: "bg-red-400",
                  },
                  {
                    title: "Runwal Client Meeting - Out of office for whole day",
                    time: "25th March 2026",
                    dot: "bg-red-400",
                  },
                ].map((ev, i) => (
                  <div
                    key={i}
                    className="bg-white/90 border border-[#E8E4D9]/50 p-3 rounded-[12px] shadow-sm transition-all"
                  >
                    <div className="flex gap-2 mb-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${ev.dot}`}
                      />
                      <h4 className="text-[11px] font-black text-gray-800 leading-tight">
                        {ev.title}
                      </h4>
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 italic pl-3.5 uppercase tracking-tight">
                      {ev.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 justify-between items-start flex-1 mt-2">
              {(activeTimeView === "hourly"
                ? [
                    { t: "12 PM", tasks: 0 },
                    { t: "1 PM", tasks: 1 },
                    { t: "2 PM", tasks: 0 },
                    { t: "3 PM", tasks: 0 },
                    { t: "4 PM", tasks: 3, active: true },
                    { t: "5 PM", tasks: 0 },
                    { t: "6 PM", tasks: 1 },
                    { t: "7 PM", tasks: 0 },
                    { t: "8 PM", tasks: 0 },
                    { t: "9 PM", tasks: 0 },
                  ]
                : [
                    { t: "Tues", v: "—" },
                    { t: "Wed", v: "1 task" },
                    { t: "Thurs", v: "3 tasks", active: true },
                    { t: "Fri", v: "—" },
                    { t: "Sat", v: "Weekly Off", off: true },
                    { t: "Sun", v: "Weekly Off", off: true },
                    { t: "Mon", v: "—" },
                    { t: "Tues", v: "1 task" },
                    { t: "Wed", v: "—" },
                    { t: "Thurs", v: "—" },
                  ]
              ).map((item: any, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <p
                    className={`text-[10px] font-bold tracking-tight transition-colors ${
                      item.active
                        ? activeTimeView === "weekly"
                          ? "text-red-500"
                          : "text-[#E67E5F]"
                        : item.off
                        ? "text-[#E67E5F]"
                        : "text-gray-400"
                    }`}
                  >
                    {item.t}
                  </p>
                  <div
                    className={`w-full max-w-[62px] h-[75px] rounded-[14px] border flex items-center justify-center text-[9px] font-bold transition-all p-1 text-center leading-tight ${
                      item.active
                        ? activeTimeView === "weekly"
                          ? "bg-red-50/50 border-red-500 text-red-500 shadow-sm"
                          : "bg-[#FDFCFB]/90 border-[#E67E5F] text-[#E67E5F] shadow-sm"
                        : item.off
                        ? "bg-orange-50/50 border-orange-200 text-[#E67E5F]"
                        : "bg-[#FAF9F6]/80 border-[#E8E4D9] text-gray-400"
                    }`}
                  >
                    {item.v ||
                      (item.tasks > 0
                        ? `${item.tasks} task${item.tasks > 1 ? "s" : ""}`
                        : "—")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Tasks & To-Do Grid */}
        {activeTimeView !== "monthly" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            {/* Tasks Column */}
            <GlassCard className="px-5 pt-3 pb-5 h-[150px] w-full !bg-white shadow-sm !border-none !rounded-[24px] flex flex-col hover:shadow-xl transition-all duration-500">
              <div className="flex items-start justify-between mb-1.5 px-1">
                <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
                  Tasks
                </h3>
                <button className="bg-[#E67E5F] text-white px-4 py-1 rounded-[12px] text-[8px] font-bold transition-all shadow-lg shadow-orange-500/10 active:scale-95">
                  + Create Task
                </button>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto scrollbar-none pr-1">
                {[
                  { l: "Team standup meeting", t: "9:00 AM - 0.5h" },
                  { l: "Client Presentation Prep", t: "10:00 AM - 2h" },
                  { l: "Code Review Session", t: "2:00 PM - 1.5h" },
                ].map((task, i) => (
                  <div
                    key={i}
                    className="bg-[#FAF9F7] border border-[#E8E4D9] p-2.5 rounded-[12px] shadow-sm transition-all cursor-pointer group"
                  >
                    <h4 className="text-[10px] font-bold text-gray-700 leading-tight">
                      {task.l}
                    </h4>
                    <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tight">
                      {task.t}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="px-5 pt-3 pb-5 h-[150px] w-full !bg-white shadow-sm !border-none !rounded-[24px] flex flex-col hover:shadow-xl transition-all duration-500">
              <div className="flex items-start justify-between mb-1.5 px-1">
                <h3 className="text-[12px] font-bold text-gray-700 tracking-tight">
                  To-Do
                </h3>
                <button className="bg-[#E67E5F] text-white px-4 py-1 rounded-[12px] text-[8px] font-bold transition-all shadow-lg shadow-orange-500/10 active:scale-95">
                  + Create To-do
                </button>
              </div>
              <div className="space-y-1.5 flex-1 overflow-y-auto scrollbar-none pr-1">
                {[
                  { l: "Review design mockups", d: false },
                  { l: "Team standup meeting", d: true },
                  { l: "Review OSR-flow", d: true },
                ].map((todo, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white border border-gray-100/30 p-2 rounded-[10px] shadow-sm transition-all group cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${
                        todo.d
                          ? "bg-[#E67E5F] border-[#E67E5F]"
                          : "border-gray-200 group-hover:border-[#E67E5F]"
                      }`}
                    >
                      {todo.d ? (
                        <CheckSquare
                          className="w-2 h-2 text-white"
                          strokeWidth={3}
                        />
                      ) : (
                        <Plus className="w-3 h-3 text-gray-200 group-hover:text-[#E67E5F] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-semibold truncate ${
                        todo.d ? "text-gray-400 line-through" : "text-gray-700"
                      }`}
                    >
                      {todo.l}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardGrid;
