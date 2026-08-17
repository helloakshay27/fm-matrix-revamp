import React, { createContext, useContext, useState } from 'react';

type LayoutSizes = Record<string, { cs: number; h: number }>;
type ZoneOrders = Record<string, string[]>;

interface CanvasContextType {
  orders: ZoneOrders;
  saveOrders: (zoneId: string, order: string[]) => void;
  sizes: LayoutSizes;
  updateSize: (id: string, cs: number, h: number) => void;
}

export const CanvasContext = createContext<CanvasContextType | null>(null);

export function useCanvas() {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error('useCanvas must be used within CanvasProvider');
  return ctx;
}

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<ZoneOrders>(() => {
    try { return JSON.parse(localStorage.getItem('fm-canvas-orders') || '{}'); } catch { return {}; }
  });
  
  const [sizes, setSizes] = useState<LayoutSizes>(() => {
    try { return JSON.parse(localStorage.getItem('fm-canvas-sizes') || '{}'); } catch { return {}; }
  });

  const saveOrders = (zoneId: string, order: string[]) => {
    setOrders(prev => {
      const next = { ...prev, [zoneId]: order };
      localStorage.setItem('fm-canvas-orders', JSON.stringify(next));
      return next;
    });
  };

  const updateSize = (id: string, cs: number, h: number) => {
    setSizes(prev => {
      const next = { ...prev, [id]: { cs, h } };
      localStorage.setItem('fm-canvas-sizes', JSON.stringify(next));
      return next;
    });
  };

  return (
    <CanvasContext.Provider value={{ orders, saveOrders, sizes, updateSize }}>
      {children}
    </CanvasContext.Provider>
  );
}
