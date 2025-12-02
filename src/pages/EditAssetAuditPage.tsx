import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const EditAssetAuditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [basicDetailsExpanded, setBasicDetailsExpanded] = useState(true);
  const [auditTypeExpanded, setAuditTypeExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redux state for sites
  const { sites } = useSelector((state: RootState) => state.site);

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
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    department: '',
    assetGroup: '',
    assetSubGroup: ''
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Fetch Audit Data
  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/asset_audits/${id}.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch audit data');
      const data = await response.json();

      // Helper function to safely get first ID from various formats
      const getFirstId = (value: any): string => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (Array.isArray(value) && value.length > 0) return String(value[0]);
        return '';
      };

      // Determine based_on from the data (default to Location if not specified)
      let basedOn = 'Location';
      if (data.based_on) {
        basedOn = data.based_on === 'location' ? 'Location' : 'Asset';
      }

      const auditFormData = {
        auditName: data.name || '',
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        conductedBy: getFirstId(data.conducted_by_ids),
        basedOn: basedOn,
        site: getFirstId(data.site_ids),
        building: getFirstId(data.building_ids),
        wing: getFirstId(data.wing_ids),
        area: getFirstId(data.area_ids),
        floor: getFirstId(data.floor_ids),
        department: getFirstId(data.department_ids),
        assetGroup: getFirstId(data.asset_group_ids),
        assetSubGroup: getFirstId(data.asset_sub_group_ids)
      };

      console.log('Fetched audit data:', data);
      console.log('Mapped form data:', auditFormData);

      setFormData(auditFormData);

      // Trigger fetches for dependent dropdowns if IDs exist
      if (auditFormData.site) {
        fetchBuildings(auditFormData.site);
      }
      if (auditFormData.building) {
        fetchWings(auditFormData.building);
      }
      if (auditFormData.wing) {
        fetchAreas(auditFormData.wing);
      }
      if (auditFormData.area) {
        fetchFloors(auditFormData.area);
      }
      if (auditFormData.assetGroup) {
        fetchAssetSubGroups(auditFormData.assetGroup);
      }
    } catch (error) {
      console.error('Error fetching audit data:', error);
      toast.error('Failed to load audit data');
    } finally {
      setLoading(false);
    }
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
      setAssetSubGroups(Array.isArray(data.asset_groups) ? data.asset_groups : []);
    } catch (error) {
      console.error('Error fetching asset subgroups:', error);
      setAssetSubGroups([]);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    if (id) {
      fetchAuditData();
      fetchUsers();
      fetchDepartments();
      fetchAssetGroups();
    }
  }, [id]);

  // Fetch dependent data when site changes
  useEffect(() => {
    if (formData.site) {
      fetchBuildings(formData.site);
    } else {
      setBuildings([]);
      setFormData(prev => ({
        ...prev,
        building: '',
        wing: '',
        area: '',
        floor: '',
      }));
    }
  }, [formData.site]);

  // Fetch wings when building changes
  useEffect(() => {
    if (formData.building) {
      fetchWings(formData.building);
    } else {
      setWings([]);
      setFormData(prev => ({
        ...prev,
        wing: '',
        area: '',
        floor: '',
      }));
    }
  }, [formData.building]);

  // Fetch areas when wing changes
  useEffect(() => {
    if (formData.wing) {
      fetchAreas(formData.wing);
    } else {
      setAreas([]);
      setFormData(prev => ({
        ...prev,
        area: '',
        floor: '',
      }));
    }
  }, [formData.wing]);

  // Fetch floors when area changes
  useEffect(() => {
    if (formData.area) {
      fetchFloors(formData.area);
    } else {
      setFloors([]);
      setFormData(prev => ({
        ...prev,
        floor: '',
      }));
    }
  }, [formData.area]);

  // Fetch subgroups when asset group changes
  useEffect(() => {
    if (formData.assetGroup) {
      fetchAssetSubGroups(formData.assetGroup);
    } else {
      setAssetSubGroups([]);
      setFormData(prev => ({
        ...prev,
        assetSubGroup: '',
      }));
    }
  }, [formData.assetGroup]);

  const handleSubmit = async () => {
    if (!formData.auditName || !formData.startDate || !formData.endDate || !formData.conductedBy) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      // Helper function to convert form field to array or empty array
      const toArray = (value: string) => {
        return value ? [value] : [];
      };

      const payload: any = {
        pms_asset_audit: {
          name: formData.auditName,
          start_date: formData.startDate,
          end_date: formData.endDate,
          conducted_by_ids: formData.conductedBy,
          audit_type: formData.basedOn === 'Location' ? 'Location-based' : 'Asset-based',
          pms_site_id: formData.site || null,
          site_ids: toArray(formData.site),
          building_ids: toArray(formData.building),
          wing_ids: toArray(formData.wing),
          area_ids: toArray(formData.area),
          floor_ids: toArray(formData.floor),
          department_ids: toArray(formData.department),
          asset_group_ids: toArray(formData.assetGroup),
          asset_sub_group_ids: toArray(formData.assetSubGroup),
        }
      };

      console.log('Update payload:', payload);

      const response = await fetch(`https://${baseUrl}/pms/asset_audits/${id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update audit');
      }

      const result = await response.json();
      console.log('Update response:', result);

      toast.success('Audit updated successfully!');
      navigate(`/maintenance/audit/assets/details/${id}`);
    } catch (error: any) {
      console.error('Error updating audit:', error);
      toast.error(error.message || 'Failed to update audit');
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

  // Field arrangement based on radio selection
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading audit data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">EDIT AUDIT</h1>
      </div>

      <div className="space-y-6">
        {/* Basic Details Section */}
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
                <div>
                  <Label className="text-sm font-medium">
                    Audit Name<span className="text-red-500">*</span>
                  </Label>
                  <TextField
                    value={formData.auditName}
                    onChange={(e) => updateFormData('auditName', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <Label className="text-sm font-medium">
                    Start Date<span className="text-red-500">*</span>
                  </Label>
                  <TextField
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />
                </div>

                {/* End Date */}
                <div>
                  <Label className="text-sm font-medium">
                    End Date<span className="text-red-500">*</span>
                  </Label>
                  <TextField
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />
                </div>

                {/* Conducted By */}
                <div>
                  <Label className="text-sm font-medium">
                    Conducted By<span className="text-red-500">*</span>
                  </Label>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Select User</InputLabel>
                    <MuiSelect
                      label="Select User"
                      displayEmpty
                      value={formData.conductedBy}
                      onChange={(e) => updateFormData('conductedBy', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select...</em></MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={String(user.id)}>
                          {(user.firstname && user.lastname
                            ? `${user.firstname} ${user.lastname}`
                            : user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : 'N/A')}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audit Type Section */}
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
              {/* Radio Group */}
              <RadioGroup
                value={formData.basedOn}
                onValueChange={(value) => updateFormData('basedOn', value)}
                className="flex gap-6 mb-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Location" id="location" />
                  <Label htmlFor="location">Location</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Asset" id="asset" />
                  <Label htmlFor="asset">Asset</Label>
                </div>
              </RadioGroup>

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

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Audit'}
          </Button>
        </div>
      </div>
    </div>
  );
};
