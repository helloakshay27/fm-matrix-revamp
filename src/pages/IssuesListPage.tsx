import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import {
  useIssues,
  useUpdateIssue,
  useImportIssues,
  useDownloadSampleIssueFile,
} from "@/hooks/useIssues";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Eye,
  Filter,
  ChartNoAxesColumn,
  List,
  ChevronDown,
} from "lucide-react";
import IssueManagementKanban from "@/components/IssueManagementKanban";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import AddIssueModal from "@/components/AddIssueModal";
import IssueFilterModal from "@/components/IssueFilterModal";
import {
  FormControl,
  MenuItem,
  Select,
  Switch,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { useLayout } from "@/contexts/LayoutContext";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import qs from "qs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { CommonImportModal } from "@/components/CommonImportModal";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Issue {
  id?: string;
  project_name?: string;
  milestone_name?: string;
  task_name?: string;
  sub_task_name?: string;
  title?: string;
  description?: string;
  issue_type?: string;
  priority?: string;
  status?: string;
  assigned_to?: string;
  raised_by?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  start_date?: string;
  due_date?: string;
  project_id?: string;
  milestone_id?: string;
  task_id?: string;
  comment?: string;
}

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "project_name",
    label: "Project Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "milestone_name",
    label: "Milestone Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "task_name",
    label: "Task Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "sub_task_name",
    label: "Subtask Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "title",
    label: "Title",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "issue_type",
    label: "Type",
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
    key: "status",
    label: "Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "assigned_to",
    label: "Responsible Person",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "raised_by",
    label: "Raised By",
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
    key: "due_date",
    label: "End Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "comment",
    label: "Comment",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

const ISSUSE_STATUS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "reopen", label: "Reopen" },
  { value: "closed", label: "Closed" },
];

