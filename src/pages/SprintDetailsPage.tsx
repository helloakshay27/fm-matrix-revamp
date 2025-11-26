import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, ScrollText, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface SprintDetails {
  id?: string;
  title?: string;
  created_by?: string;
  created_on?: string;
  status?: string;
  responsible_person?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
}

interface Task {
  task_title?: string;
  status?: string;
  responsible_person?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  priority?: string;
}

const taskColumns: ColumnConfig[] = [
  {
    key: "task_title",
    label: "Task Title",
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
    key: "responsible_person",
    label: "Responsible Person",
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
  {
    key: "priority",
    label: "Priority",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const SprintDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [sprintDetails, setSprintDetails] = useState<SprintDetails>({});
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API call when available
      // const response = await dispatch(getSprintById({ baseUrl, token, id })).unwrap();
      // setSprintDetails(response);
      // setTasks(response.tasks || []);

      // Mock data for now
      setSprintDetails({
        id: "S-78",
        title: "test 333",
        created_by: "Tejas Chaudhary",
        created_on: "11/04/2025, 5:55 PM",
        status: "Active",
        responsible_person: "Test User Name",
        priority: "",
        start_date: "2025-11-04",
        end_date: "2025-11-04",
      });

      setTasks([
        {
          task_title: "Import Test 3",
          status: "Open",
          responsible_person: "Ubaid Hashmat",
          start_date: "21 Nov 2025",
          end_date: "12 Dec 2025",
          duration: "17d 7h 49m 2s",
          priority: "High",
        },
        {
          task_title: "New Task",
          status: "Overdue",
          responsible_person: "Jihan",
          start_date: "03 Jul 2025",
          end_date: "03 Jul 2025",
          duration: "0s",
          priority: "High",
        },
        {
          task_title: "TEST_Task",
          status: "Open",
          responsible_person: "External",
          start_date: "20 Nov 2025",
          end_date: "12 Dec 2025",
          duration: "17d 7h 49m 2s",
          priority: "High",
        },
        {
          task_title: "Bill Process",
          status: "Overdue",
          responsible_person: "Deepak Yadav",
          start_date: "04 Jul 2025",
          end_date: "16 Jul 2025",
          duration: "0s",
          priority: "High",
        },
        {
          task_title: "Payslip",
          status: "Overdue",
          responsible_person: "Deepak Yadav",
          start_date: "04 Jul 2025",
          end_date: "12 Jul 2025",
          duration: "0s",
          priority: "High",
        },
        {
          task_title: "test",
          status: "Overdue",
          responsible_person: "Ubaid Hashmat",
          start_date: "21 Nov 2025",
          end_date: "24 Nov 2025",
          duration: "0s",
          priority: "Medium",
        },
      ]);
    } catch (error) {
      console.error("Error fetching sprint details:", error);
      toast.error(String(error) || "Failed to fetch sprint details");
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "open":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderTaskCell = (item: any, columnKey: string) => {
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
                ? "bg-blue-500"
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
          {sprintDetails.id} {sprintDetails.title}
        </h1>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Created By:</span> {sprintDetails.created_by}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Created On:</span> {sprintDetails.created_on}
          </div>
          <Button
            size="sm"
            className={`${getStatusColor(sprintDetails.status || "")} border-none`}
          >
            {sprintDetails.status}
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
              <p className="text-sm text-gray-900">{sprintDetails.responsible_person || "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Priority:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{sprintDetails.priority || "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Start Date:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{sprintDetails.start_date || "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">End Date:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{sprintDetails.end_date || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Tasks</h3>
        </div>
        <div className="overflow-x-auto mt-4">
          <EnhancedTable
            data={tasks}
            columns={taskColumns}
            storageKey="sprint-tasks-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="sprint-tasks"
            pagination={true}
            pageSize={10}
            emptyMessage="No tasks available"
            className="min-w-[1200px] h-max"
            renderCell={renderTaskCell}
          />
        </div>
      </div>
    </div>
  );
};

export default SprintDetailsPage;
