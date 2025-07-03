
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface TaskSection {
  id: string;
  group: string;
  subGroup: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: string;
  weightageValue: string;
  failing: boolean;
}

export const AddOperationalAuditSchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createNew, setCreateNew] = useState(false);
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  
  // Task sections state
  const [taskSections, setTaskSections] = useState<TaskSection[]>([
    {
      id: '1',
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: '',
      weightageValue: '',
      failing: false
    }
  ]);
  
  // Form states
  const [formData, setFormData] = useState({
    template: '',
    ticketLevel: 'Question Level',
    assignedTo: '',
    ticketCategory: '',
    activityName: '',
    description: '',
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

  const handleTaskSectionChange = (sectionId: string, field: keyof TaskSection, value: any) => {
    setTaskSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, [field]: value }
          : section
      )
    );
  };

  const handleAddSection = () => {
    const newSection: TaskSection = {
      id: Date.now().toString(),
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      reading: false,
      helpText: '',
      weightageValue: '',
      failing: false
    };
    setTaskSections(prev => [...prev, newSection]);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (taskSections.length > 1) {
      setTaskSections(prev => prev.filter(section => section.id !== sectionId));
    }
  };

  const handleSubmit = () => {
    console.log('Submitting operational audit schedule data:', { formData, taskSections });
    toast({
      title: "Success",
      description: "Operational audit schedule saved successfully!",
    });
    navigate('/maintenance/audit/operational');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Operational Audit</div>
          <h1 className="text-2xl font-bold">Add Operational Audit Schedule</h1>
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

      {/* Create New Toggle Section */}
      {createNew && (
        <Card>
          <CardContent className="pt-6">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="template-label" shrink>Select from the existing Template</InputLabel>
                <MuiSelect
                  labelId="template-label"
                  label="Select from the existing Template"
                  displayEmpty
                  value={formData.template}
                  onChange={(e) => handleInputChange('template', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select from the existing Template</em></MenuItem>
                  <MenuItem value="template1">Template 1</MenuItem>
                  <MenuItem value="template2">Template 2</MenuItem>
                  <MenuItem value="template3">Template 3</MenuItem>
                  <MenuItem value="custom">Custom Template</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Ticket Toggle Section */}
      {createTicket && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="checklist-level" 
                    name="ticketLevel" 
                    value="Checklist Level"
                    checked={formData.ticketLevel === 'Checklist Level'}
                    onChange={(e) => handleInputChange('ticketLevel', e.target.value)}
                  />
                  <Label htmlFor="checklist-level">Checklist Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="question-level" 
                    name="ticketLevel" 
                    value="Question Level"
                    checked={formData.ticketLevel === 'Question Level'}
                    onChange={(e) => handleInputChange('ticketLevel', e.target.value)}
                  />
                  <Label htmlFor="question-level">Question Level</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id="assigned-to-label" shrink>Select Assigned To</InputLabel>
                    <MuiSelect
                      labelId="assigned-to-label"
                      label="Select Assigned To"
                      displayEmpty
                      value={formData.assignedTo}
                      onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Assigned To</em></MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="supervisor">Supervisor</MenuItem>
                      <MenuItem value="technician">Technician</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id="ticket-category-label" shrink>Select Category</InputLabel>
                    <MuiSelect
                      labelId="ticket-category-label"
                      label="Select Category"
                      displayEmpty
                      value={formData.ticketCategory}
                      onChange={(e) => handleInputChange('ticketCategory', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Category</em></MenuItem>
                      <MenuItem value="technical">Technical</MenuItem>
                      <MenuItem value="non-technical">Non Technical</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <TextField
              placeholder="Enter Activity"
              value={formData.activityName}
              onChange={(e) => handleInputChange('activityName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div>
            <TextField
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={1}
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
        <CardContent className="space-y-6">
          {taskSections.map((section, index) => (
            <div key={section.id} className="space-y-4 p-4 border rounded-lg relative">
              {taskSections.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSection(section.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id={`group-${section.id}-label`} shrink>Group</InputLabel>
                    <MuiSelect
                      labelId={`group-${section.id}-label`}
                      label="Group"
                      displayEmpty
                      value={section.group}
                      onChange={(e) => handleTaskSectionChange(section.id, 'group', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Group</em></MenuItem>
                      <MenuItem value="group1">Group 1</MenuItem>
                      <MenuItem value="group2">Group 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id={`subgroup-${section.id}-label`} shrink>SubGroup</InputLabel>
                    <MuiSelect
                      labelId={`subgroup-${section.id}-label`}
                      label="SubGroup"
                      displayEmpty
                      value={section.subGroup}
                      onChange={(e) => handleTaskSectionChange(section.id, 'subGroup', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                      <MenuItem value="subgroup1">Sub Group 1</MenuItem>
                      <MenuItem value="subgroup2">Sub Group 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <TextField
                    placeholder="Enter Task"
                    value={section.task}
                    onChange={(e) => handleTaskSectionChange(section.id, 'task', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id={`input-type-${section.id}-label`} shrink>Input Type</InputLabel>
                    <MuiSelect
                      labelId={`input-type-${section.id}-label`}
                      label="Input Type"
                      displayEmpty
                      value={section.inputType}
                      onChange={(e) => handleTaskSectionChange(section.id, 'inputType', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Input Type</em></MenuItem>
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="dropdown">Dropdown</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`mandatory-${section.id}`}
                      checked={section.mandatory}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'mandatory', checked)}
                    />
                    <Label htmlFor={`mandatory-${section.id}`}>Mandatory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`reading-${section.id}`}
                      checked={section.reading}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'reading', checked)}
                    />
                    <Label htmlFor={`reading-${section.id}`}>Reading</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`help-text-${section.id}`}
                      checked={!!section.helpText}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'helpText', checked ? 'Help text' : '')}
                    />
                    <Label htmlFor={`help-text-${section.id}`}>Help Text</Label>
                  </div>
                </div>
              </div>

              {/* Weightage option - only show when weightage toggle is on */}
              {weightage && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <TextField
                      placeholder="Enter Weightage"
                      value={section.weightageValue}
                      onChange={(e) => handleTaskSectionChange(section.id, 'weightageValue', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox 
                      id={`failing-${section.id}`}
                      checked={section.failing}
                      onCheckedChange={(checked) => handleTaskSectionChange(section.id, 'failing', checked)}
                    />
                    <Label htmlFor={`failing-${section.id}`}>Failing</Label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/maintenance/audit/operational')}>
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
