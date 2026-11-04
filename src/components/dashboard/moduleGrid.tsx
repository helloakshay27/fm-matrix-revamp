import { useEffect, useRef, type ReactNode } from "react";
import { SafetyGridSection, type SafetyGridItem } from "@/components/dashboard/SafetyGridSection";

export function gridItem(
  key: string,
  x: number,
  y: number,
  w: number,
  h: number,
  content: ReactNode,
): SafetyGridItem {
  return {
    key,
    layout: { x, y, w, h, minW: Math.min(3, w), minH: Math.min(2, h) },
    content,
  };
}

export function useSectionScroll(activeSection: string) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!activeSection) return;
    sectionRefs.current[activeSection]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSection]);

  return (key: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  };
}

interface ModuleSectionProps {
  id: string;
  storageKey: string;
  moduleKey: string;
  subTab: string;
  items: SafetyGridItem[];
  visibleKeys?: Set<string>;
  registerRef: (key: string) => (el: HTMLDivElement | null) => void;
}

/** One sub-tab's drag / resize / "+" grid. Layout persists per storageKey. */
export function ModuleSection({
  id,
  storageKey,
  moduleKey,
  subTab,
  items,
  visibleKeys,
  registerRef,
}: ModuleSectionProps) {
  return (
    <div ref={registerRef(id)} className="scroll-mt-24">
      <SafetyGridSection
        storageKey={storageKey}
        items={items}
        responsive
        moduleKey={moduleKey}
        subTab={subTab}
        visibleKeys={visibleKeys}
      />
    </div>
  );
}
