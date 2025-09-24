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
import { JobSheetModal } from '@/components/JobSheetModal';




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
    email: false
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
        const response = await taskService.getTaskDetails(id);
        // Map the API response to match our component structure
        const mappedDetails = (response as any).task_occurrence ? (response as any).task_occurrence : response;
        setTaskDetails(mappedDetails);
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
      !rescheduleData.scheduleTime
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
        user_ids: [Number(taskDetails?.task_details?.assigned_to) || 1], // Ensure it's a number
        email: rescheduleData.email,
        sms: false // Default to false for SMS
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

  const handleCloseJobSheet = () => {
    setShowJobSheetModal(false);
    setJobSheetData(null);
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
              {(taskDetails?.actions?.can_view_job_sheet || taskDetails?.task_details?.status?.value?.toLowerCase() === 'closed') && (
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
              {taskDetails?.actions?.can_submit_task && (
                <Button
                  onClick={handleSubmitTask}
                  style={{
                    backgroundColor: '#C72030'
                  }}
                  className="text-white hover:bg-[#C72030]/90"
                >
                  Submit Task
                </Button>
              )}
              {taskDetails?.actions?.can_reschedule && (
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
                    {taskDetails?.task_details?.id || taskDetails?.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Associated With
                  </label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.associated_with}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Asset/Service Code
                  </label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.asset_service_code}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Schedule on</label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.scheduled_on}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Task Duration
                  </label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.task_duration}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created By</label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.created_by}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <Badge className={getStatusColor(taskDetails?.task_details?.status?.value || '')}>
                    {taskDetails?.task_details?.status?.display_name}
                  </Badge>
                </div>
                {taskDetails?.task_details?.completed_on && (
                  <div>
                    <label className="text-sm text-gray-600">Completed on</label>
                    <p className="font-medium">
                      {taskDetails.task_details.completed_on}
                    </p>
                  </div>
                )}
                {taskDetails?.task_details?.start_time && (
                  <div>
                    <label className="text-sm text-gray-600">Start time</label>
                    <p className="font-medium">
                      {taskDetails.task_details.start_time}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Task</label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.task_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Asset/Service Name
                  </label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.asset_service_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Supplier</label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.supplier || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Assigned to</label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.assigned_to}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created on</label>
                  <p className="font-medium">
                    {taskDetails?.task_details?.created_on}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p className="font-medium text-sm">
                    {taskDetails?.task_details?.location?.full_location}
                  </p>
                </div>
                {taskDetails?.task_details?.performed_by && (
                  <div>
                    <label className="text-sm text-gray-600">Performed by</label>
                    <p className="font-medium">
                      {taskDetails.task_details.performed_by}
                    </p>
                  </div>
                )}
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
                        {taskDetails?.activity?.resp?.length > 0 ? (
                          taskDetails.activity.resp.map((activity: any, index: number) => {
                            const files = taskDetails.attachments?.blob_store_files?.filter(
                              (file: any) => file.relation === `AssetQuestResponse${activity.name}`
                            );

                            const totalScore = taskDetails.activity.total_score;
                            const score = totalScore ? `${totalScore.score}` : '-';

                            return (
                              <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                                <td className="p-3 border-b border-r">{activity.hint || '-'}</td>
                                <td className="p-3 border-b border-r">{activity.label || '-'}</td>
                                <td className="p-3 border-b border-r">
                                  {activity.userData?.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {activity.userData.map((userValue: string, idx: number) => {
                                        const matchingValue = activity.values?.find((val: any) => val.value === userValue);
                                        const label = matchingValue ? matchingValue.label : userValue;
                                        const type = matchingValue?.type;
                                        
                                        return (
                                          <span
                                            key={idx}
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                              type === 'positive' 
                                                ? 'bg-green-100 text-green-800' 
                                                : type === 'negative' 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                          >
                                            {label}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )}
                                </td>
                                <td className="p-3 border-b border-r">{activity.comment || '-'}</td>
                                <td className="p-3 border-b border-r">{activity.weightage || '-'}</td>
                                <td className="p-3 border-b border-r">{activity.rating || '-'}</td>
                                <td className="p-3 border-b border-r">{score}</td>
                                <td className="p-3 border-b border-r">
                                  <Badge className={getStatusColor(taskDetails.task_details.status.value)}>
                                    {taskDetails.task_details.status.display_name}
                                  </Badge>
                                </td>
                                <td className="p-3 border-b">
                                  {files?.length > 0 ? (
                                    <div className="space-y-1">
                                      {files.map((file: any) => (
                                        <div key={file.id} className="flex items-center gap-2">
                                          <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline text-sm truncate max-w-[150px]"
                                            title={file.filename}
                                          >
                                            <img
                                              src={file.url}
                                              alt={file.filename}
                                              className="w-8 h-8 object-cover rounded"
                                            />
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-500">No attachments for this activity</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={9} className="p-3 text-center text-gray-500">
                              No activities found for this task.
                            </td>
                          </tr>
                        )}


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
                Notification Preferences
              </h3>
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
      <JobSheetModal
        isOpen={showJobSheetModal}
        onClose={handleCloseJobSheet}
        taskId={id || ''}
        taskDetails={taskDetails}
        jobSheetData={jobSheetData}
        jobSheetLoading={jobSheetLoading}
      />
    </>
  );
};
