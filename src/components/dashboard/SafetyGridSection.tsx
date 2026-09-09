import { useEffect, useRef, useState, type ReactNode } from "react";
import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import { RotateCcw } from "lucide-react";
import { AddToDashboardButton } from "@/components/dashboard/AddToDashboardButton";
import { useMyDashboardStore } from "@/stores/myDashboardStore";
import { updateDashboardLayout } from "@/services/dashboardLayoutAPI";

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * WidthProvider only remeasures on the window's `resize` event. On the Safety tab the grid
 * sits next to the "Safety Intelligence" side panel and behind tab/sidebar transitions, so the
 * grid's *own* container width can change (panel mounts, sidebar collapses, fonts load) without
 * the window itself ever resizing — WidthProvider then keeps rendering at a stale, narrower
 * width forever, which is what makes the grid look "not responsive" even on a wide screen.
 * A ResizeObserver on the container catches those cases directly.
 */
function useContainerWidth() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === "number") setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

function loadStoredLayout(storageKey: string): GridLayout.Layout[] | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export interface SafetyGridItem {
  key: string;
  layout: Omit<GridLayout.Layout, "i">;
  content: ReactNode;
}

interface SafetyGridSectionProps {
  storageKey: string;
  items: SafetyGridItem[];
  /** Renders the coded default layout with drag/resize/reset disabled — for modules that shouldn't be user-repositionable. */
  static?: boolean;
  /** Stacks cards to full width, one per row, at the sm/xs/xxs breakpoints instead of letting react-grid-layout naively clamp x/w (which leaves items overlapping or clipped off-canvas on narrower laptop screens). Opt-in so existing CRM/Finance grids keep their current behavior. */
  responsive?: boolean;
  /** Module key passed to each card's AddToDashboardButton, e.g. "safety" | "finance" | "crm". */
  moduleKey: string;
  /** Sub-tab label passed to each card's AddToDashboardButton, e.g. "SOHI", "Overview". */
  subTab: string;
  /**
   * When set, only items whose `fm-${key}` is in this set render — shows a filtered "My
   * Dashboard" preview of just the cards the user has saved, always drag/resize-enabled
   * regardless of `static`, positioned from each card's saved height/width/position (falling
   * back to the item's coded default) and persisted per-card via PATCH /dashboard_layouts on
   * drag/resize stop — never through the source grid's own `storageKey`/localStorage, so a My
   * Dashboard preview can never overwrite the source grid's saved layout. Renders nothing if no
   * items match.
   */
  visibleKeys?: Set<string>;
}

// Mac browser windows are frequently opened un-maximized (unlike Windows, which
// tends to open full-screen), so a MacBook's actual browser content width often
// sits in the 900-1150px range even on a 13"/14" screen. Keep the full 12-col
// desktop layout all the way down to 900px so that range still renders as the
// coded multi-column layout instead of prematurely stacking to a single column.
const BREAKPOINTS = { lg: 1200, md: 900, sm: 640, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 12, sm: 4, xs: 4, xxs: 2 };

/**
 * Stacks every item to full width, one per row, in original top-to-bottom/left-to-right
 * order. Proportionally rescaling x/w to a low column count (2-6) produces fractional
 * positions that collide or leave dead gaps — full-width stacking is the only layout that
 * reads cleanly at narrow/laptop-split widths, matching the standard "multi-column desktop,
 * single column narrow" responsive pattern.
 */
function stackLayoutFullWidth(layout: GridLayout.Layout[], toCols: number): GridLayout.Layout[] {
  const ordered = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);
  let y = 0;
  return ordered.map((item) => {
    const placed = { ...item, x: 0, w: toCols, y };
    y += item.h;
    return placed;
  });
}

/**
 * Drag-and-drop / resizable card grid — same react-grid-layout setup used for
 * the Maintenance › Ticket view in RevampDashboardPage.tsx, reused here so
 * every Safety card (SOHI / Incidents / Permits / Emergency) is repositionable.
 * Always starts from the coded default layout (matching the reference
 * screenshots) on first load; a saved layout only applies after the user has
 * actually dragged/resized something in this section.
 */