const IssuesListPage = ({
  preSelectedProjectId,
}: { preSelectedProjectId?: string } = {}) => {
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { shouldShow } = useDynamicPermissions();
  const { id: projectId } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // Parse URL params with default values
  const initSearch = searchParams.get("search") || "";
  const initFilters = searchParams.get("filters") || "";
  const initView = (searchParams.get("view") || "List") as "Kanban" | "List";
  const initMyIssues = searchParams.get("myIssues") !== "false";

  // URL params for backward compatibility
  const projectIdParam = searchParams.get("project_id");
  const milestoneIdParam = searchParams.get("milestone_id");
  const taskIdParam = searchParams.get("task_id");

  const view = localStorage.getItem("selectedView");

  useEffect(() => {
    setCurrentSection(
      view === "admin" ? "Value Added Services" : "Project Task"
    );
  }, [setCurrentSection, view]);

  /**
   * Helper function to update URL query parameters
   * Deletes params if value is null/undefined/empty string
   */
  const updateQueryParams = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>, replace = false) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      setSearchParams(params, { replace });
    },
    [searchParams, setSearchParams]
  );

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initSearch);
  const [tempSearchQuery, setTempSearchQuery] = useState(initSearch);
  const [appliedFilters, setAppliedFilters] = useState(initFilters);
  const [showMyIssuesOnly, setShowMyIssuesOnly] = useState(initMyIssues);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // UI State
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<
    Array<{ row: number; errors: string[] }>
  >([]);
  const [importResults, setImportResults] = useState({ created: 0, failed: 0 });

  // Column display state
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem("issuesTableColumnOrder");
    return savedOrder
      ? JSON.parse(savedOrder)
      : [
        "id",
        "project_name",
        "milestone_name",
        "task_name",
        "sub_task_name",
        "title",
        "issue_type",
        "priority",
        "status",
        "assigned_to",
        "start_date",
        "due_date",
      ];
  });

  // Kanban/List view state - initialized from URL, fallback to localStorage
  const [selectedView, setSelectedView] = useState<"Kanban" | "List">(() => {
    // Check URL first, then localStorage for backward compatibility
    return initView;
  });
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const viewDropdownRef = useRef<HTMLDivElement>(null);

  // Sync view preference to both URL and localStorage
  useEffect(() => {
    localStorage.setItem("issuePageViewPreference", selectedView);
    updateQueryParams({ view: selectedView }, true);
  }, [selectedView, updateQueryParams]);

  // Handle click outside for view dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        viewDropdownRef.current &&
        !viewDropdownRef.current.contains(event.target as Node)
      ) {
        setIsViewDropdownOpen(false);
      }
    };

    if (isViewDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isViewDropdownOpen]);

  // Build filter string based on current state
  let filterString = "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const myIssuesFilter = user.id ? `q[responsible_person_id_eq]=${user.id.toString()}` : "";

  if (appliedFilters !== "") {
    // If custom filters are applied, combine with myIssues filter if enabled
    filterString = appliedFilters;
    if (showMyIssuesOnly && myIssuesFilter) {
      filterString = `${filterString}&${myIssuesFilter}`;
    }
  } else if (showMyIssuesOnly) {
    filterString = myIssuesFilter;
  } else if (projectId || projectIdParam || taskIdParam || milestoneIdParam) {
    const params = [];
    if (projectId || projectIdParam) {
      params.push(`q[project_management_id_eq]=${projectId || projectIdParam}`);
    }
    if (taskIdParam) {
      params.push(`q[task_management_id_eq]=${taskIdParam}`);
    }
    if (milestoneIdParam) {
      params.push(`q[milestone_id_eq]=${milestoneIdParam}`);
    }
    filterString = params.join("&");
  }

  // TanStack Query hooks for server state management
  const {
    data: issuesData,
    isLoading,
    isFetching,
  } = useIssues({
    baseUrl,
    token,
    page: currentPage,
    filters: filterString,
    search: searchQuery,
    enabled: !!token,
  });

  // Extract issues and pagination from response
  const rawIssues = issuesData?.issues || [];
  const pagination = {
    current_page: issuesData?.pagination?.current_page || 1,
    total_count: issuesData?.pagination?.total_count || 0,
    total_pages: issuesData?.pagination?.total_pages || 0,
  };

  // TanStack Query mutations
  const updateMutation = useUpdateIssue();
  const importMutation = useImportIssues();
  const downloadMutation = useDownloadSampleIssueFile();

  // Map API response to table format
  const mapIssueData = (issue: any): Issue => {
    return {
      id: issue.id?.toString() || "",
      project_name: issue.project_management_name || "Not Selected",
      milestone_name: issue.milstone_name || "Not Selected",
      task_name: issue.task_management_name || "Not Selected",
      sub_task_name: issue.sub_task_management_name || "Not Selected",
      title: issue.title || "",
      description: issue.description || "",
      issue_type: issue.issue_type || "",
      priority: issue.priority || "",
      status: issue.status || "Open",
      assigned_to: issue.responsible_person_id,
      raised_by: issue?.created_by?.name,
      created_by: issue.created_by?.full_name || issue.created_by_name || "",
      created_at: issue.created_at || "",
      updated_at: issue.updated_at || "",
      start_date: issue.start_date
        ? new Date(issue.start_date).toLocaleDateString()
        : "",
      due_date: issue.end_date
        ? new Date(issue.end_date).toLocaleDateString()
        : issue.target_date
          ? new Date(issue.target_date).toLocaleDateString()
          : "",
      project_id: issue.project_management_id || issue.project_id || "",
      milestone_id: issue.milestone_id || "",
      task_id: issue.task_management_id || issue.task_id || "",
      comment: issue.comments[issue.comments.length - 1]?.body || "",
    };
  };

  // Determine which issues to display - simplified with TanStack Query
  const displayIssues = useMemo(() => {
    return Array.isArray(rawIssues) ? rawIssues : [];
  }, [rawIssues]);

  const issues: Issue[] = displayIssues.map(mapIssueData);

  const [users, setUsers] = useState([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [openIssueModal, setOpenIssueModal] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  }, [baseUrl, token]);

  const getProjects = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/project_managements/projects_for_dropdown.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const projectsList =
        response.data ||
        [];
      setProjects(projectsList);
    } catch (error) {
      console.log("Error fetching projects:", error);
    }
  }, [baseUrl, token]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/issue_types.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const issueTypes = response.data || [];
      const mappedTypes = issueTypes.map((i: any) => ({
        value: i.id,
        label: i.name,
      }));
      setIssueTypeOptions(mappedTypes);
    } catch (error) {
      console.error("Error fetching issue types:", error);
      toast.error("Failed to load issue types.");
    }
  }, [baseUrl, token]);

  useEffect(() => {
    if (token && baseUrl) {
      getUsers();
      getProjects();
      fetchData();
    }
  }, [token, baseUrl]);

  // Sync myIssuesOnly to URL
  useEffect(() => {
    updateQueryParams(
      {
        myIssues: showMyIssuesOnly ? undefined : "false",
      },
      true
    );
  }, [showMyIssuesOnly, updateQueryParams]);

  // Sync URL changes to component state (browser back/forward/pasted URL)
  // Only sync when URL actually changes from external navigation
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlFilters = searchParams.get("filters") || "";
    const urlView = (searchParams.get("view") || "List") as "Kanban" | "List";
    const urlMyIssues = searchParams.get("myIssues") !== "false";

    // Only update state if URL values differ (avoids circular updates)
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
      setTempSearchQuery(urlSearch);
    }
    if (urlFilters !== appliedFilters) {
      setAppliedFilters(urlFilters);
    }
    if (urlView !== selectedView) {
      setSelectedView(urlView);
    }
    if (urlMyIssues !== showMyIssuesOnly) {
      setShowMyIssuesOnly(urlMyIssues);
    }
  }, [searchParams]);

  // Debounced search effect - updates state and URL after 500ms
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setSearchQuery(tempSearchQuery);
      setCurrentPage(1);
      // Update URL with search
      updateQueryParams(
        {
          search: tempSearchQuery || undefined,
        },
        true
      );
    }, 500); // 500ms debounce delay

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [tempSearchQuery, updateQueryParams]);

  const handleOpenDialog = () => setOpenIssueModal(true);

  const renderActions = (item: any) => (
    <div className="flex items-center justify-center gap-2">
      {shouldShow("employee_project_issues", "show") && (
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => {
            if (location.pathname.startsWith("/business-compass/issues")) {
              navigate(`/business-compass/issues/${item.id}`);
            } else {
              navigate(`/vas/issues/${item.id}`);
            }
          }}
          title="View Issue Details"
        >
          <Eye className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const handleIssueTypeChange = async (issueId: string, newType: string) => {
    try {
      await updateMutation.mutateAsync({
        id: issueId,
        data: { issue_type: newType },
        baseUrl,
        token,
      });
      toast.success("Issue type updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update issue type");
    }
  };

  const handleIssueUpdate = async (issueId: string, assignedToId: string) => {
    try {
      await updateMutation.mutateAsync({
        id: issueId,
        data: { responsible_person_id: assignedToId },
        baseUrl,
        token,
      });
      toast.success("Issue updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update issue");
    }
  };

  const handleIssueStatusChange = async (
    issueId: string,
    newStatus: string
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: issueId,
        data: { status: newStatus },
        baseUrl,
        token,
      });
      toast.success("Issue status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update issue status");
    }
  };

  const handleSampleDownload = async () => {
    try {
      await downloadMutation.mutateAsync({
        baseUrl,
        token,
      });
      const blob = await downloadMutation.mutateAsync({
        baseUrl,
        token,
      });

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample_issues.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Sample format downloaded successfully");
    } catch (error) {
      console.error("Error downloading sample file:", error);
      toast.error("Failed to download sample file. Please try again.");
    }
  };

  const handleImportIssues = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    try {
      const response = await importMutation.mutateAsync({
        file: selectedFile,
        baseUrl,
        token,
      });

      // Parse the response
      const data = response;
      const importResult = data.import_result;

      const created = importResult?.created || 0;
      const failed = importResult?.failed || [];

      setImportResults({ created, failed: failed.length });

      // If there are errors, show error modal
      if (failed && failed.length > 0) {
        setImportErrors(failed);
        setIsErrorModalOpen(true);
      } else {
        // Success case - show toast and close modal
        toast.success(`Successfully imported ${created} issues`);
        setIsImportModalOpen(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to import issues");
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "title") {
      return (
        <div
          className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
          title={item.title}
        >
          {item.title}
        </div>
      );
    }
    if (columnKey === "priority") {
      return item[columnKey];
    }
    if (columnKey === "status") {
      const statusColorMap = {
        open: { dot: "bg-blue-500" },
        in_progress: { dot: "bg-amber-500" },
        on_hold: { dot: "bg-gray-500" },
        completed: { dot: "bg-teal-500" },
        reopen: { dot: "bg-orange-500" },
        closed: { dot: "bg-red-500" },
      };

      const colors =
        statusColorMap[item.status as keyof typeof statusColorMap] ||
        statusColorMap.open;

      return (
        <FormControl
          variant="standard"
          sx={{ width: 148 }} // same as w-32
        >
          <Select
            value={item.status}
            onChange={(e) =>
              handleIssueStatusChange(item.id, e.target.value as string)
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
                  {ISSUSE_STATUS.find((opt) => opt.value === value)?.label ||
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
            {ISSUSE_STATUS.map((opt) => {
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
    if (columnKey === "issue_type") {
      return (
        <FormControl
          variant="standard"
          sx={{ width: 128 }} // same as w-32
        >
          <Select
            value={item.issue_type}
            onChange={(e) =>
              handleIssueTypeChange(item.id, e.target.value as string)
            }
            disableUnderline
            sx={{
              fontSize: "0.875rem",
              cursor: "pointer",
              "& .MuiSelect-select": {
                padding: "4px 0",
              },
            }}
          >
            {issueTypeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    if (columnKey === "assigned_to") {
      return (
        <FormControl
          variant="standard"
          sx={{ width: 188 }} // same as w-32
        >
          <Select
            value={item.assigned_to}
            onChange={(e) =>
              handleIssueUpdate(item.id, e.target.value as string)
            }
            disableUnderline
            sx={{
              fontSize: "0.875rem",
              cursor: "pointer",
              "& .MuiSelect-select": {
                padding: "4px 0",
              },
            }}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    if (columnKey === "comment") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
                {item.comment || "No comment"}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[20rem] rounded-[5px] text-wrap">
              <p className="mx-2">{item.comment || "No comment"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return item[columnKey];
  };

  const leftActions = (
    <>
      {shouldShow("employee_project_issues", "create") && (
        // <Button
        //     className="bg-[#C72030] hover:bg-[#A01020] text-white"
        //     onClick={handleOpenDialog}
        // >
        //     <Plus className="w-4 h-4 mr-2" />
        //     Add
        // </Button>
        <Button
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
          onClick={() => setShowActionPanel(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Action
        </Button>
      )}

      <div className="flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-gray-700 font-medium text-sm">Total Issues:</span>
        <span className="text-lg font-bold text-[#C72030]">
          {pagination?.total_count || 0}
        </span>
      </div>
    </>
  );

  const rightActions = (
    <div className="flex items-center gap-1 mr-4">
      <span className="text-gray-700 font-medium text-sm">My Issues</span>
      <Switch
        checked={!showMyIssuesOnly}
        onChange={() => setShowMyIssuesOnly(!showMyIssuesOnly)}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#C72030",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#C72030",
          },
        }}
      />
      <span className="text-gray-700 font-medium text-sm">All Issues</span>

      {/* View Toggle */}
      <div className="relative ml-2" ref={viewDropdownRef}>
        <button
          onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
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

        {isViewDropdownOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
            <div className="py-2">
              <button
                onClick={() => {
                  setSelectedView("Kanban");
                  setIsViewDropdownOpen(false);
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
                  setIsViewDropdownOpen(false);
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
    </div>
  );

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      page > pagination.total_pages ||
      page === pagination.current_page ||
      isLoading
    ) {
      return;
    }
    setCurrentPage(page);
    // URL sync handled by useEffect above
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const pagesToShow = new Set<number>();

    // Always show first and last page
    pagesToShow.add(1);
    pagesToShow.add(totalPages);

    // Show current page and neighbors
    pagesToShow.add(currentPage);
    if (currentPage > 1) pagesToShow.add(currentPage - 1);
    if (currentPage < totalPages) pagesToShow.add(currentPage + 1);

    // For large pagination, show 2-3 pages around first and last
    if (totalPages > 7) {
      pagesToShow.add(2);
      pagesToShow.add(totalPages - 1);
    }

    const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);

    // Render pages with ellipsis
    sortedPages.forEach((page, index) => {
      // Add ellipsis if gap exists
      if (index > 0 && sortedPages[index - 1] < page - 1) {
        items.push(
          <PaginationItem key={`ellipsis-${sortedPages[index - 1]}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={page} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(page)}
            isActive={currentPage === page}
            aria-disabled={isFetching}
            className={isFetching ? "pointer-events-none opacity-50" : ""}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });

    return items;
  };

  const handleSearchChange = (value: string) => {
    setTempSearchQuery(value);
  };

  if (selectedView === "Kanban") {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {shouldShow("employee_project_issues", "create") && (
              <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => setShowActionPanel(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Action
              </Button>
            )}
            <div className="flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-gray-700 font-medium text-sm">
                Total Issues:
              </span>
              <span className="text-lg font-bold text-[#C72030]">
                {pagination?.total_count || 0}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-gray-700 font-medium text-sm">
                My Issues
              </span>
              <Switch
                checked={!showMyIssuesOnly}
                onChange={() => setShowMyIssuesOnly(!showMyIssuesOnly)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#C72030",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#C72030",
                  },
                }}
              />
              <span className="text-gray-700 font-medium text-sm">
                All Issues
              </span>
            </div>

            <div className="relative" ref={viewDropdownRef}>
              <button
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                <span className="text-[#C72030] font-medium flex items-center gap-2">
                  <ChartNoAxesColumn className="w-4 h-4 rotate-180 text-[#C72030]" />
                  Kanban
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {isViewDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedView("Kanban");
                        setIsViewDropdownOpen(false);
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
                        setIsViewDropdownOpen(false);
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
          </div>
        </div>

        <IssueManagementKanban
          showMyIssuesOnly={showMyIssuesOnly}
          appliedFilters={appliedFilters}
          projectId={projectId}
          projectIdParam={projectIdParam}
          taskIdParam={taskIdParam}
          milestoneIdParam={milestoneIdParam}
          onRefresh={() => {
            // TanStack Query will auto-refetch when needed
          }}
        />

        {showActionPanel && (
          <SelectionPanel
            onAdd={handleOpenDialog}
            onImport={() => setIsImportModalOpen(true)}
            onClearSelection={() => setShowActionPanel(false)}
          />
        )}

        <IssueFilterModal
          isModalOpen={isFilterModalOpen}
          setIsModalOpen={setIsFilterModalOpen}
          onApplyFilters={(filterString) => {
            setAppliedFilters(filterString);
            setCurrentPage(1);
            updateQueryParams({
              filters: filterString || undefined,
            });
          }}
          issueTypes={issueTypeOptions}
          users={users}
          projects={projects}
        />

        <AddIssueModal
          openDialog={openIssueModal}
          handleCloseDialog={() => setOpenIssueModal(false)}
          preSelectedProjectId={
            preSelectedProjectId || projectId || projectIdParam
          }
        />

        <CommonImportModal
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          title="Import Issues"
          entityType="issues"
          onSampleDownload={handleSampleDownload}
          onImport={handleImportIssues}
          isUploading={importMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <EnhancedTable
        data={issues}
        columns={columns}
        renderActions={renderActions}
        searchValue={tempSearchQuery}
        onSearchChange={(searchTerm) => handleSearchChange(searchTerm)}
        renderCell={renderCell}
        loading={isFetching}
        leftActions={leftActions}
        onFilterClick={() => setIsFilterModalOpen(true)}
        rightActions={rightActions}
        emptyMessage={
          issues.length === 0 && !isFetching
            ? "No issues found. Create one to get started."
            : ""
        }
      />

      {showActionPanel && (
        <SelectionPanel
          onAdd={handleOpenDialog}
          onImport={() => setIsImportModalOpen(true)}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      {/* Issue Filter Modal */}
      <IssueFilterModal
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
        onApplyFilters={(filterString) => {
          setAppliedFilters(filterString);
          setCurrentPage(1);
          updateQueryParams({
            filters: filterString || undefined,
          });
        }}
        issueTypes={issueTypeOptions}
        users={users}
        projects={projects}
      />

      {/* Add Issue Modal */}
      <AddIssueModal
        openDialog={openIssueModal}
        handleCloseDialog={() => setOpenIssueModal(false)}
        preSelectedProjectId={
          preSelectedProjectId || projectId || projectIdParam
        }
      />

      <CommonImportModal
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        title="Import Issues"
        entityType="issues"
        onSampleDownload={handleSampleDownload}
        onImport={handleImportIssues}
        isUploading={importMutation.isPending}
      />

      {/* Import Error Modal */}
      <Dialog
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "18px",
            borderBottom: "2px solid #E95420",
          }}
        >
          Import Summary
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded">
                <div className="text-xs text-gray-600">
                  Successfully Created
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {importResults.created}
                </div>
              </div>
              <div className="flex-1 p-3 bg-red-50 border border-red-200 rounded">
                <div className="text-xs text-gray-600">Failed Records</div>
                <div className="text-2xl font-bold text-red-600">
                  {importResults.failed}
                </div>
              </div>
            </div>

            {/* Error Details */}
            {importErrors.length > 0 && (
              <div className="bg-gray-50 rounded border border-gray-200 p-4 max-h-96 overflow-y-auto">
                <div className="text-sm font-semibold mb-3 text-gray-700">
                  Error Details:
                </div>
                <div className="space-y-3">
                  {importErrors.map((error, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded border border-gray-200"
                    >
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Row {error.row}
                      </div>
                      <div className="text-sm text-red-600 space-y-1">
                        {error.errors?.map((err, errIdx) => (
                          <div key={errIdx} className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{err}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsErrorModalOpen(false);
                  setIsImportModalOpen(false);
                  setSelectedFile(null);
                }}
              >
                Close & Refresh
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.current_page))
                }
                className={
                  pagination.current_page === 1 || isFetching
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(
                    Math.min(
                      pagination.total_pages,
                      pagination.current_page
                    )
                  )
                }
                className={
                  pagination.current_page === pagination.total_pages ||
                    isFetching
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default IssuesListPage;
