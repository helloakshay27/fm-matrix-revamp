
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Printer } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export const AssetAuditDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample audit details
  const auditDetails = {
    name: 'Name Latest',
    id: '10',
    status: 'Scheduled',
    createdBy: 'Abhishek Sharma',
    lastUpdated: 'Last updated by Abhishek Sharma on 6/21/2025, 6:55:43 PM',
    basicDetails: {
      startDate: '09/04/2025',
      endDate: '27/05/2025',
      site: 'Sai Radhe, Bund Garden',
      building: 'World Trade Centre T3',
      floor: 'N/A',
      wing: 'A Wing',
      assetGroup: 'Carpenting',
      subGroup: 'Furniture, Doors and Locks, Work station',
      department: 'N/A',
      conductedBy: 'Abhishek Sharma'
    }
  };

  const [filterWing, setFilterWing] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterFloor, setFilterFloor] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterAssetGroup, setFilterAssetGroup] = useState('');
  const [filterSubGroup, setFilterSubGroup] = useState('');

  // Sample assets data
  const assetsToScan = [
    {
      assetName: 'Office Work Table',
      serialNo: 'TBL-SN-123456',
      manufacturer: 'Godrej',
      group: 'Carpenting',
      subgroup: 'Furniture, Doors and Locks, Work station',
      site: 'Sai Radhe, Bund Garden',
      building: 'World Trade Centre T3',
      wing: 'A Wing',
      floor: 'Basement 3',
      department: 'department'
    },
    {
      assetName: 'Ergonomic Office Chair',
      serialNo: 'CHR-SN-654321',
      manufacturer: 'Godrej',
      group: 'Carpenting',
      subgroup: 'Furniture, Doors and Locks, Work station',
      site: 'Sai Radhe, Bund Garden',
      building: 'World Trade Centre T3',
      wing: 'A Wing',
      floor: 'Basement 3',
      department: 'department'
    }
  ];

  const scannedAssets = []; // No scanned assets available as per reference

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          Audit List &gt; Audit Details
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{auditDetails.name} ({auditDetails.id})</h1>
            <Badge className="bg-blue-500 text-white">
              {auditDetails.status} ▼
            </Badge>
          </div>
          <Button size="sm" variant="ghost">
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Created By {auditDetails.createdBy} | {auditDetails.lastUpdated}
        </p>

        {/* Basic Details Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</span>
              BASIC DETAILS
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="text-sm text-gray-600">Start Date</label>
                <p className="font-medium">{auditDetails.basicDetails.startDate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">End Date</label>
                <p className="font-medium">{auditDetails.basicDetails.endDate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Type</label>
                <p className="font-medium">N/A</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Wing</label>
                <p className="font-medium">{auditDetails.basicDetails.wing}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Site</label>
                <p className="font-medium">{auditDetails.basicDetails.site}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Building</label>
                <p className="font-medium">{auditDetails.basicDetails.building}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Floor</label>
                <p className="font-medium">{auditDetails.basicDetails.floor}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Department</label>
                <p className="font-medium">{auditDetails.basicDetails.department}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Asset Group</label>
                <p className="font-medium">{auditDetails.basicDetails.assetGroup}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Sub Group</label>
                <p className="font-medium">{auditDetails.basicDetails.subGroup}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Conducted By</label>
                <p className="font-medium">{auditDetails.basicDetails.conductedBy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* List of Assets Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</span>
              LIST OF ASSETS
            </h2>
          </div>
          <div className="p-6">
            {/* Filter Row */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Wing</label>
                <Select value={filterWing} onValueChange={setFilterWing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a-wing">A Wing</SelectItem>
                    <SelectItem value="b-wing">B Wing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Area</label>
                <Select value={filterArea} onValueChange={setFilterArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area1">Area 1</SelectItem>
                    <SelectItem value="area2">Area 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Floor</label>
                <Select value={filterFloor} onValueChange={setFilterFloor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basement">Basement 3</SelectItem>
                    <SelectItem value="ground">Ground Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Department</label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="facilities">Facilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Asset Group</label>
                <Select value={filterAssetGroup} onValueChange={setFilterAssetGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Asset Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carpenting">Carpenting</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Sub Group</label>
                <Select value={filterSubGroup} onValueChange={setFilterSubGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="doors">Doors and Locks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <Button 
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                size="sm"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print List
              </Button>
            </div>

            {/* Assets to be Scanned */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">List Of Assets To Be Scanned</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Asset Serial No</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Subgroup</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Wing</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetsToScan.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell>{asset.assetName}</TableCell>
                        <TableCell>{asset.serialNo}</TableCell>
                        <TableCell>{asset.manufacturer}</TableCell>
                        <TableCell>{asset.group}</TableCell>
                        <TableCell>{asset.subgroup}</TableCell>
                        <TableCell>{asset.site}</TableCell>
                        <TableCell>{asset.building}</TableCell>
                        <TableCell>{asset.wing}</TableCell>
                        <TableCell>{asset.floor}</TableCell>
                        <TableCell>{asset.department}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Total Scanned Assets */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Total Scanned Assets</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Asset Serial No</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Subgroup</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Wing</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scannedAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                          No assets available
                        </TableCell>
                      </TableRow>
                    ) : (
                      scannedAssets.map((asset, index) => (
                        <TableRow key={index}>
                          <TableCell>{asset.assetName}</TableCell>
                          <TableCell>{asset.serialNo}</TableCell>
                          <TableCell>{asset.manufacturer}</TableCell>
                          <TableCell>{asset.group}</TableCell>
                          <TableCell>{asset.subgroup}</TableCell>
                          <TableCell>{asset.site}</TableCell>
                          <TableCell>{asset.building}</TableCell>
                          <TableCell>{asset.wing}</TableCell>
                          <TableCell>{asset.floor}</TableCell>
                          <TableCell>{asset.department}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
