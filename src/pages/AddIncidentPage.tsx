
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { Heading } from '@/components/ui/heading';

const fieldStyles = {
  height: {
    xs: 28,
    sm: 36,
    md: 45
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: {
      xs: '8px',
      sm: '10px',
      md: '12px'
    }
  }
};

export const AddIncidentPage = () => {
  const navigate = useNavigate();
  const [incidentData, setIncidentData] = useState({
    year: '2025',
    month: 'August',
    day: '12',
    hour: '12',
    minute: '25',
    building: '',
    primaryCategory: '',
    categoryForIncident: '',
    secondaryCategory: '',
    secondaryCategoryForIncident: '',
    severity: '',
    probability: '',
    incidentLevel: '',
    description: '',
    supportRequired: false,
    factsCorrect: false,
    attachments: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setIncidentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIncidentData(prev => ({
        ...prev,
        attachments: file
      }));
      toast.success('File uploaded successfully');
    }
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setIncidentData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSubmit = () => {
    if (!incidentData.description || !incidentData.factsCorrect) {
      toast.error('Please fill all required fields and confirm facts');
      return;
    }
    console.log('Incident Data:', incidentData);
    toast.success('Incident reported successfully!');
    navigate('/incidents');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Home</span>
          <span className="mx-2">{'>'}</span>
          <span>Safety</span>
          <span className="mx-2">{'>'}</span>
          <span>Incident</span>
        </nav>
        <Heading level="h1" variant="primary" spacing="none" className="text-[#C72030] font-semibold">
          NEW INCIDENT
        </Heading>
      </div>

      {/* Basic Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">ℹ️</span>
            </div>
            <Heading level="h2" variant="primary" spacing="none" className="text-[#C72030] font-semibold">
              INCIDENT DETAILS
            </Heading>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-base">
          {/* Time & Date Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Time & Date *</h3>
            <div className="grid grid-cols-5 gap-2">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Year</InputLabel>
                <MuiSelect 
                  label="Year"
                  value={incidentData.year}
                  onChange={e => handleInputChange('year', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Month</InputLabel>
                <MuiSelect 
                  label="Month"
                  value={incidentData.month}
                  onChange={e => handleInputChange('month', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value="January">January</MenuItem>
                  <MenuItem value="February">February</MenuItem>
                  <MenuItem value="March">March</MenuItem>
                  <MenuItem value="April">April</MenuItem>
                  <MenuItem value="May">May</MenuItem>
                  <MenuItem value="June">June</MenuItem>
                  <MenuItem value="July">July</MenuItem>
                  <MenuItem value="August">August</MenuItem>
                  <MenuItem value="September">September</MenuItem>
                  <MenuItem value="October">October</MenuItem>
                  <MenuItem value="November">November</MenuItem>
                  <MenuItem value="December">December</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Day</InputLabel>
                <MuiSelect 
                  label="Day"
                  value={incidentData.day}
                  onChange={e => handleInputChange('day', e.target.value)}
                  sx={fieldStyles}
                >
                  {Array.from({length: 31}, (_, i) => (
                    <MenuItem key={i + 1} value={String(i + 1)}>{i + 1}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Hour</InputLabel>
                <MuiSelect 
                  label="Hour"
                  value={incidentData.hour}
                  onChange={e => handleInputChange('hour', e.target.value)}
                  sx={fieldStyles}
                >
                  {Array.from({length: 24}, (_, i) => (
                    <MenuItem key={i} value={String(i)}>{i}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Minute</InputLabel>
                <MuiSelect 
                  label="Minute"
                  value={incidentData.minute}
                  onChange={e => handleInputChange('minute', e.target.value)}
                  sx={fieldStyles}
                >
                  {Array.from({length: 60}, (_, i) => (
                    <MenuItem key={i} value={String(i)}>{i}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Building and Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Building *</InputLabel>
              <MuiSelect 
                label="Building *"
                value={incidentData.building}
                onChange={e => handleInputChange('building', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Building</em></MenuItem>
                <MenuItem value="building1">Building 1</MenuItem>
                <MenuItem value="building2">Building 2</MenuItem>
                <MenuItem value="building3">Building 3</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Select The Category For The Incident</InputLabel>
              <MuiSelect 
                label="Select The Category For The Incident"
                value={incidentData.categoryForIncident}
                onChange={e => handleInputChange('categoryForIncident', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="safety">Safety</MenuItem>
                <MenuItem value="security">Security</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="environmental">Environmental</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Select The Incident Primary Category *</InputLabel>
              <MuiSelect 
                label="Select The Incident Primary Category *"
                value={incidentData.primaryCategory}
                onChange={e => handleInputChange('primaryCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="fire">Fire</MenuItem>
                <MenuItem value="injury">Injury</MenuItem>
                <MenuItem value="equipment">Equipment</MenuItem>
                <MenuItem value="chemical">Chemical</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Select The Category For The Incident</InputLabel>
              <MuiSelect 
                label="Select The Category For The Incident"
                value={incidentData.categoryForIncident}
                onChange={e => handleInputChange('categoryForIncident', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="minor">Minor</MenuItem>
                <MenuItem value="major">Major</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Select The Incident Secondary Category</InputLabel>
              <MuiSelect 
                label="Select The Incident Secondary Category"
                value={incidentData.secondaryCategory}
                onChange={e => handleInputChange('secondaryCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="slip">Slip</MenuItem>
                <MenuItem value="fall">Fall</MenuItem>
                <MenuItem value="cut">Cut</MenuItem>
                <MenuItem value="burn">Burn</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Select The Secondary Category For The Incident</InputLabel>
              <MuiSelect 
                label="Select The Secondary Category For The Incident"
                value={incidentData.secondaryCategoryForIncident}
                onChange={e => handleInputChange('secondaryCategoryForIncident', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                <MenuItem value="immediate">Immediate</MenuItem>
                <MenuItem value="delayed">Delayed</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Severity *</InputLabel>
              <MuiSelect 
                label="Severity *"
                value={incidentData.severity}
                onChange={e => handleInputChange('severity', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Severity</em></MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Probability *</InputLabel>
              <MuiSelect 
                label="Probability *"
                value={incidentData.probability}
                onChange={e => handleInputChange('probability', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Probability</em></MenuItem>
                <MenuItem value="rare">Rare</MenuItem>
                <MenuItem value="unlikely">Unlikely</MenuItem>
                <MenuItem value="possible">Possible</MenuItem>
                <MenuItem value="likely">Likely</MenuItem>
                <MenuItem value="certain">Certain</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Incident level *</InputLabel>
              <MuiSelect 
                label="Incident level *"
                value={incidentData.incidentLevel}
                onChange={e => handleInputChange('incidentLevel', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Level</em></MenuItem>
                <MenuItem value="1">Level 1</MenuItem>
                <MenuItem value="2">Level 2</MenuItem>
                <MenuItem value="3">Level 3</MenuItem>
                <MenuItem value="4">Level 4</MenuItem>
                <MenuItem value="5">Level 5</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Description */}
          <div className="mt-6">
            <TextField
              label="Description*"
              value={incidentData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              InputLabelProps={{
                shrink: true
              }}
              sx={{
                mt: 1
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Support and Disclaimer */}
      <Card className="mb-6">
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Support</h3>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={incidentData.supportRequired}
                    onChange={(e) => handleCheckboxChange('supportRequired', e.target.checked)}
                    sx={{
                      color: '#C72030',
                      '&.Mui-checked': {
                        color: '#C72030',
                      },
                    }}
                  />
                }
                label="Support required"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Disclaimer</h3>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={incidentData.factsCorrect}
                    onChange={(e) => handleCheckboxChange('factsCorrect', e.target.checked)}
                    sx={{
                      color: '#C72030',
                      '&.Mui-checked': {
                        color: '#C72030',
                      },
                    }}
                  />
                }
                label="I have correctly stated all the facts related to the incident."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📎</span>
            </div>
            <Heading level="h2" variant="primary" spacing="none" className="text-[#C72030] font-semibold">
              ATTACHMENTS
            </Heading>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input 
                type="file" 
                onChange={handleFileUpload} 
                className="hidden" 
                id="file-upload" 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
              />
              <label 
                htmlFor="file-upload" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                Choose Files
              </label>
              <span className="ml-4 text-sm text-gray-500">
                {incidentData.attachments ? incidentData.attachments.name : 'No file chosen'}
              </span>
            </div>
            
            <div>
              <Button 
                style={{
                  backgroundColor: '#C72030'
                }} 
                className="text-white hover:opacity-90"
              >
                Choose a file...
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSubmit} 
          style={{
            backgroundColor: '#8B4A8C'
          }} 
          className="text-white hover:opacity-90 px-8 py-3 text-lg"
        >
          Create Incident
        </Button>
      </div>
    </div>
  );
};

export default AddIncidentPage;
