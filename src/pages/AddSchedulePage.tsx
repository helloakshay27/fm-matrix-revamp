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
} from '@mui/material';
import {
  Settings,
  Edit,
  Add,
  Close,
  AttachFile,
  ArrowBack
} from '@mui/icons-material';
import { Cog } from 'lucide-react';
import { assetService, Asset, AssetGroup, AssetSubGroup, EmailRule, User, Supplier } from '../services/assetService';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

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
    color: '#D42F2F',
  },
  '& .MuiStepLabel-root .Mui-active': {
    color: '#D42F2F',
  },
  '& .MuiStepLabel-label': {
    fontSize: '14px',
    fontWeight: 500,
  },
}));

const RedButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#D42F2F',
  color: 'white',
  borderRadius: '8px',
  textTransform: 'none',
  padding: '8px 16px',
  boxShadow: '0 2px 4px rgba(212, 47, 47, 0.2)',
  '&:hover': {
    backgroundColor: '#B8252F',
    boxShadow: '0 4px 8px rgba(212, 47, 47, 0.3)',
  },
}));

const DraftButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#F5F1E8',
  color: '#8B7355',
  borderRadius: '8px',
  textTransform: 'none',
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: '#EDE6D8',
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid #F0F0F0',
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
  helpTextValue: string; // Added for help text input
  autoTicket: boolean;
  weightage: string; // Added for weightage
  rating: boolean; // Added for rating checkbox
  reading: boolean; // Added for reading checkbox
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

