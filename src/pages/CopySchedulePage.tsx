import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Select, MenuItem, FormControl, InputLabel, Radio, RadioGroup, FormControlLabel, Checkbox, Box } from '@mui/material';

const muiFieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: {
      xs: '36px',
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
    color: '#999999',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#C72030'
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: '#FFFFFF',
      padding: '0 4px'
    }
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#1A1A1A',
    fontSize: '16px',
    padding: {
      xs: '8px 14px',
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
  ...muiFieldStyles,
  '& .MuiOutlinedInput-root': {
    ...muiFieldStyles['& .MuiOutlinedInput-root'],
    height: 'auto',
    alignItems: 'flex-start'
  }
};

export const CopySchedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Toggle states
  const [createNew, setCreateNew] = useState(false);
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);

  // Create Ticket state
  const [categoryLevel, setCategoryLevel] = useState('question-level');
  const [assignedTo, setAssignedTo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Basic Info state
  const [type, setType] = useState('PPM');
  const [activityName, setActivityName] = useState('meter reading');
  const [description, setDescription] = useState('');
  const [scheduleFor, setScheduleFor] = useState('Asset');

  // Task state
  const [group, setGroup] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [sections, setSections] = useState([
    { 
      id: 1, 
      name: 'Section 1', 
      tasks: [
        { 
          id: 1, 
          task: 'Kwah', 
          inputType: 'Numeric', 
          mandatory: true, 
          reading: true, 
          helpText: false,
          weightageValue: '',
          rating: false
        }
      ]
    }
  ]);

  // Schedule state
  const [checklistType, setChecklistType] = useState('Individual');
  const [asset, setAsset] = useState('Energy Meter 1[584931186764c2f8b565]');
  const [assignTo, setAssignTo] = useState('Users');
  const [selectUser, setSelectUser] = useState('Ashiq Rasul');
  const [scanType, setScanType] = useState('');
  const [planDuration, setPlanDuration] = useState('Day');
  const [planDurationField, setPlanDurationField] = useState('1');
  const [priority, setPriority] = useState('');
  const [emailTriggerRule, setEmailTriggerRule] = useState('');
  const [supervisors, setSupervisors] = useState('');
  const [category, setCategory] = useState('Technical');
  const [submissionTime, setSubmissionTime] = useState('');
  const [graceTime, setGraceTime] = useState('Day');
  const [graceTimeField, setGraceTimeField] = useState('3');
  const [lockOverdueTask, setLockOverdueTask] = useState('');
  const [frequency, setFrequency] = useState('');
  const [cronExpression, setCronExpression] = useState('0 0 * * *');
  const [startFrom, setStartFrom] = useState('01/05/2025');
  const [endAt, setEndAt] = useState('31/05/2025');
  const [selectSupplier, setSelectSupplier] = useState('');

  // Cron settings state
  const [cronType, setCronType] = useState('Minutes');
  const [specificMinute, setSpecificMinute] = useState(false);
  const [everyMinute, setEveryMinute] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState([]);
  const [selectedHours, setSelectedHours] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

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
      helpText: false,
      weightageValue: '',
      rating: false
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
    console.log('Schedule copied successfully');
    navigate('/maintenance/schedule');
  };

  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const dayOptions = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Copy Schedule</h1>
        
        {/* Toggle Switches - Horizontal Layout */}
        <div className="flex items-center gap-8 mb-6">
          {/* Create New Toggle */}
          <div className="flex items-center gap-3">
            <Label htmlFor="create-new">Create New</Label>
            <Switch
              id="create-new"
              checked={createNew}
              onCheckedChange={setCreateNew}
              className="data-[state=checked]:bg-[#C72030]"
            />
          </div>

          {/* Create Ticket Toggle */}
          <div className="flex items-center gap-3">
            <Label htmlFor="create-ticket">Create Ticket</Label>
            <Switch
              id="create-ticket"
              checked={createTicket}
              onCheckedChange={setCreateTicket}
              className="data-[state=checked]:bg-[#C72030]"
            />
          </div>

          {/* Weightage Toggle */}
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

        {/* Dropdown sections for each toggle */}
        <div className="space-y-4">
          {/* Create New Dropdown */}
          {createNew && (
            <div className="ml-6">
              <FormControl sx={{ minWidth: 256 }}>
                <InputLabel>Select from the existing Template</InputLabel>
                <Select 
                  value=""
                  label="Select from the existing Template"
                  sx={muiFieldStyles}
                >
                  <MenuItem value="template1">Template 1</MenuItem>
                  <MenuItem value="template2">Template 2</MenuItem>
                  <MenuItem value="template3">Template 3</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {/* Create Ticket Dropdown */}
          {createTicket && (
            <div className="ml-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input 
                      type="radio" 
                      id="checklist-level" 
                      name="category-level" 
                      checked={categoryLevel === 'checklist-level'}
                      onChange={() => setCategoryLevel('checklist-level')}
                      className="sr-only"
                    />
                    <label 
                      htmlFor="checklist-level" 
                      className="flex items-center cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 ${
                        categoryLevel === 'checklist-level' 
                          ? 'border-[#C72030] bg-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {categoryLevel === 'checklist-level' && (
                          <div className="w-3 h-3 rounded-full bg-[#C72030]"></div>
                        )}
                      </div>
                      <span className="text-sm">Checklist Level</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input 
                      type="radio" 
                      id="question-level" 
                      name="category-level" 
                      checked={categoryLevel === 'question-level'}
                      onChange={() => setCategoryLevel('question-level')}
                      className="sr-only"
                    />
                    <label 
                      htmlFor="question-level" 
                      className="flex items-center cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 ${
                        categoryLevel === 'question-level' 
                          ? 'border-[#C72030] bg-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {categoryLevel === 'question-level' && (
                          <div className="w-3 h-3 rounded-full bg-[#C72030]"></div>
                        )}
                      </div>
                      <span className="text-sm">Question Level</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <FormControl sx={{ minWidth: 256 }}>
                  <InputLabel>Select Assigned To</InputLabel>
                  <Select 
                    value={assignedTo} 
                    label="Select Assigned To"
                    onChange={(e) => setAssignedTo(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="user1">User 1</MenuItem>
                    <MenuItem value="user2">User 2</MenuItem>
                    <MenuItem value="group1">Group 1</MenuItem>
                  </Select>
                </FormControl>
              </div>
              
              <div className="space-y-2">
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
                <RadioGroup value={type} onChange={(e) => setType(e.target.value)} row sx={{ gap: 3, flexWrap: 'wrap' }}>
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
                <RadioGroup value={scheduleFor} onChange={(e) => setScheduleFor(e.target.value)} row sx={{ gap: 3, flexWrap: 'wrap' }}>
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
                placeholder="Activity Name"
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
                  <InputLabel>Select Sub-Group</InputLabel>
                  <Select 
                    value={subGroup} 
                    label="Select Sub-Group" 
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
                  {section.tasks.map((task) => (
                    <div key={task.id} className="space-y-4 border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <TextField
                            label="Task"
                            value={task.task}
                            onChange={(e) => handleUpdateTask(section.id, task.id, 'task', e.target.value)}
                            placeholder="Enter Task"
                            fullWidth
                            variant="outlined"
                            sx={muiFieldStyles}
                          />
                        </div>
                        <div className="space-y-2">
                          <FormControl fullWidth variant="outlined">
                            <InputLabel>Input Type</InputLabel>
                            <Select 
                              value={task.inputType} 
                              label="Input Type"
                              onChange={(e) => handleUpdateTask(section.id, task.id, 'inputType', e.target.value)}
                              sx={muiFieldStyles}
                            >
                              <MenuItem value="Text">Text</MenuItem>
                              <MenuItem value="Numeric">Numeric</MenuItem>
                              <MenuItem value="Date">Date</MenuItem>
                              <MenuItem value="Boolean">Boolean</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mandatory-${task.id}`}
                            checked={task.mandatory}
                            onChange={(e) => handleUpdateTask(section.id, task.id, 'mandatory', e.target.checked)}
                            sx={{
                              color: '#C72030',
                              '&.Mui-checked': {
                                color: '#C72030'
                              }
                            }}
                          />
                          <Label htmlFor={`mandatory-${task.id}`}>Mandatory</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`reading-${task.id}`}
                            checked={task.reading}
                            onChange={(e) => handleUpdateTask(section.id, task.id, 'reading', e.target.checked)}
                            sx={{
                              color: '#C72030',
                              '&.Mui-checked': {
                                color: '#C72030'
                              }
                            }}
                          />
                          <Label htmlFor={`reading-${task.id}`}>Reading</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`helptext-${task.id}`}
                            checked={task.helpText}
                            onChange={(e) => handleUpdateTask(section.id, task.id, 'helpText', e.target.checked)}
                            sx={{
                              color: '#C72030',
                              '&.Mui-checked': {
                                color: '#C72030'
                              }
                            }}
                          />
                          <Label htmlFor={`helptext-${task.id}`}>Help Text</Label>
                        </div>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveQuestion(section.id, task.id)}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Weightage section - only show if weightage toggle is on */}
                      {weightage && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div className="space-y-2">
                            <TextField
                              label="Weightage"
                              value={task.weightageValue}
                              onChange={(e) => handleUpdateTask(section.id, task.id, 'weightageValue', e.target.value)}
                              placeholder="Enter Weightage"
                              fullWidth
                              variant="outlined"
                              sx={muiFieldStyles}
                            />
                          </div>
                          <div className="flex items-center gap-4 pt-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`rating-${task.id}`}
                                checked={task.rating}
                                onChange={(e) => handleUpdateTask(section.id, task.id, 'rating', e.target.checked)}
                                sx={{
                                  color: '#C72030',
                                  '&.Mui-checked': {
                                    color: '#C72030'
                                  }
                                }}
                              />
                              <Label htmlFor={`rating-${task.id}`}>Rating</Label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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
              <Label>Checklist Type</Label>
              <RadioGroup value={checklistType} onChange={(e) => setChecklistType(e.target.value)} row sx={{ gap: 2 }}>
                <FormControlLabel 
                  value="Individual" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="Individual" 
                />
                <FormControlLabel 
                  value="Asset Asset Group" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="Asset Asset Group" 
                />
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Asset</InputLabel>
                <Select 
                  value={asset} 
                  label="Asset"
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
                  <InputLabel>Select User</InputLabel>
                  <Select 
                    value={selectUser} 
                    label="Select User"
                    onChange={(e) => setSelectUser(e.target.value)}
                    sx={muiFieldStyles}
                  >
                    <MenuItem value="Ashiq Rasul">Ashiq Rasul</MenuItem>
                    <MenuItem value="John Doe">John Doe</MenuItem>
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Plan Duration</Label>
                <div className="flex gap-2">
                  <FormControl variant="outlined" style={{ width: '100%' }}>
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
                    sx={{ width: 80, ...muiFieldStyles }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <TextField
                  label="Plan Duration Type"
                  value="1"
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  sx={muiFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="Plan value"
                  value="1"
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  sx={muiFieldStyles}
                />
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
                  <InputLabel>Submission Type</InputLabel>
                  <Select 
                    value={submissionTime} 
                    label="Submission Type"
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
                  label="Submission Time Value"
                  placeholder="Enter value"
                  fullWidth
                  variant="outlined"
                  sx={muiFieldStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Grace Time</Label>
                <div className="flex gap-2">
                  <FormControl variant="outlined" style={{ width: '100%' }}>
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
                    sx={{ width: 80, ...muiFieldStyles }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <TextField
                  label="Grace Time Value"
                  value="3"
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  sx={muiFieldStyles}
                />
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
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                  label="Start Time"
                  value={startFrom}
                  onChange={(e) => setStartFrom(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={muiFieldStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  label="End At"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={muiFieldStyles}
                />
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
            </div>
          </CardContent>
        </Card>

        {/* Cron form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center gap-2">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Cron form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Button 
                variant={cronType === 'Minutes' ? 'default' : 'outline'}
                onClick={() => setCronType('Minutes')}
                style={cronType === 'Minutes' ? { backgroundColor: '#3B82F6' } : {}}
                className={cronType === 'Minutes' ? 'text-white' : ''}
              >
                Minutes
              </Button>
              <Button 
                variant={cronType === 'Hours' ? 'default' : 'outline'}
                onClick={() => setCronType('Hours')}
                style={cronType === 'Hours' ? { backgroundColor: '#3B82F6' } : {}}
                className={cronType === 'Hours' ? 'text-white' : ''}
              >
                Hours
              </Button>
              <Button 
                variant={cronType === 'Day' ? 'default' : 'outline'}
                onClick={() => setCronType('Day')}
                style={cronType === 'Day' ? { backgroundColor: '#3B82F6' } : {}}
                className={cronType === 'Day' ? 'text-white' : ''}
              >
                Day
              </Button>
              <Button 
                variant={cronType === 'Month' ? 'default' : 'outline'}
                onClick={() => setCronType('Month')}
                style={cronType === 'Month' ? { backgroundColor: '#3B82F6' } : {}}
                className={cronType === 'Month' ? 'text-white' : ''}
              >
                Month
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="specific-minute" 
                  checked={specificMinute}
                  onChange={(e) => setSpecificMinute(e.target.checked)}
                  sx={{
                    color: '#C72030',
                    '&.Mui-checked': {
                      color: '#C72030'
                    }
                  }}
                />
                <Label htmlFor="specific-minute">Specific minute (choose one or many)</Label>
              </div>

              {cronType === 'Minutes' && (
                <div className="grid grid-cols-10 gap-2">
                  {minuteOptions.map((minute) => (
                    <div key={minute} className="flex items-center space-x-1">
                      <Checkbox 
                        id={`minute-${minute}`} 
                        onChange={(e) => console.log(`Minute ${minute}:`, e.target.checked)}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': {
                            color: '#C72030'
                          }
                        }}
                      />
                      <Label htmlFor={`minute-${minute}`} className="text-xs">{minute}</Label>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label>Every minute between minute</Label>
                <div className="flex items-center gap-2">
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select 
                      value="00"
                      sx={{
                        height: { xs: '36px', md: '45px' },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e5e7eb'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#C72030'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#C72030'
                        }
                      }}
                    >
                      {minuteOptions.map((minute) => (
                        <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <span>and minute</span>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select 
                      value="00"
                      sx={{
                        height: { xs: '36px', md: '45px' },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e5e7eb'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#C72030'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#C72030'
                        }
                      }}
                    >
                      {minuteOptions.map((minute) => (
                        <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div>
                    <Label className="font-medium">Minutes</Label>
                    <div className="text-2xl font-bold">0</div>
                  </div>
                  <div>
                    <Label className="font-medium">Hours</Label>
                    <div className="text-2xl font-bold">0</div>
                  </div>
                  <div>
                    <Label className="font-medium">Day Of Month</Label>
                    <div className="text-2xl font-bold">*</div>
                  </div>
                  <div>
                    <Label className="font-medium">Month</Label>
                    <div className="text-2xl font-bold">*</div>
                  </div>
                  <div>
                    <Label className="font-medium">Day Of Week</Label>
                    <div className="text-2xl font-bold">*</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Label className="font-medium">Resulting Cron Expression: 0 0 * * *</Label>
              </div>
            </div>
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
            Create Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};
