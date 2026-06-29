import axios from "axios";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  forwardRef,
  Fragment,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChevronDown,
  ChevronDownCircle,
  Eye,
  Loader2,
  Users,
  X,
  Play,
  Pause,
  Search,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  FormControl,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useLayout } from "@/contexts/LayoutContext";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  fetchSprintById,
  updateSprintStatus,
} from "@/store/slices/sprintSlice";
import SprintTasks from "@/components/SprintTasks";
import SprintIssues from "@/components/SprintIssues";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import IssueFilterModal from "@/components/IssueFilterModal";

const SlideTransition = forwardRef(function SlideTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface SprintDetails {
  id?: string | number;
  title?: string;
  created_by_name?: string; // align naming to milestone page
  created_at?: string;
  status?: string;
  responsible_person?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  total_tasks?: number;
  total_issues?: number;
  total_effective_minutes?: number;
  total_actual_minutes?: number;
}

interface Task {
  id?: string | number;
  task_title?: string;
  status?: string;
  responsible_person?: string;
  target_date?: string;
  priority?: string;
  estimated_hour?: number;
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
    key: "target_date",
    label: "Target Date",
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
    key: "estimated_hour",
    label: "Estimated Hours",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

function formatToDDMMYYYY_AMPM(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, "0");
  return `${day}/${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
}

const calculateDuration = (start?: string, end?: string) => {
  if (!start || !end) return "";
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999);
  if (now < startDate) return "Not started";
  const diffMs = endDate.getTime() - now.getTime();
  if (diffMs <= 0) return "0s";
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  return `${days > 0 ? days + "d " : ""}${remainingHours > 0 ? remainingHours + "h " : ""}${remainingMinutes > 0 ? remainingMinutes + "m" : ""}`;
};

const CountdownTimer = ({
  startDate,
  targetDate,
}: {
  startDate?: string;
  targetDate?: string;
}) => {
  const [countdown, setCountdown] = useState(
    calculateDuration(startDate, targetDate)
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateDuration(startDate, targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, startDate]);
  return (
    <div className="text-left text-[#029464] text-[12px]">{countdown}</div>
  );
};

// Define API shapes based on backend response
interface TaskManagement {
  id: number;
  title?: string;
  status?: string;
  priority?: string;
  target_date?: string;
  started_at?: string;
  completed_at?: string;
  responsible_person_id?: number;
  responsible_person_name?: string;
  milestone_id?: number;
  estimated_hour?: number;
  [key: string]: any;
}

interface ApiSprintTask {
  id: number;
  is_started?: boolean;
  sprint_id?: number;
  task_id?: number;
  created_at?: string;
  title?: string;
  task_code?: string;
  responsible_person_name?: string;
  responsible_person_id?: number;
  created_by_name?: string;
  status?: string;
  priority?: string;
  target_date?: string;
  expected_start_date?: string;
  estimated_hour?: number;
  active_time_till_now?: string;
  total_allocated_hours?: string | number;
  started_at?: string;
  completed_at?: string;
  milestone_id?: number;
  milestone_title?: string;
  project_management_title?: string;
  project_status_id?: number;
  predecessor_task?: string | any[];
  successor_task?: string | any[];
  completed_sub_tasks?: number;
  total_sub_tasks?: number;
  completed_issues?: number;
  total_issues?: number;
}

interface ApiSprint {
  id: number;
  name?: string;
  title?: string;
  description?: string | null;
  project_id?: number;
  duration?: string | null;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  owner_id?: number | null;
  sprint_owner_name?: string | null;
  status?: string; // e.g., "open"
  priority?: string | null;
  created_at?: string;
  updated_at?: string;
  associated_projects_count?: number;
  sprint_task_managements?: ApiSprintTask[];
  total_tasks?: number;
  total_issues?: number;
  sprint_issues?: any[];
  total_members?: number;
  total_effective_minutes?: number;
  total_actual_minutes?: number;
  created_by_name?: string; // not present in API response, will be set to "-" in mapping
}

// Normalize raw status to display value
const mapStatusToDisplay = (raw?: string) => {
  if (!raw) return "Open";
  const m: Record<string, string> = {
    open: "Open",
    in_progress: "In Progress",
    on_hold: "On Hold",
    overdue: "Overdue",
    completed: "Completed",
    active: "Active",
  };
  return m[raw.toLowerCase()] ?? raw;
};

const STATUS_COLORS = {
  active: "bg-[#E4636A] text-white",
  in_progress: "bg-[#08AEEA] text-white",
  on_hold: "bg-[#7BD2B5] text-black",
  overdue: "bg-[#FF2733] text-white",
  completed: "bg-[#83D17A] text-black",
};

const mapDisplayToApiStatus = (displayStatus) => {
  const reverseStatusMap = {
    Active: "active",
    "In Progress": "in_progress",
    "On Hold": "on_hold",
    Overdue: "overdue",
    Completed: "completed",
  };
  return reverseStatusMap[displayStatus] || "open";
};

const dropdownOptions = [
  "Open",
  "In Progress",
  "On Hold",
  "Overdue",
  "Completed",
];

interface SprintMember {
  id: number | string;
  name: string;
  role: "owner" | "assignee";
}

interface MemberSummary {
  member_id: number;
  member_name: string;
  email: string;
  department_name?: string;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  total_issues: number;
  completed_issues: number;
  pending_issues: number;
  task_effective_minutes: number;
  task_actual_minutes: number;
  issue_effective_minutes: number;
  issue_actual_minutes: number;
  total_effective_minutes: number;
  total_actual_minutes: number;
}

const fmtMin = (m: number) => {
  if (!m) return "—";
  if (m >= 60) return `${(m / 60).toFixed(1)}h`;
  return `${m}m`;
};

const AVATAR_COLORS = [
  "#E95420",
  "#08AEEA",
  "#7BD2B5",
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#EC4899",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const extractMembers = (api: ApiSprint): SprintMember[] => {
  const members: SprintMember[] = [];
  const seen = new Set<string>();

  if (api.sprint_owner_name && api.owner_id != null) {
    const key = `${api.owner_id}`;
    seen.add(key);
    members.push({
      id: api.owner_id,
      name: api.sprint_owner_name,
      role: "owner",
    });
  }

  (api.sprint_task_managements ?? []).forEach((t) => {
    const tm = t;
    if (tm?.responsible_person_name && tm?.responsible_person_id != null) {
      const key = `${tm.responsible_person_id}`;
      if (!seen.has(key)) {
        seen.add(key);
        members.push({
          id: tm.responsible_person_id,
          name: tm.responsible_person_name,
          role: "assignee",
        });
      }
    }
  });

  return members;
};

// Map API sprint -> local details type
const fmtMinutes = (m?: number): string => {
  if (m == null) return "-";
  if (m === 0) return "0m";
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h > 0 && min > 0) return `${h}h ${min}m`;
  if (h > 0) return `${h}h`;
  return `${min}m`;
};

const mapApiToDetails = (api: ApiSprint): SprintDetails => ({
  id: api.id,
  title: api.title ?? api.name,
  created_by_name: api.created_by_name ?? "-", // field not present in sprint response
  created_at: api.created_at,
  status: mapStatusToDisplay(api.status),
  responsible_person: api.sprint_owner_name ?? "-",
  priority: api.priority ?? "-",
  start_date: api.start_date,
  end_date: api.end_date,
  total_tasks: api.total_tasks,
  total_issues: api.total_issues,
  total_effective_minutes: api.total_effective_minutes,
  total_actual_minutes: api.total_actual_minutes,
});

// Map API sprint_tasks -> table rows
const mapApiTasks = (api: ApiSprint): Task[] => {
  const list = api.sprint_task_managements ?? [];
  return list.map((t) => {
    const taskMgmt = t;
    return {
      id: taskMgmt.id,
      is_started: taskMgmt.is_started,
      task_code: taskMgmt?.task_code ?? "-",
      title: taskMgmt?.title ?? `Task #${t.task_id ?? t.id}`,
      project_management_title: taskMgmt?.project_management_title ?? "-",
      milestone_title: taskMgmt?.milestone_title ?? "-",
      status: mapStatusToDisplay(taskMgmt?.status),
      project_status_id: taskMgmt?.project_status_id ?? "1",
      responsible_person_id: taskMgmt?.responsible_person_id ?? "-",
      created_by_name: taskMgmt?.created_by_name ?? "-",
      expected_start_date: taskMgmt?.expected_start_date,
      target_date: taskMgmt?.target_date ?? "",
      active_time_till_now: taskMgmt?.active_time_till_now ?? "",
      total_allocated_hours: taskMgmt?.total_allocated_hours ?? "",
      priority: taskMgmt?.priority ?? "-",
      predecessor_task: taskMgmt?.predecessor_task ?? "-",
      successor_task: taskMgmt?.successor_task ?? "-",
      completed_sub_tasks: taskMgmt?.completed_sub_tasks ?? 0,
      total_sub_tasks: taskMgmt?.total_sub_tasks ?? 0,
      completed_issues: taskMgmt?.completed_issues ?? 0,
      total_issues: taskMgmt?.total_issues ?? 0,
    };
  });
};

