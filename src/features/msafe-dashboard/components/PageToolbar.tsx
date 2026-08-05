import { LayoutDashboard } from 'lucide-react';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function PageToolbar() {
  const { persona, setPersona, module, setModule } = useMsafeDashboard();

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">M</div>
        <div className="brand-text">
          <div className="name">M-Safe</div>
          <div className="sub">Vi MyWorkspace · Safety Compliance</div>
        </div>
      </div>

      <div className="persona-toggle">
        <button
          type="button"
          className={`persona-pill ${persona === 'admin' ? 'active' : ''}`}
          onClick={() => setPersona('admin')}
        >
          Pan India
        </button>
        <button
          type="button"
          className={`persona-pill ${persona === 'circle' ? 'active' : ''}`}
          onClick={() => setPersona('circle')}
        >
          Circle Manager
        </button>
      </div>

      <button
        type="button"
        className={`mydash-btn ${module === 'mydashboard' ? 'active' : ''}`}
        onClick={() => {
          setModule('mydashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <LayoutDashboard size={16} />
        My Dashboard
      </button>

      <div className="tb-spacer" />

      <div className="tb-avatar">
        <div className="av">AK</div>
        <div className="av-txt">
          <div className="n">Amrita K.</div>
          <div className="r">{persona === 'admin' ? 'Pan India' : 'Circle Manager'}</div>
        </div>
      </div>
    </header>
  );
}
