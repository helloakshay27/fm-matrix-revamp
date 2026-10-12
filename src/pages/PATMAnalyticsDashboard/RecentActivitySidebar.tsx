import { formatRelativeActivityTime } from '@/features/posthog-dashboard/data/format';
import { usePatmRecentActiveUsers } from './patmQueries';

export function RecentActivitySidebar({ from, to }: { from: string; to: string }) {
  const query = usePatmRecentActiveUsers({ from, to });
  const users = query.data?.users ?? [];

  return (
    <section className="recent-activity" aria-labelledby="patm-recent-activity-title">
      <h2 id="patm-recent-activity-title">Recent Activity</h2>
      {query.isLoading ? (
        <p className="recent-activity-state" role="status">Loading…</p>
      ) : query.isError ? (
        <p className="recent-activity-state" role="alert">Unable to load recent activity.</p>
      ) : users.length === 0 ? (
        <p className="recent-activity-state">No recent activity yet.</p>
      ) : (
        <ul className="recent-activity-list">
          {users.map((user) => (
            <li className="recent-activity-user" key={user.user_id}>
              <div className="recent-activity-user-main">
                <strong>{user.display_name}</strong>
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
