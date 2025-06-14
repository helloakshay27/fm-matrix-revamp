
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload } from 'lucide-react';

const groups = [
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
  { id: 13, srNo: 13, groupName: 'kitchen', status: true },
  { id: 14, srNo: 14, groupName: 'Daikin', status: true },
  { id: 15, srNo: 15, groupName: 'Camera', status: true },
  { id: 16, srNo: 16, groupName: 'Carpenting', status: true },
  { id: 17, srNo: 17, groupName: 'CASCOU', status: true }
];

const subGroups = [
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
  { id: 17, srNo: 17, groupName: 'Non Electrical', subGroupName: 'Non Electrical', status: true }
];

export const AssetGroupsDashboard = () => {
  const [groupsData, setGroupsData] = useState(groups);
  const [subGroupsData, setSubGroupsData] = useState(subGroups);

  const toggleGroupStatus = (id: number) => {
    setGroupsData(prev => prev.map(group => 
      group.id === id ? { ...group, status: !group.status } : group
    ));
  };

  const toggleSubGroupStatus = (id: number) => {
    setSubGroupsData(prev => prev.map(subGroup => 
      subGroup.id === id ? { ...subGroup, status: !subGroup.status } : subGroup
    ));
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Asset Groups</h1>
            <p className="text-sm text-gray-600 mt-1">Setup &gt; Groups</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Group
          </Button>
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Subgroup
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Groups Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Groups</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-center">Sr.No</TableHead>
                    <TableHead>Group Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupsData.map((group) => (
                    <TableRow key={group.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-medium">{group.srNo}</TableCell>
                      <TableCell className="font-medium">{group.groupName}</TableCell>
                      <TableCell className="text-center">
                        <div 
                          className={`w-8 h-5 rounded-full flex items-center cursor-pointer mx-auto ${group.status ? 'bg-green-500' : 'bg-gray-300'}`}
                          onClick={() => toggleGroupStatus(group.id)}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${group.status ? 'translate-x-3' : 'translate-x-0.5'}`} />
                        </div>
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
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Sub Groups</h3>
            </div>
            <div className="overflow-x-auto">
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
                  {subGroupsData.map((subGroup) => (
                    <TableRow key={subGroup.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-medium">{subGroup.srNo}</TableCell>
                      <TableCell className="font-medium">{subGroup.groupName}</TableCell>
                      <TableCell className="font-medium">{subGroup.subGroupName}</TableCell>
                      <TableCell className="text-center">
                        <div 
                          className={`w-8 h-5 rounded-full flex items-center cursor-pointer mx-auto ${subGroup.status ? 'bg-green-500' : 'bg-gray-300'}`}
                          onClick={() => toggleSubGroupStatus(subGroup.id)}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${subGroup.status ? 'translate-x-3' : 'translate-x-0.5'}`} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </SetupLayout>
  );
};
