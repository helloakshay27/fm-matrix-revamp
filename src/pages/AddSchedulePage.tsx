import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { MappingStep } from '@/components/schedule/MappingStep';
import { TimeSetupStep } from '@/components/schedule/TimeSetupStep'
import { format } from 'date-fns';
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
  Tabs,
  Tab,
  IconButton,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button as MuiButton,
  Switch as MuiSwitch,
  StepConnector,
  styled,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Autocomplete,
} from '@mui/material';
import {
  Settings,
  Edit,
  Add,
  Close,
  AttachFile,
  ArrowBack
} from '@mui/icons-material';
import { Cog, ArrowLeft } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { assetService, Asset, AssetGroup, AssetSubGroup, EmailRule, User, Supplier } from '../services/assetService';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { MuiSearchableDropdown } from '@/components/MuiSearchableDropdown';
import { log } from 'console';

// Styled Components
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#E0E0E0',
    borderTopWidth: 2,
    borderStyle: 'dotted',
  },
}));

const CustomStep = styled(Step)(({ theme }) => ({
  '& .MuiStepLabel-root .Mui-completed': {
    color: '#C72030',
  },
  '& .MuiStepLabel-root .Mui-active': {
    color: '#C72030',
  },
  '& .MuiStepLabel-label': {
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'Work Sans, sans-serif',
  },
}));

const RedButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#C72030',
  color: 'white',
  borderRadius: 0,
  textTransform: 'none',
  padding: '8px 16px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  boxShadow: '0 2px 4px rgba(199, 32, 48, 0.2)',
  '&:hover': {
    backgroundColor: '#B8252F',
    boxShadow: '0 4px 8px rgba(199, 32, 48, 0.3)',
  },
}));

const DraftButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#f6f4ee',
  color: '#C72030',
  borderRadius: 0,
  textTransform: 'none',
  padding: '8px 16px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#f0ebe0',
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  borderRadius: 0,
  overflow: 'hidden',
  marginBottom: '24px',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
}));

const RedIcon = styled(Settings)(({ theme }) => ({
  color: '#D42F2F',
  backgroundColor: '#D42F2F',
  borderRadius: '50%',
  padding: '8px',
  fontSize: '32px',
}));

