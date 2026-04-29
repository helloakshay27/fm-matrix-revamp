interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
      {message}
    </p>
    {onRetry && (
      <button onClick={onRetry} className="btn">
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
