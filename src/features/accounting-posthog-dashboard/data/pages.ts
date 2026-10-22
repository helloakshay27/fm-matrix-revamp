/**
 * The three layers this dashboard renders.
 *
 * Kept outside the context module on purpose: a file that exports both a component and
 * non-component values can't be state-preserved by React Fast Refresh, and re-executing it
 * mints a new context object that live consumers no longer match.
 */
export type PageKey = 'pgTraffic' | 'pgAdopt' | 'pgFlows';

export const PAGE_TITLES: Record<PageKey, string> = {
  pgTraffic: 'Traffic & Session',
  pgAdopt: 'Adoption & Engagement',
  pgFlows: 'Workflow Usage',
};
