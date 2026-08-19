import { Trophy, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterPillBarProps {
  segments?: string[];
  activeSegment?: string;
  onSegmentChange?: (segment: string) => void;
  goldenActive?: boolean;
  onGoldenToggle?: () => void;
  redFlagActive?: boolean;
  onRedFlagToggle?: () => void;
  className?: string;
}

/**
 * Quick-filter row — ".flag-toggle" (Golden / Red Flag) in
 * fm_matrix_phase10 (29).html. Golden uses the gold (#EDC488) fill; Red Flag
 * uses the brand coral (#DA7756) fill rather than the reference's red, to
 * stay on-brand. The optional `segments` group (e.g. Today/This Week/This
 * Month) only renders when passed.
 */
export function FilterPillBar({
  segments,
  activeSegment,
  onSegmentChange,
  goldenActive,
  onGoldenToggle,
  redFlagActive,
  onRedFlagToggle,
  className,
}: FilterPillBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {segments && segments.length > 0 && (
        <div className="flex rounded-full border border-brand-border overflow-hidden">
          {segments.map((segment) => {
            const isActive = segment === activeSegment;
            return (
              <button
                key={segment}
                type="button"
                onClick={() => onSegmentChange?.(segment)}
                className={cn(
                  "px-2.5 py-1 text-brand-caption font-medium transition-colors",
                  isActive ? "bg-brand text-white" : "bg-white text-brand-green hover:bg-brand-light"
                )}
              >
                {segment}
              </button>
            );
          })}
        </div>
      )}

      {onGoldenToggle && (
        <button
          type="button"
          onClick={onGoldenToggle}
          className={cn(
            "flex items-center gap-1 rounded-full border px-2.5 py-1 text-brand-caption font-medium transition-colors",
            goldenActive
              ? "bg-brand-warning border-brand-warning text-[#5C4A00]"
              : "bg-white border-brand-border text-brand-green"
          )}
        >
          <Trophy className="w-3 h-3" />
          Golden
        </button>
      )}

      {onRedFlagToggle && (
        <button
          type="button"
          onClick={onRedFlagToggle}
          className={cn(
            "flex items-center gap-1 rounded-full border px-2.5 py-1 text-brand-caption font-medium transition-colors",
            redFlagActive
              ? "bg-brand border-brand text-white"
              : "bg-white border-brand-border text-brand-green"
          )}
        >
          <Flag className="w-3 h-3" />
          Red Flag
        </button>
      )}
    </div>
  );
}
