import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { AssetFilterDialog } from '@/components/AssetFilterDialog';
import { AssetStats } from '@/components/AssetStats';
import { AssetActions } from '@/components/AssetActions';
import { AssetDataTable } from '@/components/AssetDataTable';
import { AssetSelectionPanel } from '@/components/AssetSelectionPanel';
import { MoveAssetDialog } from '@/components/MoveAssetDialog';
import { DisposeAssetDialog } from '@/components/DisposeAssetDialog';
import { useAssetData } from '@/hooks/useAssetData';

export const AssetDashboard = () => {
  const navigate = useNavigate();
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMoveAssetOpen, setIsMoveAssetOpen] = useState(false);
  const [isDisposeAssetOpen, setIsDisposeAssetOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    serialNumber: true,
    assetName: true,
    assetId: true,
    assetNo: true,
    assetStatus: true,
    site: true,
    building: true,
    wing: true,
    floor: true,
    area: true,
    room: true,
    group: true,
    subGroup: true,
    assetType: true
  });

  const {
    filteredAssets,
    selectedAssets,
    searchTerm,
    stats,
    handleSearch,
    handleSelectAll,
    handleSelectAsset
  } = useAssetData();

  // Get selected asset objects with id and name
  const selectedAssetObjects = filteredAssets.filter(asset => selectedAssets.includes(asset.id)).map(asset => ({
    id: asset.id,
    name: asset.name
  }));

  const handleAddAsset = () => {
    navigate('/maintenance/asset/add');
  };

  const handleImport = () => {
    setUploadType('import');
    setIsBulkUploadOpen(true);
  };

  const handleUpdate = () => {
    setUploadType('update');
    setIsBulkUploadOpen(true);
  };

  const handleViewAsset = (assetId: string) => {
    navigate(`/maintenance/asset/details/${assetId}`);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleColumnChange = (columns: typeof visibleColumns) => {
    setVisibleColumns(columns);
  };

  // Selection panel handlers
  const handleMoveAsset = () => {
    console.log('Move asset clicked for', selectedAssets.length, 'assets');
    setIsMoveAssetOpen(true);
    // Clear selection to close the panel
    handleSelectAll(false);
  };

  const handleDisposeAsset = () => {
    console.log('Dispose asset clicked for', selectedAssets.length, 'assets');
    setIsDisposeAssetOpen(true);
    // Clear selection to close the panel
    handleSelectAll(false);
  };

  const handlePrintQRCode = () => {
    console.log('Print QR code clicked for', selectedAssets.length, 'assets');
  };

  const handleCheckIn = () => {
    console.log('Check in clicked for', selectedAssets.length, 'assets');
  };

  const handleClearSelection = () => {
    console.log('Clear selection called, current selected assets:', selectedAssets.length);
    handleSelectAll(false);
    console.log('Selection cleared using handleSelectAll(false)');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-full overflow-x-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Assets</span>
          <span>&gt;</span>
          <span>Asset List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">ASSET LIST</h1>
      </div>

      <AssetStats stats={stats} />

      <AssetActions
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onAddAsset={handleAddAsset}
        onImport={handleImport}
        onUpdate={handleUpdate}
        onFilterOpen={() => setIsFilterOpen(true)}
        onRefresh={handleRefresh}
        visibleColumns={visibleColumns}
        onColumnChange={handleColumnChange}
      />

      <div className="relative">
        <AssetDataTable
          assets={filteredAssets}
          selectedAssets={selectedAssets}
          visibleColumns={visibleColumns}
          onSelectAll={handleSelectAll}
          onSelectAsset={handleSelectAsset}
          onViewAsset={handleViewAsset}
        />

        {/* Selection Panel - positioned as overlay within table container */}
        {selectedAssets.length > 0 && (
          <AssetSelectionPanel
            selectedCount={selectedAssets.length}
            selectedAssets={selectedAssetObjects}
            onMoveAsset={handleMoveAsset}
            onDisposeAsset={handleDisposeAsset}
            onPrintQRCode={handlePrintQRCode}
            onCheckIn={handleCheckIn}
            onClearSelection={handleClearSelection}
          />
        )}
      </div>

      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                4
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                5
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                6
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                7
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                8
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                Last
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <BulkUploadDialog 
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === 'import' ? 'Import Assets' : 'Update Assets'}
      />

      <AssetFilterDialog 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <MoveAssetDialog
        isOpen={isMoveAssetOpen}
        onClose={() => setIsMoveAssetOpen(false)}
        selectedAssets={selectedAssets}
      />

      <DisposeAssetDialog
        isOpen={isDisposeAssetOpen}
        onClose={() => setIsDisposeAssetOpen(false)}
        selectedAssets={selectedAssets}
      />
    </div>
  );
};
