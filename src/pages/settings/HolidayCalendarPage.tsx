import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { CalendarDays, Plus, Eye, Edit, Trash2, Filter, Loader2 } from 'lucide-react';
import { useApiConfig } from '@/hooks/useApiConfig';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import ReactSelect from 'react-select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

interface Holiday {
  id: string;
  holidayName: string;
  date: string;
  recurring: boolean;
  applicableLocation: string;
  holidayType: string;
  applicableFor: string;
  active: boolean;
}

interface HolidayApiResponse {
  id: number;
  name: string;
  module_type: string | null;
  module_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  is_recuring: boolean;
  site_ids: number[];
  holiday_date: string;
  holiday_type: string;
  applicable_for: string[];
}

interface Site {
  id: number;
  name: string;
  site_name?: string;
}

const columns: ColumnConfig[] = [
  {
    key: 'actions',
    label: 'Action',
    sortable: false,
    hideable: false,
    draggable: false
  },
  {
    key: 'holidayName',
    label: 'Holiday Name',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'recurring',
    label: 'Recurring',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'applicableLocation',
    label: 'Sites',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'holidayType',
    label: 'Holiday Type',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'applicableFor',
    label: 'Modules',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    hideable: true,
    draggable: true
  }
];

export const HolidayCalendarPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [date, setDate] = useState<Date>();
  const [holidayName, setHolidayName] = useState('');
  const [recurring, setRecurring] = useState<string>('');
  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [loadingEditData, setLoadingEditData] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Filter dialog
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSiteIds, setFilterSiteIds] = useState<number[]>([]);
  const [filterModules, setFilterModules] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState({
    name: '', type: '', status: '', location: '', siteIds: [] as number[], modules: [] as string[]
  });

  // API and Sites data
  const { baseUrl, token, endpoints } = useApiConfig();
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Site options - now dynamic from API (via allowed_sites)
  const [siteOptions, setSiteOptions] = useState<Site[]>([]);

  // Customer type options
  const customerOptions = [
    'tickets',
    'checklist',
    'booking',
    'parking',
    'patrolling'
  ];

  // Transform API response to Holiday interface
  const transformHolidayData = (apiHoliday: HolidayApiResponse, sitesData: Site[]): Holiday => {
    const applicableLocationNames = apiHoliday.site_ids
      .map(siteId => sitesData.find(site => site.id === siteId)?.name)
      .filter(Boolean)
      .join(', ');

    return {
      id: String(apiHoliday.id),
      holidayName: apiHoliday.name,
      date: new Date(apiHoliday.holiday_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      recurring: apiHoliday.is_recuring,
      applicableLocation: applicableLocationNames || 'Unknown locations',
      holidayType: apiHoliday.holiday_type,
      applicableFor: apiHoliday.applicable_for.join(', '),
      active: apiHoliday.active,
    };
  };

  // Load allowed sites using user_id from account API (same pattern as CategoryTypeTab)
  useEffect(() => {
    const loadSites = async () => {
      if (!baseUrl || !token) return;
      setLoadingSites(true);
      try {
        // 1. Fetch account to get user_id
        const accountRes = await fetch(getFullUrl('/api/users/account.json'), {
          headers: { 'Authorization': getAuthHeader(), 'Content-Type': 'application/json' },
        });
        if (!accountRes.ok) throw new Error('Failed to fetch account');
        const accountData = await accountRes.json();
        const userId = accountData.id;

        // 2. Fetch allowed_sites for this user
        const sitesRes = await fetch(getFullUrl(`/pms/sites/allowed_sites.json?user_id=${userId}`), {
          headers: { 'Authorization': getAuthHeader(), 'Content-Type': 'application/json' },
        });
        if (!sitesRes.ok) throw new Error('Failed to fetch allowed sites');
        const sitesData = await sitesRes.json();
        if (sitesData.sites && Array.isArray(sitesData.sites)) {
          setSiteOptions(sitesData.sites);
        }
      } catch (error) {
        console.error('Error loading sites:', error);
        toast.error('Failed to load sites');
      } finally {
        setLoadingSites(false);
      }
    };
    loadSites();
  }, [baseUrl, token]);

  // Load existing holidays from API
  useEffect(() => {
    const loadHolidays = async () => {
      if (!baseUrl || !token || siteOptions.length === 0) {
        return;
      }
      
      setLoadingHolidays(true);
      try {
        console.log('Fetching holidays from:', `${baseUrl}${endpoints.HOLIDAY_CALENDARS}`);
        
        const response = await fetch(`${baseUrl}${endpoints.HOLIDAY_CALENDARS}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const apiData: HolidayApiResponse[] = await response.json();
          console.log('Raw holidays API response:', apiData);
          
          // Transform API data to Holiday interface
          const transformedHolidays = apiData.map(apiHoliday => 
            transformHolidayData(apiHoliday, siteOptions)
          );
          
          setHolidays(transformedHolidays);
          console.log('Holidays loaded successfully:', transformedHolidays.length, 'holidays');
          
          // toast({
          //   title: "Success",
          //   description: `Loaded ${transformedHolidays.length} holidays`,
          // });
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error loading holidays:', error);
        toast.error("Failed to load holidays from API. Using fallback data.");
        // Keep using fallback data if API fails
        setHolidays([]);
      } finally {
        setLoadingHolidays(false);
      }
    };

    loadHolidays();
  }, [baseUrl, token, endpoints, siteOptions]); // Added siteOptions dependency so holidays load after sites are loaded

  // Filter holidays based on search term + advanced filters
  const filteredHolidays = holidays.filter(holiday => {
    // search term
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        holiday.holidayName.toLowerCase().includes(q) ||
        holiday.date.toLowerCase().includes(q) ||
        holiday.holidayType.toLowerCase().includes(q) ||
        holiday.applicableLocation.toLowerCase().includes(q) ||
        holiday.applicableFor.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    // advanced filters
    if (appliedFilters.name && !holiday.holidayName.toLowerCase().includes(appliedFilters.name.toLowerCase())) return false;
    if (appliedFilters.type && holiday.holidayType.toLowerCase() !== appliedFilters.type.toLowerCase()) return false;
    if (appliedFilters.status) {
      const isActive = holiday.active;
      if (appliedFilters.status === 'active' && !isActive) return false;
      if (appliedFilters.status === 'inactive' && isActive) return false;
    }
    if (appliedFilters.location && !holiday.applicableLocation.toLowerCase().includes(appliedFilters.location.toLowerCase())) return false;
    if (appliedFilters.siteIds.length > 0) {
      const matched = siteOptions.filter(s => appliedFilters.siteIds.includes(s.id)).some(s => holiday.applicableLocation.includes(s.name));
      if (!matched) return false;
    }
    if (appliedFilters.modules.length > 0) {
      const matched = appliedFilters.modules.some(m => holiday.applicableFor.toLowerCase().includes(m.toLowerCase()));
      if (!matched) return false;
    }
    return true;
  });

  // Pagination calculations
  const totalRecords = filteredHolidays.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentHolidays = filteredHolidays.slice(startIndex, endIndex);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };



  const handleUpdate = async () => {
    if (!editingHoliday || !holidayName || !date || !recurring || selectedSites.length === 0 || !selectedType || selectedCustomers.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the API payload for update
      const updatePayload = {
        holiday_calendar: {
          name: holidayName,
          is_recuring: recurring === "yes",
          holiday_date: date.toISOString(),
          holiday_type: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
          site_ids: selectedSites,
          applicable_for: selectedCustomers
        }
      };

      console.log('Updating holiday with payload:', updatePayload);

      // Make API call to update holiday
      const response = await fetch(`${baseUrl}${endpoints.UPDATE_HOLIDAY}/${editingHoliday.id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Holiday updated successfully:', responseData);

      // Update local holidays list
      const selectedSiteNames = siteOptions
        .filter(site => selectedSites.includes(site.id))
        .map(site => site.name)
        .join(', ');

      const updatedHoliday: Holiday = {
        id: editingHoliday.id,
        holidayName,
        date: format(date, "dd MMMM yyyy"),
        recurring: recurring === "yes",
        applicableLocation: selectedSiteNames,
        holidayType: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
        applicableFor: selectedCustomers.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', '),
        active: editingHoliday.active,
      };

      const updatedHolidays = holidays.map(h => 
        h.id === editingHoliday.id ? updatedHoliday : h
      );
      setHolidays(updatedHolidays);

      toast.success("Holiday updated successfully");
      
      // Reset form and close dialog
      handleEditCancel();
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update holiday");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    // Reset form
    setHolidayName('');
    setDate(undefined);
    setRecurring('');
    setSelectedSites([]);
    setSelectedType('');
    setSelectedCustomers([]);
    setEditingHoliday(null);
    
    setIsEditDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (!holidayName || !date || !recurring || selectedSites.length === 0 || !selectedType || selectedCustomers.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    // Duplicate name check
    const duplicate = holidays.find(
      h => h.holidayName.toLowerCase() === holidayName.trim().toLowerCase()
    );
    if (duplicate) {
      toast.error("Duplicate name cannot be created");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the API payload according to the specified format
      const holidayPayload = {
        holiday_calendar: {
          name: holidayName,
          is_recuring: recurring === "yes",
          holiday_date: date.toISOString(),
          holiday_type: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
          site_ids: selectedSites,
          applicable_for: selectedCustomers
        }
      };

      console.log('Submitting holiday with payload:', holidayPayload);

      // Make API call using the specified endpoint
      const response = await fetch(`${baseUrl}${endpoints.CREATE_HOLIDAY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(holidayPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Holiday created successfully:', responseData);

      // Update local holidays list with the new holiday
      const selectedSiteNames = siteOptions
        .filter(site => selectedSites.includes(site.id))
        .map(site => site.name)
        .join(', ');

      const newHoliday: Holiday = {
        id: String(responseData.id || holidays.length + 1),
        holidayName,
        date: format(date, "dd MMMM yyyy"),
        recurring: recurring === "yes",
        applicableLocation: selectedSiteNames,
        holidayType: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
        applicableFor: selectedCustomers.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', '),
        active: true,
      };

      const updatedHolidays = [...holidays, newHoliday];
      setHolidays(updatedHolidays);

      toast.success("Holiday created successfully");
      
      // Reset form
      handleCancel();
    } catch (error) {
      console.error('Error creating holiday:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create holiday");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setHolidayName('');
    setDate(undefined);
    setRecurring('');
    setSelectedSites([]);
    setSelectedType('');
    setSelectedCustomers([]);
    
    setIsAddDialogOpen(false);
  };

  const handleView = (id: string) => {
    console.log('View holiday:', id);
  };

  const handleEdit = async (id: string) => {
    setLoadingEditData(true);
    try {
      // First set the editing holiday from current data
      const holiday = holidays.find(h => h.id === id);
      if (!holiday) {
        toast.error("Holiday not found");
        return;
      }

      // Fetch detailed holiday data from API
      const response = await fetch(`${baseUrl}${endpoints.GET_HOLIDAY}/${id}.json`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const apiHoliday: HolidayApiResponse = await response.json();
        
        // Populate form with existing data
        setEditingHoliday(holiday);
        setHolidayName(apiHoliday.name);
        setDate(new Date(apiHoliday.holiday_date));
        setRecurring(apiHoliday.is_recuring ? "yes" : "no");
        setSelectedSites(apiHoliday.site_ids);
        setSelectedType(apiHoliday.holiday_type.toLowerCase());
        setSelectedCustomers(apiHoliday.applicable_for);
        setIsEditDialogOpen(true);
        
        console.log('Holiday data loaded for editing:', apiHoliday);
      } else {
        // Fallback to current holiday data if API call fails
        setEditingHoliday(holiday);
        setHolidayName(holiday.holidayName);
        setDate(new Date(holiday.date));
        setRecurring(holiday.recurring ? "yes" : "no");
        setSelectedType(holiday.holidayType.toLowerCase());
        
        // Parse applicable sites back to IDs (best effort)
        const siteIds = siteOptions
          .filter(site => holiday.applicableLocation.includes(site.name))
          .map(site => site.id);
        setSelectedSites(siteIds);
        
        // Parse applicable customers
        const customers = holiday.applicableFor.toLowerCase().split(', ');
        setSelectedCustomers(customers);
        
        setIsEditDialogOpen(true);
        
        toast.warning("Using cached data. Some fields may not be editable.");
      }
    } catch (error) {
      console.error('Error loading holiday for edit:', error);
      toast.error("Failed to load holiday data");
    } finally {
      setLoadingEditData(false);
    }
  };

  const handleDelete = (id: string) => {
    console.log('Delete holiday:', id);
  };

  // Toggle active/inactive status
  const handleToggleStatus = async (holiday: Holiday) => {
    setTogglingId(holiday.id);
    try {
      const newActive = !holiday.active;
      const response = await fetch(`${baseUrl}${endpoints.UPDATE_HOLIDAY}/${holiday.id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          holiday_calendar: { active: newActive }
        }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      setHolidays(prev =>
        prev.map(h => h.id === holiday.id ? { ...h, active: newActive } : h)
      );
      toast.success(`Holiday marked as ${newActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      toast.error('Failed to update holiday status');
    } finally {
      setTogglingId(null);
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      name: filterName,
      type: filterType,
      status: filterStatus,
      location: filterLocation,
      siteIds: filterSiteIds,
      modules: filterModules,
    });
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilterName('');
    setFilterType('');
    setFilterStatus('');
    setFilterLocation('');
    setFilterSiteIds([]);
    setFilterModules([]);
    setAppliedFilters({ name: '', type: '', status: '', location: '', siteIds: [], modules: [] });
    setCurrentPage(1);
  };

  const activeFilterCount = [
    appliedFilters.name,
    appliedFilters.type,
    appliedFilters.status,
    appliedFilters.location,
  ].filter(Boolean).length + (appliedFilters.siteIds.length > 0 ? 1 : 0) + (appliedFilters.modules.length > 0 ? 1 : 0);

  // Render row function for enhanced task table
  const renderRow = (holiday: Holiday) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleEdit(holiday.id)}
          className="p-1 text-black-600 hover:bg-green-50 rounded"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    ),
    holidayName: (
      <div className="font-medium">{holiday.holidayName}</div>
    ),
    date: (
      <span className="text-sm text-gray-600">{holiday.date}</span>
    ),
    recurring: (
      <span className="text-sm text-gray-600">
        {holiday.recurring ? 'Yes' : 'No'}
      </span>
    ),
    applicableLocation: (
      <div className="text-sm text-gray-600 max-w-xs truncate" title={holiday.applicableLocation}>
        {holiday.applicableLocation}
      </div>
    ),
    holidayType: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        holiday.holidayType === 'Public'
          ? 'bg-blue-100 text-blue-800'
          : holiday.holidayType === 'Festival'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {holiday.holidayType}
      </span>
    ),
    applicableFor: (
      <div className="text-sm text-gray-600 max-w-xs truncate" title={holiday.applicableFor}>
        {holiday.applicableFor}
      </div>
    ),
    status: (
      <button
        onClick={() => handleToggleStatus(holiday)}
        disabled={togglingId === holiday.id}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          holiday.active ? 'bg-green-500' : 'bg-gray-300'
        } ${togglingId === holiday.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={holiday.active ? 'Click to Deactivate' : 'Click to Activate'}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            holiday.active ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
        {togglingId === holiday.id && (
          <Loader2 className="absolute right-[-20px] top-1 w-4 h-4 animate-spin text-gray-400" />
        )}
      </button>
    ),
  });


  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Holiday Calendar</h1>
      </header>

      {/* Loader overlay */}
      {loadingHolidays && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Loading holidays...</p>
          </div>
        </div>
      )}

      {!loadingHolidays && (
      <EnhancedTaskTable
        data={currentHolidays}
        columns={columns}
        renderRow={renderRow}
        storageKey="holiday-calendar-dashboard"
        hideTableExport={true}
        hideTableSearch={false}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        rightActions={(
          <>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                {activeFilterCount}
              </span>
            )}
          </>
        )}
        onFilterClick={() => setIsFilterOpen(true)}
        leftActions={(
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            if (open) {
              setHolidayName('');
              setDate(undefined);
              setRecurring('');
              setSelectedSites([]);
              setSelectedType('');
              setSelectedCustomers([]);
            }
            setIsAddDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
                <Plus className="w-4 h-4 mr-2" /> Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="add-holiday-dialog-description">
              <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <DialogTitle className="text-lg font-semibold text-gray-900">ADD HOLIDAY</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div id="add-holiday-dialog-description" className="sr-only">
                  Add a new holiday with name, date, recurrence, sites, type, and modules
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Holiday Form */}
                <Card>
                  <CardContent className="space-y-6 pt-6">
                    {/* First Row */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Holiday Name <span className="text-red-500">*</span></Label>
                      <Input
  type="text"
  placeholder="Enter Holiday Name"
  value={holidayName}
  onChange={(e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setHolidayName(value);
    }
  }}
  className="h-10 border-gray-300 focus:border-gray-500 focus:ring-0"
  style={{ borderRadius: '4px' }}
/>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Date <span className="text-red-500">*</span></Label>
                        <Input
                          type="date"
                          placeholder="Select date"
                          value={date ? format(date, "yyyy-MM-dd") : ''}
                          min={format(new Date(), "yyyy-MM-dd")}
                          onChange={(e) => {
                            if (e.target.value) {
                              setDate(new Date(e.target.value));
                            } else {
                              setDate(undefined);
                            }
                          }}
                          className="h-10 border-gray-300 focus:border-gray-500 focus:ring-0"
                          style={{ borderRadius: '4px' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Recurring <span className="text-red-500">*</span></Label>
                        <ReactSelect
                          options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' }
                          ]}
                          value={recurring ? { value: recurring, label: recurring === 'yes' ? 'Yes' : 'No' } : null}
                          onChange={(selected) => {
                            setRecurring(selected ? selected.value : '');
                          }}
                          placeholder="Select recurring option"
                          isClearable
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: '40px',
                              border: '1px solid #e2e8f0',
                              boxShadow: 'none',
                              '&:hover': {
                                border: '1px solid #cbd5e1'
                              }
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected 
                                ? '#dbeafe' 
                                : state.isFocused 
                                ? '#f0f9ff' 
                                : 'white',
                              color: state.isSelected ? '#1e40af' : '#374151',
                              '&:hover': {
                                backgroundColor: '#f0f9ff'
                              }
                            })
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Second Row */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Holiday Type <span className="text-red-500">*</span></Label>
                        <ReactSelect
                          options={[
                            { value: 'public', label: 'Public' },
                            { value: 'festival', label: 'Festival' },
                            { value: 'maintenance', label: 'Maintenance' }
                          ]}
                          value={selectedType ? { value: selectedType, label: selectedType.charAt(0).toUpperCase() + selectedType.slice(1) } : null}
                          onChange={(selected) => {
                            setSelectedType(selected ? selected.value : '');
                          }}
                          placeholder="Select holiday type"
                          isClearable
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: '40px',
                              border: '1px solid #d1d5db',
                              boxShadow: 'none',
                              '&:hover': {
                                border: '1px solid #cbd5e1'
                              }
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected 
                                ? '#dbeafe' 
                                : state.isFocused 
                                ? '#f0f9ff' 
                                : 'white',
                              color: state.isSelected ? '#1e40af' : '#374151',
                              '&:hover': {
                                backgroundColor: '#f0f9ff'
                              }
                            })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Select Sites <span className="text-red-500">*</span></Label>
                        <ReactSelect
                          isMulti
                          options={siteOptions.map(site => ({ value: site.id, label: site.name }))}
                          value={siteOptions.filter(site => selectedSites.includes(site.id)).map(site => ({ value: site.id, label: site.name }))}
                          onChange={(selected) => {
                            const siteIds = selected ? selected.map(s => s.value) : [];
                            setSelectedSites(siteIds);
                          }}
                          placeholder="Select sites..."
                          isLoading={loadingSites}
                          isDisabled={loadingSites}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: '40px',
                              border: '1px solid #d1d5db',
                              boxShadow: 'none',
                              '&:hover': {
                                border: '1px solid #cbd5e1'
                              }
                            }),
                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: '#f1f5f9'
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: '#334155'
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: '#64748b',
                              '&:hover': {
                                backgroundColor: '#e2e8f0',
                                color: '#475569'
                              }
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected 
                                ? '#dbeafe' 
                                : state.isFocused 
                                ? '#f0f9ff' 
                                : 'white',
                              color: state.isSelected ? '#1e40af' : '#374151',
                              '&:hover': {
                                backgroundColor: '#f0f9ff'
                              }
                            })
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Select Module <span className="text-red-500">*</span></Label>
                        <ReactSelect
                          isMulti
                          options={customerOptions.map(option => ({ value: option, label: option.charAt(0).toUpperCase() + option.slice(1) }))}
                          value={customerOptions.filter(option => selectedCustomers.includes(option)).map(option => ({ value: option, label: option.charAt(0).toUpperCase() + option.slice(1) }))}
                          onChange={(selected) => {
                            const modules = selected ? selected.map(s => s.value) : [];
                            setSelectedCustomers(modules);
                          }}
                          placeholder="Select modules..."
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: '40px',
                              border: '1px solid #d1d5db',
                              boxShadow: 'none',
                              '&:hover': {
                                border: '1px solid #cbd5e1'
                              }
                            }),
                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: '#f1f5f9'
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: '#334155'
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: '#64748b',
                              '&:hover': {
                                backgroundColor: '#e2e8f0',
                                color: '#475569'
                              }
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected 
                                ? '#dbeafe' 
                                : state.isFocused 
                                ? '#f0f9ff' 
                                : 'white',
                              color: state.isSelected ? '#1e40af' : '#374151',
                              '&:hover': {
                                backgroundColor: '#f0f9ff'
                              }
                            })
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    type="submit" 
                    className="bg-[#C72030] hover:bg-[#A61B29] text-white border-none font-semibold flex-1 h-11" 
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? 'Adding Holiday...' : 'Add Holiday'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel} 
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />
      )}

      {/* Filter Modal */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-lg" aria-describedby="filter-dialog-description">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">Filter Holidays</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
            <div id="filter-dialog-description" className="sr-only">Filter holidays by various criteria</div>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>By Name</Label>
              <Input
                placeholder="Search by name..."
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label>By Holiday Type</Label>
              <ReactSelect
                isClearable
                options={[
                  { value: 'Public', label: 'Public' },
                  { value: 'Festival', label: 'Festival' },
                  { value: 'National', label: 'National' },
                ]}
                value={filterType ? { value: filterType, label: filterType } : null}
                onChange={opt => setFilterType(opt?.value || '')}
                placeholder="Select type..."
              />
            </div>
            <div className="space-y-2">
              <Label>By Status</Label>
              <ReactSelect
                isClearable
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                value={filterStatus ? { value: filterStatus, label: filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1) } : null}
                onChange={opt => setFilterStatus(opt?.value || '')}
                placeholder="Select status..."
              />
            </div>
            <div className="space-y-2">
              <Label>By Location (text)</Label>
              <Input
                placeholder="Filter by location..."
                value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label>By Sites</Label>
              <ReactSelect
                isMulti
                options={siteOptions.map(s => ({ value: s.id, label: s.name }))}
                value={siteOptions.filter(s => filterSiteIds.includes(s.id)).map(s => ({ value: s.id, label: s.name }))}
                onChange={opts => setFilterSiteIds(opts ? opts.map((o: {value: number}) => o.value) : [])}
                placeholder="Select sites..."
              />
            </div>
            <div className="space-y-2">
              <Label>By Module</Label>
              <ReactSelect
                isMulti
                options={customerOptions.map(o => ({ value: o, label: o.charAt(0).toUpperCase() + o.slice(1) }))}
                value={filterModules.map(m => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))}
                onChange={opts => setFilterModules(opts ? opts.map((o: {value: string}) => o.value) : [])}
                placeholder="Select modules..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleApplyFilters} className="flex-1 bg-primary text-primary-foreground">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                Clear Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Holiday Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          // Reset form when closing edit dialog
          setHolidayName('');
          setDate(undefined);
          setRecurring('');
          setSelectedSites([]);
          setSelectedType('');
          setSelectedCustomers([]);
          setEditingHoliday(null);
        }
        setIsEditDialogOpen(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="edit-holiday-dialog-description">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">EDIT HOLIDAY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditCancel}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
            <div id="edit-holiday-dialog-description" className="sr-only">
              Edit holiday with name, date, recurrence, sites, type, and modules
            </div>
          </DialogHeader>
          
          {loadingEditData ? (
            <div className="py-8 text-center">
              <div className="text-sm text-gray-500">Loading holiday data...</div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {/* Holiday Form */}
              <Card>
                <CardContent className="space-y-6 pt-6">
                  {/* First Row */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="edit-holiday-name">Holiday Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="edit-holiday-name"
                        placeholder="Enter Holiday Name"
                        value={holidayName}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            setHolidayName(value);
                          }
                        }}
                        className="h-10 border-gray-300 focus:border-gray-500 focus:ring-0"
                        style={{ borderRadius: '4px' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-date">Date <span className="text-red-500">*</span></Label>
                      <Input
                        id="edit-date"
                        type="date"
                        placeholder="Select date"
                        value={date ? format(date, "yyyy-MM-dd") : ''}
                        min={format(new Date(), "yyyy-MM-dd")}
                        onChange={(e) => {
                          if (e.target.value) {
                            setDate(new Date(e.target.value));
                          } else {
                            setDate(undefined);
                          }
                        }}
                        className="h-10 border-gray-300 focus:border-gray-500 focus:ring-0"
                        style={{ borderRadius: '4px' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-recurring">Recurring <span className="text-red-500">*</span></Label>
                      <ReactSelect
                        id="edit-recurring"
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                        value={recurring ? { value: recurring, label: recurring === 'yes' ? 'Yes' : 'No' } : null}
                        onChange={(selected) => {
                          setRecurring(selected ? selected.value : '');
                        }}
                        placeholder="Select"
                        isClearable
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: '#d1d5db',
                            '&:hover': {
                              borderColor: '#cbd5e1'
                            },
                            boxShadow: 'none',
                            fontSize: '14px',
                            minHeight: '40px'
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: '#9CA3AF'
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected 
                              ? '#dbeafe' 
                              : state.isFocused 
                              ? '#f0f9ff' 
                              : 'white',
                            color: state.isSelected ? '#1e40af' : '#374151',
                            '&:hover': {
                              backgroundColor: '#f0f9ff'
                            }
                          })
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Second Row */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="edit-holiday-type">Holiday Type <span className="text-red-500">*</span></Label>
                      <ReactSelect
                        id="edit-holiday-type"
                        options={[
                          { value: 'public', label: 'Public' },
                          { value: 'festival', label: 'Festival' },
                          { value: 'maintenance', label: 'Maintenance' }
                        ]}
                        value={selectedType ? { value: selectedType, label: selectedType.charAt(0).toUpperCase() + selectedType.slice(1) } : null}
                        onChange={(selected) => {
                          setSelectedType(selected ? selected.value : '');
                        }}
                        placeholder="Select type"
                        isClearable
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: '#d1d5db',
                            '&:hover': {
                              borderColor: '#cbd5e1'
                            },
                            boxShadow: 'none',
                            fontSize: '14px',
                            minHeight: '40px'
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: '#9CA3AF'
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected 
                              ? '#dbeafe' 
                              : state.isFocused 
                              ? '#f0f9ff' 
                              : 'white',
                            color: state.isSelected ? '#1e40af' : '#374151',
                            '&:hover': {
                              backgroundColor: '#f0f9ff'
                            }
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-sites">Select Sites <span className="text-red-500">*</span></Label>
                      <ReactSelect
                        id="edit-sites"
                        placeholder="Select sites"
                        isMulti
                        isLoading={loadingSites}
                        value={siteOptions.filter(site => selectedSites.includes(site.id))}
                        onChange={(selectedOptions) => {
                          const ids = selectedOptions ? selectedOptions.map(option => option.id) : [];
                          setSelectedSites(ids);
                        }}
                        options={siteOptions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id.toString()}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: '#d1d5db',
                            '&:hover': {
                              borderColor: '#cbd5e1'
                            },
                            boxShadow: 'none',
                            fontSize: '14px',
                            minHeight: '40px'
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: '#9CA3AF'
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#f1f5f9'
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: '#334155'
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: '#64748b',
                            '&:hover': {
                              backgroundColor: '#e2e8f0',
                              color: '#475569'
                            }
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected 
                              ? '#dbeafe' 
                              : state.isFocused 
                              ? '#f0f9ff' 
                              : 'white',
                            color: state.isSelected ? '#1e40af' : '#374151',
                            '&:hover': {
                              backgroundColor: '#f0f9ff'
                            }
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-modules">Select Module <span className="text-red-500">*</span></Label>
                      <ReactSelect
                        id="edit-modules"
                        placeholder="Select module"
                        isMulti
                        value={customerOptions.filter(customer => selectedCustomers.includes(customer)).map(customer => ({ value: customer, label: customer.charAt(0).toUpperCase() + customer.slice(1) }))}
                        onChange={(selectedOptions) => {
                          const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                          setSelectedCustomers(values);
                        }}
                        options={customerOptions.map(customer => ({ value: customer, label: customer.charAt(0).toUpperCase() + customer.slice(1) }))}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: '#d1d5db',
                            '&:hover': {
                              borderColor: '#cbd5e1'
                            },
                            boxShadow: 'none',
                            fontSize: '14px',
                            minHeight: '40px'
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: '#9CA3AF'
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#f1f5f9'
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: '#334155'
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: '#64748b',
                            '&:hover': {
                              backgroundColor: '#e2e8f0',
                              color: '#475569'
                            }
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected 
                              ? '#dbeafe' 
                              : state.isFocused 
                              ? '#f0f9ff' 
                              : 'white',
                            color: state.isSelected ? '#1e40af' : '#374151',
                            '&:hover': {
                              backgroundColor: '#f0f9ff'
                            }
                          })
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  variant="secondary" 
                  onClick={handleUpdate} 
                  className="flex-1 h-11"
                  disabled={isSubmitting || loadingEditData}
                >
                  {isSubmitting ? 'Updating Holiday...' : 'Update Holiday'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleEditCancel} 
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <TicketPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        perPage={perPage}
        isLoading={false}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </div>
  );
};