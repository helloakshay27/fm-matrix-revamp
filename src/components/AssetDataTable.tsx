
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { StatusBadge } from './StatusBadge';
import type { Asset } from '@/hooks/useAssets';

// Asset interface now imported from useAssets hook

interface AssetDataTableProps {
  assets: Asset[];
  selectedAssets: string[];
  visibleColumns: any;
  onSelectAll: (checked: boolean) => void;
  onSelectAsset: (assetId: string, checked: boolean) => void;
  onViewAsset: (assetId: string) => void;
}

export const AssetDataTable: React.FC<AssetDataTableProps> = ({
  assets,
  selectedAssets,
  visibleColumns,
  onSelectAll,
  onSelectAsset,
  onViewAsset
}) => {
  // Status color logic moved to StatusBadge component

  const columns: ColumnConfig[] = [
    { key: 'serialNumber', label: 'Serial Number', sortable: true, hideable: true, defaultVisible: visibleColumns.serialNumber },
    { key: 'assetName', label: 'Asset Name', sortable: true, hideable: true, defaultVisible: visibleColumns.assetName },
    { key: 'assetId', label: 'Asset ID', sortable: true, hideable: true, defaultVisible: visibleColumns.assetId },
    { key: 'assetNo', label: 'Asset No.', sortable: true, hideable: true, defaultVisible: visibleColumns.assetNo },
    { key: 'assetStatus', label: 'Asset Status', sortable: true, hideable: true, defaultVisible: visibleColumns.assetStatus },
    { key: 'site', label: 'Site', sortable: true, hideable: true, defaultVisible: visibleColumns.site },
    { key: 'building', label: 'Building', sortable: true, hideable: true, defaultVisible: visibleColumns.building },
    { key: 'wing', label: 'Wing', sortable: true, hideable: true, defaultVisible: visibleColumns.wing },
    { key: 'floor', label: 'Floor', sortable: true, hideable: true, defaultVisible: visibleColumns.floor },
    { key: 'area', label: 'Area', sortable: true, hideable: true, defaultVisible: visibleColumns.area },
    { key: 'room', label: 'Room', sortable: true, hideable: true, defaultVisible: visibleColumns.room },
    { key: 'group', label: 'Group', sortable: true, hideable: true, defaultVisible: visibleColumns.group },
    { key: 'subGroup', label: 'Sub-Group', sortable: true, hideable: true, defaultVisible: visibleColumns.subGroup },
    { key: 'assetType', label: 'Asset Type', sortable: true, hideable: true, defaultVisible: visibleColumns.assetType },
  ];

  const renderCell = (asset: Asset, columnKey: string) => {
    switch (columnKey) {
      case 'serialNumber':
        return <span className="text-sm text-gray-600">{asset.serialNumber}</span>;
      case 'assetName':
        return <span className="text-sm font-medium text-gray-900">{asset.name}</span>;
      case 'assetId':
        return <span className="text-sm text-[#1a1a1a]">{asset.id}</span>;
      case 'assetNo':
        return <span className="text-sm text-gray-600">{asset.assetNumber}</span>;
      case 'assetStatus':
        return <StatusBadge status={asset.status} />;
      case 'site':
        return <span className="text-sm text-gray-600">{asset.siteName}</span>;
      case 'building':
        return <span className="text-sm text-gray-600">{asset.building?.name || 'NA'}</span>;
      case 'wing':
        return <span className="text-sm text-gray-600">{asset.wing?.name || 'NA'}</span>;
      case 'floor':
        return <span className="text-sm text-gray-600">NA</span>; {/* Floor not in API response */}
      case 'area':
        return <span className="text-sm text-gray-600">{asset.area?.name || 'NA'}</span>;
      case 'room':
        return <span className="text-sm text-gray-600">{asset.pmsRoom?.name || 'NA'}</span>;
      case 'group':
        return <span className="text-sm text-gray-600">{asset.assetGroup || 'N/A'}</span>;
      case 'subGroup':
        return <span className="text-sm text-gray-600">{asset.assetSubGroup || 'N/A'}</span>;
      case 'assetType':
        return <span className="text-sm text-gray-600">
          {asset.assetType ? 'Comprehensive' : 'Non-Comprehensive'}
        </span>;
      default:
        return null;
    }
  };

  const renderActions = (asset: Asset) => (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onViewAsset(asset.id);
      }}
      className="p-1 h-8 w-8"
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  return (
    <EnhancedTable
      data={assets}
      columns={columns}
      renderCell={renderCell}
      renderActions={renderActions}
      onRowClick={(asset) => onViewAsset(asset.id)}
      storageKey="asset-data-table"
      emptyMessage="No assets found"
      selectable={true}
      selectedItems={selectedAssets}
      onSelectAll={onSelectAll}
      onSelectItem={onSelectAsset}
      getItemId={(asset) => asset.id}
      selectAllLabel="Select all assets"
      hideTableSearch={true}
      hideTableExport={true}
      hideColumnsButton={true}
    />
  );
};
