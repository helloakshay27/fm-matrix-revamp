import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../context/CanvasContext';

interface CanvasGridProps {
  id: string;
  children: React.ReactNode;
}

export function CanvasGrid({ id, children }: CanvasGridProps) {
  const { orders, saveOrders } = useCanvas();
  const gridRef = useRef<HTMLDivElement>(null);
  
  const savedOrder = orders[id] || [];

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleOrderChange = () => {
      const childrenArr = Array.from(grid.querySelectorAll(':scope > .ctile'));
      const newOrder = childrenArr.map(child => child.getAttribute('data-card')).filter(Boolean) as string[];
      saveOrders(id, newOrder);
    };

    grid.addEventListener('canvas-order-changed', handleOrderChange as EventListener);
    return () => grid.removeEventListener('canvas-order-changed', handleOrderChange as EventListener);
  }, [id, saveOrders]);

  const childArray = React.Children.toArray(children).filter(React.isValidElement);
  
  const childMap = new Map();
  childArray.forEach(child => {
    const childId = child.props.id;
    if (childId) {
      childMap.set(childId, child);
    }
  });

  const sortedChildren: React.ReactNode[] = [];
  const placed = new Set<string>();

  savedOrder.forEach(childId => {
    if (childMap.has(childId) && !placed.has(childId)) {
      sortedChildren.push(childMap.get(childId));
      placed.add(childId);
    }
  });

  childArray.forEach(child => {
    const childId = child.props.id;
    if (childId && !placed.has(childId)) {
      sortedChildren.push(child);
      placed.add(childId);
    }
  });

  return (
    <div className="zone-grid" ref={gridRef}>
      {sortedChildren}
    </div>
  );
}
