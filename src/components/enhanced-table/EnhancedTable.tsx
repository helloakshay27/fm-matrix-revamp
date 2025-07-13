
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
}

export function EnhancedTable<T extends Record<string, any>>({
  data,
  columns,
  renderCell,
  renderActions,
  onRowClick,
  storageKey,
  className,
  emptyMessage = "No data available"
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

  const columnIds = visibleColumns.map(col => col.key);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {sortedData.length} {sortedData.length === 1 ? 'item' : 'items'}
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
                      colSpan={visibleColumns.length + (renderActions ? 1 : 0)} 
                      className="text-center py-8 text-gray-500"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((item, index) => (
                    <TableRow 
                      key={index}
                      className={onRowClick ? "cursor-pointer hover:bg-gray-50" : "hover:bg-gray-50"}
                      onClick={() => onRowClick?.(item)}
                    >
                      {visibleColumns.map((column) => (
                        <TableCell key={column.key} className="p-4">
                          {renderCell(item, column.key)}
                        </TableCell>
                      ))}
                      {renderActions && (
                        <TableCell className="p-4">
                          {renderActions(item)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
