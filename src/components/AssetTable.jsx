
import React, { useState } from 'react';
import { Eye, Filter, Download, Plus, Import, RefreshCw, QrCode } from 'lucide-react';

const assets = [
  {
    id: 1,
    name: 'Wooden Pedastal',
    assetId: '261948',
    assetCode: 'e9d4bf0b9d8c61ea9bf5',
    assetNo: '6295',
    status: 'In Use',
    equipmentId: '',
    site: 'Aeromall, Vimaan Nagar',
    building: 'AeroMall',
    wing: '',
    floor: '3rd Floor',
    area: 'Main Door lift lobby area',
    room: '',
    meterType: '',
    assetType: ''
  },
  {
    id: 2,
    name: 'Small Peddle SS Dustbins',
    assetId: '261949',
    assetCode: 'caa9add5c10b44a96832',
    assetNo: '6296',
    status: 'In Use',
    equipmentId: '',
    site: 'Aeromall, Vimaan Nagar',
    building: 'AeroMall',
    wing: '',
    floor: '3rd Floor',
    area: 'Main Door lift lobby area',
    room: '',
    meterType: '',
    assetType: ''
  },
  {
    id: 3,
    name: 'Pedastal Fan',
    assetId: '261950',
    assetCode: '616973fcd9d821cecc3e',
    assetNo: '6297',
    status: 'In Use',
    equipmentId: '',
    site: 'Aeromall, Vimaan Nagar',
    building: 'AeroMall',
    wing: '',
    floor: '3rd Floor',
    area: 'Main Door lift lobby area',
    room: '',
    meterType: '',
    assetType: ''
  },
  {
    id: 4,
    name: 'Potted Planter (Only Pot)',
    assetId: '261951',
    assetCode: 'e89bb3a60f20b0f9cd29',
    assetNo: '6298',
    status: 'In Use',
    equipmentId: '',
    site: 'Aeromall, Vimaan Nagar',
    building: 'AeroMall',
    wing: '',
    floor: '3rd Floor',
    area: 'Main Door lift lobby area',
    room: '',
    meterType: '',
    assetType: ''
  }
];

export const AssetTable = ({ onAddAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId, checked) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, assetId]);
    } else {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#10B981] text-white">
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Action Buttons Row 1 */}
      <div className="p-6 border-b border-[#D5DbDB]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onAddAsset}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B5FBF] text-white rounded-lg hover:bg-[#8B5FBF]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5FBF] text-white rounded-lg hover:bg-[#8B5FBF]/90 transition-colors">
              <Import className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5FBF] text-white rounded-lg hover:bg-[#8B5FBF]/90 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Update
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5FBF] text-white rounded-lg hover:bg-[#8B5FBF]/90 transition-colors">
              <Download className="w-4 h-4" />
              Export All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5FBF] text-white rounded-lg hover:bg-[#8B5FBF]/90 transition-colors">
              <QrCode className="w-4 h-4" />
              Print QR
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5FBF] focus:border-transparent"
            />
            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#10B981]/90 transition-colors">
              Go!
            </button>
          </div>
        </div>
        
        {/* Action Buttons Row 2 */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#8B5FBF] text-white rounded-lg text-sm">
            In-Active Assets
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5FBF] text-white rounded-lg hover:bg-[#8B5FBF]/90 transition-colors text-sm">
            <QrCode className="w-4 h-4" />
            Print All QR
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5FBF] text-white rounded-lg hover:bg-[#8B5FBF]/90 transition-colors text-sm">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f8f9fa]">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedAssets.length === filteredAssets.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-[#D5DbDB] text-[#8B5FBF] focus:ring-[#8B5FBF]"
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
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-[#fafafa] transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset.id)}
                    onChange={(e) => handleSelectAsset(asset.id, e.target.checked)}
                    className="rounded border-[#D5DbDB] text-[#8B5FBF] focus:ring-[#8B5FBF]"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button className="text-[#1a1a1a] hover:text-[#8B5FBF] transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#1a1a1a]">
                  {asset.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.assetId}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a] font-mono">
                  {asset.assetCode}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.assetNo}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(asset.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.equipmentId}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.site}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.building}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.wing}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.floor}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.area}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.room}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.meterType}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">
                  {asset.assetType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
