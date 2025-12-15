import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { changeProjectStatus, createProject, fetchProjects, filterProjects } from "@/store/slices/projectManagementSlice";
import { MenuItem, Select, TextField } from "@mui/material";
import {
  ChartNoAxesColumn,
  ChevronDown,
  Eye,
  List,
  LogOut,
  Plus,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { fetchProjectTeams } from "@/store/slices/projectTeamsSlice";
import { fetchProjectTypes } from "@/store/slices/projectTypeSlice";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";
import { toast } from "sonner";
import AddProjectModal from "@/components/AddProjectModal";
import ProjectCreateModal from "@/components/ProjectCreateModal";
import ProjectManagementKanban from "@/components/ProjectManagementKanban";
import { ProjectFilterModal } from "@/components/ProjectFilterModal";

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
    key: "subtasks",
    label: "Subtasks",
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
      subtasks: project.total_sub_task_count || 0,
      subtasksCompleted: project.completed_sub_task_count || 0,
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

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All"
  },
  {
    value: "active",
    label: "Active"
  },
  {
    value: "in_progress",
    label: "In Progress"
  },
  {
    value: "completed",
    label: "Completed"
  },
  {
    value: "on_hold",
    label: "On Hold"
  },
  {
    value: "overdue",
    label: "Overdue"
  }
]

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
]


export const ProjectsDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [selectedFilterOption, setSelectedFilterOption] = useState("all")
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openStatusOptions, setOpenStatusOptions] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("List");
  const [projectTypes, setProjectTypes] = useState([]);
  const [owners, setOwners] = useState([])
  const [teams, setTeams] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      let filters = {};
      if (selectedFilterOption !== "all") {
        filters["q[status_eq]"] = selectedFilterOption;
      }
      const response = await dispatch(
        filterProjects({ token, baseUrl, filters })
      ).unwrap();
      setProjects(transformedProjects(response.project_managements));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    fetchData();
  }, [dispatch, token, baseUrl, selectedFilterOption]);

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
      const response = await dispatch(fetchProjectTeams()).unwrap();
      setTeams(response);
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getProjectTypes = async () => {
    try {
      const response = await dispatch(fetchProjectTypes()).unwrap();
      setProjectTypes(response);
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const getTags = async () => {
    try {
      const response = await dispatch(fetchProjectsTags()).unwrap();
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
        onClick={() => navigate(`/vas/projects/details/${item.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/vas/projects/${item.id}/milestones`)}
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await dispatch(changeProjectStatus({ token, baseUrl, id: String(id), payload: { project_management: { status } } })).unwrap();
      fetchData();
      toast.success("Project status changed successfully");
    } catch (error) {
      console.log(error)
    }
  }

  const renderCell = (item: any, columnKey: string) => {
    const renderProgressBar = (completed: number, total: number, color: string) => {
      const progress = total > 0 ? (completed / total) * 100 : 0;
      return (
        <div className="flex items-center gap-2">
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-2.5 ${color} rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{completed}/{total}</span>
        </div>
      );
    };

    switch (columnKey) {
      case "milestones": {
        const completed = item.milestonesCompleted || 0;
        const total = item.milestones || 0;
        return renderProgressBar(completed, total, "bg-[#84edba]");
      }
      case "tasks": {
        const completed = item.tasksCompleted || 0;
        const total = item.tasks || 0;
        return renderProgressBar(completed, total, "bg-[#e9e575]");
      }
      case "subtasks": {
        const completed = item.subtasksCompleted || 0;
        const total = item.subtasks || 0;
        return renderProgressBar(completed, total, "bg-[#b4e7ff]");
      }
      case "issues": {
        const completed = item.resolvedIssues || 0;
        const total = item.issues || 0;
        return renderProgressBar(completed, total, "bg-[#ff9a9e]");
      }
      case "id":
        return (
          <button
            onClick={() => navigate(`/vas/projects/details/${item.id}`)}
            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            {item.id}
          </button>
        );
      case "start_date":
      case "end_date":
        return item[columnKey] ? new Date(item[columnKey]).toLocaleDateString('en-GB') : "-";
      case "status":
        return (
          <select
            value={item.status}
            onChange={(e) =>
              handleStatusChange(item.id, e.target.value)
            }
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm cursor-pointer w-32"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
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
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <span className="text-[#C72030] font-medium flex items-center gap-2">
            {selectedView === "Kanban" ? (
              <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-[#C72030]" />
            ) : (
              <List className="w-4 h-4 text-[#C72030]" />
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
                  <List className="w-4 h-4 text-[#C72030]" />
                </div>
                <span className="text-gray-700">List</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          onClick={() => setOpenStatusOptions(!openStatusOptions)}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <span className="text-[#C72030] font-medium flex items-center gap-2">
            {STATUS_OPTIONS.find((option) => option.value === selectedFilterOption)?.label || "All"}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {openStatusOptions && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
            <div className="py-2">
              {
                STATUS_OPTIONS.map((option) => (
                  <button
                    onClick={() => {
                      setSelectedFilterOption(option.value);
                      setOpenStatusOptions(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <span className="text-gray-700">{option.label}</span>
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>

    </div>
  );

  if (selectedView === "Kanban") {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={handleOpenDialog}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                <span className="text-[#C72030] font-medium flex items-center gap-2">
                  {selectedView === "Kanban" ? (
                    <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-[#C72030]" />
                  ) : (
                    <List className="w-4 h-4 text-[#C72030]" />
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
                        <List className="w-4 h-4 text-[#C72030]" />
                      </div>
                      <span className="text-gray-700">List</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setOpenStatusOptions(!openStatusOptions)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                <span className="text-[#C72030] font-medium flex items-center gap-2">
                  {STATUS_OPTIONS.find((option) => option.value === selectedFilterOption)?.label || "All"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {openStatusOptions && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                  <div className="py-2">
                    {
                      STATUS_OPTIONS.map((option) => (
                        <button
                          onClick={() => {
                            setSelectedFilterOption(option.value);
                            setOpenStatusOptions(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                        >
                          <span className="text-gray-700">{option.label}</span>
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ProjectManagementKanban />

        <AddProjectModal
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          setOpenFormDialog={setOpenFormDialog}
        />

        <ProjectCreateModal
          openDialog={openFormDialog}
          handleCloseDialog={() => {
            setOpenFormDialog(false);
            setOpenDialog(false);
          }}
          owners={owners}
          projectTypes={projectTypes}
          tags={tags}
          teams={teams}
          fetchProjects={fetchData}
        />

        <ProjectFilterModal
          isModalOpen={isFilterModalOpen}
          setIsModalOpen={setIsFilterModalOpen}
          onApplyFilters={fetchData}
        />
      </div>
    )
  }

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
        onFilterClick={() => setIsFilterModalOpen(true)}
        canAddRow={true}
        readonlyColumns={["id", "milestones", "tasks", "subtasks", "issues"]}
        onAddRow={(newRowData) => {
          handleSubmit(newRowData)
        }}
        renderEditableCell={renderEditableCell}
        newRowPlaceholder="Click to add new project"
        loading={loading}
      />

      <AddProjectModal
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        setOpenFormDialog={setOpenFormDialog}
      />

      <ProjectCreateModal
        openDialog={openFormDialog}
        handleCloseDialog={() => {
          setOpenFormDialog(false);
          setOpenDialog(false);
        }}
        owners={owners}
        projectTypes={projectTypes}
        tags={tags}
        teams={teams}
        fetchProjects={fetchData}
      />

      <ProjectFilterModal
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
        onApplyFilters={fetchData}
      />
    </div>
  );
};