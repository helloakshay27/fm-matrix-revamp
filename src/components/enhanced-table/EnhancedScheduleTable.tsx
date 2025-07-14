import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronUp, ChevronDown, Settings2, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ScheduleItem {
  id: string;
  activityName: string;
  noOfAssociation: number;
  task: string;
  taskAssignedTo: string;
  createdOn: string;
}

interface Column {
  key: keyof ScheduleItem;
  label: string;
  sortable: boolean;
}

interface EnhancedScheduleTableProps {
  data: ScheduleItem[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

type SortDirection = 'asc' | 'desc' | null;

const SortableTableHead: React.FC<{
  column: Column;
  sortColumn: string | null;
  sortDirection: SortDirection;
  onSort: (column: string) => void;
  isVisible: boolean;
}> = ({ column, sortColumn, sortDirection, onSort, isVisible }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!isVisible) return null;

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className="font-semibold text-gray-700 relative group"
      {...attributes}
    >
      <div className="flex items-center gap-2">
        <GripVertical 
          className="w-4 h-4 opacity-0 group-hover:opacity-50 cursor-grab"
          {...listeners}
        />
        <div 
          className={`flex items-center gap-1 ${column.sortable ? 'cursor-pointer select-none' : ''}`}
          onClick={() => column.sortable && onSort(column.key)}
        >
          <span>{column.label}</span>
          {column.sortable && (
            <div className="flex flex-col">
              <ChevronUp 
                className={`w-3 h-3 ${sortColumn === column.key && sortDirection === 'asc' ? 'text-primary' : 'text-gray-400'}`} 
              />
              <ChevronDown 
                className={`w-3 h-3 -mt-1 ${sortColumn === column.key && sortDirection === 'desc' ? 'text-primary' : 'text-gray-400'}`} 
              />
            </div>
          )}
        </div>
      </div>
    </TableHead>
  );
};

export const EnhancedScheduleTable: React.FC<EnhancedScheduleTableProps> = ({ 
  data, 
  onSelectionChange 
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const initialColumns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'activityName', label: 'Activity Name', sortable: true },
    { key: 'noOfAssociation', label: 'No. Of Association', sortable: true },
    { key: 'task', label: 'Task', sortable: true },
    { key: 'taskAssignedTo', label: 'Task Assigned To', sortable: true },
    { key: 'createdOn', label: 'Created on', sortable: true },
  ];

  const [columns, setColumns] = useState(initialColumns);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    initialColumns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof ScheduleItem];
      const bValue = b[sortColumn as keyof ScheduleItem];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map(item => item.id));
      setSelectedRows(allIds);
      onSelectionChange?.(Array.from(allIds));
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex(item => item.key === active.id);
        const newIndex = items.findIndex(item => item.key === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleColumnVisibilityChange = (columnKey: string, visible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  const visibleColumns = columns.filter(col => columnVisibility[col.key]);

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
      <div className="p-4 border-b flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="w-4 h-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {initialColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={columnVisibility[column.key]}
                onCheckedChange={(checked) => 
                  handleColumnVisibilityChange(column.key, checked)
                }
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>
              <SortableContext items={visibleColumns.map(col => col.key)} strategy={horizontalListSortingStrategy}>
                {visibleColumns.map((column) => (
                  <SortableTableHead
                    key={column.key}
                    column={column}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    isVisible={columnVisibility[column.key]}
                  />
                ))}
              </SortableContext>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(item.id)}
                    onCheckedChange={(checked) => 
                      handleSelectRow(item.id, checked as boolean)
                    }
                    aria-label={`Select row ${item.id}`}
                  />
                </TableCell>
                {visibleColumns.map((column) => (
                  <TableCell 
                    key={column.key} 
                    className={column.key === 'id' ? 'text-blue-600 font-medium' : ''}
                  >
                    {item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
};