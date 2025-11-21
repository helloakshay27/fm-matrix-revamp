import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Radio,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  FormLabel
} from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddAssetAuditPage = () => {
  const navigate = useNavigate();
  const [basicDetailsExpanded, setBasicDetailsExpanded] = useState(true);
  const [auditTypeExpanded, setAuditTypeExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Redux state for sites
  const {
    sites,
    selectedSite,
    loading: siteLoading,
  } = useSelector((state: RootState) => state.site);

  // Dropdown data states
  const [users, setUsers] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [wings, setWings] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [assetGroups, setAssetGroups] = useState<any[]>([]);
  const [assetSubGroups, setAssetSubGroups] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    auditName: '',
    startDate: '',
    endDate: '',
    conductedBy: '',
    basedOn: 'Location',

    // Common fields
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    department: '',

    // Asset-specific
    assetGroup: '',
    assetSubGroup: '',
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/account_setups/get_fm_users.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };



  // Fetch Buildings
  const fetchBuildings = async (siteId: string) => {
    if (!siteId) {
      setBuildings([]);
      return;
    }

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/sites/${siteId}/buildings.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch buildings');
      const data = await response.json();
      setBuildings(Array.isArray(data.buildings) ? data.buildings : []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
    }
  };

  // Fetch Wings
  const fetchWings = async (buildingId: string) => {
    if (!buildingId) {
      setWings([]);
      return;
    }

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/buildings/${buildingId}/wings.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch wings');
      const data = await response.json();
      console.log('Wings API response:', data);

      // Handle nested structure: extract wings from array of objects
      if (Array.isArray(data) && data.length > 0 && data[0].wings) {
        const wingsArray = data.map((item: any) => item.wings);
        setWings(wingsArray);
      } else if (Array.isArray(data.wings)) {
        setWings(data.wings);
      } else {
        setWings([]);
      }
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
    }
  };

  // Fetch Areas
  const fetchAreas = async (wingId: string) => {
    if (!wingId) {
      setAreas([]);
      return;
    }

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/wings/${wingId}/areas.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch areas');
      const data = await response.json();
      setAreas(Array.isArray(data.areas) ? data.areas : []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    }
  };

  // Fetch Floors
  const fetchFloors = async (areaId: string) => {
    if (!areaId) {
      setFloors([]);
      return;
    }

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/areas/${areaId}/floors.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch floors');
      const data = await response.json();
      setFloors(Array.isArray(data.floors) ? data.floors : []);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([]);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
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
      setDepartments(Array.isArray(data.departments) ? data.departments : []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  // Fetch Asset Groups
  const fetchAssetGroups = async () => {
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
      console.log('Asset Groups Response:', data);
      setAssetGroups(Array.isArray(data.asset_groups) ? data.asset_groups : []);
    } catch (error) {
      console.error('Error fetching asset groups:', error);
      setAssetGroups([]);
    }
  };

  // Fetch Asset Subgroups
  const fetchAssetSubGroups = async (assetGroupId: string) => {
    if (!assetGroupId) {
      setAssetSubGroups([]);
      return;
    }

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(
        `https://${baseUrl}/pms/assets/get_asset_group_sub_group.json?group_id=${assetGroupId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch asset subgroups');
      const data = await response.json();
      console.log('Subgroup API Response:', data);
      // API returns subgroups with key "asset_groups" (not "asset_sub_groups")
      setAssetSubGroups(Array.isArray(data.asset_groups) ? data.asset_groups : []);
    } catch (error) {
      console.error('Error fetching asset subgroups:', error);
      setAssetSubGroups([]);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchAssetGroups();
  }, []);

  // Fetch dependent data when site changes
  useEffect(() => {
    if (formData.site) {
      fetchBuildings(formData.site);
      setFormData(prev => ({
        ...prev,
        building: '',
        wing: '',
        area: '',
        floor: '',
      }));
    } else {
      setBuildings([]);
    }
  }, [formData.site]);

  // Fetch wings when building changes
  useEffect(() => {
    if (formData.building) {
      fetchWings(formData.building);
      setFormData(prev => ({
        ...prev,
        wing: '',
        area: '',
        floor: '',
      }));
    } else {
      setWings([]);
    }
  }, [formData.building]);

  // Fetch areas when wing changes
  useEffect(() => {
    if (formData.wing) {
      fetchAreas(formData.wing);
      setFormData(prev => ({
        ...prev,
        area: '',
        floor: '',
      }));
    } else {
      setAreas([]);
    }
  }, [formData.wing]);

  // Fetch floors when area changes
  useEffect(() => {
    if (formData.area) {
      fetchFloors(formData.area);
      setFormData(prev => ({
        ...prev,
        floor: '',
      }));
    } else {
      setFloors([]);
    }
  }, [formData.area]);

  // Fetch subgroups when asset group changes
  useEffect(() => {
    if (formData.assetGroup) {
      fetchAssetSubGroups(formData.assetGroup);
      setFormData(prev => ({
        ...prev,
        assetSubGroup: '',
      }));
    } else {
      setAssetSubGroups([]);
    }
  }, [formData.assetGroup]);

  const handleSubmit = async (type: 'create' | 'saveAndCreate') => {
    // Validate required fields
    if (!formData.auditName || !formData.startDate || !formData.endDate || !formData.conductedBy) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      // Prepare the payload based on audit type
      const payload: any = {
        pms_asset_audit: {
          name: formData.auditName,
          start_date: formData.startDate,
          end_date: formData.endDate,
          conducted_by_ids: [formData.conductedBy],
          audit_type: formData.basedOn === 'Location' ? 'Location-based' : 'Asset-based',
          site_ids: formData.site ? [formData.site] : [],
          building_ids: formData.building ? [formData.building] : [],
          wing_ids: formData.wing ? [formData.wing] : [],
          area_ids: formData.area ? [formData.area] : [],
          floor_ids: formData.floor ? [formData.floor] : [],
          department_ids: formData.department ? [formData.department] : [],
          asset_group_ids: formData.assetGroup ? [formData.assetGroup] : [],
          asset_sub_group_ids: formData.assetSubGroup ? [formData.assetSubGroup] : [],
        }
      };

      const response = await fetch(`https://${baseUrl}/pms/asset_audits.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create audit');
      }

      const result = await response.json();

      // Check if response contains an error message
      if (result.message && result.message.includes('No Asset found')) {
        toast.error(result.message);
        setIsLoading(false);
        return;
      }

      toast.success('Audit created successfully');

      // If "Save And Create New", reset form
      if (type === 'saveAndCreate') {
        setFormData({
          auditName: '',
          startDate: '',
          endDate: '',
          conductedBy: '',
          basedOn: 'Location',
          site: '',
          building: '',
          wing: '',
          area: '',
          floor: '',
          department: '',
          assetGroup: '',
          assetSubGroup: '',
        });
      } else {
        // Navigate back to list page
        navigate('/maintenance/audit/assets');
      }
    } catch (error: any) {
      console.error('Error creating audit:', error);
      toast.error(error.message || 'Failed to create audit');
    } finally {
      setIsLoading(false);
    }
  };

  const Dropdown = ({
    name,
    label,
    values,
  }: {
    name: string;
    label: string;
    values: any[];
  }) => (
    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
      <InputLabel shrink>{label}</InputLabel>
      <MuiSelect
        label={label}
        displayEmpty
        value={formData[name as keyof typeof formData]}
        onChange={(e) => updateFormData(name, e.target.value)}
        sx={fieldStyles}
      >
        <MenuItem value=""><em>Select...</em></MenuItem>
        {values.map((item) => (
          <MenuItem key={item.id} value={String(item.id)}>
            {item.name ||
              item.department_name ||
              (item.firstname && item.lastname ? `${item.firstname} ${item.lastname}` : null) ||
              (item.first_name && item.last_name ? `${item.first_name} ${item.last_name}` : null) ||
              'N/A'}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );

  // -------------------------------
  // FIELD ARRANGEMENT BASED ON RADIO
  // -------------------------------

  const assetModeFields = [
    { name: 'assetGroup', label: 'Asset Group*', values: assetGroups },
    { name: 'assetSubGroup', label: 'Subgroup', values: assetSubGroups },
    { name: 'site', label: 'Site*', values: sites },
    { name: 'building', label: 'Building*', values: buildings },
    { name: 'wing', label: 'Wing*', values: wings },
    { name: 'area', label: 'Area*', values: areas },
    { name: 'floor', label: 'Floor*', values: floors },
    { name: 'department', label: 'Department*', values: departments },
  ];

  const locationModeFields = [
    { name: 'site', label: 'Site*', values: sites },
    { name: 'building', label: 'Building*', values: buildings },
    { name: 'wing', label: 'Wing*', values: wings },
    { name: 'area', label: 'Area*', values: areas },
    { name: 'floor', label: 'Floor*', values: floors },
    { name: 'department', label: 'Department*', values: departments },
    { name: 'assetGroup', label: 'Asset Group*', values: assetGroups },
    { name: 'assetSubGroup', label: 'Asset Subgroup*', values: assetSubGroups },
  ];

  const fieldsToRender =
    formData.basedOn === 'Asset' ? assetModeFields : locationModeFields;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">NEW AUDIT</h1>

      <div className="space-y-6">

        {/* BASIC DETAILS */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div
            className="flex items-center justify-between p-4 cursor-pointer border-b"
            onClick={() => setBasicDetailsExpanded(!basicDetailsExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                <span className="text-white text-sm">1</span>
              </div>
              <h2 className="text-lg font-semibold text-[#C72030]">BASIC DETAILS</h2>
            </div>
            {basicDetailsExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>

          {basicDetailsExpanded && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                {/* Audit Name */}
                <TextField
                  label="Audit Name *"
                  value={formData.auditName}
                  onChange={(e) => updateFormData('auditName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />

                {/* Start Date */}
                <TextField
                  label="Start Date *"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />

                {/* End Date */}
                <TextField
                  label="End Date *"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateFormData('endDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />

                {/* Conducted By */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Conducted By *</InputLabel>
                  <MuiSelect
                    label="Conducted By *"
                    displayEmpty
                    value={formData.conductedBy}
                    onChange={(e) => updateFormData('conductedBy', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Person</em></MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={String(user.id)}>
                        {user.firstname} {user.lastname}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

              </div>
            </div>
          )}
        </div>

        {/* AUDIT TYPE */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div
            className="flex items-center justify-between p-4 cursor-pointer border-b"
            onClick={() => setAuditTypeExpanded(!auditTypeExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                <span className="text-white text-sm">2</span>
              </div>
              <h2 className="text-lg font-semibold text-[#C72030]">AUDIT TYPE</h2>
            </div>
            {auditTypeExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>

          {auditTypeExpanded && (
            <div className="p-4 sm:p-6">
              {/* Radio */}
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Based On</FormLabel>
                <MuiRadioGroup
                  value={formData.basedOn}
                  onChange={(e) => updateFormData('basedOn', e.target.value)}
                  row
                >
                  <FormControlLabel value="Location" control={<Radio />} label="Location" />
                  <FormControlLabel value="Asset" control={<Radio />} label="Asset" />
                </MuiRadioGroup>
              </FormControl>

              {/* Dynamic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {fieldsToRender.map((item, idx) => (
                  <Dropdown
                    key={idx}
                    name={item.name}
                    label={item.label}
                    values={item.values}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4">
          <Button
            className="bg-[#C72030] text-white px-6"
            onClick={() => handleSubmit('create')}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Audit'}
          </Button>

          <Button
            variant="outline"
            className="border-gray-300 px-6"
            onClick={() => handleSubmit('saveAndCreate')}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save And Create New Audit'}
          </Button>
        </div>
      </div>
    </div>
  );
};
