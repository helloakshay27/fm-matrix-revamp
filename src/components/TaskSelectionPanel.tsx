import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  Play,
  CheckCircle,
  Download,
  Loader2,
  RotateCcw,
  Settings,
} from "lucide-react";
import { BASE_URL, getAuthHeader } from "@/config/apiConfig";
import { useToast } from "@/hooks/use-toast";
import { bulkTaskService } from "@/services/bulkTaskService";
import { userService, User } from "@/services/userService";
import { toast as sonnerToast } from "sonner";

interface Task {
  id: string;
  checklist: string;
}

interface TaskSelectionPanelProps {
  selectedCount: number;
  selectedTasks: Task[];
  onSubmit: () => void;
  onReassign: () => void;
  onReschedule: () => void;
  onClearSelection: () => void;
  onRefreshData?: () => void; // Optional callback to refresh parent data
}

export const TaskSelectionPanel: React.FC<TaskSelectionPanelProps> = ({
  selectedCount,
  selectedTasks,
  onSubmit,
  onReassign,
  onReschedule,
  onClearSelection,
  onRefreshData,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { toast } = useToast();

  // Reschedule form state
  const [rescheduleData, setRescheduleData] = useState({
    scheduleDate: new Date().toISOString().split('T')[0],
    scheduleTime: '10:30',
    email: false,
  });

  // Reassign form state
  const [reassignData, setReassignData] = useState({
    assignedUserId: '',
  });

  // Field styles for MUI components (exact same as TaskFilterDialog)
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  // Menu props for MUI Select (exact same as TaskFilterDialog)
  const selectMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 9999,
      },
    },
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
  };

  const handleClearClick = () => {
    console.log("X button clicked - clearing selection");
    onClearSelection();
  };

  const handleExport = async () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const params = {
        q: {
          id_in: selectedTasks.map((task) => task.id),
        },
      };

      const urlParams = new URLSearchParams();
      params.q.id_in.forEach((id) => {
        urlParams.append("q[id_in][]", id);
      });

      const url = `${BASE_URL}/pms/users/scheduled_tasks.xlsx?${urlParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Export failed: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      // Create and trigger download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "scheduled_tasks_report.xlsx";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Export successful",
        description: "Tasks data has been exported successfully.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to export tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getDisplayText = () => {
    if (selectedTasks.length === 0) return "";
    if (selectedTasks.length === 1) return selectedTasks[0].checklist;
    if (showAll) {
      return selectedTasks.map((task) => task.checklist).join(", ");
    }
    if (selectedTasks.length <= 6) {
      return selectedTasks.map((task) => task.checklist).join(", ");
    }
    return (
      <>
        {selectedTasks
          .slice(0, 6)
          .map((task) => task.checklist)
          .join(", ")}{" "}
        and{" "}
        <button
          onClick={() => setShowAll(true)}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {selectedTasks.length - 6} more
        </button>
      </>
    );
  };

  // Load users when component mounts (same as TaskFilterDialog)
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const fetchedUsers = await userService.searchUsers('');
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        toast({
          title: "Error",
          description: "Failed to load users for reassignment",
          variant: "destructive"
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const handleBulkReschedule = async () => {
    if (!rescheduleData.scheduleDate || !rescheduleData.scheduleTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const loadingToastId = sonnerToast.loading("Rescheduling tasks...", {
      duration: Infinity,
    });

    try {
      // Convert date and time to ISO format
      const dateTimeString = `${rescheduleData.scheduleDate}T${rescheduleData.scheduleTime}:00Z`;
      
      const payload = {
        task_occurrence_ids: selectedTasks.map(task => parseInt(task.id)),
        start_date: dateTimeString,
        email: rescheduleData.email,
      };

      await bulkTaskService.bulkReschedule(payload);

      sonnerToast.dismiss(loadingToastId);
      sonnerToast.success(`Successfully rescheduled ${selectedTasks.length} task(s)`);
      
      setShowRescheduleDialog(false);
      onClearSelection();
      
      // Refresh parent data to reflect changes
      if (onRefreshData) {
        onRefreshData();
      }
      
      // Reset form
      setRescheduleData({
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleTime: '10:30',
        email: false,
      });
    } catch (error) {
      console.error('Bulk reschedule failed:', error);
      sonnerToast.dismiss(loadingToastId);
      sonnerToast.error(error instanceof Error ? error.message : "Failed to reschedule tasks");
    }
  };

  const handleBulkReassign = async () => {
    if (!reassignData.assignedUserId) {
      toast({
        title: "Error",
        description: "Please select a user to reassign tasks to",
        variant: "destructive"
      });
      return;
    }

    const loadingToastId = sonnerToast.loading("Reassigning tasks...", {
      duration: Infinity,
    });

    try {
      const payload = {
        task_occurrence_ids: selectedTasks.map(task => parseInt(task.id)),
        backup_assigned_to_id: parseInt(reassignData.assignedUserId),
      };

      await bulkTaskService.bulkReassign(payload);

      sonnerToast.dismiss(loadingToastId);
      sonnerToast.success(`Successfully reassigned ${selectedTasks.length} task(s)`);
      
      setShowReassignDialog(false);
      onClearSelection();
      
      // Refresh parent data to reflect changes
      if (onRefreshData) {
        onRefreshData();
      }
      
      // Reset form
      setReassignData({
        assignedUserId: '',
      });
    } catch (error) {
      console.error('Bulk reassign failed:', error);
      sonnerToast.dismiss(loadingToastId);
      sonnerToast.error(error instanceof Error ? error.message : "Failed to reassign tasks");
    }
  };

  const handleRescheduleClick = () => {
    setShowRescheduleDialog(true);
  };

  const handleReassignClick = () => {
    setShowReassignDialog(true);
  };

  return (
    <>
      <div
        className="fixed bg-white border border-gray-200 rounded-sm shadow-lg z-50"
        style={{ top: "50%", left: "30%", width: "703px", height: "105px" }}
      >
        <div className="flex items-center justify-between w-full h-full pr-6">
          <div className="flex items-center gap-2">
            <div className="text-[#C72030] bg-[#C4B89D] rounded-lg w-[44px] h-[105px] flex items-center justify-center text-xs font-bold">
              {selectedCount}
            </div>
            <div className="flex flex-col justify-center px-3 py-2 flex-1">
              <span className="text-[16px] font-semibold text-[#1A1A1A] whitespace-nowrap leading-none">
                Selection
              </span>
              <span className="text-[12px] font-medium text-[#6B7280] break-words leading-tight">
                {getDisplayText()}
              </span>
            </div>
          </div>

          <div className="flex items-center ml-5">
          

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReassignClick}
              className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5"
            >
              <svg
                className="w-6 h-6 mt-4 mb-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V8L16 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3V8H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18V12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 15L12 12L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-medium">Reassign</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRescheduleClick}
              className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5"
            >
              <svg
                className="w-6 h-6 mt-4 mb-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-medium">Reschedule</span>
            </Button>

        

            <div className="w-px h-8 bg-gray-300 mr-5"></div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearClick}
              className="text-gray-600 hover:bg-gray-100"
              style={{ width: "44px", height: "44px" }}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog} modal={false}>
        <DialogContent className="max-w-lg bg-white z-50">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Bulk Reschedule Tasks
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              Reschedule {selectedTasks.length} selected task(s)
            </p>
          </DialogHeader>

          <div className="space-y-6 p-4">
            <div>
              <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                New Schedule
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Schedule Date"
                  type="date"
                  value={rescheduleData.scheduleDate}
                  onChange={e =>
                    setRescheduleData(prev => ({
                      ...prev,
                      scheduleDate: e.target.value
                    }))
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                  required
                />
                <TextField
                  label="Time"
                  type="time"
                  value={rescheduleData.scheduleTime}
                  onChange={e =>
                    setRescheduleData(prev => ({
                      ...prev,
                      scheduleTime: e.target.value
                    }))
                  }
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                Notification Preferences
              </h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-bulk"
                  checked={rescheduleData.email}
                  onCheckedChange={checked =>
                    setRescheduleData(prev => ({
                      ...prev,
                      email: !!checked
                    }))
                  }
                />
                <label htmlFor="email-bulk" className="text-sm font-medium">
                  Email Notification
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowRescheduleDialog(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkReschedule}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90 px-6"
              >
                Reschedule Tasks
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Reassign Dialog */}
      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog} modal={false}>
        <DialogContent className="max-w-lg bg-white z-50">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Bulk Reassign Tasks
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              Reassign {selectedTasks.length} selected task(s)
            </p>
          </DialogHeader>

          <div className="space-y-6 p-4">
            <div>
              <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                Reassign To
              </h3>
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Assigned To</InputLabel>
                <MuiSelect
                  value={reassignData.assignedUserId}
                  onChange={(e) =>
                    setReassignData(prev => ({
                      ...prev,
                      assignedUserId: e.target.value
                    }))
                  }
                  label="Assigned To"
                  displayEmpty
                  disabled={loadingUsers}
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select User</em>
                  </MenuItem>
                  {loadingUsers ? (
                    <MenuItem disabled>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading users...
                      </div>
                    </MenuItem>
                  ) : (
                    users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.full_name}
                      </MenuItem>
                    ))
                  )}
                </MuiSelect>
              </FormControl>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowReassignDialog(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkReassign}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90 px-6"
                disabled={!reassignData.assignedUserId || loadingUsers}
              >
                Reassign Tasks
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
