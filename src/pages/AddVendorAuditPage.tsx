import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex-1 p-4 sm:p-6 md:p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
          <span>Maintenance</span>
          <span className="mx-2">{'>'}</span>
          <span>Audit</span>
          <span className="mx-2">{'>'}</span>
          <span>Vendor</span>
          <span className="mx-2">{'>'}</span>
          <span>Add Schedule</span>
        </nav>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">ADD VENDOR AUDIT SCHEDULE</h1>
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Switch id="create-new" checked={createNew} onCheckedChange={setCreateNew} />
          <Label htmlFor="create-new">Create New</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="create-task" checked={createTask} onCheckedChange={setCreateTask} />
          <Label htmlFor="create-task">Create Task</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="weightage" checked={weightage} onCheckedChange={setWeightage} />
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
            <Label htmlFor="activity-name">Activity Name*</Label>
            <TextField
              id="activity-name"
              placeholder="Enter Activity"
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Group', 'Sub Group'].map((label, idx) => (
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} key={idx}>
                <InputLabel shrink>{`Select ${label}`}</InputLabel>
                <MuiSelect label={`Select ${label}`} displayEmpty sx={fieldStyles}>
                  <MenuItem value=""><em>Select {label}</em></MenuItem>
                  <MenuItem value={`${label.toLowerCase()}1`}>{`${label} 1`}</MenuItem>
                  <MenuItem value={`${label.toLowerCase()}2`}>{`${label} 2`}</MenuItem>
                </MuiSelect>
              </FormControl>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              placeholder="Enter Task"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Select Input Type</InputLabel>
              <MuiSelect label="Select Input Type" displayEmpty sx={fieldStyles}>
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
                  <Checkbox id={label.toLowerCase().replace(' ', '-')} />
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

          {[
            ['Asset', 'Assign To', 'Scan Type'],
            ['Plan Duration', 'Priority']
          ].map((row, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {row.map((label, i) => (
                <FormControl key={i} fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>{`Select ${label}`}</InputLabel>
                  <MuiSelect label={`Select ${label}`} displayEmpty sx={fieldStyles}>
                    <MenuItem value=""><em>Select {label}</em></MenuItem>
                    <MenuItem value={`${label.toLowerCase().replace(' ', '')}1`}>{`${label} 1`}</MenuItem>
                    <MenuItem value={`${label.toLowerCase().replace(' ', '')}2`}>{`${label} 2`}</MenuItem>
                  </MuiSelect>
                </FormControl>
              ))}
            </div>
          ))}
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
