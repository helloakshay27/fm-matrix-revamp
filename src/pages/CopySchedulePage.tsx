
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Upload, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

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
              <Select>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select from the existing Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template1">Template 1</SelectItem>
                  <SelectItem value="template2">Template 2</SelectItem>
                  <SelectItem value="template3">Template 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Create Ticket Dropdown */}
          {createTicket && (
            <div className="ml-6 space-y-3">
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
              
              <div className="space-y-2">
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select Assigned To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">User 1</SelectItem>
                    <SelectItem value="user2">User 2</SelectItem>
                    <SelectItem value="group1">Group 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="non-technical">Non Technical</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">Type</Label>
                <RadioGroup value={type} onValueChange={setType} className="flex gap-6 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PPM" id="ppm" />
                    <Label htmlFor="ppm">PPM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AMC" id="amc" />
                    <Label htmlFor="amc">AMC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Preparedness" id="preparedness" />
                    <Label htmlFor="preparedness">Preparedness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hoto" id="hoto" />
                    <Label htmlFor="hoto">Hoto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Routine" id="routine" />
                    <Label htmlFor="routine">Routine</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Audit" id="audit" />
                    <Label htmlFor="audit">Audit</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Schedule For</Label>
                <RadioGroup value={scheduleFor} onValueChange={setScheduleFor} className="flex gap-6 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Asset" id="asset-schedule" />
                    <Label htmlFor="asset-schedule">Asset</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Service" id="service" />
                    <Label htmlFor="service">Service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vendor" id="vendor" />
                    <Label htmlFor="vendor">Vendor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Training" id="training" />
                    <Label htmlFor="training">Training</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Activity Name*</Label>
              <Input
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Activity Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Task */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-orange-600 flex items-center gap-2">
                <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
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
                <Label>Select Group</Label>
                <Select value={group} onValueChange={setGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="group1">Group 1</SelectItem>
                    <SelectItem value="group2">Group 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Sub-Group</Label>
                <Select value={subGroup} onValueChange={setSubGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subgroup1">Sub Group 1</SelectItem>
                    <SelectItem value="subgroup2">Sub Group 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Sections */}
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Input
                        value={section.name}
                        onChange={(e) => {
                          setSections(sections.map(s => 
                            s.id === section.id ? { ...s, name: e.target.value } : s
                          ));
                        }}
                        className="font-medium"
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
                          <Label>Task</Label>
                          <Input
                            value={task.task}
                            onChange={(e) => handleUpdateTask(section.id, task.id, 'task', e.target.value)}
                            placeholder="Enter Task"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Input Type</Label>
                          <Select 
                            value={task.inputType} 
                            onValueChange={(value) => handleUpdateTask(section.id, task.id, 'inputType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Input Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Text">Text</SelectItem>
                              <SelectItem value="Numeric">Numeric</SelectItem>
                              <SelectItem value="Date">Date</SelectItem>
                              <SelectItem value="Boolean">Boolean</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mandatory-${task.id}`}
                            checked={task.mandatory}
                            onCheckedChange={(checked) => handleUpdateTask(section.id, task.id, 'mandatory', checked)}
                          />
                          <Label htmlFor={`mandatory-${task.id}`}>Mandatory</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`reading-${task.id}`}
                            checked={task.reading}
                            onCheckedChange={(checked) => handleUpdateTask(section.id, task.id, 'reading', checked)}
                          />
                          <Label htmlFor={`reading-${task.id}`}>Reading</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`helptext-${task.id}`}
                            checked={task.helpText}
                            onCheckedChange={(checked) => handleUpdateTask(section.id, task.id, 'helpText', checked)}
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
                            <Label>Weightage</Label>
                            <Input
                              value={task.weightageValue}
                              onChange={(e) => handleUpdateTask(section.id, task.id, 'weightageValue', e.target.value)}
                              placeholder="Enter Weightage"
                            />
                          </div>
                          <div className="flex items-center gap-4 pt-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`rating-${task.id}`}
                                checked={task.rating}
                                onCheckedChange={(checked) => handleUpdateTask(section.id, task.id, 'rating', checked)}
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
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Checklist Type</Label>
              <RadioGroup value={checklistType} onValueChange={setChecklistType} className="flex gap-4">
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

            <div className="space-y-2">
              <Label>Asset</Label>
              <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Energy Meter 1[584931186764c2f8b565]">Energy Meter 1[584931186764c2f8b565]</SelectItem>
                  <SelectItem value="Energy Meter 23[03835269926136105d:1]">Energy Meter 23[03835269926136105d:1]</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={assignTo} onValueChange={setAssignTo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Users">Users</SelectItem>
                    <SelectItem value="Groups">Groups</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectUser} onValueChange={setSelectUser}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ashiq Rasul">Ashiq Rasul</SelectItem>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scan Type</Label>
                <Select value={scanType} onValueChange={setScanType}>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label>Plan Duration</Label>
                <div className="flex gap-2">
                  <Select value={planDuration} onValueChange={setPlanDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Day">Day</SelectItem>
                      <SelectItem value="Hour">Hour</SelectItem>
                      <SelectItem value="Week">Week</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={planDurationField}
                    onChange={(e) => setPlanDurationField(e.target.value)}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Plan Duration Type</Label>
                <Input value="1" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Plan value</Label>
                <Input value="1" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email Trigger Rule</Label>
                <Select value={emailTriggerRule} onValueChange={setEmailTriggerRule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Email Trigger Rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rule1">Rule 1</SelectItem>
                    <SelectItem value="rule2">Rule 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Supervisors</Label>
                <Select value={supervisors} onValueChange={setSupervisors}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supervisors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor1">Supervisor 1</SelectItem>
                    <SelectItem value="supervisor2">Supervisor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Non Technical">Non Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Submission Type</Label>
                <Select value={submissionTime} onValueChange={setSubmissionTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Submission Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Submission Time Value</Label>
                <Input placeholder="Enter value" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Grace Time</Label>
                <div className="flex gap-2">
                  <Select value={graceTime} onValueChange={setGraceTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Day">Day</SelectItem>
                      <SelectItem value="Hour">Hour</SelectItem>
                      <SelectItem value="Week">Week</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={graceTimeField}
                    onChange={(e) => setGraceTimeField(e.target.value)}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Grace Time Value</Label>
                <Input value="3" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Lock Overdue Task</Label>
                <Select value={lockOverdueTask} onValueChange={setLockOverdueTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Lock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cron Expression</Label>
                <Input
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  value={startFrom}
                  onChange={(e) => setStartFrom(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>End At</Label>
                <Input
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Select Supplier</Label>
                <Select value={selectSupplier} onValueChange={setSelectSupplier}>
                  <SelectTrigger>
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

        {/* Cron form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
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
                  onCheckedChange={(checked) => setSpecificMinute(checked === true)}
                />
                <Label htmlFor="specific-minute">Specific minute (choose one or many)</Label>
              </div>

              {cronType === 'Minutes' && (
                <div className="grid grid-cols-10 gap-2">
                  {minuteOptions.map((minute) => (
                    <div key={minute} className="flex items-center space-x-1">
                      <Checkbox 
                        id={`minute-${minute}`} 
                        onCheckedChange={(checked) => console.log(`Minute ${minute}:`, checked)}
                      />
                      <Label htmlFor={`minute-${minute}`} className="text-xs">{minute}</Label>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label>Every minute between minute</Label>
                <div className="flex items-center gap-2">
                  <Select defaultValue="00">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {minuteOptions.map((minute) => (
                        <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>and minute</span>
                  <Select defaultValue="00">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {minuteOptions.map((minute) => (
                        <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
