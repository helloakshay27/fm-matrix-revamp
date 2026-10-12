import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, ArrowLeft, Cog, ListChecks } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  RadioGroup, FormControlLabel, Radio, TextField,
  Checkbox as MuiCheckbox, Select as MuiSelect,
  MenuItem, FormControl, InputLabel
} from '@mui/material';
import { FormSection, FormActionBar, assetFieldStyles } from '@/components/common/FormSection';
import { API_CONFIG, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { fetchAssetTypes } from '@/services/assetTypesAPI';
import { toast } from 'sonner';

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'var(--color-primary)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primary)',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: 'var(--color-primary)',
    },
    '&.Mui-focused span': {
      color: 'var(--color-primary) !important',
    },
  },
  '& .MuiFormLabel-asterisk': {
    color: 'var(--color-primary)',
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
    // alert('Checklist master updated successfully!');
    toast.success('Checklist master updated successfully!');
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


  const radioSx = { color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } };
  const optionFieldSx = { ...assetFieldStyles, backgroundColor: 'white' };

  const renderToggle = (label: string, checked: boolean, onChange: (value: boolean) => void) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <span className={`flex items-center w-12 h-6 rounded-full transition-colors ${checked ? 'bg-brand' : 'bg-gray-300'}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}></span>
      </span>
      <span className="text-xs sm:text-sm text-gray-600 font-normal">{label}</span>
    </label>
  );

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            type="button"
            onClick={() => navigate('/master/checklist')}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Back to list"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Checklist Master</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Edit Checklist</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EDIT CHECKLIST</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 sm:space-y-6">
          {/* Basic Configuration */}
          <FormSection title="BASIC CONFIGURATION" icon={Cog}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Type</p>
                <RadioGroup
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  row
                >
                  {['PPM', 'AMC', 'Preparedness', 'HSC', 'Routine'].map((typeOption) => (
                    <FormControlLabel
                      key={typeOption}
                      value={typeOption}
                      control={<Radio sx={radioSx} />}
                      label={typeOption}
                    />
                  ))}
                </RadioGroup>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Schedule For</p>
                <RadioGroup
                  value={scheduleFor}
                  onChange={(e) => setScheduleFor(e.target.value)}
                  row
                >
                  {['Asset', 'Service', 'Vendor'].map((scheduleOption) => (
                    <FormControlLabel
                      key={scheduleOption}
                      value={scheduleOption}
                      control={<Radio sx={radioSx} />}
                      label={scheduleOption}
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <TextField
                fullWidth
                required
                label="Activity Name"
                placeholder="Enter Activity Name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: assetFieldStyles }}
                sx={textFieldStyles}
              />

              {scheduleFor === 'Asset' && (
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Asset Type</InputLabel>
                    <MuiSelect
                      label="Asset Type"
                      notched
                      displayEmpty
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value)}
                      disabled={isLoadingAssetTypes}
                      sx={assetFieldStyles}
                    >
                      <MenuItem value="">Select Asset Type</MenuItem>
                      {assetTypes && assetTypes.map(assetTypeOption => (
                        <MenuItem key={assetTypeOption.id} value={String(assetTypeOption.id)}>
                          {assetTypeOption.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  {isLoadingAssetTypes && (
                    <span className="block text-xs text-gray-500 mt-1">Loading asset types...</span>
                  )}
                </div>
              )}
            </div>

            <TextField
              label={
                <span>
                  Description<span className="fm-required-mark">*</span>
                </span>
              }
              placeholder="Enter Description/SOP"
              fullWidth
              variant="outlined"
              multiline
              minRows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                ...textFieldStyles,
                "& textarea": {
                  width: "100% !important",
                  resize: "both",
                  overflow: "auto",
                  boxSizing: "border-box",
                  display: "block",
                },
                "& textarea[aria-hidden='true']": {
                  display: "none !important",
                },
              }}
            />
          </FormSection>

          {/* Question Setup */}
          <FormSection
            title="QUESTION SETUP"
            icon={ListChecks}
            headerActions={renderToggle('Weightage', weightage, setWeightage)}
          >
            <div className="space-y-4">
              {taskSections.map((section, sectionIndex) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm sm:text-base font-semibold text-gray-800">
                      Section {sectionIndex + 1}
                    </span>
                    {taskSections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTaskSection(section.id)}
                        className="flex items-center justify-center w-8 h-8 rounded-md text-brand hover:bg-brand-light transition-colors"
                        aria-label="Remove section"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <FormControl fullWidth variant="outlined" required>
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
                        sx={assetFieldStyles}
                      >
                        <MenuItem value="">Select Group</MenuItem>
                        {taskGroups.map((group) => (
                          <MenuItem key={group.id} value={String(group.id)}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel shrink>Select Sub Group</InputLabel>
                      <MuiSelect
                        label="Select Sub Group"
                        notched
                        displayEmpty
                        value={String(section.subGroup)}
                        onChange={(e) => updateTaskSection(section.id, 'subGroup', e.target.value)}
                        disabled={!section.group}
                        sx={assetFieldStyles}
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
                  </div>

                  <div className="space-y-4">
                    {section.tasks.map((task, taskIndex) => (
                      <div
                        key={task.id}
                        className="relative border border-dashed border-gray-300 rounded-lg bg-gray-50 p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-600">Task {taskIndex + 1}</span>
                          {section.tasks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTask(section.id, task.id)}
                              className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-brand hover:bg-white transition-colors"
                              aria-label="Remove task"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 mb-3">
                          <FormControlLabel
                            control={
                              <MuiCheckbox
                                checked={task.mandatory}
                                onChange={(e) => updateTask(section.id, task.id, 'mandatory', e.target.checked)}
                                sx={radioSx}
                              />
                            }
                            label="Mandatory"
                          />
                          <FormControlLabel
                            control={
                              <MuiCheckbox
                                checked={task.helpText}
                                onChange={(e) => updateTask(section.id, task.id, 'helpText', e.target.checked)}
                                sx={radioSx}
                              />
                            }
                            label="Help Text"
                          />
                          <FormControlLabel
                            control={
                              <MuiCheckbox
                                checked={task.reading}
                                onChange={(e) => updateTask(section.id, task.id, 'reading', e.target.checked)}
                                sx={radioSx}
                              />
                            }
                            label="Reading"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="sm:col-span-1 lg:col-span-2">
                            <TextField
                              label={`Task ${taskIndex + 1}`}
                              required={task.mandatory}
                              placeholder="Enter Task"
                              fullWidth
                              variant="outlined"
                              value={task.taskName}
                              onChange={(e) => updateTask(section.id, task.id, 'taskName', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{ sx: optionFieldSx }}
                              sx={textFieldStyles}
                            />
                          </div>

                          <FormControl fullWidth variant="outlined" required>
                            <InputLabel shrink>Input Type</InputLabel>
                            <MuiSelect
                              label="Input Type"
                              notched
                              displayEmpty
                              value={task.inputType}
                              onChange={e => updateTask(section.id, task.id, 'inputType', e.target.value)}
                              sx={optionFieldSx}
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
                        </div>

                        {task.helpText && (
                          <div className="mt-4">
                            <TextField
                              label="Help Text (Hint)"
                              placeholder="Enter help text or hint"
                              fullWidth
                              variant="outlined"
                              value={task.helpTextValue || ''}
                              onChange={(e) => updateTask(section.id, task.id, 'helpTextValue', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{ sx: optionFieldSx }}
                              sx={textFieldStyles}
                            />
                          </div>
                        )}

                        {(task.inputType === 'Radio Button' || task.inputType === 'Dropdown' || task.inputType === 'Checkbox') && (
                          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                            {task.inputType === 'Dropdown' ? (
                              <p className="text-sm font-semibold text-gray-700 mb-3">Enter Value</p>
                            ) : (
                              <div className="flex justify-between items-center mb-3">
                                <p className="text-sm font-semibold text-gray-700">Selected</p>
                                <p className="text-sm font-semibold text-gray-700">Enter Value</p>
                              </div>
                            )}

                            {(task.options && task.options.length > 0 ? task.options : [
                              { id: Date.now(), label: 'Yes', value: 'positive' },
                              { id: Date.now() + 1, label: 'No', value: 'negative' }
                            ]).map((option, optionIndex) => (
                              <div key={option.id || optionIndex} className="flex gap-2 mb-3 items-center">
                                {task.inputType === 'Dropdown' ? null : (
                                  task.inputType === 'Checkbox' ? (
                                    <MuiCheckbox
                                      checked={optionIndex === 0}
                                      sx={radioSx}
                                    />
                                  ) : (
                                    <Radio
                                      checked={optionIndex === 0}
                                      name={`radio-${section.id}-${task.id}`}
                                      sx={radioSx}
                                    />
                                  )
                                )}

                                <TextField
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  placeholder="Enter option value"
                                  value={option.label || ''}
                                  onChange={(e) => updateOption(section.id, task.id, option.id || optionIndex, 'label', e.target.value)}
                                  label={<span>Option{task.mandatory && <span className="fm-required-mark">*</span>}</span>}
                                  InputLabelProps={{ shrink: true }}
                                  InputProps={{ sx: optionFieldSx }}
                                  sx={textFieldStyles}
                                />

                                <FormControl variant="outlined" size="small" sx={{ minWidth: 110 }}>
                                  <InputLabel shrink>Type</InputLabel>
                                  <MuiSelect
                                    label="Type"
                                    notched
                                    displayEmpty
                                    value={option.value || 'positive'}
                                    onChange={e => updateOption(section.id, task.id, option.id || optionIndex, 'value', e.target.value)}
                                    sx={optionFieldSx}
                                  >
                                    <MenuItem value="">Select Type</MenuItem>
                                    <MenuItem value="positive">P</MenuItem>
                                    <MenuItem value="negative">N</MenuItem>
                                  </MuiSelect>
                                </FormControl>

                                {(task.options?.length || 2) > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOption(section.id, task.id, option.id || optionIndex)}
                                    className="flex items-center justify-center w-8 h-8 rounded-md text-brand hover:bg-brand-light transition-colors shrink-0"
                                    aria-label="Remove option"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}

                            <div className="flex justify-end mt-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(section.id, task.id)}
                                className="text-brand border-brand hover:bg-brand-light"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addQuestion(section.id)}
                      className="text-brand border-brand hover:bg-brand-light"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </FormSection>

          <FormActionBar
            onCancel={() => navigate('/master/checklist')}
            submitLabel="Update"
            submitAsFormSubmit
          />
        </div>
      </form>
    </div>
  );
};
