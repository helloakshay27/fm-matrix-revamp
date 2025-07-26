import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { userService } from '@/services/userService';
import { taskService, TaskOccurrence } from '@/services/taskService';

export const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Help Text');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskOccurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  // Submit task form state
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
    attachments: null
  });

  // Reschedule form state
  const [rescheduleData, setRescheduleData] = useState({
    scheduleDate: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
    scheduleTime: '10:30', // Default
    user_ids: [] as number[],
    email: false,
    sms: false,
  });

  // File upload state
  const [attachedFiles, setAttachedFiles] = useState<{
    [key: string]: File | null;
  }>({
    file1: null,
    file2: null,
    file3: null,
    file4: null
  });

  // Tabs for activity section
  const tabs = ['Help Text', 'Activities', 'Input', 'Comments', 'Weightage', 'Rating', 'Score', 'Status', 'Attachments'];

  // Responsive styles for TextField and Select
  const fieldStyles = {
    height: {
      xs: 28,
      sm: 36,
      md: 45
    },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: {
        xs: '8px',
        sm: '10px',
        md: '12px'
      }
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
          title: "Error",
          description: "Failed to load task details",
          variant: "destructive"
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
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users"
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

  const handleBack = () => {
    navigate('/maintenance/task');
  };

  const handleSubmitTask = () => {
    setShowSubmitForm(true);
  };

  const handleTaskReschedule = () => {
    setShowRescheduleDialog(true);
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

  // --- AsyncSearchableDropdown logic to get users
  const handleUserSearch = async (searchTerm: string) => {
    try {
      const users = await userService.searchUsers(searchTerm);
      return users.map(user => ({
        value: user.id.toString(),
        label: user.full_name
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const handleUserChange = (selected: { value: string; label: string } | null) => {
    setRescheduleData(prev => ({
      ...prev,
      user_ids: selected ? [parseInt(selected.value)] : [],
    }));
  };

  // --- Submit Handlers

  const handleSubmitForm = () => {
    // Send to API if needed
    setShowSubmitForm(false);
    toast({
      title: "Success",
      description: "Task submitted successfully!"
    });
  };

  const handleRescheduleSubmit = async () => {
    if (
      !rescheduleData.scheduleDate ||
      !rescheduleData.scheduleTime ||
      !rescheduleData.user_ids.length
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = {
        start_date: getStartDateString(),
        user_ids: rescheduleData.user_ids,
        email: rescheduleData.email,
        sms: rescheduleData.sms,
      };
      await taskService.rescheduleTask(id!, payload);
      setShowRescheduleDialog(false);
      toast({
        title: "Success",
        description: "Task rescheduled successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // --- UI Helper
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'in progress': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
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
            <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030]">
              <ArrowLeft className="w-4 h-4" />
              <span>Scheduled Task List</span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Task Details</h1>
            <div className="flex gap-3">
              {taskDetails.actions.can_submit_task && (
                <Button onClick={handleSubmitTask} style={{
                  backgroundColor: '#C72030'
                }} className="text-white hover:bg-[#C72030]/90">
                  Submit Task
                </Button>
              )}
              {taskDetails.actions.can_reschedule && (
                <Button onClick={handleTaskReschedule} style={{
                  backgroundColor: '#C72030'
                }} className="text-white hover:bg-[#C72030]/90">
                  Task Reschedule
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Task Details Section */}
        <Card className="mb-6">
          <CardHeader className="border-b bg-white">
            <CardTitle className="flex items-center gap-2" style={{
              color: '#C72030'
            }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{
                backgroundColor: '#C72030'
              }}>T</div>
              Task Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">ID</label>
                  <p className="font-medium">{taskDetails.task_details.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Associated With</label>
                  <p className="font-medium">{taskDetails.task_details.associated_with}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Asset/Service Code</label>
                  <p className="font-medium">{taskDetails.task_details.asset_service_code}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Schedule on</label>
                  <p className="font-medium">{taskDetails.task_details.scheduled_on}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Task Duration</label>
                  <p className="font-medium">{taskDetails.task_details.task_duration}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created By</label>
                  <p className="font-medium">{taskDetails.task_details.created_by}</p>
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
                  <p className="font-medium">{taskDetails.task_details.task_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Asset/Service Name</label>
                  <p className="font-medium">{taskDetails.task_details.asset_service_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Supplier</label>
                  <p className="font-medium">{taskDetails.task_details.supplier}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Assigned to</label>
                  <p className="font-medium">{taskDetails.task_details.assigned_to}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created on</label>
                  <p className="font-medium">{taskDetails.task_details.created_on}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p className="font-medium text-sm">{taskDetails.task_details.location.full_location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Section */}
        <Card>
          <CardHeader className="border-b bg-white">
            <CardTitle style={{
              color: '#C72030'
            }} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{
                backgroundColor: '#C72030'
              }}>A</div>
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Tab Navigation */}
            <div className="flex border-b overflow-x-auto">
              {tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-[#C72030] text-[#C72030] ' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
                {tab}
              </button>)}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'Help Text' && <div className="space-y-4">
                {taskDetails.activity.ungrouped_content.map((content, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium text-gray-800">{content.label}</h3>
                    <div className="space-y-2">
                      {content.values.map((value, valueIndex) => (
                        <div key={valueIndex} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{value.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {taskDetails.activity.ungrouped_content.length === 0 && (
                  <p className="text-gray-600">No activity content available.</p>
                )}
              </div>}
              {activeTab === 'Activities' && <div className="space-y-4">
                <p className="text-gray-600">Activity details and progress tracking will be displayed here.</p>
              </div>}

              {activeTab === 'Input' && <div className="space-y-4">
                <div>
                  <TextField label="Input Value" fullWidth variant="outlined" InputLabelProps={{
                    shrink: true
                  }} InputProps={{
                    sx: fieldStyles
                  }} sx={{
                    mt: 1
                  }} />
                </div>
                <div>
                  <TextField label="Notes" fullWidth variant="outlined" multiline rows={4} InputLabelProps={{
                    shrink: true
                  }} sx={{
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      alignItems: 'flex-start',
                      padding: 0
                    },
                    '& .MuiInputBase-inputMultiline': {
                      padding: '12px',
                      minHeight: 'auto',
                      height: 'auto',
                      lineHeight: 1.5
                    }
                  }} />
                </div>
              </div>}

              {activeTab === 'Comments' && <div className="space-y-4">
                <div>
                  <TextField label="Comment" fullWidth variant="outlined" multiline rows={4} minRows={4} maxRows={8} InputLabelProps={{
                    shrink: true
                  }} InputProps={{
                    sx: {
                      ...fieldStyles,
                      alignItems: 'flex-start',
                      '& .MuiInputBase-inputMultiline': {
                        minHeight: '80px',
                        resize: 'vertical'
                      }
                    }
                  }} sx={{
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      minHeight: '100px'
                    }
                  }} />
                </div>
                <Button style={{
                  backgroundColor: '#C72030'
                }} className="text-white">
                  Add Comment
                </Button>
              </div>}

              {activeTab === 'Weightage' && <div className="space-y-4">
                <p className="text-gray-600">Task weightage information will be displayed here.</p>
              </div>}

              {activeTab === 'Rating' && <div className="space-y-4">
                <p className="text-gray-600">Rating and evaluation criteria will be displayed here.</p>
              </div>}

              {activeTab === 'Score' && <div className="space-y-4">
                <p className="text-gray-600">Task scoring information will be displayed here.</p>
              </div>}

              {activeTab === 'Status' && <div className="space-y-4">
                <p className="text-gray-600">Task status history and updates will be displayed here.</p>
              </div>}

              {activeTab === 'Attachments' && <div className="space-y-4">
                <div>
                  <TextField label="Attachment" type="file" inputProps={{
                    accept: 'image/*,application/pdf'
                  }} fullWidth variant="outlined" InputLabelProps={{
                    shrink: true
                  }} InputProps={{
                    sx: fieldStyles
                  }} sx={{
                    mt: 1
                  }} />
                </div>
                <Button style={{
                  backgroundColor: '#C72030'
                }} className="text-white">
                  Upload File
                </Button>
              </div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Task Form Dialog */}
      <Dialog open={showSubmitForm} onOpenChange={setShowSubmitForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Test Ladies washroom Checklists</DialogTitle>
            <button
              onClick={() => setShowSubmitForm(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          {/* ...submit form dialog content unchanged... */}
          {/* Copy the content you already have for the form */}
        </DialogContent>
      </Dialog>

      {/* Task Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent 
          className="max-w-lg" 
          onOpenAutoFocus={(e) => e.preventDefault()}
          aria-hidden={false}
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Task Reschedule</DialogTitle>
            <button onClick={() => setShowRescheduleDialog(false)} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
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
                  onChange={e => setRescheduleData(prev => ({ ...prev, scheduleDate: e.target.value }))}
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
                  onChange={e => setRescheduleData(prev => ({ ...prev, scheduleTime: e.target.value }))}
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
                  value={rescheduleData.user_ids.length ? String(rescheduleData.user_ids[0]) : ''}
                  onChange={(e) => setRescheduleData(prev => ({
                    ...prev,
                    user_ids: e.target.value ? [parseInt(e.target.value)] : []
                  }))}
                  label="Assign To"
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        zIndex: 9999,
                      },
                      'aria-hidden': false
                    },
                    disablePortal: true
                  }}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select User</em>
                  </MenuItem>
                  {users.map((user) => (
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
                    onCheckedChange={checked => setRescheduleData(prev => ({
                      ...prev,
                      email: !!checked
                    }))}
                  />
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Notification
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={rescheduleData.sms}
                    onCheckedChange={checked => setRescheduleData(prev => ({
                      ...prev,
                      sms: !!checked
                    }))}
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
    </>
  );
};
