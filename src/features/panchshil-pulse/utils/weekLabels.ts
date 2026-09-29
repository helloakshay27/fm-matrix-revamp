const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** '8/4' -> '4 Aug'. Returns null for anything not in the shared M/D shape. */
function spellMd(label: string): string | null {
  const [m, d] = label.split("/").map(Number);
  if (!Number.isFinite(m) || !Number.isFinite(d) || !MONTHS[m - 1]) return null;
  return `${d} ${MONTHS[m - 1]}`;
}

/**
 * Weekly-chart axis: "W1 ... W8" instead of raw week-start dates like "8/4".
 *
 * Each chart's own title already says which weeks these are ("last 8 weeks"), so the axis
 * only has to number them - and eight short labels all fit, where eight dates do not. The
 * dates are not thrown away: they come back spelled out in `tips`, which the hover card shows.
 */
export function toWeekLabels(labels: string[]): { axis: string[]; tips: string[] } {
  return {
    axis: labels.map((_, i) => `W${i + 1}`),
    tips: labels.map((l, i) => {
      const spelled = spellMd(l);
      return spelled ? `W${i + 1} · week of ${spelled}` : `W${i + 1}`;
    }),
  };
}
