import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { AssetSelectionPanel } from './AssetSelectionPanel';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAssets, type MappedAsset } from '@/hooks/useAssets';
import { StatusBadge } from './StatusBadge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AssetTableProps {
  searchTerm: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const AssetTable = ({ searchTerm, currentPage = 1, onPageChange }: AssetTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  
  const { assets, pagination, loading, error, refetch } = useAssets(currentPage);

  const columns: ColumnConfig[] = useMemo(() => [
    { key: 'serialNumber', label: 'Serial Number', sortable: true, hideable: true, draggable: true },
    { key: 'name', label: 'Asset Name', sortable: true, hideable: false, draggable: true },
    { key: 'assetId', label: 'Asset ID', sortable: true, hideable: true, draggable: true },
    { key: 'assetNo', label: 'Asset No.', sortable: true, hideable: true, draggable: true },
    { key: 'assetStatus', label: 'Asset Status', sortable: true, hideable: true, draggable: true },
    { key: 'site', label: 'Site', sortable: true, hideable: true, draggable: true },
    { key: 'building', label: 'Building', sortable: true, hideable: true, draggable: true },
    { key: 'wing', label: 'Wing', sortable: true, hideable: true, draggable: true },
    { key: 'floor', label: 'Floor', sortable: true, hideable: true, draggable: true },
    { key: 'area', label: 'Area', sortable: true, hideable: true, draggable: true },
    { key: 'room', label: 'Room', sortable: true, hideable: true, draggable: true },
    { key: 'group', label: 'Group', sortable: true, hideable: true, draggable: true },
    { key: 'subGroup', label: 'Sub-Group', sortable: true, hideable: true, draggable: true },
    { key: 'assetType', label: 'Asset Type', sortable: true, hideable: true, draggable: true },
    { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false },
  ], []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return assets;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return assets.filter(asset =>
      Object.values(asset).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [searchTerm, assets]);

  const handleEdit = (id: string) => {
    navigate(`/utility/edit-asset/${id}`);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Delete Asset",
      description: `Deleting asset with id ${id}.`,
    })
  };

  const handleViewDetails = (id: string) => {
    navigate(`/utility/asset-details/${id}`);
  };

  const renderActions = (asset: MappedAsset) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleEdit(asset.id)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(asset.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleViewDetails(asset.id)}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleRowClick = (asset: MappedAsset) => {
    navigate(`/utility/asset-details/${asset.id}`);
  };

  const selectedAssetObjects = useMemo(() => {
    return assets.filter(asset => selectedItems.includes(asset.id));
  }, [selectedItems, assets]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedItems(assets.map(asset => asset.id));
        setShowSelectionPanel(true);
      } else {
        setSelectedItems([]);
        setShowSelectionPanel(false);
      }
    },
    [assets, setSelectedItems]
  );

  const handleSelectItem = useCallback(
    (assetId: string, checked: boolean) => {
      if (checked) {
        setSelectedItems(prev => [...prev, assetId]);
        setShowSelectionPanel(true);
      } else {
        setSelectedItems(prev => prev.filter(id => id !== assetId));
        if (selectedItems.length === 1) {
          setShowSelectionPanel(false);
        }
      }
    },
    [selectedItems, setSelectedItems]
  );

  const getItemId = (asset: MappedAsset) => asset.id;

  const bulkActions = [
    {
      label: 'Move Asset',
      onClick: (selectedAssets) => {
        alert(`Moving ${selectedAssets.length} assets`);
      }
    },
    {
      label: 'Dispose Asset',
      onClick: (selectedAssets) => {
        alert(`Disposing ${selectedAssets.length} assets`);
      }
    }
  ];

  const handleMoveAsset = () => {
    alert(`Moving ${selectedItems.length} assets`);
  };

  const handleDisposeAsset = () => {
    alert(`Disposing ${selectedItems.length} assets`);
  };

  const handlePrintQRCode = () => {
    alert(`Printing QR codes for ${selectedItems.length} assets`);
  };

  const handleCheckIn = () => {
    alert(`Checking in ${selectedItems.length} assets`);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setShowSelectionPanel(false);
  };

  // Custom cell renderer for status
  const renderCell = (item: MappedAsset, columnKey: string) => {
    if (columnKey === 'assetStatus') {
      return <StatusBadge status={item.assetStatus} />;
    }
    return item[columnKey as keyof MappedAsset];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading assets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderActions={renderActions}
        renderCell={renderCell}
        onRowClick={handleRowClick}
        selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={getItemId}
        bulkActions={bulkActions}
        showBulkActions={true}
        storageKey="energy-assets-table"
        hideTableExport={true}
        hideTableSearch={true}
      />

      {/* Custom Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_count} total assets)
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange?.(Math.max(1, pagination.current_page - 1))}
                  className={pagination.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {[...Array(pagination.total_pages)].map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    onClick={() => onPageChange?.(index + 1)}
                    isActive={pagination.current_page === index + 1}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange?.(Math.min(pagination.total_pages, pagination.current_page + 1))}
                  className={pagination.current_page === pagination.total_pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {showSelectionPanel && selectedItems.length > 0 && (
        <AssetSelectionPanel
          selectedCount={selectedItems.length}
          selectedAssets={selectedAssetObjects}
          onMoveAsset={handleMoveAsset}
          onDisposeAsset={handleDisposeAsset}
          onPrintQRCode={handlePrintQRCode}
          onCheckIn={handleCheckIn}
          onClearSelection={handleClearSelection}
        />
      )}
    </div>
  );
};
