import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatHeroTone = "purple" | "teal" | "peach" | "blue";
export type StatHeroAccent = "success" | "info" | "green" | "warning" | "error" | "neutral";

const TONE_STYLE: Record<StatHeroTone, React.CSSProperties> = {
  purple: { backgroundColor: "#EFEFFB" },
  teal: { backgroundColor: "#B7DCD44D" },
  peach: { backgroundColor: "#E3909026" },
  blue: { backgroundColor: "#85BDF633" },
};

// Darker shade of each tone's own base color (not the accent), used for the
// progress-bar fill so the bar always reads as "this card's color, deepened"
// rather than an unrelated semantic accent color.
const TONE_PROGRESS_COLOR: Record<StatHeroTone, string> = {
  purple: "#9B9BA3",
  teal: "#778F8A",
  peach: "#945E5E",
  blue: "#567BA0",
};

const ACCENT_TEXT_CLASSES: Record<StatHeroAccent, string> = {
  success: "text-brand-success",
  info: "text-brand-info",
  green: "text-brand-green",
  warning: "text-[#8A5A00]",
  error: "text-brand-error",
  neutral: "text-brand-text",
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
      className={cn("relative rounded-xl p-4", onClick && "cursor-pointer", className)}
      style={TONE_STYLE[tone]}
    >
      <button
        type="button"
        aria-label="How this is calculated"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full border border-black/30 bg-white/70 flex items-center justify-center text-black"
      >
        <Info className="w-3 h-3" />
      </button>

      <div className="text-brand-caption font-medium text-black uppercase tracking-wide mb-1">{label}</div>
      <div className={cn("text-[22px] font-bold leading-none", ACCENT_TEXT_CLASSES[accent])}>{value}</div>

      {progress !== undefined && (
        <div className="h-[3px] bg-white/60 rounded-full mt-1.5 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              backgroundColor: TONE_PROGRESS_COLOR[tone],
            }}
          />
        </div>
      )}

      {subtitle && <div className="text-brand-caption text-black mt-1">{subtitle}</div>}
    </div>
  );
}
