import { useMsafeDashboard } from '../context/MsafeDashboardContext';
import { CheckCircle2 } from 'lucide-react';

export function ToastStack() {
  const { toasts } = useMsafeDashboard();
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className="toast show">
          <CheckCircle2 size={16} />
          {t.message}
        </div>
      ))}
    </div>
  );
}
