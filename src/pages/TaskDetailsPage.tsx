import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { TextField } from '@mui/material';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AsyncSearchableDropdown } from '@/components/AsyncSearchableDropdown';
import { userService, User } from '@/services/userService';

export const TaskDetailsPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('Help Text');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  // Form states for Submit Task
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
    scheduleDate: new Date().toISOString().split('T')[0],
    time: '',
    selectedUser: null as User | null,
    email: false,
    sms: false
  });
  const [attachedFiles, setAttachedFiles] = useState<{
    [key: string]: File | null;
  }>({
    file1: null,
    file2: null,
    file3: null,
    file4: null
  });
  const handleBack = () => {
    navigate('/maintenance/task');
  };
  const taskDetails = {
    id: id || '17598329',
    task: 'Test Ladies washroom Checklists',
    associatedWith: 'Service',
    assetServiceName: 'Test Ladies washroom Service',
    assetServiceCode: '66c8b32d5d12d96fd07f',
    assetServiceCode2: '66c8b32d5d12d96fd07f',
    scheduleOn: '17/06/2025, 11:00 PM',
    assignedTo: 'Vinayak Mane',
    taskDuration: 'NA',
    createdOn: '23/01/2023, 02:56 PM',
    createdBy: 'Robert Day2',
    location: 'Site -> Lockated / Building -> Ideal Landmark / Wing -> A / Floor -> NA / Area -> NA / Room -> NA',
    status: 'Open'
  };
  const handleSubmitTask = () => {
    setShowSubmitForm(true);
  };
  const handleTaskReschedule = () => {
    setShowRescheduleDialog(true);
  };
  const handleSubmitForm = () => {
    console.log('Form submitted:', formData);
    setShowSubmitForm(false);
    toast({
      title: "Success",
      description: "Task submitted successfully!"
    });
  };
  const handleRescheduleSubmit = async () => {
    if (!rescheduleData.selectedUser || !rescheduleData.scheduleDate || !rescheduleData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await userService.rescheduleTask(id!, {
        scheduleDate: rescheduleData.scheduleDate,
        time: rescheduleData.time,
        userId: rescheduleData.selectedUser.id,
        email: rescheduleData.email,
        sms: rescheduleData.sms
      });
      
      setShowRescheduleDialog(false);
      toast({
        title: "Success",
        description: "Task rescheduled successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUserSearch = async (searchTerm: string) => {
    try {
      const users = await userService.searchUsers(searchTerm);
      // Map users to show full_name as label but keep ID as value for payload
      return users.map(user => ({
        value: user.id.toString(), // ID for payload
        label: user.full_name      // Display name for frontend
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const handleUserChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      // Store both ID and full_name for easy access
      setRescheduleData(prev => ({
        ...prev,
        selectedUser: {
          id: parseInt(selectedOption.value), // Store ID from value
          full_name: selectedOption.label     // Store display name from label
        }
      }));
    } else {
      setRescheduleData(prev => ({
        ...prev,
        selectedUser: null
      }));
    }
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileKey: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFiles(prev => ({
        ...prev,
        [fileKey]: file
      }));
      console.log('File uploaded:', file.name);
    }
  };
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
  return <>
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
              <Button onClick={handleSubmitTask} style={{
              backgroundColor: '#C72030'
            }} className="text-white hover:bg-[#C72030]/90">
                Submit Task
              </Button>
              <Button onClick={handleTaskReschedule} style={{
              backgroundColor: '#C72030'
            }} className="text-white hover:bg-[#C72030]/90">
                Task Reschedule
              </Button>
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
                  <p className="font-medium">{taskDetails.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Associated With</label>
                  <p className="font-medium">{taskDetails.associatedWith}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Asset/Service Code</label>
                  <p className="font-medium">{taskDetails.assetServiceCode}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Schedule on</label>
                  <p className="font-medium">{taskDetails.scheduleOn}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Task Duration</label>
                  <p className="font-medium">{taskDetails.taskDuration}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created By</label>
                  <p className="font-medium">{taskDetails.createdBy}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <Badge className="bg-green-100 text-green-700">{taskDetails.status}</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Task</label>
                  <p className="font-medium">{taskDetails.task}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Asset/Service Name</label>
                  <p className="font-medium">{taskDetails.assetServiceName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Asset/Service Code</label>
                  <p className="font-medium">{taskDetails.assetServiceCode2}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Assigned to</label>
                  <p className="font-medium">{taskDetails.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Created on</label>
                  <p className="font-medium">{taskDetails.createdOn}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p className="font-medium text-sm">{taskDetails.location}</p>
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
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-800">Washroom - Ladies Washroom</h3>
                    <p className="text-gray-600">Is Floor Clean ?</p>
                    <p className="text-sm text-gray-500">Lift/Lift lobby</p>
                  </div>
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
          
          <div className="space-y-6 p-4">
            {/* Question 1 */}
            <div className="space-y-3">
              <div className="p-3 rounded bg-[#F6F4EE]">
                <h3 className="font-medium text-red-700">Washroom - Ladies Washroom</h3>
              </div>
              <p className="font-medium">1. Is Floor Clean ?</p>
              <div className="flex items-center space-x-2">
                <Checkbox id="floor-clean" checked={formData.isFloorClean} onCheckedChange={checked => setFormData(prev => ({
                ...prev,
                isFloorClean: !!checked
              }))} />
                <label htmlFor="floor-clean">Yes</label>
              </div>
              <div className="space-y-2">
                <TextField label="Floor Comment" placeholder="Enter Floor Comment" value={formData.floorComment} onChange={e => setFormData(prev => ({
                ...prev,
                floorComment: e.target.value
              }))} fullWidth variant="outlined" multiline rows={4} InputLabelProps={{
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
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-gray-300 text-xl cursor-pointer hover:text-yellow-400">☆</span>)}
              </div>
              <div className="space-y-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="file" onChange={e => handleFileUpload(e, 'file1')} className="hidden" id="file-upload-1" accept="image/*,.pdf" />
                      <label htmlFor="file-upload-1" className="text-red-600 cursor-pointer hover:underline">
                        Choose File
                      </label>
                      <span className="text-gray-500">
                        {attachedFiles.file1 ? attachedFiles.file1.name : 'No file chosen'}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => document.getElementById('file-upload-1')?.click()}>
                      <Plus className="w-4 h-4 mr-1" />
                      Upload Files
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-3">
              <p className="font-medium">2. LBLR lobby*</p>
              <div className="space-y-2">
                <TextField label="Dust Comment" placeholder="Enter Dust Comment" value={formData.dustComment} onChange={e => setFormData(prev => ({
                ...prev,
                dustComment: e.target.value
              }))} fullWidth variant="outlined" multiline rows={4} InputLabelProps={{
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
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-gray-300 text-xl cursor-pointer hover:text-yellow-400">☆</span>)}
              </div>
              <div className="space-y-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="file" onChange={e => handleFileUpload(e, 'file2')} className="hidden" id="file-upload-2" accept="image/*,.pdf" />
                      <label htmlFor="file-upload-2" className="text-red-600 cursor-pointer hover:underline">
                        Choose File
                      </label>
                      <span className="text-gray-500">
                        {attachedFiles.file2 ? attachedFiles.file2.name : 'No file chosen'}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => document.getElementById('file-upload-2')?.click()}>
                      <Plus className="w-4 h-4 mr-1" />
                      Upload Files
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 3 */}
            <div className="space-y-3">
              <p className="font-medium">3. LBLR lobby*</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="dust" checked={formData.liftOptions.dust} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  liftOptions: {
                    ...prev.liftOptions,
                    dust: !!checked
                  }
                }))} />
                  <label htmlFor="dust">Dust</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="dry-mop" checked={formData.liftOptions.dryMop} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  liftOptions: {
                    ...prev.liftOptions,
                    dryMop: !!checked
                  }
                }))} />
                  <label htmlFor="dry-mop">Dry mop</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="wet-mop" checked={formData.liftOptions.wetMop} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  liftOptions: {
                    ...prev.liftOptions,
                    wetMop: !!checked
                  }
                }))} />
                  <label htmlFor="wet-mop">Wet mop</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="vacuum" checked={formData.liftOptions.vacuum} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  liftOptions: {
                    ...prev.liftOptions,
                    vacuum: !!checked
                  }
                }))} />
                  <label htmlFor="vacuum">Vacuum</label>
                </div>
              </div>
              <div className="space-y-2">
                <TextField label="Lift Comment" placeholder="Enter Lift Comment" value={formData.liftComment} onChange={e => setFormData(prev => ({
                ...prev,
                liftComment: e.target.value
              }))} fullWidth variant="outlined" multiline rows={4} InputLabelProps={{
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
              <div className="space-y-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="file" onChange={e => handleFileUpload(e, 'file3')} className="hidden" id="file-upload-3" accept="image/*,.pdf" />
                      <label htmlFor="file-upload-3" className="text-red-600 cursor-pointer hover:underline">
                        Choose File
                      </label>
                      <span className="text-gray-500">
                        {attachedFiles.file3 ? attachedFiles.file3.name : 'No file chosen'}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => document.getElementById('file-upload-3')?.click()}>
                      <Plus className="w-4 h-4 mr-1" />
                      Upload Files
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="file" onChange={e => handleFileUpload(e, 'file4')} className="hidden" id="file-upload-4" accept="image/*,.pdf" />
                      <label htmlFor="file-upload-4" className="text-red-600 cursor-pointer hover:underline">
                        Choose File
                      </label>
                      <span className="text-gray-500">
                        {attachedFiles.file4 ? attachedFiles.file4.name : 'No file chosen'}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => document.getElementById('file-upload-4')?.click()}>
                      <Plus className="w-4 h-4 mr-1" />
                      Upload Files
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={handleSubmitForm} style={{
              backgroundColor: '#00C851'
            }} className="text-white hover:bg-green-600 px-8">
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="max-w-lg">
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
                <div>
                  <TextField 
                    label="Schedule Date" 
                    type="date" 
                    value={rescheduleData.scheduleDate} 
                    onChange={e => setRescheduleData(prev => ({
                      ...prev,
                      scheduleDate: e.target.value
                    }))} 
                    fullWidth 
                    variant="outlined" 
                    InputLabelProps={{ shrink: true }} 
                    InputProps={{ sx: fieldStyles }} 
                    sx={{ mt: 1 }} 
                    required
                  />
                </div>
                <div>
                  <TextField 
                    label="Time" 
                    type="time" 
                    value={rescheduleData.time} 
                    onChange={e => setRescheduleData(prev => ({
                      ...prev,
                      time: e.target.value
                    }))} 
                    fullWidth 
                    variant="outlined" 
                    InputLabelProps={{ shrink: true }} 
                    InputProps={{ sx: fieldStyles }} 
                    sx={{ mt: 1 }} 
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4" style={{ color: '#C72030' }}>
                Assign to User
              </h3>
              <div className="space-y-4">
                <AsyncSearchableDropdown
                  placeholder="Search and select user..."
                  onSearch={handleUserSearch}
                  onChange={handleUserChange}
                  className="w-full"
                  isSearchable={true}
                  isClearable={true}
                  noOptionsMessage="No users found"
                  debounceDelay={300}
                />
              </div>
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
    </>;
};
