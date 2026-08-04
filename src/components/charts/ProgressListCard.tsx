import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ProgressRow {
  label: string;
  value: string;
  percent: number;
  color: string;
  onClick?: () => void;
}

export interface ProgressSection {
  heading?: string;
  rows: ProgressRow[];
  /** Plain label→value line rendered after this section's rows (e.g. a subtotal). */
  note?: { label: string; value: string };
}

export interface ProgressListCardProps {
  title: string;
  subtitle?: string;
  sections: ProgressSection[];
  footnote?: string;
  borderTone?: "error" | "warning";
  className?: string;
}

const BORDER_TONE_CLASSES: Record<NonNullable<ProgressListCardProps["borderTone"]>, string> = {
  error: "border-l-4 border-l-brand-error",
  warning: "border-l-4 border-l-brand-warning",
};

/**
 * Label + horizontal progress track + value rows, optionally grouped under
 * section headings — mirrors the repeated ".pb-row" pattern in
 * fm_matrix_phase10 (29).html (Waste Breakdown, Vendor Response Time, Survey
 * Response by Category). No existing card combines a label with an inline
 * progress track.
 */
export function ProgressListCard({ title, subtitle, sections, footnote, borderTone, className }: ProgressListCardProps) {
  return (
    <Card className={cn("border-brand-border h-full", borderTone && BORDER_TONE_CLASSES[borderTone], className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => (
            <div key={section.heading ?? sectionIndex}>
              {section.heading && (
                <div className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide mb-2">
                  {section.heading}
                </div>
              )}
              <div className="space-y-2">
                {section.rows.map((row) => (
                  <div
                    key={row.label}
                    onClick={row.onClick}
                    className={cn("flex items-center gap-3", row.onClick && "cursor-pointer")}
                  >
                    <span className="w-28 flex-shrink-0 truncate text-brand-body-5 text-brand-text">{row.label}</span>
                    <div className="flex-1 h-2 bg-brand-bg rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, row.percent))}%`, backgroundColor: row.color }}
                      />
                    </div>
                    <span className="flex-shrink-0 text-brand-body-5 font-semibold" style={{ color: row.color }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              {section.note && (
                <div className="flex items-center justify-between text-brand-body-5 mt-2">
                  <span className="text-brand-text-light">{section.note.label}</span>
                  <span className="font-semibold text-brand-text">{section.note.value}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {footnote && (
          <p className="text-brand-body-5 text-brand-text-light leading-relaxed mt-3 pt-2 border-t border-brand-border">
            {footnote}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
