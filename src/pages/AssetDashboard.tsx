
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Download, FileText, Search, Filter, Eye } from 'lucide-react';

const assetData = [
  {
    id: '203696',
    name: 'sdcsdc',
    code: '026d4956a50be20318za',
    assetNo: 'sdcsdc',
    status: 'In Use',
    equipmentId: '',
    site: 'Loccated',
    building: 'sebc',
    wing: '',
    floor: '',
    area: '',
    room: '',
    meterType: '',
    assetType: 'Comprehensive'
  },
  {
    id: '203694',
    name: 'Test History',
    code: '5e298bffcab011bb6e16',
    assetNo: 'f3212',
    status: 'Breakdown',
    equipmentId: 'r34f6S',
    site: 'Loccated',
    building: 'jyoti tower',
    wing: '',
    floor: '',
    area: '',
    room: '',
    meterType: '',
    assetType: 'Parent Meter'
  },
  // Add more sample data as needed
];

export const AssetDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState(assetData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = assetData.filter(asset =>
        asset.name.toLowerCase().includes(value.toLowerCase()) ||
        asset.code.toLowerCase().includes(value.toLowerCase()) ||
        asset.assetNo.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assetData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Use':
        return 'bg-green-500 text-white';
      case 'Breakdown':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Assets &gt; Asset List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ASSET LIST</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-orange-500 text-white p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">315</span>
            </div>
            <span className="font-medium">Total Asset</span>
          </div>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">298</span>
            </div>
            <span className="font-medium">In Use</span>
          </div>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">27</span>
            </div>
            <span className="font-medium">Breakdown</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Download className="w-4 h-4 mr-2" />
          Update
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <FileText className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          In Active Assets
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <FileText className="w-4 h-4 mr-2" />
          Print All QR
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <div className="ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" />
              </TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Asset Name</TableHead>
              <TableHead>Asset ID</TableHead>
              <TableHead>Asset Code</TableHead>
              <TableHead>Asset No.</TableHead>
              <TableHead>Asset Status</TableHead>
              <TableHead>Equipment Id</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Meter Type</TableHead>
              <TableHead>Asset Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <input type="checkbox" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.id}</TableCell>
                <TableCell>{asset.code}</TableCell>
                <TableCell>{asset.assetNo}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
          <Button
            key={page}
            variant={page === 1 ? "default" : "outline"}
            size="sm"
            style={page === 1 ? { backgroundColor: '#C72030' } : {}}
            className={page === 1 ? "text-white" : ""}
          >
            {page}
          </Button>
        ))}
        <Button variant="outline" size="sm">Last »</Button>
      </div>
    </div>
  );
};
