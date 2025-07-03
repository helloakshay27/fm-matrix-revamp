
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddVendorAuditPage = () => {
  const navigate = useNavigate();
  const [createNew, setCreateNew] = useState(false);
  const [createTask, setCreateTask] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [scheduleFor, setScheduleFor] = useState('asset');
  const [checklistType, setChecklistType] = useState('individual');
  const [taskSections, setTaskSections] = useState([]);

  const handleAddSection = () => {
    setTaskSections([...taskSections, { id: Date.now() }]);
  };

  const handleAddQuestion = () => {
    // Add question functionality
  };

  const handleSubmit = () => {
    console.log('Form submitted');
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
            <Label htmlFor="activity-name">Activity Name*</Label>
            <TextField
              id="activity-name" 
              placeholder="Enter Activity Name"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <TextField
              id="description" 
              placeholder="Enter Description"
              fullWidth
              variant="outlined"
              multiline
              minRows={3}
              maxRows={10}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  '& textarea': {
                    height: 'auto',
                    overflow: 'hidden',
                    resize: 'none',
                    padding: '8px 14px',
                  },
                },
              }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="allow-observations" />
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
              <Label>Group</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="group-label" shrink>Select Group</InputLabel>
                <MuiSelect
                  labelId="group-label"
                  label="Select Group"
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Group</em></MenuItem>
                  <MenuItem value="group1">Group 1</MenuItem>
                  <MenuItem value="group2">Group 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <Label>SubGroup</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="subgroup-label" shrink>Select Sub Group</InputLabel>
                <MuiSelect
                  labelId="subgroup-label"
                  label="Select Sub Group"
                  displayEmpty
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
              <Label>Task</Label>
              <TextField
                placeholder="Enter Task"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />
            </div>
            <div>
              <Label>Input Type</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="input-type-label" shrink>Select Input Type</InputLabel>
                <MuiSelect
                  labelId="input-type-label"
                  label="Select Input Type"
                  displayEmpty
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
                <Checkbox id="mandatory" />
                <Label htmlFor="mandatory">Mandatory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="reading" />
                <Label htmlFor="reading">Reading</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="help-text" />
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
              <Label>Asset</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="asset-label" shrink>Select Asset</InputLabel>
                <MuiSelect
                  labelId="asset-label"
                  label="Select Asset"
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Asset</em></MenuItem>
                  <MenuItem value="asset1">Asset 1</MenuItem>
                  <MenuItem value="asset2">Asset 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <Label>Assign To</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="assign-to-label" shrink>Select Assign To</InputLabel>
                <MuiSelect
                  labelId="assign-to-label"
                  label="Select Assign To"
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Assign To</em></MenuItem>
                  <MenuItem value="user1">User 1</MenuItem>
                  <MenuItem value="user2">User 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <Label>Scan Type</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="scan-type-label" shrink>Select Scan Type</InputLabel>
                <MuiSelect
                  labelId="scan-type-label"
                  label="Select Scan Type"
                  displayEmpty
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
              <Label>Plan Duration</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="plan-duration-label" shrink>Select Plan Duration</InputLabel>
                <MuiSelect
                  labelId="plan-duration-label"
                  label="Select Plan Duration"
                  displayEmpty
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
              <Label>Priority</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="priority-label" shrink>Select Priority</InputLabel>
                <MuiSelect
                  labelId="priority-label"
                  label="Select Priority"
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Priority</em></MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/maintenance/audit/vendor')}>
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
