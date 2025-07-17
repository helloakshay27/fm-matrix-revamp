
import React from 'react';

interface AssetTableDisplayProps {
  selectedAssets: any[];
}

export const AssetTableDisplay: React.FC<AssetTableDisplayProps> = ({ selectedAssets }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
      'in_use': { bg: 'bg-green-100', text: 'text-green-800', label: 'In Use' },
      'in_storage': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Store' },
      'breakdown': { bg: 'bg-red-100', text: 'text-red-800', label: 'Breakdown' },
      'disposed': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Disposed' },
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (!selectedAssets || selectedAssets.length === 0) {
    return (
      <div className="mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">No assets selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1200px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Name</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Code</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Asset Status</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Site</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Building</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Wing</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Floor</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Area</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-700">Room</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {selectedAssets.map((asset, index) => (
                <tr key={asset.id || index} className="border-t border-gray-200">
                  <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">{asset.name || 'N/A'}</td>
                  <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">{asset.assetNumber || asset.id || 'N/A'}</td>
                  <td className="px-2 sm:px-3 py-2">
                    {getStatusBadge(asset.status || 'unknown')}
                  </td>
                  <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">{asset.siteName || 'N/A'}</td>
                  <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">{asset.building?.name || 'N/A'}</td>
                  <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">{asset.wing?.name || 'N/A'}</td>
                  <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">{asset.floor?.name || 'N/A'}</td>
                  <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">{asset.area?.name || 'N/A'}</td>
                  <td className="px-2 sm:px-3 py-2 text-xs text-gray-900">{asset.pmsRoom?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
