import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Upload, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  Checkbox, 
  FormGroup,
  Box
} from '@mui/material';

const muiFieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: { xs: '36px', md: '45px' },
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E0E0E0',
    },
    '&:hover fieldset': {
      borderColor: '#1A1A1A',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#999999',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#C72030',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: '#FFFFFF',
      padding: '0 4px',
    },
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#1A1A1A',
    fontSize: '16px',
    padding: { xs: '8px 14px', md: '12px 14px' },
    height: 'auto',
    '&::placeholder': {
      color: '#999999',
      opacity: 1,
    },
  },
};

const multilineFieldStyles = {
  ...muiFieldStyles,
  '& .MuiOutlinedInput-root': {
    ...muiFieldStyles['& .MuiOutlinedInput-root'],
    height: 'auto',
    alignItems: 'flex-start',
  },
};

export const EditSchedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Basic Info state
  const [type, setType] = useState('PPM');
  const [activityName, setActivityName] = useState('meter reading');
  const [description, setDescription] = useState('');
  const [scheduleFor, setScheduleFor] = useState('Asset');

  // Create Ticket Toggle state
  const [createTicket, setCreateTicket] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [weightage, setWeightage] = useState(false);
  const [categoryLevel, setCategoryLevel] = useState('question-level');

  // Task state
  const [group, setGroup] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [sections, setSections] = useState([
    { 
      id: 1, 
      name: 'Section 1', 
      tasks: [
        { id: 1, task: 'Kwah', inputType: 'Numeric', mandatory: true, reading: true, helpText: false }
      ]
    }
  ]);

  // Cron Settings state
  const [editTimings, setEditTimings] = useState(false);
  const [cronTab, setCronTab] = useState('Minutes');
  const [specificMinute, setSpecificMinute] = useState(true);
  const [selectedMinutes, setSelectedMinutes] = useState(['00', '09']);
  const [specificHour, setSpecificHour] = useState(true);
  const [selectedHours, setSelectedHours] = useState(['09']);
  const [specificDay, setSpecificDay] = useState(true);
  const [selectedDays, setSelectedDays] = useState(['1']);
  const [specificMonth, setSpecificMonth] = useState(true);
  const [selectedMonths, setSelectedMonths] = useState(['1']);

  // Schedule state
  const [asset, setAsset] = useState('Energy Meter 1[584931186764c2f8b565]');
  const [assignTo, setAssignTo] = useState('Users');
  const [scanType, setScanType] = useState('');
  const [planDuration, setPlanDuration] = useState('Day');
  const [planDurationField, setPlanDurationField] = useState('1');
  const [priority, setPriority] = useState('');
  const [emailTriggerRule, setEmailTriggerRule] = useState('');
  const [supervisors, setSupervisors] = useState('');
  const [category, setCategory] = useState('Technical');
  const [submissionTime, setSubmissionTime] = useState('');
  const [submissionTimeField, setSubmissionTimeField] = useState('');
  const [graceTime, setGraceTime] = useState('Day');
  const [graceTimeField, setGraceTimeField] = useState('3');
  const [lockOverdueTask, setLockOverdueTask] = useState('');
  const [frequency, setFrequency] = useState('');
  const [cronExpression, setCronExpression] = useState('0 0 * * *');
  const [startFrom, setStartFrom] = useState('01/05/2025');
  const [endAt, setEndAt] = useState('31/05/2025');
  const [selectSupplier, setSelectSupplier] = useState('');

  // Associations data
  const associationsData = [
    {
      assetName: 'Energy Meter 1',
      assetCode: '584931186764c2f8b565',
      modelNumber: '',
      purchaseDate: '14/02/2022, 04:54 PM',
      purchaseCost: '',
      createdOn: ''
    },
    {
      assetName: 'Energy Meter 23',
      assetCode: '03835269926136105d:1',
      modelNumber: 'EM-001',
      purchaseDate: '31/05/2023, 06:18 PM',
      purchaseCost: '',
      createdOn: ''
    }
  ];

  const handleAddSection = () => {
    console.log('Add Section clicked');
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      tasks: []
    };
    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (sectionId: number) => {
    console.log('Remove Section clicked', sectionId);
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const handleAddQuestion = (sectionId: number) => {
    console.log('Add Question clicked for section', sectionId);
    const newTask = {
      id: Date.now(),
      task: 'New Task',
      inputType: 'Text',
      mandatory: false,
      reading: false,
      helpText: false
    };
    
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, tasks: [...section.tasks, newTask] }
        : section
    ));
  };

  const handleRemoveQuestion = (sectionId: number, taskId: number) => {
    console.log('Remove Question clicked', sectionId, taskId);
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, tasks: section.tasks.filter(task => task.id !== taskId) }
        : section
    ));
  };

  const handleUpdateTask = (sectionId: number, taskId: number, field: string, value: any) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            tasks: section.tasks.map(task => 
              task.id === taskId ? { ...task, [field]: value } : task
            )
          }
        : section
    ));
  };

  const handleSubmit = () => {
    console.log('Schedule updated successfully');
    navigate('/maintenance/schedule');
  };

  const renderCronMinutes = () => {
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="specific-minute" 
              name="minute-type" 
              checked={specificMinute}
              onChange={() => setSpecificMinute(true)}
              className="text-blue-600"
            />
            <Label htmlFor="specific-minute" className="font-medium text-blue-600">Specific minute (choose one or many)</Label>
          </div>
          
          {specificMinute && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-10 gap-2">
                {minutes.map((minute) => (
                  <div key={minute} className="flex items-center space-x-1">
                    <Checkbox 
                      id={`minute-${minute}`}
                      checked={selectedMinutes.includes(minute)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMinutes([...selectedMinutes, minute]);
                        } else {
                          setSelectedMinutes(selectedMinutes.filter(m => m !== minute));
                        }
                      }}
                      sx={{
                        color: '#C72030',
                        '&.Mui-checked': { color: '#C72030' }
                      }}
                    />
                    <Label htmlFor={`minute-${minute}`} className="text-sm font-medium">{minute}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="every-minute" 
              name="minute-type" 
              checked={!specificMinute}
              onChange={() => setSpecificMinute(false)}
              className="text-blue-600"
            />
            <Label htmlFor="every-minute" className="font-medium">Every minute between minute</Label>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value="00"
                displayEmpty
                sx={{
                  height: { xs: '36px', md: '45px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' }
                }}
              >
                {minutes.map((minute) => (
                  <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <span className="text-sm">and minute</span>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value="00"
                displayEmpty
                sx={{
                  height: { xs: '36px', md: '45px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' }
                }}
              >
                {minutes.map((minute) => (
                  <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    );
  };

  const renderCronHours = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="specific-hour" 
              name="hour-type" 
              checked={specificHour}
              onChange={() => setSpecificHour(true)}
              className="text-blue-600"
            />
            <Label htmlFor="specific-hour" className="font-medium text-blue-600">Specific hour (choose one or many)</Label>
          </div>
          
          {specificHour && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-12 gap-2">
                {hours.map((hour) => (
                  <div key={hour} className="flex items-center space-x-1">
                    <Checkbox 
                      id={`hour-${hour}`}
                      checked={selectedHours.includes(hour)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedHours([...selectedHours, hour]);
                        } else {
                          setSelectedHours(selectedHours.filter(h => h !== hour));
                        }
                      }}
                      sx={{
                        color: '#C72030',
                        '&.Mui-checked': { color: '#C72030' }
                      }}
                    />
                    <Label htmlFor={`hour-${hour}`} className="text-sm font-medium">{hour}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="every-hour" 
              name="hour-type" 
              checked={!specificHour}
              onChange={() => setSpecificHour(false)}
              className="text-blue-600"
            />
            <Label htmlFor="every-hour" className="font-medium">Every hour between hour</Label>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value="00"
                displayEmpty
                sx={{
                  height: { xs: '36px', md: '45px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' }
                }}
              >
                {hours.map((hour) => (
                  <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <span className="text-sm">and hour</span>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value="23"
                displayEmpty
                sx={{
                  height: { xs: '36px', md: '45px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' }
                }}
              >
                {hours.map((hour) => (
                  <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    );
  };

  const renderCronDay = () => {
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="specific-day" 
              name="day-type" 
              checked={specificDay}
              onChange={() => setSpecificDay(true)}
              className="text-blue-600"
            />
            <Label htmlFor="specific-day" className="font-medium text-blue-600">Specific day (choose one or many)</Label>
          </div>
          
          {specificDay && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-10 gap-2">
                {days.map((day) => (
                  <div key={day} className="flex items-center space-x-1">
                    <Checkbox 
                      id={`day-${day}`}
                      checked={selectedDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDays([...selectedDays, day]);
                        } else {
                          setSelectedDays(selectedDays.filter(d => d !== day));
                        }
                      }}
                      sx={{
                        color: '#C72030',
                        '&.Mui-checked': { color: '#C72030' }
                      }}
                    />
                    <Label htmlFor={`day-${day}`} className="text-sm font-medium">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="every-day" 
              name="day-type" 
              checked={!specificDay}
              onChange={() => setSpecificDay(false)}
              className="text-blue-600"
            />
            <Label htmlFor="every-day" className="font-medium">Every day between day</Label>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value="1"
                displayEmpty
                sx={{
                  height: { xs: '36px', md: '45px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' }
                }}
              >
                {days.map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <span className="text-sm">and day</span>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value="31"
                displayEmpty
                sx={{
                  height: { xs: '36px', md: '45px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' }
                }}
              >
                {days.map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    );
  };

  const renderCronMonth = () => {
    const months = [
      { value: '1', label: 'January' },
      { value: '2', label: 'February' },
      { value: '3', label: 'March' },
      { value: '4', label: 'April' },
      { value: '5', label: 'May' },
      { value: '6', label: 'June' },
      { value: '7', label: 'July' },
      { value: '8', label: 'August' },
      { value: '9', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' }
    ];
    
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="specific-month" 
              name="month-type" 
              checked={specificMonth}
              onChange={() => setSpecificMonth(true)}
              className="text-blue-600"
            />
            <Label htmlFor="specific-month" className="font-medium text-blue-600">Specific month (choose one or many)</Label>
          </div>
          
          {specificMonth && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2">
                {months.map((month) => (
                  <div key={month.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`month-${month.value}`}
                      checked={selectedMonths.includes(month.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMonths([...selectedMonths, month.value]);
                        } else {
                          setSelectedMonths(selectedMonths.filter(m => m !== month.value));
                        }
                      }}
                      sx={{
                        color: '#C72030',
                        '&.Mui-checked': { color: '#C72030' }
                      }}
                    />
                    <Label htmlFor={`month-${month.value}`} className="text-sm font-medium">{month.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="every-month" 
              name="month-type" 
              checked={!specificMonth}
              onChange={() => setSpecificMonth(false)}
              className="text-blue-600"
            />
            <Label htmlFor="every-month" className="font-medium">Every month between month</Label>
            <FormControl size="small" sx={{ minWidth: 128 }}>
              <Select
                value="1"
                displayEmpty
                sx={{
                  height: { xs: '36px', md: '45px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' }
                }}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <span className="text-sm">and month</span>
            <FormControl size="small" sx={{ minWidth: 128 }}>
              <Select
                value="12"
                displayEmpty
                sx={{
                  height: { xs: '36px', md: '45px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' }
                }}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Edit Schedule</h1>
        
        {/* Toggle Switches */}
        <div className="flex items-center gap-8 mb-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="create-ticket">Create Ticket</Label>
            <Switch
              id="create-ticket"
              checked={createTicket}
              onCheckedChange={setCreateTicket}
              className="data-[state=checked]:bg-[#C72030]"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Label htmlFor="weightage">Weightage</Label>
            <Switch
              id="weightage"
              checked={weightage}
              onCheckedChange={setWeightage}
              className="data-[state=checked]:bg-[#C72030]"
            />
          </div>
        </div>

        {/* Category Selection when Create Ticket is toggled */}
        {createTicket && (
          <div className="mb-4 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="checklist-level" 
                  name="category-level" 
                  checked={categoryLevel === 'checklist-level'}
                  onChange={() => setCategoryLevel('checklist-level')}
                />
                <Label htmlFor="checklist-level">Checklist Level</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="question-level" 
                  name="category-level" 
                  checked={categoryLevel === 'question-level'}
                  onChange={() => setCategoryLevel('question-level')}
                />
                <Label htmlFor="question-level">Question Level</Label>
              </div>
            </div>
            
            <div>
              <FormControl sx={{ minWidth: 256 }}>
                <InputLabel>Select Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Select Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={muiFieldStyles}
                >
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="non-technical">Non Technical</MenuItem>
                  <MenuItem value="safety">Safety</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">Type</Label>
                <RadioGroup 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  row
                  sx={{ gap: 3, flexWrap: 'wrap' }}
                >
                  <FormControlLabel 
                    value="PPM" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="PPM" 
                  />
                  <FormControlLabel 
                    value="AMC" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="AMC" 
                  />
                  <FormControlLabel 
                    value="Preparedness" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Preparedness" 
                  />
                  <FormControlLabel 
                    value="Hoto" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Hoto" 
                  />
                  <FormControlLabel 
                    value="Routine" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Routine" 
                  />
                  <FormControlLabel 
                    value="Audit" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Audit" 
                  />
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Schedule For</Label>
                <RadioGroup 
                  value={scheduleFor} 
                  onChange={(e) => setScheduleFor(e.target.value)} 
                  row
                  sx={{ gap: 3, flexWrap: 'wrap' }}
                >
                  <FormControlLabel 
                    value="Asset" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Asset" 
                  />
                  <FormControlLabel 
                    value="Service" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Service" 
                  />
                  <FormControlLabel 
                    value="Vendor" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Vendor" 
                  />
                  <FormControlLabel 
                    value="Training" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Training" 
                  />
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <TextField
                label="Activity Name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Enter Activity Name"
                fullWidth
                variant="outlined"
                sx={muiFieldStyles}
              />
            </div>
            <div className="space-y-2">
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                sx={multilineFieldStyles}
              />
            </div>
          </CardContent>
        </Card>

        {/* Task */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#C72030] flex items-center gap-2">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Task
              </CardTitle>
              <Button 
                style={{ backgroundColor: '#C72030' }}
                className="text-white"
                onClick={handleAddSection}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Select Group</InputLabel>
                  <Select
                    value={group}
                    label="Select Group"
                    onChange={(e) => setGroup(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="group1">Group 1</MenuItem>
                    <MenuItem value="group2">Group 2</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Select Sub Group</InputLabel>
                  <Select
                    value={subGroup}
                    label="Select Sub Group"
                    onChange={(e) => setSubGroup(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="subgroup1">Sub Group 1</MenuItem>
                    <MenuItem value="subgroup2">Sub Group 2</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            
            {/* Sections */}
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TextField
                        value={section.name}
                        onChange={(e) => {
                          setSections(sections.map(s => 
                            s.id === section.id ? { ...s, name: e.target.value } : s
                          ));
                        }}
                        sx={muiFieldStyles}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => handleAddQuestion(section.id)}
                        className="border-[#C72030] text-[#C72030]"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                      {sections.length > 1 && (
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveSection(section.id)}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Tasks in this section */}
                  {section.tasks.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task</TableHead>
                          <TableHead>Input Type</TableHead>
                          <TableHead>Mandatory</TableHead>
                          <TableHead>Reading</TableHead>
                          <TableHead>Help Text</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {section.tasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell>
                              <TextField
                                value={task.task}
                                onChange={(e) => handleUpdateTask(section.id, task.id, 'task', e.target.value)}
                                size="small"
                                sx={muiFieldStyles}
                              />
                            </TableCell>
                            <TableCell>
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                  value={task.inputType}
                                  onChange={(e) => handleUpdateTask(section.id, task.id, 'inputType', e.target.value)}
                                  sx={muiFieldStyles}
                                >
                                  <MenuItem value="Text">Text</MenuItem>
                                  <MenuItem value="Numeric">Numeric</MenuItem>
                                  <MenuItem value="Date">Date</MenuItem>
                                  <MenuItem value="Boolean">Boolean</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <Checkbox 
                                checked={task.mandatory}
                                onChange={(e) => handleUpdateTask(section.id, task.id, 'mandatory', e.target.checked)}
                                sx={{
                                  color: '#C72030',
                                  '&.Mui-checked': { color: '#C72030' }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Checkbox 
                                checked={task.reading}
                                onChange={(e) => handleUpdateTask(section.id, task.id, 'reading', e.target.checked)}
                                sx={{
                                  color: '#C72030',
                                  '&.Mui-checked': { color: '#C72030' }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Checkbox 
                                checked={task.helpText}
                                onChange={(e) => handleUpdateTask(section.id, task.id, 'helpText', e.target.checked)}
                                sx={{
                                  color: '#C72030',
                                  '&.Mui-checked': { color: '#C72030' }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveQuestion(section.id, task.id)}
                                className="border-red-500 text-red-500 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Asset</InputLabel>
                <Select
                  value={asset}
                  label="Select Asset"
                  onChange={(e) => setAsset(e.target.value)}
                  sx={muiFieldStyles}
                >
                  <MenuItem value="Energy Meter 1[584931186764c2f8b565]">Energy Meter 1[584931186764c2f8b565]</MenuItem>
                  <MenuItem value="Energy Meter 23[03835269926136105d:1]">Energy Meter 23[03835269926136105d:1]</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    value={assignTo}
                    label="Assign To"
                    onChange={(e) => setAssignTo(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="Users">Users</MenuItem>
                    <MenuItem value="Groups">Groups</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Scan Type</InputLabel>
                  <Select
                    value={scanType}
                    label="Scan Type"
                    onChange={(e) => setScanType(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="qr">QR Code</MenuItem>
                    <MenuItem value="barcode">Barcode</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <FormControl variant="outlined" sx={{ flex: 1 }}>
                    <InputLabel>Duration</InputLabel>
                    <Select
                      value={planDuration}
                      label="Duration"
                      onChange={(e) => setPlanDuration(e.target.value)}
                      sx={muiFieldStyles}
                    >
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Hour">Hour</MenuItem>
                      <MenuItem value="Week">Week</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Value"
                    value={planDurationField}
                    onChange={(e) => setPlanDurationField(e.target.value)}
                    sx={{
                      width: 80,
                      ...muiFieldStyles
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priority}
                    label="Priority"
                    onChange={(e) => setPriority(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Email Trigger Rule</InputLabel>
                  <Select
                    value={emailTriggerRule}
                    label="Email Trigger Rule"
                    onChange={(e) => setEmailTriggerRule(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="rule1">Rule 1</MenuItem>
                    <MenuItem value="rule2">Rule 2</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Supervisors</InputLabel>
                  <Select
                    value={supervisors}
                    label="Supervisors"
                    onChange={(e) => setSupervisors(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="supervisor1">Supervisor 1</MenuItem>
                    <MenuItem value="supervisor2">Supervisor 2</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Non Technical">Non Technical</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Submission Time</InputLabel>
                  <Select
                    value={submissionTime}
                    label="Submission Time"
                    onChange={(e) => setSubmissionTime(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="immediate">Immediate</MenuItem>
                    <MenuItem value="delayed">Delayed</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <TextField
                  label="Submission Time Field"
                  value={submissionTimeField}
                  onChange={(e) => setSubmissionTimeField(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={muiFieldStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <FormControl variant="outlined" sx={{ flex: 1 }}>
                    <InputLabel>Grace Time</InputLabel>
                    <Select
                      value={graceTime}
                      label="Grace Time"
                      onChange={(e) => setGraceTime(e.target.value)}
                      sx={muiFieldStyles}
                    >
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Hour">Hour</MenuItem>
                      <MenuItem value="Week">Week</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Value"
                    value={graceTimeField}
                    onChange={(e) => setGraceTimeField(e.target.value)}
                    sx={{
                      width: 80,
                      ...muiFieldStyles
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Lock Overdue Task</InputLabel>
                  <Select
                    value={lockOverdueTask}
                    label="Lock Overdue Task"
                    onChange={(e) => setLockOverdueTask(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="space-y-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={frequency}
                    label="Frequency"
                    onChange={(e) => setFrequency(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <TextField
                  label="Cron Expression"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={muiFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="Start From"
                  type="date"
                  value={startFrom}
                  onChange={(e) => setStartFrom(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={muiFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="End At"
                  type="date"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={muiFieldStyles}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Supplier</InputLabel>
                <Select
                  value={selectSupplier}
                  label="Select Supplier"
                  onChange={(e) => setSelectSupplier(e.target.value)}
                  sx={muiFieldStyles}
                >
                  <MenuItem value="supplier1">Supplier 1</MenuItem>
                  <MenuItem value="supplier2">Supplier 2</MenuItem>
                </Select>
              </FormControl>
            </div>
          </CardContent>
        </Card>

        {/* Cron Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#C72030] flex items-center gap-2">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Cron Settings
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Label htmlFor="edit-timings" className="font-medium">Edit Timings</Label>
                <Checkbox 
                  id="edit-timings"
                  checked={editTimings}
                  onChange={(e) => setEditTimings(e.target.checked)}
                  sx={{
                    color: '#C72030',
                    '&.Mui-checked': { color: '#C72030' }
                  }}
                />
              </div>
            </div>
          </CardHeader>
          {editTimings && (
            <CardContent className="space-y-6">
              <div className="text-sm text-gray-600">
                The Previous Cron was 0 9 * * *
              </div>

              <div className="border-b border-gray-200">
                <div className="flex space-x-0">
                  {['Minutes', 'Hours', 'Day', 'Month'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCronTab(tab)}
                      className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                        cronTab === tab
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                {cronTab === 'Minutes' && renderCronMinutes()}
                {cronTab === 'Hours' && renderCronHours()}
                {cronTab === 'Day' && renderCronDay()}
                {cronTab === 'Month' && renderCronMonth()}
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                <div className="text-lg font-semibold mb-4 text-gray-800">Resulting Cron Expression: 0,9 * ? * *</div>
                
                <div className="grid grid-cols-5 gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-700 mb-2">Minutes</div>
                    <div className="text-lg font-mono text-blue-600">0,9</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-700 mb-2">Hours</div>
                    <div className="text-lg font-mono text-gray-500">*</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-700 mb-2">Day Of Month</div>
                    <div className="text-lg font-mono text-gray-500">?</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-700 mb-2">Month</div>
                    <div className="text-lg font-mono text-gray-500">*</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-700 mb-2">Day Of Week</div>
                    <div className="text-lg font-mono text-gray-500">*</div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Associations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
              Associations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Model Number</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Purchase Cost</TableHead>
                  <TableHead>Created on</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {associationsData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.assetName}</TableCell>
                    <TableCell>{item.assetCode}</TableCell>
                    <TableCell>{item.modelNumber}</TableCell>
                    <TableCell>{item.purchaseDate}</TableCell>
                    <TableCell>{item.purchaseCost}</TableCell>
                    <TableCell>{item.createdOn}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Email Trigger Rule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
              Email Trigger Rule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Trigger Type</TableHead>
                  <TableHead>Trigger To</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Period Value</TableHead>
                  <TableHead>Period Type</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Empty table for now */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Asset Mapping List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
              Asset Mapping List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Kwah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Energy Meter 1</TableCell>
                  <TableCell>Electric Meter</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Energy Meter 23</TableCell>
                  <TableCell>Start Reading</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button 
            onClick={() => navigate('/maintenance/schedule')}
            variant="outline"
            className="px-8"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8"
          >
            Update Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};
