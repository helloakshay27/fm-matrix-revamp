
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomTextField } from '@/components/ui/custom-text-field';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TextField, MenuItem } from '@mui/material';

export const EditAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addressData = location.state?.addressData;

  const [formData, setFormData] = useState({
    addressTitle: '',
    buildingName: '',
    email: '',
    state: '',
    phoneNumber: '',
    faxNumber: '',
    panNumber: '',
    gstNumber: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (addressData) {
      setFormData({
        addressTitle: addressData.title || '',
        buildingName: addressData.buildingName || '',
        email: addressData.email || '',
        state: addressData.state || '',
        phoneNumber: addressData.phoneNumber || '',
        faxNumber: addressData.fax || '',
        panNumber: '',
        gstNumber: addressData.gstNo || '',
        address: '',
        notes: ''
      });
    }
  }, [addressData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Updating address:', formData);
    navigate('/settings/masters/address');
  };

  const handleBack = () => {
    navigate('/settings/masters/address');
  };

  const states = [
    'Maharashtra',
    'Gujarat', 
    'Karnataka',
    'Tamil Nadu',
    'Rajasthan',
    'Uttar Pradesh'
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="p-0 h-auto hover:bg-transparent"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">ADDRESSES</h1>
      </div>

      <Card className="bg-white shadow-sm max-w-6xl mx-auto">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg font-medium text-[#C72030] flex items-center gap-2">
              <span className="w-5 h-5 md:w-6 md:h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold">
                2
              </span>
              ADDRESS SETUP
            </CardTitle>
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          {/* First Row: Address Title, Building Name, Email, State, Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="space-y-2">
              <CustomTextField
                label="Address Title*"
                placeholder="Enter Address Title"
                value={formData.addressTitle}
                onChange={(e) => handleInputChange('addressTitle', e.target.value)}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <CustomTextField
                label="Building Name*"
                placeholder="Enter Building Name"
                value={formData.buildingName}
                onChange={(e) => handleInputChange('buildingName', e.target.value)}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <CustomTextField
                label="Email*"
                type="email"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <TextField
                select
                label="State*"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Select State"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '56px',
                    '& fieldset': {
                      borderColor: '#ccc',
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
                }}
              >
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="space-y-2">
              <CustomTextField
                label="Phone Number*"
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                fullWidth
              />
            </div>
          </div>

          {/* Second Row: Fax Number, Pan Number, GST Number, Address, Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="space-y-2">
              <CustomTextField
                label="Fax Number*"
                placeholder="Enter Fax Number"
                value={formData.faxNumber}
                onChange={(e) => handleInputChange('faxNumber', e.target.value)}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <CustomTextField
                label="Pan Number*"
                placeholder="Enter PAN Number"
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value)}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <CustomTextField
                label="GST Number*"
                placeholder="Enter GST Number"
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <CustomTextField
                label="Address*"
                placeholder="Enter Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
            </div>

            <div className="space-y-2">
              <CustomTextField
                label="Notes*"
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
            </div>
          </div>

          <div className="flex justify-center pt-4 md:pt-6">
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
