
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid3X3 } from 'lucide-react';

interface ColumnOption {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnVisibilityDropdownProps {
  columns: ColumnOption[];
  onColumnToggle: (columnKey: string, visible: boolean) => void;
}

export const ColumnVisibilityDropdown = ({ columns, onColumnToggle }: ColumnVisibilityDropdownProps) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (columnKey: string, checked: boolean) => {
    onColumnToggle(columnKey, checked);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Grid3X3 className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-2">
          <div className="font-medium text-sm border-b pb-2">Actions</div>
          {columns.map((column) => (
            <div key={column.key} className="flex items-center space-x-2">
              <Checkbox
                id={column.key}
                checked={column.visible}
                onCheckedChange={(checked) => handleToggle(column.key, !!checked)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label
                htmlFor={column.key}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {column.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
