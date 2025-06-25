
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColumnVisibilityDropdownProps {
  visibleColumns: {
    actions: boolean;
    id: boolean;
    createdBy: boolean;
    uniqueId: boolean;
    project: boolean;
    lead: boolean;
    mobile: boolean;
    status: boolean;
    createdOn: boolean;
  };
  onColumnChange: (columns: any) => void;
}

export const ColumnVisibilityDropdown = ({ visibleColumns, onColumnChange }: ColumnVisibilityDropdownProps) => {
  const handleColumnToggle = (column: string, checked: boolean) => {
    onColumnChange({
      ...visibleColumns,
      [column]: checked
    });
  };

  const columnLabels = {
    actions: 'Actions',
    id: 'ID',
    createdBy: 'Created By',
    uniqueId: 'Unique Id',
    project: 'Project',
    lead: 'Lead',
    mobile: 'Mobile',
    status: 'Status',
    createdOn: 'Created On'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-gray-300">
          <Grid className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50">
        {Object.entries(columnLabels).map(([key, label]) => (
          <DropdownMenuItem key={key} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
            <Checkbox
              id={key}
              checked={visibleColumns[key as keyof typeof visibleColumns]}
              onCheckedChange={(checked) => handleColumnToggle(key, checked as boolean)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <label htmlFor={key} className="text-sm font-medium cursor-pointer">
              {label}
            </label>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
