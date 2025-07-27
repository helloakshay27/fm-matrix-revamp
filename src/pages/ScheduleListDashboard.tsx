import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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

export const ScheduleListDashboard = () => {
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(['checklist', 'technical-checklist', 'non-technical-checklist']);
  
  // Add filter state
  const [filters, setFilters] = useState({
    activityName: '',
    type: '',
    category: ''
  });

  // Build query parameters for API
  const buildQueryParams = () => {
    const params: Record<string, string> = {};
    
    if (filters.activityName) {
      params['q[form_name_cont]'] = filters.activityName;
    }
    
    if (filters.type) {
      params['q[schedule_type_eq]'] = filters.type.toUpperCase();
    }
    
    if (filters.category) {
      params['q[tasks_category_eq]'] = filters.category.charAt(0).toUpperCase() + filters.category.slice(1).toLowerCase();
    }
    
    return params;
  };

  // Fetch custom forms data with filters
  const {
    data: customFormsData,
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['custom-forms', filters],
    queryFn: async () => {
      try {
        console.log('Fetching custom forms with params:', buildQueryParams());
        const result = await fetchCustomForms(buildQueryParams());
        console.log('API Response:', result);
        return result;
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
      return failureCount < 3;
    },
    retryDelay: 1000
  });
  
  console.log('Query State:', { 
    data: customFormsData, 
    isLoading, 
    error, 
    isError,
    filters: filters 
  });
  
  // Debug configuration
  console.log('Configuration Debug:', {
    hasBaseUrl: !!API_CONFIG.BASE_URL,
    hasToken: !!API_CONFIG.TOKEN,
    baseUrl: API_CONFIG.BASE_URL,
    tokenPresent: API_CONFIG.TOKEN ? 'Present' : 'Missing'
  });
  
  // Debug localStorage
  console.log('LocalStorage Debug:', {
    baseUrl: localStorage.getItem('base_url'),
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user')
  });
  
  // Transform the data
  const schedules = customFormsData ? transformCustomFormsData(customFormsData.custom_forms) : [];
  
  console.log('Transformed schedules:', schedules);
  console.log('Custom forms raw data:', customFormsData?.custom_forms);
  
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
          background: '#10b981',
          color: 'white',
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
  
  const handleToggleActive = async (scheduleId: string) => {
    try {
      // Find the current schedule to get its current active status
      const currentSchedule = schedules.find(schedule => schedule.id === scheduleId);
      if (!currentSchedule) {
        console.error('Schedule not found:', scheduleId);
        toast.error('Schedule not found.', {
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

      // Toggle the active status
      const newActiveStatus = !currentSchedule.active;

      // Make PUT API call to update the active status with .json extension
      const response = await apiClient.put(`${ENDPOINTS.UPDATE_CUSTOM_FORM}/${scheduleId}.json`, 
      {  pms_custom_form:{
        active: newActiveStatus ? 1 : 0
      }});

      console.log('Schedule active status updated:', response.data);
      toast.success(`Schedule ${newActiveStatus ? 'activated' : 'deactivated'} successfully.`, {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
      // Refetch the data to update the UI
      refetch();
    } catch (error) {
      console.error('Error updating schedule active status:', error);
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
  const handleEditSchedule = (id: string) => navigate(`/maintenance/schedule/edit/${id}`);
  const handleCopySchedule = (id: string) => navigate(`/maintenance/schedule/copy/${id}`);
  const handleViewSchedule = (item: TransformedScheduleData) => {
    // Get the form_code from the original custom forms data
    const customForm = customFormsData?.custom_forms.find(form => form.id.toString() === item.id);
    const formCode = customForm?.custom_form_code;
    navigate(`/maintenance/schedule/view/${item.id}`);
  };

  const columns = [{
    key: 'formName',
    label: 'Schedule Name',
    sortable: true
  }, {
    key: 'type',
    label: 'Type',
    sortable: true
  }, {
    key: 'validFrom',
    label: 'Valid From',
    sortable: true
  }, {
    key: 'validTill',
    label: 'Valid Till',
    sortable: true
  }, {
    key: 'category',
    label: 'Category',
    sortable: true
  }, {
    key: 'active',
    label: 'Active',
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
      return <div className="flex items-center">
          <div className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => handleToggleActive(item.id)}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
        </div>;
    }
    return item[columnKey as keyof TransformedScheduleData];
  };

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
        <div className="xl:col-span-1 order-first xl:order-last">
          <RecentSchedulesSidebar />
        </div>
      </div>
    </div>;
  // Define selectionActions for SelectionPanel
  const selectionActions = [
  ];

  const renderListTab = () => (
    <div className="space-y-4">
      {showActionPanel && (
        <SelectionPanel
          actions={selectionActions}
          onAdd={handleAddSchedule}
          onClearSelection={() => setShowActionPanel(false)}
          onImport={() => setShowImportModal(true)}
        />
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading schedules...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center max-w-md">
            <p className="text-sm text-red-600 mb-2">Error loading schedules</p>
            <p className="text-xs text-gray-500 mb-3">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            {error instanceof Error && (
              error.message.includes('Base URL is not configured') || 
              error.message.includes('Authentication token is not available')
            ) ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                <p className="text-xs text-yellow-800 mb-2">
                  It appears your session has expired or the application is not properly configured.
                </p>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                  }} 
                  className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      ) : (
        <EnhancedTable 
          data={schedules} 
          columns={columns} 
          renderCell={renderCell} 
          // selectable={true} 
          pagination={true} 
          enableExport={true} 
          exportFileName="schedules" 
          storageKey="schedules-table" 
          enableSearch={true} 
          searchPlaceholder="Search schedules..." 
          leftActions={renderCustomActions()} 
          onFilterClick={() => setShowFilterDialog(true)}
        />
      )}
    </div>
  );
  function handleApplyFilters(filters: { activityName: string; type: string; category: string; }): void {
    setFilters(filters);
    setShowFilterDialog(false);
  }

  function handleResetFilters(): void {
    setFilters({
      activityName: '',
      type: '',
      category: ''
    });
    setShowFilterDialog(false);
  }

  return <div className="p-2 sm:p-4 lg:p-6">
      {/* Sonner Toaster for notifications */}
      <Toaster position="top-right" richColors closeButton />
      {/* <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Schedule Dashboard</h1>
      </div> */}

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="list" 
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Calendar className="w-4 h-4" />
            Schedule List
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-4 sm:mt-6">
          {renderAnalyticsTab()}
        </TabsContent>
        
        <TabsContent value="list" className="mt-4 sm:mt-6">
          {renderListTab()}
        </TabsContent>
      </Tabs>

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
    </div>;
};