const SprintTaskList = ({ sprintId, initialMemberId }: { sprintId: string; initialMemberId?: number }) => {
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const [sprintTasks, setSprintTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  // Filter state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedResponsible, setSelectedResponsible] = useState<number[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedWorkflowStatus, setSelectedWorkflowStatus] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [dates, setDates] = useState({ startDate: "", endDate: "", completedAt: "" });
  const [projectOptions, setProjectOptions] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const debounceTimerTask = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRenderTask = useRef(true);
  const [dropdowns, setDropdowns] = useState({
    status: false, workflowStatus: false, responsiblePerson: false,
    createdBy: false, project: false, tags: false,
    startDate: false, endDate: false, completedAt: false,
  });
  const [searchTerms, setSearchTerms] = useState({
    status: "", workflowStatus: "", responsiblePerson: "",
    createdBy: "", project: "", tags: "",
  });

  const fetchTasks = useCallback(async (filters: Record<string, any> = {}, page: number = 1, search = "") => {
    setLoadingTasks(true);
    try {
      const params: Record<string, any> = { ...filters, page };
      if (search.trim()) params["q[title_or_task_code_or_description_cont]"] = search.trim();
      const r = await axios.get(
        `https://${baseUrl}/sprints/${sprintId}/sprint_task_list.json`,
        { headers: { Authorization: `Bearer ${token}` }, params }
      );
      setSprintTasks(r.data?.task_managements || r.data?.data?.task_managements || []);
      setPaginationData(r.data?.pagination || r.data?.data?.pagination || null);
    } catch (e) {
      console.error("Error fetching sprint task list:", e);
    } finally {
      setLoadingTasks(false);
    }
  }, [sprintId, baseUrl, token]);

  useEffect(() => {
    if (!sprintId) return;
    if (initialMemberId != null) {
      const params = { "q[responsible_person_id_in][]": [initialMemberId] };
      setSelectedResponsible([initialMemberId]);
      setActiveFilters(params);
      fetchTasks(params, 1, "");
    } else {
      fetchTasks({}, 1, "");
    }
  }, [fetchTasks]);

  useEffect(() => {
    if (isFirstRenderTask.current) { isFirstRenderTask.current = false; return; }
    if (initialMemberId == null) return;
    const params = { "q[responsible_person_id_in][]": [initialMemberId] };
    setSelectedResponsible([initialMemberId]);
    setActiveFilters(params);
    fetchTasks(params, 1, "");
  }, [initialMemberId]);

  useEffect(() => {
    if (debounceTimerTask.current) clearTimeout(debounceTimerTask.current);
    debounceTimerTask.current = setTimeout(() => {
      setSearchQuery(tempSearchQuery);
      setCurrentPage(1);
      fetchTasks(activeFilters, 1, tempSearchQuery);
    }, 500);
    return () => { if (debounceTimerTask.current) clearTimeout(debounceTimerTask.current); };
  }, [tempSearchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const r = await axios.get(
          `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(r.data?.users || []);
      } catch (e) { }
    };
    const fetchStatuses = async () => {
      try {
        const r = await axios.get(
          `https://${baseUrl}/project_statuses.json?q[active_eq]=true`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatuses(r.data || []);
      } catch (e) { }
    };
    const fetchProjects = async () => {
      try {
        const r = await axios.get(
          `https://${baseUrl}/project_managements/projects_for_dropdown.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(r.data)) {
          setProjectOptions(r.data.map((p: any) => ({ label: p.name || p.title, value: p.id })));
        }
      } catch (e) { }
    };
    const fetchTagsList = async () => {
      try {
        const r = await axios.get(`https://${baseUrl}/company_tags.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTags(r.data || []);
      } catch (e) { }
    };
    fetchUsers();
    fetchStatuses();
    fetchProjects();
    fetchTagsList();
  }, [baseUrl, token]);

  const toggleDropdown = (key: keyof typeof dropdowns) => {
    setDropdowns(prev => {
      const isOpen = prev[key];
      if (isOpen) return { ...prev, [key]: false };
      return {
        status: false, workflowStatus: false, responsiblePerson: false,
        createdBy: false, project: false, tags: false,
        startDate: false, endDate: false, completedAt: false,
        [key]: true,
      };
    });
  };

  const toggleOption = (value: any, selected: any[], setSelected: React.Dispatch<React.SetStateAction<any[]>>) => {
    setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const renderCheckboxList = (options: any[], selected: any[], setSelected: React.Dispatch<React.SetStateAction<any[]>>, searchTerm = "") => {
    const filtered = options.filter(opt =>
      typeof opt === "string"
        ? opt.toLowerCase().includes(searchTerm.toLowerCase())
        : opt.label?.toLowerCase().includes(searchTerm.toLowerCase()) || opt.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <div className="max-h-40 overflow-y-auto p-2">
        {filtered.map(option => {
          const label = typeof option === "string" ? option : (option.label || option.full_name);
          const value = typeof option === "string" ? option : option.value;
          return (
            <label key={value} className="flex items-center gap-2 py-2 px-2 text-sm cursor-pointer hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={selected.includes(value)}
                onChange={() => toggleOption(value, selected, setSelected)}
              />
              <span>{label}</span>
            </label>
          );
        })}
        {filtered.length === 0 && <div className="text-center text-gray-400 text-sm py-2">No results found</div>}
      </div>
    );
  };

  const buildFilterParams = () => {
    const params: Record<string, any> = {};
    if (selectedStatuses.length > 0) params["q[status_in][]"] = selectedStatuses;
    if (selectedWorkflowStatus.length > 0) params["q[project_status_id_in][]"] = selectedWorkflowStatus;
    if (selectedResponsible.length > 0) params["q[responsible_person_id_in][]"] = selectedResponsible;
    if (selectedCreators.length > 0) params["q[created_by_id_in][]"] = selectedCreators;
    if (selectedProjects.length > 0) params["q[project_management_id_in][]"] = selectedProjects;
    if (selectedTags.length > 0) params["q[task_tags_company_tag_id_in][]"] = selectedTags;
    if (dates.startDate) params["q[start_date_eq]"] = dates.startDate;
    if (dates.endDate) params["q[end_date_eq]"] = dates.endDate;
    if (dates.completedAt) {
      params["q[completed_at_gteq]"] = `${dates.completedAt}T00:00:00`;
      params["q[completed_at_lteq]"] = `${dates.completedAt}T23:59:59`;
    }
    return params;
  };

  const handleApplyFilter = () => {
    const params = buildFilterParams();
    setActiveFilters(params);
    setCurrentPage(1);
    fetchTasks(params, 1, searchQuery);
    setIsFilterModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page === currentPage || loadingTasks) return;
    if (paginationData && page > paginationData.total_pages) return;
    setCurrentPage(page);
    fetchTasks(activeFilters, page, searchQuery);
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setSelectedResponsible([]);
    setSelectedCreators([]);
    setSelectedProjects([]);
    setSelectedWorkflowStatus([]);
    setSelectedTags([]);
    setDates({ startDate: "", endDate: "", completedAt: "" });
    setSearchTerms({ status: "", workflowStatus: "", responsiblePerson: "", createdBy: "", project: "", tags: "" });
    setActiveFilters({});
    setCurrentPage(1);
    fetchTasks({}, 1, searchQuery);
  };

  const STATUS_FILTER_OPTIONS = [
    { value: "open", label: "Open", color: "bg-[#c85e68]" },
    { value: "in_progress", label: "In Progress", color: "bg-yellow-500" },
    { value: "completed", label: "Completed", color: "bg-green-400" },
    { value: "on_hold", label: "On Hold", color: "bg-grey-500" },
    { value: "overdue", label: "Overdue", color: "bg-red-500" },
  ];

  const apiCall = async (id: number, body: object) => {
    await axios.put(`https://${baseUrl}/task_managements/${id}.json`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    fetchTasks();
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await apiCall(id, { task_management: { status } });
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleWorkflowStatusChange = async (id: number, statusId: string) => {
    try {
      await apiCall(id, { task_management: { project_status_id: statusId } });
      toast.success("Workflow status updated");
    } catch {
      toast.error("Failed to update workflow status");
    }
  };

  const handlePlayTask = async (id: number) => {
    try {
      await apiCall(id, { task_management: { status: "started" } });
      toast.success("Task started successfully");
    } catch {
      toast.error("Failed to start task");
    }
  };

  const handlePauseTask = async (id: number) => {
    try {
      await apiCall(id, { task_management: { status: "stopped" } });
      toast.success("Task paused");
    } catch {
      toast.error("Failed to pause task");
    }
  };

  const calcTaskDuration = (
    start?: string,
    end?: string
  ): { text: string; isOverdue: boolean } => {
    if (!end) return { text: "N/A", isOverdue: false };
    const now = new Date();
    const startDate = start ? new Date(start) : now;
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    if (now < startDate) return { text: "Not started", isOverdue: false };
    const diffMs = endDate.getTime() - now.getTime();
    const abs = Math.abs(diffMs);
    const isOverdue = diffMs <= 0;
    const s = Math.floor(abs / 1000),
      m = Math.floor(s / 60),
      h = Math.floor(m / 60),
      d = Math.floor(h / 24);
    const text = `${d > 0 ? d + "d " : "0d "}${h % 24 > 0 ? (h % 24) + "h " : "0h "}${m % 60 > 0 ? (m % 60) + "m" : "0m"}`;
    return { text, isOverdue };
  };

  const fmtHours = (hours: number): string => {
    if (!hours || hours < 1) {
      const min = Math.round((hours || 0) * 60);
      return `${min}min`;
    }
    const wh = Math.floor(hours);
    const rm = Math.round((hours - wh) * 60);
    return rm > 0 ? `${wh}hr ${rm}min` : `${wh}hr`;
  };

  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
  ];

  const statusColorMap: Record<string, string> = {
    open: "bg-blue-500",
    in_progress: "bg-amber-500",
    on_hold: "bg-gray-500",
    completed: "bg-teal-500",
    overdue: "bg-red-500",
  };

  const sprintTaskColumns: ColumnConfig[] = [
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "id",
      label: "Task ID",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "task_code",
      label: "Task Code",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "title",
      label: "Task Title",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "project_management_title",
      label: "Project",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "milestone_title",
      label: "Milestone",
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
      key: "workflowStatus",
      label: "Workflow Status",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "responsible",
      label: "Responsible Person",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "created_by",
      label: "Created By",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "expected_start_date",
      label: "Start Date",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "target_date",
      label: "End Date",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "started_time",
      label: "Actual Efforts Taken",
      sortable: false,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "duration",
      label: "Time Left",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "efforts_duration",
      label: "Efforts Duration",
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
      key: "priority",
      label: "Priority",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "predecessor",
      label: "Predecessor",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "successor",
      label: "Successor",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "completion_percentage",
      label: "Completion %",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
  ];

  const renderProgressBar = (
    completed: number,
    total: number,
    color: string
  ) => {
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
          {completed}
        </span>

        <div className="relative w-[8rem] bg-gray-200 rounded-full h-4 overflow-hidden flex items-center !justify-center">
          <div
            className={`absolute top-0 left-0 h-6 ${color} rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          ></div>
          <span className="relative text-xs font-semibold text-gray-800">
            {Math.round(progress)}%
          </span>
        </div>
        <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
          {total}
        </span>
      </div>
    );
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="p-1"
              onClick={() => navigate(`/vas/tasks/${item.id}`)}
              title="View Task"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      case "id":
        return <span className="w-[80px]">T-{item.id}</span>;
      case "title": {
        const isCompleted = item.status === "completed";
        const hasSubtasks = item.total_sub_tasks > 0;
        return (
          <div className="flex items-center gap-2 w-[20rem]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-full truncate">{item.title}</span>
                </TooltipTrigger>
                <TooltipContent className="rounded-[5px]">
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {!hasSubtasks &&
              !isCompleted &&
              (item.is_started ? (
                <button
                  onClick={() => handlePauseTask(item.id)}
                  className="p-1 hover:bg-gray-200 rounded transition"
                  title="Pause"
                >
                  <Pause size={13} className="text-orange-500" />
                </button>
              ) : (
                <button
                  onClick={() => handlePlayTask(item.id)}
                  className="p-1 hover:bg-gray-200 rounded transition"
                  title="Start"
                >
                  <Play size={13} className="text-green-500" />
                </button>
              ))}
          </div>
        );
      }
      case "status": {
        const dot = statusColorMap[item.status] || "bg-gray-500";
        return (
          <FormControl variant="standard" sx={{ width: 148 }}>
            <MuiSelect
              value={item.status || "open"}
              onChange={(e) =>
                handleStatusChange(item.id, e.target.value as string)
              }
              disableUnderline
              renderValue={(v) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${statusColorMap[v as string] || "bg-gray-500"}`}
                  />
                  <span>
                    {statusOptions.find((o) => o.value === v)?.label || v}
                  </span>
                </div>
              )}
              sx={{
                fontSize: "0.875rem",
                "& .MuiSelect-select": { padding: "4px 0" },
              }}
            >
              {statusOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${statusColorMap[opt.value] || "bg-gray-500"}`}
                  />
                  <span>{opt.label}</span>
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        );
      }
      case "workflowStatus":
        return (
          <FormControl variant="standard" sx={{ width: 128 }}>
            <MuiSelect
              value={item.project_status_id ?? "1"}
              onChange={(e) =>
                handleWorkflowStatusChange(item.id, e.target.value as string)
              }
              disableUnderline
              sx={{
                fontSize: "0.875rem",
                "& .MuiSelect-select": { padding: "4px 0" },
              }}
            >
              {statuses.map((s: any) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.status}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        );
      case "responsible":
        return (
          <FormControl variant="standard" sx={{ minWidth: 180 }}>
            <MuiSelect
              value={item.responsible_person_id ?? ""}
              disableUnderline
              readOnly
              sx={{
                fontSize: "0.875rem",
                "& .MuiSelect-select": { padding: "4px 0" },
              }}
            >
              {users.map((u: any) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.full_name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        );
      case "created_by":
        return item.created_by_name || "-";
      case "subtasks":
        return renderProgressBar(
          item.completed_sub_tasks || 0,
          item.total_sub_tasks || 0,
          "bg-[#b4e7ff]"
        );
      case "issues":
        return renderProgressBar(
          item.completed_issues || 0,
          item.total_issues || 0,
          "bg-[#ff9a9e]"
        );
      case "duration": {
        const dur = calcTaskDuration(
          item.expected_start_date,
          item.target_date
        );
        return (
          <span
            className={`text-[12px] ${dur.isOverdue ? "text-red-600" : "text-[#029464]"}`}
          >
            {dur.text}
          </span>
        );
      }
      case "efforts_duration":
        return fmtHours(item?.total_allocated_hours || 0);
      case "priority":
        return item.priority
          ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1)
          : "-";
      case "started_time":
        return (
          <ActiveTimer
            activeTimeTillNow={item?.active_time_till_now}
            isStarted={item?.is_started}
          />
        );
      case "predecessor":
        return item.predecessor_task?.length || "0";
      case "successor":
        return item.successor_task?.length || "0";
      case "completion_percentage":
        return (
          <input
            type="number"
            defaultValue={item.completion_percent || 0}
            className="border border-gray-200 focus:outline-none p-2 w-[4rem]"
            min={0}
            max={100}
            readOnly
          />
        );
      default:
        return item[columnKey] || "-";
    }
  };

  if (loadingTasks) {
    return (
      <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading sprint tasks…</span>
      </div>
    );
  }

  if (!sprintTasks.length) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No tasks found for this sprint
      </div>
    );
  }

  return (
    <>
      <EnhancedTable
        data={sprintTasks}
        columns={sprintTaskColumns}
        renderCell={renderCell}
        searchValue={tempSearchQuery}
        onSearchChange={(val: string) => setTempSearchQuery(val)}
        onFilterClick={() => setIsFilterModalOpen(true)}
        leftActions={
          <div className="flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-gray-700 font-medium text-sm">Total Tasks:</span>
            <span className="text-lg font-bold text-[#C72030]">{paginationData?.total_count || 0}</span>
          </div>
        }
      />

      {/* Pagination */}
      {paginationData && paginationData.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 || loadingTasks ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {(() => {
                const totalPages = paginationData.total_pages;
                const items = [];
                const showEllipsis = totalPages > 7;
                if (showEllipsis) {
                  items.push(<PaginationItem key={1}><PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1} className="cursor-pointer">1</PaginationLink></PaginationItem>);
                  if (currentPage > 4) {
                    items.push(<PaginationItem key="e1"><PaginationEllipsis /></PaginationItem>);
                  } else {
                    for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
                      items.push(<PaginationItem key={i}><PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i} className="cursor-pointer">{i}</PaginationLink></PaginationItem>);
                    }
                  }
                  if (currentPage > 3 && currentPage < totalPages - 2) {
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                      items.push(<PaginationItem key={i}><PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i} className="cursor-pointer">{i}</PaginationLink></PaginationItem>);
                    }
                  }
                  if (currentPage < totalPages - 3) {
                    items.push(<PaginationItem key="e2"><PaginationEllipsis /></PaginationItem>);
                  } else {
                    for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
                      if (!items.find((it: any) => it.key === String(i))) {
                        items.push(<PaginationItem key={i}><PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i} className="cursor-pointer">{i}</PaginationLink></PaginationItem>);
                      }
                    }
                  }
                  if (totalPages > 1) {
                    items.push(<PaginationItem key={totalPages}><PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages} className="cursor-pointer">{totalPages}</PaginationLink></PaginationItem>);
                  }
                } else {
                  for (let i = 1; i <= totalPages; i++) {
                    items.push(<PaginationItem key={i}><PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i} className="cursor-pointer">{i}</PaginationLink></PaginationItem>);
                  }
                }
                return items;
              })()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(paginationData.total_pages, currentPage + 1))}
                  className={currentPage === paginationData.total_pages || loadingTasks ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Filter Modal */}
      <Dialog
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        TransitionComponent={SlideTransition}
        maxWidth={false}
      >
        <DialogContent
          className="w-full max-w-sm fixed right-0 top-0 rounded-none bg-white text-sm overflow-y-auto h-full"
          style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
          sx={{ padding: "0 !important" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold">Filter</h2>
            <X className="cursor-pointer" onClick={() => setIsFilterModalOpen(false)} />
          </div>

          {/* Filter Sections */}
          <div className="flex-1 overflow-y-auto divide-y">
            {/* Project */}
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("project")}>
                <span className="font-medium text-sm select-none">Project</span>
                {dropdowns.project ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.project && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input
                      type="text" placeholder="Filter project..."
                      className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.project}
                      onChange={e => setSearchTerms({ ...searchTerms, project: e.target.value })}
                    />
                  </div>
                  {renderCheckboxList(projectOptions, selectedProjects, setSelectedProjects, searchTerms.project)}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("status")}>
                <span className="font-medium text-sm select-none">Status</span>
                {dropdowns.status ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.status && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input
                      type="text" placeholder="Filter status..."
                      className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.status}
                      onChange={e => setSearchTerms({ ...searchTerms, status: e.target.value })}
                    />
                  </div>
                  {renderCheckboxList(STATUS_FILTER_OPTIONS, selectedStatuses, setSelectedStatuses, searchTerms.status)}
                </div>
              )}
            </div>

            {/* Workflow Status */}
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("workflowStatus")}>
                <span className="font-medium text-sm select-none">Workflow Status</span>
                {dropdowns.workflowStatus ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.workflowStatus && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input
                      type="text" placeholder="Filter workflow status..."
                      className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.workflowStatus}
                      onChange={e => setSearchTerms({ ...searchTerms, workflowStatus: e.target.value })}
                    />
                  </div>
                  {renderCheckboxList(
                    statuses.map((s: any) => ({ label: s.status, value: s.id })),
                    selectedWorkflowStatus, setSelectedWorkflowStatus, searchTerms.workflowStatus
                  )}
                </div>
              )}
            </div>

            {/* Responsible Person */}
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("responsiblePerson")}>
                <span className="font-medium text-sm select-none">Responsible Person</span>
                {dropdowns.responsiblePerson ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.responsiblePerson && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input
                      type="text" placeholder="Filter responsible person..."
                      className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.responsiblePerson}
                      onChange={e => setSearchTerms({ ...searchTerms, responsiblePerson: e.target.value })}
                    />
                  </div>
                  {renderCheckboxList(
                    users.map((u: any) => ({ label: u.full_name, value: u.id })),
                    selectedResponsible, setSelectedResponsible, searchTerms.responsiblePerson
                  )}
                </div>
              )}
            </div>

            {/* Created By */}
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("createdBy")}>
                <span className="font-medium text-sm select-none">Created By</span>
                {dropdowns.createdBy ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.createdBy && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input
                      type="text" placeholder="Filter created by..."
                      className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.createdBy}
                      onChange={e => setSearchTerms({ ...searchTerms, createdBy: e.target.value })}
                    />
                  </div>
                  {renderCheckboxList(
                    users.map((u: any) => ({ label: u.full_name, value: u.id })),
                    selectedCreators, setSelectedCreators, searchTerms.createdBy
                  )}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("tags")}>
                <span className="font-medium text-sm select-none">Tags</span>
                {dropdowns.tags ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.tags && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input
                      type="text" placeholder="Filter tags..."
                      className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.tags}
                      onChange={e => setSearchTerms({ ...searchTerms, tags: e.target.value })}
                    />
                  </div>
                  {renderCheckboxList(
                    tags.map((t: any) => ({ label: t.name || t.label, value: t.id })),
                    selectedTags, setSelectedTags, searchTerms.tags
                  )}
                </div>
              )}
            </div>

            {/* Start Date */}
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("startDate")}>
                <span className="font-medium text-sm select-none">Start Date</span>
                {dropdowns.startDate ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.startDate && (
                <div className="mt-4">
                  <input
                    type="date" value={dates.startDate}
                    onChange={e => setDates({ ...dates, startDate: e.target.value })}
                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              )}
            </div>

            {/* End Date */}
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("endDate")}>
                <span className="font-medium text-sm select-none">End Date</span>
                {dropdowns.endDate ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.endDate && (
                <div className="mt-4">
                  <input
                    type="date" value={dates.endDate}
                    onChange={e => setDates({ ...dates, endDate: e.target.value })}
                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              )}
            </div>

            {/* Completed At */}
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("completedAt")}>
                <span className="font-medium text-sm select-none">Completed At</span>
                {dropdowns.completedAt ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.completedAt && (
                <div className="mt-4">
                  <input
                    type="date" value={dates.completedAt}
                    onChange={e => setDates({ ...dates, completedAt: e.target.value })}
                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-4 px-6 py-3 border-t sticky bottom-0 bg-white">
            <button
              className="bg-[#C72030] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c]"
              onClick={handleApplyFilter}
            >
              Apply
            </button>
            <button
              className="border border-[#C72030] text-[#C72030] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50"
              onClick={handleClearFilters}
            >
              Reset
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ISSUE_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "reopen", label: "Reopen" },
  { value: "closed", label: "Closed" },
  { value: "overdue", label: "Overdued" },
];

const ISSUE_STATUS_DOT: Record<string, string> = {
  open: "bg-blue-500", in_progress: "bg-amber-500", on_hold: "bg-gray-500",
  completed: "bg-teal-500", reopen: "bg-orange-500", closed: "bg-green-800", overdue: "bg-red-500",
};

const SprintIssuePauseModal = ({ isOpen, onClose, onSubmit, onEndIssue, isLoading, issueId }: any) => {
  const [reason, setReason] = useState("");
  useEffect(() => { if (!isOpen) setReason(""); }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[30rem]">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Reason for Pause/End</h2>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Enter reason..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-6"
          rows={4}
          disabled={isLoading}
        />
        <div className="flex gap-3 justify-between">
          <Button onClick={() => { if (!reason.trim()) { toast.error("Please enter a reason"); return; } onEndIssue(reason, issueId); }} disabled={isLoading} className="!bg-red-600 !text-white rounded-md disabled:opacity-50">
            {isLoading ? "Submitting..." : "End Issue"}
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={() => { if (!reason.trim()) { toast.error("Please enter a reason"); return; } onSubmit(reason, issueId); }} disabled={isLoading} className="bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              {isLoading ? "Submitting..." : "Pause Issue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const sprintIssueColumns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, draggable: false, defaultVisible: true },
  { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
  { key: "title", label: "Title", sortable: true, draggable: true, defaultVisible: true },
  { key: "project_name", label: "Project Name", sortable: true, draggable: true, defaultVisible: true },
  { key: "issue_type", label: "Type", sortable: true, draggable: true, defaultVisible: true },
  { key: "priority", label: "Priority", sortable: true, draggable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, draggable: true, defaultVisible: true },
  { key: "assigned_to", label: "Responsible Person", sortable: true, draggable: true, defaultVisible: true },
  { key: "raised_by", label: "Raised By", sortable: true, draggable: true, defaultVisible: true },
  { key: "start_date", label: "Start Date", sortable: true, draggable: true, defaultVisible: true },
  { key: "due_date", label: "End Date", sortable: true, draggable: true, defaultVisible: true },
  { key: "started_time", label: "Actual Efforts Taken", sortable: false, draggable: true, defaultVisible: true },
  { key: "comment", label: "Comment", sortable: true, draggable: true, defaultVisible: true },
];

const mapSprintIssueData = (issue: any) => ({
  id: issue.id?.toString() || "",
  project_name: issue.project_management_name || "Not Selected",
  milestone_name: issue.milstone_name,
  task_name: issue.task_management_name,
  sub_task_name: issue.sub_task_management_name,
  title: issue.title || "",
  description: issue.description || "",
  issue_type: issue.issue_type || "",
  priority: issue.priority || "",
  status: issue.status || "open",
  assigned_to: issue.responsible_person_id,
  raised_by: issue?.created_by?.name,
  start_date: issue.start_date ? new Date(issue.start_date).toLocaleDateString() : "",
  due_date: issue.end_date
    ? new Date(issue.end_date).toLocaleDateString()
    : issue.target_date ? new Date(issue.target_date).toLocaleDateString() : "",
  comment: Array.isArray(issue.comments) && issue.comments.length > 0
    ? issue.comments[issue.comments.length - 1]?.body || ""
    : "",
  is_started: issue.is_started || false,
  active_time_till_now: issue.active_time_till_now || null,
});

const SprintIssueList = ({ sprintId, initialMemberId }: { sprintId: string; initialMemberId?: number }) => {
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const [issues, setIssues] = useState<any[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [paginationData, setPaginationData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState<any[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState("");
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseIssueId, setPauseIssueId] = useState<number | null>(null);
  const [isPauseLoading, setIsPauseLoading] = useState(false);
  const [issueSearchQuery, setIssueSearchQuery] = useState("");
  const [issueTempSearch, setIssueTempSearch] = useState("");
  const debounceTimerIssue = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRenderIssue = useRef(true);

  const fetchIssues = useCallback(async (filters = "", page = 1, search = "") => {
    setLoadingIssues(true);
    try {
      let qs = filters ? `${filters}&page=${page}` : `page=${page}`;
      if (search.trim()) qs += `&q[title_cont]=${encodeURIComponent(search.trim())}`;
      const r = await axios.get(
        `https://${baseUrl}/sprints/${sprintId}/sprint_issue_list.json?${qs}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const raw = r.data?.issues || r.data?.data?.issues || (Array.isArray(r.data) ? r.data : []);
      setIssues(Array.isArray(raw) ? raw.map(mapSprintIssueData) : []);
      setPaginationData(r.data?.pagination || r.data?.data?.pagination || null);
    } catch (e) {
      console.error("Error fetching sprint issues:", e);
    } finally {
      setLoadingIssues(false);
    }
  }, [sprintId, baseUrl, token]);

  useEffect(() => {
    if (!sprintId) return;
    if (initialMemberId != null) {
      const filterString = `q[responsible_person_id_in][]=${initialMemberId}`;
      setAppliedFilters(filterString);
      fetchIssues(filterString, 1, "");
    } else {
      fetchIssues("", 1, "");
    }
  }, [fetchIssues]);

  useEffect(() => {
    if (isFirstRenderIssue.current) { isFirstRenderIssue.current = false; return; }
    if (initialMemberId == null) return;
    const filterString = `q[responsible_person_id_in][]=${initialMemberId}`;
    setAppliedFilters(filterString);
    fetchIssues(filterString, 1, "");
  }, [initialMemberId]);

  useEffect(() => {
    if (debounceTimerIssue.current) clearTimeout(debounceTimerIssue.current);
    debounceTimerIssue.current = setTimeout(() => {
      setIssueSearchQuery(issueTempSearch);
      setCurrentPage(1);
      fetchIssues(appliedFilters, 1, issueTempSearch);
    }, 500);
    return () => { if (debounceTimerIssue.current) clearTimeout(debounceTimerIssue.current); };
  }, [issueTempSearch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const r = await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(r.data?.users || []);
      } catch (e) { }
    };
    const fetchIssueTypes = async () => {
      try {
        const r = await axios.get(`https://${baseUrl}/issue_types.json`, { headers: { Authorization: `Bearer ${token}` } });
        setIssueTypeOptions((r.data || []).map((i: any) => ({ value: i.id, label: i.name })));
      } catch (e) { }
    };
    fetchUsers();
    fetchIssueTypes();
  }, [baseUrl, token]);

  const issueApiCall = async (id: string, data: object) => {
    await axios.put(`https://${baseUrl}/issues/${id}.json`, { issue: data }, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
    fetchIssues(appliedFilters, currentPage, issueSearchQuery);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page === currentPage || loadingIssues) return;
    if (paginationData && page > paginationData.total_pages) return;
    setCurrentPage(page);
    fetchIssues(appliedFilters, page, issueSearchQuery);
  };

  const handlePlayIssue = async (id: number) => {
    try {
      await issueApiCall(String(id), { status: "started" });
      toast.success("Issue started successfully");
    } catch { toast.error("Failed to start issue"); }
  };

  const handlePauseIssueSubmit = async (reason: string, iid: number) => {
    setIsPauseLoading(true);
    try {
      await issueApiCall(String(iid), { status: "stopped" });
      toast.success("Issue paused");
      setIsPauseModalOpen(false);
      setPauseIssueId(null);
    } catch { toast.error("Failed to pause issue"); } finally { setIsPauseLoading(false); }
  };

  const handleEndIssueSubmit = async (reason: string, iid: number) => {
    setIsPauseLoading(true);
    try {
      await issueApiCall(String(iid), { status: "completed" });
      toast.success("Issue ended");
      setIsPauseModalOpen(false);
      setPauseIssueId(null);
    } catch { toast.error("Failed to end issue"); } finally { setIsPauseLoading(false); }
  };

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "actions") {
      return (
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" variant="ghost" className="p-1" onClick={() => navigate(`/vas/issues/${item.id}`)} title="View Issue">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      );
    }
    if (columnKey === "title") {
      const isCompleted = item.status === "completed" || item.status === "closed";
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 w-[20rem]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild><span className="w-full truncate">{item.title}</span></TooltipTrigger>
                <TooltipContent className="rounded-[5px]"><p>{item.title}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {!isCompleted && (
              item.is_started ? (
                <button onClick={() => { setPauseIssueId(Number(item.id)); setIsPauseModalOpen(true); }} className="p-1 hover:bg-gray-200 rounded transition" title="Pause issue">
                  <Pause size={13} className="text-orange-500" />
                </button>
              ) : (
                <button onClick={() => handlePlayIssue(Number(item.id))} className="p-1 hover:bg-gray-200 rounded transition" title="Start issue">
                  <Play size={13} className="text-green-500" />
                </button>
              )
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {item.milestone_name && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{item.milestone_name}</span>}
            {item.task_name && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{item.task_name}</span>}
          </div>
        </div>
      );
    }
    if (columnKey === "started_time") {
      return <ActiveTimer activeTimeTillNow={item?.active_time_till_now} isStarted={item?.is_started} />;
    }
    if (columnKey === "priority") return item[columnKey];
    if (columnKey === "status") {
      const dot = ISSUE_STATUS_DOT[item.status] || "bg-gray-500";
      return (
        <FormControl variant="standard" sx={{ width: 148 }}>
          <MuiSelect
            value={item.status || "open"}
            onChange={async e => { try { await issueApiCall(item.id, { status: e.target.value }); toast.success("Status updated"); } catch { toast.error("Failed to update"); } }}
            disableUnderline
            renderValue={v => (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className={`inline-block w-2 h-2 rounded-full ${ISSUE_STATUS_DOT[v as string] || "bg-gray-500"}`} />
                <span>{ISSUE_STATUS_OPTIONS.find(o => o.value === v)?.label || v}</span>
              </div>
            )}
            sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { padding: "4px 0" } }}
          >
            {ISSUE_STATUS_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span className={`inline-block w-2 h-2 rounded-full ${ISSUE_STATUS_DOT[opt.value] || "bg-gray-500"}`} />
                <span>{opt.label}</span>
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      );
    }
    if (columnKey === "issue_type") {
      return (
        <FormControl variant="standard" sx={{ width: 128 }}>
          <MuiSelect
            value={item.issue_type || ""}
            onChange={async e => { try { await issueApiCall(item.id, { issue_type: e.target.value }); toast.success("Type updated"); } catch { toast.error("Failed to update"); } }}
            disableUnderline
            sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { padding: "4px 0" } }}
          >
            {issueTypeOptions.map((opt: any) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </MuiSelect>
        </FormControl>
      );
    }
    if (columnKey === "assigned_to") {
      return (
        <FormControl variant="standard" sx={{ width: 188 }}>
          <MuiSelect
            value={item.assigned_to || ""}
            onChange={async e => { try { await issueApiCall(item.id, { responsible_person_id: e.target.value }); toast.success("Assignee updated"); } catch { toast.error("Failed to update"); } }}
            disableUnderline
            sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { padding: "4px 0" } }}
          >
            {users.map((u: any) => <MenuItem key={u.id} value={u.id}>{u.full_name}</MenuItem>)}
          </MuiSelect>
        </FormControl>
      );
    }
    if (columnKey === "comment") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">{item.comment || "No comment"}</div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[20rem] rounded-[5px] text-wrap"><p className="mx-2">{item.comment || "No comment"}</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return item[columnKey];
  };

  if (loadingIssues && !issues.length) {
    return (
      <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading sprint issues…</span>
      </div>
    );
  }

  return (
    <>
      <EnhancedTable
        data={issues}
        columns={sprintIssueColumns}
        renderCell={renderCell}
        loading={loadingIssues}
        searchValue={issueTempSearch}
        onSearchChange={(val: string) => setIssueTempSearch(val)}
        onFilterClick={() => setIsFilterModalOpen(true)}
        leftActions={
          <div className="flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-gray-700 font-medium text-sm">Total Issues:</span>
            <span className="text-lg font-bold text-[#C72030]">{paginationData?.total_count || 0}</span>
          </div>
        }
      />

      {/* Pagination */}
      {paginationData && paginationData.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 || loadingIssues ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {(() => {
                const totalPages = paginationData.total_pages;
                const pagesToShow = new Set<number>([1, totalPages, currentPage]);
                if (currentPage > 1) pagesToShow.add(currentPage - 1);
                if (currentPage < totalPages) pagesToShow.add(currentPage + 1);
                if (totalPages > 7) { pagesToShow.add(2); pagesToShow.add(totalPages - 1); }
                const sorted = Array.from(pagesToShow).sort((a, b) => a - b);
                const items: React.ReactNode[] = [];
                sorted.forEach((page, idx) => {
                  if (idx > 0 && sorted[idx - 1] < page - 1) {
                    items.push(<PaginationItem key={`e${sorted[idx - 1]}`}><PaginationEllipsis /></PaginationItem>);
                  }
                  items.push(
                    <PaginationItem key={page}>
                      <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className="cursor-pointer">{page}</PaginationLink>
                    </PaginationItem>
                  );
                });
                return items;
              })()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(paginationData.total_pages, currentPage + 1))}
                  className={currentPage === paginationData.total_pages || loadingIssues ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Filter Modal */}
      <IssueFilterModal
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
        onApplyFilters={(filterString: string) => {
          setAppliedFilters(filterString);
          setCurrentPage(1);
          fetchIssues(filterString, 1, issueSearchQuery);
        }}
        issueTypes={issueTypeOptions}
        users={users}
        projects={[]}
      />

      {/* Pause/End Modal */}
      <SprintIssuePauseModal
        isOpen={isPauseModalOpen}
        onClose={() => { setIsPauseModalOpen(false); setPauseIssueId(null); }}
        onSubmit={handlePauseIssueSubmit}
        onEndIssue={handleEndIssueSubmit}
        isLoading={isPauseLoading}
        issueId={pauseIssueId}
      />
    </>
  );
};

