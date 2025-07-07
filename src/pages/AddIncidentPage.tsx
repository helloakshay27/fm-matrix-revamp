
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Heading } from '@/components/ui/heading';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
    fontSize: { xs: '16px', sm: '18px', md: '20px' }, // Responsive font sizes
  },
  '& .MuiInputLabel-root': {
    fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Label font sizes
  },
};

export const AddIncidentPage = () => {
  const navigate = useNavigate();
  const [incidentData, setIncidentData] = useState({
    title: '',
    description: '',
    priority: '',
    category: '',
    location: '',
    reportedBy: '',
    assignedTo: '',
    status: 'Open',
    incidentDate: '',
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

  const handleSubmit = () => {
    if (!incidentData.title || !incidentData.description) {
      toast.error('Please fill all required fields');
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
        <nav className="flex items-center text-xs sm:text-sm md:text-base text-gray-600 mb-4">
          <span>Home</span>
          <span className="mx-2">{'>'}</span>
          <span>Safety</span>
          <span className="mx-2">{'>'}</span>
          <span>Incident</span>
        </nav>
        <Heading level="h1" variant="primary" spacing="none" className="text-[#C72030] font-semibold text-base sm:text-xl md:text-2xl">
          NEW INCIDENT
        </Heading>
      </div>

      {/* Basic Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm">ℹ️</span>
            </div>
            <Heading level="h2" variant="primary" spacing="none" className="text-[#C72030] font-semibold text-sm sm:text-lg md:text-xl">
              INCIDENT DETAILS
            </Heading>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Incident Title*"
              value={incidentData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' } }}>Priority*</InputLabel>
              <MuiSelect
                label="Priority*"
                value={incidentData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Priority</em></MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' } }}>Category</InputLabel>
              <MuiSelect
                label="Category"
                value={incidentData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Category</em></MenuItem>
                <MenuItem value="safety">Safety</MenuItem>
                <MenuItem value="security">Security</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="it">IT</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Location"
              value={incidentData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Reported By"
              value={incidentData.reportedBy}
              onChange={(e) => handleInputChange('reportedBy', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Incident Date"
              type="date"
              value={incidentData.incidentDate}
              onChange={(e) => handleInputChange('incidentDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="mt-6">
            <div className="relative">
              <textarea
                id="description"
                placeholder=" "
                value={incidentData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md resize-vertical min-h-[100px] text-sm sm:text-base md:text-lg placeholder-transparent focus:outline-none focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030] peer"
                rows={4}
              />
              <label
                htmlFor="description"
                className="absolute left-3 -top-2.5 bg-white px-1 text-xs sm:text-sm md:text-base font-medium text-gray-700 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm sm:peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs sm:peer-focus:text-sm md:peer-focus:text-base peer-focus:text-[#C72030]"
              >
                Description*
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm">📎</span>
            </div>
            <Heading level="h2" variant="primary" spacing="none" className="text-[#C72030] font-semibold text-sm sm:text-lg md:text-xl">
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
                className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-xs sm:text-sm md:text-base"
              >
                Choose Files
              </label>
              <span className="ml-4 text-xs sm:text-sm md:text-base text-gray-500">
                {incidentData.attachments ? incidentData.attachments.name : 'No file chosen'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button
          variant="outline"
          onClick={() => navigate('/incidents')}
          className="text-xs sm:text-sm md:text-base px-4 py-2 sm:px-6 sm:py-2"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 px-6 py-2 sm:px-8 sm:py-3 text-xs sm:text-sm md:text-base"
        >
          Report Incident
        </Button>
      </div>
    </div>
  );
};

export default AddIncidentPage;
