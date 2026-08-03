import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatHeroTone = "purple" | "teal" | "peach" | "blue";
export type StatHeroAccent = "success" | "info" | "green" | "warning" | "error";

const TONE_CLASSES: Record<StatHeroTone, string> = {
  purple: "bg-brand-purple-bg",
  teal: "bg-brand-teal-bg",
  peach: "bg-brand-light",
  blue: "",
};

const TONE_STYLE: Partial<Record<StatHeroTone, React.CSSProperties>> = {
  blue: { backgroundColor: "rgba(var(--color-info-rgb), 0.12)" },
};

const ACCENT_TEXT_CLASSES: Record<StatHeroAccent, string> = {
  success: "text-brand-success",
  info: "text-brand-info",
  green: "text-brand-green",
  warning: "text-[#8A5A00]",
  error: "text-brand-error",
};

const ACCENT_BAR_CLASSES: Record<StatHeroAccent, string> = {
  success: "bg-brand-success",
  info: "bg-brand-info",
  green: "bg-brand-green",
  warning: "bg-brand-warning",
  error: "bg-brand-error",
};

export interface StatHeroCardProps {
  tone: StatHeroTone;
  label: string;
  value: string;
  accent: StatHeroAccent;
  subtitle?: string;
  /** 0-100 — renders a thin progress track under the value, in the accent color */
  progress?: number;
  onClick?: () => void;
  className?: string;
}

/**
 * Tinted KPI hero card — mirrors the ".ki" scorecard tiles in
 * fm_matrix_phase10 (29).html (Response SLA / Customer Tickets / Internal
 * Tickets row). Tone maps to existing brand tint tokens rather than the
 * reference's raw nth-child hex values, so it stays inside the design system.
 */
export function StatHeroCard({
  tone,
  label,
  value,
  accent,
  subtitle,
  progress,
  onClick,
  className,
}: StatHeroCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn("relative rounded-xl p-4", onClick && "cursor-pointer", TONE_CLASSES[tone], className)}
      style={TONE_STYLE[tone]}
    >
      <button
        type="button"
        aria-label="How this is calculated"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full border border-brand-green/60 bg-white/70 flex items-center justify-center text-brand-green"
      >
        <Info className="w-3 h-3" />
      </button>

      <div className="text-brand-caption font-medium text-brand-green uppercase tracking-wide mb-1">{label}</div>
      <div className={cn("text-[22px] font-bold leading-none", ACCENT_TEXT_CLASSES[accent])}>{value}</div>

      {progress !== undefined && (
        <div className="h-[3px] bg-white/60 rounded-full mt-1.5 overflow-hidden">
          <div
            className={cn("h-full rounded-full", ACCENT_BAR_CLASSES[accent])}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {subtitle && <div className="text-brand-caption text-brand-green mt-1">{subtitle}</div>}
    </div>
  );
}
