import { useState, useMemo, useCallback, useEffect } from 'react';

export interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  draggable?: boolean;
  defaultVisible?: boolean;
  hideable?: boolean;
}

interface UseEnhancedTableProps<T> {
  data: T[];
  columns: ColumnConfig[];
  storageKey?: string;
  initialColumnVisibility?: Record<string, boolean>;
}

interface SortState {
  column: string | null;
  direction: 'asc' | 'desc' | null;
}

export function useEnhancedTable<T>({
  data,
  columns,
  storageKey,
  initialColumnVisibility
}: UseEnhancedTableProps<T>) {
  // Initialize column visibility state with saved state or defaults
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const defaultVisibility = columns.reduce((acc, column) => ({
      ...acc,
      [column.key]: column.defaultVisible !== false
    }), {} as Record<string, boolean>);

    if (initialColumnVisibility) {
      return {
        ...defaultVisibility,
        ...initialColumnVisibility
      };
    }

    return defaultVisibility;
  });

  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map(column => column.key)
  );

  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null
  });

  // Save column visibility state to localStorage whenever it changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`${storageKey}-columns`, JSON.stringify(columnVisibility));
    }
  }, [columnVisibility, storageKey]);

  // Reset columns to their default visibility state
  const resetToDefaults = useCallback(() => {
    const defaultVisibility = columns.reduce((acc, column) => ({
      ...acc,
      [column.key]: column.defaultVisible !== false
    }), {});
    setColumnVisibility(defaultVisibility);
    setColumnOrder(columns.map(column => column.key));
    setSortState({ column: null, direction: null });
  }, [columns]);

  // Toggle visibility of a column
  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  }, []);

  // Reorder columns (for drag and drop)
  const reorderColumns = useCallback((sourceId: string, destinationId: string) => {
    setColumnOrder(prevOrder => {
      const oldIndex = prevOrder.indexOf(sourceId);
      const newIndex = prevOrder.indexOf(destinationId);

      if (oldIndex === -1 || newIndex === -1) return prevOrder;

      const newOrder = [...prevOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, sourceId);
      return newOrder;
    });
  }, []);

  // Handle sorting
  const handleSort = useCallback((columnKey: string) => {
    setSortState(prevState => ({
      column: columnKey,
      direction:
        prevState.column === columnKey
          ? prevState.direction === 'asc'
            ? 'desc'
            : prevState.direction === 'desc'
              ? null
              : 'asc'
          : 'asc'
    }));
  }, []);

  // Get visible columns in their current order
  const visibleColumns = useMemo(() => {
    return columnOrder
      .map(key => columns.find(col => col.key === key))
      .filter((column): column is ColumnConfig =>
        !!column && columnVisibility[column.key]
      );
  }, [columns, columnOrder, columnVisibility]);

  // Sort the data based on current sort state
  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortState.column as keyof T];
      const bValue = b[sortState.column as keyof T];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState]);

  return {
    sortedData,
    sortState,
    columnVisibility,
    visibleColumns,
    handleSort,
    toggleColumnVisibility,
    reorderColumns,
    resetToDefaults
  };
}