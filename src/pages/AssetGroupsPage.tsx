
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

// Remove dummy data - now using API data

export const AssetGroupsPage = () => {
  // Fixed selectedGroup reference error
  const [groups, setGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [addSubGroupOpen, setAddSubGroupOpen] = useState(false);
  
  // Form states
  const [groupName, setGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
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

  // Fetch groups and subgroups data
  const fetchGroupsData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/pms/asset_groups.json?type=asset');
      
      if (response.data && Array.isArray(response.data)) {
        // Transform groups data
        const transformedGroups = response.data.map((group, index) => ({
          id: group.id,
          srNo: index + 1,
          groupName: group.name,
          status: group.status === 'active'
        }));

        // Transform subgroups data - flatten from all groups
        const transformedSubGroups = [];
        let subGroupSerialNo = 1;
        
        response.data.forEach(group => {
          if (group.sub_groups && Array.isArray(group.sub_groups)) {
            group.sub_groups.forEach(subGroup => {
              transformedSubGroups.push({
                id: subGroup.id,
                srNo: subGroupSerialNo++,
                groupName: group.name,
                subGroupName: subGroup.name,
                status: subGroup.status === 'active'
              });
            });
          }
        });

        setGroups(transformedGroups);
        setSubGroups(transformedSubGroups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to fetch groups data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsData();
  }, []);

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
          // Refresh the data after creating a new group
          await fetchGroupsData();
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
    console.log('selectedGroupId:', selectedGroupId, 'subGroupName:', subGroupName);
    if (selectedGroupId && subGroupName.trim()) {
      setSubGroupLoading(true);
      try {
        const params = new URLSearchParams({
          'pms_asset_sub_group[name]': subGroupName.trim(),
          'pms_asset_sub_group[group_id]': selectedGroupId.toString()
        });

        const response = await apiClient.post(`/pms/asset_sub_groups.json?${params.toString()}`);
        
        if (response.data) {
          // Refresh the data after creating a new subgroup
          await fetchGroupsData();
          setSelectedGroupId('');
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
    <div className="min-h-screen bg-transparent p-3 sm:p-4 md:p-6">
      <div className="mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">GROUPS</h1>
            
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Button 
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white w-full sm:w-auto min-w-0 sm:min-w-[120px] text-sm px-3 py-2 h-9 font-medium"
            onClick={() => setAddGroupOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Action Group</span>
          </Button>
          <Button 
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white w-full sm:w-auto min-w-0 sm:min-w-[140px] text-sm px-3 py-2 h-9 font-medium"
            onClick={() => setAddSubGroupOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Action Subgroup</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-700 text-purple-700 hover:bg-purple-50 w-full sm:w-auto min-w-0 sm:min-w-[130px] text-sm px-3 py-2"
          >
            <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Bulk Upload</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
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
            <DialogContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Group Name</InputLabel>
                  <Select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    label="Group Name"
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: 'white',
                          zIndex: 9999,
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Group
                    </MenuItem>
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.groupName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Sub Group Name"
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
