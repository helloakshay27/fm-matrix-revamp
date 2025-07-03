
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

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
  
  const [formData, setFormData] = useState({
    auditName: '',
    startDate: '',
    endDate: '',
    conductedBy: '',
    basedOn: 'Location',
    site: '',
    building: '',
    department: '',
    assetGroup: '',
    assetSubGroup: ''
  });

  const handleSubmit = (type: 'create' | 'saveAndCreate') => {
    if (!formData.auditName || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    console.log('Audit form submitted:', formData);
    
    if (type === 'create') {
      toast.success('Audit created successfully!');
      navigate('/maintenance/audit/assets');
    } else {
      toast.success('Audit saved and ready for new audit!');
      // Reset form for new audit
      setFormData({
        auditName: '',
        startDate: '',
        endDate: '',
        conductedBy: '',
        basedOn: 'Location',
        site: '',
        building: '',
        department: '',
        assetGroup: '',
        assetSubGroup: ''
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          Audit &gt; Create New Audit
        </div>

        <h1 className="text-2xl font-bold mb-6">NEW AUDIT</h1>

        <div className="space-y-6">
          {/* Basic Details Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer border-b"
              onClick={() => setBasicDetailsExpanded(!basicDetailsExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">1</span>
                </div>
                <h2 className="text-lg font-semibold text-blue-600">BASIC DETAILS</h2>
              </div>
              {basicDetailsExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>

            {basicDetailsExpanded && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="auditName" className="text-sm font-medium">
                      Audit Name<span className="text-red-500">*</span>
                    </Label>
                    <TextField
                      id="auditName"
                      value={formData.auditName}
                      onChange={(e) => updateFormData('auditName', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      Start Date<span className="text-red-500">*</span>
                    </Label>
                    <TextField
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData('startDate', e.target.value)}
                      placeholder="dd-mm-yyyy"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      End Date<span className="text-red-500">*</span>
                    </Label>
                    <TextField
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateFormData('endDate', e.target.value)}
                      placeholder="dd-mm-yyyy"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="conductedBy" className="text-sm font-medium">
                      Conducted By<span className="text-red-500">*</span>
                    </Label>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                      <InputLabel id="conducted-by-label" shrink>Select</InputLabel>
                      <MuiSelect
                        labelId="conducted-by-label"
                        label="Select"
                        displayEmpty
                        value={formData.conductedBy}
                        onChange={(e) => updateFormData('conductedBy', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        <MenuItem value="abhishek">Abhishek Sharma</MenuItem>
                        <MenuItem value="abdul">Abdul Ghaffar</MenuItem>
                        <MenuItem value="vinayak">Vinayak Mane</MenuItem>
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
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">2</span>
                </div>
                <h2 className="text-lg font-semibold text-blue-600">Audit Type</h2>
              </div>
              {auditTypeExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>

            {auditTypeExpanded && (
              <div className="p-6">
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    Based On<span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.basedOn}
                    onValueChange={(value) => updateFormData('basedOn', value)}
                    className="flex gap-6"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div>
                    <Label htmlFor="site" className="text-sm font-medium">
                      Site<span className="text-red-500">*</span>
                    </Label>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                      <InputLabel id="site-label" shrink>Select...</InputLabel>
                      <MuiSelect
                        labelId="site-label"
                        label="Select..."
                        displayEmpty
                        value={formData.site}
                        onChange={(e) => updateFormData('site', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select...</em></MenuItem>
                        <MenuItem value="site1">Site 1</MenuItem>
                        <MenuItem value="site2">Site 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <Label htmlFor="building" className="text-sm font-medium">
                      Building<span className="text-red-500">*</span>
                    </Label>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                      <InputLabel id="building-label" shrink>Select...</InputLabel>
                      <MuiSelect
                        labelId="building-label"
                        label="Select..."
                        displayEmpty
                        value={formData.building}
                        onChange={(e) => updateFormData('building', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select...</em></MenuItem>
                        <MenuItem value="building1">Building 1</MenuItem>
                        <MenuItem value="building2">Building 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <Label htmlFor="department" className="text-sm font-medium">
                      Department<span className="text-red-500">*</span>
                    </Label>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                      <InputLabel id="department-label" shrink>Select...</InputLabel>
                      <MuiSelect
                        labelId="department-label"
                        label="Select..."
                        displayEmpty
                        value={formData.department}
                        onChange={(e) => updateFormData('department', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select...</em></MenuItem>
                        <MenuItem value="it">IT</MenuItem>
                        <MenuItem value="facilities">Facilities</MenuItem>
                        <MenuItem value="security">Security</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <Label htmlFor="assetGroup" className="text-sm font-medium">
                      Asset Group<span className="text-red-500">*</span>
                    </Label>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                      <InputLabel id="asset-group-label" shrink>Select...</InputLabel>
                      <MuiSelect
                        labelId="asset-group-label"
                        label="Select..."
                        displayEmpty
                        value={formData.assetGroup}
                        onChange={(e) => updateFormData('assetGroup', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select...</em></MenuItem>
                        <MenuItem value="group1">Group 1</MenuItem>
                        <MenuItem value="group2">Group 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <Label htmlFor="assetSubGroup" className="text-sm font-medium">
                      Asset SubGroup<span className="text-red-500">*</span>
                    </Label>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                      <InputLabel id="asset-subgroup-label" shrink>Select...</InputLabel>
                      <MuiSelect
                        labelId="asset-subgroup-label"
                        label="Select..."
                        displayEmpty
                        value={formData.assetSubGroup}
                        onChange={(e) => updateFormData('assetSubGroup', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select...</em></MenuItem>
                        <MenuItem value="subgroup1">SubGroup 1</MenuItem>
                        <MenuItem value="subgroup2">SubGroup 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => handleSubmit('create')}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
            >
              Create Audit
            </Button>
            <Button 
              onClick={() => handleSubmit('saveAndCreate')}
              variant="outline"
              className="border-gray-300 px-8"
            >
              Save And Create New Audit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
