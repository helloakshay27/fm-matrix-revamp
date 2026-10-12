import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, ArrowLeft, Cog, ListChecks, Ticket } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import {
  RadioGroup as MuiRadioGroup, FormControlLabel, Radio, TextField,
  Checkbox as MuiCheckbox, Select as MuiSelect, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { FormSection, FormActionBar, assetFieldStyles } from '@/components/common/FormSection';
import { API_CONFIG, ENDPOINTS, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createChecklistMaster, ChecklistCreateRequest } from '@/services/customFormsAPI';
import { fetchAssetTypes } from '@/services/assetTypesAPI';
import { useNavigate } from 'react-router-dom';

// Define interfaces for better type safety
interface AttachmentFile {
  id: string;
  name: string;
  url: string;
  content?: string; // base64 content
  content_type?: string; // MIME type
}

interface TaskValue {
  label: string;
  type: string;
  value: string;
}

interface Task {
  id: string;
  question: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: string;
  helpTextEnabled: boolean;
  helpTextValue: string;
  helpTextAttachments?: AttachmentFile[];
  values: TaskValue[];
  consumption_type: string;
  consumption_unit_type: string;
  weightage: string;
  rating_enabled: boolean;
}

interface TaskSection {
  id: string;
  name: string;
  isExpanded: boolean;
  tasks: Task[];
}


export const ChecklistMasterPage = () => {
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);

  const [formData, setFormData] = useState({
    type: 'PPM',
    scheduleFor: 'Asset',
    activityName: '',
    description: '',
    assetType: '',
    groupId: '',
    subGroupId: '',
    // Add auto ticket fields
    ticketLevel: 'checklist',
    ticketAssignedTo: '',
    ticketCategory: ''
  });

  const handleFormChange = useCallback((field: keyof typeof formData, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const [sections, setSections] = useState<TaskSection[]>([
    {
      id: '1',
      name: 'General Inspection',
      isExpanded: true,
      tasks: [
        {
          id: '1',
          question: 'Check overall condition',
          inputType: 'text',
          mandatory: true,
          reading: false,
          helpText: 'Inspect for any visible damage or wear',
          helpTextEnabled: false,
          helpTextValue: '',
          helpTextAttachments: [],
          values: [],
          consumption_type: '',
          consumption_unit_type: '',
          weightage: '',
          rating_enabled: false
        }
      ]
    }
  ]);

  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [createNew, setCreateNew] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [autoTicket, setAutoTicket] = useState(false);

  const addHelpTextAttachment = (sectionId: string, taskId: string): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    input.style.display = 'none';

    input.onchange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      const newAttachments: AttachmentFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64 = reader.result as string;
          newAttachments.push({
            id: `${Date.now()}-${i}`,
            name: file.name,
            url: URL.createObjectURL(file),
            content: base64, // Use the full base64 string
            content_type: file.type,
          });

          if (newAttachments.length === files.length) {
            setSections(prevSections =>
              prevSections.map(section =>
                section.id === sectionId
                  ? {
                    ...section,
                    tasks: section.tasks.map(task =>
                      task.id === taskId
                        ? {
                          ...task,
                          helpTextAttachments: [...(task.helpTextAttachments || []), ...newAttachments],
                        }
                        : task
                    ),
                  }
                  : section
              )
            );
            toast.success(`${files.length} file(s) attached to help text.`);
          }
        };
      }
    };
    document.body.appendChild(input);
    input.click();
    input.remove();
  };

  const removeHelpTextAttachment = (sectionId: string, taskId: string, attachmentId: string): void => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  helpTextAttachments: (task.helpTextAttachments || []).filter(att => att.id !== attachmentId),
                }
                : task
            ),
          }
          : section
      )
    );
  };

  const createChecklistMutation = useMutation({
    mutationFn: createChecklistMaster,
    onSuccess: (data) => {
      toast.success('Checklist created successfully!');
      console.log('Checklist created:', data);
      // Navigate back to checklist master dashboard
      navigate('/master/checklist');
    },
    onError: (error) => {
      toast.error('Failed to create checklist');
      console.error('Error creating checklist:', error);
    },
  });

  const addSection = () => {
    const newSection: TaskSection = {
      id: Date.now().toString(),
      name: 'New Section',
      isExpanded: true,
      tasks: []
    };
    setSections([...sections, newSection]);
  };

  const addTask = (sectionId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      question: '',
      inputType: 'text',
      mandatory: false,
      reading: false,
      helpText: '',
      helpTextEnabled: false,
      helpTextValue: '',
      values: [],
      consumption_type: '',
      consumption_unit_type: '',
      weightage: '',
      rating_enabled: false
    };

    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, tasks: [...section.tasks, newTask] }
        : section
    ));
  };

  const removeTask = (sectionId: string, taskId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, tasks: section.tasks.filter(task => task.id !== taskId) }
        : section
    ));
  };

  const updateTask = useCallback((sectionId: string, taskId: string, field: keyof Task, value: any) => {
    console.log('Updating task:', { sectionId, taskId, field, value }); // Debug log
    setSections(prevSections => prevSections.map(section =>
      section.id === sectionId
        ? {
          ...section,
          tasks: section.tasks.map(task =>
            task.id === taskId
              ? { ...task, [field]: value }
              : task
          )
        }
        : section
    ));
  }, []);

  const updateTaskValues = useCallback((sectionId: string, taskId: string, values: Array<{ label: string; type: string; value: string }>) => {
    setSections(prevSections => prevSections.map(section =>
      section.id === sectionId
        ? {
          ...section,
          tasks: section.tasks.map(task =>
            task.id === taskId
              ? { ...task, values }
              : task
          )
        }
        : section
    ));
  }, []);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const addAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    input.style.display = 'none';

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64 = reader.result as string;
            const newAttachment: AttachmentFile = {
              id: `${Date.now()}-${i}`,
              name: file.name,
              url: URL.createObjectURL(file),
              content: base64, // Use the full base64 string
              content_type: file.type,
            };
            setAttachments(prev => [...prev, newAttachment]);
          };
        }
        toast(`${files.length} file(s) selected.`);
      }
    };

    document.body.appendChild(input);
    input.click();
    input.remove();
  };

  // Helper functions for managing task values
  const addValue = (sectionId: string, taskId: string) => {
    const newValue = { label: "", type: "positive", value: "" };
    updateTaskValues(sectionId, taskId, [...getTaskValues(sectionId, taskId), newValue]);
  };

  const removeValue = (sectionId: string, taskId: string, valueIndex: number) => {
    const currentValues = getTaskValues(sectionId, taskId);
    if (currentValues.length > 1) {
      const newValues = currentValues.filter((_, index) => index !== valueIndex);
      updateTaskValues(sectionId, taskId, newValues);
    }
  };

  const updateValue = (sectionId: string, taskId: string, valueIndex: number, field: 'label' | 'type', value: string) => {
    const currentValues = getTaskValues(sectionId, taskId);
    const newValues = currentValues.map((val, index) =>
      index === valueIndex
        ? { ...val, [field]: value, value: field === 'label' ? value : val.value }
        : val
    );
    updateTaskValues(sectionId, taskId, newValues);
  };

  const getTaskValues = (sectionId: string, taskId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const task = section?.tasks.find(t => t.id === taskId);
    return task?.values || [];
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.activityName || !formData.groupId || !formData.subGroupId) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate that all tasks have questions
    const hasEmptyQuestions = sections.some(section =>
      section.tasks.some(task => !task.question.trim())
    );

    if (hasEmptyQuestions) {
      toast.error('Please provide questions for all tasks');
      return;
    }

    // Transform form data to API payload format for checklist_create_pms endpoint
    const content = sections.flatMap(section =>
      section.tasks.map(task => ({
        label: task.question,
        name: `qnm_${task.id}`,
        className: "form-control",
        group_id: formData.groupId,
        sub_group_id: formData.subGroupId,
        type: task.inputType === 'radio-group' ? 'radio-group' :
          task.inputType === 'dropdown' ? 'select' :
            task.inputType === 'checkbox-group' ? 'checkbox-group' :
              task.inputType === 'options-inputs' ? 'checkbox-group' :
                task.inputType.toLowerCase(),
        subtype: "",
        required: task.mandatory.toString(),
        is_reading: task.reading.toString(),
        hint: task.helpTextEnabled ? task.helpTextValue : task.helpText,
        values: task.inputType === 'radio-group' || task.inputType === 'dropdown'
          ? task.values.length > 0
            ? task.values
            : [
              { label: "Yes", type: "positive", value: "Yes" },
              { label: "No", type: "negative", value: "No" }
            ]
          : task.values,
        consumption_type: task.consumption_type,
        consumption_unit_type: task.consumption_unit_type,
        weightage: task.weightage,
        rating_enabled: task.rating_enabled.toString(),
        question_hint_image_ids: [],
        question_hint_image_url: []
      }))
    );

    const payload = {
      source: "form",
      schedule_type: formData.type,
      sch_type: formData.type,
      checklist_type: formData.scheduleFor,
      checklist_for: `${formData.type}::${formData.scheduleFor}`,
      group_id: formData.groupId,
      sub_group_id: formData.subGroupId,
      schedule_for: formData.scheduleFor,
      tmp_custom_form: {
        ticket_level: formData.ticketLevel,
        helpdesk_category_id: formData.ticketCategory || "",
        schedule_type: formData.type,
        schedule_for: formData.scheduleFor,
        organization_id: "1",
        form_name: formData.activityName,
        description: formData.description,
        asset_meter_type_id: formData.assetType ? parseInt(formData.assetType) : 1,
        create_ticket: autoTicket,
        task_assigner_id: formData.ticketAssignedTo || "",
        weightage_enabled: weightage,
        checklist_for: `${formData.type}::${formData.scheduleFor}`,
        attachments: []
      },
      content
    };

    // Use direct API call instead of mutation
    submitChecklist(payload);
  };

  const submitChecklist = async (payload: any) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/custom_forms/checklist_create_pms.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success('Checklist created successfully!');
      console.log('Checklist created:', data);
      navigate('/master/checklist');
    } catch (error) {
      console.error('Error creating checklist:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create checklist');
    }
  };

  function removeQuestionSection(id: string): void {
    setSections(prevSections => prevSections.filter(section => section.id !== id));
  }

  function removeTaskFromSection(sectionId: string, taskId: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.filter(task => task.id !== taskId)
          }
          : section
      )
    );
  }

  function addTaskToSection(id: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id
          ? {
            ...section,
            tasks: [
              ...section.tasks,
              {
                id: (Date.now() + Math.random()).toString(),
                question: '',
                inputType: 'text',
                mandatory: false,
                reading: false,
                helpText: '',
                helpTextEnabled: false,
                helpTextValue: '',
                values: [],
                consumption_type: '',
                consumption_unit_type: '',
                weightage: '',
                rating_enabled: false
              }
            ]
          }
          : section
      )
    );
  }

  // Add states for loading users and helpdesk categories
  const [users, setUsers] = useState<any[]>([]);
  const [helpdeskCategories, setHelpdeskCategories] = useState<any[]>([]);
  const [taskGroups, setTaskGroups] = useState<any[]>([]);
  const [taskSubGroups, setTaskSubGroups] = useState<any>({});
  const [loading, setLoading] = useState({
    users: false,
    helpdeskCategories: false,
    groups: false,
    subGroups: false
  });

  // Load users function - using same pattern as AddSchedulePage
  const loadUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.ESCALATION_USERS}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Extract users array from response
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error("Failed to load users. Using fallback data.");
      // Keep fallback mock data
      const mockUsers = [
        { id: 1, full_name: 'John Doe' },
        { id: 2, full_name: 'Jane Smith' },
        { id: 3, full_name: 'Mike Johnson' }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Load helpdesk categories function - using same pattern as AddSchedulePage
  const loadHelpdeskCategories = async () => {
    setLoading(prev => ({ ...prev, helpdeskCategories: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.HELPDESK_CATEGORIES}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Extract only id and name from helpdesk_categories
      const categoriesArray = (data.helpdesk_categories || []).map((category: any) => ({
        id: category.id,
        name: category.name
      }));
      setHelpdeskCategories(categoriesArray);
    } catch (error) {
      console.error('Failed to load helpdesk categories:', error);
      toast.error("Failed to load helpdesk categories. Using fallback data.");
      // Keep mock data as fallback
      const mockCategories = [
        { id: 1, name: 'Technical' },
        { id: 2, name: 'Non Technical' },
        { id: 3, name: 'Urgent' },
        { id: 4, name: 'Normal' }
      ];
      setHelpdeskCategories(mockCategories);
    } finally {
      setLoading(prev => ({ ...prev, helpdeskCategories: false }));
    }
  };

  // Fetch task groups function
  const fetchTaskGroups = async () => {
    setLoading(prev => ({ ...prev, groups: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_GROUPS}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch task groups');
      const data = await response.json();
      const groupsArray = data.map((group) => ({
        id: group.id,
        name: group.name
      }));
      setTaskGroups(groupsArray);
    } catch (error) {
      console.error('Failed to load task groups:', error);
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };

  // Fetch task sub-groups function
  const fetchTaskSubGroups = async (groupId) => {
    if (!groupId) return;
    setLoading(prev => ({ ...prev, subGroups: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_SUB_GROUPS}?group_id=${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
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
      console.error('Failed to load sub groups:', error);
    } finally {
      setLoading(prev => ({ ...prev, subGroups: false }));
    }
  };

  // Fetch asset types data from API
  const {
    data: assetTypes,
    isLoading: isLoadingAssetTypes,
    error: assetTypesError
  } = useQuery({
    queryKey: ['asset-types'],
    queryFn: fetchAssetTypes
  });

  // Update useEffect to load users and categories
  useEffect(() => {
    setCurrentSection('Master');
    loadUsers();
    loadHelpdeskCategories();
    fetchTaskGroups();
  }, [setCurrentSection]);

  const radioSx = { color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } };
  const optionFieldSx = { ...assetFieldStyles, backgroundColor: 'white' };

  const requiredLabel = (text: string, show = true) => (
    <span>
      {text}
      {show && <span className="fm-required-mark">*</span>}
    </span>
  );

  const renderTypeSelect = (sectionId: string, taskId: string, value: TaskValue, valueIndex: number) => (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 110 }}>
      <InputLabel shrink>Type</InputLabel>
      <MuiSelect
        label="Type"
        notched
        displayEmpty
        value={value.type || ''}
        onChange={e => updateValue(sectionId, taskId, valueIndex, 'type', e.target.value)}
        sx={optionFieldSx}
      >
        <MenuItem value="">Select Type</MenuItem>
        <MenuItem value="positive">P</MenuItem>
        <MenuItem value="negative">N</MenuItem>
      </MuiSelect>
    </FormControl>
  );

  const renderRemoveValue = (sectionId: string, taskId: string, valueIndex: number) => (
    <button
      type="button"
      onClick={() => removeValue(sectionId, taskId, valueIndex)}
      className="flex items-center justify-center w-8 h-8 rounded-md text-brand hover:bg-brand-light transition-colors shrink-0"
      aria-label="Remove option"
    >
      <X className="w-4 h-4" />
    </button>
  );

  const renderAddOption = (onClick: () => void) => (
    <div className="flex justify-end mt-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClick}
        className="text-brand border-brand hover:bg-brand-light"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Option
      </Button>
    </div>
  );

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
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Checklist Master</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Add Checklist</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ADD CHECKLIST</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Basic Configuration */}
        <FormSection title="BASIC CONFIGURATION" icon={Cog}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Type</p>
              <MuiRadioGroup
                row
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
              >
                <FormControlLabel value="PPM" control={<Radio sx={radioSx} />} label="PPM" />
                <FormControlLabel value="AMC" control={<Radio sx={radioSx} />} label="AMC" />
                <FormControlLabel value="Preparedness" control={<Radio sx={radioSx} />} label="Preparedness" />
                <FormControlLabel value="Hoto" control={<Radio sx={radioSx} />} label="Hoto" />
                <FormControlLabel value="Routine" control={<Radio sx={radioSx} />} label="Routine" />
              </MuiRadioGroup>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Schedule For</p>
              <MuiRadioGroup
                row
                value={formData.scheduleFor}
                onChange={(e) => handleFormChange('scheduleFor', e.target.value)}
              >
                <FormControlLabel value="Asset" control={<Radio sx={radioSx} />} label="Asset" />
                <FormControlLabel value="Service" control={<Radio sx={radioSx} />} label="Service" />
                <FormControlLabel value="Vendor" control={<Radio sx={radioSx} />} label="Vendor" />
              </MuiRadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <TextField
              label={requiredLabel('Activity Name')}
              placeholder="Enter Activity Name"
              fullWidth
              variant="outlined"
              value={formData.activityName}
              onChange={(e) => handleFormChange('activityName', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />

            {formData.scheduleFor === 'Asset' && (
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>{requiredLabel('Asset Type')}</InputLabel>
                  <MuiSelect
                    label="Asset Type*"
                    notched
                    displayEmpty
                    value={formData.assetType}
                    onChange={e => handleFormChange('assetType', e.target.value)}
                    disabled={isLoadingAssetTypes}
                    sx={assetFieldStyles}
                  >
                    <MenuItem value="">Select Asset Type</MenuItem>
                    {assetTypes && assetTypes.map(assetType => (
                      <MenuItem key={assetType.id} value={assetType.id.toString()}>
                        {assetType.name}
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
            label={requiredLabel('Description')}
            placeholder="Enter Description/SOP"
            fullWidth
            variant="outlined"
            multiline
            minRows={4}
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
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
          headerActions={
            <div className="flex items-center gap-4">
              {renderToggle('Weightage', weightage, setWeightage)}
              {renderToggle('Auto Ticket', autoTicket, setAutoTicket)}
            </div>
          }
        >
          <div className="space-y-4">
            {/* Auto Ticket Configuration */}
            {autoTicket && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
                  <Ticket className="w-4 h-4 text-brand" />
                  Auto Ticket Configuration
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Ticket Level</p>
                    <MuiRadioGroup
                      row
                      value={formData.ticketLevel}
                      onChange={(e) => handleFormChange('ticketLevel', e.target.value)}
                    >
                      <FormControlLabel value="checklist" control={<Radio sx={radioSx} />} label="Checklist Level" />
                      <FormControlLabel value="question" control={<Radio sx={radioSx} />} label="Question Level" />
                    </MuiRadioGroup>
                  </div>

                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>{requiredLabel('Assigned To')}</InputLabel>
                    <MuiSelect
                      label="Assigned To*"
                      notched
                      displayEmpty
                      value={formData.ticketAssignedTo}
                      onChange={e => handleFormChange('ticketAssignedTo', e.target.value)}
                      disabled={loading.users}
                      sx={assetFieldStyles}
                    >
                      <MenuItem value="">Select Assigned To</MenuItem>
                      {users.map(user => (
                        <MenuItem key={user.id} value={user.id.toString()}>{user.full_name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>{requiredLabel('Category')}</InputLabel>
                      <MuiSelect
                        label="Category*"
                        notched
                        displayEmpty
                        value={formData.ticketCategory}
                        onChange={e => handleFormChange('ticketCategory', e.target.value)}
                        disabled={loading.helpdeskCategories}
                        sx={assetFieldStyles}
                      >
                        <MenuItem value="">Select Category</MenuItem>
                        {helpdeskCategories.map(category => (
                          <MenuItem key={category.id} value={category.id.toString()}>{category.name}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    {loading.helpdeskCategories && (
                      <span className="block text-xs text-gray-500 mt-1">Loading categories...</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Question Sections */}
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm sm:text-base font-semibold text-gray-800">
                    Section {sectionIndex + 1}
                  </span>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestionSection(section.id)}
                      className="flex items-center justify-center w-8 h-8 rounded-md text-brand hover:bg-brand-light transition-colors"
                      aria-label="Remove section"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Group and Sub-group selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>{requiredLabel('Select Group')}</InputLabel>
                    <MuiSelect
                      label="Select Group*"
                      notched
                      displayEmpty
                      value={formData.groupId}
                      onChange={(e) => {
                        handleFormChange('groupId', e.target.value);
                        handleFormChange('subGroupId', ''); // Reset sub-group when group changes
                        if (e.target.value) {
                          fetchTaskSubGroups(e.target.value);
                        }
                      }}
                      disabled={loading.groups}
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

                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>{requiredLabel('Select Sub Group')}</InputLabel>
                    <MuiSelect
                      label="Select Sub Group*"
                      notched
                      displayEmpty
                      value={formData.subGroupId}
                      onChange={(e) => handleFormChange('subGroupId', e.target.value)}
                      disabled={!formData.groupId || loading.subGroups}
                      sx={assetFieldStyles}
                    >
                      <MenuItem value="">Select Sub Group</MenuItem>
                      {formData.groupId && taskSubGroups[formData.groupId] ?
                        taskSubGroups[formData.groupId].map((subGroup) => (
                          <MenuItem key={subGroup.id} value={String(subGroup.id)}>
                            {subGroup.name}
                          </MenuItem>
                        )) : []
                      }
                    </MuiSelect>
                  </FormControl>
                </div>

                <div className="space-y-4">
                  {section.tasks && section.tasks.map((task, taskIndex) => (
                    <div
                      key={task.id}
                      className="relative border border-dashed border-gray-300 rounded-lg bg-gray-50 p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-600">Task {taskIndex + 1}</span>
                        {!(sectionIndex === 0 && taskIndex === 0) && (
                          <button
                            type="button"
                            onClick={() => removeTaskFromSection(section.id, task.id)}
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
                              checked={task.helpTextEnabled}
                              onChange={(e) => updateTask(section.id, task.id, 'helpTextEnabled', e.target.checked)}
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
                        {weightage && (
                          <FormControlLabel
                            control={
                              <MuiCheckbox
                                checked={task.rating_enabled}
                                onChange={(e) => updateTask(section.id, task.id, 'rating_enabled', e.target.checked)}
                                sx={radioSx}
                              />
                            }
                            label="Rating"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className={weightage ? '' : 'sm:col-span-1 lg:col-span-2'}>
                          <TextField
                            label={requiredLabel(`Task ${taskIndex + 1}`, task.mandatory)}
                            placeholder="Enter Task"
                            fullWidth
                            variant="outlined"
                            value={task.question}
                            onChange={(e) => updateTask(section.id, task.id, 'question', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: optionFieldSx }}
                          />
                        </div>

                        <FormControl fullWidth variant="outlined">
                          <InputLabel shrink>{requiredLabel('Input Type')}</InputLabel>
                          <MuiSelect
                            label="Input Type*"
                            notched
                            displayEmpty
                            value={task.inputType}
                            onChange={e => {
                              const newValue = e.target.value;
                              updateTask(section.id, task.id, 'inputType', newValue);
                              // Handle default values for different input types
                              if (newValue === 'radio-group' || newValue === 'dropdown') {
                                updateTaskValues(section.id, task.id, [
                                  { label: "Yes", type: "positive", value: "Yes" },
                                  { label: "No", type: "negative", value: "No" }
                                ]);
                              } else if (newValue === 'checkbox-group' || newValue === 'options-inputs') {
                                updateTaskValues(section.id, task.id, [
                                  { label: "", type: "positive", value: "" }
                                ]);
                              } else {
                                updateTaskValues(section.id, task.id, []);
                              }
                            }}
                            sx={optionFieldSx}
                          >
                            <MenuItem value="">Select Input Type</MenuItem>
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="number">Numeric</MenuItem>
                            <MenuItem value="dropdown">Dropdown</MenuItem>
                            <MenuItem value="radio-group">Radio</MenuItem>
                            <MenuItem value="checkbox-group">Checkbox</MenuItem>
                            <MenuItem value="options-inputs">Options & Inputs</MenuItem>
                          </MuiSelect>
                        </FormControl>

                        {weightage && (
                          <TextField
                            label={requiredLabel('Weightage', task.mandatory)}
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={task.weightage}
                            onChange={(e) => updateTask(section.id, task.id, 'weightage', e.target.value)}
                            placeholder="Enter weightage"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: optionFieldSx }}
                          />
                        )}
                      </div>

                      {task.helpTextEnabled && (
                        <div className="mt-4">
                          <TextField
                            label="Help Text (Hint)"
                            placeholder="Enter help text or hint"
                            fullWidth
                            variant="outlined"
                            value={task.helpTextValue}
                            onChange={(e) => updateTask(section.id, task.id, 'helpTextValue', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: optionFieldSx }}
                          />
                        </div>
                      )}

                      {/* Conditional value blocks */}
                      {task.inputType === 'dropdown' && (
                        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-700 mb-3">Enter Value</p>
                          {task.values.map((value, valueIndex) => (
                            <div key={valueIndex} className="flex gap-2 mb-3 items-center">
                              <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="Enter option value"
                                value={value.label}
                                onChange={(e) => updateValue(section.id, task.id, valueIndex, 'label', e.target.value)}
                                label={requiredLabel('Option', task.mandatory)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: optionFieldSx }}
                              />
                              {renderTypeSelect(section.id, task.id, value, valueIndex)}
                              {task.values.length > 1 && renderRemoveValue(section.id, task.id, valueIndex)}
                            </div>
                          ))}
                          {renderAddOption(() => addValue(section.id, task.id))}
                        </div>
                      )}

                      {task.inputType === 'radio-group' && (
                        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-semibold text-gray-700">Selected</p>
                            <p className="text-sm font-semibold text-gray-700">Enter Value</p>
                          </div>
                          {task.values.map((value, valueIndex) => (
                            <div key={valueIndex} className="flex gap-2 mb-3 items-center">
                              <Radio
                                checked={valueIndex === 0}
                                name={`radio-${section.id}-${task.id}`}
                                sx={radioSx}
                              />
                              <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="Enter option value"
                                value={value.label}
                                onChange={(e) => updateValue(section.id, task.id, valueIndex, 'label', e.target.value)}
                                label={requiredLabel('Option', task.mandatory)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: optionFieldSx }}
                              />
                              {renderTypeSelect(section.id, task.id, value, valueIndex)}
                              {task.values.length > 1 && renderRemoveValue(section.id, task.id, valueIndex)}
                            </div>
                          ))}
                          {renderAddOption(() => addValue(section.id, task.id))}
                        </div>
                      )}

                      {task.inputType === 'checkbox-group' && (
                        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-semibold text-gray-700">Selected</p>
                            <p className="text-sm font-semibold text-gray-700">Enter Value</p>
                          </div>
                          {(task.values.length > 0 ? task.values : [{ label: "", type: "positive", value: "" }]).map((value, valueIndex) => (
                            <div key={valueIndex} className="flex gap-2 mb-3 items-center">
                              <MuiCheckbox
                                checked={valueIndex === 0}
                                sx={radioSx}
                              />
                              <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="Enter option value"
                                value={value.label}
                                onChange={(e) => {
                                  if (task.values.length === 0) {
                                    updateTaskValues(section.id, task.id, [{ label: e.target.value, type: "positive", value: e.target.value }]);
                                  } else {
                                    updateValue(section.id, task.id, valueIndex, 'label', e.target.value);
                                  }
                                }}
                                label={requiredLabel('Option', task.mandatory)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: optionFieldSx }}
                              />
                              {renderTypeSelect(section.id, task.id, value, valueIndex)}
                              {task.values.length > 1 && renderRemoveValue(section.id, task.id, valueIndex)}
                            </div>
                          ))}
                          {renderAddOption(() => {
                            if (task.values.length === 0) {
                              updateTaskValues(section.id, task.id, [
                                { label: "", type: "positive", value: "" },
                                { label: "", type: "positive", value: "" }
                              ]);
                            } else {
                              addValue(section.id, task.id);
                            }
                          })}
                        </div>
                      )}

                      {task.inputType === 'options-inputs' && (
                        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Enter Value</p>
                          {(task.values.length > 0 ? task.values : [{ label: "", type: "positive", value: "" }]).map((value, valueIndex) => (
                            <div key={valueIndex} className="flex gap-2 mb-3 items-center">
                              <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="Enter option value"
                                value={value.label}
                                onChange={(e) => {
                                  if (task.values.length === 0) {
                                    updateTaskValues(section.id, task.id, [{ label: e.target.value, type: "positive", value: e.target.value }]);
                                  } else {
                                    updateValue(section.id, task.id, valueIndex, 'label', e.target.value);
                                  }
                                }}
                                label={requiredLabel('Option', task.mandatory)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: optionFieldSx }}
                              />
                              {task.values.length > 1 && renderRemoveValue(section.id, task.id, valueIndex)}
                            </div>
                          ))}
                          {renderAddOption(() => {
                            if (task.values.length === 0) {
                              updateTaskValues(section.id, task.id, [
                                { label: "", type: "positive", value: "" },
                                { label: "", type: "positive", value: "" }
                              ]);
                            } else {
                              addValue(section.id, task.id);
                            }
                          })}
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
                    onClick={() => addTaskToSection(section.id)}
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
          onSubmit={handleSubmit}
          submitLabel="Create Checklist"
          isSubmitting={createChecklistMutation.isPending}
        />
      </div>
    </div>
  );
};
