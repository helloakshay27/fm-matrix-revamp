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
import { CalendarDays, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useApiConfig } from '@/hooks/useApiConfig';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from '@/hooks/use-toast';
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
          className="p-1 text-black-600 hover:bg-green-50 rounded" 
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
                        <Label className="text-base font-semibold">Holiday Name</Label>
                        <Input
                          type="text"
                          placeholder="Enter Holiday Name"
                          value={holidayName}
                          onChange={(e) => setHolidayName(e.target.value)}
                          className="h-10 border-gray-300 focus:border-gray-500 focus:ring-0"
                          style={{ borderRadius: '4px' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">Date</Label>
                        <Input
                          type="date"
                          placeholder="Select date"
                          value={date ? format(date, "yyyy-MM-dd") : ''}
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
                        <Label className="text-base font-semibold">Recurring</Label>
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
                        <Label className="text-base font-semibold">Holiday Type</Label>
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
                        <Label className="text-base font-semibold">Select Sites</Label>
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
                        <Label className="text-base font-semibold">Select Module</Label>
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
                      <Label htmlFor="edit-holiday-name">Holiday Name</Label>
                      <Input
                        id="edit-holiday-name"
                        placeholder="Enter Holiday Name"
                        value={holidayName}
                        onChange={(e) => setHolidayName(e.target.value)}
                        className="h-10 border-gray-300 focus:border-gray-500 focus:ring-0"
                        style={{ borderRadius: '4px' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-date">Date</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        placeholder="Select date"
                        value={date ? format(date, "yyyy-MM-dd") : ''}
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
                      <Label htmlFor="edit-recurring">Recurring</Label>
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
                      <Label htmlFor="edit-holiday-type">Holiday Type</Label>
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
                      <Label htmlFor="edit-sites">Select Sites</Label>
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
                      <Label htmlFor="edit-modules">Select Module</Label>
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