import React, { forwardRef, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  FileText,
  Activity,
  MousePointer2,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import GlassCard from "./GlassCard";
import { TaskStats } from "./types";
import { Dialog, DialogContent, Slide } from "@mui/material";
import ProjectTaskCreateModal from "../ProjectTaskCreateModal";
import { TransitionProps } from "@mui/material/transitions";
import AddToDoModal from "../AddToDoModal";
import UserCalendarWidget from "./UserCalendarWidget";

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
                        ? "bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#fcedeb_100%)] border-[#E67E5F]"
                        : "bg-[#FDFCFB] border-[#F2F0EA]"
                    } ${isLoadingTasks ? "pointer-events-none opacity-80" : ""}`}
                  >
                    {isLoadingTasks && (
                      <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 backdrop-blur-[1px]">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    )}
                    {item.focus && (
                      <span className="absolute top-4 right-4 text-[12px] font-medium bg-white text-gray-900 px-3 py-1 rounded-full z-10 shadow-sm">
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

      {/* RIGHT COLUMN: Calendar Widget with Tasks/Todos */}
      <UserCalendarWidget
        activeTimeView={activeTimeView}
        setActiveTimeView={setActiveTimeView}
        openTaskModal={openTaskModal}
        setOpenTaskModal={setOpenTaskModal}
        openTodoModal={openTodoModal}
        setOpenTodoModal={setOpenTodoModal}
      />

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
