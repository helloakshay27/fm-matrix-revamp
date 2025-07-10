
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
  { id: 5, srNo: 5, groupName: 'ARS', status: true },
  { id: 6, srNo: 6, groupName: 'Technical services', status: true },
  { id: 7, srNo: 7, groupName: 'hvac', status: true },
  { id: 8, srNo: 8, groupName: 'CCTV Camera', status: true },
  { id: 9, srNo: 9, groupName: 'DVR', status: true },
  { id: 10, srNo: 10, groupName: 'Water Dispenser', status: false },
  { id: 11, srNo: 11, groupName: 'cd', status: false },
  { id: 12, srNo: 12, groupName: 'Electronics', status: true },
  { id: 13, srNo: 13, groupName: 'kitchen', status: false },
  { id: 14, srNo: 14, groupName: 'Daikin', status: true }
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
  { id: 14, srNo: 14, groupName: 'Electrical', subGroupName: 'Energy Meter', status: true }
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">Setup &gt; Groups</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">GROUPS</h1>
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
