import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Box,
  Paper,
  TextField,
  Button as MuiButton,
  Typography,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select as MuiSelect,
  FormControl,
  InputLabel,
  Checkbox as MuiCheckbox,
  IconButton,
  Divider,
  Autocomplete,
  Chip,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Settings, Add, Delete, ArrowBack, Close, AttachFile } from '@mui/icons-material';
import { Cog } from 'lucide-react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { assetService, Asset, AssetGroup, AssetSubGroup, EmailRule, User as UserType, Supplier } from '../services/assetService';

// Styled Components
const RedButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#C72030',
  color: 'white',
  borderRadius: 0,
  textTransform: 'none',
  padding: '10px 24px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#A01828',
    boxShadow: '0 4px 8px rgba(199, 32, 48, 0.3)',
  },
}));

const DraftButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#e7e3d9',
  color: '#C72030',
  borderRadius: 0,
  textTransform: 'none',
  padding: '10px 24px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#d9d5c9',
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  borderRadius: 0,
  overflow: 'hidden',
  marginBottom: '24px',
  padding: '24px',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
}));

const RedIcon = styled(Settings)(({ theme }) => ({
  color: '#fff',
  backgroundColor: '#C72030',
  borderRadius: '50%',
  padding: '8px',
  fontSize: '32px',
}));

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const steps = ['Basic Info', 'Task', 'Schedule'];

interface AttachmentFile {
  id: string;
  name: string;
  url: string;
  content: string; // base64 content (full data URL)
  content_type: string; // MIME type
}

interface TaskQuestion {
  id: string;
  group: string;
  subGroup: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: boolean;
  helpTextValue: string;
  helpTextAttachments?: AttachmentFile[];
  autoTicket: boolean;
  weightage: string;
  rating: boolean;
  dropdownValues: Array<{ label: string, type: string }>;
  radioValues: Array<{ label: string, type: string }>;
  checkboxValues: string[];
  checkboxSelectedStates: boolean[];
  optionsInputsValues: string[];
}

interface TaskSection {
  id: string;
  title: string;
  tasks: TaskQuestion[];
  autoTicket: boolean;
  ticketLevel: string;
  ticketAssignedTo: string;
  ticketCategory: string;
}

