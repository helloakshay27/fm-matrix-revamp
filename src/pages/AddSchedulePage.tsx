
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
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddSchedulePage = () => {
  const navigate = useNavigate();
  const [createCategoryToggle, setCreateCategoryToggle] = useState(false);
  
  // Basic Info state
  const [type, setType] = useState('PPM');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleFor, setScheduleFor] = useState('Asset');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Task state
  const [group, setGroup] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [taskName, setTaskName] = useState('');
  const [inputType, setInputType] = useState('');
  const [mandatory, setMandatory] = useState(false);
  const [reading, setReading] = useState(false);
  const [helpText, setHelpText] = useState(false);

  // Schedule state
  const [checklistType, setChecklistType] = useState('Individual');
  const [asset, setAsset] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [scanType, setScanType] = useState('');
  const [planDuration, setPlanDuration] = useState('Day');
  const [planValue, setPlanValue] = useState('');
  const [priority, setPriority] = useState('');
  const [emailTriggerRule, setEmailTriggerRule] = useState('');
  const [supervisors, setSupervisors] = useState('');
  const [category, setCategory] = useState('Technical');
  const [submissionType, setSubmissionType] = useState('');
  const [submissionTimeValue, setSubmissionTimeValue] = useState('');
  const [graceTime, setGraceTime] = useState('Day');
  const [graceTimeValue, setGraceTimeValue] = useState('');
  const [lockOverdueTask, setLockOverdueTask] = useState('');
  const [frequency, setFrequency] = useState('');
  const [cronExpression, setCronExpression] = useState('0 0 * * *');
  const [startTime, setStartTime] = useState('');
  const [endAt, setEndAt] = useState('');
  const [selectSupplier, setSelectSupplier] = useState('');

  const handleAddSection = () => {
    console.log('Add Section clicked');
  };

  const handleAddQuestion = () => {
    console.log('Add Question clicked');
  };

  const handleSubmit = () => {
    console.log('Schedule created successfully');
    navigate('/maintenance/schedule');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Schedule</span>
          <span>&gt;</span>
          <span>Create Schedule</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Create Schedule</h1>
        
        {/* Toggle Section */}
        <div className="flex items-center gap-8 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Create Category</label>
            <div 
              className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                createCategoryToggle ? 'bg-[#C72030]' : 'bg-gray-300'
              }`}
              onClick={() => setCreateCategoryToggle(!createCategoryToggle)}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full transition-transform mt-0.5 ${
                  createCategoryToggle ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>
          
          {createCategoryToggle && (
            <div className="flex items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
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
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Task</Label>
                <Input
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Task Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Input Type</Label>
                <Select value={inputType} onValueChange={setInputType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Input Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numeric">Numeric</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-center gap-4 pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={mandatory} onCheckedChange={setMandatory} />
                  <Label>Mandatory</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={reading} onCheckedChange={setReading} />
                  <Label>Reading</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={helpText} onCheckedChange={setHelpText} />
                  <Label>Help Text</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                variant="outline"
                onClick={handleAddQuestion}
                className="border-[#C72030] text-[#C72030]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
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
                  <RadioGroupItem value="Asset Group" id="asset-group" />
                  <Label htmlFor="asset-group">Asset Group</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Asset</Label>
              <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energy-meter-1">Energy Meter 1[584931186764c2f8b565]</SelectItem>
                  <SelectItem value="energy-meter-23">Energy Meter 23[03835269926136105d:1]</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={assignTo} onValueChange={setAssignTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">User 1</SelectItem>
                    <SelectItem value="user2">User 2</SelectItem>
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
                    value={planValue}
                    onChange={(e) => setPlanValue(e.target.value)}
                    placeholder="Value"
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
                <Label>Submission Type</Label>
                <Select value={submissionType} onValueChange={setSubmissionType}>
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
                <Input
                  value={submissionTimeValue}
                  onChange={(e) => setSubmissionTimeValue(e.target.value)}
                  placeholder="Value"
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
                    value={graceTimeValue}
                    onChange={(e) => setGraceTimeValue(e.target.value)}
                    placeholder="Value"
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
                  placeholder="0 0 * * *"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="date"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
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
