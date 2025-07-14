
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid3X3, Eye, EyeOff, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Support multiple interfaces for different pages
interface ColumnVisibilityDropdownProps {
  // CRM Campaign interface
  visibleColumns?: {
    actions?: boolean;
    id?: boolean;
    createdBy?: boolean;
    uniqueId?: boolean;
    project?: boolean;
    lead?: boolean;
    mobile?: boolean;
    status?: boolean;
    createdOn?: boolean;
    // Broadcast interface
    action?: boolean;
    title?: boolean;
    type?: boolean;
    expiredOn?: boolean;
    expired?: boolean;
    attachment?: boolean;
    // Asset Dashboard interface
    assetName?: boolean;
    assetId?: boolean;
    assetCode?: boolean;
    assetNo?: boolean;
    assetStatus?: boolean;
    equipmentId?: boolean;
    site?: boolean;
    building?: boolean;
    wing?: boolean;
    floor?: boolean;
    area?: boolean;
    room?: boolean;
    meterType?: boolean;
    assetType?: boolean;
  };
  onColumnChange?: (columns: any) => void;
  
  // Generic interface for other pages
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
      onColumnChange({
        ...visibleColumns,
        [column]: checked
      });
    } else if (onColumnToggle) {
      onColumnToggle(column, checked);
    }
  };

  // Generate column labels based on which interface is being used
  const getColumnData = () => {
    if (visibleColumns) {
      // Check if this is the asset dashboard columns
      if (visibleColumns.hasOwnProperty('assetName')) {
        const assetColumnLabels = {
          actions: 'Actions',
          serialNumber: 'Serial Number',
          assetName: 'Asset Name',
          assetId: 'Asset ID',
          assetNo: 'Asset No.',
          assetStatus: 'Asset Status',
          site: 'Site',
          building: 'Building',
          wing: 'Wing',
          floor: 'Floor',
          area: 'Area',
          room: 'Room',
          group: 'Group',
          subGroup: 'Sub-Group',
          assetType: 'Asset Type'
        };
        
        return Object.entries(assetColumnLabels).map(([key, label]) => ({
          key,
          label,
          visible: visibleColumns[key as keyof typeof visibleColumns] ?? false
        }));
      }
      
      // Determine which column set we're using
      const columnLabels = visibleColumns.hasOwnProperty('action') ? {
        // Broadcast columns
        action: 'Action',
        title: 'Title',
        type: 'Type',
        createdOn: 'Created On',
        createdBy: 'Created by',
        status: 'Status',
        expiredOn: 'Expired On',
        expired: 'Expired',
        attachment: 'Attachment'
      } : {
        // CRM Campaign columns
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
        visible: visibleColumns[key as keyof typeof visibleColumns] ?? false
      }));
    } else if (columns) {
      return columns;
    }
    return [];
  };

  const columnData = getColumnData();
  const visibleCount = columnData.filter(col => col.visible).length;

  const handleResetToDefaults = () => {
    if (onColumnChange && visibleColumns) {
      // Reset to default state (all columns visible)
      const defaultColumns = Object.keys(visibleColumns).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as any);
      onColumnChange(defaultColumns);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50">
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Show Columns</span>
          <span className="text-xs text-gray-500">
            {visibleCount} of {columnData.length}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {columnData.map(({ key, label, visible }) => {
          const isLastVisible = visibleCount === 1 && visible;
          
          return (
            <DropdownMenuItem
              key={key}
              className="flex items-center gap-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault(); // Prevent dropdown from closing
              }}
            >
              <Checkbox
                checked={visible}
                disabled={isLastVisible}
                onCheckedChange={(checked) => {
                  if (!isLastVisible) {
                    handleColumnToggle(key, checked as boolean);
                  }
                }}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer"
                onClick={() => {
                  if (!isLastVisible) {
                    handleColumnToggle(key, !visible);
                  }
                }}
              >
                {visible ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <span className={isLastVisible ? "text-gray-400" : ""}>
                  {label}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleResetToDefaults}
          className="flex items-center gap-2 cursor-pointer text-gray-600"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
