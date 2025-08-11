import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

interface Group {
  id: number;
  srNo: number;
  groupName: string;
  status: boolean;
}

interface SubGroup {
  id: number;
  srNo: number;
  groupName: string;
  subGroupName: string;
  status: boolean;
}

interface GroupsPageTemplateProps {
  title: string;
  breadcrumb: string;
  apiEndpoint: string;
  subGroupApiEndpoint: string;
  groupType: string;
}

export const GroupsPageTemplate = ({ 
  title, 
  breadcrumb, 
  apiEndpoint, 
  subGroupApiEndpoint, 
  groupType 
}: GroupsPageTemplateProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [subGroups, setSubGroups] = useState<SubGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [addSubGroupOpen, setAddSubGroupOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  
  // Form states
  const [groupName, setGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [subGroupName, setSubGroupName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Loading states
  const [groupLoading, setGroupLoading] = useState(false);
  const [subGroupLoading, setSubGroupLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  
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
      const response = await apiClient.get(`${apiEndpoint}?type=${groupType}`);
      
      if (response.data && Array.isArray(response.data)) {
        // Transform groups data
        const transformedGroups = response.data.map((group, index) => ({
          id: group.id,
          srNo: index + 1,
          groupName: group.name,
          status: group.status === 'active'
        }));

        // Transform subgroups data - flatten from all groups
        const transformedSubGroups: SubGroup[] = [];
        let subGroupSerialNo = 1;
        
        response.data.forEach((group: any) => {
          if (group.sub_groups && Array.isArray(group.sub_groups)) {
            group.sub_groups.forEach((subGroup: any) => {
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
  }, [apiEndpoint, groupType]);

  const toggleGroupStatus = (id: number) => {
    setGroups(prev => prev.map(group => {
      if (group.id === id) {
        const newStatus = !group.status;
        toast.success(`Group ${newStatus ? 'activated' : 'deactivated'} successfully`);
        return { ...group, status: newStatus };
      }
      return group;
    }));
  };

  const toggleSubGroupStatus = (id: number) => {
    setSubGroups(prev => prev.map(subGroup => {
      if (subGroup.id === id) {
        const newStatus = !subGroup.status;
        toast.success(`Sub group ${newStatus ? 'activated' : 'deactivated'} successfully`);
        return { ...subGroup, status: newStatus };
      }
      return subGroup;
    }));
  };

  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setGroupLoading(true);
    try {
      const payload = {
        pms_asset_group: {
          name: groupName.trim(),
          group_type: groupType
        }
      };

      const response = await apiClient.post('/pms/asset_groups.json', payload);
      
      if (response.data) {
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
  };

  const handleAddSubGroup = async () => {
    if (!selectedGroupId) {
      toast.error('Please select a group');
      return;
    }
    
    if (!subGroupName.trim()) {
      toast.error('Please enter a sub group name');
      return;
    }

    setSubGroupLoading(true);
    try {
      const params = new URLSearchParams({
        'pms_asset_sub_group[name]': subGroupName.trim(),
        'pms_asset_sub_group[group_id]': selectedGroupId.toString()
      });

      const response = await apiClient.post(`/pms/asset_sub_groups.json?${params.toString()}`);
      
      if (response.data) {
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
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setBulkUploadLoading(true);
    try {
      const uploadFile = new FormData();
      uploadFile.append('asset_group_file', selectedFile);

      const response = await apiClient.post('/pms/assets/subgroup_import.json', uploadFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        await fetchGroupsData();
        setSelectedFile(null);
        setBulkUploadOpen(false);
        toast.success('Bulk upload completed successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setBulkUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-3 sm:p-4 md:p-6">
      <div className="mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">{title}</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{breadcrumb}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Button 
            className="bg-purple-700 hover:bg-purple-800 text-white w-full sm:w-auto min-w-0 sm:min-w-[120px] text-sm px-3 py-2"
            onClick={() => setAddGroupOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Add Group</span>
          </Button>
          <Button 
            className="bg-purple-700 hover:bg-purple-800 text-white w-full sm:w-auto min-w-0 sm:min-w-[140px] text-sm px-3 py-2"
            onClick={() => setAddSubGroupOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Add Subgroup</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-700 text-purple-700 hover:bg-purple-50 w-full sm:w-auto min-w-0 sm:min-w-[130px] text-sm px-3 py-2"
            onClick={() => setBulkUploadOpen(true)}
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
                        <div
                          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${group.status ? 'bg-green-500' : 'bg-gray-300'}`}
                          onClick={() => toggleGroupStatus(group.id)}
                          aria-label={group.status ? 'Deactivate group' : 'Activate group'}
                        >
                          <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${group.status ? 'translate-x-6' : 'translate-x-1'}`}
                          />
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
                        <div
                          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${subGroup.status ? 'bg-green-500' : 'bg-gray-300'}`}
                          onClick={() => toggleSubGroupStatus(subGroup.id)}
                          aria-label={subGroup.status ? 'Deactivate sub group' : 'Activate sub group'}
                        >
                          <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${subGroup.status ? 'translate-x-6' : 'translate-x-1'}`}
                          />
                        </div>
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
             <div className="flex items-center justify-between py-2 px-4 border-b">
              <DialogTitle className="text-xl font-bold p-0">ADD Group</DialogTitle>
              <IconButton onClick={() => setAddGroupOpen(false)}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>
            <DialogContent className="p-6">
              <div className="space-y-6">
                <TextField
                  label="Group Name *"
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
             <div className="flex items-center justify-between p-4 border-b">
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
                    onChange={(e) => setSelectedGroupId(e.target.value as string)}
                    label="Group Name *"
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
                  label="Sub Group Name *"
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

          {/* Bulk Upload Modal */}
          <Dialog 
            open={bulkUploadOpen} 
            onClose={() => setBulkUploadOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <div className="flex items-center justify-between p-6 border-b">
              <DialogTitle className="text-xl font-bold p-0">ADD Sub Group</DialogTitle>
              <IconButton onClick={() => setBulkUploadOpen(false)}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>
            <DialogContent className="p-6">
              <div className="space-y-6">
                {/* Drag & Drop File Upload Area */}
                <div 
                  className="border-2 border-dashed border-red-400 rounded-lg p-8 text-center bg-gray-50 cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-lg text-gray-700">
                      Drag & Drop or <span className="text-red-500 font-medium cursor-pointer hover:underline">Choose file</span>
                    </p>
                    <p className="text-gray-500">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </p>
                  </div>
                  <input 
                    id="file-upload"
                    type="file" 
                    className="hidden" 
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                      }
                    }}
                  />
                </div>

                {/* File Preview Section */}
                {selectedFile && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">File Preview</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Name:</span>
                        <span className="text-gray-900 font-medium">{selectedFile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Size:</span>
                        <span className="text-gray-900">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Type:</span>
                        <span className="text-gray-900">{selectedFile.type || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Modified:</span>
                        <span className="text-gray-900">{new Date(selectedFile.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedFile(null)}
                      className="mt-3 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                    >
                      Remove File
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleBulkUpload}
                    disabled={bulkUploadLoading || !selectedFile}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2"
                  >
                    {bulkUploadLoading ? 'Uploading...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </ThemeProvider>
      </div>
    </div>
  );
};