/**
 * Parses activity type based on log_of and changed_attr
 */
interface ActivityType {
  type: "SPRINT_CREATED" | "TASK_ADDED" | "TASK_REMOVED" | "FIELD_UPDATED";
  message: string;
}

const parseActivityType = (log: any): ActivityType => {
  const { log_of, changed_attr } = log;

  if (!changed_attr || Object.keys(changed_attr).length === 0) {
    return {
      type: "FIELD_UPDATED",
      message: "Record updated",
    };
  }

  // Sprint Created - check if log_of is "Sprint"
  if (log_of === "Sprint") {
    return {
      type: "SPRINT_CREATED",
      message: "Sprint created",
    };
  }

  // SprintTask - check if task was added or removed
  if (log_of === "SprintTask") {
    const taskIdAttr = changed_attr.task_id;

    if (Array.isArray(taskIdAttr) && taskIdAttr.length >= 2) {
      const [oldVal, newVal] = taskIdAttr;

      // Task added to sprint (null/nil -> value)
      if ((oldVal === null || oldVal === "nil") && newVal != null) {
        return {
          type: "TASK_ADDED",
          message: "Task added to sprint",
        };
      }

      // Task removed from sprint (value -> null/nil)
      if (oldVal != null && (newVal === null || newVal === "nil")) {
        return {
          type: "TASK_REMOVED",
          message: "Task removed from sprint",
        };
      }
    }
  }

  // Default: field updated
  return {
    type: "FIELD_UPDATED",
    message: "Record updated",
  };
};

