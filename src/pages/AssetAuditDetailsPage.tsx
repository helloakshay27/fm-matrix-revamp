
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Printer } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AssetAuditDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample audit details
  const [auditDetails, setAuditDetails] = useState({
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
  });

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

  const scannedAssets = [];

  const handleStatusChange = (newStatus: string) => {
    setAuditDetails(prev => ({ ...prev, status: newStatus }));
    toast.success(`Audit status updated to ${newStatus}`);
  };

  const handleEditClick = () => {
    navigate(`/maintenance/audit/assets/edit/${id}`);
  };

  const handlePrintList = () => {
    const printContent = `
      <html>
        <head>
          <title>Asset Audit List - ${auditDetails.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Asset Audit List</h1>
            <p><strong>Audit Name:</strong> ${auditDetails.name} (${auditDetails.id})</p>
            <p><strong>Status:</strong> ${auditDetails.status}</p>
            <p><strong>Created By:</strong> ${auditDetails.createdBy}</p>
            <p><strong>Date Range:</strong> ${auditDetails.basicDetails.startDate} - ${auditDetails.basicDetails.endDate}</p>
            <p><strong>Site:</strong> ${auditDetails.basicDetails.site}</p>
            <p><strong>Building:</strong> ${auditDetails.basicDetails.building}</p>
          </div>
          <h2>Assets to be Scanned</h2>
          <table>
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Asset Serial No</th>
                <th>Manufacturer</th>
                <th>Group</th>
                <th>Subgroup</th>
                <th>Site</th>
                <th>Building</th>
                <th>Wing</th>
                <th>Floor</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              ${assetsToScan.map(asset => `
                <tr>
                  <td>${asset.assetName}</td>
                  <td>${asset.serialNo}</td>
                  <td>${asset.manufacturer}</td>
                  <td>${asset.group}</td>
                  <td>${asset.subgroup}</td>
                  <td>${asset.site}</td>
                  <td>${asset.building}</td>
                  <td>${asset.wing}</td>
                  <td>${asset.floor}</td>
                  <td>${asset.department}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success('Print dialog opened');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-500';
      case 'In Progress': return 'bg-orange-500';
      case 'Completed': return 'bg-green-500';
      case 'Overdue': return 'bg-red-500';
      case 'Closed': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

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
            <Select value={auditDetails.status} onValueChange={handleStatusChange}>
              <SelectTrigger className={`w-40 text-white ${getStatusColor(auditDetails.status)}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" variant="ghost" onClick={handleEditClick}>
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
                onClick={handlePrintList}
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