export function SafetyGridSection({
  storageKey,
  items,
  static: isStatic,
  responsive,
  moduleKey,
  subTab,
  visibleKeys,
}: SafetyGridSectionProps) {
  const visibleItems = visibleKeys ? items.filter((item) => visibleKeys.has(`fm-${item.key}`)) : items;
  const myDashboardCards = useMyDashboardStore((s) => s.cards);
  const updateMyDashboardCardLayout = useMyDashboardStore((s) => s.updateCardLayout);
  // A "My Dashboard" preview is always drag/resize-enabled (it has its own persistence path,
  // below) regardless of the source panel's own `static` setting.
  const effectiveStatic = isStatic && !visibleKeys;
  const defaultLayout: GridLayout.Layout[] = visibleItems.map((item) => {
    if (visibleKeys) {
      const saved = myDashboardCards.find((c) => c.chartId === `fm-${item.key}`);
      const [x, y] = (saved?.position ?? "").split(",").map(Number);
      return {
        i: item.key,
        x: Number.isFinite(x) ? x : item.layout.x,
        y: Number.isFinite(y) ? y : item.layout.y,
        w: Number(saved?.width) || item.layout.w,
        h: Number(saved?.height) || item.layout.h,
        minW: item.layout.minW,
        minH: item.layout.minH,
      };
    }
    return { i: item.key, ...item.layout };
  });
  const [layout, setLayout] = useState<GridLayout.Layout[]>(defaultLayout);
  const { ref: measuredRef, width: measuredWidth } = useContainerWidth();

  useEffect(() => {
    if (effectiveStatic || visibleKeys) return;
    const stored = loadStoredLayout(storageKey);
    if (stored) setLayout(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, effectiveStatic]);

  const persistLayout = (nextLayout: GridLayout.Layout[]) => {
    setLayout(nextLayout);
    localStorage.setItem(storageKey, JSON.stringify(nextLayout));
  };

  // My Dashboard's own persistence path: each moved/resized card is saved individually against
  // /dashboard_layouts by its own serverId (via PATCH), completely separate from the source
  // grid's storageKey/localStorage — dragging a card here must never touch the source layout.
  const persistMyDashboardLayout = (nextLayout: GridLayout.Layout[]) => {
    setLayout(nextLayout);
    nextLayout.forEach((item) => {
      const chartId = `fm-${item.i}`;
      const card = myDashboardCards.find((c) => c.chartId === chartId);
      if (!card) return;
      const height = String(item.h);
      const width = String(item.w);
      const position = `${item.x},${item.y}`;
      if (height === card.height && width === card.width && position === card.position) return;
      updateMyDashboardCardLayout(chartId, { height, width, position });
      if (card.serverId) {
        updateDashboardLayout(card.serverId, { chart_code: chartId, height, width, position }).catch((error) => {
          console.error(`Failed to save layout for ${chartId}:`, error);
        });
      }
    });
  };

  const resetLayout = () => {
    localStorage.removeItem(storageKey);
    setLayout(defaultLayout);
  };

  if (visibleKeys && visibleItems.length === 0) return null;

  return (
    <div className="relative w-full">
      {!effectiveStatic && !visibleKeys && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={resetLayout}
            className="flex items-center gap-1.5 text-brand-body-5 text-brand-text-light hover:text-brand-green"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset layout
          </button>
        </div>
      )}

      {responsive ? (
        <div ref={measuredRef}>
          {measuredWidth > 0 && (
            <Responsive
              width={measuredWidth}
              className="layout"
              layouts={{
                lg: effectiveStatic ? defaultLayout : layout,
                md: effectiveStatic ? defaultLayout : layout,
                sm: stackLayoutFullWidth(effectiveStatic ? defaultLayout : layout, COLS.sm),
                xs: stackLayoutFullWidth(effectiveStatic ? defaultLayout : layout, COLS.xs),
                xxs: stackLayoutFullWidth(effectiveStatic ? defaultLayout : layout, COLS.xxs),
              }}
              onDragStop={effectiveStatic ? undefined : visibleKeys ? persistMyDashboardLayout : persistLayout}
              onResizeStop={effectiveStatic ? undefined : visibleKeys ? persistMyDashboardLayout : persistLayout}
              breakpoints={BREAKPOINTS}
              cols={COLS}
              rowHeight={48}
              margin={[16, 16]}
              resizeHandles={["se"]}
              isBounded
              containerPadding={[0, 0]}
              compactType="vertical"
              draggableCancel=".no-drag"
              isDraggable
              isResizable
            >
              {visibleItems.map((item) => (
                <div key={item.key} chart_code={`fm-${item.key}`} className="h-full overflow-auto relative">
                  <AddToDashboardButton
                  chartId={`fm-${item.key}`}
                  moduleKey={moduleKey}
                  subTab={subTab}
                  height={String(item.layout.h)}
                  width={String(item.layout.w)}
                  position={`${item.layout.x},${item.layout.y}`}
                />
                  {item.content}
                </div>
              ))}
            </Responsive>
          )}
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: effectiveStatic ? defaultLayout : layout }}
          onDragStop={effectiveStatic ? undefined : visibleKeys ? persistMyDashboardLayout : persistLayout}
          onResizeStop={effectiveStatic ? undefined : visibleKeys ? persistMyDashboardLayout : persistLayout}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={48}
          margin={[16, 16]}
          resizeHandles={["se"]}
          isBounded
          containerPadding={[0, 0]}
          compactType="vertical"
          draggableCancel=".no-drag"
          isDraggable
          isResizable
        >
          {visibleItems.map((item) => (
            <div key={item.key} chart_code={`fm-${item.key}`} className="h-full overflow-auto relative">
              <AddToDashboardButton
                  chartId={`fm-${item.key}`}
                  moduleKey={moduleKey}
                  subTab={subTab}
                  height={String(item.layout.h)}
                  width={String(item.layout.w)}
                  position={`${item.layout.x},${item.layout.y}`}
                />
              {item.content}
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
