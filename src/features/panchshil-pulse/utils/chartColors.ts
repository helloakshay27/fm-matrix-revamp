export interface ChartColors {
  ink: string;
  faint: string;
  grid: string;
  line: string;
  blue: string;
  fill: string;
  mint: string;
  amber: string;
  red: string;
  violet: string;
  violetTint: string;
  green: string;
  heat: string;
  onHeat: string;
  heatA0: number;
  heatA1: number;
}

export function getChartColors(): ChartColors {
  const cs = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const g = (name: string, fallback: string) => {
    if (!cs) return fallback;
    const val = cs.getPropertyValue(name).trim();
    return val || fallback;
  };
  
  return {
    ink: g('--ink', '#141413'),
    faint: g('--faint', '#9b9990'),
    grid: g('--chart-grid', '#e6e4de'),
    line: g('--chart-line', '#d9d6ce'),
    blue: g('--chart-blue', '#2c7be5'),
    fill: g('--chart-fill', '#d3e3f9'),
    mint: g('--chart-mint', '#3daf7d'),
    amber: g('--chart-amber', '#c98a12'),
    red: g('--chart-red', '#b3402c'),
    violet: g('--chart-violet', '#7c6fd6'),
    violetTint: g('--chart-violet-tint', '#e7e4f8'),
    green: g('--green', '#0f8a3d'),
    heat: g('--heat-rgb', '44,123,229'),
    onHeat: g('--on-heat', '#ffffff'),
    heatA0: parseFloat(g('--heat-a0', '0.09')),
    heatA1: parseFloat(g('--heat-a1', '0.78'))
  };
}
