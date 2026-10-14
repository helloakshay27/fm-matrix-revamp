import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import type { RecentActiveUser } from "@/features/posthog-dashboard/api/adoptionApi";
import { useClubRecentActiveUsers } from "./usageQueries";
import type { UsageFilters } from "./usageData";

function relativeTime(minutesAgo: number | null, lastEvent: string | null) {
  if (minutesAgo != null && Number.isFinite(minutesAgo)) {
    if (minutesAgo < 1) return "Just now";
    if (minutesAgo < 60) return `${Math.floor(minutesAgo)}m ago`;
    const hours = Math.floor(minutesAgo / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
  if (!lastEvent) return "Recently";
  const date = new Date(lastEvent);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function ActivityRow({ user }: { user: RecentActiveUser }) {
  return (
    <li className="recent-activity-row">
      <span className="recent-activity-avatar" aria-hidden="true">
        {(user.display_name || user.user_id || "?").trim().slice(0, 1).toUpperCase()}
      </span>
      <span className="recent-activity-detail">
        <span className="recent-activity-name" title={user.display_name || user.user_id}>
          {user.display_name || user.user_id || "Unknown user"}
        </span>
        <span className="recent-activity-path" title={user.path || user.last_event || ""}>
          {user.path || user.last_event || "Active"}
        </span>
        <span className="recent-activity-time">{relativeTime(user.minutes_ago, user.last_event)}</span>
      </span>
    </li>
  );
}

export function RecentActivity({ filters }: { filters: UsageFilters }) {
  const query = useClubRecentActiveUsers(filters);
  const users = query.data?.users ?? [];
  const isDownloadDisabled = query.isFetching || users.length === 0;

  const downloadActivity = () => {
    if (!users.length) return;

    const rows = users.map((user) => ({
      "Activity / User Name": user.display_name || user.user_id || "Unknown user",
      "User ID": user.user_id || "",
      "Activity Description / Route": user.path || user.last_event || "Active",
      "Organization / Site": user.site_name || "",
      "Last Event Timestamp": user.last_event || "",
      "Minutes Ago": user.minutes_ago ?? "",
      "Activity Time": relativeTime(user.minutes_ago, user.last_event),
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 28 },
      { wch: 24 },
      { wch: 48 },
      { wch: 26 },
      { wch: 28 },
      { wch: 14 },
      { wch: 20 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recent Activity");

    const now = new Date();
    const date = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
    XLSX.writeFile(workbook, `club-management-recent-activity-${date}.xlsx`);
  };

  return (
    <section className="recent-activity" aria-labelledby="recentActivityTitle">
      <div className="recent-activity-heading">
        <h2 id="recentActivityTitle">Recent Activity</h2>
        <button
          type="button"
          className="recent-activity-download"
          aria-label="Download Recent Activity"
          title={users.length ? "Download Recent Activity" : "No recent activity to download"}
          onClick={downloadActivity}
          disabled={isDownloadDisabled}
        >
          <Download size={14} aria-hidden="true" />
        </button>
      </div>

      {query.isFetching ? (
        <ul className="recent-activity-list" aria-label="Loading recent activity" aria-busy="true">
          {[0, 1, 2, 3].map((row) => (
            <li className="recent-activity-skeleton" key={row}>
              <span className="recent-skeleton-avatar" />
              <span className="recent-skeleton-lines">
                <span />
                <span />
              </span>
            </li>
          ))}
        </ul>
      ) : query.isError ? (
        <p className="recent-activity-empty" role="status">Could not load activity.</p>
      ) : users.length ? (
        <ul className="recent-activity-list">
          {users.map((user, index) => (
            <ActivityRow key={`${user.user_id}-${user.last_event ?? index}`} user={user} />
          ))}
        </ul>
      ) : (
        <p className="recent-activity-empty">No recent activity.</p>
      )}
    </section>
  );
}
