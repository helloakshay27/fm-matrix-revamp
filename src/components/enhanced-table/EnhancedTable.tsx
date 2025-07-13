
import React from 'react';
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
import { SortableColumnHeader } from './SortableColumnHeader';
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu';
import { useEnhancedTable, ColumnConfig } from '@/hooks/useEnhancedTable';

interface EnhancedTableProps<T> {
  data: T[];
  columns: ColumnConfig[];
  renderCell: (item: T, columnKey: string) => React.ReactNode;
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
}

export function EnhancedTable<T extends Record<string, any>>({
  data,
  columns,
  renderCell,
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
  selectAllLabel = "Select all"
}: EnhancedTableProps<T>) {
  const {
    sortedData,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {sortedData.length} {sortedData.length === 1 ? 'item' : 'items'}
          {selectable && selectedItems.length > 0 && (
            <span className="ml-2 text-blue-600">
              ({selectedItems.length} selected)
            </span>
          )}
        </div>
        <ColumnVisibilityMenu
          columns={columns}
          columnVisibility={columnVisibility}
          onToggleVisibility={toggleColumnVisibility}
          onResetToDefaults={resetToDefaults}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table className={className}>
              <TableHeader>
                <TableRow>
                  <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                    {selectable && (
                      <TableHead className="bg-[#f6f4ee] w-12" data-checkbox>
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAllChange}
                          aria-label={selectAllLabel}
                          className="ml-2"
                          {...(isIndeterminate && { 'data-state': 'indeterminate' })}
                        />
                      </TableHead>
                    )}
                    {visibleColumns.map((column) => (
                      <SortableColumnHeader
                        key={column.key}
                        id={column.key}
                        sortable={column.sortable}
                        draggable={column.draggable}
                        sortDirection={sortState.column === column.key ? sortState.direction : null}
                        onSort={() => handleSort(column.key)}
                        className="bg-[#f6f4ee]"
                      >
                        {column.label}
                      </SortableColumnHeader>
                    ))}
                    {renderActions && (
                      <TableHead className="bg-[#f6f4ee]">Actions</TableHead>
                    )}
                  </SortableContext>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length === 0 ? (
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
                ) : (
                  sortedData.map((item, index) => {
                    const itemId = getItemId(item);
                    const isSelected = selectedItems.includes(itemId);
                    
                    return (
                      <TableRow 
                        key={index}
                        className={`
                          ${onRowClick ? "cursor-pointer" : ""} 
                          hover:bg-gray-50 
                          ${isSelected ? "bg-blue-50" : ""}
                        `}
                        onClick={(e) => handleRowClick(item, e)}
                      >
                        {selectable && (
                          <TableCell className="p-4 w-12" data-checkbox>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectItemChange(itemId, !!checked)}
                              aria-label={`Select row ${index + 1}`}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                        )}
                        {visibleColumns.map((column) => (
                          <TableCell key={column.key} className="p-4">
                            {renderCell(item, column.key)}
                          </TableCell>
                        ))}
                        {renderActions && (
                          <TableCell className="p-4" data-actions>
                            {renderActions(item)}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
