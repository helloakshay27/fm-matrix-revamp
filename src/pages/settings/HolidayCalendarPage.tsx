import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { CalendarDays, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useApiConfig } from '@/hooks/useApiConfig';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from '@/hooks/use-toast';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TextField } from '@mui/material';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface Holiday {
  id: string;
  holidayName: string;
  date: string;
  recurring: boolean;
  applicableLocation: string;
  holidayType: string;
  applicableFor: string;
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
    label: 'Applicable Location',
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
    label: 'Applicable For',
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
  const [sitesDropdownOpen, setSitesDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [customersDropdownOpen, setCustomersDropdownOpen] = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [loadingEditData, setLoadingEditData] = useState(false);
  
  // API and Sites data
  const { baseUrl, token, endpoints } = useApiConfig();
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Site options - now dynamic from API
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
    // Get site names from site_ids
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
      applicableFor: apiHoliday.applicable_for.join(', ')
    };
  };

  // Load sites on component mount
  useEffect(() => {
    const loadSites = async () => {
      if (!baseUrl || !token) {
        console.warn('Missing API configuration for loading sites');
        return;
      }
      
      setLoadingSites(true);
      try {
        const sitesData = await ticketManagementAPI.getAllSites();
        setSiteOptions(sitesData);
        console.log('Sites loaded successfully:', sitesData.length, 'sites');
      } catch (error) {
        console.error('Error loading sites:', error);
        toast({
          title: "Error",
          description: "Failed to load sites. Using fallback options.",
          variant: "destructive",
        });
        // Fallback to mock data if API fails
        setSiteOptions([
          { id: 1, name: 'Sai Radha, Bund Garden' },
          { id: 2, name: 'Pentagon Mangarpeta' },
          { id: 3, name: 'Westport,Baner' },
          { id: 4, name: 'Peninsula Corporate Park, Lower Parel' },
        ]);
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
        toast({
          title: "Error",
          description: "Failed to load holidays from API. Using fallback data.",
          variant: "destructive",
        });
        // Keep using fallback data if API fails
        setHolidays([]);
      } finally {
        setLoadingHolidays(false);
      }
    };

    loadHolidays();
  }, [baseUrl, token, endpoints, siteOptions]); // Added siteOptions dependency so holidays load after sites are loaded

  // Filter holidays based on search term
  const filteredHolidays = holidays.filter(holiday => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      holiday.holidayName.toLowerCase().includes(searchLower) ||
      holiday.date.toLowerCase().includes(searchLower) ||
      holiday.holidayType.toLowerCase().includes(searchLower) ||
      holiday.applicableLocation.toLowerCase().includes(searchLower) ||
      holiday.applicableFor.toLowerCase().includes(searchLower)
    );
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

  const handleSiteChange = (siteId: number, checked: boolean) => {
    if (checked) {
      setSelectedSites([...selectedSites, siteId]);
    } else {
      setSelectedSites(selectedSites.filter(id => id !== siteId));
    }
  };

  const handleCustomerChange = (customer: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customer]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(c => c !== customer));
    }
  };

  const handleSelectAllSites = (checked: boolean) => {
    if (checked) {
      setSelectedSites(siteOptions.map(site => site.id));
    } else {
      setSelectedSites([]);
    }
  };

  const handleUpdate = async () => {
    if (!editingHoliday || !holidayName || !date || !recurring || selectedSites.length === 0 || !selectedType || selectedCustomers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
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
        applicableFor: selectedCustomers.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')
      };

      const updatedHolidays = holidays.map(h => 
        h.id === editingHoliday.id ? updatedHoliday : h
      );
      setHolidays(updatedHolidays);

      toast({
        title: "Success",
        description: "Holiday updated successfully",
      });
      
      // Reset form and close dialog
      handleEditCancel();
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update holiday",
        variant: "destructive",
      });
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
    
    // Close all dropdowns
    setSitesDropdownOpen(false);
    setTypeDropdownOpen(false);
    setCustomersDropdownOpen(false);
    setRecurringOpen(false);
    
    setIsEditDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (!holidayName || !date || !recurring || selectedSites.length === 0 || !selectedType || selectedCustomers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
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
        applicableFor: selectedCustomers.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')
      };

      const updatedHolidays = [...holidays, newHoliday];
      setHolidays(updatedHolidays);

      toast({
        title: "Success",
        description: "Holiday created successfully",
      });
      
      // Reset form
      handleCancel();
    } catch (error) {
      console.error('Error creating holiday:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create holiday",
        variant: "destructive",
      });
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
    
    // Close all dropdowns
    setSitesDropdownOpen(false);
    setTypeDropdownOpen(false);
    setCustomersDropdownOpen(false);
    setRecurringOpen(false);
    
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
        toast({
          title: "Error",
          description: "Holiday not found",
          variant: "destructive",
        });
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
        
        toast({
          title: "Warning",
          description: "Using cached data. Some fields may not be editable.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading holiday for edit:', error);
      toast({
        title: "Error",
        description: "Failed to load holiday data",
        variant: "destructive",
      });
    } finally {
      setLoadingEditData(false);
    }
  };

  const handleDelete = (id: string) => {
    console.log('Delete holiday:', id);
  };

  // Render row function for enhanced task table
  const renderRow = (holiday: Holiday) => ({
    actions: (
      <div className="flex items-center gap-2">
        {/* <button 
          onClick={() => handleView(holiday.id)} 
          className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button> */}
        <button 
          onClick={() => handleEdit(holiday.id)} 
          className="p-1 text-green-600 hover:bg-green-50 rounded" 
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        {/* <button 
          onClick={() => handleDelete(holiday.id)} 
          className="p-1 text-red-600 hover:bg-red-50 rounded" 
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button> */}
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
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    )
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Holiday Calendar</h1>
      </header>

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
        leftActions={(
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            if (open) {
              // Reset form when opening add dialog
              setHolidayName('');
              setDate(undefined);
              setRecurring('');
              setSelectedSites([]);
              setSelectedType('');
              setSelectedCustomers([]);
              setSitesDropdownOpen(false);
              setTypeDropdownOpen(false);
              setCustomersDropdownOpen(false);
              setRecurringOpen(false);
            }
            setIsAddDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
                <Plus className="w-4 h-4 mr-2" /> Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Holiday</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <div className="grid grid-cols-3 gap-4 space-y-0">
                  <div className="space-y-2">
                    <Label htmlFor="holidayName">Holiday Name</Label>
                    <TextField
                      id="holidayName"
                      placeholder="Holiday Name"
                      value={holidayName}
                      onChange={(e) => setHolidayName(e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: '1px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: '1px',
                          },
                          '&.Mui-error fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: '1px',
                          },
                        },
                      }}
                    />
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal !border-gray-300 !hover:border-gray-300 !focus:border-gray-300",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "dd - MM - yyyy") : <span>DD - MM - YY</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Recurring */}
                  <div className="space-y-2">
                    <Label>Recurring</Label>
                    <Popover open={recurringOpen} onOpenChange={setRecurringOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between font-normal text-left !border-gray-300 !hover:border-gray-300 !focus:border-gray-300"
                        >
                          {recurring ? (recurring === "yes" ? "Yes" : "No") : "Select"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <div className="p-2 space-y-1">
                          <div 
                            className="px-3 py-2 hover:bg-accent cursor-pointer rounded-sm"
                            onClick={() => {
                              setRecurring("yes");
                              setRecurringOpen(false);
                            }}
                          >
                            Yes
                          </div>
                          <div 
                            className="px-3 py-2 hover:bg-accent cursor-pointer rounded-sm"
                            onClick={() => {
                              setRecurring("no");
                              setRecurringOpen(false);
                            }}
                          >
                            No
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Select Sites */}
                  <div className="space-y-2">
                    <Label>Select Sites</Label>
                    <Popover open={sitesDropdownOpen} onOpenChange={setSitesDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal !border-gray-300 !hover:border-gray-300 !focus:border-gray-300"
                          onClick={() => setSitesDropdownOpen(!sitesDropdownOpen)}
                        >
                          {selectedSites.length > 0 ? 
                            `${selectedSites.length} site${selectedSites.length > 1 ? 's' : ''} selected` : 
                            "Select sites"
                          }
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-3 max-h-64 overflow-y-auto">
                          <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                            <Checkbox 
                              id="selectAllSites"
                              checked={selectedSites.length === siteOptions.length}
                              onCheckedChange={handleSelectAllSites}
                            />
                            <Label htmlFor="selectAllSites" className="font-medium">Select All</Label>
                          </div>
                          {loadingSites ? (
                            <div className="text-center py-4 text-sm text-gray-500">Loading sites...</div>
                          ) : (
                            siteOptions.map((site) => (
                              <div key={site.id} className="flex items-center space-x-2 mb-1">
                                <Checkbox
                                  id={String(site.id)}
                                  checked={selectedSites.includes(site.id)}
                                  onCheckedChange={(checked) => handleSiteChange(site.id, checked as boolean)}
                                />
                                <Label htmlFor={String(site.id)} className="text-sm">{site.name}</Label>
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Select Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Select Type</Label>
                    <Popover open={typeDropdownOpen} onOpenChange={setTypeDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal !border-gray-300 !hover:border-gray-300 !focus:border-gray-300"
                          onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                        >
                          {selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : "Select type"}
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <div className="p-1">
                          {['public', 'festival', 'maintenance'].map((type) => (
                            <div
                              key={type}
                              className="px-3 py-2 cursor-pointer hover:bg-accent rounded-sm"
                              onClick={() => {
                                setSelectedType(type);
                                setTypeDropdownOpen(false);
                              }}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Select Customers */}
                  <div className="space-y-2">
                    <Label>Select Customers</Label>
                    <Popover open={customersDropdownOpen} onOpenChange={setCustomersDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal !border-gray-300 !hover:border-gray-300 !focus:border-gray-300"
                          onClick={() => setCustomersDropdownOpen(!customersDropdownOpen)}
                        >
                          {selectedCustomers.length > 0 ? 
                            `${selectedCustomers.length} customer${selectedCustomers.length > 1 ? 's' : ''} selected` : 
                            "Select customers"
                          }
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-3 max-h-64 overflow-y-auto bg-gray-50">
                          {customerOptions.map((customer) => (
                            <div key={customer} className="flex items-center space-x-2 mb-2">
                              <Checkbox
                                id={customer}
                                checked={selectedCustomers.includes(customer)}
                                onCheckedChange={(checked) => handleCustomerChange(customer, checked as boolean)}
                              />
                              <Label htmlFor={customer} className="text-sm">
                                {customer.charAt(0).toUpperCase() + customer.slice(1)}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  className="bg-[#C72030] hover:bg-[#A01020] text-white"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding Holiday...' : 'Add Holiday'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />

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
          setSitesDropdownOpen(false);
          setTypeDropdownOpen(false);
          setCustomersDropdownOpen(false);
          setRecurringOpen(false);
        }
        setIsEditDialogOpen(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Holiday</DialogTitle>
          </DialogHeader>
          
          {loadingEditData ? (
            <div className="py-8 text-center">
              <div className="text-sm text-gray-500">Loading holiday data...</div>
            </div>
          ) : (
            <div className="py-4">
              <div className="grid grid-cols-3 gap-4 space-y-0">
                <div className="space-y-2">
                  <Label htmlFor="editHolidayName">Holiday Name</Label>
                  <TextField
                    id="editHolidayName"
                    placeholder="Holiday Name"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#e5e7eb',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#e5e7eb',
                          borderWidth: '1px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e5e7eb',
                          borderWidth: '1px',
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#e5e7eb',
                          borderWidth: '1px',
                        },
                      },
                    }}
                  />
                </div>

                {/* Date Picker */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal !border-gray-300 !hover:border-gray-300 !focus:border-gray-300",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd - MM - yyyy") : <span>DD - MM - YY</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Recurring */}
                <div className="space-y-2">
                  <Label>Recurring</Label>
                  <Popover open={recurringOpen} onOpenChange={setRecurringOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal text-left !border-gray-300 !hover:border-gray-300 !focus:border-gray-300"
                      >
                        {recurring ? (recurring === "yes" ? "Yes" : "No") : "Select"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <div className="p-2 space-y-1">
                        <div 
                          className="px-3 py-2 hover:bg-accent cursor-pointer rounded-sm"
                          onClick={() => {
                            setRecurring("yes");
                            setRecurringOpen(false);
                          }}
                        >
                          Yes
                        </div>
                        <div 
                          className="px-3 py-2 hover:bg-accent cursor-pointer rounded-sm"
                          onClick={() => {
                            setRecurring("no");
                            setRecurringOpen(false);
                          }}
                        >
                          No
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Select Sites */}
                <div className="space-y-2">
                  <Label>Select Sites</Label>
                  <Popover open={sitesDropdownOpen} onOpenChange={setSitesDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal !border-gray-300 !hover:border-gray-300 !focus:border-gray-300"
                        onClick={() => setSitesDropdownOpen(!sitesDropdownOpen)}
                      >
                        {selectedSites.length > 0 ? 
                          `${selectedSites.length} site${selectedSites.length > 1 ? 's' : ''} selected` : 
                          "Select sites"
                        }
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                      <div className="p-3 max-h-64 overflow-y-auto">
                        <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                          <Checkbox 
                            id="selectAllEditSites"
                            checked={selectedSites.length === siteOptions.length}
                            onCheckedChange={handleSelectAllSites}
                          />
                          <Label htmlFor="selectAllEditSites" className="font-medium">Select All</Label>
                        </div>
                        {loadingSites ? (
                          <div className="text-center py-4 text-sm text-gray-500">Loading sites...</div>
                        ) : (
                          siteOptions.map((site) => (
                            <div key={site.id} className="flex items-center space-x-2 mb-1">
                              <Checkbox
                                id={`edit-${site.id}`}
                                checked={selectedSites.includes(site.id)}
                                onCheckedChange={(checked) => handleSiteChange(site.id, checked as boolean)}
                              />
                              <Label htmlFor={`edit-${site.id}`} className="text-sm">{site.name}</Label>
                            </div>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Select Type */}
                <div className="space-y-2">
                  <Label htmlFor="editType">Select Type</Label>
                  <Popover open={typeDropdownOpen} onOpenChange={setTypeDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal !border-gray-300 !hover:border-gray-300 !focus:border-gray-300"
                        onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                      >
                        {selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : "Select type"}
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <div className="p-1">
                        {['public', 'festival', 'maintenance'].map((type) => (
                          <div
                            key={type}
                            className="px-3 py-2 cursor-pointer hover:bg-accent rounded-sm"
                            onClick={() => {
                              setSelectedType(type);
                              setTypeDropdownOpen(false);
                            }}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Select Customers */}
                <div className="space-y-2">
                  <Label>Select Customers</Label>
                  <Popover open={customersDropdownOpen} onOpenChange={setCustomersDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal !border-gray-300 !hover:border-gray-300 !focus:border-gray-300"
                        onClick={() => setCustomersDropdownOpen(!customersDropdownOpen)}
                      >
                        {selectedCustomers.length > 0 ? 
                          `${selectedCustomers.length} customer${selectedCustomers.length > 1 ? 's' : ''} selected` : 
                          "Select customers"
                        }
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                      <div className="p-3 max-h-64 overflow-y-auto bg-gray-50">
                        {customerOptions.map((customer) => (
                          <div key={customer} className="flex items-center space-x-2 mb-2">
                            <Checkbox
                              id={`edit-${customer}`}
                              checked={selectedCustomers.includes(customer)}
                              onCheckedChange={(checked) => handleCustomerChange(customer, checked as boolean)}
                            />
                            <Label htmlFor={`edit-${customer}`} className="text-sm">
                              {customer.charAt(0).toUpperCase() + customer.slice(1)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleEditCancel}>
                Cancel
              </Button>
              <Button 
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={handleUpdate}
                disabled={isSubmitting || loadingEditData}
              >
                {isSubmitting ? 'Updating Holiday...' : 'Update Holiday'}
              </Button>
            </div>
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