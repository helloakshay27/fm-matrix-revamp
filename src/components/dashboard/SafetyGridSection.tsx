import { useEffect, useState, type ReactNode } from "react";
import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import { RotateCcw } from "lucide-react";

const ResponsiveGridLayout = WidthProvider(Responsive);

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
}

/**
 * Drag-and-drop / resizable card grid — same react-grid-layout setup used for
 * the Maintenance › Ticket view in RevampDashboardPage.tsx, reused here so
 * every Safety card (SOHI / Incidents / Permits / Emergency) is repositionable.
 * Always starts from the coded default layout (matching the reference
 * screenshots) on first load; a saved layout only applies after the user has
 * actually dragged/resized something in this section.
 */
export function SafetyGridSection({ storageKey, items }: SafetyGridSectionProps) {
  const defaultLayout: GridLayout.Layout[] = items.map((item) => ({ i: item.key, ...item.layout }));
  const [layout, setLayout] = useState<GridLayout.Layout[]>(defaultLayout);

  useEffect(() => {
    const stored = loadStoredLayout(storageKey);
    if (stored) setLayout(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

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

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        onDragStop={persistLayout}
        onResizeStop={persistLayout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={48}
        margin={[16, 16]}
        resizeHandles={["se"]}
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
    </div>
  );
}
