import React, { useState } from 'react';
import { Eye, Filter, Download, Printer, Plus, Import, RefreshCw, QrCode } from 'lucide-react';
import { BulkUploadModal } from './BulkUploadModal';

const assets = [
  {
    id: 1,
    name: 'DIESEL GENERATOR',
    assetId: '202068',
    assetCode: 'a85ae876f09cde4b4afb',
    assetNo: '246810',
    status: 'In Use',
    equipmentId: '123456',
    site: 'Lockastead Site 1',
    building: 'Tower 101',
    wing: 'A Wing',
    floor: '',
    area: 'Common',
    room: '',
    metType: 'Parent Met'
  },
  {
    id: 2,
    name: 'ATM Machine',
    assetId: '189276',
    assetCode: 'dba021f682de025f8983',
    assetNo: 'ATM/001',
    status: 'In Use',
    equipmentId: '123123',
    site: 'Lockastead Site 1',
    building: 'HDFC Ergo Bhandup',
    wing: '',
    floor: '',
    area: '',
    room: '',
    metType: ''
  },
  {
    id: 3,
    name: 'Diesel Generator 1',
    assetId: '189051',
    assetCode: '17cf183e06c836a66dde',
    assetNo: '009',
    status: 'In Use',
    equipmentId: '0009',
    site: 'Lockastead Site 1',
    building: 'HDFC Ergo Bhandup',
    wing: '',
    floor: 'Floor 1',
    area: 'Area 1',
    room: 'test room',
    metType: ''
  },
  {
    id: 4,
    name: 'DG L1',
    assetId: '189050',
    assetCode: '098767ed6769eefbd53c',
    assetNo: 'FUU',
    status: 'Breakdown',
    equipmentId: '',
    site: 'Lockastead Site 1',
    building: 'HDFC Ergo Bhandup',
    wing: 'Wing 1',
    floor: 'Floor 1',
    area: '',
    room: '',
    metType: 'Parent Met'
  },
  {
    id: 5,
    name: 'DG L1',
    assetId: '189049',
    assetCode: '32a07ca3409294a4ba77',
    assetNo: 'FUU',
    status: 'In Use',
    equipmentId: '',
    site: 'Lockastead Site 1',
    building: 'HDFC Ergo Bhandup',
    wing: 'Wing 1',
    floor: 'Floor 1',
    area: 'Area 1',
    room: 'Room 1',
    metType: 'Parent Met'
  }
];

interface AssetTableProps {
  onAddAsset: () => void;
}

export const AssetTable = ({ onAddAsset }: AssetTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId: number, checked: boolean) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, assetId]);
    } else {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Use':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#A4F4E7] text-[#1a1a1a]">
            In Use
          </span>
        );
      case 'Breakdown':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E4626F] text-white">
            Breakdown
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#C4b89D] text-[#1a1a1a]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D5DbDB]">
      {/* Table Header Actions */}
      <div className="p-6 border-b border-[#D5DbDB]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onAddAsset}
              className="flex items-center gap-2 px-4 py-2 bg-[#C72030] text-white rounded-lg hover:bg-[#C72030]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <button 
              onClick={() => setIsBulkUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors"
            >
              <Import className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
              <RefreshCw className="w-4 h-4" />
              Update
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
              <Download className="w-4 h-4" />
              Export All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
              <QrCode className="w-4 h-4" />
              Print QR
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-[#C72030] text-white rounded-lg hover:bg-[#C72030]/90 transition-colors">
              Go!
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#C72030] text-white rounded-lg text-sm">
            In-Active Assets
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors text-sm">
            <QrCode className="w-4 h-4" />
            Print All QR
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors text-sm">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f6f4ee]">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedAssets.length === filteredAssets.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-[#D5DbDB] text-[#C72030] focus:ring-[#C72030]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Asset Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Equipment Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Site
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Building
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Wing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Floor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">
                Met Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#D5DbDB]">
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-[#fafafa] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset.id)}
                    onChange={(e) => handleSelectAsset(asset.id, e.target.checked)}
                    className="rounded border-[#D5DbDB] text-[#C72030] focus:ring-[#C72030]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-[#1a1a1a] hover:text-[#C72030] transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1a1a1a]">
                  {asset.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.assetId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a] font-mono">
                  {asset.assetCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.assetNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(asset.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.equipmentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.site}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.building}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.wing}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.floor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.area}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.room}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.metType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Upload Modal */}
      <BulkUploadModal 
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
      />
    </div>
  );
};
