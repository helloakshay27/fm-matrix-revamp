
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="w-12 px-4 py-3">
                <input 
                  type="checkbox" 
                  onChange={(e) => onSelectAll(e.target.checked)}
                  checked={selectedAssets.length === assets.length && assets.length > 0}
                  className="rounded border-gray-300"
                />
              </TableHead>
              {visibleColumns.actions && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</TableHead>
              )}
              {visibleColumns.assetName && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset Name</TableHead>
              )}
              {visibleColumns.assetId && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset ID</TableHead>
              )}
              {visibleColumns.assetCode && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset Code</TableHead>
              )}
              {visibleColumns.assetNo && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset No.</TableHead>
              )}
              {visibleColumns.assetStatus && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset Status</TableHead>
              )}
              {visibleColumns.equipmentId && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipment Id</TableHead>
              )}
              {visibleColumns.site && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Site</TableHead>
              )}
              {visibleColumns.building && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Building</TableHead>
              )}
              {visibleColumns.wing && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Wing</TableHead>
              )}
              {visibleColumns.floor && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Floor</TableHead>
              )}
              {visibleColumns.area && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Area</TableHead>
              )}
              {visibleColumns.room && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</TableHead>
              )}
              {visibleColumns.meterType && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Meter Type</TableHead>
              )}
              {visibleColumns.assetType && (
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset Type</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                <TableCell className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    checked={selectedAssets.includes(asset.id)}
                    onChange={(e) => onSelectAsset(asset.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                {visibleColumns.actions && (
                  <TableCell className="px-4 py-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewAsset(asset.id)}
                      className="p-1 h-8 w-8"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
                {visibleColumns.assetName && (
                  <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{asset.name}</TableCell>
                )}
                {visibleColumns.assetId && (
                  <TableCell className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.id}</TableCell>
                )}
                {visibleColumns.assetCode && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600 font-mono">{asset.code}</TableCell>
                )}
                {visibleColumns.assetNo && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.assetNo}</TableCell>
                )}
                {visibleColumns.assetStatus && (
                  <TableCell className="px-4 py-3">
                    <Badge className={`${getStatusColor(asset.status)} text-xs px-2 py-1`}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.equipmentId && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.equipmentId}</TableCell>
                )}
                {visibleColumns.site && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.site}</TableCell>
                )}
                {visibleColumns.building && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.building}</TableCell>
                )}
                {visibleColumns.wing && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.wing}</TableCell>
                )}
                {visibleColumns.floor && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.floor}</TableCell>
                )}
                {visibleColumns.area && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.area}</TableCell>
                )}
                {visibleColumns.room && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.room}</TableCell>
                )}
                {visibleColumns.meterType && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.meterType}</TableCell>
                )}
                {visibleColumns.assetType && (
                  <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.assetType}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
