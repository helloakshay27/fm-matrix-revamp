
import React, { useState } from 'react';
import { ChevronRight, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const groupsData = [
  { id: 1, name: 'Electronic Devices', status: true },
  { id: 2, name: 'Electrical', status: true },
  { id: 3, name: 'Non Electrical', status: true },
  { id: 4, name: 'Stand', status: true },
  { id: 5, name: 'ARS', status: false },
  { id: 6, name: 'Technical services', status: true },
  { id: 7, name: 'hvac', status: true },
  { id: 8, name: 'CCTV Camera', status: true },
  { id: 9, name: 'DVR', status: false },
  { id: 10, name: 'Water Dispenser', status: false },
  { id: 11, name: 'cd', status: false },
  { id: 12, name: 'Electronics', status: true },
  { id: 13, name: 'kitchen', status: false },
  { id: 14, name: 'Daikin', status: true },
  { id: 15, name: 'Camera', status: true },
  { id: 16, name: 'Carpenting', status: true },
  { id: 17, name: 'CASCOU', status: true },
  { id: 18, name: 'WERSCA', status: true },
  { id: 19, name: 'FAN', status: true },
  { id: 20, name: 'CCTV', status: true },
  { id: 21, name: 'HVAC', status: true },
  { id: 22, name: 'Cascou', status: true },
  { id: 23, name: 'SECSAF', status: true },
  { id: 24, name: 'CUSCHA', status: true },
  { id: 25, name: 'SMODET', status: true },
  { id: 26, name: 'Alarm', status: true },
  { id: 27, name: 'DG', status: true },
  { id: 28, name: 'Nikon', status: true },
  { id: 29, name: 'BB Eclectical', status: true },
  { id: 30, name: 'Plumbing', status: true },
  { id: 31, name: 'Water Meter', status: true },
  { id: 32, name: 'IT Assets', status: true },
  { id: 33, name: 'laptop', status: true }
];

const subGroupsData = [
  { id: 1, groupName: 'Electronic Devices', subGroupName: 'Laptops', status: true },
  { id: 2, groupName: 'Electronic Devices', subGroupName: 'Tabs', status: true },
  { id: 3, groupName: 'Electronic Devices', subGroupName: 'Mobiles', status: true },
  { id: 4, groupName: 'Electronic Devices', subGroupName: 'AI Device', status: true },
  { id: 5, groupName: 'Electronic Devices', subGroupName: 'Sim Card', status: true },
  { id: 6, groupName: 'Electronic Devices', subGroupName: 'Charger', status: true },
  { id: 7, groupName: 'Electronic Devices', subGroupName: 'Mouse', status: true },
  { id: 8, groupName: 'Electronic Devices', subGroupName: 'External Hard Disk', status: true },
  { id: 9, groupName: 'Electronic Devices', subGroupName: 'Macbook', status: true },
  { id: 10, groupName: 'Electronic Devices', subGroupName: 'Temperature Scanning Device', status: true },
  { id: 11, groupName: 'Electronic Devices', subGroupName: 'ipad', status: true },
  { id: 12, groupName: 'Electrical', subGroupName: 'Electric Meter', status: true },
  { id: 13, groupName: 'Electrical', subGroupName: 'Air Conditioner', status: true },
  { id: 14, groupName: 'Electrical', subGroupName: 'Energy Meter', status: true },
  { id: 15, groupName: 'Electrical', subGroupName: 'Diesel Generator', status: true },
  { id: 16, groupName: 'Electrical', subGroupName: 'AC, AV, Electrical', status: true },
  { id: 17, groupName: 'Non Electrical', subGroupName: 'Non Electrical', status: true },
  { id: 18, groupName: 'Stand', subGroupName: 'Precision Metal Works', status: true },
  { id: 19, groupName: 'ARS', subGroupName: 'BRS', status: true },
  { id: 20, groupName: 'hvac', subGroupName: 'Cassette Unit', status: true },
  { id: 21, groupName: 'hvac', subGroupName: 'high wall', status: true },
  { id: 22, groupName: 'CCTV Camera', subGroupName: 'CCTV Camera', status: true },
  { id: 23, groupName: 'DVR', subGroupName: 'DVR', status: true },
  { id: 24, groupName: 'Water Dispenser', subGroupName: 'Water Dispenser', status: false },
  { id: 25, groupName: 'cd', subGroupName: 'compact', status: true },
  { id: 26, groupName: 'Electronics', subGroupName: 'Motherboard', status: true },
  { id: 27, groupName: 'kitchen', subGroupName: 'oven', status: true },
  { id: 28, groupName: 'Daikin', subGroupName: 'Daikin AC', status: true },
  { id: 29, groupName: 'Camera', subGroupName: 'cctv camera', status: true },
  { id: 30, groupName: 'Carpenting', subGroupName: 'Furniture, Doors and Locks, Work station', status: false },
  { id: 31, groupName: 'CASCOU', subGroupName: 'Cash Counting Machine', status: true },
  { id: 32, groupName: 'CASCOU', subGroupName: 'Cash Counting Machine', status: true },
  { id: 33, groupName: 'WERSCA', subGroupName: 'Weighing Scale', status: true },
  { id: 34, groupName: 'FAN', subGroupName: 'Oryantal High Speed', status: true },
  { id: 35, groupName: 'CCTV', subGroupName: 'CCTV Camera Bullet', status: true },
  { id: 36, groupName: 'CCTV', subGroupName: 'CCTV Camera', status: true },
  { id: 37, groupName: 'HVAC', subGroupName: 'HVAC high Wall', status: true },
  { id: 38, groupName: 'SECSAF', subGroupName: 'Security Safe', status: true },
  { id: 39, groupName: 'CUSCHA', subGroupName: 'Cashier Chair', status: true },
  { id: 40, groupName: 'SMODET', subGroupName: 'Smoke Detector', status: true },
  { id: 41, groupName: 'Alarm', subGroupName: 'Fire Alarm', status: true },
  { id: 42, groupName: 'DG', subGroupName: 'Diesel Generator', status: true },
  { id: 43, groupName: 'Nikon', subGroupName: 'DSLR', status: true },
  { id: 44, groupName: 'BB Eclectical', subGroupName: 'UPS', status: true },
  { id: 45, groupName: 'BB Eclectical', subGroupName: 'DG', status: true },
  { id: 46, groupName: 'BB Eclectical', subGroupName: 'Lighting', status: true },
  { id: 47, groupName: 'Plumbing', subGroupName: 'FWTS', status: true },
  { id: 48, groupName: 'Water Meter', subGroupName: 'Water Meter', status: true },
  { id: 49, groupName: 'IT Assets', subGroupName: 'Laptops', status: true }
];

export const AssetGroupsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groupsData.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubGroups = subGroupsData.filter(subGroup =>
    subGroup.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subGroup.subGroupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Setup</span>
        <ChevronRight className="h-4 w-4" />
        <span>Groups</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">GROUPS</h1>
        <div className="flex items-center space-x-2">
          <Button className="bg-[#C72030] hover:bg-[#C72030]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Group
          </Button>
          <Button className="bg-[#C72030] hover:bg-[#C72030]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Subgroup
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tables Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groups Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Groups</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No</TableHead>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group, index) => (
                  <TableRow key={group.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>
                      <Switch checked={group.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Sub Groups Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sub Groups</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No</TableHead>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Sub Group Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubGroups.map((subGroup, index) => (
                  <TableRow key={subGroup.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{subGroup.groupName}</TableCell>
                    <TableCell>{subGroup.subGroupName}</TableCell>
                    <TableCell>
                      <Switch checked={subGroup.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
