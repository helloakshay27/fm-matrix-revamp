import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Button as MuiButton,
  Switch as MuiSwitch,
  styled,
  Autocomplete,
} from '@mui/material';
import {
  Settings,
  Close,
  AttachFile,
} from '@mui/icons-material';
import { Cog, ArrowLeft, Plus, X } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { API_CONFIG, ENDPOINTS, getAuthHeader } from '@/config/apiConfig';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Styled Components from AddSchedulePage for consistency
const SectionCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  borderRadius: '3px',
  overflow: 'hidden',
  marginBottom: '24px',
}));

interface AttachmentFile {
  id: string;
  name: string;
  url: string;
  content: string;
  content_type: string;
}

interface Task {
  id: string;
  question: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpTextEnabled: boolean;
  helpTextValue: string;
  helpTextAttachments?: AttachmentFile[];
  values: Array<{ label: string; type: string; value: string }>;
  dropdownValues: Array<{ label: string; type: string; }>;
  radioValues: Array<{ label: string; type: string; }>;
  checkboxValues: string[];
  checkboxSelectedStates: boolean[];
  optionsInputsValues: string[];
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

export const AddVendorAuditPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'Audit',
    scheduleFor: 'Vendor',
    activityName: '',
    description: '',
    // assetType: '', // This might not be needed for vendor audit
    // groupId: '55', // Default or fetch
    // subGroupId: '160', // Default or fetch
    ticketLevel: 'checklist',
    ticketAssignedTo: '',
    ticketCategory: '',
    supplier: '',
    assignTo: '',
    assignToType: 'user',
    frequency: '',
    startFrom: null,
    endAt: null,
    backupAssignee: '',
    planDurationUnit: 'minutes',
    planDurationValue: '',
    emailTriggerRule: '',
    scanType: '',
    category: '',
    submissionTimeUnit: 'minutes',
    submissionTimeValue: '',
    supervisors: [],
    lockOverdueTask: '',
    graceTimeUnit: 'hours',
    graceTimeValue: '',
  });

  const handleFormChange = useCallback((field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const [sections, setSections] = useState<TaskSection[]>(
    [
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
            helpTextEnabled: false,
            helpTextValue: '',
            helpTextAttachments: [],
            values: [],
            dropdownValues: [{ label: 'Yes', type: 'positive' }, { label: 'No', type: 'negative' }],
            radioValues: [{ label: 'Yes', type: 'positive' }, { label: 'No', type: 'negative' }],
            checkboxValues: ['Yes', 'No'],
            checkboxSelectedStates: [false, false],
            optionsInputsValues: [''],
            consumption_type: '',
            consumption_unit_type: '',
            weightage: '',
            rating_enabled: false
          }
        ]
      }
    ]
  );

  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [weightage, setWeightage] = useState(false);
  const [autoTicket, setAutoTicket] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [helpdeskCategories, setHelpdeskCategories] = useState<any[]>([]);
  const [emailRules, setEmailRules] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    suppliers: false,
    users: false,
    helpdeskCategories: false,
    groups: false,
    emailRules: false,
  });

  const addQuestionSection = () => {
    const newSection: TaskSection = {
      id: Date.now().toString(),
      name: `Section ${sections.length + 1}`,
      isExpanded: true,
      tasks: [
        {
          id: Date.now().toString(),
          question: '',
          inputType: 'text',
          mandatory: false,
          reading: false,
          helpTextEnabled: false,
          helpTextValue: '',
          values: [],
          dropdownValues: [{ label: 'Yes', type: 'positive' }, { label: 'No', type: 'negative' }],
          radioValues: [{ label: 'Yes', type: 'positive' }, { label: 'No', type: 'negative' }],
          checkboxValues: ['Yes', 'No'],
          checkboxSelectedStates: [false, false],
          optionsInputsValues: [''],
          consumption_type: '',
          consumption_unit_type: '',
          weightage: '',
          rating_enabled: false,
          helpTextAttachments: [],
        },
      ],
    };
    setSections([...sections, newSection]);
  };

  const removeQuestionSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const loadSuppliers = async () => {
    setLoading(prev => ({ ...prev, suppliers: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.SUPPLIERS}`, {
        headers: { 'Authorization': getAuthHeader() }
      });
      if (!response.ok) throw new Error('Failed to fetch suppliers');
      const data = await response.json();
      setSuppliers(data.suppliers || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load suppliers.');
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  };

  const loadUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.ESCALATION_USERS}`, {
        headers: { 'Authorization': getAuthHeader() }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users.');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const loadHelpdeskCategories = async () => {
    setLoading(prev => ({ ...prev, helpdeskCategories: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.HELPDESK_CATEGORIES}`, {
        headers: { 'Authorization': getAuthHeader() }
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setHelpdeskCategories(data.helpdesk_categories || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load helpdesk categories.');
    } finally {
      setLoading(prev => ({ ...prev, helpdeskCategories: false }));
    }
  };

  const loadGroups = async () => {
    setLoading(prev => ({ ...prev, groups: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.USER_GROUPS}`, {
        headers: { 'Authorization': getAuthHeader() }
      });
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load groups.');
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };

  const loadEmailRules = async () => {
    setLoading(prev => ({ ...prev, emailRules: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.EMAIL_RULES}`, {
        headers: { 'Authorization': getAuthHeader() }
      });
      if (!response.ok) throw new Error('Failed to fetch email rules');
      const data = await response.json();
      setEmailRules(data.email_rules || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load email trigger rules.');
    } finally {
      setLoading(prev => ({ ...prev, emailRules: false }));
    }
  };

  useEffect(() => {
    loadSuppliers();
    loadUsers();
    loadHelpdeskCategories();
    loadGroups();
    loadEmailRules();
  }, []);


  const addTaskToSection = (sectionId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      question: '',
      inputType: 'text',
      mandatory: false,
      reading: false,
      helpTextEnabled: false,
      helpTextValue: '',
      values: [],
      dropdownValues: [{ label: 'Yes', type: 'positive' }, { label: 'No', type: 'negative' }],
      radioValues: [{ label: 'Yes', type: 'positive' }, { label: 'No', type: 'negative' }],
      checkboxValues: ['Yes', 'No'],
      checkboxSelectedStates: [false, false],
      optionsInputsValues: [''],
      consumption_type: '',
      consumption_unit_type: '',
      weightage: '',
      rating_enabled: false,
      helpTextAttachments: [],
    };
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, tasks: [...section.tasks, newTask] }
        : section
    ));
  };

  const removeTaskFromSection = (sectionId: string, taskId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, tasks: section.tasks.filter(task => task.id !== taskId) }
        : section
    ));
  };
  
  const updateTask = useCallback((sectionId: string, taskId: string, field: keyof Task, value: any) => {
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

  function updateDropdownValue(sectionId: string, taskId: string, valueIndex: number, value: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  dropdownValues: task.dropdownValues.map((v, idx) =>
                    idx === valueIndex ? { ...v, label: value } : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  }

  function updateDropdownType(sectionId: string, taskId: string, valueIndex: number, type: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  dropdownValues: task.dropdownValues.map((v, idx) =>
                    idx === valueIndex ? { ...v, type: type } : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  }

  function addDropdownValue(sectionId: string, taskId: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  dropdownValues: [...task.dropdownValues, { label: '', type: 'positive' }]
                }
                : task
            )
          }
          : section
      )
    );
  }

  function updateRadioValue(sectionId: string, taskId: string, valueIndex: number, value: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  radioValues: task.radioValues.map((v, idx) =>
                    idx === valueIndex ? { ...v, label: value } : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  }

  function updateRadioType(sectionId: string, taskId: string, valueIndex: number, type: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  radioValues: task.radioValues.map((v, idx) =>
                    idx === valueIndex ? { ...v, type: type } : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  }

  function addRadioValue(sectionId: string, taskId: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? { ...task, radioValues: [...task.radioValues, { label: '', type: 'positive' }] }
                : task
            )
          }
          : section
      )
    );
  }

  function removeDropdownValue(sectionId: string, taskId: string, valueIndex: number): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  dropdownValues: task.dropdownValues.filter((_, idx) => idx !== valueIndex)
                }
                : task
            )
          }
          : section
      )
    );
  }

  function removeRadioValue(sectionId: string, taskId: string, valueIndex: number): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  radioValues: task.radioValues.filter((_, idx) => idx !== valueIndex)
                }
                : task
            )
          }
          : section
      )
    );
  }

  // Add helper functions for checkbox values
  function addCheckboxValue(sectionId: string, taskId: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  checkboxValues: [...task.checkboxValues, ''],
                  checkboxSelectedStates: [...task.checkboxSelectedStates, false]
                }
                : task
            )
          }
          : section
      )
    );
  }

  function updateCheckboxValue(sectionId: string, taskId: string, valueIndex: number, value: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  checkboxValues: task.checkboxValues.map((v, idx) =>
                    idx === valueIndex ? value : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  }

  function updateCheckboxSelectedState(sectionId: string, taskId: string, valueIndex: number, checked: boolean): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  checkboxSelectedStates: task.checkboxSelectedStates.map((state, idx) =>
                    idx === valueIndex ? checked : state
                  )
                }
                : task
            )
          }
          : section
      )
    );
  }

  function removeCheckboxValue(sectionId: string, taskId: string, valueIndex: number): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  checkboxValues: task.checkboxValues.filter((_, idx) => idx !== valueIndex),
                  checkboxSelectedStates: task.checkboxSelectedStates.filter((_, idx) => idx !== valueIndex)
                }
                : task
            )
          }
          : section
      )
    );
  }

  // Add helper functions for options & inputs values
  function addOptionsInputsValue(sectionId: string, taskId: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? { ...task, optionsInputsValues: [...task.optionsInputsValues, ''] }
                : task
            )
          }
          : section
      )
    );
  }

  function updateOptionsInputsValue(sectionId: string, taskId: string, valueIndex: number, value: string): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  optionsInputsValues: task.optionsInputsValues.map((v, idx) =>
                    idx === valueIndex ? value : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  }

  function removeOptionsInputsValue(sectionId: string, taskId: string, valueIndex: number): void {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  optionsInputsValues: task.optionsInputsValues.filter((_, idx) => idx !== valueIndex)
                }
                : task
            )
          }
          : section
      )
    );
  }

  const handleSubmit = () => {
    console.log('Form submitted with data:', { formData, sections, attachments });
    toast.info("Submit function needs to be implemented.");
    // Implementation of payload creation and mutation call would go here
  };

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <div className="flex items-center gap-4">
            <IconButton onClick={() => navigate(-1)}>
                <ArrowLeft />
            </IconButton>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ADD VENDOR AUDIT SCHEDULE</h1>
        </div>

        {/* Basic Configuration Section */}
        <SectionCard style={{ padding: '24px', margin: '20px 0', borderRadius: '3px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ backgroundColor: '#C72030', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cog size={16} color="white" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
              Basic Configuration
            </Typography>
          </Box>

          <TextField
            label="Activity Name"
            required
            placeholder="Enter Activity Name"
            fullWidth
            value={formData.activityName}
            onChange={(e) => handleFormChange('activityName', e.target.value)}
            sx={{ mb: 3 }}
          />

          <TextField
            label="Description"
            placeholder="Enter Description/SOP"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            sx={{ mb: 3 }}
          />

          <Autocomplete
            options={suppliers}
            getOptionLabel={(option) => option.name || ''}
            value={suppliers.find(s => s.id === formData.supplier) || null}
            onChange={(event, newValue) => {
              handleFormChange('supplier', newValue?.id || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Supplier"
                required
                placeholder="Select a supplier"
                fullWidth
              />
            )}
            sx={{ mb: 3 }}
          />
        </SectionCard>

        {/* Schedule Setup Section */}
        <SectionCard style={{ padding: '24px', margin: '20px 0', borderRadius: '3px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ backgroundColor: '#C72030', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cog size={16} color="white" />
            </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
                    Schedule Setup
                </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                <FormControl>
                    <RadioGroup row value={formData.assignToType} onChange={(e) => handleFormChange('assignToType', e.target.value)}>
                        <FormControlLabel value="user" control={<Radio />} label="Assign to User" />
                        <FormControlLabel value="group" control={<Radio />} label="Assign to Group" />
                    </RadioGroup>
                </FormControl>

                {formData.assignToType === 'user' ? (
                    <Autocomplete
                        multiple
                        options={users}
                        getOptionLabel={(option) => option.full_name || ''}
                        value={users.filter(u => formData.assignTo.includes(u.id.toString()))}
                        onChange={(e, newValue) => handleFormChange('assignTo', newValue.map(v => v.id.toString()))}
                        renderInput={(params) => <TextField {...params} label="Select Users" />}
                    />
                ) : (
                    <Autocomplete
                        options={groups}
                        getOptionLabel={(option) => option.name || ''}
                        value={groups.find(g => g.id.toString() === formData.assignTo) || null}
                        onChange={(e, newValue) => handleFormChange('assignTo', newValue ? newValue.id.toString() : '')}
                        renderInput={(params) => <TextField {...params} label="Select Group" />}
                    />
                )}

                <Autocomplete
                    options={users}
                    getOptionLabel={(option) => option.full_name || ''}
                    value={users.find(u => u.id.toString() === formData.backupAssignee) || null}
                    onChange={(e, newValue) => handleFormChange('backupAssignee', newValue ? newValue.id.toString() : '')}
                    renderInput={(params) => <TextField {...params} label="Backup Assignee" />}
                />

                <TextField
                    label="Plan Duration Unit"
                    select
                    value={formData.planDurationUnit}
                    onChange={(e) => handleFormChange('planDurationUnit', e.target.value)}
                    fullWidth
                >
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hours">Hours</MenuItem>
                    <MenuItem value="days">Days</MenuItem>
                </TextField>

                <TextField
                    label={`Plan Duration (${formData.planDurationUnit})`}
                    type="number"
                    value={formData.planDurationValue}
                    onChange={(e) => handleFormChange('planDurationValue', e.target.value)}
                    fullWidth
                />

                <Autocomplete
                    options={emailRules}
                    getOptionLabel={(option) => option.name || ''}
                    value={emailRules.find(r => r.id.toString() === formData.emailTriggerRule) || null}
                    onChange={(e, newValue) => handleFormChange('emailTriggerRule', newValue ? newValue.id.toString() : '')}
                    renderInput={(params) => <TextField {...params} label="Email Trigger Rule" />}
                />

                <TextField
                    label="Category"
                    select
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    fullWidth
                >
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="safety">Safety</MenuItem>
                    <MenuItem value="quality">Quality</MenuItem>
                </TextField>

                <TextField
                    label="Submission Time Unit"
                    select
                    value={formData.submissionTimeUnit}
                    onChange={(e) => handleFormChange('submissionTimeUnit', e.target.value)}
                    fullWidth
                >
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hours">Hours</MenuItem>
                </TextField>

                <TextField
                    label={`Submission Time (${formData.submissionTimeUnit})`}
                    type="number"
                    value={formData.submissionTimeValue}
                    onChange={(e) => handleFormChange('submissionTimeValue', e.target.value)}
                    fullWidth
                />

                <Autocomplete
                    multiple
                    options={users}
                    getOptionLabel={(option) => option.full_name}
                    value={users.filter(u => formData.supervisors.includes(u.id.toString()))}
                    onChange={(e, newValue) => handleFormChange('supervisors', newValue.map(v => v.id.toString()))}
                    renderInput={(params) => <TextField {...params} label="Supervisors" />}
                />

                <TextField
                    label="Lock Overdue Task"
                    select
                    value={formData.lockOverdueTask}
                    onChange={(e) => handleFormChange('lockOverdueTask', e.target.value)}
                    fullWidth
                >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                </TextField>

                <TextField
                    label="Grace Time Unit"
                    select
                    value={formData.graceTimeUnit}
                    onChange={(e) => handleFormChange('graceTimeUnit', e.target.value)}
                    fullWidth
                >
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hours">Hours</MenuItem>
                </TextField>

                <TextField
                    label={`Grace Time (${formData.graceTimeUnit})`}
                    type="number"
                    value={formData.graceTimeValue}
                    onChange={(e) => handleFormChange('graceTimeValue', e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Frequency"
                    select
                    value={formData.frequency}
                    onChange={(e) => handleFormChange('frequency', e.target.value)}
                    fullWidth
                >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                </TextField>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Start From"
                        value={formData.startFrom}
                        onChange={(newValue) => handleFormChange('startFrom', newValue)}
                    />
                    <DatePicker
                        label="End At"
                        value={formData.endAt}
                        onChange={(newValue) => handleFormChange('endAt', newValue)}
                    />
                </LocalizationProvider>
            </Box>
        </SectionCard>

        {/* Question Setup Section */}
        <SectionCard style={{ padding: '24px', margin: '20px 0', borderRadius: '3px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ backgroundColor: '#C72030', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cog size={16} color="white" />
            </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
                    QUESTION SETUP
                </Typography>
            </Box>
            <div className="flex items-center gap-4">
              <FormControlLabel
                control={<MuiSwitch checked={weightage} onChange={(e) => setWeightage(e.target.checked)} />}
                label="Weightage"
              />
              <FormControlLabel
                control={<MuiSwitch checked={autoTicket} onChange={(e) => setAutoTicket(e.target.checked)} />}
                label="Auto Ticket"
              />
            </div>
          </Box>

          {autoTicket && (
             <SectionCard style={{ padding: '24px', marginBottom: '24px', border: '1px solid #eee' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Auto Ticket Configuration
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                <FormControl>
                  <RadioGroup row value={formData.ticketLevel} onChange={(e) => handleFormChange('ticketLevel', e.target.value)}>
                    <FormControlLabel value="checklist" control={<Radio />} label="Checklist Level" />
                    <FormControlLabel value="question" control={<Radio />} label="Question Level" />
                  </RadioGroup>
                </FormControl>
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => option.full_name || ''}
                  value={users.find(u => u.id.toString() === formData.ticketAssignedTo) || null}
                  onChange={(e, newValue) => handleFormChange('ticketAssignedTo', newValue ? newValue.id.toString() : '')}
                  renderInput={(params) => <TextField {...params} label="Assigned To" />}
                />
                <Autocomplete
                  options={helpdeskCategories}
                  getOptionLabel={(option) => option.name || ''}
                  value={helpdeskCategories.find(c => c.id.toString() === formData.ticketCategory) || null}
                  onChange={(e, newValue) => handleFormChange('ticketCategory', newValue ? newValue.id.toString() : '')}
                  renderInput={(params) => <TextField {...params} label="Category" />}
                />
              </Box>
            </SectionCard>
          )}

          {sections.map((section, sectionIndex) => (
            <div key={section.id} className="overflow-hidden mb-4">
               <SectionCard style={{ padding: '24px', border: '1px solid #eee' }}>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Section {sectionIndex + 1}
                  </Typography>
                  {sections.length > 1 && (
                      <IconButton
                        onClick={() => removeQuestionSection(section.id)}
                        sx={{ color: '#C72030' }}
                      >
                        <Close />
                      </IconButton>
                    )}
                </div>

                {section.tasks.map((task, taskIndex) => (
                  <Box key={task.id} sx={{ mb: 3, border: '2px dashed #E0E0E0', p: 2, position: 'relative' }}>
                     {!(sectionIndex === 0 && taskIndex === 0) && (
                        <IconButton
                          onClick={() => removeTaskFromSection(section.id, task.id)}
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                          size="small"
                        >
                          <X fontSize="small" />
                        </IconButton>
                      )}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: weightage ? '2fr 1fr 1fr' : '2fr 1fr' }, gap: 2, mb: 2 }}>
                       <TextField
                          label="Task"
                          required
                          placeholder="Enter Task"
                          fullWidth
                          value={task.question}
                          onChange={(e) => updateTask(section.id, task.id, 'question', e.target.value)}
                        />
                        <Autocomplete
                          options={['text', 'number', 'dropdown', 'checkbox', 'radio-group', 'date', 'multiline', 'options-inputs']}
                          value={task.inputType}
                          onChange={(e, newValue) => {
                            const newType = newValue || 'text';
                            updateTask(section.id, task.id, 'inputType', newType);
                            if (newType === 'dropdown') {
                                updateTask(section.id, task.id, 'dropdownValues', [
                                  { label: 'Yes', type: 'positive' },
                                  { label: 'No', type: 'negative' }
                                ]);
                              } else if (newType !== 'dropdown') {
                                updateTask(section.id, task.id, 'dropdownValues', [{ label: '', type: 'positive' }]);
                              }
                              if (newType === 'radio') {
                                updateTask(section.id, task.id, 'radioValues', [
                                  { label: 'Yes', type: 'positive' },
                                  { label: 'No', type: 'negative' }
                                ]);
                              } else if (newType !== 'radio') {
                                updateTask(section.id, task.id, 'radioValues', [{ label: '', type: 'positive' }]);
                              }
                              if (newType === 'checkbox') {
                                updateTask(section.id, task.id, 'checkboxValues', ['Yes', 'No']);
                                updateTask(section.id, task.id, 'checkboxSelectedStates', [false, false]);
                              } else if (newType !== 'checkbox') {
                                updateTask(section.id, task.id, 'checkboxValues', ['']);
                                updateTask(section.id, task.id, 'checkboxSelectedStates', [false]);
                              }
                              if (newType !== 'options-inputs') {
                                updateTask(section.id, task.id, 'optionsInputsValues', ['']);
                              }
                          }}
                          renderInput={(params) => <TextField {...params} label="Input Type" />}
                        />
                        {weightage && (
                            <TextField
                              label="Weightage"
                              type="number"
                              fullWidth
                              value={task.weightage}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (Number(value) < 0) return;
                                updateTask(section.id, task.id, 'weightage', value);
                              }}
                              inputProps={{
                                min: 0,
                                onWheel: (e) => (e.target as HTMLInputElement).blur(),
                              }}
                              placeholder="Enter weightage"
                            />
                          )}
                    </Box>
                     <FormControlLabel control={<Checkbox checked={task.mandatory} onChange={(e) => updateTask(section.id, task.id, 'mandatory', e.target.checked)} />} label="Mandatory" />
                     <FormControlLabel control={<Checkbox checked={task.reading} onChange={(e) => updateTask(section.id, task.id, 'reading', e.target.checked)} />} label="Reading" />
                     <FormControlLabel control={<Checkbox checked={task.helpTextEnabled} onChange={(e) => updateTask(section.id, task.id, 'helpTextEnabled', e.target.checked)} />} label="Help Text" />
                     {weightage && (
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={task.rating_enabled}
                                onChange={(e) => updateTask(section.id, task.id, 'rating_enabled', e.target.checked)}
                            />
                            }
                            label="Rating"
                        />
                    )}

                    {task.inputType === 'dropdown' && (
                        <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Dropdown Options</Typography>
                        {task.dropdownValues.map((value, valueIndex) => (
                            <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter option value"
                                value={value.label}
                                onChange={(e) => updateDropdownValue(section.id, task.id, valueIndex, e.target.value)}
                                label="Option"
                            />
                            <Select
                                size="small"
                                value={value.type}
                                onChange={(e) => updateDropdownType(section.id, task.id, valueIndex, e.target.value)}
                            >
                                <MenuItem value="positive">Positive</MenuItem>
                                <MenuItem value="negative">Negative</MenuItem>
                            </Select>
                            {task.dropdownValues.length > 1 && (
                                <IconButton size="small" onClick={() => removeDropdownValue(section.id, task.id, valueIndex)}>
                                <Close />
                                </IconButton>
                            )}
                            </Box>
                        ))}
                        <MuiButton size="small" onClick={() => addDropdownValue(section.id, task.id)}>Add Option</MuiButton>
                        </Box>
                    )}

                    {task.inputType === 'radio-group' && (
                        <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Radio Group Options</Typography>
                        {task.radioValues.map((value, valueIndex) => (
                            <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter option value"
                                value={value.label}
                                onChange={(e) => updateRadioValue(section.id, task.id, valueIndex, e.target.value)}
                                label="Option"
                            />
                            <Select
                                size="small"
                                value={value.type}
                                onChange={(e) => updateRadioType(section.id, task.id, valueIndex, e.target.value)}
                            >
                                <MenuItem value="positive">Positive</MenuItem>
                                <MenuItem value="negative">Negative</MenuItem>
                            </Select>
                            {task.radioValues.length > 1 && (
                                <IconButton size="small" onClick={() => removeRadioValue(section.id, task.id, valueIndex)}>
                                <Close />
                                </IconButton>
                            )}
                            </Box>
                        ))}
                        <MuiButton size="small" onClick={() => addRadioValue(section.id, task.id)}>Add Option</MuiButton>
                        </Box>
                    )}

                    {task.inputType === 'checkbox' && (
                        <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Checkbox Options</Typography>
                        {task.checkboxValues.map((value, valueIndex) => (
                            <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                            <Checkbox
                                checked={task.checkboxSelectedStates[valueIndex]}
                                onChange={(e) => updateCheckboxSelectedState(section.id, task.id, valueIndex, e.target.checked)}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter option value"
                                value={value}
                                onChange={(e) => updateCheckboxValue(section.id, task.id, valueIndex, e.target.value)}
                                label="Option"
                            />
                            {task.checkboxValues.length > 1 && (
                                <IconButton size="small" onClick={() => removeCheckboxValue(section.id, task.id, valueIndex)}>
                                <Close />
                                </IconButton>
                            )}
                            </Box>
                        ))}
                        <MuiButton size="small" onClick={() => addCheckboxValue(section.id, task.id)}>Add Option</MuiButton>
                        </Box>
                    )}

                    {task.inputType === 'options-inputs' && (
                        <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Options & Inputs</Typography>
                        {task.optionsInputsValues.map((value, valueIndex) => (
                            <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter option value"
                                value={value}
                                onChange={(e) => updateOptionsInputsValue(section.id, task.id, valueIndex, e.target.value)}
                                label="Option"
                            />
                            {task.optionsInputsValues.length > 1 && (
                                <IconButton size="small" onClick={() => removeOptionsInputsValue(section.id, task.id, valueIndex)}>
                                <Close />
                                </IconButton>
                            )}
                            </Box>
                        ))}
                        <MuiButton size="small" onClick={() => addOptionsInputsValue(section.id, task.id)}>Add Option</MuiButton>
                        </Box>
                    )}

                  </Box>
                ))}
                <div className="flex justify-end gap-4 mt-4">
                  <MuiButton
                    variant="outlined"
                    startIcon={<Plus />}
                    onClick={() => addTaskToSection(section.id)}
                  >
                    Add Question
                  </MuiButton>
                  {(sections.length === 1 || sectionIndex === sections.length - 1) && (
                    <MuiButton
                        variant="outlined"
                        startIcon={<Plus />}
                        onClick={addQuestionSection}
                    >
                        Add Section
                    </MuiButton>
                   )}
                </div>
              </SectionCard>
            </div>
          ))}
        </SectionCard>

        <div className="flex justify-end space-x-4 p-6 bg-white sticky bottom-0">
          <MuiButton variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </MuiButton>
          <MuiButton
            variant="contained"
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030', color: 'white' }}
          >
            Create Schedule
          </MuiButton>
        </div>
      </div>
    </div>
  );
};
