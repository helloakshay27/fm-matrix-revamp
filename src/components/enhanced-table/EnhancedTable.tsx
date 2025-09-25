import React, { useMemo, useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { SortableColumnHeader } from './SortableColumnHeader';
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu';
import { useEnhancedTable, ColumnConfig } from '@/hooks/useEnhancedTable';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Download, Loader2, Grid3x3, Plus, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAuthHeader, API_CONFIG } from '@/config/apiConfig';

// Excel export utility function
const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  columns: ColumnConfig[],
  fileName: string = 'table-export'
) => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  // Create CSV content
  const headers = columns.map(col => col.label).join(',');
  const csvContent = [
    headers,
    ...data.map(row =>
      columns.map(col => {
        const value = row[col.key];
        // Handle values that might contain commas or quotes
        const stringValue = String(value || '').replace(/"/g, '""');
        return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
          ? `"${stringValue}"`
          : stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface BulkAction<T> {
  label: string;
  icon?: React.ComponentType<any>;
  onClick: (selectedItems: T[]) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface EnhancedTableProps<T> {
  data: T[];
  columns: ColumnConfig[];
  renderCell?: (item: T, columnKey: string) => React.ReactNode;
  renderRow?: (item: T) => Record<string, any>;
  renderActions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  storageKey?: string;
  className?: string;
  emptyMessage?: string;
  selectable?: boolean;
  selectedItems?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectItem?: (itemId: string, checked: boolean) => void;
  getItemId?: (item: T) => string;
  selectAllLabel?: string;
  searchTerm?: string;
  onSearchChange?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  enableExport?: boolean;
  exportFileName?: string;
  onExport?: () => void;
  bulkActions?: BulkAction<T>[];
  showBulkActions?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  enableSearch?: boolean;
  enableSelection?: boolean;
  hideTableExport?: boolean;
  hideTableSearch?: boolean;
  hideColumnsButton?: boolean;
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  onFilterClick?: () => void;
  handleExport?: (columnVisibility?: Record<string, boolean>) => void;
  enableGlobalSearch?: boolean; // Add this prop
  onGlobalSearch?: (searchTerm: string) => void; // Add this prop
}

export function EnhancedTable<T extends Record<string, any>>({
  handleExport,
  data,
  columns,
  renderCell,
  renderRow,
  renderActions,
  onRowClick,
  storageKey,
  className,
  emptyMessage = "No data available",
  selectable = false,
  selectedItems = [],
  onSelectAll,
  onSelectItem,
  getItemId = (item: T) => item.id,
  selectAllLabel = "Select all",
  searchTerm: externalSearchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  enableExport = false,
  exportFileName = 'table-export',
  onExport,
  bulkActions = [],
  showBulkActions = false,
  pagination = false,
  pageSize = 10,
  loading = false,
  enableSearch = false,
  enableSelection = false,
  hideTableExport = false,
  hideTableSearch = false,
  hideColumnsButton = false,
  leftActions,
  rightActions,
  onFilterClick,
  enableGlobalSearch = false, // Add this
  onGlobalSearch, // Add this
}: EnhancedTableProps<T>) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiSearchResults, setApiSearchResults] = useState<T[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAbortController, setSearchAbortController] = useState<AbortController | null>(null);
  const [lastProcessedSearch, setLastProcessedSearch] = useState(''); // Add this

  // Debounce the search input to avoid excessive API calls
  const debouncedSearchInput = useDebounce(searchInput, 800);

  // Update internal search term when debounced input changes
  useEffect(() => {
    if (externalSearchTerm === undefined) {
      if (enableGlobalSearch && onGlobalSearch) {
        // Prevent duplicate processing of the same search term
        if (debouncedSearchInput === lastProcessedSearch) {
          return;
        }

        // Cancel previous search if it exists
        if (searchAbortController) {
          searchAbortController.abort();
        }

        // For global search, call the API search function
        if (debouncedSearchInput.trim()) {
          setIsSearching(true);
          setLastProcessedSearch(debouncedSearchInput);
          const newAbortController = new AbortController();
          setSearchAbortController(newAbortController);
          onGlobalSearch(debouncedSearchInput.trim());
        } else {
          // Clear search results when search is empty
          setIsSearching(false);
          setLastProcessedSearch('');
          setSearchAbortController(null);
          onGlobalSearch('');
        }
      } else {
        // For local search, set internal search term
        setInternalSearchTerm(debouncedSearchInput);
      }
    }
  }, [debouncedSearchInput, externalSearchTerm, enableGlobalSearch, onGlobalSearch, lastProcessedSearch]);

  // Synchronize external search term with internal search input
  useEffect(() => {
    if (externalSearchTerm !== undefined && searchInput !== externalSearchTerm) {
      setSearchInput(externalSearchTerm);
    }
  }, [externalSearchTerm, searchInput]);

  // Add effect to reset loading state when search completes
  useEffect(() => {
    if (enableGlobalSearch && !loading) {
      setIsSearching(false);
      setSearchAbortController(null);
    }
  }, [loading, enableGlobalSearch]);

  // Reset search state when data changes (search completes)
  useEffect(() => {
    if (enableGlobalSearch && data.length > 0 && isSearching) {
      setIsSearching(false);
    }
  }, [data, enableGlobalSearch, isSearching]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (searchAbortController) {
        searchAbortController.abort();
      }
    };
  }, []);

  // Get initial column visibility state from localStorage
  const getSavedColumnVisibility = () => {
    if (storageKey) {
      const savedVisibility = localStorage.getItem(`${storageKey}-columns`);
      if (savedVisibility) {
        try {
          return JSON.parse(savedVisibility);
        } catch (e) {
          console.error('Error parsing saved column visibility:', e);
        }
      }
    }
    return null;
  };

  const {
    sortedData: baseSortedData,
    sortState,
    columnVisibility,
    visibleColumns,
    handleSort,
    toggleColumnVisibility,
    reorderColumns,
    resetToDefaults
  } = useEnhancedTable({
    data,
    columns,
    storageKey,
    initialColumnVisibility: getSavedColumnVisibility()
  });

  // Wrap resetToDefaults to handle localStorage
  const handleResetToDefaults = () => {
    resetToDefaults();
    if (storageKey) {
      // Remove all stored column state
      localStorage.removeItem(`${storageKey}-columns`);
      localStorage.removeItem(`${storageKey}-column-order`);

      // Set default column visibility state
      const defaultVisibility = columns.reduce((acc, column) => ({
        ...acc,
        [column.key]: column.defaultVisible !== false
      }), {});
      localStorage.setItem(`${storageKey}-columns`, JSON.stringify(defaultVisibility));

      // Set default column order
      const defaultOrder = columns.map(column => column.key);
      localStorage.setItem(`${storageKey}-column-order`, JSON.stringify(defaultOrder));
    }
  };

  // Wrap toggleColumnVisibility to handle localStorage
  const handleToggleColumnVisibility = (columnKey: string) => {
    toggleColumnVisibility(columnKey);
    if (storageKey) {
      const updatedVisibility = {
        ...columnVisibility,
        [columnKey]: !columnVisibility[columnKey]
      };
      localStorage.setItem(`${storageKey}-columns`, JSON.stringify(updatedVisibility));
    }
  };

  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;

  // Use API search results or filter data based on search term
  const filteredData = useMemo(() => {
    // If we have API search results, use them instead of filtering original data
    if (apiSearchResults) {
      return apiSearchResults;
    }

    if (!searchTerm) return baseSortedData;

    return baseSortedData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [baseSortedData, searchTerm, apiSearchResults]);

  // Paginate data if pagination is enabled
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  const sortedData = pagination ? paginatedData : filteredData;
  const totalPages = pagination ? Math.ceil(filteredData.length / pageSize) : 1;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderColumns(String(active.id), String(over.id));
      // Save the new column order to localStorage
      if (storageKey) {
        const newOrder = columnIds.filter(id => id !== active.id);
        const overIndex = newOrder.indexOf(String(over.id));
        newOrder.splice(overIndex, 0, String(active.id));
        localStorage.setItem(`${storageKey}-column-order`, JSON.stringify(newOrder));
      }
    }
  };

  // Create column IDs for drag and drop, excluding checkbox and actions columns
  const columnIds = visibleColumns.map(col => col.key).filter(key => key !== '__checkbox__');

  // Check if all visible items are selected
  const isAllSelected = selectable && sortedData.length > 0 &&
    sortedData.every(item => selectedItems.includes(getItemId(item)));

  // Check if some (but not all) items are selected
  const isIndeterminate = selectable && selectedItems.length > 0 && !isAllSelected;

  const handleSelectAllChange = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  const handleSelectItemChange = (itemId: string, checked: boolean) => {
    if (onSelectItem) {
      onSelectItem(itemId, checked);
    }
  };

  const handleRowClick = (item: T, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on checkbox or actions
    const target = event.target as HTMLElement;
    if (target.closest('[data-checkbox]') || target.closest('[data-actions]')) {
      return;
    }
    onRowClick?.(item);
  };

  // Handle search input changes
  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1); // Reset to first page when searching
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setInternalSearchTerm('');
    setApiSearchResults(null);
    setCurrentPage(1);
    setLastProcessedSearch(''); // Reset this too
    if (onSearchChange) {
      onSearchChange('');
    }
    if (enableGlobalSearch && onGlobalSearch) {
      onGlobalSearch('');
    }
  };

  const selectedItemObjects = useMemo(() => {
    return filteredData.filter(item => selectedItems.includes(getItemId(item)));
  }, [filteredData, selectedItems, getItemId]);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('ellipsis-start');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('ellipsis-end');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Remove the hardcoded exportTicketRecords function and replace with conditional logic
  const handleExportClick = () => {
    if (onExport) {
      // Use custom export function if provided
      onExport();
    } else if (handleExport) {
      // Use handleExport with column visibility if provided
      handleExport(columnVisibility);
    } else {
      // Fallback to CSV export
      exportToExcel(data, columns, exportFileName);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {leftActions}

          {showBulkActions && selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!hideTableSearch && (onSearchChange || !externalSearchTerm || enableGlobalSearch) && (
            <div className="relative max-w-sm">
              {isSearching && (
                <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
              )}
              {!isSearching && (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}
              <Input
                placeholder={enableGlobalSearch ? `${searchPlaceholder}` : searchPlaceholder}
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="pl-10 pr-10"
                disabled={isSearching}
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isSearching}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {onFilterClick && (
            <Button
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 flex items-center gap-2"
              onClick={onFilterClick}
              title='Filter'
            >
              <Filter className="w-4 h-4" />
            </Button>
          )}

          {!hideColumnsButton && (
            <ColumnVisibilityMenu
              columns={columns}
              columnVisibility={columnVisibility}
              onToggleVisibility={handleToggleColumnVisibility}
              onResetToDefaults={handleResetToDefaults}
            />
          )}

          {!hideTableExport && enableExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportClick}
              className="flex items-center gap-2"
              title='Export'
            >
              <Download className="w-4 h-4" />
            </Button>
          )}

          {rightActions}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
        <div className="table-container">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table className={cn(className, "w-full min-w-max")}>
              <TableHeader className="sticky-header">
                <TableRow>
                  <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                    {renderActions && (
                      <TableHead className="bg-[#f6f4ee] text-center w-16 min-w-16 sticky top-0" data-actions>Actions</TableHead>
                    )}
                    {selectable && (
                      <TableHead className="bg-[#f6f4ee] w-12 min-w-12 text-center sticky top-0" data-checkbox>
                        <div className="flex justify-center">
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={handleSelectAllChange}
                            aria-label={selectAllLabel}
                            {...(isIndeterminate && { 'data-state': 'indeterminate' })}
                          />
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.map((column) => (
                      <SortableColumnHeader
                        key={column.key}
                        id={column.key}
                        sortable={column.sortable !== false} // Default to true unless explicitly set to false
                        draggable={column.draggable}
                        sortDirection={sortState.column === column.key ? sortState.direction : null}
                        onSort={() => column.sortable !== false && handleSort(column.key)} // Only call handleSort if sortable
                        className="bg-[#f6f4ee] text-center text-black min-w-32 sticky top-0"
                      >
                        {column.label}
                      </SortableColumnHeader>
                    ))}
                  </SortableContext>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell
                      colSpan={
                        visibleColumns.length +
                        (renderActions ? 1 : 0) +
                        (selectable ? 1 : 0)
                      }
                      className="h-24 text-center"
                    >
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!loading && sortedData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={
                        visibleColumns.length +
                        (renderActions ? 1 : 0) +
                        (selectable ? 1 : 0)
                      }
                      className="text-center py-8 text-gray-500"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
                {!loading && sortedData.map((item, index) => {
                  const itemId = getItemId(item);
                  const isSelected = selectedItems.includes(itemId);

                  return (
                    <TableRow
                      key={index}
                      className={cn(
                        onRowClick && "cursor-pointer",
                        "hover:bg-gray-50",
                        isSelected && "bg-blue-50"
                      )}
                      onClick={(e) => handleRowClick(item, e)}
                    >
                      {renderActions && (
                        <TableCell className="p-4 text-center w-16 min-w-16" data-actions>
                          {renderActions(item)}
                        </TableCell>
                      )}
                      {selectable && (
                        <TableCell className="p-4 w-12 min-w-12 text-center" data-checkbox>
                          <div className="flex justify-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectItemChange(itemId, !!checked)}
                              aria-label={`Select row ${index + 1}`}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.map((column) => {
                        const renderedRow = renderRow ? renderRow(item) : item;
                        const cellContent = renderRow ? renderedRow[column.key] : renderCell?.(item, column.key);
                        return (
                          <TableCell key={column.key} className="p-4 text-center min-w-32">
                            {cellContent}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {generatePageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(page as number)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}