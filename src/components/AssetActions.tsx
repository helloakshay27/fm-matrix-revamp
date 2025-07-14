
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Filter, RotateCcw, ExternalLink } from 'lucide-react';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';

interface AssetActionsProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  onAddAsset: () => void;
  onImport: () => void;
  onUpdate: () => void;
  onFilterOpen: () => void;
  onRefresh: () => void;
  visibleColumns: any;
  onColumnChange: (columns: any) => void;
}

export const AssetActions: React.FC<AssetActionsProps> = ({
  searchTerm,
  onSearch,
  onAddAsset,
  onImport,
  onUpdate,
  onFilterOpen,
  onRefresh,
  visibleColumns,
  onColumnChange
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <Button 
        onClick={onAddAsset}
        className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-6"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>

      <Button 
        onClick={onImport}
        className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
      
      <Button 
        onClick={onFilterOpen}
        variant="outline" 
        className="border-gray-600 text-gray-800 bg-white hover:bg-gray-50 px-4"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </Button>

      <div className="flex items-center gap-2 ml-auto">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <ColumnVisibilityDropdown 
          visibleColumns={visibleColumns}
          onColumnChange={onColumnChange}
        />
        
        <Button 
          variant="outline" 
          size="icon"
          className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
