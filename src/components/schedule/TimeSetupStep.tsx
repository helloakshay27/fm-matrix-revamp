import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box,
  Collapse,
  IconButton,
  Button,
  Grid,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Chip
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess, 
  Edit, 
  Check
} from '@mui/icons-material';

interface TimeSlot {
  hours: number[];
  minutes: number[];
  days: number[];
  months: number[];
}

interface TimeSetupStepProps {
  data: {
    timeSlots: TimeSlot;
    selectedDays: number[];
    selectedMonths: number[];
  };
  onChange: (field: string, value: any) => void;
  isCompleted?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  errors?: Record<string, string>;
}

export const TimeSetupStep = ({ 
  data, 
  onChange, 
  isCompleted = false, 
  isCollapsed = false, 
  onToggleCollapse,
  errors = {}
}: TimeSetupStepProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleTimeSelection = (type: 'hours' | 'minutes' | 'days' | 'months', value: number) => {
    const currentSelection = data.timeSlots?.[type] || [];
    const newSelection = currentSelection.includes(value)
      ? currentSelection.filter(item => item !== value)
      : [...currentSelection, value];
    
    onChange('timeSlots', {
      ...data.timeSlots,
      [type]: newSelection
    });
  };

  // Collapsed view
  if (isCompleted && isCollapsed) {
    const selectedHours = data.timeSlots?.hours?.length || 0;
    const selectedMinutes = data.timeSlots?.minutes?.length || 0;
    const selectedDays = data.timeSlots?.days?.length || 0;
    const selectedMonths = data.timeSlots?.months?.length || 0;
    
    return (
      <Card sx={{ mb: 2, border: '1px solid #E5E7EB' }}>
        <CardHeader
          sx={{ 
            pb: 2,
            '& .MuiCardHeader-content': { flex: '1 1 auto' },
            '& .MuiCardHeader-action': { mt: 0, mr: 0 }
          }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Check sx={{ color: '#059669', fontSize: 20 }} />
              <Typography variant="h6" sx={{ color: '#059669', fontSize: '16px', fontWeight: 600 }}>
                Time Setup
              </Typography>
            </Box>
          }
          subheader={
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`${selectedHours} hours`} size="small" variant="outlined" />
              <Chip label={`${selectedMinutes} minutes`} size="small" variant="outlined" />
              <Chip label={`${selectedDays} days`} size="small" variant="outlined" />
              <Chip label={`${selectedMonths} months`} size="small" variant="outlined" />
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                startIcon={<Edit />}
                onClick={onToggleCollapse}
                sx={{ 
                  color: '#C72030',
                  textTransform: 'none',
                  fontSize: '12px'
                }}
              >
                Edit
              </Button>
              <IconButton onClick={onToggleCollapse} size="small">
                <ExpandMore />
              </IconButton>
            </Box>
          }
        />
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2, border: isCompleted ? '1px solid #059669' : '1px solid #E5E7EB' }}>
      <CardHeader
        sx={{ 
          pb: 1,
          '& .MuiCardHeader-content': { flex: '1 1 auto' },
          '& .MuiCardHeader-action': { mt: 0, mr: 0 }
        }}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isCompleted && <Check sx={{ color: '#059669', fontSize: 20 }} />}
            <Typography 
              variant="h6" 
              sx={{ 
                color: isCompleted ? '#059669' : '#111827', 
                fontSize: '16px', 
                fontWeight: 600 
              }}
            >
              Time Setup
            </Typography>
          </Box>
        }
        action={
          isCompleted && onToggleCollapse && (
            <IconButton onClick={onToggleCollapse} size="small">
              <ExpandLess />
            </IconButton>
          )
        }
      />
      
      <Collapse in={!isCollapsed || !isCompleted} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                },
                '& .Mui-selected': {
                  color: '#C72030 !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#C72030',
                },
              }}
            >
              <Tab label="Hours" />
              <Tab label="Minutes" />
              <Tab label="Day" />
              <Tab label="Month" />
            </Tabs>
          </Box>

          {/* Hours Tab */}
          {activeTab === 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: 1 }}>
              {hours.map((hour) => (
                <Box key={hour}>
                  <Button
                    variant={data.timeSlots?.hours?.includes(hour) ? "contained" : "outlined"}
                    fullWidth
                    size="small"
                    onClick={() => handleTimeSelection('hours', hour)}
                    sx={{
                      minWidth: 'auto',
                      backgroundColor: data.timeSlots?.hours?.includes(hour) ? '#C72030' : 'transparent',
                      borderColor: '#C72030',
                      color: data.timeSlots?.hours?.includes(hour) ? 'white' : '#C72030',
                      '&:hover': {
                        backgroundColor: data.timeSlots?.hours?.includes(hour) ? '#C72030' : 'rgba(199, 32, 48, 0.04)',
                        borderColor: '#C72030',
                      },
                    }}
                  >
                    {hour.toString().padStart(2, '0')}
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          {/* Minutes Tab */}
          {activeTab === 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: 1 }}>
              {minutes.filter((_, index) => index % 5 === 0).map((minute) => (
                <Box key={minute}>
                  <Button
                    variant={data.timeSlots?.minutes?.includes(minute) ? "contained" : "outlined"}
                    fullWidth
                    size="small"
                    onClick={() => handleTimeSelection('minutes', minute)}
                    sx={{
                      minWidth: 'auto',
                      backgroundColor: data.timeSlots?.minutes?.includes(minute) ? '#C72030' : 'transparent',
                      borderColor: '#C72030',
                      color: data.timeSlots?.minutes?.includes(minute) ? 'white' : '#C72030',
                      '&:hover': {
                        backgroundColor: data.timeSlots?.minutes?.includes(minute) ? '#C72030' : 'rgba(199, 32, 48, 0.04)',
                        borderColor: '#C72030',
                      },
                    }}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          {/* Days Tab */}
          {activeTab === 2 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: 1 }}>
              {days.map((day) => (
                <Box key={day}>
                  <Button
                    variant={data.timeSlots?.days?.includes(day) ? "contained" : "outlined"}
                    fullWidth
                    size="small"
                    onClick={() => handleTimeSelection('days', day)}
                    sx={{
                      minWidth: 'auto',
                      backgroundColor: data.timeSlots?.days?.includes(day) ? '#C72030' : 'transparent',
                      borderColor: '#C72030',
                      color: data.timeSlots?.days?.includes(day) ? 'white' : '#C72030',
                      '&:hover': {
                        backgroundColor: data.timeSlots?.days?.includes(day) ? '#C72030' : 'rgba(199, 32, 48, 0.04)',
                        borderColor: '#C72030',
                      },
                    }}
                  >
                    {day}
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          {/* Months Tab */}
          {activeTab === 3 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1 }}>
              {months.map((month, index) => (
                <Box key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.timeSlots?.months?.includes(index) || false}
                        onChange={() => handleTimeSelection('months', index)}
                        sx={{
                          color: '#C72030',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
                    }
                    label={month}
                  />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};