
import React, { useState } from 'react';
import { Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EditStatusModal } from '@/components/EditStatusModal';

interface WaterAssetTableProps {
  searchTerm?: string;
}

export const WaterAssetTable = ({ searchTerm = '' }: WaterAssetTableProps) => {
  const navigate = useNavigate();
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  // Water assets data matching the images
  const allWaterAssets = [
    {
      id: 1,
      assetName: 'Borewell',
      assetId: '53619',
      assetCode: '83898732f107c5df0121',
      assetNo: '505',
      status: 'In Use',
      equipmentId: '',
      site: 'Located Site 1',
      building: 'Sarova',
      wing: 'SW1',
      floor: 'FW1',
      area: 'AW1',
      room: '',
      meterType: 'Sub Meter',
      assetType: 'Comprehensive'
    },
    {
      id: 2,
      assetName: 'Tanker',
      assetId: '53615',
      assetCode: 'c302fd076e1a78a9116',
      assetNo: '502',
      status: 'In Use',
      equipmentId: '',
      site: 'Located Site 1',
      building: 'Twin Tower',
      wing: '',
      floor: '',
      area: '',
      room: '',
      meterType: 'Sub Meter',
      assetType: 'Non-Comprehensive'
    }
  ];

  // Filter water assets based on search term
  const filteredWaterAssets = allWaterAssets.filter(asset =>
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.equipmentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'In Use') {
      return <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">{status}</span>;
    } else if (status === 'Breakdown') {
      return <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">{status}</span>;
    }
    return <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">{status}</span>;
  };

  const handleViewAsset = (assetId: string) => {
    navigate(`/maintenance/asset/details/${assetId}`);
  };

  const handleEditClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    setIsEditStatusOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D5DbDB]">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f6f4ee]">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-[#D5DbDB] text-[#C72030] focus:ring-[#C72030]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Actions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Equipment Id
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Site
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Building
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Wing
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Floor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Area
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Room
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Meter Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#D5DbDB]">
            {filteredWaterAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-[#D5DbDB] text-[#C72030] focus:ring-[#C72030]"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAsset(asset.assetId)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(asset.assetId)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.assetName}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.assetId}</td>
                <td className="px-4 py-3 text-xs text-[#1a1a1a] font-mono">{asset.assetCode}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.assetNo}</td>
                <td className="px-4 py-3">{getStatusBadge(asset.status)}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.equipmentId}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.site}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.building}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.wing}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.floor}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.area}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.room}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.meterType}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.assetType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show message when no assets found */}
      {filteredWaterAssets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No water assets found matching your search.</p>
        </div>
      )}

      {/* Edit Status Modal */}
      <EditStatusModal
        isOpen={isEditStatusOpen}
        onClose={() => setIsEditStatusOpen(false)}
      />
    </div>
  );
};
