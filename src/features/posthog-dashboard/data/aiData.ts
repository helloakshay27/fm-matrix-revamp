import type { ViewModel } from '../context/DashboardContext';
import type { AIDataMap, ChartKey } from './aiInsights';

/** Extracts the same on-screen numbers each chart already rendered, so the AI insight is grounded in what the user sees. */
export function getAIData<K extends ChartKey>(chartKey: K, vm: ViewModel): AIDataMap[K] | null {
  switch (chartKey) {
    case 'chart.usage':
      return vm.traffic.chart as AIDataMap[K];
    case 'chart.device':
      return { rows: vm.traffic.deviceRows.map(([name, share]) => [name, share]) } as AIDataMap[K];
    case 'chart.adoptTrend':
      return { cur: vm.adopt.trendChart.cur, prev: vm.adopt.trendChart.prev } as AIDataMap[K];
    case 'chart.growth':
      return { weeks: vm.adopt.growthWeeks } as AIDataMap[K];
    case 'chart.retention':
      return { cohorts: vm.adopt.retentionCohorts } as AIDataMap[K];
    case 'chart.role':
      return { roles: vm.adopt.roleShares } as AIDataMap[K];
    case 'chart.siteHealth':
      return (vm.siteHealth ? { rows: vm.siteHealth.rows } : null) as AIDataMap[K];
    case 'chart.funnel':
      return vm.flows.funnel as AIDataMap[K];
    case 'chart.flowList':
      return { rows: vm.flows.flowRows } as AIDataMap[K];
    case 'chart.path':
      return { rows: vm.flows.pathRows } as AIDataMap[K];
    default:
      return null;
  }
}
