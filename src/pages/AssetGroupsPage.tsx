
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AddGroupDialog } from '@/components/AddGroupDialog';
import { AddSubGroupDialog } from '@/components/AddSubGroupDialog';
import { BulkUploadModal } from '@/components/BulkUploadModal';

const groupsData = [
  { id: 1, srNo: 1, groupName: 'Electronic Devices', status: true },
  { id: 2, srNo: 2, groupName: 'Electrical', status: true },
  { id: 3, srNo: 3, groupName: 'Non Electrical', status: true },
  { id: 4, srNo: 4, groupName: 'Stand', status: true },
  { id: 5, srNo: 5, groupName: 'APS', status: true },
  { id: 6, srNo: 6, groupName: 'Technical services', status: true },
  { id: 7, srNo: 7, groupName: 'hvac', status: true },
  { id: 8, srNo: 8, groupName: 'CCTV Camera', status: true },
  { id: 9, srNo: 9, groupName: 'DVR', status: true },
  { id: 10, srNo: 10, groupName: 'Water Dispenser', status: false },
  { id: 11, srNo: 11, groupName: 'cd', status: false },
  { id: 12, srNo: 12, groupName: 'Electronics', status: true },
  { id: 13, srNo: 13, groupName: 'kitchen', status: true },
  { id: 14, srNo: 14, groupName: 'Daikin', status: true },
  { id: 15, srNo: 15, groupName: 'Camera', status: true },
  { id: 16, srNo: 16, groupName: 'Carpenting', status: true },
  { id: 17, srNo: 17, groupName: 'CASCOU', status: true },
  { id: 18, srNo: 18, groupName: 'WESCA', status: true },
  { id: 19, srNo: 19, groupName: 'FAN', status: true },
  { id: 20, srNo: 20, groupName: 'CCTV', status: true },
  { id: 21, srNo: 21, groupName: 'HVAC', status: true },
  { id: 22, srNo: 22, groupName: 'Carcon', status: true },
  { id: 23, srNo: 23, groupName: 'SECSAF', status: true },
  { id: 24, srNo: 24, groupName: 'CUSCHA', status: true },
  { id: 25, srNo: 25, groupName: 'SMODET', status: true },
  { id: 26, srNo: 26, groupName: 'Alarm', status: true },
  { id: 27, srNo: 27, groupName: 'DG', status: true },
  { id: 28, srNo: 28, groupName: 'Nikon', status: true },
  { id: 29, srNo: 29, groupName: 'BB Electrical', status: true },
  { id: 30, srNo: 30, groupName: 'Plumbing', status: true },
  { id: 31, srNo: 31, groupName: 'Water Meter', status: true },
  { id: 32, srNo: 32, groupName: 'IT Assets', status: true },
  { id: 33, srNo: 33, groupName: 'laptop', status: true }
];

