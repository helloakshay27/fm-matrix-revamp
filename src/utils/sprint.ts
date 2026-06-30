import { ApiSprint, SprintDetails, SprintMember, Task } from "@/types/sprint";

export function formatToDDMMYYYY_AMPM(dateString: string | undefined) {
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

export const calculateDuration = (start?: string, end?: string) => {
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

// Normalize raw status to display value
export const mapStatusToDisplay = (raw?: string) => {
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

export const STATUS_COLORS: Record<string, string> = {
  active: "bg-[#E4636A] text-white",
  in_progress: "bg-[#08AEEA] text-white",
  on_hold: "bg-[#7BD2B5] text-black",
  overdue: "bg-[#FF2733] text-white",
  completed: "bg-[#83D17A] text-black",
};

export const mapDisplayToApiStatus = (displayStatus: string) => {
  const reverseStatusMap: Record<string, string> = {
    Active: "active",
    "In Progress": "in_progress",
    "On Hold": "on_hold",
    Overdue: "overdue",
    Completed: "completed",
  };
  return reverseStatusMap[displayStatus] || "open";
};

export const dropdownOptions = [
  "Open",
  "In Progress",
  "On Hold",
  "Overdue",
  "Completed",
];

export const extractMembers = (api: ApiSprint): SprintMember[] => {
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

export const fmtMinutes = (m?: number): string => {
  if (m == null) return "-";
  if (m === 0) return "0m";
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h > 0 && min > 0) return `${h}h ${min}m`;
  if (h > 0) return `${h}h`;
  return `${min}m`;
};

export const mapApiToDetails = (api: ApiSprint): SprintDetails => ({
  id: api.id,
  title: api.title ?? api.name,
  created_by_name: api.created_by_name ?? "-",
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

export const mapApiTasks = (api: ApiSprint): Task[] => {
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
