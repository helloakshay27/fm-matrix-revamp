
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox } from '@mui/material';

export const UtilityWasteGenerationSetupDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    setupName: '',
    location: '',
    category: '',
    frequency: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    priority: '',
    description: '',
    autoCalculate: false
  });

  const [utilityFields, setUtilityFields] = useState([
    { 
      id: Date.now(), 
      utilityType: '', 
      unit: '', 
      threshold: '',
      alertEnabled: false 
    }
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addUtilityField = () => {
    setUtilityFields([...utilityFields, { 
      id: Date.now(), 
      utilityType: '', 
      unit: '', 
      threshold: '',
      alertEnabled: false 
    }]);
  };

  const updateUtilityField = (id: number, field: string, value: string | boolean) => {
    setUtilityFields(utilityFields.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeUtilityField = (id: number) => {
    if (utilityFields.length > 1) {
      setUtilityFields(utilityFields.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Utility Waste Generation Setup:', { ...formData, utilityFields });
    
    toast({
      title: "Success",
      description: "Utility waste generation setup created successfully!",
    });
    
    navigate('/maintenance/audit/waste/utility');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/audit/waste/utility')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Utility Waste
        </Button>
        <p className="text-[#1a1a1a] opacity-70 mb-2">Utility Waste &gt; Setup Dashboard</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">UTILITY WASTE GENERATION SETUP</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
              SETUP DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <TextField
                  required
                  label="Setup Name"
                  placeholder="Enter Setup Name"
                  name="setupName"
                  value={formData.setupName}
                  onChange={(e) => handleInputChange('setupName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
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
                    <MenuItem value="common-area">Common Area</MenuItem>
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
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Category</em></MenuItem>
                    <MenuItem value="water">Water</MenuItem>
                    <MenuItem value="electricity">Electricity</MenuItem>
                    <MenuItem value="gas">Gas</MenuItem>
                    <MenuItem value="waste">Waste</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                  </MuiSelect>
                </FormControl>
              </div>

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.autoCalculate}
                  onChange={(e) => handleInputChange('autoCalculate', e.target.checked)}
                />
                <span>Enable Auto Calculation</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Utility Fields Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
                UTILITY CONFIGURATION
              </div>
              <Button 
                type="button"
                onClick={addUtilityField}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Utility
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {utilityFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 border rounded">
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id={`utility-type-${field.id}`} shrink>Utility Type</InputLabel>
                      <MuiSelect
                        labelId={`utility-type-${field.id}`}
                        label="Utility Type"
                        displayEmpty
                        value={field.utilityType}
                        onChange={(e) => updateUtilityField(field.id, 'utilityType', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select Type</em></MenuItem>
                        <MenuItem value="water">Water</MenuItem>
                        <MenuItem value="electricity">Electricity</MenuItem>
                        <MenuItem value="gas">Gas</MenuItem>
                        <MenuItem value="heating">Heating</MenuItem>
                        <MenuItem value="cooling">Cooling</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id={`unit-${field.id}`} shrink>Unit</InputLabel>
                      <MuiSelect
                        labelId={`unit-${field.id}`}
                        label="Unit"
                        displayEmpty
                        value={field.unit}
                        onChange={(e) => updateUtilityField(field.id, 'unit', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select Unit</em></MenuItem>
                        <MenuItem value="kWh">kWh</MenuItem>
                        <MenuItem value="liters">Liters</MenuItem>
                        <MenuItem value="cubic-meters">Cubic Meters</MenuItem>
                        <MenuItem value="tons">Tons</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <TextField
                      label="Threshold"
                      placeholder="Enter threshold"
                      type="number"
                      value={field.threshold}
                      onChange={(e) => updateUtilityField(field.id, 'threshold', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.alertEnabled}
                        onChange={(e) => updateUtilityField(field.id, 'alertEnabled', e.target.checked)}
                      />
                      <span>Alert</span>
                    </label>
                  </div>

                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeUtilityField(field.id)}
                      disabled={utilityFields.length === 1}
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
            Save Setup
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate('/maintenance/audit/waste/utility')}
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
