/**
 * The three layers this dashboard renders.
 *
 * These live outside the context module on purpose: a file that exports both a component
 * and non-component values can't be state-preserved by React Fast Refresh, and re-executing
 * it recreates the context object — which is how a live consumer ends up reading `undefined`
 * from a provider that is right there in the tree.
 */
export type PageKey = 'pgTraffic' | 'pgAdopt' | 'pgFlows';

export const PAGE_TITLES: Record<PageKey, string> = {
  pgTraffic: 'Traffic & Session',
  pgAdopt: 'Adoption & Engagement',
  pgFlows: 'Workflow Usage',
};
