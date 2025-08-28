
import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Alert
} from '@mui/material';

const AddPollPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    startDate: '',
    endDate: '',
    startTime: '04:00 AM',
    endTime: '04:00 AM',
    shareWith: 'all',
    options: ['', '']
  });
  const [selectedShareWith, setSelectedShareWith] = useState('all');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Poll Data:', formData);
    // Add your submission logic here
    navigate('/crm/polls');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Paper 
        elevation={1}
        sx={{ 
          borderTop: 4, 
          borderColor: '#C72030', 
          p: 3,
          borderRadius: 0,
          bgcolor: 'background.paper'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton 
            onClick={() => navigate('/crm/polls')}
            sx={{ 
              p: 1,
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Create New Poll
          </Typography>
        </Stack>
      </Paper>

      {/* Form */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Subject */}
              <TextField
                label="Subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Enter poll subject"
                required
                fullWidth
                variant="outlined"
              />

              {/* Date and Time Row */}
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
                  gap: 3 
                }}
              >
                <TextField
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={20} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={20} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Clock size={20} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="End Time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Clock size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Participation Info */}
              <Alert 
                severity="info" 
                sx={{ 
                  bgcolor: 'rgba(199, 32, 48, 0.08)', 
                  borderColor: 'rgba(199, 32, 48, 0.2)',
                  '& .MuiAlert-icon': {
                    color: '#C72030'
                  }
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <FormControl 
                    size="small" 
                    sx={{ 
                      minWidth: 120,
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#C72030'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#C72030'
                      }
                    }}
                  >
                    <InputLabel>Share</InputLabel>
                    <Select
                      value={selectedShareWith}
                      onChange={(e) => setSelectedShareWith(e.target.value)}
                      label="Share"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="individual">Individual</MenuItem>
                      <MenuItem value="group">Group</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" color="text.secondary">
                    User can participate in the poll from a Flat.
                  </Typography>
                </Stack>
              </Alert>

              {/* Poll Options */}
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
                  Poll Options
                </Typography>
                
                <Stack spacing={2}>
                  {formData.options.map((option, index) => (
                    <Stack key={index} direction="row" alignItems="center" spacing={2}>
                      <TextField
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                        fullWidth
                        size="small"
                      />
                      {formData.options.length > 2 && (
                        <IconButton
                          onClick={() => removeOption(index)}
                          sx={{ color: 'error.main' }}
                          size="small"
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
                
                <Button
                  type="button"
                  onClick={addOption}
                  startIcon={<Plus size={18} />}
                  sx={{ 
                    mt: 2,
                    bgcolor: '#C72030',
                    '&:hover': { bgcolor: '#B01E2A' },
                    color: 'white',
                    borderRadius: 2
                  }}
                  variant="contained"
                >
                  Add Option
                </Button>
              </Card>

              {/* Share With Section */}
              <Card 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(199, 32, 48, 0.04)',
                  borderColor: 'rgba(199, 32, 48, 0.12)'
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    color: 'text.secondary'
                  }}
                >
                  Share With
                </Typography>
                
                <RadioGroup
                  row
                  value={selectedShareWith}
                  onChange={(e) => setSelectedShareWith(e.target.value)}
                  sx={{
                    '& .MuiRadio-root': {
                      color: 'rgba(199, 32, 48, 0.6)',
                      '&.Mui-checked': {
                        color: '#C72030'
                      }
                    }
                  }}
                >
                  <FormControlLabel 
                    value="all" 
                    control={<Radio size="small" />} 
                    label="All" 
                  />
                  <FormControlLabel 
                    value="individual" 
                    control={<Radio size="small" />} 
                    label="Individual" 
                  />
                  <FormControlLabel 
                    value="group" 
                    control={<Radio size="small" />} 
                    label="Group" 
                  />
                </RadioGroup>
              </Card>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#C72030',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(199, 32, 48, 0.3)',
                    '&:hover': { 
                      bgcolor: '#B01E2A',
                      boxShadow: '0 6px 16px rgba(199, 32, 48, 0.4)'
                    }
                  }}
                >
                  Submit Poll
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddPollPage;
