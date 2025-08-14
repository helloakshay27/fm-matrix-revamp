
import { useState, useMemo, useCallback, useEffect } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  hideable?: boolean;
  draggable?: boolean;
  defaultVisible?: boolean;
  width?: string;
}

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface UseEnhancedTableProps<T> {
  data: T[];
  columns: ColumnConfig[];
  defaultSort?: SortState;
  storageKey?: string;
  initialColumnVisibility?: Record<string, boolean>;
}

export function useEnhancedTable<T extends Record<string, any>>({
  data,
  columns,
  defaultSort = { column: null, direction: null },
  storageKey,
  initialColumnVisibility
}: UseEnhancedTableProps<T>) {
  // Initialize column visibility from localStorage or defaults
  const getInitialVisibility = useCallback(() => {
    if (storageKey) {
      const stored = localStorage.getItem(`${storageKey}-visibility`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn('Failed to parse stored column visibility');
        }
      }
    }
    
    const visibility: Record<string, boolean> = {};
    columns.forEach(col => {
      visibility[col.key] = col.defaultVisible !== false;
    });
    return visibility;
  }, [columns, storageKey]);

  // Initialize column order from localStorage or defaults
  const getInitialOrder = useCallback(() => {
    if (storageKey) {
      const stored = localStorage.getItem(`${storageKey}-order`);
      if (stored) {
        try {
          const order = JSON.parse(stored);
          // Validate that all columns are present
          if (order.length === columns.length && columns.every(col => order.includes(col.key))) {
            return order;
          }
        } catch (e) {
          console.warn('Failed to parse stored column order');
        }
      }
    }
    return columns.map(col => col.key);
  }, [columns, storageKey]);

  const [sortState, setSortState] = useState<SortState>(defaultSort);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(getInitialVisibility);
  const [columnOrder, setColumnOrder] = useState<string[]>(getInitialOrder);

  // Update column visibility when columns prop changes (for external control)
  useEffect(() => {
    const newVisibility: Record<string, boolean> = {};
    columns.forEach(col => {
      newVisibility[col.key] = col.defaultVisible !== false;
    });
    setColumnVisibility(newVisibility);
  }, [columns]);

  // Handle sorting
  const handleSort = useCallback((columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortState(prev => {
      if (prev.column !== columnKey) {
        return { column: columnKey, direction: 'asc' };
      }
      
      switch (prev.direction) {
        case 'asc':
          return { column: columnKey, direction: 'desc' };
        case 'desc':
          return { column: null, direction: null };
        default:
          return { column: columnKey, direction: 'asc' };
      }
    });
  }, [columns]);

  // Sort data based on current sort state
  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aVal = a[sortState.column!];
      const bVal = b[sortState.column!];
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortState.direction === 'asc' ? 1 : -1;
      if (bVal == null) return sortState.direction === 'asc' ? -1 : 1;
      
      // Type-aware comparison
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (aVal instanceof Date && bVal instanceof Date) {
        return sortState.direction === 'asc' 
          ? aVal.getTime() - bVal.getTime() 
          : bVal.getTime() - aVal.getTime();
      }
      
      // String comparison (case-insensitive)
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return sortState.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortState]);

  // Handle column visibility
  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setColumnVisibility(prev => {
      const newVisibility = { ...prev, [columnKey]: !prev[columnKey] };
      
      // Ensure at least one column remains visible
      const visibleCount = Object.values(newVisibility).filter(Boolean).length;
      if (visibleCount === 0) {
        return prev; // Don't allow hiding all columns
      }
      
      if (storageKey) {
        localStorage.setItem(`${storageKey}-visibility`, JSON.stringify(newVisibility));
      }
      
      return newVisibility;
    });
  }, [storageKey]);

  // Handle column reordering
  const reorderColumns = useCallback((activeId: string, overId: string) => {
    setColumnOrder(prev => {
      const oldIndex = prev.indexOf(activeId);
      const newIndex = prev.indexOf(overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;
      
      const newOrder = [...prev];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, activeId);
      
      if (storageKey) {
        localStorage.setItem(`${storageKey}-order`, JSON.stringify(newOrder));
      }
      
      return newOrder;
    });
  }, [storageKey]);

  // Get visible columns in correct order
  const visibleColumns = useMemo(() => {
    return columnOrder
      .map(key => columns.find(col => col.key === key))
      .filter((col): col is ColumnConfig => col !== undefined && columnVisibility[col.key]);
  }, [columns, columnOrder, columnVisibility]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const defaultVisibility: Record<string, boolean> = {};
    columns.forEach(col => {
      defaultVisibility[col.key] = col.defaultVisible !== false;
    });
    
    setColumnVisibility(defaultVisibility);
    setColumnOrder(columns.map(col => col.key));
    setSortState({ column: null, direction: null });
    
    if (storageKey) {
      localStorage.removeItem(`${storageKey}-visibility`);
      localStorage.removeItem(`${storageKey}-order`);
    }
  }, [columns, storageKey]);

  return {
    sortedData,
    sortState,
    columnVisibility,
    columnOrder,
    visibleColumns,
    handleSort,
    toggleColumnVisibility,
    reorderColumns,
    resetToDefaults
  };
}
