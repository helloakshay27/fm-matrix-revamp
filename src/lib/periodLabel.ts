export type PeriodLabels = {
  periodLabel: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  periodUnit: 'Week' | 'Month' | 'Quarter' | 'Year';
  lastLabel: string; // e.g., "Last Week"
  currentLabel: string; // e.g., "Current Week"
};

const clampDays = (ms: number) => Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));

export function getPeriodLabels(start: Date | string, end: Date | string): PeriodLabels {
  const s = new Date(start);
  const e = new Date(end);
  const days = clampDays(e.getTime() - s.getTime());

  let periodLabel: PeriodLabels['periodLabel'] = 'Quarterly';
  if (days <= 7) {
    periodLabel = 'Weekly';
  } else if (days <= 31) {
    periodLabel = 'Monthly';
  } else if (days <= 92) {
    periodLabel = 'Quarterly';
  } else {
    periodLabel = 'Yearly';
  }

  const unitMap: Record<PeriodLabels['periodLabel'], PeriodLabels['periodUnit']> = {
    Weekly: 'Week',
    Monthly: 'Month',
    Quarterly: 'Quarter',
    Yearly: 'Year',
  };

  const periodUnit = unitMap[periodLabel];
  return {
    periodLabel,
    periodUnit,
    lastLabel: `Last ${periodUnit}`,
    currentLabel: `Current ${periodUnit}`,
  };
}