/**
 * Check if activity represents a creation event (for grouping)
 */
const isActivityCreation = (activityType: ActivityType): boolean => {
  return (
    activityType.type === "SPRINT_CREATED" ||
    activityType.type === "TASK_ADDED"
  );
};

/**
 * Check if two dates are within a specified time window
 */
const isWithinTimeWindow = (
  date1: Date,
  date2: Date,
  windowMs: number = 5000
): boolean => {
  return Math.abs(date1.getTime() - date2.getTime()) <= windowMs;
};

/**
 * Group consecutive task additions for bulk display
 */
const groupTaskAdditions = (logs: any[]) => {
  const grouped: Array<{
    type: "single" | "grouped";
    logs: any[];
    groupLabel?: string;
  }> = [];

  let i = 0;
  while (i < logs.length) {
    const log = logs[i];
    const actType = parseActivityType(log);

    // Only group TASK_ADDED activities
    if (actType.type === "TASK_ADDED") {
      const taskAddGroup = [log];
      const baseUserId = log.changed_by;
      const baseSprintId = log.sprint_id;
      const baseTimestamp = new Date(log.created_at);

      // Look ahead for consecutive task additions from the same user, sprint, within time window
      let j = i + 1;
      while (j < logs.length) {
        const nextLog = logs[j];
        const nextType = parseActivityType(nextLog);

        if (
          nextType.type === "TASK_ADDED" &&
          nextLog.changed_by === baseUserId &&
          nextLog.sprint_id === baseSprintId &&
          isWithinTimeWindow(new Date(nextLog.created_at), baseTimestamp)
        ) {
          taskAddGroup.push(nextLog);
          j++;
        } else {
          break;
        }
      }

      // If multiple task additions, group them
      if (taskAddGroup.length > 1) {
        grouped.push({
          type: "grouped",
          logs: taskAddGroup,
          groupLabel: `added ${taskAddGroup.length} tasks to Sprint`,
        });
        i = j;
      } else {
        grouped.push({
          type: "single",
          logs: [log],
        });
        i++;
      }
    } else {
      grouped.push({
        type: "single",
        logs: [log],
      });
      i++;
    }
  }

  return grouped;
};

