import AddProjectModal from "@/components/AddProjectModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import ProjectCreateModal from "@/components/ProjectCreateModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { fetchProjects } from "@/store/slices/projectManagementSlice";
import {
  ChartNoAxesColumn,
  ChevronDown,
  Eye,
  List,
  LogOut,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "Project ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "title",
    label: "Project Title",
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
    key: "type",
    label: "Project Type",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "manager",
    label: "Project Manager",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "milestones",
    label: "Milestones",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "tasks",
    label: "Tasks",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "issues",
    label: "Issues",
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
    key: "priority",
    label: "Priority",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

const transformedProjects = (projects: any) => {
  return projects.map((project: any) => {
    return {
      id: project.id,
      title: project.title,
      status: project.status,
      type: project.project_type_name,
      manager: project.project_owner_name,
      milestones: project.total_milestone_count,
      milestonesCompleted: project.completed_milestone_count,
      tasks: project.total_task_management_count,
      tasksCompleted: project.completed_task_management_count,
      issues: project.total_issues_count,
      resolvedIssues: project.completed_issues_count,
      start_date: project.start_date,
      end_date: project.end_date,
      priority: project.priority,
    };
  });
};

export const ProjectsDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("List");
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    type: "",
    manager: "",
    start_date: "",
    end_date: "",
    priority: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          fetchProjects({ token, baseUrl })
        ).unwrap();
        setProjects(transformedProjects(response));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dispatch, token, baseUrl]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: "",
      status: "",
      type: "",
      manager: "",
      start_date: "",
      end_date: "",
      priority: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Handle form submission (e.g., dispatch an action to add the project)
    console.log("Form submitted:", formData);
    handleCloseDialog();
  };

  const renderActions = (item: any) => (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/maintenance/projects/details/${item.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/maintenance/projects/${item.id}/milestones`)}
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "milestones": {
        const completed = item.milestonesCompleted || 0;
        const total = item.milestonesTotal || 0;
        const progress = total > 0 ? (completed / total) * 100 : 0;

        return (
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-3">
            <div
              className="absolute top-0 left-0 h-3 bg-[#84edba] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black">
              {progress.toFixed(2)}%
            </div>
          </div>
        );
      }
      case "tasks": {
        const completed = item.tasksCompleted || 0;
        const total = item.tasksTotal || 0;
        const progress = total > 0 ? (completed / total) * 100 : 0;

        return (
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-3">
            <div
              className="absolute top-0 left-0 h-3 bg-[#e9e575] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black">
              {progress.toFixed(2)}%
            </div>
          </div>
        );
      }
      default:
        return item[columnKey] || "-";
    }
  };

  const leftActions = (
    <>
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={handleOpenDialog}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  const rightActions = (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
      >
        <span className="text-red-600 font-medium flex items-center gap-2">
          {selectedView === "Kanban" ? (
            <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-red-600" />
          ) : (
            <List className="w-4 h-4 text-red-600" />
          )}
          {selectedView}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
          <div className="py-2">
            <button
              onClick={() => {
                setSelectedView("Kanban");
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              <div className="w-4 flex justify-center">
                <ChartNoAxesColumn className="rotate-180 text-[#C72030]" />
              </div>
              <span className="text-gray-700">Kanban</span>
            </button>

            <button
              onClick={() => {
                setSelectedView("List");
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              <div className="w-4 flex justify-center">
                <List className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-gray-700">List</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={projects}
        columns={columns}
        renderActions={renderActions}
        renderCell={renderCell}
        leftActions={leftActions}
        rightActions={rightActions}
        storageKey="projects-table"
        onFilterClick={() => { }}
        canAddRow={true}
        readonlyColumns={["id"]}
        onAddRow={(newRowData) => {
          console.log("New row data:", newRowData);
        }}
        renderEditableCell={(columnKey, value, onChange) => {
          if (columnKey === "status") {
            return (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            );
          }
          return null;
        }}
        newRowPlaceholder="Click to add new project"
      />

      <AddProjectModal
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        setOpenFormDialog={setOpenFormDialog}
      />

      <ProjectCreateModal
        openDialog={openFormDialog}
        handleCloseDialog={() => setOpenFormDialog(false)}
      />
    </div>
  );
};
