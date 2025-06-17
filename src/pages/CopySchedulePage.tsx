
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Upload } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export const CopySchedulePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Basic Info state
  const [type, setType] = useState('PPM');
  const [activityName, setActivityName] = useState('meter reading');
  const [description, setDescription] = useState('');
  const [scheduleFor, setScheduleFor] = useState('Asset');

  // Task state
  const [group, setGroup] = useState('');
  const [subGroup, setSubGroup] = useState('');

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
  };

  const handleAddQuestion = () => {
    console.log('Add Question clicked');
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
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Copy Schedule</h1>
        <div className="flex gap-3">
          <Button style={{ backgroundColor: '#C72030' }} className="text-white">
            Create New
          </Button>
          <Button variant="outline" className="border-[#C72030] text-[#C72030]">
            Create Ticket
          </Button>
          <Button variant="outline" className="border-[#C72030] text-[#C72030]">
            Weightage
          </Button>
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
                <RadioGroup value={type} onValueChange={setType} className="flex gap-4">
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
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Task</Label>
                <Input value="Kwah" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Input Type</Label>
                <Select defaultValue="Numeric">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Numeric">Numeric</SelectItem>
                    <SelectItem value="Text">Text</SelectItem>
                    <SelectItem value="Boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-center gap-4 pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mandatory" defaultChecked />
                  <Label htmlFor="mandatory">Mandatory</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="reading" defaultChecked />
                  <Label htmlFor="reading">Reading</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="helptext" />
                  <Label htmlFor="helptext">Help Text</Label>
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
                  onCheckedChange={setSpecificMinute}
                />
                <Label htmlFor="specific-minute">Specific minute (choose one or many)</Label>
              </div>

              {cronType === 'Minutes' && (
                <div className="grid grid-cols-10 gap-2">
                  {minuteOptions.map((minute) => (
                    <div key={minute} className="flex items-center space-x-1">
                      <Checkbox id={`minute-${minute}`} />
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
