
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddSchedulePage = () => {
  const navigate = useNavigate();
  const [createNew, setCreateNew] = useState(false);
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [activeTab, setActiveTab] = useState('Minutes');
  
  // Form states
  const [formData, setFormData] = useState({
    template: '',
    activityName: '',
    description: '',
    group: '',
    subGroup: '',
    task: '',
    inputType: '',
    mandatory: false,
    reading: false,
    helpText: '',
    weightageValue: '',
    failing: false,
    checklistType: 'Individual',
    asset: '',
    assignTo: '',
    scanType: '',
    planDuration: '',
    priority: '',
    emailTriggerRule: '',
    supervisors: '',
    category: '',
    submissionTime: '',
    graceTime: '',
    lockOverdueTask: '',
    frequency: '',
    startFrom: '',
    endAt: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitting schedule data:', formData);
    // Handle form submission
    navigate('/maintenance/schedule');
  };

  const handleAddSection = () => {
    console.log('Adding new section');
  };

  // If Create New is toggled, show template selection
  if (createNew) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/maintenance/schedule')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="text-sm text-gray-600 mb-1">Schedule</div>
            <h1 className="text-2xl font-bold">Add Schedule</h1>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={createNew} 
              onCheckedChange={setCreateNew}
              id="create-new"
            />
            <Label htmlFor="create-new">Create New</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={createTicket} 
              onCheckedChange={setCreateTicket}
              id="create-ticket"
            />
            <Label htmlFor="create-ticket">Create Ticket</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={weightage} 
              onCheckedChange={setWeightage}
              id="weightage"
            />
            <Label htmlFor="weightage">Weightage</Label>
          </div>
        </div>

        {/* Template Selection */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-select">Select from the existing Template</Label>
                <Select value={formData.template} onValueChange={(value) => handleInputChange('template', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select from the existing Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template1">Template 1</SelectItem>
                    <SelectItem value="template2">Template 2</SelectItem>
                    <SelectItem value="template3">Template 3</SelectItem>
                    <SelectItem value="custom">Custom Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/maintenance/schedule')}>
            Cancel
          </Button>
          <Button 
            onClick={() => setCreateNew(false)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white"
          >
            Continue with Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/schedule')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="text-sm text-gray-600 mb-1">Schedule</div>
          <h1 className="text-2xl font-bold">Add Schedule</h1>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={createNew} 
            onCheckedChange={setCreateNew}
            id="create-new"
          />
          <Label htmlFor="create-new">Create New</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={createTicket} 
            onCheckedChange={setCreateTicket}
            id="create-ticket"
          />
          <Label htmlFor="create-ticket">Create Ticket</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={weightage} 
            onCheckedChange={setWeightage}
            id="weightage"
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
            Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Label>Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="ppm" name="type" value="PPM" />
                <Label htmlFor="ppm">PPM</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="amc" name="type" value="AMC" />
                <Label htmlFor="amc">AMC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="preparedness" name="type" value="Preparedness" />
                <Label htmlFor="preparedness">Preparedness</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Label>Schedule For</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="asset" name="scheduleFor" value="Asset" />
                <Label htmlFor="asset">Asset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="service" name="scheduleFor" value="Service" />
                <Label htmlFor="service">Service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="vendor" name="scheduleFor" value="Vendor" />
                <Label htmlFor="vendor">Vendor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="training" name="scheduleFor" value="Training" />
                <Label htmlFor="training">Training</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="activity-name">Activity Name*</Label>
            <Input
              id="activity-name"
              placeholder="Enter Activity Name"
              value={formData.activityName}
              onChange={(e) => handleInputChange('activityName', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Task Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
              Task
            </div>
            <Button 
              onClick={handleAddSection}
              style={{ backgroundColor: '#C72030' }}
              className="text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Group</Label>
              <Select value={formData.group} onValueChange={(value) => handleInputChange('group', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group1">Group 1</SelectItem>
                  <SelectItem value="group2">Group 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>SubGroup</Label>
              <Select value={formData.subGroup} onValueChange={(value) => handleInputChange('subGroup', value)}>
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
            <div>
              <Label>Task</Label>
              <Input
                placeholder="Enter Task"
                value={formData.task}
                onChange={(e) => handleInputChange('task', e.target.value)}
              />
            </div>
            <div>
              <Label>Task</Label>
              <Select value={formData.inputType} onValueChange={(value) => handleInputChange('inputType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Input Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mandatory"
                  checked={formData.mandatory}
                  onCheckedChange={(checked) => handleInputChange('mandatory', checked)}
                />
                <Label htmlFor="mandatory">Mandatory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reading"
                  checked={formData.reading}
                  onCheckedChange={(checked) => handleInputChange('reading', checked)}
                />
                <Label htmlFor="reading">Reading</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="help-text"
                  checked={!!formData.helpText}
                  onCheckedChange={(checked) => checked ? handleInputChange('helpText', 'Help text') : handleInputChange('helpText', '')}
                />
                <Label htmlFor="help-text">Help Text</Label>
              </div>
            </div>
          </div>

          {/* Weightage option - only show when weightage toggle is on */}
          {weightage && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Weightage</Label>
                <Input
                  placeholder="Enter Weightage"
                  value={formData.weightageValue}
                  onChange={(e) => handleInputChange('weightageValue', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox 
                  id="failing"
                  checked={formData.failing}
                  onCheckedChange={(checked) => handleInputChange('failing', checked)}
                />
                <Label htmlFor="failing">Failing</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Label>Checklist Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="individual" 
                  name="checklistType" 
                  value="Individual" 
                  checked={formData.checklistType === 'Individual'}
                  onChange={(e) => handleInputChange('checklistType', e.target.value)}
                />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="asset-group" 
                  name="checklistType" 
                  value="Asset Group"
                  checked={formData.checklistType === 'Asset Group'}
                  onChange={(e) => handleInputChange('checklistType', e.target.value)}
                />
                <Label htmlFor="asset-group">Asset Group</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Asset</Label>
              <Select value={formData.asset} onValueChange={(value) => handleInputChange('asset', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset1">Asset 1</SelectItem>
                  <SelectItem value="asset2">Asset 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assign To</Label>
              <Select value={formData.assignTo} onValueChange={(value) => handleInputChange('assignTo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Assign To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">User 1</SelectItem>
                  <SelectItem value="user2">User 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Scan Type</Label>
              <Select value={formData.scanType} onValueChange={(value) => handleInputChange('scanType', value)}>
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
            <div>
              <Label>Plan Duration</Label>
              <Select value={formData.planDuration} onValueChange={(value) => handleInputChange('planDuration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Plan Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">1 Hour</SelectItem>
                  <SelectItem value="2hours">2 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
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
            <div>
              <Label>Email Trigger Rule</Label>
              <Select value={formData.emailTriggerRule} onValueChange={(value) => handleInputChange('emailTriggerRule', value)}>
                <SelectTrigger>
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
              <Label>Supervisors</Label>
              <Select value={formData.supervisors} onValueChange={(value) => handleInputChange('supervisors', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supervisors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervisor1">Supervisor 1</SelectItem>
                  <SelectItem value="supervisor2">Supervisor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="non-technical">Non Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Submission Time</Label>
              <Select value={formData.submissionTime} onValueChange={(value) => handleInputChange('submissionTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Submission Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">24 Hours</SelectItem>
                  <SelectItem value="48hours">48 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Grace Time</Label>
              <Select value={formData.graceTime} onValueChange={(value) => handleInputChange('graceTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grace Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">1 Hour</SelectItem>
                  <SelectItem value="2hours">2 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lock Overdue Task</Label>
              <Select value={formData.lockOverdueTask} onValueChange={(value) => handleInputChange('lockOverdueTask', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Lock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start From</Label>
              <Input
                type="date"
                value={formData.startFrom}
                onChange={(e) => handleInputChange('startFrom', e.target.value)}
              />
            </div>
            <div>
              <Label>End At</Label>
              <Input
                type="date"
                value={formData.endAt}
                onChange={(e) => handleInputChange('endAt', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Select Supplier</Label>
            <Select>
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

      {/* Cron Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
            Cron form
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Cron Expression Builder */}
          <div className="space-y-4">
            <div className="flex border rounded-lg">
              {['Minutes', 'Hours', 'Day', 'Month'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 ${
                    activeTab === tab 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  } ${tab === 'Minutes' ? 'rounded-l-lg' : ''} ${tab === 'Month' ? 'rounded-r-lg' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="specific-minutes" name="minutes-option" />
                <Label htmlFor="specific-minutes">Specific minute (choose one or many)</Label>
              </div>

              {/* Minute Selection Grid */}
              <div className="grid grid-cols-12 gap-2 text-sm">
                {Array.from({ length: 60 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-1">
                    <Checkbox id={`minute-${i}`} />
                    <Label htmlFor={`minute-${i}`} className="text-xs">{i.toString().padStart(2, '0')}</Label>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input type="radio" id="every-minute" name="minutes-option" />
                <Label htmlFor="every-minute">Every minute between minute</Label>
                <Select>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="00" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i.toString().padStart(2, '0')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>and minute</span>
                <Select>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="59" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i.toString().padStart(2, '0')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <Label className="text-sm font-medium">Resulting Cron Expression:</Label>
                <div className="mt-2 font-mono text-sm">0 0 ? * *</div>
              </div>

              {/* Calendar View */}
              <div className="grid grid-cols-5 gap-4 mt-6">
                <div className="text-center">
                  <div className="font-medium mb-2">Minutes</div>
                  <div className="text-sm">*</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-2">Hours</div>
                  <div className="text-sm">*</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-2">Day Of Month</div>
                  <div className="text-sm">*</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-2">Month</div>
                  <div className="text-sm">*</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-2">Day Of Week</div>
                  <div className="text-sm">*</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/maintenance/schedule')}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white"
        >
          Save Schedule
        </Button>
      </div>
    </div>
  );
};
