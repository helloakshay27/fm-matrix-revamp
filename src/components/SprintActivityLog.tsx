import { useEffect, useState, Fragment } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface ActivityType {
  type: "SPRINT_CREATED" | "TASK_ADDED" | "TASK_REMOVED" | "FIELD_UPDATED";
  message: string;
}

const parseActivityType = (log: any): ActivityType => {
  const { log_of, changed_attr } = log;

  if (!changed_attr || Object.keys(changed_attr).length === 0) {
    return { type: "FIELD_UPDATED", message: "Record updated" };
  }

  if (log_of === "Sprint") {
    return { type: "SPRINT_CREATED", message: "Sprint created" };
  }

  if (log_of === "SprintTask") {
    const taskIdAttr = changed_attr.task_id;

    if (Array.isArray(taskIdAttr) && taskIdAttr.length >= 2) {
      const [oldVal, newVal] = taskIdAttr;

      if ((oldVal === null || oldVal === "nil") && newVal != null) {
        return { type: "TASK_ADDED", message: "Task added to sprint" };
      }

      if (oldVal != null && (newVal === null || newVal === "nil")) {
        return { type: "TASK_REMOVED", message: "Task removed from sprint" };
      }
    }
  }

  return { type: "FIELD_UPDATED", message: "Record updated" };
};

const isActivityCreation = (activityType: ActivityType): boolean => {
  return (
    activityType.type === "SPRINT_CREATED" ||
    activityType.type === "TASK_ADDED"
  );
};

const isWithinTimeWindow = (
  date1: Date,
  date2: Date,
  windowMs: number = 5000
): boolean => {
  return Math.abs(date1.getTime() - date2.getTime()) <= windowMs;
};

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

    if (actType.type === "TASK_ADDED") {
      const taskAddGroup = [log];
      const baseUserId = log.changed_by;
      const baseSprintId = log.sprint_id;
      const baseTimestamp = new Date(log.created_at);

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

      if (taskAddGroup.length > 1) {
        grouped.push({
          type: "grouped",
          logs: taskAddGroup,
          groupLabel: `added ${taskAddGroup.length} tasks to Sprint`,
        });
        i = j;
      } else {
        grouped.push({ type: "single", logs: [log] });
        i++;
      }
    } else {
      grouped.push({ type: "single", logs: [log] });
      i++;
    }
  }

  return grouped;
};

interface SprintActivityLogProps {
  sprintId: string;
}

export default function SprintActivityLog({ sprintId }: SprintActivityLogProps) {
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
    "id", "created_at", "updated_at", "resource_id", "resource_type",
    "created_by_id", "sprint_id", "task_id",
  ]);

  const FIELD_LABELS: Record<string, string> = {
    status: "Status", title: "Title", name: "Name",
    description: "Description", start_date: "Start Date",
    end_date: "End Date", priority: "Priority",
    owner_id: "Owner", sprint_owner_name: "Owner",
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
          oldVal = arr[0] === "nil" || arr[0] === null ? "\u2014" : String(arr[0]);
          newVal = String(arr[arr.length - 1]);
        } else {
          oldVal = arr[0] === "nil" || arr[0] === null ? "\u2014" : String(arr[0]);
          newVal = arr[1] === "nil" || arr[1] === null ? "\u2014" : String(arr[1]);
        }

        if (key === "owner_id") {
          if (oldVal !== "\u2014") oldVal = userMapping[oldVal] || oldVal;
          if (newVal !== "\u2014") newVal = userMapping[newVal] || newVal;
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
        <span className="text-sm">Loading activity logs\u2026</span>
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
                    {group.type === "grouped" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-base leading-none">✦</span>
                        <span className="text-[11px] font-semibold text-green-700">
                          {representativeLog.changed_by} {group.groupLabel}
                        </span>
                      </div>
                    ) : activityType.type === "SPRINT_CREATED" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-base leading-none">✦</span>
                        <span className="text-[11px] font-semibold text-green-700">Sprint Created</span>
                      </div>
                    ) : activityType.type === "TASK_ADDED" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-base leading-none">✦</span>
                        <span className="text-[11px] font-semibold text-green-700">Task Added To Sprint</span>
                      </div>
                    ) : activityType.type === "TASK_REMOVED" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-base leading-none">✕</span>
                        <span className="text-[11px] font-semibold text-red-700">Task Removed From Sprint</span>
                      </div>
                    ) : !changes || changes.fields.length === 0 ? (
                      <p className="text-[10px] text-gray-400 italic">
                        {representativeLog.log_type?.replace("Sprint", "").trim() || "Updated sprint"}
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
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium capitalize ${STATUS_BADGE[field.old] || "bg-gray-100 text-gray-500"}`}>
                                  {field.old === "\u2014" ? "\u2014" : field.old.replace(/_/g, " ")}
                                </span>
                                <span className="text-gray-400 text-[10px] font-bold">→</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium capitalize ${STATUS_BADGE[field.new] || "bg-gray-100 text-gray-500"}`}>
                                  {field.new === "\u2014" ? "\u2014" : field.new.replace(/_/g, " ")}
                                </span>
                              </>
                            ) : (
                              <div className="flex items-center gap-1 w-full">
                                <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[70px]" title={field.old}>
                                  {field.old}
                                </span>
                                <span className="text-gray-400 text-[10px] font-bold flex-shrink-0">→</span>
                                <span className="text-[9px] text-gray-800 font-semibold bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[70px]" title={field.new}>
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
}
