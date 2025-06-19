import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: boolean;
  options: Array<{ id: number; text: string; value: string }>;
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
  const [tasks, setTasks] = useState<Question[]>([
    {
      id: 1,
      text: 'Question 1',
      inputType: 'Radio Button',
      mandatory: false,
      reading: false,
      helpText: false,
      options: [
        { id: 1, text: 'Yes', value: 'yes' },
        { id: 2, text: 'No', value: 'no' }
      ]
    }
  ]);

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
    minuteRange: { start: 0, end: 0 },
    hourRange: { start: 0, end: 0 },
    dayRange: { start: 1, end: 1 },
    monthRange: { start: 1, end: 1 },
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
    setTasks(prev => prev.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId: number) => {
    setTasks(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: [...q.options, { 
              id: Date.now(), 
              text: '', 
              value: '' 
            }] 
          }
        : q
    ));
  };

  const removeOption = (questionId: number, optionId: number) => {
    setTasks(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.filter(opt => opt.id !== optionId) }
        : q
    ));
  };

  const updateOption = (questionId: number, optionId: number, field: string, value: string) => {
    setTasks(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map(opt => 
              opt.id === optionId ? { ...opt, [field]: value } : opt
            ) 
          }
        : q
    ));
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
    const { selectedMinutes, selectedHours, selectedDays, selectedMonths, activeTab } = cronSettings;
    
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
            <p className="text-sm text-gray-700">Specify minute (choose one or more)</p>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 60 }, (_, i) => (
                <Button
                  key={i}
                  variant={cronSettings.selectedMinutes.includes(i) ? "default" : "outline"}
                  size="sm"
                  className={`text-xs h-8 w-8 ${
                    cronSettings.selectedMinutes.includes(i) 
                      ? "bg-[#C72030] text-white hover:bg-[#A01A28]" 
                      : ""
                  }`}
                  onClick={() => toggleMinute(i)}
                >
                  {i.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="every-minute" 
                  name="minute-option" 
                  checked={cronSettings.minuteOption === 'range'}
                  onChange={() => setCronSettings(prev => ({...prev, minuteOption: 'range'}))}
                />
                <Label htmlFor="every-minute">Every minute between minute</Label>
              </div>
              <Select 
                value={cronSettings.minuteRange.start.toString().padStart(2, '0')} 
                onValueChange={(value) => setCronSettings(prev => ({
                  ...prev, 
                  minuteRange: { ...prev.minuteRange, start: parseInt(value) }
                }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>and minute</span>
              <Select 
                value={cronSettings.minuteRange.end.toString().padStart(2, '0')} 
                onValueChange={(value) => setCronSettings(prev => ({
                  ...prev, 
                  minuteRange: { ...prev.minuteRange, end: parseInt(value) }
                }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'Hours':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">Specify hour (choose one or more)</p>
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 24 }, (_, i) => (
                <Button
                  key={i}
                  variant={cronSettings.selectedHours.includes(i) ? "default" : "outline"}
                  size="sm"
                  className={`text-xs h-8 w-8 ${
                    cronSettings.selectedHours.includes(i) 
                      ? "bg-[#C72030] text-white hover:bg-[#A01A28]" 
                      : ""
                  }`}
                  onClick={() => toggleHour(i)}
                >
                  {i.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </div>
        );
      
      case 'Day':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">Specify day of month (choose one or more)</p>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 31 }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={cronSettings.selectedDays.includes(i + 1) ? "default" : "outline"}
                  size="sm"
                  className={`text-xs h-8 ${
                    cronSettings.selectedDays.includes(i + 1) 
                      ? "bg-[#C72030] text-white hover:bg-[#A01A28]" 
                      : ""
                  }`}
                  onClick={() => toggleDay(i + 1)}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </div>
        );
      
      case 'Month':
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">Specify month (choose one or more)</p>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={cronSettings.selectedMonths.includes(i + 1) ? "default" : "outline"}
                  size="sm"
                  className={`text-xs h-8 ${
                    cronSettings.selectedMonths.includes(i + 1) 
                      ? "bg-[#C72030] text-white hover:bg-[#A01A28]" 
                      : ""
                  }`}
                  onClick={() => toggleMonth(i + 1)}
                >
                  {monthNames[i]}
                </Button>
              ))}
            </div>
          </div>
        );
      
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
      topControls: { createNew, createTicket, weightage, templateSelection, ticketLevel, assignedTo, ticketCategory }
    });
    toast.success('Vendor audit schedule created successfully!');
    navigate('/maintenance/audit/vendor/scheduled');
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Maintenance</span>
          <span className="mx-2">{'>'}</span>
          <span>Audit</span>
          <span className="mx-2">{'>'}</span>
          <span>Vendor</span>
          <span className="mx-2">{'>'}</span>
          <span>Scheduled</span>
          <span className="mx-2">{'>'}</span>
          <span>Copy</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">COPY VENDOR AUDIT SCHEDULE</h1>
      </div>

      {/* Top Controls */}
      <div className="flex items-center gap-8 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* Create New */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="createNew" className="text-sm font-medium">Create New</Label>
            <Switch 
              id="createNew" 
              checked={createNew}
              onCheckedChange={(checked) => setCreateNew(checked)}
            />
          </div>
          {createNew && (
            <Select value={templateSelection} onValueChange={setTemplateSelection}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select from the existing Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template1">Template 1</SelectItem>
                <SelectItem value="template2">Template 2</SelectItem>
                <SelectItem value="template3">Template 3</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Create Ticket */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="createTicket" className="text-sm font-medium">Create Ticket</Label>
            <Switch 
              id="createTicket" 
              checked={createTicket}
              onCheckedChange={(checked) => setCreateTicket(checked)}
            />
          </div>
          {createTicket && (
            <div className="flex items-center gap-4">
              <RadioGroup 
                value={ticketLevel} 
                onValueChange={setTicketLevel}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="checklist" id="checklist-level" />
                  <Label htmlFor="checklist-level" className="text-sm">Checklist Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="question" id="question-level" />
                  <Label htmlFor="question-level" className="text-sm">Question Level</Label>
                </div>
              </RadioGroup>
              
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Assigned To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">User 1</SelectItem>
                  <SelectItem value="user2">User 2</SelectItem>
                  <SelectItem value="user3">User 3</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={ticketCategory} onValueChange={setTicketCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">Category 1</SelectItem>
                  <SelectItem value="category2">Category 2</SelectItem>
                  <SelectItem value="category3">Category 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Weightage */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="weightage" className="text-sm font-medium">Weightage</Label>
          <Switch 
            id="weightage" 
            checked={weightage}
            onCheckedChange={(checked) => setWeightage(checked)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C72030]">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Type Section */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Type</Label>
                <RadioGroup 
                  value={basicInfo.type} 
                  onValueChange={(value) => setBasicInfo(prev => ({...prev, type: value}))}
                  className="flex flex-wrap gap-4"
                >
                  {['PPM', 'AMC', 'Preparedness', 'HOTO', 'Routine', 'Audit'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type.toLowerCase()} />
                      <Label htmlFor={type.toLowerCase()}>{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Schedule For Section */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Schedule For</Label>
                <RadioGroup 
                  value={basicInfo.scheduleFor} 
                  onValueChange={(value) => setBasicInfo(prev => ({...prev, scheduleFor: value}))}
                  className="flex flex-wrap gap-4"
                >
                  {['Asset', 'Service', 'Vendor', 'Training'].map((schedule) => (
                    <div key={schedule} className="flex items-center space-x-2">
                      <RadioGroupItem value={schedule} id={schedule.toLowerCase()} />
                      <Label htmlFor={schedule.toLowerCase()}>{schedule}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="activityName" className="text-sm font-medium">
                  Activity Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="activityName"
                  value={basicInfo.activityName}
                  onChange={(e) => setBasicInfo(prev => ({...prev, activityName: e.target.value}))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter Description"
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo(prev => ({...prev, description: e.target.value}))}
                  className="mt-1"
                  rows={3}
                />
              </div>
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
                onClick={addNewQuestion}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:opacity-90"
              >
                + Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {tasks.map((task, index) => (
              <div key={task.id} className="space-y-4 border-b pb-6 last:border-b-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Select Group</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Daily Calculation Log" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily-calc">Daily Calculation Log</SelectItem>
                        <SelectItem value="weekly-report">Weekly Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Select Sub-Group</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="IT Block MLT" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it-block-mlt">IT Block MLT</SelectItem>
                        <SelectItem value="main-block">Main Block</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Task</Label>
                    <Input 
                      placeholder="Question 1"
                      value={task.text}
                      onChange={(e) => updateQuestion(task.id, 'text', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Input Type</Label>
                    <Select 
                      value={task.inputType} 
                      onValueChange={(value) => updateQuestion(task.id, 'inputType', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Radio Button" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Radio Button">Radio Button</SelectItem>
                        <SelectItem value="Checkbox">Checkbox</SelectItem>
                        <SelectItem value="Text">Text</SelectItem>
                        <SelectItem value="Number">Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`mandatory-${task.id}`}
                        checked={task.mandatory}
                        onCheckedChange={(checked) => updateQuestion(task.id, 'mandatory', checked)}
                      />
                      <Label htmlFor={`mandatory-${task.id}`}>Mandatory</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`reading-${task.id}`}
                        checked={task.reading}
                        onCheckedChange={(checked) => updateQuestion(task.id, 'reading', checked)}
                      />
                      <Label htmlFor={`reading-${task.id}`}>Reading</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`helpText-${task.id}`}
                        checked={task.helpText}
                        onCheckedChange={(checked) => updateQuestion(task.id, 'helpText', checked)}
                      />
                      <Label htmlFor={`helpText-${task.id}`}>Help Text</Label>
                    </div>
                  </div>
                </div>

                {/* Options Section */}
                {task.inputType === 'Radio Button' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">Selected Enter Value</Label>
                      <Button
                        onClick={() => addOption(task.id)}
                        size="sm"
                        style={{ backgroundColor: '#C72030' }}
                        className="text-white hover:opacity-90"
                      >
                        Add Option
                      </Button>
                    </div>
                    
                    {task.options.map((option, optIndex) => (
                      <div key={option.id} className="flex items-center gap-4">
                        <div className="w-4">
                          <input type="radio" name={`task-${task.id}`} />
                        </div>
                        <Input
                          placeholder="Option text"
                          value={option.text}
                          onChange={(e) => updateOption(task.id, option.id, 'text', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={option.value}
                          onChange={(e) => updateOption(task.id, option.id, 'value', e.target.value)}
                          className="w-20"
                        />
                        {task.options.length > 1 && (
                          <Button
                            onClick={() => removeOption(task.id, option.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {tasks.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => removeQuestion(task.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove Question
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-4">
              <Button 
                onClick={addNewQuestion}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:opacity-90"
              >
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
              <RadioGroup 
                value={scheduleInfo.checklistType} 
                onValueChange={(value) => setScheduleInfo(prev => ({...prev, checklistType: value}))}
                className="flex gap-6"
              >
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Asset</Label>
                <Select value={scheduleInfo.asset} onValueChange={(value) => setScheduleInfo(prev => ({...prev, asset: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset1">Asset 1</SelectItem>
                    <SelectItem value="asset2">Asset 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Assign To</Label>
                <Select value={scheduleInfo.assignTo} onValueChange={(value) => setScheduleInfo(prev => ({...prev, assignTo: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Assign To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">User 1</SelectItem>
                    <SelectItem value="user2">User 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Scan Type</Label>
                <Select value={scheduleInfo.scanType} onValueChange={(value) => setScheduleInfo(prev => ({...prev, scanType: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Scan Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qr">QR Code</SelectItem>
                    <SelectItem value="barcode">Barcode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Plan Duration</Label>
                <Select value={scheduleInfo.planDuration} onValueChange={(value) => setScheduleInfo(prev => ({...prev, planDuration: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Plan Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 Minutes</SelectItem>
                    <SelectItem value="1hour">1 Hour</SelectItem>
                    <SelectItem value="2hours">2 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <Select value={scheduleInfo.priority} onValueChange={(value) => setScheduleInfo(prev => ({...prev, priority: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Email Trigger Rule</Label>
                <Select value={scheduleInfo.emailTriggerRule} onValueChange={(value) => setScheduleInfo(prev => ({...prev, emailTriggerRule: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Email Trigger Rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Supervision</Label>
                <Select value={scheduleInfo.supervision} onValueChange={(value) => setScheduleInfo(prev => ({...prev, supervision: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Supervision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor1">Supervisor 1</SelectItem>
                    <SelectItem value="supervisor2">Supervisor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select value={scheduleInfo.category} onValueChange={(value) => setScheduleInfo(prev => ({...prev, category: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Submission Time</Label>
                <Select value={scheduleInfo.submissionTime} onValueChange={(value) => setScheduleInfo(prev => ({...prev, submissionTime: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Submission Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="17:00">05:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Grace Time</Label>
                <Select value={scheduleInfo.graceTime} onValueChange={(value) => setScheduleInfo(prev => ({...prev, graceTime: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Grace Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">15 Minutes</SelectItem>
                    <SelectItem value="30min">30 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Lock Overdue Task</Label>
                <Select value={scheduleInfo.lockOverdueTask} onValueChange={(value) => setScheduleInfo(prev => ({...prev, lockOverdueTask: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Lock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Frequency</Label>
                <Select value={scheduleInfo.frequency} onValueChange={(value) => setScheduleInfo(prev => ({...prev, frequency: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Start From</Label>
                <Input
                  type="date"
                  value={scheduleInfo.startFrom}
                  onChange={(e) => setScheduleInfo(prev => ({...prev, startFrom: e.target.value}))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">End At</Label>
                <Input
                  type="date"
                  value={scheduleInfo.endAt}
                  onChange={(e) => setScheduleInfo(prev => ({...prev, endAt: e.target.value}))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Select Supplier</Label>
                <Select value={scheduleInfo.selectSupplier} onValueChange={(value) => setScheduleInfo(prev => ({...prev, selectSupplier: value}))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier1">Supplier 1</SelectItem>
                    <SelectItem value="supplier2">Supplier 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  onClick={() => setCronSettings(prev => ({...prev, activeTab: tab}))}
                  style={cronSettings.activeTab === tab ? { backgroundColor: '#C72030' } : {}}
                  className={cronSettings.activeTab === tab ? "text-white hover:bg-[#A01A28]" : ""}
                >
                  {tab}
                </Button>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
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
    </div>
  );
};
