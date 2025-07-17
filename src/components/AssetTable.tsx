import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
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
import { StatusBadge } from './StatusBadge';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAssets, MappedAsset } from '@/hooks/useAssets';

interface AssetTableProps {
  searchTerm: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const AssetTable = ({ searchTerm, currentPage, onPageChange }: AssetTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  
  // Fetch assets from API
  const { assets, loading, error, pagination, refetch, statsData } = useAssets(currentPage, searchTerm);

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

  // Custom cell renderer for status
  const renderCell = useCallback((asset: MappedAsset, key: string) => {
    if (key === 'assetStatus') {
      return <StatusBadge status={asset.assetStatus} />;
    }
    return asset[key as keyof MappedAsset];
  }, []);

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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading assets...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <EnhancedTable
        data={assets}
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
        pagination={false}
      />

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
      
      {/* Custom Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
          {Math.min(pagination.current_page * pagination.per_page, pagination.total_count)} of{' '}
          {pagination.total_count} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
          >
            Previous
          </Button>
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === pagination.current_page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.total_pages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
