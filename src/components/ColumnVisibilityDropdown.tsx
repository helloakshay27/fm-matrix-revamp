
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

// Support both interfaces for backward compatibility
interface ColumnVisibilityDropdownProps {
  // New interface (used by CRMCampaignPage)
  visibleColumns?: {
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
  onColumnChange?: (columns: any) => void;
  
  // Alternative interface (used by other pages)
  columns?: Array<{
    key: string;
    label: string;
    visible: boolean;
  }>;
  onColumnToggle?: (columnKey: string, visible: boolean) => void;
}

export const ColumnVisibilityDropdown = ({ 
  visibleColumns, 
  onColumnChange, 
  columns, 
  onColumnToggle 
}: ColumnVisibilityDropdownProps) => {
  const handleColumnToggle = (column: string, checked: boolean) => {
    if (onColumnChange && visibleColumns) {
      // Use the original interface
      onColumnChange({
        ...visibleColumns,
        [column]: checked
      });
    } else if (onColumnToggle) {
      // Use the alternative interface
      onColumnToggle(column, checked);
    }
  };

  // Generate column labels based on which interface is being used
  const getColumnData = () => {
    if (visibleColumns) {
      // Original interface
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
      return Object.entries(columnLabels).map(([key, label]) => ({
        key,
        label,
        visible: visibleColumns[key as keyof typeof visibleColumns]
      }));
    } else if (columns) {
      // Alternative interface
      return columns;
    }
    return [];
  };

  const columnData = getColumnData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-gray-300">
          <Grid className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50">
        {columnData.map(({ key, label, visible }) => (
          <DropdownMenuItem key={key} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
            <Checkbox
              id={key}
              checked={visible}
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
