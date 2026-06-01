import axios from "axios";
import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ChevronDown, ChevronDownCircle, Eye, Loader2, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useLayout } from "@/contexts/LayoutContext";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchSprintById, updateSprintStatus } from "@/store/slices/sprintSlice";
import SprintTasks from "@/components/SprintTasks";
import SprintIssues from "@/components/SprintIssues";

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
  { key: "task_title", label: "Task Title", sortable: true, draggable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, draggable: true, defaultVisible: true },
  { key: "responsible_person", label: "Responsible Person", sortable: true, draggable: true, defaultVisible: true },
  { key: "target_date", label: "Target Date", sortable: true, draggable: true, defaultVisible: true },
  { key: "priority", label: "Priority", sortable: true, draggable: true, defaultVisible: true },
  { key: "estimated_hour", label: "Estimated Hours", sortable: true, draggable: true, defaultVisible: true },
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

const CountdownTimer = ({ startDate, targetDate }: { startDate?: string; targetDate?: string }) => {
  const [countdown, setCountdown] = useState(calculateDuration(startDate, targetDate));
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateDuration(startDate, targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, startDate]);
  return <div className="text-left text-[#029464] text-[12px]">{countdown}</div>;
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
  sprint_issues?: any[];
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

const AVATAR_COLORS = ["#E95420", "#08AEEA", "#7BD2B5", "#6366F1", "#F59E0B", "#10B981", "#EC4899"];

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const extractMembers = (api: ApiSprint): SprintMember[] => {
  const members: SprintMember[] = [];
  const seen = new Set<string>();

  if (api.sprint_owner_name && api.owner_id != null) {
    const key = `${api.owner_id}`;
    seen.add(key);
    members.push({ id: api.owner_id, name: api.sprint_owner_name, role: "owner" });
  }

  (api.sprint_task_managements ?? []).forEach((t) => {
    const tm = t;
    if (tm?.responsible_person_name && tm?.responsible_person_id != null) {
      const key = `${tm.responsible_person_id}`;
      if (!seen.has(key)) {
        seen.add(key);
        members.push({ id: tm.responsible_person_id, name: tm.responsible_person_name, role: "assignee" });
      }
    }
  });

  return members;
};

