
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddPermitPage = () => {
  const navigate = useNavigate();
  const [permitData, setPermitData] = useState({
    // Requestor Details
    name: 'Ankit Gupta',
    contactNumber: '91 7388997281',
    department: '',
    unit: '',
    site: 'Lockated',
    
    // Basic Details
    permitFor: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
    clientSpecific: 'Internal',
    copyTo: '',
    
    // Permit Details
    permitType: '',
    permitDescription: '',
    activity: '',
    subActivity: '',
    categoryOfHazards: '',
    risks: '',
    vendor: '',
    comment: '',
    
    // Attachments
    attachments: null as File | null
  });

  const [activities, setActivities] = useState([
    { activity: '', subActivity: '', categoryOfHazards: '' }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setPermitData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPermitData(prev => ({
        ...prev,
        attachments: file
      }));
      toast.success('File uploaded successfully');
    }
  };

  const handleAddActivity = () => {
    setActivities(prev => [...prev, { activity: '', subActivity: '', categoryOfHazards: '' }]);
  };

  const handleRemoveActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleActivityChange = (index: number, field: string, value: string) => {
    setActivities(prev => prev.map((activity, i) => 
      i === index ? { ...activity, [field]: value } : activity
    ));
  };

  const handleSubmit = () => {
    console.log('Permit Data:', permitData);
    console.log('Activities:', activities);
    toast.success('Permit request raised successfully!');
    navigate('/maintenance/permit');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Permit List</span>
          <span className="mx-2">{'>'}</span>
          <span>New Permit</span>
        </nav>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">NEW PERMIT</h1>
      </div>

      {/* Permit Requestor Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <span className="mr-2">🔸</span>
            PERMIT REQUESTOR DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <TextField
              label="Name"
              value={permitData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            <TextField
              label="Contact Number"
              value={permitData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            <TextField
              label="Site"
              value={permitData.site}
              onChange={(e) => handleInputChange('site', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            <TextField
              label="Department"
              value={permitData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            <TextField
              label="Unit"
              value={permitData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <span className="mr-2">🔸</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TextField
              label="Permit For*"
              value={permitData.permitFor}
              onChange={(e) => handleInputChange('permitFor', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Building*</InputLabel>
                <MuiSelect
                  label="Building*"
                  value={permitData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  <MenuItem value="building-a">Building A</MenuItem>
                  <MenuItem value="building-b">Building B</MenuItem>
                  <MenuItem value="building-c">Building C</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Wing</InputLabel>
                <MuiSelect
                  label="Wing"
                  value={permitData.wing}
                  onChange={(e) => handleInputChange('wing', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Building First</em></MenuItem>
                  <MenuItem value="wing-1">Wing 1</MenuItem>
                  <MenuItem value="wing-2">Wing 2</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Area</InputLabel>
                <MuiSelect
                  label="Area"
                  value={permitData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Floor First</em></MenuItem>
                  <MenuItem value="area-1">Area 1</MenuItem>
                  <MenuItem value="area-2">Area 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Floor</InputLabel>
                <MuiSelect
                  label="Floor"
                  value={permitData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Wing First</em></MenuItem>
                  <MenuItem value="floor-1">Floor 1</MenuItem>
                  <MenuItem value="floor-2">Floor 2</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Room</InputLabel>
                <MuiSelect
                  label="Room"
                  value={permitData.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Wing First</em></MenuItem>
                  <MenuItem value="room-1">Room 1</MenuItem>
                  <MenuItem value="room-2">Room 2</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Copy To</InputLabel>
                <MuiSelect
                  label="Copy To"
                  value={permitData.copyTo}
                  onChange={(e) => handleInputChange('copyTo', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Client Specific</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientSpecific"
                    value="Internal"
                    checked={permitData.clientSpecific === 'Internal'}
                    onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                    className="mr-2"
                  />
                  Internal
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientSpecific"
                    value="Client"
                    checked={permitData.clientSpecific === 'Client'}
                    onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                    className="mr-2"
                  />
                  Client
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permit Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <span className="mr-2">🔸</span>
            PERMIT DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Permit Type*</label>
              <div className="p-4 border rounded-lg">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="permitType"
                    value="test"
                    checked={permitData.permitType === 'test'}
                    onChange={(e) => handleInputChange('permitType', e.target.value)}
                    className="mr-2"
                  />
                  test
                </label>
              </div>
            </div>

            <TextField
              label="Enter Permit Description*"
              value={permitData.permitDescription}
              onChange={(e) => handleInputChange('permitDescription', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={4}
              maxRows={10}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  '& textarea': {
                    height: 'auto',
                    overflow: 'hidden',
                    resize: 'none',
                    padding: '8px 14px',
                  },
                },
              }}
              sx={{ mt: 1 }}
            />

            {/* Dynamic Activities */}
            {activities.map((activity, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                {activities.length > 1 && (
                  <button
                    onClick={() => handleRemoveActivity(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Activity*</InputLabel>
                    <MuiSelect
                      label="Activity*"
                      value={activity.activity}
                      onChange={(e) => handleActivityChange(index, 'activity', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Activity</em></MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="installation">Installation</MenuItem>
                      <MenuItem value="repair">Repair</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Sub Activity*</InputLabel>
                    <MuiSelect
                      label="Sub Activity*"
                      value={activity.subActivity}
                      onChange={(e) => handleActivityChange(index, 'subActivity', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Sub Activity</em></MenuItem>
                      <MenuItem value="electrical">Electrical</MenuItem>
                      <MenuItem value="plumbing">Plumbing</MenuItem>
                      <MenuItem value="hvac">HVAC</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Category of Hazards*</InputLabel>
                    <MuiSelect
                      label="Category of Hazards*"
                      value={activity.categoryOfHazards}
                      onChange={(e) => handleActivityChange(index, 'categoryOfHazards', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Category of Hazards</em></MenuItem>
                      <MenuItem value="low">Low Risk</MenuItem>
                      <MenuItem value="medium">Medium Risk</MenuItem>
                      <MenuItem value="high">High Risk</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>

                <TextField
                  label="Risks*"
                  value={permitData.risks}
                  onChange={(e) => handleInputChange('risks', e.target.value)}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={3}
                  maxRows={6}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      '& textarea': {
                        height: 'auto',
                        overflow: 'hidden',
                        resize: 'none',
                        padding: '8px 14px',
                      },
                    },
                  }}
                  sx={{ mt: 1 }}
                />
              </div>
            ))}

            <Button
              onClick={handleAddActivity}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              + Add Activity
            </Button>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Vendor</InputLabel>
              <MuiSelect
                label="Vendor"
                value={permitData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Vendor</em></MenuItem>
                <MenuItem value="vendor-1">Vendor 1</MenuItem>
                <MenuItem value="vendor-2">Vendor 2</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Comment (Optional)"
              value={permitData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={3}
              maxRows={6}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  '& textarea': {
                    height: 'auto',
                    overflow: 'hidden',
                    resize: 'none',
                    padding: '8px 14px',
                  },
                },
              }}
              sx={{ mt: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <span className="mr-2">📎</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                Choose Files
              </label>
              <span className="ml-4 text-sm text-gray-500">
                {permitData.attachments ? permitData.attachments.name : 'No file chosen'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 px-8 py-3 text-lg"
        >
          Raise a Request
        </Button>
      </div>
    </div>
  );
};

export default AddPermitPage;