const fieldStyles = {
  height: '40px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '40px',
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

interface AttachmentFile {
  id: string;
  name: string;
  url: string;
  content: string; // base64 content
  content_type: string; // MIME type
}

interface TaskQuestion {
  id: string;
  group: string;
  subGroup: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  helpText: boolean;
  helpTextValue: string;
  helpTextAttachments?: AttachmentFile[]; // Add help text attachments
  autoTicket: boolean;
  weightage: string;
  rating: boolean;
  reading: boolean;
  dropdownValues: Array<{ label: string, type: string }>;
  radioValues: Array<{ label: string, type: string }>;
  checkboxValues: string[];
  checkboxSelectedStates: boolean[];
  optionsInputsValues: string[];
}

interface QuestionSection {
  id: string;
  title: string;
  tasks: TaskQuestion[];
  autoTicket: boolean; // Add auto ticket state for each section
  ticketLevel: string;
  ticketAssignedTo: string;
  ticketCategory: string;
}

// Add interface for checklist mappings
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

export const AddSchedulePage = () => {
  const navigate = useNavigate();

  // Stepper state
  const [customCode, setCustomCode] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const steps = ['Basic Configuration', 'Schedule Setup', 'Question Setup', 'Time Setup', 'Mapping'];

  // Form data
  const [formData, setFormData] = useState({
    // Basic Configuration
    type: 'PPM',
    scheduleFor: 'Asset',
    activityName: '',
    description: '',

    // Schedule Setup
    checklistType: 'Individual',
    asset: [],
    service: [],
    assetGroup: '',
    assetSubGroup: [],
    assignTo: '',
    assignToType: 'user', // 'user' or 'group'
    selectedUsers: [],
    selectedGroups: [],
    backupAssignee: '',
    planDuration: '',
    planDurationValue: '',
    emailTriggerRule: '',
    scanType: '',
    category: '',
    submissionTime: '',
    submissionTimeValue: '',
    supervisors: '',
    lockOverdueTask: '',
    frequency: '',
    graceTime: '',
    graceTimeValue: '',
    endAt: '',
    supplier: '',
    startFrom: '',

    // Mapping
    mappings: [],

    // New fields for toggles
    selectedTemplate: '',
    ticketLevel: 'checklist', // 'checklist' or 'question'
    ticketAssignedTo: '',
    ticketCategory: '',
  });

  // Question Setup - Replace tasks state with sections
  const [questionSections, setQuestionSections] = useState<QuestionSection[]>([
    {
      id: '1',
      title: 'Questions',
      autoTicket: false,
      ticketLevel: 'checklist',
      ticketAssignedTo: '',
      ticketCategory: '',
      tasks: [
        {
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
        }
      ]
    }
  ]);

  // Time Setup - Replace static state with dynamic state
  const [timeSetupData, setTimeSetupData] = useState({
    hourMode: 'specific',
    minuteMode: 'specific',
    dayMode: 'weekdays',
    monthMode: 'all',
    selectedHours: ['12'],
    selectedMinutes: ['00'],
    selectedWeekdays: [],
    selectedDays: [],
    selectedMonths: [],
    betweenMinuteStart: '00',
    betweenMinuteEnd: '59',
    betweenMonthStart: 'January',
    betweenMonthEnd: 'December'
  });

  // Attachments
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

  // Toggles
  const [createNew, setCreateNew] = useState(false);
  const [weightage, setWeightage] = useState(false);
  const [autoTicket, setAutoTicket] = useState(false); // Keep existing autoTicket

  // Asset dropdown state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>([]);
  const [assetSubGroups, setAssetSubGroups] = useState<AssetSubGroup[]>([]);
  const [selectedAssetGroup, setSelectedAssetGroup] = useState<number | undefined>();
  const [emailRules, setEmailRules] = useState<EmailRule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [helpdeskCategories, setHelpdeskCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [editingStep, setEditingStep] = useState<number | null>(null);
  // Add task groups state
  const [taskGroups, setTaskGroups] = useState<any[]>([]);
  const [taskSubGroups, setTaskSubGroups] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState({
    assets: false,
    groups: false,
    subGroups: false,
    emailRules: false,
    users: false,
    suppliers: false,
    templates: false,
    helpdeskCategories: false,
    services: false,
    taskGroups: false,
    taskSubGroups: false
  });

  // Add checklist mappings state
  const [checklistMappings, setChecklistMappings] = useState<ChecklistMappingsData | null>(null);
  const [loadingMappings, setLoadingMappings] = useState(false);

  // Add validation states - changed to field-level errors
  const [fieldErrors, setFieldErrors] = useState<{ [fieldName: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // LocalStorage keys
  const STORAGE_KEYS = {
    FORM_DATA: 'addSchedule_formData',
    QUESTION_SECTIONS: 'addSchedule_questionSections',
    TIME_SETUP_DATA: 'addSchedule_timeSetupData',
    ACTIVE_STEP: 'addSchedule_activeStep',
    COMPLETED_STEPS: 'addSchedule_completedSteps',
    ATTACHMENTS: 'addSchedule_attachments'
  };

  // Save to localStorage
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Load from localStorage
  const loadFromLocalStorage = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  };

  // Clear specific step data from localStorage and reset to default values
  const clearStepFromLocalStorage = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Basic Configuration step
        // Clear only basic configuration related form data
        const savedFormData = loadFromLocalStorage(STORAGE_KEYS.FORM_DATA);
        if (savedFormData) {
          const resetFormData = {
            ...savedFormData,
            // Reset only Basic Configuration fields
            type: 'PPM',
            scheduleFor: 'Asset',
            activityName: '',
            description: '',
            selectedTemplate: ''
          };
          setFormData(resetFormData);
          saveToLocalStorage(STORAGE_KEYS.FORM_DATA, resetFormData);
        }
        break;

      case 1: // Schedule Setup step
        // Clear only schedule setup related form data
        const savedFormDataSchedule = loadFromLocalStorage(STORAGE_KEYS.FORM_DATA);
        if (savedFormDataSchedule) {
          const resetFormData = {
            ...savedFormDataSchedule,
            // Reset only Schedule Setup fields
            checklistType: 'Individual',
            asset: [],
            service: [],
            assetGroup: '',
            assetSubGroup: [],
            assignTo: '',
            assignToType: 'user',
            selectedUsers: [],
            selectedGroups: [],
            backupAssignee: '',
            planDuration: '',
            planDurationValue: '',
            emailTriggerRule: '',
            scanType: '',
            category: '',
            submissionTime: '',
            submissionTimeValue: '',
            supervisors: '',
            lockOverdueTask: '',
            frequency: '',
            graceTime: '',
            graceTimeValue: '',
            endAt: '',
            supplier: '',
            startFrom: '',
            mappings: [],
            ticketLevel: 'checklist',
            ticketAssignedTo: '',
            ticketCategory: ''
          };
          setFormData(resetFormData);
          saveToLocalStorage(STORAGE_KEYS.FORM_DATA, resetFormData);
        }
        // Reset asset group selection
        setSelectedAssetGroup(undefined);
        setAssetSubGroups([]);
        break;

      case 2: // Question Setup step
        localStorage.removeItem(STORAGE_KEYS.QUESTION_SECTIONS);
        // Reset question sections to default
        setQuestionSections([
          {
            id: '1',
            title: 'Questions',
            autoTicket: false,
            ticketLevel: 'checklist',
            ticketAssignedTo: '',
            ticketCategory: '',
            tasks: [
              {
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
              }
            ]
          }
        ]);
        break;

      case 3: // Time Setup step
        localStorage.removeItem(STORAGE_KEYS.TIME_SETUP_DATA);
        // Reset time setup data to default
        setTimeSetupData({
          hourMode: 'specific',
          minuteMode: 'specific',
          dayMode: 'weekdays',
          monthMode: 'all',
          selectedHours: ['12'],
          selectedMinutes: ['00'],
          selectedWeekdays: [],
          selectedDays: [],
          selectedMonths: [],
          betweenMinuteStart: '00',
          betweenMinuteEnd: '59',
          betweenMonthStart: 'January',
          betweenMonthEnd: 'December'
        });
        break;

      case 4: // Mapping step
        // Clear attachments for mapping step
        localStorage.removeItem(STORAGE_KEYS.ATTACHMENTS);
        setAttachments([]);
        break;

      default:
        break;
    }
  };

  // Clear all form data from localStorage
  const clearAllFromLocalStorage = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  };

  // Initialize component with localStorage data or clear current step if refreshed on that step
  useEffect(() => {
    // Always clear local storage and reset to basic configuration if page is refreshed or browser back button is clicked
    const resetState = () => {
      clearAllFromLocalStorage();
      setActiveStep(0);
      setCompletedSteps([]);
      setFormData({
        type: 'PPM',
        scheduleFor: 'Asset',
        activityName: '',
        description: '',
        checklistType: 'Individual',
        asset: [],
        service: [],
        assetGroup: '',
        assetSubGroup: [],
        assignTo: '',
        assignToType: 'user',
        selectedUsers: [],
        selectedGroups: [],
        backupAssignee: '',
        planDuration: '',
        planDurationValue: '',
        emailTriggerRule: '',
        scanType: '',
        category: '',
        submissionTime: '',
        submissionTimeValue: '',
        supervisors: '',
        lockOverdueTask: '',
        frequency: '',
        graceTime: '',
        graceTimeValue: '',
        endAt: '',
        supplier: '',
        startFrom: '',
        mappings: [],
        selectedTemplate: '',
        ticketLevel: 'checklist',
        ticketAssignedTo: '',
        ticketCategory: '',
      });
      setQuestionSections([
        {
          id: '1',
          title: 'Questions',
          autoTicket: false,
          ticketLevel: 'checklist',
          ticketAssignedTo: '',
          ticketCategory: '',
          tasks: [
            {
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
            }
          ]
        }
      ]);
      setTimeSetupData({
        hourMode: 'specific',
        minuteMode: 'specific',
        dayMode: 'weekdays',
        monthMode: 'all',
        selectedHours: ['12'],
        selectedMinutes: ['00'],
        selectedWeekdays: [],
        selectedDays: [],
        selectedMonths: [],
        betweenMinuteStart: '00',
        betweenMinuteEnd: '59',
        betweenMonthStart: 'January',
        betweenMonthEnd: 'December'
      });
      setAttachments([]);
    };

    // Reset state on mount
    resetState();

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', resetState);

    // Optionally, listen for page reload (F5, Ctrl+R)
    window.addEventListener('beforeunload', resetState);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('popstate', resetState);
      window.removeEventListener('beforeunload', resetState);
    };
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.FORM_DATA, formData);
  }, [formData]);

  // Save question sections to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.QUESTION_SECTIONS, questionSections);
  }, [questionSections]);

  // Save time setup data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.TIME_SETUP_DATA, timeSetupData);
  }, [timeSetupData]);

  // Save active step to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ACTIVE_STEP, activeStep);
  }, [activeStep]);

  // Save completed steps to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.COMPLETED_STEPS, completedSteps);
  }, [completedSteps]);

  // Save attachments to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ATTACHMENTS, attachments);
  }, [attachments]);

  // Load data on component mount
  useEffect(() => {
    // Check URL parameters to set both scheduleFor and type
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');

    // Define valid types for radio group
    const validRadioTypes = ['AMC', 'Preparedness', 'Hoto', 'Routine', 'Audit'];
    const validScheduleTypes = ['Asset', 'Service'];

    // Handle scheduleFor based on Asset/Service
    if (validScheduleTypes.includes(typeParam)) {
      if (typeParam === 'Asset') {
        setFormData(prev => ({ ...prev, scheduleFor: 'Asset' }));
        loadAssets();
      } else if (typeParam === 'Service') {
        setFormData(prev => ({ ...prev, scheduleFor: 'Service' }));
        loadServices();
      }
    }
    // Handle type radio group selection based on URL parameter
    else if (validRadioTypes.includes(typeParam)) {
      setFormData(prev => ({ ...prev, type: typeParam }));
      // Default to Asset for scheduleFor when type is radio type
      setFormData(prev => ({ ...prev, scheduleFor: 'Asset' }));
      loadAssets();
    }
    // Default case
    else {
      setFormData(prev => ({ ...prev, scheduleFor: 'Asset' }));
      loadAssets();
    }

    loadAssetGroups();
    loadEmailRules();
    loadUsers();
    loadSuppliers();
    loadGroups();
    loadTemplates();
    loadHelpdeskCategories();
    loadTaskGroups();
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
    // console.log('Starting to load assets...'); 
    setLoading(prev => ({ ...prev, assets: true }));
    try {
      const data = await assetService.getAssets();
      // console.log('Assets loaded successfully:', data);
      setAssets(data);
    } catch (error) {
      console.error('Failed to load assets:', error);
      toast.error("Failed to load assets. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, assets: false }));
    }
  };

  const loadAssetGroups = async () => {
    // console.log('Starting to load asset groups...');
    setLoading(prev => ({ ...prev, groups: true }));
    try {
      const data = await assetService.getAssetGroups();
      // console.log('Asset groups loaded successfully:', data);
      setAssetGroups(data.asset_groups);
    } catch (error) {
      console.error('Failed to load asset groups:', error);
      toast.error("Failed to load asset groups. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };

  const loadAssetSubGroups = async (groupId: number) => {
    // console.log('Loading sub-groups for group ID:', groupId);
    setLoading(prev => ({ ...prev, subGroups: true }));
    try {
      const data = await assetService.getAssetSubGroups(groupId);
      // console.log('Sub-groups loaded successfully:', data);
      setAssetSubGroups(data.asset_groups);
    } catch (error) {
      console.error('Failed to load asset sub-groups:', error);
      toast.error("Failed to load asset sub-groups. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, subGroups: false }));
    }
  };

  const loadEmailRules = async () => {
    // console.log('Starting to load email rules...');
    setLoading(prev => ({ ...prev, emailRules: true }));
    try {
      const data = await assetService.getEmailRules();
      // console.log('Email rules loaded successfully:', data);
      setEmailRules(data);
    } catch (error) {
      console.error('Failed to load email rules:', error);
      toast.error("Failed to load email rules. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, emailRules: false }));
    }
  };

  const loadUsers = async () => {
    // console.log('Starting to load users...');
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
      // console.log('Users loaded successfully:', data);

      // Extract users array from response
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error("Failed to load users. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
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

  const loadSuppliers = async () => {
    // console.log('Starting to load suppliers...');
    setLoading(prev => ({ ...prev, suppliers: true }));
    try {
      const data = await assetService.getSuppliers();
      // console.log('Suppliers loaded successfully:', data);
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
      toast.error("Failed to load suppliers. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  };

  const loadServices = async () => {
    // console.log('Starting to load services...');
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
      // console.log('Services loaded successfully:', data);
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error("Failed to load services. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  const loadGroups = async () => {
    // console.log('Starting to load user groups...');
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
      // console.log('User groups loaded successfully:', data);

      // Extract only id and name from the groups array
      const groupsArray = data.map((group: any) => ({
        id: group.id,
        name: group.name
      }));
      console.log('Extracted groups:', groupsArray);


      setGroups(groupsArray);
    } catch (error) {
      console.error('Failed to load user groups:', error);
      toast.error("Failed to load user groups. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
      // Keep mock data as fallback
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

  const loadTemplates = async () => {
    // console.log('Starting to load templates...');
    setLoading(prev => ({ ...prev, templates: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/custom_forms/get_templates.json`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const templateData = await response.json();
      // console.log('Templates loaded successfully:', templateData);
      setTemplates(templateData);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error("Failed to load templates. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
      // Keep mock data as fallback
      const mockTemplates = [
        { id: 1, form_name: 'Safety Inspection Template' },
        { id: 2, form_name: 'Equipment Maintenance Template' },
        { id: 3, form_name: 'Daily Checklist Template' }
      ];
      setTemplates(mockTemplates);
    } finally {
      setLoading(prev => ({ ...prev, templates: false }));
    }
  };

  const loadHelpdeskCategories = async () => {
    // console.log('Starting to load helpdesk categories...', API_CONFIG.BASE_URL);
    setLoading(prev => ({ ...prev, helpdeskCategories: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HELPDESK_CATEGORIES}`, {
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
      toast.error("Error: Failed to load helpdesk categories. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
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

  const loadTaskGroups = async () => {
    setLoading(prev => ({ ...prev, taskGroups: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_GROUPS}`, {
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

      // Extract only id and name from the groups array
      const groupsArray = data.map((group: any) => ({
        id: group.id,
        name: group.name
      }));

      setTaskGroups(groupsArray);
    } catch (error) {
      console.error('Failed to load task groups:', error);
      toast.error("Failed to load task groups. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
      // Keep mock data as fallback
      const mockTaskGroups = [
        { id: 1, name: 'Safety' },
        { id: 2, name: 'Maintenance' },
        { id: 3, name: 'Operations' }
      ];
      setTaskGroups(mockTaskGroups);
    } finally {
      setLoading(prev => ({ ...prev, taskGroups: false }));
    }
  };

  const loadTaskSubGroups = async (groupId: string) => {
    if (!groupId) return;

    setLoading(prev => ({ ...prev, taskSubGroups: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASK_SUB_GROUPS}?group_id=${groupId}`, {
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

      // Extract only id and name from the asset_groups array
      const subGroupsArray = (data.asset_groups || []).map((subGroup: any) => ({
        id: subGroup.id,
        name: subGroup.name
      }));

      // Store sub-groups by group ID
      setTaskSubGroups(prev => ({
        ...prev,
        [groupId]: subGroupsArray
      }));
    } catch (error) {
      console.error('Failed to load task sub-groups:', error);
      toast.error("Failed to load task sub-groups. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
      // Keep mock data as fallback
      const mockSubGroups = [
        { id: 1, name: 'Equipment' },
        { id: 2, name: 'Cleaning' },
        { id: 3, name: 'Inspection' }
      ];
      setTaskSubGroups(prev => ({
        ...prev,
        [groupId]: mockSubGroups
      }));
    } finally {
      setLoading(prev => ({ ...prev, taskSubGroups: false }));
    }
  };

  const handleTaskGroupChange = (sectionId: string, taskId: string, groupId: string) => {
    // Update the task group
    updateTaskInSection(sectionId, taskId, 'group', groupId);
    // Clear the sub-group selection
    updateTaskInSection(sectionId, taskId, 'subGroup', '');
    // Load sub-groups for the selected group
    if (groupId) {
      loadTaskSubGroups(groupId);
    }
  };

  // Move updateTaskInSection to component level scope
  const updateTaskInSection = (sectionId: string, taskId: string, key: keyof TaskQuestion, value: any): void => {
    setQuestionSections(prevSections =>
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

  // Also move other section helper functions to component level
  const updateSectionProperty = (id: string, key: keyof QuestionSection, value: any): void => {
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === id
          ? { ...section, [key]: value }
          : section
      )
    );
  };

  // Add attachment function for help text
  const addHelpTextAttachment = (sectionId: string, taskId: string): void => {
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
                resolve(result); // Keep full data URL for content
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
          // Update the specific task's help text attachments
          setQuestionSections(prevSections =>
            prevSections.map(section =>
              section.id === sectionId
                ? {
                  ...section,
                  tasks: section.tasks.map(task =>
                    task.id === taskId
                      ? {
                        ...task,
                        helpTextAttachments: [...(task.helpTextAttachments || []), ...newAttachments]
                      }
                      : task
                  )
                }
                : section
            )
          );

          toast.success(`${newAttachments.length} file(s) attached to help text successfully!`, {
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
      toast.error("Failed to attach files. Please try again.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    };

    document.body.appendChild(input);
    input.click();
    input.remove();
  };

  // Remove help text attachment function
  const removeHelpTextAttachment = (sectionId: string, taskId: string, attachmentId: string): void => {
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  helpTextAttachments: (task.helpTextAttachments || []).filter(att => att.id !== attachmentId)
                }
                : task
            )
          }
          : section
      )
    );
  };

  // Add attachment function
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
                // Extract base64 content (remove data:type;base64, prefix)
                const base64 = result.split(',')[1];
                resolve(result); // Keep full data URL for content
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
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    };

    document.body.appendChild(input);
    input.click();
    // Clean up after selection
    input.remove();
  };

  const addQuestionSection = (): void => {
    setQuestionSections(prevSections => [
      ...prevSections,
      {
        id: (Date.now() + Math.random()).toString(),
        title: `Section ${prevSections.length + 1}`,
        autoTicket: false,
        ticketLevel: 'checklist',
        ticketAssignedTo: '',
        ticketCategory: '',
        tasks: [
          {
            id: (Date.now() + Math.random()).toString(),
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
            checkboxSelectedStates: [false], // Add initial checkbox state
            optionsInputsValues: ['']
          }
        ]
      }
    ]);
  };

  const removeQuestionSection = (sectionId: string): void => {
    setQuestionSections(prevSections => prevSections.filter(section => section.id !== sectionId));
  };

  const removeTaskFromSection = (sectionId: string, taskId: string): void => {
    setQuestionSections(prevSections =>
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

  // Helper functions for managing dropdown values
  const updateDropdownValue = (sectionId: string, taskId: string, valueIndex: number, value: string) => {
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  dropdownValues: task.dropdownValues.map((val, idx) =>
                    idx === valueIndex ? { ...val, label: value } : val
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
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  dropdownValues: task.dropdownValues.map((val, idx) =>
                    idx === valueIndex ? { ...val, type } : val
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
    setQuestionSections(prevSections =>
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

  const updateRadioValue = (sectionId: string, taskId: string, valueIndex: number, value: string) => {
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  radioValues: task.radioValues.map((val, idx) =>
                    idx === valueIndex ? { ...val, label: value } : val
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
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  radioValues: task.radioValues.map((val, idx) =>
                    idx === valueIndex ? { ...val, type } : val
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
    setQuestionSections(prevSections =>
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

  const removeDropdownValue = (sectionId: string, taskId: string, valueIndex: number) => {
    setQuestionSections(prevSections =>
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
  };

  const removeRadioValue = (sectionId: string, taskId: string, valueIndex: number) => {
    setQuestionSections(prevSections =>
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
  };

  // Add helper functions for checkbox values
  const addCheckboxValue = (sectionId: string, taskId: string): void => {
    setQuestionSections(prevSections =>
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

  const updateCheckboxValue = (sectionId: string, taskId: string, valueIndex: number, value: string): void => {
    setQuestionSections(prevSections =>
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
  };

  const updateCheckboxSelectedState = (sectionId: string, taskId: string, valueIndex: number, checked: boolean): void => {
    setQuestionSections(prevSections =>
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
  };

  const removeCheckboxValue = (sectionId: string, taskId: string, valueIndex: number): void => {
    setQuestionSections(prevSections =>
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
  };

  // Add helper functions for options & inputs values
  const addOptionsInputsValue = (sectionId: string, taskId: string): void => {
    setQuestionSections(prevSections =>
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
  };

  const updateOptionsInputsValue = (sectionId: string, taskId: string, valueIndex: number, value: string): void => {
    setQuestionSections(prevSections =>
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
  };

  const removeOptionsInputsValue = (sectionId: string, taskId: string, valueIndex: number): void => {
    setQuestionSections(prevSections =>
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
  };

  const updateSectionTitle = (id: string, value: string): void => {
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === id
          ? { ...section, title: value }
          : section
      )
    );
  };

  const addTaskToSection = (id: string): void => {
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === id
          ? {
            ...section,
            tasks: [
              ...section.tasks,
              {
                id: (Date.now() + Math.random()).toString(),
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
                checkboxSelectedStates: [false], // Add initial checkbox state
                optionsInputsValues: ['']
              }
            ]
          }
          : section
      )
    );
  };

  // Helper function to map API input types to our input types
  const mapInputType = (apiType: string): string => {
    const typeMapping: { [key: string]: string } = {
      'radio-group': 'radio',
      'select': 'dropdown',
      'text': 'text',
      'number': 'number',
      'checkbox-group': 'checkbox',
      'textarea': 'text',
      'date': 'date'
    };
    return typeMapping[apiType] || 'text';
  };

  // Helper function to map checklist_for to scheduleFor
  const mapChecklistFor = (checklistFor: string | null | undefined): string => {
    const value = checklistFor ?? '';
    if (value.includes('Service')) return 'Service';
    if (value.includes('Asset')) return 'Asset';
    if (value.includes('Supplier')) return 'Supplier';
    if (value.includes('Training')) return 'Training';
    return 'Asset'; // default
  };


  const handleSave = async () => {

    // Validate current step first
    if (!validateCurrentStep()) {
      toast.error("Please fill all required fields before proceeding.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
      return;
    }

    // Show success message for the current step completion
    const stepMessages = {
      0: "Basic Configuration saved successfully!",
      1: "Schedule Setup saved successfully!",
      2: "Question Setup saved successfully!",
      3: "Time Setup saved successfully!",
      4: "Mapping saved successfully!"
    };

    if (stepMessages[activeStep as keyof typeof stepMessages]) {
      toast.success(stepMessages[activeStep as keyof typeof stepMessages], {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    }

    setIsSubmitting(true);

    try {
      const payload = buildAPIPayload();
      console.log('Submitting payload:', payload);

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

      const result = await response.json();
      setCustomCode(result.custom_form_code);

      toast.success("Checklist is scheduled successfully!", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });

      // Check if any task has reading checkbox selected
      const hasReadingTasks = questionSections.some(section =>
        section.tasks.some(task => task.reading)
      );

      if (hasReadingTasks) {
        // Fetch checklist mappings when moving to mapping step
        if (result?.custom_form_code) {
          const mappingsData = await (async () => {
            try {
              const response = await fetch(`${API_CONFIG.BASE_URL}/pms/custom_forms/checklist_mappings.json?id=${result.custom_form_code}`, {
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
              setChecklistMappings(data);
              return data;
            } catch (error) {
              console.error('Failed to load checklist mappings:', error);
              toast.error("Failed to load checklist mappings.", {
                position: 'top-right',
                duration: 4000,
                style: {
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                },
              });
              return null;
            }
          })();

          // If mappingsData exists and all assets' measures arrays are empty, skip mapping
          if (
            mappingsData &&
            Array.isArray(mappingsData.assets) &&
            mappingsData.assets.length > 0 &&
            mappingsData.assets.every((asset: any) => Array.isArray(asset.measures) && asset.measures.length === 0)
          ) {
            clearAllFromLocalStorage();
            navigate('/maintenance/schedule');
            return;
          }
        }

        // Move to next step (Mapping) after successful submission
        if (activeStep < steps.length - 1) {
          setActiveStep(activeStep + 1);
          setCompletedSteps([...completedSteps, activeStep]);
        }
      } else {
        // No reading tasks found, skip mapping and navigate directly to schedule list
        clearAllFromLocalStorage(); // Clear all saved data on successful completion
        navigate('/maintenance/schedule');
      }

    } catch (error) {
      console.error('Failed to create schedule:', error);
      toast.error("Failed to create schedule. Please try again.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchChecklistMappings(customCode);
  }, [customCode]);


  const handleFinish = () => {
    toast.success("Schedule setup completed successfully!", {
      position: 'top-right',
      duration: 4000,
      style: {
        background: '#fff',
        color: 'black',
        border: 'none',
      },
    });
    // Clear all saved data on successful completion
    clearAllFromLocalStorage();
    // Navigate back to schedule list
    navigate('/maintenance/schedule');
  };

  // Load template data when a template is selected
  const loadTemplateData = async (templateId: string) => {
    if (!templateId || templateId === '') {
      console.log("Template unselected — clearing only template tasks.");
      setQuestionSections(sections => {
        // Always ensure only one section with one empty task remains
        return [
          {
            id: (sections[0]?.id || Date.now().toString()),
            title: 'Questions',
            autoTicket: false,
            ticketLevel: 'checklist',
            ticketAssignedTo: '',
            ticketCategory: '',
            tasks: [{
              id: (Date.now() + 1).toString(),
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
          }
        ];
      });
      return; // Don't proceed to fetch
    }
    setLoading(prev => ({ ...prev, templates: true }));
    console.log(`Loading template data for ID: ${templateId}`);
    try {
      // Call the detailed template API with the selected template ID
      const response = await fetch(`${API_CONFIG.BASE_URL}/exisiting_checklist.json?id=${templateId}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const templateData = await response.json();

      if (templateData && templateData.content) {

        // Convert template content to tasks format
        const templateTasks = templateData.content.map((question: any, index: number) => {
          const inputType = mapInputType(question.type);

          // Initialize default values for different input types
          let dropdownValues = [{ label: '', type: 'positive' }];
          let radioValues = [{ label: '', type: 'positive' }];
          let checkboxValues = [''];
          let checkboxSelectedStates = [false];
          let optionsInputsValues = [''];

          // Map the values array based on input type
          if (question.values && Array.isArray(question.values) && question.values.length > 0) {
            if (inputType === 'dropdown') {
              dropdownValues = question.values.map((val: any) => ({
                label: val.label || val.value || '',
                type: val.type || 'positive'
              }));
            } else if (inputType === 'radio') {
              radioValues = question.values.map((val: any) => ({
                label: val.label || val.value || '',
                type: val.type || 'positive'
              }));
            } else if (inputType === 'checkbox') {
              checkboxValues = question.values.map((val: any) => val.label || val.value || '');
              checkboxSelectedStates = question.values.map(() => false);
            } else if (inputType === 'options-inputs') {
              optionsInputsValues = question.values.map((val: any) => val.label || val.value || '');
            }
          }

          return {
            id: (Date.now() + index).toString(),
            group: question.group_id || '',
            subGroup: question.sub_group_id || '',
            task: question.label || '',
            inputType: inputType,
            mandatory: question.required === 'true',
            helpText: !!question.hint,
            helpTextValue: question.hint || '',
            helpTextAttachments: [],
            autoTicket: false,
            weightage: question.weightage || '',
            rating: question.rating_enabled === 'true',
            reading: question.is_reading === 'true',
            dropdownValues: dropdownValues,
            radioValues: radioValues,
            checkboxValues: checkboxValues,
            checkboxSelectedStates: checkboxSelectedStates,
            optionsInputsValues: optionsInputsValues
          };
        });

        // Update the first section with template tasks
        setQuestionSections(sections =>
          sections.map((section, index) =>
            index === 0 ? { ...section, tasks: templateTasks } : section
          )
        );

        // Only update form data if fields are empty (don't overwrite user input)
        setFormData(prev => ({
          ...prev,
          activityName: prev.activityName || templateData.form_name || '',
          description: prev.description || templateData.description || '',
          type: templateData.schedule_type || prev.type,
          scheduleFor: prev.scheduleFor
        }));

        toast.success(`Template \"${templateData.form_name}\" loaded successfully!`, {
          position: 'top-right',
          duration: 4000,
          style: {
            background: '#fff',
            color: 'black',
            border: 'none',
          },
        });
      } else {
        // Handle case when template data is empty or invalid
        toast.error("Template data is empty or invalid.", {
          position: 'top-right',
          duration: 4000,
          style: {
            background: '#ef4444',
            color: 'white',
            border: 'none',
          },
        });
      }
    } catch (error) {
      console.error('Failed to load template data:', error);
      toast.error("Failed to load template data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setLoading(prev => ({ ...prev, templates: false }));
    }
  };

  const handleAssetGroupChange = (groupId: string) => {
    const numericGroupId = groupId ? Number(groupId) : undefined;
    setSelectedAssetGroup(numericGroupId);
    setFormData(prev => ({
      ...prev,
      assetGroup: groupId,
      assetSubGroup: [] // Reset sub-group when group changes
    }));
  };

  const handleChecklistTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      checklistType: value,
      // Reset all asset-related fields when switching between types
      asset: [],
      assetGroup: '',
      assetSubGroup: []
    }));

    // Reset asset group selection state
    setSelectedAssetGroup(undefined);
    setAssetSubGroups([]);
  };

  // Validation functions for each section - updated for field-level errors
  const validateBasicConfiguration = (): string[] => {
    const errors: { [key: string]: string } = {};

    if (!formData.type) {
      errors['type'] = 'Type selection is required';
    }
    if (!formData.activityName.trim()) {
      errors['activityName'] = 'Activity Name is required';
    }
    if (!formData.description.trim()) {
      errors['description'] = 'Description is required';
    }

    // Update field errors
    setFieldErrors(prev => ({
      ...prev,
      ...errors
    }));

    return Object.values(errors);
  };

  const validateScheduleSetup = (): string[] => {
    const errors: { [key: string]: string } = {};

    if (!formData.checklistType) {
      errors['checklistType'] = 'Checklist Type is required';
    }

    // Asset/Service validation based on scheduleFor and checklist type
    if (formData.scheduleFor === 'Asset' && formData.checklistType === 'Individual' && formData.asset.length === 0) {
      errors['asset'] = 'At least one asset must be selected for Individual checklist type';
    }

    if (formData.scheduleFor === 'Service' && formData.service.length === 0) {
      errors['service'] = 'At least one service must be selected';
    }

    if (formData.checklistType === 'Asset Group') {
      if (!formData.assetGroup) {
        errors['assetGroup'] = 'Asset Group selection is required';
      }
      if (formData.assetSubGroup.length === 0) {
        errors['assetSubGroup'] = 'At least one Asset Sub-Group must be selected';
      }
    }

    // Assignment validation
    if (!formData.assignToType) {
      errors['assignToType'] = 'Assign To type is required';
    }

    if (formData.assignToType === 'user' && formData.selectedUsers.length === 0) {
      errors['selectedUsers'] = 'At least one user must be selected';
    }

    if (formData.assignToType === 'group' && formData.selectedGroups.length === 0) {
      errors['selectedGroups'] = 'At least one group must be selected';
    }

    if (!formData.backupAssignee) {
      errors['backupAssignee'] = 'Backup Assignee is required';
    }

    // Plan duration validation
    if (!formData.planDuration) {
      errors['planDuration'] = 'Plan Duration type is required';
    }
    if (formData.planDuration && !formData.planDurationValue) {
      errors['planDurationValue'] = 'Plan Duration value is required when duration type is selected';
    }

    // if (!formData.emailTriggerRule) {
    //   errors['emailTriggerRule'] = 'Email Trigger Rule is required';
    // }

    // if (!formData.scanType) {
    //   errors['scanType'] = 'Scan Type is required';
    // }

    if (!formData.category) {
      errors['category'] = 'Category is required';
    }

    // Submission time validation
    // if (!formData.submissionTime) {
    //   errors['submissionTime'] = 'Submission Time type is required';
    // }
    // if (formData.submissionTime && !formData.submissionTimeValue) {
    //   errors['submissionTimeValue'] = 'Submission Time value is required when time type is selected';
    // }

    // if (!formData.supervisors) {
    //   errors['supervisors'] = 'Supervisors selection is required';
    // }

    if (!formData.lockOverdueTask) {
      errors['lockOverdueTask'] = 'Lock Overdue Task selection is required';
    }

    // Grace time validation
    if (!formData.graceTime) {
      errors['graceTime'] = 'Grace Time type is required';
    }
    if (formData.graceTime && !formData.graceTimeValue) {
      errors['graceTimeValue'] = 'Grace Time value is required when time type is selected';
    }

    if (!formData.startFrom) {
      errors['startFrom'] = 'Start From date is required';
    }

    if (!formData.endAt) {
      errors['endAt'] = 'End At date is required';
    }

    // Date validation
    if (formData.startFrom && formData.endAt && formData.endAt < formData.startFrom) {
      errors['endAt'] = 'End date cannot be before start date';
    }

    // Update field errors
    setFieldErrors(prev => ({
      ...prev,
      ...errors
    }));

    return Object.values(errors);
  };

  const validateQuestionSetup = (): string[] => {
    const errors: { [key: string]: string } = {};

    // Validate each section has at least one valid task
    questionSections.forEach((section, sectionIndex) => {
      if (!section.title || typeof section.title !== 'string' || !section.title.trim()) {
        errors[`section_${sectionIndex}_title`] = `Section ${sectionIndex + 1} title is required`;
      }

      const validTasks = section.tasks.filter(task => task && typeof task.task === 'string' && task.task.trim());
      if (validTasks.length === 0) {
        errors[`section_${sectionIndex}_tasks`] = `Section ${sectionIndex + 1} must have at least one task with content`;
      }

      // Validate each task
      section.tasks.forEach((task, taskIndex) => {
        if (task && typeof task.task === 'string' && task.task.trim()) {
          if (!task.inputType) {
            errors[`section_${sectionIndex}_task_${taskIndex}_inputType`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} must have an input type selected`;
          }
          // Group and SubGroup are mandatory
          if (!task.group || !task.group.trim()) {
            errors[`section_${sectionIndex}_task_${taskIndex}_group`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} must have a group selected`;
          }
          if (!task.subGroup || !task.subGroup.trim()) {
            errors[`section_${sectionIndex}_task_${taskIndex}_subGroup`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} must have a sub-group selected`;
          }
          // Help text is optional, but if enabled, value is required
          if (task.helpText && (!task.helpTextValue || !task.helpTextValue.trim())) {
            errors[`section_${sectionIndex}_task_${taskIndex}_helpTextValue`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} help text value is required when help text is enabled`;
          }
          // Validate input type specific values
          if (task.inputType === 'dropdown' && task.dropdownValues.some(val => !val.label || !val.label.trim())) {
            errors[`section_${sectionIndex}_task_${taskIndex}_dropdownValues`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} dropdown must have all option values filled`;
          }
          if (task.inputType === 'radio' && task.radioValues.some(val => !val.label || !val.label.trim())) {
            errors[`section_${sectionIndex}_task_${taskIndex}_radioValues`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} radio must have all option values filled`;
          }
          // Checkboxes are not mandatory, so skip validation for checkboxValues
        } else if (section.tasks.length === 1) {
          // If there's only one task and it's empty, require it to be filled
          errors[`section_${sectionIndex}_task_${taskIndex}_task`] = `Section ${sectionIndex + 1} must have at least one task filled`;
        }
      });
    });

    // Update field errors
    setFieldErrors(prev => ({
      ...prev,
      ...errors
    }));

    return Object.values(errors);
  };

  const validateTimeSetup = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validate hour settings
    if (timeSetupData.hourMode === 'specific' && timeSetupData.selectedHours.length === 0) {
      errors['timeSetup_hours'] = 'At least one hour must be selected when using specific hours';
    }

    // Validate minute settings
    if (timeSetupData.minuteMode === 'specific' && timeSetupData.selectedMinutes.length === 0) {
      errors['timeSetup_minutes'] = 'At least one minute must be selected when using specific minutes';
    }

    if (timeSetupData.minuteMode === 'between') {
      if (!timeSetupData.betweenMinuteStart || !timeSetupData.betweenMinuteEnd) {
        errors['timeSetup_minuteRange'] = 'Both start and end minutes are required for between minute range';
      }
    }

    // Validate day settings
    if (timeSetupData.dayMode === 'weekdays' && timeSetupData.selectedWeekdays.length === 0) {
      errors['timeSetup_weekdays'] = 'At least one weekday must be selected when using specific weekdays';
    }

    if (timeSetupData.dayMode === 'specific' && timeSetupData.selectedDays.length === 0) {
      errors['timeSetup_days'] = 'At least one day must be selected when using specific days';
    }

    // Validate month settings
    if (timeSetupData.monthMode === 'specific' && timeSetupData.selectedMonths.length === 0) {
      errors['timeSetup_months'] = 'At least one month must be selected when using specific months';
    }

    if (timeSetupData.monthMode === 'between') {
      if (!timeSetupData.betweenMonthStart || !timeSetupData.betweenMonthEnd) {
        errors['timeSetup_monthRange'] = 'Both start and end months are required for between month range';
      }
    }

    // Update field errors
    setFieldErrors(prev => ({
      ...prev,
      ...errors
    }));

    return Object.keys(errors).length === 0;
  };

  const validateCurrentStep = (): boolean => {
    // Clear existing field errors for current step
    setFieldErrors(prev => {
      const clearedErrors = { ...prev };
      Object.keys(clearedErrors).forEach(key => {
        // Clear errors that might be related to current step
        delete clearedErrors[key];
      });
      return clearedErrors;
    });

    let isValid = true;

    switch (activeStep) {
      case 0:
        isValid = validateBasicConfiguration().length === 0;
        break;
      case 1:
        isValid = validateScheduleSetup().length === 0;
        break;
      case 2: {
        isValid = validateQuestionSetup().length === 0;
        // Additional validation for help text and attachments
        if (isValid) {
          let helpError = false;
          questionSections.forEach((section, sectionIndex) => {
            section.tasks.forEach((task, taskIndex) => {
              if (task.helpText) {
                if (!task.helpTextValue || !task.helpTextValue.trim()) {
                  setFieldErrors(prev => ({
                    ...prev,
                    [`section_${sectionIndex}_task_${taskIndex}_helpTextValue`]: 'Help Text is required if Help Text is checked.'
                  }));
                  helpError = true;
                }
                if (!task.helpTextAttachments || task.helpTextAttachments.length === 0) {
                  setFieldErrors(prev => ({
                    ...prev,
                    [`section_${sectionIndex}_task_${taskIndex}_helpTextAttachments`]: 'Help Attachment is required if Help Text is checked.'
                  }));
                  helpError = true;
                }
              }
            });
          });
          if (helpError) {
            isValid = false;
          }
        }
        break;
      }
      case 3:
        isValid = validateTimeSetup();
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      // No error toast, just rely on field-level errors and star on labels
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast.error("Please fill all required fields before proceeding.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }

    // Show success message for the completed step
    const stepMessages = {
      0: "Basic Configuration completed successfully!",
      1: "Schedule Setup completed successfully!",
      2: "Question Setup completed successfully!",
      3: "Time Setup completed successfully!",
      4: "Mapping completed successfully!"
    };

    // Always show toast for valid steps
    const currentStepMessage = stepMessages[activeStep as keyof typeof stepMessages];
    if (currentStepMessage) {
      toast.success(currentStepMessage, {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      // Scroll to top for better UX
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
    setEditingStep(null);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      const newActiveStep = activeStep - 1;
      // Remove completion status from steps after the new active step
      setCompletedSteps(completedSteps.filter(step => step < newActiveStep));
      setActiveStep(newActiveStep);
    }
  };

  const handleStepClick = (step: number) => {
    // Validate current step before allowing navigation
    if (step > activeStep && !validateCurrentStep()) {
      return;
    }

    if (step < activeStep) {
      setCompletedSteps(completedSteps.filter(stepIndex => stepIndex < step));
    } else if (step > activeStep) {
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps([...completedSteps, activeStep]);
        // Show success message for the completed step
        const stepMessages = {
          0: "Basic Configuration completed successfully!",
          1: "Schedule Setup completed successfully!",
          2: "Question Setup completed successfully!",
          3: "Time Setup completed successfully!",
          4: "Mapping completed successfully!"
        };
        const currentStepMessage = stepMessages[activeStep as keyof typeof stepMessages];
        if (currentStepMessage) {
          toast.success(currentStepMessage, {
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
    }
    setActiveStep(step);
    setEditingStep(step);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Check if a step should be red (active or completed)
  const isStepRed = (stepIndex: number) => {
    return stepIndex === activeStep || completedSteps.includes(stepIndex);
  };

  // Helper function to map input types back to API format
  const mapInputTypeToAPI = (inputType: string): string => {
    const typeMapping: { [key: string]: string } = {
      'radio': 'radio-group',
      'dropdown': 'select',
      'text': 'text',
      'number': 'number',
      'checkbox': 'checkbox-group',
      'date': 'date'
    };
    return typeMapping[inputType] || 'text';
  };

  // Helper function to build cron expression
  const buildCronExpression = () => {
    let minute = '*';
    let hour = '*';
    let dayOfMonth = '?';
    let month = '*';
    let dayOfWeek = '?';

    // Build minute part
    if (timeSetupData.minuteMode === 'specific' && timeSetupData.selectedMinutes.length > 0) {
      minute = timeSetupData.selectedMinutes.join(',');
    } else if (timeSetupData.minuteMode === 'between') {
      const start = parseInt(timeSetupData.betweenMinuteStart);
      const end = parseInt(timeSetupData.betweenMinuteEnd);
      minute = `${start}-${end}`;
    }

    // Build hour part
    if (timeSetupData.hourMode === 'specific' && timeSetupData.selectedHours.length > 0) {
      hour = timeSetupData.selectedHours.join(',');
    }

    // Build day part
    if (timeSetupData.dayMode === 'weekdays' && timeSetupData.selectedWeekdays.length > 0) {
      const weekdayMap: { [key: string]: string } = {
        'Sunday': '1',
        'Monday': '2',
        'Tuesday': '3',
        'Wednesday': '4',
        'Thursday': '5',
        'Friday': '6',
        'Saturday': '7'
      };
      dayOfWeek = timeSetupData.selectedWeekdays.map(day => weekdayMap[day]).join(',');
      dayOfMonth = '?';
    } else if (timeSetupData.dayMode === 'specific' && timeSetupData.selectedDays.length > 0) {
      dayOfMonth = timeSetupData.selectedDays.join(',');
      dayOfWeek = '?';
    }

    // Build month part
    if (timeSetupData.monthMode === 'specific' && timeSetupData.selectedMonths.length > 0) {
      const monthMap: { [key: string]: string } = {
        'January': '1', 'February': '2', 'March': '3', 'April': '4',
        'May': '5', 'June': '6', 'July': '7', 'August': '8',
        'September': '9', 'October': '10', 'November': '11', 'December': '12'
      };
      month = timeSetupData.selectedMonths.map(m => monthMap[m]).join(',');
    } else if (timeSetupData.monthMode === 'between') {
      const monthMap: { [key: string]: number } = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
      };
      const startMonth = monthMap[timeSetupData.betweenMonthStart];
      const endMonth = monthMap[timeSetupData.betweenMonthEnd];
      month = `${startMonth}-${endMonth}`;
    }

    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  };

  // Helper function to format date to ISO string with time
  const formatDateToISO = (dateString: string) => {
    if (!dateString) return "";

    // Create date object from the input date string
    const date = new Date(dateString);

    // Set time to 13:30:00 (1:30 PM) as specified in the requirement
    date.setHours(13, 30, 0, 0);

    // Return ISO string format
    return date.toISOString();
  };

  // Build the API payload
  const buildAPIPayload = () => {
    // Build content array from question sections
    const content = questionSections.flatMap(section =>
      section.tasks.filter(task => task.task.trim()).map(task => {
        let values: any[] = [];

        // Set values based on input type
        switch (task.inputType) {
          case 'dropdown':
            values = task.dropdownValues
              .filter(val => val.label.trim())
              .map(val => ({
                label: val.label,
                type: val.type,
                value: val.label
              }));
            break;
          case 'radio':
            values = task.radioValues
              .filter(val => val.label.trim())
              .map(val => ({
                label: val.label,
                type: val.type,
                value: val.label
              }));
            break;
          case 'checkbox':
            values = task.checkboxValues
              .filter(val => val.trim())
              .map(val => val);
            break;
          case 'options-inputs':
            values = task.optionsInputsValues
              .filter(val => val.trim())
              .map(val => val);
            break;
          default:
            values = [];
        }

        return {
          label: task.task,
          name: `qnm_${Math.random().toString(36).substr(2, 5)}`,
          className: "form-group",
          group_id: task.group || "",
          sub_group_id: task.subGroup || "",
          type: mapInputTypeToAPI(task.inputType),
          subtype: "",
          required: task.mandatory ? "true" : "false",
          is_reading: task.reading ? "true" : "false",
          hint: task.helpTextValue || "",
          values: values,
          weightage: task.weightage || "",
          rating_enabled: task.rating ? "true" : "false"
        };
      })
    );

    // Build custom_form object
    const customForm: any = {};
    questionSections.forEach((section, index) => {
      // Only include question_for_{index+1} if at least one task has helpText checked
      const sectionTasks = section.tasks.filter(task => task.task.trim());
      const helpTextTasks = sectionTasks.filter(task => task.helpText);
      if (helpTextTasks.length > 0) {
        // Validation: All helpText tasks must have helpTextValue and helpTextAttachments
        const missingHelpText = helpTextTasks.some(task => !task.helpTextValue || !task.helpTextValue.trim());
        const missingHelpAttachments = helpTextTasks.some(task => !task.helpTextAttachments || task.helpTextAttachments.length === 0);
        if (missingHelpText) {
          throw new Error('Please enter Help Text for all tasks where Help Text is checked.');
        }
        if (missingHelpAttachments) {
          throw new Error('Please attach a help file for all tasks where Help Text is checked.');
        }
        // Only include question_for_{index+1} if helpText is checked
        customForm[`question_for_${index + 1}`] = helpTextTasks.map(task => ({
          attachments: task.helpTextAttachments.map(attachment => ({
            filename: attachment.name,
            content: attachment.content,
            content_type: attachment.content_type
          })),
        }));
      }
      // If no helpText checked, do not include question_for_{index+1}
    });

    // Get selected asset IDs or service IDs based on scheduleFor
    const assetIds = formData.scheduleFor === 'Asset' && formData.checklistType === 'Individual' ? formData.asset : [];
    const serviceIds = formData.scheduleFor === 'Service' && formData.checklistType === 'Individual' ? formData.service : [];

    // Get assigned people IDs
    const peopleAssignedIds = formData.assignToType === 'user' ? formData.selectedUsers : [];

    // Build dynamic cron fields
    const cronExpression = buildCronExpression();

    // Build minute cron field
    let cronMinute = "off";
    let cronMinuteSpecificSpecific = "";
    if (timeSetupData.minuteMode === 'specific' && timeSetupData.selectedMinutes.length > 0) {
      cronMinute = "on";
      cronMinuteSpecificSpecific = timeSetupData.selectedMinutes.join(',');
    }

    // Build hour cron field
    let cronHour = "off";
    let cronHourSpecificSpecific = "";
    if (timeSetupData.hourMode === 'specific' && timeSetupData.selectedHours.length > 0) {
      cronHour = "on";
      cronHourSpecificSpecific = timeSetupData.selectedHours.join(',');
    }

    // Build day cron field
    let cronDay = "off";
    if (timeSetupData.dayMode === 'weekdays' && timeSetupData.selectedWeekdays.length > 0) {
      cronDay = "on";
    } else if (timeSetupData.dayMode === 'specific' && timeSetupData.selectedDays.length > 0) {
      cronDay = "on";
    }

    // Build month cron field
    let cronMonth = "off";
    if (timeSetupData.monthMode === 'specific' && timeSetupData.selectedMonths.length > 0) {
      cronMonth = "on";
    } else if (timeSetupData.monthMode === 'between') {
      cronMonth = "on";
    } else if (timeSetupData.monthMode === 'all') {
      cronMonth = "on";
    }

    return {
      schedule_type: 'ppm',
      pms_custom_form: {
        created_source: "form",
        create_ticket: autoTicket ? "1" : "0",
        ticket_level: formData.ticketLevel,
        task_assigner_id: formData.ticketAssignedTo || "",
        helpdesk_category_id: formData.ticketCategory || "",
        weightage_enabled: weightage ? "1" : "0",
        schedule_type: formData.type,
        form_name: formData.activityName,
        description: formData.description,
        supervisors: formData.supervisors ? [formData.supervisors] : [],
        submission_time_type: formData.submissionTime || "",
        submission_time_value: formData.submissionTimeValue || "",
        supplier_id: formData.supplier || "",
        // Add attachments from basic configuration step
        attachments: attachments.map(attachment => ({
          filename: attachment.name,
          content: attachment.content,
          content_type: attachment.content_type
        })),
        // Add custom form with question attachments
        custom_form: customForm
      },
      sch_type: 'ppm',
      checklist_type: formData.scheduleFor,
      group_id: formData.assetGroup || "",
      sub_group_id: Array.isArray(formData.assetSubGroup) ? (formData.assetSubGroup[0] || "") : (formData.assetSubGroup || ""),
      content: content,
      checklist_upload_type: formData.checklistType,
      asset_ids: assetIds.filter(id => id),
      service_ids: serviceIds.filter(id => id),
      training_subject_ids: [""],
      sub_group_ids: [""],
      pms_asset_task: {
        assignment_type: formData.assignToType === 'user' ? 'people' : 'group',
        scan_type: 'qr',
        plan_type: formData.planDuration || "",
        plan_value: formData.planDurationValue || "",
        priority: "Low", // Default or from form
        category: formData.category || "",
        grace_time_type: formData.graceTime || "",
        grace_time_value: formData.graceTimeValue || "",
        overdue_task_start_status: formData.lockOverdueTask || "false",
        frequency: null, // Default or from form
        start_date: formatDateToISO(formData.startFrom),
        end_date: formatDateToISO(formData.endAt)
      },
      backup_assigned_to_id: formData.backupAssignee || "",
      people_assigned_to_ids: peopleAssignedIds,
      ppm_rule_ids: formData.emailTriggerRule ? [formData.emailTriggerRule] : [],
      amc_rule_ids: [""],
      // Dynamic time setup fields from TimeSetupStep component
      cronMinute: cronMinute,
      cronMinuteSpecificSpecific: cronMinuteSpecificSpecific,
      cronHour: cronHour,
      cronHourSpecificSpecific: cronHourSpecificSpecific,
      cronDay: cronDay,
      cronMonth: cronMonth,
      cron_expression: cronExpression,
      // expholder: ""
    };
  };

  // Helper function to determine if a value input is needed for a duration type
  function needsValueInput(type: string) {
    return !!type && type !== '';
  }

  const renderSingleStep = (stepIndex: number, disabled: boolean = false) => {
    switch (stepIndex) {
      case 0: // Basic Configuration
        return (
          <SectionCard style={{ padding: '24px', margin: 0, borderRadius: '3px' }} >
            {/* Header with icon and title */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  backgroundColor: '#C72030',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2'
                }}>
                  <Cog size={16} color="white" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030', textTransform: 'uppercase' }}>
                  Basic Configuration
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Schedule For: <strong>{formData.scheduleFor}</strong>
                </Typography>
                {stepIndex < activeStep && (
                  <MuiButton
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleStepClick(stepIndex)}
                    sx={{
                      color: '#C72030',
                      borderColor: '#C72030',
                      fontSize: '12px',
                      padding: '4px 12px',
                      minWidth: 'auto',
                      '&:hover': {
                        borderColor: '#C72030',
                        backgroundColor: 'rgba(199, 32, 48, 0.04)'
                      }
                    }}
                  >
                    Edit
                  </MuiButton>
                )}
              </Box>
            </Box>

            {/* Type section */}
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Type
              </Typography>
              <RadioGroup
                row
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value="PPM"
                  control={
                    <Radio
                      sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}
                    />
                  }
                  label="PPM"
                />
                <FormControlLabel
                  value="AMC"
                  control={
                    <Radio
                      sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}
                    />
                  }
                  label="AMC"
                />
                <FormControlLabel
                  value="Preparedness"
                  control={
                    <Radio
                      sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}
                    />
                  }
                  label="Preparedness"
                />
                {/* <FormControlLabel
                  value="Hoto"
                  control={
                    <Radio
                      sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}
                    />
                  }
                  label="Hoto"
                /> */}
                <FormControlLabel
                  value="Routine"
                  control={
                    <Radio
                      sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}
                    />
                  }
                  label="Routine"
                />
                {/* <FormControlLabel
                  value="Audit"
                  control={
                    <Radio
                      sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}
                    />
                  }
                  label="Audit"
                /> */}
              </RadioGroup>
            </Box>

            <TextField
              disabled={stepIndex < activeStep && editingStep !== stepIndex}

              label={<span>Activity Name <span style={{ color: 'red' }}>*</span></span>}
              placeholder="Enter Activity Name"
              fullWidth
              value={formData.activityName}
              onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
              sx={{ mb: 3 }}
            />

            <TextField
              disabled={stepIndex < activeStep && editingStep !== stepIndex}
              label={
                <span style={{ fontSize: '16px' }}>
                  Description <span style={{ color: "red" }}>*</span>
                </span>
              }
              placeholder="Enter Description/SOP"
              fullWidth
              multiline
              minRows={4} // better than rows
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
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
            {/* Attachments Section */}
            <Box sx={{ mb: 3 }}>
              {/* Display existing attachments as placeholder boxes */}
              {attachments.length > 0 && (
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 2,
                  flexWrap: 'wrap'
                }}>
                  {attachments.map((attachment) => {
                    // Check if the file is an image by extension or mime type if available
                    const isImage = attachment.name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);
                    const isReadOnly = stepIndex < activeStep && editingStep !== stepIndex;
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
                        {/* Close button - only show if not read-only */}
                        {!isReadOnly && (
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
                        )}

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
                              borderRadius: 4,
                              opacity: isReadOnly ? 0.5 : 1 // Apply opacity if read-only
                            }}
                          />
                        ) : (
                          <AttachFile sx={{ fontSize: 24, color: '#666', mb: 1, opacity: isReadOnly ? 0.5 : 1 }} />
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
                              width: '100%',
                              opacity: isReadOnly ? 0.5 : 1
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
                <MuiButton
                  variant="outlined"
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                  // startIcon={<AttachFile />}
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
              </Box>
            </Box>
          </SectionCard>
        );

      case 1: // Schedule Setup
        function handleMultiSelectChange(field: 'selectedUsers' | 'selectedGroups' | 'service' | 'assetSubGroup' | 'asset', e: SelectChangeEvent<any>) {
          const {
            target: { value }
          } = e;
          setFormData(prev => ({
            ...prev,
            [field]: typeof value === 'string' ? value.split(',') : value
          }));
        }

        function handleAutocompleteChange(field: 'service' | 'asset' | 'selectedUsers', value: any[]) {
          setFormData(prev => ({
            ...prev,
            [field]: value.map(item => item.id.toString())
          }));
        }

        return (
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              {
                formData.scheduleFor === 'Asset' && (<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Checklist Type
                </Typography>)}
              {stepIndex < activeStep && (
                <MuiButton
                  variant="outlined"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleStepClick(stepIndex)}
                  sx={{
                    color: '#C72030',
                    borderColor: '#C72030',
                    fontSize: '12px',
                    padding: '4px 12px',
                    minWidth: 'auto',
                    '&:hover': {
                      borderColor: '#C72030',
                      backgroundColor: 'rgba(199, 32, 48, 0.04)'
                    }
                  }}
                >
                  Edit
                </MuiButton>
              )}
            </Box>
            <Box sx={{ mb: 3 }}>
              {
                formData.scheduleFor === 'Asset' && (<RadioGroup
                  row
                  value={formData.checklistType}
                  onChange={(e) => handleChecklistTypeChange(e.target.value)}
                >
                  <FormControlLabel
                    value="Individual"
                    control={
                      <Radio
                        sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                        disabled={stepIndex < activeStep && editingStep !== stepIndex}
                      />
                    }
                    label="Individual"
                  />

                  <FormControlLabel
                    value="Asset Group"
                    control={
                      <Radio
                        sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                        disabled={stepIndex < activeStep && editingStep !== stepIndex}
                      />
                    }
                    label="Asset Group"
                  />

                  {/* <FormControlLabel 
                    value="Branching" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Branching" 
                  /> */}
                </RadioGroup>)}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {/* Conditional Asset/Service Dropdown - Show based on scheduleFor */}
              {formData.scheduleFor === 'Asset' && formData.checklistType === 'Individual' && (
                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Select Assets <span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                      multiple
                      label="Select Assets"
                      notched
                      displayEmpty
                      value={formData.asset}
                      onChange={e => handleAutocompleteChange('asset', assets.filter(asset => e.target.value.includes(asset.id.toString())))}
                      renderValue={(selected) => {
                        if (!selected || selected.length === 0) {
                          return <span style={{ color: '#aaa' }}>Select Assets</span>;
                        }
                        return assets
                          .filter(asset => selected.includes(asset.id.toString()))
                          .map(asset => asset.name)
                          .join(', ');
                      }}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.assets}
                    >
                      <MenuItem value="">Select Assets</MenuItem>
                      {assets && assets.map((option) => (
                        <MenuItem key={option.id} value={option.id.toString()}>{option.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {loading.assets && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading assets...
                    </Typography>
                  )}
                </Box>
              )}

              {/* Service Dropdown - Show when scheduleFor is Service */}
              {formData.scheduleFor === 'Service' && formData.checklistType === 'Individual' && (
                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Select Services <span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                      multiple
                      label="Select Services"
                      notched
                      displayEmpty
                      value={formData.service}
                      onChange={e => handleAutocompleteChange('service', services.filter(service => e.target.value.includes(service.id.toString())))}
                      renderValue={(selected) =>
                        !selected || selected.length === 0
                          ? <span style={{ color: '#aaa' }}>Select Services</span>
                          : services
                              .filter(service => selected.includes(service.id.toString()))
                              .map(service => service.service_name)
                              .join(', ')
                      }
                      disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.services}
                    >
                      <MenuItem value="" disabled>Select Services</MenuItem>
                      {services && services.map((option) => (
                        <MenuItem key={option.id} value={option.id.toString()}>{option.service_name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {loading.services && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading services...
                    </Typography>
                  )}
                </Box>
              )}

              {/* Conditional Asset Group Dropdown - Show for Asset Group and when scheduleFor is Asset */}
              {formData.scheduleFor === 'Asset' && formData.checklistType === 'Asset Group' && (
                <>
                  <Box>
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Asset Group <span style={{ color: 'red' }}>*</span></InputLabel>
                      <Select
                        label="Asset Group"
                        notched
                        displayEmpty
                        value={formData.assetGroup}
                        onChange={e => handleAssetGroupChange(e.target.value)}
                        disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.groups}
                      >
                        <MenuItem value="">Select Asset Group</MenuItem>
                        {assetGroups && assetGroups.map((option) => (
                          <MenuItem key={option.id} value={option.id.toString()}>{option.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {loading.groups && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                        Loading asset groups...
                      </Typography>
                    )}
                  </Box>

                  {/* Asset Sub-Group Dropdown - Show when Asset Group is selected */}
                  {selectedAssetGroup && (
                    <FormControl fullWidth>
                      <InputLabel>
                        Select Asset Sub-Groups <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        multiple
                        value={formData.assetSubGroup}
                        onChange={(e) => handleMultiSelectChange('assetSubGroup', e)}
                        input={<OutlinedInput label="Select Asset Sub-Groups" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                              const subGroup = assetSubGroups?.find(sg => sg.id.toString() === value);
                              return (
                                <Chip key={value} label={subGroup?.name || value} size="small" />
                              );
                            })}
                          </Box>
                        )}
                        disabled={loading.subGroups}
                      >
                        {assetSubGroups && assetSubGroups.map((subGroup) => (
                          <MenuItem key={subGroup.id} value={subGroup.id.toString()}>
                            {subGroup.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {loading.subGroups && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Loading sub-groups...
                        </Typography>
                      )}
                    </FormControl>
                  )}
                </>
              )}

              {/* Assign To Type Selection */}
              <Box>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Assign To <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Assign To"
                    notched
                    displayEmpty
                    value={formData.assignToType}
                    onChange={e => setFormData({ ...formData, assignToType: e.target.value, selectedUsers: [], selectedGroups: [] })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex}
                  >
                    <MenuItem value="">Select Assign To</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="group">Group</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Multi-select Users - Show when assignToType is 'user' */}
              {formData.assignToType === 'user' && (
                <Box>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Select Users <span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                      multiple
                      label="Select Users"
                      notched
                      displayEmpty
                      value={formData.selectedUsers}
                      onChange={e => handleAutocompleteChange('selectedUsers', users.filter(user => e.target.value.includes(user.id.toString())))}
                      renderValue={(selected) => {
                        if (!selected || selected.length === 0) {
                          return <span style={{ color: '#aaa' }}>Select Users</span>;
                        }
                        return users
                          .filter(user => selected.includes(user.id.toString()))
                          .map(user => user.full_name)
                          .join(', ');
                      }}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.users}
                    >
                      <MenuItem value="">Select Users</MenuItem>
                      {users && users.map((option) => (
                        <MenuItem key={option.id} value={option.id.toString()}>{option.full_name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Multi-select Groups - Show when assignToType is 'group' */}
              {formData.assignToType === 'group' && (
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Select Groups <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    multiple
                    label="Select Groups"
                    notched
                    displayEmpty
                    value={formData.selectedGroups}
                    onChange={(e) => handleMultiSelectChange('selectedGroups', e)}
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
                  </Select>
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
                  <Select
                    label="Backup Assignee"
                    notched
                    displayEmpty
                    value={formData.backupAssignee}
                    onChange={e => setFormData({ ...formData, backupAssignee: e.target.value })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex}
                  >
                    <MenuItem value="">Select Backup Assignee</MenuItem>
                    {users && users.map((option) => (
                      <MenuItem key={option.id} value={option.id.toString()}>{option.full_name}</MenuItem>
                    ))}
                  </Select>
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
                  <Select
                    label="Plan Duration"
                    notched
                    displayEmpty
                    value={formData.planDuration}
                    onChange={e => setFormData({ ...formData, planDuration: e.target.value, planDurationValue: '' })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex}
                  >
                    <MenuItem value="">Select Plan Duration</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hour">Hour</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Plan Duration Value Input - Show when duration type is selected */}
              {needsValueInput(formData.planDuration) && (
                <TextField
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  label={<span>Plan Duration ({formData.planDuration}) <span style={{ color: 'red' }}>*</span></span>}
                  type="number"
                  fullWidth
                  value={formData.planDurationValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Number(value) < 0) return;
                    setFormData({ ...formData, planDurationValue: value });
                  }}
                  placeholder={`Enter number of ${formData.planDuration}`}
                  inputProps={{
                    min: 0,
                    onWheel: (e) => (e.target as HTMLInputElement).blur(), // Disable wheel input
                  }}
                />
              )}

              <Box>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Email Trigger Rule</InputLabel>
                  <Select
                    label="Email Trigger Rule"
                    notched
                    displayEmpty
                    value={formData.emailTriggerRule}
                    onChange={e => setFormData({ ...formData, emailTriggerRule: e.target.value })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.emailRules}
                  >
                    <MenuItem value="">Select Email Trigger Rule</MenuItem>
                    {emailRules.map(rule => (
                      <MenuItem key={rule.id} value={rule.id.toString()}>{rule.rule_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {loading.emailRules && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading email rules...
                  </Typography>
                )}
              </Box>

              {/* <Box>
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  options={[
                    { id: 'qr', label: 'QR', value: 'qr' },
                    { id: 'nfc', label: 'NFC', value: 'nfc' }
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: 'qr', label: 'QR', value: 'qr' },
                    { id: 'nfc', label: 'NFC', value: 'nfc' }
                  ].find(option => option.value === formData.scanType) || null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, scanType: selectedValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={<span>Scan Type <span style={{ color: 'red' }}>*</span></span>}
                      placeholder="Select Scan Type"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box> */}

              <Box>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Category <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Category"
                    notched
                    displayEmpty
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Non Technical">Non-Technical</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Submission Time with conditional input */}
              <Box>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Submission Time</InputLabel>
                  <Select
                    label="Submission Time"
                    notched
                    displayEmpty
                    value={formData.submissionTime}
                    onChange={e => setFormData({ ...formData, submissionTime: e.target.value, submissionTimeValue: '' })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex}
                  >
                    <MenuItem value="">Select Submission Time</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hour">Hour</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Submission Time Value Input - Show when time type is selected */}
              {needsValueInput(formData.submissionTime) && (
                <TextField
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  label={<span>Submission Time ({formData.submissionTime}) <span style={{ color: 'red' }}>*</span></span>}
                  type="number"
                  fullWidth
                  value={formData.submissionTimeValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Number(value) < 0) return;
                    setFormData({ ...formData, submissionTimeValue: value });
                  }}
                  inputProps={{
                    min: 0,
                    onWheel: (e) => (e.target as HTMLInputElement).blur(), // Disable wheel input
                  }}
                  placeholder={`Enter number of ${formData.submissionTime}`}
                />
              )}

              <Box>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Supervisors </InputLabel>
                  <Select
                    label="Supervisors"
                    notched
                    displayEmpty
                    value={formData.supervisors}
                    onChange={e => setFormData({ ...formData, supervisors: e.target.value })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.users}
                  >
                    <MenuItem value="">Select Supervisors</MenuItem>
                    {users && users.map(user => (
                      <MenuItem key={user.id} value={user.id.toString()}>{user.full_name}</MenuItem>
                    ))}
                  </Select>
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
                  <Select
                    label="Lock Overdue Task"
                    notched
                    displayEmpty
                    value={formData.lockOverdueTask}
                    onChange={e => setFormData({ ...formData, lockOverdueTask: e.target.value })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex}
                  >
                    <MenuItem value="">Select Lock Status</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* <Box>
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  options={[
                    { id: 'Daily', label: 'Daily', value: 'Daily' },
                    { id: 'Weekly', label: 'Weekly', value: 'Weekly' },
                    { id: 'Monthly', label: 'Monthly', value: 'Monthly' },
                    { id: 'Quarterly', label: 'Quarterly', value: 'Quarterly' },
                    { id: 'Half Yearly', label: 'Half Yearly', value: 'Half Yearly' },
                    { id: 'Yearly', label: 'Yearly', value: 'Yearly' }
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: 'Daily', label: 'Daily', value: 'Daily' },
                    { id: 'Weekly', label: 'Weekly', value: 'Weekly' },
                    { id: 'Monthly', label: 'Monthly', value: 'Monthly' },
                    { id: 'Quarterly', label: 'Quarterly', value: 'Quarterly' },
                    { id: 'Half Yearly', label: 'Half Yearly', value: 'Half Yearly' },
                    { id: 'Yearly', label: 'Yearly', value: 'Yearly' }
                  ].find(option => option.value === formData.frequency) || null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, frequency: selectedValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={
                        <span>
                          Frequency <span style={{ color: 'currentColor' }}>*</span>
                        </span>
                      }
                      placeholder="Select Frequency"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box> */}

              {/* Grace Time with conditional input */}
              <Box>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Grace Time <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Grace Time"
                    notched
                    displayEmpty
                    value={formData.graceTime}
                    onChange={e => setFormData({ ...formData, graceTime: e.target.value, graceTimeValue: '' })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex}
                  >
                    <MenuItem value="">Select Grace Time</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hour">Hour</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Grace Time Value Input - Show when time type is selected */}
              {needsValueInput(formData.graceTime) && (
                <TextField
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                  label={
                    <span>
                      Grace Time ({formData.graceTime}) <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  type="number"
                  fullWidth
                  value={formData.graceTimeValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Number(value) < 0) return;
                    setFormData({ ...formData, graceTimeValue: value });
                  }}
                  inputProps={{
                    min: 0,
                    onWheel: (e) => (e.target as HTMLInputElement).blur(), // Disable wheel input
                  }}
                  placeholder={`Enter number of ${formData.graceTime}`}
                />
              )}

              <Box>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Supplier </InputLabel>
                  <Select
                    label="Supplier"
                    notched
                    displayEmpty
                    value={formData.supplier}
                    onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                    disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.suppliers}
                  >
                    <MenuItem value="">Select Supplier</MenuItem>
                    {suppliers && suppliers.map(supplier => (
                      <MenuItem key={supplier.id} value={supplier.id.toString()}>{supplier.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {loading.suppliers && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading suppliers...
                  </Typography>
                )}
              </Box>

              {/* Start Date */}
<div>
  <label htmlFor="startFrom" className="text-sm font-medium" style={{ fontFamily: 'Work Sans, sans-serif' }}>
    Start Date<span className="text-red-500">*</span>
  </label>
  <TextField
    id="startFrom"
    type="date"
    value={formData.startFrom}
    onChange={e => setFormData({ ...formData, startFrom: e.target.value })}
    fullWidth
    variant="outlined"
    InputLabelProps={{ shrink: true }}
    InputProps={{ sx: fieldStyles }}
    sx={{ mt: 1 }}
    placeholder="Select Start Date"
    disabled={stepIndex < activeStep && editingStep !== stepIndex}
    inputProps={{
      max: formData.endAt || undefined,
    }}
    error={Boolean(fieldErrors.startFrom)}
    helperText={fieldErrors.startFrom}
  />
</div>

{/* End Date */}
<div>
  <label htmlFor="endAt" className="text-sm font-medium" style={{ fontFamily: 'Work Sans, sans-serif' }}>
    End Date<span className="text-red-500">*</span>
  </label>
  <TextField
    id="endAt"
    type="date"
    value={formData.endAt}
    onChange={e => setFormData({ ...formData, endAt: e.target.value })}
    fullWidth
    variant="outlined"
    InputLabelProps={{ shrink: true }}
    InputProps={{ sx: fieldStyles }}
    sx={{ mt: 1 }}
    placeholder="Select End Date"
    disabled={stepIndex < activeStep && editingStep !== stepIndex}
    inputProps={{
      min: formData.startFrom || undefined,
    }}
    error={Boolean(fieldErrors.endAt) || (formData.startFrom && formData.endAt && formData.endAt < formData.startFrom)}
    helperText={
      fieldErrors.endAt ||
      (formData.startFrom && formData.endAt && formData.endAt < formData.startFrom
        ? "End date cannot be before start date"
        : "")
    }
  />
</div>
            </Box>
          </SectionCard>
        );

      case 2: // Question Setup
        function handleTemplateChange(templateId: string) {
          setFormData(prev => ({ ...prev, selectedTemplate: templateId }));
          // if (templateId) {
          loadTemplateData(templateId);
          // }
        }

        function updateDropdownValue(sectionId: string, taskId: string, valueIndex: number, value: string): void {
          setQuestionSections(prevSections =>
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
          setQuestionSections(prevSections =>
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
          setQuestionSections(prevSections =>
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
          setQuestionSections(prevSections =>
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
          setQuestionSections(prevSections =>
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
          setQuestionSections(prevSections =>
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

        const removeDropdownValue = (sectionId: string, taskId: string, valueIndex: number): void => {
          setQuestionSections(prevSections =>
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
        };

        const removeRadioValue = (sectionId: string, taskId: string, valueIndex: number): void => {
          setQuestionSections(prevSections =>
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
        };

        // Add helper functions for checkbox values
        const addCheckboxValue = (sectionId: string, taskId: string): void => {
          setQuestionSections(prevSections =>
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

        const updateCheckboxValue = (sectionId: string, taskId: string, valueIndex: number, value: string): void => {
          setQuestionSections(prevSections =>
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
        };

        const updateCheckboxSelectedState = (sectionId: string, taskId: string, valueIndex: number, checked: boolean): void => {
          setQuestionSections(prevSections =>
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
        };

        const removeCheckboxValue = (sectionId: string, taskId: string, valueIndex: number): void => {
          setQuestionSections(prevSections =>
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
        };

        // Add helper functions for options & inputs values
        const addOptionsInputsValue = (sectionId: string, taskId: string): void => {
          setQuestionSections(prevSections =>
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
        };

        const updateOptionsInputsValue = (sectionId: string, taskId: string, valueIndex: number, value: string): void => {
          setQuestionSections(prevSections =>
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
        };

        const removeOptionsInputsValue = (sectionId: string, taskId: string, valueIndex: number): void => {
          setQuestionSections(prevSections =>
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
        };

        return (
          <div>
            {/* Header Outside the Box */}
            <div className="flex justify-between items-center p-6">
              <div className="flex items-center gap-2 text-[#C72030] text-lg font-semibold" style={{ textTransform: 'uppercase' }}>
                <span className="bg-[#C72030] text-white rounded-full w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm">
                  <Cog className="w-6 h-6" />
                </span>
                QUESTION SETUP
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
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
                </div>
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

                {/* Edit button for Question Setup step */}
                {stepIndex < activeStep && (
                  <MuiButton
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleStepClick(stepIndex)}
                    sx={{
                      color: '#C72030',
                      borderColor: '#C72030',
                      fontSize: '12px',
                      padding: '4px 12px',
                      minWidth: 'auto',
                      '&:hover': {
                        borderColor: '#C72030',
                        backgroundColor: 'rgba(199, 32, 48, 0.04)'
                      }
                    }}
                  >
                    Edit
                  </MuiButton>
                )}
              </div>
            </div>

            {/* Conditional Sections based on toggles */}

            {/* Create New Template Section */}
            {createNew && (
              <SectionCard style={{ padding: '24px', margin: 0, borderRadius: '3px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Select Template
                </Typography>

                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Template <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Template"
                    notched
                    displayEmpty
                    value={formData.selectedTemplate}
                    onChange={e => handleTemplateChange(e.target.value)}
                    disabled={(stepIndex < activeStep && editingStep !== stepIndex) || loading.templates}
                  >
                    <MenuItem value="">None</MenuItem>
                    {Array.isDefined(templates) && templates.map(template => (
                      <MenuItem key={template.id} value={String(template.id)}>{template.form_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {loading.templates && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading templates...
                  </Typography>
                )}
              </SectionCard>
            )}
            {/* Auto Ticket Configuration Section */}
            {autoTicket && (
              <SectionCard style={{ padding: '24px', margin: 0, borderRadius: '3px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Auto Ticket Configuration
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Ticket Level</Typography>
                    <RadioGroup
                      row
                      value={formData.ticketLevel}
                      onChange={(e) => setFormData({ ...formData, ticketLevel: e.target.value })}
                    >
                      <FormControlLabel
                        value="checklist"
                        control={
                          <Radio
                            sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            disabled={stepIndex < activeStep && editingStep !== stepIndex}
                          />
                        }
                        label="Checklist Level"
                      />
                      <FormControlLabel
                        value="question"
                        control={
                          <Radio
                            sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            disabled={stepIndex < activeStep && editingStep !== stepIndex}
                          />
                        }
                        label="Question Level"
                      />
                    </RadioGroup>
                  </Box>

                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Assigned To <span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                      label="Assigned To"
                      notched
                      displayEmpty
                      value={formData.ticketAssignedTo}
                      onChange={e => setFormData({ ...formData, ticketAssignedTo: e.target.value })}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.users}
                    >
                      <MenuItem value="">Select Assigned To</MenuItem>
                      {users.map(user => (
                        <MenuItem key={user.id} value={user.id.toString()}>{user.full_name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Category <span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                      label="Category"
                      notched
                      displayEmpty
                      value={formData.ticketCategory}
                      onChange={e => setFormData({ ...formData, ticketCategory: e.target.value })}
                      disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.helpdeskCategories}
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      {helpdeskCategories.map(category => (
                        <MenuItem key={category.id} value={category.id.toString()}>{category.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {loading.helpdeskCategories && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading categories...
                    </Typography>
                  )}
                </Box>
              </SectionCard>
            )}

            {/* Main Content in White Box */}
            {questionSections.map((section, sectionIndex) => (
              <div key={section.id} className="overflow-hidden" >
                <div className=" p-4 sm:p-6 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Section {sectionIndex + 1}
                    </Typography>
                    {questionSections.length > 1 && (
                      <IconButton
                        onClick={() => removeQuestionSection(section.id)}
                        sx={{ color: '#C72030' }}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </div>
                  {/* Individual Auto Ticket Configuration Section */}
                  {section.autoTicket && (
                    <Box sx={{
                      border: '1px solid #E0E0E0',
                      borderRadius: 0,
                      padding: 2,
                      mb: 3,
                      backgroundColor: '#F9F9F9'
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Auto Ticket Configuration
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Ticket Level</Typography>
                          <RadioGroup
                            row
                            value={section.ticketLevel}
                            onChange={(e) => updateSectionProperty(section.id, 'ticketLevel', e.target.value)}
                          >
                            <FormControlLabel
                              value="checklist"
                              control={
                                <Radio
                                  sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                />
                              }
                              label="Checklist Level"
                            />
                            <FormControlLabel
                              value="question"
                              control={
                                <Radio
                                  sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                />
                              }
                              label="Question Level"
                            />
                          </RadioGroup>
                        </Box>

                        <Autocomplete
                          disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.users}

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
                          ].find(option => option.value === section.ticketAssignedTo) || null}
                          onChange={(event, newValue) => {
                            if (newValue) updateSectionProperty(section.id, 'ticketAssignedTo', newValue.value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              disabled={stepIndex < activeStep && editingStep !== stepIndex}
                              {...params} label={<span>Assigned To <span style={{ color: 'red' }}>*</span></span>} fullWidth />
                          )}
                        />

                        <Autocomplete
                          disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.helpdeskCategories}

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
                          ].find(option => option.value === section.ticketCategory) || null}
                          onChange={(event, newValue) => {
                            if (newValue) updateSectionProperty(section.id, 'ticketCategory', newValue.value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              disabled={stepIndex < activeStep && editingStep !== stepIndex}
                              {...params} label={<span>Category <span style={{ color: 'red' }}>*</span></span>} fullWidth />
                          )}
                        />
                        {loading.helpdeskCategories && (
                          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                            Loading categories...
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Section Header with Group/Sub-Group */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
                    <Box>
                      <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                        <InputLabel shrink>Group</InputLabel>
                        <Select
                          label="Group"
                          notched
                          displayEmpty
                          value={section.tasks[0]?.group || ''}
                          onChange={e => {
                            const selectedValue = e.target.value;
                            section.tasks.forEach(task => {
                              handleTaskGroupChange(section.id, task.id, selectedValue);
                            });
                          }}
                          disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.taskGroups}
                        >
                          <MenuItem value="">Select Group</MenuItem>
                          {taskGroups && taskGroups.map(group => (
                            <MenuItem key={group.id} value={group.id.toString()}>{group.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {loading.taskGroups && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Loading groups...
                        </Typography>
                      )}
                    </Box>

                    <Box>
                      <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                        <InputLabel shrink>Sub-Group</InputLabel>
                        <Select
                          label="Sub-Group"
                          notched
                          displayEmpty
                          value={section.tasks[0]?.subGroup || ''}
                          onChange={e => {
                            const selectedValue = e.target.value;
                            section.tasks.forEach(task => {
                              updateTaskInSection(section.id, task.id, 'subGroup', selectedValue);
                            });
                          }}
                          disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.taskSubGroups || !section.tasks[0]?.group}
                        >
                          <MenuItem value="">Select Sub-Group</MenuItem>
                          {section.tasks[0]?.group && taskSubGroups[section.tasks[0].group] && taskSubGroups[section.tasks[0].group].map(subGroup => (
                            <MenuItem key={subGroup.id} value={subGroup.id.toString()}>{subGroup.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {loading.taskSubGroups && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Loading sub-groups...
                        </Typography>
                      )}
                      {!section.tasks[0]?.group && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Please select a group first
                        </Typography>
                      )}
                    </Box>
                  </Box>

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
                        {/* Close button for individual tasks - show for all tasks except the first task in the first section */}
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
                            <Close fontSize="small" />
                          </IconButton>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', gap: 4 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                  checked={task.mandatory}
                                  onChange={(e) => updateTaskInSection(section.id, task.id, 'mandatory', e.target.checked)}
                                  sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                />
                              }
                              label="Mandatory"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                  checked={task.helpText}
                                  onChange={(e) => updateTaskInSection(section.id, task.id, 'helpText', e.target.checked)}
                                  sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                />
                              }
                              label="Help Text"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={task.reading}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    updateTaskInSection(section.id, task.id, 'reading', isChecked);
                                    // Auto-select numeric input type when reading is checked and no template is selected
                                    if (isChecked && !formData.selectedTemplate) {
                                      updateTaskInSection(section.id, task.id, 'inputType', 'number');
                                    }
                                  }}
                                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                  sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                />
                              }
                              label="Reading"
                            />
                            {weightage && (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={task.rating}
                                    disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                    onChange={(e) => updateTaskInSection(section.id, task.id, 'rating', e.target.checked)}
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
                            disabled={stepIndex < activeStep && editingStep !== stepIndex}

                            label={<span>Task{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</span>}
                            placeholder="Enter Task"
                            fullWidth
                            value={task.task}
                            onChange={(e) => updateTaskInSection(section.id, task.id, 'task', e.target.value)}
                          />

                          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                            <InputLabel shrink>Input Type{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</InputLabel>
                            <Select
                              label="Input Type"
                              notched
                              displayEmpty
                              value={task.inputType || ''}
                              onChange={e => {
                                const value = e.target.value;
                                if (task.reading && !formData.selectedTemplate) return;
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
                              disabled={stepIndex < activeStep && editingStep !== stepIndex || (task.reading && !formData.selectedTemplate)}
                            >
                              <MenuItem value="">Select Input Type</MenuItem>
                              <MenuItem value="text">Text</MenuItem>
                              <MenuItem value="number">Numeric</MenuItem>
                              <MenuItem value="dropdown">Dropdown</MenuItem>
                              <MenuItem value="radio">Radio</MenuItem>
                              <MenuItem value="date">Date</MenuItem>
                              <MenuItem value="multiline">Multiline</MenuItem>
                              <MenuItem value="options-inputs">Options & Inputs</MenuItem>
                            </Select>
                          </FormControl>

                          {weightage && (
                            <TextField
                              disabled={stepIndex < activeStep && editingStep !== stepIndex}

                              label={<span>Weightage{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</span>}
                              type="number"
                              fullWidth
                              value={task.weightage}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (Number(value) < 0) return;
                                updateTaskInSection(section.id, task.id, 'weightage', value);
                              }}
                              inputProps={{
                                min: 0,
                                onWheel: (e) => (e.target as HTMLInputElement).blur(), // Disable wheel input
                              }}
                              placeholder="Enter weightage"
                            />
                          )}
                        </Box>

                        {task.helpText && (
                          <Box sx={{ mt: 2 }}>
                            <TextField
                              disabled={stepIndex < activeStep && editingStep !== stepIndex}
                              label="Help Text (Hint)"
                              placeholder="Enter help text or hint"
                              fullWidth
                              value={task.helpTextValue}
                              onChange={(e) => updateTaskInSection(section.id, task.id, 'helpTextValue', e.target.value)}
                            />

                            {/* File attachment for help text */}
                            <Box sx={{ mt: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  Help Text Attachments:
                                </Typography>
                                <MuiButton
                                  variant="outlined"
                                  size="small"
                                  startIcon={<AttachFile />}
                                  onClick={() => addHelpTextAttachment(section.id, task.id)}
                                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                  sx={{
                                    color: '#C72030',
                                    borderColor: '#C72030',
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    minWidth: 'auto',
                                    '&:hover': {
                                      borderColor: '#C72030',
                                      backgroundColor: 'rgba(199, 32, 48, 0.04)'
                                    }
                                  }}
                                >
                                  Add File
                                </MuiButton>
                              </Box>

                              {/* Display attached files */}
                              {task.helpTextAttachments && task.helpTextAttachments.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  {task.helpTextAttachments.map((attachment) => (
                                    <Box
                                      key={attachment.id}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 1,
                                        p: 1,
                                        border: '1px solid #E0E0E0',
                                        borderRadius: 1,
                                        backgroundColor: '#F9F9F9'
                                      }}
                                    >
                                      <AttachFile sx={{ fontSize: 16, color: '#666' }} />
                                      <Typography variant="body2" sx={{ flex: 1, fontSize: '12px' }}>
                                        {attachment.name}
                                      </Typography>
                                      <IconButton
                                        size="small"
                                        onClick={() => removeHelpTextAttachment(section.id, task.id, attachment.id)}
                                        disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                        sx={{
                                          color: '#ff4444',
                                          padding: '2px',
                                          '&:hover': {
                                            backgroundColor: 'rgba(255, 68, 68, 0.1)'
                                          }
                                        }}
                                      >
                                        <Close sx={{ fontSize: 14 }} />
                                      </IconButton>
                                    </Box>
                                  ))}
                                </Box>
                              )}
                            </Box>
                          </Box>
                        )}

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
                                    disabled={stepIndex < activeStep && editingStep !== stepIndex}

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
                                    <Select
                                      label="Type"
                                      notched
                                      displayEmpty
                                      value={value.type || ''}
                                      onChange={e => updateDropdownType(section.id, task.id, valueIndex, e.target.value)}
                                      disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                    >
                                      <MenuItem value="">Select Type</MenuItem>
                                      <MenuItem value="positive">P</MenuItem>
                                      <MenuItem value="negative">N</MenuItem>
                                    </Select>
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

                        {/* Enter Value Section for Radio */}
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
                                    checked={valueIndex === 0} // First option selected by default
                                    name={`radio-${section.id}-${task.id}`}
                                    sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                  />

                                  <TextField
                                    disabled={stepIndex < activeStep && editingStep !== stepIndex}

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
                                    <Select
                                      label="Type"
                                      notched
                                      displayEmpty
                                      value={value.type || ''}
                                      onChange={e => updateRadioType(section.id, task.id, valueIndex, e.target.value)}
                                      disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                    >
                                      <MenuItem value="">Select Type</MenuItem>
                                      <MenuItem value="positive">P</MenuItem>
                                      <MenuItem value="negative">N</MenuItem>
                                    </Select>
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

                        {/* Enter Value Section for Checkbox */}
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
                                  <Checkbox
                                    checked={task.checkboxSelectedStates?.[valueIndex] || false}
                                    onChange={(e) => updateCheckboxSelectedState(section.id, task.id, valueIndex, e.target.checked)}
                                    sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                                  />

                                  <TextField
                                    disabled={stepIndex < activeStep && editingStep !== stepIndex}
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

                        {/* Enter Value Section for Options & Inputs */}
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
                                    disabled={stepIndex < activeStep && editingStep !== stepIndex}

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
                                  + Add Option
                                </MuiButton>
                              </Box>
                            </Box>
                          </Box>
                        )}

                        {task.inputType === 'multiline' && (
                          <Box sx={{ mt: 2 }}>
                            {/* <TextField
                              disabled={stepIndex < activeStep && editingStep !== stepIndex}
                              label={<span>Multiline Text <span style={{ color: 'red' }}>*</span></span>}
                              placeholder="Enter multiline text"
                              fullWidth
                              multiline
                              rows={4}
                              value={task.textarea || ''}
                              onChange={(e) => updateTaskInSection(section.id, task.id, 'textarea', e.target.value)}
                              sx={{ mb: 3 }}
                            /> */}
                            <TextField
                              disabled={stepIndex < activeStep && editingStep !== stepIndex}
                              label={<span>Multiline Text <span style={{ color: 'red' }}>*</span></span>}
                              placeholder="Enter multiline text"
                              fullWidth
                              multiline
                              minRows={4} // better than rows
                              value={task.textarea || ''}
                              onChange={(e) => updateTaskInSection(section.id, task.id, 'textarea', e.target.value)}
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

                          </Box>
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
                      <Add className="w-4 h-4" />
                      Add Question
                    </button>
                    {(questionSections.length === 1 || sectionIndex === questionSections.length - 1) && (
                      <button
                        onClick={addQuestionSection}
                        className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-3 py-1 rounded-md hover:bg-[#f0ebe0] transition-colors"
                        style={{ fontFamily: 'Work Sans, sans-serif' }}
                      >
                        <Add className="w-4 h-4" />
                        Add Section
                      </button>
                    )}

                  </div>
                  {sectionIndex < questionSections.length - 1 && <hr className="my-6 border-t border-gray-200" />}
                </div>
              </div>
            ))}



          </div>
        );

      case 3: // Time Setup
        return (
          <TimeSetupStep
            data={timeSetupData}
            onChange={(field, value) => {
              setTimeSetupData(prev => ({ ...prev, [field]: value }));
            }}
            isCompleted={false}
            isCollapsed={false}
            disabled={3 < activeStep && editingStep !== 3}
            onEdit={() => {
              setActiveStep(3);
              setEditingStep(3);
            }}
          />
        );

      case 4: // Mapping
        return (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="border-l-4 border-l-[#C72030] p-4 sm:p-6 bg-white">
              <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-6" style={{ textTransform: 'uppercase' }}>
                <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                  <Cog className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
                MAPPING
              </div>

              <MappingStep
                data={checklistMappings}
                loading={loadingMappings}
                onChange={(mappingData) => {
                }}
                isCompleted={false}
                isCollapsed={false}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  {/* Navigation Buttons */ }
  <div className="flex justify-between items-center mt-6 pt-4 sm:pt-6">
    <div>
      {activeStep > 0 && (
        <button
          onClick={handleBack}
          className="border border-[#C72030] text-[#C72030] px-6 py-2 rounded-md hover:bg-[#C72030] hover:text-white transition-colors text-sm sm:text-base"
          style={{ fontFamily: 'Work Sans, sans-serif' }}
        >
          Back
        </button>
      )}
    </div>

    <div className="flex gap-4">
      {activeStep < steps.length - 1 ? (
        <>
          {activeStep === 3 ? ( // Time Setup step
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-[#C72030] text-white px-6 py-2 rounded-md hover:bg-[#B8252F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-[#C72030] text-white px-6 py-2 rounded-md hover:bg-[#B8252F] transition-colors text-sm sm:text-base"
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              Next
            </button>
          )}
        </>
      ) : (
        <button
          onClick={handleFinish}
          className="bg-[#C72030] text-white px-6 py-2 rounded-md hover:bg-[#B8252F] transition-colors text-sm sm:text-base"
          style={{ fontFamily: 'Work Sans, sans-serif' }}
        >
          Finish
        </button>
      )}
    </div>
  </div>

  const renderStepContent = () => {
    // Show only the current active step content
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          {renderSingleStep(activeStep)}
        </Box>
      </Box>
    );
  };

  const renderCompletedSections = () => {
    return (
      <Box sx={{ mt: 4 }}>
        {/* Progress Text */}
        <Box sx={{
          textAlign: 'center',
          mb: 3,
          fontFamily: 'Work Sans, sans-serif'
        }}>
          <Typography variant="body2" sx={{
            color: '#666',
            fontSize: '14px',
            fontWeight: 500
          }}>
            You've completed {completedSteps.length} out of {steps.length} steps.
          </Typography>
        </Box>

        {/* Completed Steps with Actual Content */}
        {completedSteps.length > 0 && (
          <Box>
            {completedSteps.map((stepIndex) => (
              <Box
                key={`completed-section-${stepIndex}`}
                sx={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: 0,
                  mb: 3,
                  overflow: 'hidden',
                  position: 'relative',
                }}
                className={editingStep !== stepIndex ? 'completed-section-disabled' : ''}
              >
                {renderSingleStep(stepIndex, editingStep !== stepIndex)}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  // Add function to fetch checklist mappings
  const fetchChecklistMappings = async (customCode: string) => {
    if (!customCode) return;

    setLoadingMappings(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/custom_forms/checklist_mappings.json?id=${customCode}`, {
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
      setChecklistMappings(data);
    } catch (error) {
      console.error('Failed to load checklist mappings:', error);
      toast.error("Failed to load checklist mappings.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setLoadingMappings(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            onClick={() => navigate('/maintenance/schedule')}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Schedule List</span>
          <span>{'>'}</span>
          <span className="text-gray-900 font-medium">Create New Schedule</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ADD SCHEDULE</h1>
      </div>

      {/* Custom Stepper - Bordered Box Design */}
      <Box sx={{ mb: 4 }}>
        {/* Main Stepper - Show all steps with proper progression */}
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
                    // content: `"${index + 1}."`,
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
      <div className="space-y-4 sm:space-y-6">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6 pt-4 sm:pt-6">
        <div>
          {activeStep > 0 && (
            <button
              onClick={handleBack}
              className="border border-[#C72030] text-[#C72030] px-6 py-2 rounded-md hover:bg-[#C72030] hover:text-white transition-colors text-sm sm:text-base"
              style={{ fontFamily: 'Work Sans, sans-serif', borderRadius: 0 }}
            >
              Back
            </button>
          )}
        </div>

        <div className="flex gap-4">
          {activeStep < steps.length - 1 ? (
            <>
              {activeStep === 3 ? ( // Time Setup step
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="bg-[#C72030] text-white px-6 py-2 rounded-md hover:bg-[#B8252F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  style={{ fontFamily: 'Work Sans, sans-serif', borderRadius: 0 }}
                >
                  {isSubmitting ? 'Saving...' : 'Save & Continue'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-[#C72030] text-white px-6 py-2 rounded-md hover:bg-[#B8252F] transition-colors text-sm sm:text-base"
                  style={{ fontFamily: 'Work Sans, sans-serif', borderRadius: 0 }}
                >
                  Next
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleFinish}
              className="bg-[#C72030] text-white px-6 py-2 rounded-md hover:bg-[#B8252F] transition-colors text-sm sm:text-base"
              style={{ fontFamily: 'Work Sans, sans-serif', borderRadius: 0 }}
            >
              Finish
            </button>
          )}
        </div>
      </div>

      {/* Completed Sections */}
      {renderCompletedSections()}
    </div>
  );

};
