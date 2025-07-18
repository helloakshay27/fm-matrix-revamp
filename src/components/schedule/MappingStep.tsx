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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess, 
  Edit, 
  Check,
  Add,
  Delete
} from '@mui/icons-material';

interface MappingRow {
  id: string;
  assetParameter: string;
  mappedTo: string;
  status: 'mapped' | 'unmapped';
}

interface MappingStepProps {
  data: {
    mappings: MappingRow[];
  };
  onChange: (field: string, value: any) => void;
  isCompleted?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  errors?: Record<string, string>;
}

export const MappingStep = ({ 
  data, 
  onChange, 
  isCompleted = false, 
  isCollapsed = false, 
  onToggleCollapse,
  errors = {}
}: MappingStepProps) => {

  const addMapping = () => {
    const newMapping: MappingRow = {
      id: `mapping_${Date.now()}`,
      assetParameter: '',
      mappedTo: '',
      status: 'unmapped'
    };
    onChange('mappings', [...(data.mappings || []), newMapping]);
  };

  const updateMapping = (id: string, field: string, value: string) => {
    const updatedMappings = (data.mappings || []).map(mapping => 
      mapping.id === id 
        ? { 
            ...mapping, 
            [field]: value,
            status: (field === 'mappedTo' && value) ? 'mapped' : 'unmapped'
          }
        : mapping
    );
    onChange('mappings', updatedMappings);
  };

  const deleteMapping = (id: string) => {
    const updatedMappings = (data.mappings || []).filter(mapping => mapping.id !== id);
    onChange('mappings', updatedMappings);
  };

  const assetParameters = [
    'Temperature Sensor',
    'Pressure Gauge',
    'Flow Meter',
    'Vibration Monitor',
    'Level Indicator',
    'Power Consumption',
    'RPM Counter',
    'Oil Pressure',
    'Coolant Temperature',
    'Hydraulic Pressure'
  ];

  const mappingTargets = [
    'Safety System Alert',
    'Maintenance Schedule',
    'Quality Control Check',
    'Environmental Monitor',
    'Performance Dashboard',
    'Compliance Report',
    'Emergency Response',
    'Preventive Action'
  ];

  // Collapsed view
  if (isCompleted && isCollapsed) {
    const mappedCount = (data.mappings || []).filter(m => m.status === 'mapped').length;
    const totalCount = (data.mappings || []).length;
    
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
                Asset Parameter Mapping
              </Typography>
            </Box>
          }
          subheader={
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`${mappedCount}/${totalCount} mapped`} 
                size="small" 
                variant="outlined" 
                color={mappedCount === totalCount ? 'success' : 'warning'}
              />
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
              Asset Parameter Mapping
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
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addMapping}
              sx={{
                borderColor: '#C72030',
                color: '#C72030',
                '&:hover': {
                  borderColor: '#C72030',
                  backgroundColor: 'rgba(199, 32, 48, 0.04)',
                },
              }}
            >
              Add Row
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ border: '1px solid #E5E7EB' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Asset Parameter</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mapped To</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 100 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.mappings || []).map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel>Select Parameter</InputLabel>
                        <Select
                          value={mapping.assetParameter}
                          label="Select Parameter"
                          onChange={(e) => updateMapping(mapping.id, 'assetParameter', e.target.value)}
                          sx={{
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#C72030',
                            },
                          }}
                        >
                          {assetParameters.map((param) => (
                            <MenuItem key={param} value={param}>
                              {param}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel>Select Target</InputLabel>
                        <Select
                          value={mapping.mappedTo}
                          label="Select Target"
                          onChange={(e) => updateMapping(mapping.id, 'mappedTo', e.target.value)}
                          sx={{
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#C72030',
                            },
                          }}
                        >
                          {mappingTargets.map((target) => (
                            <MenuItem key={target} value={target}>
                              {target}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={mapping.status === 'mapped' ? 'Mapped' : 'Unmapped'}
                        size="small"
                        color={mapping.status === 'mapped' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => deleteMapping(mapping.id)}
                        sx={{ color: '#EF4444' }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {(data.mappings || []).length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4, color: '#9CA3AF' }}>
              <Typography>No mappings added yet. Click "Add Row" to get started.</Typography>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};