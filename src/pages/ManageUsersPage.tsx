import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Download, Users, UserCheck, UserX, Clock, MonitorSmartphone, Calendar, Filter, X } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { StatsCard } from "@/components/StatsCard";
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

// Column configuration matching the image
const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, draggable: false },
  { key: "flat", label: "Flat", sortable: true, draggable: true },
  { key: "occupancy", label: "Occupancy", sortable: true, draggable: true },
  { key: "title", label: "Title", sortable: true, draggable: true },
  { key: "name", label: "Name", sortable: true, draggable: true },
  { key: "mobileNumber", label: "Mobile Number", sortable: true, draggable: true },
  { key: "email", label: "Email", sortable: true, draggable: true },
  { key: "residentType", label: "Resident Type", sortable: true, draggable: true },
  { key: "phase", label: "Phase", sortable: true, draggable: true },
  { key: "livesHere", label: "Lives Here", sortable: true, draggable: true },
  { key: "membershipType", label: "Membership Type", sortable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, draggable: true },
  { key: "staff", label: "Staff", sortable: true, draggable: true },
  { key: "vehicle", label: "Vehicle", sortable: true, draggable: true },
  { key: "appDownloaded", label: "App Downloaded", sortable: true, draggable: true },
  { key: "alternateEmail1", label: "Alternate Email -1", sortable: true, draggable: true },
  { key: "alternateEmail2", label: "Alternate Email -2", sortable: true, draggable: true },
  { key: "alternateAddress", label: "Alternate Address", sortable: true, draggable: true },
  { key: "landlineNumber", label: "Landline Number", sortable: true, draggable: true },
  { key: "intercomNumber", label: "Intercom Number", sortable: true, draggable: true },
  { key: "gstNumber", label: "GST Number", sortable: true, draggable: true },
  { key: "panNumber", label: "PAN Number", sortable: true, draggable: true },
  { key: "clubMembership", label: "Club Membership", sortable: true, draggable: true },
  { key: "createdOn", label: "Created On", sortable: true, draggable: true },
  { key: "updatedOn", label: "Updated On", sortable: true, draggable: true },
];

// Sample data matching the images
const sampleUsers = [
  {
    id: "1",
    actions: "view",
    flat: "#<SocietyBlock:0x00007efdc8f6fa1>/11-1302",
    occupancy: "Vacant",
    title: "",
    name: "Janhavi Tawde",
    mobileNumber: "7013837542",
    email: "janhavi.runwal15@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "12/08/2024",
    updatedOn: "12/08/2024",
  },
  {
    id: "2",
    actions: "view",
    flat: "A1/A1-103",
    occupancy: "Vacant",
    title: "",
    name: "Rahul Atak",
    mobileNumber: "7507153191",
    email: "atakrahul143@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "14/09/2023",
    updatedOn: "14/09/2023",
  },
  {
    id: "3",
    actions: "view",
    flat: "A1/A1-1601",
    occupancy: "Vacant",
    title: "Mr.",
    name: "Kiran Mailaram",
    mobileNumber: "9930790213",
    email: "anjum.mailaram@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "14/09/2023",
    updatedOn: "14/09/2023",
  },
  {
    id: "4",
    actions: "view",
    flat: "A1/A1-2202",
    occupancy: "Vacant",
    title: "",
    name: "Shubham Shukla",
    mobileNumber: "7208487600",
    email: "shubham.shukla1041@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "14/09/2023",
    updatedOn: "14/09/2023",
  },
  {
    id: "5",
    actions: "view",
    flat: "A1/A1-2402",
    occupancy: "Vacant",
    title: "",
    name: "RITA SINGH",
    mobileNumber: "7860840162",
    email: "singhsaurabhjnp@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "14/09/2023",
    updatedOn: "14/09/2023",
  },
  {
    id: "6",
    actions: "view",
    flat: "A1/A1-2704",
    occupancy: "Vacant",
    title: "",
    name: "Sneha Patil",
    mobileNumber: "7021104564",
    email: "patil95435@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "25/11/2023",
    updatedOn: "25/11/2023",
  },
  {
    id: "7",
    actions: "view",
    flat: "A1/A1-2705",
    occupancy: "Vacant",
    title: "",
    name: "Shailesh Shashidharan",
    mobileNumber: "7718807758",
    email: "shylesh1234@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "14/09/2023",
    updatedOn: "14/09/2023",
  },
  {
    id: "8",
    actions: "view",
    flat: "A1/A1-505",
    occupancy: "Vacant",
    title: "Mr.",
    name: "Anand Vishwanathrao Khadilkar",
    mobileNumber: "9642706274",
    email: "anandvk@hpcl.co.in",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "14/09/2023",
    updatedOn: "14/09/2023",
  },
  {
    id: "9",
    actions: "view",
    flat: "A1/A1-902",
    occupancy: "Vacant",
    title: "Mrs.",
    name: "Priyanka Shailesh Mandal",
    mobileNumber: "9833831076",
    email: "sbalajiclothing@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "14/09/2023",
    updatedOn: "14/09/2023",
  },
  {
    id: "10",
    actions: "view",
    flat: "A2/A2-2702",
    occupancy: "Vacant",
    title: "",
    name: "Fatima Akhtar",
    mobileNumber: "9334982078",
    email: "f.a@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "13/02/2025",
    updatedOn: "13/02/2025",
  },
  {
    id: "11",
    actions: "view",
    flat: "A2/A2-2704",
    occupancy: "Vacant",
    title: "",
    name: "Dilip Sahu",
    mobileNumber: "7304540249",
    email: "dilipsahu8080@gmail.com",
    residentType: "",
    phase: "Post Sales",
    livesHere: "",
    membershipType: "Primary",
    status: "Approved",
    staff: "0",
    vehicle: "0",
    appDownloaded: "-",
    alternateEmail1: "-",
    alternateEmail2: "-",
    alternateAddress: "Na",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
    clubMembership: "No",
    createdOn: "11/11/2024",
    updatedOn: "11/11/2024",
  },
];

