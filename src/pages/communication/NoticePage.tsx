import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
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
import { toast } from "sonner";

// Column configuration matching the image
const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, draggable: false },
  { key: "title", label: "Title", sortable: true, draggable: true },
  { key: "flat", label: "Flat", sortable: true, draggable: true },
  { key: "type", label: "Type", sortable: true, draggable: true },
  { key: "createdBy", label: "Created By", sortable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, draggable: true },
  { key: "important", label: "Important", sortable: true, draggable: true },
  { key: "emailSent", label: "Email Sent", sortable: true, draggable: true },
  { key: "expiryStatus", label: "Expiry Status", sortable: true, draggable: true },
  { key: "createdOn", label: "Created On", sortable: true, draggable: true },
  { key: "attachments", label: "Attachments", sortable: false, draggable: true },
];

// Sample data matching the image
const sampleNotices = [
  {
    id: "1",
    title: "Water Supply Interruption T14 03 Series",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "No",
    expiryStatus: "Expired",
    createdOn: "03/10/2025",
    attachments: "",
  },
  {
    id: "2",
    title: "PRV Installation In 5 Series Flats, Tower 13 -- 04-10-2025",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "Yes",
    expiryStatus: "Expired",
    createdOn: "03/10/2025",
    attachments: "",
  },
  {
    id: "3",
    title: "FM Office And Fit Out Will Remain Closed Tomorrow Being National Holiday.",
    flat: "FM-Office",
    type: "General",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "Yes",
    expiryStatus: "Expired",
    createdOn: "01/10/2025",
    attachments: "",
  },
  {
    id: "4",
    title: "Tower 13 - Electrical Power Supply Shutdown",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "No",
    expiryStatus: "Expired",
    createdOn: "29/09/2025",
    attachments: "",
  },
  {
    id: "5",
    title: "Tower 14 - Electrical Power Supply Shutdown",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "No",
    expiryStatus: "Expired",
    createdOn: "29/09/2025",
    attachments: "",
  },
  {
    id: "6",
    title: "O2 Series Kitchen Valve Repairing Work Tomorrow From 10.30 Am To 4 Pm",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "No",
    emailSent: "No",
    expiryStatus: "Expired",
    createdOn: "29/09/2025",
    attachments: "",
  },
  {
    id: "7",
    title: "Removal Of Honey Bee Hive In Tower 16",
    flat: "FM-Office",
    type: "General",
    createdBy: "Pravin Desai",
    status: "Published",
    important: "No",
    emailSent: "No",
    expiryStatus: "Expired",
    createdOn: "23/09/2025",
    attachments: "",
  },
  {
    id: "8",
    title: "MSEB Power Supply Interruption View Meter Installation Of Tower 17 ,21,And 23 Tomorrow 24 Sept 2025 From 2pm To 5 Pm",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "Yes",
    expiryStatus: "Expired",
    createdOn: "23/09/2025",
    attachments: "",
  },
  {
    id: "9",
    title: "Scheduled Lift Maintenance For Tower 15",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "Yes",
    expiryStatus: "Expired",
    createdOn: "23/09/2025",
    attachments: "",
  },
  {
    id: "10",
    title: "Tower-26 LIFT PLANNED MAINTENANCE ACTIVITY",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "Yes",
    expiryStatus: "Expired",
    createdOn: "18/09/2025",
    attachments: "",
  },
  {
    id: "11",
    title: "PRV Installation In 2 & 6 Series Flats, Tower 14",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "Yes",
    expiryStatus: "Expired",
    createdOn: "15/09/2025",
    attachments: "",
  },
  {
    id: "12",
    title: "PRV Installation In 2 & 6 Series Flats, Tower 14",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "Yes",
    expiryStatus: "Expired",
    createdOn: "15/09/2025",
    attachments: "",
  },
  {
    id: "13",
    title: "PRV Installation In 8 Series Flats, Tower 14",
    flat: "FM-Office",
    type: "Personal",
    createdBy: "FM Helpdesk",
    status: "Published",
    important: "Yes",
    emailSent: "Yes",
    expiryStatus: "Expired",
    createdOn: "12/09/2025",
    attachments: "",
  },
];

const NoticePage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState(sampleNotices);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    flat: '',
    noticeType: '',
    dateRange: '',
    status: '',
  });

  // Handler functions
  const handleAddNotice = () => {
    navigate('/communication/notice/add');
  };

  const handleFilters = () => {
    setShowFiltersDialog(true);
  };

  const handleResetFilters = () => {
    setFilters({
      flat: '',
      noticeType: '',
      dateRange: '',
      status: '',
    });
    toast.success("Filters reset");
  };

  const handleApplyFilters = () => {
    // Here you would filter the notices based on the selected filters
    toast.success("Filters applied successfully!");
    setShowFiltersDialog(false);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleViewNotice = (id: string) => {
    navigate(`/communication/notice/view/${id}`);
  };

  // Render functions
  const renderCell = (row: any, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewNotice(row.id)}
            className="p-2 hover:bg-gray-100"
          >
            <Eye className="w-4 h-4 text-[#6B7280]" />
          </Button>
        );
      default:
        return <span className="text-sm text-[#1A1A1A]">{row[columnKey]}</span>;
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="p-6">
        <EnhancedTable
          data={notices}
          columns={columns}
          enableSearch={true}
          enableSelection={false}
          pagination={true}
          pageSize={15}
          searchPlaceholder="Search"
          renderCell={renderCell}
          leftActions={
            <div className="flex items-center gap-3">
              <Button
                onClick={handleAddNotice}
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

      {/* Filters Dialog */}
      <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
        <DialogContent className="max-w-7xl z-[100]">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-semibold">Filters</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFiltersDialog(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Filter Options Grid */}
            <div className="grid grid-cols-5 gap-4">
              {/* Select Flat */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Flat</Label>
                <Select
                  value={filters.flat}
                  onValueChange={(value) => handleFilterChange('flat', value)}
                >
                  <SelectTrigger className="w-full border-gray-300">
                    <SelectValue placeholder="Select Flat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fm-office">FM-Office</SelectItem>
                    <SelectItem value="fm-101">FM-101</SelectItem>
                    <SelectItem value="fm-102">FM-102</SelectItem>
                    <SelectItem value="fm-103">FM-103</SelectItem>
                    <SelectItem value="all">All Flats</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select Notice Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Notice Type</Label>
                <Select
                  value={filters.noticeType}
                  onValueChange={(value) => handleFilterChange('noticeType', value)}
                >
                  <SelectTrigger className="w-full border-gray-300">
                    <SelectValue placeholder="Select Notice Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select Date Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Date Range</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full border-gray-300 pr-10"
                    placeholder="Select Date Range"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Select Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger className="w-full border-gray-300">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons Column */}
              <div className="flex items-end gap-2">
                <Button
                  onClick={handleApplyFilters}
                  className="bg-[#1C3C6D] hover:bg-[#152d52] text-white flex-1"
                >
                  Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="border-gray-300 hover:bg-gray-50 flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default NoticePage;
