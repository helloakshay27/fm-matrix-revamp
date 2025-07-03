
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox } from '@mui/material';

export const AddSchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    scheduleName: '',
    scheduleType: '',
    frequency: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    description: '',
    priority: '',
    location: '',
    category: ''
  });

  const [dynamicFields, setDynamicFields] = useState([
    { id: Date.now(), label: '', value: '', type: 'text' }
  ]);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addField = () => {
    setDynamicFields([...dynamicFields, { 
      id: Date.now(), 
      label: '', 
      value: '', 
      type: 'text' 
    }]);
  };

  const updateDynamicField = (id: number, field: string, value: string) => {
    setDynamicFields(dynamicFields.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeDynamicField = (id: number) => {
    if (dynamicFields.length > 1) {
      setDynamicFields(dynamicFields.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Schedule Data:', { ...formData, dynamicFields });
    
    toast({
      title: "Success",
      description: "Schedule created successfully!",
    });
    
    navigate('/maintenance/schedule');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/schedule')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schedule List
        </Button>
        <p className="text-[#1a1a1a] opacity-70 mb-2">Schedule &gt; Add Schedule</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD SCHEDULE</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
              SCHEDULE DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <TextField
                  required
                  label="Schedule Name"
                  placeholder="Enter Schedule Name"
                  name="scheduleName"
                  value={formData.scheduleName}
                  onChange={(e) => handleInputChange('scheduleName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="schedule-type-label" shrink>Schedule Type</InputLabel>
                  <MuiSelect
                    labelId="schedule-type-label"
                    label="Schedule Type"
                    displayEmpty
                    value={formData.scheduleType}
                    onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Type</em></MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="inspection">Inspection</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                    <MenuItem value="audit">Audit</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="frequency-label" shrink>Frequency</InputLabel>
                  <MuiSelect
                    labelId="frequency-label"
                    label="Frequency"
                    displayEmpty
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Frequency</em></MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <TextField
                  required
                  label="Start Date"
                  placeholder="Select Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
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
                  label="End Date"
                  placeholder="Select Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="assigned-to-label" shrink>Assigned To</InputLabel>
                  <MuiSelect
                    labelId="assigned-to-label"
                    label="Assigned To"
                    displayEmpty
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Assignee</em></MenuItem>
                    <MenuItem value="john-doe">John Doe</MenuItem>
                    <MenuItem value="jane-smith">Jane Smith</MenuItem>
                    <MenuItem value="mike-johnson">Mike Johnson</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="priority-label" shrink>Priority</InputLabel>
                  <MuiSelect
                    labelId="priority-label"
                    label="Priority"
                    displayEmpty
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
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
                  <InputLabel id="location-label" shrink>Location</InputLabel>
                  <MuiSelect
                    labelId="location-label"
                    label="Location"
                    displayEmpty
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Location</em></MenuItem>
                    <MenuItem value="building-a">Building A</MenuItem>
                    <MenuItem value="building-b">Building B</MenuItem>
                    <MenuItem value="parking">Parking Area</MenuItem>
                    <MenuItem value="lobby">Lobby</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="mb-4">
              <TextField
                label="Description"
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Fields Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
                ADDITIONAL FIELDS
              </div>
              <Button 
                type="button"
                onClick={addField}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dynamicFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <TextField
                      label="Field Label"
                      placeholder="Enter field label"
                      value={field.label}
                      onChange={(e) => updateDynamicField(field.id, 'label', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                    />
                  </div>
                  
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id={`field-type-${field.id}`} shrink>Field Type</InputLabel>
                      <MuiSelect
                        labelId={`field-type-${field.id}`}
                        label="Field Type"
                        value={field.type}
                        onChange={(e) => updateDynamicField(field.id, 'type', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="select">Dropdown</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    {field.type === 'select' ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id={`field-value-${field.id}`} shrink>Field Value</InputLabel>
                        <MuiSelect
                          labelId={`field-value-${field.id}`}
                          label="Field Value"
                          displayEmpty
                          value={field.value}
                          onChange={(e) => updateDynamicField(field.id, 'value', e.target.value)}
                          sx={fieldStyles}
                        >
                          <MenuItem value=""><em>Select Value</em></MenuItem>
                          <MenuItem value="option1">Option 1</MenuItem>
                          <MenuItem value="option2">Option 2</MenuItem>
                          <MenuItem value="option3">Option 3</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    ) : (
                      <TextField
                        label="Field Value"
                        placeholder="Enter field value"
                        type={field.type}
                        value={field.value}
                        onChange={(e) => updateDynamicField(field.id, 'value', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                      />
                    )}
                  </div>

                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeDynamicField(field.id)}
                      disabled={dynamicFields.length === 1}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            type="submit"
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Save Schedule
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate('/maintenance/schedule')}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};
