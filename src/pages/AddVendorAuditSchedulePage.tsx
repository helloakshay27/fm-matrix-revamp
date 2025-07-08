import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
const fieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: {
      xs: '36px',
      sm: '40px',
      md: '45px'
    },
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E0E0E0'
    },
    '&:hover fieldset': {
      borderColor: '#1A1A1A'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: 2
    }
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    fontSize: {
      xs: '12px',
      sm: '13px',
      md: '14px'
    },
    '&.Mui-focused': {
      color: '#C72030'
    },
    '&.MuiInputLabel-shrink': {
      transform: {
        xs: 'translate(14px, -7px) scale(0.75)',
        md: 'translate(14px, -9px) scale(0.75)'
      },
      backgroundColor: '#FFFFFF',
      padding: '0 4px'
    }
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#1A1A1A',
    fontSize: {
      xs: '12px',
      sm: '13px',
      md: '14px'
    },
    padding: {
      xs: '6px 12px',
      sm: '8px 14px',
      md: '12px 14px'
    },
    height: 'auto',
    '&::placeholder': {
      color: '#999999',
      opacity: 1
    }
  }
};
const multilineFieldStyles = {
  ...fieldStyles,
  '& .MuiOutlinedInput-root': {
    ...fieldStyles['& .MuiOutlinedInput-root'],
    height: 'auto',
    alignItems: 'flex-start'
  }
};
interface Question {
  id: number;
  text: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: boolean;
  options: Array<{
    id: number;
    text: string;
    value: string;
  }>;
}
export const AddVendorAuditSchedulePage = () => {
  const navigate = useNavigate();

  // Top level controls
  const [createNew, setCreateNew] = useState(false);
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [templateSelection, setTemplateSelection] = useState('');
  const [ticketLevel, setTicketLevel] = useState('question');
  const [assignedTo, setAssignedTo] = useState('');
  const [ticketCategory, setTicketCategory] = useState('');

  // Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    type: 'Asset',
    scheduleFor: 'Asset',
    activityName: 'Engineering Audit Checklist 2',
    description: ''
  });

  // Task State
  const [tasks, setTasks] = useState<Question[]>([{
    id: 1,
    text: 'Question 1',
    inputType: 'Radio Button',
    mandatory: false,
    reading: false,
    helpText: false,
    options: [{
      id: 1,
      text: 'Yes',
      value: 'yes'
    }, {
      id: 2,
      text: 'No',
      value: 'no'
    }]
  }]);

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
    endAt: '',
    selectSupplier: ''
  });

  // Cron State
  const [cronSettings, setCronSettings] = useState({
    activeTab: 'Minutes',
    selectedMinutes: [] as number[],
    selectedHours: [] as number[],
    selectedDays: [] as number[],
    selectedMonths: [] as number[],
    minuteRange: {
      start: 0,
      end: 0
    },
    hourRange: {
      start: 0,
      end: 0
    },
    dayRange: {
      start: 1,
      end: 1
    },
    monthRange: {
      start: 1,
      end: 1
    },
    minuteOption: 'specific',
    hourOption: 'specific',
    dayOption: 'specific',
    monthOption: 'specific'
  });
  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: false,
      options: []
    };
    setTasks(prev => [...prev, newQuestion]);
  };
  const removeQuestion = (id: number) => {
    if (tasks.length > 1) {
      setTasks(prev => prev.filter(q => q.id !== id));
    }
  };
  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setTasks(prev => prev.map(q => q.id === id ? {
      ...q,
      [field]: value
    } : q));
  };
  const addOption = (questionId: number) => {
    setTasks(prev => prev.map(q => q.id === questionId ? {
      ...q,
      options: [...q.options, {
        id: Date.now(),
        text: '',
        value: ''
      }]
    } : q));
  };
  const removeOption = (questionId: number, optionId: number) => {
    setTasks(prev => prev.map(q => q.id === questionId ? {
      ...q,
      options: q.options.filter(opt => opt.id !== optionId)
    } : q));
  };
  const updateOption = (questionId: number, optionId: number, field: string, value: string) => {
    setTasks(prev => prev.map(q => q.id === questionId ? {
      ...q,
      options: q.options.map(opt => opt.id === optionId ? {
        ...opt,
        [field]: value
      } : opt)
    } : q));
  };
  const toggleMinute = (minute: number) => {
    setCronSettings(prev => ({
      ...prev,
      selectedMinutes: prev.selectedMinutes.includes(minute) ? prev.selectedMinutes.filter(m => m !== minute) : [...prev.selectedMinutes, minute]
    }));
  };
  const toggleHour = (hour: number) => {
    setCronSettings(prev => ({
      ...prev,
      selectedHours: prev.selectedHours.includes(hour) ? prev.selectedHours.filter(h => h !== hour) : [...prev.selectedHours, hour]
    }));
  };
  const toggleDay = (day: number) => {
    setCronSettings(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day) ? prev.selectedDays.filter(d => d !== day) : [...prev.selectedDays, day]
    }));
  };
  const toggleMonth = (month: number) => {
    setCronSettings(prev => ({
      ...prev,
      selectedMonths: prev.selectedMonths.includes(month) ? prev.selectedMonths.filter(m => m !== month) : [...prev.selectedMonths, month]
    }));
  };
  const generateCronExpression = () => {
    const {
      selectedMinutes,
      selectedHours,
      selectedDays,
      selectedMonths,
      activeTab
    } = cronSettings;
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
    const {
      activeTab
    } = cronSettings;
    switch (activeTab) {
      case 'Minutes':
        return <div className="space-y-4">
            <p className="text-sm text-gray-700">Specify minute (choose one or more)</p>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({
              length: 60
            }, (_, i) => <Button key={i} variant={cronSettings.selectedMinutes.includes(i) ? "default" : "outline"} size="sm" className={`text-xs h-8 w-8 ${cronSettings.selectedMinutes.includes(i) ? "bg-[#C72030] text-white hover:bg-[#A01A28]" : ""}`} onClick={() => toggleMinute(i)}>
                  {i.toString().padStart(2, '0')}
                </Button>)}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="every-minute" name="minute-option" checked={cronSettings.minuteOption === 'range'} onChange={() => setCronSettings(prev => ({
                ...prev,
                minuteOption: 'range'
              }))} />
                <Label htmlFor="every-minute">Every minute between minute</Label>
              </div>
              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Start</InputLabel>
                <MuiSelect value={cronSettings.minuteRange.start.toString().padStart(2, '0')} onChange={e => setCronSettings(prev => ({
                ...prev,
                minuteRange: {
                  ...prev.minuteRange,
                  start: parseInt(e.target.value as string)
                }
              }))} label="Start" displayEmpty>
                  {Array.from({
                  length: 60
                }, (_, i) => <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </MenuItem>)}
                </MuiSelect>
              </FormControl>
              <span>and minute</span>
              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>End</InputLabel>
                <MuiSelect value={cronSettings.minuteRange.end.toString().padStart(2, '0')} onChange={e => setCronSettings(prev => ({
                ...prev,
                minuteRange: {
                  ...prev.minuteRange,
                  end: parseInt(e.target.value as string)
                }
              }))} label="End" displayEmpty>
                  {Array.from({
                  length: 60
                }, (_, i) => <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </MenuItem>)}
                </MuiSelect>
              </FormControl>
            </div>
          </div>;
      case 'Hours':
        return <div className="space-y-4">
            <p className="text-sm text-gray-700">Specify hour (choose one or more)</p>
            <div className="grid grid-cols-12 gap-2">
              {Array.from({
              length: 24
            }, (_, i) => <Button key={i} variant={cronSettings.selectedHours.includes(i) ? "default" : "outline"} size="sm" className={`text-xs h-8 w-8 ${cronSettings.selectedHours.includes(i) ? "bg-[#C72030] text-white hover:bg-[#A01A28]" : ""}`} onClick={() => toggleHour(i)}>
                  {i.toString().padStart(2, '0')}
                </Button>)}
            </div>
          </div>;
      case 'Day':
        return <div className="space-y-4">
            <p className="text-sm text-gray-700">Specify day of month (choose one or more)</p>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({
              length: 31
            }, (_, i) => <Button key={i + 1} variant={cronSettings.selectedDays.includes(i + 1) ? "default" : "outline"} size="sm" className={`text-xs h-8 ${cronSettings.selectedDays.includes(i + 1) ? "bg-[#C72030] text-white hover:bg-[#A01A28]" : ""}`} onClick={() => toggleDay(i + 1)}>
                  {(i + 1).toString().padStart(2, '0')}
                </Button>)}
            </div>
          </div>;
      case 'Month':
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return <div className="space-y-4">
            <p className="text-sm text-gray-700">Specify month (choose one or more)</p>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({
              length: 12
            }, (_, i) => <Button key={i + 1} variant={cronSettings.selectedMonths.includes(i + 1) ? "default" : "outline"} size="sm" className={`text-xs h-8 ${cronSettings.selectedMonths.includes(i + 1) ? "bg-[#C72030] text-white hover:bg-[#A01A28]" : ""}`} onClick={() => toggleMonth(i + 1)}>
                  {monthNames[i]}
                </Button>)}
            </div>
          </div>;
      default:
        return null;
    }
  };
  const handleSubmit = () => {
    console.log('Submitting audit schedule:', {
      basicInfo,
      tasks,
      scheduleInfo,
      cronSettings,
      topControls: {
        createNew,
        createTicket,
        weightage,
        templateSelection,
        ticketLevel,
        assignedTo,
        ticketCategory
      }
    });
    toast.success('Vendor audit schedule created successfully!');
    navigate('/maintenance/audit/vendor/scheduled');
  };
  return <div className="flex-1 p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6">
        <nav className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
          <span>Maintenance</span>
          <span className="mx-1 sm:mx-2">{'>'}</span>
          <span>Audit</span>
          <span className="mx-1 sm:mx-2">{'>'}</span>
          <span>Vendor</span>
          <span className="mx-1 sm:mx-2">{'>'}</span>
          <span>Scheduled</span>
          <span className="mx-1 sm:mx-2">{'>'}</span>
          <span>Copy</span>
        </nav>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">COPY VENDOR AUDIT SCHEDULE</h1>
      </div>

      {/* Top Controls */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          {/* Create New */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="createNew" className="text-sm font-medium">Create New</Label>
              <Switch id="createNew" checked={createNew} onCheckedChange={checked => setCreateNew(checked)} className="data-[state=checked]:bg-green-500" />
            </div>
            {createNew && <div className="w-full sm:w-auto sm:min-w-[200px]">
                <FormControl variant="outlined" sx={fieldStyles}>
                  <InputLabel shrink>Select from existing Template</InputLabel>
                  <MuiSelect value={templateSelection} onChange={e => setTemplateSelection(e.target.value)} label="Select from existing Template" displayEmpty>
                    <MenuItem value=""><em>Select Template</em></MenuItem>
                    <MenuItem value="template1">Template 1</MenuItem>
                    <MenuItem value="template2">Template 2</MenuItem>
                    <MenuItem value="template3">Template 3</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>}
          </div>

          {/* Create Ticket */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="createTicket" className="text-sm font-medium">Create Ticket</Label>
              <Switch id="createTicket" checked={createTicket} onCheckedChange={checked => setCreateTicket(checked)} className="data-[state=checked]:bg-green-500" />
            </div>
            {createTicket && <div className="flex flex-col gap-3">
                <RadioGroup value={ticketLevel} onValueChange={setTicketLevel} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="checklist" id="checklist-level" />
                    <Label htmlFor="checklist-level" className="text-sm">Checklist Level</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="question" id="question-level" />
                    <Label htmlFor="question-level" className="text-sm">Question Level</Label>
                  </div>
                </RadioGroup>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormControl variant="outlined" sx={fieldStyles}>
                    <InputLabel shrink>Select Assigned To</InputLabel>
                    <MuiSelect value={assignedTo} onChange={e => setAssignedTo(e.target.value)} label="Select Assigned To" displayEmpty>
                      <MenuItem value=""><em>Select User</em></MenuItem>
                      <MenuItem value="user1">User 1</MenuItem>
                      <MenuItem value="user2">User 2</MenuItem>
                      <MenuItem value="user3">User 3</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  
                  <FormControl variant="outlined" sx={fieldStyles}>
                    <InputLabel shrink>Select Category</InputLabel>
                    <MuiSelect value={ticketCategory} onChange={e => setTicketCategory(e.target.value)} label="Select Category" displayEmpty>
                      <MenuItem value=""><em>Select Category</em></MenuItem>
                      <MenuItem value="category1">Category 1</MenuItem>
                      <MenuItem value="category2">Category 2</MenuItem>
                      <MenuItem value="category3">Category 3</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>}
          </div>

          {/* Weightage */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="weightage" className="text-sm font-medium">Weightage</Label>
            <Switch id="weightage" checked={weightage} onCheckedChange={checked => setWeightage(checked)} className="data-[state=checked]:bg-green-500" />
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Basic Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C72030]">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Type Section */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Type</Label>
                <RadioGroup value={basicInfo.type} onValueChange={value => setBasicInfo(prev => ({
                ...prev,
                type: value
              }))} className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                  {['PPM', 'AMC', 'Preparedness', 'HOTO', 'Routine', 'Audit'].map(type => <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type.toLowerCase()} />
                      <Label htmlFor={type.toLowerCase()} className="text-sm">{type}</Label>
                    </div>)}
                </RadioGroup>
              </div>

              {/* Schedule For Section */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Schedule For</Label>
                <RadioGroup value={basicInfo.scheduleFor} onValueChange={value => setBasicInfo(prev => ({
                ...prev,
                scheduleFor: value
              }))} className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
                  {['Asset', 'Service', 'Vendor', 'Training'].map(schedule => <div key={schedule} className="flex items-center space-x-2">
                      <RadioGroupItem value={schedule} id={schedule.toLowerCase()} />
                      <Label htmlFor={schedule.toLowerCase()} className="text-sm">{schedule}</Label>
                    </div>)}
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <TextField label="Activity Name *" placeholder="Enter Activity Name" value={basicInfo.activityName} onChange={e => setBasicInfo(prev => ({
              ...prev,
              activityName: e.target.value
            }))} variant="outlined" InputLabelProps={{
              shrink: true
            }} sx={fieldStyles} />

              <TextField label="Description" placeholder="Enter Description" value={basicInfo.description} onChange={e => setBasicInfo(prev => ({
              ...prev,
              description: e.target.value
            }))} variant="outlined" multiline rows={3} InputLabelProps={{
              shrink: true
            }} sx={multilineFieldStyles} />
            </div>
          </CardContent>
        </Card>

        {/* Task Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="flex items-center gap-2 text-[#C72030]">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Task
              </CardTitle>
              <Button onClick={addNewQuestion} style={{
              backgroundColor: '#C72030'
            }} className="text-white hover:opacity-90 w-full sm:w-auto">
                + Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {tasks.map((task, index) => <div key={task.id} className="space-y-4 border-b pb-4 sm:pb-6 last:border-b-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormControl variant="outlined" sx={fieldStyles}>
                    <InputLabel shrink>Select Group</InputLabel>
                    <MuiSelect label="Select Group" displayEmpty>
                      <MenuItem value=""><em>Select Group</em></MenuItem>
                      <MenuItem value="daily-calc">Daily Calculation Log</MenuItem>
                      <MenuItem value="weekly-report">Weekly Report</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <FormControl variant="outlined" sx={fieldStyles}>
                    <InputLabel shrink>Select Sub-Group</InputLabel>
                    <MuiSelect label="Select Sub-Group" displayEmpty>
                      <MenuItem value=""><em>Select Sub-Group</em></MenuItem>
                      <MenuItem value="it-block-mlt">IT Block MLT</MenuItem>
                      <MenuItem value="main-block">Main Block</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextField label="Task" placeholder="Enter Task" value={task.text} onChange={e => updateQuestion(task.id, 'text', e.target.value)} variant="outlined" InputLabelProps={{
                shrink: true
              }} sx={fieldStyles} />

                  <FormControl variant="outlined" sx={fieldStyles}>
                    <InputLabel shrink>Input Type</InputLabel>
                    <MuiSelect value={task.inputType} onChange={e => updateQuestion(task.id, 'inputType', e.target.value)} label="Input Type" displayEmpty>
                      <MenuItem value=""><em>Select Input Type</em></MenuItem>
                      <MenuItem value="Radio Button">Radio Button</MenuItem>
                      <MenuItem value="Checkbox">Checkbox</MenuItem>
                      <MenuItem value="Text">Text</MenuItem>
                      <MenuItem value="Number">Number</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id={`mandatory-${task.id}`} checked={task.mandatory} onCheckedChange={checked => updateQuestion(task.id, 'mandatory', checked)} className="data-[state=checked]:bg-green-500" />
                      <Label htmlFor={`mandatory-${task.id}`} className="text-sm">Mandatory</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id={`reading-${task.id}`} checked={task.reading} onCheckedChange={checked => updateQuestion(task.id, 'reading', checked)} className="data-[state=checked]:bg-green-500" />
                      <Label htmlFor={`reading-${task.id}`} className="text-sm">Reading</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id={`helpText-${task.id}`} checked={task.helpText} onCheckedChange={checked => updateQuestion(task.id, 'helpText', checked)} className="data-[state=checked]:bg-green-500" />
                      <Label htmlFor={`helpText-${task.id}`} className="text-sm">Help Text</Label>
                    </div>
                  </div>
                </div>

                {/* Options Section */}
                {task.inputType === 'Radio Button' && <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <Label className="text-sm font-medium">Selected Enter Value</Label>
                      <Button onClick={() => addOption(task.id)} size="sm" style={{
                  backgroundColor: '#C72030'
                }} className="text-white hover:opacity-90 w-full sm:w-auto">
                        Add Option
                      </Button>
                    </div>
                    
                    {task.options.map((option, optIndex) => <div key={option.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="w-4 flex-shrink-0">
                          <input type="radio" name={`task-${task.id}`} />
                        </div>
                        <div className="flex-1">
                          <TextField placeholder="Option text" value={option.text} onChange={e => updateOption(task.id, option.id, 'text', e.target.value)} variant="outlined" InputLabelProps={{
                    shrink: true
                  }} sx={fieldStyles} />
                        </div>
                        <div className="w-full sm:w-24">
                          <TextField placeholder="Value" value={option.value} onChange={e => updateOption(task.id, option.id, 'value', e.target.value)} variant="outlined" InputLabelProps={{
                    shrink: true
                  }} sx={fieldStyles} />
                        </div>
                        {task.options.length > 1 && <Button onClick={() => removeOption(task.id, option.id)} size="sm" variant="ghost" className="text-red-500 hover:text-red-700 w-full sm:w-auto">
                            <X className="w-4 h-4" />
                          </Button>}
                      </div>)}
                  </div>}

                {tasks.length > 1 && <div className="flex justify-end">
                    <Button onClick={() => removeQuestion(task.id)} size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4 mr-2" />
                      Remove Question
                    </Button>
                  </div>}
              </div>)}

            <div className="flex justify-end">
              <Button onClick={addNewQuestion} style={{
              backgroundColor: '#C72030'
            }} className="text-white hover:opacity-90 w-full sm:w-auto">
                + Add Question
              </Button>
            </div>
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
              <RadioGroup value={scheduleInfo.checklistType} onValueChange={value => setScheduleInfo(prev => ({
              ...prev,
              checklistType: value
            }))} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Individual" id="individual" />
                  <Label htmlFor="individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Asset Asset Group" id="asset-group" />
                  <Label htmlFor="asset-group">Asset Asset Group</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Asset</InputLabel>
                <MuiSelect value={scheduleInfo.asset} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                asset: e.target.value
              }))} label="Asset" displayEmpty>
                  <MenuItem value=""><em>Select Asset</em></MenuItem>
                  <MenuItem value="asset1">Asset 1</MenuItem>
                  <MenuItem value="asset2">Asset 2</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Assign To</InputLabel>
                <MuiSelect value={scheduleInfo.assignTo} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                assignTo: e.target.value
              }))} label="Assign To" displayEmpty>
                  <MenuItem value=""><em>Select User</em></MenuItem>
                  <MenuItem value="user1">User 1</MenuItem>
                  <MenuItem value="user2">User 2</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Scan Type</InputLabel>
                <MuiSelect value={scheduleInfo.scanType} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                scanType: e.target.value
              }))} label="Scan Type" displayEmpty>
                  <MenuItem value=""><em>Select Scan Type</em></MenuItem>
                  <MenuItem value="qr">QR Code</MenuItem>
                  <MenuItem value="barcode">Barcode</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Plan Duration</InputLabel>
                <MuiSelect value={scheduleInfo.planDuration} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                planDuration: e.target.value
              }))} label="Plan Duration" displayEmpty>
                  <MenuItem value=""><em>Select Duration</em></MenuItem>
                  <MenuItem value="30min">30 Minutes</MenuItem>
                  <MenuItem value="1hour">1 Hour</MenuItem>
                  <MenuItem value="2hours">2 Hours</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Priority</InputLabel>
                <MuiSelect value={scheduleInfo.priority} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                priority: e.target.value
              }))} label="Priority" displayEmpty>
                  <MenuItem value=""><em>Select Priority</em></MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Email Trigger Rule</InputLabel>
                <MuiSelect value={scheduleInfo.emailTriggerRule} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                emailTriggerRule: e.target.value
              }))} label="Email Trigger Rule" displayEmpty>
                  <MenuItem value=""><em>Select Rule</em></MenuItem>
                  <MenuItem value="immediate">Immediate</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Supervision</InputLabel>
                <MuiSelect value={scheduleInfo.supervision} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                supervision: e.target.value
              }))} label="Supervision" displayEmpty>
                  <MenuItem value=""><em>Select Supervisor</em></MenuItem>
                  <MenuItem value="supervisor1">Supervisor 1</MenuItem>
                  <MenuItem value="supervisor2">Supervisor 2</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Category</InputLabel>
                <MuiSelect value={scheduleInfo.category} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                category: e.target.value
              }))} label="Category" displayEmpty>
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="inspection">Inspection</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Submission Time</InputLabel>
                <MuiSelect value={scheduleInfo.submissionTime} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                submissionTime: e.target.value
              }))} label="Submission Time" displayEmpty>
                  <MenuItem value=""><em>Select Time</em></MenuItem>
                  <MenuItem value="09:00">09:00 AM</MenuItem>
                  <MenuItem value="17:00">05:00 PM</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Grace Time</InputLabel>
                <MuiSelect value={scheduleInfo.graceTime} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                graceTime: e.target.value
              }))} label="Grace Time" displayEmpty>
                  <MenuItem value=""><em>Select Grace Time</em></MenuItem>
                  <MenuItem value="15min">15 Minutes</MenuItem>
                  <MenuItem value="30min">30 Minutes</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Lock Overdue Task</InputLabel>
                <MuiSelect value={scheduleInfo.lockOverdueTask} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                lockOverdueTask: e.target.value
              }))} label="Lock Overdue Task" displayEmpty>
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Frequency</InputLabel>
                <MuiSelect value={scheduleInfo.frequency} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                frequency: e.target.value
              }))} label="Frequency" displayEmpty>
                  <MenuItem value=""><em>Select Frequency</em></MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </MuiSelect>
              </FormControl>

              <TextField label="Start From" type="date" value={scheduleInfo.startFrom} onChange={e => setScheduleInfo(prev => ({
              ...prev,
              startFrom: e.target.value
            }))} variant="outlined" InputLabelProps={{
              shrink: true
            }} sx={fieldStyles} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="End At" type="date" value={scheduleInfo.endAt} onChange={e => setScheduleInfo(prev => ({
              ...prev,
              endAt: e.target.value
            }))} variant="outlined" InputLabelProps={{
              shrink: true
            }} sx={fieldStyles} />

              <FormControl variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Select Supplier</InputLabel>
                <MuiSelect value={scheduleInfo.selectSupplier} onChange={e => setScheduleInfo(prev => ({
                ...prev,
                selectSupplier: e.target.value
              }))} label="Select Supplier" displayEmpty>
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
            <CardTitle className="flex items-center gap-2 text-[#C72030]">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Cron form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
              {['Minutes', 'Hours', 'Day', 'Month'].map(tab => <Button key={tab} variant={cronSettings.activeTab === tab ? "default" : "outline"} onClick={() => setCronSettings(prev => ({
              ...prev,
              activeTab: tab
            }))} style={cronSettings.activeTab === tab ? {
              backgroundColor: '#C72030'
            } : {}} className={`${cronSettings.activeTab === tab ? "text-white hover:bg-[#A01A28]" : ""} flex-1 sm:flex-none`}>
                  {tab}
                </Button>)}
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-white">
              {renderCronTabContent()}
            </div>

            <div className="mt-4 sm:mt-6">
              <Label className="text-sm font-medium">Resulting Cron Expression:</Label>
              <div className="mt-2 p-3 bg-gray-100 rounded border text-sm sm:text-lg font-mono break-all">
                {generateCronExpression()}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 text-center">
              <div>
                <Label className="text-xs sm:text-sm font-medium">Minutes</Label>
                <div className="mt-1 text-sm sm:text-lg break-all">
                  {cronSettings.selectedMinutes.length > 0 ? cronSettings.selectedMinutes.join(',') : '*'}
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm font-medium">Hours</Label>
                <div className="mt-1 text-sm sm:text-lg break-all">
                  {cronSettings.selectedHours.length > 0 ? cronSettings.selectedHours.join(',') : '*'}
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm font-medium">Day Of Month</Label>
                <div className="mt-1 text-sm sm:text-lg break-all">
                  {cronSettings.selectedDays.length > 0 ? cronSettings.selectedDays.join(',') : '*'}
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm font-medium">Month</Label>
                <div className="mt-1 text-sm sm:text-lg break-all">
                  {cronSettings.selectedMonths.length > 0 ? cronSettings.selectedMonths.join(',') : '*'}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                <Label className="text-xs sm:text-sm font-medium">Day Of Week</Label>
                <div className="mt-1 text-sm sm:text-lg">*</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center pt-4 sm:pt-6">
          <Button onClick={handleSubmit} style={{
          backgroundColor: '#C72030'
        }} className="text-white hover:opacity-90 px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto" size="lg">
            Submit
          </Button>
        </div>
      </div>
    </div>;
};