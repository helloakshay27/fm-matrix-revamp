import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem
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

  const handleBack = () => {
    navigate(-1);
  };

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
      <div className="p-4 sm:p-6 md:p-8 mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
          <button
            onClick={handleBack}
            className="flex items-center hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
          NEW AUDIT
        </h1>

        <div className="space-y-6">
          {/* Basic Details */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div
              className="flex items-center justify-between p-4 cursor-pointer border-b"
              onClick={() => setBasicDetailsExpanded(!basicDetailsExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">1</span>
                </div>
                <h2 className="text-base md:text-lg font-semibold text-[#C72030] uppercase">BASIC DETAILS</h2>
              </div>
              {basicDetailsExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>

            {basicDetailsExpanded && (
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />
                  </div>

                  <div>
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

          {/* Audit Type */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div
              className="flex items-center justify-between p-4 cursor-pointer border-b"
              onClick={() => setAuditTypeExpanded(!auditTypeExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">2</span>
                </div>
                <h2 className="text-base md:text-lg font-semibold text-[#C72030]">Audit Type</h2>
              </div>
              {auditTypeExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>

            {auditTypeExpanded && (
              <div className="p-4 sm:p-6">
                <RadioGroup
                  value={formData.basedOn}
                  onValueChange={(value) => updateFormData('basedOn', value)}
                  className="flex flex-wrap gap-6 mb-6"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'site', values: ['Site 1', 'Site 2'] },
                    { label: 'building', values: ['Building 1', 'Building 2'] },
                    { label: 'department', values: ['IT', 'Facilities', 'Security'] },
                    { label: 'assetGroup', values: ['Group 1', 'Group 2'] },
                    { label: 'assetSubGroup', values: ['SubGroup 1', 'SubGroup 2'] }
                  ].map((field, index) => (
                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} key={index}>
                      <InputLabel id={`${field.label}-label`} shrink>Select...</InputLabel>
                      <MuiSelect
                        labelId={`${field.label}-label`}
                        label="Select..."
                        displayEmpty
                        value={formData[field.label as keyof typeof formData]}
                        onChange={(e) => updateFormData(field.label, e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select...</em></MenuItem>
                        {field.values.map((val, idx) => (
                          <MenuItem key={idx} value={val.toLowerCase().replace(/\s+/g, '')}>
                            {val}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleSubmit('create')}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
            >
              Create Audit
            </Button>
            <Button
              onClick={() => handleSubmit('saveAndCreate')}
              variant="outline"
              className="border-gray-300 px-6"
            >
              Save And Create New Audit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