const SprintActivityLog = ({ sprintId }: { sprintId: string }) => {
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";
  const [logs, setLogs] = useState<any[]>([]);
  const [userMapping, setUserMapping] = useState<Record<string, string>>({});
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLogsLoading(true);
      try {
        const response = await axios.get(
          `https://${baseUrl}/sprints/${sprintId}/sprint_activity_log.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLogs(response.data || []);
      } catch (e) {
        console.error("Error fetching sprint activity log:", e);
      } finally {
        setLogsLoading(false);
      }
    };
    if (sprintId) fetchLogs();
  }, [sprintId, baseUrl, token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const users = response.data?.users || [];
        const mapping: Record<string, string> = {};
        users.forEach((user: any) => {
          mapping[user.id?.toString() || user.user_id?.toString()] =
            user.full_name || user.name || "Unknown User";
        });
        setUserMapping(mapping);
      } catch (e) {
        console.error("Error fetching users:", e);
      }
    };
    if (token && baseUrl) fetchUsers();
  }, [baseUrl, token]);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const calcDuration = (start: string, end: string) => {
    const diffMs = Math.abs(
      new Date(end).getTime() - new Date(start).getTime()
    );
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    const s = Math.floor((diffMs % 60000) / 1000);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const SKIP_FIELDS = new Set([
    "id",
    "created_at",
    "updated_at",
    "resource_id",
    "resource_type",
    "created_by_id",
    "sprint_id",
    "task_id",
  ]);

  const FIELD_LABELS: Record<string, string> = {
    status: "Status",
    title: "Title",
    name: "Name",
    description: "Description",
    start_date: "Start Date",
    end_date: "End Date",
    priority: "Priority",
    owner_id: "Owner",
    sprint_owner_name: "Owner",
  };

  const STATUS_BADGE: Record<string, string> = {
    open: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    on_hold: "bg-gray-200 text-gray-700",
    overdue: "bg-red-100 text-red-700",
    completed: "bg-green-100 text-green-700",
    active: "bg-blue-100 text-blue-700",
    nil: "bg-gray-100 text-gray-400",
  };

  const getInitialsLocal = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const parseChanges = (changed_attr: Record<string, any> | null) => {
    if (!changed_attr || Object.keys(changed_attr).length === 0) return null;

    const fields = Object.entries(changed_attr)
      .filter(([key]) => !SKIP_FIELDS.has(key))
      .map(([key, value]) => {
        const arr = Array.isArray(value) ? value : [null, value];
        let oldVal: string;
        let newVal: string;

        if (arr.length >= 3) {
          oldVal = arr[0] === "nil" || arr[0] === null ? "—" : String(arr[0]);
          newVal = String(arr[arr.length - 1]);
        } else {
          oldVal = arr[0] === "nil" || arr[0] === null ? "—" : String(arr[0]);
          newVal = arr[1] === "nil" || arr[1] === null ? "—" : String(arr[1]);
        }

        if (key === "owner_id") {
          if (oldVal !== "—") oldVal = userMapping[oldVal] || oldVal;
          if (newVal !== "—") newVal = userMapping[newVal] || newVal;
        }

        return {
          key,
          label:
            FIELD_LABELS[key] ||
            key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          old: oldVal,
          new: newVal,
          isStatus: key === "status",
        };
      });

    return { fields };
  };

  if (logsLoading) {
    return (
      <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading activity logs…</span>
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="text-center py-8 w-full text-gray-500 text-sm">
        No activity logs available
      </div>
    );
  }

  const sorted = [...logs].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const groupedActivities = groupTaskAdditions([...sorted].reverse());

  return (
    <div className="overflow-x-auto w-full bg-gray-50 rounded-xl shadow-inner mt-3 p-6">
      <div className="flex items-start min-w-max">
        {groupedActivities.map((group, groupIndex) => {
          const isLastGroup = groupIndex === groupedActivities.length - 1;
          const representativeLog =
            group.type === "grouped" ? group.logs[0] : group.logs[0];
          const activityType = parseActivityType(representativeLog);
          const isCreation = isActivityCreation(activityType);
          const initials = getInitialsLocal(
            representativeLog.changed_by || ""
          );
          const changes = parseChanges(representativeLog.changed_attr);

          return (
            <Fragment key={`group-${groupIndex}`}>
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-md ring-2 ring-white z-10"
                  style={{
                    background: isCreation ? "#16a34a" : "#E95420",
                  }}
                  title={representativeLog.changed_by || "System"}
                >
                  {initials}
                </div>

                <div className="w-px h-4 border-l-2 border-dashed border-gray-300" />

                <div className="w-[215px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-3 pt-2.5 pb-2 border-b border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-800 truncate leading-snug">
                      {representativeLog.changed_by || "System"}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      {formatTimestamp(representativeLog.created_at)}
                    </p>
                  </div>

                  <div className="px-3 py-2.5 space-y-2.5">
                    {/* Grouped Activity */}
                    {group.type === "grouped" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-base leading-none">
                          ✦
                        </span>
                        <span className="text-[11px] font-semibold text-green-700">
                          {representativeLog.changed_by}{" "}
                          {group.groupLabel}
                        </span>
                      </div>
                    ) : activityType.type === "SPRINT_CREATED" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-base leading-none">
                          ✦
                        </span>
                        <span className="text-[11px] font-semibold text-green-700">
                          Sprint Created
                        </span>
                      </div>
                    ) : activityType.type === "TASK_ADDED" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-base leading-none">
                          ✦
                        </span>
                        <span className="text-[11px] font-semibold text-green-700">
                          Task Added To Sprint
                        </span>
                      </div>
                    ) : activityType.type === "TASK_REMOVED" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-base leading-none">
                          ✕
                        </span>
                        <span className="text-[11px] font-semibold text-red-700">
                          Task Removed From Sprint
                        </span>
                      </div>
                    ) : !changes || changes.fields.length === 0 ? (
                      <p className="text-[10px] text-gray-400 italic">
                        {representativeLog.log_type?.replace("Sprint", "").trim() ||
                          "Updated sprint"}
                      </p>
                    ) : (
                      changes.fields.map((field: any) => (
                        <div key={field.key}>
                          <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                            {field.label}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {field.isStatus ? (
                              <>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-medium capitalize ${STATUS_BADGE[field.old] || "bg-gray-100 text-gray-500"}`}
                                >
                                  {field.old === "—"
                                    ? "—"
                                    : field.old.replace(/_/g, " ")}
                                </span>
                                <span className="text-gray-400 text-[10px] font-bold">
                                  →
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-medium capitalize ${STATUS_BADGE[field.new] || "bg-gray-100 text-gray-500"}`}
                                >
                                  {field.new === "—"
                                    ? "—"
                                    : field.new.replace(/_/g, " ")}
                                </span>
                              </>
                            ) : (
                              <div className="flex items-center gap-1 w-full">
                                <span
                                  className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[70px]"
                                  title={field.old}
                                >
                                  {field.old}
                                </span>
                                <span className="text-gray-400 text-[10px] font-bold flex-shrink-0">
                                  →
                                </span>
                                <span
                                  className="text-[9px] text-gray-800 font-semibold bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[70px]"
                                  title={field.new}
                                >
                                  {field.new}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {!isLastGroup && (
                <div className="flex flex-col items-center flex-shrink-0 min-w-[80px] px-1">
                  <span className="text-[9px] text-gray-400 whitespace-nowrap text-center mt-1 mb-1 leading-none">
                    {calcDuration(
                      representativeLog.created_at,
                      groupedActivities[groupIndex + 1].logs[0].created_at
                    )}
                  </span>
                  <div className="relative w-full flex items-center">
                    <div className="rotate-180 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-gray-400 flex-shrink-0" />
                    <div className="flex-1 h-[1.5px] bg-gray-300" />
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const SprintDetailsPage = () => {
  const { setCurrentSection } = useLayout();
  useEffect(() => {
    setCurrentSection("Project Task");
  }, [setCurrentSection]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";

  const [loading, setLoading] = useState(true);
  const [sprintDetails, setSprintDetails] = useState<SprintDetails>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprintIssues, setSprintIssues] = useState<any[]>([]);
  const [sprintMembers, setSprintMembers] = useState<SprintMember[]>([]);
  const [totalMembers, setTotalMembers] = useState<number | null>(null);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [membersSummary, setMembersSummary] = useState<MemberSummary[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Open");
  const [memberTaskFilter, setMemberTaskFilter] = useState<number | undefined>(undefined);
  const [memberIssueFilter, setMemberIssueFilter] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<
    "tasks" | "issues" | "activity_log"
  >("tasks");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const resp = (await dispatch(
        fetchSprintById({ token, baseUrl, id })
      ).unwrap()) as ApiSprint;
      setSprintDetails(mapApiToDetails(resp));
      setTasks(mapApiTasks(resp));
      setSprintIssues(resp.sprint_issues ?? []);
      setSprintMembers(extractMembers(resp));
      setTotalMembers(resp.total_members ?? null);
      setSelectedOption(mapStatusToDisplay(resp.status));
    } catch (error) {
      toast.error(String(error) || "Failed to fetch sprint details");
    } finally {
      setLoading(false);
    }
  }, [id, dispatch, token, baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isMembersOpen || !id) return;
    const fetchMembersSummary = async () => {
      setMembersLoading(true);
      try {
        const response = await axios.get(
          `https://${baseUrl}/sprints/${id}/sprint_members.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMembersSummary(response.data?.members_summary || []);
      } catch {
        toast.error("Failed to fetch members summary");
      } finally {
        setMembersLoading(false);
      }
    };
    fetchMembersSummary();
  }, [isMembersOpen, id, baseUrl, token]);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setOpenDropdown(false);

    await dispatch(
      updateSprintStatus({
        token,
        baseUrl,
        id,
        data: { status: option.toLowerCase().replace(/\s+/g, "_") },
      })
    ).unwrap();
    fetchData();
    toast.dismiss();
    toast.success("Status updated successfully");
  };

  const renderTaskCell = (item: Task, columnKey: string) => {
    const value = item[columnKey as keyof Task];

    // Format dates
    if (columnKey === "target_date" && value) {
      return new Date(value as string).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // Color-code status
    if (columnKey === "status" && value) {
      const statusKey = mapDisplayToApiStatus(value as string).toLowerCase();
      const colorClass =
        STATUS_COLORS[statusKey as keyof typeof STATUS_COLORS] ||
        "bg-gray-200 text-gray-800";
      return (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
        >
          {value}
        </span>
      );
    }

    // Format estimated hours
    if (columnKey === "estimated_hour" && value) {
      return `${value}h`;
    }

    return value ?? "-";
  };

  return (
    <div className="m-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="py-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="px-4 pt-1">
        {loading ? (
          <>
            {/* Title skeleton */}
            <div className="flex items-center gap-3 p-3 px-0">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="border-b-[3px] border-[rgba(190,190,190,1)]"></div>

            {/* Header info skeleton */}
            <div className="flex items-center gap-4 my-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
            <div className="border-b-[3px] border-grey my-3"></div>

            {/* Details card skeleton */}
            <div className="border rounded-[10px] shadow-md p-5 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex flex-col">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="flex items-center ml-36">
                      <div className="w-1/2 flex items-center gap-3">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3.5 w-24" />
                      </div>
                      <div className="w-1/2 flex items-center gap-3">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3.5 w-20" />
                      </div>
                    </div>
                    {i < 4 && (
                      <span className="border h-[1px] inline-block w-full my-4"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs skeleton */}
            <div>
              <div className="flex items-center gap-0 border-b-[3px] border-[rgba(190,190,190,1)] pb-2">
                <Skeleton className="h-5 w-16 mx-5" />
                <Skeleton className="h-5 w-16 mx-5" />
              </div>
              <div className="mt-4 space-y-3">
                <Skeleton className="h-10 w-full rounded" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded" />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Title */}
            <h2 className="text-[15px] p-3 px-0">
              <span className="mr-3">S-{sprintDetails.id}</span>
              <span>{sprintDetails.title}</span>
            </h2>
            <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

            {/* Header Info & Dropdown */}
            <div className="flex items-center justify-between my-3 text-[12px]">
              <div className="flex items-center gap-3 text-[#323232] flex-wrap">
                <span>Created By: {sprintDetails.created_by_name}</span>
                <span className="h-6 w-[1px] border border-gray-300"></span>
                <span className="flex items-center gap-3">
                  Created On: {formatToDDMMYYYY_AMPM(sprintDetails.created_at)}
                </span>
                <span className="h-6 w-[1px] border border-gray-300"></span>

                {/* Status Dropdown */}
                <span
                  className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm ${STATUS_COLORS[mapDisplayToApiStatus(selectedOption).toLowerCase()] || "bg-gray-400 text-white"}`}
                >
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="flex items-center gap-1 cursor-pointer px-2 py-1"
                      onClick={() => setOpenDropdown(!openDropdown)}
                      role="button"
                      aria-haspopup="true"
                      aria-expanded={openDropdown}
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setOpenDropdown(!openDropdown)
                      }
                    >
                      <span className="text-[13px]">{selectedOption}</span>
                      <ChevronDown
                        size={15}
                        className={`${openDropdown ? "rotate-180" : ""} transition-transform`}
                      />
                    </div>
                    <ul
                      className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"}`}
                      role="menu"
                      style={{
                        minWidth: "150px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        zIndex: 1000,
                      }}
                    >
                      {dropdownOptions.map((option, idx) => (
                        <li key={idx} role="menuitem">
                          <button
                            className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option ? "bg-gray-100 font-semibold" : ""}`}
                            onClick={() => handleOptionSelect(option)}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </span>

                {/* Members */}
                {sprintMembers.length > 0 && (
                  <>
                    <span className="h-6 w-[1px] border border-gray-300"></span>
                    <button
                      onClick={() => setIsMembersOpen(true)}
                      className="flex items-center gap-2 px-2 py-1 rounded-md transition-colors"
                    >
                      <Users size={15} />
                      Sprint Members
                      {totalMembers != null && totalMembers > 0 && (
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                          {totalMembers}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="border-b-[3px] border-grey my-3"></div>

            {/* Details Section */}
            <div className="border rounded-[10px] shadow-md p-5 mb-4">
              <div className="font-[600] text-[16px] flex items-center gap-4">
                <ChevronDownCircle color="#E95420" size={30} />
                Details
              </div>
              <div className="mt-3 flex flex-col">
                {/* Row 1 */}
                <div className="flex items-center ml-16">
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Responsible Person :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails.responsible_person || "-"}
                    </div>
                  </div>
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Priority :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails.priority?.charAt(0)?.toUpperCase() + sprintDetails.priority?.slice(1) || "-"}
                    </div>
                  </div>
                </div>
                <span className="border h-[1px] inline-block w-full my-4"></span>
                {/* Row 2 */}
                <div className="flex items-center ml-16">
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Start Date :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails.start_date || "-"}
                    </div>
                  </div>
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      End Date :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails.end_date || "-"}
                    </div>
                  </div>
                </div>
                <span className="border h-[1px] inline-block w-full my-4"></span>
                {/* Row 3 */}
                <div className="flex items-center ml-16">
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Total Tasks :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails?.total_tasks ?? "-"}
                    </div>
                  </div>
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Total Issues :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails?.total_issues ?? "-"}
                    </div>
                  </div>
                </div>
                <span className="border h-[1px] inline-block w-full my-4"></span>
                {/* Row 4 */}
                <div className="flex items-center ml-16">
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Effective Hours :
                    </div>
                    <div className="text-left text-[14px] text-[#029464] font-medium">
                      {fmtMinutes(sprintDetails?.total_effective_minutes)}
                    </div>
                  </div>
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Actual Hours :
                    </div>
                    <div className="text-left text-[14px] text-[#E95420] font-medium">
                      {fmtMinutes(sprintDetails?.total_actual_minutes)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div>
              {/* Tab headers */}
              <div className="flex items-center gap-0 border-b-[3px] border-[rgba(190,190,190,1)]">
                {(
                  [
                    { key: "tasks", label: "Tasks" },
                    { key: "issues", label: "Issues" },
                    { key: "activity_log", label: "Activity Log" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-5 py-2 text-[14px] font-[500] capitalize transition-colors focus:outline-none ${activeTab === tab.key
                      ? "text-[#E95420]"
                      : "text-[#323232] hover:text-[#E95420]"
                      }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <span className="absolute bottom-[-3px] left-0 w-full h-[3px] bg-[#E95420] rounded-t-sm" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="mt-4 overflow-x-auto">
                {activeTab === "tasks" && (
                  <SprintTaskList sprintId={String(id)} initialMemberId={memberTaskFilter} />
                )}
                {activeTab === "issues" && (
                  <SprintIssueList sprintId={String(id)} initialMemberId={memberIssueFilter} />
                )}
                {activeTab === "activity_log" && (
                  <SprintActivityLog sprintId={String(id)} />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Members Panel */}
      <Dialog
        open={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
        maxWidth={false}
        TransitionComponent={SlideTransition}
        PaperProps={{
          sx: {
            width: "min(95vw, 1080px)",
            height: "100%",
            maxHeight: "100%",
            margin: 0,
            borderRadius: 0,
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
          },
        }}
        TransitionProps={{ timeout: { enter: 400, exit: 400 } }}
      >
        <DialogTitle className="relative !pb-0 !px-0 shrink-0">
          <div className="flex items-center gap-2 px-6">
            <Users size={18} className="text-[#E95420]" />
            <span className="text-sm font-medium text-gray-800">
              Sprint Members
            </span>
            {membersSummary.length > 0 && (
              <span className="ml-1 text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                {membersSummary.length}
              </span>
            )}
          </div>
          <X
            size={18}
            className="absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-gray-800"
            onClick={() => setIsMembersOpen(false)}
          />
          <hr className="border border-[#E95420] mt-4" />
        </DialogTitle>

        <DialogContent sx={{ padding: 0, overflow: "auto" }}>
          {membersLoading ? (
            <div className="flex items-center justify-center h-48 gap-2 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading members…</span>
            </div>
          ) : membersSummary.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Users size={36} className="opacity-30" />
              <p className="text-sm">No members found</p>
            </div>
          ) : (
            <div>
              <table
                className="w-full text-sm border-collapse"
                style={{ minWidth: 750 }}
              >
                <thead className="sticky top-0 z-10">
                  {/* Group header row — single consistent dark tone */}
                  <tr>
                    <th
                      rowSpan={2}
                      className="bg-[#f5f5dc] text-black text-left px-2 py-2 font-semibold text-xs tracking-wide border-r border-slate-300 align-middle"
                      style={{ minWidth: 140 }}
                    >
                      Member
                    </th>
                    <th
                      colSpan={2}
                      className="bg-[#f5f5dc] text-black text-center px-1.5 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-300"
                    >
                      Tasks
                    </th>
                    <th
                      colSpan={2}
                      className="bg-[#f5f5dc] text-black text-center px-1.5 py-2 text-xs tracking-wide border-r border-slate-300 border-l-2 border-l-slate-300"
                    >
                      Issues
                    </th>
                    <th
                      colSpan={2}
                      className="bg-[#f5f5dc] text-black text-center px-1.5 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-300"
                    >
                      Task Minutes
                    </th>
                    <th
                      colSpan={2}
                      className="bg-[#f5f5dc] text-black text-center px-1.5 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-300"
                    >
                      Issue Minutes
                    </th>
                    <th
                      colSpan={2}
                      className="text-center px-1.5 py-2 text-xs font-semibold tracking-wide border-l-2 border-l-[#E95420]"
                      style={{ backgroundColor: "#E95420", color: "#fff" }}
                    >
                      Total Minutes
                    </th>
                  </tr>
                  {/* Sub-header row */}
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {/* Tasks */}
                    <th className="bg-slate-50 text-slate-500 px-1.5 py-1 text-[10px] border-r border-slate-200 border-l-2 border-l-slate-300 text-center border-t border-t-slate-300">
                      Total
                    </th>
                    <th className="bg-slate-50 text-slate-500 px-1.5 py-1 text-[10px] border-r border-slate-300 text-center border-t border-t-slate-300">
                      Completion
                    </th>
                    {/* Issues */}
                    <th className="bg-slate-50 text-slate-500 px-1.5 py-1 text-[10px] border-r border-slate-200 border-l-2 border-l-slate-300 text-center border-t border-t-slate-300">
                      Total
                    </th>
                    <th className="bg-slate-50 text-slate-500 px-1.5 py-1 text-[10px] border-r border-slate-300 text-center border-t border-t-slate-300">
                      Completion
                    </th>
                    {/* Task Minutes */}
                    <th className="bg-slate-50 text-slate-500 px-1.5 py-1 text-[10px] border-r border-slate-200 border-l-2 border-l-slate-300 text-center border-t border-t-slate-300">
                      Effective
                    </th>
                    <th className="bg-slate-50 text-slate-500 px-1.5 py-1 text-[10px] border-r border-slate-300 text-center border-t border-t-slate-300">
                      Actual
                    </th>
                    {/* Issue Minutes */}
                    <th className="bg-slate-50 text-slate-500 px-1.5 py-1 text-[10px] border-r border-slate-200 border-l-2 border-l-slate-300 text-center border-t border-t-slate-300">
                      Effective
                    </th>
                    <th className="bg-slate-50 text-slate-500 px-1.5 py-1 text-[10px] border-r border-slate-300 text-center border-t border-t-slate-300">
                      Actual
                    </th>
                    {/* Total Minutes */}
                    <th
                      className="px-1.5 py-1 text-[10px] border-r border-orange-200 border-l-2 border-l-[#E95420] text-center border-t border-t-slate-300"
                      style={{ backgroundColor: "#fff7f5", color: "#E95420" }}
                    >
                      Effective
                    </th>
                    <th
                      className="px-1.5 py-1 text-[10px] text-center border-t border-t-slate-300"
                      style={{ backgroundColor: "#fff7f5", color: "#E95420" }}
                    >
                      Actual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {membersSummary.map((m, i) => (
                    <tr
                      key={m.member_id}
                      className={`border-b border-slate-100 transition-colors hover:bg-slate-50/70 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                    >
                      {/* Member */}
                      <td className="px-2 py-2 border-r border-slate-100">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center !justify-center text-white text-[11px] font-bold shrink-0 select-none"
                            style={{
                              backgroundColor:
                                AVATAR_COLORS[i % AVATAR_COLORS.length],
                            }}
                          >
                            {getInitials(m.member_name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-[13px] font-semibold text-gray-800 truncate">
                                {m.member_name}
                              </p>
                              {m.department_name && (
                                <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                  {m.department_name}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 truncate">
                              {m.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Tasks */}
                      {(() => {
                        const taskPct =
                          m.total_tasks > 0
                            ? Math.round(
                              (m.completed_tasks / m.total_tasks) * 100
                            )
                            : 0;
                        const taskColor =
                          taskPct === 100
                            ? "#10B981"
                            : taskPct >= 50
                              ? "#E95420"
                              : "#ef4444";
                        return (
                          <>
                            <td
                              className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200 cursor-pointer hover:bg-blue-50"
                              onClick={() => {
                                setIsMembersOpen(false);
                                setMemberIssueFilter(undefined);
                                setMemberTaskFilter(m.member_id);
                                setActiveTab("tasks");
                              }}
                            >
                              <span className="text-[13px] font-medium text-blue-600">
                                {m.total_tasks}
                              </span>
                            </td>
                            <td
                              className="px-1.5 py-2 text-center border-r border-slate-300 cursor-pointer hover:bg-blue-50"
                              onClick={() => {
                                setIsMembersOpen(false);
                                setMemberIssueFilter(undefined);
                                setMemberTaskFilter(m.member_id);
                                setActiveTab("tasks");
                              }}
                            >
                              <span className="text-[13px] font-semibold text-blue-600">
                                {m.completed_tasks}
                              </span>
                              <span
                                className="ml-1 text-[11px] font-bold"
                                style={{ color: taskColor }}
                              >
                                ({taskPct}%)
                              </span>
                            </td>
                          </>
                        );
                      })()}
                      {/* Issues */}
                      {(() => {
                        const issuePct =
                          m.total_issues > 0
                            ? Math.round(
                              (m.completed_issues / m.total_issues) * 100
                            )
                            : 0;
                        const issueColor =
                          issuePct === 100
                            ? "#10B981"
                            : issuePct >= 50
                              ? "#E95420"
                              : "#ef4444";
                        return (
                          <>
                            <td
                              className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200 cursor-pointer hover:bg-blue-50"
                              onClick={() => {
                                setIsMembersOpen(false);
                                setMemberTaskFilter(undefined);
                                setMemberIssueFilter(m.member_id);
                                setActiveTab("issues");
                              }}
                            >
                              <span className="text-[13px] font-medium text-blue-600">
                                {m.total_issues}
                              </span>
                            </td>
                            <td
                              className="px-1.5 py-2 text-center border-r border-slate-300 cursor-pointer hover:bg-blue-50"
                              onClick={() => {
                                setIsMembersOpen(false);
                                setMemberTaskFilter(undefined);
                                setMemberIssueFilter(m.member_id);
                                setActiveTab("issues");
                              }}
                            >
                              <span className="text-[13px] font-semibold text-blue-600">
                                {m.completed_issues}
                              </span>
                              <span
                                className="ml-1 text-[11px] font-bold"
                                style={{ color: issueColor }}
                              >
                                ({issuePct}%)
                              </span>
                            </td>
                          </>
                        );
                      })()}
                      {/* Task Minutes */}
                      <td className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200 text-[11px] text-gray-500">
                        {fmtMin(m.task_effective_minutes)}
                      </td>
                      <td className="px-1.5 py-2 text-center border-r border-slate-200 text-[11px] text-gray-500">
                        {fmtMin(m.task_actual_minutes)}
                      </td>
                      {/* Issue Minutes */}
                      <td className="px-1.5 py-2 text-center border-r border-slate-100 border-l-2 border-l-slate-200 text-[11px] text-gray-500">
                        {fmtMin(m.issue_effective_minutes)}
                      </td>
                      <td className="px-1.5 py-2 text-center border-r border-slate-200 text-[11px] text-gray-500">
                        {fmtMin(m.issue_actual_minutes)}
                      </td>
                      {/* Total Minutes */}
                      <td className="px-1.5 py-2 text-center border-r border-orange-200 border-l-2 border-l-[#E95420] font-semibold text-[11px] text-gray-500">
                        {fmtMin(m.total_effective_minutes)}
                      </td>
                      <td className="px-1.5 py-2 text-center font-semibold text-[11px] text-gray-500">
                        {fmtMin(m.total_actual_minutes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SprintDetailsPage;
