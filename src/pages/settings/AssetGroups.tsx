
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, FileDown, RotateCcw, ExternalLink, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const AssetGroups = () => {
  const [groups, setGroups] = useState([
    { id: 1, name: 'Electronic Devices', status: true },
    { id: 2, name: 'Electrical', status: true },
    { id: 3, name: 'Non Electrical', status: true },
    { id: 4, name: 'Stand', status: true },
    { id: 5, name: 'ARS', status: true },
    { id: 6, name: 'Technical services', status: true },
    { id: 7, name: 'hvac', status: true },
    { id: 8, name: 'CCTV Camera', status: true },
    { id: 9, name: 'DVR', status: true },
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
    { id: 29, name: 'BB Eelectrical', status: true },
    { id: 30, name: 'Plumbing', status: true },
    { id: 31, name: 'Water Meter', status: true },
    { id: 32, name: 'IT Assets', status: true },
    { id: 33, name: 'laptop', status: true }
  ]);

  const [subGroups, setSubGroups] = useState([
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
    { id: 25, groupName: 'cd', subGroupName: 'compact', status: false },
    { id: 26, groupName: 'Electronics', subGroupName: 'Motherboard', status: true },
    { id: 27, groupName: 'kitchen', subGroupName: 'oven', status: true },
    { id: 28, groupName: 'Daikin', subGroupName: 'Daikin AC', status: true },
    { id: 29, groupName: 'Camera', subGroupName: 'cctv camera', status: true },
    { id: 30, groupName: 'Carpenting', subGroupName: 'Furniture, Doors and Locks, Work station', status: false },
    { id: 31, groupName: 'CASCOU', subGroupName: 'Cash Counting Machine', status: true },
    { id: 32, groupName: 'CASCOU', subGroupName: 'Cash Counting Machine', status: true },
    { id: 33, groupName: 'WERSCA', subGroupName: 'Weighing Scale', status: true },
    { id: 34, groupName: 'FAN', subGroupName: 'Oriyental High Speed', status: true },
    { id: 35, groupName: 'CCTV', subGroupName: 'CCTV Camera Bullet', status: true },
    { id: 36, groupName: 'CCTV', subGroupName: 'CCTV Camera', status: true },
    { id: 37, groupName: 'HVAC', subGroupName: 'HVAC high Wall', status: true },
    { id: 38, groupName: 'SECSAF', subGroupName: 'Security Safe', status: true },
    { id: 39, groupName: 'CUSCHA', subGroupName: 'Cashier Chair', status: true },
    { id: 40, groupName: 'SMODET', subGroupName: 'Smoke Detector', status: true },
    { id: 41, groupName: 'Alarm', subGroupName: 'Fire Alarm', status: true },
    { id: 42, groupName: 'DG', subGroupName: 'Diesel Generator', status: true },
    { id: 43, groupName: 'Nikon', subGroupName: 'DSLR', status: true },
    { id: 44, groupName: 'BB Eelectrical', subGroupName: 'UPS', status: true },
    { id: 45, groupName: 'BB Eelectrical', subGroupName: 'DG', status: true },
    { id: 46, groupName: 'BB Eelectrical', subGroupName: 'Lighting', status: true },
    { id: 47, groupName: 'Plumbing', subGroupName: 'FWTS', status: true },
    { id: 48, groupName: 'Water Meter', subGroupName: 'Water Meter', status: true },
    { id: 49, groupName: 'IT Assets', subGroupName: 'Laptops', status: true }
  ]);

  const toggleGroupStatus = (id: number) => {
    setGroups(groups.map(group => 
      group.id === id ? { ...group, status: !group.status } : group
    ));
  };

  const toggleSubGroupStatus = (id: number) => {
    setSubGroups(subGroups.map(subGroup => 
      subGroup.id === id ? { ...subGroup, status: !subGroup.status } : subGroup
    ));
  };

  const handleAddGroup = () => {
    console.log('Add new group');
  };

  const handleAddSubgroup = () => {
    console.log('Add new subgroup');
  };

  const handleBulkUpload = () => {
    console.log('Bulk upload');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <span>Setup</span>
          <span className="mx-2">&gt;</span>
          <span>Groups</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">GROUPS</h1>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-4">
          <Button 
            onClick={handleAddGroup}
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 text-sm"
          >
            + Add Group
          </Button>
          <Button 
            onClick={handleAddSubgroup}
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 text-sm"
          >
            + Add Subgroup
          </Button>
          <Button 
            onClick={handleBulkUpload}
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 text-sm flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groups Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Groups</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-64 bg-white"
                  />
                </div>
                <Button variant="outline" size="icon" className="bg-white">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white">
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#f6f4ee' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Sr No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Group Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {groups.map((group, index) => (
                  <tr key={group.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                      {group.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                      {group.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-b border-gray-200">
                      <Switch
                        checked={group.status}
                        onCheckedChange={() => toggleGroupStatus(group.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub Groups Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sub Groups</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-64 bg-white"
                  />
                </div>
                <Button variant="outline" size="icon" className="bg-white">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white">
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#f6f4ee' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Sr No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Group Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Sub Group Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {subGroups.map((subGroup, index) => (
                  <tr key={subGroup.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                      {subGroup.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                      {subGroup.groupName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                      {subGroup.subGroupName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-b border-gray-200">
                      <Switch
                        checked={subGroup.status}
                        onCheckedChange={() => toggleSubGroupStatus(subGroup.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
