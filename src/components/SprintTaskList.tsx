import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Play,
  Pause,
  Loader2,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  FormControl,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SlideTransition } from "@/components/SprintMemberModal";

interface SprintTaskListProps {
  sprintId: string;
  initialMemberId?: number;
}

export default function SprintTaskList({
  sprintId,
  initialMemberId,
}: SprintTaskListProps) {
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const [sprintTasks, setSprintTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  const [unlinkingTaskId, setUnlinkingTaskId] = useState<number | null>(null);
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

  const handleUnlinkTask = async (taskId: number) => {
    setUnlinkingTaskId(taskId);
    try {
      await axios.delete(`https://${baseUrl}/sprints/${sprintId}/unlink`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        data: { task_ids: [taskId] },
      });
      toast.success("Task unlinked from sprint");
      fetchTasks();
    } catch {
      toast.error("Failed to unlink task");
    } finally {
      setUnlinkingTaskId(null);
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
    { key: "actions", label: "Actions", sortable: false, draggable: true, defaultVisible: true },
    { key: "id", label: "Task ID", sortable: true, draggable: true, defaultVisible: true },
    { key: "task_code", label: "Task Code", sortable: true, draggable: true, defaultVisible: true },
    { key: "title", label: "Task Title", sortable: true, draggable: true, defaultVisible: true },
    { key: "project_management_title", label: "Project", sortable: true, draggable: true, defaultVisible: true },
    { key: "milestone_title", label: "Milestone", sortable: true, draggable: true, defaultVisible: true },
    { key: "status", label: "Status", sortable: true, draggable: true, defaultVisible: true },
    { key: "workflowStatus", label: "Workflow Status", sortable: true, draggable: true, defaultVisible: true },
    { key: "responsible", label: "Responsible Person", sortable: true, draggable: true, defaultVisible: true },
    { key: "created_by", label: "Created By", sortable: true, draggable: true, defaultVisible: true },
    { key: "expected_start_date", label: "Start Date", sortable: true, draggable: true, defaultVisible: true },
    { key: "target_date", label: "End Date", sortable: true, draggable: true, defaultVisible: true },
    { key: "started_time", label: "Actual Efforts Taken", sortable: false, draggable: true, defaultVisible: true },
    { key: "duration", label: "Time Left", sortable: true, draggable: true, defaultVisible: true },
    { key: "efforts_duration", label: "Efforts Duration", sortable: true, draggable: true, defaultVisible: true },
    { key: "subtasks", label: "Subtasks", sortable: true, draggable: true, defaultVisible: true },
    { key: "issues", label: "Issues", sortable: true, draggable: true, defaultVisible: true },
    { key: "priority", label: "Priority", sortable: true, draggable: true, defaultVisible: true },
    { key: "predecessor", label: "Predecessor", sortable: true, draggable: true, defaultVisible: true },
    { key: "successor", label: "Successor", sortable: true, draggable: true, defaultVisible: true },
    { key: "completion_percentage", label: "Completion %", sortable: true, draggable: true, defaultVisible: true },
  ];

  const renderProgressBar = (completed: number, total: number, color: string) => {
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">{completed}</span>
        <div className="relative w-[8rem] bg-gray-200 rounded-full h-4 overflow-hidden flex items-center !justify-center">
          <div
            className={`absolute top-0 left-0 h-6 ${color} rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
          <span className="relative text-xs font-semibold text-gray-800">{Math.round(progress)}%</span>
        </div>
        <span className="text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">{total}</span>
      </div>
    );
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Button size="sm" variant="ghost" className="p-1" onClick={() => navigate(`/vas/tasks/${item.id}`)} title="View Task">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1" onClick={() => handleUnlinkTask(item.id)} title="Unlink from Sprint" disabled={unlinkingTaskId === item.id}>
              {unlinkingTaskId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
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
            {!hasSubtasks && !isCompleted && (item.is_started ? (
              <button onClick={() => handlePauseTask(item.id)} className="p-1 hover:bg-gray-200 rounded transition" title="Pause">
                <Pause size={13} className="text-orange-500" />
              </button>
            ) : (
              <button onClick={() => handlePlayTask(item.id)} className="p-1 hover:bg-gray-200 rounded transition" title="Start">
                <Play size={13} className="text-green-500" />
              </button>
            ))}
          </div>
        );
      }
      case "status":
        return (
          <FormControl variant="standard" sx={{ width: 148 }}>
            <MuiSelect
              value={item.status || "open"}
              onChange={(e) => handleStatusChange(item.id, e.target.value as string)}
              disableUnderline
              renderValue={(v) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={`inline-block w-2 h-2 rounded-full ${statusColorMap[v as string] || "bg-gray-500"}`} />
                  <span>{statusOptions.find((o) => o.value === v)?.label || v}</span>
                </div>
              )}
              sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { padding: "4px 0" } }}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span className={`inline-block w-2 h-2 rounded-full ${statusColorMap[opt.value] || "bg-gray-500"}`} />
                  <span>{opt.label}</span>
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        );
      case "workflowStatus":
        return (
          <FormControl variant="standard" sx={{ width: 128 }}>
            <MuiSelect
              value={item.project_status_id ?? "1"}
              onChange={(e) => handleWorkflowStatusChange(item.id, e.target.value as string)}
              disableUnderline
              sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { padding: "4px 0" } }}
            >
              {statuses.map((s: any) => (
                <MenuItem key={s.id} value={s.id}>{s.status}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        );
      case "responsible":
        return (
          <FormControl variant="standard" sx={{ minWidth: 180 }}>
            <MuiSelect
              value={item.responsible_person_id ?? ""}
              disableUnderline readOnly
              sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { padding: "4px 0" } }}
            >
              {users.map((u: any) => (
                <MenuItem key={u.id} value={u.id}>{u.full_name}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        );
      case "created_by":
        return item.created_by_name || "-";
      case "subtasks":
        return renderProgressBar(item.completed_sub_tasks || 0, item.total_sub_tasks || 0, "bg-[#b4e7ff]");
      case "issues":
        return renderProgressBar(item.completed_issues || 0, item.total_issues || 0, "bg-[#ff9a9e]");
      case "duration": {
        const dur = calcTaskDuration(item.expected_start_date, item.target_date);
        return <span className={`text-[12px] ${dur.isOverdue ? "text-red-600" : "text-[#029464]"}`}>{dur.text}</span>;
      }
      case "efforts_duration":
        return fmtHours(item?.total_allocated_hours || 0);
      case "priority":
        return item.priority ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1) : "-";
      case "started_time":
        return <ActiveTimer activeTimeTillNow={item?.active_time_till_now} isStarted={item?.is_started} />;
      case "predecessor":
        return item.predecessor_task?.length || "0";
      case "successor":
        return item.successor_task?.length || "0";
      case "completion_percentage":
        return (
          <input type="number" defaultValue={item.completion_percent || 0} className="border border-gray-200 focus:outline-none p-2 w-[4rem]" min={0} max={100} readOnly />
        );
      default:
        return item[columnKey] || "-";
    }
  };

  if (loadingTasks) {
    return (
      <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading sprint tasks</span>
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
                const items: React.ReactNode[] = [];
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
          <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold">Filter</h2>
            <X className="cursor-pointer" onClick={() => setIsFilterModalOpen(false)} />
          </div>

          <div className="flex-1 overflow-y-auto divide-y">
            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("project")}>
                <span className="font-medium text-sm select-none">Project</span>
                {dropdowns.project ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.project && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input type="text" placeholder="Filter project..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.project} onChange={e => setSearchTerms({ ...searchTerms, project: e.target.value })} />
                  </div>
                  {renderCheckboxList(projectOptions, selectedProjects, setSelectedProjects, searchTerms.project)}
                </div>
              )}
            </div>

            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("status")}>
                <span className="font-medium text-sm select-none">Status</span>
                {dropdowns.status ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.status && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input type="text" placeholder="Filter status..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.status} onChange={e => setSearchTerms({ ...searchTerms, status: e.target.value })} />
                  </div>
                  {renderCheckboxList(STATUS_FILTER_OPTIONS, selectedStatuses, setSelectedStatuses, searchTerms.status)}
                </div>
              )}
            </div>

            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("workflowStatus")}>
                <span className="font-medium text-sm select-none">Workflow Status</span>
                {dropdowns.workflowStatus ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.workflowStatus && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input type="text" placeholder="Filter workflow status..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.workflowStatus} onChange={e => setSearchTerms({ ...searchTerms, workflowStatus: e.target.value })} />
                  </div>
                  {renderCheckboxList(statuses.map((s: any) => ({ label: s.status, value: s.id })), selectedWorkflowStatus, setSelectedWorkflowStatus, searchTerms.workflowStatus)}
                </div>
              )}
            </div>

            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("responsiblePerson")}>
                <span className="font-medium text-sm select-none">Responsible Person</span>
                {dropdowns.responsiblePerson ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.responsiblePerson && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input type="text" placeholder="Filter responsible person..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.responsiblePerson} onChange={e => setSearchTerms({ ...searchTerms, responsiblePerson: e.target.value })} />
                  </div>
                  {renderCheckboxList(users.map((u: any) => ({ label: u.full_name, value: u.id })), selectedResponsible, setSelectedResponsible, searchTerms.responsiblePerson)}
                </div>
              )}
            </div>

            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("createdBy")}>
                <span className="font-medium text-sm select-none">Created By</span>
                {dropdowns.createdBy ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.createdBy && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input type="text" placeholder="Filter created by..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.createdBy} onChange={e => setSearchTerms({ ...searchTerms, createdBy: e.target.value })} />
                  </div>
                  {renderCheckboxList(users.map((u: any) => ({ label: u.full_name, value: u.id })), selectedCreators, setSelectedCreators, searchTerms.createdBy)}
                </div>
              )}
            </div>

            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("tags")}>
                <span className="font-medium text-sm select-none">Tags</span>
                {dropdowns.tags ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.tags && (
                <div className="mt-4 border">
                  <div className="relative border-b">
                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                    <input type="text" placeholder="Filter tags..." className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                      value={searchTerms.tags} onChange={e => setSearchTerms({ ...searchTerms, tags: e.target.value })} />
                  </div>
                  {renderCheckboxList(tags.map((t: any) => ({ label: t.name || t.label, value: t.id })), selectedTags, setSelectedTags, searchTerms.tags)}
                </div>
              )}
            </div>

            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("startDate")}>
                <span className="font-medium text-sm select-none">Start Date</span>
                {dropdowns.startDate ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.startDate && (
                <div className="mt-4">
                  <input type="date" value={dates.startDate} onChange={e => setDates({ ...dates, startDate: e.target.value })}
                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600" />
                </div>
              )}
            </div>

            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("endDate")}>
                <span className="font-medium text-sm select-none">End Date</span>
                {dropdowns.endDate ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.endDate && (
                <div className="mt-4">
                  <input type="date" value={dates.endDate} onChange={e => setDates({ ...dates, endDate: e.target.value })}
                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600" />
                </div>
              )}
            </div>

            <div className="p-6 py-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown("completedAt")}>
                <span className="font-medium text-sm select-none">Completed At</span>
                {dropdowns.completedAt ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>
              {dropdowns.completedAt && (
                <div className="mt-4">
                  <input type="date" value={dates.completedAt} onChange={e => setDates({ ...dates, completedAt: e.target.value })}
                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 px-6 py-3 border-t sticky bottom-0 bg-white">
            <button className="bg-[#C72030] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c]" onClick={handleApplyFilter}>
              Apply
            </button>
            <button className="border border-[#C72030] text-[#C72030] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50" onClick={handleClearFilters}>
              Reset
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
