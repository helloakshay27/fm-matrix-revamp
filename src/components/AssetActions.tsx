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
        onClearSelection={() => setShowActionPanel(false)}
        onImport={onImport}
        onChecklist={onChecklist}
      />
    )}
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <Button
        onClick={handleActionClick}
        className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-6"
      >
        <Plus className="w-4 h-4 mr-2" />
        Action
      </Button>

      {/* <Button
        onClick={onImport}
        className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button> */}

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
          className="border-gray-600 text-gray-800 bg-white hover:bg-gray-50 px-2"
        >
          <Filter className="w-4 h-4 " />
        </Button>


        {/* <Button 
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
          variant="outline"
          size="icon"
          className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
        >
          <span className="w-4 h-4">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.039 5.13579L8.1 3.06528V11.6984C8.1 11.9372 8.19482 12.1662 8.3636 12.335C8.53239 12.5038 8.7613 12.5987 9 12.5987C9.23869 12.5987 9.46761 12.5038 9.6364 12.335C9.80518 12.1662 9.9 11.9372 9.9 11.6984V3.06528L11.961 5.13579C12.0447 5.22017 12.1442 5.28714 12.2539 5.33284C12.3636 5.37855 12.4812 5.40208 12.6 5.40208C12.7188 5.40208 12.8364 5.37855 12.9461 5.33284C13.0558 5.28714 13.1553 5.22017 13.239 5.13579C13.3234 5.0521 13.3903 4.95254 13.436 4.84284C13.4817 4.73314 13.5052 4.61547 13.5052 4.49663C13.5052 4.37779 13.4817 4.26013 13.436 4.15043C13.3903 4.04073 13.3234 3.94116 13.239 3.85747L9.639 0.256576C9.55341 0.174619 9.45248 0.110375 9.342 0.067529C9.12288 -0.0225097 8.87712 -0.0225097 8.658 0.067529C8.54752 0.110375 8.44659 0.174619 8.361 0.256576L4.761 3.85747C4.67709 3.94141 4.61052 4.04106 4.56511 4.15072C4.51969 4.26039 4.49632 4.37793 4.49632 4.49663C4.49632 4.61534 4.51969 4.73288 4.56511 4.84254C4.61052 4.95221 4.67709 5.05186 4.761 5.13579C4.84491 5.21973 4.94454 5.28631 5.05418 5.33173C5.16382 5.37716 5.28133 5.40054 5.4 5.40054C5.51867 5.40054 5.63618 5.37716 5.74582 5.33173C5.85546 5.28631 5.95509 5.21973 6.039 5.13579ZM17.1 10.7982C16.8613 10.7982 16.6324 10.893 16.4636 11.0619C16.2948 11.2307 16.2 11.4597 16.2 11.6984V15.2993C16.2 15.5381 16.1052 15.7671 15.9364 15.9359C15.7676 16.1047 15.5387 16.1996 15.3 16.1996H2.7C2.46131 16.1996 2.23239 16.1047 2.0636 15.9359C1.89482 15.7671 1.8 15.5381 1.8 15.2993V11.6984C1.8 11.4597 1.70518 11.2307 1.5364 11.0619C1.36761 10.893 1.13869 10.7982 0.9 10.7982C0.661305 10.7982 0.432387 10.893 0.263604 11.0619C0.0948211 11.2307 0 11.4597 0 11.6984V15.2993C0 16.0156 0.284464 16.7025 0.790812 17.209C1.29716 17.7155 1.98392 18 2.7 18H15.3C16.0161 18 16.7028 17.7155 17.2092 17.209C17.7155 16.7025 18 16.0156 18 15.2993V11.6984C18 11.4597 17.9052 11.2307 17.7364 11.0619C17.5676 10.893 17.3387 10.7982 17.1 10.7982Z"
                fill="#C72030"
              />
            </svg>
          </span>
        </Button>
      </div>
    </div>
  </>
  );
};
