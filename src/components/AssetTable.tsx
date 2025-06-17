
import React, { useState } from 'react';
import { Eye, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const AssetTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data matching the screenshot
  const assets = [
    {
      id: 1,
      assetName: 'sdcdsc',
      assetId: '203696',
      assetCode: '026dd95aa50e420318ea',
      assetNo: 'sdcdsc',
      status: 'In Use',
      equipmentId: '',
      site: 'Located',
      building: 'sebc',
      wing: '',
      floor: '',
      area: '',
      room: '',
      meterType: '',
      assetType: 'Comprehensive'
    },
    {
      id: 2,
      assetName: 'test',
      assetId: '203606',
      assetCode: 'e1a7f070ae8bd9933b',
      assetNo: '011312',
      status: 'In Use',
      equipmentId: 'n8368838',
      site: 'Located',
      building: 'Hay',
      wing: '',
      floor: '',
      area: '',
      room: '',
      meterType: '',
      assetType: ''
    },
    {
      id: 3,
      assetName: 'asus zenbook',
      assetId: '194409',
      assetCode: '9d21472ea4186068d7944',
      assetNo: '200200',
      status: 'Breakdown',
      equipmentId: '1345789397',
      site: 'Located',
      building: 'ktta',
      wing: '',
      floor: '',
      area: '',
      room: '',
      meterType: '',
      assetType: ''
    },
    {
      id: 4,
      assetName: 'Diesel Generator',
      assetId: '166641',
      assetCode: '19958688749Fee48c90',
      assetNo: 'DG/03',
      status: 'In Use',
      equipmentId: '',
      site: 'Located',
      building: 'demo',
      wing: '',
      floor: '',
      area: '',
      room: '',
      meterType: 'Parent Meter',
      assetType: ''
    },
    {
      id: 5,
      assetName: 'A.c',
      assetId: '168838',
      assetCode: '4aa21058634cafa6408',
      assetNo: '15326',
      status: 'In Use',
      equipmentId: 'sdfghdfghdrghrrdhgtu',
      site: 'Located',
      building: 'demo',
      wing: '',
      floor: '',
      area: '',
      room: '',
      meterType: 'Parent Meter',
      assetType: ''
    },
    {
      id: 6,
      assetName: 'A.c',
      assetId: '144714',
      assetCode: '29db16e7532558e7d568',
      assetNo: '123456',
      status: 'In Use',
      equipmentId: '',
      site: 'Located',
      building: 'jyoti tower',
      wing: '',
      floor: '',
      area: '',
      room: '',
      meterType: 'Parent Meter',
      assetType: 'Comprehensive'
    },
    {
      id: 7,
      assetName: 'Energy Meter 23',
      assetId: '53815',
      assetCode: '0585526992561630f6c1',
      assetNo: 'EM-23',
      status: 'In Use',
      equipmentId: '',
      site: 'Located',
      building: 'jyoti',
      wing: '',
      floor: '',
      area: '',
      room: '',
      meterType: 'Parent Meter',
      assetType: ''
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'In Use') {
      return <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">{status}</span>;
    } else if (status === 'Breakdown') {
      return <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">{status}</span>;
    }
    return <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">{status}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#D5DbDB]">
      {/* Search Section */}
      <div className="p-4 border-b border-[#D5DbDB] flex justify-end">
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Go!
          </Button>
        </div>
      </div>

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
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-[#D5DbDB] text-[#C72030] focus:ring-[#C72030]"
                  />
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.assetName}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a]">{asset.assetId}</td>
                <td className="px-4 py-3 text-sm text-[#1a1a1a] font-mono text-xs">{asset.assetCode}</td>
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
    </div>
  );
};
