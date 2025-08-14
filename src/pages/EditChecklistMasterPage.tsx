
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
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

// Mock data for demonstration
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
              { id: 1, label: 'Yes', value: 'yes' },
              { id: 2, label: 'No', value: 'no' }
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
            inputType: 'checkbox',
            mandatory: true,
            reading: true,
            helpText: true,
            options: []
          }
        ]
      }
    ]
  }
};

export const EditChecklistMasterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [type, setType] = useState('PPM');
  const [scheduleFor, setScheduleFor] = useState('Asset');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState('');
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [taskSections, setTaskSections] = useState([
    {
      id: 1,
      group: '',
      subGroup: '',
      tasks: [
        {
          id: 1,
          taskName: '',
          inputType: '',
          mandatory: false,
          reading: false,
          helpText: false,
          options: []
        }
      ]
    }
  ]);

  useEffect(() => {
    // Load data based on ID
    if (id && mockChecklistData[id]) {
      const data = mockChecklistData[id];
      setType(data.type);
      setScheduleFor(data.scheduleFor);
      setActivityName(data.activityName);
      setDescription(data.description);
      setAssetType(data.assetType);
      setCreateTicket(data.createTicket);
      setWeightage(data.weightage);
      setTaskSections(data.taskSections);
    }
  }, [id]);

  const addTaskSection = () => {
    setTaskSections((prev) => [
      ...prev,
      {
        id: Date.now(),
        group: '',
        subGroup: '',
        tasks: [
          {
            id: 1,
            taskName: '',
            inputType: '',
            mandatory: false,
            reading: false,
            helpText: false,
            options: []
          }
        ]
      }
    ]);
  };

  const removeTaskSection = (sectionId) => {
    if (taskSections.length > 1) {
      setTaskSections((prev) => prev.filter((section) => section.id !== sectionId));
    }
  };

  const updateTaskSection = (sectionId, field, value) => {
    setTaskSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const updateTask = (sectionId, taskId, field, value) => {
    setTaskSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          tasks: section.tasks.map((task) =>
            task.id === taskId ? { ...task, [field]: value } : task
          )
        };
      })
    );
  };

  const addQuestion = (sectionId) => {
    setTaskSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          tasks: [
            ...section.tasks,
            {
              id: Date.now(),
              taskName: '',
              inputType: '',
              mandatory: false,
              reading: false,
              helpText: false,
              options: []
            }
          ]
        };
      })
    );
  };

  const removeTask = (sectionId, taskId) => {
    setTaskSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        if (section.tasks.length <= 1) return section;
        return {
          ...section,
          tasks: section.tasks.filter((task) => task.id !== taskId)
        };
      })
    );
  };

  const addOption = (sectionId, taskId) => {
    setTaskSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          tasks: section.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              options: [
                ...(task.options || []),
                { id: Date.now(), label: '', value: '' }
              ]
            };
          })
        };
      })
    );
  };

  const updateOption = (sectionId, taskId, optionId, field, value) => {
    setTaskSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          tasks: section.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              options: (task.options || []).map((option) =>
                option.id === optionId ? { ...option, [field]: value } : option
              )
            };
          })
        };
      })
    );
  };

  const removeOption = (sectionId, taskId, optionId) => {
    setTaskSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          tasks: section.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              options: (task.options || []).filter((option) => option.id !== optionId)
            };
          })
        };
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ id, type, scheduleFor, activityName, description, assetType, taskSections });
    alert('Checklist master updated successfully!');
    navigate('/settings/masters/checklist-master');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={createTicket} 
            onCheckedChange={(checked) => setCreateTicket(checked === true)} 
            id="createTicket" 
          />
          <Label htmlFor="createTicket">Create Ticket</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={weightage} 
            onCheckedChange={(checked) => setWeightage(checked === true)} 
            id="weightage" 
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">1</div>
            <h2 className="font-semibold text-lg" style={{ color: '#C72030' }}>Basic Info</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block text-sm font-medium">Type</Label>
              <RadioGroup
                value={type}
                onChange={(e) => setType(e.target.value)}
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
                    control={<Radio />}
                    label={typeOption}
                  />
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium">Schedule For</Label>
              <RadioGroup
                value={scheduleFor}
                onChange={(e) => setScheduleFor(e.target.value)}
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
                    control={<Radio />}
                    label={scheduleOption}
                  />
                ))}
              </RadioGroup>
            </div>

            <TextField
              fullWidth
              required
              label="Activity Name"
              placeholder="Enter Activity Name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  ...fieldStyles,
                  alignItems: 'flex-start',
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel shrink>Asset Type</InputLabel>
              <MuiSelect
                displayEmpty
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Asset Type</em>
                </MenuItem>
                {['electrical', 'mechanical', 'hvac', 'plumbing'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        {taskSections.map((section, sectionIndex) => (
          <div key={section.id} className="bg-white border rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">2</div>
                <h2 className="font-semibold text-lg" style={{ color: '#C72030' }}>Task</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  style={{ backgroundColor: '#C72030' }}
                  className="text-white hover:opacity-90"
                  onClick={addTaskSection}
                >
                  + Add Section
                </Button>
                {taskSections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTaskSection(section.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                fullWidth
                label="Select Group"
                placeholder="Enter Group"
                value={section.group}
                onChange={(e) => updateTaskSection(section.id, 'group', e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />

              <TextField
                fullWidth
                label="Select Sub Group"
                placeholder="Enter Sub Group"
                value={section.subGroup}
                onChange={(e) => updateTaskSection(section.id, 'subGroup', e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>

            {section.tasks.map((task, taskIndex) => (
              <div
                key={task.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded"
              >
                <div className="flex items-center justify-between md:col-span-2">
                  <h4 className="font-medium">Task {taskIndex + 1}</h4>
                  {section.tasks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(section.id, task.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <TextField
                  fullWidth
                  label="Task"
                  placeholder="Enter Task"
                  value={task.taskName}
                  onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />

                <FormControl fullWidth>
                  <InputLabel shrink>Input Type</InputLabel>
                  <MuiSelect
                    displayEmpty
                    value={task.inputType}
                    onChange={(e) => updateTask(section.id, task.id, 'inputType', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select Input Type</em>
                    </MenuItem>
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
                        onCheckedChange={(checked) => updateTask(section.id, task.id, field, checked === true)}
                      />
                      <span className="capitalize">{field === 'helpText' ? 'Help Text' : field}</span>
                    </label>
                  ))}
                </div>

                {(task.inputType === 'Radio Button' || task.inputType === 'Dropdown') && (
                  <div className="md:col-span-2 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Options</Label>
                      <Button
                        type="button"
                        size="sm"
                        style={{ backgroundColor: '#C72030' }}
                        className="text-white hover:opacity-90"
                        onClick={() => addOption(section.id, task.id)}
                      >
                        + Add Option
                      </Button>
                    </div>
                    
                    {task.options && task.options.length > 0 && (
                      <div className="space-y-2 border rounded p-3">
                        <div className="grid grid-cols-12 gap-2 items-center font-medium text-sm text-gray-600 mb-2">
                          <div className="col-span-1">Selected</div>
                          <div className="col-span-4">Enter Value</div>
                          <div className="col-span-6">P</div>
                          <div className="col-span-1">Action</div>
                        </div>
                        
                        {task.options.map((option, optionIndex) => (
                          <div key={option.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-1">
                              <input
                                type="radio"
                                name={`option-${task.id}`}
                                className="accent-[#C72030]"
                              />
                            </div>
                            <div className="col-span-4">
                              <TextField
                                fullWidth
                                size="small"
                                value={option.label}
                                onChange={(e) => updateOption(section.id, task.id, option.id, 'label', e.target.value)}
                                placeholder="Enter value"
                                InputProps={{ sx: { height: 32 } }}
                              />
                            </div>
                            <div className="col-span-6">
                              <TextField
                                fullWidth
                                size="small"
                                value={option.value}
                                onChange={(e) => updateOption(section.id, task.id, option.id, 'value', e.target.value)}
                                placeholder="P"
                                InputProps={{ sx: { height: 32 } }}
                              />
                            </div>
                            <div className="col-span-1">
                              {task.options.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(section.id, task.id, option.id)}
                                  className="text-red-500 hover:text-red-700 p-1 h-8 w-8"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => addQuestion(section.id)}
                className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Action Question
              </Button>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button
            type="submit"
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90 px-8"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
