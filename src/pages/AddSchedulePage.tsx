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

interface AttachmentFile {
  id: string;
  name: string;
  url: string;
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

  // Add attachment function
  const addAttachment = (): void => {
    // Create a hidden file input and trigger click
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    input.style.display = 'none';

    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const newAttachments: AttachmentFile[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // For now, just create a local URL for preview; in real app, upload to server
          newAttachments.push({
            id: `${Date.now()}-${i}`,
            name: file.name,
            url: URL.createObjectURL(file)
          });
        }
        setAttachments(prev => [...prev, ...newAttachments]);

        // Show success toast
        toast(`${files.length} file(s) attached successfully!`);
      }
    };

    input.onerror = () => {
      // Show error toast
      toast("Failed to attach files. Please try again.", {
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

  // Helper functions for managing radio values
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

  // Helper functions for managing checkbox values
  const updateCheckboxValue = (sectionId: string, taskId: string, valueIndex: number, value: string) => {
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  checkboxValues: task.checkboxValues.map((val, idx) =>
                    idx === valueIndex ? value : val
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

  const addCheckboxValue = (sectionId: string, taskId: string) => {
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

  const removeCheckboxValue = (sectionId: string, taskId: string, valueIndex: number) => {
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

  // Helper functions for managing options-inputs values
  const updateOptionsInputsValue = (sectionId: string, taskId: string, valueIndex: number, value: string) => {
    setQuestionSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            tasks: section.tasks.map(task =>
              task.id === taskId
                ? {
                  ...task,
                  optionsInputsValues: task.optionsInputsValues.map((val, idx) =>
                    idx === valueIndex ? value : val
                  )
                }
                : task
            )
          }
          : section
      )
    );
  };

  const addOptionsInputsValue = (sectionId: string, taskId: string) => {
    setQuestionSections(prevSections =>
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

  const removeOptionsInputsValue = (sectionId: string, taskId: string, valueIndex: number) => {
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
          background: '#10b981',
          color: 'white',
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
          background: '#10b981',
          color: 'white',
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
          await fetchChecklistMappings(result.custom_form_code);
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
        background: '#10b981',
        color: 'white',
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
    setLoading(prev => ({ ...prev, templates: true }));
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
          scheduleFor: mapChecklistFor(templateData.checklist_for)
        }));

        toast(`Template "${templateData.form_name}" loaded successfully!`);
      } else {
        // Handle case when template data is empty or invalid
        toast("Template data is empty or invalid.");
      }
    } catch (error) {
      console.error('Failed to load template data:', error);
      toast("Failed to load template data.");
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

    if (!formData.emailTriggerRule) {
      errors['emailTriggerRule'] = 'Email Trigger Rule is required';
    }

    if (!formData.scanType) {
      errors['scanType'] = 'Scan Type is required';
    }

    if (!formData.category) {
      errors['category'] = 'Category is required';
    }

    // Submission time validation
    if (!formData.submissionTime) {
      errors['submissionTime'] = 'Submission Time type is required';
    }
    if (formData.submissionTime && !formData.submissionTimeValue) {
      errors['submissionTimeValue'] = 'Submission Time value is required when time type is selected';
    }

    if (!formData.supervisors) {
      errors['supervisors'] = 'Supervisors selection is required';
    }

    if (!formData.lockOverdueTask) {
      errors['lockOverdueTask'] = 'Lock Overdue Task selection is required';
    }

    if (!formData.frequency) {
      errors['frequency'] = 'Frequency is required';
    }

    // Grace time validation
    if (!formData.graceTime) {
      errors['graceTime'] = 'Grace Time type is required';
    }
    if (formData.graceTime && !formData.graceTimeValue) {
      errors['graceTimeValue'] = 'Grace Time value is required when time type is selected';
    }

    if (!formData.supplier) {
      errors['supplier'] = 'Supplier selection is required';
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
      if (!section.title.trim()) {
        errors[`section_${sectionIndex}_title`] = `Section ${sectionIndex + 1} title is required`;
      }

      const validTasks = section.tasks.filter(task => task.task.trim());
      if (validTasks.length === 0) {
        errors[`section_${sectionIndex}_tasks`] = `Section ${sectionIndex + 1} must have at least one task with content`;
      }

      // Validate each task
      section.tasks.forEach((task, taskIndex) => {
        if (task.task.trim()) {
          if (!task.inputType) {
            errors[`section_${sectionIndex}_task_${taskIndex}_inputType`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} must have an input type selected`;
          }

          if (task.helpText && !task.helpTextValue.trim()) {
            errors[`section_${sectionIndex}_task_${taskIndex}_helpTextValue`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} help text value is required when help text is enabled`;
          }

          if (weightage && task.rating && !task.weightage) {
            errors[`section_${sectionIndex}_task_${taskIndex}_weightage`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} weightage is required when rating is enabled`;
          }

          // Validate input type specific values
          if (task.inputType === 'dropdown' && task.dropdownValues.some(val => !val.label.trim())) {
            errors[`section_${sectionIndex}_task_${taskIndex}_dropdownValues`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} dropdown must have all option values filled`;
          }

          if (task.inputType === 'radio' && task.radioValues.some(val => !val.label.trim())) {
            errors[`section_${sectionIndex}_task_${taskIndex}_radioValues`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} radio must have all option values filled`;
          }

          if (task.inputType === 'checkbox' && task.checkboxValues.some(val => !val.trim())) {
            errors[`section_${sectionIndex}_task_${taskIndex}_checkboxValues`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} checkbox must have all option values filled`;
          }

          if (task.inputType === 'options-inputs' && task.optionsInputsValues.some(val => !val.trim())) {
            errors[`section_${sectionIndex}_task_${taskIndex}_optionsInputsValues`] = `Task ${taskIndex + 1} in Section ${sectionIndex + 1} options & inputs must have all values filled`;
          }
        } else if (section.tasks.length === 1) {
          // If there's only one task and it's empty, require it to be filled
          errors[`section_${sectionIndex}_task_${taskIndex}_task`] = `Section ${sectionIndex + 1} must have at least one task filled`;
        }
      });

      // Auto ticket validation
      if (section.autoTicket) {
        if (!section.ticketAssignedTo) {
          errors[`section_${sectionIndex}_ticketAssignedTo`] = `Section ${sectionIndex + 1} auto ticket assigned to is required`;
        }
        if (!section.ticketCategory) {
          errors[`section_${sectionIndex}_ticketCategory`] = `Section ${sectionIndex + 1} auto ticket category is required`;
        }
      }
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
      case 2:
        isValid = validateQuestionSetup().length === 0;
        break;
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
          background: '#10b981',
          color: 'white',
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
              background: '#10b981',
              color: 'white',
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
      const sectionTasks = section.tasks.filter(task => task.task.trim());
      if (sectionTasks.length > 0) {
        customForm[`question_for_${index + 1}`] = sectionTasks.map(task => task.task);
      }
    });

    // Get selected asset IDs or service IDs based on scheduleFor
    const assetIds = formData.scheduleFor === 'Asset' && formData.checklistType === 'Individual' ? formData.asset : [];
    const serviceIds = formData.scheduleFor === 'Service' && formData.checklistType === 'Individual' ? formData.service : []  ;

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
      schedule_type: formData.type.toLowerCase(),
      pms_custom_form: {
        // pms_site_id: "7", // This should come from context/auth
        created_source: "form",
        create_ticket: autoTicket ? "1" : "0",
        ticket_level: formData.ticketLevel,
        task_assigner_id: formData.ticketAssignedTo || "",
        helpdesk_category_id: formData.ticketCategory || "",
        weightage_enabled: weightage ? "1" : "0",
        schedule_type: formData.type,
        form_name: formData.activityName,
        description: formData.description,
        // custom_form: customForm,
        supervisors: formData.supervisors ? [formData.supervisors] : [],
        submission_time_type: formData.submissionTime || "",
        submission_time_value: formData.submissionTimeValue || "",
        supplier_id: formData.supplier || ""
      },
      sch_type: formData.type.toLowerCase(),
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
        scan_type: formData.scanType || "",
        plan_type: formData.planDuration || "",
        plan_value: formData.planDurationValue || "",
        priority: "Low", // Default or from form
        category: formData.category || "",
        grace_time_type: formData.graceTime || "",
        grace_time_value: formData.graceTimeValue || "",
        overdue_task_start_status: formData.lockOverdueTask || "false",
        frequency: formData.frequency,
        start_date: formatDateToISO(formData.startFrom),
        end_date: formatDateToISO(formData.endAt)
      },
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
      expholder: ""
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
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
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

              label={<span>Activity Name <span style={{ color: 'currentColor' }}>*</span></span>}
              placeholder="Enter Activity Name"
              fullWidth
              value={formData.activityName}
              onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
              sx={{ mb: 3 }}
            />

            <TextField
              disabled={stepIndex < activeStep && editingStep !== stepIndex}

              label={<span>Description <span style={{ color: 'currentColor' }}>*</span></span>}
              placeholder="Enter Description/SOP"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 3 }}
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030' }}>
                Schedule Setup
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Checklist Type
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
            <Box sx={{ mb: 3 }}>
              <RadioGroup
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
                {
                  formData.scheduleFor === 'Asset' && (
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
                  )
                }
                
                {/* <FormControlLabel 
                    value="Branching" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Branching" 
                  /> */}
              </RadioGroup>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {/* Conditional Asset/Service Dropdown - Show based on scheduleFor */}
              {formData.scheduleFor === 'Asset' && formData.checklistType === 'Individual' && (
                <Box>
                  <Autocomplete
                    disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.assets}

                    multiple
                    options={assets || []}
                    getOptionLabel={(option) => option.name}
                    value={assets?.filter(asset => formData.asset.includes(asset.id.toString())) || []}
                    onChange={(event, newValue) => handleAutocompleteChange('asset', newValue)}
                    renderInput={(params) => (
                      <TextField
                        disabled={stepIndex < activeStep && editingStep !== stepIndex}

                        {...params}
                        label={
                          <span>
                            Select Assets <span style={{ color: 'currentColor' }}>*</span>
                          </span>
                        }
                        placeholder="Search and select assets..."
                      />
                    )}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.name}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    filterSelectedOptions
                  />
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
                  <Autocomplete
                    disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.services}

                    multiple
                    options={services || []}
                    getOptionLabel={(option) => option.service_name}
                    value={services?.filter(service => formData.service.includes(service.id.toString())) || []}
                    onChange={(event, newValue) => handleAutocompleteChange('service', newValue)}
                    renderInput={(params) => (
                      <TextField
                        disabled={stepIndex < activeStep && editingStep !== stepIndex}

                        {...params}
                        label={
                          <span>
                            Select Services <span style={{ color: 'currentColor' }}>*</span>
                          </span>
                        }
                        placeholder="Search and select services..."
                      />
                    )}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.service_name}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    filterSelectedOptions
                  />
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
                    <Autocomplete
                      disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.groups}

                      options={assetGroups.map(group => ({
                        id: group.id,
                        label: group.name,
                        value: group.id.toString()
                      }))}
                      getOptionLabel={(option) => option.label}
                      value={assetGroups.map(group => ({
                        id: group.id,
                        label: group.name,
                        value: group.id.toString()
                      })).find(option => option.value === formData.assetGroup) || null}
                      onChange={(event, newValue) => {
                        const selectedValue = newValue ? newValue.value : '';
                        handleAssetGroupChange(selectedValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          disabled={stepIndex < activeStep && editingStep !== stepIndex}

                          {...params}
                          label={
                            <span>
                              Asset Group <span style={{ color: 'currentColor' }}>*</span>
                            </span>
                          }
                          placeholder="Select Asset Group"
                          fullWidth
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
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
                        Select Asset Sub-Groups <span style={{ color: 'currentColor' }}>*</span>
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
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  options={[
                    { id: 'user', label: 'User', value: 'user' },
                    { id: 'group', label: 'Group', value: 'group' }
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: 'user', label: 'User', value: 'user' },
                    { id: 'group', label: 'Group', value: 'group' }
                  ].find(option => option.value === formData.assignToType) || null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, assignToType: selectedValue, selectedUsers: [], selectedGroups: [] });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={
                        <span>
                          Assign To <span style={{ color: 'currentColor' }}>*</span>
                        </span>
                      }
                      placeholder="Select Assign To"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              {/* Multi-select Users - Show when assignToType is 'user' */}
              {formData.assignToType === 'user' && (
                <Box>
                  <Autocomplete
                    disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.users}

                    multiple
                    options={users || []}
                    getOptionLabel={(option) => option.full_name}
                    value={users?.filter(user => formData.selectedUsers.includes(user.id.toString())) || []}
                    onChange={(event, newValue) => handleAutocompleteChange('selectedUsers', newValue)}
                    renderInput={(params) => (
                      <TextField
                        disabled={stepIndex < activeStep && editingStep !== stepIndex}

                        {...params}
                        label={
                          <span>
                            Select Users <span style={{ color: 'currentColor' }}>*</span>
                          </span>
                        }
                        placeholder="Search and select users..."
                      />
                    )}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.full_name}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    filterSelectedOptions
                  />
                </Box>
              )}

              {/* Multi-select Groups - Show when assignToType is 'group' */}
              {formData.assignToType === 'group' && (
                <FormControl fullWidth>
                  <InputLabel>
                    Select Groups <span style={{ color: 'currentColor' }}>*</span>
                  </InputLabel>
                  <Select
                    multiple
                    value={formData.selectedGroups}
                    onChange={(e) => handleMultiSelectChange('selectedGroups', e)}
                    input={<OutlinedInput label="Select Groups" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const group = groups.find(g => g.id.toString() === value);
                          return (
                            <Chip key={value} label={group?.name || value} size="small" />
                          );
                        })}
                      </Box>
                    )}
                    disabled={loading.groups}
                  >
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
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  options={users ? users.map(user => ({
                    id: user.id,
                    label: user.full_name,
                    value: user.id.toString()
                  })) : []}
                  getOptionLabel={(option) => option.label}
                  value={users ? users.map(user => ({
                    id: user.id,
                    label: user.full_name,
                    value: user.id.toString()
                  })).find(option => option.value === formData.backupAssignee) || null : null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, backupAssignee: selectedValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={<span>Backup Assignee <span style={{ color: 'currentColor' }}>*</span></span>}
                      placeholder="Select Backup Assignee"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                {loading.users && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading users...
                  </Typography>
                )}
              </Box>

              {/* Plan Duration with conditional input */}
              <Box>
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  options={[
                    { id: 'minutes', label: 'Minutes', value: 'minutes' },
                    { id: 'hour', label: 'Hour', value: 'hour' },
                    { id: 'day', label: 'Day', value: 'day' },
                    { id: 'week', label: 'Week', value: 'week' },
                    { id: 'month', label: 'Month', value: 'month' }
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: 'minutes', label: 'Minutes', value: 'minutes' },
                    { id: 'hour', label: 'Hour', value: 'hour' },
                    { id: 'day', label: 'Day', value: 'day' },
                    { id: 'week', label: 'Week', value: 'week' },
                    { id: 'month', label: 'Month', value: 'month' }
                  ].find(option => option.value === formData.planDuration) || null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, planDuration: selectedValue, planDurationValue: '' });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={<span>Plan Duration <span style={{ color: 'currentColor' }}>*</span></span>}
                      placeholder="Select Plan Duration"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              {/* Plan Duration Value Input - Show when duration type is selected */}
              {needsValueInput(formData.planDuration) && (
                <TextField
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  label={<span>Plan Duration ({formData.planDuration}) <span style={{ color: 'currentColor' }}>*</span></span>}
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
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.emailRules}

                  options={emailRules.map(rule => ({
                    id: rule.id,
                    label: rule.rule_name,
                    value: rule.id.toString()
                  }))}
                  getOptionLabel={(option) => option.label}
                  value={emailRules.map(rule => ({
                    id: rule.id,
                    label: rule.rule_name,
                    value: rule.id.toString()
                  })).find(option => option.value === formData.emailTriggerRule) || null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, emailTriggerRule: selectedValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={<span>Email Trigger Rule <span style={{ color: 'currentColor' }}>*</span></span>}
                      placeholder="Select Email Trigger Rule"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                {loading.emailRules && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading email rules...
                  </Typography>
                )}
              </Box>

              <Box>
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
                      label={<span>Scan Type <span style={{ color: 'currentColor' }}>*</span></span>}
                      placeholder="Select Scan Type"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              <Box>
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  options={[
                    { id: 'technical', label: 'Technical', value: 'technical' },
                    { id: 'non-technical', label: 'Non-Technical', value: 'non-technical' }
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: 'technical', label: 'Technical', value: 'technical' },
                    { id: 'non-technical', label: 'Non-Technical', value: 'non-technical' }
                  ].find(option => option.value === formData.category) || null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, category: selectedValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={<span>Category <span style={{ color: 'currentColor' }}>*</span></span>}
                      placeholder="Select Category"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              {/* Submission Time with conditional input */}
              <Box>
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  options={[
                    { id: 'minutes', label: 'Minutes', value: 'minutes' },
                    { id: 'hour', label: 'Hour', value: 'hour' },
                    { id: 'day', label: 'Day', value: 'day' },
                    { id: 'week', label: 'Week', value: 'week' }
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: 'minutes', label: 'Minutes', value: 'minutes' },
                    { id: 'hour', label: 'Hour', value: 'hour' },
                    { id: 'day', label: 'Day', value: 'day' },
                    { id: 'week', label: 'Week', value: 'week' }
                  ].find(option => option.value === formData.submissionTime) || null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, submissionTime: selectedValue, submissionTimeValue: '' });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={<span>Submission Time <span style={{ color: 'currentColor' }}>*</span></span>}
                      placeholder="Select Submission Time"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              {/* Submission Time Value Input - Show when time type is selected */}
              {needsValueInput(formData.submissionTime) && (
                <TextField
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  label={<span>Submission Time ({formData.submissionTime}) <span style={{ color: 'currentColor' }}>*</span></span>}
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
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.users}

                  options={users ? users.map(user => ({
                    id: user.id,
                    label: user.full_name,
                    value: user.id.toString()
                  })) : []}
                  getOptionLabel={(option) => option.label}
                  value={users ? users.map(user => ({
                    id: user.id,
                    label: user.full_name,
                    value: user.id.toString()
                  })).find(option => option.value === formData.supervisors) || null : null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, supervisors: selectedValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={<span>Supervisors <span style={{ color: 'currentColor' }}>*</span></span>}
                      placeholder="Select Supervisors"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                {loading.users && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading users...
                  </Typography>
                )}
              </Box>

              <Box>
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  options={[
                    { id: 'true', label: 'Yes', value: 'true' },
                    { id: 'false', label: 'No', value: 'false' }
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: 'true', label: 'Yes', value: 'true' },
                    { id: 'false', label: 'No', value: 'false' }
                  ].find(option => option.value === formData.lockOverdueTask) || null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, lockOverdueTask: selectedValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={<span>Lock Overdue Task <span style={{ color: 'currentColor' }}>*</span></span>}
                      placeholder="Select Lock Status"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              <Box>
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
              </Box>

              {/* Grace Time with conditional input */}
              <Box>
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  options={[
                    { id: 'minutes', label: 'Minutes', value: 'minutes' },
                    { id: 'hour', label: 'Hour', value: 'hour' },
                    { id: 'day', label: 'Day', value: 'day' },
                    { id: 'week', label: 'Week', value: 'week' }
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={[
                    { id: 'minutes', label: 'Minutes', value: 'minutes' },
                    { id: 'hour', label: 'Hour', value: 'hour' },
                    { id: 'day', label: 'Day', value: 'day' },
                    { id: 'week', label: 'Week', value: 'week' }
                  ].find(option => option.value === formData.graceTime) || null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, graceTime: selectedValue, graceTimeValue: '' });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label={<span>Grace Time <span style={{ color: 'currentColor' }}>*</span></span>}
                      placeholder="Select Grace Time"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              {/* Grace Time Value Input - Show when time type is selected */}
              {needsValueInput(formData.graceTime) && (
                <TextField
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}

                  label={`Grace Time (${formData.graceTime}) *`}
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
                <Autocomplete
                  disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.suppliers}

                  options={suppliers ? suppliers.map(supplier => ({
                    id: supplier.id,
                    label: supplier.name,
                    value: supplier.id.toString()
                  })) : []}
                  getOptionLabel={(option) => option.label}
                  value={suppliers ? suppliers.map(supplier => ({
                    id: supplier.id,
                    label: supplier.name,
                    value: supplier.id.toString()
                  })).find(option => option.value === formData.supplier) || null : null}
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.value : '';
                    setFormData({ ...formData, supplier: selectedValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      disabled={stepIndex < activeStep && editingStep !== stepIndex}

                      {...params}
                      label="Supplier *"
                      placeholder="Select Supplier"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                {loading.suppliers && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading suppliers...
                  </Typography>
                )}
              </Box>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={
                    <span>
                      Start From *
                    </span>
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }
                    }
                  }}
                  value={formData.startFrom ? new Date(formData.startFrom) : null}
                  onChange={(date) => {
  const newStartDate = date ? format(date, 'yyyy-MM-dd') : '';
  if (formData.endAt && newStartDate > formData.endAt) {
    setFormData({ ...formData, startFrom: newStartDate, endAt: '' });
  } else {
    setFormData({ ...formData, startFrom: newStartDate });
  }
}}

                  maxDate={formData.endAt ? new Date(formData.endAt) : undefined}
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End At *"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      },
                      error: formData.startFrom && formData.endAt && formData.endAt < formData.startFrom,
                      helperText: formData.startFrom && formData.endAt && formData.endAt < formData.startFrom
                        ? "End date cannot be before start date"
                        : ""
                    }
                  }}
                  value={formData.endAt ? new Date(formData.endAt) : null}
                  onChange={(date) => {
  const newEndDate = date ? format(date, 'yyyy-MM-dd') : '';
  if (formData.startFrom && newEndDate < formData.startFrom) {
    setFormData({ ...formData, endAt: newEndDate, startFrom: '' });
  } else {
    setFormData({ ...formData, endAt: newEndDate });
  }
}}

                  minDate={formData.startFrom ? new Date(formData.startFrom) : undefined}
                  disabled={stepIndex < activeStep && editingStep !== stepIndex}
                />
              </LocalizationProvider>
            </Box>
          </SectionCard>
        );

      case 2: // Question Setup
        function handleTemplateChange(templateId: string) {
          setFormData(prev => ({ ...prev, selectedTemplate: templateId }));
          if (templateId) {
            loadTemplateData(templateId);
          }
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

        function removeDropdownValue(sectionId: string, taskId: string, valueIndex: number): void {
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
        }

        function removeRadioValue(sectionId: string, taskId: string, valueIndex: number): void {
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
        }

        // Add helper functions for checkbox values
        function addCheckboxValue(sectionId: string, taskId: string): void {
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
        }

        function updateCheckboxValue(sectionId: string, taskId: string, valueIndex: number, value: string): void {
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
        }

        function updateCheckboxSelectedState(sectionId: string, taskId: string, valueIndex: number, checked: boolean): void {
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
        }

        function removeCheckboxValue(sectionId: string, taskId: string, valueIndex: number): void {
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
        }

        // Add helper functions for options & inputs values
        function addOptionsInputsValue(sectionId: string, taskId: string): void {
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
        }

        function updateOptionsInputsValue(sectionId: string, taskId: string, valueIndex: number, value: string): void {
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
        }

        function removeOptionsInputsValue(sectionId: string, taskId: string, valueIndex: number): void {
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
        }

        return (
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
                <button
                  onClick={addQuestionSection}
                  className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-3 py-1 rounded-md hover:bg-[#f0ebe0] transition-colors"
                  style={{ fontFamily: 'Work Sans, sans-serif' }}
                >
                  <Add className="w-4 h-4" />
                  Add Section
                </button>
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

    {(() => {
      const templateOptions = [
        ...(Array.isArray(templates) ? templates : []).map((template) => ({
          id: String(template?.id ?? ''),
          label: (template?.form_name ?? '').toString().trim(),
          value: String(template?.id ?? ''),
        })),
      ];

      console.log('Available Template Options:', templateOptions);

      const selectedTemplateValue = String(formData?.selectedTemplate ?? '');
      const selectedTemplate =
        templateOptions.find(
          (opt) =>
            opt &&
            typeof opt.value === 'string' &&
            opt.value === selectedTemplateValue
        ) ?? templateOptions[0];

      console.log('Current Selected Template:', selectedTemplate);

      return (
        <Autocomplete
          disableClearable
          options={templateOptions}
          getOptionLabel={(option) => {
            if (!option || typeof option !== 'object') return '';
            if (typeof option.label === 'string') return option.label;
            return '';
          }}
          isOptionEqualToValue={(option, value) => {
            if (!option || !value) return false;
            return String(option.value ?? '') === String(value.value ?? '');
          }}
          value={selectedTemplate || templateOptions[0]}
          onChange={(event, newValue) => {
            console.log('Template Selected by User:', newValue);
            if (newValue && typeof newValue.value !== 'undefined') {
              handleTemplateChange(newValue.value ?? '');
            }
          }}
          disabled={
            (stepIndex < activeStep && editingStep !== stepIndex) ||
            loading.templates
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                <span>
                  Template <span style={{ color: 'currentColor' }}>*</span>
                </span>
              }
              fullWidth
              disabled={stepIndex < activeStep && editingStep !== stepIndex}
            />
          )}
        />
      );
    })()}

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
                    ].find(option => option.value === formData.ticketAssignedTo) || null}
                    onChange={(event, newValue) => {
                      if (newValue) setFormData({ ...formData, ticketAssignedTo: newValue.value });
                    }}
                    renderInput={(params) => (
                      <TextField
                        disabled={stepIndex < activeStep && editingStep !== stepIndex}
                        {...params} label={<span>Assigned To <span style={{ color: 'currentColor' }}>*</span></span>} fullWidth />
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
                    ].find(option => option.value === formData.ticketCategory) || null}
                    onChange={(event, newValue) => {
                      if (newValue) setFormData({ ...formData, ticketCategory: newValue.value });
                    }}
                    renderInput={(params) => (
                      <TextField
                        disabled={stepIndex < activeStep && editingStep !== stepIndex}
                        {...params} label={<span>Category <span style={{ color: 'currentColor' }}>*</span></span>} fullWidth />
                    )}
                  />
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
              <div key={section.id} className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
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
                              {...params} label={<span>Assigned To <span style={{ color: 'currentColor' }}>*</span></span>} fullWidth />
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
                              {...params} label={<span>Category <span style={{ color: 'currentColor' }}>*</span></span>} fullWidth />
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
                      <Autocomplete
                        disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.taskGroups}

                        options={taskGroups ? taskGroups.map((group) => ({
                          id: group.id,
                          label: group.name,
                          value: group.id.toString()
                        })) : []}
                        getOptionLabel={(option) => option.label}
                        value={taskGroups ? taskGroups.map((group) => ({
                          id: group.id,
                          label: group.name,
                          value: group.id.toString()
                        })).find(option => option.value === (section.tasks[0]?.group || '')) || null : null}
                        onChange={(event, newValue) => {
                          const selectedValue = newValue ? newValue.value : '';
                          // Update group for all tasks in this section
                          section.tasks.forEach(task => {
                            handleTaskGroupChange(section.id, task.id, selectedValue);
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            disabled={stepIndex < activeStep && editingStep !== stepIndex}

                            {...params}
                            label="Group"
                            placeholder="Select Group"
                            fullWidth
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                      />
                      {loading.taskGroups && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Loading groups...
                        </Typography>
                      )}
                    </Box>

                    <Box>
                      <Autocomplete
                        disabled={stepIndex < activeStep && editingStep !== stepIndex || loading.taskSubGroups || !section.tasks[0]?.group}

                        options={section.tasks[0]?.group && taskSubGroups[section.tasks[0].group] ? taskSubGroups[section.tasks[0].group].map((subGroup) => ({
                          id: subGroup.id,
                          label: subGroup.name,
                          value: subGroup.id.toString()
                        })) : []}
                        getOptionLabel={(option) => option.label}
                        value={section.tasks[0]?.group && taskSubGroups[section.tasks[0].group] ? taskSubGroups[section.tasks[0].group].map((subGroup) => ({
                          id: subGroup.id,
                          label: subGroup.name,
                          value: subGroup.id.toString()
                        })).find(option => option.value === (section.tasks[0]?.subGroup || '')) || null : null}
                        onChange={(event, newValue) => {
                          const selectedValue = newValue ? newValue.value : '';
                          // Update sub-group for all tasks in this section
                          section.tasks.forEach(task => {
                            updateTaskInSection(section.id, task.id, 'subGroup', selectedValue);
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Sub-Group"
                            placeholder="Select Sub-Group"
                            fullWidth
                            disabled={stepIndex < activeStep && editingStep !== stepIndex}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                      />
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

                            label={<span>Task{task.mandatory && <span style={{ color: 'inherit' }}>&nbsp;*</span>}</span>}
                            placeholder="Enter Task"
                            fullWidth
                            value={task.task}
                            onChange={(e) => updateTaskInSection(section.id, task.id, 'task', e.target.value)}
                          />

                          <Autocomplete
                            disabled={stepIndex < activeStep && editingStep !== stepIndex || task.reading && !formData.selectedTemplate}

                            options={[
                              { id: '', label: 'Select Input Type', value: '' },
                              { id: 'text', label: 'Text', value: 'text' },
                              { id: 'number', label: 'Numeric', value: 'number' },
                              { id: 'dropdown', label: 'Dropdown', value: 'dropdown' },
                              { id: 'checkbox', label: 'Checkbox', value: 'checkbox' },
                              { id: 'radio', label: 'Radio', value: 'radio' },
                              { id: 'options-inputs', label: 'Options & Inputs', value: 'options-inputs' }
                            ]}
                            getOptionLabel={(option) => option.label}
                            value={[
                              { id: '', label: 'Select Input Type', value: '' },
                              { id: 'text', label: 'Text', value: 'text' },
                              { id: 'number', label: 'Numeric', value: 'number' },
                              { id: 'dropdown', label: 'Dropdown', value: 'dropdown' },
                              { id: 'checkbox', label: 'Checkbox', value: 'checkbox' },
                              { id: 'radio', label: 'Radio', value: 'radio' },
                              { id: 'options-inputs', label: 'Options & Inputs', value: 'options-inputs' }
                            ].find(option => option.value === task.inputType) || null}
                            onChange={(event, newValue) => {
                              if (!newValue) return;
                              // Prevent changing input type if reading is checked and no template is selected
                              if (task.reading && !formData.selectedTemplate) {
                                return;
                              }
                              updateTaskInSection(section.id, task.id, 'inputType', newValue.value);
                              // Reset values when changing input type
                              if (newValue.value !== 'dropdown') {
                                updateTaskInSection(section.id, task.id, 'dropdownValues', [{ label: '', type: 'positive' }]);
                              }
                              if (newValue.value !== 'radio') {
                                updateTaskInSection(section.id, task.id, 'radioValues', [{ label: '', type: 'positive' }]);
                              }
                              if (newValue.value !== 'checkbox') {
                                updateTaskInSection(section.id, task.id, 'checkboxValues', ['']);
                                updateTaskInSection(section.id, task.id, 'checkboxSelectedStates', [false]);
                              }
                              if (newValue.value !== 'options-inputs') {
                                updateTaskInSection(section.id, task.id, 'optionsInputsValues', ['']);
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                disabled={stepIndex < activeStep && editingStep !== stepIndex}
                                {...params} label={<span>Input Type{task.mandatory && <span style={{ color: 'inherit' }}>&nbsp;*</span>}</span>} fullWidth />
                            )}
                          />

                          {weightage && (
                            <TextField
                              disabled={stepIndex < activeStep && editingStep !== stepIndex}

                              label={<span>Weightage{task.mandatory && <span style={{ color: 'inherit' }}>&nbsp;*</span>}</span>}
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
                          </Box>
                        )}

                        {/* Enter Value Section for Dropdown */}
{task.inputType === 'dropdown' && (() => {
  // Always show Yes/No as first two options, then any additional user options
  let dropdownValues = Array.isArray(task.dropdownValues) ? [...task.dropdownValues] : [];
  // Ensure Yes/No are present and mapped
  if (!dropdownValues.length || dropdownValues.length < 2) {
    dropdownValues = [
      { label: 'Yes', type: 'positive' },
      { label: 'No', type: 'negative' },
      ...dropdownValues.filter(v => v.label !== 'Yes' && v.label !== 'No')
    ];
  } else {
    // If Yes/No are not present, prepend them
    if (!dropdownValues.some(v => v.label === 'Yes')) dropdownValues.unshift({ label: 'Yes', type: 'positive' });
    if (!dropdownValues.some(v => v.label === 'No')) dropdownValues.splice(1, 0, { label: 'No', type: 'negative' });
  }
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 0, padding: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
          Enter Value
        </Typography>

        {dropdownValues.map((value, valueIndex) => (
          <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <TextField
              disabled={stepIndex < activeStep && editingStep !== stepIndex}
              fullWidth
              size="small"
              placeholder="Enter option value"
              value={value.label}
              onChange={(e) => updateDropdownValue(section.id, task.id, valueIndex, e.target.value)}
              label={
                <span>
                  Option {task.mandatory && <span style={{ color: 'inherit' }}>*</span>}
                </span>
              }
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
            />

            <Autocomplete
              disabled={stepIndex < activeStep && editingStep !== stepIndex}
              options={[
                { id: 'positive', label: 'P', value: 'positive' },
                { id: 'negative', label: 'N', value: 'negative' }
              ]}
              getOptionLabel={(option) => option.label}
              value={
                ['positive', 'negative'].includes(value.type)
                  ? {
                      id: value.type,
                      label: value.type === 'positive' ? 'P' : 'N',
                      value: value.type
                    }
                  : null
              }
              onChange={(event, newValue) => {
                if (newValue) updateDropdownType(section.id, task.id, valueIndex, newValue.value);
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth label={<span>Type <span style={{ color: 'currentColor' }}>*</span></span>} />
              )}
              isOptionEqualToValue={(option, value) => option.value === value.value}
            />

            {dropdownValues.length > 1 && (
              <IconButton size="small" onClick={() => removeDropdownValue(section.id, task.id, valueIndex)} sx={{ color: '#C72030' }}>
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
  );
})()}

{/* Radio InputType */}
{task.inputType === 'radio' && (() => {
  // Always show Yes/No as first two options, then any additional user options
  let radioValues = Array.isArray(task.radioValues) ? [...task.radioValues] : [];
  if (!radioValues.length || radioValues.length < 2) {
    radioValues = [
      { label: 'Yes', type: 'positive' },
      { label: 'No', type: 'negative' },
      ...radioValues.filter(v => v.label !== 'Yes' && v.label !== 'No')
    ];
  } else {
    if (!radioValues.some(v => v.label === 'Yes')) radioValues.unshift({ label: 'Yes', type: 'positive' });
    if (!radioValues.some(v => v.label === 'No')) radioValues.splice(1, 0, { label: 'No', type: 'negative' });
  }
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 0, padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>Selected</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>Enter Value</Typography>
        </Box>

        {radioValues.map((value, valueIndex) => (
          <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <Radio
              checked={valueIndex === 0}
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
              label={
                <span>
                  Option {task.mandatory && <span style={{ color: 'inherit' }}>*</span>}
                </span>
              }
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
            />

            <Autocomplete
              size="small"
              disableClearable
              options={[
                { id: 'positive', label: 'P', value: 'positive' },
                { id: 'negative', label: 'N', value: 'negative' }
              ]}
              getOptionLabel={(option) => option.label}
              value={
                ['positive', 'negative'].includes(value.type)
                  ? {
                      id: value.type,
                      label: value.type === 'positive' ? 'P' : 'N',
                      value: value.type
                    }
                  : null
              }
              onChange={(_event, newValue) => {
                if (newValue) updateRadioType(section.id, task.id, valueIndex, newValue.value);
              }}
              renderInput={(params) => (
                <TextField {...params} label={<span>Type <span style={{ color: 'currentColor' }}>*</span></span>} fullWidth />
              )}
              isOptionEqualToValue={(option, value) => option.value === value.value}
            />

            {radioValues.length > 1 && (
              <IconButton size="small" onClick={() => removeRadioValue(section.id, task.id, valueIndex)} sx={{ color: '#C72030' }}>
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
  );
})()}

{/* Checkbox InputType */}
{task.inputType === 'checkbox' && (() => {
  // Always show Yes/No as first two options, then any additional user options
  let checkboxValues = Array.isArray(task.checkboxValues) ? [...task.checkboxValues] : [];
  if (!checkboxValues.length || checkboxValues.length < 2) {
    checkboxValues = ['Yes', 'No', ...checkboxValues.filter(v => v !== 'Yes' && v !== 'No')];
  } else {
    if (!checkboxValues.includes('Yes')) checkboxValues.unshift('Yes');
    if (!checkboxValues.includes('No')) checkboxValues.splice(1, 0, 'No');
  }
  const checkboxSelectedStates = (task.checkboxSelectedStates && task.checkboxSelectedStates.length === checkboxValues.length)
    ? task.checkboxSelectedStates
    : Array(checkboxValues.length).fill(false);
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 0, padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>Selected</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>Enter Value</Typography>
        </Box>

        {checkboxValues.map((value, valueIndex) => (
          <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <Checkbox
              checked={checkboxSelectedStates?.[valueIndex] || false}
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
              label={
                <span>
                  Option {task.mandatory && <span style={{ color: 'inherit' }}>*</span>}
                </span>
              }
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
            />

            {checkboxValues.length > 1 && (
              <IconButton size="small" onClick={() => removeCheckboxValue(section.id, task.id, valueIndex)} sx={{ color: '#C72030' }}>
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
  );
})()}

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
                                    label={<span>Option{task.mandatory && <span style={{ color: 'inherit' }}>&nbsp;*</span>}</span>}
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
                      </Box>
                    </Box>
                  ))}

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => addTaskToSection(section.id)}
                      className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-3 py-1 rounded-md hover:bg-[#f0ebe0] transition-colors"
                      style={{ fontFamily: 'Work Sans, sans-serif' }}
                    >
                      <Add className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>
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
              <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-6">
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
              className="bg-[#C72030] text-white px-6 py-2 rounded-md hover:bg-[#B8252F] transition-colors text-sm sm:text-base"
              style={{ fontFamily: 'Work Sans, sans-serif' }}
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-[#C72030] text-white px-6 py-2 hover:bg-[#B8252F] text-sm sm:text-base"
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
              className="border border-[#C72030] text-[#C72030] px-6 py-2 hover:bg-[#C72030] hover:text-white transition-colors text-sm sm:text-base"
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
                  className="bg-[#C72030] text-white px-6 py-2 hover:bg-[#B8252F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  style={{ fontFamily: 'Work Sans, sans-serif', borderRadius: 0 }}
                >
                  {isSubmitting ? 'Saving...' : 'Save & Continue'}
                </button>
              ) : (
                <button
  onClick={handleNext}
  className="bg-[#C72030] text-white px-6 py-2 hover:bg-[#B8252F] transition-colors text-sm sm:text-base"
  style={{ fontFamily: 'Work Sans, sans-serif', borderRadius: 0 }}
>
  Next
</button>
              )}
            </>
          ) : (
            <button
              onClick={handleFinish}
              className="bg-[#C72030] text-white px-6 py-2 hover:bg-[#B8252F] transition-colors text-sm sm:text-base"
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
