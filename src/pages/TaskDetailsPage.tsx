import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem
} from '@mui/material';
import { userService } from '@/services/userService';
import { taskService, TaskOccurrence } from '@/services/taskService';


// If User type is not imported, define minimally here:
type User = {
  id: number;
  full_name: string;
};

export const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [taskDetails, setTaskDetails] = useState<TaskOccurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showJobSheetModal, setShowJobSheetModal] = useState(false);
  const [jobSheetData, setJobSheetData] = useState<any>(null);
  const [jobSheetLoading, setJobSheetLoading] = useState(false);
  const [jobSheetComments, setJobSheetComments] = useState('');

  // Submit form state
  const [formData, setFormData] = useState({
    isFloorClean: false,
    floorComment: '',
    isDustClean: false,
    dustComment: '',
    isLiftClean: false,
    liftOptions: {
      dust: false,
      dryMop: false,
      wetMop: false,
      vacuum: false
    },
    liftComment: '',
    attachments: null as File | null
  });

  // Reschedule form state
  const [rescheduleData, setRescheduleData] = useState({
    scheduleDate: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
    scheduleTime: '10:30',
    user_ids: [] as number[],
    email: false,
    sms: false
  });

  // File upload state (for attachments in submit form)
  const [attachedFiles, setAttachedFiles] = useState<{
    [key: string]: File | null;
  }>({
    file1: null,
    file2: null,
    file3: null,
    file4: null
  });

  // Menu props for MUI Select
  const selectMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 9999
      }
    },
    disablePortal: true,
    container: document.body
  };

  // Style for fields
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' }
    }
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const details = await taskService.getTaskDetails(id);
        setTaskDetails(details);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load task details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id, toast]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.searchUsers('');
        setUsers(fetchedUsers);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch users'
        });
      }
    };
    fetchUsers();
  }, []);

  // Utility: build start_date as "YYYY-MM-DD HH:mm:ss"
  const getStartDateString = () => {
    if (!rescheduleData.scheduleDate || !rescheduleData.scheduleTime) return '';
    return `${rescheduleData.scheduleDate} ${rescheduleData.scheduleTime}:00`;
  };

  const handleBack = () => navigate('/maintenance/task');
  const handleSubmitTask = () => setShowSubmitForm(true);
  const handleTaskReschedule = () => setShowRescheduleDialog(true);

  const handleJobSheetClick = async () => {
    if (!id) return;
    try {
      setJobSheetLoading(true);
      setShowJobSheetModal(true);
      const jobSheet = await taskService.getJobSheet(id);
      setJobSheetData(jobSheet);
      setJobSheetComments(jobSheet.task_comments || '');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load job sheet',
        variant: 'destructive'
      });
      setShowJobSheetModal(false);
    } finally {
      setJobSheetLoading(false);
    }
  };

  // File upload handler for form
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileKey: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFiles(prev => ({
        ...prev,
        [fileKey]: file
      }));
    }
  };

  // --- Submit Handlers

  const handleSubmitForm = () => {
    // Send to API if needed
    setShowSubmitForm(false);
    toast({
      title: 'Success',
      description: 'Task submitted successfully!'
    });
  };

  const handleRescheduleSubmit = async () => {
    if (
      !rescheduleData.scheduleDate ||
      !rescheduleData.scheduleTime ||
      !rescheduleData.user_ids.length
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        start_date: getStartDateString(),
        user_ids: rescheduleData.user_ids,
        email: rescheduleData.email,
        sms: rescheduleData.sms
      };

      await taskService.rescheduleTask(id!, payload);

      // Refresh task details after successful reschedule
      const updatedDetails = await taskService.getTaskDetails(id!);
      setTaskDetails(updatedDetails);

      setShowRescheduleDialog(false);
      toast({
        title: 'Success',
        description: 'Task rescheduled successfully!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reschedule task. Please try again.',
      });
    }
  };

  const handleJobSheetUpdate = async () => {
    if (!id) return;
    try {
      await taskService.updateTaskComments(id, jobSheetComments);
      setShowJobSheetModal(false);
      toast({
        title: 'Success',
        description: 'Comments updated successfully!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update comments. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // --- UI Helper
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'scheduled':
        return 'bg-green-100 text-green-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // --- UI ---

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!taskDetails) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <p>Task not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 hover:text-[#C72030]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Scheduled Task List</span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Task Details</h1>
            <div className="flex gap-3">
              {taskDetails.task_details.status.value.toLowerCase() === 'closed' && (
                <Button
                  onClick={handleJobSheetClick}
                  style={{
                    backgroundColor: '#C72030'
                  }}
                  className="text-white hover:bg-[#C72030]/90"
                >
                  Job Sheet
                </Button>
              )}
              {/* {taskDetails.actions.can_submit_task && (
                <Button
                  onClick={handleSubmitTask}
                  style={{
                    backgroundColor: '#C72030'
                  }}
                  className="text-white hover:bg-[#C72030]/90"
                >
                  Submit Task
                </Button>
              )} */}
              {taskDetails.actions.can_reschedule && (
                <Button
                  onClick={handleTaskReschedule}
                  style={{
                    backgroundColor: '#C72030'
                  }}
                  className="text-white hover:bg-[#C72030]/90"
                >
                  Task Reschedule
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Task Details Section */}
        <Card className="mb-6">
          <CardHeader className="border-b bg-white">
            <CardTitle
              className="flex items-center gap-2"
              style={{
                color: '#C72030'
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                style={{
                  backgroundColor: '#C72030'
                }}
              >
                T
              </div>
              Task Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">ID</label>
                  <p className="font-medium">
                    {taskDetails.task_details.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Associated With
                  </label>
                  <p className="font-medium">
                    {taskDetails.task_details.associated_with}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Asset/Service Code
                  </label>
                  <p className="font-medium">
                    {taskDetails.task_details.asset_service_code}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Schedule on</label>
                  <p className="font-medium">
                    {taskDetails.task_details.scheduled_on}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Task Duration
                  </label>
                  <p className="font-medium">
                    {taskDetails.task_details.task_duration}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created By</label>
                  <p className="font-medium">
                    {taskDetails.task_details.created_by}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <Badge className={getStatusColor(taskDetails.task_details.status.value)}>
                    {taskDetails.task_details.status.display_name}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Task</label>
                  <p className="font-medium">
                    {taskDetails.task_details.task_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Asset/Service Name
                  </label>
                  <p className="font-medium">
                    {taskDetails.task_details.asset_service_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Supplier</label>
                  <p className="font-medium">
                    {taskDetails.task_details.supplier}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Assigned to</label>
                  <p className="font-medium">
                    {taskDetails.task_details.assigned_to}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created on</label>
                  <p className="font-medium">
                    {taskDetails.task_details.created_on}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p className="font-medium text-sm">
                    {taskDetails.task_details.location.full_location}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Section */}
        <Card>
          <CardHeader className="border-b bg-white">
            <CardTitle
              style={{
                color: '#C72030'
              }}
              className="flex items-center gap-2"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                style={{
                  backgroundColor: '#C72030'
                }}
              >
                A
              </div>
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-gray-50">
                    <th className="p-3 border-b border-r">Help Text</th>
                    <th className="p-3 border-b border-r">Activities</th>
                    <th className="p-3 border-b border-r">Input</th>
                    <th className="p-3 border-b border-r">Comments</th>
                    <th className="p-3 border-b border-r">Weightage</th>
                    <th className="p-3 border-b border-r">Rating</th>
                    <th className="p-3 border-b border-r">Score</th>
                    <th className="p-3 border-b border-r">Status</th>
                    <th className="p-3 border-b">Attachments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50">
                    <td className="p-3 border-b border-r">
                      {taskDetails?.task_details.associated_with}
                    </td>
                    <td className="p-3 border-b border-r">{taskDetails?.task_details.asset_service_name}</td>
                    <td className="p-3 border-b border-r">
                      {taskDetails?.task_details.assigned_to}
                    </td>
                    <td className="p-3 border-b border-r">
                      {taskDetails?.comments.length > 0
                        ? taskDetails.comments[0].comment
                        : 'No comments'}
                    </td>
                    <td className="p-3 border-b border-r">-</td>
                    <td className="p-3 border-b border-r">-</td>
                    <td className="p-3 border-b border-r">
                      {typeof taskDetails?.activity?.total_score === 'object'
                        ? (taskDetails?.activity?.total_score as any)?.score ?? '-'
                        : taskDetails?.activity?.total_score ?? '-'}
                    </td>
                    <td className="p-3 border-b border-r">
                      <span className={`px-2 py-1 rounded text-white ${taskDetails.task_details.status.display_name}`}>
                        {taskDetails.task_details.status.display_name}
                      </span>
                    </td>
                    <td className="p-3 border-b">
                      {taskDetails?.attachments.blob_store_files.length > 0
                        ? 'Has Attachments'
                        : 'No attachments'}
                    </td>
                  </tr>
                </tbody>

              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Task Form Dialog */}
      <Dialog open={showSubmitForm} onOpenChange={setShowSubmitForm}>
        <DialogContent
          className="max-w-4xl max-h-[80vh] overflow-y-auto"
          aria-describedby="submit-task-dialog-description"
        >
          <span id="submit-task-dialog-description" className="sr-only">
            Submit the task with your feedback and task completion details.
          </span>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Test Ladies washroom Checklists
            </DialogTitle>
            <button
              onClick={() => setShowSubmitForm(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          {/* Place your submit form fields here */}
          {/* Example: */}
          <div className="p-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Comment
              </label>
              <TextField
                fullWidth
                multiline
                minRows={2}
                value={formData.floorComment}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    floorComment: e.target.value
                  }))
                }
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </div>
            {/* Add your other fields as required */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSubmitForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitForm}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent
          className="max-w-lg"
          aria-describedby="reschedule-dialog-description"
        >
          <span id="reschedule-dialog-description" className="sr-only">
            Select a new schedule date, time, user, and notification preferences for this task.
          </span>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Task Reschedule</DialogTitle>
            <button
              onClick={() => setShowRescheduleDialog(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
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
                Assign to User
              </h3>
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Assign To</InputLabel>
                <MuiSelect
                  value={
                    rescheduleData.user_ids.length
                      ? String(rescheduleData.user_ids[0])
                      : ''
                  }
                  onChange={e =>
                    setRescheduleData(prev => ({
                      ...prev,
                      user_ids: e.target.value ? [parseInt(e.target.value as string)] : []
                    }))
                  }
                  label="Assign To"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={{
                    ...fieldStyles,
                    '& .MuiSelect-select': {
                      zIndex: 1
                    }
                  }}
                  tabIndex={0}
                >
                  <MenuItem value="">
                    <em>Select User</em>
                  </MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.full_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                Notification Preferences
              </h3>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={rescheduleData.email}
                    onCheckedChange={checked =>
                      setRescheduleData(prev => ({
                        ...prev,
                        email: !!checked
                      }))
                    }
                  />
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Notification
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={rescheduleData.sms}
                    onCheckedChange={checked =>
                      setRescheduleData(prev => ({
                        ...prev,
                        sms: !!checked
                      }))
                    }
                  />
                  <label htmlFor="sms" className="text-sm font-medium">
                    SMS Notification
                  </label>
                </div>
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
                onClick={handleRescheduleSubmit}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90 px-6"
              >
                Reschedule Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Sheet Modal */}
      <Dialog open={showJobSheetModal} onOpenChange={setShowJobSheetModal}>
        <DialogContent
          className="max-w-4xl max-h-[80vh] overflow-y-auto"
          aria-describedby="job-sheet-dialog-description"
        >
          <span id="job-sheet-dialog-description" className="sr-only">
            View and edit job sheet details with comments for the completed task.
          </span>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Job Sheet
            </DialogTitle>
            <button
              onClick={() => setShowJobSheetModal(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          <div className="p-4">
            {jobSheetLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
                <span className="ml-2">Loading job sheet...</span>
              </div>
            ) : jobSheetData ? (
              <div className="space-y-6">
                {/* Job Sheet Header Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Created Date</label>
                      <p className="font-medium">{jobSheetData.created_date || taskDetails?.task_details.created_on}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Job Card No</label>
                      <p className="font-medium">{jobSheetData.job_card_no || taskDetails?.task_details.id}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Scheduled Date</label>
                      <p className="font-medium">{jobSheetData.scheduled_date || taskDetails?.task_details.scheduled_on}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Job ID</label>
                      <p className="font-medium">{jobSheetData.job_id || taskDetails?.task_details.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input type="radio" disabled checked={jobSheetData.type === 'assets' || taskDetails?.task_details.associated_with === 'Assets'} />
                        <label className="text-sm">Assets</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" disabled checked={jobSheetData.type === 'services' || taskDetails?.task_details.associated_with === 'Services'} />
                        <label className="text-sm">Services</label>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Warranty</label>
                        <input type="radio" disabled checked={jobSheetData.warranty === 'yes'} />
                        <label className="text-sm">Yes</label>
                        <input type="radio" disabled checked={jobSheetData.warranty === 'no'} />
                        <label className="text-sm">No</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Breakdown</label>
                        <input type="radio" disabled checked={jobSheetData.breakdown === 'yes'} />
                        <label className="text-sm">Yes</label>
                        <input type="radio" disabled checked={jobSheetData.breakdown === 'no'} />
                        <label className="text-sm">No</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activities Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left bg-gray-50">
                          <th className="p-3 border-b border-r">Help Text</th>
                          <th className="p-3 border-b border-r">Activities</th>
                          <th className="p-3 border-b border-r">Input</th>
                          <th className="p-3 border-b border-r">Comments</th>
                          <th className="p-3 border-b border-r">Weightage</th>
                          <th className="p-3 border-b border-r">Rating</th>
                          <th className="p-3 border-b border-r">Score</th>
                          <th className="p-3 border-b border-r">Status</th>
                          <th className="p-3 border-b">Attachments</th>
                        </tr>
                      </thead>
                       <tbody>
                  <tr className="bg-blue-50">
                    <td className="p-3 border-b border-r">
                      {taskDetails?.task_details.associated_with}
                    </td>
                    <td className="p-3 border-b border-r">{taskDetails?.task_details.asset_service_name}</td>
                    <td className="p-3 border-b border-r">
                      {taskDetails?.task_details.assigned_to}
                    </td>
                    <td className="p-3 border-b border-r">
                      {taskDetails?.comments.length > 0
                        ? taskDetails.comments[0].comment
                        : 'No comments'}
                    </td>
                    <td className="p-3 border-b border-r">-</td>
                    <td className="p-3 border-b border-r">-</td>
                    <td className="p-3 border-b border-r">
                      {typeof taskDetails?.activity?.total_score === 'object'
                        ? (taskDetails?.activity?.total_score as any)?.score ?? '-'
                        : taskDetails?.activity?.total_score ?? '-'}
                    </td>
                    <td className="p-3 border-b border-r">
                      <span className={`px-2 py-1 rounded text-white ${taskDetails.task_details.status.display_name}`}>
                        {taskDetails.task_details.status.display_name}
                      </span>
                    </td>
                    <td className="p-3 border-b">
                      {taskDetails?.attachments.blob_store_files.length > 0
                        ? 'Has Attachments'
                        : 'No attachments'}
                    </td>
                  </tr>
                </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Comments Section */}
                <div>
                  <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                    Additional Comments:
                  </h3>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={jobSheetComments}
                    onChange={(e) => setJobSheetComments(e.target.value)}
                    variant="outlined"
                    placeholder="Enter Comments"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white'
                      }
                    }}
                  />
                  <Button
                    onClick={handleJobSheetUpdate}
                    style={{ backgroundColor: '#22c55e' }}
                    className="text-white hover:bg-green-600"
                  >
                    Update
                  </Button>
                </div>

                {/* Performed By and Supplier */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm text-gray-600">Performed By (Internal/External)</label>
                    <p className="font-medium">{jobSheetData.performed_by || taskDetails?.task_details.performed_by || 'a'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Supplier</label>
                    <p className="font-medium">{jobSheetData.supplier || taskDetails?.task_details.supplier}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No job sheet data available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
