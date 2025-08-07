
import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, RadioGroup, FormControlLabel, Radio, Checkbox as MuiCheckbox, Switch as MuiSwitch, Button as MuiButton, Card, CardContent, Typography, Box, TextareaAutosize, FormLabel } from '@mui/material';
import { Button } from '@/components/ui/button';
import { CalendarToday, LocationOn, Schedule, Group, AttachFile, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const AddBroadcastPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    markAsImportant: false,
    endDate: '',
    endTime: '',
    shareWith: 'all',
    selectedIndividuals: [],
    selectedGroups: []
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitting broadcast data:', formData);
    // In a real app, this would save the broadcast to the backend
    navigate('/crm/broadcast');
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
  };

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

  return (
    <Box sx={{
      p: 3,
      bgcolor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 3
      }}>
        <MuiButton startIcon={<ArrowBack />} onClick={() => navigate('/crm/broadcast')} sx={{
          color: '#666',
          textTransform: 'none'
        }}>
          Back to Broadcasts
        </MuiButton>
      </Box>

      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Communication Information Section */}
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 2,
          p: 4,
          mb: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4
          }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              1
            </Box>
            <Typography variant="h6" sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: 'black'
            }}>
              Communication Information
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            <Box sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap'
            }}>
              <Box sx={{
                flex: '1 1 300px'
              }}>
                <TextField 
                  label="Title*" 
                  placeholder="Title" 
                  fullWidth 
                  variant="outlined" 
                  value={formData.title} 
                  onChange={e => handleInputChange('title', e.target.value)} 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  sx={fieldStyles} 
                />
              </Box>
              <Box sx={{
                flex: '1 1 300px'
              }}>
                <TextField 
                  label="End Date" 
                  type="date" 
                  fullWidth 
                  variant="outlined" 
                  value={formData.endDate} 
                  onChange={e => handleInputChange('endDate', e.target.value)} 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  sx={fieldStyles} 
                />
              </Box>
            </Box>
            
            <Box sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap'
            }}>
              <Box sx={{
                flex: '1 1 300px'
              }}>
                <TextField 
                  label="End Time" 
                  type="time" 
                  fullWidth 
                  variant="outlined" 
                  value={formData.endTime} 
                  onChange={e => handleInputChange('endTime', e.target.value)} 
                  InputLabelProps={{
                    shrink: true
                  }} 
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
                onChange={e => handleInputChange('description', e.target.value)} 
                InputLabelProps={{
                  shrink: true
                }} 
              />
            </Box>
          </Box>
        </Box>

        {/* Broadcast Settings Section */}
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 2,
          p: 4,
          mb: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4
          }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              2
            </Box>
            <Typography variant="h6" sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: 'black'
            }}>
              Broadcast Settings
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <FormLabel component="legend" sx={{ minWidth: '80px' }}>Share with</FormLabel>
              <RadioGroup row value={formData.shareWith} onChange={e => handleInputChange('shareWith', e.target.value)}>
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="individuals" control={<Radio />} label="Individuals" />
                <FormControlLabel value="groups" control={<Radio />} label="Groups" />
              </RadioGroup>
            </Box>

            {/* Conditional dropdown for Individuals */}
            {formData.shareWith === 'individuals' && (
              <Box sx={{ ml: 4 }}>
                <FormControl fullWidth sx={{ maxWidth: 400 }}>
                  <InputLabel>Select Individuals</InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.selectedIndividuals}
                    onChange={e => handleInputChange('selectedIndividuals', e.target.value)}
                    label="Select Individuals"
                    sx={{
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#dc2626'
                      }
                    }}
                  >
                    <MenuItem value="john.doe@company.com">John Doe</MenuItem>
                    <MenuItem value="jane.smith@company.com">Jane Smith</MenuItem>
                    <MenuItem value="mike.johnson@company.com">Mike Johnson</MenuItem>
                    <MenuItem value="sarah.wilson@company.com">Sarah Wilson</MenuItem>
                    <MenuItem value="david.brown@company.com">David Brown</MenuItem>
                  </MuiSelect>
                </FormControl>
              </Box>
            )}

            {/* Conditional dropdown for Groups */}
            {formData.shareWith === 'groups' && (
              <Box sx={{ ml: 4 }}>
                <FormControl fullWidth sx={{ maxWidth: 400 }}>
                  <InputLabel>Select Groups</InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.selectedGroups}
                    onChange={e => handleInputChange('selectedGroups', e.target.value)}
                    label="Select Groups"
                    sx={{
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#dc2626'
                      }
                    }}
                  >
                    <MenuItem value="marketing">Marketing Team</MenuItem>
                    <MenuItem value="sales">Sales Team</MenuItem>
                    <MenuItem value="development">Development Team</MenuItem>
                    <MenuItem value="hr">HR Department</MenuItem>
                    <MenuItem value="finance">Finance Department</MenuItem>
                  </MuiSelect>
                </FormControl>
              </Box>
            )}

            <Box sx={{
              display: 'flex',
              gap: 4
            }}>
              <FormControlLabel control={<MuiCheckbox checked={formData.markAsImportant} onChange={e => handleInputChange('markAsImportant', e.target.checked)} />} label="Mark as Important" />
            </Box>
          </Box>
        </Box>

        {/* Upload Files Section */}
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 2,
          p: 4,
          mb: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4
          }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              3
            </Box>
            <Typography variant="h6" sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: 'black'
            }}>
              Attachments
            </Typography>
          </Box>

          <Box onClick={handleFileUpload} sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#999'
            }
          }}>
            <AttachFile sx={{
              fontSize: 48,
              color: '#ccc',
              mb: 2
            }} />
            <Typography variant="body2" color="text.secondary">
              Choose files | No file chosen
            </Typography>
          </Box>
        </Box>

        {/* Submit Button */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4
        }}>
          <Button onClick={handleSubmit} className="px-8 py-3 text-base">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
