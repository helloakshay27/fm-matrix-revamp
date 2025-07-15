import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: { xs: '36px', md: '45px' },
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E0E0E0',
    },
    '&:hover fieldset': {
      borderColor: '#1A1A1A',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#C72030',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: '#FFFFFF',
      padding: '0 4px',
    },
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#1A1A1A',
    fontSize: '14px',
    padding: { xs: '8px 14px', md: '12px 14px' },
    height: 'auto',
    '&::placeholder': {
      color: '#999999',
      opacity: 1,
    },
  },
};

const multilineFieldStyles = {
  ...fieldStyles,
  '& .MuiOutlinedInput-root': {
    ...fieldStyles['& .MuiOutlinedInput-root'],
    height: 'auto',
    alignItems: 'flex-start',
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

  const handleBack = () => {
    navigate(-1);
  };

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
    <div className="flex-1 p-4 sm:p-6 md:p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <nav className="flex flex-wrap items-center text-sm text-gray-600">
            <span>Maintenance</span>
            <span className="mx-2">{'>'}</span>
            <span>Audit</span>
            <span className="mx-2">{'>'}</span>
            <span>Vendor</span>
            <span className="mx-2">{'>'}</span>
            <span>Add Schedule</span>
          </nav>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">ADD VENDOR AUDIT SCHEDULE</h1>
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Switch 
            id="create-new" 
            checked={createNew} 
            onCheckedChange={setCreateNew}
            className="data-[state=checked]:bg-green-500"
          />
          <Label htmlFor="create-new">Create New</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="create-task" 
            checked={createTask} 
            onCheckedChange={setCreateTask}
            className="data-[state=checked]:bg-green-500"
          />
          <Label htmlFor="create-task">Create Task</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="weightage" 
            checked={weightage} 
            onCheckedChange={setWeightage}
            className="data-[state=checked]:bg-green-500"
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      {/* Basic Info Section - Hidden when Create New is toggled */}
      {!createNew && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#C72030' }}>i</div>
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Schedule For</Label>
              <RadioGroup value={scheduleFor} onValueChange={setScheduleFor} className="flex flex-wrap gap-6 mt-2">
                {['asset', 'service', 'vendor', 'training'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <TextField
                label="Activity Name *"
                placeholder="Enter Activity"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={fieldStyles}
              />
            </div>

            <div>
              <TextField
                label="Description"
                placeholder="Enter Description"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={multilineFieldStyles}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allow-observations"
                className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
              />
              <Label htmlFor="allow-observations">Allow Observations</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Section - Hidden when Create New is toggled */}
      {!createNew && (
        <Card className="mb-6">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#C72030' }}>T</div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Group', 'Sub Group'].map((label, idx) => (
                <FormControl fullWidth variant="outlined" sx={fieldStyles} key={idx}>
                  <InputLabel shrink>{`Select ${label}`}</InputLabel>
                  <MuiSelect label={`Select ${label}`} displayEmpty>
                    <MenuItem value=""><em>Select {label}</em></MenuItem>
                    <MenuItem value={`${label.toLowerCase()}1`}>{`${label} 1`}</MenuItem>
                    <MenuItem value={`${label.toLowerCase()}2`}>{`${label} 2`}</MenuItem>
                  </MuiSelect>
                </FormControl>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Task"
                placeholder="Enter Task"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={fieldStyles}
              />
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Select Input Type</InputLabel>
                <MuiSelect label="Select Input Type" displayEmpty>
                  <MenuItem value=""><em>Select Input Type</em></MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="radio">Radio Button</MenuItem>
                  <MenuItem value="checkbox">Checkbox</MenuItem>
                  <MenuItem value="dropdown">Dropdown</MenuItem>
                </MuiSelect>
              </FormControl>
              <div className="flex flex-wrap gap-4 pt-2">
                {['Mandatory', 'Reading', 'Help Text'].map((label, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox 
                      id={label.toLowerCase().replace(' ', '-')}
                      className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                    />
                    <Label htmlFor={label.toLowerCase().replace(' ', '-')}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleAddQuestion} variant="outline" className="border-gray-300">
                + Add Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Section - Always visible */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#C72030' }}>S</div>
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Checklist Type</Label>
            <RadioGroup value={checklistType} onValueChange={setChecklistType} className="flex flex-wrap gap-6 mt-2">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Asset</InputLabel>
              <MuiSelect label="Select Asset" displayEmpty>
                <MenuItem value=""><em>Select Asset</em></MenuItem>
                <MenuItem value="asset1">Asset 1</MenuItem>
                <MenuItem value="asset2">Asset 2</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Assign To</InputLabel>
              <MuiSelect label="Select Assign To" displayEmpty>
                <MenuItem value=""><em>Select Assign To</em></MenuItem>
                <MenuItem value="user1">User 1</MenuItem>
                <MenuItem value="user2">User 2</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Scan Type</InputLabel>
              <MuiSelect label="Select Scan Type" displayEmpty>
                <MenuItem value=""><em>Select Scan Type</em></MenuItem>
                <MenuItem value="qr">QR Code</MenuItem>
                <MenuItem value="barcode">Barcode</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Plan Duration</InputLabel>
              <MuiSelect label="Select Plan Duration" displayEmpty>
                <MenuItem value=""><em>Select Plan Duration</em></MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Priority</InputLabel>
              <MuiSelect label="Select Priority" displayEmpty>
                <MenuItem value=""><em>Select Priority</em></MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Email Trigger Rule</InputLabel>
              <MuiSelect label="Select Email Trigger Rule" displayEmpty>
                <MenuItem value=""><em>Select Email Trigger Rule</em></MenuItem>
                <MenuItem value="immediately">Immediately</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Supervisors</InputLabel>
              <MuiSelect label="Select Supervisors" displayEmpty>
                <MenuItem value=""><em>Select Supervisors</em></MenuItem>
                <MenuItem value="supervisor1">Supervisor 1</MenuItem>
                <MenuItem value="supervisor2">Supervisor 2</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Category</InputLabel>
              <MuiSelect label="Select Category" displayEmpty>
                <MenuItem value=""><em>Select Category</em></MenuItem>
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="safety">Safety</MenuItem>
                <MenuItem value="quality">Quality</MenuItem>
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Lock Status</InputLabel>
              <MuiSelect label="Select Lock Status" displayEmpty>
                <MenuItem value=""><em>Select Lock Status</em></MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Frequency</InputLabel>
              <MuiSelect label="Select Frequency" displayEmpty>
                <MenuItem value=""><em>Select Frequency</em></MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
              </MuiSelect>
            </FormControl>
            <TextField
              label="Start From"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldStyles}
            />
            <TextField
              label="End At"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldStyles}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Select Supplier</InputLabel>
              <MuiSelect label="Select Supplier" displayEmpty>
                <MenuItem value=""><em>Select Supplier</em></MenuItem>
                <MenuItem value="supplier1">Supplier 1</MenuItem>
                <MenuItem value="supplier2">Supplier 2</MenuItem>
                <MenuItem value="supplier3">Supplier 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
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
