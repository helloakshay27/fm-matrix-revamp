import { useEffect, useRef } from 'react';

// Ports the wireframe's `stickHeaders()`: `.topnav` and `.section-guide` (and, on the
// Super Admin view, `.alertbar`) are each `position: sticky; top: 0` in CSS, which only
// stacks correctly for the first one - the rest need their `top` offset pushed down by
// the height of whatever sticks above them, and every `.section-head` needs a matching
// `scroll-margin-top` so `SectionGuide`'s jump-to-section links land below the sticky stack.
export function useStickyHeaderStack<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const apply = () => {
      const topnav = container.querySelector<HTMLElement>('.topnav');
      const guide = container.querySelector<HTMLElement>('.section-guide');
      const alertbar = container.querySelector<HTMLElement>('.alertbar');
      const navH = topnav?.offsetHeight ?? 0;
      if (guide) guide.style.top = navH + 'px';
      if (alertbar) alertbar.style.top = navH + (guide?.offsetHeight ?? 0) + 'px';
      const stack = navH + (guide?.offsetHeight ?? 0) + (alertbar?.offsetHeight ?? 0) + 16;
      container.querySelectorAll<HTMLElement>('.section-head').forEach((sh) => {
        sh.style.scrollMarginTop = stack + 'px';
      });
    };

    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  return containerRef;
}
