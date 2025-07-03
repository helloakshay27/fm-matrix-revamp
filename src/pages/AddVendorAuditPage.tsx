
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

export const AddVendorAuditPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createNew, setCreateNew] = useState(false);
  const [createTask, setCreateTask] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [scheduleFor, setScheduleFor] = useState('asset');
  const [checklistType, setChecklistType] = useState('individual');
  const [taskSections, setTaskSections] = useState([]);

  const [basicInfo, setBasicInfo] = useState({
    activityName: '',
    description: '',
    allowObservations: false
  });

  const [taskData, setTaskData] = useState({
    group: '',
    subGroup: '',
    task: '',
    inputType: '',
    mandatory: false,
    reading: false,
    helpText: false
  });

  const [scheduleData, setScheduleData] = useState({
    asset: '',
    assignTo: '',
    scanType: '',
    planDuration: '',
    priority: '',
    emailTriggerRule: '',
    supervisors: '',
    category: '',
    lockOverdueTask: '',
    frequency: '',
    startFrom: '',
    endAt: '',
    supplier: ''
  });

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
  };

  const handleBasicInfoChange = (field: string, value: string | boolean) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskDataChange = (field: string, value: string | boolean) => {
    setTaskData(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleDataChange = (field: string, value: string) => {
    setScheduleData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSection = () => {
    setTaskSections([...taskSections, { id: Date.now() }]);
  };

  const handleAddQuestion = () => {
    // Add question functionality
  };

  const handleSubmit = () => {
    console.log('Form submitted');
    
    toast({
      title: "Success",
      description: "Vendor audit schedule created successfully!",
    });
    
    navigate('/maintenance/audit/vendor');
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Maintenance</span>
          <span className="mx-2">{'>'}</span>
          <span>Audit</span>
          <span className="mx-2">{'>'}</span>
          <span>Vendor</span>
          <span className="mx-2">{'>'}</span>
          <span>Add Schedule</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">ADD VENDOR AUDIT SCHEDULE</h1>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="create-new"
            checked={createNew}
            onCheckedChange={setCreateNew}
          />
          <Label htmlFor="create-new">Create New</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="create-task"
            checked={createTask}
            onCheckedChange={setCreateTask}
          />
          <Label htmlFor="create-task">Create Task</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="weightage"
            checked={weightage}
            onCheckedChange={setWeightage}
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      {/* Basic Info Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">i</div>
            Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Schedule For</Label>
            <RadioGroup 
              value={scheduleFor} 
              onValueChange={setScheduleFor}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asset" id="asset" />
                <Label htmlFor="asset">Asset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service">Service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendor" id="vendor" />
                <Label htmlFor="vendor">Vendor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="training" id="training" />
                <Label htmlFor="training">Training</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <TextField
              required
              label="Activity Name"
              placeholder="Enter Activity Name"
              value={basicInfo.activityName}
              onChange={(e) => handleBasicInfoChange('activityName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>

          <div>
            <TextField
              label="Description"
              placeholder="Enter Description"
              value={basicInfo.description}
              onChange={(e) => handleBasicInfoChange('description', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="allow-observations" 
              checked={basicInfo.allowObservations}
              onCheckedChange={(checked) => handleBasicInfoChange('allowObservations', checked === true)}
            />
            <Label htmlFor="allow-observations">Allow Observations</Label>
          </div>
        </CardContent>
      </Card>

      {/* Task Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">T</div>
            Task
          </CardTitle>
          <Button
            onClick={handleAddSection}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90"
          >
            + Add Section
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="group-label" shrink>Group</InputLabel>
                <MuiSelect
                  labelId="group-label"
                  label="Group"
                  displayEmpty
                  value={taskData.group}
                  onChange={(e) => handleTaskDataChange('group', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Group</em></MenuItem>
                  <MenuItem value="group1">Group 1</MenuItem>
                  <MenuItem value="group2">Group 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="subgroup-label" shrink>SubGroup</InputLabel>
                <MuiSelect
                  labelId="subgroup-label"
                  label="SubGroup"
                  displayEmpty
                  value={taskData.subGroup}
                  onChange={(e) => handleTaskDataChange('subGroup', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                  <MenuItem value="subgroup1">SubGroup 1</MenuItem>
                  <MenuItem value="subgroup2">SubGroup 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <TextField
                label="Task"
                placeholder="Enter Task"
                value={taskData.task}
                onChange={(e) => handleTaskDataChange('task', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="input-type-label" shrink>Input Type</InputLabel>
                <MuiSelect
                  labelId="input-type-label"
                  label="Input Type"
                  displayEmpty
                  value={taskData.inputType}
                  onChange={(e) => handleTaskDataChange('inputType', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Input Type</em></MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="radio">Radio Button</MenuItem>
                  <MenuItem value="checkbox">Checkbox</MenuItem>
                  <MenuItem value="dropdown">Dropdown</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mandatory" 
                  checked={taskData.mandatory}
                  onCheckedChange={(checked) => handleTaskDataChange('mandatory', checked === true)}
                />
                <Label htmlFor="mandatory">Mandatory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reading" 
                  checked={taskData.reading}
                  onCheckedChange={(checked) => handleTaskDataChange('reading', checked === true)}
                />
                <Label htmlFor="reading">Reading</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="help-text" 
                  checked={taskData.helpText}
                  onCheckedChange={(checked) => handleTaskDataChange('helpText', checked === true)}
                />
                <Label htmlFor="help-text">Help Text</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAddQuestion}
              variant="outline"
              className="border-gray-300"
            >
              + Add Question
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">S</div>
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Checklist Type</Label>
            <RadioGroup 
              value={checklistType} 
              onValueChange={setChecklistType}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asset-group" id="asset-group" />
                <Label htmlFor="asset-group">Asset Group</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="asset-label" shrink>Asset</InputLabel>
                <MuiSelect
                  labelId="asset-label"
                  label="Asset"
                  displayEmpty
                  value={scheduleData.asset}
                  onChange={(e) => handleScheduleDataChange('asset', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Asset</em></MenuItem>
                  <MenuItem value="asset1">Asset 1</MenuItem>
                  <MenuItem value="asset2">Asset 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="assign-to-label" shrink>Assign To</InputLabel>
                <MuiSelect
                  labelId="assign-to-label"
                  label="Assign To"
                  displayEmpty
                  value={scheduleData.assignTo}
                  onChange={(e) => handleScheduleDataChange('assignTo', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Assign To</em></MenuItem>
                  <MenuItem value="user1">User 1</MenuItem>
                  <MenuItem value="user2">User 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="scan-type-label" shrink>Scan Type</InputLabel>
                <MuiSelect
                  labelId="scan-type-label"
                  label="Scan Type"
                  displayEmpty
                  value={scheduleData.scanType}
                  onChange={(e) => handleScheduleDataChange('scanType', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Scan Type</em></MenuItem>
                  <MenuItem value="qr">QR Code</MenuItem>
                  <MenuItem value="barcode">Barcode</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="plan-duration-label" shrink>Plan Duration</InputLabel>
                <MuiSelect
                  labelId="plan-duration-label"
                  label="Plan Duration"
                  displayEmpty
                  value={scheduleData.planDuration}
                  onChange={(e) => handleScheduleDataChange('planDuration', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Plan Duration</em></MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="priority-label" shrink>Priority</InputLabel>
                <MuiSelect
                  labelId="priority-label"
                  label="Priority"
                  displayEmpty
                  value={scheduleData.priority}
                  onChange={(e) => handleScheduleDataChange('priority', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Priority</em></MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="email-trigger-label" shrink>Email Trigger Rule</InputLabel>
                <MuiSelect
                  labelId="email-trigger-label"
                  label="Email Trigger Rule"
                  displayEmpty
                  value={scheduleData.emailTriggerRule}
                  onChange={(e) => handleScheduleDataChange('emailTriggerRule', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Email Trigger Rule</em></MenuItem>
                  <MenuItem value="immediate">Immediate</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="supervisors-label" shrink>Supervisors</InputLabel>
                <MuiSelect
                  labelId="supervisors-label"
                  label="Supervisors"
                  displayEmpty
                  value={scheduleData.supervisors}
                  onChange={(e) => handleScheduleDataChange('supervisors', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Supervisors</em></MenuItem>
                  <MenuItem value="supervisor1">Supervisor 1</MenuItem>
                  <MenuItem value="supervisor2">Supervisor 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-label" shrink>Category</InputLabel>
                <MuiSelect
                  labelId="category-label"
                  label="Category"
                  displayEmpty
                  value={scheduleData.category}
                  onChange={(e) => handleScheduleDataChange('category', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  <MenuItem value="category1">Category 1</MenuItem>
                  <MenuItem value="category2">Category 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="lock-overdue-label" shrink>Lock Overdue Task</InputLabel>
                <MuiSelect
                  labelId="lock-overdue-label"
                  label="Lock Overdue Task"
                  displayEmpty
                  value={scheduleData.lockOverdueTask}
                  onChange={(e) => handleScheduleDataChange('lockOverdueTask', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Lock Status</em></MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="frequency-label" shrink>Frequency</InputLabel>
                <MuiSelect
                  labelId="frequency-label"
                  label="Frequency"
                  displayEmpty
                  value={scheduleData.frequency}
                  onChange={(e) => handleScheduleDataChange('frequency', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Frequency</em></MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <TextField
                label="Start From"
                placeholder="Select Start Date"
                type="date"
                value={scheduleData.startFrom}
                onChange={(e) => handleScheduleDataChange('startFrom', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    ...fieldStyles,
                    '& .MuiInputBase-input': {
                      ...fieldStyles['& .MuiInputBase-input, & .MuiSelect-select'],
                      fontSize: { xs: '11px', sm: '12px', md: '13px' },
                    }
                  }
                }}
              />
            </div>
            <div>
              <TextField
                label="End At"
                placeholder="Select End Date"
                type="date"
                value={scheduleData.endAt}
                onChange={(e) => handleScheduleDataChange('endAt', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    ...fieldStyles,
                    '& .MuiInputBase-input': {
                      ...fieldStyles['& .MuiInputBase-input, & .MuiSelect-select'],
                      fontSize: { xs: '11px', sm: '12px', md: '13px' },
                    }
                  }
                }}
              />
            </div>
          </div>

          <div>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="supplier-label" shrink>Select Supplier</InputLabel>
              <MuiSelect
                labelId="supplier-label"
                label="Select Supplier"
                displayEmpty
                value={scheduleData.supplier}
                onChange={(e) => handleScheduleDataChange('supplier', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Supplier</em></MenuItem>
                <MenuItem value="supplier1">Supplier 1</MenuItem>
                <MenuItem value="supplier2">Supplier 2</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 px-8"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddVendorAuditPage;
