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
import { API_CONFIG, getAuthenticatedFetchOptions } from '@/config/apiConfig';

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
  const [mappings, setMappings] = useState<{ [key: string]: number | null }>({});

  // Initialize mappings from props
  useEffect(() => {
    if (data && data.assets?.length > 0) {
      const initialMappings: { [key: string]: number | null } = {};
      data.assets.forEach(asset => {
        asset.inputs.forEach(input => {
          initialMappings[input.field_name] = input.selected_measure_id;
        });
      });
      setMappings(initialMappings);
    }
  }, [data]);

  const handleMappingChange = async (
    fieldName: string,
    measureId: number | null,
    assetId: number,
    formId: number
  ) => {
    const newMappings = {
      ...mappings,
      [fieldName]: measureId
    };
    setMappings(newMappings);
    onChange(newMappings);

    if (measureId) {
      try {
        const url = `${API_CONFIG.BASE_URL}/pms/pms_asset_q_map.json?asset_msr_id=${measureId}&form_id=${formId}&assetid=${assetId}&inputname=${fieldName}`;
        const response = await fetch(url, getAuthenticatedFetchOptions('POST'));

        if (!response.ok) {
          throw new Error('API Error');
        }

        console.log('Mapping updated successfully');
      } catch (error) {
        console.error('Error updating mapping:', error);
      }
    }
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

  if (!data || !data.assets?.length) {
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
      {data.assets.map((asset) => (
        <SectionCard key={asset.id}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#C72030' }}>
            {asset.name.trim()} - Field Mapping
          </Typography>

          <TableContainer component={Paper} sx={{ border: '1px solid #E0E0E0' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#333', minWidth: 150 }}>
                    Asset
                  </TableCell>
                  {asset.inputs.map((input) => (
                    <TableCell
                      key={input.field_name}
                      align="center"
                      sx={{ fontWeight: 600, color: '#333', minWidth: 150 }}
                    >
                      {input.field_label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 500 }}>{asset.name.trim()}</TableCell>
                  {asset.inputs.map((input) => (
                    <TableCell key={input.field_name} align="center">
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={mappings[input.field_name] || ''}
                          onChange={(e) =>
                            handleMappingChange(
                              input.field_name,
                              e.target.value === '' ? null : Number(e.target.value),
                              asset.id,
                              data.form_id
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">Select</MenuItem>
                          {asset.measures.map((measure) => (
                            <MenuItem key={measure.id} value={measure.id}>
                              {measure.name.trim()}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      ))}
    </Box>
  );
};

