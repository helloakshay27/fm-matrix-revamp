import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  FormControlLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
  Checkbox as MuiCheckbox,
  FormLabel,
} from '@mui/material';

export const AddWaterAssetDashboard = () => {
  // Form data state (moved to the top to avoid TDZ issues)
  const [formData, setFormData] = useState({
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
    assetName: '',
    assetNo: '',
    equipmentId: '',
    modelNo: '',
    serialNo: '',
    consumerNo: '',
    purchaseCost: '',
    capacity: '',
    unit: '',
    group: '',
    subgroup: '',
    purchasedOnDate: '',
    expiryDate: '',
    manufacturer: '',
    locationType: 'common',
    assetType: 'parent',
    status: 'inUse',
    critical: 'no',
    meterApplicable: false,
    underWarranty: 'no',
    warrantyStartDate: '',
    warrantyExpiresOn: '',
    commissioningDate: '',
    selectedMeterCategories: [],
    selectedMeterCategory: '',
    boardSubCategory: '',
    renewableSubCategory: '',
    freshWaterSubCategory: '',
  });

  // Location dropdown states
  const [sites, setSites] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [wings, setWings] = useState([]);
  const [areas, setAreas] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState({
    sites: false,
    buildings: false,
    wings: false,
    areas: false,
    floors: false,
    rooms: false,
  });

  // Group/Subgroup states
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [subgroupsLoading, setSubgroupsLoading] = useState(false);

  // Fetch Sites
  const fetchSites = async () => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    setLoading((prev) => ({ ...prev, sites: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/sites.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSites(data.sites || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
    } finally {
      setLoading((prev) => ({ ...prev, sites: false }));
    }
  };

  // Fetch Buildings
  const fetchBuildings = async (siteId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!siteId) {
      setBuildings([]);
      return;
    }
    setLoading((prev) => ({ ...prev, buildings: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/sites/${siteId}/buildings.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setBuildings(data.buildings || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
    } finally {
      setLoading((prev) => ({ ...prev, buildings: false }));
    }
  };

  // Fetch Wings
  const fetchWings = async (buildingId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!buildingId) {
      setWings([]);
      return;
    }
    setLoading((prev) => ({ ...prev, wings: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/buildings/${buildingId}/wings.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // Flatten if API returns [{wings: {...}}, ...]
      let wingsArr = [];
      if (Array.isArray(data)) {
        if (data.length > 0 && data[0].wings) {
          wingsArr = data.map((item) => item.wings);
        } else {
          wingsArr = data;
        }
      }
      setWings(wingsArr);
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
    } finally {
      setLoading((prev) => ({ ...prev, wings: false }));
    }
  };

  // Fetch Areas
  const fetchAreas = async (wingId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!wingId) {
      setAreas([]);
      return;
    }
    setLoading((prev) => ({ ...prev, areas: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/wings/${wingId}/areas.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setAreas(data.areas || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setLoading((prev) => ({ ...prev, areas: false }));
    }
  };

  // Fetch Floors
  const fetchFloors = async (areaId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!areaId) {
      setFloors([]);
      return;
    }
    setLoading((prev) => ({ ...prev, floors: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/areas/${areaId}/floors.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setFloors(data.floors || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([]);
    } finally {
      setLoading((prev) => ({ ...prev, floors: false }));
    }
  };

  // Fetch Rooms
  const fetchRooms = async (floorId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!floorId) {
      setRooms([]);
      return;
    }
    setLoading((prev) => ({ ...prev, rooms: true }));
    try {
      const response = await fetch(`${baseUrl}/pms/floors/${floorId}/rooms.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoading((prev) => ({ ...prev, rooms: false }));
    }
  };

  // Fetch Groups
  const fetchGroups = async () => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    setGroupsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/pms/assets/get_asset_group_sub_group.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setGroups(data.asset_groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  };

  // Fetch Subgroups
  const fetchSubgroups = async (groupId) => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    if (!groupId) {
      setSubgroups([]);
      return;
    }
    setSubgroupsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSubgroups(data.asset_groups || []);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
      setSubgroups([]);
    } finally {
      setSubgroupsLoading(false);
    }
  };

  // Initial fetch for sites and groups
  useEffect(() => {
    fetchSites();
    fetchGroups();
  }, []);

  // Fetch buildings when site changes
  useEffect(() => {
    if (formData.site) {
      fetchBuildings(formData.site);
    } else {
      setBuildings([]);
      setFormData((f) => ({ ...f, building: '', wing: '', area: '', floor: '', room: '' }));
    }
  }, [formData.site]);

  // Fetch wings when building changes
  useEffect(() => {
    if (formData.building) {
      fetchWings(formData.building);
    } else {
      setWings([]);
      setFormData((f) => ({ ...f, wing: '', area: '', floor: '', room: '' }));
    }
  }, [formData.building]);

  // Fetch areas when wing changes
  useEffect(() => {
    if (formData.wing) {
      fetchAreas(formData.wing);
    } else {
      setAreas([]);
      setFormData((f) => ({ ...f, area: '', floor: '', room: '' }));
    }
  }, [formData.wing]);

  // Fetch floors when area changes
  useEffect(() => {
    if (formData.area) {
      fetchFloors(formData.area);
    } else {
      setFloors([]);
      setFormData((f) => ({ ...f, floor: '', room: '' }));
    }
  }, [formData.area]);

  // Fetch rooms when floor changes
  useEffect(() => {
    if (formData.floor) {
      fetchRooms(formData.floor);
    } else {
      setRooms([]);
      setFormData((f) => ({ ...f, room: '' }));
    }
  }, [formData.floor]);

  // Fetch subgroups when group changes
  useEffect(() => {
    if (formData.group) {
      fetchSubgroups(formData.group);
    } else {
      setSubgroups([]);
      setFormData((f) => ({ ...f, subgroup: '' }));
    }
  }, [formData.group]);

  const navigate = useNavigate();
  const [locationOpen, setLocationOpen] = useState(true);
  const [assetOpen, setAssetOpen] = useState(true);
  const [warrantyOpen, setWarrantyOpen] = useState(true);
  const [meterCategoryOpen, setMeterCategoryOpen] = useState(true);
  const [consumptionOpen, setConsumptionOpen] = useState(true);
  const [nonConsumptionOpen, setNonConsumptionOpen] = useState(true);
  const [attachmentsOpen, setAttachmentsOpen] = useState(true);

  const [consumptionMeasures, setConsumptionMeasures] = useState([
    {
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false,
    },
  ]);

  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([
    {
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false,
    },
  ]);

  const addConsumptionMeasure = () => {
    setConsumptionMeasures([
      ...consumptionMeasures,
      {
        name: '',
        unitType: '',
        min: '',
        max: '',
        alertBelowVal: '',
        alertAboveVal: '',
        multiplierFactor: '',
        checkPreviousReading: false,
      },
    ]);
  };

  const removeConsumptionMeasure = (index) => {
    setConsumptionMeasures(consumptionMeasures.filter((_, i) => i !== index));
  };

  const addNonConsumptionMeasure = () => {
    setNonConsumptionMeasures([
      ...nonConsumptionMeasures,
      {
        name: '',
        unitType: '',
        min: '',
        max: '',
        alertBelowVal: '',
        alertAboveVal: '',
        multiplierFactor: '',
        checkPreviousReading: false,
      },
    ]);
  };

  const removeNonConsumptionMeasure = (index) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Saving asset:', formData);
    navigate('/utility/water');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new asset:', formData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">NEW ASSET</h1>
      </div>

      <div className="space-y-4">
        {/* Location Details */}
        <Card>
          <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    LOCATION DETAILS
                  </span>
                  {locationOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.sites}>
                      <InputLabel>Site*</InputLabel>
                      <MuiSelect
                        value={formData.site}
                        label="Site*"
                        onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {sites.map((site) => (
                          <MenuItem key={site.id} value={site.id}>
                            {site.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.buildings || !formData.site}>
                      <InputLabel>Building</InputLabel>
                      <MuiSelect
                        value={formData.building}
                        label="Building"
                        onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {buildings.map((building) => (
                          <MenuItem key={building.id} value={building.id}>
                            {building.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.wings || !formData.building}>
                      <InputLabel>Wing</InputLabel>
                      <MuiSelect
                        value={formData.wing || ''}
                        label="Wing"
                        onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {wings.map((wing, idx) => (
                          <MenuItem key={wing.id || idx} value={wing.id}>
                            {wing.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.areas || !formData.wing}>
                      <InputLabel>Area</InputLabel>
                      <MuiSelect
                        value={formData.area || ''}
                        label="Area"
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {areas.map((area) => (
                          <MenuItem key={area.id} value={area.id}>
                            {area.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={loading.floors || !formData.area}>
                      <InputLabel>Floor</InputLabel>
                      <MuiSelect
                        value={formData.floor || ''}
                        label="Floor"
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {floors.map((floor) => (
                          <MenuItem key={floor.id} value={floor.id}>
                            {floor.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
                <div className="mt-4">
                  <FormControl size="small" sx={{ width: { xs: '100%', md: '20%' } }} disabled={loading.rooms || !formData.floor}>
                    <InputLabel>Room</InputLabel>
                    <MuiSelect
                      value={formData.room || ''}
                      label="Room"
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      sx={{ height: '45px' }}
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Asset Details */}
        <Card>
          <Collapsible open={assetOpen} onOpenChange={setAssetOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    ASSET DETAILS
                  </span>
                  {assetOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <TextField
                      label="Asset Name*"
                      placeholder="Enter Text"
                      value={formData.assetName}
                      onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Asset No.*"
                      placeholder="Enter Number"
                      value={formData.assetNo}
                      onChange={(e) => setFormData({ ...formData, assetNo: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Equipment ID*"
                      placeholder="Enter Number"
                      value={formData.equipmentId}
                      onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Model No."
                      placeholder="Enter Number"
                      value={formData.modelNo}
                      onChange={(e) => setFormData({ ...formData, modelNo: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Serial No."
                      placeholder="Enter Number"
                      value={formData.serialNo}
                      onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Consumer No."
                      placeholder="Enter Number"
                      value={formData.consumerNo}
                      onChange={(e) => setFormData({ ...formData, consumerNo: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Purchase Cost*"
                      placeholder="Enter Numeric value"
                      value={formData.purchaseCost}
                      onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Capacity"
                      placeholder="Enter Text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Unit"
                      placeholder="Enter Text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <FormControl fullWidth size="small" disabled={groupsLoading}>
                      <InputLabel>Group*</InputLabel>
                      <MuiSelect
                        value={formData.group}
                        label="Group*"
                        onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {groups.map((group) => (
                          <MenuItem key={group.id} value={group.id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" disabled={subgroupsLoading || !formData.group}>
                      <InputLabel>Subgroup*</InputLabel>
                      <MuiSelect
                        value={formData.subgroup}
                        label="Subgroup*"
                        onChange={(e) => setFormData({ ...formData, subgroup: e.target.value })}
                        sx={{ height: '45px' }}
                      >
                        {subgroups.map((subgroup) => (
                          <MenuItem key={subgroup.id} value={subgroup.id}>
                            {subgroup.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      label="Purchased ON Date"
                      type="date"
                      value={formData.purchasedOnDate}
                      onChange={(e) => setFormData({ ...formData, purchasedOnDate: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <TextField
                      label="Expiry date"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <FormLabel>Location Type</FormLabel>
                    <MuiRadioGroup
                      value={formData.locationType}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="common" control={<Radio />} label="Common Area" />
                      <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                      <FormControlLabel value="na" control={<Radio />} label="NA" />
                    </MuiRadioGroup>
                  </div>

                  <div>
                    <FormLabel>Asset Type</FormLabel>
                    <MuiRadioGroup
                      value={formData.assetType}
                      onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="parent" control={<Radio />} label="Parent" />
                      <FormControlLabel value="sub" control={<Radio />} label="Sub" />
                    </MuiRadioGroup>
                  </div>

                  <div>
                    <FormLabel>Status</FormLabel>
                    <MuiRadioGroup
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="inUse" control={<Radio />} label="In Use" />
                      <FormControlLabel value="breakdown" control={<Radio />} label="Breakdown" />
                    </MuiRadioGroup>
                  </div>

                  <div>
                    <FormLabel>Critical</FormLabel>
                    <MuiRadioGroup
                      value={formData.critical}
                      onChange={(e) => setFormData({ ...formData, critical: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </MuiRadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FormControlLabel
                      control={
                        <MuiCheckbox
                          checked={formData.meterApplicable}
                          onChange={(e) => setFormData({ ...formData, meterApplicable: e.target.checked })}
                        />
                      }
                      label="Meter Applicable"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Warranty Details */}
        <Card>
          <Collapsible open={warrantyOpen} onOpenChange={setWarrantyOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    Warranty Details
                  </span>
                  {warrantyOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Under Warranty</FormLabel>
                    <MuiRadioGroup
                      value={formData.underWarranty}
                      onChange={(e) => setFormData({ ...formData, underWarranty: e.target.value })}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </MuiRadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <TextField
                        label="Warranty Start Date"
                        type="date"
                        value={formData.warrantyStartDate}
                        onChange={(e) => setFormData({ ...formData, warrantyStartDate: e.target.value })}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Warranty expires on"
                        type="date"
                        value={formData.warrantyExpiresOn}
                        onChange={(e) => setFormData({ ...formData, warrantyExpiresOn: e.target.value })}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Commissioning Date"
                        type="date"
                        value={formData.commissioningDate}
                        onChange={(e) => setFormData({ ...formData, commissioningDate: e.target.value })}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Meter Category Type */}
        <Card>
          <Collapsible open={meterCategoryOpen} onOpenChange={setMeterCategoryOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    Meter Category Type
                  </span>
                  {meterCategoryOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {['Board', 'DG', 'Renewable', 'Fresh Water', 'Recycled', 'IEX-GDAM'].map((category) => (
                    <div key={category} className="flex items-center space-x-2 p-3 rounded" style={{ backgroundColor: '#f6f4ee' }}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={formData.selectedMeterCategory === category}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                selectedMeterCategory: category,
                                boardSubCategory: '',
                                renewableSubCategory: '',
                                freshWaterSubCategory: '',
                              })
                            }
                          />
                        }
                        label={category}
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                      />
                    </div>
                  ))}
                </div>

                {/* Board Sub-categories */}
                {formData.selectedMeterCategory === 'Board' && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Board Sub-categories:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['HT', 'VCB', 'Transformer', 'LT'].map((subCategory) => (
                        <div key={subCategory} className="flex items-center space-x-2 p-3 rounded" style={{ backgroundColor: '#f6f4ee' }}>
                          <FormControlLabel
                            control={
                              <Radio
                                checked={formData.boardSubCategory === subCategory}
                                onChange={() => setFormData({ ...formData, boardSubCategory: subCategory })}
                              />
                            }
                            label={subCategory}
                            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Renewable Sub-categories */}
                {formData.selectedMeterCategory === 'Renewable' && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Renewable Sub-categories:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['Solar', 'Bio Methanol', 'Wind'].map((subCategory) => (
                        <div key={subCategory} className="flex items-center space-x-2 p-3 rounded" style={{ backgroundColor: '#f6f4ee' }}>
                          <FormControlLabel
                            control={
                              <Radio
                                checked={formData.renewableSubCategory === subCategory}
                                onChange={() => setFormData({ ...formData, renewableSubCategory: subCategory })}
                              />
                            }
                            label={subCategory}
                            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fresh Water Sub-categories */}
                {formData.selectedMeterCategory === 'Fresh Water' && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Fresh Water Sub-categories:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {['Source (Input)', 'Destination (Output)'].map((subCategory) => (
                        <div key={subCategory} className="flex items-center space-x-2 p-3 rounded" style={{ backgroundColor: '#f6f4ee' }}>
                          <FormControlLabel
                            control={
                              <Radio
                                checked={formData.freshWaterSubCategory === subCategory}
                                onChange={() => setFormData({ ...formData, freshWaterSubCategory: subCategory })}
                              />
                            }
                            label={subCategory}
                            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Consumption Asset Measure */}
        <Card>
          <Collapsible open={consumptionOpen} onOpenChange={setConsumptionOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                    CONSUMPTION ASSET MEASURE
                  </span>
                  {consumptionOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {consumptionMeasures.map((measure, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded mb-4">
                    <div className="flex justify-end">
                      {index > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => removeConsumptionMeasure(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <TextField
                          label="Name"
                          placeholder="Enter Text"
                          value={measure.name}
                          onChange={(e) => {
                            const newMeasures = [...consumptionMeasures];
                            newMeasures[index].name = e.target.value;
                            setConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <FormControl fullWidth size="small">
                          <InputLabel>Unit Type</InputLabel>
                          <MuiSelect
                            value={measure.unitType}
                            label="Unit Type"
                            onChange={(e) => {
                              const newMeasures = [...consumptionMeasures];
                              newMeasures[index].unitType = e.target.value;
                              setConsumptionMeasures(newMeasures);
                            }}
                            sx={{ height: '45px' }}
                          >
                            <MenuItem value="kw">KW</MenuItem>
                            <MenuItem value="kwh">KWH</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          label="Min"
                          placeholder="Enter Number"
                          value={measure.min}
                          onChange={(e) => {
                            const newMeasures = [...consumptionMeasures];
                            newMeasures[index].min = e.target.value;
                            setConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Max"
                          placeholder="Enter Number"
                          value={measure.max}
                          onChange={(e) => {
                            const newMeasures = [...consumptionMeasures];
                            newMeasures[index].max = e.target.value;
                            setConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Alert Below Val."
                          placeholder="Enter Value"
                          value={measure.alertBelowVal}
                          onChange={(e) => {
                            const newMeasures = [...consumptionMeasures];
                            newMeasures[index].alertBelowVal = e.target.value;
                            setConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TextField
                          label="Alert Above Val."
                          placeholder="Enter Value"
                          value={measure.alertAboveVal}
                          onChange={(e) => {
                            const newMeasures = [...consumptionMeasures];
                            newMeasures[index].alertAboveVal = e.target.value;
                            setConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Multiplier Factor"
                          placeholder="Enter Text"
                          value={measure.multiplierFactor}
                          onChange={(e) => {
                            const newMeasures = [...consumptionMeasures];
                            newMeasures[index].multiplierFactor = e.target.value;
                            setConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormControlLabel
                        control={
                          <MuiCheckbox
                            checked={measure.checkPreviousReading}
                            onChange={(e) => {
                              const newMeasures = [...consumptionMeasures];
                              newMeasures[index].checkPreviousReading = e.target.checked;
                              setConsumptionMeasures(newMeasures);
                            }}
                          />
                        }
                        label="Check Previous Reading"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addConsumptionMeasure}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Non Consumption Asset Measure */}
        <Card>
          <Collapsible open={nonConsumptionOpen} onOpenChange={setNonConsumptionOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                    NON CONSUMPTION ASSET MEASURE
                  </span>
                  {nonConsumptionOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {nonConsumptionMeasures.map((measure, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded mb-4">
                    <div className="flex justify-end">
                      {index > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => removeNonConsumptionMeasure(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <TextField
                          label="Name"
                          placeholder="Name"
                          value={measure.name}
                          onChange={(e) => {
                            const newMeasures = [...nonConsumptionMeasures];
                            newMeasures[index].name = e.target.value;
                            setNonConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <FormControl fullWidth size="small">
                          <InputLabel>Unit Type</InputLabel>
                          <MuiSelect
                            value={measure.unitType}
                            label="Unit Type"
                            onChange={(e) => {
                              const newMeasures = [...nonConsumptionMeasures];
                              newMeasures[index].unitType = e.target.value;
                              setNonConsumptionMeasures(newMeasures);
                            }}
                            sx={{ height: '45px' }}
                          >
                            <MenuItem value="kw">KW</MenuItem>
                            <MenuItem value="kwh">KWH</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          label="Min"
                          placeholder="Min"
                          value={measure.min}
                          onChange={(e) => {
                            const newMeasures = [...nonConsumptionMeasures];
                            newMeasures[index].min = e.target.value;
                            setNonConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Max"
                          placeholder="Max"
                          value={measure.max}
                          onChange={(e) => {
                            const newMeasures = [...nonConsumptionMeasures];
                            newMeasures[index].max = e.target.value;
                            setNonConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Alert Below Val."
                          placeholder="Alert Below Value"
                          value={measure.alertBelowVal}
                          onChange={(e) => {
                            const newMeasures = [...nonConsumptionMeasures];
                            newMeasures[index].alertBelowVal = e.target.value;
                            setNonConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TextField
                          label="Alert Above Val."
                          placeholder="Alert Above Value"
                          value={measure.alertAboveVal}
                          onChange={(e) => {
                            const newMeasures = [...nonConsumptionMeasures];
                            newMeasures[index].alertAboveVal = e.target.value;
                            setNonConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Multiplier Factor"
                          placeholder="Multiplier Factor"
                          value={measure.multiplierFactor}
                          onChange={(e) => {
                            const newMeasures = [...nonConsumptionMeasures];
                            newMeasures[index].multiplierFactor = e.target.value;
                            setNonConsumptionMeasures(newMeasures);
                          }}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormControlLabel
                        control={
                          <MuiCheckbox
                            checked={measure.checkPreviousReading}
                            onChange={(e) => {
                              const newMeasures = [...nonConsumptionMeasures];
                              newMeasures[index].checkPreviousReading = e.target.checked;
                              setNonConsumptionMeasures(newMeasures);
                            }}
                          />
                        }
                        label="Check Previous Reading"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addNonConsumptionMeasure}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Attachments */}
        <Card>
          <Collapsible open={attachmentsOpen} onOpenChange={setAttachmentsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                    ATTACHMENTS
                  </span>
                  {attachmentsOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel className="mb-2 block">Manuals Upload</FormLabel>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center" style={{ backgroundColor: '#f6f4ee' }}>
                      <div className="text-orange-500 mb-2">Choose File</div>
                      <div className="text-gray-500 text-sm">No file chosen</div>
                      <Button variant="ghost" className="mt-2 text-orange-500">
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="mt-2">
                        <Button variant="ghost" className="text-orange-500">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <FormLabel className="mb-2 block">Insurance Details</FormLabel>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center" style={{ backgroundColor: '#f6f4ee' }}>
                      <div className="text-orange-500 mb-2">Choose File</div>
                      <div className="text-gray-500 text-sm">No file chosen</div>
                      <Button variant="ghost" className="mt-2 text-orange-500">
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="mt-2">
                        <Button variant="ghost" className="text-orange-500">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <FormLabel className="mb-2 block">Purchase Invoice</FormLabel>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center" style={{ backgroundColor: '#f6f4ee' }}>
                      <div className="text-orange-500 mb-2">Choose File</div>
                      <div className="text-gray-500 text-sm">No file chosen</div>
                      <Button variant="ghost" className="mt-2 text-orange-500">
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="mt-2">
                        <Button variant="ghost" className="text-orange-500">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <FormLabel className="mb-2 block">AMC</FormLabel>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center" style={{ backgroundColor: '#f6f4ee' }}>
                      <div className="text-orange-500 mb-2">Choose File</div>
                      <div className="text-gray-500 text-sm">No file chosen</div>
                      <Button variant="ghost" className="mt-2 text-orange-500">
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="mt-2">
                        <Button variant="ghost" className="text-orange-500">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleSave}
            className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
          >
            Save & Show Details
          </Button>
          <Button
            onClick={handleSaveAndCreateNew}
            className="bg-purple-700 text-white hover:bg-purple-800"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};