export const AddSchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Stepper state
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
    asset: '',
    assetGroup: '',
    assetSubGroup: '',
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
          reading: false // Added reading property to initial state
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
    taskGroups: false,
    taskSubGroups: false
  });

  // Add validation states
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadAssets();
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
    console.log('Starting to load assets...');
    setLoading(prev => ({ ...prev, assets: true }));
    try {
      const data = await assetService.getAssets();
      console.log('Assets loaded successfully:', data);
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
    console.log('Starting to load asset groups...');
    setLoading(prev => ({ ...prev, groups: true }));
    try {
      const data = await assetService.getAssetGroups();
      console.log('Asset groups loaded successfully:', data);
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
    console.log('Loading sub-groups for group ID:', groupId);
    setLoading(prev => ({ ...prev, subGroups: true }));
    try {
      const data = await assetService.getAssetSubGroups(groupId);
      console.log('Sub-groups loaded successfully:', data);
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
    console.log('Starting to load email rules...');
    setLoading(prev => ({ ...prev, emailRules: true }));
    try {
      const data = await assetService.getEmailRules();
      console.log('Email rules loaded successfully:', data);
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
    console.log('Starting to load users...');
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
      console.log('Users loaded successfully:', data);
      
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
    console.log('Starting to load suppliers...');
    setLoading(prev => ({ ...prev, suppliers: true }));
    try {
      const data = await assetService.getSuppliers();
      console.log('Suppliers loaded successfully:', data);
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

  const loadGroups = async () => {
    console.log('Starting to load user groups...');
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
      console.log('User groups loaded successfully:', data);
      
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
    console.log('Starting to load templates...');
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
      console.log('Templates loaded successfully:', templateData);
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
    console.log('Starting to load helpdesk categories...', API_CONFIG.BASE_URL);
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
      console.log("response", response);
      console.log('Helpdesk categories loaded successfully:', data);
      
      // Extract only id and name from helpdesk_categories
      const categoriesArray = (data.helpdesk_categories || []).map((category: any) => ({
        id: category.id,
        name: category.name
      }));
      
      setHelpdeskCategories(categoriesArray);
    } catch (error) {
      console.log('Failed to load helpdesk categories:', error);
      
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
    console.log('Starting to load task groups...');
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
      console.log('Task groups loaded successfully:', data);
      
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
    
    console.log('Starting to load task sub-groups for group:', groupId);
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
      console.log('Task sub-groups loaded successfully:', data);
      
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
            reading: false
          }
        ]
      }
    ]);
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
                  reading: false
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
      'textarea': 'text'
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
    console.log('Saving schedule with current form data:', formData);
    
    // Validate all sections before submission
    const basicErrors = validateBasicConfiguration();
    const scheduleErrors = validateScheduleSetup();
    const questionErrors = validateQuestionSetup();
    
    const allErrors = [...basicErrors, ...scheduleErrors, ...questionErrors];
    
    if (allErrors.length > 0) {
      console.log('Validation errors found:', allErrors)
      toast({
        title: "Validation Error",
        description: `Please fix the following errors: ${allErrors.join(', ')}`,
        variant: "destructive"
      });
      
    }

    setIsSubmitting(true);
    console.log('Saving schedule with data:', formData, questionSections, timeSetupData, attachments);
    
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
      console.log('Schedule created successfully:', result);
      
      toast({
        title: "Success",
        description: "Schedule created successfully!",
      });
      
      // Move to next step (Mapping) after successful submission
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
        setCompletedSteps([...completedSteps, activeStep]);
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
        console.log('Detailed template data loaded:', templateData);
        
        // Convert template content to tasks format
        const templateTasks = templateData.content.map((question: any, index: number) => ({
          id: (Date.now() + index).toString(),
          group: question.group_id || '',
          subGroup: question.sub_group_id || '',
          task: question.label || '',
          inputType: mapInputType(question.type),
          mandatory: question.required === 'true',
          helpText: !!question.hint,
          helpTextValue: question.hint || '',
          autoTicket: false,
          weightage: question.weightage || '',
          rating: question.rating_enabled === 'true',
          reading: false // Added reading property for template tasks
        }));
        
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
        
        console.log('Template tasks loaded:', templateTasks);
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
    console.log('Asset group changed to:', groupId); // Debug log
    const numericGroupId = groupId ? Number(groupId) : undefined;
    setSelectedAssetGroup(numericGroupId);
    setFormData(prev => ({ 
      ...prev, 
      assetGroup: groupId,
      assetSubGroup: '' // Reset sub-group when group changes
    }));
  };

  const handleChecklistTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      checklistType: value,
      // Reset all asset-related fields when switching between types
      asset: '',
      assetGroup: '',
      assetSubGroup: ''
    }));
    
    // Reset asset group selection state
    setSelectedAssetGroup(undefined);
    setAssetSubGroups([]);
  };

  // Validation functions for each section
  const validateBasicConfiguration = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.activityName.trim()) {
      errors.push('Activity Name is required');
    }
    if (!formData.description.trim()) {
      errors.push('Description is required');
    }
    if (!formData.type) {
      errors.push('Type selection is required');
    }
    
    return errors;
  };

  const validateScheduleSetup = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.checklistType) {
      errors.push('Checklist Type is required');
    }
    
    // Asset validation based on checklist type
    if (formData.checklistType === 'Individual' && !formData.asset) {
      errors.push('Asset selection is required for Individual checklist type');
    }
    
    if (formData.checklistType === 'Asset Group') {
      if (!formData.assetGroup) {
        errors.push('Asset Group selection is required');
      }
    }
    
    // Assignment validation
    if (formData.assignToType === 'user' && formData.selectedUsers.length === 0) {
      errors.push('At least one user must be selected');
    }
    
    if (formData.assignToType === 'group' && formData.selectedGroups.length === 0) {
      errors.push('At least one group must be selected');
    }
    
    if (!formData.frequency) {
      errors.push('Frequency is required');
    }
    
    // Plan duration validation
    if (formData.planDuration && !formData.planDurationValue) {
      errors.push('Plan Duration value is required when duration type is selected');
    }
    
    // Submission time validation
    if (formData.submissionTime && !formData.submissionTimeValue) {
      errors.push('Submission Time value is required when time type is selected');
    }
    
    // Grace time validation
    if (formData.graceTime && !formData.graceTimeValue) {
      errors.push('Grace Time value is required when time type is selected');
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
          if (!task.inputType) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} must have an input type`);
          }
          
          if (task.helpText && !task.helpTextValue.trim()) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} help text value is required when help text is enabled`);
          }
          
          if (weightage && task.rating && !task.weightage) {
            errors.push(`Task ${taskIndex + 1} in Section ${sectionIndex + 1} weightage is required when rating is enabled`);
          }
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
      default:
        errors = [];
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [activeStep]: errors
    }));
  }, [activeStep, formData, questionSections, weightage, autoTicket]);

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

  // Build the API payload
  const buildAPIPayload = () => {
    // Build content array from question sections
    const content = questionSections.flatMap(section => 
      section.tasks.filter(task => task.task.trim()).map(task => ({
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
        values: task.inputType === 'checkbox' ? [] : [""],
        weightage: task.weightage || "",
        rating_enabled: task.rating ? "true" : "false"
      }))
    );

    // Build custom_form object
    const customForm: any = {};
    questionSections.forEach((section, index) => {
      const sectionTasks = section.tasks.filter(task => task.task.trim());
      if (sectionTasks.length > 0) {
        customForm[`question_for_${index + 1}`] = sectionTasks.map(task => task.task);
      }
    });

    // Get selected asset IDs
    const assetIds = formData.checklistType === 'Individual' ? [formData.asset] : [];

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
        pms_site_id: "7", // This should come from context/auth
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
      sub_group_id: formData.assetSubGroup || "",
      content: content,
      checklist_upload_type: formData.checklistType,
      asset_ids: assetIds.filter(id => id),
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
        start_date: formData.startFrom || "",
        end_date: formData.endAt || ""
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
          <Box>
            {/* Header Outside the Box */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
              px: 1
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

            {/* Main Content in White Box */}
            <SectionCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Type</Typography>
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
              </Box>
              
              {/* Type Radio Group */}
              <Box sx={{ mb: 3 }}>
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
          </Box>
        );
        
      case 1: // Schedule Setup
        function handleMultiSelectChange(field: 'selectedUsers' | 'selectedGroups', e: SelectChangeEvent<any>) {
          const {
            target: { value }
          } = e;
          setFormData(prev => ({
            ...prev,
            [field]: typeof value === 'string' ? value.split(',') : value
          }));
        }

        return (
          <Box>
            {/* Header Outside the Box */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 3,
              px: 1
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

            {/* Main Content in White Box */}
            <SectionCard>
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
                  <FormControlLabel 
                    value="Branching" 
                    control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />} 
                    label="Branching" 
                  />
                </RadioGroup>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {/* Conditional Asset Dropdown - Show for Individual */}
                {formData.checklistType === 'Individual' && (
                  <FormControl fullWidth>
                    <InputLabel>Asset</InputLabel>
                    <Select 
                      value={formData.asset} 
                      onChange={(e) => setFormData({...formData, asset: e.target.value})}
                      disabled={loading.assets}
                    >
                      <MenuItem value="">Select Asset</MenuItem>
                      {assets.map((asset) => (
                        <MenuItem key={asset.id} value={asset.id.toString()}>
                          {asset.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {loading.assets && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                        Loading assets...
                      </Typography>
                    )}
                  </FormControl>
                )}

                {/* Conditional Asset Group Dropdown - Show for Asset Group */}
                {formData.checklistType === 'Asset Group' && (
                  <>
                    <FormControl fullWidth>
                      <InputLabel>Asset Group</InputLabel>
                      <Select 
                        value={formData.assetGroup || ''} 
                        onChange={(e) => handleAssetGroupChange(e.target.value)}
                        disabled={loading.groups}
                      >
                        <MenuItem value="">Select Asset Group</MenuItem>
                        {assetGroups.map((group) => (
                          <MenuItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {loading.groups && (
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                          Loading asset groups...
                        </Typography>
                      )}
                    </FormControl>

                    {/* Asset Sub-Group Dropdown - Show when Asset Group is selected */}
                    {selectedAssetGroup && (
                      <FormControl fullWidth>
                        <InputLabel>Asset Sub-Group</InputLabel>
                        <Select 
                          value={formData.assetSubGroup || ''} 
                          onChange={(e) => setFormData({...formData, assetSubGroup: e.target.value})}
                          disabled={loading.subGroups}
                        >
                          <MenuItem value="">Select Asset Sub-Group</MenuItem>
                          {assetSubGroups.map((subGroup) => (
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
                <FormControl fullWidth>
                  <InputLabel>Assign To</InputLabel>
                  <Select 
                    value={formData.assignToType} 
                    onChange={(e) => setFormData({...formData, assignToType: e.target.value, selectedUsers: [], selectedGroups: []})}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="group">Group</MenuItem>
                  </Select>
                </FormControl>

                {/* Multi-select Users - Show when assignToType is 'user' */}
                {formData.assignToType === 'user' && (
                  <FormControl fullWidth>
                    <InputLabel>Select Users</InputLabel>
                    <Select
                      multiple
                      value={formData.selectedUsers}
                      onChange={(e) => handleMultiSelectChange('selectedUsers', e)}
                      input={<OutlinedInput label="Select Users" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const user = users.find(u => u.id.toString() === value);
                            return (
                              <Chip key={value} label={user?.full_name || value} size="small" />
                            );
                          })}
                        </Box>
                      )}
                      disabled={loading.users}
                    >
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id.toString()}>
                          {user.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                
                <FormControl fullWidth>
                  <InputLabel>Backup Assignee</InputLabel>
                  <Select 
                    value={formData.backupAssignee} 
                    onChange={(e) => setFormData({...formData, backupAssignee: e.target.value})}
                    disabled={loading.users}
                  >
                    <MenuItem value="">Select Backup Assignee</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id.toString()}>
                        {user.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {/* Plan Duration with conditional input */}
                <FormControl fullWidth>
                  <InputLabel>Plan Duration</InputLabel>
                  <Select 
                    value={formData.planDuration} 
                    onChange={(e) => setFormData({...formData, planDuration: e.target.value, planDurationValue: ''})}
                  >
                    <MenuItem value="">Select Plan Duration</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hour">Hour</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                  </Select>
                </FormControl>

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
                
                <FormControl fullWidth>
                  <InputLabel>Email Trigger Rule</InputLabel>
                  <Select 
                    value={formData.emailTriggerRule} 
                    onChange={(e) => setFormData({...formData, emailTriggerRule: e.target.value})}
                    disabled={loading.emailRules}
                  >
                    <MenuItem value="">Select Email Trigger Rule</MenuItem>
                    {emailRules.map((rule) => (
                      <MenuItem key={rule.id} value={rule.id.toString()}>
                        {rule.rule_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loading.emailRules && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading email rules...
                    </Typography>
                  )}
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Scan Type</InputLabel>
                  <Select value={formData.scanType} onChange={(e) => setFormData({...formData, scanType: e.target.value})}>
                    <MenuItem value="">Select Scan Type</MenuItem>
                    <MenuItem value="qr">QR</MenuItem>
                    <MenuItem value="nfc">NFC</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="non-technical">Non-Technical</MenuItem>
                  </Select>
                </FormControl>
                
                {/* Submission Time with conditional input */}
                <FormControl fullWidth>
                  <InputLabel>Submission Time</InputLabel>
                  <Select 
                    value={formData.submissionTime} 
                    onChange={(e) => setFormData({...formData, submissionTime: e.target.value, submissionTimeValue: ''})}
                  >
                    <MenuItem value="">Select Submission Time</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hour">Hour</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                  </Select>
                </FormControl>

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
                
                <FormControl fullWidth>
                  <InputLabel>Supervisors</InputLabel>
                  <Select 
                    value={formData.supervisors} 
                    onChange={(e) => setFormData({...formData, supervisors: e.target.value})}
                    disabled={loading.users}
                  >
                    <MenuItem value="">Select Supervisors</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id.toString()}>
                        {user.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Lock Overdue Task</InputLabel>
                  <Select value={formData.lockOverdueTask} onChange={(e) => setFormData({...formData, lockOverdueTask: e.target.value})}>
                    <MenuItem value="">Select Lock Status</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}>
                    <MenuItem value="">Select Frequency</MenuItem>
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Quarterly">Quarterly</MenuItem>
                    <MenuItem value="Half Yearly">Half Yearly</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
                
                {/* Grace Time with conditional input */}
                <FormControl fullWidth>
                  <InputLabel>Grace Time</InputLabel>
                  <Select 
                    value={formData.graceTime} 
                    onChange={(e) => setFormData({...formData, graceTime: e.target.value, graceTimeValue: ''})}
                  >
                    <MenuItem value="">Select Grace Time</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hour">Hour</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                  </Select>
                </FormControl>

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
                
                <FormControl fullWidth>
                  <InputLabel>Supplier</InputLabel>
                  <Select 
                    value={formData.supplier} 
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    disabled={loading.suppliers}
                  >
                    <MenuItem value="">Select Supplier</MenuItem>
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {loading.suppliers && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading suppliers...
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Start From</InputLabel>
                  <Select value={formData.startFrom} onChange={(e) => setFormData({...formData, startFrom: e.target.value})}>
                    <MenuItem value="">Select Start Date</MenuItem>
                    <MenuItem value="2024-01-01">Jan 1, 2024</MenuItem>
                    <MenuItem value="2024-02-01">Feb 1, 2024</MenuItem>
                    <MenuItem value="2024-03-01">Mar 1, 2024</MenuItem>
                  </Select>
                </FormControl>
                
                
                <FormControl fullWidth>
                  <InputLabel>End At</InputLabel>
                  <Select value={formData.endAt} onChange={(e) => setFormData({...formData, endAt: e.target.value})}>
                    <MenuItem value="">Select End Date</MenuItem>
                    <MenuItem value="2024-12-31">Dec 31, 2024</MenuItem>
                    <MenuItem value="2025-06-30">Jun 30, 2025</MenuItem>
                    <MenuItem value="2025-12-31">Dec 31, 2025</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </SectionCard>
          </Box>
        );
        
      case 2: // Question Setup
        function handleTemplateChange(templateId: string) {
          setFormData(prev => ({ ...prev, selectedTemplate: templateId }));
          if (templateId) {
            loadTemplateData(templateId);
          }
        }

        return (
          <Box>
            {/* Header Outside the Box */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
              px: 1
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
                  Question Setup
                </Typography>

                
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MuiSwitch 
                    checked={createNew}
                    onChange={(e) => setCreateNew(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#C72030' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C72030' }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#666' }}>Create New</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MuiSwitch 
                    checked={weightage}
                    onChange={(e) => setWeightage(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#C72030' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C72030' }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#666' }}>Weightage</Typography>
                </Box>
                <MuiButton
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addQuestionSection}
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
                  Add Section
                </MuiButton>
              </Box>
            </Box>

            {/* Conditional Sections based on toggles */}
            
            {/* Create New Template Section */}
            {createNew && (
              <SectionCard sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Select Template
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Template</InputLabel>
                  <Select 
                    value={formData.selectedTemplate} 
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    disabled={loading.templates}
                  >
                    <MenuItem value="">Select Template</MenuItem>
                    {templates.map((template) => (
                      <MenuItem key={template.id} value={template.id.toString()}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {template.form_name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {loading.templates && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      Loading templates...
                    </Typography>
                  )}
                </FormControl>
                
              </SectionCard>
            )}

            {/* Auto Ticket Configuration Section */}
            {autoTicket && (
              <SectionCard sx={{ mb: 2 }}>
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
                  
                  <FormControl fullWidth>
                    <InputLabel>Assigned To</InputLabel>
                    <Select 
                      value={formData.ticketAssignedTo} 
                      onChange={(e) => setFormData({...formData, ticketAssignedTo: e.target.value})}
                      disabled={loading.users}
                    >
                      <MenuItem value="">Select Assigned To</MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id.toString()}>
                          {user.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select 
                      
                      value={formData.ticketCategory} 
                      onChange={(e) => setFormData({...formData, ticketCategory: e.target.value})}
                      disabled={loading.helpdeskCategories}
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      {helpdeskCategories.map((category) => (
                        <MenuItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {loading.helpdeskCategories && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                        Loading categories...
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </SectionCard>
            )}

            {/* Main Content in White Box */}
            {questionSections.map((section, sectionIndex) => (
              <SectionCard key={section.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <TextField
                    variant="standard"
                    value={section.title}
                    onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                    sx={{
                      '& .MuiInput-underline:before': { borderBottomColor: '#C72030' },
                      '& .MuiInput-underline:after': { borderBottomColor: '#C72030' },
                      '& .MuiInputBase-input': { fontWeight: 600, fontSize: '1rem' }
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Individual Auto Ticket Toggle */}
                    
                    
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

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MuiSwitch 
                        checked={section.autoTicket}
                        onChange={(e) => updateSectionProperty(section.id, 'autoTicket', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#C72030' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C72030' }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#666' }}>Auto Ticket</Typography>
                    </Box>
                </Box>
                {/* Individual Auto Ticket Configuration Section */}
                {section.autoTicket && (
                  <Box sx={{ 
                    border: '1px solid #E0E0E0', 
                    borderRadius: '8px', 
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
                      
                      <FormControl fullWidth>
                        <InputLabel>Assigned To</InputLabel>
                        <Select 
                          value={section.ticketAssignedTo} 
                          onChange={(e) => updateSectionProperty(section.id, 'ticketAssignedTo', e.target.value)}
                          disabled={loading.users}
                        >
                          <MenuItem value="">Select Assigned To</MenuItem>
                          {users.map((user) => (
                            <MenuItem key={user.id} value={user.id.toString()}>
                              {user.full_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select 
                          value={section.ticketCategory} 
                          onChange={(e) => updateSectionProperty(section.id, 'ticketCategory', e.target.value)}
                          disabled={loading.helpdeskCategories}
                        >
                          <MenuItem value="">Select Category</MenuItem>
                          {helpdeskCategories.map((category) => (
                            <MenuItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {loading.helpdeskCategories && (
                          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                            Loading categories...
                          </Typography>
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                )}

                
                
                {section.tasks.map((task, taskIndex) => (
                  <Box key={task.id} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Task {taskIndex + 1}
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>Group</InputLabel>
                        <Select 
                          value={task.group} 
                          onChange={(e) => handleTaskGroupChange(section.id, task.id, e.target.value)}
                          disabled={loading.taskGroups}
                        >
                          <MenuItem value="">Select Group</MenuItem>
                          {taskGroups.map((group) => (
                            <MenuItem key={group.id} value={group.id.toString()}>
                              {group.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {loading.taskGroups && (
                          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                            Loading groups...
                          </Typography>
                        )}
                      </FormControl>
                      
                      <FormControl fullWidth>
                        <InputLabel>Sub-Group</InputLabel>
                        <Select 
                          value={task.subGroup} 
                          onChange={(e) => updateTaskInSection(section.id, task.id, 'subGroup', e.target.value)}
                          disabled={loading.taskSubGroups || !task.group}
                        >
                          <MenuItem value="">Select Sub-Group</MenuItem>
                          {task.group && taskSubGroups[task.group] && taskSubGroups[task.group].map((subGroup) => (
                            <MenuItem key={subGroup.id} value={subGroup.id.toString()}>
                              {subGroup.name}
                            </MenuItem>
                          ))}
                        </Select>
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
                      </FormControl>
                    </Box>
                    
                    {/* Dashed Border Section */}
                    <Box sx={{ 
                      border: '2px dashed #E0E0E0', 
                      padding: 2, 
                      borderRadius: '8px',
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
                                onChange={(e) => updateTaskInSection(section.id, task.id, 'reading', e.target.checked)}
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
                        
                        <FormControl fullWidth>
                          <InputLabel>Input Type</InputLabel>
                          <Select 
                            value={task.inputType} 
                            onChange={(e) => updateTaskInSection(section.id, task.id, 'inputType', e.target.value)}
                          >
                            <MenuItem value="">Select Input Type</MenuItem>
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="dropdown">Dropdown</MenuItem>
                            <MenuItem value="checkbox">Checkbox</MenuItem>
                            <MenuItem value="radio">Radio</MenuItem>
                          </Select>
                        </FormControl>

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
                    </Box>
                  </Box>
                ))}
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <MuiButton
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => addTaskToSection(section.id)}
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
                    Add Question
                  </MuiButton>
                </Box>
              </SectionCard>
            ))}

            <TimeSetupStep
              data={timeSetupData}
              onChange={(field, value) => {
                console.log('Time setup change:', field, value);
                setTimeSetupData(prev => ({ ...prev, [field]: value }));
              }}
              isCompleted={false}
              isCollapsed={false}
            />
          </Box>
        );
        
      case 3: // Time Setup
        return (
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 3,
              px: 1
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
                Time Setup
              </Typography>
            </Box>

            <TimeSetupStep
              data={timeSetupData}
              onChange={(field, value) => {
                console.log('Time setup change:', field, value);
                setTimeSetupData(prev => ({ ...prev, [field]: value }));
              }}
              isCompleted={false}
              isCollapsed={false}
            />
          </Box>
        );

      case 4: // Mapping
        return (
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 3,
              px: 1
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
                Mapping
              </Typography>
            </Box>

            <MappingStep
              data={{ mappings: formData.mappings || [] }}
              onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
              isCompleted={false}
              isCollapsed={false}
            />
          </Box>
        );
        
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    // Only show the current active step
    return (
      <Box>
        {renderSingleStep(activeStep)}
      </Box>
    );
  };

  return (
    <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate('/maintenance/schedule')}>
            <ArrowBack sx={{ color: '#D42F2F' }} />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Schedule &gt; Add Schedule
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          ADD SCHEDULE
        </Typography>
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
                  backgroundColor: isStepRed(index) ? '#C72030' : 'white',
                  color: isStepRed(index) ? 'white' : '#C4B89D',
                  border: `2px solid ${isStepRed(index) ? '#C72030' : '#C4B89D'}`,
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
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                {label}
              </Box>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: '60px',
                    height: '1px',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '1px',
                      backgroundImage: 'repeating-linear-gradient(to right, #C4B89D 0px, #C4B89D 6px, transparent 6px, transparent 12px)',
                    }
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Box>
          {activeStep > 0 && (
            <MuiButton
              variant="outlined"
              onClick={handleBack}
              sx={{
                color: '#C72030',
                borderColor: '#C72030',
                '&:hover': {
                  borderColor: '#C72030',
                  backgroundColor: 'rgba(199, 32, 48, 0.04)'
                }
              }}
            >
              Back
            </MuiButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep < steps.length - 1 ? (
            <>
              {activeStep === 3 ? ( // Time Setup step
                <RedButton 
                  onClick={
                    handleSave
                  }
                  disabled={isSubmitting || validationErrors[activeStep]?.length > 0}
                >
                  {isSubmitting ? 'Saving...' : 'Save & Continue'}
                </RedButton>
              ) : (
                <MuiButton
                  variant="contained"
                  onClick={handleNext}
                  disabled={validationErrors[activeStep]?.length > 0}
                  sx={{
                    backgroundColor: '#C72030',
                    '&:hover': { backgroundColor: '#B8252F' },
                    '&:disabled': {
                      backgroundColor: '#ccc',
                      color: '#666'
                    }
                  }}
                >
                  Next
                </MuiButton>
              )}
            </>
          ) : (
            <RedButton onClick={handleFinish}>
              Finish
            </RedButton>
          )}
        </Box>
      </Box>

      {/* Validation Errors Display */}
      {validationErrors[activeStep]?.length > 0 && (
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          backgroundColor: '#ffebee', 
          borderRadius: '4px',
          border: '1px solid #f44336'
        }}>
          <Typography variant="subtitle2" sx={{ color: '#d32f2f', fontWeight: 600, mb: 1 }}>
            Please fix the following errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {validationErrors[activeStep].map((error, index) => (
              <li key={index} style={{ color: '#d32f2f', fontSize: '14px' }}>
                {error}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
};
