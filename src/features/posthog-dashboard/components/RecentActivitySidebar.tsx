import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { useRecentActiveUsers } from '../api/queries';
import {
  activityUserLabel,
  downloadRecentActiveUsers,
  type RecentActiveUser,
} from '../api/adoptionApi';
import type { QueryFilters } from '../api/queries';
import { formatRelativeActivityTime } from '../data/format';

export interface RecentActivitySidebarProps {
  filters: QueryFilters;
  filtersSettled: boolean;
}

function downloadBlob(blob: Blob | null): void {
  // The API client turns a failed (non-JSON) response into `null`.
  if (!blob) throw new Error('The activity export came back empty');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'recent-active-users.xlsx';
  // Firefox only follows a click on a link that is in the page, and Safari can
  // cancel the download if the URL is revoked straight away.
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ActivityUser({ user }: { user: RecentActiveUser }) {
  return (
    <li className="recent-activity-user">
      <div className="recent-activity-user-main">
        <strong title={user.email || undefined}>{activityUserLabel(user)}</strong>
        <span>{user.path || user.last_event || 'Activity recorded'}</span>
      </div>
      <div className="recent-activity-meta">
        {user.site_name && <span>{user.site_name}</span>}
        <time>{formatRelativeActivityTime(user.minutes_ago)}</time>
      </div>
    </li>
  );
}

export function RecentActivitySidebar({ filters, filtersSettled }: RecentActivitySidebarProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const canUseFilters = filters.allowEmptySites === true || filters.siteIds.length > 0;
  const usersQuery = useRecentActiveUsers({ ...filters, enabled: filters.enabled && filtersSettled });
  const users = usersQuery.data?.users ?? [];

  useEffect(() => {
    if (usersQuery.error) console.error('Unable to load recent active users', usersQuery.error);
  }, [usersQuery.error]);

  const handleDownload = async () => {
    if (isDownloading || !filtersSettled || !canUseFilters) return;
    setIsDownloading(true);
    try {
      const blob = await downloadRecentActiveUsers(filters);
      downloadBlob(blob);
    } catch (error) {
      console.error('Unable to download recent active users', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="recent-activity" aria-labelledby="recent-activity-title">
      <div className="recent-activity-head">
        <h2 id="recent-activity-title">Recent Activity</h2>
        <button
          type="button"
          className="iconbtn recent-activity-download"
          aria-label="Download recent activity"
          title="Download recent activity"
          disabled={isDownloading || !filtersSettled || !canUseFilters}
          onClick={handleDownload}
        >
          <Download aria-hidden="true" />
        </button>
      </div>
      {!filtersSettled || usersQuery.isLoading ? (
        <p className="recent-activity-state">Loading…</p>
      ) : users.length === 0 ? (
        <p className="recent-activity-state">No recent activity yet.</p>
      ) : (
        <ul className="recent-activity-list">
          {/* One row per event, so a user appears many times: key by position, not user_id. */}
          {users.map((user, index) => <ActivityUser key={`${index}-${user.user_id}`} user={user} />)}
        </ul>
      )}
    </section>
  );
}