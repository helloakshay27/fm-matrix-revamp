import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useRecentActiveUsers } from '../api/queries';
import type { CalendarQueryFilters } from '../api/queries';
import { formatRelativeActivityTime } from '@/features/posthog-dashboard/data/format';
import { downloadRecentActiveUsers, type RecentActiveUser } from '../api/adoptionApi';

const ACTIVITY_EXPORT_COLUMNS = [
  'user_id',
  'user_name',
  'email',
  'device_type',
  'os',
  'device_id',
  'timestamp (IST)',
  'site_id',
  'site_name',
];

function downloadBlob(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'recent-active-users.xlsx';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadEmptyActivitySheet(): void {
  const worksheet = XLSX.utils.aoa_to_sheet([ACTIVITY_EXPORT_COLUMNS]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Recent Activity');
  XLSX.writeFile(workbook, 'recent-active-users.xlsx');
}

function ActivityUser({ user }: { user: RecentActiveUser }) {
  return (
    <li className="recent-activity-user">
      <div className="recent-activity-user-main">
        <strong>{user.display_name}</strong>
        <span>{user.path || user.last_event || 'Activity recorded'}</span>
      </div>
      <div className="recent-activity-meta">
        {user.site_name && <span>{user.site_name}</span>}
        <time>{formatRelativeActivityTime(user.minutes_ago ?? 0)}</time>
      </div>
    </li>
  );
}

export function RecentActivitySidebar({ filters }: { filters: CalendarQueryFilters }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const usersQuery = useRecentActiveUsers(filters);
  const users = usersQuery.data?.users ?? [];

  useEffect(() => {
    if (usersQuery.error) console.error('Unable to load recent active users', usersQuery.error);
  }, [usersQuery.error]);

  const handleDownload = async () => {
    if (isDownloading || filters.enabled === false || usersQuery.isLoading || usersQuery.isFetching) return;
    setIsDownloading(true);
    try {
      if (usersQuery.isError || !usersQuery.data || users.length === 0) {
        downloadEmptyActivitySheet();
        return;
      }
      const blob = await downloadRecentActiveUsers({
        from: filters.from,
        to: filters.to,
        os: filters.os,
        provider: filters.provider,
      });
      downloadBlob(blob);
    } catch (error) {
      console.error('Unable to download recent active users', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="recent-activity" aria-labelledby="calendar-recent-activity-title">
      <div className="recent-activity-head">
        <h2 id="calendar-recent-activity-title">Recent Activity</h2>
        <button
          type="button"
          className="iconbtn recent-activity-download"
          aria-label="Download recent activity"
          title={isDownloading ? 'Preparing recent activity download' : 'Download recent activity'}
          disabled={isDownloading || filters.enabled === false || usersQuery.isLoading || usersQuery.isFetching}
          onClick={handleDownload}
        >
          <Download aria-hidden="true" />
        </button>
      </div>
      {filters.enabled === false || usersQuery.isLoading || usersQuery.isFetching ? (
        <p className="recent-activity-state">Loading…</p>
      ) : usersQuery.isError ? (
        <p className="recent-activity-state">Activity unavailable.</p>
      ) : users.length === 0 ? (
        <p className="recent-activity-state">No recent activity yet.</p>
      ) : (
        <ul className="recent-activity-list">
          {users.map((user) => <ActivityUser key={user.user_id} user={user} />)}
        </ul>
      )}
    </section>
  );
}
