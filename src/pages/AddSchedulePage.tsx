
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface TaskSection {
  id: string;
  group: string;
  subGroup: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: string;
  weightageValue: string;
  failing: boolean;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddSchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createNew, setCreateNew] = useState(false);
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [activeTab, setActiveTab] = useState('Minutes');
  
  // Task sections state
  const [taskSections, setTaskSections] = useState<TaskSection[]>([
    {
      id: '1',
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: '',
      weightageValue: '',
      failing: false
    }
  ]);
  
  // Form states
  const [formData, setFormData] = useState({
    template: '',
    ticketLevel: 'Question Level',
    assignedTo: '',
    ticketCategory: '',
    activityName: '',
    description: '',
    checklistType: 'Individual',
    asset: '',
    assignTo: '',
    scanType: '',
    planDuration: '',
    priority: '',
    emailTriggerRule: '',
    supervisors: '',
    category: '',
    submissionTime: '',
    graceTime: '',
    lockOverdueTask: '',
    frequency: '',
    startFrom: '',
    endAt: ''
  });

  // Cron form states
  const [cronFormData, setCronFormData] = useState({
    minuteStart: '00',
    minuteEnd: '59',
    hourStart: '00',
    hourEnd: '23',
    dayStart: '01',
    dayEnd: '31',
    monthStart: 'Jan',
    monthEnd: 'Dec'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCronFormChange = (field: string, value: string) => {
    setCronFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskSectionChange = (sectionId: string, field: keyof TaskSection, value: any) => {
    setTaskSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, [field]: value }
          : section
      )
    );
  };

  const handleAddSection = () => {
    const newSection: TaskSection = {
      id: Date.now().toString(),
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: '',
      weightageValue: '',
      failing: false
    };
    setTaskSections(prev => [...prev, newSection]);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (taskSections.length > 1) {
      setTaskSections(prev => prev.filter(section => section.id !== sectionId));
    }
  };

  const handleSubmit = () => {
    console.log('Submitting schedule data:', { formData, taskSections });
    toast({
      title: "Success",
      description: "Schedule saved successfully!",
    });
    navigate('/maintenance/schedule');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/schedule')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="text-sm text-gray-600 mb-1">Schedule</div>
          <h1 className="text-2xl font-bold">Add Schedule</h1>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={createNew} 
            onCheckedChange={setCreateNew}
            id="create-new"
          />
          <Label htmlFor="create-new">Create New</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={createTicket} 
            onCheckedChange={setCreateTicket}
            id="create-ticket"
          />
          <Label htmlFor="create-ticket">Create Ticket</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={weightage} 
            onCheckedChange={setWeightage}
            id="weightage"
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      {/* Create New Toggle Section */}
      {createNew && (
        <Card>
          <CardContent className="pt-6">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="template-label" shrink>Select from the existing Template</InputLabel>
                <MuiSelect
                  labelId="template-label"
                  label="Select from the existing Template"
                  displayEmpty
                  value={formData.template}
                  onChange={(e) => handleInputChange('template', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select from the existing Template</em></MenuItem>
                  <MenuItem value="template1">Template 1</MenuItem>
                  <MenuItem value="template2">Template 2</MenuItem>
                  <MenuItem value="template3">Template 3</MenuItem>
                  <MenuItem value="custom">Custom Template</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Ticket Toggle Section */}
      {createTicket && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="checklist-level" 
                    name="ticketLevel" 
                    value="Checklist Level"
                    checked={formData.ticketLevel === 'Checklist Level'}
                    onChange={(e) => handleInputChange('ticketLevel', e.target.value)}
                  />
                  <Label htmlFor="checklist-level">Checklist Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="question-level" 
                    name="ticketLevel" 
                    value="Question Level"
                    checked={formData.ticketLevel === 'Question Level'}
                    onChange={(e) => handleInputChange('ticketLevel', e.target.value)}
                  />
                  <Label htmlFor="question-level">Question Level</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id="assigned-to-label" shrink>Select Assigned To</InputLabel>
                    <MuiSelect
                      labelId="assigned-to-label"
                      label="Select Assigned To"
                      displayEmpty
                      value={formData.assignedTo}
                      onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Assigned To</em></MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="supervisor">Supervisor</MenuItem>
                      <MenuItem value="technician">Technician</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id="ticket-category-label" shrink>Select Category</InputLabel>
                    <MuiSelect
                      labelId="ticket-category-label"
                      label="Select Category"
                      displayEmpty
                      value={formData.ticketCategory}
                      onChange={(e) => handleInputChange('ticketCategory', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Category</em></MenuItem>
                      <MenuItem value="technical">Technical</MenuItem>
                      <MenuItem value="non-technical">Non Technical</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
            Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Label>Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="ppm" name="type" value="PPM" />
                <Label htmlFor="ppm">PPM</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="amc" name="type" value="AMC" />
                <Label htmlFor="amc">AMC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="preparedness" name="type" value="Preparedness" />
                <Label htmlFor="preparedness">Preparedness</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Label>Schedule For</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="asset" name="scheduleFor" value="Asset" />
                <Label htmlFor="asset">Asset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="service" name="scheduleFor" value="Service" />
                <Label htmlFor="service">Service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="vendor" name="scheduleFor" value="Vendor" />
                <Label htmlFor="vendor">Vendor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="training" name="scheduleFor" value="Training" />
                <Label htmlFor="training">Training</Label>
              </div>
            </div>
          </div>

          <div>
            <TextField
              placeholder="Enter Activity Name"
              value={formData.activityName}
              onChange={(e) => handleInputChange('activityName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div>
            <TextField
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Task Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
              Task
            </div>
            <Button 
              onClick={handleAddSection}
              style={{ backgroundColor: '#C72030' }}
              className="text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {taskSections.map((section, index) => (
            <div key={section.id} className="space-y-4 p-4 border rounded-lg relative">
              {taskSections.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSection(section.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id={`group-${section.id}-label`} shrink>Group</InputLabel>
                    <MuiSelect
                      labelId={`group-${section.id}-label`}
                      label="Group"
                      displayEmpty
                      value={section.group}
                      onChange={(e) => handleTaskSectionChange(section.id, 'group', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Group</em></MenuItem>
                      <MenuItem value="group1">Group 1</MenuItem>
                      <MenuItem value="group2">Group 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id={`subgroup-${section.id}-label`} shrink>SubGroup</InputLabel>
                    <MuiSelect
                      labelId={`subgroup-${section.id}-label`}
                      label="SubGroup"
                      displayEmpty
                      value={section.subGroup}
                      onChange={(e) => handleTaskSectionChange(section.id, 'subGroup', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                      <MenuItem value="subgroup1">Sub Group 1</MenuItem>
                      <MenuItem value="subgroup2">Sub Group 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <TextField
                    placeholder="Enter Task"
                    value={section.task}
                    onChange={(e) => handleTaskSectionChange(section.id, 'task', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id={`input-type-${section.id}-label`} shrink>Input Type</InputLabel>
                    <MuiSelect
                      labelId={`input-type-${section.id}-label`}
                      label="Input Type"
                      displayEmpty
                      value={section.inputType}
                      onChange={(e) => handleTaskSectionChange(section.id, 'inputType', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Input Type</em></MenuItem>
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="dropdown">Dropdown</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`mandatory-${section.id}`}
                      checked={section.mandatory}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'mandatory', checked)}
                    />
                    <Label htmlFor={`mandatory-${section.id}`}>Mandatory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`reading-${section.id}`}
                      checked={section.reading}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'reading', checked)}
                    />
                    <Label htmlFor={`reading-${section.id}`}>Reading</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`help-text-${section.id}`}
                      checked={!!section.helpText}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'helpText', checked ? 'Help text' : '')}
                    />
                    <Label htmlFor={`help-text-${section.id}`}>Help Text</Label>
                  </div>
                </div>
              </div>

              {/* Weightage option - only show when weightage toggle is on */}
              {weightage && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <TextField
                      placeholder="Enter Weightage"
                      value={section.weightageValue}
                      onChange={(e) => handleTaskSectionChange(section.id, 'weightageValue', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox 
                      id={`failing-${section.id}`}
                      checked={section.failing}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'failing', checked)}
                    />
                    <Label htmlFor={`failing-${section.id}`}>Failing</Label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Label>Checklist Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="individual" 
                  name="checklistType" 
                  value="Individual" 
                  checked={formData.checklistType === 'Individual'}
                  onChange={(e) => handleInputChange('checklistType', e.target.value)}
                />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="asset-group" 
                  name="checklistType" 
                  value="Asset Group"
                  checked={formData.checklistType === 'Asset Group'}
                  onChange={(e) => handleInputChange('checklistType', e.target.value)}
                />
                <Label htmlFor="asset-group">Asset Group</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="asset-label" shrink>Asset</InputLabel>
                <MuiSelect
                  labelId="asset-label"
                  label="Asset"
                  displayEmpty
                  value={formData.asset}
                  onChange={(e) => handleInputChange('asset', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Asset</em></MenuItem>
                  <MenuItem value="asset1">Asset 1</MenuItem>
                  <MenuItem value="asset2">Asset 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="assign-to-label" shrink>Assign To</InputLabel>
                <MuiSelect
                  labelId="assign-to-label"
                  label="Assign To"
                  displayEmpty
                  value={formData.assignTo}
                  onChange={(e) => handleInputChange('assignTo', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Assign To</em></MenuItem>
                  <MenuItem value="user1">User 1</MenuItem>
                  <MenuItem value="user2">User 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="scan-type-label" shrink>Scan Type</InputLabel>
                <MuiSelect
                  labelId="scan-type-label"
                  label="Scan Type"
                  displayEmpty
                  value={formData.scanType}
                  onChange={(e) => handleInputChange('scanType', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Scan Type</em></MenuItem>
                  <MenuItem value="qr">QR Code</MenuItem>
                  <MenuItem value="barcode">Barcode</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="plan-duration-label" shrink>Plan Duration</InputLabel>
                <MuiSelect
                  labelId="plan-duration-label"
                  label="Plan Duration"
                  displayEmpty
                  value={formData.planDuration}
                  onChange={(e) => handleInputChange('planDuration', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Plan Duration</em></MenuItem>
                  <MenuItem value="1hour">1 Hour</MenuItem>
                  <MenuItem value="2hours">2 Hours</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="priority-label" shrink>Priority</InputLabel>
                <MuiSelect
                  labelId="priority-label"
                  label="Priority"
                  displayEmpty
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Priority</em></MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="email-trigger-label" shrink>Email Trigger Rule</InputLabel>
                <MuiSelect
                  labelId="email-trigger-label"
                  label="Email Trigger Rule"
                  displayEmpty
                  value={formData.emailTriggerRule}
                  onChange={(e) => handleInputChange('emailTriggerRule', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Email Trigger Rule</em></MenuItem>
                  <MenuItem value="immediate">Immediate</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="supervisors-label" shrink>Supervisors</InputLabel>
                <MuiSelect
                  labelId="supervisors-label"
                  label="Supervisors"
                  displayEmpty
                  value={formData.supervisors}
                  onChange={(e) => handleInputChange('supervisors', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Supervisors</em></MenuItem>
                  <MenuItem value="supervisor1">Supervisor 1</MenuItem>
                  <MenuItem value="supervisor2">Supervisor 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="category-label" shrink>Category</InputLabel>
                <MuiSelect
                  labelId="category-label"
                  label="Category"
                  displayEmpty
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="non-technical">Non Technical</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="submission-time-label" shrink>Submission Time</InputLabel>
                <MuiSelect
                  labelId="submission-time-label"
                  label="Submission Time"
                  displayEmpty
                  value={formData.submissionTime}
                  onChange={(e) => handleInputChange('submissionTime', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Submission Time</em></MenuItem>
                  <MenuItem value="24hours">24 Hours</MenuItem>
                  <MenuItem value="48hours">48 Hours</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="grace-time-label" shrink>Grace Time</InputLabel>
                <MuiSelect
                  labelId="grace-time-label"
                  label="Grace Time"
                  displayEmpty
                  value={formData.graceTime}
                  onChange={(e) => handleInputChange('graceTime', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Grace Time</em></MenuItem>
                  <MenuItem value="1hour">1 Hour</MenuItem>
                  <MenuItem value="2hours">2 Hours</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="lock-overdue-label" shrink>Lock Overdue Task</InputLabel>
                <MuiSelect
                  labelId="lock-overdue-label"
                  label="Lock Overdue Task"
                  displayEmpty
                  value={formData.lockOverdueTask}
                  onChange={(e) => handleInputChange('lockOverdueTask', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Lock Status</em></MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="frequency-label" shrink>Frequency</InputLabel>
                <MuiSelect
                  labelId="frequency-label"
                  label="Frequency"
                  displayEmpty
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Frequency</em></MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <TextField
                type="date"
                value={formData.startFrom}
                onChange={(e) => handleInputChange('startFrom', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />
            </div>
            <div>
              <TextField
                type="date"
                value={formData.endAt}
                onChange={(e) => handleInputChange('endAt', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />
            </div>
          </div>

          <div>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="supplier-label" shrink>Select Supplier</InputLabel>
              <MuiSelect
                labelId="supplier-label"
                label="Select Supplier"
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Supplier</em></MenuItem>
                <MenuItem value="supplier1">Supplier 1</MenuItem>
                <MenuItem value="supplier2">Supplier 2</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </CardContent>
      </Card>

      {/* Cron Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
            Cron form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex border rounded-lg overflow-hidden">
              {['Minutes', 'Hours', 'Day', 'Month'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 flex-1 transition-colors ${
                    activeTab === tab 
                      ? 'text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={activeTab === tab ? { backgroundColor: '#C72030' } : {}}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {activeTab === 'Minutes' && (
                <>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="specific-minutes" name="minutes-option" defaultChecked />
                    <Label htmlFor="specific-minutes">Specific minute (choose one or many)</Label>
                  </div>

                  <div className="grid grid-cols-12 gap-2 text-sm">
                    {Array.from({ length: 60 }, (_, i) => (
                      <div key={i} className="flex items-center space-x-1">
                        <Checkbox id={`minute-${i}`} />
                        <Label htmlFor={`minute-${i}`} className="text-xs">{i.toString().padStart(2, '0')}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="radio" id="every-minute" name="minutes-option" />
                    <Label htmlFor="every-minute">Every minute between minute</Label>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <MuiSelect
                        value={cronFormData.minuteStart}
                        onChange={(e) => handleCronFormChange('minuteStart', e.target.value)}
                        displayEmpty
                        sx={{ height: 40 }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <span>and minute</span>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <MuiSelect
                        value={cronFormData.minuteEnd}
                        onChange={(e) => handleCronFormChange('minuteEnd', e.target.value)}
                        displayEmpty
                        sx={{ height: 40 }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </>
              )}

              {activeTab === 'Hours' && (
                <>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="specific-hours" name="hours-option" defaultChecked />
                    <Label htmlFor="specific-hours">Specific hour (choose one or many)</Label>
                  </div>

                  <div className="grid grid-cols-12 gap-2 text-sm">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="flex items-center space-x-1">
                        <Checkbox id={`hour-${i}`} />
                        <Label htmlFor={`hour-${i}`} className="text-xs">{i.toString().padStart(2, '0')}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="radio" id="every-hour" name="hours-option" />
                    <Label htmlFor="every-hour">Every hour between hour</Label>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <MuiSelect
                        value={cronFormData.hourStart}
                        onChange={(e) => handleCronFormChange('hourStart', e.target.value)}
                        displayEmpty
                        sx={{ height: 40 }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <span>and hour</span>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <MuiSelect
                        value={cronFormData.hourEnd}
                        onChange={(e) => handleCronFormChange('hourEnd', e.target.value)}
                        displayEmpty
                        sx={{ height: 40 }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </>
              )}

              {activeTab === 'Day' && (
                <>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="specific-days" name="days-option" defaultChecked />
                    <Label htmlFor="specific-days">Specific day (choose one or many)</Label>
                  </div>

                  <div className="grid grid-cols-8 gap-2 text-sm">
                    {Array.from({ length: 31 }, (_, i) => (
                      <div key={i} className="flex items-center space-x-1">
                        <Checkbox id={`day-${i + 1}`} />
                        <Label htmlFor={`day-${i + 1}`} className="text-xs">{(i + 1).toString()}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="radio" id="every-day" name="days-option" />
                    <Label htmlFor="every-day">Every day between day</Label>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <MuiSelect
                        value={cronFormData.dayStart}
                        onChange={(e) => handleCronFormChange('dayStart', e.target.value)}
                        displayEmpty
                        sx={{ height: 40 }}
                      >
                        {Array.from({ length: 31 }, (_, i) => (
                          <MenuItem key={i} value={(i + 1).toString().padStart(2, '0')}>{(i + 1).toString().padStart(2, '0')}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <span>and day</span>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <MuiSelect
                        value={cronFormData.dayEnd}
                        onChange={(e) => handleCronFormChange('dayEnd', e.target.value)}
                        displayEmpty
                        sx={{ height: 40 }}
                      >
                        {Array.from({ length: 31 }, (_, i) => (
                          <MenuItem key={i} value={(i + 1).toString().padStart(2, '0')}>{(i + 1).toString().padStart(2, '0')}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </>
              )}

              {activeTab === 'Month' && (
                <>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="specific-months" name="months-option" defaultChecked />
                    <Label htmlFor="specific-months">Specific month (choose one or many)</Label>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-sm">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                      <div key={i} className="flex items-center space-x-1">
                        <Checkbox id={`month-${i + 1}`} />
                        <Label htmlFor={`month-${i + 1}`} className="text-xs">{month}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="radio" id="every-month" name="months-option" />
                    <Label htmlFor="every-month">Every month between month</Label>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <MuiSelect
                        value={cronFormData.monthStart}
                        onChange={(e) => handleCronFormChange('monthStart', e.target.value)}
                        displayEmpty
                        sx={{ height: 40 }}
                      >
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                          <MenuItem key={i} value={month}>{month}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <span>and month</span>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <MuiSelect
                        value={cronFormData.monthEnd}
                        onChange={(e) => handleCronFormChange('monthEnd', e.target.value)}
                        displayEmpty
                        sx={{ height: 40 }}
                      >
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                          <MenuItem key={i} value={month}>{month}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </>
              )}

              <div className="bg-gray-50 p-4 rounded">
                <Label className="text-sm font-medium">Resulting Cron Expression:</Label>
                <div className="mt-2 font-mono text-sm">0 0 ? * *</div>
              </div>

              <div className="grid grid-cols-5 gap-4 mt-6">
                <div className="text-center">
                  <div className="font-medium mb-2">Minutes</div>
                  <div className="text-sm">*</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-2">Hours</div>
                  <div className="text-sm">*</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-2">Day Of Month</div>
                  <div className="text-sm">*</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-2">Month</div>
                  <div className="text-sm">*</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-2">Day Of Week</div>
                  <div className="text-sm">*</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/maintenance/schedule')}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white"
        >
          Save Schedule
        </Button>
      </div>
    </div>
  );
};
