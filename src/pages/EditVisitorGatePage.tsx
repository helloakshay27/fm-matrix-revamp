import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';
import { ticketManagementAPI } from '../services/ticketManagementAPI';

interface VisitorGateData {
  id: number;
  society_id: number;
  gate_name: string;
  gate_device: string;
  active: number;
  approve: number;
  approved_by: number;
  society_block_id: number | null;
  resource_type: string;
  resource_id: number;
  user_id: number | null;
  building_id: number | null;
  created_at: string;
  updated_at: string;
  resource: {
    type: string;
    id: number;
    name: string | null;
  };
  society: {
    id: number;
    name: string;
  };
  user: {
    id: number | null;
    name: string | null;
  };
  created_by: {
    id: number;
    name: string;
  };
  society_block: {
    id: number | null;
    name: string | null;
  };
  building: {
    id: number | null;
    name: string | null;
  };
  qr_image_url: string;
}

export const EditVisitorGatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setCurrentSection } = useLayout();
  const [loading, setLoading] = useState(true);

  // Field styles for Material-UI components
  const fieldStyles = {
    height: '45px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      height: '45px',
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#C72030',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  const [formData, setFormData] = useState({
    site: '',
    user: '',
    tower: '',
    gateName: '',
    gateDevice: '',
    status: true,
    active: true
  });

  // Sites data state
  const [sites, setSites] = useState<Array<{id: number, name: string}>>([]);
  const [loadingSites, setLoadingSites] = useState(false);

  // Users data state
  const [users, setUsers] = useState<Array<{id: number, full_name: string}>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Buildings data state
  const [buildings, setBuildings] = useState<Array<{id: number, name: string}>>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get current user ID (you may need to adjust this based on your auth system)
  const getCurrentUserId = () => {
    // This should be replaced with your actual user ID retrieval logic
    // For example, from localStorage, Redux store, or context
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id || '87989'; // fallback to the example ID
    }
    return '87989'; // fallback ID
  };

  // Fetch sites from API
  const fetchSites = useCallback(async () => {
    try {
      setLoadingSites(true);
      const userId = getCurrentUserId();
      const response = await ticketManagementAPI.getSites(userId);
      
      console.log('Sites API response:', response);
      
      if (response && response.sites) {
        setSites(response.sites);
      } else {
        console.error('Invalid sites response format:', response);
        setSites([]);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
      toast.error('Failed to load sites. Please try again.');
      setSites([]);
    } finally {
      setLoadingSites(false);
    }
  }, []);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const response = await ticketManagementAPI.getEscalationUsers();
      
      console.log('Users API response:', response);
      
      if (response && response.users) {
        setUsers(response.users);
      } else {
        console.error('Invalid users response format:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch buildings from API
  const fetchBuildings = useCallback(async () => {
    try {
      setLoadingBuildings(true);
      const response = await ticketManagementAPI.getBuildings();
      
      console.log('Buildings API response:', response);
      
      if (Array.isArray(response)) {
        setBuildings(response);
      } else {
        console.error('Invalid buildings response format:', response);
        setBuildings([]);
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast.error('Failed to load buildings. Please try again.');
      setBuildings([]);
    } finally {
      setLoadingBuildings(false);
    }
  }, []);


  useEffect(() => {
    setCurrentSection('Settings');
    fetchSites();
    fetchUsers();
    fetchBuildings();
  }, [setCurrentSection, fetchSites, fetchUsers, fetchBuildings]);

  // Fetch gate data by ID
  const fetchGateData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching gate data for ID:', id);
      const response = await ticketManagementAPI.getSocietyGateById(id);
      console.log('Gate data response:', response);
      
      if (response) {
        setFormData({
          site: response.resource_id ? response.resource_id.toString() : '',
          user: response.user_id ? response.user_id.toString() : '',
          tower: response.building_id ? response.building_id.toString() : '',
          gateName: response.gate_name || '',
          gateDevice: response.gate_device || '',
          status: response.active === 1,
          active: response.approve === 1
        });
      }
    } catch (error) {
      console.error('Error fetching gate data:', error);
      toast.error('Failed to load gate data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Only fetch gate data after all dropdown APIs are complete
    if (!loadingSites && !loadingUsers && !loadingBuildings) {
      fetchGateData();
    }
  }, [fetchGateData, loadingSites, loadingUsers, loadingBuildings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.site || !formData.user || !formData.tower || !formData.gateName || !formData.gateDevice) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Prepare API payload
      const gatePayload = {
        gate_name: formData.gateName,
        gate_device: formData.gateDevice,
        resource_id: parseInt(formData.site), // Site ID
        building_id: formData.tower ? parseInt(formData.tower) : undefined, // Tower/Building ID
        user_id: formData.user ? parseInt(formData.user) : undefined, // User ID
      };

      console.log('Updating gate data:', gatePayload);
      
      // Call the update API
      const response = await ticketManagementAPI.updateSocietyGate(id!, gatePayload);
      console.log('Update response:', response);
      
      toast.success('Visitor gate updated successfully!');
      navigate('/security/visitor-management/setup');
      
    } catch (error) {
      console.error('Error updating visitor gate:', error);
      toast.error('Failed to update visitor gate. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/security/visitor-management/setup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/security/visitor-management/setup')}
            className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gate Configuration Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#F2EEE9] border-b border-gray-200 flex items-center">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </div>
              <h2 className="text-lg font-semibold text-gray-900">GATE CONFIGURATION</h2>
            </div>
            <div className="p-6 space-y-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Site</InputLabel>
                  <MuiSelect
                    value={formData.site}
                    onChange={(e) => handleInputChange('site', e.target.value)}
                    label="Site"
                    notched
                    displayEmpty
                    disabled={loadingSites}
                  >
                    <MenuItem value="">
                      {loadingSites ? 'Loading sites...' : 'Select Site'}
                    </MenuItem>
                    {sites.map((site) => (
                      <MenuItem key={site.id} value={site.id.toString()}>
                        {site.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>User</InputLabel>
                  <MuiSelect
                    value={formData.user}
                    onChange={(e) => handleInputChange('user', e.target.value)}
                    label="User"
                    notched
                    displayEmpty
                    disabled={loadingUsers}
                  >
                    <MenuItem value="">
                      {loadingUsers ? 'Loading users...' : 'Select User'}
                    </MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id.toString()}>
                        {user.full_name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Tower</InputLabel>
                  <MuiSelect
                    value={formData.tower}
                    onChange={(e) => handleInputChange('tower', e.target.value)}
                    label="Tower"
                    notched
                    displayEmpty
                    disabled={loadingBuildings}
                  >
                    <MenuItem value="">
                      {loadingBuildings ? 'Loading towers...' : 'Select Tower'}
                    </MenuItem>
                    {buildings.map((building) => (
                      <MenuItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Gate Name"
                  placeholder="Enter gate name"
                  value={formData.gateName}
                  onChange={(e) => handleInputChange('gateName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  InputProps={{
                    sx: fieldStyles,
                  }}
                />

                <TextField
                  label="Gate Device"
                  placeholder="Enter gate device"
                  value={formData.gateDevice}
                  onChange={(e) => handleInputChange('gateDevice', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  InputProps={{
                    sx: fieldStyles,
                  }}
                />
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="px-12 py-3 bg-[#C72030] hover:bg-[#A01928] text-white font-medium"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};