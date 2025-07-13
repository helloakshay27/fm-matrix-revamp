
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface Asset {
  id: string;
  name: string;
  code: string;
  assetNo: string;
  status: string;
  equipmentId: string;
  site: string;
  building: string;
  wing: string;
  floor: string;
  area: string;
  room: string;
  meterType: string;
  assetType: string;
  serialNumber?: string;
  group?: string;
  subGroup?: string;
}

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Use':
        return 'bg-green-500 text-white';
      case 'Breakdown':
        return 'bg-red-500 text-white';
      case 'Maintenance':
        return 'bg-yellow-500 text-white';
      case 'Standby':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

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
        return <span className="text-sm text-gray-600">{asset.serialNumber || asset.code}</span>;
      case 'assetName':
        return <span className="text-sm font-medium text-gray-900">{asset.name}</span>;
      case 'assetId':
        return <span className="text-sm text-[#1a1a1a]">{asset.id}</span>;
      case 'assetNo':
        return <span className="text-sm text-gray-600">{asset.assetNo}</span>;
      case 'assetStatus':
        return (
          <Badge className={`${getStatusColor(asset.status)} text-xs px-2 py-1`}>
            {asset.status}
          </Badge>
        );
      case 'site':
        return <span className="text-sm text-gray-600">{asset.site}</span>;
      case 'building':
        return <span className="text-sm text-gray-600">{asset.building}</span>;
      case 'wing':
        return <span className="text-sm text-gray-600">{asset.wing}</span>;
      case 'floor':
        return <span className="text-sm text-gray-600">{asset.floor}</span>;
      case 'area':
        return <span className="text-sm text-gray-600">{asset.area}</span>;
      case 'room':
        return <span className="text-sm text-gray-600">{asset.room}</span>;
      case 'group':
        return <span className="text-sm text-gray-600">{asset.group || 'N/A'}</span>;
      case 'subGroup':
        return <span className="text-sm text-gray-600">{asset.subGroup || 'N/A'}</span>;
      case 'assetType':
        return <span className="text-sm text-gray-600">{asset.assetType}</span>;
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
    <div className="space-y-4">
      {/* Selection Controls */}
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg">
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            onChange={(e) => onSelectAll(e.target.checked)}
            checked={selectedAssets.length === assets.length && assets.length > 0}
            className="rounded border-gray-300"
          />
          Select All ({selectedAssets.length} selected)
        </label>
      </div>

      <EnhancedTable
        data={assets}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        onRowClick={(asset) => onViewAsset(asset.id)}
        storageKey="asset-data-table"
        emptyMessage="No assets found"
      />
    </div>
  );
};