const subGroupsData = [
  { id: 1, srNo: 1, groupName: 'Electronic Devices', subGroupName: 'Laptops', status: true },
  { id: 2, srNo: 2, groupName: 'Electronic Devices', subGroupName: 'Tabs', status: true },
  { id: 3, srNo: 3, groupName: 'Electronic Devices', subGroupName: 'Mobiles', status: true },
  { id: 4, srNo: 4, groupName: 'Electronic Devices', subGroupName: 'AI Device', status: true },
  { id: 5, srNo: 5, groupName: 'Electronic Devices', subGroupName: 'Sim Card', status: true },
  { id: 6, srNo: 6, groupName: 'Electronic Devices', subGroupName: 'Charger', status: true },
  { id: 7, srNo: 7, groupName: 'Electronic Devices', subGroupName: 'Mouse', status: true },
  { id: 8, srNo: 8, groupName: 'Electronic Devices', subGroupName: 'External Hard Disk', status: true },
  { id: 9, srNo: 9, groupName: 'Electronic Devices', subGroupName: 'Macbook', status: true },
  { id: 10, srNo: 10, groupName: 'Electronic Devices', subGroupName: 'Temperature Scanning Device', status: true },
  { id: 11, srNo: 11, groupName: 'Electronic Devices', subGroupName: 'ipad', status: true },
  { id: 12, srNo: 12, groupName: 'Electrical', subGroupName: 'Electric Meter', status: true },
  { id: 13, srNo: 13, groupName: 'Electrical', subGroupName: 'Air Conditioner', status: true },
  { id: 14, srNo: 14, groupName: 'Electrical', subGroupName: 'Energy Meter', status: true },
  { id: 15, srNo: 15, groupName: 'Electrical', subGroupName: 'Diesel Generator', status: true },
  { id: 16, srNo: 16, groupName: 'Electrical', subGroupName: 'AC, AV, Electrical', status: true },
  { id: 17, srNo: 17, groupName: 'Non Electrical', subGroupName: 'Non Electrical', status: true },
  { id: 18, srNo: 18, groupName: 'Stand', subGroupName: 'Precision Metal Works', status: true },
  { id: 19, srNo: 19, groupName: 'APS', subGroupName: 'BRS', status: true },
  { id: 20, srNo: 20, groupName: 'hvac', subGroupName: 'Cassette Unit', status: true },
  { id: 21, srNo: 21, groupName: 'hvac', subGroupName: 'high wall', status: true },
  { id: 22, srNo: 22, groupName: 'CCTV Camera', subGroupName: 'CCTV Camera', status: true },
  { id: 23, srNo: 23, groupName: 'DVR', subGroupName: 'DVR', status: true },
  { id: 24, srNo: 24, groupName: 'Water Dispenser', subGroupName: 'Water Dispenser', status: false },
  { id: 25, srNo: 25, groupName: 'cd', subGroupName: 'compact', status: false },
  { id: 26, srNo: 26, groupName: 'Electronics', subGroupName: 'Motherboard', status: true },
  { id: 27, srNo: 27, groupName: 'kitchen', subGroupName: 'oven', status: true },
  { id: 28, srNo: 28, groupName: 'Daikin', subGroupName: 'Daikin AC', status: true },
  { id: 29, srNo: 29, groupName: 'Camera', subGroupName: 'cctv camera', status: true },
  { id: 30, srNo: 30, groupName: 'Carpenting', subGroupName: 'Furniture, Doors and Locks, Work station', status: false },
  { id: 31, srNo: 31, groupName: 'CASCOU', subGroupName: 'Cash Counting Machine', status: true },
  { id: 32, srNo: 32, groupName: 'CASCOU', subGroupName: 'Cash Counting Machine', status: true },
  { id: 33, srNo: 33, groupName: 'WESCA', subGroupName: 'Weighing Scale', status: true },
  { id: 34, srNo: 34, groupName: 'FAN', subGroupName: 'Oryantal High Speed', status: true },
  { id: 35, srNo: 35, groupName: 'CCTV', subGroupName: 'CCTV Camera Bullet', status: true },
  { id: 36, srNo: 36, groupName: 'CCTV', subGroupName: 'CCTV Camera', status: true },
  { id: 37, srNo: 37, groupName: 'HVAC', subGroupName: 'HVAC high Wall', status: true },
  { id: 38, srNo: 38, groupName: 'SECSAF', subGroupName: 'Security Safe', status: true },
  { id: 39, srNo: 39, groupName: 'CUSCHA', subGroupName: 'Cashier Chair', status: true },
  { id: 40, srNo: 40, groupName: 'SMODET', subGroupName: 'Smoke Detector', status: true },
  { id: 41, srNo: 41, groupName: 'Alarm', subGroupName: 'Fire Alarm', status: true },
  { id: 42, srNo: 42, groupName: 'DG', subGroupName: 'Diesel Generator', status: true },
  { id: 43, srNo: 43, groupName: 'Nikon', subGroupName: 'DSLR', status: true },
  { id: 44, srNo: 44, groupName: 'BB Electrical', subGroupName: 'UPS', status: true },
  { id: 45, srNo: 45, groupName: 'BB Electrical', subGroupName: 'DG', status: true },
  { id: 46, srNo: 46, groupName: 'BB Electrical', subGroupName: 'Lighting', status: true },
  { id: 47, srNo: 47, groupName: 'Plumbing', subGroupName: 'FWTS', status: true },
  { id: 48, srNo: 48, groupName: 'Water Meter', subGroupName: 'Water Meter', status: true },
  { id: 49, srNo: 49, groupName: 'IT Assets', subGroupName: 'Laptops', status: true }
];

export const AssetGroupsPage = () => {
  const [groups, setGroups] = useState(groupsData);
  const [subGroups, setSubGroups] = useState(subGroupsData);
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
  const [addSubGroupDialogOpen, setAddSubGroupDialogOpen] = useState(false);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);

  const toggleGroupStatus = (id: number) => {
    setGroups(prev => prev.map(group => 
      group.id === id ? { ...group, status: !group.status } : group
    ));
  };

  const toggleSubGroupStatus = (id: number) => {
    setSubGroups(prev => prev.map(subGroup => 
      subGroup.id === id ? { ...subGroup, status: !subGroup.status } : subGroup
    ));
  };

  return (
    <div className="min-h-screen bg-[#f6f4ee] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">GROUPS</h1>
            <p className="text-sm text-gray-600 mt-1">Setup &gt; Groups</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button 
            className="bg-purple-700 hover:bg-purple-800 text-white"
            onClick={() => setAddGroupDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Group
          </Button>
          <Button 
            className="bg-purple-700 hover:bg-purple-800 text-white"
            onClick={() => setAddSubGroupDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subgroup
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-700 text-purple-700 hover:bg-purple-50"
            onClick={() => setBulkUploadModalOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Groups Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Groups</h2>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-center">Sr.No</TableHead>
                    <TableHead>Group Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow key={group.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{group.srNo}</TableCell>
                      <TableCell>{group.groupName}</TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={group.status} 
                          onCheckedChange={() => toggleGroupStatus(group.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Sub Groups Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Sub Groups</h2>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-center">Sr.No</TableHead>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Sub Group Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subGroups.map((subGroup) => (
                    <TableRow key={subGroup.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{subGroup.srNo}</TableCell>
                      <TableCell>{subGroup.groupName}</TableCell>
                      <TableCell>{subGroup.subGroupName}</TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={subGroup.status} 
                          onCheckedChange={() => toggleSubGroupStatus(subGroup.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <AddGroupDialog 
        open={addGroupDialogOpen} 
        onOpenChange={setAddGroupDialogOpen} 
      />
      
      <AddSubGroupDialog 
        open={addSubGroupDialogOpen} 
        onOpenChange={setAddSubGroupDialogOpen} 
      />
      
      <BulkUploadModal 
        isOpen={bulkUploadModalOpen} 
        onClose={() => setBulkUploadModalOpen(false)} 
      />
    </div>
  );
};
