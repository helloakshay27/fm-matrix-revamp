import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { CalendarDays, Plus, Eye, Edit, Trash2 } from 'lucide-react';
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

const mockHolidays: Holiday[] = [
  {
    id: '1',
    holidayName: 'Republic Day',
    date: '26 January 2025',
    recurring: true,
    applicableLocation: 'Location 1-4',
    holidayType: 'Public',
    applicableFor: 'FM'
  },
  {
    id: '2',
    holidayName: 'Maha Shivratri',
    date: '26 February 2025',
    recurring: false,
    applicableLocation: 'Location 1-4',
    holidayType: 'Festival',
    applicableFor: 'Customers'
  },
  {
    id: '3',
    holidayName: 'Holi',
    date: '14 March 2025',
    recurring: false,
    applicableLocation: 'Location 1-4',
    holidayType: 'Maintenance',
    applicableFor: 'FM'
  },
  {
    id: '4',
    holidayName: 'Mahashivratri Day/Labour Day',
    date: '1 May 2025',
    recurring: true,
    applicableLocation: 'Location 1-4',
    holidayType: 'Public',
    applicableFor: 'FM'
  },
  {
    id: '5',
    holidayName: 'Independence Day',
    date: '15 August 2025',
    recurring: true,
    applicableLocation: 'Location 1-4',
    holidayType: 'Festival',
    applicableFor: 'Customers'
  }
];

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
    key: 'status',
    label: 'Status',
    sortable: true,
    hideable: true,
    draggable: true
  }
];

export const HolidayCalendarPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [holidayName, setHolidayName] = useState('');
  const [recurring, setRecurring] = useState<string>('');
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [sitesDropdownOpen, setSitesDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [customersDropdownOpen, setCustomersDropdownOpen] = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Site options
  const siteOptions = [
    'Sai Radha, Bund Garden',
    'Pentagon Mangarpeta',
    'Westport,Baner',
    'Peninsula Corporate Park, Lower Parel',
    'Concord, Bund Garden',
    'Namdev Prob2, Balewaadi',
    'Astrocity Viman Nagar'
  ];

  // Customer type options
  const customerOptions = [
    'Tickets',
    'Checklist', 
    'Booking',
    'Parking'
  ];

  // Pagination calculations
  const totalRecords = holidays.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentHolidays = holidays.slice(startIndex, endIndex);

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

  const handleSiteChange = (site: string, checked: boolean) => {
    if (checked) {
      setSelectedSites([...selectedSites, site]);
    } else {
      setSelectedSites(selectedSites.filter(s => s !== site));
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
      setSelectedSites(siteOptions);
    } else {
      setSelectedSites([]);
    }
  };

  const handleSubmit = () => {
    if (!holidayName || !date || !recurring || selectedSites.length === 0 || !selectedType || selectedCustomers.length === 0) {
      alert('Please fill all fields');
      return;
    }

    const newHoliday: Holiday = {
      id: String(holidays.length + 1),
      holidayName,
      date: format(date, "dd MMMM yyyy"),
      recurring: recurring === "yes",
      applicableLocation: selectedSites.join(', '),
      holidayType: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
      applicableFor: selectedCustomers.join(', ')
    };

    const updatedHolidays = [...holidays, newHoliday];
    setHolidays(updatedHolidays);
    
    // Reset form
    setHolidayName('');
    setDate(undefined);
    setRecurring('');
    setSelectedSites([]);
    setSelectedType('');
    setSelectedCustomers([]);
    setIsAddDialogOpen(false);
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

  const handleEdit = (id: string) => {
    console.log('Edit holiday:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete holiday:', id);
  };

  // Render row function for enhanced task table
  const renderRow = (holiday: Holiday) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleView(holiday.id)} 
          className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleEdit(holiday.id)} 
          className="p-1 text-green-600 hover:bg-green-50 rounded" 
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleDelete(holiday.id)} 
          className="p-1 text-red-600 hover:bg-red-50 rounded" 
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                          {selectedSites.length > 0 ? `${selectedSites.length} selected` : "Select sites"}
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
                          {siteOptions.map((site) => (
                            <div key={site} className="flex items-center space-x-2 mb-1">
                              <Checkbox
                                id={site}
                                checked={selectedSites.includes(site)}
                                onCheckedChange={(checked) => handleSiteChange(site, checked as boolean)}
                              />
                              <Label htmlFor={site} className="text-sm">{site}</Label>
                            </div>
                          ))}
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
                          {selectedCustomers.length > 0 ? `${selectedCustomers.length} selected` : "Select customers"}
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
                              <Label htmlFor={customer} className="text-sm">{customer}</Label>
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
                >
                  Add Holiday
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />

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