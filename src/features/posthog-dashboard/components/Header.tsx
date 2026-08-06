import { useDashboard } from '../context/DashboardContext';
import { Activity } from 'lucide-react';

export function Header() {
  const { vm } = useDashboard();
  return (
    <header className="phg-top">
      <div className="phg-wrap">
        <div className="phg-brand">
          <div className="phg-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} color="white" />
          </div>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Usage Analytics
            </h1>
            <div className="phg-sub">Employee adoption &amp; engagement with the application · Phygital.work</div>
          </div>
        </div>
        <div className="phg-hmeta">
          <div className="phg-cust">{localStorage.getItem('selectedOrg') ?? 'Organization'}</div>
          <div>{vm.scopeLabel}</div>
          {vm.generatedAt && (
            <span className="phg-badge-sample" title="generated_at from the traffic_session response">
              Live · {new Date(vm.generatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
