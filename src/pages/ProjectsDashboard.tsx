import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  changeProjectStatus,
  createProject,
  filterProjects,
} from "@/store/slices/projectManagementSlice";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import {
  ChartNoAxesColumn,
  ChevronDown,
  Eye,
  List,
  LogOut,
  Plus,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { fetchProjectTeams } from "@/store/slices/projectTeamsSlice";
import { fetchProjectTypes } from "@/store/slices/projectTypeSlice";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";
import { toast } from "sonner";
import AddProjectModal from "@/components/AddProjectModal";
import ProjectCreateModal from "@/components/ProjectCreateModal";
import ProjectManagementKanban from "@/components/ProjectManagementKanban";
import ProjectFilterModal from "@/components/ProjectFilterModal";
import { useLayout } from "@/contexts/LayoutContext";
import axios from "axios";
import { useDebounce } from "@/hooks/useDebounce";

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
      subtasks: project.total_sub_task_management_count || 0,
      subtasksCompleted: project.completed_sub_task_management_count || 0,
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
    label: "All",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "in_progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "on_hold",
    label: "On Hold",
  },
  {
    value: "overdue",
    label: "Overdue",
  },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

export const ProjectsDashboard = () => {
  const { setCurrentSection } = useLayout();

  const view = localStorage.getItem("selectedView");

  useEffect(() => {
    setCurrentSection(
      view === "admin" ? "Value Added Services" : "Project Task"
    );
  }, [setCurrentSection]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const { teams } = useAppSelector((state) => state.projectTeams);
  const { projectTags: tags } = useAppSelector((state) => state.projectTags);

  const [selectedFilterOption, setSelectedFilterOption] = useState("all");
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [openStatusOptions, setOpenStatusOptions] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("List");
  const [projectTypes, setProjectTypes] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Refs for click outside detection
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = async (
    page = 1,
    filterString = "",
    isLoadMore = false,
    searchQuery = ""
  ) => {
    try {
      if (!hasMore && isLoadMore) return;

      // Use scrollLoading for infinite scroll, regular loading for initial load
      if (isLoadMore) {
        setScrollLoading(true);
      } else {
        setLoading(true);
      }

      let filters = filterString !== "" ? filterString : appliedFilters;

      if (!filters) {
        if (selectedFilterOption !== "all") {
          filters = `q[status_eq]=${selectedFilterOption}&`;
        }
      }

      // Add search query using Ransack's cont (contains) matcher
      if (searchQuery && searchQuery.trim() !== "") {
        const searchFilter = `q[title_or_project_type_name_or_project_owner_name_cont]=${encodeURIComponent(searchQuery.trim())}`;
        filters += (filters ? "&" : "") + searchFilter + "&";
      }

      filters +=
        (filters ? "&" : "") +
        `q[project_team_project_team_members_user_id_or_owner_id_or_created_by_id_eq]=${JSON.parse(localStorage.getItem("user")).id}&page=${page}`;

      const response = await dispatch(
        filterProjects({ token, baseUrl, filters })
      ).unwrap();

      const transformedData = transformedProjects(response.project_managements);

      if (isLoadMore) {
        setProjects((prev) => [...prev, ...transformedData]);
      } else {
        setProjects(transformedData);
      }

      setHasMore(page < (response.pagination?.total_pages || 1));
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setScrollLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchData(1, "", false, debouncedSearchTerm);
    setAppliedFilters("");
  }, [dispatch, token, baseUrl, selectedFilterOption, debouncedSearchTerm]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Load more when user is 200px from bottom
      if (
        scrollTop + clientHeight >= scrollHeight - 200 &&
        !scrollLoading &&
        !loading &&
        hasMore
      ) {
        fetchData(currentPage + 1, "", true, debouncedSearchTerm);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    scrollLoading,
    loading,
    hasMore,
    currentPage,
    appliedFilters,
    debouncedSearchTerm,
  ]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        viewDropdownRef.current &&
        !viewDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenStatusOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getOwners = async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Asset`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOwners(response.data.users);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getTeams = async () => {
    try {
      await dispatch(fetchProjectTeams()).unwrap();
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getProjectTypes = async () => {
    try {
      const response = await dispatch(fetchProjectTypes()).unwrap();
      setProjectTypes(response);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getTags = async () => {
    try {
      await dispatch(fetchProjectsTags()).unwrap();
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    getOwners();
    getTeams();
    getProjectTypes();
    getTags();
  }, []);

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
      };
      await dispatch(createProject({ token, baseUrl, data: payload })).unwrap();
      toast.success("Project created successfully");
      fetchData(1, "", false, debouncedSearchTerm);
    } catch (error) {
      console.log(error);
      toast.error(error);
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
      await dispatch(
        changeProjectStatus({
          token,
          baseUrl,
          id: String(id),
          payload: { project_management: { status } },
        })
      ).unwrap();
      fetchData(1, "", false, debouncedSearchTerm);
      setCurrentPage(1);
      setHasMore(true);
      toast.success("Project status changed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    const renderProgressBar = (
      completed: number,
      total: number,
      color: string,
      type?: string
    ) => {
      const progress = total > 0 ? (completed / total) * 100 : 0;
      return (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
            type === "issues" && navigate(`/vas/issues?project_id=${item.id}`)
          }
        >
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            {completed}
          </span>
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-4 overflow-hidden flex items-center !justify-center">
            <div
              className={`absolute top-0 left-0 h-6 ${color} rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            ></div>
            <span className="relative z-10 text-xs font-semibold text-gray-800">
              {Math.round(progress)}%
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            {total}
          </span>
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
        return renderProgressBar(completed, total, "bg-[#ff9a9e]", "issues");
      }
      case "id":
        return (
          <button
            onClick={() => navigate(`/vas/projects/details/${item.id}`)}
            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            P-{item.id}
          </button>
        );
      case "start_date":
      case "end_date":
        return item[columnKey]
          ? new Date(item[columnKey]).toLocaleDateString("en-GB")
          : "-";
      case "status": {
        const statusColorMap = {
          active: { dot: "bg-emerald-500" },
          in_progress: { dot: "bg-amber-500" },
          on_hold: { dot: "bg-gray-500" },
          completed: { dot: "bg-teal-500" },
          overdue: { dot: "bg-red-500" },
        };

        const colors =
          statusColorMap[item.status as keyof typeof statusColorMap] ||
          statusColorMap.active;

        return (
          <FormControl
            variant="standard"
            sx={{ width: 148 }} // same as w-32
          >
            <Select
              value={item.status}
              onChange={(e) =>
                handleStatusChange(item.id, e.target.value as string)
              }
              disableUnderline
              renderValue={(value) => (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${colors.dot}`}
                  ></span>
                  <span>
                    {statusOptions.find((opt) => opt.value === value)?.label ||
                      value}
                  </span>
                </div>
              )}
              sx={{
                fontSize: "0.875rem",
                cursor: "pointer",
                "& .MuiSelect-select": {
                  padding: "4px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                },
              }}
            >
              {statusOptions.map((opt) => {
                const optColors =
                  statusColorMap[opt.value as keyof typeof statusColorMap];
                return (
                  <MenuItem
                    key={opt.value}
                    value={opt.value}
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${optColors?.dot || "bg-gray-500"}`}
                    ></span>
                    <span>{opt.label}</span>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );
      }
      case "title":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="truncate cursor-pointer"
                  onClick={() =>
                    navigate(`/vas/projects/${item.id}/milestones`)
                  }
                >
                  {item.title}
                </span>
              </TooltipTrigger>
              <TooltipContent className="rounded-[5px]">
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
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
          {projectTypes.map((projectType) => (
            <MenuItem key={projectType.id} value={projectType.id}>
              {projectType.name}
            </MenuItem>
          ))}
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
          {owners.map((owner) => (
            <MenuItem key={owner.id} value={owner.id}>
              {owner.full_name}
            </MenuItem>
          ))}
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
  };

  const rightActions = (
    <div className="flex items-center gap-2">
      <div className="relative" ref={viewDropdownRef}>
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
      <div className="relative" ref={statusDropdownRef}>
        <button
          onClick={() => setOpenStatusOptions(!openStatusOptions)}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <span className="text-[#C72030] font-medium flex items-center gap-2">
            {STATUS_OPTIONS.find(
              (option) => option.value === selectedFilterOption
            )?.label || "All"}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {openStatusOptions && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
            <div className="py-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  onClick={() => {
                    setSelectedFilterOption(option.value);
                    setOpenStatusOptions(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  <span className="text-gray-700">{option.label}</span>
                </button>
              ))}
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
            {/* <div className="relative">
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
            </div> */}
          </div>
        </div>

        <ProjectManagementKanban fetchData={fetchData} />

        <AddProjectModal
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          setOpenFormDialog={setOpenFormDialog}
          onTemplateSelect={setSelectedTemplate}
        />

        <ProjectCreateModal
          openDialog={openFormDialog}
          handleCloseDialog={() => {
            setOpenFormDialog(false);
            setOpenDialog(false);
            setSelectedTemplate({});
          }}
          owners={owners}
          projectTypes={projectTypes}
          tags={tags}
          teams={teams}
          fetchProjects={fetchData}
          templateDetails={selectedTemplate}
        />

        <ProjectFilterModal
          isModalOpen={isFilterModalOpen}
          setIsModalOpen={setIsFilterModalOpen}
          onApplyFilters={(filterString) => {
            setAppliedFilters(filterString);
            fetchData(1, filterString, false, debouncedSearchTerm);
          }}
        />
      </div>
    );
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
          handleSubmit(newRowData);
        }}
        renderEditableCell={renderEditableCell}
        newRowPlaceholder="Click to add new project"
        loading={loading}
        enableGlobalSearch={true}
        onGlobalSearch={(searchQuery) => {
          setSearchTerm(searchQuery);
          setCurrentPage(1);
          setHasMore(true);
        }}
        searchValue={searchTerm}
        searchPlaceholder="Search by title, type, or manager..."
      />

      {scrollLoading && hasMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
        </div>
      )}

      {!hasMore && projects.length > 0 && (
        <div className="flex justify-center py-4 text-gray-500 text-sm">
          No more projects to load
        </div>
      )}

      <AddProjectModal
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        setOpenFormDialog={setOpenFormDialog}
        onTemplateSelect={setSelectedTemplate}
      />

      <ProjectCreateModal
        openDialog={openFormDialog}
        handleCloseDialog={() => {
          setOpenFormDialog(false);
          setOpenDialog(false);
          setSelectedTemplate({});
        }}
        owners={owners}
        projectTypes={projectTypes}
        tags={tags}
        teams={teams}
        fetchProjects={fetchData}
        templateDetails={selectedTemplate}
      />

      <ProjectFilterModal
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
        onApplyFilters={(filterString) => {
          setAppliedFilters(filterString);
          fetchData(1, filterString, false, debouncedSearchTerm);
        }}
      />
    </div>
  );
};
