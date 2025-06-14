
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AddChecklistGroupDialog } from '@/components/AddChecklistGroupDialog';
import { AddChecklistSubGroupDialog } from '@/components/AddChecklistSubGroupDialog';
import { ChecklistBulkUploadModal } from '@/components/ChecklistBulkUploadModal';

const groupsData = [
  { id: 1, srNo: 1, groupName: 'Washroom', status: true },
  { id: 2, srNo: 2, groupName: 'reading', status: true },
  { id: 3, srNo: 3, groupName: 'Daily Substation Log', status: true },
  { id: 4, srNo: 4, groupName: 'Kitchen', status: true },
  { id: 5, srNo: 5, groupName: 'Kitchen equipment', status: true },
  { id: 6, srNo: 6, groupName: 'Men washroom', status: true },
  { id: 7, srNo: 7, groupName: 'Hall', status: true },
  { id: 8, srNo: 8, groupName: 'Common Area', status: true },
  { id: 9, srNo: 9, groupName: 'server room', status: true },
  { id: 10, srNo: 10, groupName: 'Reception', status: true },
  { id: 11, srNo: 11, groupName: 'Room', status: true },
  { id: 12, srNo: 12, groupName: 'DG 1', status: true },
  { id: 13, srNo: 13, groupName: 'DG 2', status: true },
  { id: 14, srNo: 14, groupName: 'BB Washroom', status: true },
  { id: 15, srNo: 15, groupName: '1 "S" Sorting', status: true },
  { id: 16, srNo: 16, groupName: 'Equipment Health Status', status: true },
  { id: 17, srNo: 17, groupName: 'Site Performance', status: true },
  { id: 18, srNo: 18, groupName: 'Invoice management', status: true },
  { id: 19, srNo: 19, groupName: 'Innovation', status: true },
  { id: 20, srNo: 20, groupName: 'Reporting', status: true },
  { id: 21, srNo: 21, groupName: 'Management Leadership', status: true },
  { id: 22, srNo: 22, groupName: 'Others', status: true }
];

const subGroupsData = [
  { id: 1, srNo: 1, groupName: 'Washroom', subGroupName: 'Gents Washroom', status: true },
  { id: 2, srNo: 2, groupName: 'Washroom', subGroupName: 'Ladies Washroom', status: true },
  { id: 3, srNo: 3, groupName: 'reading', subGroupName: 'C-Block MLT Log', status: true },
  { id: 4, srNo: 4, groupName: 'Daily Substation Log', subGroupName: 'B-Block MLT', status: true },
  { id: 5, srNo: 5, groupName: 'Daily Substation Log', subGroupName: 'U-Block MLT-1', status: true },
  { id: 6, srNo: 6, groupName: 'Daily Substation Log', subGroupName: 'U-Block MLT-2', status: true },
  { id: 7, srNo: 7, groupName: 'Kitchen', subGroupName: 'A Block', status: true },
  { id: 8, srNo: 8, groupName: 'Kitchen', subGroupName: 'platform cleaning', status: true },
  { id: 9, srNo: 9, groupName: 'Kitchen equipment', subGroupName: 'Raw water pump', status: true },
  { id: 10, srNo: 10, groupName: 'Men washroom', subGroupName: 'Cleaning', status: true },
  { id: 11, srNo: 11, groupName: 'Men washroom', subGroupName: 'Dusting', status: true },
  { id: 12, srNo: 12, groupName: 'Hall', subGroupName: 'auditorium', status: true },
  { id: 13, srNo: 13, groupName: 'Common Area', subGroupName: 'Floor cleaning', status: true },
  { id: 14, srNo: 14, groupName: 'server room', subGroupName: 'b block svr', status: true },
  { id: 15, srNo: 15, groupName: 'Reception', subGroupName: 'Maintenance', status: true },
  { id: 16, srNo: 16, groupName: 'Room', subGroupName: 'Server Room', status: true },
  { id: 17, srNo: 17, groupName: 'DG 1', subGroupName: 'Battery No 1', status: true },
  { id: 18, srNo: 18, groupName: 'DG 1', subGroupName: 'Battery No 2', status: true },
  { id: 19, srNo: 19, groupName: 'DG 2', subGroupName: 'Battery No 3', status: true },
  { id: 20, srNo: 20, groupName: 'DG 2', subGroupName: 'Battery No 4', status: true },
  { id: 21, srNo: 21, groupName: 'BB Washroom', subGroupName: 'Ladies', status: true },
  { id: 22, srNo: 22, groupName: 'BB Washroom', subGroupName: 'Gents', status: true }
];

export const ChecklistGroupDashboard = () => {
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
    <SetupLayout>
      <div className="space-y-6">
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

      <AddChecklistGroupDialog 
        open={addGroupDialogOpen} 
        onOpenChange={setAddGroupDialogOpen} 
      />
      
      <AddChecklistSubGroupDialog 
        open={addSubGroupDialogOpen} 
        onOpenChange={setAddSubGroupDialogOpen} 
      />
      
      <ChecklistBulkUploadModal 
        isOpen={bulkUploadModalOpen} 
        onClose={() => setBulkUploadModalOpen(false)} 
      />
    </SetupLayout>
  );
};
