
import React from 'react';

interface AssetTableDisplayProps {
  selectedAssets: any[];
}

export const AssetTableDisplay: React.FC<AssetTableDisplayProps> = ({ selectedAssets }) => {
  console.log(selectedAssets)
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
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Asset Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Asset Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Site</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Building</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Wing</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Floor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Area</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Room</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedAssets.map((asset, index) => (
                <tr key={asset.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{asset.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{asset.asset_number || asset.id || 'N/A'}</td>
                  <td className="px-4 py-3">
                    {getStatusBadge(asset.status || 'unknown')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{asset.siteName || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{asset.building?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{asset.wing?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{asset.floor?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{asset.area?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{asset.pmsRoom || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
