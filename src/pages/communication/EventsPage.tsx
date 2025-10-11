import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Eye, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Column configuration
const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, draggable: false },
  { key: "title", label: "Title", sortable: true, draggable: true },
  { key: "flat", label: "Flat", sortable: true, draggable: true },
  { key: "createdBy", label: "Created By", sortable: true, draggable: true },
  { key: "startDate", label: "Start Date", sortable: true, draggable: true },
  { key: "endDate", label: "End Date", sortable: true, draggable: true },
  { key: "eventType", label: "Event Type", sortable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, draggable: true },
  { key: "expired", label: "Expired", sortable: true, draggable: true },
  { key: "createdOn", label: "Created On", sortable: true, draggable: true },
  { key: "attachments", label: "Attachments", sortable: true, draggable: true },
];

// Sample data from the image
const sampleEvents = [
  {
    id: "1",
    title: "Gudi Padwa Celebration",
    flat: "FM-Office",
    createdBy: "FM Helpdesk",
    startDate: "18/ 03/2023 8: 30 PM",
    endDate: "19/03/ 2023 8: 30 PM",
    eventType: "Personal",
    status: "Published",
    expired: "Expired",
    createdOn: "18/03/2023",
    attachments: "🔗",
  },
  {
    id: "2",
    title: "Gudi Padwa Celebration",
    flat: "FM-Office",
    createdBy: "FM Helpdesk",
    startDate: "18/ 03/2023 5: 30 PM",
    endDate: "19/03/ 2023 12: 00 AM",
    eventType: "Personal",
    status: "Published",
    expired: "Expired",
    createdOn: "18/03/2023",
    attachments: "🔗",
  },
  {
    id: "3",
    title: "Gudi Padwa Celebration",
    flat: "FM-Office",
    createdBy: "FM Helpdesk",
    startDate: "18/ 03/2023 5: 15 PM",
    endDate: "19/03/ 2023 12: 00 AM",
    eventType: "Personal",
    status: "Published",
    expired: "Expired",
    createdOn: "18/03/2023",
    attachments: "🔗",
  },
  {
    id: "4",
    title: "Gudi Padwa Celebration",
    flat: "FM-Office",
    createdBy: "FM Helpdesk",
    startDate: "18/ 03/2023 3: 15 PM",
    endDate: "19/03/ 2023 12: 00 AM",
    eventType: "Personal",
    status: "Published",
    expired: "Expired",
    createdOn: "18/03/2023",
    attachments: "🔗",
  },
  {
    id: "5",
    title: "Possession",
    flat: "FM-Office",
    createdBy: "RunwalGardens",
    startDate: "15/ 12/2022 11: 00 AM",
    endDate: "15/12/ 2022 6: 00 PM",
    eventType: "General",
    status: "Published",
    expired: "Expired",
    createdOn: "28/12/2022",
    attachments: "🔗",
  },
  {
    id: "6",
    title: "Navratri Event",
    flat: "FM-Office",
    createdBy: "RunwalGardens",
    startDate: "30/ 09/2022 5: 00 PM",
    endDate: "30/09/ 2022 9: 00 PM",
    eventType: "General",
    status: "Disabled",
    expired: "Expired",
    createdOn: "14/11/2022",
    attachments: "🔗",
  },
];

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(sampleEvents);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    eventType: '',
    flat: '',
    dateRange: '',
    status: '',
  });

  const handleAddEvent = () => {
    navigate('/communication/events/add');
  };

  const handleViewEvent = (id: string) => {
    navigate(`/communication/events/view/${id}`);
  };

  const handleFilters = () => {
    setShowFiltersDialog(true);
  };

  const handleResetFilters = () => {
    setFilters({
      eventType: '',
      flat: '',
      dateRange: '',
      status: '',
    });
    toast.success("Filters reset");
  };

  const handleApplyFilters = () => {
    // Here you would filter the events based on the selected filters
    toast.success("Filters applied successfully!");
    setShowFiltersDialog(false);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Render functions
  const renderCell = (row: any, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewEvent(row.id)}
            className="p-2 hover:bg-gray-100"
          >
            <Eye className="w-4 h-4 text-[#6B7280]" />
          </Button>
        );
      case "eventType":
        return (
          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded ${
            row.eventType === "Personal" 
              ? "bg-blue-100 text-blue-700" 
              : "bg-green-100 text-green-700"
          }`}>
            {row.eventType}
          </span>
        );
      case "status":
        return (
          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded ${
            row.status === "Published" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {row.status}
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
            {row.expired}
          </span>
        );
      case "attachments":
        return (
          <span className="text-blue-500 cursor-pointer hover:text-blue-700 text-lg">
            {row.attachments}
          </span>
        );
      default:
        return <span className="text-sm text-[#1A1A1A]">{row[columnKey]}</span>;
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="p-6">
        <EnhancedTable
          data={events}
          columns={columns}
          renderCell={renderCell}
          storageKey="events-table"
          searchPlaceholder="Search events..."
          enableExport={true}
          exportFileName="events"
          pagination={true}
          pageSize={10}
          leftActions={
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleAddEvent}
                className="bg-[#1C3C6D] hover:bg-[#152d52] text-white px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
              <Button
                onClick={handleFilters}
                className="bg-[#1C3C6D] hover:bg-[#152d52] text-white px-4 py-2"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          }
        />
      </div>

      {/* Filters Dialog */}
      <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Filters</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFiltersDialog(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-4 gap-4 py-4">
            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                value={filters.eventType}
                onValueChange={(value) => handleFilterChange('eventType', value)}
              >
                <SelectTrigger id="eventType">
                  <SelectValue placeholder="Select Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Flat */}
            <div className="space-y-2">
              <Label htmlFor="flat">Select Flat</Label>
              <Select
                value={filters.flat}
                onValueChange={(value) => handleFilterChange('flat', value)}
              >
                <SelectTrigger id="flat">
                  <SelectValue placeholder="Select Flat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a101">A-101</SelectItem>
                  <SelectItem value="a102">A-102</SelectItem>
                  <SelectItem value="b201">B-201</SelectItem>
                  <SelectItem value="b202">B-202</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label htmlFor="dateRange">Select Date Range</Label>
              <div className="relative">
                <Input
                  id="dateRange"
                  type="date"
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Select Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Select Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="px-4 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-[#1C3C6D] hover:bg-[#152d52]"
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;
