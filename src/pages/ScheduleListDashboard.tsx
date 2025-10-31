import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Button } from '@/components/ui/button';
import Switch from '@mui/material/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Filter, Download, Eye, Edit, Copy, Calendar, BarChart3, Clock, Settings, Wrench, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { ScheduleFilterDialog } from '@/components/ScheduleFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ScheduleSelector } from '@/components/ScheduleSelector';
import { RecentSchedulesSidebar } from '@/components/RecentSchedulesSidebar';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { Cell, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchCustomForms, transformCustomFormsData, TransformedScheduleData } from '@/services/customFormsAPI';
import { useQuery } from '@tanstack/react-query';
import { API_CONFIG, ENDPOINTS } from '@/config/apiConfig';
import { apiClient } from '@/utils/apiClient';
import { toast, Toaster } from "sonner";
import { Pagination, PaginationItem, PaginationContent, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export const ScheduleListDashboard = () => {
  const navigate = useNavigate();
  // State for deactivate modal (must be inside component)
  const [deactivateModal, setDeactivateModal] = useState<{ open: boolean; scheduleId: string | null }>({ open: false, scheduleId: null });
  const [deactivateOption, setDeactivateOption] = useState<'upcoming' | 'all'>('upcoming');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(['checklist', 'technical-checklist', 'non-technical-checklist']);
  const [optimisticActive, setOptimisticActive] = useState<{[id: string]: boolean}>({});
  
  // Add filter state
  const [filters, setFilters] = useState({
    activityName: '',
    type: '',
    category: ''
  });

  // Add search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Debounced filters to prevent excessive API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedFilters(filters);
      setCurrentPage(1); // Reset to first page when filters change
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Debounce search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Build query parameters for API
  const buildQueryParams = (page: number = 1) => {
    const params: Record<string, string> = {};
    
    // Add pagination
    params['page'] = page.toString();
    
    // Add access_token from API_CONFIG.TOKEN
    if (API_CONFIG.TOKEN) {
      params['access_token'] = API_CONFIG.TOKEN;
    }
    
    if (debouncedFilters.activityName) {
      params['q[form_name_cont]'] = debouncedFilters.activityName;
    }
    
    if (debouncedFilters.type) {
      params['q[schedule_type_eq]'] = debouncedFilters.type.toUpperCase();
    }
    
    if (debouncedFilters.category) {
      params['q[tasks_category_eq]'] = debouncedFilters.category.charAt(0).toUpperCase() + debouncedFilters.category.slice(1).toLowerCase();
    }
    
    // Add search query to API params (lowercase for case-insensitive search)
    if (debouncedSearchQuery.trim()) {
      params['q[form_name_cont]'] = debouncedSearchQuery.trim().toLowerCase();
    }
    
    return params;
  };

  // Single API call for all schedule data with pagination
  const {
    data: customFormsData,
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['custom-forms', debouncedFilters, debouncedSearchQuery, currentPage],
    queryFn: async () => {
      try {
        const params = buildQueryParams(currentPage);
        console.log('Fetching custom forms with params:', params);
        
        // Use axios for consistent API calls
        const queryString = Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
        
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/custom_forms.json?${queryString}`
        );
        
        console.log('API Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('API Error:', error);
        // Re-throw with more context if it's a configuration error
        if (error instanceof Error && error.message.includes('Base URL is not configured')) {
          throw new Error('Application not properly configured. Please check your authentication settings.');
        }
        if (error instanceof Error && error.message.includes('Authentication token is not available')) {
          throw new Error('Please log in to access schedules.');
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on configuration errors
      if (error instanceof Error && 
          (error.message.includes('Base URL is not configured') || 
           error.message.includes('Authentication token is not available'))) {
        return false;
      }
      return failureCount < 2; // Reduced retry attempts
    },
    retryDelay: 1000,
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 60000, // Keep in garbage collection for 1 minute
    enabled: !!(API_CONFIG.BASE_URL && API_CONFIG.TOKEN), // Only run if configured
  });
  
  console.log('Query State:', { 
    data: customFormsData, 
    isLoading, 
    error, 
    isError,
    filters: debouncedFilters,
    searchQuery: debouncedSearchQuery 
  });
  
  // Debug configuration
  console.log('Configuration Debug:', {
    hasBaseUrl: !!API_CONFIG.BASE_URL,
    hasToken: !!API_CONFIG.TOKEN,
    baseUrl: API_CONFIG.BASE_URL,
    tokenPresent: API_CONFIG.TOKEN ? 'Present' : 'Missing'
  });
  
  // Process schedules data for both analytics and table
  const schedules = React.useMemo(() => {
    if (!customFormsData?.custom_forms) {
      console.log('No custom forms data available');
      return [];
    }
    
    const forms = Array.isArray(customFormsData.custom_forms) 
      ? customFormsData.custom_forms 
      : Object.values(customFormsData.custom_forms);
      
    console.log('Raw forms data:', forms);
      
    const processedSchedules = forms.map((item: any) => {
      let scheduleType = '';
      if (item.checklist_for && typeof item.checklist_for === 'string' && item.checklist_for.includes('::')) {
        scheduleType = item.checklist_for.split('::')[1] || '';
      } else {
        scheduleType = item.schedule_type || '';
      }
      
      return {
        id: item.id,
        activityName: item.form_name || '',
        type: item.schedule_type || '',
        steps:item.steps ||'-',
        scheduleType,
        noOfAssociation: item.no_of_associations?.toString() || '0',
        category: item.category_name
          ? (item.category_name.charAt(0).toUpperCase() + item.category_name.slice(1).toLowerCase())
          : (item.schedule_type === 'PPM' ? 'Technical' : 'Non Technical'),
        active: item.active === null || item.active === true || item.active === 1,
        validFrom: item.start_date ? formatDateDDMMYYYY(item.start_date) : '',
        validTill: item.end_date ? formatDateDDMMYYYY(item.end_date) : '',
        createdOn: item.created_at ? formatDateDDMMYYYY(item.created_at) : '',
        custom_form_code: item.custom_form_code,
      };
    });
    
    console.log('Processed schedules count:', processedSchedules.length);
    return processedSchedules;
  }, [customFormsData]);
  
  // Pagination info
  const totalCount = customFormsData?.pagination?.total_count || schedules.length;
  const totalPages = customFormsData?.pagination?.total_pages || Math.ceil(schedules.length / pageSize);
  
  console.log('Processed schedules:', schedules);
  console.log('Search Query State:', { searchQuery, debouncedSearchQuery });
  console.log('Pagination info:', { currentPage, totalPages, totalCount });

  function formatDateDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  const handleAddSchedule = () => navigate('/maintenance/schedule/add');
  
  const handleDownloadSampleFormat = async () => {
    console.log('Downloading checklist sample format...');

    try {
      // Call the API to download the sample file
      const response = await apiClient.get(ENDPOINTS.CHECKLIST_SAMPLE_FORMAT, {
        responseType: 'blob'
      });

      // Create blob URL and trigger download
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'checklist_sample_format.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Sample format downloaded successfully', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } catch (error) {
      console.error('Error downloading sample file:', error);
      toast.error('Failed to download sample file. Please try again.', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    }
  };
  const handleExport = () => navigate('/maintenance/schedule/export');
  
  // Handle toggle click
  const handleToggleActive = (customFormCode: string) => {
    // Find by custom_form_code
    const currentSchedule = schedules.find(schedule => schedule.custom_form_code === customFormCode);
    // Use the same logic as the toggle UI for determining ON/OFF
    const isActive = (optimisticActive[customFormCode] !== undefined)
      ? optimisticActive[customFormCode]
      : (
          currentSchedule?.active === null ||
          currentSchedule?.active === true ||
          currentSchedule?.active === 1
        );
    if (isActive) {
      // If ON, show modal to turn OFF
      setDeactivateModal({ open: true, scheduleId: customFormCode });
      setDeactivateOption('upcoming');
    } else {
      // If OFF, turn ON directly
      updateScheduleActive(customFormCode, 1);
    }
  };

  // API call for activation/deactivation
  const updateScheduleActive = async (customFormCode: string, active: 0 | 1, deactivated_tasks?: 'upcoming' | 'all') => {
    setOptimisticActive(prev => ({
      ...prev,
      [customFormCode]: !!active
    }));
    try {
      const payload: any = { pms_custom_form: { active } };
      // Only include deactivated_tasks if deactivating
      if (active === 0 && deactivated_tasks) {
        payload.pms_custom_form.deactivated_tasks = deactivated_tasks;
      } else if (active === 1 && payload.pms_custom_form.deactivated_tasks) {
        delete payload.pms_custom_form.deactivated_tasks;
      }
      // Always use the update_custom_form_update endpoint with custom_form_code
      const response = await apiClient.put(`/pms/custom_forms/update_custom_form_update.json?id=${customFormCode}`, payload);
      toast.success(`Schedule ${active ? 'activated' : 'deactivated'} successfully.`, {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
      refetch();
    } catch (error) {
      setOptimisticActive(prev => ({
        ...prev,
        [customFormCode]: schedules.find(s => s.custom_form_code === customFormCode)?.active
      }));
      toast.error('Failed to update schedule status. Please try again.', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    }
  };

  // Handle modal submit
  const handleDeactivateSubmit = async () => {
    if (deactivateModal.scheduleId) {
      await updateScheduleActive(deactivateModal.scheduleId, 0, deactivateOption);
    }
    setDeactivateModal({ open: false, scheduleId: null });
  };
  const handleEditSchedule = (id: string) => navigate(`/maintenance/schedule/edit/${id}`);
  const handleCopySchedule = (id: string) => navigate(`/maintenance/schedule/copy/${id}`);
  const handleViewSchedule = (item: any) => {
    // Use custom_form_code from the table row if present, fallback to lookup
    let formCode = item.custom_form_code;
    if (!formCode && customFormsData?.custom_forms) {
      const customForm = customFormsData.custom_forms.find((form: any) => form.id?.toString() === item.id?.toString());
      formCode = customForm?.custom_form_code;
    }
    if (!item.id || !formCode) {
      toast.error('Invalid schedule ID or missing form code.');
      return;
    }
    navigate(`/maintenance/schedule/view/${item.id}`, { state: { formCode } });
  };

  const columns = [{
    key: 'actions',
    label: 'Actions',
    sortable: false
  }, {
    key: 'id',
    label: 'ID',
    sortable: true
  }, {
    key: 'activityName',
    label: 'Activity Name',
    sortable: true
  }, {
    key: 'type',
    label: 'Type',
    sortable: true
  }, 
  {
    key: 'steps',
    label: 'Checklist Step',
    sortable: true
  },
  {
    key: 'scheduleType',
    label: 'Schedule For',
    sortable: true
  }, {
    key: 'noOfAssociation',
    label: 'No. Of Association',
    sortable: true
  }, {
    key: 'validFrom',
    label: 'Start Date',
    sortable: true
  }, {
    key: 'validTill',
    label: 'End Date',
    sortable: true
  }, {
    key: 'category',
    label: 'Category',
    sortable: true
  }, {
    key: 'active',
    label: 'Status',
    sortable: true
  }, {
    key: 'createdOn',
    label: 'Created On',
    sortable: true
  }];
  
  const handleActionClick = () => {
    setShowActionPanel((prev) => !prev);
  };

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Button 
        onClick={handleActionClick}
        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
        Action
      </Button>
    </div>
  );
  const renderCell = (item: TransformedScheduleData, columnKey: string) => {
    console.log("Rendering cell for column:", columnKey, "with item:", item);
    
    if (columnKey === 'actions') {
      return (
        <div className="flex gap-1">
          {/* <Button v`ariant="ghost" size="sm" onClick={() => handleEditSchedule(item.id)}>
            <Edit className="w-4 h-4" />
          </Button>` */}
          {/* <Button variant="ghost" size="sm" onClick={() => handleCopySchedule(item.id)}>
            <Copy className="w-4 h-4" />
          </Button> */}
          <Button variant="ghost" size="sm" onClick={() => handleViewSchedule(item)}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      );
    }
    if (columnKey === 'category') {
      return <span className={`px-2 py-1 rounded text-xs ${item.category === 'Technical' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
          {item.category}
        </span>;
    }
    if (columnKey === 'active') {
      // Treat null, true, or 1 as active (ON)
      console.log("item", item, item.active, typeof item.active);
      const isActive = (optimisticActive[item.custom_form_code] !== undefined)
        ? optimisticActive[item.custom_form_code]
        : (
            item.active === null ||
            item.active === true
          );
      return (
        <div className="flex items-center justify-center">
          <div
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
            onClick={() => handleToggleActive(item.custom_form_code)}
            aria-label={isActive ? 'Deactivate schedule' : 'Activate schedule'}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </div>
        </div>
      );
    }
    return item[columnKey as keyof TransformedScheduleData];
  };

  // Deactivate Modal
  const DeactivateChecklistModal = (
    <Dialog open={deactivateModal.open} onClose={() => setDeactivateModal({ open: false, scheduleId: null })}>
      <DialogTitle>Deactivate Checklist</DialogTitle>
      <DialogContent>
        <FormLabel component="legend" style={{ fontWeight: 600, marginBottom: 8 }}>Deactivate</FormLabel>
        <RadioGroup
          aria-label="deactivate-tasks"
          name="deactivate-tasks"
          value={deactivateOption}
          onChange={e => setDeactivateOption(e.target.value as 'upcoming' | 'all')}
          row
        >
          <FormControlLabel value="upcoming" control={<Radio color="primary" />} label="Upcoming Tasks" />
          <FormControlLabel value="all" control={<Radio color="primary" />} label="All Tasks" />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeactivateSubmit} className="bg-[#6B2245] text-white hover:bg-[#6B2245]/90">Submit</Button>
      </DialogActions>
    </Dialog>
  );

  // Analytics data calculations
  const totalSchedules = schedules.length;
  const activeSchedules = schedules.filter(s => s.active).length;
  const inactiveSchedules = totalSchedules - activeSchedules;
  const ppmSchedules = schedules.filter(s => s.type === 'PPM').length;
  const routineSchedules = schedules.filter(s => s.type === 'Routine').length;
  const safetySchedules = schedules.filter(s => s.type === 'Safety').length;
  const scheduleCards = [{
    title: 'Total Schedules',
    value: totalSchedules,
    icon: Calendar,
    gradient: 'from-blue-500 to-purple-600'
  }, {
    title: 'Active Schedules',
    value: activeSchedules,
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-600'
  }, {
    title: 'Inactive Schedules',
    value: inactiveSchedules,
    icon: Clock,
    gradient: 'from-red-500 to-orange-600'
  }, {
    title: 'PPM Schedules',
    value: ppmSchedules,
    icon: Settings,
    gradient: 'from-blue-400 to-blue-600'
  }, {
    title: 'Routine Schedules',
    value: routineSchedules,
    icon: Wrench,
    gradient: 'from-purple-500 to-purple-700'
  }, {
    title: 'Safety Schedules',
    value: safetySchedules,
    icon: Shield,
    gradient: 'from-orange-500 to-red-600'
  }];
  const typeChartData = [{
    name: 'PPM',
    value: ppmSchedules,
    fill: '#C72030'
  }, {
    name: 'Routine',
    value: routineSchedules,
    fill: '#D2B48C'
  }, {
    name: 'Safety',
    value: safetySchedules,
    fill: '#8B4513'
  }];
  const categoryChartData = [{
    name: 'Technical',
    count: schedules.filter(s => s.category === 'Technical').length
  }, {
    name: 'Non Technical',
    count: schedules.filter(s => s.category === 'Non Technical').length
  }];
  const associationData = [{
    range: '1-2',
    count: schedules.filter(s => parseInt(s.noOfAssociation) <= 2).length
  }, {
    range: '3-4',
    count: schedules.filter(s => parseInt(s.noOfAssociation) >= 3 && parseInt(s.noOfAssociation) <= 4).length
  }, {
    range: '5+',
    count: schedules.filter(s => parseInt(s.noOfAssociation) >= 5).length
  }];
  const agingData = [{
    category: 'Technical PPM',
    low: schedules.filter(s => s.category === 'Technical' && s.type === 'PPM').length,
    medium: 0,
    high: 0
  }, {
    category: 'Technical Routine',
    low: schedules.filter(s => s.category === 'Technical' && s.type === 'Routine').length,
    medium: 0,
    high: 0
  }, {
    category: 'Non-Technical Routine',
    low: schedules.filter(s => s.category === 'Non Technical' && s.type === 'Routine').length,
    medium: 0,
    high: 0
  }, {
    category: 'Safety',
    low: schedules.filter(s => s.type === 'Safety').length,
    medium: 0,
    high: 0
  }];
  const renderAnalyticsTab = () => <div className="space-y-4 sm:space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Total Schedules */}
        <div className="p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#C72030]" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#C72030]">{totalSchedules}</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">Total Schedules</div>
          </div>
        </div>

        {/* Active Schedules */}
        <div className="p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#C72030]" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#C72030]">{activeSchedules}</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">Active Schedules</div>
          </div>
        </div>

        {/* Inactive Schedules */}
        <div className="p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#C72030]" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#C72030]">{inactiveSchedules}</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">Inactive Schedules</div>
          </div>
        </div>

        {/* PPM Schedules */}
        <div className="p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#C72030]" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#C72030]">{ppmSchedules}</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">PPM Schedules</div>
          </div>
        </div>

        {/* Routine Schedules */}
        <div className="p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center flex-shrink-0">
            <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-[#C72030]" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#C72030]">{routineSchedules}</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">Routine Schedules</div>
          </div>
        </div>

        {/* Safety Schedules */}
        <div className="p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3" style={{
        backgroundColor: '#f6f4ee'
      }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#C72030]" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#C72030]">{safetySchedules}</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">Safety Schedules</div>
          </div>
        </div>
      </div>

      {/* Header with Schedule Selector */}
      <div className="flex justify-end">
        <ScheduleSelector selectedItems={selectedItems} onSelectionChange={setSelectedItems} />
      </div>

      {/* Main Analytics Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Left Section - Charts (3 columns) */}
        <div className="xl:col-span-3 space-y-4 sm:space-y-6">
          {/* Charts Row 1 */}
          {selectedItems.includes('checklist') && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 border border-[hsl(var(--analytics-border))]">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[hsl(var(--analytics-text))]">Schedule Type Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={typeChartData} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  percent
                }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={60} fill="#8884d8" dataKey="value">
                      {typeChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 sm:p-6 border border-[hsl(var(--analytics-border))]">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[hsl(var(--analytics-text))]">Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#D2B48C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>}

          {/* Charts Row 2 */}
          {(selectedItems.includes('technical-checklist') || selectedItems.includes('non-technical-checklist')) && <div className="bg-white p-4 sm:p-6 border border-[hsl(var(--analytics-border))]">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[hsl(var(--analytics-text))]">Association Analysis</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={associationData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D2B48C" />
                </BarChart>
              </ResponsiveContainer>
            </div>}

          {/* Aging Matrix */}
          {selectedItems.includes('top-10-checklist') && <div className="bg-white p-4 sm:p-6 border border-[hsl(var(--analytics-border))]">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[hsl(var(--analytics-text))]">Schedule Aging Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[hsl(var(--analytics-border))]">
                      <th className="text-left p-2 text-[hsl(var(--analytics-text))]">Category</th>
                      <th className="text-center p-2 text-green-600">Low Priority</th>
                      <th className="text-center p-2 text-yellow-600">Medium Priority</th>
                      <th className="text-center p-2 text-red-600">High Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agingData.map((row, index) => <tr key={index} className="border-b border-[hsl(var(--analytics-border))]">
                        <td className="p-2 font-medium text-[hsl(var(--analytics-text))]">{row.category}</td>
                        <td className="text-center p-2 text-green-600">{row.low}</td>
                        <td className="text-center p-2 text-yellow-600">{row.medium}</td>
                        <td className="text-center p-2 text-red-600">{row.high}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>}
        </div>

        {/* Right Section - Sidebar (1 column) */}
        {/* <div className="xl:col-span-1 order-first xl:order-last">
          <RecentSchedulesSidebar />
        </div> */}
      </div>
    </div>;
  // Define selectionActions for SelectionPanel
  const selectionActions = [
  ];

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search changes
  const handleSearchChange = (query: string) => {
    console.log('Search change triggered:', query);
    setSearchQuery(query);
  };

  const renderListTab = () => (
    <div className="space-y-4">
      {showActionPanel && (
        <SelectionPanel
          actions={selectionActions}
          // onAdd={handleAddSchedule}
          onClearSelection={() => setShowActionPanel(false)}
          onImport={() => setShowImportModal(true)}
        />
      )}

        <>
          <EnhancedTable
            data={schedules}
            columns={columns}
            renderCell={renderCell}
            pagination={false}
            enableExport={true}
            exportFileName="schedules"
            storageKey="schedules-table"
            enableSearch={true}
            searchPlaceholder="Search schedules..."
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            leftActions={renderCustomActions()}
            onFilterClick={() => setShowFilterDialog(true)}
            onExport={handleScheduleExport}
            loading={isLoading}
            loadingMessage="Loading schedules..."
            emptyMessage={isLoading ? "Loading schedules..." : (debouncedSearchQuery ? `No schedules found for "${debouncedSearchQuery}"` : "No schedules available")}
            disableClientSearch={true}
            searchStatus={isLoading ? 'Loading...' : (searchQuery !== debouncedSearchQuery ? 'Searching...' : `${schedules.length} schedule(s) found`)}
            customSearchInput={true}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: Math.min(totalPages, 10) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {totalPages > 10 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-center mt-2 text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({totalCount} total schedules)
              </div>
            </div>
          )}
        </>
      
    </div>
  );

  // Handle filters

  function handleApplyFilters(filters: { activityName: string; type: string; category: string; }): void {
    setFilters(filters);
    setShowFilterDialog(false);
    // Show toast with filter status
    const activeFilters = Object.entries(filters).filter(([_, v]) => v && v.trim() !== '');
    if (activeFilters.length > 0) {
      const filterMsg = activeFilters.map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${v}`).join(', ');
      toast.success(`Filters applied: ${filterMsg}`, {
        position: 'top-right',
        duration: 3500,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } else {
      toast.info('All filters cleared. Showing all schedules.', {
        position: 'top-right',
        duration: 3000,
      });
    }
  }


  function handleResetFilters(): void {
    setFilters({
      activityName: '',
      type: '',
      category: ''
    });
    toast.info('All filters reset. Showing all schedules.', {
      position: 'top-right',
      duration: 3000,
    });
  }

  // Custom export handler for schedules
  const handleScheduleExport = async () => {
    try {
      const url = `${API_CONFIG.BASE_URL}/pms/custom_forms/export_checklist.xlsx`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to export schedule data');
      
      const blob = await response.blob();
      
      // Create download link
      const link = document.createElement('a');
      const downloadUrl = window.URL.createObjectURL(blob);
      link.href = downloadUrl;
      link.download = 'schedules.xlsx';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
      
      toast.success('Schedules exported successfully!', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#fff',
          color: 'black',
          border: 'none',
        },
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export schedules. Please try again.', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    }
  };


  return (
    <div className="p-2 sm:p-4 lg:p-6">
      {/* Sonner Toaster for notifications */}
      <Toaster position="top-right" richColors closeButton />
      {/* Deactivate Checklist Modal */}
      {DeactivateChecklistModal}
      {/* Only Schedule List tab, no analytics */}
      <div className="w-full">
        {renderListTab()}
      </div>

      <BulkUploadDialog 
        open={showImportModal} 
        onOpenChange={setShowImportModal} 
        title="Bulk Upload" 
        context="custom_forms"
      />
      <ScheduleFilterDialog 
        open={showFilterDialog} 
        onOpenChange={setShowFilterDialog}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
