
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QrCode, Edit, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AssetTable = () => {
  const navigate = useNavigate();

  const assets = [
    {
      id: 'GEN001',
      name: 'Generator',
      assetId: 'GEN001',
      assetCode: 'GEN001',
      assetNo: '001',
      status: 'In Use',
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
      id: 'TRF001',
      name: 'Transformer',
      assetId: 'TRF001',
      assetCode: 'TRF001',
      assetNo: '002',
      status: 'In Use',
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
      id: 'UPS001',
      name: 'UPS System',
      assetId: 'UPS001',
      assetCode: 'UPS001',
      assetNo: '003',
      status: 'In Use',
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
      id: 'SOL001',
      name: 'Solar Panel',
      assetId: 'SOL001',
      assetCode: 'SOL001',
      assetNo: '004',
      status: 'In Use',
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
      id: 'EGEN001',
      name: 'Emergency Generator',
      assetId: 'EGEN001',
      assetCode: 'EGEN001',
      assetNo: '005',
      status: 'Breakdown',
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

  const handleView = (assetId: string) => {
    navigate(`/utility/energy/details/${assetId}`);
  };

  const handleEdit = (assetId: string) => {
    console.log('Edit asset:', assetId);
  };

  const handleQRCode = (assetId: string) => {
    console.log('QR Code for asset:', assetId);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Asset Name</TableHead>
            <TableHead className="font-semibold">Asset ID</TableHead>
            <TableHead className="font-semibold">Asset Code</TableHead>
            <TableHead className="font-semibold">Asset No.</TableHead>
            <TableHead className="font-semibold">Asset Status</TableHead>
            <TableHead className="font-semibold">Equipment Id</TableHead>
            <TableHead className="font-semibold">Site</TableHead>
            <TableHead className="font-semibold">Building</TableHead>
            <TableHead className="font-semibold">Wing</TableHead>
            <TableHead className="font-semibold">Floor</TableHead>
            <TableHead className="font-semibold">Area</TableHead>
            <TableHead className="font-semibold">Room</TableHead>
            <TableHead className="font-semibold">Meter Type</TableHead>
            <TableHead className="font-semibold">Asset Type</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="text-blue-600 cursor-pointer hover:underline">
                {asset.name}
              </TableCell>
              <TableCell>{asset.assetId}</TableCell>
              <TableCell>{asset.assetCode}</TableCell>
              <TableCell>{asset.assetNo}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs ${
                  asset.status === 'In Use' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {asset.status}
                </span>
              </TableCell>
              <TableCell>{asset.equipmentId}</TableCell>
              <TableCell>{asset.site}</TableCell>
              <TableCell>{asset.building}</TableCell>
              <TableCell>{asset.wing}</TableCell>
              <TableCell>{asset.floor}</TableCell>
              <TableCell>{asset.area}</TableCell>
              <TableCell>{asset.room}</TableCell>
              <TableCell>{asset.meterType}</TableCell>
              <TableCell>{asset.assetType}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(asset.id)}
                    className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(asset.id)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQRCode(asset.id)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
