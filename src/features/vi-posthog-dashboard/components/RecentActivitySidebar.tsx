import { useEffect } from 'react';
import { Download } from 'lucide-react';
import { useRecentActiveUsers, type QueryFilters } from '../api/queries';
import {
  downloadRecentActiveUsers,
  type RecentActiveUser,
} from '../api/adoptionApi';
import { formatRelativeActivityTime } from '@/features/posthog-dashboard/data/format';
import { activityUserLabel } from '@/features/posthog-dashboard/api/adoptionApi';
import { ExportSpinner, ExportStatus, useExportDownload } from '@/features/posthog-dashboard/components/ExportProgress';

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

export function RecentActivitySidebar({ filters }: { filters: QueryFilters }) {
  const exportJob = useExportDownload();
  const isDownloading = exportJob.busy;
  const usersQuery = useRecentActiveUsers(filters);
  const users = usersQuery.data?.users ?? [];

  useEffect(() => {
    if (usersQuery.error) console.error('Unable to load recent active users', usersQuery.error);
  }, [usersQuery.error]);

  const handleDownload = () => {
    if (isDownloading || !filters.enabled || usersQuery.isLoading || usersQuery.isFetching) return;
    return exportJob.run(async (onPhase) => downloadBlob(await downloadRecentActiveUsers(filters, onPhase)));
  };

  return (
    <section className="recent-activity" aria-labelledby="vi-recent-activity-title">
      <div className="recent-activity-head">
        <h2 id="vi-recent-activity-title">Recent Activity</h2>
        <button
          type="button"
          className="iconbtn recent-activity-download"
          aria-label="Download recent activity"
          title={isDownloading ? 'Preparing the download…' : 'Download recent activity'}
          disabled={isDownloading || !filters.enabled || usersQuery.isLoading || usersQuery.isFetching}
          aria-busy={isDownloading}
          onClick={handleDownload}
        >
          {isDownloading ? <ExportSpinner /> : <Download aria-hidden="true" />}
        </button>
      </div>
      <ExportStatus phase={exportJob.phase} startedAt={exportJob.startedAt} error={exportJob.error} />
      {!filters.enabled || usersQuery.isLoading || usersQuery.isFetching ? (
        <p className="recent-activity-state">Loading…</p>
      ) : usersQuery.isError ? (
        <p className="recent-activity-state">Activity unavailable.</p>
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
