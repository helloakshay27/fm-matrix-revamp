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
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { baseClient } from "@/utils/withoutTokenBase";
import { fetchProjectTeams } from "@/store/slices/projectTeamsSlice";
import { fetchProjectTypes } from "@/store/slices/projectTypeSlice";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";
import { toast } from "sonner";
import AddProjectModal from "@/components/AddProjectModal";
import ProjectCreateModal from "@/components/ProjectCreateModal";
import ProjectManagementKanban from "@/components/ProjectManagementKanban";
import ProjectFilterModal from "@/components/ProjectFilterModal";
import { useLayout } from "@/contexts/LayoutContext";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import axios from "axios";
import { useDebounce } from "@/hooks/useDebounce";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { CommonImportModal } from "@/components/CommonImportModal";

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "Project ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "project_code",
    label: "Project Code",
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
    key: "completion_percent",
    label: "Project Completion %",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "milestoneCompletionPercent",
    label: "Milestone Completion %",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "taskCompletionPercent",
    label: "Task Completion %",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "subtaskCompletionPercent",
    label: "Subtask Completion %",
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

// Map frontend column keys to backend field names
const COLUMN_TO_BACKEND_MAP: Record<string, string> = {
  id: "id",
  project_code: "project_code",
  title: "title",
  status: "status",
  type: "project_type_name",
  manager: "project_owner_name",
  completion_percent: "completion_percent",
  milestoneCompletionPercent: "avg_milestone_completion_percent",
  taskCompletionPercent: "avg_task_management_completion_percent",
  subtaskCompletionPercent: "avg_sub_task_management_completion_percent",
  milestones: "total_milestone_count",
  tasks: "total_task_management_count",
  subtasks: "total_sub_task_management_count",
  issues: "total_issues_count",
  start_date: "start_date",
  end_date: "end_date",
  priority: "priority",
};

