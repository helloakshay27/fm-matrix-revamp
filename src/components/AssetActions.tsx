import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Upload,
  Filter,
  Search,
  RotateCcw,
  ExternalLink,
  Clock,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { ColumnVisibilityDropdown } from "@/components/ColumnVisibilityDropdown";
import { SelectionPanel } from "./water-asset-details/PannelTab";

interface AssetActionsProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  onAddAsset: () => void;
  onImport: () => void;
  onUpdate: () => void;
  onFilterOpen: () => void;
  onRefresh: () => void;
  onChecklist?: () => void;
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
  onChecklist = () => console.log('Checklist button clicked'),
  visibleColumns,
  onColumnChange,
}) => {
    const [showActionPanel, setShowActionPanel] = useState(false);
  
   const selectionActions = [
    
      // {
      //   label: 'Update',
      //   icon: Clock,
      //   // onClick: handleUpdateSelected,
      //   variant: 'outline' as const,
      // },
      
      // {
      //   label: 'Flag',
      //   icon: AlertCircle,
      //   // onClick: handleFlagSelected,
      //   variant: 'outline' as const,
      // },
      // {
      //   label: 'Delete',
      //   icon: Trash2,
      //   // onClick: () => handleBulkDelete(selectedAMCObjects),
      //   variant: 'destructive' as const,
      // },

    ];

  const handleActionClick = () => {
    setShowActionPanel(true);
  };
  return (<>
     {showActionPanel && (
                <SelectionPanel
                  actions={selectionActions}
                  onAdd={onAddAsset}
                  onClearSelection={()=> setShowActionPanel(false)}
                  onImport={onImport}
                  onChecklist={onChecklist}
                />
              )}
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <Button 
        onClick={onAddAsset}
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium"
      >
        <Plus className="w-4 h-4 mr-2" />
        Action
      </Button>
      
      <div className="flex items-center gap-2 ml-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 w-64 bg-white border-gray-300"
          />
        </div>
        
        <Button 
          onClick={onFilterOpen}
          variant="outline" 
          size="icon"
          className="border-gray-600 text-gray-800 bg-white hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4" />
        </Button> */}

        <ColumnVisibilityDropdown
          visibleColumns={visibleColumns}
          onColumnChange={onColumnChange}
        />
        
        <Button 
          onClick={onImport}
          variant="outline" 
          size="icon"
          className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
        >
          <Upload className="w-4 h-4" />
        </Button>
      </div>
    </div>
    </>
  );
};
