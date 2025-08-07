import React, { useState } from 'react';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select as MuiSelect, 
  MenuItem, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Checkbox as MuiCheckbox, 
  Switch as MuiSwitch, 
  Button as MuiButton,
  Card,
  CardContent,
  Typography,
  Box,
  TextareaAutosize,
  FormLabel
} from '@mui/material';
import { CalendarToday, LocationOn, Schedule, Group, AttachFile, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const AddEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    description: '',
    startDate: '',
    startTime: '17:00',
    endDate: '',
    endTime: '17:00',
    markAsImportant: false,
    sendEmail: false,
    shareWith: 'all',
    rsvpEnabled: true
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitting event data:', formData);
    navigate('/crm/events');
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Event List &gt; Create Event
      </Typography>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <MuiButton
          startIcon={<ArrowBack />}
          onClick={() => navigate('/crm/events')}
          sx={{ color: '#666', textTransform: 'none' }}
        >
          Back to Events
        </MuiButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          NEW Event
        </Typography>
      </Box>

      <Card sx={{ maxWidth: '1200px' }}>
        <CardContent sx={{ p: 4 }}>
          
          {/* Event Information Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              p: 2,
              bgcolor: '#fff3e0',
              borderRadius: 1
            }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: '#ff9800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <CalendarToday sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                textTransform: 'uppercase',
                color: '#ff9800'
              }}>
                Event Information
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    label="Title*"
                    placeholder="Title"
                    fullWidth
                    variant="outlined"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    label="Venue*"
                    placeholder="Enter Venue"
                    fullWidth
                    variant="outlined"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField
                    label="Start date*"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField
                    label="End date*"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField
                    label="Start Time*"
                    type="time"
                    fullWidth
                    variant="outlined"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField
                    label="End Time*"
                    type="time"
                    fullWidth
                    variant="outlined"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </Box>
              </Box>
              
              <Box>
                <TextField
                  label="Description"
                  placeholder="Enter Description"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormLabel component="legend">RSVP</FormLabel>
                <RadioGroup
                  row
                  value={formData.rsvpEnabled ? 'yes' : 'no'}
                  onChange={(e) => handleInputChange('rsvpEnabled', e.target.value === 'yes')}
                >
                  <FormControlLabel value="no" control={<Radio />} label="NO" />
                  <FormControlLabel value="yes" control={<Radio />} label="YES" />
                </RadioGroup>
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 4 }}>
              <FormLabel component="legend">Share with</FormLabel>
              <RadioGroup
                row
                value={formData.shareWith}
                onChange={(e) => handleInputChange('shareWith', e.target.value)}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="individuals" control={<Radio />} label="Individuals" />
                <FormControlLabel value="groups" control={<Radio />} label="Groups" />
              </RadioGroup>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 4 }}>
              <FormControlLabel
                control={
                  <MuiCheckbox
                    checked={formData.markAsImportant}
                    onChange={(e) => handleInputChange('markAsImportant', e.target.checked)}
                  />
                }
                label="Mark as Important"
              />
              <FormControlLabel
                control={
                  <MuiCheckbox
                    checked={formData.sendEmail}
                    onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                  />
                }
                label="Send Email"
              />
            </Box>
          </Box>

          {/* Attachments Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              p: 2,
              bgcolor: '#fff3e0',
              borderRadius: 1
            }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: '#ff9800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <AttachFile sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                textTransform: 'uppercase',
                color: '#ff9800'
              }}>
                Attachments
              </Typography>
            </Box>

            <Box
              onClick={handleFileUpload}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: '#999'
                }
              }}
            >
              <AttachFile sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Choose files | No file chosen
              </Typography>
            </Box>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <MuiButton
              variant="contained"
              onClick={handleSubmit}
              sx={{
                bgcolor: '#8B4A6B',
                color: 'white',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '16px',
                '&:hover': {
                  bgcolor: '#7A4060'
                }
              }}
            >
              Create Event
            </MuiButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};