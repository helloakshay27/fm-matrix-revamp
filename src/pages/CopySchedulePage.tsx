
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';

export const CopySchedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [createNewToggle, setCreateNewToggle] = useState(false);
  const [createTicketToggle, setCreateTicketToggle] = useState(false);
  const [selectedAssignTo, setSelectedAssignTo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Basic Info state - pre-filled from original schedule
  const [type, setType] = useState('PPM');
  const [activityName, setActivityName] = useState('meter reading');
  const [description, setDescription] = useState('');
  const [scheduleFor, setScheduleFor] = useState('Asset');

  // Schedule state
  const [checklistType, setChecklistType] = useState('Individual');
  const [asset, setAsset] = useState('');
  const [assignTo, setAssignTo] = useState('Users');
  const [scanType, setScanType] = useState('');
  const [planDuration, setPlanDuration] = useState('Day');
  const [planValue, setPlanValue] = useState('1');
  const [priority, setPriority] = useState('');
  const [emailTriggerRule, setEmailTriggerRule] = useState('');
  const [supervisors, setSupervisors] = useState('');
  const [category, setCategory] = useState('Technical');
  const [submissionType, setSubmissionType] = useState('');
  const [submissionTimeValue, setSubmissionTimeValue] = useState('');
  const [graceTime, setGraceTime] = useState('Day');
  const [graceTimeValue, setGraceTimeValue] = useState('3');
  const [lockOverdueTask, setLockOverdueTask] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startTime, setStartTime] = useState('01/05/2025');
  const [endAt, setEndAt] = useState('31/05/2025');
  const [selectSupplier, setSelectSupplier] = useState('');

  // Cron form state
  const [cronType, setCronType] = useState('Minutes');
  const [selectedMinutes, setSelectedMinutes] = useState<number[]>([]);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [betweenMinuteStart, setBetweenMinuteStart] = useState('00');
  const [betweenMinuteEnd, setBetweenMinuteEnd] = useState('00');
  const [cronExpression, setCronExpression] = useState('0 0 ? * *');

  const handleMinuteToggle = (minute: number) => {
    setSelectedMinutes(prev => 
      prev.includes(minute) 
        ? prev.filter(m => m !== minute)
        : [...prev, minute]
    );
  };

  const handleHourToggle = (hour: number) => {
    setSelectedHours(prev => 
      prev.includes(hour) 
        ? prev.filter(h => h !== hour)
        : [...prev, hour]
    );
  };

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleMonthToggle = (month: number) => {
    setSelectedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const handleSubmit = () => {
    console.log('Schedule copied successfully');
    navigate('/maintenance/schedule');
  };

  const renderCronGrid = (type: string, max: number, selectedItems: number[], toggleFunc: (item: number) => void) => {
    const items = Array.from({ length: max }, (_, i) => i);
    
    return (
      <div className="grid grid-cols-10 gap-1">
        {items.map(item => (
          <div
            key={item}
            className={`w-8 h-8 border rounded flex items-center justify-center text-xs cursor-pointer ${
              selectedItems.includes(item)
                ? 'bg-blue-500 text-white'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => toggleFunc(item)}
          >
            {item.toString().padStart(2, '0')}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Schedule</span>
          <span>&gt;</span>
          <span>Copy Schedule</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Copy Schedule</h1>
        
        {/* Toggle Section */}
        <div className="flex items-center gap-8 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Create New</label>
            <div 
              className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                createNewToggle ? 'bg-[#C72030]' : 'bg-gray-300'
              }`}
              onClick={() => setCreateNewToggle(!createNewToggle)}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full transition-transform mt-0.5 ${
                  createNewToggle ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Create Ticket</label>
            <div 
              className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                createTicketToggle ? 'bg-[#C72030]' : 'bg-gray-300'
              }`}
              onClick={() => setCreateTicketToggle(!createTicketToggle)}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full transition-transform mt-0.5 ${
                  createTicketToggle ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Weightage</label>
            <div className="w-12 h-6 rounded-full bg-gray-300 cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full mt-0.5 translate-x-0.5" />
            </div>
          </div>
          
          {createNewToggle && (
            <div className="flex items-center gap-2">
              <Select value="template" onValueChange={() => {}}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select from the existing Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template1">Template 1</SelectItem>
                  <SelectItem value="template2">Template 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {createTicketToggle && (
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input type="radio" name="level" value="checklist" />
                <Label>Checklist Level</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" name="level" value="question" defaultChecked />
                <Label>Question Level</Label>
              </div>
              <Select value={selectedAssignTo} onValueChange={setSelectedAssignTo}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Assigned To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">User 1</SelectItem>
                  <SelectItem value="user2">User 2</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="non-technical">Non Technical</SelectItem>
                </SelectContent>
              </Select>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <RadioGroup value={type} onValueChange={setType} className="flex gap-4 flex-wrap">
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
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="Routine" id="routine" />
                    <Label htmlFor="routine">Routine</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="Audit" id="audit" />
                    <Label htmlFor="audit">Audit</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Schedule For</Label>
                <RadioGroup value={scheduleFor} onValueChange={setScheduleFor} className="flex gap-4">
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
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <span className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Checklist Group</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="group1">Group 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Checklist Group</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subgroup1">Sub Group 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Task</Label>
                <Input value="Kwah" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Input Type</Label>
                <Select value="numeric">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numeric">Numeric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-center gap-4 pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox checked disabled />
                  <Label>Mandatory</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked disabled />
                  <Label>Reading</Label>
                </div>
              </div>
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
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-2 text-red-600 text-sm">
                  Energy Meter 1[584931186764c2f8b565]
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-2 text-red-600 text-sm">
                  Energy Meter 23[03835269926136105d:1]
                </div>
              </div>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Kshitij Rasal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Kshitij Rasal</SelectItem>
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
                    value={planValue}
                    onChange={(e) => setPlanValue(e.target.value)}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Plan Duration Field</Label>
                <Input value="1" readOnly />
              </div>
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Email Trigger Rule</Label>
                <Select value={emailTriggerRule} onValueChange={setEmailTriggerRule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Email Trigger Rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rule1">Rule 1</SelectItem>
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
                  </SelectContent>
                </Select>
              </div>
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Submission Time</Label>
                <Select value={submissionType} onValueChange={setSubmissionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Submission Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                    </SelectContent>
                  </Select>
                  <Input
                    value={graceTimeValue}
                    onChange={(e) => setGraceTimeValue(e.target.value)}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Grace Time Field</Label>
                <Input value="3" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start From</Label>
                <Input
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End At</Label>
                <Input
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
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cron Form */}
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
                style={cronType === 'Minutes' ? { backgroundColor: '#C72030' } : {}}
                className={cronType === 'Minutes' ? 'text-white' : ''}
                onClick={() => setCronType('Minutes')}
              >
                Minutes
              </Button>
              <Button
                variant={cronType === 'Hours' ? 'default' : 'outline'}
                style={cronType === 'Hours' ? { backgroundColor: '#C72030' } : {}}
                className={cronType === 'Hours' ? 'text-white' : ''}
                onClick={() => setCronType('Hours')}
              >
                Hours
              </Button>
              <Button
                variant={cronType === 'Day' ? 'default' : 'outline'}
                style={cronType === 'Day' ? { backgroundColor: '#C72030' } : {}}
                className={cronType === 'Day' ? 'text-white' : ''}
                onClick={() => setCronType('Day')}
              >
                Day
              </Button>
              <Button
                variant={cronType === 'Month' ? 'default' : 'outline'}
                style={cronType === 'Month' ? { backgroundColor: '#C72030' } : {}}
                className={cronType === 'Month' ? 'text-white' : ''}
                onClick={() => setCronType('Month')}
              >
                Month
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="radio" name="cronOption" defaultChecked />
                <Label>Specific minute (choose one or many)</Label>
              </div>

              {cronType === 'Minutes' && (
                <div className="space-y-2">
                  <Label>Minutes</Label>
                  {renderCronGrid('minutes', 60, selectedMinutes, handleMinuteToggle)}
                </div>
              )}

              {cronType === 'Hours' && (
                <div className="space-y-2">
                  <Label>Hours</Label>
                  {renderCronGrid('hours', 24, selectedHours, handleHourToggle)}
                </div>
              )}

              {cronType === 'Day' && (
                <div className="space-y-2">
                  <Label>Day Of Month</Label>
                  {renderCronGrid('days', 31, selectedDays, handleDayToggle)}
                </div>
              )}

              {cronType === 'Month' && (
                <div className="space-y-2">
                  <Label>Month</Label>
                  {renderCronGrid('months', 12, selectedMonths, handleMonthToggle)}
                </div>
              )}

              <div className="flex items-center space-x-2 mt-4">
                <input type="radio" name="cronOption" />
                <Label>Every minute between minute</Label>
                <Select value={betweenMinuteStart} onValueChange={setBetweenMinuteStart}>
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
                <Label>and minute</Label>
                <Select value={betweenMinuteEnd} onValueChange={setBetweenMinuteEnd}>
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

            <div className="mt-6">
              <Label className="font-medium">Resulting Cron Expression: {cronExpression}</Label>
              <div className="mt-4 grid grid-cols-5 gap-4 text-center">
                <div>
                  <Label className="font-medium">Minutes</Label>
                  <div className="mt-1 text-2xl">0</div>
                </div>
                <div>
                  <Label className="font-medium">Hours</Label>
                  <div className="mt-1 text-2xl">0</div>
                </div>
                <div>
                  <Label className="font-medium">Day Of Month</Label>
                  <div className="mt-1 text-2xl">?</div>
                </div>
                <div>
                  <Label className="font-medium">Month</Label>
                  <div className="mt-1 text-2xl">*</div>
                </div>
                <div>
                  <Label className="font-medium">Day Of Week</Label>
                  <div className="mt-1 text-2xl">*</div>
                </div>
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
            Copy Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};
