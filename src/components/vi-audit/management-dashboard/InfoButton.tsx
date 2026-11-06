import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

interface InfoButtonProps {
  text: string;
  title?: string;
}

export function InfoButton({ text, title = "How It's Calculated" }: InfoButtonProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 12, top: 12 });
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const hide = () => setOpen(false);
    window.addEventListener("scroll", hide, true);
    return () => window.removeEventListener("scroll", hide, true);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="info-btn"
        aria-describedby={open ? id : undefined}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        onMouseEnter={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const width = 320;
          let left = rect.right - width;
          if (left < 12) left = 12;
          if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
          let top = rect.bottom + 8;
          if (top + 180 > window.innerHeight) top = Math.max(12, rect.top - 160);
          setPos({ left, top });
          setOpen(true);
        }}
        onMouseLeave={() => setOpen(false)}
      >
        i
      </button>
      {open
        ? createPortal(
            <div id={id} className="info-float vad-tip show" style={{ left: pos.left, top: pos.top }}>
              <div className="info-hd">{title}</div>
              <div className="info-body">{text}</div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls = status === "Closed" ? "b-info" : status === "Open" ? "b-err" : "b-warn";
  return <span className={`badge ${cls}`}>{status}</span>;
}

interface ToastItem {
  id: number;
  message: string;
}

export function ToastHost({ toasts }: { toasts: ToastItem[] }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast show">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
