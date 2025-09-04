import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  FormControl,
  InputLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import { API_CONFIG, getAuthenticatedFetchOptions } from '@/config/apiConfig';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 44 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};


export const ViewChecklistMasterPage = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const [checklistData, setChecklistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const fetchChecklist = async () => {
      try {
        const url = `${API_CONFIG.BASE_URL}/master_checklist_detail.json?id=${id}`;
        const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
        if (!response.ok) {
          throw new Error('Failed to fetch checklist details');
        }
        const data = await response.json();
        setChecklistData(data);
      } catch (err) {
        setError(err.message || 'Error fetching checklist details');
        setChecklistData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, [id]);

  const handleEditDetails = () => {
    navigate(`/settings/masters/checklist-master/edit/${id}`);
  };

  if (!checklistData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          {loading ? (
            <p className="text-gray-500">Loading checklist details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-500">No checklist details found.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate('/settings/masters/checklist-master')}
            variant="outline"
          >
            ← Back to List
          </Button>
        </div>

        <Button 
          onClick={handleEditDetails}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90"
        >
          Edit Details
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={!!checklistData.create_ticket} 
            disabled
            id="createTicket" 
          />
          <Label htmlFor="createTicket">Create Ticket</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={!!checklistData.weightage_enabled} 
            disabled
            id="weightage" 
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">1</div>
            <h2 className="font-semibold text-lg" style={{ color: '#C72030' }}>Basic Info</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block text-sm font-medium">Type</Label>
              <RadioGroup
                value={checklistData.schedule_type}
                row
                sx={{
                  '& .MuiFormControlLabel-root .MuiRadio-root': {
                    color: '#C72030',
                    '&.Mui-checked': {
                      color: '#C72030',
                    },
                  },
                }}
              >
                {['PPM', 'AMC', 'Preparedness', 'HSC', 'Routine'].map((typeOption) => (
                  <FormControlLabel
                    key={typeOption}
                    value={typeOption}
                    control={<Radio disabled />}
                    label={typeOption}
                  />
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium">Schedule For</Label>
              <RadioGroup
                value={checklistData.checklist_for?.split('::')[1] || ''}
                row
                sx={{
                  '& .MuiFormControlLabel-root .MuiRadio-root': {
                    color: '#C72030',
                    '&.Mui-checked': {
                      color: '#C72030',
                    },
                  },
                }}
              >
                {['Asset', 'Service', 'Vendor'].map((scheduleOption) => (
                  <FormControlLabel
                    key={scheduleOption}
                    value={scheduleOption}
                    control={<Radio disabled />}
                    label={scheduleOption}
                  />
                ))}
              </RadioGroup>
            </div>

            <TextField
              fullWidth
              label="Activity Name"
              value={checklistData.form_name || ''}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ 
                sx: fieldStyles,
                readOnly: true
              }}
              disabled={true}
            />

            <TextField
              fullWidth
              label="Description"
              // placeholder="Description"
              value={checklistData.description || ''}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ 
                sx: fieldStyles,
                readOnly: true
              }}
              disabled={true}
            />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">2</div>
            <h2 className="font-semibold text-lg" style={{ color: '#C72030' }}>Tasks</h2>
          </div>

          {Array.isArray(checklistData.content) && checklistData.content.length > 0 ? (
            checklistData.content.map((task, taskIndex) => (
              <div
                key={taskIndex}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded"
              >
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-4">Task {taskIndex + 1}</h4>
                </div>

                <TextField
                  fullWidth
                  label="Task"
                  value={task.label || ''}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ 
                    sx: fieldStyles,
                    readOnly: true
                  }}
                  disabled={true}
                />

                <FormControl fullWidth>
                  <Autocomplete
                    options={[
                      'Text',
                      'Number',
                      'Checkbox',
                      'Radio Button',
                      'Dropdown',
                      'Date'
                    ]}
                    value={
                      task.type === 'radio-group' ? 'Radio Button'
                      : task.type === 'text' ? 'Text'
                      : task.type === 'checkbox-group' ? 'Checkbox'
                      : task.type === 'select' ? 'Dropdown'
                      : task.type === 'number' ? 'Number'
                      : task.type === 'date' ? 'Date'
                      : task.type
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Input Type"
                        InputLabelProps={{ shrink: true }}
                        sx={fieldStyles}
                        disabled
                      />
                    )}
                    disableClearable
                    disabled
                  />
                </FormControl>

                <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={task.required === 'true'}
                      disabled
                    />
                    <span>Mandatory</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={task.is_reading === 'true'}
                      disabled
                    />
                    <span>Reading</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={!!task.hint}
                      disabled
                    />
                    <span>Help Text</span>
                  </label>
                </div>

                {/* Show help text input if hint is present */}
                {task.hint && (
                  <div className="md:col-span-2 pt-2">
                    <TextField
                      fullWidth
                      label="Help Text"
                      value={task.hint}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        sx: fieldStyles,
                        readOnly: true
                      }}
                      disabled={true}
                    />
                  </div>
                )}

                {Array.isArray(task.values) && task.values.length > 0 && (
                  <div className="md:col-span-2 mt-4">
                    <div className="mb-2">
                      <Label className="text-sm font-medium">Selected Enter Value</Label>
                    </div>
                    <div className="space-y-2 border rounded p-3">
                      <div className="grid grid-cols-12 gap-2 items-center font-medium text-sm text-gray-600 mb-2">
                        <div className="col-span-1">Selected</div>
                        <div className="col-span-5">Enter Value</div>
                        <div className="col-span-6">P</div>
                      </div>
                      {task.values.map((option, optionIndex) => (
                        <div key={optionIndex} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-1">
                            <input
                              type="radio"
                              name={`option-${task.name}`}
                              className="accent-[#C72030]"
                              disabled
                              checked={optionIndex === 0}
                            />
                          </div>
                          <div className="col-span-5">
                            <TextField
                              fullWidth
                              size="small"
                              value={option.label || ''}
                              InputProps={{ 
                                sx: { height: 32 },
                                readOnly: true
                              }}
                            />
                          </div>
                          <div className="col-span-6">
                            <TextField
                              fullWidth
                              size="small"
                              value={option.type || ''}
                              InputProps={{ 
                                sx: { height: 32 },
                                readOnly: true
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
