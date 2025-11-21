import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, Chip, Box, SelectChangeEvent } from '@mui/material';
import { toast } from 'sonner';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterParams) => void;
  currentFilters: FilterParams;
}

export interface FilterParams {
  name_cont?: string;
  audit_type_eq?: string;
  status_eq?: string;
  site_ids_cont_any?: string[];
  building_ids_cont_any?: string[];
  wing_ids_cont_any?: string[];
  area_ids_cont_any?: string[];
  floor_ids_cont_any?: string[];
  department_ids_cont_any?: string[];
  asset_group_ids_cont_any?: string[];
  asset_sub_group_ids_cont_any?: string[];
  conducted_by_ids_cont_any?: string[];
}

const AssetAuditFilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<FilterParams>(currentFilters);

  // Dropdown options state
  const [sites, setSites] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [wings, setWings] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [assetGroups, setAssetGroups] = useState<any[]>([]);
  const [assetSubGroups, setAssetSubGroups] = useState<any[]>([]);
  const [conductedByUsers, setConductedByUsers] = useState<any[]>([]);

  // Loading states
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingSubGroups, setLoadingSubGroups] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fieldStyles = {
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: '10px 12px',
    },
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
    },
    MenuListProps: {
      style: {
        maxHeight: 300,
      },
    },
    anchorOrigin: {
      vertical: 'bottom' as const,
      horizontal: 'left' as const,
    },
    transformOrigin: {
      vertical: 'top' as const,
      horizontal: 'left' as const,
    },
    // Ensure dropdown appears above the modal
    disablePortal: false,
    style: {
      zIndex: 10000, // Higher than modal z-index (9999)
    },
  };

  const auditTypeOptions = [
    { value: 'Asset-based', label: 'Asset-based' },
    { value: 'Location-based', label: 'Location-based' },
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'closed', label: 'Closed' },
  ];

  // Fetch Sites
  useEffect(() => {
    const fetchSites = async () => {
      setLoadingSites(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/sites.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch sites');
        const data = await response.json();
        setSites(Array.isArray(data.sites) ? data.sites : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching sites:', error);
        setSites([]);
      } finally {
        setLoadingSites(false);
      }
    };

    if (isOpen) fetchSites();
  }, [isOpen]);

  // Fetch Buildings
  useEffect(() => {
    const fetchBuildings = async () => {
      setLoadingBuildings(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/buildings.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch buildings');
        const data = await response.json();
        setBuildings(Array.isArray(data.pms_buildings) ? data.pms_buildings : Array.isArray(data.buildings) ? data.buildings : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setBuildings([]);
      } finally {
        setLoadingBuildings(false);
      }
    };

    if (isOpen) fetchBuildings();
  }, [isOpen]);

  // Fetch Wings (independent - not cascading)
  useEffect(() => {
    const fetchWings = async () => {
      setLoadingWings(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/wings.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch wings');
        const data = await response.json();
        setWings(Array.isArray(data.wings) ? data.wings : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching wings:', error);
        setWings([]);
      } finally {
        setLoadingWings(false);
      }
    };

    if (isOpen) fetchWings();
  }, [isOpen]);

  // Fetch Areas (independent - not cascading)
  useEffect(() => {
    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/areas.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch areas');
        const data = await response.json();
        setAreas(Array.isArray(data.areas) ? data.areas : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };

    if (isOpen) fetchAreas();
  }, [isOpen]);

  // Fetch Floors (independent - not cascading)
  useEffect(() => {
    const fetchFloors = async () => {
      setLoadingFloors(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/floors.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch floors');
        const data = await response.json();
        setFloors(Array.isArray(data.floors) ? data.floors : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching floors:', error);
        setFloors([]);
      } finally {
        setLoadingFloors(false);
      }
    };

    if (isOpen) fetchFloors();
  }, [isOpen]);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/departments.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        setDepartments(Array.isArray(data.departments) ? data.departments : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    if (isOpen) fetchDepartments();
  }, [isOpen]);

  // Fetch Asset Groups
  useEffect(() => {
    const fetchAssetGroups = async () => {
      setLoadingGroups(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/assets/get_asset_group_sub_group.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch asset groups');
        const data = await response.json();
        setAssetGroups(Array.isArray(data.asset_groups) ? data.asset_groups : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching asset groups:', error);
        setAssetGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };

    if (isOpen) fetchAssetGroups();
  }, [isOpen]);

  // Fetch Asset Sub Groups when asset groups are selected
  useEffect(() => {
    const fetchSubGroups = async () => {
      if (!filters.asset_group_ids_cont_any || filters.asset_group_ids_cont_any.length === 0) {
        setAssetSubGroups([]);
        return;
      }

      setLoadingSubGroups(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        // Fetch subgroups for the first selected group
        const groupId = filters.asset_group_ids_cont_any[0];
        const response = await fetch(`https://${baseUrl}/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch asset subgroups');
        const data = await response.json();
        setAssetSubGroups(Array.isArray(data.asset_groups) ? data.asset_groups : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching asset subgroups:', error);
        setAssetSubGroups([]);
      } finally {
        setLoadingSubGroups(false);
      }
    };

    fetchSubGroups();
  }, [filters.asset_group_ids_cont_any]);

  // Fetch Conducted By Users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/users.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Users API might return 500, handle gracefully
          console.warn('Users API returned error, setting empty array');
          setConductedByUsers([]);
          return;
        }
        const data = await response.json();
        setConductedByUsers(Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setConductedByUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen]);

  const handleMultiSelectChange = (field: keyof FilterParams, value: string[]) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSingleSelectChange = (field: keyof FilterParams, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTextChange = (field: keyof FilterParams, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterParams = {};
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Filter Audits</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Audit Name */}
              <div>
                <TextField
                  fullWidth
                  label="Audit Name"
                  variant="outlined"
                  size="small"
                  value={filters.name_cont || ''}
                  onChange={(e) => handleTextChange('name_cont', e.target.value)}
                  placeholder="Search by audit name"
                  sx={fieldStyles}
                />
              </div>

              {/* Audit Type */}
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Audit Type</InputLabel>
                  <MuiSelect
                    label="Audit Type"
                    value={filters.audit_type_eq || ''}
                    onChange={(e) => handleSingleSelectChange('audit_type_eq', e.target.value)}
                    MenuProps={menuProps}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {auditTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Status */}
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Status</InputLabel>
                  <MuiSelect
                    label="Status"
                    value={filters.status_eq || ''}
                    onChange={(e) => handleSingleSelectChange('status_eq', e.target.value)}
                    MenuProps={menuProps}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Sites */}
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Sites</InputLabel>
                  <MuiSelect
                    multiple
                    label="Sites"
                    value={filters.site_ids_cont_any || []}
                    onChange={(e) => handleMultiSelectChange('site_ids_cont_any', e.target.value as string[])}
                    disabled={loadingSites}
                    MenuProps={menuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const site = sites.find(s => String(s.id) === value);
                          return <Chip key={value} label={site?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                    sx={fieldStyles}
                  >
                    {sites.map((site) => (
                      <MenuItem key={site.id} value={String(site.id)}>
                        {site.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Buildings */}
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Buildings</InputLabel>
                  <MuiSelect
                    multiple
                    label="Buildings"
                    value={filters.building_ids_cont_any || []}
                    onChange={(e) => handleMultiSelectChange('building_ids_cont_any', e.target.value as string[])}
                    disabled={loadingBuildings}
                    MenuProps={menuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const building = buildings.find(b => String(b.id) === value);
                          return <Chip key={value} label={building?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                    sx={fieldStyles}
                  >
                    {buildings.map((building) => (
                      <MenuItem key={building.id} value={String(building.id)}>
                        {building.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Wings */}
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Wings</InputLabel>
                  <MuiSelect
                    multiple
                    label="Wings"
                    value={filters.wing_ids_cont_any || []}
                    onChange={(e) => handleMultiSelectChange('wing_ids_cont_any', e.target.value as string[])}
                    disabled={loadingWings}
                    MenuProps={menuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const wing = wings.find(w => String(w.id) === value);
                          return <Chip key={value} label={wing?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                    sx={fieldStyles}
                  >
                    {wings.map((wing) => (
                      <MenuItem key={wing.id} value={String(wing.id)}>
                        {wing.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Areas */}
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Areas</InputLabel>
                  <MuiSelect
                    multiple
                    label="Areas"
                    value={filters.area_ids_cont_any || []}
                    onChange={(e) => handleMultiSelectChange('area_ids_cont_any', e.target.value as string[])}
                    disabled={loadingAreas}
                    MenuProps={menuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const area = areas.find(a => String(a.id) === value);
                          return <Chip key={value} label={area?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                    sx={fieldStyles}
                  >
                    {areas.map((area) => (
                      <MenuItem key={area.id} value={String(area.id)}>
                        {area.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Floors */}
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Floors</InputLabel>
                  <MuiSelect
                    multiple
                    label="Floors"
                    value={filters.floor_ids_cont_any || []}
                    onChange={(e) => handleMultiSelectChange('floor_ids_cont_any', e.target.value as string[])}
                    disabled={loadingFloors}
                    MenuProps={menuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const floor = floors.find(f => String(f.id) === value);
                          return <Chip key={value} label={floor?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                    sx={fieldStyles}
                  >
                    {floors.map((floor) => (
                      <MenuItem key={floor.id} value={String(floor.id)}>
                        {floor.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Departments */}
              {/* <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Departments</InputLabel>
                  <MuiSelect
                    multiple
                    label="Departments"
                    value={filters.department_ids_cont_any || []}
                    onChange={(e) => handleMultiSelectChange('department_ids_cont_any', e.target.value as string[])}
                    disabled={loadingDepartments}
                    MenuProps={menuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const dept = departments.find(d => String(d.id) === value);
                          return <Chip key={value} label={dept?.department_name || dept?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                    sx={fieldStyles}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={String(dept.id)}>
                        {dept.department_name || dept.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div> */}

              {/* Asset Groups */}
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Asset Groups</InputLabel>
                  <MuiSelect
                    multiple
                    label="Asset Groups"
                    value={filters.asset_group_ids_cont_any || []}
                    onChange={(e) => handleMultiSelectChange('asset_group_ids_cont_any', e.target.value as string[])}
                    disabled={loadingGroups}
                    MenuProps={menuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const group = assetGroups.find(g => String(g.id) === value);
                          return <Chip key={value} label={group?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                    sx={fieldStyles}
                  >
                    {assetGroups.map((group) => (
                      <MenuItem key={group.id} value={String(group.id)}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Asset Sub Groups */}
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Asset Sub Groups</InputLabel>
                  <MuiSelect
                    multiple
                    label="Asset Sub Groups"
                    value={filters.asset_sub_group_ids_cont_any || []}
                    onChange={(e) => handleMultiSelectChange('asset_sub_group_ids_cont_any', e.target.value as string[])}
                    disabled={!filters.asset_group_ids_cont_any || filters.asset_group_ids_cont_any.length === 0 || loadingSubGroups}
                    MenuProps={menuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const subGroup = assetSubGroups.find(sg => String(sg.id) === value);
                          return <Chip key={value} label={subGroup?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                    sx={fieldStyles}
                  >
                    {assetSubGroups.map((subGroup) => (
                      <MenuItem key={subGroup.id} value={String(subGroup.id)}>
                        {subGroup.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Conducted By */}
              {/* <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Conducted By</InputLabel>
                  <MuiSelect
                    multiple
                    label="Conducted By"
                    value={filters.conducted_by_ids_cont_any || []}
                    onChange={(e) => handleMultiSelectChange('conducted_by_ids_cont_any', e.target.value as string[])}
                    disabled={loadingUsers}
                    MenuProps={menuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const user = conductedByUsers.find(u => String(u.id) === value);
                          return <Chip key={value} label={user?.name || user?.email || value} size="small" />;
                        })}
                      </Box>
                    )}
                    sx={fieldStyles}
                  >
                    {conductedByUsers.map((user) => (
                      <MenuItem key={user.id} value={String(user.id)}>
                        {user.name || user.email}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div> */}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={handleReset}
              className="px-6"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetAuditFilterModal;
