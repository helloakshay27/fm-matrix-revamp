import { Download } from "lucide-react";
import { useState } from "react";
import { activityUserLabel, downloadRecentActiveUsers, type RecentActiveUser } from "@/features/posthog-dashboard/api/adoptionApi";
import { clubRangeParams, useClubRecentActiveUsers } from "./usageQueries";
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
        {activityUserLabel(user).trim().slice(0, 1).toUpperCase()}
      </span>
      <span className="recent-activity-detail">
        <span className="recent-activity-name" title={user.email || activityUserLabel(user)}>
          {activityUserLabel(user)}
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
  const [isDownloading, setIsDownloading] = useState(false);
  const isDownloadDisabled = isDownloading;

  // Every event in the range as the server-built .xlsx (Club's own API), not just the 10 rows shown.
  const downloadActivity = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const blob = await downloadRecentActiveUsers(clubRangeParams(filters));
      if (!blob) throw new Error("The activity export came back empty");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `club_active_users_${filters.rangeFrom}_to_${filters.rangeTo}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Unable to download Club activity", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="recent-activity" aria-labelledby="recentActivityTitle">
      <div className="recent-activity-heading">
        <h2 id="recentActivityTitle">Recent Activity</h2>
        <button
          type="button"
          className="recent-activity-download"
          aria-label="Download Recent Activity"
          title="Download every event in the range (.xlsx)"
          onClick={downloadActivity}
          disabled={isDownloadDisabled}
        >
          <Download size={14} aria-hidden="true" />
        </button>
      </div>

      {query.isLoading ? (
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
            <ActivityRow key={`${index}-${user.user_id}`} user={user} />
          ))}
        </ul>
      ) : (
        <p className="recent-activity-empty">No recent activity.</p>
      )}
    </section>
  );
}