// Map API sprint -> local details type
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
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [membersSummary, setMembersSummary] = useState<MemberSummary[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Open");
  const [activeTab, setActiveTab] = useState<"tasks" | "issues">("tasks");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const resp = (await dispatch(fetchSprintById({ token, baseUrl, id })).unwrap()) as ApiSprint;
      setSprintDetails(mapApiToDetails(resp));
      setTasks(mapApiTasks(resp));
      setSprintIssues(resp.sprint_issues ?? []);
      setSprintMembers(extractMembers(resp));
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        data: { status: option.toLowerCase().replace(/\s+/g, "_"), },
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
      const colorClass = STATUS_COLORS[statusKey as keyof typeof STATUS_COLORS] || "bg-gray-200 text-gray-800";
      return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
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
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="flex items-center gap-3 ml-10">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  {i < 4 && <span className="border h-[1px] inline-block w-full my-4"></span>}
                </div>
              ))}
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
                      onKeyDown={(e) => e.key === "Enter" && setOpenDropdown(!openDropdown)}
                    >
                      <span className="text-[13px]">{selectedOption}</span>
                      <ChevronDown size={15} className={`${openDropdown ? "rotate-180" : ""} transition-transform`} />
                    </div>
                    <ul
                      className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"}`}
                      role="menu"
                      style={{ minWidth: "150px", maxHeight: "400px", overflowY: "auto", zIndex: 1000 }}
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
                      <Users size={15} /> Sprint Members
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="border-b-[3px] border-grey my-3"></div>

            {/* Details Section (matches card style) */}
            <div className="border rounded-[10px] shadow-md p-5 mb-4">
              <div className="font-[600] text-[16px] flex items-center gap-4">
                <ChevronDownCircle color="#E95420" size={30} />
                Details
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-3 ml-10">
                  <span className="text-[13px] font-medium text-[#1A1A1A]">Responsible Person:</span>
                  <span className="text-[13px] text-[#1A1A1A]">{sprintDetails.responsible_person || "-"}</span>
                </div>
                <span className="border h-[1px] inline-block w-full my-4"></span>
                <div className="flex items-center gap-3 ml-10">
                  <span className="text-[13px] font-medium text-[#1A1A1A]">Priority:</span>
                  <span className="text-[13px] text-[#1A1A1A]">{sprintDetails.priority || "-"}</span>
                </div>
                <span className="border h-[1px] inline-block w-full my-4"></span>
                <div className="flex items-center gap-3 ml-10">
                  <span className="text-[13px] font-medium text-[#1A1A1A]">Start Date:</span>
                  <span className="text-[13px] text-[#1A1A1A]">{sprintDetails.start_date || "-"}</span>
                </div>
                <span className="border h-[1px] inline-block w-full my-4"></span>
                <div className="flex items-center gap-3 ml-10">
                  <span className="text-[13px] font-medium text-[#1A1A1A]">End Date:</span>
                  <span className="text-[13px] text-[#1A1A1A]">{sprintDetails.end_date || "-"}</span>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div>
              {/* Tab headers */}
              <div className="flex items-center gap-0 border-b-[3px] border-[rgba(190,190,190,1)]">
                {(["tasks", "issues"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-2 text-[14px] font-[500] capitalize transition-colors focus:outline-none ${activeTab === tab
                      ? "text-[#E95420]"
                      : "text-[#323232] hover:text-[#E95420]"
                      }`}
                  >
                    {tab === "tasks" ? "Tasks" : "Issues"}
                    {activeTab === tab && (
                      <span className="absolute bottom-[-3px] left-0 w-full h-[3px] bg-[#E95420] rounded-t-sm" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="mt-4 overflow-x-auto">
                {activeTab === "tasks" && <SprintTasks tasks={tasks} />}
                {activeTab === "issues" && <SprintIssues issues={sprintIssues} />}
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
        <DialogTitle className="relative !py-5 !px-0 shrink-0">
          <div className="flex items-center gap-2 px-6">
            <Users size={18} className="text-[#E95420]" />
            <span className="text-base font-semibold text-gray-800">Sprint Members</span>
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
            <div className="overflow-auto">
              <table className="w-full text-sm border-collapse" style={{ minWidth: 920 }}>
                <thead className="sticky top-0 z-10">
                  {/* Group header row — single consistent dark tone */}
                  <tr>
                    <th
                      rowSpan={2}
                      className="bg-[#f5f5dc] text-black text-left px-4 py-3 font-semibold text-xs tracking-wide border-r border-slate-300 align-middle whitespace-nowrap"
                      style={{ minWidth: 190 }}
                    >
                      Member
                    </th>
                    <th colSpan={3} className="bg-[#f5f5dc] text-black text-center px-3 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-500">
                      Tasks
                    </th>
                    <th colSpan={3} className="bg-[#f5f5dc] text-black text-center px-3 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-500">
                      Issues
                    </th>
                    <th colSpan={2} className="bg-[#f5f5dc] text-black text-center px-3 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-500">
                      Task Minutes
                    </th>
                    <th colSpan={2} className="bg-[#f5f5dc] text-black text-center px-3 py-2 text-xs font-semibold tracking-wide border-r border-slate-300 border-l-2 border-l-slate-500">
                      Issue Minutes
                    </th>
                    <th colSpan={2} className="text-center px-3 py-2 text-xs font-semibold tracking-wide border-l-2 border-l-[#E95420]" style={{ backgroundColor: "#E95420", color: "#fff" }}>
                      Total Minutes
                    </th>
                  </tr>
                  {/* Sub-header row */}
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {/* Tasks */}
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-200 border-l-2 border-l-slate-300 text-center whitespace-nowrap uppercase tracking-wider">Total</th>
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-200 text-center whitespace-nowrap uppercase tracking-wider">Done</th>
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-300 text-center whitespace-nowrap uppercase tracking-wider">Completion</th>
                    {/* Issues */}
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-200 border-l-2 border-l-slate-300 text-center whitespace-nowrap uppercase tracking-wider">Total</th>
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-200 text-center whitespace-nowrap uppercase tracking-wider">Done</th>
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-300 text-center whitespace-nowrap uppercase tracking-wider">Completion</th>
                    {/* Task Minutes */}
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-200 border-l-2 border-l-slate-300 text-center whitespace-nowrap uppercase tracking-wider">Effective</th>
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-300 text-center whitespace-nowrap uppercase tracking-wider">Actual</th>
                    {/* Issue Minutes */}
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-200 border-l-2 border-l-slate-300 text-center whitespace-nowrap uppercase tracking-wider">Effective</th>
                    <th className="bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-semibold border-r border-slate-300 text-center whitespace-nowrap uppercase tracking-wider">Actual</th>
                    {/* Total Minutes */}
                    <th className="px-3 py-1.5 text-[10px] font-semibold border-r border-orange-200 border-l-2 border-l-[#E95420] text-center whitespace-nowrap uppercase tracking-wider" style={{ backgroundColor: "#fff7f5", color: "#E95420" }}>Effective</th>
                    <th className="px-3 py-1.5 text-[10px] font-semibold text-center whitespace-nowrap uppercase tracking-wider" style={{ backgroundColor: "#fff7f5", color: "#E95420" }}>Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {membersSummary.map((m, i) => (
                    <tr
                      key={m.member_id}
                      className={`border-b border-slate-100 transition-colors hover:bg-slate-50/70 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                    >
                      {/* Member */}
                      <td className="px-4 py-3 border-r border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center !justify-center text-white text-[11px] font-bold shrink-0 select-none"
                            style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                          >
                            {getInitials(m.member_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-gray-800 truncate">{m.member_name}</p>
                            <p className="text-[11px] text-gray-400 truncate">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Tasks */}
                      {(() => {
                        const taskPct = m.total_tasks > 0 ? Math.round((m.completed_tasks / m.total_tasks) * 100) : 0;
                        const taskColor = taskPct === 100 ? "#10B981" : taskPct >= 50 ? "#E95420" : "#ef4444";
                        return (
                          <>
                            <td className="px-3 py-3 text-center border-r border-slate-100 border-l-2 border-l-slate-200">
                              <span className="text-[13px] font-medium text-gray-700">{m.total_tasks}</span>
                            </td>
                            <td className="px-3 py-3 text-center border-r border-slate-100">
                              <span className="text-[13px] font-medium text-gray-700">
                                {m.completed_tasks}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center border-r border-slate-200">
                              <div className="flex flex-col items-center gap-1 px-1">
                                {/* <div className="w-full bg-slate-100 rounded-full h-1.5 min-w-[48px]">
                                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${taskPct}%`, backgroundColor: taskColor }} />
                                </div> */}
                                <span className="text-[11px] font-bold" style={{ color: taskColor }}>{taskPct}%</span>
                              </div>
                            </td>
                          </>
                        );
                      })()}
                      {/* Issues */}
                      {(() => {
                        const issuePct = m.total_issues > 0 ? Math.round((m.completed_issues / m.total_issues) * 100) : 0;
                        const issueColor = issuePct === 100 ? "#10B981" : issuePct >= 50 ? "#E95420" : "#ef4444";
                        return (
                          <>
                            <td className="px-3 py-3 text-center border-r border-slate-100 border-l-2 border-l-slate-200">
                              <span className="text-[13px] font-medium text-gray-700">{m.total_issues}</span>
                            </td>
                            <td className="px-3 py-3 text-center border-r border-slate-100">
                              <span className="text-[13px] font-medium text-gray-700">
                                {m.completed_issues}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center border-r border-slate-200">
                              <div className="flex flex-col items-center gap-1 px-1">
                                {/* <div className="w-full bg-slate-100 rounded-full h-1.5 min-w-[48px]">
                                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${issuePct}%`, backgroundColor: issueColor }} />
                                </div> */}
                                <span className="text-[11px] font-bold" style={{ color: issueColor }}>{issuePct}%</span>
                              </div>
                            </td>
                          </>
                        );
                      })()}
                      {/* Task Minutes */}
                      <td className="px-3 py-3 text-center border-r border-slate-100 border-l-2 border-l-slate-200 text-[12px] text-gray-500">{fmtMin(m.task_effective_minutes)}</td>
                      <td className="px-3 py-3 text-center border-r border-slate-200 text-[12px] text-gray-500">{fmtMin(m.task_actual_minutes)}</td>
                      {/* Issue Minutes */}
                      <td className="px-3 py-3 text-center border-r border-slate-100 border-l-2 border-l-slate-200 text-[12px] text-gray-500">{fmtMin(m.issue_effective_minutes)}</td>
                      <td className="px-3 py-3 text-center border-r border-slate-200 text-[12px] text-gray-500">{fmtMin(m.issue_actual_minutes)}</td>
                      {/* Total Minutes */}
                      <td className="px-3 py-3 text-center border-r border-orange-100 border-l-2 border-l-[#E95420] text-[12px] font-semibold" style={{ color: "#E95420", backgroundColor: "#fff9f7" }}>{fmtMin(m.total_effective_minutes)}</td>
                      <td className="px-3 py-3 text-center text-[12px] font-semibold" style={{ color: "#E95420", backgroundColor: "#fff9f7" }}>{fmtMin(m.total_actual_minutes)}</td>
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
