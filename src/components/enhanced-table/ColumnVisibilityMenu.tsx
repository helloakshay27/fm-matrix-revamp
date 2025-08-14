import React, { useEffect } from 'react';
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
import { Settings2, Eye, EyeOff, RotateCcw, Grid3x3 } from 'lucide-react';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

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
  storageKey
}) => {
  const visibleCount = Object.values(columnVisibility).filter(Boolean).length;
  const hideableColumns = columns.filter(col => col.hideable !== false);

  // Persist column visibility state whenever it changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`${storageKey}-columns`, JSON.stringify(columnVisibility));
    }
  }, [columnVisibility, storageKey]);

  // Load persisted column visibility state on mount
  useEffect(() => {
    if (storageKey) {
      const savedVisibility = localStorage.getItem(`${storageKey}-columns`);
      if (savedVisibility) {
        const parsedVisibility = JSON.parse(savedVisibility);
        // Update each column's visibility based on saved state
        Object.keys(parsedVisibility).forEach(key => {
          if (columnVisibility[key] !== parsedVisibility[key]) {
            onToggleVisibility(key);
          }
        });
      }
    }
  }, [storageKey]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex items-center gap-2"
          title='Columns'
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 h-[368px] overflow-y-auto">
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
                  if (storageKey) {
                    const updatedVisibility = {
                      ...columnVisibility,
                      [column.key]: !columnVisibility[column.key]
                    };
                    localStorage.setItem(`${storageKey}-columns`, JSON.stringify(updatedVisibility));
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
