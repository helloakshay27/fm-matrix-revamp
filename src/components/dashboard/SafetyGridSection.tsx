import { useEffect, useRef, useState, type ReactNode } from "react";
import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import { RotateCcw } from "lucide-react";

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
export function SafetyGridSection({ storageKey, items, static: isStatic, responsive }: SafetyGridSectionProps) {
  const defaultLayout: GridLayout.Layout[] = items.map((item) => ({ i: item.key, ...item.layout }));
  const [layout, setLayout] = useState<GridLayout.Layout[]>(defaultLayout);
  const { ref: measuredRef, width: measuredWidth } = useContainerWidth();

  useEffect(() => {
    if (isStatic) return;
    const stored = loadStoredLayout(storageKey);
    if (stored) setLayout(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, isStatic]);

  const persistLayout = (nextLayout: GridLayout.Layout[]) => {
    setLayout(nextLayout);
    localStorage.setItem(storageKey, JSON.stringify(nextLayout));
  };

  const resetLayout = () => {
    localStorage.removeItem(storageKey);
    setLayout(defaultLayout);
  };

  return (
    <div className="relative w-full">
      {!isStatic && (
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
                lg: isStatic ? defaultLayout : layout,
                md: isStatic ? defaultLayout : layout,
                sm: stackLayoutFullWidth(isStatic ? defaultLayout : layout, COLS.sm),
                xs: stackLayoutFullWidth(isStatic ? defaultLayout : layout, COLS.xs),
                xxs: stackLayoutFullWidth(isStatic ? defaultLayout : layout, COLS.xxs),
              }}
              onDragStop={isStatic ? undefined : persistLayout}
              onResizeStop={isStatic ? undefined : persistLayout}
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
              {items.map((item) => (
                <div key={item.key} className="h-full overflow-auto">
                  {item.content}
                </div>
              ))}
            </Responsive>
          )}
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: isStatic ? defaultLayout : layout }}
          onDragStop={isStatic ? undefined : persistLayout}
          onResizeStop={isStatic ? undefined : persistLayout}
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
          {items.map((item) => (
            <div key={item.key} className="h-full overflow-auto">
              {item.content}
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
