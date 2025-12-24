import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2, Eye, EyeOff, RotateCcw, Grid3x3 } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ColumnVisibilityMenuProps {
  columns: ColumnConfig[];
  columnVisibility: Record<string, boolean>;
  onToggleVisibility: (columnKey: string) => void;
  onResetToDefaults: () => void;
  storageKey?: string;
}

export const ColumnVisibilityMenu: React.FC<ColumnVisibilityMenuProps> = ({
  columns,
  columnVisibility,
  onToggleVisibility,
  onResetToDefaults,
  storageKey,
}) => {
  const visibleCount = Object.values(columnVisibility).filter(Boolean).length;
  const hideableColumns = columns.filter((col) => col.hideable !== false);

  // Group columns by their group property
  const { groupedColumns, ungroupedColumns } = useMemo(() => {
    const groups: Record<string, ColumnConfig[]> = {};
    const ungrouped: ColumnConfig[] = [];

    hideableColumns.forEach((col) => {
      if (col.group) {
        if (!groups[col.group]) {
          groups[col.group] = [];
        }
        groups[col.group].push(col);
      } else {
        ungrouped.push(col);
      }
    });

    return { groupedColumns: groups, ungroupedColumns: ungrouped };
  }, [hideableColumns]);

  // Handle group checkbox toggle - toggles all columns in the group
  const handleGroupToggle = (groupName: string) => {
    const columnsInGroup = groupedColumns[groupName];
    if (!columnsInGroup || columnsInGroup.length === 0) return;

    // Check if all columns in the group are currently visible
    const allVisible = columnsInGroup.every((col) => columnVisibility[col.key]);
    
    // Toggle all columns in the group to the opposite state
    columnsInGroup.forEach((col) => {
      if (columnVisibility[col.key] === allVisible) {
        onToggleVisibility(col.key);
      }
    });

    // Save to localStorage if storageKey exists
    if (storageKey) {
      const updatedVisibility = { ...columnVisibility };
      columnsInGroup.forEach((col) => {
        updatedVisibility[col.key] = !allVisible;
      });
      localStorage.setItem(
        `${storageKey}-columns`,
        JSON.stringify(updatedVisibility)
      );
    }
  };

  // Check if a group is fully visible, partially visible, or hidden
  const getGroupVisibilityState = (groupName: string): 'all' | 'some' | 'none' => {
    const columnsInGroup = groupedColumns[groupName];
    if (!columnsInGroup || columnsInGroup.length === 0) return 'none';

    const visibleColumnsInGroup = columnsInGroup.filter((col) => columnVisibility[col.key]);
    
    if (visibleColumnsInGroup.length === columnsInGroup.length) return 'all';
    if (visibleColumnsInGroup.length > 0) return 'some';
    return 'none';
  };

  // Persist column visibility state whenever it changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(
        `${storageKey}-columns`,
        JSON.stringify(columnVisibility)
      );
    }
  }, [columnVisibility, storageKey]);

  // Load persisted column visibility state on mount
  useEffect(() => {
    if (storageKey) {
      const savedVisibility = localStorage.getItem(`${storageKey}-columns`);
      if (savedVisibility) {
        const parsedVisibility = JSON.parse(savedVisibility);
        // Update each column's visibility based on saved state
        Object.keys(parsedVisibility).forEach((key) => {
          if (columnVisibility[key] !== parsedVisibility[key]) {
            onToggleVisibility(key);
          }
        });
      }
    }
  }, [storageKey]);

  // Format group name for display
  const formatGroupName = (groupName: string): string => {
    return groupName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex items-center gap-2"
          title="Columns"
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[280px] overflow-y-auto"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onResetToDefaults();
            }}
            className="h-6 px-2 text-xs flex items-center gap-1"
            title="Reset to defaults"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Columns
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Render grouped columns first */}
        {Object.keys(groupedColumns).map((groupName) => {
          const groupState = getGroupVisibilityState(groupName);
          const isChecked = groupState === 'all';
          const isIndeterminate = groupState === 'some';
          
          return (
            <DropdownMenuItem
              key={`group-${groupName}`}
              className="flex items-center gap-2 cursor-pointer font-medium"
              onSelect={(e) => {
                e.preventDefault();
                handleGroupToggle(groupName);
              }}
            >
              <Checkbox
                checked={isChecked}
                className={`border-gray-[#4B4B4B] data-[state=checked]:bg-transparent data-[state=checked]:border-gray-[#4B4B4B] [&>*]:data-[state=checked]:text-red-500 ${
                  isIndeterminate ? 'data-[state=unchecked]:bg-gray-200' : ''
                }`}
              />
              <div className="flex items-center gap-2 flex-1">
                <span>{formatGroupName(groupName)}</span>
                <span className="text-xs text-gray-500">
                  ({groupedColumns[groupName].filter(col => columnVisibility[col.key]).length}/{groupedColumns[groupName].length})
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        {/* Add separator if both grouped and ungrouped columns exist */}
        {Object.keys(groupedColumns).length > 0 && ungroupedColumns.length > 0 && (
          <DropdownMenuSeparator />
        )}
        
        {/* Render ungrouped columns */}
        {ungroupedColumns.map((column) => {
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
                  if (storageKey) {
                    const updatedVisibility = {
                      ...columnVisibility,
                      [column.key]: !columnVisibility[column.key],
                    };
                    localStorage.setItem(
                      `${storageKey}-columns`,
                      JSON.stringify(updatedVisibility)
                    );
                  }
                }
              }}
            >
              <Checkbox
                checked={isVisible}
                disabled={isLastVisible}
                className="border-gray-[#4B4B4B] data-[state=checked]:bg-transparent data-[state=checked]:border-gray-[#4B4B4B] [&>*]:data-[state=checked]:text-red-500"
              />
              <div className="flex items-center gap-2 flex-1">
                <span className={isLastVisible ? "text-gray-400" : ""}>
                  {column.label}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
