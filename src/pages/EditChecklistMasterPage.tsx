import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Paper, Box, Typography, RadioGroup, FormControlLabel, Radio, TextField, 
  IconButton, Button as MuiButton, Checkbox as MuiCheckbox, Select as MuiSelect, 
  MenuItem, FormControl, InputLabel, OutlinedInput
} from '@mui/material';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { API_CONFIG, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { fetchAssetTypes } from '@/services/assetTypesAPI';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 44 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const EditChecklistMasterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // State for API data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Editable fields
  const [type, setType] = useState('');
  const [scheduleFor, setScheduleFor] = useState('');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState('');
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [taskSections, setTaskSections] = useState([]);
  const [taskGroups, setTaskGroups] = useState([]);
  const [taskSubGroups, setTaskSubGroups] = useState({});

  // Fetch asset types data from API
  const {
    data: assetTypes,
    isLoading: isLoadingAssetTypes,
    error: assetTypesError
  } = useQuery({
    queryKey: ['asset-types'],
    queryFn: fetchAssetTypes
  });

  // Fetch checklist data from API
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const fetchChecklist = async () => {
      try {
        const url = `${API_CONFIG.BASE_URL}/master_checklist_detail.json?id=${id}`;
        const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
        if (!response.ok) throw new Error('Failed to fetch checklist details');
        const data = await response.json();

        // Map API data to local state
        setType(data.schedule_type || '');
        
        // Parse checklist_for to determine schedule for
        let parsedScheduleFor = 'Asset'; // default
        if (data.checklist_for) {
          const parts = data.checklist_for.split('::');
          if (parts.length > 1) {
            const scheduleForPart = parts[1].toLowerCase();
            if (scheduleForPart.includes('asset')) {
              parsedScheduleFor = 'Asset';
            } else if (scheduleForPart.includes('service')) {
              parsedScheduleFor = 'Service';
            } else if (scheduleForPart.includes('vendor')) {
              parsedScheduleFor = 'Vendor';
            }
          }
        }
        setScheduleFor(parsedScheduleFor);
        
        setActivityName(data.form_name || '');
        setDescription(data.description || '');
        setAssetType(data.asset_meter_type_id ? String(data.asset_meter_type_id) : '');
        setCreateTicket(!!data.create_ticket);
        setWeightage(!!data.weightage_enabled);

        // Map API content to taskSections - create single section with all tasks
        if (Array.isArray(data.content) && data.content.length > 0) {
          // Get group and subgroup from first task (assuming all tasks have same group/subgroup)
          const firstTask = data.content[0];
          const groupId = firstTask.group_id;
          const subGroupId = firstTask.sub_group_id;

          // Fetch sub-groups if group is present
          if (groupId) {
            fetchTaskSubGroups(groupId);
          }

          const mappedTasks = data.content.map((task, idx) => ({
            id: idx + 1,
            taskName: task.label || '',
            inputType:
              task.type === 'radio-group' ? 'Radio Button'
                : task.type === 'text' ? 'Text'
                  : task.type === 'checkbox-group' ? 'Checkbox'
                    : task.type === 'select' ? 'Dropdown'
                      : task.type === 'number' ? 'Number'
                        : task.type === 'date' ? 'Date'
                          : task.type || '',
            mandatory: task.required === 'true',
            reading: task.is_reading === 'true',
            helpText: !!task.hint,
            helpTextValue: task.hint || '',
            options: Array.isArray(task.values) && task.values.length > 0
              ? task.values.map((opt, oidx) => ({
                id: oidx + 1,
                label: opt.label || '',
                value: opt.type || '',
              }))
              : (task.type === 'radio-group' || task.type === 'select' || task.type === 'checkbox-group') 
                ? [
                    { id: 1, label: 'Yes', value: 'positive' },
                    { id: 2, label: 'No', value: 'negative' }
                  ]
                : [],
          }));

          setTaskSections([{
            id: 1,
            group: groupId || '',
            subGroup: subGroupId || '',
            tasks: mappedTasks
          }]);
        } else {
          // Fallback to default structure
          setTaskSections([{
            id: 1,
            group: '',
            subGroup: '',
            tasks: [{
              id: 1,
              taskName: '',
              inputType: '',
              mandatory: false,
              reading: false,
              helpText: false,
              helpTextValue: '',
              options: []
            }]
          }]);
        }
      } catch (err) {
        setError(err.message || 'Error fetching checklist details');
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, [id]);

  // Fetch task groups and sub-groups on mount
  useEffect(() => {
    // Fetch task groups
    const fetchTaskGroups = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_GROUPS}`, getAuthenticatedFetchOptions('GET'));
        if (!response.ok) throw new Error('Failed to fetch task groups');
        const data = await response.json();
        const groupsArray = data.map((group) => ({
          id: group.id,
          name: group.name
        }));
        setTaskGroups(groupsArray);
      } catch (error) {
        setTaskGroups([
          { id: 1, name: 'Safety' },
          { id: 2, name: 'Maintenance' },
          { id: 3, name: 'Operations' }
        ]);
      }
    };
    fetchTaskGroups();
  }, []);

  const fetchTaskSubGroups = async (groupId) => {
    if (!groupId) return;
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_SUB_GROUPS}?group_id=${groupId}`, getAuthenticatedFetchOptions('GET'));
      if (!response.ok) throw new Error('Failed to fetch sub groups');
      const data = await response.json();
      const subGroupsArray = (data.asset_groups || []).map((subGroup) => ({
        id: subGroup.id,
        name: subGroup.name
      }));
      setTaskSubGroups(prev => ({
        ...prev,
        [groupId]: subGroupsArray
      }));
    } catch (error) {
      setTaskSubGroups(prev => ({
        ...prev,
        [groupId]: [
          { id: 1, name: 'Equipment' },
          { id: 2, name: 'Cleaning' },
          { id: 3, name: 'Inspection' }
        ]
      }));
    }
  };

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
          tasks: section.tasks.map((task) => {
            if (task.id !== taskId) return task;
            
            // Handle input type changes with default options
            if (field === 'inputType') {
              let newOptions = task.options || [];
              
              // Add default options for input types that need them
              if ((value === 'Radio Button' || value === 'Dropdown' || value === 'Checkbox') && newOptions.length === 0) {
                newOptions = [
                  { id: Date.now(), label: 'Yes', value: 'positive' },
                  { id: Date.now() + 1, label: 'No', value: 'negative' }
                ];
              }
              
              return { ...task, [field]: value, options: newOptions };
            }
            
            return { ...task, [field]: value };
          })
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
    navigate('/master/checklist');
  };

  if (loading) {
    return <div className="p-6 text-center">Loading checklist details...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  // When a group is selected, fetch its sub-groups
  const handleGroupChange = (sectionId, taskId, newGroup) => {
    updateTask(sectionId, taskId, 'group', newGroup ? newGroup.id : '');
    updateTask(sectionId, taskId, 'subGroup', '');
    if (newGroup && newGroup.id) {
      fetchTaskSubGroups(newGroup.id);
    }
  };

  const handleSubGroupChange = (sectionId, taskId, newSubGroup) => {
    updateTask(sectionId, taskId, 'subGroup', newSubGroup ? newSubGroup.id : '');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      <Button
        onClick={() => navigate('/master/checklist')}
        variant="outline"
      >
        ← Back to List
      </Button>
      <div className="flex flex-wrap gap-4 my-6">
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

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
              label={
                <span style={{ fontSize: '16px' }}>
                  Description <span style={{ color: "red" }}>*</span>
                </span>
              }
              placeholder="Enter Description/SOP"
              fullWidth
              multiline
              minRows={4} // better than rows
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 3,
                "& textarea": {
                  width: "100% !important",   // force full width
                  resize: "both",             // allow resizing
                  overflow: "auto",
                  boxSizing: "border-box",
                  display: "block",
                },
                "& textarea[aria-hidden='true']": {
                  display: "none !important", // hide shadow textarea
                },
              }}
            />

            {scheduleFor === 'Asset' && (
              <FormControl fullWidth>
                <InputLabel>Asset Type</InputLabel>
                <MuiSelect
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  input={<OutlinedInput label="Asset Type" />}
                  disabled={isLoadingAssetTypes}
                >
                  <MenuItem value="">Select Asset Type</MenuItem>
                  {assetTypes && assetTypes.map(assetTypeOption => (
                    <MenuItem key={assetTypeOption.id} value={String(assetTypeOption.id)}>
                      {assetTypeOption.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {isLoadingAssetTypes && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading asset types...
                  </Typography>
                )}
              </FormControl>
            )}
          </div>
        </div>

        {taskSections.map((section, sectionIndex) => (
          <div key={section.id} className="overflow-hidden">
            <div className="p-4 sm:p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Section {sectionIndex + 1}
                </Typography>
                {taskSections.length > 1 && (
                  <IconButton
                    onClick={() => removeTaskSection(section.id)}
                    sx={{ color: '#C72030' }}
                  >
                    <X />
                  </IconButton>
                )}
              </div>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                <FormControl fullWidth variant="outlined" required sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Select Group</InputLabel>
                  <MuiSelect
                    label="Select Group"
                    notched
                    displayEmpty
                    value={String(section.group)}
                    onChange={(e) => {
                      updateTaskSection(section.id, 'group', e.target.value);
                      updateTaskSection(section.id, 'subGroup', '');
                      if (e.target.value) {
                        fetchTaskSubGroups(e.target.value);
                      }
                    }}
                  >
                    <MenuItem value="">Select Group</MenuItem>
                    {taskGroups.map((group) => (
                      <MenuItem key={group.id} value={String(group.id)}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined" required sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Select Sub Group</InputLabel>
                  <MuiSelect
                    label="Select Sub Group"
                    notched
                    displayEmpty
                    value={String(section.subGroup)}
                    onChange={(e) => updateTaskSection(section.id, 'subGroup', e.target.value)}
                    disabled={!section.group}
                  >
                    <MenuItem value="">Select Sub Group</MenuItem>
                    {section.group && taskSubGroups[section.group] ? 
                      taskSubGroups[section.group].map((subGroup) => (
                        <MenuItem key={subGroup.id} value={String(subGroup.id)}>
                          {subGroup.name}
                        </MenuItem>
                      )) : []
                    }
                  </MuiSelect>
                </FormControl>
              </Box>

              {section.tasks.map((task, taskIndex) => (
                <Box key={task.id} sx={{ mb: 3 }}>
                  <Box sx={{
                    border: '2px dashed #E0E0E0',
                    padding: 2,
                    borderRadius: 0,
                    backgroundColor: '#FAFAFA',
                    position: 'relative'
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#666' }}>
                      Task {taskIndex + 1}
                    </Typography>

                    {section.tasks.length > 1 && (
                      <IconButton
                        onClick={() => removeTask(section.id, task.id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: '#666',
                          padding: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            color: '#C72030'
                          }
                        }}
                        size="small"
                      >
                        <X fontSize="small" />
                      </IconButton>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        <FormControlLabel
                          control={
                            <MuiCheckbox
                              checked={task.mandatory}
                              onChange={(e) => updateTask(section.id, task.id, 'mandatory', e.target.checked)}
                              sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            />
                          }
                          label="Mandatory"
                        />
                        <FormControlLabel
                          control={
                            <MuiCheckbox
                              checked={task.helpText}
                              onChange={(e) => updateTask(section.id, task.id, 'helpText', e.target.checked)}
                              sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            />
                          }
                          label="Help Text"
                        />
                        <FormControlLabel
                          control={
                            <MuiCheckbox
                              checked={task.reading}
                              onChange={(e) => updateTask(section.id, task.id, 'reading', e.target.checked)}
                              sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            />
                          }
                          label="Reading"
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>
                      <TextField
                        label={`Task ${taskIndex + 1}`}
                        required={task.mandatory}
                        placeholder="Enter Task"
                        fullWidth
                        value={task.taskName}
                        onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)}
                      />

                      <FormControl fullWidth variant="outlined" required sx={{ '& .MuiInputBase-root': fieldStyles }}>
                        <InputLabel shrink>Input Type</InputLabel>
                        <MuiSelect
                          label="Input Type"
                          notched
                          displayEmpty
                          value={task.inputType}
                          onChange={e => updateTask(section.id, task.id, 'inputType', e.target.value)}
                        >
                          <MenuItem value="">Select Input Type</MenuItem>
                          <MenuItem value="Text">Text</MenuItem>
                          <MenuItem value="Number">Number</MenuItem>
                          <MenuItem value="Dropdown">Dropdown</MenuItem>
                          <MenuItem value="Radio Button">Radio Button</MenuItem>
                          <MenuItem value="Checkbox">Checkbox</MenuItem>
                          <MenuItem value="Date">Date</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </Box>

                    {task.helpText && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          label="Help Text (Hint)"
                          placeholder="Enter help text or hint"
                          fullWidth
                          value={task.helpTextValue || ''}
                          onChange={(e) => updateTask(section.id, task.id, 'helpTextValue', e.target.value)}
                        />
                      </Box>
                    )}

                    {(task.inputType === 'Radio Button' || task.inputType === 'Dropdown' || task.inputType === 'Checkbox') && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{
                          backgroundColor: '#F5F5F5',
                          border: '1px solid #E0E0E0',
                          borderRadius: 0,
                          padding: 2
                        }}>
                          {task.inputType === 'Dropdown' ? (
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                              Enter Value
                            </Typography>
                          ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                                Selected
                              </Typography>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                                Enter Value
                              </Typography>
                            </Box>
                          )}

                          {(task.options && task.options.length > 0 ? task.options : [
                            { id: Date.now(), label: 'Yes', value: 'positive' },
                            { id: Date.now() + 1, label: 'No', value: 'negative' }
                          ]).map((option, optionIndex) => (
                            <Box key={option.id || optionIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                              
                              {task.inputType === 'Dropdown' ? null : (
                                task.inputType === 'Checkbox' ? (
                                  <MuiCheckbox
                                    checked={optionIndex === 0}
                                    sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                  />
                                ) : (
                                  <Radio
                                    checked={optionIndex === 0}
                                    name={`radio-${section.id}-${task.id}`}
                                    sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                  />
                                )
                              )}

                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter option value"
                                value={option.label || ''}
                                onChange={(e) => updateOption(section.id, task.id, option.id || optionIndex, 'label', e.target.value)}
                                label={<span>Option{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</span>}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white'
                                  }
                                }}
                              />

                              <FormControl variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles, minWidth: 80 }} size="small">
                                <InputLabel shrink>Type</InputLabel>
                                <MuiSelect
                                  label="Type"
                                  notched
                                  displayEmpty
                                  value={option.value || 'positive'}
                                  onChange={e => updateOption(section.id, task.id, option.id || optionIndex, 'value', e.target.value)}
                                >
                                  <MenuItem value="">Select Type</MenuItem>
                                  <MenuItem value="positive">P</MenuItem>
                                  <MenuItem value="negative">N</MenuItem>
                                </MuiSelect>
                              </FormControl>

                              {(task.options?.length || 2) > 1 && (
                                <IconButton
                                  size="small"
                                  onClick={() => removeOption(section.id, task.id, option.id || optionIndex)}
                                  sx={{ color: '#C72030' }}
                                >
                                  <X />
                                </IconButton>
                              )}
                            </Box>
                          ))}

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <MuiButton
                              variant="outlined"
                              size="small"
                              startIcon={<Plus />}
                              onClick={() => addOption(section.id, task.id)}
                              sx={{
                                color: '#C72030',
                                borderColor: '#C72030',
                                fontSize: '12px',
                                padding: '4px 12px',
                                '&:hover': {
                                  borderColor: '#C72030',
                                  backgroundColor: 'rgba(199, 32, 48, 0.04)'
                                }
                              }}
                            >
                              Add Option
                            </MuiButton>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addQuestion(section.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </Button>
              </div>
            </div>
            <hr className="my-6" />
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