const transformedProjects = (projects: any) => {
  return projects.map((project: any) => {
    return {
      id: project.id,
      project_code: project.project_code,
      title: project.title,
      status: project.status,
      type: project.project_type_name,
      completion_percent: project.completion_percent,
      manager: project.project_owner_name,
      milestones: project.total_milestone_count,
      milestonesCompleted: project.completed_milestone_count,
      milestoneCompletionPercent: project.avg_milestone_completion_percent || 0,
      tasks: project.total_task_management_count,
      tasksCompleted: project.completed_task_management_count,
      taskCompletionPercent: project.avg_task_management_completion_percent || 0,
      subtasks: project.total_sub_task_management_count || 0,
      subtasksCompleted: project.completed_sub_task_management_count || 0,
      subtaskCompletionPercent: project.avg_sub_task_management_completion_percent || 0,
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { shouldShow } = useDynamicPermissions();

  const view = localStorage.getItem("selectedView");
  const urlToken = searchParams.get("token");
  const urlOrgId = searchParams.get("org_id");
  const urlUserId = searchParams.get("user_id");

  // Initialize mobile token, org_id, and user_id from URL if available
  useEffect(() => {
    if (urlToken) {
      sessionStorage.setItem("mobile_token", urlToken);
      // Store token in localStorage for other pages to use
      localStorage.setItem("token", urlToken);
      console.log("✅ Mobile token stored in sessionStorage and localStorage");
    }
    if (urlOrgId) {
      sessionStorage.setItem("org_id", urlOrgId);
      console.log("✅ org_id stored in sessionStorage:", urlOrgId);
    }
    if (urlUserId) {
      sessionStorage.setItem("user_id", urlUserId);
      console.log("✅ user_id stored in sessionStorage:", urlUserId);
    }
  }, [urlToken, urlOrgId, urlUserId]);

  // Determine token source: prefer sessionStorage (mobile) over localStorage (web)
  const token =
    sessionStorage.getItem("mobile_token") ||
    localStorage.getItem("token");

  // For baseUrl: use localStorage for web, or will be resolved by baseClient for mobile
  let baseUrl = localStorage.getItem("baseUrl") ?? "lockated-api.gophygital.work";

  // If mobile flow and no baseUrl, will be resolved by baseClient interceptor
  if (!baseUrl && urlToken) {
    console.log("📱 Mobile flow detected - baseUrl will be resolved by baseClient interceptor");
    // After baseClient resolves it, it will be stored in localStorage automatically
  }

  useEffect(() => {
    setCurrentSection(
      view === "admin" ? "Value Added Services" : "Project Task"
    );
  }, [setCurrentSection]);

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
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false)

  // Refs for click outside detection
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Helper function to safely get user ID from sessionStorage or localStorage
  const getUserId = useCallback(() => {
    // First, check if user_id was passed in URL (mobile flow)
    const sessionUserId = sessionStorage.getItem("user_id");
    if (sessionUserId) {
      return sessionUserId;
    }

    // Fall back to localStorage (web flow)
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        return userData.id || null;
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }

    return null;
  }, []);

  const fetchData = useCallback(
    async (
      page = 1,
      filterString = "",
      isLoadMore = false,
      searchQuery = "",
      orderBy = sortColumn,
      orderDirection = sortDirection
    ) => {
      // Guard: don't proceed if token is not available
      if (!token) {
        console.warn("⚠️ fetchData called without token");
        return;
      }

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

        // Add sorting parameters
        if (orderBy && orderDirection) {
          const backendFieldName = COLUMN_TO_BACKEND_MAP[orderBy] || orderBy;
          filters += (filters ? "&" : "") + `order_by=${backendFieldName}&order_direction=${orderDirection}`;
        }

        filters +=
          (filters ? "&" : "") +
          `page=${page}`;

        // Fetch data
        if (!isLoadMore && page === 1) {
          const response = await dispatch(
            filterProjects({ token, baseUrl, filters })
          ).unwrap();

          const projectsData = response?.data?.project_managements || response?.project_managements || [];
          const transformedData = transformedProjects(projectsData);
          setProjects(transformedData);

          const paginationData = response?.data?.pagination || response?.pagination;
          setHasMore(page < (paginationData?.total_pages || 1));
          setCurrentPage(page);
        } else {
          // For pagination, fetch fresh data
          const response = await dispatch(
            filterProjects({ token, baseUrl, filters })
          ).unwrap();

          const projectsData = response?.data?.project_managements || response?.project_managements || [];
          const transformedData = transformedProjects(projectsData);

          if (isLoadMore) {
            setProjects((prev) => [...prev, ...transformedData]);
          } else {
            setProjects(transformedData);
          }

          const paginationData = response?.data?.pagination || response?.pagination;
          setHasMore(page < (paginationData?.total_pages || 1));
          setCurrentPage(page);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setScrollLoading(false);
      }
    },
    [hasMore, appliedFilters, selectedFilterOption, dispatch, token, baseUrl, sortColumn, sortDirection]
  );

  useEffect(() => {
    if (token) {
      setCurrentPage(1);
      setHasMore(true);
      fetchData(1, "", false, debouncedSearchTerm);
      setAppliedFilters("");
    }
  }, [token, selectedFilterOption, debouncedSearchTerm]);

  // Infinite scroll handler with debouncing
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let lastLoadedPage = currentPage;

    const handleScroll = () => {
      // Clear any existing timeout
      clearTimeout(scrollTimeout);

      // Debounce the scroll check to avoid excessive calls
      scrollTimeout = setTimeout(async () => {
        const scrollElement = document.documentElement;
        const scrollTop = window.pageYOffset || scrollElement.scrollTop;
        const scrollHeight = scrollElement.scrollHeight;
        const clientHeight = window.innerHeight;

        // Load more when user is 500px from bottom
        const threshold = 500;
        if (
          scrollTop + clientHeight >= scrollHeight - threshold &&
          !scrollLoading &&
          !loading &&
          hasMore &&
          lastLoadedPage === currentPage // Prevent duplicate requests
        ) {
          const nextPage = currentPage + 1;
          lastLoadedPage = nextPage;
          await fetchData(nextPage, "", true, debouncedSearchTerm);
        }
      }, 150); // Debounce for 150ms
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentPage, scrollLoading, loading, hasMore, debouncedSearchTerm, fetchData]);

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

  const getOwners = useCallback(async () => {
    try {
      // Use baseClient for mobile flow (when baseUrl not available)
      // Use direct axios call for web flow
      const response = baseUrl
        ? await axios.get(
          `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        : await baseClient.get(
          `/pms/users/get_escalate_to_users.json?type=Task`,
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
  }, [baseUrl, token]);

  const getTeams = useCallback(async () => {
    try {
      await dispatch(fetchProjectTeams()).unwrap();
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }, [dispatch]);

  const getProjectTypes = useCallback(async () => {
    try {
      const result = await dispatch(fetchProjectTypes()).unwrap();
      setProjectTypes(result);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }, [dispatch]);

  const getTags = useCallback(async () => {
    try {
      await dispatch(fetchProjectsTags()).unwrap();
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      getOwners();
      getTeams();
      getProjectTypes();
      getTags();
    }
  }, [token, getOwners, getTeams, getProjectTypes, getTags]);

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

  const handleSampleDownload = async () => {
    try {
      // Use baseClient for mobile flow (when baseUrl not available)
      const response = baseUrl
        ? await axios.get(
          `https://${baseUrl}/assets/project_import.xlsx`,
          {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        : await baseClient.get(
          `/assets/project_import.xlsx`,
          {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample_project_management.xlsx'); // specify filename
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // cleanup
      toast.success('Sample format downloaded successfully');
    } catch (error) {
      console.error('Error downloading sample file:', error);
      toast.error('Failed to download sample file. Please try again.');
    }
  };

  const handleImport = async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Use baseClient for mobile flow (when baseUrl not available)
      const response = baseUrl
        ? await axios.post(`https://${baseUrl}/project_managements/import.json`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        : await baseClient.post(`/project_managements/import.json`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

      if (response.data.failed && response.data.failed.length > 0) {
        response.data.failed.forEach((item: { row: number; errors: string[] }) => {
          const errorMessages = item.errors.join(', ');
          toast.error(`Row ${item.row}: ${errorMessages}`);
        });
      } else {
        toast.success("Projects imported successfully");
        setIsImportModalOpen(false);
        setSelectedFile(null);
        fetchData(1, "", false, debouncedSearchTerm);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsUploading(false);
    }
  }

  const renderActions = (item: any) => (
    <div className="flex items-center justify-center gap-2">
      {shouldShow("employee_projects", "show") && (
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => window.location.pathname.startsWith("/vas/projects") ? navigate(`/vas/projects/details/${item.id}`) : navigate(`/mobile-projects/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )}
      {shouldShow("employee_projects", "update") && (
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => window.location.pathname.startsWith("/vas/projects") ? navigate(`/vas/projects/${item.id}/milestones`) : navigate(`/mobile-projects/${item.id}/milestones?token=${token}&org_id=${urlOrgId}&user_id=${urlUserId}`)}
        >
          <LogOut className="w-4 h-4" />
        </Button>
      )}
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
      fetchData(1, "", false, debouncedSearchTerm, sortColumn, sortDirection);
      setCurrentPage(1);
      setHasMore(true);
      toast.success("Project status changed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // Handle column sort
  const handleColumnSort = (columnKey: string) => {
    let newDirection: "asc" | "desc" | null;

    // Cycle through: asc -> desc -> null -> asc
    if (sortColumn === columnKey) {
      newDirection = sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc";
    } else {
      newDirection = "asc";
    }

    setSortColumn(newDirection ? columnKey : null);
    setSortDirection(newDirection);

    // Reset to page 1 and fetch with new sort
    setCurrentPage(1);
    setHasMore(true);
    fetchData(1, "", false, debouncedSearchTerm, newDirection ? columnKey : null, newDirection);
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
            type === "issues"
              ? navigate(`/vas/issues?project_id=${item.id}`)
              : type === "tasks"
                ? navigate(`/vas/tasks?project_id=${item.id}`)
                : type === "subtasks"
                  ? navigate(`/vas/tasks?subtasks=true&project_id=${item.id}`)
                  : type === "milestones"
                    ? navigate(`/vas/projects/${item.id}/milestones`)
                    : null
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
        return renderProgressBar(
          completed,
          total,
          "bg-[#84edba]",
          "milestones"
        );
      }
      case "tasks": {
        const completed = item.tasksCompleted || 0;
        const total = item.tasks || 0;
        return renderProgressBar(completed, total, "bg-[#e9e575]", "tasks");
      }
      case "subtasks": {
        const completed = item.subtasksCompleted || 0;
        const total = item.subtasks || 0;
        return renderProgressBar(completed, total, "bg-[#b4e7ff]", "subtasks");
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
      case "completion_percent":
        return <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            {item.status === "completed" ? 1 : 0}
          </span>
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-4 overflow-hidden flex items-center !justify-center">
            <div
              className={`absolute top-0 left-0 h-6 bg-[#7fffdd] rounded-full transition-all duration-300`}
              style={{ width: `${item.completion_percent}%` }}
            ></div>
            <span className="relative z-10 text-xs font-semibold text-gray-800">
              {Math.round(item.completion_percent)}%
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            1
          </span>
        </div>
      case "milestoneCompletionPercent":
        return <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            {item.milestonesCompleted}
          </span>
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-4 overflow-hidden flex items-center !justify-center">
            <div
              className={`absolute top-0 left-0 h-6 bg-[#84edba] rounded-full transition-all duration-300`}
              style={{ width: `${item.milestoneCompletionPercent}%` }}
            ></div>
            <span className="relative z-10 text-xs font-semibold text-gray-800">
              {Math.round(item.milestoneCompletionPercent)}%
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            {item.milestones}
          </span>
        </div>
      case "taskCompletionPercent":
        return <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            {item.tasksCompleted}
          </span>
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-4 overflow-hidden flex items-center !justify-center">
            <div
              className={`absolute top-0 left-0 h-6 bg-[#e9e575] rounded-full transition-all duration-300`}
              style={{ width: `${item.taskCompletionPercent}%` }}
            ></div>
            <span className="relative z-10 text-xs font-semibold text-gray-800">
              {Math.round(item.taskCompletionPercent)}%
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            {item.tasks}
          </span>
        </div>
      case "subtaskCompletionPercent":
        return <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            {item.subtasksCompleted}
          </span>
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-4 overflow-hidden flex items-center !justify-center">
            <div
              className={`absolute top-0 left-0 h-6 bg-[#b4e7ff] rounded-full transition-all duration-300`}
              style={{ width: `${item.subtaskCompletionPercent}%` }}
            ></div>
            <span className="relative z-10 text-xs font-semibold text-gray-800">
              {Math.round(item.subtaskCompletionPercent)}%
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
            {item.subtasks}
          </span>
        </div>
      default:
        return item[columnKey] || "-";
    }
  };

  const leftActions = (
    <>
      {shouldShow("employee_projects", "create") && (
        <Button
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
          onClick={() => setShowActionPanel(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Action
        </Button>
      )}
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
            setCurrentPage(1);
            setHasMore(true);
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
        onSort={handleColumnSort}
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
        enableExport={true}
        exportFileName="projects"
        hideTableExport={true}
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

      {showActionPanel && (
        <SelectionPanel
          onAdd={handleOpenDialog}
          onImport={() => setIsImportModalOpen(true)}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      <CommonImportModal
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        title="Import Projects"
        entityType="projects"
        onSampleDownload={handleSampleDownload}
        onImport={handleImport}
        isUploading={isUploading}
      />

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
          setCurrentPage(1);
          setHasMore(true);
          fetchData(1, filterString, false, debouncedSearchTerm);
        }}
      />
    </div>
  );
};
