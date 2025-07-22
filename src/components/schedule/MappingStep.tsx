import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  styled
} from '@mui/material';

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #F0F0F0',
  marginBottom: '24px',
}));

interface ChecklistMappingsData {
  form_id: number;
  assets: {
    id: number;
    name: string;
    measures: {
      id: number;
      name: string;
    }[];
    inputs: {
      field_name: string;
      field_label: string;
      selected_measure_id: number | null;
    }[];
  }[];
}

interface MappingStepProps {
  data: ChecklistMappingsData | null;
  loading: boolean;
  onChange: (mappingData: any) => void;
  isCompleted: boolean;
  isCollapsed: boolean;
}

export const MappingStep: React.FC<MappingStepProps> = ({
  data,
  loading,
  onChange,
  isCompleted,
  isCollapsed
}) => {
  const [mappings, setMappings] = useState<{[key: string]: number | null}>({});

  // Initialize mappings from data
  useEffect(() => {
    if (data && data.assets && data.assets.length > 0) {
      const initialMappings: {[key: string]: number | null} = {};
      data.assets.forEach(asset => {
        asset.inputs.forEach(input => {
          initialMappings[input.field_name] = input.selected_measure_id;
        });
      });
      setMappings(initialMappings);
    }
  }, [data]);

  const handleMappingChange = (fieldName: string, measureId: number | null) => {
    const newMappings = {
      ...mappings,
      [fieldName]: measureId
    };
    setMappings(newMappings);
    onChange(newMappings);
  };

  if (loading) {
    return (
      <SectionCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#C72030' }} />
          <Typography sx={{ ml: 2 }}>Loading mapping data...</Typography>
        </Box>
      </SectionCard>
    );
  }

  if (!data || !data.assets || data.assets.length === 0) {
    return (
      <SectionCard>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
            No mapping data available
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Please complete the previous steps to generate mapping data.
          </Typography>
        </Box>
      </SectionCard>
    );
  }

  return (
    <Box>
      {data.assets.map((asset, assetIndex) => (
        <SectionCard key={asset.id}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#C72030' }}>
            {asset.name} - Field Mapping
          </Typography>
          
          <TableContainer component={Paper} sx={{ border: '1px solid #E0E0E0' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#333', minWidth: 150 }}>
                    Asset
                  </TableCell>
                  {asset.measures.map((measure) => (
                    <TableCell 
                      key={measure.id} 
                      align="center"
                      sx={{ fontWeight: 600, color: '#333', minWidth: 150 }}
                    >
                      {measure.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {asset.inputs.map((input) => (
                  <TableRow key={input.field_name}>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {input.field_label}
                    </TableCell>
                    {asset.measures.map((measure) => (
                      <TableCell key={measure.id} align="center">
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={mappings[input.field_name] === measure.id ? measure.id : ''}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              // Clear any existing mapping for this field first
                              const newMappings = { ...mappings };
                              if (selectedValue === '') {
                                newMappings[input.field_name] = null;
                              } else {
                                newMappings[input.field_name] = Number(selectedValue);
                              }
                              setMappings(newMappings);
                              onChange(newMappings);
                            }}
                            displayEmpty
                            sx={{
                              '& .MuiSelect-select': {
                                backgroundColor: mappings[input.field_name] === measure.id ? '#E8F5E8' : 'white',
                                border: mappings[input.field_name] === measure.id ? '1px solid #4CAF50' : '1px solid #E0E0E0',
                              }
                            }}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value={measure.id}>
                              Map
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Summary */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#F9F9F9', borderRadius: '8px' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Mapping Summary:
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {Object.values(mappings).filter(v => v !== null).length} of {asset.inputs.length} fields mapped
            </Typography>
          </Box>
        </SectionCard>
      ))}
    </Box>
  );
};
