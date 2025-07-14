import React, { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronUp, ChevronDown, Settings2, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SurveyTableHeader } from './SurveyTableHeader';

export type SortDirection = 'asc' | 'desc' | null;

export interface SurveyColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  hideable?: boolean;
  width?: string;
  minWidth?: string;
}

export interface SurveyTableProps<T = any> {
  data: T[];
  columns: SurveyColumnConfig[];
  onRowSelect?: (selectedRows: string[]) => void;
  renderCell: (item: T, columnKey: string, index: number) => React.ReactNode;
  searchTerm?: string;
  className?: string;
}

interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function SurveyEnhancedTable<T extends { id: string }>({
  data,
  columns: initialColumns,
  onRowSelect,
  renderCell,
  searchTerm = '',
  className = ''
}: SurveyTableProps<T>) {
  const [columns, setColumns] = useState<SurveyColumnConfig[]>(initialColumns);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(initialColumns.map(col => col.key))
  );
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter if searchTerm is provided
    if (searchTerm) {
      filtered = data.filter(item => {
        return Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply sorting
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as any)[sortConfig.key];
        const bValue = (b as any)[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig]);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (!current || current.key !== columnKey) {
        return { key: columnKey, direction: 'asc' };
      }
      
      if (current.direction === 'asc') {
        return { key: columnKey, direction: 'desc' };
      }
      
      if (current.direction === 'desc') {
        return null; // Reset to default
      }
      
      return { key: columnKey, direction: 'asc' };
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setColumns(items => {
        const oldIndex = items.findIndex(item => item.key === active.id);
        const newIndex = items.findIndex(item => item.key === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  };

  const handleRowSelect = (rowId: string, checked: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(rowId);
      } else {
        newSet.delete(rowId);
      }
      
      if (onRowSelect) {
        onRowSelect(Array.from(newSet));
      }
      
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredAndSortedData.map(item => item.id));
      setSelectedRows(allIds);
      if (onRowSelect) {
        onRowSelect(Array.from(allIds));
      }
    } else {
      setSelectedRows(new Set());
      if (onRowSelect) {
        onRowSelect([]);
      }
    }
  };

  const visibleColumnsArray = columns.filter(col => visibleColumns.has(col.key));
  const isAllSelected = filteredAndSortedData.length > 0 && 
    filteredAndSortedData.every(item => selectedRows.has(item.id));

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-600" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className={`bg-white rounded-lg overflow-hidden ${className}`}>
      {/* Table Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {selectedRows.size > 0 ? `${selectedRows.size} selected` : `${filteredAndSortedData.length} items`}
          </span>
          {selectedRows.size > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedRows(new Set());
                if (onRowSelect) onRowSelect([]);
              }}
            >
              Clear Selection
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Column Visibility Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="w-4 h-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {columns.map(column => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.has(column.key)}
                  onCheckedChange={() => toggleColumnVisibility(column.key)}
                  disabled={!column.hideable}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={visibleColumnsArray.map(col => col.key)} strategy={horizontalListSortingStrategy}>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Checkbox Column */}
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  
                  {/* Draggable Column Headers */}
                  {visibleColumnsArray.map(column => (
                    <SurveyTableHeader
                      key={column.key}
                      column={column}
                      sortIcon={getSortIcon(column.key)}
                      onSort={() => handleSort(column.key)}
                    />
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((item, index) => (
                  <TableRow key={item.id}>
                    {/* Checkbox Cell */}
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(item.id)}
                        onCheckedChange={(checked) => handleRowSelect(item.id, checked as boolean)}
                      />
                    </TableCell>
                    
                    {/* Data Cells */}
                    {visibleColumnsArray.map(column => (
                      <TableCell 
                        key={column.key}
                        style={{ 
                          width: column.width,
                          minWidth: column.minWidth 
                        }}
                      >
                        {renderCell(item, column.key, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}