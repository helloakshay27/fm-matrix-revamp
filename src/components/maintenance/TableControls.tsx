import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Columns3, ArrowUpDown, Download, Eye, EyeOff } from 'lucide-react';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface TableControlsProps {
  // Column visibility
  columns: ColumnConfig[];
  visibleColumns: string[];
  onColumnVisibilityChange: (columnKey: string, visible: boolean) => void;
  
  // Sorting
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSortChange: (column: string) => void;
  onClearSort: () => void;
  
  // Selection
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
  onClearSelection: () => void;
  
  // Search
  searchTerm: string;
  onSearchChange: (term: string) => void;
  
  // Export
  onExport: () => void;
  
  // Bulk actions
  onBulkAction?: (action: string) => void;
}

export const TableControls: React.FC<TableControlsProps> = ({
  columns,
  visibleColumns,
  onColumnVisibilityChange,
  sortColumn,
  sortDirection,
  onSortChange,
  onClearSort,
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  searchTerm,
  onSearchChange,
  onExport,
  onBulkAction
}) => {
  const hiddenColumnsCount = columns.filter(col => col.hideable && !visibleColumns.includes(col.key)).length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="space-y-4 mb-6">
      {/* Primary Controls Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Column Visibility Control */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns3 className="w-4 h-4" />
                Columns
                {hiddenColumnsCount > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {hiddenColumnsCount} hidden
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {columns.filter(col => col.hideable).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.includes(column.key)}
                  onCheckedChange={(checked) => onColumnVisibilityChange(column.key, checked)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Controls */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Sort
                {sortColumn && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {columns.find(col => col.key === sortColumn)?.label} {sortDirection}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Sort by column:</h4>
                <div className="space-y-2">
                  {columns.filter(col => col.sortable).map((column) => (
                    <Button
                      key={column.key}
                      variant={sortColumn === column.key ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onSortChange(column.key)}
                      className="w-full justify-start"
                    >
                      {column.label}
                      {sortColumn === column.key && (
                        <span className="ml-auto text-xs">
                          {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : ''}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
                {sortColumn && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearSort}
                    className="w-full"
                  >
                    Clear Sort
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Control */}
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Export Button */}
          <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Selection Controls Row */}
      {(selectedCount > 0 || totalCount > 0) && (
        <div className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            {/* Master Select All Checkbox */}
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
              {...(isIndeterminate && { 'data-state': 'indeterminate' })}
            />
            
            <span className="text-sm text-muted-foreground">
              {selectedCount > 0
                ? `${selectedCount} of ${totalCount} tasks selected`
                : `${totalCount} tasks total`
              }
            </span>

            {selectedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="text-xs"
              >
                Clear Selection
              </Button>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedCount > 0 && onBulkAction && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export')}
              >
                Export Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('assign')}
              >
                Bulk Assign
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('status')}
              >
                Change Status
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};