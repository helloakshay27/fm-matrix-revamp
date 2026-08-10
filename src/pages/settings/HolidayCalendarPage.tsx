import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, Plus, Eye, Edit, Trash2, Filter, Loader2 } from 'lucide-react';
import { useApiConfig } from '@/hooks/useApiConfig';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import { userService } from '@/services/userService';
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
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from '@mui/material';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const placeholderText = (text: string) => (
  <span style={{ color: '#9ca3af' }}>{text}</span>
);

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
  const { shouldShow } = useDynamicPermissions();

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
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [loadingEditData, setLoadingEditData] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Multi-add: pending holiday rows before final save
  interface PendingHoliday {
    id: string;
    holidayName: string;
    date: Date;
    recurring: string;
    selectedType: string;
    selectedSites: number[];
    selectedCustomers: string[];
  }
  const [pendingHolidays, setPendingHolidays] = useState<PendingHoliday[]>([]);
  const [addRowError, setAddRowError] = useState('');

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
        const accountData = await userService.getAccountDetails();
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

  // Add current row to the pending list (does not call API yet)
  const handleAddRow = () => {
    if (!holidayName || !date || !recurring || selectedSites.length === 0 || !selectedType || selectedCustomers.length === 0) {
      setAddRowError('Please fill all fields before adding.');
      return;
    }
    // Duplicate check within pending list and existing holidays
    const allNames = [
      ...holidays.map(h => h.holidayName.toLowerCase()),
      ...pendingHolidays.map(p => p.holidayName.toLowerCase()),
    ];
    if (allNames.includes(holidayName.trim().toLowerCase())) {
      setAddRowError('Duplicate name: this holiday already exists.');
      return;
    }
    setAddRowError('');
    setPendingHolidays(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        holidayName: holidayName.trim(),
        date,
        recurring,
        selectedType,
        selectedSites: [...selectedSites],
        selectedCustomers: [...selectedCustomers],
      },
    ]);
    // Clear row for next entry
    setHolidayName('');
    setDate(undefined);
    setRecurring('');
    setSelectedSites([]);
    setSelectedType('');
    setSelectedCustomers([]);
  };

  // Remove a pending row
  const handleRemovePending = (id: string) => {
    setPendingHolidays(prev => prev.filter(p => p.id !== id));
  };

  // Submit all pending holidays to the API
  const handleSubmit = async () => {
    const toSubmit = [...pendingHolidays];
    if (toSubmit.length === 0) {
      toast.error('Please add at least one holiday before saving.');
      return;
    }

    setIsSubmitting(true);
    const created: Holiday[] = [];
    try {
      for (const item of toSubmit) {
        const holidayPayload = {
          holiday_calendar: {
            name: item.holidayName,
            is_recuring: item.recurring === 'yes',
            holiday_date: item.date.toISOString(),
            holiday_type: item.selectedType.charAt(0).toUpperCase() + item.selectedType.slice(1),
            site_ids: item.selectedSites,
            applicable_for: item.selectedCustomers,
          },
        };
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
        const siteNames = siteOptions
          .filter(site => item.selectedSites.includes(site.id))
          .map(site => site.name)
          .join(', ');
        created.push({
          id: String(responseData.id || Date.now()),
          holidayName: item.holidayName,
          date: format(item.date, 'dd MMMM yyyy'),
          recurring: item.recurring === 'yes',
          applicableLocation: siteNames,
          holidayType: item.selectedType.charAt(0).toUpperCase() + item.selectedType.slice(1),
          applicableFor: item.selectedCustomers.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', '),
          active: true,
        });
      }
      setHolidays(prev => [...prev, ...created]);
      toast.success(`${created.length} holiday${created.length > 1 ? 's' : ''} created successfully`);
      handleCancel();
    } catch (error) {
      console.error('Error creating holidays:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create holiday');
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
    setPendingHolidays([]);
    setAddRowError('');
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
        {shouldShow("Holiday Calendar","update")&&(
        <button
          onClick={() => handleEdit(holiday.id)}
          className="p-1 text-black-600 hover:bg-green-50 rounded"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>)}
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
      <div className="relative inline-flex">
        <Switch
          checked={holiday.active}
          onCheckedChange={() => handleToggleStatus(holiday)}
          disabled={togglingId === holiday.id}
        />
        {togglingId === holiday.id && (
          <Loader2 className="ml-2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>
    ),
  });


  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Holiday Calendar</h1>
      </header>

      {/* Loader overlay */}
      {loadingHolidays && (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f4ee]">
                <TableHead className="font-medium">Action</TableHead>
                <TableHead className="font-medium">Holiday Name</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Recurring</TableHead>
                <TableHead className="font-medium">Sites</TableHead>
                <TableHead className="font-medium">Holiday Type</TableHead>
                <TableHead className="font-medium">Modules</TableHead>
                <TableHead className="font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="pt-4 pb-16">
                  <div className="w-full flex items-center justify-start gap-3 pl-4">
                    <div
                      className="h-5 w-5 rounded-full animate-spin"
                      style={{
                        border: "2px solid #000000",
                        borderTopColor: "transparent",
                      }}
                    />
                    <span className="text-sm text-black">
                      Loading ...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
        emptyMessage=""
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
          }} modal={false}>
            {shouldShow("Holiday Calendar","create")&&(
            <DialogTrigger asChild>
          
              <Button className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium">
                <Plus className="w-4 h-4 mr-2 text-white" /> Add Holiday
              </Button>
            </DialogTrigger>)}
            <DialogContent
              className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white"
              aria-describedby="add-holiday-dialog-description"
              onPointerDownOutside={(e) => {
                if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
                  e.preventDefault();
                }
              }}
              onInteractOutside={(e) => {
                if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
                  e.preventDefault();
                }
              }}
            >
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
                  Add one or more holidays with name, date, recurrence, sites, type, and modules
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Input Row */}
                <Card>
                  <CardContent className="pt-5 pb-4">
                    <div className="grid grid-cols-6 gap-3 items-start">
                      {/* Holiday Name */}
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold">Holiday Name <span className="text-red-500">*</span></Label>
                        <TextField
                          type="text"
                          placeholder="Enter Holiday Name"
                          value={holidayName}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-z\s]*$/.test(value)) {
                              setHolidayName(value);
                              setAddRowError('');
                            }
                          }}
                          fullWidth
                          variant="outlined"
                          sx={fieldStyles}
                        />
                      </div>

                      {/* Date */}
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold">Date <span className="text-red-500">*</span></Label>
                        <TextField
                          type="date"
                          value={date ? format(date, 'yyyy-MM-dd') : ''}
                          inputProps={{ min: format(new Date(), 'yyyy-MM-dd') }}
                          onChange={(e) => {
                            setDate(e.target.value ? new Date(e.target.value) : undefined);
                            setAddRowError('');
                          }}
                          fullWidth
                          variant="outlined"
                          sx={fieldStyles}
                        />
                      </div>

                      {/* Recurring */}
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold">
                          Recurring <span className="text-red-500">*</span>
                        </Label>
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                          <MuiSelect
                            displayEmpty
                            value={recurring}
                            onChange={(e) => { setRecurring(e.target.value); setAddRowError(''); }}
                            MenuProps={selectMenuProps}
                            renderValue={(selected) => {
                              if (!selected) return placeholderText('Select...');
                              return selected === 'yes' ? 'Yes' : 'No';
                            }}
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>

                      {/* Holiday Type */}
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold">
                          Holiday Type <span className="text-red-500">*</span>
                        </Label>
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                          <MuiSelect
                            displayEmpty
                            value={selectedType}
                            onChange={(e) => { setSelectedType(e.target.value); setAddRowError(''); }}
                            MenuProps={selectMenuProps}
                            renderValue={(selected) => {
                              if (!selected) return placeholderText('Select...');
                              return String(selected).charAt(0).toUpperCase() + String(selected).slice(1);
                            }}
                          >
                            <MenuItem value="public">Public</MenuItem>
                            <MenuItem value="festival">Festival</MenuItem>
                            <MenuItem value="maintenance">Maintenance</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>

                      {/* Select Sites */}
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold">
                          Select Sites <span className="text-red-500">*</span>
                        </Label>
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                          <MuiSelect
                            displayEmpty
                            multiple
                            value={selectedSites}
                            onChange={(e) => { setSelectedSites(e.target.value as number[]); setAddRowError(''); }}
                            renderValue={(selected) => {
                              const labels = siteOptions
                                .filter(s => (selected as number[]).includes(s.id))
                                .map(s => s.name);
                              return labels.length > 0
                                ? labels.join(', ')
                                : placeholderText(loadingSites ? 'Loading...' : 'Select...');
                            }}
                            MenuProps={selectMenuProps}
                            disabled={loadingSites}
                          >
                            {siteOptions.map(s => (
                              <MenuItem key={s.id} value={s.id}>
                                <Checkbox size="small" checked={selectedSites.includes(s.id)} />
                                {s.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </div>

                      {/* Select Module */}
                      <div className="space-y-1">
                        <Label className="text-sm font-semibold">
                          Select Module <span className="text-red-500">*</span>
                        </Label>
                        <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                          <MuiSelect
                            displayEmpty
                            multiple
                            value={selectedCustomers}
                            onChange={(e) => { setSelectedCustomers(e.target.value as string[]); setAddRowError(''); }}
                            renderValue={(selected) => {
                              const labels = (selected as string[])
                                .map(m => m.charAt(0).toUpperCase() + m.slice(1));
                              return labels.length > 0
                                ? labels.join(', ')
                                : placeholderText('Select...');
                            }}
                            MenuProps={selectMenuProps}
                          >
                            {customerOptions.map(o => (
                              <MenuItem key={o} value={o}>
                                <Checkbox size="small" checked={selectedCustomers.includes(o)} />
                                {o.charAt(0).toUpperCase() + o.slice(1)}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                    </div>

                    {/* Validation error */}
                    {addRowError && (
                      <p className="text-red-500 text-xs mt-2">{addRowError}</p>
                    )}

                    {/* Add button below the row */}
                    <div className="flex justify-end mt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleAddRow}
                        className="fm-button-fix fm-button-brand px-4 py-2"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending holidays list */}
                {pendingHolidays.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <span className="text-sm font-semibold text-gray-700">
                        Holidays to be saved ({pendingHolidays.length})
                      </span>
                    </div>
                    <div className="divide-y max-h-60 overflow-y-auto">
                      {pendingHolidays.map((item, idx) => (
                        <div key={item.id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <span className="text-xs font-medium text-gray-500 w-5">{idx + 1}.</span>
                            <span className="text-sm font-medium text-gray-900 truncate max-w-[140px]" title={item.holidayName}>{item.holidayName}</span>
                            <span className="text-xs text-gray-500">{format(item.date, 'dd MMM yyyy')}</span>
                            <span className="text-xs text-gray-500">{item.recurring === 'yes' ? 'Recurring' : 'Non-recurring'}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {item.selectedType.charAt(0).toUpperCase() + item.selectedType.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500 truncate max-w-[100px]" title={siteOptions.filter(s => item.selectedSites.includes(s.id)).map(s => s.name).join(', ')}>
                              {siteOptions.filter(s => item.selectedSites.includes(s.id)).map(s => s.name).join(', ') || '—'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemovePending(item.id)}
                            className="ml-3 text-gray-400 hover:text-red-500 flex-shrink-0"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save All / Cancel */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    className="flex-1 bg-brand hover:bg-brand-hover text-white px-4 py-2 disabled:!opacity-100 disabled:!bg-brand"
                    disabled={isSubmitting || pendingHolidays.length === 0}
                    onClick={handleSubmit}
                  >
                    {isSubmitting
                      ? 'Saving...'
                      : `Save ${pendingHolidays.length > 0 ? `(${pendingHolidays.length}) ` : ''}Holiday${pendingHolidays.length !== 1 ? 's' : ''}`}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1 h-11 border-brand text-brand hover:bg-brand-selected hover:text-brand">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />
      )}

      {/* Filter Modal — matches SnaggingFilterDialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen} modal={false}>
        <DialogContent
          className="w-full sm:max-w-[500px] bg-white overflow-visible"
          aria-describedby="filter-dialog-description"
          onPointerDownOutside={(e) => {
            if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div id="filter-dialog-description" className="sr-only">Filter holidays by various criteria</div>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <TextField
              label="Name"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel id="holiday-filter-type-label">Holiday Type</InputLabel>
              <MuiSelect
                labelId="holiday-filter-type-label"
                label="Holiday Type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value=""><em>Select Type</em></MenuItem>
                <MenuItem value="Public">Public</MenuItem>
                <MenuItem value="Festival">Festival</MenuItem>
                <MenuItem value="National">National</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="holiday-filter-status-label">Status</InputLabel>
              <MuiSelect
                labelId="holiday-filter-status-label"
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value=""><em>Select Status</em></MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Location"
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel id="holiday-filter-sites-label">Sites</InputLabel>
              <MuiSelect
                labelId="holiday-filter-sites-label"
                label="Sites"
                multiple
                value={filterSiteIds}
                onChange={(e) => setFilterSiteIds(e.target.value as number[])}
                renderValue={(selected) => {
                  const labels = siteOptions
                    .filter(s => (selected as number[]).includes(s.id))
                    .map(s => s.name);
                  return labels.length > 0 ? labels.join(', ') : '';
                }}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                {siteOptions.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    <Checkbox size="small" checked={filterSiteIds.includes(s.id)} />
                    {s.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="holiday-filter-module-label">Module</InputLabel>
              <MuiSelect
                labelId="holiday-filter-module-label"
                label="Module"
                multiple
                value={filterModules}
                onChange={(e) => setFilterModules(e.target.value as string[])}
                renderValue={(selected) => {
                  const labels = (selected as string[])
                    .map(m => m.charAt(0).toUpperCase() + m.slice(1));
                  return labels.length > 0 ? labels.join(', ') : '';
                }}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                {customerOptions.map(o => (
                  <MenuItem key={o} value={o}>
                    <Checkbox size="small" checked={filterModules.includes(o)} />
                    {o.charAt(0).toUpperCase() + o.slice(1)}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Button
              onClick={handleApplyFilters}
              className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto"
            >
              APPLY
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="border-brand text-brand px-8 w-full sm:w-auto"
            >
              RESET
            </Button>
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
      }} modal={false}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white"
          aria-describedby="edit-holiday-dialog-description"
          onPointerDownOutside={(e) => {
            if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
              e.preventDefault();
            }
          }}
        >
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
                  <div className="grid grid-cols-3 gap-6 items-start">
                    <div className="space-y-2">
                      <Label htmlFor="edit-holiday-name">Holiday Name <span className="text-red-500">*</span></Label>
                      <TextField
                        id="edit-holiday-name"
                        placeholder="Enter Holiday Name"
                        value={holidayName}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            setHolidayName(value);
                          }
                        }}
                        fullWidth
                        variant="outlined"
                        sx={fieldStyles}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-date">Date <span className="text-red-500">*</span></Label>
                      <TextField
                        id="edit-date"
                        type="date"
                        placeholder="Select date"
                        value={date ? format(date, "yyyy-MM-dd") : ''}
                        inputProps={{ min: format(new Date(), "yyyy-MM-dd") }}
                        onChange={(e) => {
                          if (e.target.value) {
                            setDate(new Date(e.target.value));
                          } else {
                            setDate(undefined);
                          }
                        }}
                        fullWidth
                        variant="outlined"
                        sx={fieldStyles}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Recurring <span className="text-red-500">*</span>
                      </Label>
                      <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                        <MuiSelect
                          displayEmpty
                          value={recurring}
                          onChange={(e) => setRecurring(e.target.value)}
                          MenuProps={selectMenuProps}
                          renderValue={(selected) => {
                            if (!selected) return placeholderText('Select...');
                            return selected === 'yes' ? 'Yes' : 'No';
                          }}
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>
                  </div>
                  
                  {/* Second Row */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>
                        Holiday Type <span className="text-red-500">*</span>
                      </Label>
                      <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                        <MuiSelect
                          displayEmpty
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          MenuProps={selectMenuProps}
                          renderValue={(selected) => {
                            if (!selected) return placeholderText('Select...');
                            return String(selected).charAt(0).toUpperCase() + String(selected).slice(1);
                          }}
                        >
                          <MenuItem value="public">Public</MenuItem>
                          <MenuItem value="festival">Festival</MenuItem>
                          <MenuItem value="maintenance">Maintenance</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Select Sites <span className="text-red-500">*</span>
                      </Label>
                      <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                        <MuiSelect
                          displayEmpty
                          multiple
                          value={selectedSites}
                          onChange={(e) => setSelectedSites(e.target.value as number[])}
                          renderValue={(selected) => {
                            const labels = siteOptions
                              .filter(site => (selected as number[]).includes(site.id))
                              .map(site => site.name);
                            return labels.length > 0
                              ? labels.join(', ')
                              : placeholderText(loadingSites ? 'Loading...' : 'Select...');
                          }}
                          MenuProps={selectMenuProps}
                          disabled={loadingSites}
                        >
                          {siteOptions.map(site => (
                            <MenuItem key={site.id} value={site.id}>
                              <Checkbox size="small" checked={selectedSites.includes(site.id)} />
                              {site.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Select Module <span className="text-red-500">*</span>
                      </Label>
                      <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                        <MuiSelect
                          displayEmpty
                          multiple
                          value={selectedCustomers}
                          onChange={(e) => setSelectedCustomers(e.target.value as string[])}
                          renderValue={(selected) => {
                            const labels = (selected as string[])
                              .map(customer => customer.charAt(0).toUpperCase() + customer.slice(1));
                            return labels.length > 0
                              ? labels.join(', ')
                              : placeholderText('Select...');
                          }}
                          MenuProps={selectMenuProps}
                        >
                          {customerOptions.map(customer => (
                            <MenuItem key={customer} value={customer}>
                              <Checkbox size="small" checked={selectedCustomers.includes(customer)} />
                              {customer.charAt(0).toUpperCase() + customer.slice(1)}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={handleUpdate}
                  className="bg-brand hover:bg-brand-hover text-white px-4 py-2"
                  disabled={isSubmitting || loadingEditData}
                >
                  {isSubmitting ? 'Updating Holiday...' : 'Update Holiday'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEditCancel}
                  className="border-brand text-brand px-4 py-2"
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
