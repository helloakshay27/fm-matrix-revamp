import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextField } from '@mui/material';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Upload, Plus, Filter, MoreVertical, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
    key: 'holidayName',
    label: 'Holiday Name',
    sortable: true,
    hideable: false,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'recurring',
    label: 'Recurring',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'applicableLocation',
    label: 'Applicable Location',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'holidayType',
    label: 'Holiday Type',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'applicableFor',
    label: 'Applicable for',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true
  }
];

export const HolidayCalendarPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
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

    setHolidays([...holidays, newHoliday]);
    
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

  const renderCell = (holiday: Holiday, columnKey: string) => {
    switch (columnKey) {
      case 'holidayName':
        return <span className="text-gray-900 font-medium">{holiday.holidayName}</span>;
      
      case 'date':
        return <span className="text-gray-900">{holiday.date}</span>;
      
      case 'recurring':
        return (
          <span className="text-gray-900">
            {holiday.recurring ? 'Yes' : 'No'}
          </span>
        );
      
      case 'applicableLocation':
        return <span className="text-gray-900">{holiday.applicableLocation}</span>;
      
      case 'holidayType':
        return (
          <Badge 
            variant={
              holiday.holidayType === 'Public' 
                ? 'default' 
                : holiday.holidayType === 'Festival' 
                ? 'secondary' 
                : 'outline'
            }
            className="bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            {holiday.holidayType}
          </Badge>
        );
      
      case 'applicableFor':
        return <span className="text-gray-900">{holiday.applicableFor}</span>;
      
      default:
        return holiday[columnKey as keyof Holiday];
    }
  };

  const renderActions = (holiday: Holiday) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit Holiday</DropdownMenuItem>
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Holiday Calendar</h1>
        <p className="text-gray-600">Manage Holidays</p>
      </div>

      {/* Action Buttons and Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#C72030] hover:bg-[#A01020] text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Holiday
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
                            "w-full justify-start text-left font-normal",
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
                          className="w-full justify-between font-normal text-left"
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
                          className="w-full justify-start text-left font-normal"
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
                          className="w-full justify-start text-left font-normal"
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
                          className="w-full justify-start text-left font-normal"
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
          <Button 
            variant="outline" 
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
        
        {/* Search Bar with Go and Reset buttons */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search holidays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" className="bg-[#C72030] text-white hover:bg-[#A01020]">
            Go
          </Button>
          <Button variant="outline">
            Reset
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-[#D5DbDB] shadow-sm">
        <EnhancedTable
          data={holidays}
          columns={columns}
          renderCell={renderCell}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          storageKey="holiday-calendar-table"
          emptyMessage="No holidays found"
          className="min-w-full"
        />
      </div>
    </div>
  );
};