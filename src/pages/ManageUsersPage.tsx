import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Download, Users, UserCheck, UserX, Clock, MonitorSmartphone } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { StatsCard } from "@/components/StatsCard";

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
  const [searchTerm, setSearchTerm] = useState("");

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
          <div className="flex items-center gap-2">
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
          />
        )}

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
