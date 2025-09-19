import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';
import { ticketManagementAPI } from '../services/ticketManagementAPI';

export const AddVisitorGatePage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  
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
        borderColor: '#999696ff',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#000000', // Keep label text black
      '&.Mui-focused': {
        color: '#C72030',
      },
      '& .MuiInputLabel-asterisk': {
        color: '#ff0000 !important', // Only asterisk red
      },
    },
    '& .MuiFormLabel-asterisk': {
      color: '#ff0000 !important', // Only asterisk red
    },
  };
  
  const [formData, setFormData] = useState({
    site: '',
    user: '',
    tower: '',
    gateName: '',
    gateDevice: ''
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for required fields with specific toast messages
    if (!formData.site) {
      toast.error('Please select a site');
      return;
    }
    
    if (!formData.user) {
      toast.error('Please select a user');
      return;
    }
    
    if (!formData.tower) {
      toast.error('Please select a tower');
      return;
    }
    
    if (!formData.gateName.trim()) {
      toast.error('Please enter gate name');
      return;
    }
    
    if (!formData.gateDevice.trim()) {
      toast.error('Please enter gate device ID');
      return;
    }

    try {
      // Prepare API payload
      const gatePayload = {
        gate_name: formData.gateName,
        gate_device: formData.gateDevice,
        resource_id: parseInt(formData.site), // Site ID
        building_id: parseInt(formData.tower), // Tower/Building ID
        user_id: parseInt(formData.user), // User ID
        type: 'quikgate' // Default type as specified
      };

      console.log('Submitting gate data:', gatePayload);
      
      // Call API to create society gate
      const response = await ticketManagementAPI.createSocietyGate(gatePayload);
      
      console.log('API response:', response);
      toast.success('Visitor gate added successfully!');
      
      // Reset form
      setFormData({
        site: '',
        user: '',
        tower: '',
        gateName: '',
        gateDevice: ''
      });
      
      // Navigate to visitor management setup page
      navigate('/settings/visitor-management/setup');
      
    } catch (error) {
      console.error('Error creating visitor gate:', error);
      toast.error('Failed to add visitor gate. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/settings/visitor-management/setup')}
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
              <h2 className="text-lg font-semibold text-gray-900">TAB CONFIGURATION</h2>
            </div>
            <div className="p-6 space-y-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormControl
                  fullWidth
                  variant="outlined"
                 
                  sx={fieldStyles}
                >
                  <InputLabel shrink required>Site</InputLabel>
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
                  
                 sx={fieldStyles}
                >
                  <InputLabel shrink required>User</InputLabel>
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
                
                   sx={fieldStyles}
                >
                  <InputLabel shrink required>Tower</InputLabel>
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
                 
                  InputLabelProps={{ shrink: true, required: true }}
                  sx={fieldStyles}
                />

                <TextField
                  label="Gate Device ID"
                  placeholder="Enter gate device ID"
                  value={formData.gateDevice}
                  onChange={(e) => handleInputChange('gateDevice', e.target.value)}
                  fullWidth
                  variant="outlined"
                
                  InputLabelProps={{ shrink: true, required: true }}
                  sx={fieldStyles}
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
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};