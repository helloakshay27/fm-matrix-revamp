
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

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
  { id: 13, srNo: 13, groupName: 'kitchen', status: false },
  { id: 14, srNo: 14, groupName: 'Daikin', status: true },
  { id: 15, srNo: 15, groupName: 'Camera', status: true },
  { id: 16, srNo: 16, groupName: 'Carpenting', status: true },
  { id: 17, srNo: 17, groupName: 'CASCOU', status: true },
  { id: 18, srNo: 18, groupName: 'WESCA', status: true },
  { id: 19, srNo: 19, groupName: 'FAN', status: true },
  { id: 20, srNo: 20, groupName: 'CCTV', status: true },
  { id: 21, srNo: 21, groupName: 'HVAC', status: true },
  { id: 22, srNo: 22, groupName: 'Carron', status: true },
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
  { id: 34, srNo: 34, groupName: 'FAN', subGroupName: 'Oxyental High Speed', status: true },
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
  
  // Modal states
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [addSubGroupOpen, setAddSubGroupOpen] = useState(false);
  
  // Form states
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [subGroupName, setSubGroupName] = useState('');
  
  // Loading states
  const [groupLoading, setGroupLoading] = useState(false);
  const [subGroupLoading, setSubGroupLoading] = useState(false);
  
  // MUI theme
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

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

  const handleAddGroup = async () => {
    if (groupName.trim()) {
      setGroupLoading(true);
      try {
        const payload = {
          pms_asset_group: {
            name: groupName.trim(),
            group_type: "asset"
          }
        };

        const response = await apiClient.post('/pms/asset_groups.json', payload);
        
        if (response.data) {
          const newGroup = {
            id: response.data.id || groups.length + 1,
            srNo: groups.length + 1,
            groupName: groupName.trim(),
            status: true
          };
          setGroups(prev => [...prev, newGroup]);
          setGroupName('');
          setAddGroupOpen(false);
          toast.success('Group created successfully');
        }
      } catch (error) {
        console.error('Error creating group:', error);
        toast.error('Failed to create group');
      } finally {
        setGroupLoading(false);
      }
    }
  };

  const handleAddSubGroup = async () => {
    if (selectedGroup && subGroupName.trim()) {
      setSubGroupLoading(true);
      try {
        // Find the selected group's ID
        const selectedGroupData = groups.find(group => group.groupName === selectedGroup);
        if (!selectedGroupData) {
          toast.error('Selected group not found');
          return;
        }

        const params = new URLSearchParams({
          'pms_asset_sub_group[name]': subGroupName.trim(),
          'pms_asset_sub_group[group_id]': selectedGroupData.id.toString()
        });

        const response = await apiClient.post(`/pms/asset_sub_groups.json?${params.toString()}`);
        
        if (response.data) {
          const newSubGroup = {
            id: response.data.id || subGroups.length + 1,
            srNo: subGroups.length + 1,
            groupName: selectedGroup,
            subGroupName: subGroupName.trim(),
            status: true
          };
          setSubGroups(prev => [...prev, newSubGroup]);
          setSelectedGroup('');
          setSubGroupName('');
          setAddSubGroupOpen(false);
          toast.success('Sub group created successfully');
        }
      } catch (error) {
        console.error('Error creating sub group:', error);
        toast.error('Failed to create sub group');
      } finally {
        setSubGroupLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
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
            onClick={() => setAddGroupOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Group
          </Button>
          <Button 
            className="bg-purple-700 hover:bg-purple-800 text-white"
            onClick={() => setAddSubGroupOpen(true)}
          >
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

        {/* Add Group Modal */}
        <ThemeProvider theme={theme}>
          <Dialog 
            open={addGroupOpen} 
            onClose={() => setAddGroupOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <div className="flex items-center justify-between p-6 border-b">
              <DialogTitle className="text-xl font-bold p-0">ADD Group</DialogTitle>
              <IconButton onClick={() => setAddGroupOpen(false)}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>
            <DialogContent className="p-6">
              <div className="space-y-6">
                <TextField
                  label="Group Name"
                  placeholder="Enter Group Name"
                  variant="outlined"
                  fullWidth
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleAddGroup}
                    disabled={groupLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                  >
                    {groupLoading ? 'Creating...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Sub Group Modal */}
          <Dialog 
            open={addSubGroupOpen} 
            onClose={() => setAddSubGroupOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <div className="flex items-center justify-between p-6 border-b">
              <DialogTitle className="text-xl font-bold p-0">ADD Sub Group</DialogTitle>
              <IconButton onClick={() => setAddSubGroupOpen(false)}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>
            <DialogContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Group Name</InputLabel>
                  <Select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    label="Group Name"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Group
                    </MenuItem>
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.groupName}>
                        {group.groupName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Group Name"
                  placeholder="Enter Sub Group Name"
                  variant="outlined"
                  fullWidth
                  value={subGroupName}
                  onChange={(e) => setSubGroupName(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleAddSubGroup}
                  disabled={subGroupLoading}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2"
                >
                  {subGroupLoading ? 'Creating...' : 'Submit'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </ThemeProvider>
      </div>
    </div>
  );
};
