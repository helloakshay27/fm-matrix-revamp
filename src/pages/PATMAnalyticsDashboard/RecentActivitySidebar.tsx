import { Download } from 'lucide-react';
import { formatRelativeActivityTime } from '@/features/posthog-dashboard/data/format';
import { activityUserLabel } from '@/features/posthog-dashboard/api/adoptionApi';
import { usePatmRecentActiveUsers } from './patmQueries';
import { downloadPatmActiveUsers } from './patmApi';
import { ExportSpinner, ExportStatus, useExportDownload } from '@/features/posthog-dashboard/components/ExportProgress';

function saveBlob(blob: Blob | null, filename: string): void {
  if (!blob) throw new Error('The activity export came back empty');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function RecentActivitySidebar({ from, to }: { from: string; to: string }) {
  const query = usePatmRecentActiveUsers({ from, to });
  const users = query.data?.users ?? [];
  const exportJob = useExportDownload();
  const isDownloading = exportJob.busy;

  const handleDownload = () =>
    exportJob.run(async (onPhase) =>
      saveBlob(await downloadPatmActiveUsers({ from, to }, onPhase), `patm_active_users_${from}_to_${to}.xlsx`),
    );

  return (
    <section className="recent-activity" aria-labelledby="patm-recent-activity-title">
      <div className="recent-activity-head">
        <h2 id="patm-recent-activity-title">Recent Activity</h2>
        <button
          type="button"
          className="iconbtn recent-activity-download"
          aria-label="Download recent activity"
          title={isDownloading ? 'Preparing the download…' : 'Download every event in the range (.xlsx)'}
          disabled={isDownloading}
          aria-busy={isDownloading}
          onClick={handleDownload}
        >
          {isDownloading ? <ExportSpinner /> : <Download aria-hidden="true" />}
        </button>
      </div>
      <ExportStatus phase={exportJob.phase} startedAt={exportJob.startedAt} error={exportJob.error} />
      {query.isLoading ? (
        <p className="recent-activity-state" role="status">Loading…</p>
      ) : query.isError ? (
        <p className="recent-activity-state" role="alert">Unable to load recent activity.</p>
      ) : users.length === 0 ? (
        <p className="recent-activity-state">No recent activity yet.</p>
      ) : (
        <ul className="recent-activity-list">
          {/* One row per event, so a user appears many times: key by position, not user_id. */}
          {users.map((user, index) => (
            <li className="recent-activity-user" key={`${index}-${user.user_id}`}>
              <div className="recent-activity-user-main">
                <strong title={user.email || undefined}>{activityUserLabel(user)}</strong>
                <span>{user.path || user.last_event || 'Activity recorded'}</span>
              </div>
              <div className="recent-activity-meta">
                {user.site_name && <span>{user.site_name}</span>}
                <time>{formatRelativeActivityTime(user.minutes_ago)}</time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
