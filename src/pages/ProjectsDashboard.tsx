import AddProjectModal from "@/components/AddProjectModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import ProjectCreateModal from "@/components/ProjectCreateModal";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { createProject, fetchProjects } from "@/store/slices/projectManagementSlice";
import { MenuItem, Select, TextField } from "@mui/material";
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
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { fetchProjectTeams } from "@/store/slices/projectTeamsSlice";
import { fetchProjectTypes } from "@/store/slices/projectTypeSlice";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";
import { toast } from "sonner";

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
      status: project.status
        ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
        : "",
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
      priority: project.priority
        ? project.priority.charAt(0).toUpperCase() + project.priority.slice(1)
        : "",
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
  const [projectTypes, setProjectTypes] = useState([]);
  const [owners, setOwners] = useState([])
  const [teams, setTeams] = useState([])
  const [tags, setTags] = useState([])

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


  useEffect(() => {
    fetchData();
  }, [dispatch, token, baseUrl]);

  const getOwners = async () => {
    try {
      const response = await dispatch(fetchFMUsers()).unwrap();
      setOwners(response.users);
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getTeams = async () => {
    try {
      const response = await dispatch(fetchProjectTeams({ baseUrl, token })).unwrap();
      setTeams(response);
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getProjectTypes = async () => {
    try {
      const response = await dispatch(fetchProjectTypes({ baseUrl, token })).unwrap();
      setProjectTypes(response);
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getTags = async () => {
    try {
      const response = await dispatch(fetchProjectsTags({ baseUrl, token })).unwrap();
      setTags(response);
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(() => {
    getOwners();
    getTeams();
    getProjectTypes();
    getTags();
  }, [])

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (data) => {
    try {
      const payload = {
        project_management: {
          title: data.title,
          start_date: data.start_date,
          end_date: data.end_date,
          status: "active",
          owner_id: data.manager,
          priority: data.priority,
          active: true,
          project_type_id: data.type,
        },
      }
      await dispatch(createProject({ token, baseUrl, data: payload })).unwrap();
      toast.success("Project created successfully");
      fetchData();
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
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

  const renderEditableCell = (columnKey, value, onChange) => {
    if (columnKey === "status") {
      return (
        <Select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">
            <em>Select status</em>
          </MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      );
    }
    if (columnKey === "type") {
      return (
        <Select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">
            <em>Select type</em>
          </MenuItem>
          {
            projectTypes.map((projectType) => (
              <MenuItem key={projectType.id} value={projectType.id}>
                {projectType.name}
              </MenuItem>
            ))
          }
        </Select>
      );
    }
    if (columnKey === "manager") {
      return (
        <Select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">
            <em>Select owner</em>
          </MenuItem>
          {
            owners.map((owner) => (
              <MenuItem key={owner.id} value={owner.id}>
                {owner.full_name}
              </MenuItem>
            ))
          }
        </Select>
      );
    }
    if (columnKey === "start_date") {
      return (
        <TextField
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        />
      );
    }
    if (columnKey === "end_date") {
      return (
        <TextField
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        />
      );
    }
    if (columnKey === "priority") {
      return (
        <Select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">
            <em>Select priority</em>
          </MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
      );
    }
    return null;
  }

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
        readonlyColumns={["id", "milestones", "tasks", "issues"]}
        onAddRow={(newRowData) => {
          handleSubmit(newRowData)
        }}
        renderEditableCell={renderEditableCell}
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
        owners={owners}
        projectTypes={projectTypes}
        tags={tags}
        teams={teams}
      />
    </div>
  );
};
