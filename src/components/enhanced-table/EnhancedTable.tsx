
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
  // Enhanced features
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
}

export function EnhancedTable<T extends Record<string, any>>({
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
  // Enhanced features
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
}: EnhancedTableProps<T>) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiSearchResults, setApiSearchResults] = useState<T[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce the search input to avoid excessive API calls
  const debouncedSearchInput = useDebounce(searchInput, 100);
  
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;

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
    storageKey
  });

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
    }
  };

  // Create column IDs for drag and drop, excluding checkbox column
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

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setApiSearchResults(null);
      setInternalSearchTerm('');
      if (onSearchChange) {
        onSearchChange('');
      }
      return;
    }

    try {
      setIsSearching(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      if (!token) {
        alert('Authentication token not found. Please login first.');
        return;
      }

      const response = await fetch(`https://fm-uat-api.lockated.com/pms/admin/complaints.json?per_page=20&page=1&q[search_all_fields_cont]=${searchTerm}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiSearchResults(data.complaints || []);
        setCurrentPage(1);
        setInternalSearchTerm(searchTerm);
        if (onSearchChange) {
          onSearchChange(searchTerm);
        }
      } else if (response.status === 401) {
        alert('Unauthorized: Please check your authentication token or login again.');
      } else {
        alert(`Failed to search: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Trigger search when debounced input changes
  useEffect(() => {
    performSearch(debouncedSearchInput);
  }, [debouncedSearchInput]);

  const handleClearSearch = () => {
    setSearchInput('');
    setInternalSearchTerm('');
    setApiSearchResults(null);
    setCurrentPage(1);
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const handleExport = () => {
    const csvContent = [
      visibleColumns.map(col => col.label).join(','),
      ...filteredData.map(item => 
        visibleColumns.map(col => {
          const renderedRow = renderRow ? renderRow(item) : item;
          const value = renderRow ? renderedRow[col.key] : renderCell?.(item, col.key);
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : `"${value}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportFileName}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
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
           {!hideTableSearch && (onSearchChange || !externalSearchTerm) && (
             <div className="relative max-w-sm">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
              className="h-8 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              onClick={onFilterClick}
            >
              <Filter className="w-4 h-4" />
            </Button>
          )}
          
          {!hideColumnsButton && (
            <ColumnVisibilityMenu
              columns={columns}
              columnVisibility={columnVisibility}
              onToggleVisibility={toggleColumnVisibility}
              onResetToDefaults={resetToDefaults}
            />
          )}
          
          {!hideTableExport && enableExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
                  
                  if (!token) {
                    alert('Authentication token not found. Please login first.');
                    return;
                  }

                  const response = await fetch('https://fm-uat-api.lockated.com/pms/admin/complaints.xlsx', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'complaints.xlsx';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } else if (response.status === 401) {
                    alert('Unauthorized: Please check your authentication token or login again.');
                  } else {
                    alert(`Failed to download file: ${response.status} ${response.statusText}`);
                  }
                } catch (error) {
                  console.error('Error downloading file:', error);
                  alert('An error occurred while downloading the file. Please try again.');
                }
              }}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          
          {rightActions}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden font-['Work_Sans']">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table className={className}>
              <TableHeader>
                 <TableRow className="h-[32px]">
                   {selectable && (
                   <TableHead className="bg-[#F9F8F5] py-0 font-medium text-[14px] text-[#1A1A1A] h-[32px] border-r border-white w-[50px]" data-checkbox>
                         <div className="flex items-center justify-center w-full h-[32px]">
                           <Checkbox
                             checked={isAllSelected}
                             onCheckedChange={handleSelectAllChange}
                             aria-label={selectAllLabel}
                             {...(isIndeterminate && { 'data-state': 'indeterminate' })}
                             className="w-[12px] h-[12px] border border-[#C72030]"
                           />
                         </div>
                      </TableHead>
                   )}
                   <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                    {visibleColumns.map((column) => (
                      <SortableColumnHeader
                        key={column.key}
                        id={column.key}
                        sortable={column.sortable}
                        draggable={column.draggable}
                        sortDirection={sortState.column === column.key ? sortState.direction : null}
                        onSort={() => handleSort(column.key)}
                        className="bg-[#F9F8F5] text-left px-[16px] py-[8px] font-medium text-[14px] text-[#1A1A1A] h-[32px] border-r border-white"
                      >
                        {column.label}
                      </SortableColumnHeader>
                    ))}
                    {renderActions && (
                      <TableHead className="bg-[#F9F8F5] text-left px-[16px] py-[8px] font-medium text-[14px] text-[#1A1A1A] h-[32px]">Actions</TableHead>
                    )}
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
                        "hover:bg-gray-50 h-[40px] border-b border-gray-100",
                        isSelected && "bg-blue-50"
                      )}
                      onClick={(e) => handleRowClick(item, e)}
                    >
                      {selectable && (
                        <TableCell className="w-[50px] py-0 align-middle font-normal text-[13px] text-[#1A1A1A] h-[40px]" data-checkbox>
                           <div className="flex items-center justify-center w-full h-[40px]">
                             <Checkbox
                               checked={isSelected}
                               onCheckedChange={(checked) => handleSelectItemChange(itemId, !!checked)}
                               aria-label={`Select row ${index + 1}`}
                               onClick={(e) => e.stopPropagation()}
                               className="w-[12px] h-[12px] border border-[#C72030]"
                             />
                           </div>
                         </TableCell>
                       )}
                      {visibleColumns.map((column) => {
                        const renderedRow = renderRow ? renderRow(item) : item;
                        const cellContent = renderRow ? renderedRow[column.key] : renderCell?.(item, column.key);
                        return (
                          <TableCell key={column.key} className="px-[16px] py-[8px] text-center align-middle whitespace-nowrap font-normal text-[13px] text-[#1A1A1A] h-[40px]">
                            {cellContent}
                          </TableCell>
                        );
                      })}
                      {renderActions && (
                        <TableCell className="px-[16px] py-[8px] text-center align-middle font-normal text-[13px] text-[#1A1A1A] h-[40px]" data-actions>
                          {renderActions(item)}
                        </TableCell>
                      )}
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
