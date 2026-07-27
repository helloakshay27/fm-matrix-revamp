import { useDashboard } from '../context/DashboardContext';

export function Header() {
  const { vm } = useDashboard();
  return (
    <header className="phg-top">
      <div className="phg-wrap">
        <div className="phg-brand">
          <div className="phg-logo">FM</div>
          <div>
            <h1>FM Matrix · Adoption Analytics</h1>
            <div className="phg-sub">Employee adoption &amp; engagement with the application · Phygital.work</div>
          </div>
        </div>
        <div className="phg-hmeta">
          <div className="phg-cust">PSIPL — Property Solutions (India)</div>
          <div>{vm.scopeLabel}</div>
          <span className="phg-badge-sample">Wireframe · sample data</span>
        </div>
      </div>
    </header>
  );
}
