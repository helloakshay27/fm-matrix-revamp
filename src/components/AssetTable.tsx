
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AssetTable = () => {
  const navigate = useNavigate();

  const assetData = [
    {
      id: '202068',
      assetName: 'Generator',
      assetId: 'GEN001',
      assetCode: 'GEN001',
      assetNo: '001',
      assetStatus: 'In Use',
      equipmentId: 'EQ001',
      site: 'Main Site',
      building: 'Building A',
      wing: 'East Wing',
      floor: 'Ground Floor',
      area: 'Utility Area',
      room: 'Generator Room',
      meterType: 'Energy',
      assetType: 'Parent'
    },
    {
      id: '202069',
      assetName: 'Transformer',
      assetId: 'TRF001',
      assetCode: 'TRF001',
      assetNo: '002',
      assetStatus: 'In Use',
      equipmentId: 'EQ002',
      site: 'Main Site',
      building: 'Building A',
      wing: 'East Wing',
      floor: 'Ground Floor',
      area: 'Utility Area',
      room: 'Transformer Room',
      meterType: 'Energy',
      assetType: 'Parent'
    },
    {
      id: '202070',
      assetName: 'UPS System',
      assetId: 'UPS001',
      assetCode: 'UPS001',
      assetNo: '003',
      assetStatus: 'In Use',
      equipmentId: 'EQ003',
      site: 'Main Site',
      building: 'Building B',
      wing: 'West Wing',
      floor: 'First Floor',
      area: 'Server Room',
      room: 'UPS Room',
      meterType: 'Energy',
      assetType: 'Sub'
    },
    {
      id: '202071',
      assetName: 'Solar Panel',
      assetId: 'SOL001',
      assetCode: 'SOL001',
      assetNo: '004',
      assetStatus: 'In Use',
      equipmentId: 'EQ004',
      site: 'Main Site',
      building: 'Building C',
      wing: 'North Wing',
      floor: 'Rooftop',
      area: 'Solar Farm',
      room: 'Panel Area',
      meterType: 'Renewable',
      assetType: 'Parent'
    },
    {
      id: '202072',
      assetName: 'Emergency Generator',
      assetId: 'EGEN001',
      assetCode: 'EGEN001',
      assetNo: '005',
      assetStatus: 'Breakdown',
      equipmentId: 'EQ005',
      site: 'Main Site',
      building: 'Building A',
      wing: 'East Wing',
      floor: 'Basement',
      area: 'Emergency Area',
      room: 'Generator Room',
      meterType: 'Energy',
      assetType: 'Parent'
    }
  ];

  const handleViewDetails = (assetId: string) => {
    navigate(`/utility/energy/details/${assetId}`);
  };

  const handleEdit = (assetId: string) => {
    console.log('Edit asset:', assetId);
  };

  const handleDelete = (assetId: string) => {
    console.log('Delete asset:', assetId);
  };

  const handleDownload = (assetId: string) => {
    console.log('Download asset data:', assetId);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'In Use') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === 'Breakdown') {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Site
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Building
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Floor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meter Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assetData.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {asset.assetName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.assetId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.assetCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.assetNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(asset.assetStatus)}>
                    {asset.assetStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.equipmentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.site}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.building}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.wing}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.floor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.area}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.room}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.meterType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.assetType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDetails(asset.id)}
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(asset.id)}
                      className="text-green-600 hover:text-green-900 hover:bg-green-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(asset.id)}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(asset.id)}
                      className="text-purple-600 hover:text-purple-900 hover:bg-purple-50"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
