import { useEffect, useState, forwardRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ScrollText, X } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useAppDispatch } from "@/store/hooks";
import { fetchProjectTasksById } from "@/store/slices/projectTasksSlice";
import ProjectTaskEditModal from "@/components/ProjectTaskEditModal";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface TaskDetails {
  id?: string;
  title?: string;
  description?: string;
  created_by?: string;
  created_on?: string;
  status?: string;
  responsible_person_name?: string;
  priority?: string;
  expected_start_date?: string;
  target_date?: string;
  allocation_date?: string;
  estimated_hour?: number;
  project_title?: string;
  milestone_title?: string;
  observers?: Array<{ user_name: string }>;
  task_tags?: Array<{ company_tag?: { name: string }; name?: string }>;
  workflow_status?: string;
}

interface Subtask {
  id?: string;
  subtask_title?: string;
  status?: string;
  responsible_person?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  priority?: string;
  tags?: string;
}

const subtaskColumns: ColumnConfig[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "subtask_title",
    label: "Subtask Title",
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
  {
    key: "tags",
    label: "Tags",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const ProjectTaskDetails = () => {
  const navigate = useNavigate();
  const { id, mid, taskId } = useParams<{ id: string; mid: string; taskId: string }>();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [taskDetails, setTaskDetails] = useState<TaskDetails>({});
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [activeTab, setActiveTab] = useState("subtasks");
  const [openEditModal, setOpenEditModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchProjectTasksById({ baseUrl, token, id: taskId })).unwrap();
      setTaskDetails({
        ...response,
        created_by: "System", // You can get this from response if available
        created_on: new Date().toLocaleString(), // You can get this from response if available
        workflow_status: response.status || "Open",
      });
      // TODO: Fetch subtasks from API
      setSubtasks([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load task details";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  function formatToDDMMYYYY(dateString: string) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderSubtaskCell = (item: Subtask, columnKey: string) => {
    if (columnKey === "status") {
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            item.status || ""
          )}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status?.toLowerCase() === "open"
              ? "bg-red-500"
              : item.status?.toLowerCase() === "in_progress"
                ? "bg-blue-500"
                : item.status?.toLowerCase() === "completed"
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
          ></span>
          {item.status}
        </span>
      );
    }
    return item[columnKey as keyof Subtask] || "-";
  };

  const tabs = [
    { id: "subtasks", label: "Subtasks" },
    { id: "dependency", label: "Dependency" },
    { id: "comments", label: "Comments" },
    { id: "attachments", label: "Attachments" },
    { id: "project_drive", label: "Project Drive" },
    { id: "activity_log", label: "Activity Log" },
    { id: "workflow_status_log", label: "Workflow Status Log" },
  ];

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    // Refresh task details after edit
    fetchData();
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
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold">
          T-{taskDetails.id} {taskDetails.title}
        </h1>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Created By:</span> {taskDetails.created_by}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Created On:</span> {taskDetails.created_on}
          </div>
          <Button
            size="sm"
            className={`${getStatusColor(taskDetails.status || "")} border-none hover:opacity-80`}
          >
            {taskDetails.status}
          </Button>
          <Button
            size="sm"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleOpenEditModal}
          >
            Edit Task
          </Button>
          <Button
            size="sm"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Add Subtask
          </Button>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Description</h3>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-900">{taskDetails.description || taskDetails.title || "-"}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <ScrollText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Responsible Person:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{taskDetails.responsible_person_name || "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Priority:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{taskDetails.priority || "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Start Date:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{formatToDDMMYYYY(taskDetails.expected_start_date || "")}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">MileStones:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{taskDetails.milestone_title || "-"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">End Date:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{formatToDDMMYYYY(taskDetails.target_date || "")}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Tags:</p>
            </div>
            <div className="flex-1">
              <div className="flex gap-2 flex-wrap">
                {taskDetails.task_tags && taskDetails.task_tags.length > 0 ? (
                  taskDetails.task_tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700"
                    >
                      {tag?.company_tag?.name || tag.name || "Unknown"}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-900">-</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Duration:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{taskDetails.estimated_hour || 0} hours</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Observer:</p>
            </div>
            <div className="flex-1">
              {taskDetails.observers && taskDetails.observers.length > 0 ? (
                <div className="flex gap-2">
                  {taskDetails.observers.map((observer, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-full flex items-center justify-center bg-[#C72030] text-white text-sm font-medium">
                      {observer?.user_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-900">-</p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Time Left:</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Not started</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-[200px]">
              <p className="text-sm font-medium text-gray-600">Workflow Status:</p>
            </div>
            <div className="flex-1">
              <Select defaultValue={taskDetails.workflow_status?.toLowerCase()}>
                <SelectTrigger className="w-[180px] h-9 bg-[#C72030] text-white border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-[#C72030] text-[#C72030]"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Subtasks Tab */}
          {activeTab === "subtasks" && (
            <div className="overflow-x-auto">
              <EnhancedTable
                data={subtasks}
                columns={subtaskColumns}
                storageKey="task-subtasks-table"
                hideColumnsButton={true}
                hideTableExport={true}
                hideTableSearch={true}
                exportFileName="task-subtasks"
                pagination={true}
                pageSize={10}
                emptyMessage="No Subtask"
                className="min-w-[1200px] h-max"
                renderCell={renderSubtaskCell}
                canAddRow={true}
              />
            </div>
          )}

          {/* Dependency Tab */}
          {activeTab === "dependency" && (
            <div className="text-center py-8 text-gray-500">
              No dependencies available
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="text-center py-8 text-gray-500">
              No comments available
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === "attachments" && (
            <div className="text-center py-8 text-gray-500">
              No attachments available
            </div>
          )}

          {/* Project Drive Tab */}
          {activeTab === "project_drive" && (
            <div className="text-center py-8 text-gray-500">
              No project drive items available
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity_log" && (
            <div className="text-center py-8 text-gray-500">
              No activity logs available
            </div>
          )}

          {/* Workflow Status Log Tab */}
          {activeTab === "workflow_status_log" && (
            <div className="text-center py-8 text-gray-500">
              No workflow status logs available
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        TransitionComponent={Transition}
        maxWidth={false}
      >
        <DialogContent
          className="w-1/2 fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto"
          style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
          sx={{
            padding: "0 !important",
            "& .MuiDialogContent-root": {
              padding: "0 !important",
              overflow: "auto",
            }
          }}
        >
          <div className="sticky top-0 bg-white z-10">
            <h3 className="text-[14px] font-medium text-center mt-8">Edit Project Task</h3>
            <X
              className="absolute top-[26px] right-8 cursor-pointer w-4 h-4"
              onClick={handleCloseEditModal}
            />
            <hr className="border border-[#E95420] mt-4" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <ProjectTaskEditModal
              taskId={taskId}
              onCloseModal={handleCloseEditModal}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTaskDetails;
