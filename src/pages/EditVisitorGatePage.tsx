import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';

interface VisitorGateData {
  id: number;
  society: string;
  tower: string;
  gateName: string;
  gateDevice: string;
  userName: string;
  status: boolean;
  active: boolean;
  createdBy: string;
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Sample data - in real app, this would come from API
  const sampleData: VisitorGateData[] = [
    {
      id: 1256,
      society: 'Zycus Infotech - Zycus Infotech Pvt Ltd',
      tower: 'GJ 07',
      gateName: 'Main Gate',
      gateDevice: '65e4bb21a04c149',
      userName: 'Security Tab 1',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    },
    {
      id: 1220,
      society: 'Arvog - Arvog Finance',
      tower: 'Trade World',
      gateName: 'Reception',
      gateDevice: '31fc5f03222bf7c5',
      userName: 'Security Tab',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    }
  ];

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    // Simulate loading data
    const loadData = () => {
      const item = sampleData.find(item => item.id === parseInt(id || '0'));
      if (item) {
        setFormData({
          site: item.society,
          user: item.userName,
          tower: item.tower,
          gateName: item.gateName,
          gateDevice: item.gateDevice,
          status: item.status,
          active: item.active
        });
      }
      setLoading(false);
    };

    setTimeout(loadData, 500); // Simulate API delay
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.site || !formData.user || !formData.tower || !formData.gateName || !formData.gateDevice) {
      toast.error('Please fill in all fields');
      return;
    }

    // Here you would typically submit to API
    toast.success('Visitor gate updated successfully');
    navigate('/security/visitor-management/setup');
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
                  >
                    <MenuItem value="">Select Site</MenuItem>
                    <MenuItem value="Zycus Infotech - Zycus Infotech Pvt Ltd">Zycus Infotech - Zycus Infotech Pvt Ltd</MenuItem>
                    <MenuItem value="Arvog - Arvog Finance">Arvog - Arvog Finance</MenuItem>
                    <MenuItem value="Lockated - Lockated HO">Lockated - Lockated HO</MenuItem>
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
                  >
                    <MenuItem value="">Select User</MenuItem>
                    <MenuItem value="Security Tab 1">Security Tab 1</MenuItem>
                    <MenuItem value="Security Tab">Security Tab</MenuItem>
                    <MenuItem value="Tech Secure">Tech Secure</MenuItem>
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
                  >
                    <MenuItem value="">Select Tower</MenuItem>
                    <MenuItem value="GJ 07">GJ 07</MenuItem>
                    <MenuItem value="Trade World">Trade World</MenuItem>
                    <MenuItem value="Jyoti Tower">Jyoti Tower</MenuItem>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-white p-4 rounded border">
                  <Label htmlFor="status">Status</Label>
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => handleInputChange('status', checked)}
                  />
                </div>

                <div className="flex items-center justify-between bg-white p-4 rounded border">
                  <Label htmlFor="active">Active</Label>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleInputChange('active', checked)}
                  />
                </div>
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