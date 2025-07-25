import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { MappingStep } from '@/components/schedule/MappingStep';
import {TimeSetupStep}  from '@/components/schedule/TimeSetupStep'
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
  dropdownValues: Array<{label: string, type: string}>;
  radioValues: Array<{label: string, type: string}>;
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
  const { toast } = useToast();

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
          dropdownValues: [{label: '', type: 'positive'}],
          radioValues: [{label: '', type: 'positive'}],
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
  // Add task groups state
  const [taskGroups, setTaskGroups] = useState<any[]>([]);
  const [taskSubGroups, setTaskSubGroups] = useState<{[key: string]: any[]}>({});
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

  // Add validation states
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast({
        title: "Error",
        description: "Failed to load assets. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load asset groups. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load asset sub-groups. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load email rules. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load users. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load suppliers. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load services. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load user groups. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load templates. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load helpdesk categories. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load task groups. Using fallback data.",
        variant: "destructive"
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
      toast({
        title: "Error",
        description: "Failed to load task sub-groups. Using fallback data.",
        variant: "destructive"
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
            dropdownValues: [{label: '', type: 'positive'}],
            radioValues: [{label: '', type: 'positive'}],
            checkboxValues: [''],
            checkboxSelectedStates: [false], // Add initial checkbox state
            optionsInputsValues: ['']
          }
        ]
      }
    ]);
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
                      dropdownValues: [...task.dropdownValues, {label: '', type: 'positive'}]
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
                      radioValues: [...task.radioValues, {label: '', type: 'positive'}]
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
                  dropdownValues: [{label: '', type: 'positive'}],
                  radioValues: [{label: '', type: 'positive'}],
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
  const mapChecklistFor = (checklistFor: string): string => {
    if (checklistFor.includes('Service')) return 'Service';
    if (checklistFor.includes('Asset')) return 'Asset';
    if (checklistFor.includes('Supplier')) return 'Supplier';
    if (checklistFor.includes('Training')) return 'Training';
    return 'Asset'; // default
  };

  // Add effect to validate current step whenever form data changes
  useEffect(() => {
    let errors: string[] = [];
    
    switch (activeStep) {
      case 0:
        errors = validateBasicConfiguration();
        break;
      case 1:
        errors = validateScheduleSetup();
        break;
      case 2:
        errors = validateQuestionSetup();
        break;
      default:
        errors = [];
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [activeStep]: errors
    }));
  }, [activeStep, formData, questionSections, weightage, autoTicket]);

  const handleSave = async () => {
    
    // Validate all sections before submission
    const basicErrors = validateBasicConfiguration();
    const scheduleErrors = validateScheduleSetup();
    const questionErrors = validateQuestionSetup();
    
    const allErrors = [...basicErrors, ...scheduleErrors, ...questionErrors];
    
    if (allErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fix the following errors: ${allErrors.join(', ')}`,
        variant: "destructive"
      });
      return;
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
      
      toast({
        title: "Success",
        description: "Schedule created successfully!",
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
        navigate('/maintenance/schedule');
      }
      
    } catch (error) {
      console.error('Failed to create schedule:', error);
      toast({
        title: "Error",
        description: "Failed to create schedule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchChecklistMappings(customCode);
  }, [customCode]);


  const handleFinish = () => {
    toast({
      title: "Success",
      description: "Schedule setup completed successfully!",
    });
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
          let dropdownValues = [{label: '', type: 'positive'}];
          let radioValues = [{label: '', type: 'positive'}];
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
        
        toast({
          title: "Success",
          description: `Template "${templateData.form_name}" loaded successfully!`,
        });
      }
    } catch (error) {
      console.error('Failed to load template data:', error);
      toast({
        title: "Error",
        description: "Failed to load template data.",
        variant: "destructive"
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

  // Validation functions for each section
  const validateBasicConfiguration = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.type) {
      errors.push('Type selection is required');
    }
    if (!formData.activityName.trim()) {
      errors.push('Activity Name is required');
    }
    if (!formData.description.trim()) {
      errors.push('Description is required');
    }
    
    return errors;
  };

  const validateScheduleSetup = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.checklistType) {
      errors.push('Checklist Type is required');
    }
    
    // Asset/Service validation based on scheduleFor and checklist type
    if (formData.scheduleFor === 'Asset' && formData.checklistType === 'Individual' && formData.asset.length === 0) {
      errors.push('At least one asset must be selected for Individual checklist type');
    }
    
    if (formData.scheduleFor === 'Service' && formData.service.length === 0) {
      errors.push('At least one service must be selected');
    }
    
    if (formData.checklistType === 'Asset Group') {
      if (!formData.assetGroup) {
        errors.push('Asset Group selection is required');
      }
      if (formData.assetSubGroup.length === 0) {
        errors.push('At least one Asset Sub-Group must be selected');
      }
    }
    
    // Assignment validation
    if (!formData.assignToType) {
      errors.push('Assign To type is required');
    }
    
    if (formData.assignToType === 'user' && formData.selectedUsers.length === 0) {
      errors.push('At least one user must be selected');
    }
    
    if (formData.assignToType === 'group' && formData.selectedGroups.length === 0) {
      errors.push('At least one group must be selected');
    }
    
    if (!formData.backupAssignee) {
      errors.push('Backup Assignee is required');
    }
    
    // Plan duration validation
    if (!formData.planDuration) {
      errors.push('Plan Duration type is required');
    }
    if (formData.planDuration && !formData.planDurationValue) {
      errors.push('Plan Duration value is required when duration type is selected');
    }
    
    if (!formData.emailTriggerRule) {
      errors.push('Email Trigger Rule is required');
    }
    
    if (!formData.scanType) {
      errors.push('Scan Type is required');
    }
    
    if (!formData.category) {
      errors.push('Category is required');
    }
    
    // Submission time validation
    if (!formData.submissionTime) {
      errors.push('Submission Time type is required');
    }
    if (formData.submissionTime && !formData.submissionTimeValue) {
      errors.push('Submission Time value is required when time type is selected');
    }
    
    if (!formData.supervisors) {
      errors.push('Supervisors selection is required');
    }
    
    if (!formData.lockOverdueTask) {
      errors.push('Lock Overdue Task selection is required');
    }
    
    if (!formData.frequency) {
      errors.push('Frequency is required');
    }
    
    // Grace time validation
    if (!formData.graceTime) {
      errors.push('Grace Time type is required');
    }
    if (formData.graceTime && !formData.graceTimeValue) {
      errors.push('Grace Time value is required when time type is selected');
    }
    
    if (!formData.supplier) {
      errors.push('Supplier selection is required');
    }
    
    if (!formData.startFrom) {
      errors.push('Start From date is required');
    }
    
    if (!formData.endAt) {
      errors.push('End At date is required');
    }
    
    // Date validation
    if (formData.startFrom && formData.endAt && formData.endAt < formData.startFrom) {
      errors.push('End date cannot be before start date');
    }
    
    return errors;
  };

  const validateQuestionSetup = (): string[] => {
    const errors: string[] = [];
    
    // Validate each section has at least one valid task
    questionSections.forEach((section, sectionIndex) => {
      if (!section.title.trim()) {
        errors.push(`Section ${sectionIndex + 1} title is required`);
      }
      
      const validTasks = section.tasks.filter(task => task.task.trim());
      if (validTasks.length === 0) {
        errors.push(`Section ${sectionIndex + 1} must have at least one task with content`);
      }
      
      // Validate each task
      section.tasks.forEach((task, taskIndex) => {
        if (task.task.trim()) {
          if (!task.group) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} must have a group selected`);
          }
          
          if (!task.subGroup) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} must have a sub-group selected`);
          }
          
          if (!task.inputType) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} must have an input type selected`);
          }
          
          if (task.helpText && !task.helpTextValue.trim()) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} help text value is required when help text is enabled`);
          }
          
          if (weightage && task.rating && !task.weightage) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} weightage is required when rating is enabled`);
          }
          
          // Validate input type specific values
          if (task.inputType === 'dropdown' && task.dropdownValues.some(val => !val.label.trim())) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} dropdown must have all option values filled`);
          }
          
          if (task.inputType === 'radio' && task.radioValues.some(val => !val.label.trim())) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} radio must have all option values filled`);
          }
          
          if (task.inputType === 'checkbox' && task.checkboxValues.some(val => !val.trim())) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} checkbox must have all option values filled`);
          }
          
          if (task.inputType === 'options-inputs' && task.optionsInputsValues.some(val => !val.trim())) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} options & inputs must have all values filled`);
          }
        } else if (section.tasks.length === 1) {
          // If there's only one task and it's empty, require it to be filled
          errors.push(`Section ${sectionIndex + 1} must have at least one task filled`);
        }
      });
      
      // Auto ticket validation
      if (section.autoTicket) {
        if (!section.ticketAssignedTo) {
          errors.push(`Section ${sectionIndex + 1} auto ticket assigned to is required`);
        }
        if (!section.ticketCategory) {
          errors.push(`Section ${sectionIndex + 1} auto ticket category is required`);
        }
      }
    });
    
    return errors;
  };

  const validateTimeSetup = (): string[] => {
    const errors: string[] = [];
    
    // Validate hour settings
    if (timeSetupData.hourMode === 'specific' && timeSetupData.selectedHours.length === 0) {
      errors.push('At least one hour must be selected when using specific hours');
    }
    
    // Validate minute settings
    if (timeSetupData.minuteMode === 'specific' && timeSetupData.selectedMinutes.length === 0) {
      errors.push('At least one minute must be selected when using specific minutes');
    }
    
    if (timeSetupData.minuteMode === 'between') {
      if (!timeSetupData.betweenMinuteStart || !timeSetupData.betweenMinuteEnd) {
        errors.push('Both start and end minutes are required for between minute range');
      }
    }
    
    // Validate day settings
    if (timeSetupData.dayMode === 'weekdays' && timeSetupData.selectedWeekdays.length === 0) {
      errors.push('At least one weekday must be selected when using specific weekdays');
    }
    
    if (timeSetupData.dayMode === 'specific' && timeSetupData.selectedDays.length === 0) {
      errors.push('At least one day must be selected when using specific days');
    }
    
    // Validate month settings
    if (timeSetupData.monthMode === 'specific' && timeSetupData.selectedMonths.length === 0) {
      errors.push('At least one month must be selected when using specific months');
    }
    
    if (timeSetupData.monthMode === 'between') {
      if (!timeSetupData.betweenMonthStart || !timeSetupData.betweenMonthEnd) {
        errors.push('Both start and end months are required for between month range');
      }
    }
    
    return errors;
  };

  const validateCurrentStep = (): boolean => {
    let errors: string[] = [];
    
    switch (activeStep) {
      case 0:
        errors = validateBasicConfiguration();
        break;
      case 1:
        errors = validateScheduleSetup();
        break;
      case 2:
        errors = validateQuestionSetup();
        break;
      case 3:
        errors = validateTimeSetup();
        break;
      default:
        errors = [];
    }
    
    // Always update validation errors for the current step
    setValidationErrors(prev => ({
      ...prev,
      [activeStep]: errors
    }));
    
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  // Add effect to validate current step whenever form data changes
  useEffect(() => {
    let errors: string[] = [];
    
    switch (activeStep) {
      case 0:
        errors = validateBasicConfiguration();
        break;
      case 1:
        errors = validateScheduleSetup();
        break;
      case 2:
        errors = validateQuestionSetup();
        break;
      case 3:
        errors = validateTimeSetup();
        break;
      default:
        errors = [];
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [activeStep]: errors
    }));
  }, [activeStep, formData, questionSections, timeSetupData, weightage, autoTicket]);

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    // Mark current step as completed
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
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
      // Going backwards - remove completion status from steps after the clicked step
      setCompletedSteps(completedSteps.filter(stepIndex => stepIndex < step));
    } else if (step > activeStep) {
      // Going forwards - mark current step as completed
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps([...completedSteps, activeStep]);
      }
    }
    setActiveStep(step);
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
      const weekdayMap: {[key: string]: string} = {
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
      const monthMap: {[key: string]: string} = {
        'January': '1', 'February': '2', 'March': '3', 'April': '4',
        'May': '5', 'June': '6', 'July': '7', 'August': '8',
        'September': '9', 'October': '10', 'November': '11', 'December': '12'
      };
      month = timeSetupData.selectedMonths.map(m => monthMap[m]).join(',');
    } else if (timeSetupData.monthMode === 'between') {
      const monthMap: {[key: string]: number} = {
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
    const serviceIds = formData.scheduleFor === 'Service' ? formData.service : [];

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

  const renderSingleStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Basic Configuration
        function addAttachment(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
          // Create a hidden file input and trigger click
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = '*/*';
          input.style.display = 'none';

          input.onchange = (e: Event) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) {
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
            }
          };

          document.body.appendChild(input);
          input.click();
          // Clean up after selection
          input.remove();
        }

        return (
          <SectionCard style={{ padding: '24px', margin: 0, borderRadius:'3px' }} >
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
                  marginBottm:'2'
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
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Type</Typography>
              <RadioGroup
                row
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
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
                <FormControlLabel 
                  value="Audit" 
                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                  label="Audit" 
                />
              </RadioGroup>
            </Box>
            
            <TextField
              label="Activity Name"
              placeholder="Enter Activity Name"
              fullWidth
              value={formData.activityName}
              onChange={(e) => setFormData({...formData, activityName: e.target.value})}
              sx={{ mb: 3 }}
            />
            
            <TextField
              label="Description"
              placeholder="Enter Description/SOP"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              sx={{ mb: 3 }}
            />
            
            {/* Add Attachment Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <RedButton 
                startIcon={<AttachFile />}
                onClick={addAttachment}
              >
                Add Attachment
              </RedButton>
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
          <SectionCard style={{ padding: '24px', margin: 0, borderRadius:'3px' }}>
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
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Checklist Type</Typography>
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
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Individual" 
                  />
                  <FormControlLabel 
                    value="Asset Group" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Asset Group" 
                  />
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
                      multiple
                      options={assets || []}
                      getOptionLabel={(option) => option.name}
                      value={assets?.filter(asset => formData.asset.includes(asset.id.toString())) || []}
                      onChange={(event, newValue) => handleAutocompleteChange('asset', newValue)}
                      disabled={loading.assets}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Assets"
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
                {formData.scheduleFor === 'Service' && (
                  <Box>
                    <Autocomplete
                      multiple
                      options={services || []}
                      getOptionLabel={(option) => option.service_name}
                      value={services?.filter(service => formData.service.includes(service.id.toString())) || []}
                      onChange={(event, newValue) => handleAutocompleteChange('service', newValue)}
                      disabled={loading.services}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Services"
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
                    <MuiSearchableDropdown
                      label="Asset Group"
                      value={formData.assetGroup || ''}
                      onChange={(value) => handleAssetGroupChange(value.toString())}
                      options={assetGroups.map(group => ({
                        id: group.id,
                        label: group.name,
                        value: group.id.toString()
                      }))}
                      placeholder="Select Asset Group"
                      disabled={loading.groups}
                      loading={loading.groups}
                      loadingText="Loading asset groups..."
                      fullWidth
                    />

                    {/* Asset Sub-Group Dropdown - Show when Asset Group is selected */}
                    {selectedAssetGroup && (
                      <FormControl fullWidth>
                        <InputLabel>Select Asset Sub-Groups</InputLabel>
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
                <MuiSearchableDropdown
                  label="Assign To"
                  value={formData.assignToType}
                  onChange={(value) => setFormData({...formData, assignToType: value.toString(), selectedUsers: [], selectedGroups: []})}
                  options={[
                    { id: 'user', label: 'User', value: 'user' },
                    { id: 'group', label: 'Group', value: 'group' }
                  ]}
                  placeholder="Select Assign To"
                  fullWidth
                />

                {/* Multi-select Users - Show when assignToType is 'user' */}
                {formData.assignToType === 'user' && (
                  <Box>
                    <Autocomplete
                      multiple
                      options={users || []}
                      getOptionLabel={(option) => option.full_name}
                      value={users?.filter(user => formData.selectedUsers.includes(user.id.toString())) || []}
                      onChange={(event, newValue) => handleAutocompleteChange('selectedUsers', newValue)}
                      disabled={loading.users}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Users"
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
                    <InputLabel>Select Groups</InputLabel>
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
                
                <MuiSearchableDropdown
                  label="Backup Assignee"
                  value={formData.backupAssignee}
                  onChange={(value) => setFormData({...formData, backupAssignee: value.toString()})}
                  options={users ? users.map(user => ({
                    id: user.id,
                    label: user.full_name,
                    value: user.id.toString()
                  })) : []}
                  placeholder="Select Backup Assignee"
                  disabled={loading.users}
                  loading={loading.users}
                  loadingText="Loading users..."
                  fullWidth
                />
                
                {/* Plan Duration with conditional input */}
                <MuiSearchableDropdown
                  label="Plan Duration"
                  value={formData.planDuration}
                  onChange={(value) => setFormData({...formData, planDuration: value.toString(), planDurationValue: ''})}
                  options={[
                    { id: 'minutes', label: 'Minutes', value: 'minutes' },
                    { id: 'hour', label: 'Hour', value: 'hour' },
                    { id: 'day', label: 'Day', value: 'day' },
                    { id: 'week', label: 'Week', value: 'week' },
                    { id: 'month', label: 'Month', value: 'month' }
                  ]}
                  placeholder="Select Plan Duration"
                  fullWidth
                />

                {/* Plan Duration Value Input - Show when duration type is selected */}
                {needsValueInput(formData.planDuration) && (
                  <TextField
                    label={`Plan Duration (${formData.planDuration})`}
                    type="number"
                    fullWidth
                    value={formData.planDurationValue}
                    onChange={(e) => setFormData({...formData, planDurationValue: e.target.value})}
                    placeholder={`Enter number of ${formData.planDuration}`}
                  />
                )}
                
                <MuiSearchableDropdown
                  label="Email Trigger Rule"
                  value={formData.emailTriggerRule}
                  onChange={(value) => setFormData({...formData, emailTriggerRule: value.toString()})}
                  options={emailRules.map(rule => ({
                    id: rule.id,
                    label: rule.rule_name,
                    value: rule.id.toString()
                  }))}
                  placeholder="Select Email Trigger Rule"
                  disabled={loading.emailRules}
                  loading={loading.emailRules}
                  loadingText="Loading email rules..."
                  fullWidth
                />
                
                <MuiSearchableDropdown
                  label="Scan Type"
                  value={formData.scanType}
                  onChange={(value) => setFormData({...formData, scanType: value.toString()})}
                  options={[
                    { id: 'qr', label: 'QR', value: 'qr' },
                    { id: 'nfc', label: 'NFC', value: 'nfc' }
                  ]}
                  placeholder="Select Scan Type"
                  fullWidth
                />
                
                <MuiSearchableDropdown
                  label="Category"
                  value={formData.category}
                  onChange={(value) => setFormData({...formData, category: value.toString()})}
                  options={[
                    { id: 'technical', label: 'Technical', value: 'technical' },
                    { id: 'non-technical', label: 'Non-Technical', value: 'non-technical' }
                  ]}
                  placeholder="Select Category"
                  fullWidth
                />
                
                {/* Submission Time with conditional input */}
                <MuiSearchableDropdown
                  label="Submission Time"
                  value={formData.submissionTime}
                  onChange={(value) => setFormData({...formData, submissionTime: value.toString(), submissionTimeValue: ''})}
                  options={[
                    { id: 'minutes', label: 'Minutes', value: 'minutes' },
                    { id: 'hour', label: 'Hour', value: 'hour' },
                    { id: 'day', label: 'Day', value: 'day' },
                    { id: 'week', label: 'Week', value: 'week' }
                  ]}
                  placeholder="Select Submission Time"
                  fullWidth
                />

                {/* Submission Time Value Input - Show when time type is selected */}
                {needsValueInput(formData.submissionTime) && (
                  <TextField
                    label={`Submission Time (${formData.submissionTime})`}
                    type="number"
                    fullWidth
                    value={formData.submissionTimeValue}
                    onChange={(e) => setFormData({...formData, submissionTimeValue: e.target.value})}
                    placeholder={`Enter number of ${formData.submissionTime}`}
                  />
                )}
                
                <MuiSearchableDropdown
                  label="Supervisors"
                  value={formData.supervisors}
                  onChange={(value) => setFormData({...formData, supervisors: value.toString()})}
                  options={users ? users.map(user => ({
                    id: user.id,
                    label: user.full_name,
                    value: user.id.toString()
                  })) : []}
                  placeholder="Select Supervisors"
                  disabled={loading.users}
                  loading={loading.users}
                  loadingText="Loading users..."
                  fullWidth
                />
                
                <MuiSearchableDropdown
                  label="Lock Overdue Task"
                  value={formData.lockOverdueTask}
                  onChange={(value) => setFormData({...formData, lockOverdueTask: value.toString()})}
                  options={[
                    { id: 'true', label: 'Yes', value: 'true' },
                    { id: 'false', label: 'No', value: 'false' }
                  ]}
                  placeholder="Select Lock Status"
                  fullWidth
                />
                
                <MuiSearchableDropdown
                  label="Frequency"
                  value={formData.frequency}
                  onChange={(value) => setFormData({...formData, frequency: value.toString()})}
                  options={[
                    { id: 'Daily', label: 'Daily', value: 'Daily' },
                    { id: 'Weekly', label: 'Weekly', value: 'Weekly' },
                    { id: 'Monthly', label: 'Monthly', value: 'Monthly' },
                    { id: 'Quarterly', label: 'Quarterly', value: 'Quarterly' },
                    { id: 'Half Yearly', label: 'Half Yearly', value: 'Half Yearly' },
                    { id: 'Yearly', label: 'Yearly', value: 'Yearly' }
                  ]}
                  placeholder="Select Frequency"
                  fullWidth
                />
                
                {/* Grace Time with conditional input */}
                <MuiSearchableDropdown
                  label="Grace Time"
                  value={formData.graceTime}
                  onChange={(value) => setFormData({...formData, graceTime: value.toString(), graceTimeValue: ''})}
                  options={[
                    { id: 'minutes', label: 'Minutes', value: 'minutes' },
                    { id: 'hour', label: 'Hour', value: 'hour' },
                    { id: 'day', label: 'Day', value: 'day' },
                    { id: 'week', label: 'Week', value: 'week' }
                  ]}
                  placeholder="Select Grace Time"
                  fullWidth
                />

                {/* Grace Time Value Input - Show when time type is selected */}
                {needsValueInput(formData.graceTime) && (
                  <TextField
                    label={`Grace Time (${formData.graceTime})`}
                    type="number"
                    fullWidth
                    value={formData.graceTimeValue}
                    onChange={(e) => setFormData({...formData, graceTimeValue: e.target.value})}
                    placeholder={`Enter number of ${formData.graceTime}`}
                  />
                )}
                
                <MuiSearchableDropdown
                  label="Supplier"
                  value={formData.supplier}
                  onChange={(value) => setFormData({...formData, supplier: value.toString()})}
                  options={suppliers ? suppliers.map(supplier => ({
                    id: supplier.id,
                    label: supplier.name,
                    value: supplier.id.toString()
                  })) : []}
                  placeholder="Select Supplier"
                  disabled={loading.suppliers}
                  loading={loading.suppliers}
                  loadingText="Loading suppliers..."
                  fullWidth
                />

                <TextField
                  label="Start From"
                  type="date"
                  fullWidth
                  value={formData.startFrom}
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    // If end date exists and new start date is after end date, clear end date
                    if (formData.endAt && newStartDate > formData.endAt) {
                      setFormData({...formData, startFrom: newStartDate, endAt: ''});
                    } else {
                      setFormData({...formData, startFrom: newStartDate});
                    }
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: formData.endAt || undefined
                  }}
                />
                
                <TextField
                  label="End At"
                  type="date"
                  fullWidth
                  value={formData.endAt}
                  onChange={(e) => {
                    const newEndDate = e.target.value;
                    // If start date exists and new end date is before start date, clear start date
                    if (formData.startFrom && newEndDate < formData.startFrom) {
                      setFormData({...formData, endAt: newEndDate, startFrom: ''});
                    } else {
                      setFormData({...formData, endAt: newEndDate});
                    }
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: formData.startFrom || undefined
                  }}
                  error={formData.startFrom && formData.endAt && formData.endAt < formData.startFrom}
                  helperText={
                    formData.startFrom && formData.endAt && formData.endAt < formData.startFrom
                      ? "End date cannot be before start date"
                      : ""
                  }
                />
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
                  idx === valueIndex ? {...v, label: value} : v
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
                  idx === valueIndex ? {...v, type: type} : v
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
                dropdownValues: [...task.dropdownValues, {label: '', type: 'positive'}]
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
                              idx === valueIndex ? {...v, label: value} : v
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
                              idx === valueIndex ? {...v, type: type} : v
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
                        ? { ...task, radioValues: [...task.radioValues, {label: '', type: 'positive'}] }
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
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
              <div className=" p-4 sm:p-6 bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <Cog className="w-3 h-3 sm:w-4 sm:h-4" />
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
                      <span className="text-sm text-gray-600 ml-2" style={{ fontFamily: 'Work Sans, sans-serif' }}>Create New</span>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Sections based on toggles */}
            
            {/* Create New Template Section */}
            {createNew && (
              <SectionCard style={{ padding: '24px', margin: 0, borderRadius:'3px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Select Template
                </Typography>
                <MuiSearchableDropdown
                  value={formData.selectedTemplate}
                  onChange={(value) => handleTemplateChange(value.toString())}
                  options={[
                    { id: '', label: 'Select Template', value: '' },
                    ...(templates ? templates.map((template) => ({
                      id: template.id.toString(),
                      label: template.form_name,
                      value: template.id.toString()
                    })) : [])
                  ]}
                  label="Template"
                  disabled={loading.templates}
                />
                {loading.templates && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading templates...
                  </Typography>
                )}
                
              </SectionCard>
            )}

            {/* Auto Ticket Configuration Section */}
            {autoTicket && (
              <SectionCard style={{ padding: '24px', margin: 0, borderRadius:'3px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Auto Ticket Configuration
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Ticket Level</Typography>
                    <RadioGroup
                      row
                      value={formData.ticketLevel}
                      onChange={(e) => setFormData({...formData, ticketLevel: e.target.value})}
                    >
                      <FormControlLabel 
                        value="checklist" 
                        control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                        label="Checklist Level" 
                      />
                      <FormControlLabel 
                        value="question" 
                        control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                        label="Question Level" 
                      />
                    </RadioGroup>
                  </Box>
                  
                  <MuiSearchableDropdown
                    value={formData.ticketAssignedTo}
                    onChange={(value) => setFormData({...formData, ticketAssignedTo: value.toString()})}
                    options={[
                      { id: '', label: 'Select Assigned To', value: '' },
                      ...users.map((user) => ({
                        id: user.id.toString(),
                        label: user.full_name,
                        value: user.id.toString()
                      }))
                    ]}
                    label="Assigned To"
                    disabled={loading.users}
                  />
                  
                  <MuiSearchableDropdown
                    value={formData.ticketCategory}
                    onChange={(value) => setFormData({...formData, ticketCategory: value.toString()})}
                    options={[
                      { id: '', label: 'Select Category', value: '' },
                      ...helpdeskCategories.map((category) => ({
                        id: category.id.toString(),
                        label: category.name,
                        value: category.id.toString()
                      }))
                    ]}
                    label="Category"
                    disabled={loading.helpdeskCategories}
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
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                      className="text-lg font-semibold text-[#C72030] bg-transparent border-none border-b-2 border-[#C72030] focus:outline-none focus:border-[#C72030] px-0"
                      style={{ fontFamily: 'Work Sans, sans-serif' }}
                      placeholder="Section Title"
                    />
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
                            control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                            label="Checklist Level" 
                          />
                          <FormControlLabel 
                            value="question" 
                            control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                            label="Question Level" 
                          />
                        </RadioGroup>
                      </Box>
                      
                      <MuiSearchableDropdown
                        value={section.ticketAssignedTo}
                        onChange={(value) => updateSectionProperty(section.id, 'ticketAssignedTo', value)}
                        options={[
                          { id: '', label: 'Select Assigned To', value: '' },
                          ...users.map((user) => ({
                            id: user.id.toString(),
                            label: user.full_name,
                            value: user.id.toString()
                          }))
                        ]}
                        label="Assigned To"
                        disabled={loading.users}
                      />
                      
                      <MuiSearchableDropdown
                        value={section.ticketCategory}
                        onChange={(value) => updateSectionProperty(section.id, 'ticketCategory', value)}
                        options={[
                          { id: '', label: 'Select Category', value: '' },
                          ...helpdeskCategories.map((category) => ({
                            id: category.id.toString(),
                            label: category.name,
                            value: category.id.toString()
                          }))
                        ]}
                        label="Category"
                        disabled={loading.helpdeskCategories}
                      />
                      {loading.helpdeskCategories && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Loading categories...
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                {section.tasks && section.tasks.map((task, taskIndex) => (
                  <Box key={task.id} sx={{ mb: 3 }}>
                    
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Task {taskIndex + 1}
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                      <MuiSearchableDropdown
                        value={task.group}
                        onChange={(value) => handleTaskGroupChange(section.id, task.id, value.toString())}
                        options={
                          taskGroups ? taskGroups.map((group) => ({
                            id: group.id.toString(),
                            label: group.name,
                            value: group.id.toString()
                          })) : []
                        }
                        label="Group"
                        disabled={loading.taskGroups}
                      />
                      {loading.taskGroups && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Loading groups...
                        </Typography>
                      )}
                      
                      <MuiSearchableDropdown
                        value={task.subGroup}
                        onChange={(value) => updateTaskInSection(section.id, task.id, 'subGroup', value)}
                        options={
                          task.group && taskSubGroups[task.group] ? taskSubGroups[task.group].map((subGroup) => ({
                            id: subGroup.id.toString(),
                            label: subGroup.name,
                            value: subGroup.id.toString()
                          })) : []
                        }
                        label="Sub-Group"
                        disabled={loading.taskSubGroups || !task.group}
                      />
                      {loading.taskSubGroups && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Loading sub-groups...
                        </Typography>
                      )}
                      {!task.group && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Please select a group first
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Dashed Border Section */}
                    <Box sx={{ 
                      border: '2px dashed #E0E0E0', 
                      padding: 2, 
                      borderRadius: 0,
                      backgroundColor: '#FAFAFA'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                          <FormControlLabel
                            control={
                              <Checkbox 
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
                          label="Task"
                          placeholder="Enter Task"
                          fullWidth
                          value={task.task}
                          onChange={(e) => updateTaskInSection(section.id, task.id, 'task', e.target.value)}
                        />
                        
                        <MuiSearchableDropdown
                          value={task.inputType}
                          onChange={(value) => {
                            // Prevent changing input type if reading is checked and no template is selected
                            if (task.reading && !formData.selectedTemplate) {
                              return;
                            }
                            updateTaskInSection(section.id, task.id, 'inputType', value);
                            // Reset values when changing input type
                            if (value !== 'dropdown') {
                              updateTaskInSection(section.id, task.id, 'dropdownValues', [{label: '', type: 'positive'}]);
                            }
                            if (value !== 'radio') {
                              updateTaskInSection(section.id, task.id, 'radioValues', [{label: '', type: 'positive'}]);
                            }
                            if (value !== 'checkbox') {
                              updateTaskInSection(section.id, task.id, 'checkboxValues', ['']);
                              updateTaskInSection(section.id, task.id, 'checkboxSelectedStates', [false]);
                            }
                            if (value !== 'options-inputs') {
                              updateTaskInSection(section.id, task.id, 'optionsInputsValues', ['']);
                            }
                          }}
                          options={[
                            { id: '', label: 'Select Input Type', value: '' },
                            { id: 'text', label: 'Text', value: 'text' },
                            { id: 'number', label: 'Numeric', value: 'number' },
                            { id: 'dropdown', label: 'Dropdown', value: 'dropdown' },
                            { id: 'checkbox', label: 'Checkbox', value: 'checkbox' },
                            { id: 'radio', label: 'Radio', value: 'radio' },
                            { id: 'options-inputs', label: 'Options & Inputs', value: 'options-inputs' }
                          ]}
                          label="Input Type"
                          disabled={task.reading && !formData.selectedTemplate}
                        />

                        {weightage && (
                          <TextField
                            label="Weightage"
                            type="number"
                            fullWidth
                            value={task.weightage}
                            onChange={(e) => updateTaskInSection(section.id, task.id, 'weightage', e.target.value)}
                            placeholder="Enter weightage"
                          />
                        )}
                      </Box>

                      {task.helpText && (
                        <Box sx={{ mt: 2 }}>
                          <TextField
                            label="Help Text (Hint)"
                            placeholder="Enter help text or hint"
                            fullWidth
                            value={task.helpTextValue}
                            onChange={(e) => updateTaskInSection(section.id, task.id, 'helpTextValue', e.target.value)}
                          />
                        </Box>
                      )}

                      {/* Enter Value Section for Dropdown */}
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
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      backgroundColor: 'white'
                                    }
                                  }}
                                />
                                
                                <MuiSearchableDropdown
                                  value={value.type}
                                  onChange={(newValue) => updateDropdownType(section.id, task.id, valueIndex, String(newValue))}
                                  options={[
                                    { id: 'positive', label: 'P', value: 'positive' },
                                    { id: 'negative', label: 'N', value: 'negative' }
                                  ]}
                                  label="Type"
                                />
                                
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
                                  fullWidth
                                  size="small"
                                  placeholder="Enter option value"
                                  value={value.label}
                                  onChange={(e) => updateRadioValue(section.id, task.id, valueIndex, e.target.value)}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      backgroundColor: 'white'
                                    }
                                  }}
                                />
                                
                                <FormControl size="small" sx={{ minWidth: 80 }}>
                                  <InputLabel>Type</InputLabel>
                                  <Select
                                    value={value.type}
                                    onChange={(e) => updateRadioType(section.id, task.id, valueIndex, e.target.value)}
                                    sx={{
                                      backgroundColor: 'white',
                                      '& .MuiSelect-select': {
                                        color: '#666'
                                      }
                                    }}
                                  >
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
                                  fullWidth
                                  size="small"
                                  placeholder="Enter option value"
                                  value={value}
                                  onChange={(e) => updateCheckboxValue(section.id, task.id, valueIndex, e.target.value)}
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
                                  fullWidth
                                  size="small"
                                  placeholder=""
                                  value={value}
                                  onChange={(e) => updateOptionsInputsValue(section.id, task.id, valueIndex, e.target.value)}
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

            <TimeSetupStep
              data={timeSetupData}
              onChange={(field, value) => {
                setTimeSetupData(prev => ({ ...prev, [field]: value }));
              }}
              isCompleted={false}
              isCollapsed={false}
            />
          </div>
        );
        
      case 3: // Time Setup
        return (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="border-l-4 border-l-[#C72030] p-4 sm:p-6 bg-white">
              <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-6">
                <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                  <Cog className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
                TIME SETUP
              </div>

              <TimeSetupStep
                data={timeSetupData}
                onChange={(field, value) => {
                  setTimeSetupData(prev => ({ ...prev, [field]: value }));
                }}
                isCompleted={false}
                isCollapsed={false}
              />
            </div>
          </div>
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

  {/* Navigation Buttons */}
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
                  disabled={isSubmitting || validationErrors[activeStep]?.length > 0}
                  className="bg-[#C72030] text-white px-6 py-2 rounded-md hover:bg-[#B8252F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  style={{ fontFamily: 'Work Sans, sans-serif' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save & Continue'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={validationErrors[activeStep]?.length > 0}
                  className="bg-[#C72030] text-white px-6 py-2 rounded-md hover:bg-[#B8252F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
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
                  overflow: 'hidden'
                }}
              >
                {/* Section Header */}
                {/* <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderLeft: '4px solid #C72030',
                    backgroundColor: '#fafafa',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <Box
                    sx={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#C72030',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600,
                      mr: 2
                    }}
                  >
                    <Settings sx={{ fontSize: '16px' }} />
                  </Box>
                  <Typography sx={{ 
                    fontSize: '16px', 
                    fontWeight: 600,
                    color: '#C72030',
                    fontFamily: 'Work Sans, sans-serif',
                    flex: 1
                  }}>
                    {steps[stepIndex]}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleStepClick(stepIndex)}>
                    <Typography sx={{ 
                      fontSize: '12px', 
                      color: '#666',
                      fontFamily: 'Work Sans, sans-serif'
                    }}>
                      Edit
                    </Typography>
                    <Edit sx={{ fontSize: '16px', color: '#C72030' }} />
                  </Box>
                </Box> */}

                {/* Section Content */}
                {/* <Box sx={{ p: 3 }}> */}
                  {renderSingleStep(stepIndex)}
                {/* </Box> */}
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
      toast({
        title: "Error",
        description: "Failed to load checklist mappings.",
        variant: "destructive"
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
                  disabled={isSubmitting || validationErrors[activeStep]?.length > 0}
                  className="bg-[#C72030] text-white px-6 py-2 hover:bg-[#B8252F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  style={{ fontFamily: 'Work Sans, sans-serif', borderRadius: 0 }}
                >
                  {isSubmitting ? 'Saving...' : 'Save & Continue'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={validationErrors[activeStep]?.length > 0}
                  className="bg-[#C72030] text-white px-6 py-2 hover:bg-[#B8252F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
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

      {/* Validation Errors Display */}
      {validationErrors[activeStep]?.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-md p-3 mt-4">
          <h4 className="text-red-800 font-semibold text-sm mb-2" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            Please fix the following errors:
          </h4>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {validationErrors[activeStep].map((error, index) => (
              <li key={index} style={{ fontFamily: 'Work Sans, sans-serif' }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

};
