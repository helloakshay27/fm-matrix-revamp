import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ScrollText, ClipboardList, Pencil } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import EditMilestoneModal from "@/components/EditMilestoneModal";
import { useAppDispatch } from "@/store/hooks";
import { fetchDependentMilestones, fetchMilestoneById, updateMilestoneStatus } from "@/store/slices/projectMilestoneSlice";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { format } from "date-fns";

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

const milestoneStatuses = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold", label: "On Hold" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

export const MilestoneDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mid } = useParams<{ mid: string }>();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [status, setStatus] = useState("open")
  const [milestoneDetails, setMilestoneDetails] = useState({});
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [owners, setOwners] = useState([])

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchMilestoneById({ baseUrl, token, id: mid })).unwrap();
      setMilestoneDetails(response);
      setStatus(response.status || "open")
    } catch (error) {
      console.error("Error fetching milestone details:", error);
      toast.error(String(error) || "Failed to fetch milestone details");
    }
  };

  const getDependencies = async () => {
    try {
      const response = await dispatch(fetchDependentMilestones({ baseUrl, token, id: mid })).unwrap();
      setDependencies(response);
    } catch (error) {
      console.error("Error fetching dependencies:", error);
      toast.error(String(error) || "Failed to fetch dependencies");
    }
  }

  const getOwners = async () => {
    try {
      const response = await dispatch(fetchFMUsers()).unwrap();
      setOwners(response.users);
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchData();
    getOwners();
    getDependencies();
  }, [])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-red-100 text-red-800";
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
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status?.toLowerCase() === "open"
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
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold">
            {milestoneDetails.id} {milestoneDetails.title}
          </h1>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Created By:</span> {milestoneDetails.created_by_name} ({milestoneDetails.created_at ? format(milestoneDetails.created_at, "dd/MM/yyyy") : "-"})
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Button
            size="sm"
            className={`${getStatusColor(milestoneDetails.status || "")} border-none`}
          >
            {milestoneDetails?.status?.charAt(0).toUpperCase() + milestoneDetails?.status?.slice(1)}
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
        <div className="flex items-center gap-3 pb-6">
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
              <p className="text-sm text-gray-900">{milestoneDetails.owner_name || "-"}</p>
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
              <p className="text-sm text-gray-900">{(milestoneDetails.start_date) ? format(milestoneDetails.start_date, "dd/MM/yyyy") : "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">End Date:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{(milestoneDetails.end_date) ? format(milestoneDetails.end_date, "dd/MM/yyyy") : "-"}</p>
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
        owners={owners}
        milestoneData={milestoneDetails}
        onUpdate={fetchData}
      />
    </div>
  );
};

export default MilestoneDetailsPage;
