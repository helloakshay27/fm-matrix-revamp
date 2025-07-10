
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const multilineFieldStyles = {
  ...fieldStyles,
  '& .MuiOutlinedInput-root': {
    ...fieldStyles['& .MuiOutlinedInput-root'],
    height: 'auto',
    alignItems: 'flex-start'
  }
};

interface TaskSection {
  id: string;
  group: string;
  subGroup: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: boolean;
  weightageValue: string;
  failing: boolean;
}

export const AddOperationalAuditSchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createNew, setCreateNew] = useState(true);
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  
  const [taskSections, setTaskSections] = useState<TaskSection[]>([
    {
      id: '1', group: '', subGroup: '', task: '', inputType: '',
      mandatory: false, reading: false, helpText: false, weightageValue: '', failing: false
    }
  ]);

  const [formData, setFormData] = useState({
    template: '', ticketLevel: 'Question Level', assignedTo: '', ticketCategory: '',
    activityName: '', description: '', checklistType: 'Individual', asset: '', assignTo: '',
    scanType: '', planDuration: '', priority: '', emailTriggerRule: '', supervisors: '',
    category: '', submissionTime: '', graceTime: '', lockOverdueTask: '', frequency: '',
    startFrom: '', endAt: ''
  });

  // Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    type: 'PPM',
    scheduleFor: 'Asset',
    activityName: '',
    description: ''
  });

  // Schedule State
  const [scheduleInfo, setScheduleInfo] = useState({
    checklistType: 'Individual',
    asset: '',
    assignTo: '',
    scanType: '',
    planDuration: '',
    priority: '',
    emailTriggerRule: '',
    supervision: '',
    category: '',
    submissionTime: '',
    graceTime: '',
    lockOverdueTask: '',
    frequency: '',
    startFrom: '',
    endAt: ''
  });

  // Cron State
  const [cronSettings, setCronSettings] = useState({
    activeTab: 'Minutes',
    selectedMinutes: [] as number[],
    selectedHours: [] as number[],
    selectedDays: [] as number[],
    selectedMonths: [] as number[],
    minuteOption: 'specific',
    hourOption: 'specific',
    dayOption: 'specific',
    monthOption: 'specific'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskSectionChange = (sectionId: string, field: keyof TaskSection, value: any) => {
    setTaskSections(prev =>
      prev.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const handleAddSection = () => {
    const newSection: TaskSection = {
      id: Date.now().toString(), group: '', subGroup: '', task: '', inputType: '',
      mandatory: false, reading: false, helpText: false, weightageValue: '', failing: false
    };
    setTaskSections(prev => [...prev, newSection]);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (taskSections.length > 1) {
      setTaskSections(prev => prev.filter(section => section.id !== sectionId));
    }
  };

  const toggleMinute = (minute: number) => {
    setCronSettings(prev => ({
      ...prev,
      selectedMinutes: prev.selectedMinutes.includes(minute) 
        ? prev.selectedMinutes.filter(m => m !== minute) 
        : [...prev.selectedMinutes, minute]
    }));
  };

  const toggleHour = (hour: number) => {
    setCronSettings(prev => ({
      ...prev,
      selectedHours: prev.selectedHours.includes(hour) 
        ? prev.selectedHours.filter(h => h !== hour) 
        : [...prev.selectedHours, hour]
    }));
  };

  const toggleDay = (day: number) => {
    setCronSettings(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day) 
        ? prev.selectedDays.filter(d => d !== day) 
        : [...prev.selectedDays, day]
    }));
  };

  const toggleMonth = (month: number) => {
    setCronSettings(prev => ({
      ...prev,
      selectedMonths: prev.selectedMonths.includes(month) 
        ? prev.selectedMonths.filter(m => m !== month) 
        : [...prev.selectedMonths, month]
    }));
  };

  const generateCronExpression = () => {
    const { selectedMinutes, selectedHours, selectedDays, selectedMonths } = cronSettings;
    
    let minutes = '*';
    let hours = '*';
    let days = '*';
    let months = '*';
    
    if (selectedMinutes.length > 0) {
      minutes = selectedMinutes.sort((a, b) => a - b).join(',');
    }
    if (selectedHours.length > 0) {
      hours = selectedHours.sort((a, b) => a - b).join(',');
    }
    if (selectedDays.length > 0) {
      days = selectedDays.sort((a, b) => a - b).join(',');
    }
    if (selectedMonths.length > 0) {
      months = selectedMonths.sort((a, b) => a - b).join(',');
    }
    
    return `${minutes} ${hours} ${days} ${months} *`;
  };

  const renderCronTabContent = () => {
    const { activeTab } = cronSettings;
    
    switch (activeTab) {
      case 'Minutes':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="specific-minute"
                name="minute-option"
                checked={cronSettings.minuteOption === 'specific'}
                onChange={() => setCronSettings(prev => ({ ...prev, minuteOption: 'specific' }))}
                className="text-red-600"
              />
              <Label htmlFor="specific-minute" className="text-sm">Specific minute (choose one or many)</Label>
            </div>
            
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 60 }, (_, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <Checkbox
                    id={`minute-${i}`}
                    checked={cronSettings.selectedMinutes.includes(i)}
                    onCheckedChange={() => toggleMinute(i)}
                  />
                  <Label htmlFor={`minute-${i}`} className="text-xs">
                    {i.toString().padStart(2, '0')}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="every-minute"
                name="minute-option"
                checked={cronSettings.minuteOption === 'range'}
                onChange={() => setCronSettings(prev => ({ ...prev, minuteOption: 'range' }))}
                className="text-red-600"
              />
              <Label htmlFor="every-minute" className="text-sm">Every minute between minute</Label>
              <FormControl variant="outlined" sx={{ ...fieldStyles, minWidth: 80 }}>
                <MuiSelect
                  value="00"
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="00">00</MenuItem>
                </MuiSelect>
              </FormControl>
              <span className="text-sm">and minute</span>
              <FormControl variant="outlined" sx={{ ...fieldStyles, minWidth: 80 }}>
                <MuiSelect
                  value="59"
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="59">59</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        );
      case 'Hours':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <Checkbox
                    id={`hour-${i}`}
                    checked={cronSettings.selectedHours.includes(i)}
                    onCheckedChange={() => toggleHour(i)}
                  />
                  <Label htmlFor={`hour-${i}`} className="text-xs">
                    {i.toString().padStart(2, '0')}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Day':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 31 }, (_, i) => (
                <div key={i + 1} className="flex items-center space-x-1">
                  <Checkbox
                    id={`day-${i + 1}`}
                    checked={cronSettings.selectedDays.includes(i + 1)}
                    onCheckedChange={() => toggleDay(i + 1)}
                  />
                  <Label htmlFor={`day-${i + 1}`} className="text-xs">
                    {(i + 1).toString().padStart(2, '0')}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Month':
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i + 1} className="flex items-center space-x-1">
                  <Checkbox
                    id={`month-${i + 1}`}
                    checked={cronSettings.selectedMonths.includes(i + 1)}
                    onCheckedChange={() => toggleMonth(i + 1)}
                  />
                  <Label htmlFor={`month-${i + 1}`} className="text-xs">
                    {monthNames[i]}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    console.log('Submitting operational audit schedule data:', { 
      formData, 
      taskSections, 
      basicInfo, 
      scheduleInfo, 
      cronSettings 
    });
    toast({ title: "Success", description: "Operational audit schedule saved successfully!" });
    navigate('/maintenance/audit/operational');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Operational Audit</div>
          <h1 className="text-xl sm:text-2xl font-bold">Add Operational Audit Schedule</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={createNew} 
            onCheckedChange={setCreateNew} 
            id="create-new"
            className="data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-gray-300"
          />
          <Label htmlFor="create-new">Create New</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={createTicket} 
            onCheckedChange={setCreateTicket} 
            id="create-ticket"
            className="data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-gray-300"
          />
          <Label htmlFor="create-ticket">Create Ticket</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={weightage} 
            onCheckedChange={setWeightage} 
            id="weightage"
            className="data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-gray-300"
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      {createNew && (
        <Card><CardContent className="pt-6">
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
        </CardContent></Card>
      )}

      {createTicket && (
        <Card><CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio" 
                  id="checklist-level" 
                  name="ticketLevel" 
                  value="Checklist Level"
                  checked={formData.ticketLevel === 'Checklist Level'}
                  onChange={(e) => handleInputChange('ticketLevel', e.target.value)}
                  className="focus:outline-none focus:ring-0"
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
                  className="focus:outline-none focus:ring-0"
                />
                <Label htmlFor="question-level">Question Level</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </CardContent></Card>
      )}

      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#C72030]">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
            Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Type</Label>
              <RadioGroup 
                value={basicInfo.type} 
                onValueChange={(value) => setBasicInfo(prev => ({ ...prev, type: value }))}
                className="grid grid-cols-2 sm:grid-cols-3 gap-2"
              >
                {['PPM', 'AMC', 'Preparedness'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type.toLowerCase()} />
                    <Label htmlFor={type.toLowerCase()} className="text-sm">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Schedule For</Label>
              <RadioGroup 
                value={basicInfo.scheduleFor} 
                onValueChange={(value) => setBasicInfo(prev => ({ ...prev, scheduleFor: value }))}
                className="grid grid-cols-2 gap-2"
              >
                {['Asset', 'Service', 'Vendor', 'Training'].map((schedule) => (
                  <div key={schedule} className="flex items-center space-x-2">
                    <RadioGroupItem value={schedule} id={schedule.toLowerCase()} />
                    <Label htmlFor={schedule.toLowerCase()} className="text-sm">{schedule}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextField
              label="Activity Name"
              placeholder="Enter Activity Name"
              value={basicInfo.activityName}
              onChange={(e) => setBasicInfo(prev => ({ ...prev, activityName: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />

            <TextField
              label="Description"
              placeholder="Enter Description"
              value={basicInfo.description}
              onChange={(e) => setBasicInfo(prev => ({ ...prev, description: e.target.value }))}
              variant="outlined"
              multiline
              rows={3}
              InputLabelProps={{ shrink: true }}
              sx={multilineFieldStyles}
            />
          </div>
        </CardContent>
      </Card>

      {/* Task Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-[#C72030]">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Task
            </CardTitle>
            <Button 
              onClick={handleAddSection}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              + Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {taskSections.map((section, index) => (
            <div key={section.id} className="space-y-4 border-b pb-6 last:border-b-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormControl variant="outlined" sx={fieldStyles}>
                  <InputLabel shrink>Select Group</InputLabel>
                  <MuiSelect
                    value={section.group}
                    onChange={(e) => handleTaskSectionChange(section.id, 'group', e.target.value)}
                    label="Select Group"
                    displayEmpty
                  >
                    <MenuItem value=""><em>Select Group</em></MenuItem>
                    <MenuItem value="group1">Group 1</MenuItem>
                    <MenuItem value="group2">Group 2</MenuItem>
                  </MuiSelect>
                </FormControl>

                <FormControl variant="outlined" sx={fieldStyles}>
                  <InputLabel shrink>Select Sub Group</InputLabel>
                  <MuiSelect
                    value={section.subGroup}
                    onChange={(e) => handleTaskSectionChange(section.id, 'subGroup', e.target.value)}
                    label="Select Sub Group"
                    displayEmpty
                  >
                    <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                    <MenuItem value="subgroup1">Sub Group 1</MenuItem>
                    <MenuItem value="subgroup2">Sub Group 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <TextField
                  label="Task"
                  placeholder="Enter Task"
                  value={section.task}
                  onChange={(e) => handleTaskSectionChange(section.id, 'task', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />

                <FormControl variant="outlined" sx={fieldStyles}>
                  <InputLabel shrink>Input Type</InputLabel>
                  <MuiSelect
                    value={section.inputType}
                    onChange={(e) => handleTaskSectionChange(section.id, 'inputType', e.target.value)}
                    label="Input Type"
                    displayEmpty
                  >
                    <MenuItem value=""><em>Select Input Type</em></MenuItem>
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="checkbox">Checkbox</MenuItem>
                  </MuiSelect>
                </FormControl>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={section.mandatory}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'mandatory', checked)}
                    />
                    <Label className="text-sm">Mandatory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={section.reading}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'reading', checked)}
                    />
                    <Label className="text-sm">Reading</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={section.helpText}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'helpText', checked)}
                    />
                    <Label className="text-sm">Help Text</Label>
                  </div>
                </div>
              </div>

              {taskSections.length > 1 && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleRemoveSection(section.id)}
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#C72030]">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Checklist Type</Label>
            <RadioGroup 
              value={scheduleInfo.checklistType} 
              onValueChange={(value) => setScheduleInfo(prev => ({ ...prev, checklistType: value }))}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Individual" id="individual" />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Asset Group" id="asset-group" />
                <Label htmlFor="asset-group">Asset Group</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Asset</InputLabel>
              <MuiSelect
                value={scheduleInfo.asset}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, asset: e.target.value }))}
                label="Select Asset"
                displayEmpty
              >
                <MenuItem value=""><em>Select Asset</em></MenuItem>
                <MenuItem value="asset1">Asset 1</MenuItem>
                <MenuItem value="asset2">Asset 2</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Assign To</InputLabel>
              <MuiSelect
                value={scheduleInfo.assignTo}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, assignTo: e.target.value }))}
                label="Select Assign To"
                displayEmpty
              >
                <MenuItem value=""><em>Select Assign To</em></MenuItem>
                <MenuItem value="user1">User 1</MenuItem>
                <MenuItem value="user2">User 2</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Scan Type</InputLabel>
              <MuiSelect
                value={scheduleInfo.scanType}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, scanType: e.target.value }))}
                label="Select Scan Type"
                displayEmpty
              >
                <MenuItem value=""><em>Select Scan Type</em></MenuItem>
                <MenuItem value="qr">QR Code</MenuItem>
                <MenuItem value="barcode">Barcode</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Plan Duration</InputLabel>
              <MuiSelect
                value={scheduleInfo.planDuration}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, planDuration: e.target.value }))}
                label="Select Plan Duration"
                displayEmpty
              >
                <MenuItem value=""><em>Select Plan Duration</em></MenuItem>
                <MenuItem value="30min">30 Minutes</MenuItem>
                <MenuItem value="1hour">1 Hour</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Priority</InputLabel>
              <MuiSelect
                value={scheduleInfo.priority}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, priority: e.target.value }))}
                label="Select Priority"
                displayEmpty
              >
                <MenuItem value=""><em>Select Priority</em></MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Email Trigger Rule</InputLabel>
              <MuiSelect
                value={scheduleInfo.emailTriggerRule}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, emailTriggerRule: e.target.value }))}
                label="Select Email Trigger Rule"
                displayEmpty
              >
                <MenuItem value=""><em>Select Email Trigger Rule</em></MenuItem>
                <MenuItem value="immediate">Immediate</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Supervisors</InputLabel>
              <MuiSelect
                value={scheduleInfo.supervision}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, supervision: e.target.value }))}
                label="Select Supervisors"
                displayEmpty
              >
                <MenuItem value=""><em>Select Supervisors</em></MenuItem>
                <MenuItem value="supervisor1">Supervisor 1</MenuItem>
                <MenuItem value="supervisor2">Supervisor 2</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Category</InputLabel>
              <MuiSelect
                value={scheduleInfo.category}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, category: e.target.value }))}
                label="Select Category"
                displayEmpty
              >
                <MenuItem value=""><em>Select Category</em></MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="inspection">Inspection</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Submission Time"
              type="time"
              value={scheduleInfo.submissionTime}
              onChange={(e) => setScheduleInfo(prev => ({ ...prev, submissionTime: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <TextField
              label="Enter Grace Time"
              placeholder="Enter Grace Time"
              value={scheduleInfo.graceTime}
              onChange={(e) => setScheduleInfo(prev => ({ ...prev, graceTime: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />

            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select</InputLabel>
              <MuiSelect
                value={scheduleInfo.lockOverdueTask}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, lockOverdueTask: e.target.value }))}
                label="Select"
                displayEmpty
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Frequency</InputLabel>
              <MuiSelect
                value={scheduleInfo.frequency}
                onChange={(e) => setScheduleInfo(prev => ({ ...prev, frequency: e.target.value }))}
                label="Select Frequency"
                displayEmpty
              >
                <MenuItem value=""><em>Select Frequency</em></MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Start From"
              type="date"
              value={scheduleInfo.startFrom}
              onChange={(e) => setScheduleInfo(prev => ({ ...prev, startFrom: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="End At"
              type="date"
              value={scheduleInfo.endAt}
              onChange={(e) => setScheduleInfo(prev => ({ ...prev, endAt: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cron Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#C72030]">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
            Cron form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 mb-4">
            {['Minutes', 'Hours', 'Day', 'Month'].map((tab) => (
              <Button
                key={tab}
                variant={cronSettings.activeTab === tab ? "default" : "outline"}
                onClick={() => setCronSettings(prev => ({ ...prev, activeTab: tab }))}
                style={cronSettings.activeTab === tab ? { backgroundColor: '#C72030' } : {}}
                className={cronSettings.activeTab === tab ? "text-white hover:bg-[#A01A28]" : ""}
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-white border">
            {renderCronTabContent()}
          </div>

          <div className="mt-6">
            <Label className="text-sm font-medium">Resulting Cron Expression:</Label>
            <div className="mt-2 p-3 bg-gray-100 rounded border text-lg font-mono">
              {generateCronExpression()}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 text-center">
            <div>
              <Label className="text-sm font-medium">Minutes</Label>
              <div className="mt-1 text-lg">
                {cronSettings.selectedMinutes.length > 0 ? cronSettings.selectedMinutes.join(',') : '*'}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Hours</Label>
              <div className="mt-1 text-lg">
                {cronSettings.selectedHours.length > 0 ? cronSettings.selectedHours.join(',') : '*'}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Day Of Month</Label>
              <div className="mt-1 text-lg">
                {cronSettings.selectedDays.length > 0 ? cronSettings.selectedDays.join(',') : '*'}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Month</Label>
              <div className="mt-1 text-lg">
                {cronSettings.selectedMonths.length > 0 ? cronSettings.selectedMonths.join(',') : '*'}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Day Of Week</Label>
              <div className="mt-1 text-lg">*</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 px-8 py-3"
          size="lg"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
