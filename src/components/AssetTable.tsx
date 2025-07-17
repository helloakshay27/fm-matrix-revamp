import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, Eye, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { AssetSelectionDialog } from './AssetSelectionDialog';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAssets, MappedAsset } from '@/hooks/useAssets';

interface AssetTableProps {
  searchTerm: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'In Use':
      return 'default';
    case 'In Store':
      return 'secondary';
    case 'Breakdown':
      return 'destructive';
    case 'Disposed':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const AssetTable = ({ searchTerm, currentPage = 1, onPageChange }: AssetTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showSelectionDialog, setShowSelectionDialog] = useState(false);
  const { assets, pagination, loading, error, refetch, changePage } = useAssets(currentPage);

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

  const renderCell = (asset: MappedAsset, columnKey: string) => {
    if (columnKey === 'assetStatus') {
      return (
        <Badge variant={getStatusBadgeVariant(asset.assetStatus)}>
          {asset.assetStatus}
        </Badge>
      );
    }
    return asset[columnKey as keyof MappedAsset] || 'NA';
  };

  const handleRowClick = (asset: MappedAsset) => {
    navigate(`/utility/asset-details/${asset.id}`);
  };

  const selectedAssetObjects = useMemo(() => {
    return assets.filter(asset => selectedItems.includes(asset.id));
  }, [selectedItems, assets]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedItems(filteredData.map(asset => asset.id));
        setShowSelectionDialog(true);
      } else {
        setSelectedItems([]);
        setShowSelectionDialog(false);
      }
    },
    [filteredData, setSelectedItems]
  );

  const handleSelectItem = useCallback(
    (assetId: string, checked: boolean) => {
      if (checked) {
        setSelectedItems(prev => [...prev, assetId]);
        setShowSelectionDialog(true);
      } else {
        setSelectedItems(prev => prev.filter(id => id !== assetId));
        if (selectedItems.length === 1) {
          setShowSelectionDialog(false);
        }
      }
    },
    [selectedItems, setSelectedItems]
  );

  const getItemId = (asset: MappedAsset) => asset.id;

  const handlePageChange = (page: number) => {
    changePage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading assets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <span className="text-destructive">{error}</span>
        <Button onClick={refetch} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }


  const handlePrintQRCode = () => {
    alert(`Printing QR codes for ${selectedItems.length} assets`);
  };

  const handleCheckIn = () => {
    alert(`Checking in ${selectedItems.length} assets`);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setShowSelectionDialog(false);
  };

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
        storageKey="energy-assets-table"
        hideTableExport={true}
        hideTableSearch={true}
        pagination={false}
      />

      {/* Custom Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.current_page || 1) - 1) * (pagination.per_page || 20) + 1} to{' '}
            {Math.min((pagination.current_page || 1) * (pagination.per_page || 20), pagination.total_count || 0)} of{' '}
            {pagination.total_count || 0} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.current_page || 1} of {pagination.total_pages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AssetSelectionDialog
        open={showSelectionDialog && selectedItems.length > 0}
        onOpenChange={setShowSelectionDialog}
        selectedCount={selectedItems.length}
        selectedAssets={selectedAssetObjects}
        onPrintQRCode={handlePrintQRCode}
        onCheckIn={handleCheckIn}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};
