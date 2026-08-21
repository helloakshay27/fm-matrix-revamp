import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface MyDashboardCard {
  /** e.g. "fm-sla-breach" — matches the chart_code attribute on the source card's wrapper div, and the chart_code sent to /dashboard_layouts. */
  chartId: string;
  /** Human-readable fallback label derived from the chart id (see formatChartLabel). */
  label: string;
  /** Which top-level dashboard module the card came from: "maintenance" | "safety" | "finance" | "crm". */
  moduleKey: string;
  /** The module's sub-tab the card lives under, e.g. "Tickets", "SOHI", "Overview". */
  subTab: string;
  /** Grid row units from the source card's layout, e.g. "3". */
  height: string;
  /** Grid column units from the source card's layout, e.g. "6". */
  width: string;
  /** "x,y" grid coordinates from the source card's layout. */
  position: string;
  addedAt: string;
  /** id of the persisted row on the /dashboard_layouts backend, set once it's been created/matched server-side. */
  serverId?: number;
}

interface MyDashboardState {
  cards: MyDashboardCard[];
  /** Timestamp of the last explicit "Save Dashboard" click, null if never saved. */
  lastSavedAt: string | null;
  isSaved: (chartId: string) => boolean;
  getCard: (chartId: string) => MyDashboardCard | undefined;
  addCard: (card: Omit<MyDashboardCard, "addedAt" | "serverId">) => void;
  removeCard: (chartId: string) => void;
  markSaved: () => void;
  setServerId: (chartId: string, serverId: number) => void;
  /** Updates a card's saved position/size after the user drags or resizes it on My Dashboard. */
  updateCardLayout: (chartId: string, layout: { height: string; width: string; position: string }) => void;
}

export const useMyDashboardStore = create<MyDashboardState>()(
  persist(
    (set, get) => ({
      cards: [],
      lastSavedAt: null,
      isSaved: (chartId) => get().cards.some((c) => c.chartId === chartId),
      getCard: (chartId) => get().cards.find((c) => c.chartId === chartId),
      addCard: (card) =>
        set((state) =>
          state.cards.some((c) => c.chartId === card.chartId)
            ? state
            : { cards: [...state.cards, { ...card, addedAt: new Date().toISOString() }] }
        ),
      removeCard: (chartId) =>
        set((state) => ({ cards: state.cards.filter((c) => c.chartId !== chartId) })),
      markSaved: () => set({ lastSavedAt: new Date().toISOString() }),
      setServerId: (chartId, serverId) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.chartId === chartId ? { ...c, serverId } : c)),
        })),
      updateCardLayout: (chartId, layout) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.chartId === chartId ? { ...c, ...layout } : c)),
        })),
    }),
    {
      name: "revamp-my-dashboard-cards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
