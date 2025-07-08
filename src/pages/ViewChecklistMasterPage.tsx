
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 44 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

// Mock data for demonstration - same as EditChecklistMasterPage
const mockChecklistData = {
  440: {
    id: 440,
    activityName: 'qawertyu',
    description: 'Sample description for qawertyu checklist',
    type: 'PPM',
    scheduleFor: 'Asset',
    assetType: 'electrical',
    createTicket: false,
    weightage: false,
    taskSections: [
      {
        id: 1,
        group: 'Daily Substation Log',
        subGroup: 'B-Block MLT',
        tasks: [
          {
            id: 1,
            taskName: 'Task 1',
            inputType: 'Radio Button',
            mandatory: true,
            reading: false,
            helpText: false,
            options: [
              { id: 1, label: 'Yes', value: 'P' },
              { id: 2, label: 'No', value: 'N' }
            ]
          }
        ]
      }
    ]
  },
  435: {
    id: 435,
    activityName: 'VI Repair Preparedness Checklist',
    description: 'Checklist for repair preparedness',
    type: 'Preparedness',
    scheduleFor: 'Service',
    assetType: 'mechanical',
    createTicket: true,
    weightage: false,
    taskSections: [
      {
        id: 1,
        group: 'Repair Tasks',
        subGroup: 'VI Systems',
        tasks: [
          {
            id: 1,
            taskName: 'Check System Status',
            inputType: 'Checkbox',
            mandatory: true,
            reading: true,
            helpText: true,
            options: []
          }
        ]
      }
    ]
  },
  309: {
    id: 309,
    activityName: 'Daily Meeting Room Readiness Checklist',
    description: 'Daily checklist for meeting room preparation',
    type: 'Routine',
    scheduleFor: 'Service',
    assetType: 'facility',
    createTicket: false,
    weightage: true,
    taskSections: [
      {
        id: 1,
        group: 'Meeting Room Setup',
        subGroup: 'Conference Facilities',
        tasks: [
          {
            id: 1,
            taskName: 'Check Audio Visual Equipment',
            inputType: 'Radio Button',
            mandatory: true,
            reading: false,
            helpText: true,
            options: [
              { id: 1, label: 'Working', value: 'W' },
              { id: 2, label: 'Not Working', value: 'NW' }
            ]
          }
        ]
      }
    ]
  }
};

export const ViewChecklistMasterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [checklistData, setChecklistData] = useState(null);

  useEffect(() => {
    // Load data based on ID
    if (id && mockChecklistData[id]) {
      setChecklistData(mockChecklistData[id]);
    }
  }, [id]);

  const handleEditDetails = () => {
    navigate(`/settings/masters/checklist-master/edit/${id}`);
  };

  if (!checklistData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading checklist details...</p>
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
            checked={checklistData.createTicket} 
            disabled
            id="createTicket" 
          />
          <Label htmlFor="createTicket">Create Ticket</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={checklistData.weightage} 
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
                value={checklistData.type}
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
                value={checklistData.scheduleFor}
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
              value={checklistData.activityName}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ 
                sx: fieldStyles,
                readOnly: true
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={checklistData.description}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  ...fieldStyles,
                  alignItems: 'flex-start',
                },
                readOnly: true
              }}
            />

            <FormControl fullWidth>
              <InputLabel shrink>Asset Type</InputLabel>
              <MuiSelect
                value={checklistData.assetType}
                sx={fieldStyles}
                disabled
              >
                {['electrical', 'mechanical', 'hvac', 'plumbing', 'facility'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        {checklistData.taskSections.map((section, sectionIndex) => (
          <div key={section.id} className="bg-white border rounded-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">2</div>
              <h2 className="font-semibold text-lg" style={{ color: '#C72030' }}>Tasks</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                fullWidth
                label="Select Group"
                value={section.group}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ 
                  sx: fieldStyles,
                  readOnly: true
                }}
              />

              <TextField
                fullWidth
                label="Select Sub Group"
                value={section.subGroup}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ 
                  sx: fieldStyles,
                  readOnly: true
                }}
              />
            </div>

            {section.tasks.map((task, taskIndex) => (
              <div
                key={task.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded"
              >
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-4">Task {taskIndex + 1}</h4>
                </div>

                <TextField
                  fullWidth
                  label="Task"
                  value={task.taskName}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ 
                    sx: fieldStyles,
                    readOnly: true
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel shrink>Input Type</InputLabel>
                  <MuiSelect
                    value={task.inputType}
                    sx={fieldStyles}
                    disabled
                  >
                    {['Text', 'Number', 'Checkbox', 'Radio Button', 'Dropdown', 'Date'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                  {['mandatory', 'reading', 'helpText'].map((field) => (
                    <label key={field} className="flex items-center gap-2">
                      <Checkbox
                        checked={task[field]}
                        disabled
                      />
                      <span className="capitalize">{field === 'helpText' ? 'Help Text' : field}</span>
                    </label>
                  ))}
                </div>

                {(task.inputType === 'Radio Button' || task.inputType === 'Dropdown') && task.options && task.options.length > 0 && (
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
                      
                      {task.options.map((option, optionIndex) => (
                        <div key={option.id} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-1">
                            <input
                              type="radio"
                              name={`option-${task.id}`}
                              className="accent-[#C72030]"
                              disabled
                              checked={optionIndex === 0}
                            />
                          </div>
                          <div className="col-span-5">
                            <TextField
                              fullWidth
                              size="small"
                              value={option.label}
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
                              value={option.value}
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
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
