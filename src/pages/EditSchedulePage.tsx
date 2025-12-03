import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button as MuiButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Grid,
  Switch,
  FormLabel,
  Alert,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Settings,
  Upload,
  Add,
  Remove,
  Delete,
  Edit,
  Save,
  Cancel,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Info,
  AttachFile,
  Close,
} from '@mui/icons-material';
import { Cog } from 'lucide-react';
import { toast } from "sonner";
import { validateActivityName, validateActivityNameDebounced } from '@/utils/scheduleValidation';
import { MappingStep } from '@/components/schedule/MappingStep';
import { TimeSetupStep } from '@/components/schedule/TimeSetupStep';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { assetService } from '@/services/assetService';

// Styled Components
const RedButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#C72030',
  color: 'white',
  borderRadius: 4,
  textTransform: 'none',
  padding: '10px 20px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  boxShadow: '0 2px 4px rgba(199, 32, 48, 0.2)',
  '&:hover': {
    backgroundColor: '#B8252F',
    boxShadow: '0 4px 8px rgba(199, 32, 48, 0.3)',
  },
}));

const CancelButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#666',
  border: '1px solid #ddd',
  borderRadius: 4,
  textTransform: 'none',
  padding: '10px 20px',
  fontFamily: 'Work Sans, sans-serif',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#f5f5f5',
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
  '& .MuiInputBase-input': {
    padding: '12px 14px',
  },
};

const multilineFieldStyles = {
  ...fieldStyles,
  '& .MuiOutlinedInput-root': {
    ...fieldStyles['& .MuiOutlinedInput-root'],
    alignItems: 'flex-start',
    padding: 0,
  },
  '& .MuiInputBase-inputMultiline': {
    padding: '12px 14px',
  },
};
// Interfaces (same as AddSchedulePage)
interface AttachmentFile {
  id: string;
  name: string;
  url: string;
  content: string;
  content_type: string;
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
  helpTextAttachments?: AttachmentFile[];
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
  autoTicket: boolean;
  ticketLevel: string;
  ticketAssignedTo: string;
  ticketCategory: string;
}

interface Asset {
  id: number;
  name: string;
  code: string;
}

interface AssetGroup {
  id: number;
  name: string;
}

interface AssetSubGroup {
  id: number;
  name: string;
  group_id: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface EmailRule {
  id: number;
  name: string;
}

interface CustomFormContent {
  label: string;
  name: string;
  className: string;
  group_id: string;
  sub_group_id: string;
  type: string;
  subtype: string;
  required: string;
  is_reading: string;
  hint: string;
  values: any[];
  weightage: string;
  rating_enabled: string;
  question_hint_image_ids: any[];
  question_hint_image_url: any[];
}

interface CustomFormData {
  id: number;
  form_name: string;
  description: string;
  schedule_type: string;
  sch_type: string;
  weightage_enabled: boolean;
  create_ticket: boolean;
  custom_form_code: string;
  before_after_enabled: boolean;
  ticket_level: string;
  observations_enabled: boolean;
  supervisors: any[];
  supplier_id: number;
  submission_time_type: string;
  submission_time_value: number | null;
  rule_ids: any[];
  attachments: any[];
  content: CustomFormContent[];
  task_assigner_id?: number;
  helpdesk_category_id?: number;
  task_assigner_name?: string;
  helpdesk_category_name?: string;
}

interface AssetTaskData {
  id: number;
  assignment_type: string;
  scan_type: string;
  plan_type: string;
  plan_value: string;
  priority: string;
  grace_time_type: string;
  grace_time_value: string;
  overdue_task_start_status: boolean;
  frequency: string | null;
  cron_expression: string;
  start_date: string;
  end_date: string;
  category: string;
  assigned_to: any[];
  backup_assigned: any;
  assets: any[];
  services: any[];
}

interface ApiResponseData {
  custom_form: CustomFormData;
  asset_task: AssetTaskData;
  email_rules: any[];
}

export const EditSchedulePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Get custom form code from navigation state or URL params
  const customFormCode = location.state?.customFormCode || new URLSearchParams(location.search).get('code');

  // Form data (same structure as AddSchedulePage)
  const [formData, setFormData] = useState({
    // Basic Configuration
    type: 'PPM',
    scheduleFor: 'Asset',
    activityName: '',
    description: '',

    // Schedule Setup
    checklistType: 'Individual',
    checkInPhotograph: 'inactive',
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

    // Mapping
    mappings: [],

    // New fields for toggles
    selectedTemplate: '',
    ticketLevel: 'checklist',
    ticketAssignedTo: '',
    ticketCategory: '',
  });

  // Question Setup
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

  // Time Setup
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
  const [autoTicket, setAutoTicket] = useState(false);
  const [editTiming, setEditTiming] = useState(false);

  // Data states
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>([]);
  const [assetSubGroups, setAssetSubGroups] = useState<AssetSubGroup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [emailRules, setEmailRules] = useState<EmailRule[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [taskGroups, setTaskGroups] = useState<any[]>([]);
  const [taskSubGroups, setTaskSubGroups] = useState<{ [key: string]: any[] }>({});

  // Add checklist mappings state
  const [checklistMappings, setChecklistMappings] = useState<any>(null);
  const [loadingMappings, setLoadingMappings] = useState(false);

  // API response data state
  const [apiData, setApiData] = useState<ApiResponseData | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [fieldName: string]: string }>({});
  
  // Add activity name validation state
  const [isValidatingActivityName, setIsValidatingActivityName] = useState(false);
  const [activityNameValidationResult, setActivityNameValidationResult] = useState<boolean | null>(null);
  
  const [loadingStates, setLoadingStates] = useState({
    taskGroups: false,
    taskSubGroups: false,
    groups: false
  });

