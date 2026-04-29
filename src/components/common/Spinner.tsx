import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => (
  <div
    className={cn("h-5 w-5 animate-spin rounded-full border-2", className)}
    style={{ borderColor: "var(--border-md)", borderTopColor: "var(--coral)" }}
  />
);

export default Spinner;
