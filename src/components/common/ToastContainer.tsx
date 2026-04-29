import {
  useNotificationStore,
  type ToastVariant,
} from "@/stores/notificationStore";

const toastStyle = (variant: ToastVariant): React.CSSProperties => {
  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    fontSize: "0.8125rem",
    fontWeight: 500,
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    minWidth: "240px",
    maxWidth: "360px",
    border: "1px solid",
    transition: "opacity 0.2s ease",
  };
  switch (variant) {
    case "success":
      return {
        ...base,
        backgroundColor: "var(--forest-10)",
        color: "var(--forest)",
        borderColor: "var(--forest-20)",
      };
    case "error":
      return {
        ...base,
        backgroundColor: "var(--crimson-10)",
        color: "var(--crimson)",
        borderColor: "var(--crimson-10)",
      };
    case "warning":
      return {
        ...base,
        backgroundColor: "var(--amber-10)",
        color: "var(--amber)",
        borderColor: "var(--amber-10)",
      };
    default:
      return {
        ...base,
        backgroundColor: "var(--sky-10)",
        color: "var(--sky)",
        borderColor: "var(--sky-10)",
      };
  }
};

const ToastContainer = () => {
  const { toasts, removeToast } = useNotificationStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        alignItems: "flex-end",
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={toastStyle(toast.variant)}>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              opacity: 0.6,
              lineHeight: 1,
              padding: 0,
              fontSize: "0.875rem",
              flexShrink: 0,
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
