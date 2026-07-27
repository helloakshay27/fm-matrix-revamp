import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Fades + rises content into place the first time it scrolls into view (mirrors the wireframe's scroll-reveal). */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((en) => { if (en.isIntersecting) { setVisible(true); io.unobserve(en.target); } }); },
      { threshold: 0.06, rootMargin: '0px 0px -4% 0px' },
    );
    io.observe(el);
    const safety = setTimeout(() => setVisible(true), 3000);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, []);

  return <div ref={ref} className={`phg-reveal${visible ? ' in' : ''}`}>{children}</div>;
}
