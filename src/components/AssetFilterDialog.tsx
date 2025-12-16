
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
// Updated AssetFilters interface with extra_fields_field_value_cont and critical_eq
import { fetchAssetsData, AssetFilters } from '@/store/slices/assetsSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';
import { AllocateToSection } from '@/components/AllocateToSection';

interface AssetFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999, // High z-index to ensure dropdown appears above other elements
    },
  },
  // Prevent focus conflicts with Dialog
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

interface GroupItem {
  id: number;
  name: string;
}

interface SubGroupItem {
  id: number;
  name: string;
  group_id: number;
}

interface SiteItem {
  id: number;
  name: string;
}

interface BuildingItem {
  id: number;
  name: string;
}

interface WingItem {
  id: number;
  name: string;
}

interface AreaItem {
  id: number;
  name: string;
}

interface FloorItem {
  id: number;
  name: string;
}

interface RoomItem {
  id: number;
  name: string;
}

// Category options
const categoryOptions = [
  'Land',
  'Building',
  'Leasehold Improvement',
  'Vehicle',
  'Furniture & Fixtures',
  'IT Equipment',
  'Machinery & Equipment',
  'Tools & Instruments',
  'Meter'
];

// Criticality options
const criticalityOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

export const AssetFilterDialog: React.FC<AssetFilterDialogProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Form state
  const [assetName, setAssetName] = useState('');
  const [assetId, setAssetId] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [criticality, setCriticality] = useState('');
  const [group, setGroup] = useState('');
  const [subgroup, setSubgroup] = useState('');
  const [site, setSite] = useState('');
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [allocationType, setAllocationType] = useState('');
  const [allocatedToId, setAllocatedToId] = useState<number | null>(null);

  // API data states
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [subgroups, setSubgroups] = useState<SubGroupItem[]>([]);
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [wings, setWings] = useState<WingItem[]>([]);
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [floors, setFloors] = useState<FloorItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);

  // Loading states
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingSubgroups, setLoadingSubgroups] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      if (!isOpen) return;

      console.log('Fetching groups API call started...');
      setLoadingGroups(true);
      try {
        const response = await apiClient.get('/pms/assets/get_asset_group_sub_group.json');
        console.log('Groups API response:', response.data);

        // Extract groups from the asset_groups property
        const groupsData = Array.isArray(response.data?.asset_groups) ? response.data.asset_groups : [];
        console.log('Setting groups data:', groupsData);
        console.log('Groups data length:', groupsData.length);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups - full error:', error);
        setGroups([]);
      } finally {
        setLoadingGroups(false);
        console.log('Groups API call completed');
      }
    };

    fetchGroups();
  }, [isOpen]);

  // Fetch subgroups when group changes
  useEffect(() => {
    const fetchSubgroups = async () => {
      if (!group) {
        setSubgroups([]);
        return;
      }

      console.log('Fetching subgroups for group:', group);
      setLoadingSubgroups(true);
      try {
        const response = await apiClient.get(`/pms/assets/get_asset_group_sub_group.json?group_id=${group}`);
        console.log('Subgroups API response:', response.data);

        // Extract subgroups from the asset_groups property (same as groups API)
        const subgroupsData = Array.isArray(response.data?.asset_groups) ? response.data.asset_groups : [];

        console.log('Setting subgroups data:', subgroupsData);
        console.log('Subgroups data length:', subgroupsData.length);
        setSubgroups(subgroupsData);
      } catch (error) {
        console.error('Error fetching subgroups:', error);
        setSubgroups([]);
      } finally {
        setLoadingSubgroups(false);
      }
    };

    fetchSubgroups();
  }, [group]);

  // Fetch sites on component mount
  useEffect(() => {
    const fetchSites = async () => {
      if (!isOpen) return;

      console.log('Fetching sites API call started...');
      setLoadingSites(true);
      try {
        const response = await apiClient.get('/pms/sites.json');
        console.log('Sites API response:', response.data);

        const sitesData = Array.isArray(response.data?.sites) ? response.data.sites : [];
        console.log('Setting sites data:', sitesData);
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching sites:', error);
        setSites([]);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [isOpen]);

  // Fetch buildings when site changes
  useEffect(() => {
    const fetchBuildings = async () => {
      if (!site) {
        setBuildings([]);
        setBuilding(''); // Reset building when site changes
        setWing(''); // Reset dependent dropdowns
        setArea('');
        setFloor('');
        setRoom('');
        return;
      }

      console.log('Fetching buildings for site:', site);
      setLoadingBuildings(true);
      try {
        const response = await apiClient.get(`/pms/sites/${site}/buildings.json`);
        console.log('Buildings API response:', response.data);

        // Extract buildings directly from the array
        const buildingsData = Array.isArray(response.data?.buildings)
          ? response.data.buildings
          : [];
        console.log('Setting buildings data:', buildingsData);
        setBuildings(buildingsData);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setBuildings([]);
      } finally {
        setLoadingBuildings(false);
      }
    };

    fetchBuildings();
  }, [site]);

  // Fetch wings when building changes
  useEffect(() => {
    const fetchWings = async () => {
      if (!building) {
        setWings([]);
        setArea(''); // Reset area when building changes
        return;
      }

      console.log('Fetching wings for building:', building);
      setLoadingWings(true);
      try {
        const response = await apiClient.get(`/pms/buildings/${building}/wings.json`);
        console.log('Wings API response:', response.data);

        // Extract wings from nested structure: [].wings
        const wingsData = Array.isArray(response.data)
          ? response.data.map((item: any) => item.wings).filter(Boolean)
          : [];
        console.log('Setting wings data:', wingsData);
        setWings(wingsData);
      } catch (error) {
        console.error('Error fetching wings:', error);
        setWings([]);
      } finally {
        setLoadingWings(false);
      }
    };

    fetchWings();
  }, [building]);

  // Fetch areas when wing changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (!wing) {
        setAreas([]);
        return;
      }

      console.log('Fetching areas for wing:', wing);
      setLoadingAreas(true);
      try {
        const response = await apiClient.get(`/pms/wings/${wing}/areas.json`);
        console.log('Areas API response:', response.data);

        const areasData = Array.isArray(response.data?.areas) ? response.data.areas : [];
        console.log('Setting areas data:', areasData);
        setAreas(areasData);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, [wing]);

  // Fetch floors when area changes
  useEffect(() => {
    const fetchFloors = async () => {
      if (!area) {
        setFloors([]);
        setFloor(''); // Reset floor when area changes
        setRoom(''); // Reset room when area changes
        return;
      }

      console.log('Fetching floors for area:', area);
      setLoadingFloors(true);
      try {
        const response = await apiClient.get(`/pms/areas/${area}/floors.json`);
        console.log('Floors API response:', response.data);

        const floorsData = Array.isArray(response.data?.floors) ? response.data.floors : [];
        console.log('Setting floors data:', floorsData);
        setFloors(floorsData);
      } catch (error) {
        console.error('Error fetching floors:', error);
        setFloors([]);
      } finally {
        setLoadingFloors(false);
      }
    };

    fetchFloors();
  }, [area]);

  // Fetch rooms when floor changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!floor) {
        setRooms([]);
        return;
      }

      console.log('Fetching rooms for floor:', floor);
      setLoadingRooms(true);
      try {
        const response = await apiClient.get(`/pms/floors/${floor}/rooms.json`);
        console.log('Rooms API response:', response.data);

        // Extract rooms from nested structure: [].rooms
        const roomsData = Array.isArray(response.data)
          ? response.data.map((item: any) => item.rooms).filter(Boolean)
          : [];
        console.log('Setting rooms data:', roomsData);
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [floor]);

  // Handle group change and reset subgroup
  const handleGroupChange = (value: string) => {
    setGroup(value);
    setSubgroup(''); // Reset subgroup when group changes
  };

  // Handle site change and reset all dependent dropdowns
  const handleSiteChange = (value: string) => {
    setSite(value);
    setBuilding('');
    setWing('');
    setArea('');
    setFloor('');
    setRoom('');
  };

  // Handle building change and reset dependent dropdowns
  const handleBuildingChange = (value: string) => {
    setBuilding(value);
    setWing(''); // Reset wing when building changes
    setArea(''); // Reset area when building changes
    setFloor('');
    setRoom('');
  };

  // Handle wing change and reset dependent dropdowns
  const handleWingChange = (value: string) => {
    setWing(value);
    setArea(''); // Reset area when wing changes
    setFloor('');
    setRoom('');
  };

  // Handle area change and reset dependent dropdowns
  const handleAreaChange = (value: string) => {
    setArea(value);
    setFloor(''); // Reset floor when area changes
    setRoom(''); // Reset room when area changes
  };

  // Handle floor change and reset room
  const handleFloorChange = (value: string) => {
    setFloor(value);
    setRoom(''); // Reset room when floor changes
  };

  const handleSubmit = async () => {
    try {
      const filters: AssetFilters = {
        assetName: assetName || undefined,
        assetId: assetId || undefined,
        extra_fields_field_value_in: category.length > 0 ? category.join(',') : undefined,
        critical_eq: criticality === 'yes' ? true : criticality === 'no' ? false : undefined,
        groupId: group || undefined,
        subgroupId: subgroup || undefined,
        siteId: site || undefined,
        buildingId: building || undefined,
        wingId: wing || undefined,
        areaId: area || undefined,
        floorId: floor || undefined,
        roomId: room || undefined,
        allocation_type_eq: allocationType === 'user' ? 'users' : allocationType || undefined,
        allocation_ids_cont: allocatedToId?.toString() || undefined,
      };

      // Remove empty/undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      ) as AssetFilters;

      console.log('Applying asset filters:', cleanFilters);

      // Dispatch Redux action to fetch filtered assets
      await dispatch(fetchAssetsData({ page: 1, filters: cleanFilters })).unwrap();

      toast.success('Filters applied successfully');
      onClose();
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    }
  };

  const handleExport = () => {
    console.log('Export filtered data');
    onClose();
  };

  const handleReset = async () => {
    try {
      // Clear all form fields
      setAssetName('');
      setAssetId('');
      setCategory([]);
      setCriticality('');
      setGroup('');
      setSubgroup('');
      setSite('');
      setBuilding('');
      setWing('');
      setArea('');
      setFloor('');
      setRoom('');
      setAllocationType('');
      setAllocatedToId(null);

      // Clear dependent data arrays
      setSubgroups([]);
      setBuildings([]);
      setWings([]);
      setAreas([]);
      setFloors([]);
      setRooms([]);

      // Dispatch Redux action to fetch all unfiltered assets
      await dispatch(fetchAssetsData({ page: 1, filters: {} })).unwrap();

      toast.success('Filters reset successfully');
      onClose();
    } catch (error) {
      console.error('Error resetting filters:', error);
      toast.error('Failed to reset filters');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="asset-filter-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="asset-filter-dialog-description" className="sr-only">
            Filter assets by name, ID, group, subgroup, site, building, wing, area, floor, and room
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Asset Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Asset Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Asset Name"
                placeholder="Enter Asset Name"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Asset ID"
                placeholder="Enter Asset ID"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-label" shrink>Category</InputLabel>
                <MuiSelect
                  labelId="category-label"
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                  displayEmpty
                  multiple
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                  renderValue={(selected) => {
                    if (Array.isArray(selected) && selected.length === 0) {
                      return <em>Select Categories</em>;
                    }
                    return Array.isArray(selected) ? selected.join(', ') : '';
                  }}
                >
                  {categoryOptions.map((categoryOption) => (
                    <MenuItem key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="criticality-label" shrink>Criticality</InputLabel>
                <MuiSelect
                  labelId="criticality-label"
                  label="Criticality"
                  value={criticality}
                  onChange={(e) => setCriticality(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Criticality</em></MenuItem>
                  {criticalityOptions.map((criticalityOption) => (
                    <MenuItem key={criticalityOption.value} value={criticalityOption.value}>
                      {criticalityOption.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="group-label" shrink>Group</InputLabel>
                <MuiSelect
                  labelId="group-label"
                  label="Group"
                  value={group}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingGroups}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Group</em></MenuItem>
                  {groups.map((groupItem) => (
                    <MenuItem key={groupItem.id} value={groupItem.id?.toString() || ''}>
                      {groupItem.name || 'Unknown Group'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="subgroup-label" shrink>Subgroup</InputLabel>
                <MuiSelect
                  labelId="subgroup-label"
                  label="Subgroup"
                  value={subgroup}
                  onChange={(e) => setSubgroup(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingSubgroups || !group}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                  {subgroups.map((subgroupItem) => (
                    <MenuItem key={subgroupItem.id} value={subgroupItem.id?.toString() || ''}>
                      {subgroupItem.name || 'Unknown Subgroup'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="site-label" shrink>Site</InputLabel>
                <MuiSelect
                  labelId="site-label"
                  label="Site"
                  value={site}
                  onChange={(e) => handleSiteChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingSites}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Site</em></MenuItem>
                  {sites.map((siteItem) => (
                    <MenuItem key={siteItem.id} value={siteItem.id?.toString() || ''}>
                      {siteItem.name || 'Unknown Site'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="building-label" shrink>Building</InputLabel>
                <MuiSelect
                  labelId="building-label"
                  label="Building"
                  value={building}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingBuildings || !site}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  {buildings.map((buildingItem) => (
                    <MenuItem key={buildingItem.id} value={buildingItem.id?.toString() || ''}>
                      {buildingItem.name || 'Unknown Building'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="wing-label" shrink>Wing</InputLabel>
                <MuiSelect
                  labelId="wing-label"
                  label="Wing"
                  value={wing}
                  onChange={(e) => handleWingChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingWings || !building}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Wing</em></MenuItem>
                  {wings.map((wingItem) => (
                    <MenuItem key={wingItem.id} value={wingItem.id?.toString() || ''}>
                      {wingItem.name || 'Unknown Wing'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-label" shrink>Area</InputLabel>
                <MuiSelect
                  labelId="area-label"
                  label="Area"
                  value={area}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingAreas || !wing}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Area</em></MenuItem>
                  {areas.map((areaItem) => (
                    <MenuItem key={areaItem.id} value={areaItem.id?.toString() || ''}>
                      {areaItem.name || 'Unknown Area'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="floor-label" shrink>Floor</InputLabel>
                <MuiSelect
                  labelId="floor-label"
                  label="Floor"
                  value={floor}
                  onChange={(e) => handleFloorChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingFloors || !area}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Floor</em></MenuItem>
                  {floors.map((floorItem) => (
                    <MenuItem key={floorItem.id} value={floorItem.id?.toString() || ''}>
                      {floorItem.name || 'Unknown Floor'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="room-label" shrink>Room</InputLabel>
                <MuiSelect
                  labelId="room-label"
                  label="Room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingRooms || !floor}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Room</em></MenuItem>
                  {rooms.map((roomItem) => (
                    <MenuItem key={roomItem.id} value={roomItem.id?.toString() || ''}>
                      {roomItem.name || 'Unknown Room'}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Allocation Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Allocation</h3>
            <AllocateToSection
              allocateTo={allocationType}
              setAllocateTo={setAllocationType}
              allocatedToId={allocatedToId}
              setAllocatedToId={setAllocatedToId}
              type="Asset"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button variant="secondary" onClick={handleSubmit} className="flex-1 h-11">
              Apply
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1 h-11">
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};