export const ManageUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(sampleUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [filters, setFilters] = useState({
    tower: "",
    flat: "",
    status: "",
    residentType: "",
    appDownloaded: "",
    dateRange: "",
  });

  const handleViewUser = (userId: string) => {
    navigate(`/setup/manage-users/view/${userId}`);
  };

  const handleAddUser = () => {
    navigate("/setup/manage-users/add");
    setShowActionPanel(false);
  };

  const handleImport = () => {
    console.log("Import users");
    // Handle import functionality
    setShowActionPanel(false);
  };

  const handleExport = () => {
    console.log("Export users");
    // Handle export functionality
    setShowActionPanel(false);
  };

  const handleFilters = () => {
    setShowFiltersDialog(true);
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    // Apply filter logic here
    setShowFiltersDialog(false);
  };

  const handleResetFilters = () => {
    setFilters({
      tower: "",
      flat: "",
      status: "",
      residentType: "",
      appDownloaded: "",
      dateRange: "",
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionPanel(true);
  };

  // Render cell content based on column key
  const renderCell = (user: any, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleViewUser(user.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Eye className="w-4 h-4 text-[#1A1A1A]" />
            </button>
          </div>
        );
      case "flat":
        return <span className="text-sm">{user.flat}</span>;
      case "status":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded">
            {user.status}
          </span>
        );
      default:
        return <span className="text-sm">{user[columnKey] || "-"}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">Manage Users</h1>
          </div>
        </div>

        {/* Stats Cards - First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
          <StatsCard
            title="Total Users"
            value="1406"
            icon={<Users className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
          <StatsCard
            title="Pending Users"
            value="2"
            icon={<Clock className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
          <StatsCard
            title="Approved Users"
            value="1368"
            icon={<UserCheck className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
          <StatsCard
            title="Rejected Users"
            value="36"
            icon={<UserX className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
          <StatsCard
            title="Total No. Of Downloads"
            value="656"
            icon={<MonitorSmartphone className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
        </div>

        {/* Stats Cards - Second Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          <StatsCard
            title="Total No. Of Flat Downloads"
            value="656"
            icon={<Download className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
          <StatsCard
            title="Total No. Of Owners Downloads"
            value="348"
            icon={<Download className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
          <StatsCard
            title="Total No. Of Tenants Downloads"
            value="7"
            icon={<Download className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
          <StatsCard
            title="Post Sale Downloads"
            value="188"
            icon={<Download className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
          <StatsCard
            title="Post Possession Downloads"
            value="467"
            icon={<Download className="w-6 h-6 text-[#C72030]" />}
            downloadData={[]}
          />
        </div>

        {/* Action Panel */}
        {showActionPanel && (
          <SelectionPanel
            onAdd={handleAddUser}
            onImport={handleImport}
            onExport={handleExport}
            onClearSelection={() => setShowActionPanel(false)}
            actions={[
              { label: 'Filters', icon: Filter, onClick: handleFilters }
            ]}
          />
        )}

        {/* Filters Dialog */}
        <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
          <DialogContent className="max-w-4xl bg-white">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
                <button
                  onClick={() => setShowFiltersDialog(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Select Tower */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Select Tower
                  </Label>
                  <Select
                    value={filters.tower}
                    onValueChange={(value) =>
                      setFilters({ ...filters, tower: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tower" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tower-a">Tower A</SelectItem>
                      <SelectItem value="tower-b">Tower B</SelectItem>
                      <SelectItem value="tower-c">Tower C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Flat */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Select Flat
                  </Label>
                  <Select
                    value={filters.flat}
                    onValueChange={(value) =>
                      setFilters({ ...filters, flat: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Flat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">101</SelectItem>
                      <SelectItem value="102">102</SelectItem>
                      <SelectItem value="103">103</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Select Status
                  </Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Resident Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Select Resident Type
                  </Label>
                  <Select
                    value={filters.residentType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, residentType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Resident Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* App Downloaded */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    App Downloaded
                  </Label>
                  <Select
                    value={filters.appDownloaded}
                    onValueChange={(value) =>
                      setFilters({ ...filters, appDownloaded: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="App Downloaded" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Date Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Select Date Range
                  </Label>
                  <div className="relative">
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) =>
                        setFilters({ ...filters, dateRange: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="px-8 py-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="px-8 py-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
                >
                  Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <EnhancedTable
            columns={columns}
            data={users}
            onRowClick={(user) => console.log("Row clicked:", user)}
            renderCell={renderCell}
            selectedItems={selectedUsers}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectUser}
            enableSelection={true}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search users..."
            leftActions={
              <Button
                size="sm"
                className="mr-2"
                onClick={handleActionClick}
              >
                <Plus className="w-4 h-4 mr-2" />
                Action
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};