export const AddOperationalAuditSchedulePage = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [scheduleFor, setScheduleFor] = useState('Asset');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [taskSections, setTaskSections] = useState<TaskSection[]>([{
    id: '1',
    title: 'Questions',
    autoTicket: false,
    ticketLevel: 'checklist',
    ticketAssignedTo: '',
    ticketCategory: '',
    tasks: [{
      id: '1',
      group: '',
      subGroup: '',
      task: '',
      inputType: '',
      mandatory: false,
      helpText: false,
      helpTextValue: '',
      helpTextAttachments: [],
      autoTicket: false,
      weightage: '',
      rating: false,
      reading: false,
      dropdownValues: [{ label: '', type: 'positive' }],
      radioValues: [{ label: '', type: 'positive' }],
      checkboxValues: [''],
      checkboxSelectedStates: [false],
      optionsInputsValues: ['']
    }]
  }]);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

  // Schedule fields
  const [checklistType, setChecklistType] = useState('Individual');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [assetGroup, setAssetGroup] = useState('');
  const [assetSubGroup, setAssetSubGroup] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [scanType, setScanType] = useState('');
  const [assets, setAssets] = useState<any[]>([]);
  const [assetGroups, setAssetGroups] = useState<any[]>([]);
  const [assetSubGroups, setAssetSubGroups] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [subGroups, setSubGroups] = useState<any>({});
  const [taskGroups, setTaskGroups] = useState<any[]>([]);
  const [taskSubGroups, setTaskSubGroups] = useState<{ [key: string]: any[] }>({});
  const [helpdeskCategories, setHelpdeskCategories] = useState<any[]>([]);
  const [planDuration, setPlanDuration] = useState('Day');
  const [planDurationValue, setPlanDurationValue] = useState('');
  const [priority, setPriority] = useState('');
  const [emailTriggerRule, setEmailTriggerRule] = useState('');
  const [category, setCategory] = useState('');
  const [lockOverdueTask, setLockOverdueTask] = useState('');
  const [supervisors, setSupervisors] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [endAt, setEndAt] = useState('');
  const [supplier, setSupplier] = useState('');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [trainingSubjects, setTrainingSubjects] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedTrainingSubject, setSelectedTrainingSubject] = useState('');
  const [selectedAssetGroup, setSelectedAssetGroup] = useState<number | undefined>();
  const [emailRules, setEmailRules] = useState<EmailRule[]>([]);
  const [loading, setLoading] = useState({
    assets: false,
    assetGroups: false,
    assetSubGroups: false,
    emailRules: false,
    users: false,
    suppliers: false,
    services: false,
    groups: false,
    trainingSubjects: false
  });
  const [checkInPhotograph, setCheckInPhotograph] = useState('inactive');
  const [assignToType, setAssignToType] = useState('user');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [backupAssignee, setBackupAssignee] = useState('');
  const [graceTime, setGraceTime] = useState('');
  const [graceTimeValue, setGraceTimeValue] = useState('');
  const [submissionTime, setSubmissionTime] = useState('');
  const [submissionTimeValue, setSubmissionTimeValue] = useState('');

  // Fetch initial data using exact same APIs as AddSchedulePage
  useEffect(() => {
    loadAssets();
    loadAssetGroups();
    loadEmailRules();
    loadUsers();
    loadSuppliers();
    loadGroups();
    loadTaskGroups();
    loadHelpdeskCategories();
    loadServices();
  }, []);

  // Load asset sub-groups when asset group changes
  useEffect(() => {
    if (selectedAssetGroup) {
      loadAssetSubGroups(selectedAssetGroup);
    } else {
      setAssetSubGroups([]);
    }
  }, [selectedAssetGroup]);

  const loadAssets = async () => {
    setLoading(prev => ({ ...prev, assets: true }));
    try {
      const data = await assetService.getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Failed to load assets:', error);
      toast.error("Failed to load assets.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, assets: false }));
    }
  };

  const loadAssetGroups = async () => {
    setLoading(prev => ({ ...prev, assetGroups: true }));
    try {
      const data = await assetService.getAssetGroups();
      setAssetGroups(data.asset_groups);
    } catch (error) {
      console.error('Failed to load asset groups:', error);
      toast.error("Failed to load asset groups.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, assetGroups: false }));
    }
  };

  const loadAssetSubGroups = async (groupId: number) => {
    setLoading(prev => ({ ...prev, assetSubGroups: true }));
    try {
      const data = await assetService.getAssetSubGroups(groupId);
      setAssetSubGroups(data.asset_groups);
    } catch (error) {
      console.error('Failed to load asset sub-groups:', error);
      toast.error("Failed to load asset sub-groups.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, assetSubGroups: false }));
    }
  };

  const loadEmailRules = async () => {
    setLoading(prev => ({ ...prev, emailRules: true }));
    try {
      const data = await assetService.getEmailRules();
      setEmailRules(data);
    } catch (error) {
      console.error('Failed to load email rules:', error);
      toast.error("Failed to load email rules.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, emailRules: false }));
    }
  };

  const loadUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESCALATION_USERS}`, {
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
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error("Failed to load users.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
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

  const loadSuppliers = async () => {
    setLoading(prev => ({ ...prev, suppliers: true }));
    try {
      const data = await assetService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
      toast.error("Failed to load suppliers.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  };

  const loadServices = async () => {
    setLoading(prev => ({ ...prev, services: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/services/get_services.json`, {
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
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error("Failed to load services.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  const loadTrainingSubjects = async () => {
    setLoading(prev => ({ ...prev, trainingSubjects: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/generic_tags.json?q[tag_type_eq]=Training%20Subject`, {
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
      setTrainingSubjects(data);
    } catch (error) {
      console.error('Failed to load training subjects:', error);
      toast.error("Failed to load training subjects.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, trainingSubjects: false }));
    }
  };

  const loadGroups = async () => {
    setLoading(prev => ({ ...prev, groups: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_GROUPS}`, {
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
      const groupsArray = data.map((group: any) => ({
        id: group.id,
        name: group.name
      }));
      setGroups(groupsArray);
    } catch (error) {
      console.error('Failed to load user groups:', error);
      toast.error("Failed to load user groups.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
      const mockGroups = [
        { id: 1, name: 'Admin Group' },
        { id: 2, name: 'Manager Group' },
        { id: 3, name: 'Technician Group' }
      ];
      setGroups(mockGroups);
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };

  const loadTaskGroups = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_GROUPS}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const groupsArray = data.map((group: any) => ({
          id: group.id,
          name: group.name
        }));
        setTaskGroups(groupsArray);
      }
    } catch (error) {
      console.error('Error fetching task groups:', error);
    }
  };

  const loadHelpdeskCategories = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HELPDESK_CATEGORIES}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const categoriesArray = (data.helpdesk_categories || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name
        }));
        setHelpdeskCategories(categoriesArray);
      }
    } catch (error) {
      console.error('Error fetching helpdesk categories:', error);
    }
  };

  const loadTaskSubGroups = async (groupId: string) => {
    // TODO: Add API call when endpoint is provided
    if (!groupId) return;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_SUB_GROUPS}?group_id=${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const subGroupsArray = (data.asset_groups || []).map((subGroup: any) => ({
          id: subGroup.id,
          name: subGroup.name
        }));
        setTaskSubGroups(prev => ({
          ...prev,
          [groupId]: subGroupsArray
        }));
      }
    } catch (error) {
      console.error('Failed to load task sub-groups:', error);
    }
  };

  const handleTaskGroupChange = (sectionId: string, taskId: string, groupId: string) => {
    updateTaskInSection(sectionId, taskId, 'group', groupId);
    updateTaskInSection(sectionId, taskId, 'subGroup', '');
    if (groupId) {
      loadTaskSubGroups(groupId);
    }
  };

  const handleChecklistTypeChange = (value: string) => {
    setChecklistType(value);
    // Reset schedule-related fields based on checklist type
    if (value === 'Individual') {
      setSelectedAssetGroup(undefined);
      setAssetSubGroup('');
      setAssetGroup('');
    }
    // Reset all selected values when changing checklist type
    setSelectedAsset('');
    setSelectedService('');
    setSelectedVendor('');
    setSelectedTrainingSubject('');
  };

  const handleScheduleForChange = (value: string) => {
    setScheduleFor(value);
    // Reset all schedule-related fields
    setChecklistType('Individual');
    setSelectedAsset('');
    setSelectedService('');
    setSelectedVendor('');
    setSelectedTrainingSubject('');
    setAssetGroup('');
    setAssetSubGroup('');
    setSelectedAssetGroup(undefined);

    // Load data based on selected schedule type
    if (value === 'Training') {
      loadTrainingSubjects();
    }
  };

  const handleAssetGroupChange = (groupId: string) => {
    setAssetGroup(groupId);
    setAssetSubGroup('');
    if (groupId) {
      const groupIdNum = parseInt(groupId);
      setSelectedAssetGroup(groupIdNum);
    } else {
      setSelectedAssetGroup(undefined);
    }
  };

  const needsValueInput = (type: string) => {
    return type && !['', 'Select Plan Duration', 'Select Submission Time', 'Select Grace Time'].includes(type);
  };

  const updateTaskInSection = (sectionId: string, taskId: string, key: keyof TaskQuestion, value: any): void => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? { ...task, [key]: value }
                : task
            )
          }
          : section
      )
    );
  };

  const updateSectionProperty = (id: string, key: keyof TaskSection, value: any): void => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === id
          ? { ...section, [key]: value }
          : section
      )
    );
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.includes(stepIndex);
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const validateForm = (): boolean => {
    // Step 1: Basic Info validation
    if (activeStep === 0) {
      if (!activityName.trim()) {
        toast.error('Activity Name is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }
    }

    // Step 2: Task validation
    if (activeStep === 1) {
      for (const section of taskSections) {
        for (const task of section.tasks) {
          if (!task.task.trim()) {
            toast.error('All task questions must be filled', {
              position: 'top-right',
              duration: 4000,
              style: { background: '#fff', color: 'black', border: 'none' }
            });
            return false;
          }
          if (!task.inputType) {
            toast.error('Input type must be selected for all tasks', {
              position: 'top-right',
              duration: 4000,
              style: { background: '#fff', color: 'black', border: 'none' }
            });
            return false;
          }
        }
      }
    }

    // Step 3: Schedule validation
    if (activeStep === 2) {
      // Check schedule type specific required fields
      // if (scheduleFor === 'Asset' && checklistType === 'Individual' && !selectedAsset) {
      //   toast.error('Please select an asset', {
      //     position: 'top-right',
      //     duration: 4000,
      //     style: { background: '#fff', color: 'black', border: 'none' }
      //   });
      //   return false;
      // }

      if (scheduleFor === 'Asset' && checklistType === 'Asset Group') {
        if (!assetGroup) {
          toast.error('Please select an asset group', {
            position: 'top-right',
            duration: 4000,
            style: { background: '#fff', color: 'black', border: 'none' }
          });
          return false;
        }
        if (!assetSubGroup) {
          toast.error('Please select asset sub-group(s)', {
            position: 'top-right',
            duration: 4000,
            style: { background: '#fff', color: 'black', border: 'none' }
          });
          return false;
        }
      }

      if (scheduleFor === 'Service' && !selectedService) {
        toast.error('Please select a service', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (scheduleFor === 'Supplier' && !selectedVendor) {
        toast.error('Please select a vendor', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (scheduleFor === 'Training' && !selectedTrainingSubject) {
        toast.error('Please select a training subject', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      // Check assign to fields
      if (!assignToType) {
        toast.error('Please select assign to type', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (assignToType === 'user' && selectedUsers.length === 0) {
        toast.error('Please select at least one user', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (assignToType === 'group' && selectedGroups.length === 0) {
        toast.error('Please select at least one group', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      // Check required schedule fields
      if (!backupAssignee) {
        toast.error('Backup Assignee is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (!planDuration) {
        toast.error('Plan Duration is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (needsValueInput(planDuration) && !planDurationValue) {
        toast.error('Plan Duration Value is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (!category) {
        toast.error('Category is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (!lockOverdueTask) {
        toast.error('Lock Overdue Task is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (!graceTime) {
        toast.error('Grace Time is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (needsValueInput(graceTime) && !graceTimeValue) {
        toast.error('Grace Time Value is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (!startFrom) {
        toast.error('Start Date is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (!endAt) {
        toast.error('End Date is required', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }

      if (startFrom && endAt && endAt < startFrom) {
        toast.error('End date cannot be before start date', {
          position: 'top-right',
          duration: 4000,
          style: { background: '#fff', color: 'black', border: 'none' }
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      // Build content array from taskSections
      const content = taskSections.flatMap(section =>
        section.tasks.map(task => {
          const baseTask: any = {
            task: task.task,
            input_type: task.inputType,
            mandatory: task.mandatory ? '1' : '0',
            reading: task.reading ? '1' : '0',
            help_text: task.helpText ? '1' : '0',
            help_text_value: task.helpTextValue || '',
            auto_ticket: task.autoTicket ? '1' : '0',
            weightage: task.weightage || '',
            rating: task.rating ? '1' : '0'
          };

          // Add dropdown values if input type is dropdown
          if (task.inputType === 'dropdown') {
            baseTask.dropdown_values = task.dropdownValues.map(v => ({
              label: v.label,
              type: v.type
            }));
          }

          // Add radio values if input type is radio
          if (task.inputType === 'radio') {
            baseTask.radio_values = task.radioValues.map(v => ({
              label: v.label,
              type: v.type
            }));
          }

          // Add checkbox values if input type is checkbox
          if (task.inputType === 'checkbox') {
            baseTask.checkbox_values = task.checkboxValues;
            baseTask.checkbox_selected_states = task.checkboxSelectedStates;
          }

          // Add options-inputs values if input type is options-inputs
          if (task.inputType === 'options-inputs') {
            baseTask.options_inputs_values = task.optionsInputsValues;
          }

          return baseTask;
        })
      );

      // Map scheduleFor to checklist_type
      const checklistTypeMap: { [key: string]: string } = {
        'Asset': 'Asset',
        'Service': 'Service',
        'Supplier': 'Supplier',
        'Training': 'Training'
      };

      // Build the payload
      const payload = {
        schedule_type: 'ppm',
        pms_custom_form: {
          created_source: 'audit',
          create_ticket: '0',
          ticket_level: 'checklist',
          task_assigner_id: '',
          helpdesk_category_id: '',
          weightage_enabled: '0',
          schedule_type: 'PPM',
          form_name: activityName,
          description: description,
          observations_enabled: '1',
          supervisors: supervisors ? [supervisors] : [],
          supplier_id: supplier || ''
        },
        custom_form_code: '',
        sch_type: 'PPM',
        checklist_type: checklistTypeMap[scheduleFor] || scheduleFor,
        group_id: assetGroup || '',
        sub_group_id: assetSubGroup || '',
        content: content,
        checklist_upload_type: checklistType,
        asset_ids: scheduleFor === 'Asset' && selectedAsset ? [selectedAsset] : [],
        service_ids: scheduleFor === 'Service' && selectedService ? [selectedService] : [],
        supplier_ids: scheduleFor === 'Supplier' && selectedVendor ? [selectedVendor] : [],
        training_subject_ids: scheduleFor === 'Training' && selectedTrainingSubject ? [selectedTrainingSubject] : [],
        sub_group_ids: assetSubGroup ? [assetSubGroup] : [],
        pms_asset_task: {
          assignment_type: assignToType === 'user' ? 'people' : 'group',
          scan_type: scanType || '',
          plan_type: planDuration,
          plan_value: planDurationValue,
          priority: priority || '',
          category: category,
          overdue_task_start_status: lockOverdueTask,
          frequency: frequency || '',
          start_date: startFrom,
          end_date: endAt,
          submission_time: submissionTime,
          submission_time_value: submissionTimeValue,
          grace_time: graceTime,
          grace_time_value: graceTimeValue
        },
        people_assigned_to_ids: assignToType === 'user' ? selectedUsers : [],
        group_assigned_to_ids: assignToType === 'group' ? selectedGroups : [],
        backup_assignee_id: backupAssignee,
        ppm_rule_ids: emailTriggerRule ? [emailTriggerRule] : [],
        attachments: attachments.map(att => ({
          name: att.name,
          content: att.content,
          content_type: att.content_type
        }))
      };

      console.log('Submitting payload:', payload);

      // Make POST request
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/custom_forms.json`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response:', data);

      toast.success('Operational audit schedule created successfully!', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
      navigate(-1);
    } catch (error) {
      console.error('Failed to save operational audit schedule:', error);
      toast.error('Failed to save operational audit schedule', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const addTaskSection = () => {
    const newSection: TaskSection = {
      id: `section_${Date.now()}`,
      title: 'Questions',
      autoTicket: false,
      ticketLevel: 'checklist',
      ticketAssignedTo: '',
      ticketCategory: '',
      tasks: [{
        id: `task_${Date.now()}`,
        group: '',
        subGroup: '',
        task: '',
        inputType: '',
        mandatory: false,
        helpText: false,
        helpTextValue: '',
        helpTextAttachments: [],
        autoTicket: false,
        weightage: '',
        rating: false,
        reading: false,
        dropdownValues: [{ label: '', type: 'positive' }],
        radioValues: [{ label: '', type: 'positive' }],
        checkboxValues: [''],
        checkboxSelectedStates: [false],
        optionsInputsValues: ['']
      }]
    };
    setTaskSections([...taskSections, newSection]);
  };

  const removeTaskSection = (sectionId: string): void => {
    setTaskSections(taskSections.filter(section => section.id !== sectionId));
  };

  const addTaskToSection = (sectionId: string): void => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: [...section.tasks, {
              id: `task_${Date.now()}`,
              group: section.tasks[0]?.group || '',
              subGroup: section.tasks[0]?.subGroup || '',
              task: '',
              inputType: '',
              mandatory: false,
              helpText: false,
              helpTextValue: '',
              helpTextAttachments: [],
              autoTicket: false,
              weightage: '',
              rating: false,
              reading: false,
              dropdownValues: [{ label: '', type: 'positive' }],
              radioValues: [{ label: '', type: 'positive' }],
              checkboxValues: [''],
              checkboxSelectedStates: [false],
              optionsInputsValues: ['']
            }]
          }
          : section
      )
    );
  };

  const removeTaskFromSection = (sectionId: string, taskId: string): void => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.filter(task => task.id !== taskId)
          }
          : section
      )
    );
  };

  const updateDropdownValue = (sectionId: string, taskId: string, valueIndex: number, value: string) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  dropdownValues: task.dropdownValues.map((v, i) =>
                    i === valueIndex ? { ...v, label: value } : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  };

  const updateDropdownType = (sectionId: string, taskId: string, valueIndex: number, type: string) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  dropdownValues: task.dropdownValues.map((v, i) =>
                    i === valueIndex ? { ...v, type } : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  };

  const addDropdownValue = (sectionId: string, taskId: string) => {
    setTaskSections(prevSections =>
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
  };

  const removeDropdownValue = (sectionId: string, taskId: string, valueIndex: number) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId && task.dropdownValues.length > 1
                ? {
                  ...task,
                  dropdownValues: task.dropdownValues.filter((_, i) => i !== valueIndex)
                }
                : task
            )
          }
          : section
      )
    );
  };

  const updateRadioValue = (sectionId: string, taskId: string, valueIndex: number, value: string) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  radioValues: task.radioValues.map((v, i) =>
                    i === valueIndex ? { ...v, label: value } : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  };

  const updateRadioType = (sectionId: string, taskId: string, valueIndex: number, type: string) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  radioValues: task.radioValues.map((v, i) =>
                    i === valueIndex ? { ...v, type } : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  };

  const addRadioValue = (sectionId: string, taskId: string) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  radioValues: [...task.radioValues, { label: '', type: 'positive' }]
                }
                : task
            )
          }
          : section
      )
    );
  };

  const removeRadioValue = (sectionId: string, taskId: string, valueIndex: number) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId && task.radioValues.length > 1
                ? {
                  ...task,
                  radioValues: task.radioValues.filter((_, i) => i !== valueIndex)
                }
                : task
            )
          }
          : section
      )
    );
  };

  const addCheckboxValue = (sectionId: string, taskId: string) => {
    setTaskSections(prevSections =>
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
  };

  const updateCheckboxValue = (sectionId: string, taskId: string, valueIndex: number, value: string) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  checkboxValues: task.checkboxValues.map((v, i) =>
                    i === valueIndex ? value : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  };

  const updateCheckboxSelectedState = (sectionId: string, taskId: string, valueIndex: number, checked: boolean) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  checkboxSelectedStates: task.checkboxSelectedStates.map((state, i) =>
                    i === valueIndex ? checked : state
                  )
                }
                : task
            )
          }
          : section
      )
    );
  };

  const removeCheckboxValue = (sectionId: string, taskId: string, valueIndex: number) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId && task.checkboxValues.length > 1
                ? {
                  ...task,
                  checkboxValues: task.checkboxValues.filter((_, i) => i !== valueIndex),
                  checkboxSelectedStates: task.checkboxSelectedStates.filter((_, i) => i !== valueIndex)
                }
                : task
            )
          }
          : section
      )
    );
  };

  const addOptionsInputsValue = (sectionId: string, taskId: string) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  optionsInputsValues: [...task.optionsInputsValues, '']
                }
                : task
            )
          }
          : section
      )
    );
  };

  const updateOptionsInputsValue = (sectionId: string, taskId: string, valueIndex: number, value: string) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  optionsInputsValues: task.optionsInputsValues.map((v, i) =>
                    i === valueIndex ? value : v
                  )
                }
                : task
            )
          }
          : section
      )
    );
  };

  const removeOptionsInputsValue = (sectionId: string, taskId: string, valueIndex: number) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId && task.optionsInputsValues.length > 1
                ? {
                  ...task,
                  optionsInputsValues: task.optionsInputsValues.filter((_, i) => i !== valueIndex)
                }
                : task
            )
          }
          : section
      )
    );
  };

  const addHelpTextAttachment = (sectionId: string, taskId: string, file: AttachmentFile) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  helpTextAttachments: [...task.helpTextAttachments, file]
                }
                : task
            )
          }
          : section
      )
    );
  };

  const removeHelpTextAttachment = (sectionId: string, taskId: string, attachmentId: string) => {
    setTaskSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  helpTextAttachments: task.helpTextAttachments.filter(att => att.id !== attachmentId)
                }
                : task
            )
          }
          : section
      )
    );
  };

  // Add attachment function for Basic Info
  const addAttachment = (): void => {
    // Create a hidden file input and trigger click
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    input.style.display = 'none';

    input.onchange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const newAttachments: AttachmentFile[] = [];

        // Convert each file to base64
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          try {
            // Convert file to base64
            const base64Content = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result as string;
                // Keep full data URL for content
                resolve(result);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });

            newAttachments.push({
              id: `${Date.now()}-${i}`,
              name: file.name,
              url: URL.createObjectURL(file), // Keep for UI preview
              content: base64Content, // Full data URL with base64
              content_type: file.type || 'application/octet-stream'
            });
          } catch (error) {
            console.error('Error converting file to base64:', error);
            toast.error(`Failed to process file: ${file.name}`);
          }
        }

        if (newAttachments.length > 0) {
          setAttachments(prev => [...prev, ...newAttachments]);
          // Show success toast
          toast.success(`${newAttachments.length} file(s) attached successfully!`, {
            position: 'top-right',
            duration: 4000,
            style: {
              background: '#fff',
              color: 'black',
              border: 'none',
            },
          });
        }
      }
    };

    input.onerror = () => {
      // Show error toast
      toast.error("Failed to attach files. Please try again.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    };

    document.body.appendChild(input);
    input.click();
    // Clean up after selection
    input.remove();
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack} sx={{ color: '#666' }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
              Schedule List &gt; Create New Schedule
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: 'Work Sans, sans-serif' }}>
              ADD SCHEDULE
            </Typography>
          </Box>
        </Box>

        {/* Custom Stepper - Bordered Box Design */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            {steps.map((label, index) => (
              <Box key={`step-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  onClick={() => handleStepClick(index)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: (index === activeStep || completedSteps.includes(index)) ? '#C72030' : 'white',
                    color: (index === activeStep || completedSteps.includes(index)) ? 'white' : '#C4B89D',
                    border: `2px solid ${(index === activeStep || completedSteps.includes(index)) ? '#C72030' : '#C4B89D'}`,
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: 500,
                    textAlign: 'center',
                    minWidth: '140px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: index === activeStep ? '0 2px 4px rgba(199, 32, 48, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Work Sans, sans-serif',
                    position: 'relative',
                    '&:hover': {
                      opacity: 0.9
                    },
                    '&::before': completedSteps.includes(index) && index !== activeStep ? {
                      position: 'absolute',
                      left: '8px',
                      fontSize: '11px',
                      fontWeight: 600
                    } : {}
                  }}
                >
                  {label}
                </Box>
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      width: '60px',
                      height: '2px',
                      backgroundImage: 'repeating-linear-gradient(to right, #C4B89D 0px, #C4B89D 8px, transparent 8px, transparent 16px)',
                      margin: '0 0px'
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Step Content */}
        {activeStep === 0 && (
          <SectionCard>
            <SectionHeader>
              <RedIcon />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030', fontFamily: 'Work Sans, sans-serif' }}>
                BASIC INFO
              </Typography>
              {/* <Typography variant="caption" sx={{ ml: 'auto', color: '#666' }}>
                Schedule For: <strong>{scheduleFor === 'Supplier' ? 'Vendor' : scheduleFor}</strong>
              </Typography> */}
            </SectionHeader>

            {/* <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                Schedule For
              </Typography>
              <MuiRadioGroup row value={scheduleFor} onChange={(e) => handleScheduleForChange(e.target.value)}>
                <FormControlLabel value="Asset" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Asset" />
                <FormControlLabel value="Service" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Service" />
                <FormControlLabel value="Supplier" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Vendor" />
                <FormControlLabel value="Training" control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} label="Training" />
              </MuiRadioGroup>
            </Box> */}

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Activity Name *"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Enter Activity Name"
                sx={fieldStyles}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
                sx={fieldStyles}
              />
            </Box>

            {/* Attachments Section */}
            <Box sx={{ mb: 3 }}>
              {/* Display existing attachments */}
              {attachments.length > 0 && (
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 2,
                  flexWrap: 'wrap'
                }}>
                  {attachments.map((attachment) => {
                    // Check if the file is an image by extension
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
                        {/* Close button */}
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
                          <Close sx={{ fontSize: 12 }} />
                        </IconButton>

                        {/* Show image preview if image, else file icon and name */}
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

              {/* Add Attachment Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RedButton
                  variant="contained"
                  onClick={addAttachment}
                  startIcon={<Add />}
                >
                  Add Attachment
                </RedButton>
              </Box>
            </Box>
          </SectionCard>
        )}

        {/* Step 2: Task */}
        {activeStep === 1 && (
          <SectionCard>
            <SectionHeader>
              <RedIcon />
              <Box>
                <Typography variant="caption" sx={{ color: '#666', display: 'block', fontSize: '12px' }}>
                  Step 2 of 3
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Work Sans, sans-serif' }}>
                  TASK
                </Typography>
              </Box>
            </SectionHeader>

            {taskSections.map((section, sectionIndex) => (
              <Box key={section.id} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                {/* Section Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Section {sectionIndex + 1}
                  </Typography>
                  {taskSections.length > 1 && (
                    <IconButton
                      onClick={() => removeTaskSection(section.id)}
                      sx={{ color: '#C72030' }}
                      size="small"
                    >
                      <Close />
                    </IconButton>
                  )}
                </Box>

                {/* Group and SubGroup Selection */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                  <FormControl fullWidth sx={fieldStyles}>
                    <InputLabel>Group</InputLabel>
                    <MuiSelect
                      value={section.tasks[0]?.group || ''}
                      label="Group"
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        section.tasks.forEach(task => {
                          handleTaskGroupChange(section.id, task.id, selectedValue);
                        });
                      }}
                    >
                      <MenuItem value="">Select Group</MenuItem>
                      {taskGroups.map((group: any) => (
                        <MenuItem key={group.id} value={group.id.toString()}>{group.name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth sx={fieldStyles}>
                    <InputLabel>SubGroup</InputLabel>
                    <MuiSelect
                      value={section.tasks[0]?.subGroup || ''}
                      label="SubGroup"
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        section.tasks.forEach(task => {
                          updateTaskInSection(section.id, task.id, 'subGroup', selectedValue);
                        });
                      }}
                      disabled={!section.tasks[0]?.group}
                    >
                      <MenuItem value="">Select Sub Group</MenuItem>
                      {section.tasks[0]?.group && taskSubGroups[section.tasks[0].group] && taskSubGroups[section.tasks[0].group].map((sg: any) => (
                        <MenuItem key={sg.id} value={sg.id.toString()}>{sg.name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </Box>

                {/* Tasks */}
                {section.tasks.map((task, taskIndex) => (
                  <Box key={task.id} sx={{ mb: 2, p: 2, backgroundColor: 'white', border: '2px dashed #E0E0E0', position: 'relative' }}>
                    {section.tasks.length > 1 && (
                      <IconButton
                        onClick={() => removeTaskFromSection(section.id, task.id)}
                        sx={{ position: 'absolute', top: 8, right: 8, color: '#C72030' }}
                        size="small"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )}

                    {/* Checkboxes */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <FormControlLabel
                        control={
                          <MuiCheckbox
                            checked={task.mandatory}
                            onChange={(e) => updateTaskInSection(section.id, task.id, 'mandatory', e.target.checked)}
                            sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                          />
                        }
                        label="Mandatory"
                      />
                      <FormControlLabel
                        control={
                          <MuiCheckbox
                            checked={task.helpText}
                            onChange={(e) => updateTaskInSection(section.id, task.id, 'helpText', e.target.checked)}
                            sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                          />
                        }
                        label="Help Text"
                      />
                      <FormControlLabel
                        control={
                          <MuiCheckbox
                            checked={task.reading}
                            onChange={(e) => updateTaskInSection(section.id, task.id, 'reading', e.target.checked)}
                            sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                          />
                        }
                        label="Reading"
                      />
                    </Box>

                    {/* Task and Input Type */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label={<span>Task{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</span>}
                        value={task.task}
                        onChange={(e) => updateTaskInSection(section.id, task.id, 'task', e.target.value)}
                        placeholder="Enter Task"
                        sx={fieldStyles}
                      />

                      <FormControl fullWidth sx={fieldStyles}>
                        <InputLabel>Input Type{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</InputLabel>
                        <MuiSelect
                          value={task.inputType}
                          label="Input Type"
                          onChange={(e) => {
                            const value = e.target.value;
                            updateTaskInSection(section.id, task.id, 'inputType', value);

                            // Reset values when changing input type
                            if (value === 'dropdown') {
                              updateTaskInSection(section.id, task.id, 'dropdownValues', [
                                { label: 'Yes', type: 'positive' },
                                { label: 'No', type: 'negative' }
                              ]);
                            } else if (value !== 'dropdown') {
                              updateTaskInSection(section.id, task.id, 'dropdownValues', [{ label: '', type: 'positive' }]);
                            }

                            if (value === 'radio') {
                              updateTaskInSection(section.id, task.id, 'radioValues', [
                                { label: 'Yes', type: 'positive' },
                                { label: 'No', type: 'negative' }
                              ]);
                            } else if (value !== 'radio') {
                              updateTaskInSection(section.id, task.id, 'radioValues', [{ label: '', type: 'positive' }]);
                            }

                            if (value === 'checkbox') {
                              updateTaskInSection(section.id, task.id, 'checkboxValues', ['Yes', 'No']);
                              updateTaskInSection(section.id, task.id, 'checkboxSelectedStates', [false, false]);
                            } else if (value !== 'checkbox') {
                              updateTaskInSection(section.id, task.id, 'checkboxValues', ['']);
                              updateTaskInSection(section.id, task.id, 'checkboxSelectedStates', [false]);
                            }

                            if (value !== 'options-inputs') {
                              updateTaskInSection(section.id, task.id, 'optionsInputsValues', ['']);
                            }
                          }}
                        >
                          <MenuItem value="">Select Input Type</MenuItem>
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="number">Numeric</MenuItem>
                          <MenuItem value="dropdown">Dropdown</MenuItem>
                          <MenuItem value="radio">Radio</MenuItem>
                          <MenuItem value="date">Date</MenuItem>
                          <MenuItem value="options-inputs">Options & Inputs</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </Box>

                    {/* Help Text */}
                    {task.helpText && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          label="Help Text (Hint)"
                          placeholder="Enter help text or hint"
                          value={task.helpTextValue}
                          onChange={(e) => updateTaskInSection(section.id, task.id, 'helpTextValue', e.target.value)}
                          sx={fieldStyles}
                        />
                      </Box>
                    )}

                    {/* Dropdown Values */}
                    {task.inputType === 'dropdown' && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{
                          backgroundColor: '#F5F5F5',
                          border: '1px solid #E0E0E0',
                          borderRadius: 0,
                          padding: 2
                        }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                            Enter Value
                          </Typography>

                          {task.dropdownValues && task.dropdownValues.map((value, valueIndex) => (
                            <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter option value"
                                value={value.label}
                                onChange={(e) => updateDropdownValue(section.id, task.id, valueIndex, e.target.value)}
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
                                  value={value.type || ''}
                                  onChange={e => updateDropdownType(section.id, task.id, valueIndex, e.target.value)}
                                >
                                  <MenuItem value="">Select Type</MenuItem>
                                  <MenuItem value="positive">P</MenuItem>
                                  <MenuItem value="negative">N</MenuItem>
                                </MuiSelect>
                              </FormControl>

                              {task.dropdownValues.length > 1 && (
                                <IconButton
                                  size="small"
                                  onClick={() => removeDropdownValue(section.id, task.id, valueIndex)}
                                  sx={{ color: '#C72030' }}
                                >
                                  <Close />
                                </IconButton>
                              )}
                            </Box>
                          ))}

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <MuiButton
                              variant="outlined"
                              size="small"
                              startIcon={<Add />}
                              onClick={() => addDropdownValue(section.id, task.id)}
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

                    {/* Radio Values */}
                    {task.inputType === 'radio' && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{
                          backgroundColor: '#F5F5F5',
                          border: '1px solid #E0E0E0',
                          borderRadius: 0,
                          padding: 2
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                              Selected
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                              Enter Value
                            </Typography>
                          </Box>

                          {task.radioValues && task.radioValues.map((value, valueIndex) => (
                            <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                              <Radio
                                checked={valueIndex === 0}
                                name={`radio-${section.id}-${task.id}`}
                                sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                              />

                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter option value"
                                value={value.label}
                                onChange={(e) => updateRadioValue(section.id, task.id, valueIndex, e.target.value)}
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
                                  value={value.type || ''}
                                  onChange={e => updateRadioType(section.id, task.id, valueIndex, e.target.value)}
                                >
                                  <MenuItem value="">Select Type</MenuItem>
                                  <MenuItem value="positive">P</MenuItem>
                                  <MenuItem value="negative">N</MenuItem>
                                </MuiSelect>
                              </FormControl>

                              {task.radioValues.length > 1 && (
                                <IconButton
                                  size="small"
                                  onClick={() => removeRadioValue(section.id, task.id, valueIndex)}
                                  sx={{ color: '#C72030' }}
                                >
                                  <Close />
                                </IconButton>
                              )}
                            </Box>
                          ))}

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <MuiButton
                              variant="outlined"
                              size="small"
                              startIcon={<Add />}
                              onClick={() => addRadioValue(section.id, task.id)}
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

                    {/* Checkbox Values */}
                    {task.inputType === 'checkbox' && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{
                          backgroundColor: '#F5F5F5',
                          border: '1px solid #E0E0E0',
                          borderRadius: 0,
                          padding: 2
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                              Selected
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                              Enter Value
                            </Typography>
                          </Box>

                          {task.checkboxValues && task.checkboxValues.map((value, valueIndex) => (
                            <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                              <MuiCheckbox
                                checked={task.checkboxSelectedStates?.[valueIndex] || false}
                                onChange={(e) => updateCheckboxSelectedState(section.id, task.id, valueIndex, e.target.checked)}
                                sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                              />

                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter option value"
                                value={value}
                                onChange={(e) => updateCheckboxValue(section.id, task.id, valueIndex, e.target.value)}
                                label={<span>Option{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</span>}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white'
                                  }
                                }}
                              />

                              {task.checkboxValues.length > 1 && (
                                <IconButton
                                  size="small"
                                  onClick={() => removeCheckboxValue(section.id, task.id, valueIndex)}
                                  sx={{ color: '#C72030' }}
                                >
                                  <Close />
                                </IconButton>
                              )}
                            </Box>
                          ))}

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <MuiButton
                              variant="outlined"
                              size="small"
                              startIcon={<Add />}
                              onClick={() => addCheckboxValue(section.id, task.id)}
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

                    {/* Options & Inputs Values */}
                    {task.inputType === 'options-inputs' && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{
                          backgroundColor: '#F5F5F5',
                          border: '1px solid #E0E0E0',
                          borderRadius: 0,
                          padding: 2
                        }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333', textAlign: 'center' }}>
                            Enter Value
                          </Typography>

                          {task.optionsInputsValues && task.optionsInputsValues.map((value, valueIndex) => (
                            <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder=""
                                value={value}
                                onChange={(e) => updateOptionsInputsValue(section.id, task.id, valueIndex, e.target.value)}
                                label={<span>Option{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</span>}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white'
                                  }
                                }}
                              />

                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#C72030',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  minWidth: 'auto'
                                }}
                                onClick={() => removeOptionsInputsValue(section.id, task.id, valueIndex)}
                              >
                                close
                              </Typography>
                            </Box>
                          ))}

                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <MuiButton
                              variant="outlined"
                              size="small"
                              startIcon={<Add />}
                              onClick={() => addOptionsInputsValue(section.id, task.id)}
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
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <MuiButton
                    variant="outlined"
                    onClick={() => addTaskToSection(section.id)}
                    startIcon={<Add />}
                    sx={{ borderColor: '#C72030', color: '#C72030', '&:hover': { borderColor: '#A01828', backgroundColor: 'rgba(199, 32, 48, 0.04)' } }}
                  >
                    Add Question
                  </MuiButton>
                </Box>
              </Box>
            ))}

            {/* Add Section Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <MuiButton
                variant="contained"
                startIcon={<Add />}
                onClick={addTaskSection}
                sx={{
                  backgroundColor: '#C72030',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#A01828'
                  }
                }}
              >
                Add Section
              </MuiButton>
            </Box>
          </SectionCard>
        )}

        {/* Step 3: Schedule Setup */}
        {activeStep === 2 && (
          <SectionCard style={{ padding: '24px', margin: 0, borderRadius: '3px' }}>
            {/* Header with icon and title */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3
            }}>
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030', textTransform: 'uppercase' }}>
                Schedule Setup
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
              {scheduleFor === 'Asset' && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Checklist Type
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <MuiRadioGroup
                      row
                      value={checklistType}
                      onChange={(e) => handleChecklistTypeChange(e.target.value)}
                    >
                      <FormControlLabel
                        value="Individual"
                        control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                        label="Individual"
                      />
                      <FormControlLabel
                        value="Asset Group"
                        control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                        label="Asset Group"
                      />
                    </MuiRadioGroup>
                  </Box>
                </Box>
              )}

              {/* Right side - Check-in with before/after photograph */}
              {/* <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: scheduleFor === 'Asset' ? 'end' : 'start', gap: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Check-in with before/after photograph
                </Typography>
                <MuiRadioGroup
                  style={{ marginTop: '-18px', marginRight: '-12px' }}
                  row
                  value={checkInPhotograph}
                  onChange={(e) => setCheckInPhotograph(e.target.value)}
                >
                  <FormControlLabel
                    value="active"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                    label="Active"
                  />
                  <FormControlLabel
                    value="inactive"
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                    label="Inactive"
                  />
                </MuiRadioGroup>
              </Box> */}
            </Box>

            <Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {/* Assign To Type Selection */}
                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Assign To <span style={{ color: 'red' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Assign To"
                      notched
                      displayEmpty
                      value={assignToType}
                      onChange={e => {
                        setAssignToType(e.target.value);
                        setSelectedUsers([]);
                        setSelectedGroups([]);
                      }}
                    >
                      <MenuItem value="">Select Assign To</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="group">Group</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </Box>

                {/* Multi-select Users - Show when assignToType is 'user' */}
                {assignToType === 'user' && (
                  <Box sx={{ minWidth: 0 }}>
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles, minWidth: 0, maxWidth: '100%' }}>
                      <InputLabel shrink>
                        Select Users <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <MuiSelect
                        multiple
                        label="Select Users"
                        notched
                        displayEmpty
                        value={selectedUsers}
                        onChange={(e) => {
                          const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                          setSelectedUsers(value);
                        }}
                        renderValue={(selected) => {
                          if (!selected || selected.length === 0) {
                            return <span style={{ color: '#aaa' }}>Select Users</span>;
                          }
                          const names = users
                            .filter(user => selected.includes(user.id.toString()))
                            .map(user => user.full_name)
                            .join(', ');
                          return (
                            <span title={names} style={{ display: 'inline-block', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {names}
                            </span>
                          );
                        }}
                        disabled={loading.users}
                        sx={{ minWidth: 0, maxWidth: '100%', width: '100%', '& .MuiSelect-select': { display: 'block', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }}
                        MenuProps={{ PaperProps: { style: { minWidth: 200, maxWidth: 520, width: 'auto' } } }}
                      >
                        <MenuItem value="">Select Users</MenuItem>
                        {users && users.map((option) => (
                          <MenuItem key={option.id} value={option.id.toString()}>{option.full_name}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </Box>
                )}

                {/* Multi-select Groups - Show when assignToType is 'group' */}
                {assignToType === 'group' && (
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Select Groups <span style={{ color: 'red' }}>*</span></InputLabel>
                    <MuiSelect
                      multiple
                      label="Select Groups"
                      notched
                      displayEmpty
                      value={selectedGroups}
                      onChange={(e) => {
                        const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                        setSelectedGroups(value);
                      }}
                      renderValue={(selected) => {
                        if (!selected || selected.length === 0) {
                          return <span style={{ color: '#aaa' }}>Select Groups</span>;
                        }
                        return groups
                          .filter(group => selected.includes(group.id.toString()))
                          .map(group => group.name)
                          .join(', ');
                      }}
                      disabled={loading.groups}
                    >
                      <MenuItem value="">Select Groups</MenuItem>
                      {groups.map((group) => (
                        <MenuItem key={group.id} value={group.id.toString()}>
                          {group.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                    {loading.groups && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                        Loading groups...
                      </Typography>
                    )}
                  </FormControl>
                )}

                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Backup Assignee <span style={{ color: 'red' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Backup Assignee"
                      notched
                      displayEmpty
                      value={backupAssignee}
                      onChange={e => setBackupAssignee(e.target.value)}
                    >
                      <MenuItem value="">Select Backup Assignee</MenuItem>
                      {users && users.map((option) => (
                        <MenuItem key={option.id} value={option.id.toString()}>{option.full_name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  {loading.users && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading users...
                    </Typography>
                  )}
                </Box>

                {/* Plan Duration with conditional input */}
                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Plan Duration <span style={{ color: 'red' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Plan Duration"
                      notched
                      displayEmpty
                      value={planDuration}
                      onChange={e => {
                        setPlanDuration(e.target.value);
                        setPlanDurationValue('');
                      }}
                    >
                      <MenuItem value="">Select Plan Duration</MenuItem>
                      <MenuItem value="minutes">Minutes</MenuItem>
                      <MenuItem value="hour">Hour</MenuItem>
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="week">Week</MenuItem>
                      <MenuItem value="month">Month</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </Box>

                {/* Plan Duration Value Input - Show when duration type is selected */}
                {needsValueInput(planDuration) && (
                  <TextField
                    label={<span>Plan Duration ({planDuration}) <span style={{ color: 'red' }}>*</span></span>}
                    type="number"
                    fullWidth
                    value={planDurationValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (Number(value) < 0) return;
                      setPlanDurationValue(value);
                    }}
                    placeholder={`Enter number of ${planDuration}`}
                    inputProps={{ min: 0, onWheel: (e) => (e.target as HTMLInputElement).blur() }}
                  />
                )}

                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Email Trigger Rule</InputLabel>
                    <MuiSelect
                      label="Email Trigger Rule"
                      notched
                      displayEmpty
                      value={emailTriggerRule}
                      onChange={e => setEmailTriggerRule(e.target.value)}
                      disabled={loading.emailRules}
                    >
                      <MenuItem value="">Select Email Trigger Rule</MenuItem>
                      {emailRules.map(rule => (
                        <MenuItem key={rule.id} value={rule.id.toString()}>{rule.rule_name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  {loading.emailRules && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading email rules...
                    </Typography>
                  )}
                </Box>

                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Category <span style={{ color: 'red' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Category"
                      notched
                      displayEmpty
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      <MenuItem value="Technical">Technical</MenuItem>
                      <MenuItem value="Non Technical">Non-Technical</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </Box>

                {/* Submission Time with conditional input */}
                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Submission Time</InputLabel>
                    <MuiSelect
                      label="Submission Time"
                      notched
                      displayEmpty
                      value={submissionTime}
                      onChange={e => {
                        setSubmissionTime(e.target.value);
                        setSubmissionTimeValue('');
                      }}
                    >
                      <MenuItem value="">Select Submission Time</MenuItem>
                      <MenuItem value="minutes">Minutes</MenuItem>
                      <MenuItem value="hour">Hour</MenuItem>
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="week">Week</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </Box>

                {/* Submission Time Value Input - Show when time type is selected */}
                {needsValueInput(submissionTime) && (
                  <TextField
                    label={<span>Submission Time ({submissionTime}) <span style={{ color: 'red' }}>*</span></span>}
                    type="number"
                    fullWidth
                    value={submissionTimeValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (Number(value) < 0) return;
                      setSubmissionTimeValue(value);
                    }}
                    inputProps={{ min: 0, onWheel: (e) => (e.target as HTMLInputElement).blur() }}
                    placeholder={`Enter number of ${submissionTime}`}
                  />
                )}

                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Supervisors </InputLabel>
                    <MuiSelect
                      label="Supervisors"
                      notched
                      displayEmpty
                      value={supervisors}
                      onChange={e => setSupervisors(e.target.value)}
                      disabled={loading.users}
                    >
                      <MenuItem value="">Select Supervisors</MenuItem>
                      {users && users.map(user => (
                        <MenuItem key={user.id} value={user.id.toString()}>{user.full_name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  {loading.users && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading users...
                    </Typography>
                  )}
                </Box>

                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Lock Overdue Task <span style={{ color: 'red' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Lock Overdue Task"
                      notched
                      displayEmpty
                      value={lockOverdueTask}
                      onChange={e => setLockOverdueTask(e.target.value)}
                    >
                      <MenuItem value="">Select Lock Status</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </Box>

                {/* Grace Time with conditional input */}
                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Grace Time <span style={{ color: 'red' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Grace Time"
                      notched
                      displayEmpty
                      value={graceTime}
                      onChange={e => {
                        setGraceTime(e.target.value);
                        setGraceTimeValue('');
                      }}
                    >
                      <MenuItem value="">Select Grace Time</MenuItem>
                      <MenuItem value="minutes">Minutes</MenuItem>
                      <MenuItem value="hour">Hour</MenuItem>
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="week">Week</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </Box>

                {/* Grace Time Value Input - Show when time type is selected */}
                {needsValueInput(graceTime) && (
                  <TextField
                    label={<span>Grace Time ({graceTime}) <span style={{ color: 'red' }}>*</span></span>}
                    type="number"
                    fullWidth
                    value={graceTimeValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (Number(value) < 0) return;
                      setGraceTimeValue(value);
                    }}
                    inputProps={{ min: 0, onWheel: (e) => (e.target as HTMLInputElement).blur() }}
                    placeholder={`Enter number of ${graceTime}`}
                  />
                )}

                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Supplier </InputLabel>
                    <MuiSelect
                      label="Supplier"
                      notched
                      displayEmpty
                      value={supplier}
                      onChange={e => setSupplier(e.target.value)}
                      disabled={loading.suppliers}
                    >
                      <MenuItem value="">Select Supplier</MenuItem>
                      {suppliers && suppliers.map(supplier => (
                        <MenuItem key={supplier.id} value={supplier.id.toString()}>{supplier.name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  {loading.suppliers && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading suppliers...
                    </Typography>
                  )}
                </Box>

                <Box>
                  <TextField
                    label={<span>Start Date <span style={{ color: 'red' }}>*</span></span>}
                    id="startFrom"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={startFrom}
                    onChange={e => setStartFrom(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                    placeholder="Select Start Date"
                    inputProps={{ max: endAt || undefined }}
                  />
                </Box>

                <Box>
                  <TextField
                    label={<span>End Date <span style={{ color: 'red' }}>*</span></span>}
                    id="endAt"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={endAt}
                    onChange={e => setEndAt(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                    placeholder="Select End Date"
                    inputProps={{ min: startFrom || undefined }}
                    error={Boolean(startFrom && endAt && endAt < startFrom)}
                    helperText={
                      startFrom && endAt && endAt < startFrom
                        ? "End date cannot be before start date"
                        : ""
                    }
                  />
                </Box>
              </Box>
            </Box>
          </SectionCard>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <DraftButton
            variant="contained"
            onClick={() => {
              toast.success('Draft saved');
              navigate(-1);
            }}
          >
            Save to Draft
          </DraftButton>
          <RedButton
            variant="contained"
            onClick={activeStep === 2 ? handleSubmit : handleNext}
          >
            {activeStep === 2 ? 'Proceed to Save' : 'Proceed to Save'}
          </RedButton>
        </Box>
      </Box>
    </Box>
  );
};
