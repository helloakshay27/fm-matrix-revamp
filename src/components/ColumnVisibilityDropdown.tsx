
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Grid3x3, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface ColumnVisibilityMenuProps {
  columns: ColumnConfig[];
  columnVisibility: Record<string, boolean>;
  onToggleVisibility: (columnKey: string) => void;
  onResetToDefaults: () => void;
}

export const ColumnVisibilityMenu: React.FC<ColumnVisibilityMenuProps> = ({
  columns,
  columnVisibility,
  onToggleVisibility,
  onResetToDefaults
}) => {
  const visibleCount = Object.values(columnVisibility).filter(Boolean).length;
  const hideableColumns = columns.filter(col => col.hideable !== false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 flex items-center gap-2"
        >
          <Grid3x3 className="w-4 h-4" />
          
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Show Columns</span>
          <span className="text-xs text-gray-500">
            {visibleCount} of {columns.length}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {hideableColumns.map((column) => {
          const isVisible = columnVisibility[column.key];
          const isLastVisible = visibleCount === 1 && isVisible;
          
          return (
            <DropdownMenuItem
              key={column.key}
              className="flex items-center gap-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                if (!isLastVisible) {
                  onToggleVisibility(column.key);
                }
              }}
            >
              <Checkbox
                checked={isVisible}
                disabled={isLastVisible}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="flex items-center gap-2 flex-1">
                {/* {isVisible ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )} */}
                <span className={isLastVisible ? "text-gray-400" : ""}>
                  {column.label}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onResetToDefaults}
          className="flex items-center gap-2 cursor-pointer text-gray-600"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Legacy interface for backward compatibility
interface LegacyColumnVisibilityProps {
  visibleColumns?: Record<string, boolean>;
  onColumnChange?: (columns: any) => void;
  columns?: Array<{ key: string; label: string; visible: boolean }>;
  onColumnToggle?: (columnKey: string, visible: boolean) => void;
}

// Wrapper component for backward compatibility
export const ColumnVisibilityDropdown: React.FC<LegacyColumnVisibilityProps> = ({
  visibleColumns,
  onColumnChange,
  columns,
  onColumnToggle
}) => {
  // Transform legacy props to new format
  const transformedColumns: ColumnConfig[] = columns 
    ? columns.map(col => ({ key: col.key, label: col.label, hideable: true }))
    : Object.keys(visibleColumns || {}).map(key => ({ 
        key, 
        label: key.charAt(0).toUpperCase() + key.slice(1),
        hideable: true 
      }));

  const columnVisibility = visibleColumns || 
    (columns ? columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {}) : {});

  const handleToggleVisibility = (columnKey: string) => {
    if (onColumnToggle) {
      onColumnToggle(columnKey, !columnVisibility[columnKey]);
    } else if (onColumnChange) {
      onColumnChange({
        ...columnVisibility,
        [columnKey]: !columnVisibility[columnKey]
      });
    }
  };

  const handleResetToDefaults = () => {
    if (onColumnChange) {
      const defaultVisibility = Object.keys(columnVisibility).reduce(
        (acc, key) => ({ ...acc, [key]: true }), 
        {}
      );
      onColumnChange(defaultVisibility);
    }
  };

  return (
    <ColumnVisibilityMenu
      columns={transformedColumns}
      columnVisibility={columnVisibility}
      onToggleVisibility={handleToggleVisibility}
      onResetToDefaults={handleResetToDefaults}
    />
  );
};
