
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Upload } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

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
    { id: 1, name: 'Section 1', tasks: [] }
  ]);
  const [tasks, setTasks] = useState([
    { task: 'Kwah', inputType: 'Numeric', mandatory: true, reading: true, helpText: false }
  ]);

  // Cron Settings state
  const [editTimings, setEditTimings] = useState(false);
  const [cronTab, setCronTab] = useState('Minutes');
  const [specificMinute, setSpecificMinute] = useState(true);
  const [selectedMinutes, setSelectedMinutes] = useState(['00', '09']);

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

  const handleAddQuestion = () => {
    console.log('Add Question clicked');
    const newTask = {
      task: 'New Task',
      inputType: 'Text',
      mandatory: false,
      reading: false,
      helpText: false
    };
    setTasks([...tasks, newTask]);
  };

  const handleSubmit = () => {
    console.log('Schedule updated successfully');
    navigate('/maintenance/schedule');
  };

  const renderCronMinutes = () => {
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="specific-minute" 
              name="minute-type" 
              checked={specificMinute}
              onChange={() => setSpecificMinute(true)}
              className="text-blue-600"
            />
            <Label htmlFor="specific-minute" className="font-medium">Specific minute (choose one or many)</Label>
          </div>
          
          {specificMinute && (
            <div className="grid grid-cols-10 gap-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
              {minutes.map((minute) => (
                <div key={minute} className="flex items-center space-x-1">
                  <Checkbox 
                    id={`minute-${minute}`}
                    checked={selectedMinutes.includes(minute)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMinutes([...selectedMinutes, minute]);
                      } else {
                        setSelectedMinutes(selectedMinutes.filter(m => m !== minute));
                      }
                    }}
                  />
                  <Label htmlFor={`minute-${minute}`} className="text-sm font-medium">{minute}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
        
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
          <Select>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="00" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm">and minute</span>
          <Select>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="00" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
                <Label>Group</Label>
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
                <Label>SubGroup</Label>
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
            
            {/* Tasks Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tasks</Label>
                <Button 
                  variant="outline"
                  onClick={handleAddQuestion}
                  className="border-[#C72030] text-[#C72030]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Input Type</TableHead>
                    <TableHead>Mandatory</TableHead>
                    <TableHead>Reading</TableHead>
                    <TableHead>Help Text</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>{task.inputType}</TableCell>
                      <TableCell>
                        <Checkbox checked={task.mandatory} />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={task.reading} />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={task.helpText} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                <Label>Submission Time</Label>
                <Select value={submissionTime} onValueChange={setSubmissionTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Submission Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Submission Time Field</Label>
                <Input
                  value={submissionTimeField}
                  onChange={(e) => setSubmissionTimeField(e.target.value)}
                />
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cron Expression</Label>
                <Input
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Start From</Label>
                <Input
                  type="date"
                  value={startFrom}
                  onChange={(e) => setStartFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End At</Label>
                <Input
                  type="date"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </div>
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

            {/* Edit Timings Checkbox */}
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox 
                id="edit-timings"
                checked={editTimings}
                onCheckedChange={(checked) => setEditTimings(checked === true)}
              />
              <Label htmlFor="edit-timings" className="font-medium">Edit Timings</Label>
            </div>
          </CardContent>
        </Card>

        {/* Cron Settings */}
        {editTimings && (
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center gap-2">
                <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Cron Settings
              </CardTitle>
            </CardHeader>
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
                {cronTab === 'Hours' && <div className="text-gray-500">Hours configuration will go here</div>}
                {cronTab === 'Day' && <div className="text-gray-500">Day configuration will go here</div>}
                {cronTab === 'Month' && <div className="text-gray-500">Month configuration will go here</div>}
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
          </Card>
        )}

        {/* Associations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
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
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
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
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
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
