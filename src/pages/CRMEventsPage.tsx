import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// Sample events data
const eventsData = [
  {
    id: 1,
    title: 'Test Event',
    unit: '',
    createdBy: 'GodrejLiving',
    startDate: '08/04/2024 11:00 AM',
    endDate: '09/04/2024 12:00 PM',
    eventType: 'General',
    status: 'Published',
    expired: true,
    attachments: '',
    createdOn: '08/04/2024',
  },
];

export const CRMEventsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [filters, setFilters] = useState({
    unit: '',
    dateRange: undefined,
    status: '',
  });
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  // Define columns for EnhancedTable
  const columns = [
    { key: 'title', label: 'Title', sortable: true, defaultVisible: true },
    { key: 'unit', label: 'Unit', sortable: true, defaultVisible: true },
    { key: 'createdBy', label: 'Created By', sortable: true, defaultVisible: true },
    { key: 'startDate', label: 'Start Date', sortable: true, defaultVisible: true },
    { key: 'endDate', label: 'End Date', sortable: true, defaultVisible: true },
    { key: 'eventType', label: 'Event Type', sortable: true, defaultVisible: true },
    { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
    { key: 'expired', label: 'Expired', sortable: true, defaultVisible: true },
    { key: 'attachments', label: 'Attachments', sortable: true, defaultVisible: true },
    { key: 'createdOn', label: 'Created On', sortable: true, defaultVisible: true },
  ];

  // Handle event selection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEvents(eventsData.map(event => event.id.toString()));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    setSelectedEvents(prev =>
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  // Handle view event
  const handleViewEvent = (event) => {
    navigate(`/crm/events/details/${event.id}`);
  };

  // Handle add event
  const handleAddEvent = () => {
    navigate('/crm/events/add');
  };

  // Handle filter dialog
  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleApplyFilters = () => {
    // Apply filter logic here if needed
    setOpenFilterDialog(false);
  };

  const handleResetFilters = () => {
    setFilters({
      unit: '',
      dateRange: undefined,
      status: '',
    });
  };

  // Render cell content
  const renderCell = (item, columnKey) => {
    if (columnKey === 'status') {
      return (
        <Badge className="bg-green-600 text-white">{item.status}</Badge>
      );
    }
    if (columnKey === 'eventType') {
      return (
        <Badge className="bg-green-600 text-white">{item.eventType}</Badge>
      );
    }
    if (columnKey === 'expired') {
      return item.expired ? (
        <Badge className="bg-red-600 text-white">Expired</Badge>
      ) : null;
    }
    return item[columnKey];
  };

  // Render actions
  const renderActions = (item) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-blue-600"
      onClick={() => handleViewEvent(item)}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );

  // Filter events based on search term
  const filteredEvents = eventsData.filter(
    event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Event List</h1>
      </div>

      {/* Filter Dialog */}
      <Dialog open={openFilterDialog} onClose={handleCloseFilterDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Filter Events</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-4">
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select
                value={filters.unit}
                onChange={(e) => setFilters(prev => ({ ...prev, unit: e.target.value }))}
                label="Unit"
              >
                <MenuItem value="">Select Unit</MenuItem>
                <MenuItem value="unit1">Unit 1</MenuItem>
                <MenuItem value="unit2">Unit 2</MenuItem>
                <MenuItem value="unit3">Unit 3</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal border-gray-300',
                      !filters.dateRange && 'text-gray-400'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange ? format(filters.dateRange, 'MM/dd/yyyy') : 'Select Date Range'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange}
                    onSelect={date => setFilters(prev => ({ ...prev, dateRange: date }))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters} color="secondary">
            Reset
          </Button>
          <Button onClick={handleApplyFilters} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Table */}
      <EnhancedTable
        data={filteredEvents}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        onRowClick={handleViewEvent}
        storageKey="crm-events-table"
        selectable={true}
        selectedItems={selectedEvents}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={item => item.id.toString()}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search events..."
        enableExport={true}
        exportFileName="events"
        pagination={true}
        pageSize={4}
        enableSearch={true}
        enableSelection={true}
        leftActions={
          <Button
            onClick={handleAddEvent}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        }
        onFilterClick={handleOpenFilterDialog}
      />
    </div>
  );
};