import { useState, useEffect } from "react";
import { Dialog, DialogContent, Menu, MenuItem } from "@mui/material";
import { toast } from "sonner";
import {
  X,
  CheckSquare,
  AlertCircle,
  ListTodo,
  Plus,
  CheckCircle2,
  Loader2,
  Upload,
  FileText,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BCTaskCreateModal from "@/components/BusinessCompass/BCTaskCreateModal";
import BCIssueCreateModal from "@/components/BusinessCompass/BCIssueCreateModal";
import BCTaskEditModal from "@/components/BusinessCompass/BCTaskEditModal";
import BCIssueEditModal from "@/components/BusinessCompass/BCIssueEditModal";
import BCTodoEditModal from "@/components/BusinessCompass/BCTodoEditModal";
import BCTodoCreateModal from "@/components/BusinessCompass/BCTodoCreateModal";
import TodoDetailsModal from "@/components/TodoDetailsModal";
import { ModalPortal, cleanReportText } from "../utils";
import { useDailyReport } from "../context/DailyReportContext";

const menuSx = {
  "& .MuiPaper-root": {
    borderRadius: "12px",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
    minWidth: "220px",
    overflow: "visible",
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: -8,
      right: 20,
      width: 12,
      height: 12,
      backgroundColor: "#ffffff",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
      boxShadow: "-4px -4px 8px rgba(0, 0, 0, 0.08)",
    },
  },
};

const convertMenuSx = {
  "& .MuiPaper-root": {
    borderRadius: "10px",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
    minWidth: "150px",
    maxWidth: "180px",
    overflowX: "hidden",
    overflowY: "visible",
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: -6,
      right: 20,
      width: 10,
      height: 10,
      backgroundColor: "#ffffff",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
      boxShadow: "-4px -4px 8px rgba(0, 0, 0, 0.08)",
    },
  },
};

const dialogPaperProps = {
  className: "rounded-[16px]",
  sx: {
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
    maxHeight: "90vh",
  },
};

const PauseReasonModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  taskId,
  entityType = "task",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, id: number) => void;
  isLoading: boolean;
  taskId: number | null;
  entityType?: "task" | "issue";
}) => {
  const [reason, setReason] = useState("");
  const label = entityType === "issue" ? "Issue" : "Task";

  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error(
        `Please enter a reason for pausing the ${label.toLowerCase()}`
      );
      return;
    }
    if (taskId !== null) onSubmit(reason, taskId);
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:py-8">
        <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-xl max-h-[calc(100dvh-3rem)] overflow-y-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-[#C72030] rounded-sm"></div>
            <h2 className="text-lg font-bold text-gray-900">
              {`Pause ${label}`}
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {`Please provide a reason for pausing this ${label.toLowerCase()}. This will help track the pause history.`}
          </p>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Enter reason for pausing this ${label.toLowerCase()}...`}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030] focus:ring-opacity-20 resize-none text-sm bg-white"
              rows={4}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-5 py-2.5 bg-[#C72030] text-white font-medium rounded-md hover:bg-[#b01c26] disabled:opacity-50 transition-colors text-sm"
            >
              {isLoading ? "Processing..." : `Pause ${label}`}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

const ConfirmationModal = ({
  icon,
  iconBg,
  iconColor,
  description,
  cancelLabel,
  confirmLabel,
  confirmClass,
  onCancel,
  onConfirm,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmClass: string;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <ModalPortal>
    <div className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:py-8">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl max-h-[calc(100dvh-3rem)] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-10 w-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Are you sure?
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
);

export const Modals = () => {
  const {
    showClosureModal,
    setShowClosureModal,
    closureRemarks,
    setClosureRemarks,
    closureAttachments,
    setClosureAttachments,
    closureItem,
    setClosureItem,
    closureFileInputRef,
    handleClosureFileChange,
    triggerClosureFileUpload,
    isClosureSubmitting,
    handleMarkItemClosed,
    taskIssueMenuAnchor,
    setTaskIssueMenuAnchor,
    setIsFromPlan,
    setIsFromConvert,
    isFromConvert,
    setIsTaskCreateModalOpen,
    setIsIssueCreateModalOpen,
    setIsTodoCreateModalOpen,
    planningMenuAnchor,
    setPlanningMenuAnchor,
    addPlanningItem,
    nextDayLabel,
    setPlanDateResetKey,
    convertMenuAnchor,
    setConvertMenuAnchor,
    convertMenuItem,
    setConvertMenuItem,
    pendingConvertItemRef,
    setConvertTitle,
    isOverdueModalOpen,
    setIsOverdueModalOpen,
    setOverdueItemId,
    overdueReason,
    setOverdueReason,
    isOverdueLoading,
    handleOverdueReasonSubmit,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    selectedTodo,
    isTodoDetailsLoading,
    isTaskCreateModalOpen,
    isIssueCreateModalOpen,
    isTodoCreateModalOpen,
    planDateResetKey,
    isFromPlan,
    convertTitle,
    baseUrl,
    token,
    refetchTasks,
    refetchIssues,
    refetchTodos,
    fetchCompletedItemsForDate,
    completeAccomplishmentConversion,
    startDate,
    isEditTaskModalOpen,
    setIsEditTaskModalOpen,
    editTaskData,
    setEditTaskData,
    isEditIssueModalOpen,
    setIsEditIssueModalOpen,
    editIssueData,
    setEditIssueData,
    isEditTodoModalOpen,
    setIsEditTodoModalOpen,
    editTodoData,
    setEditTodoData,
    pendingReopenItem,
    setPendingReopenItem,
    reopenReason,
    setReopenReason,
    isReopenLoading,
    setIsReopenLoading,
    handleRevertToOpen,
    pendingPlayTaskId,
    setPendingPlayTaskId,
    handlePlayTask,
    pendingPlayIssueId,
    setPendingPlayIssueId,
    handlePlayIssue,
    pendingPauseTaskId,
    setPendingPauseTaskId,
    setPauseTaskId,
    pendingPauseIssueId,
    setPendingPauseIssueId,
    setPauseIssueId,
    isPauseModalOpen,
    setIsPauseModalOpen,
    pauseTaskId,
    pauseIssueId,
    isPauseLoading,
    handlePauseTaskSubmit,
    handlePauseIssueSubmit,
    pendingConfirmAction,
    setPendingConfirmAction,
    getNextWorkingDay,
  } = useDailyReport();

  const closeClosureModal = () => {
    setShowClosureModal(false);
    setClosureRemarks("");
    setClosureAttachments([]);
    setClosureItem(null);
  };

  return (
    <>
      {/* Closure Remarks Modal */}
      <Dialog
        open={showClosureModal}
        onClose={closeClosureModal}
        maxWidth="sm"
        fullWidth
        PaperProps={dialogPaperProps}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              Add Closure Remarks
            </h2>
            <button
              onClick={closeClosureModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {closureItem && (
            <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3">
              <p className="text-xs text-gray-600 font-medium mb-1">
                Closing:
              </p>
              <p className="text-sm font-bold text-[#1a1a1a]">
                {closureItem.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 capitalize">
                {closureItem.type} • {closureItem.status.replace(/_/g, " ")}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1a1a1a]">
              Closure Remarks (Optional)
            </label>
            <textarea
              value={closureRemarks}
              onChange={(e) => setClosureRemarks(e.target.value)}
              placeholder="How was this resolved? What was done to close it?"
              className="w-full h-[120px] p-3 border border-[#e5e7eb] rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1a1a1a]">
              Attach Files (Optional)
            </label>
            <div className="flex items-center justify-between bg-gray-50 border border-[#e5e7eb] rounded-[10px] p-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-green-600">
                  {closureAttachments.length}/5
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  Limits: Images 2MB, Others 5MB
                </p>
              </div>
              <input
                type="file"
                ref={closureFileInputRef}
                onChange={handleClosureFileChange}
                multiple
                className="hidden"
              />
              <Button
                disabled={closureAttachments.length >= 5}
                onClick={triggerClosureFileUpload}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 h-9 rounded-[8px] flex items-center gap-2 text-xs shadow-md transition-all border-none disabled:opacity-50"
              >
                <Upload size={14} />
                File Upload
              </Button>
            </div>
            {closureAttachments.length > 0 && (
              <div className="space-y-2 mt-3">
                {closureAttachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-blue-50/80 p-3 rounded-[10px] border border-blue-100 animate-in fade-in duration-300"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText
                        size={16}
                        className="text-blue-500 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full border-none shrink-0"
                      onClick={() =>
                        setClosureAttachments(
                          closureAttachments.filter(
                            (f) => f.id !== file.id
                          )
                        )
                      }
                    >
                      <X size={14} className="text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              className="flex-1 h-11 border-gray-300 text-gray-700 font-bold text-sm bg-white hover:bg-gray-50 rounded-[8px]"
              onClick={closeClosureModal}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-[8px] flex items-center justify-center gap-2 shadow-md border-none disabled:opacity-50"
              onClick={handleMarkItemClosed}
              disabled={isClosureSubmitting}
            >
              {isClosureSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Closing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Mark Closed
                </>
              )}
            </Button>
          </div>
        </div>
      </Dialog>

      <Menu
        anchorEl={taskIssueMenuAnchor}
        open={Boolean(taskIssueMenuAnchor)}
        onClose={() => setTaskIssueMenuAnchor(null)}
        sx={menuSx}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setTaskIssueMenuAnchor(null);
            setIsFromPlan(false);
            setIsTaskCreateModalOpen(true);
          }}
          sx={{
            py: 1.5,
            px: 2,
            margin: "8px 8px 4px 8px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#f0f4ff",
              transform: "translateX(4px)",
            },
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckSquare size={18} className="text-blue-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-900 text-sm">
                Add Task
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Create a new task
              </span>
            </div>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setTaskIssueMenuAnchor(null);
            setIsFromPlan(false);
            setIsIssueCreateModalOpen(true);
          }}
          sx={{
            py: 1.5,
            px: 2,
            margin: "4px 8px 4px 8px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#fef2f2",
              transform: "translateX(4px)",
            },
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle size={18} className="text-red-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-900 text-sm">
                Add Issue
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Report a problem
              </span>
            </div>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setTaskIssueMenuAnchor(null);
            setIsFromPlan(false);
            setIsTodoCreateModalOpen(true);
          }}
          sx={{
            py: 1.5,
            px: 2,
            margin: "4px 8px 8px 8px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#fef9f0",
              transform: "translateX(4px)",
            },
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-amber-50 rounded-lg">
              <ListTodo size={18} className="text-amber-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-900 text-sm">
                Add Todo
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Create a quick todo
              </span>
            </div>
          </div>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={planningMenuAnchor}
        open={Boolean(planningMenuAnchor)}
        onClose={() => setPlanningMenuAnchor(null)}
        sx={menuSx}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            addPlanningItem();
            setPlanningMenuAnchor(null);
          }}
          sx={{
            py: 1.5,
            px: 2,
            margin: "8px 8px 4px 8px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#f0f4ff",
              transform: "translateX(4px)",
            },
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Plus size={18} className="text-blue-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-900 text-sm">
                Add Note
              </span>
              <span className="text-xs text-gray-500 font-medium">
                For {nextDayLabel || "tomorrow"}
              </span>
            </div>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setPlanningMenuAnchor(null);
            setIsFromPlan(true);
            setPlanDateResetKey((k) => k + 1);
            setIsTaskCreateModalOpen(true);
          }}
          sx={{
            py: 1.5,
            px: 2,
            margin: "8px 8px 4px 8px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#f0f4ff",
              transform: "translateX(4px)",
            },
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckSquare size={18} className="text-blue-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-900 text-sm">
                Add Task
              </span>
              <span className="text-xs text-gray-500 font-medium">
                For {nextDayLabel || "tomorrow"}
              </span>
            </div>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setPlanningMenuAnchor(null);
            setIsFromPlan(true);
            setPlanDateResetKey((k) => k + 1);
            setIsIssueCreateModalOpen(true);
          }}
          sx={{
            py: 1.5,
            px: 2,
            margin: "4px 8px 4px 8px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#fef2f2",
              transform: "translateX(4px)",
            },
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle size={18} className="text-red-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-900 text-sm">
                Add Issue
              </span>
              <span className="text-xs text-gray-500 font-medium">
                For {nextDayLabel || "tomorrow"}
              </span>
            </div>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setPlanningMenuAnchor(null);
            setIsFromPlan(true);
            setPlanDateResetKey((k) => k + 1);
            setIsTodoCreateModalOpen(true);
          }}
          sx={{
            py: 1.5,
            px: 2,
            margin: "4px 8px 8px 8px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#fef9f0",
              transform: "translateX(4px)",
            },
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-amber-50 rounded-lg">
              <ListTodo size={18} className="text-amber-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-gray-900 text-sm">
                Add Todo
              </span>
              <span className="text-xs text-gray-500 font-medium">
                For {nextDayLabel || "tomorrow"}
              </span>
            </div>
          </div>
        </MenuItem>
      </Menu>

      {/* Convert-note menu: turn a manually-typed accomplishment into a real Task/Issue/Todo */}
      <Menu
        anchorEl={convertMenuAnchor}
        open={Boolean(convertMenuAnchor)}
        onClose={() => {
          setConvertMenuAnchor(null);
          setConvertMenuItem(null);
        }}
        sx={convertMenuSx}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            pendingConvertItemRef.current = convertMenuItem;
            setConvertTitle(cleanReportText(convertMenuItem?.text || ""));
            setIsFromConvert(true);
            setPlanDateResetKey((k) => k + 1);
            setIsTaskCreateModalOpen(true);
            setConvertMenuAnchor(null);
            setConvertMenuItem(null);
          }}
          sx={{
            py: 0.75,
            px: 1,
            margin: "6px 6px 2px 6px",
            borderRadius: "8px",
            minHeight: 0,
            "&:hover": {
              backgroundColor: "#f0f4ff",
            },
          }}
        >
          <div className="flex items-center gap-2 w-full">
            <div className="p-1 bg-blue-50 rounded-md shrink-0">
              <CheckSquare size={13} className="text-blue-600" />
            </div>
            <span className="font-semibold text-gray-800 text-xs">
              Task
            </span>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            pendingConvertItemRef.current = convertMenuItem;
            setConvertTitle(cleanReportText(convertMenuItem?.text || ""));
            setIsFromConvert(true);
            setPlanDateResetKey((k) => k + 1);
            setIsIssueCreateModalOpen(true);
            setConvertMenuAnchor(null);
            setConvertMenuItem(null);
          }}
          sx={{
            py: 0.75,
            px: 1,
            margin: "2px 6px",
            borderRadius: "8px",
            minHeight: 0,
            "&:hover": {
              backgroundColor: "#fef2f2",
            },
          }}
        >
          <div className="flex items-center gap-2 w-full">
            <div className="p-1 bg-red-50 rounded-md shrink-0">
              <AlertCircle size={13} className="text-red-600" />
            </div>
            <span className="font-semibold text-gray-800 text-xs">
              Issue
            </span>
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            pendingConvertItemRef.current = convertMenuItem;
            setConvertTitle(cleanReportText(convertMenuItem?.text || ""));
            setIsFromConvert(true);
            setPlanDateResetKey((k) => k + 1);
            setIsTodoCreateModalOpen(true);
            setConvertMenuAnchor(null);
            setConvertMenuItem(null);
          }}
          sx={{
            py: 0.75,
            px: 1,
            margin: "2px 6px 6px 6px",
            borderRadius: "8px",
            minHeight: 0,
            "&:hover": {
              backgroundColor: "#fef9f0",
            },
          }}
        >
          <div className="flex items-center gap-2 w-full">
            <div className="p-1 bg-amber-50 rounded-md shrink-0">
              <ListTodo size={13} className="text-amber-600" />
            </div>
            <span className="font-semibold text-gray-800 text-xs">
              Todo
            </span>
          </div>
        </MenuItem>
      </Menu>

      {/* Overdue Reason Modal */}
      <Dialog
        open={isOverdueModalOpen}
        onClose={() => {
          setIsOverdueModalOpen(false);
          setOverdueItemId(null);
          setOverdueReason("");
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "rounded-[16px]",
          sx: {
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Item is Overdue
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                This item is past its target date. Please provide a reason for
                the delay.
              </p>
            </div>

            <textarea
              value={overdueReason}
              onChange={(e) => setOverdueReason(e.target.value)}
              placeholder="Enter reason for overdue..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA7756]/50 resize-none"
              rows={4}
              disabled={isOverdueLoading}
            />

            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOverdueModalOpen(false);
                  setOverdueItemId(null);
                  setOverdueReason("");
                }}
                disabled={isOverdueLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#DA7756] hover:bg-[#c45f3a] text-white"
                onClick={() => handleOverdueReasonSubmit(overdueReason)}
                disabled={!overdueReason.trim() || isOverdueLoading}
              >
                {isOverdueLoading ? "Submitting..." : "Complete & Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Todo Details Modal */}
      <TodoDetailsModal
        isModalOpen={isDetailsModalOpen}
        setIsModalOpen={setIsDetailsModalOpen}
        todo={selectedTodo}
        isLoading={isTodoDetailsLoading}
        onEditClick={() => {
          setIsDetailsModalOpen(false);
        }}
      />

      {/* Compute next working day for plan modals */}
      {(() => {
        const nextDayStr = getNextWorkingDay(startDate);
        const nextDayDate = new Date(nextDayStr);
        const nextDayObj = {
          year: nextDayDate.getFullYear(),
          month: nextDayDate.getMonth(),
          date: nextDayDate.getDate(),
        };
        const todayDate = new Date(startDate);
        const todayObj = {
          year: todayDate.getFullYear(),
          month: todayDate.getMonth(),
          date: todayDate.getDate(),
        };

        const resetConvertState = () => {
          setIsFromConvert(false);
          setConvertTitle("");
          pendingConvertItemRef.current = null;
        };

        return (
          <>
            <BCTaskCreateModal
              isOpen={isTaskCreateModalOpen}
              onClose={() => {
                setIsFromPlan(false);
                resetConvertState();
                setIsTaskCreateModalOpen(false);
              }}
              onSuccess={() => {
                setIsFromPlan(false);
                refetchTasks();
                refetchIssues();
                refetchTodos();
                fetchCompletedItemsForDate(startDate);
                completeAccomplishmentConversion();
                resetConvertState();
              }}
              baseUrl={baseUrl || ""}
              token={token || ""}
              prefilledDate={
                isFromPlan
                  ? nextDayObj
                  : isFromConvert
                    ? todayObj
                    : undefined
              }
              prefilledTitle={isFromConvert ? convertTitle : undefined}
              dateResetKey={planDateResetKey}
            />
            <BCIssueCreateModal
              isOpen={isIssueCreateModalOpen}
              onClose={() => {
                setIsFromPlan(false);
                resetConvertState();
                setIsIssueCreateModalOpen(false);
              }}
              onSuccess={() => {
                setIsFromPlan(false);
                refetchTasks();
                refetchIssues();
                refetchTodos();
                fetchCompletedItemsForDate(startDate);
                completeAccomplishmentConversion();
                resetConvertState();
              }}
              baseUrl={baseUrl || ""}
              token={token || ""}
              prefilledDate={
                isFromPlan
                  ? nextDayObj
                  : isFromConvert
                    ? todayObj
                    : undefined
              }
              prefilledTitle={isFromConvert ? convertTitle : undefined}
              dateResetKey={planDateResetKey}
            />
            <BCTodoCreateModal
              isOpen={isTodoCreateModalOpen}
              onClose={() => {
                setIsFromPlan(false);
                resetConvertState();
                setIsTodoCreateModalOpen(false);
              }}
              onSuccess={() => {
                setIsFromPlan(false);
                refetchTasks();
                refetchIssues();
                refetchTodos();
                fetchCompletedItemsForDate(startDate);
                completeAccomplishmentConversion();
                resetConvertState();
              }}
              prefilledDate={
                isFromPlan
                  ? nextDayStr
                  : isFromConvert
                    ? startDate
                    : undefined
              }
              prefilledTitle={isFromConvert ? convertTitle : undefined}
              dateResetKey={planDateResetKey}
            />
          </>
        );
      })()}

      {/* Edit Task Modal */}
      <BCTaskEditModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setEditTaskData(null);
        }}
        onSuccess={() => {
          refetchTasks();
          refetchIssues();
          refetchTodos();
          fetchCompletedItemsForDate(startDate);
        }}
        baseUrl={baseUrl || ""}
        token={token || ""}
        editData={editTaskData}
      />

      {/* Edit Issue Modal */}
      <BCIssueEditModal
        isOpen={isEditIssueModalOpen}
        onClose={() => {
          setIsEditIssueModalOpen(false);
          setEditIssueData(null);
        }}
        onSuccess={() => {
          refetchTasks();
          refetchIssues();
          refetchTodos();
          fetchCompletedItemsForDate(startDate);
        }}
        baseUrl={baseUrl || ""}
        token={token || ""}
        editData={editIssueData}
      />

      {/* Edit Todo Modal */}
      <BCTodoEditModal
        isOpen={isEditTodoModalOpen}
        onClose={() => {
          setIsEditTodoModalOpen(false);
          setEditTodoData(null);
        }}
        onSuccess={() => {
          refetchTasks();
          refetchIssues();
          refetchTodos();
          fetchCompletedItemsForDate(startDate);
        }}
        editData={editTodoData}
      />

      {/* Reopen Reason Modal */}
      {pendingReopenItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem] border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#C72030] rounded-sm"></div>
              <h2 className="text-lg font-bold text-gray-900 capitalize">
                Reopen {pendingReopenItem.type}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Please provide a reason for reopening this{" "}
              {pendingReopenItem.type}. This will help track the reopen
              history.
            </p>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Reason
              </label>
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder={`Enter reason for reopening this ${pendingReopenItem.type}...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030] focus:ring-opacity-20 resize-none text-sm bg-white"
                rows={4}
                disabled={isReopenLoading}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setPendingReopenItem(null);
                  setReopenReason("");
                }}
                disabled={isReopenLoading}
                className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                disabled={!reopenReason.trim() || isReopenLoading}
                onClick={async () => {
                  setIsReopenLoading(true);
                  await handleRevertToOpen(pendingReopenItem, reopenReason);
                  setIsReopenLoading(false);
                  setPendingReopenItem(null);
                  setReopenReason("");
                }}
                className="px-5 py-2.5 bg-[#C72030] text-white font-medium rounded-md hover:bg-[#b01c26] disabled:opacity-50 transition-colors text-sm"
              >
                {isReopenLoading ? "Processing..." : "Reopen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Task Confirmation */}
      {pendingPlayTaskId !== null && (
        <ConfirmationModal
          icon={<Play size={18} className="text-green-600" />}
          iconBg="bg-green-100"
          description="This will start the task."
          cancelLabel="Cancel"
          confirmLabel="Start"
          confirmClass="bg-green-600 hover:bg-green-700"
          onCancel={() => setPendingPlayTaskId(null)}
          onConfirm={() => {
            const id = pendingPlayTaskId;
            setPendingPlayTaskId(null);
            handlePlayTask(id);
          }}
        />
      )}

      {/* Start Issue Confirmation */}
      {pendingPlayIssueId !== null && (
        <ConfirmationModal
          icon={<Play size={18} className="text-green-600" />}
          iconBg="bg-green-100"
          description="This will start the issue."
          cancelLabel="Cancel"
          confirmLabel="Start"
          confirmClass="bg-green-600 hover:bg-green-700"
          onCancel={() => setPendingPlayIssueId(null)}
          onConfirm={() => {
            const id = pendingPlayIssueId;
            setPendingPlayIssueId(null);
            handlePlayIssue(id);
          }}
        />
      )}

      {/* Pause Task Confirmation */}
      {pendingPauseTaskId !== null && (
        <ConfirmationModal
          icon={<Pause size={18} className="text-red-500" />}
          iconBg="bg-red-100"
          description="This will pause the task."
          cancelLabel="Cancel"
          confirmLabel="Pause"
          confirmClass="bg-orange-500 hover:bg-orange-600"
          onCancel={() => setPendingPauseTaskId(null)}
          onConfirm={() => {
            const id = pendingPauseTaskId;
            setPendingPauseTaskId(null);
            setPauseTaskId(id);
            setIsPauseModalOpen(true);
          }}
        />
      )}

      {/* Pause Issue Confirmation */}
      {pendingPauseIssueId !== null && (
        <ConfirmationModal
          icon={<Pause size={18} className="text-red-500" />}
          iconBg="bg-red-100"
          description="This will pause the issue."
          cancelLabel="Cancel"
          confirmLabel="Pause"
          confirmClass="bg-orange-500 hover:bg-orange-600"
          onCancel={() => setPendingPauseIssueId(null)}
          onConfirm={() => {
            const id = pendingPauseIssueId;
            setPendingPauseIssueId(null);
            setPauseIssueId(id);
            setIsPauseModalOpen(true);
          }}
        />
      )}

      {/* Pause Reason Modal */}
      <PauseReasonModal
        isOpen={isPauseModalOpen}
        onClose={() => {
          setIsPauseModalOpen(false);
          setPauseTaskId(null);
          setPauseIssueId(null);
        }}
        onSubmit={
          pauseIssueId ? handlePauseIssueSubmit : handlePauseTaskSubmit
        }
        isLoading={isPauseLoading}
        taskId={pauseIssueId || pauseTaskId}
        entityType={pauseIssueId ? "issue" : "task"}
      />

      {/* Confirm Action Modal */}
      {pendingConfirmAction && (
        <ConfirmationModal
          icon={
            <AlertCircle size={20} className="text-amber-600" />
          }
          iconBg="bg-amber-100"
          description={`This will ${pendingConfirmAction.label}.`}
          cancelLabel="Cancel"
          confirmLabel="Confirm"
          confirmClass="bg-[#1a1a1a] hover:bg-[#333]"
          onCancel={() => setPendingConfirmAction(null)}
          onConfirm={() => {
            pendingConfirmAction.fn();
            setPendingConfirmAction(null);
          }}
        />
      )}
    </>
  );
};