  // Load dropdown data
  const loadDropdownData = async () => {
    try {
      // Load users
      const usersResponse = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ESCALATION_USERS}`,
        {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('Users API response:', usersData);
        
        // Handle different possible response structures
        let usersArray = [];
        if (usersData.users && Array.isArray(usersData.users)) {
          usersArray = usersData.users;
        } else if (Array.isArray(usersData)) {
          usersArray = usersData;
        } else if (usersData.data && Array.isArray(usersData.data)) {
          usersArray = usersData.data;
        }
        
        // Ensure users have required properties
        const formattedUsers = usersArray.map((user: any) => ({
          id: user.id || user.user_id || user.ID,
          name: user.name || user.user_name || user.full_name || user.display_name || `User ${user.id}`,
          email: user.email || user.user_email || user.email_address || ''
        }));
        
        console.log('Formatted users:', formattedUsers);
        setUsers(formattedUsers);
      } else {
        console.error('Users API failed:', usersResponse.status);
        setUsers([]);
      }

      // Load suppliers
      try {
        const suppliersData = await assetService.getSuppliers();
        console.log('Suppliers API response:', suppliersData);
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Suppliers API failed:', error);
        setSuppliers([]);
      }

      // Load assets using the specific API endpoint
      const assetsResponse = await fetch(
        `${API_CONFIG.BASE_URL}/pms/assets/get_assets.json`,
        {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      if (assetsResponse.ok) {
        const assetsData = await assetsResponse.json();
        console.log('Assets API response:', assetsData);
        // The API returns an array directly
        const assetsArray = Array.isArray(assetsData) ? assetsData : [];
        setAssets(assetsArray);
      } else {
        console.error('Assets API failed:', assetsResponse.status);
        setAssets([]);
      }

      // Load services for Service type schedules
      try {
        const servicesResponse = await fetch(`${API_CONFIG.BASE_URL}/pms/services/get_services.json`, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          console.log('Services API response:', servicesData);
          if (servicesData && Array.isArray(servicesData)) {
            setServices(servicesData);
          }
        } else {
          console.error('Services API failed:', servicesResponse.status);
          setServices([]);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        setServices([]);
      }

      // Load email rules
      try {
        const emailRulesResponse = await fetch(`${API_CONFIG.BASE_URL}/pms/email_rule_setups.json`, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });
        if (emailRulesResponse.ok) {
          const emailRulesData = await emailRulesResponse.json();
          console.log('Email Rules API response:', emailRulesData);
          if (emailRulesData && Array.isArray(emailRulesData)) {
            setEmailRules(emailRulesData);
          }
        } else {
          console.error('Email Rules API failed:', emailRulesResponse.status);
          setEmailRules([]);
        }
      } catch (error) {
        console.error('Error loading email rules:', error);
        setEmailRules([]);
      }

      // Load templates
      try {
        const templatesResponse = await fetch(`${API_CONFIG.BASE_URL}/pms/custom_forms/get_templates.json`, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });
        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          console.log('Templates API response:', templatesData);
          if (templatesData && Array.isArray(templatesData)) {
            setTemplates(templatesData);
          }
        } else {
          console.error('Templates API failed:', templatesResponse.status);
          setTemplates([]);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        setTemplates([]);
      }

      // Load helpdesk categories
      try {
        const categoriesResponse = await fetch(`${API_CONFIG.BASE_URL}/pms/admin/helpdesk_categories.json`, {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        });
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          console.log('Categories API response:', categoriesData);
          if (categoriesData && categoriesData.helpdesk_categories && Array.isArray(categoriesData.helpdesk_categories)) {
            setCategories(categoriesData.helpdesk_categories);
          }
        } else {
          console.error('Categories API failed:', categoriesResponse.status);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      }

      // Load asset groups
      const groupsResponse = await fetch(
        `${API_CONFIG.BASE_URL}/pms/asset_groups.json`,
        {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json();
        console.log('Asset groups API response:', groupsData);
        // Ensure groupsData is an array
        const groupsArray = Array.isArray(groupsData) ? groupsData :
          (groupsData.asset_groups && Array.isArray(groupsData.asset_groups)) ? groupsData.asset_groups :
            (groupsData.data && Array.isArray(groupsData.data)) ? groupsData.data : [];
        setAssetGroups(groupsArray);
      } else {
        console.error('Asset groups API failed:', groupsResponse.status);
        setAssetGroups([]);
      }

      // Load task groups
      await loadTaskGroups();

      // Load user groups
      await loadGroups();
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      // Ensure all arrays are properly initialized even on error
      setUsers([]);
      setSuppliers([]);
      setAssets([]);
      setAssetGroups([]);
      setServices([]);
      setGroups([]);
      setEmailRules([]);
      setTemplates([]);
      setCategories([]);
      setTaskGroups([]);
    }
  };

  // Load schedule data
  useEffect(() => {
    const initialize = async () => {
      if (!customFormCode) {
        toast.error('Custom form code is required');
        navigate('/maintenance/schedule');
        return;
      }

      // Load dropdown data first
      await loadDropdownData();

      // Then load schedule data
      if (id) {
        await loadScheduleData(id);
      }
    };

    initialize();
  }, [id, customFormCode]);

  // Handle createNew toggle changes - clear template data when disabled
  useEffect(() => {
    if (!createNew) {
      // Clear template selection and reset questionSections to default
      updateFormData('selectedTemplate', '');
      loadTemplateData('');
    }
  }, [createNew]);

  // Handle name-to-ID mapping after both API data and dropdown data are loaded
  useEffect(() => {
    if (apiData && users.length > 0 && categories.length > 0 && groups.length > 0) {
      // Handle ticket assignment mapping - try to find ID from name if name is provided
      if (apiData.custom_form.task_assigner_name && !apiData.custom_form.task_assigner_id) {
        const matchingUser = users.find(user => 
          user.name === apiData.custom_form.task_assigner_name
        );
        if (matchingUser) {
          setFormData(prev => ({ ...prev, ticketAssignedTo: matchingUser.id.toString() }));
        }
      }

      // Handle category mapping - try to find ID from name if name is provided
      if (apiData.custom_form.helpdesk_category_name && !apiData.custom_form.helpdesk_category_id) {
        const matchingCategory = categories.find(category => 
          category.name === apiData.custom_form.helpdesk_category_name
        );
        if (matchingCategory) {
          setFormData(prev => ({ ...prev, ticketCategory: matchingCategory.id.toString() }));
        }
      }

      // Handle group name mapping - parse group_name and map to group IDs
      if (apiData.asset_task.group_name && apiData.asset_task.assignment_type === 'group') {
        const groupNames = apiData.asset_task.group_name.split(',').map(name => name.trim());
        const matchingGroupIds = [];
        
        groupNames.forEach(groupName => {
          const matchingGroup = groups.find(group => group.name === groupName);
          if (matchingGroup) {
            matchingGroupIds.push(matchingGroup.id.toString());
          }
        });
        
        if (matchingGroupIds.length > 0) {
          console.log('Mapped group names to IDs:', groupNames, '->', matchingGroupIds);
          setFormData(prev => ({ ...prev, selectedGroups: matchingGroupIds }));
        }
      }
    }
  }, [apiData, users, categories, groups]);

  // Validate form values against available dropdown options
  useEffect(() => {
    if (users.length > 0 || categories.length > 0 || suppliers.length > 0) {
      setFormData(prev => {
        const updatedData = { ...prev };
        let hasChanges = false;

        // Validate ticketAssignedTo against users
        if (users.length > 0 && prev.ticketAssignedTo) {
          const userExists = users.some(user => user.id.toString() === prev.ticketAssignedTo);
          if (!userExists) {
            console.warn(`Invalid ticketAssignedTo value: ${prev.ticketAssignedTo}. Resetting to empty.`);
            updatedData.ticketAssignedTo = '';
            hasChanges = true;
          }
        }

        // Validate ticketCategory against categories
        if (categories.length > 0 && prev.ticketCategory) {
          const categoryExists = categories.some(category => category.id.toString() === prev.ticketCategory);
          if (!categoryExists) {
            console.warn(`Invalid ticketCategory value: ${prev.ticketCategory}. Resetting to empty.`);
            updatedData.ticketCategory = '';
            hasChanges = true;
          }
        }

        // Validate backupAssignee against users
        if (users.length > 0 && prev.backupAssignee) {
          const userExists = users.some(user => user.id.toString() === prev.backupAssignee);
          if (!userExists) {
            console.warn(`Invalid backupAssignee value: ${prev.backupAssignee}. Resetting to empty.`);
            updatedData.backupAssignee = '';
            hasChanges = true;
          }
        }

        // Validate supervisors against users
        if (users.length > 0 && prev.supervisors) {
          const supervisorValue = prev.supervisors.toString();
          const userExists = users.some(user => user.id.toString() === supervisorValue);
          if (!userExists) {
            console.warn(`Invalid supervisors value: ${prev.supervisors}. Available users:`, users.map(u => u.id));
            updatedData.supervisors = '';
            hasChanges = true;
          }
        }

        // Validate supplier against suppliers
        if (suppliers.length > 0 && prev.supplier) {
          const supplierExists = suppliers.some(supplier => supplier.id.toString() === prev.supplier);
          if (!supplierExists) {
            console.warn(`Invalid supplier value: ${prev.supplier}. Resetting to empty.`);
            updatedData.supplier = '';
            hasChanges = true;
          }
        }

        // Validate selectedUsers against users
        if (users.length > 0 && prev.selectedUsers && prev.selectedUsers.length > 0) {
          const validUsers = prev.selectedUsers.filter(userId => 
            users.some(user => user.id.toString() === userId.toString())
          );
          if (validUsers.length !== prev.selectedUsers.length) {
            console.warn(`Invalid selectedUsers values: ${prev.selectedUsers}. Filtering to valid users: ${validUsers}`);
            updatedData.selectedUsers = validUsers;
            hasChanges = true;
          }
        }

        // Validate selectedGroups against groups
        if (groups.length > 0 && prev.selectedGroups && prev.selectedGroups.length > 0) {
          const validGroups = prev.selectedGroups.filter(groupId => 
            groups.some(group => group.id.toString() === groupId.toString())
          );
          if (validGroups.length !== prev.selectedGroups.length) {
            console.warn(`Invalid selectedGroups values: ${prev.selectedGroups}. Filtering to valid groups: ${validGroups}`);
            updatedData.selectedGroups = validGroups;
            hasChanges = true;
          }
        }

        return hasChanges ? updatedData : prev;
      });
    }
  }, [users, categories, suppliers, groups]);

  // Helper function to normalize dropdown values
  const normalizeDropdownValue = (value: string, validOptions: string[]): string => {
    if (!value) return '';
    
    const normalizedValue = value.toLowerCase().trim();
    
    // Direct match
    if (validOptions.includes(normalizedValue)) {
      return normalizedValue;
    }
    
    // Handle common variations
    const variations: { [key: string]: string } = {
      'hours': 'hour',
      'hrs': 'hour',
      'h': 'hour',
      'mins': 'minutes',
      'min': 'minutes',
      'm': 'minutes',
      'days': 'day',
      'd': 'day',
      'weeks': 'week',
      'w': 'week',
      'months': 'month',
      'mo': 'month'
    };
    
    // Check variations
    if (variations[normalizedValue] && validOptions.includes(variations[normalizedValue])) {
      return variations[normalizedValue];
    }
    
    console.warn(`Unrecognized dropdown value: "${value}". Available options:`, validOptions);
    return '';
  };

  const loadScheduleData = async (scheduleId: string) => {
    if (!customFormCode) {
      toast.error('Missing custom form code');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/custom_forms/${customFormCode}/custom_form_preview.json`,
        {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponseData = await response.json();
      setApiData(data);

      // Map API data to form data
      const mappedFormData = {
        // Basic Configuration
        type: data.custom_form.schedule_type || 'PPM',
        scheduleFor: data.custom_form.sch_type || 'Asset',
        activityName: data.custom_form.form_name || '',
        description: data.custom_form.description || '',

        // Schedule Setup
        checklistType: 'Individual',
        checkInPhotograph: data.custom_form.before_after_enabled ? 'active' : 'inactive',
        asset: data.asset_task.assets?.map(asset => asset.id.toString()) || [],
        service: data.asset_task.services?.map(service => service.id.toString()) || [],
        assetGroup: '',
        assetSubGroup: [],
        assignTo: data.asset_task.assignment_type === 'people' ? 'user' : 'group',
        assignToType: data.asset_task.assignment_type === 'people' ? 'user' : 'group',
        selectedUsers: data.asset_task.assigned_to?.map(user => user.id) || [],
        selectedGroups: [], // Will be populated after groups are loaded
        backupAssignee: data.asset_task.backup_assigned?.id?.toString() || '',
        planDuration: normalizeDropdownValue(data.asset_task.plan_type || '', ['minutes', 'hour', 'day', 'week', 'month']),
        planDurationValue: data.asset_task.plan_value || '',
        emailTriggerRule: data.custom_form.rule_ids?.length > 0 ? data.custom_form.rule_ids[0]?.toString() : '',
        scanType: data.asset_task.scan_type || '',
        category: data.asset_task.category || '',
        submissionTime: normalizeDropdownValue(data.custom_form.submission_time_type || '', ['minutes', 'hour', 'day', 'week']),
        submissionTimeValue: data.custom_form.submission_time_value?.toString() || '',
        supervisors: Array.isArray(data.custom_form.supervisors) && data.custom_form.supervisors.length > 0 ? data.custom_form.supervisors[0].toString() : '',
        lockOverdueTask: data.asset_task.overdue_task_start_status ? 'true' : 'false',
        frequency: data.asset_task.frequency || '',
        graceTime: normalizeDropdownValue(data.asset_task.grace_time_type || '', ['minutes', 'hour', 'day', 'week']),
        graceTimeValue: data.asset_task.grace_time_value || '',
        endAt: data.asset_task.end_date ? data.asset_task.end_date.split('T')[0] : '',
        supplier: data.custom_form.supplier_id?.toString() || '',
        startFrom: data.asset_task.start_date ? data.asset_task.start_date.split('T')[0] : '',

        // Mapping
        mappings: [],

        // Toggles
        selectedTemplate: '',
        ticketLevel: data.custom_form.ticket_level || 'checklist',
        ticketAssignedTo: data.custom_form.task_assigner_id?.toString() || '',
        ticketCategory: data.custom_form.helpdesk_category_id?.toString() || '',
      };

      console.log('API Response Data:', data);
      console.log('Mapped Form Data:', mappedFormData);

      // Debug logging for dropdown values
      console.log('Plan Duration API value:', data.asset_task.plan_type, '-> Normalized:', mappedFormData.planDuration);
      console.log('Grace Time API value:', data.asset_task.grace_time_type, '-> Normalized:', mappedFormData.graceTime);
      console.log('Submission Time API value:', data.custom_form.submission_time_type, '-> Normalized:', mappedFormData.submissionTime);
      console.log('Supervisors API value:', data.custom_form.supervisors, '-> Normalized:', mappedFormData.supervisors);

      setFormData(prev => ({ ...prev, ...mappedFormData }));

      // Set toggles
      setCreateNew(false);
      setWeightage(data.custom_form.weightage_enabled || false);
      setAutoTicket(data.custom_form.create_ticket || false);

      // Set attachments if any
      if (data.custom_form.attachments && data.custom_form.attachments.length > 0) {
        setAttachments(data.custom_form.attachments);
      }

      // Map question sections from content
      if (data.custom_form.content && data.custom_form.content.length > 0) {
        const mappedSections = [{
          id: '1',
          title: 'Questions',
          autoTicket: data.custom_form.create_ticket || false,
          ticketLevel: data.custom_form.ticket_level || 'checklist',
          ticketAssignedTo: '',
          ticketCategory: '',
          tasks: data.custom_form.content.map((item, index) => ({
            id: `task_${index + 1}`,
            group: item.group_id || '',
            subGroup: item.sub_group_id || '',
            task: item.label || '',
            inputType: mapInputType(item.type || 'text'),
            mandatory: item.required === 'true',
            helpText: !!item.hint,
            helpTextValue: item.hint || '',
            helpTextAttachments: (item.question_hint_image_url || []).map((attachment, attIndex) => {
              // Handle different attachment formats
              if (typeof attachment === 'string') {
                return {
                  id: item.question_hint_image_ids?.[attIndex] || `existing_${index}_${attIndex}`,
                  name: `attachment_${attIndex + 1}`,
                  url: attachment,
                  content: attachment,
                  content_type: 'image/png' // default type
                };
              } else if (attachment && typeof attachment === 'object') {
                return {
                  id: attachment.id || item.question_hint_image_ids?.[attIndex] || `existing_${index}_${attIndex}`,
                  name: attachment.name || attachment.filename || `attachment_${attIndex + 1}`,
                  url: attachment.url || attachment.content || '',
                  content: attachment.content || attachment.url || '',
                  content_type: attachment.content_type || 'image/png'
                };
              }
              return null;
            }).filter(Boolean),
            autoTicket: false,
            weightage: item.weightage || '',
            rating: item.rating_enabled === 'true',
            reading: item.is_reading === 'true',
            dropdownValues: (() => {
              if (item.values && Array.isArray(item.values) && item.values.length > 0) {
                return item.values.map((val: any) => ({
                  label: val.label || val.value || val || '',
                  type: val.type || 'positive'
                }));
              }
              return [{ label: '', type: 'positive' }];
            })(),
            radioValues: (() => {
              if (item.values && Array.isArray(item.values) && item.values.length > 0) {
                return item.values.map((val: any) => ({
                  label: val.label || val.value || val || '',
                  type: val.type || 'positive'
                }));
              }
              return [{ label: '', type: 'positive' }];
            })(),
            checkboxValues: item.values && item.values.length > 0 ? item.values.map(v => v.label || v.value || v) : [''],
            checkboxSelectedStates: item.values && item.values.length > 0 ? item.values.map(() => false) : [false],
            optionsInputsValues: item.values && item.values.length > 0 ? item.values.map(v => v.label || v.value || v) : ['']
          }))
        }];
        setQuestionSections(mappedSections);
        
        // Auto-load sub-groups for tasks that have group values
        const uniqueGroupIds = [...new Set(
          data.custom_form.content
            .filter(item => item.group_id && item.group_id.trim() !== '')
            .map(item => item.group_id)
        )];
        
        if (uniqueGroupIds.length > 0) {
          console.log('Auto-loading sub-groups for groups:', uniqueGroupIds);
          uniqueGroupIds.forEach(groupId => {
            loadTaskSubGroups(groupId);
          });
        }
      }

      // Parse cron expression for time setup
      if (data.asset_task.cron_expression) {
        const cronParts = data.asset_task.cron_expression.split(' ');
        if (cronParts.length >= 5) {
          const minutes = cronParts[0] !== '*' ? cronParts[0].split(',') : ['00'];
          const hours = cronParts[1] !== '*' ? cronParts[1].split(',') : ['12'];
          const days = cronParts[2] !== '*' ? cronParts[2].split(',') : [];
          const monthString = cronParts[3] !== '*' ? cronParts[3] : '';
          const weekdays = cronParts[4] !== '*' ? cronParts[4].split(',').map(d => {
            const dayMap: { [key: string]: string } = {
              '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday',
              '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday'
            };
            return dayMap[d] || d;
          }).filter((day, index, array) => day && day.trim() && array.indexOf(day) === index) : [];

          // Convert numeric months to month names for UI
          const monthMap: { [key: string]: string } = {
            '1': 'January', '2': 'February', '3': 'March', '4': 'April',
            '5': 'May', '6': 'June', '7': 'July', '8': 'August',
            '9': 'September', '10': 'October', '11': 'November', '12': 'December'
          };

          // Handle month ranges and specific months
          let monthMode = 'all';
          let months: string[] = [];
          let betweenMonthStart = 'January';
          let betweenMonthEnd = 'December';

          if (monthString && monthString !== '*') {
            // Check if it's a range (contains a hyphen)
            if (monthString.includes('-')) {
              const [start, end] = monthString.split('-');
              monthMode = 'between';
              betweenMonthStart = monthMap[start] || 'January';
              betweenMonthEnd = monthMap[end] || 'December';
            } else {
              // Specific months selected (comma-separated)
              const monthNumbers = monthString.split(',');
              monthMode = 'specific';
              months = monthNumbers.map(num => monthMap[num] || num);
            }
          }

          // Determine day mode based on data
          const dayMode = days.length > 0 ? 'specific' : (weekdays.length > 0 ? 'weekdays' : 'weekdays');

          setTimeSetupData(prev => ({
            ...prev,
            hourMode: hours.length > 0 ? 'specific' : 'all',
            minuteMode: minutes.length > 0 ? 'specific' : 'all',
            dayMode: dayMode,
            monthMode: monthMode,
            selectedMinutes: minutes,
            selectedHours: hours,
            selectedDays: days,
            selectedMonths: months,
            selectedWeekdays: weekdays,
            betweenMonthStart: betweenMonthStart,
            betweenMonthEnd: betweenMonthEnd
          }));

          // Debug logging for weekdays
          console.log('EditSchedulePage - Parsed weekdays:', weekdays);
          console.log('EditSchedulePage - selectedWeekdays:', weekdays);
        }
      }

    } catch (error) {
      console.error('Error loading schedule data:', error);
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const loadTaskGroups = async () => {
    setLoadingStates(prev => ({ ...prev, taskGroups: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/asset_groups.json?type=checklist`, {
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
      toast.error("Failed to load task groups. Using fallback data.");
      // Keep mock data as fallback
      const mockTaskGroups = [
        { id: 1, name: 'Safety' },
        { id: 2, name: 'Maintenance' },
        { id: 3, name: 'Operations' }
      ];
      setTaskGroups(mockTaskGroups);
    } finally {
      setLoadingStates(prev => ({ ...prev, taskGroups: false }));
    }
  };

  const loadTaskSubGroups = async (groupId: string) => {
    if (!groupId) return;

    setLoadingStates(prev => ({ ...prev, taskSubGroups: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`, {
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
      toast.error("Failed to load task sub-groups. Using fallback data.");
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
      setLoadingStates(prev => ({ ...prev, taskSubGroups: false }));
    }
  };

  const loadGroups = async () => {
    setLoadingStates(prev => ({ ...prev, groups: true }));
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
      console.log('Extracted groups:', groupsArray);

      setGroups(groupsArray);
    } catch (error) {
      console.error('Failed to load user groups:', error);
      toast.error("Failed to load user groups. Using fallback data.", {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
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
      setLoadingStates(prev => ({ ...prev, groups: false }));
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

  const handleUpdateSchedule = async () => {
    console.log('handleUpdateSchedule called');
    
    if (!customFormCode) {
      toast.error('Custom form code is required for updating');
      return;
    }

    console.log('Starting validation...');
    console.log('Current questionSections:', questionSections);
    // Validate all steps before submission - make basic validation async
    const basicErrors = await validateBasicConfiguration();
    const scheduleErrors = validateScheduleSetup();
    const questionErrors = validateQuestionSetup();
    const timeValid = validateTimeSetup();

    const allErrors = [...basicErrors, ...scheduleErrors, ...questionErrors];
    if (!timeValid) {
      allErrors.push('Time setup validation failed');
    }

    console.log('Validation results:', { basicErrors, scheduleErrors, questionErrors, timeValid, allErrors });

    if (allErrors.length > 0) {
      allErrors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Build the API payload
      const payload = buildAPIPayload();
      
      console.log('Update payload:', payload);
      
      // Make PUT API call to update the schedule
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/custom_forms/${id}/edit_checklist.json?access_token=${API_CONFIG.TOKEN}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update response:', result);

      toast.success('Schedule updated successfully');
      navigate('/maintenance/schedule');
    } catch (error) {
      console.error('Error updating schedule:', error);
      if (error instanceof Error) {
        toast.error(`Failed to update schedule: ${error.message}`);
      } else {
        toast.error('Failed to update schedule');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation functions for each section - field-level errors like AddSchedulePage
  const validateBasicConfiguration = async (): Promise<string[]> => {
    const errors: string[] = [];
    const newFieldErrors: { [fieldName: string]: string } = {};

    if (!formData.activityName.trim()) {
      errors.push('Activity Name is required');
      newFieldErrors.activityName = 'Activity Name is required';
    } else {
      // Check for duplicate activity names, excluding current schedule
      const isUnique = await validateActivityName(formData.activityName, id);
      if (!isUnique) {
        errors.push('Activity name already exists');
        newFieldErrors.activityName = 'Activity name already exists';
      }
    }

    if (!formData.type) {
      errors.push('Schedule Type is required');
      newFieldErrors.type = 'Schedule Type is required';
    }

    if (!formData.scheduleFor) {
      errors.push('Schedule For is required');
      newFieldErrors.scheduleFor = 'Schedule For is required';
    }

    setFieldErrors(newFieldErrors);
    return errors;
  };

  const validateScheduleSetup = (): string[] => {
    const errors: string[] = [];
    const newFieldErrors: { [fieldName: string]: string } = {};

    // Check if assets are selected when scheduleFor is Asset
    if (formData.scheduleFor === 'Asset' && formData.checklistType === 'Individual' && (!formData.asset || formData.asset.length === 0)) {
      errors.push('At least one asset must be selected');
      newFieldErrors.asset = 'At least one asset must be selected';
    }

    // Check if services are selected when scheduleFor is Service
    if (formData.scheduleFor === 'Service' && formData.checklistType === 'Individual' && (!formData.service || formData.service.length === 0)) {
      errors.push('At least one service must be selected');
      newFieldErrors.service = 'At least one service must be selected';
    }

    if (!formData.assignToType) {
      errors.push('Assignment type is required');
      newFieldErrors.assignToType = 'Assignment type is required';
    }

    if (formData.assignToType === 'user' && (!formData.selectedUsers || formData.selectedUsers.length === 0)) {
      errors.push('At least one user must be assigned');
      newFieldErrors.selectedUsers = 'At least one user must be assigned';
    }

    if (formData.assignToType === 'group' && (!formData.selectedGroups || formData.selectedGroups.length === 0)) {
      errors.push('At least one group must be assigned');
      newFieldErrors.selectedGroups = 'At least one group must be assigned';
    }

    if (!formData.planDuration) {
      errors.push('Plan Duration is required');
      newFieldErrors.planDuration = 'Plan Duration is required';
    }

    if (formData.planDuration && !formData.planDurationValue) {
      errors.push('Plan Duration Value is required');
      newFieldErrors.planDurationValue = 'Plan Duration Value is required';
    }

    // if (!formData.category) {
    //   errors.push('Category is required');
    //   newFieldErrors.category = 'Category is required';
    // }

    if (!formData.submissionTime) {
      errors.push('Submission Time is required');
      newFieldErrors.submissionTime = 'Submission Time is required';
    }

    if (formData.submissionTime && !formData.submissionTimeValue) {
      errors.push('Submission Time Value is required');
      newFieldErrors.submissionTimeValue = 'Submission Time Value is required';
    }

    if (!formData.graceTime) {
      errors.push('Grace Time is required');
      newFieldErrors.graceTime = 'Grace Time is required';
    }

    if (formData.graceTime && !formData.graceTimeValue) {
      errors.push('Grace Time Value is required');
      newFieldErrors.graceTimeValue = 'Grace Time Value is required';
    }

    if (!formData.lockOverdueTask) {
      errors.push('Lock Overdue Task setting is required');
      newFieldErrors.lockOverdueTask = 'Lock Overdue Task setting is required';
    }

    if (!formData.startFrom) {
      errors.push('Start Date is required');
      newFieldErrors.startFrom = 'Start Date is required';
    }

    if (!formData.endAt) {
      errors.push('End Date is required');
      newFieldErrors.endAt = 'End Date is required';
    }

    if (formData.startFrom && formData.endAt && formData.endAt < formData.startFrom) {
      errors.push('End date cannot be before start date');
      newFieldErrors.endAt = 'End date cannot be before start date';
    }

    setFieldErrors(newFieldErrors);
    return errors;
  };

  const validateQuestionSetup = (): string[] => {
    const errors: string[] = [];

    questionSections.forEach((section, sectionIndex) => {
      section.tasks.forEach((task, taskIndex) => {
        if (task.task.trim()) { // Only validate if task has content
          if (task.mandatory && !task.inputType) {
            errors.push(`Task "${task.task}" in Section ${sectionIndex + 1} requires an input type`);
          }

          if (task.inputType === 'dropdown' && (!task.dropdownValues || task.dropdownValues.length === 0 || !task.dropdownValues.some(v => v.label.trim()))) {
            errors.push(`Task "${task.task}" in Section ${sectionIndex + 1} requires at least one dropdown option`);
          }

          if (task.inputType === 'radio' && (!task.radioValues || task.radioValues.length === 0 || !task.radioValues.some(v => v.label.trim()))) {
            errors.push(`Task "${task.task}" in Section ${sectionIndex + 1} requires at least one radio option`);
          }

          if (task.inputType === 'checkbox' && (!task.checkboxValues || task.checkboxValues.length === 0 || !task.checkboxValues.some(v => v.trim()))) {
            errors.push(`Task "${task.task}" in Section ${sectionIndex + 1} requires at least one checkbox option`);
          }

          if (task.inputType === 'options-inputs' && (!task.optionsInputsValues || task.optionsInputsValues.length === 0 || !task.optionsInputsValues.some(v => v.trim()))) {
            errors.push(`Task "${task.task}" in Section ${sectionIndex + 1} requires at least one option`);
          }

          if (weightage && task.mandatory && task.weightage === '') {
            errors.push(`Task "${task.task}" in Section ${sectionIndex + 1} requires weightage value`);
          }
        }
      });
    });

    return errors;
  };

  const validateTimeSetup = (): boolean => {
    // Validate hour settings
    if (timeSetupData.hourMode === 'specific' && timeSetupData.selectedHours.length === 0) {
      toast.error('Please select at least one hour');
      return false;
    }

    // Validate minute settings
    if (timeSetupData.minuteMode === 'specific' && timeSetupData.selectedMinutes.length === 0) {
      toast.error('Please select at least one minute');
      return false;
    }

    if (timeSetupData.minuteMode === 'between') {
      const startMinute = parseInt(timeSetupData.betweenMinuteStart);
      const endMinute = parseInt(timeSetupData.betweenMinuteEnd);
      if (startMinute >= endMinute) {
        toast.error('Start minute must be less than end minute');
        return false;
      }
    }

    // Validate day settings
    if (timeSetupData.dayMode === 'weekdays' && timeSetupData.selectedWeekdays.length === 0) {
      toast.error('Please select at least one weekday');
      return false;
    }

    if (timeSetupData.dayMode === 'specific' && timeSetupData.selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return false;
    }

    // Validate month settings
    if (timeSetupData.monthMode === 'specific' && timeSetupData.selectedMonths.length === 0) {
      toast.error('Please select at least one month');
      return false;
    }

    if (timeSetupData.monthMode === 'between') {
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const startIndex = monthOrder.indexOf(timeSetupData.betweenMonthStart);
      const endIndex = monthOrder.indexOf(timeSetupData.betweenMonthEnd);
      if (startIndex >= endIndex) {
        toast.error('Start month must be before end month');
        return false;
      }
    }

    return true;
  };

  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];

    switch (activeStep) {
      case 0:
        errors.push(...validateBasicConfiguration());
        break;
      case 1:
        errors.push(...validateScheduleSetup());
        break;
      case 2:
        errors.push(...validateQuestionSetup());
        break;
      case 3:
        return validateTimeSetup();
      default:
        break;
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error);
      });
      return false;
    }

    return true;
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
    console.log('Building cron expression with timeSetupData:', timeSetupData);
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
        'Sunday': '0',
        'Monday': '1',
        'Tuesday': '2',
        'Wednesday': '3',
        'Thursday': '4',
        'Friday': '5',
        'Saturday': '6'
      };
      dayOfWeek = timeSetupData.selectedWeekdays.map(day => weekdayMap[day]).filter(val => val !== undefined && val !== '').join(',');
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

    const cronResult = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    console.log('Built cron expression:', cronResult);
    return cronResult;
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
          hint: task.helpText ? (task.helpTextValue || "") : "",
          values: values,
          weightage: task.weightage || "",
          rating_enabled: task.rating ? "true" : "false",
          question_hint_image_ids: task.helpText && task.helpTextAttachments 
            ? (() => {
                // Get only existing attachment IDs (numeric, from original API data)
                const existingIds = task.helpTextAttachments
                  .map(attachment => {
                    if (attachment.id && 
                        !attachment.id.toString().startsWith('existing_') && 
                        !attachment.id.toString().includes('-') &&
                        !isNaN(Number(attachment.id))) {
                      return attachment.id;
                    }
                    return null;
                  })
                  .filter(id => id !== null);
                
                // If no existing IDs found, return empty array (all are newly added)
                return existingIds.length > 0 ? existingIds : [];
              })()
            : []
        };
      })
    );

    // Build custom_form object
    const customForm: any = {};
    let contentIndex = 1; // Track position in content array
    
    questionSections.forEach((section) => {
      section.tasks.filter(task => task.task.trim()).forEach(task => {
        // If this task has help text and attachments, add them with correct index
        if (task.helpText) {
          // Validation: All helpText tasks must have helpTextValue and helpTextAttachments
          if (!task.helpTextValue || !task.helpTextValue.trim()) {
            throw new Error('Please enter Help Text for all tasks where Help Text is checked.');
          }
          if (!task.helpTextAttachments || task.helpTextAttachments.length === 0) {
            throw new Error('Please attach a help file for all tasks where Help Text is checked.');
          }
          
          // Create individual question_for_{contentIndex} for each task with help text
          customForm[`question_for_${contentIndex}`] = task.helpTextAttachments.map(attachment => {
            // Handle both existing attachments (with URLs) and new attachments (with base64 content)
            if (attachment.url && !attachment.content.startsWith('data:')) {
              // Existing attachment from API - preserve as URL reference
              return {
                filename: attachment.name,
                content: attachment.url, // Use URL for existing attachments
                content_type: attachment.content_type,
                attachment_id: attachment.id // Include ID for existing attachments
              };
            } else {
              // New attachment with base64 content
              return {
                filename: attachment.name,
                content: attachment.content,
                content_type: attachment.content_type
              };
            }
          });
        }
        
        contentIndex++;
      });
    });

    // Get selected asset IDs or service IDs based on scheduleFor
    const assetIds = formData.scheduleFor === 'Asset' && formData.checklistType === 'Individual' ? formData.asset : [];
    const serviceIds = formData.scheduleFor === 'Service' && formData.checklistType === 'Individual' ? formData.service : [];

    // Get assigned people IDs
    const peopleAssignedIds = formData.assignToType === 'user' ? formData.selectedUsers : [];

    // Get assigned group IDs
    const groupAssignedIds = formData.assignToType === 'group' ? formData.selectedGroups : [];

    // Build dynamic cron fields - only if editTiming is enabled
    let cronExpression = "0 12 * * 1-5"; // Default cron
    let cronMinute = "off";
    let cronMinuteSpecificSpecific = "";
    let cronHour = "off";
    let cronHourSpecificSpecific = "";
    let cronDay = "off";
    let cronMonth = "off";

    if (editTiming) {
      cronExpression = buildCronExpression();

      // Build minute cron field
      if (timeSetupData.minuteMode === 'specific' && timeSetupData.selectedMinutes.length > 0) {
        cronMinute = "specificMinute";
        cronMinuteSpecificSpecific = timeSetupData.selectedMinutes.join(',');
      }

      // Build hour cron field
      if (timeSetupData.hourMode === 'specific' && timeSetupData.selectedHours.length > 0) {
        cronHour = "specificHour";
        cronHourSpecificSpecific = timeSetupData.selectedHours.join(',');
      }

      // Build day cron field
      if (timeSetupData.dayMode === 'weekdays' && timeSetupData.selectedWeekdays.length > 0) {
        cronDay = "everyWeekDay";
      } else if (timeSetupData.dayMode === 'specific' && timeSetupData.selectedDays.length > 0) {
        cronDay = "specificDate";
      }

      // Build month cron field
      if (timeSetupData.monthMode === 'specific' && timeSetupData.selectedMonths.length > 0) {
        cronMonth = "specificMonth";
      } else if (timeSetupData.monthMode === 'between') {
        cronMonth = "betweenMonth";
      } else if (timeSetupData.monthMode === 'all') {
        cronMonth = "everyMonth";
      }
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
        before_after_enabled: formData.checkInPhotograph === 'active',
        rule_ids: formData.emailTriggerRule ? [formData.emailTriggerRule] : [],
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
      usergroup_ids: groupAssignedIds,
      ppm_rule_ids: formData.emailTriggerRule ? [formData.emailTriggerRule] : [],
      amc_rule_ids: [""],
      training_rule_ids: [""],
      // Dynamic time setup fields from TimeSetupStep component
      cronMinute: cronMinute,
      cronMinuteSpecificSpecific: cronMinuteSpecificSpecific,
      cronHour: cronHour,
      cronHourSpecificSpecific: cronHourSpecificSpecific,
      cronDay: cronDay,
      cronMonth: cronMonth,
      cron_expression: cronExpression,
      check_box_time: editTiming,
      // expholder: ""
    };
  };

  // Update functions for various form fields
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateTaskInSection = (sectionId: string, taskId: string, key: keyof TaskQuestion, value: any): void => {
    setQuestionSections(prev =>
      prev.map(section =>
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

  const updateSectionProperty = (id: string, key: keyof QuestionSection, value: any): void => {
    setQuestionSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, [key]: value } : section
      )
    );
  };

  const addQuestionSection = (): void => {
    const newSection: QuestionSection = {
      id: `section_${Date.now()}`,
      title: `Section ${questionSections.length + 1}`,
      autoTicket: false,
      ticketLevel: 'checklist',
      ticketAssignedTo: '',
      ticketCategory: '',
      tasks: []
    };
    setQuestionSections(prev => [...prev, newSection]);
  };

  const removeQuestionSection = (sectionId: string): void => {
    setQuestionSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const addTaskToSection = (sectionId: string): void => {
    const newTask: TaskQuestion = {
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
    };

    setQuestionSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, tasks: [...section.tasks, newTask] }
          : section
      )
    );
  };

  const removeTaskFromSection = (sectionId: string, taskId: string): void => {
    setQuestionSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, tasks: section.tasks.filter(task => task.id !== taskId) }
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
      'date': 'date',
      'options-inputs': 'options-inputs'
    };
    const mappedType = typeMapping[apiType] || 'text';
    console.log('mapInputType:', apiType, '->', mappedType);
    return mappedType;
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

        toast.success(`Template "${templateData.form_name}" loaded successfully!`, {
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
            background: '#fff',
            color: 'black',
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
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    }
  };

  // Add help text attachment function
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
      toast.error('Failed to access file input. Please try again.', {
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
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newAttachment: AttachmentFile = {
              id: `attachment_${Date.now()}_${Math.random()}`,
              name: file.name,
              url: e.target?.result as string,
              content: (e.target?.result as string).split(',')[1] || '',
              content_type: file.type
            };
            setAttachments(prev => [...prev, newAttachment]);
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  };

  // Render all sections in card layout

  const renderBasicConfiguration = () => (
    <SectionCard style={{ padding: '24px', margin: 0, borderRadius: '3px' }}>
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
          onChange={(e) => updateFormData('type', e.target.value)}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="PPM"
            control={
              <Radio
                sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
              />
            }
            label="PPM"
          />
          <FormControlLabel
            value="AMC"
            control={
              <Radio
                sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
              />
            }
            label="AMC"
          />
          <FormControlLabel
            value="Preparedness"
            control={
              <Radio
                sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
              />
            }
            label="Preparedness"
          />
          <FormControlLabel
            value="Routine"
            control={
              <Radio
                sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
              />
            }
            label="Routine"
          />
        </RadioGroup>
      </Box>

      <TextField
        label={<span>Activity Name <span style={{ color: 'red' }}>*</span></span>}
        placeholder="Enter Activity Name"
        fullWidth
        value={formData.activityName}
        onChange={async (e) => {
          const value = e.target.value;
          updateFormData('activityName', value);
          
          // Clear previous validation result and errors
          setActivityNameValidationResult(null);
          setFieldErrors(prev => {
            const { activityName, ...rest } = prev;
            return rest;
          });
          
          // Real-time validation with debouncing
          if (value.trim().length > 2) {
            setIsValidatingActivityName(true);
            try {
              await validateActivityNameDebounced(value.trim(), id);
            } catch (error) {
              console.error('Activity name validation error:', error);
            } finally {
              setIsValidatingActivityName(false);
            }
          }
        }}
        sx={{ 
          mb: 3,
          '& .MuiFormHelperText-root': {
            color: fieldErrors.activityName ? '#d32f2f' : 
                   (isValidatingActivityName ? '#ed6c02' : 
                    (activityNameValidationResult === true ? '#2e7d32' : 'rgba(0, 0, 0, 0.6)'))
          }
        }}
        error={!!fieldErrors.activityName}
        helperText={
          fieldErrors.activityName || 
          (isValidatingActivityName ? 'Checking availability...' : 
           (activityNameValidationResult === true ? '✓ Activity name is available' : ''))
        }
      />

      <TextField
        label={
          <span style={{ fontSize: '16px' }}>
            Description
          </span>
        }
        placeholder="Enter Description/SOP"
        fullWidth
        multiline
        minRows={4}
        value={formData.description}
        onChange={(e) => updateFormData('description', e.target.value)}
        sx={{
          mb: 3,
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

      {/* Attachments Section */}
      <Box sx={{ mb: 3 }}>
        {/* Display existing attachments as placeholder boxes */}
        {attachments && attachments.length > 0 && (
          <Box sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            flexWrap: 'wrap'
          }}>
            {attachments.map((attachment) => {
              // Check if the file is an image by extension or mime type if available
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
                        borderRadius: 4,
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
                        width: '100%',
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

  const renderScheduleSetup = () => (
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
        {formData.scheduleFor === 'Asset' && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Checklist Type
            </Typography>
            <Box sx={{ mb: 3 }}>
              <RadioGroup
                row
                value={formData.checklistType}
                onChange={(e) => updateFormData('checklistType', e.target.value)}
              >
                <FormControlLabel
                  value="Individual"
                  control={
                    <Radio
                      sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                    />
                  }
                  label="Individual"
                />
                <FormControlLabel
                  value="Asset Group"
                  control={
                    <Radio
                      sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                    />
                  }
                  label="Asset Group"
                />
              </RadioGroup>
            </Box>
          </Box>
        )}

        {/* Right side - Check-in with before/after photograph */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: formData.scheduleFor === 'Asset' ? 'end' : 'start', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Check-in with before/after photograph
          </Typography>
          <RadioGroup
            style={{ marginTop: '-18px', marginRight: '-12px' }}
            row
            value={formData.checkInPhotograph || 'inactive'}
            onChange={(e) => updateFormData('checkInPhotograph', e.target.value)}
          >
            <FormControlLabel
              value="active"
              control={
                <Radio
                  sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                />
              }
              label="Active"
            />
            <FormControlLabel
              value="inactive"
              control={
                <Radio
                  sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                />
              }
              label="Inactive"
            />
          </RadioGroup>
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {/* Conditional Asset/Service Dropdown - Show based on scheduleFor */}
          {formData.scheduleFor === 'Asset' && formData.checklistType === 'Individual' && (
            <Box sx={{ minWidth: 0 }}>
              
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Select Assets <span style={{ color: 'red' }}>*</span></InputLabel>
                <Select
                  multiple
                  label="Select Assets"
                  notched
                  displayEmpty
                  value={Array.isArray(formData.asset) ? formData.asset : []}
                  onChange={(e) => updateFormData('asset', e.target.value)}
                  renderValue={(selected) => {
                    if (!selected || selected.length === 0) {
                      return <span style={{ color: '#aaa' }}>Select Assets</span>;
                    }
                    const names = assets
                      .filter(asset => selected.includes(asset.id.toString()))
                      .map(asset => asset.name)
                      .join(', ');
                    return (
                      <span
                        title={names}
                        style={{
                          display: 'inline-block',
                          maxWidth: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {names}
                      </span>
                    );
                  }}
                  sx={{
                    minWidth: 0,
                    width: '100%',
                    maxWidth: '100%',
                    '& .MuiSelect-select': {
                      display: 'block',
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        minWidth: 200,
                        maxWidth: 520,
                        width: 'auto'
                      }
                    }
                  }}
                >
                  <MenuItem value="">Select Assets</MenuItem>
                  {Array.isArray(assets) && assets.map((option) => (
                    <MenuItem key={option.id} value={option.id.toString()}>{option.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Services Dropdown - Show when scheduleFor is 'Service' */}
          {formData.scheduleFor === 'Service' && (
            <Box sx={{ minWidth: 0 }}>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Select Services <span style={{ color: 'red' }}>*</span></InputLabel>
                <Select
                  multiple
                  label="Select Services"
                  notched
                  displayEmpty
                  value={Array.isArray(formData.service) ? formData.service : []}
                  onChange={(e) => updateFormData('service', e.target.value)}
                  renderValue={(selected) => {
                    if (!selected || selected.length === 0) {
                      return <span style={{ color: '#aaa' }}>Select Services</span>;
                    }
                    const names = services
                      .filter(service => selected.includes(service.id.toString()))
                      .map(service => service.service_name)
                      .join(', ');
                    return (
                      <span
                        title={names}
                        style={{
                          display: 'inline-block',
                          maxWidth: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {names}
                      </span>
                    );
                  }}
                  sx={{
                    minWidth: 0,
                    width: '100%',
                    maxWidth: '100%',
                    '& .MuiSelect-select': {
                      display: 'block',
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        minWidth: 200,
                        maxWidth: 520,
                        width: 'auto'
                      }
                    }
                  }}
                >
                  <MenuItem value="">Select Services</MenuItem>
                  {Array.isArray(services) && services.map((service) => (
                    <MenuItem key={service.id} value={service.id.toString()}>{service.service_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
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
                onChange={(e) => updateFormData('assignToType', e.target.value)}
              >
                <MenuItem value="">Select Assign To</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="group">Group</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Multi-select Users - Show when assignToType is 'user' */}
          {formData.assignToType === 'user' && (
            <Box sx={{ minWidth: 0 }}>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Select Users <span style={{ color: 'red' }}>*</span></InputLabel>
                <Select
                  multiple
                  label="Select Users"
                  notched
                  displayEmpty
                  value={Array.isArray(formData.selectedUsers) ? formData.selectedUsers : []}
                  onChange={(e) => updateFormData('selectedUsers', e.target.value)}
                  renderValue={(selected) => {
                    if (!selected || selected.length === 0) {
                      return <span style={{ color: '#aaa' }}>Select Users</span>;
                    }
                    const names = users
                      .filter(user => selected.includes(user.id))
                      .map(user => user.name || user.full_name)
                      .join(', ');
                    return (
                      <span
                        title={names}
                        style={{
                          display: 'inline-block',
                          maxWidth: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {names}
                      </span>
                    );
                  }}
                  sx={{
                    minWidth: 0,
                    maxWidth: '100%',
                    width: '100%',
                    '& .MuiSelect-select': {
                      display: 'block',
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
                  }}
                  MenuProps={{
                    PaperProps: { style: { minWidth: 200, maxWidth: 520, width: 'auto' } }
                  }}
                >
                  <MenuItem value="">Select Users</MenuItem>
                  {Array.isArray(users) && users.map((option) => (
                    <MenuItem key={option.id} value={option.id}>{option.name || option.full_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Multi-select Groups - Show when assignToType is 'group' */}
          {formData.assignToType === 'group' && (
            <Box>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Select Groups <span style={{ color: 'red' }}>*</span></InputLabel>
                <Select
                  multiple
                  label="Select Groups"
                  notched
                  displayEmpty
                  value={formData.selectedGroups}
                  onChange={(e) => updateFormData('selectedGroups', e.target.value)}
                  renderValue={(selected) => {
                    if (!selected || selected.length === 0) {
                      return <span style={{ color: '#aaa' }}>Select Groups</span>;
                    }
                    console.log("groups:--",groups);
                    
                    return groups
                      .filter(group => selected.includes(group.id.toString()))
                      .map(group => group.name)
                      .join(', ');
                  }}
                  disabled={loadingStates.groups}
                >
                  <MenuItem value="">Select Groups</MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
                {loadingStates.groups && (
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    Loading groups...
                  </Typography>
                )}
              </FormControl>
              
              {/* Display selected groups as chips */}
              {/* {formData.selectedGroups && formData.selectedGroups.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Selected Groups:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.selectedGroups.map(groupId => {
                      const group = groups.find(g => g.id.toString() === groupId.toString());
                      return (
                        <Chip 
                          key={groupId}
                          label={group ? group.name : `Group ID: ${groupId}`}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: '#C72030',
                            color: '#C72030',
                            '&:hover': {
                              borderColor: '#B8252F',
                              backgroundColor: 'rgba(199, 32, 48, 0.04)'
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              )} */}
              
            </Box>
          )}

          <Box>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Backup Assignee <span style={{ color: 'red' }}>*</span></InputLabel>
              <Select
                label="Backup Assignee"
                notched
                displayEmpty
                value={formData.backupAssignee}
                onChange={(e) => updateFormData('backupAssignee', e.target.value)}
              >
                <MenuItem value="">Select Backup Assignee</MenuItem>
                {Array.isArray(users) && users.map((option) => (
                  <MenuItem key={option.id} value={option.id.toString()}>{option.name || option.full_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Plan Duration */}
          <Box>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Plan Duration <span style={{ color: 'red' }}>*</span></InputLabel>
              <Select
                label="Plan Duration"
                notched
                displayEmpty
                value={formData.planDuration}
                onChange={(e) => updateFormData('planDuration', e.target.value)}
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
          {formData.planDuration && formData.planDuration !== '' && (
            <TextField
              label={<span>Plan Duration ({formData.planDuration}) <span style={{ color: 'red' }}>*</span></span>}
              type="number"
              fullWidth
              value={formData.planDurationValue}
              onChange={(e) => {
                const value = e.target.value;
                if (Number(value) < 0) return;
                updateFormData('planDurationValue', value);
              }}
              placeholder={`Enter number of ${formData.planDuration}`}
              inputProps={{
                min: 0,
                onWheel: (e) => (e.target as HTMLInputElement).blur(),
              }}
              sx={fieldStyles}
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
                onChange={(e) => updateFormData('emailTriggerRule', e.target.value)}
              >
                <MenuItem value="">Select Email Trigger Rule</MenuItem>
                {emailRules.map(rule => (
                  <MenuItem key={rule.id} value={rule.id.toString()}>{rule.rule_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Category <span style={{ color: 'red' }}>*</span></InputLabel>
              <Select
                label="Category"
                notched
                displayEmpty
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Non Technical">Non-Technical</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Submission Time */}
          <Box>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Submission Time</InputLabel>
              <Select
                label="Submission Time"
                notched
                displayEmpty
                value={formData.submissionTime}
                onChange={(e) => updateFormData('submissionTime', e.target.value)}
              >
                <MenuItem value="">Select Submission Time</MenuItem>
                <MenuItem value="minutes">Minutes</MenuItem>
                <MenuItem value="hour">Hour</MenuItem>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Submission Time Value Input */}
          {formData.submissionTime && formData.submissionTime !== '' && (
            <TextField
              label={<span>Submission Time ({formData.submissionTime}) <span style={{ color: 'red' }}>*</span></span>}
              type="number"
              fullWidth
              value={formData.submissionTimeValue}
              onChange={(e) => {
                const value = e.target.value;
                if (Number(value) < 0) return;
                updateFormData('submissionTimeValue', value);
              }}
              inputProps={{
                min: 0,
                onWheel: (e) => (e.target as HTMLInputElement).blur(),
              }}
              placeholder={`Enter number of ${formData.submissionTime}`}
              sx={fieldStyles}
            />
          )}

          <Box>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Supervisors</InputLabel>
              <Select
                label="Supervisors"
                notched
                displayEmpty
                value={formData.supervisors}
                onChange={(e) => updateFormData('supervisors', e.target.value)}
                renderValue={(selected) => {
                  if (!selected) return <span style={{ color: '#aaa' }}>Select Supervisors</span>;
                  const user = users.find(u => u.id.toString() === selected);
                  return user ? (user.name || `User ${user.id}`) : selected;
                }}
              >
                <MenuItem value="">Select Supervisors</MenuItem>
                {users.length > 0 ? users.map(user => (
                  <MenuItem key={user.id} value={user.id.toString()}>
                    {user.name || user.email || `User ${user.id}`}
                    {user.email && user.name ? ` (${user.email})` : ''}
                  </MenuItem>
                )) : (
                  <MenuItem disabled>No supervisors available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Lock Overdue Task <span style={{ color: 'red' }}>*</span></InputLabel>
              <Select
                label="Lock Overdue Task"
                notched
                displayEmpty
                value={formData.lockOverdueTask}
                onChange={(e) => updateFormData('lockOverdueTask', e.target.value)}
              >
                <MenuItem value="">Select Lock Status</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Grace Time */}
          <Box>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Grace Time <span style={{ color: 'red' }}>*</span></InputLabel>
              <Select
                label="Grace Time"
                notched
                displayEmpty
                value={formData.graceTime}
                onChange={(e) => updateFormData('graceTime', e.target.value)}
              >
                <MenuItem value="">Select Grace Time</MenuItem>
                <MenuItem value="minutes">Minutes</MenuItem>
                <MenuItem value="hour">Hour</MenuItem>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Grace Time Value Input */}
          {formData.graceTime && formData.graceTime !== '' && (
            <TextField
              label={<span>Grace Time ({formData.graceTime}) <span style={{ color: 'red' }}>*</span></span>}
              type="number"
              fullWidth
              value={formData.graceTimeValue}
              onChange={(e) => {
                const value = e.target.value;
                if (Number(value) < 0) return;
                updateFormData('graceTimeValue', value);
              }}
              inputProps={{
                min: 0,
                onWheel: (e) => (e.target as HTMLInputElement).blur(),
              }}
              placeholder={`Enter number of ${formData.graceTime}`}
              sx={fieldStyles}
            />
          )}

          <Box>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Supplier</InputLabel>
              <Select
                label="Supplier"
                notched
                displayEmpty
                value={formData.supplier}
                onChange={(e) => updateFormData('supplier', e.target.value)}
              >
                <MenuItem value="">Select Supplier</MenuItem>
                {Array.isArray(suppliers) && suppliers.map(supplier => (
                  <MenuItem key={supplier.id} value={supplier.id.toString()}>{supplier.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <TextField
              label={<span>Start Date <span style={{ color: 'red' }}>*</span></span>}
              type="date"
              fullWidth
              variant="outlined"
              value={formData.startFrom}
              onChange={(e) => updateFormData('startFrom', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
              placeholder="Select Start Date"
              inputProps={{
                max: formData.endAt || undefined,
              }}
              error={!!fieldErrors.startFrom}
              helperText={fieldErrors.startFrom}
            />
          </Box>

          <Box>
            <TextField
              label={<span>End Date <span style={{ color: 'red' }}>*</span></span>}
              type="date"
              fullWidth
              variant="outlined"
              value={formData.endAt}
              onChange={(e) => updateFormData('endAt', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
              placeholder="Select End Date"
              inputProps={{
                min: formData.startFrom || undefined,
              }}
              error={!!fieldErrors.endAt || (formData.startFrom && formData.endAt && formData.endAt < formData.startFrom)}
              helperText={
                fieldErrors.endAt ||
                (formData.startFrom && formData.endAt && formData.endAt < formData.startFrom
                  ? "End date cannot be before start date"
                  : "")
              }
            />
          </Box>
        </Box>
      </Box>
    </SectionCard>
  );

  const renderQuestionSetup = () => (
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
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setCreateNew(isChecked);
                  // If disabling createNew, clear template data immediately
                  if (!isChecked) {
                    updateFormData('selectedTemplate', '');
                  }
                }}
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
              onChange={(e) => {
                const templateId = e.target.value as string;
                updateFormData('selectedTemplate', templateId);
                loadTemplateData(templateId);
              }}
            >
              <MenuItem value="">None</MenuItem>
              {templates.map(template => (
                <MenuItem key={template.id} value={template.id.toString()}>{template.form_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
                onChange={(e) => updateFormData('ticketLevel', e.target.value)}
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

            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Assigned To <span style={{ color: 'red' }}>*</span></InputLabel>
              <Select
                label="Assigned To"
                notched
                displayEmpty
                value={formData.ticketAssignedTo}
                onChange={(e) => updateFormData('ticketAssignedTo', e.target.value)}
                renderValue={(selected) => {
                  if (!selected) return <span style={{ color: '#aaa' }}>Select Assignee</span>;
                  const user = users.find(u => u.id.toString() === selected);
                  return user ? (user.name || `User ${user.id}`) : selected;
                }}
              >
                <MenuItem value="">Select Assignee</MenuItem>
                {users.length > 0 ? users.map(user => (
                  <MenuItem key={user.id} value={user.id.toString()}>
                    {user.name || user.email || `User ${user.id}`}
                    {user.email && user.name ? ` (${user.email})` : ''}
                  </MenuItem>
                )) : (
                  <MenuItem disabled>No users available</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
              <InputLabel shrink>Category <span style={{ color: 'red' }}>*</span></InputLabel>
              <Select
                label="Category"
                notched
                displayEmpty
                value={formData.ticketCategory}
                onChange={(e) => updateFormData('ticketCategory', e.target.value)}
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id.toString()}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </SectionCard>
      )}

      {/* Main Content in White Box */}
      {questionSections.map((section, sectionIndex) => (
        <div key={section.id} className="overflow-hidden">
          <div className="p-4 sm:p-6 bg-white">
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
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      section.tasks.forEach(task => {
                        handleTaskGroupChange(section.id, task.id, selectedValue);
                      });
                    }}
                    disabled={loadingStates.taskGroups}
                  >
                    <MenuItem value="">Select Group</MenuItem>
                    {taskGroups && taskGroups.map(group => (
                      <MenuItem key={group.id} value={group.id.toString()}>{group.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {loadingStates.taskGroups && (
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
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      section.tasks.forEach(task => {
                        updateTaskInSection(section.id, task.id, 'subGroup', selectedValue);
                      });
                    }}
                    disabled={loadingStates.taskSubGroups || !section.tasks[0]?.group}
                  >
                    <MenuItem value="">Select Sub-Group</MenuItem>
                    {section.tasks[0]?.group && taskSubGroups[section.tasks[0].group] && taskSubGroups[section.tasks[0].group].map(subGroup => (
                      <MenuItem key={subGroup.id} value={subGroup.id.toString()}>{subGroup.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {loadingStates.taskSubGroups && (
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
                      <Close fontSize="small" />
                    </IconButton>
                  )}

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
                      label={<span>Task{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</span>}
                      placeholder="Enter Task"
                      fullWidth
                      value={task.task}
                      onChange={(e) => updateTaskInSection(section.id, task.id, 'task', e.target.value)}
                      sx={fieldStyles}
                    />

                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                      <InputLabel shrink>Input Type{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</InputLabel>
                      <Select
                        label="Input Type"
                        notched
                        displayEmpty
                        value={task.inputType || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (task.reading && !formData.selectedTemplate) return;
                          updateTaskInSection(section.id, task.id, 'inputType', value);
                          // Reset values when changing input type
                          if (value === 'dropdown') {
                            updateTaskInSection(section.id, task.id, 'dropdownValues', [
                              { label: 'Yes', type: 'positive' },
                              { label: 'No', type: 'negative' }
                            ]);
                          } else if (value === 'radio') {
                            updateTaskInSection(section.id, task.id, 'radioValues', [
                              { label: 'Yes', type: 'positive' },
                              { label: 'No', type: 'negative' }
                            ]);
                          } else if (value === 'checkbox') {
                            updateTaskInSection(section.id, task.id, 'checkboxValues', ['Yes', 'No']);
                            updateTaskInSection(section.id, task.id, 'checkboxSelectedStates', [false, false]);
                          } else if (value === 'options-inputs') {
                            updateTaskInSection(section.id, task.id, 'optionsInputsValues', ['']);
                          } else if (value !== 'dropdown' && value !== 'radio' && value !== 'checkbox' && value !== 'options-inputs') {
                            updateTaskInSection(section.id, task.id, 'dropdownValues', [{ label: '', type: 'positive' }]);
                            updateTaskInSection(section.id, task.id, 'radioValues', [{ label: '', type: 'positive' }]);
                            updateTaskInSection(section.id, task.id, 'checkboxValues', ['']);
                            updateTaskInSection(section.id, task.id, 'checkboxSelectedStates', [false]);
                            updateTaskInSection(section.id, task.id, 'optionsInputsValues', ['']);
                          }
                        }}
                        disabled={task.reading && !formData.selectedTemplate}
                      >
                        <MenuItem value="">Select Input Type</MenuItem>
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="number">Numeric</MenuItem>
                        <MenuItem value="dropdown">Dropdown</MenuItem>
                        <MenuItem value="radio">Radio</MenuItem>
                        <MenuItem value="checkbox">Checkbox</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="options-inputs">Options & Inputs</MenuItem>
                      </Select>
                    </FormControl>

                    {weightage && (
                      <TextField
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
                          onWheel: (e) => (e.target as HTMLInputElement).blur(),
                        }}
                        placeholder="Enter weightage"
                        sx={fieldStyles}
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
                        sx={fieldStyles}
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
                                  {attachment.filename || attachment.name || attachment.document_name || 'Attachment'}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => removeHelpTextAttachment(section.id, task.id, attachment.id)}
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

                  {/* Input Type Configurations */}
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
                              onChange={(e) => {
                                // Update dropdown value
                                const newValues = [...task.dropdownValues];
                                newValues[valueIndex] = { ...newValues[valueIndex], label: e.target.value };
                                updateTaskInSection(section.id, task.id, 'dropdownValues', newValues);
                              }}
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
                                onChange={(e) => {
                                  const newValues = [...task.dropdownValues];
                                  newValues[valueIndex] = { ...newValues[valueIndex], type: e.target.value };
                                  updateTaskInSection(section.id, task.id, 'dropdownValues', newValues);
                                }}
                              >
                                <MenuItem value="">Select Type</MenuItem>
                                <MenuItem value="positive">P</MenuItem>
                                <MenuItem value="negative">N</MenuItem>
                              </Select>
                            </FormControl>
                            {task.dropdownValues.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const newValues = task.dropdownValues.filter((_, idx) => idx !== valueIndex);
                                  updateTaskInSection(section.id, task.id, 'dropdownValues', newValues);
                                }}
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
                            onClick={() => {
                              const newValues = [...task.dropdownValues, { label: '', type: 'positive' }];
                              updateTaskInSection(section.id, task.id, 'dropdownValues', newValues);
                            }}
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

                  {/* Radio Input Type Configuration */}
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
                              onChange={(e) => {
                                const newValues = [...task.radioValues];
                                newValues[valueIndex] = { ...newValues[valueIndex], label: e.target.value };
                                updateTaskInSection(section.id, task.id, 'radioValues', newValues);
                              }}
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
                                onChange={(e) => {
                                  const newValues = [...task.radioValues];
                                  newValues[valueIndex] = { ...newValues[valueIndex], type: e.target.value };
                                  updateTaskInSection(section.id, task.id, 'radioValues', newValues);
                                }}
                              >
                                <MenuItem value="">Select Type</MenuItem>
                                <MenuItem value="positive">P</MenuItem>
                                <MenuItem value="negative">N</MenuItem>
                              </Select>
                            </FormControl>
                            {task.radioValues.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const newValues = task.radioValues.filter((_, idx) => idx !== valueIndex);
                                  updateTaskInSection(section.id, task.id, 'radioValues', newValues);
                                }}
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
                            onClick={() => {
                              const newValues = [...task.radioValues, { label: '', type: 'positive' }];
                              updateTaskInSection(section.id, task.id, 'radioValues', newValues);
                            }}
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

                  {/* Checkbox Input Type Configuration */}
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
                              onChange={(e) => {
                                const newSelectedStates = [...(task.checkboxSelectedStates || [])];
                                newSelectedStates[valueIndex] = e.target.checked;
                                updateTaskInSection(section.id, task.id, 'checkboxSelectedStates', newSelectedStates);
                              }}
                              sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }}
                            />

                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Enter option value"
                              value={value}
                              onChange={(e) => {
                                const newValues = [...task.checkboxValues];
                                newValues[valueIndex] = e.target.value;
                                updateTaskInSection(section.id, task.id, 'checkboxValues', newValues);
                              }}
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
                                onClick={() => {
                                  const newValues = task.checkboxValues.filter((_, idx) => idx !== valueIndex);
                                  const newSelectedStates = task.checkboxSelectedStates?.filter((_, idx) => idx !== valueIndex) || [];
                                  updateTaskInSection(section.id, task.id, 'checkboxValues', newValues);
                                  updateTaskInSection(section.id, task.id, 'checkboxSelectedStates', newSelectedStates);
                                }}
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
                            onClick={() => {
                              const newValues = [...task.checkboxValues, ''];
                              const newSelectedStates = [...(task.checkboxSelectedStates || []), false];
                              updateTaskInSection(section.id, task.id, 'checkboxValues', newValues);
                              updateTaskInSection(section.id, task.id, 'checkboxSelectedStates', newSelectedStates);
                            }}
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

                  {/* Options & Inputs Type Configuration */}
                  {task.inputType === 'options-inputs' && (
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
                        {task.optionsInputsValues && task.optionsInputsValues.map((value, valueIndex) => (
                          <Box key={valueIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Enter option value"
                              value={value}
                              onChange={(e) => {
                                const newValues = [...task.optionsInputsValues];
                                newValues[valueIndex] = e.target.value;
                                updateTaskInSection(section.id, task.id, 'optionsInputsValues', newValues);
                              }}
                              label={<span>Option{task.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</span>}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'white'
                                }
                              }}
                            />
                            {task.optionsInputsValues.length > 1 && (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const newValues = task.optionsInputsValues.filter((_, idx) => idx !== valueIndex);
                                  updateTaskInSection(section.id, task.id, 'optionsInputsValues', newValues);
                                }}
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
                            onClick={() => {
                              const newValues = [...task.optionsInputsValues, ''];
                              updateTaskInSection(section.id, task.id, 'optionsInputsValues', newValues);
                            }}
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
      console.log("timeSetupData:--", timeSetupData);
      console.log("editTiming:--", editTiming);

  const renderTimeSetup = () => (
    <SectionCard style={{ padding: '24px', margin: 0, borderRadius: '3px' }}>
      {/* Header with edit timing checkbox */}
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#C72030', textTransform: 'uppercase' }}>
            Time Setup
          </Typography>
        </Box>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={editTiming}
              onChange={(e) => setEditTiming(e.target.checked)}
              sx={{
                color: '#C72030',
                '&.Mui-checked': {
                  color: '#C72030'
                }
              }}
            />
          }
          label="Edit Timing"
          sx={{ color: '#666' }}
        />
      </Box>

      <TimeSetupStep
        data={timeSetupData}
        onChange={(field, value) => {
          console.log('TimeSetup onChange:', field, value);
          setTimeSetupData(prev => ({ ...prev, [field]: value }));
        }}
        isCompleted={false}
        isCollapsed={false}
        disabled={!editTiming}
        hideTitle={true}
        isEditPage={true}
      />
    </SectionCard>
  );

  const renderMapping = () => (
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
            // Handle mapping data changes
            console.log('Mapping data changed:', mappingData);
          }}
          isCompleted={false}
          isCollapsed={false}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography>Loading schedule data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%', margin: '0 auto' }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#1a1a1a' }}>
        Edit Schedule
      </Typography>

      {/* All Sections in Card Layout */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {renderBasicConfiguration()}
        {renderScheduleSetup()}
        {renderQuestionSetup()}
        {renderTimeSetup()}
        {/* {renderMapping()} */}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
        <CancelButton
          onClick={() => navigate('/maintenance/schedule')}
        >
          Cancel
        </CancelButton>

        <RedButton
          onClick={handleUpdateSchedule}
          disabled={isSubmitting}
          // startIcon={isSubmitting ? <LinearProgress size={20} /> : <Save />}
        >
          {isSubmitting ? 'Updating...' : 'Update Schedule'}
        </RedButton>
      </Box>
    </Box>
  );
};


