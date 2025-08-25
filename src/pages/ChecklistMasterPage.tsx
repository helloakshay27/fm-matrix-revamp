import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import AttachFile from '@mui/icons-material/AttachFile';
import { useLayout } from '@/contexts/LayoutContext';
import { useMutation } from '@tanstack/react-query';
import { createChecklistMaster, ChecklistCreateRequest } from '@/services/customFormsAPI';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Cog } from 'lucide-react';
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  Checkbox as MuiCheckbox,
  Box,
  Typography,
  Paper,
  IconButton,
  Button as MuiButton,
  Autocomplete
} from '@mui/material';
import { fromPairs } from 'lodash';
import { API_CONFIG, ENDPOINTS, getAuthHeader } from '@/config/apiConfig';

interface Task {
  id: string;
  question: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: string;
  helpTextEnabled: boolean;
  helpTextValue: string;
  values: Array<{
    label: string;
    type: string;
    value: string;
  }>;
  consumption_type: string;
  consumption_unit_type: string;
  weightage: string;
  rating_enabled: boolean;
}

interface TaskSection {
  id: string;
  name: string;
  tasks: Task[];
  isExpanded: boolean;
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
    groupId: '55',
    subGroupId: '160',
    // Add auto ticket fields
    ticketLevel: 'checklist',
    ticketAssignedTo: '',
    ticketCategory: ''
  });

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
          values: [],
          consumption_type: '',
          consumption_unit_type: '',
          weightage: '',
          rating_enabled: false
        }
      ]
    }
  ]);

  const [attachments, setAttachments] = useState([]);
  const [createNew, setCreateNew] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [autoTicket, setAutoTicket] = useState(false);

  const createChecklistMutation = useMutation({
    mutationFn: createChecklistMaster,
    onSuccess: (data) => {
      toast.success('Checklist created successfully!');
      console.log('Checklist created:', data);
      // Navigate back to checklist master dashboard
      navigate('/settings/masters/checklist');
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

  const updateTaskValues = useCallback((sectionId: string, taskId: string, values: Array<{label: string; type: string; value: string}>) => {
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
        const newAttachments = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          newAttachments.push({
            id: `${Date.now()}-${i}`,
            name: file.name,
            url: URL.createObjectURL(file)
          });
        }
        setAttachments(prev => [...prev, ...newAttachments]);
        toast(`${files.length} file(s) attached successfully!`);
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
    if (!formData.activityName || !formData.assetType) {
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

    // Transform form data to API payload format
    const content = sections.flatMap(section => 
      section.tasks.map(task => ({
        label: task.question,
        name: `qnm_${task.id}`,
        className: "form-control",
        group_id: formData.groupId,
        sub_group_id: formData.subGroupId,
        type: task.inputType.toLowerCase().replace(' ', '-').replace('-group', ''),
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
        rating_enabled: task.rating_enabled.toString()
      }))
    );

    const payload: ChecklistCreateRequest = {
      source: "form",
      schedule_type: formData.type.toLowerCase(),
      sch_type: formData.type.toLowerCase(),
      checklist_type: formData.scheduleFor,
      group_id: formData.groupId,
      sub_group_id: formData.subGroupId,
      tmp_custom_form: {
        ticket_level: "question",
        helpdesk_category_id: "",
        schedule_type: formData.type,
        organization_id: "1",
        form_name: formData.activityName,
        description: formData.description,
        asset_meter_type_id: 1,
        // Add auto ticket fields to payload
        create_ticket: autoTicket ? "1" : "0",
        ticket_level: formData.ticketLevel,
        task_assigner_id: formData.ticketAssignedTo || "",
        helpdesk_category_id: formData.ticketCategory || "",
        weightage_enabled: weightage ? "1" : "0"
      },
      content
    };

    createChecklistMutation.mutate(payload);
  };

  const SectionCard = ({ children, style = {} }) => (
    <Paper 
      sx={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: 0,
        overflow: 'hidden',
        marginBottom: '24px',
        ...style
      }}
    >
      {children}
    </Paper>
  );

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
  const [loading, setLoading] = useState({
    users: false,
    helpdeskCategories: false
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

  // Update useEffect to load users and categories
  useEffect(() => {
    setCurrentSection('Master');
    loadUsers();
    loadHelpdeskCategories();
  }, [setCurrentSection]);

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CHECKLIST MASTER</h1>

        {/* Basic Configuration Section - Match AddSchedulePage styling */}
        <SectionCard style={{ padding: '24px', margin: 0, borderRadius: '3px' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                backgroundColor: '#C72030',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cog size={16} color="white" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
                Basic Configuration
              </Typography>
            </Box>
          </Box>

          {/* Type section */}
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Type
            </Typography>
            <MuiRadioGroup
              row
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              sx={{ mb: 2 }}
            >
              <FormControlLabel
                value="PPM"
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                label="PPM"
              />
              <FormControlLabel
                value="AMC"
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                label="AMC"
              />
              <FormControlLabel
                value="Preparedness"
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                label="Preparedness"
              />
              <FormControlLabel
                value="Hoto"
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                label="Hoto"
              />
              <FormControlLabel
                value="Routine"
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                label="Routine"
              />
            </MuiRadioGroup>
          </Box>

          {/* Schedule For section */}
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Schedule For
            </Typography>
            <MuiRadioGroup
              row
              value={formData.scheduleFor}
              onChange={(e) => setFormData({ ...formData, scheduleFor: e.target.value })}
              sx={{ mb: 2 }}
            >
              <FormControlLabel
                value="Asset"
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                label="Asset"
              />
              <FormControlLabel
                value="Location"
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                label="Location"
              />
              <FormControlLabel
                value="Area"
                control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                label="Area"
              />
            </MuiRadioGroup>
          </Box>

          <TextField
            label={<span>Activity Name <span style={{ color: 'currentColor' }}>*</span></span>}
            placeholder="Enter Activity Name"
            fullWidth
            value={formData.activityName}
            onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
            sx={{ mb: 3 }}
          />

          <TextField
            label={<span>Description <span style={{ color: 'currentColor' }}>*</span></span>}
            placeholder="Enter Description/SOP"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 3 }}
          />

          {/* Asset Type section */}
          <Box >
            <Autocomplete
              options={[
                { id: 'Electrical', label: 'Electrical', value: 'Electrical' },
                { id: 'Mechanical', label: 'Mechanical', value: 'Mechanical' },
                { id: 'HVAC', label: 'HVAC', value: 'HVAC' },
                { id: 'Plumbing', label: 'Plumbing', value: 'Plumbing' }
              ]}
              getOptionLabel={(option) => option.label}
              value={[
                { id: 'Electrical', label: 'Electrical', value: 'Electrical' },
                { id: 'Mechanical', label: 'Mechanical', value: 'Mechanical' },
                { id: 'HVAC', label: 'HVAC', value: 'HVAC' },
                { id: 'Plumbing', label: 'Plumbing', value: 'Plumbing' }
              ].find(option => option.value === formData.assetType) || null}
              onChange={(event, newValue) => {
                setFormData({ ...formData, assetType: newValue?.value || '' });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={<span>Asset Type <span style={{ color: 'currentColor' }}>*</span></span>}
                  placeholder="Select Asset Type"
                  fullWidth
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Box>

          {/* Attachments Section - Match AddSchedulePage */}
          <Box sx={{ mb: 3 }}>
            {attachments.length > 0 && (
              <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                flexWrap: 'wrap'
              }}>
                {attachments.map((attachment) => {
                  const isImage = attachment.name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);
                  return (
                    <Box
                      key={attachment.id}
                      sx={{
                        width: '120px',
                        height: '120px',
                        border: '2px dashed #ccc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        backgroundColor: '#fafafa',
                        '&:hover': {
                          borderColor: '#999'
                        }
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setAttachments(prev => prev.filter(a => a.id !== attachment.id))}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          width: 20,
                          height: 20,
                          '&:hover': {
                            backgroundColor: '#f5f5f5'
                          }
                        }}
                      >
                        <X style={{ fontSize: 12 }} />
                      </IconButton>

                      {isImage && attachment.url ? (
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          style={{
                            maxWidth: '100px',
                            maxHeight: '100px',
                            objectFit: 'contain',
                            marginBottom: 8,
                            borderRadius: 4
                          }}
                        />
                      ) : (
                        <AttachFile sx={{ fontSize: 24, color: '#666', mb: 1 }} />
                      )}
                      {!isImage && (
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: 'center',
                            px: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%'
                          }}
                        >
                          {attachment.name}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <MuiButton
                variant="outlined"
                onClick={addAttachment}
                sx={{
                  borderColor: '#C72030',
                  color: '#C72030',
                  textTransform: 'none',
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 500,
                  borderRadius: '0',
                  padding: '8px 16px',
                  '&:hover': {
                    borderColor: '#B8252F',
                    backgroundColor: 'rgba(199, 32, 48, 0.04)',
                  },
                }}
              >
                Add Attachment
              </MuiButton>
            </Box> */}
          </Box>
        </SectionCard>

        {/* Question Setup Section - Match AddSchedulePage styling */}
        <div>
          {/* Header Outside the Box */}
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center gap-2 text-[#C72030] text-lg font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm">
                <Cog className="w-6 h-6" />
              </span>
              QUESTION SETUP
            </div>

            <div className="flex items-center gap-4">
              {/* <div className="flex items-center gap-1">
                <label className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${createNew ? 'bg-[#C72030]' : 'bg-gray-300'}`}>
                  <input
                    type="checkbox"
                    checked={createNew}
                    onChange={(e) => setCreateNew(e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${createNew ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </label>
                <span className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'Work Sans, sans-serif' }}>Create Template</span>
              </div> */}
              <div className="flex items-center gap-1">
                <label className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${weightage ? 'bg-[#C72030]' : 'bg-gray-300'}`}>
                  <input
                    type="checkbox"
                    checked={weightage}
                    onChange={(e) => setWeightage(e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${weightage ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </label>
                <span className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'Work Sans, sans-serif' }}>Weightage</span>
              </div>
              <div className="flex items-center gap-1">
                <label className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${autoTicket ? 'bg-[#C72030]' : 'bg-gray-300'}`}>
                  <input
                    type="checkbox"
                    checked={autoTicket}
                    onChange={(e) => setAutoTicket(e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${autoTicket ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </label>
                <span className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'Work Sans, sans-serif' }}>Auto Ticket</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <label className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${autoTicket ? 'bg-[#C72030]' : 'bg-gray-300'}`}>
                  <input
                    type="checkbox"
                    checked={autoTicket}
                    onChange={(e) => setAutoTicket(e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${autoTicket ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </label>
                <span className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'Work Sans, sans-serif' }}>Auto Ticket</span>
              </div> */}
            </div>
          </div>

          {/* Auto Ticket Configuration Section */}
          {autoTicket && (
            <div className="p-4 sm:p-6 bg-white mb-6">
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Auto Ticket Configuration
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Ticket Level</Typography>
                  <MuiRadioGroup
                    row
                    value={formData.ticketLevel}
                    onChange={(e) => setFormData({ ...formData, ticketLevel: e.target.value })}
                  >
                    <FormControlLabel
                      value="checklist"
                      control={
                        <Radio
                          sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                        />
                      }
                      label="Checklist Level"
                    />
                    <FormControlLabel
                      value="question"
                      control={
                        <Radio
                          sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                        />
                      }
                      label="Question Level"
                    />
                  </MuiRadioGroup>
                </Box>

                <Autocomplete
                  disabled={loading.users}
                  options={[
                    { id: '', label: 'Select Assigned To', value: '' },
                    ...users.map((user) => ({
                      id: user.id.toString(),
                      label: user.full_name,
                      value: user.id.toString()
                    }))
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: '', label: 'Select Assigned To', value: '' },
                    ...users.map((user) => ({
                      id: user.id.toString(),
                      label: user.full_name,
                      value: user.id.toString()
                    }))
                  ].find(option => option.value === formData.ticketAssignedTo) || null}
                  onChange={(event, newValue) => {
                    if (newValue) setFormData({ ...formData, ticketAssignedTo: newValue.value });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params} 
                      label={<span>Assigned To <span style={{ color: 'currentColor' }}>*</span></span>} 
                      fullWidth 
                    />
                  )}
                />

                <Autocomplete
                  disabled={loading.helpdeskCategories}
                  options={[
                    { id: '', label: 'Select Category', value: '' },
                    ...helpdeskCategories.map((category) => ({
                      id: category.id.toString(),
                      label: category.name,
                      value: category.id.toString()
                    }))
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: '', label: 'Select Category', value: '' },
                    ...helpdeskCategories.map((category) => ({
                      id: category.id.toString(),
                      label: category.name,
                      value: category.id.toString()
                    }))
                  ].find(option => option.value === formData.ticketCategory) || null}
                  onChange={(event, newValue) => {
                    if (newValue) setFormData({ ...formData, ticketCategory: newValue.value });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params} 
                      label={<span>Category <span style={{ color: 'currentColor' }}>*</span></span>} 
                      fullWidth 
                    />
                  )}
                />
                {loading.helpdeskCategories && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading categories...
                  </Typography>
                )}
              </Box>
            </div>
            )}

          {/* Main Content in White Box */}
          {sections.map((section, sectionIndex) => (
            <div key={section.id} className="overflow-hidden">
              <div className="p-4 sm:p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Section {sectionIndex + 1}
                  </Typography>
                  {sections.length > 1 && (
                    <IconButton
                      onClick={() => removeQuestionSection(section.id)}
                      sx={{ color: '#C72030' }}
                    >
                      <X />
                    </IconButton>
                  )}
                </div>

                {section.tasks && section.tasks.map((task, taskIndex) => (
                  <Box key={task.id} sx={{ mb: 3 }}>
                    {/* Dashed Border Section */}
                    <Box sx={{
                      border: '2px dashed #E0E0E0',
                      padding: 2,
                      borderRadius: 0,
                      backgroundColor: '#FAFAFA',
                      position: 'relative'
                    }}>
                      {/* Close button for individual tasks */}
                      {!(sectionIndex === 0 && taskIndex === 0) && (
                        <IconButton
                          onClick={() => removeTaskFromSection(section.id, task.id)}
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
                                checked={task.helpTextEnabled}
                                onChange={(e) => updateTask(section.id, task.id, 'helpTextEnabled', e.target.checked)}
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
                          {weightage && (
                            <FormControlLabel
                              control={
                                <MuiCheckbox
                                  checked={task.rating_enabled}
                                  onChange={(e) => updateTask(section.id, task.id, 'rating_enabled', e.target.checked)}
                                  sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                />
                              }
                              label="Rating"
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: weightage ? '2fr 1fr 1fr' : '2fr 1fr' }, gap: 2 }}>
                        <TextField
                          label={<span>Task{task.mandatory && <span style={{ color: 'inherit' }}>&nbsp;*</span>}</span>}
                          placeholder="Enter Task"
                          fullWidth
                          value={task.question}
                          onChange={(e) => updateTask(section.id, task.id, 'question', e.target.value)}
                        />

                        <Autocomplete
                          options={[
                            { id: '', label: 'Select Input Type', value: '' },
                            { id: 'text', label: 'Text', value: 'text' },
                            { id: 'number', label: 'Numeric', value: 'number' },
                            { id: 'dropdown', label: 'Dropdown', value: 'dropdown' },
                            { id: 'checkbox', label: 'Checkbox', value: 'checkbox' },
                            { id: 'radio-group', label: 'Radio', value: 'radio-group' },
                            { id: 'options-inputs', label: 'Options & Inputs', value: 'options-inputs' }
                          ]}
                          getOptionLabel={(option) => option.label}
                          value={[
                            { id: '', label: 'Select Input Type', value: '' },
                            { id: 'text', label: 'Text', value: 'text' },
                            { id: 'number', label: 'Numeric', value: 'number' },
                            { id: 'dropdown', label: 'Dropdown', value: 'dropdown' },
                            { id: 'checkbox', label: 'Checkbox', value: 'checkbox' },
                            { id: 'radio-group', label: 'Radio', value: 'radio-group' },
                            { id: 'options-inputs', label: 'Options & Inputs', value: 'options-inputs' }
                          ].find(option => option.value === task.inputType) || null}
                          onChange={(event, newValue) => {
                            if (!newValue) return;
                            updateTask(section.id, task.id, 'inputType', newValue.value);
                            // Handle default values for different input types
                            if (newValue.value === 'radio-group' || newValue.value === 'dropdown') {
                              updateTaskValues(section.id, task.id, [
                                { label: "Yes", type: "positive", value: "Yes" },
                                { label: "No", type: "negative", value: "No" }
                              ]);
                            } else if (newValue.value === 'checkbox' || newValue.value === 'options-inputs') {
                              updateTaskValues(section.id, task.id, [
                                { label: "", type: "positive", value: "" }
                              ]);
                            } else {
                              updateTaskValues(section.id, task.id, []);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params} 
                              label={<span>Input Type{task.mandatory && <span style={{ color: 'inherit' }}>&nbsp;*</span>}</span>} 
                              fullWidth 
                            />
                          )}
                        />

                        {weightage && (
                          <TextField
                            label={<span>Weightage{task.mandatory && <span style={{ color: 'inherit' }}>&nbsp;*</span>}</span>}
                            type="number"
                            fullWidth
                            value={task.weightage}
                            onChange={(e) => updateTask(section.id, task.id, 'weightage', e.target.value)}
                            placeholder="Enter weightage"
                          />
                        )}
                      </Box>

                      {task.helpTextEnabled && (
                        <Box sx={{ mt: 2 }}>
                          <TextField
                            label="Help Text (Hint)"
                            placeholder="Enter help text or hint"
                            fullWidth
                            value={task.helpTextValue}
                            onChange={(e) => updateTask(section.id, task.id, 'helpTextValue', e.target.value)}
                          />
                        </Box>
                      )}

                      {/* Conditional Value Sections - Same as existing implementation */}
                      {task.inputType === 'dropdown' && (
                        <div className="space-y-2">
                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                            <Label className="block text-sm font-semibold mb-2 text-gray-700">Enter Value</Label>
                            
                            {task.values.map((value, valueIndex) => (
                              <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                <Input
                                  value={value.label}
                                  onChange={(e) => updateValue(section.id, task.id, valueIndex, 'label', e.target.value)}
                                  placeholder="Enter option value"
                                  className="flex-1 bg-white"
                                />
                                
                                <Select
                                  value={value.type}
                                  onValueChange={(newType) => updateValue(section.id, task.id, valueIndex, 'type', newType)}
                                >
                                  <SelectTrigger className="w-20 bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="positive">P</SelectItem>
                                    <SelectItem value="negative">N</SelectItem>
                                  </SelectContent>
                                </Select>
                                
                                {task.values.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeValue(section.id, task.id, valueIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            
                            <div className="flex justify-end mt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addValue(section.id, task.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {task.inputType === 'radio-group' && (
                        <div className="space-y-2">
                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <Label className="text-sm font-semibold text-gray-700">Selected</Label>
                              <Label className="text-sm font-semibold text-gray-700">Enter Value</Label>
                            </div>
                            
                            {task.values.map((value, valueIndex) => (
                              <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                <input
                                  type="radio"
                                  name={`radio-${section.id}-${task.id}`}
                                  checked={valueIndex === 0}
                                  className="text-red-600"
                                  readOnly
                                />
                                
                                <Input
                                  value={value.label}
                                  onChange={(e) => updateValue(section.id, task.id, valueIndex, 'label', e.target.value)}
                                  placeholder="Enter option value"
                                  className="flex-1 bg-white"
                                />
                                
                                <Select
                                  value={value.type}
                                  onValueChange={(newType) => updateValue(section.id, task.id, valueIndex, 'type', newType)}
                                >
                                  <SelectTrigger className="w-20 bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="positive">P</SelectItem>
                                    <SelectItem value="negative">N</SelectItem>
                                  </SelectContent>
                                </Select>
                                
                                {task.values.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeValue(section.id, task.id, valueIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            
                            <div className="flex justify-end mt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addValue(section.id, task.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {task.inputType === 'checkbox' && (
                        <div className="space-y-2">
                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <Label className="text-sm font-semibold text-gray-700">Selected</Label>
                              <Label className="text-sm font-semibold text-gray-700">Enter Value</Label>
                            </div>
                            
                            {(task.values.length > 0 ? task.values : [{ label: "", type: "positive", value: "" }]).map((value, valueIndex) => (
                              <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                <Checkbox
                                  checked={valueIndex === 0}
                                  className="text-red-600"
                                />
                                
                                <Input
                                  value={value.label}
                                  onChange={(e) => {
                                    if (task.values.length === 0) {
                                      updateTaskValues(section.id, task.id, [{ label: e.target.value, type: "positive", value: e.target.value }]);
                                    } else {
                                      updateValue(section.id, task.id, valueIndex, 'label', e.target.value);
                                    }
                                  }}
                                  placeholder="Enter option value"
                                  className="flex-1 bg-white"
                                />
                                
                                {task.values.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeValue(section.id, task.id, valueIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            
                            <div className="flex justify-end mt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (task.values.length === 0) {
                                    updateTaskValues(section.id, task.id, [
                                      { label: "", type: "positive", value: "" },
                                      { label: "", type: "positive", value: "" }
                                    ]);
                                  } else {
                                    addValue(section.id, task.id);
                                  }
                                }}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {task.inputType === 'options-inputs' && (
                        <div className="space-y-2">
                          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                            <Label className="block text-sm font-semibold mb-2 text-gray-700 text-center">Enter Value</Label>
                            
                            {(task.values.length > 0 ? task.values : [{ label: "", type: "positive", value: "" }]).map((value, valueIndex) => (
                              <div key={valueIndex} className="flex items-center gap-2 mb-2">
                                <Input
                                  value={value.label}
                                  onChange={(e) => {
                                    if (task.values.length === 0) {
                                      updateTaskValues(section.id, task.id, [{ label: e.target.value, type: "positive", value: e.target.value }]);
                                    } else {
                                      updateValue(section.id, task.id, valueIndex, 'label', e.target.value);
                                    }
                                  }}
                                  placeholder=""
                                  className="flex-1 bg-white"
                                />
                                
                                {(task.values.length > 1 || (task.values.length === 1 && valueIndex === 0 && task.values[0].label)) && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (task.values.length <= 1) {
                                        updateTaskValues(section.id, task.id, []);
                                      } else {
                                        removeValue(section.id, task.id, valueIndex);
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-700 text-xs"
                                  >
                                    close
                                  </Button>
                                )}
                              </div>
                            ))}
                            
                            <div className="flex justify-end mt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (task.values.length === 0) {
                                    updateTaskValues(section.id, task.id, [
                                      { label: "", type: "positive", value: "" },
                                      { label: "", type: "positive", value: "" }
                                    ]);
                                  } else {
                                    addValue(section.id, task.id);
                                  }
                                }}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                + Add Option
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Box>
                  </Box>
                ))}

                <div className="flex justify-end mt-4 gap-4">
                  <button
                    onClick={() => addTaskToSection(section.id)}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-3 py-1 rounded-md hover:bg-[#f0ebe0] transition-colors"
                    style={{ fontFamily: 'Work Sans, sans-serif' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Question
                  </button>
                  {(sections.length === 1 || sectionIndex === sections.length - 1) && (
                    <button
                      onClick={addSection}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-3 py-1 rounded-md hover:bg-[#f0ebe0] transition-colors"
                      style={{ fontFamily: 'Work Sans, sans-serif' }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Section
                    </button>
                  )}
                </div>
                {sectionIndex < sections.length - 1 && <hr className="my-6 border-t border-gray-200" />}
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/settings/masters/checklist-master')}
            style={{ borderRadius: 0, fontFamily: 'Work Sans, sans-serif' }}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            className="bg-[#C72030] hover:bg-[#C72030]/90"
            onClick={handleSubmit}
            disabled={createChecklistMutation.isPending}
            style={{ borderRadius: 0, fontFamily: 'Work Sans, sans-serif' }}
          >
            {createChecklistMutation.isPending ? 'Saving...' : 'Save Checklist'}
          </Button>
        </div>
      </div>
    </div>
  );
};