import { LayoutDashboard } from 'lucide-react';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';
import { getUser } from '@/utils/auth';

export function PageToolbar() {
  const { persona, setPersona, module, setModule } = useMsafeDashboard();

  const selectPersona = (p: 'admin' | 'circle') => {
    setPersona(p);
    // Persona buttons are meant to bring you back to the main dashboard —
    // if the user is on "My Dashboard", switch back to the M-Safe module too.
    setModule('msafe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const user = getUser();
  const firstName = user?.firstname?.trim() || 'User';
  const lastInitial = user?.lastname?.trim()?.[0];
  const shortName = lastInitial ? `${firstName} ${lastInitial}.` : firstName;
  const avatarInitials =
    `${firstName[0] || ''}${lastInitial || ''}`.toUpperCase() || 'U';

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
          onClick={() => selectPersona('admin')}
        >
          Pan India
        </button>
        <button
          type="button"
          className={`persona-pill ${persona === 'circle' ? 'active' : ''}`}
          onClick={() => selectPersona('circle')}
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
        <div className="av">{avatarInitials}</div>
        <div className="av-txt">
          <div className="n">{shortName}</div>
          <div className="r">{persona === 'admin' ? 'Pan India' : 'Circle Manager'}</div>
        </div>
      </div>
    </header>
  );
}
