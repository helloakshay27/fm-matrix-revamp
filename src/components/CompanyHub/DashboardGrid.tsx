import React, { forwardRef, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  FileText,
  Activity,
  MousePointer2,
  ChevronRight,
  CheckSquare,
  Plus,
  Loader2,
  X,
} from "lucide-react";
import GlassCard from "./GlassCard";
import { TaskStats } from "./types";
import { Dialog, DialogContent, Slide } from "@mui/material";
import ProjectTaskCreateModal from "../ProjectTaskCreateModal";
import { TransitionProps } from "@mui/material/transitions";
import AddToDoModal from "../AddToDoModal";

interface DashboardGridProps {
  taskStats: TaskStats;
  selectedMatrixQuadrant: any;
  setSelectedMatrixQuadrant: (q: any) => void;
  activeTimeView: "hourly" | "weekly" | "monthly";
  setActiveTimeView: (v: "hourly" | "weekly" | "monthly") => void;
  openTaskModal: boolean;
  setOpenTaskModal: (open: boolean) => void;
  handleCloseModal: () => void;
  openTodoModal: boolean;
  setOpenTodoModal: (open: boolean) => void;
  handleCloseTodoModal: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const DashboardGrid: React.FC<DashboardGridProps> = ({
  taskStats,
  selectedMatrixQuadrant,
  setSelectedMatrixQuadrant,
  activeTimeView,
  setActiveTimeView,
  openTaskModal,
  setOpenTaskModal,
  handleCloseModal,
  openTodoModal,
  setOpenTodoModal,
  handleCloseTodoModal,
}) => {
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const handleQuadrantClick = async (item: any) => {
    setIsLoadingTasks(true);
    const priority = item.q.replace("Q", "P"); // Q1 -> 1, Q2 -> 2 etc.

    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      // Call the API to fetch tasks with the corresponding priority
      const response = await axios.get(
        `${protocol}${baseUrl}/todos.json?q[priority_eq]=${priority}&q[responsible_person_id_eq]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedTasks = response.data.todos;

      const formattedTasks = fetchedTasks
        .filter((todo) => todo.status !== "completed")
        .map((t: any) => ({
          id: t.id,
          title: t.title || t.name || "Untitled Task",
          status: t.status,
        }));

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
        tasks: formattedTasks,
      });
    } catch (error) {
      console.error("❌ Matrix task fetch failed:", error);
      // Even if fetch fails, show the section but with empty tasks or an error message
      setSelectedMatrixQuadrant({
        id: item.q,
        title: item.label,
        description: "Failed to load tasks. Please try again.",
        color: item.color,
        focus: !!item.focus,
        tasks: [],
      });
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const refetch = () => {
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-2">
      {/* LEFT COLUMN: TASK PRIORITY MATRIX (Eisenhower) */}
      <div className="lg:col-span-6 flex flex-col">
        <GlassCard className="p-4 !bg-white w-full h-[368px] shadow-sm !border-none !rounded-[24px] flex flex-col transition-all duration-500 overflow-hidden">
          {!selectedMatrixQuadrant ? (
            <div className="animate-fade-in-scale h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-bold text-gray-700 tracking-tight">
                  Todo Priority Matrix
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest">
                    Eisenhower
                  </p>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full h-[270px] mb-2">
                {[
                  {
                    q: "Q1",
                    label: "Important & Urgent",
                    val: taskStats?.dashboard?.p1_count || 0,
                    icon: <AlertCircle className="w-8 h-4" />,
                    color: "#E67E5F",
                  },
                  {
                    q: "Q2",
                    label: "Important not Urgent",
                    val: taskStats?.dashboard?.p2_count || 0,
                    icon: <FileText className="w-4 h-4" />,
                    focus: true,
                    color: "#5D56C1",
                  },
                  {
                    q: "Q3",
                    label: "Not Important Urgent",
                    val: taskStats?.dashboard?.p3_count || 0,
                    icon: <Activity className="w-4 h-4" />,
                    color: "#F59E0B",
                  },
                  {
                    q: "Q4",
                    label: "Not Important not Urgent",
                    val: taskStats?.dashboard?.p4_count || 0,
                    icon: <MousePointer2 className="w-4 h-4" />,
                    color: "#10B981",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleQuadrantClick(item)}
                    className={`rounded-[20px] p-6 border cursor-pointer transition-all flex flex-col items-center justify-center relative overflow-hidden ${
                      item.focus
                        ? "bg-[radial-gradient(235.58%_575.5%_at_50%_50%,_#F6F4EE_0%,_#2C2C2A_100%)] border-[#D9D1BD]"
                        : "bg-[#FDFCFB] border-[#F2F0EA]"
                    } ${isLoadingTasks ? "pointer-events-none opacity-80" : ""}`}
                  >
                    {isLoadingTasks && (
                      <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 backdrop-blur-[1px]">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    )}
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
                  {selectedMatrixQuadrant.tasks.map(
                    (task: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 group">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E67E5F]/40 mt-1.5 shrink-0 transition-transform" />
                        <p className="text-[12px] font-bold text-gray-600 leading-tight transition-colors">
                          {typeof task === "string" ? task : task.title}
                        </p>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* RIGHT COLUMN: TODAY + TASKS/TODO STACK */}
      <div
        className={`lg:col-span-6 flex flex-col gap-3 transition-all ${
          activeTimeView === "monthly" ? "!lg:col-span-12" : ""
        }`}
      >
        {/* Today */}
        <GlassCard
          className={`px-6 py-4 !bg-white/80 backdrop-blur-sm w-full shadow-sm !border-none !rounded-[20px] flex flex-col overflow-hidden transition-all ${
            activeTimeView === "monthly" ? "h-[370px]" : "h-[160px]"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-gray-800 tracking-tight">
              {activeTimeView === "monthly" ? "March 2026" : "Today"}
            </h3>
            <div className="flex items-center gap-0.5 bg-[#F3F0E8] h-8 rounded-[8px] px-1 border border-[#E5DFD0]">
              {["Hourly", "Weekly", "Monthly"].map((v) => (
                <button
                  key={v}
                  onClick={() =>
                    setActiveTimeView(
                      v.toLowerCase() as "hourly" | "weekly" | "monthly"
                    )
                  }
                  className={`px-2.5 h-6 text-[11px] font-semibold rounded-[6px] transition-all ${
                    activeTimeView === v.toLowerCase()
                      ? "bg-white shadow-sm text-gray-900 border border-[#E5DFD0]"
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
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                    (d) => (
                      <span
                        key={d}
                        className="text-[9px] font-black text-gray-400 opacity-60 px-1"
                      >
                        {d}
                      </span>
                    )
                  )}
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
                    title:
                      "Runwal Client Meeting - Out of office for whole day",
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
            <div className="grid grid-cols-10 gap-2 flex-1 mt-1 w-full">
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
                  className="flex flex-col items-center gap-1.5 group cursor-pointer min-w-0"
                >
                  <p
                    className={`text-[10px] font-semibold tracking-tight transition-colors truncate w-full text-center ${
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
                    className={`w-[50px] h-[60px] rounded-[10px] border flex items-center justify-center text-[10px] font-semibold transition-all p-1 text-center leading-tight overflow-hidden ${
                      item.active
                        ? activeTimeView === "weekly"
                          ? "bg-red-50/50 border-red-400 text-red-500 shadow-sm"
                          : "bg-[#FFF8F5] border-[#E67E5F] text-[#E67E5F] shadow-sm"
                        : item.off
                          ? "bg-orange-50/50 border-orange-200 text-[#E67E5F]"
                          : "bg-[#FAF9F6] border-[#E8E4D9] text-gray-400"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
            {/* Tasks Column */}
            <GlassCard className="px-4 pt-3 pb-5 h-[196px] w-full !bg-white shadow-sm !border-none !rounded-[20px] flex flex-col transition-all duration-500">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-bold text-gray-800 tracking-tight">
                  Tasks
                </h3>
                <button
                  onClick={() => setOpenTaskModal(true)}
                  className="bg-[#DA7756] text-white px-4 h-8 rounded-[8px] text-[12px] font-semibold transition-all hover:bg-[#c96a44] active:scale-95 whitespace-nowrap"
                >
                  + Create Task
                </button>
              </div>
              <div className="relative flex-1 overflow-y-auto scrollbar-none pr-1 mt-1">
                <div className="relative w-full">
                  {/* Timeline Background Grid */}
                  {["9 AM", "10 AM", "11 AM", "12 AM"].map((time, idx) => (
                    <div key={idx} className="flex h-[34px] w-full relative">
                      <span className="w-[36px] text-[9px] font-medium text-gray-400 shrink-0 leading-none mt-1">
                        {time}
                      </span>
                      <div className="flex-1 border-t border-[#E8E1D3] mt-[6px]" />
                    </div>
                  ))}

                  {/* Absolute Tasks Overlay */}
                  <div className="absolute top-0 left-[40px] right-2 bottom-0">
                    {/* Task 1: 9 AM */}
                    <div className="absolute top-[0px] left-0 right-0 h-[22px] bg-[#FAF8F2]/90 backdrop-blur-sm border border-[#D5CDBC] rounded-[4px] px-2 flex items-center shadow-sm z-10 hover:shadow-md transition-all cursor-pointer">
                      <span className="text-[10px] font-semibold text-gray-700 truncate">
                        Team standup meeting
                      </span>
                    </div>
                    {/* Task 2: 10 AM - 11:45 AM */}
                    <div className="absolute top-[34px] left-0 right-0 h-[58px] bg-[#FAF8F2]/90 backdrop-blur-sm border border-[#D5CDBC] rounded-[4px] p-2 flex flex-col shadow-sm z-10 hover:shadow-md transition-all cursor-pointer">
                      <span className="text-[10px] font-semibold text-gray-700 truncate">
                        Client presentation prep
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="px-5 pt-4 pb-5 h-[196px] w-full !bg-white shadow-sm !border-none !rounded-[20px] flex flex-col transition-all duration-500">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-bold text-gray-800 tracking-tight">
                  To-Do
                </h3>
                <button
                  onClick={() => setOpenTodoModal(true)}
                  className="bg-[#DA7756] text-white px-4 h-8 rounded-[8px] text-[12px] font-semibold transition-all hover:bg-[#c96a44] active:scale-95 whitespace-nowrap"
                >
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
                    className="flex items-center gap-3 bg-white border border-[#ECE6DA] px-3 h-[34px] rounded-[8px] shadow-sm transition-all group cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-all ${
                        todo.d
                          ? "bg-[#FFF6F2] border-[#DA7756]"
                          : "border-gray-300 group-hover:border-[#DA7756]"
                      }`}
                    >
                      {todo.d ? (
                        <CheckSquare
                          className="w-2.5 h-2.5 text-[#DA7756]"
                          strokeWidth={3}
                        />
                      ) : (
                        <Plus className="w-3 h-3 text-gray-200 group-hover:text-[#DA7756] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-medium truncate ${
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

      <Dialog
        open={openTaskModal}
        onClose={handleCloseModal}
        TransitionComponent={Transition}
        maxWidth={false}
      >
        <DialogContent
          className="w-1/2 fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto"
          style={{
            margin: 0,
            maxHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
          sx={{
            padding: "0 !important",
            "& .MuiDialogContent-root": {
              padding: "0 !important",
              overflow: "auto",
            },
          }}
        >
          <div className="sticky top-0 bg-white z-10">
            <h3 className="text-[14px] font-medium text-center mt-8">
              Add Tasks
            </h3>
            <X
              className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
              onClick={handleCloseModal}
            />
            <hr className="border border-[#E95420] mt-4" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <ProjectTaskCreateModal
              isEdit={false}
              onCloseModal={handleCloseModal}
            />
          </div>
        </DialogContent>
      </Dialog>

      {openTodoModal && (
        <AddToDoModal
          isModalOpen={openTodoModal}
          setIsModalOpen={handleCloseTodoModal}
          getTodos={refetch}
          editingTodo={{}}
          isEditMode={false}
        />
      )}
    </div>
  );
};

export default DashboardGrid;
