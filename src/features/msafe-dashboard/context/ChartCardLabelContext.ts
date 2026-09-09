import { createContext } from 'react';

/**
 * Title of the `ChartCard` a control is rendered inside.
 *
 * `ChartCard` receives its toolbar controls as the `chartSwitch`/`tag` props — elements
 * created in a section file but rendered inside the card's own tree — so a provider in
 * `ChartCard` reaches them. That lets `ChartSwitch` report which card the user switched
 * to donut/bar/table without every one of its ~14 call sites repeating the card title.
 *
 * Lives in its own module (not in ChartCard.tsx) so ChartSwitch doesn't have to import
 * from the component that renders it.
 */
export const ChartCardLabelContext = createContext<string>('');
