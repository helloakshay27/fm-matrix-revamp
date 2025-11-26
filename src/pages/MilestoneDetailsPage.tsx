import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ScrollText, ClipboardList, Pencil } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import EditMilestoneModal from "@/components/EditMilestoneModal";

interface MilestoneDetails {
  id?: string;
  title?: string;
  created_by?: string;
  created_on?: string;
  status?: string;
  responsible_person?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
}

interface Dependency {
  milestone_title?: string;
  status?: string;
  milestone_owner?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
}

const dependencyColumns: ColumnConfig[] = [
  {
    key: "milestone_title",
    label: "Milestone Title",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "milestone_owner",
    label: "Milestone Owner",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "start_date",
    label: "Start Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "end_date",
    label: "End Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "duration",
    label: "Duration",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const MilestoneDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [milestoneDetails, setMilestoneDetails] = useState<MilestoneDetails>({});
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  // Mock owners data - TODO: Replace with actual API call
  const mockOwners = [
    { id: "1", full_name: "Sadanand Gupta" },
    { id: "2", full_name: "John Doe" },
    { id: "3", full_name: "Jane Smith" },
    { id: "4", full_name: "Mike Johnson" },
    { id: "5", full_name: "Sarah Williams" },
  ];

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API call when available
      // const response = await dispatch(getMilestoneById({ baseUrl, token, id })).unwrap();
      // setMilestoneDetails(response);
      // setDependencies(response.dependencies || []);

      // Mock data matching screenshot
      setMilestoneDetails({
        id: "M-0181",
        title: "PP 2",
        created_by: "Deepak Yadav",
        created_on: "24/11/2025 04:39 PM",
        status: "Open",
        responsible_person: "Sadanand Gupta",
        duration: "3d 7h 29m 16s",
        start_date: "2025-11-24",
        end_date: "2025-11-28",
      });

      setDependencies([
        // Empty for now - matching screenshot shows "Add Milestone title"
        {
          milestone_title: "Sprint Planning",
          status: "Open",
          milestone_owner: "John Doe",
          start_date: "2025-11-20",
          end_date: "2025-11-25",
          duration: "5d 0h 0m 0s",
        },
        {
          milestone_title: "Development Phase",
          status: "Active",
          milestone_owner: "Jane Smith",
          start_date: "2025-11-21",
          end_date: "2025-12-05",
          duration: "14d 0h 0m 0s",
        },
        {
          milestone_title: "Testing & QA",
          status: "Overdue",
          milestone_owner: "Mike Johnson",
          start_date: "2025-11-15",
          end_date: "2025-11-22",
          duration: "7d 0h 0m 0s",
        },
        {
          milestone_title: "Deployment",
          status: "Completed",
          milestone_owner: "Sarah Williams",
          start_date: "2025-11-10",
          end_date: "2025-11-12",
          duration: "2d 0h 0m 0s",
        },
      ]);
    } catch (error) {
      console.error("Error fetching milestone details:", error);
      toast.error(String(error) || "Failed to fetch milestone details");
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderDependencyCell = (item: any, columnKey: string) => {
    if (columnKey === "status") {
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            item.status
          )}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              item.status?.toLowerCase() === "open"
                ? "bg-red-500"
                : item.status?.toLowerCase() === "active"
                ? "bg-green-500"
                : item.status?.toLowerCase() === "overdue"
                ? "bg-red-500"
                : item.status?.toLowerCase() === "completed"
                ? "bg-gray-500"
                : "bg-gray-400"
            }`}
          ></span>
          {item.status}
        </span>
      );
    }
    return item[columnKey] || "-";
  };

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-2 p-0"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {milestoneDetails.id} {milestoneDetails.title}
        </h1>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Created By:</span> {milestoneDetails.created_by}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Created On:</span> {milestoneDetails.created_on}
          </div>
          <Button
            size="sm"
            className={`${getStatusColor(milestoneDetails.status || "")} border-none`}
          >
            {milestoneDetails.status}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Responsible Person:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{milestoneDetails.responsible_person || "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Duration:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{milestoneDetails.duration || "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Start Date:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{milestoneDetails.start_date || "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">End Date:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{milestoneDetails.end_date || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dependency Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Dependency</h3>
        </div>
        <div className="overflow-x-auto mt-4">
          {dependencies.length === 0 ? (
            <div className="text-sm text-gray-400 py-4">Add Milestone title</div>
          ) : (
            <EnhancedTable
              data={dependencies}
              columns={dependencyColumns}
              storageKey="milestone-dependencies-table"
              hideColumnsButton={true}
              hideTableExport={true}
              hideTableSearch={true}
              exportFileName="milestone-dependencies"
              pagination={true}
              pageSize={10}
              emptyMessage="No dependencies available"
              className="min-w-[1200px] h-max"
              renderCell={renderDependencyCell}
            />
          )}
        </div>
      </div>

      {/* Edit Milestone Modal */}
      <EditMilestoneModal
        openDialog={editModalOpen}
        handleCloseDialog={() => setEditModalOpen(false)}
        owners={mockOwners}
        milestoneData={milestoneDetails}
        onUpdate={fetchData}
      />
    </div>
  );
};

export default MilestoneDetailsPage;
