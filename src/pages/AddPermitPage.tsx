import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px',
    fontSize: '14px',
  },
  '& .MuiSelect-select': {
    padding: '14px 16px',
    fontSize: '14px',
  },
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      zIndex: 9999,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  MenuListProps: {
    style: {
      padding: 0,
    },
  },
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
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
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
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
      <Card className="mb-8 shadow-sm border-0">
        <CardHeader className="bg-white border-b border-gray-100">
          <CardTitle className="text-[#C72030] flex items-center text-lg font-semibold">
            <span className="mr-3 w-2 h-2 bg-[#C72030] rounded-full"></span>
            PERMIT REQUESTOR DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <TextField
              label="Name"
              value={permitData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />
            <TextField
              label="Contact Number"
              value={permitData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />
            <TextField
              label="Site"
              value={permitData.site}
              onChange={(e) => handleInputChange('site', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />
            <TextField
              label="Department"
              value={permitData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />
            <TextField
              label="Unit"
              value={permitData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Details */}
      <Card className="mb-8 shadow-sm border-0">
        <CardHeader className="bg-white border-b border-gray-100">
          <CardTitle className="flex items-center text-[#C72030] text-lg font-semibold">
            <span className="mr-3 w-2 h-2 bg-[#C72030] rounded-full"></span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-8">
            <TextField
              label="Permit For*"
              value={permitData.permitFor}
              onChange={(e) => handleInputChange('permitFor', e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <FormControl fullWidth variant="outlined">
                <MuiSelect
                  label="Building*"
                  value={permitData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  <MenuItem value="building-a">Building A</MenuItem>
                  <MenuItem value="building-b">Building B</MenuItem>
                  <MenuItem value="building-c">Building C</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <MuiSelect
                  label="Wing"
                  value={permitData.wing}
                  onChange={(e) => handleInputChange('wing', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Building First</em></MenuItem>
                  <MenuItem value="wing-1">Wing 1</MenuItem>
                  <MenuItem value="wing-2">Wing 2</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <MuiSelect
                  label="Area"
                  value={permitData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Floor First</em></MenuItem>
                  <MenuItem value="area-1">Area 1</MenuItem>
                  <MenuItem value="area-2">Area 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <FormControl fullWidth variant="outlined">
                <MuiSelect
                  label="Floor"
                  value={permitData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Wing First</em></MenuItem>
                  <MenuItem value="floor-1">Floor 1</MenuItem>
                  <MenuItem value="floor-2">Floor 2</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <MuiSelect
                  label="Room"
                  value={permitData.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Wing First</em></MenuItem>
                  <MenuItem value="room-1">Room 1</MenuItem>
                  <MenuItem value="room-2">Room 2</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <MuiSelect
                  label="Copy To"
                  value={permitData.copyTo}
                  onChange={(e) => handleInputChange('copyTo', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">Client Specific</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="clientSpecific"
                    value="Internal"
                    checked={permitData.clientSpecific === 'Internal'}
                    onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                    className="mr-2 w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Internal</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="clientSpecific"
                    value="Client"
                    checked={permitData.clientSpecific === 'Client'}
                    onChange={(e) => handleInputChange('clientSpecific', e.target.value)}
                    className="mr-2 w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Client</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permit Details */}
      <Card className="mb-8 shadow-sm border-0">
        <CardHeader className="bg-white border-b border-gray-100">
          <CardTitle className="flex items-center text-[#C72030] text-lg font-semibold">
            <span className="mr-3 w-2 h-2 bg-[#C72030] rounded-full"></span>
            PERMIT DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">Select Permit Type*</label>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="permitType"
                    value="test"
                    checked={permitData.permitType === 'test'}
                    onChange={(e) => handleInputChange('permitType', e.target.value)}
                    className="mr-2 w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">test</span>
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
              sx={fieldStyles}
            />

            {/* Dynamic Activities */}
            {activities.map((activity, index) => (
              <div key={index} className="space-y-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                {/* Header with remove button */}
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Activity {index + 1}</h4>
                  {activities.length > 1 && (
                    <button
                      onClick={() => handleRemoveActivity(index)}
                      className="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                      title="Remove Activity"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Activity*</InputLabel>
                    <MuiSelect
                      label="Activity*"
                      value={activity.activity}
                      onChange={(e) => handleActivityChange(index, 'activity', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={menuProps}
                    >
                      <MenuItem value=""><em>Select Activity</em></MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="installation">Installation</MenuItem>
                      <MenuItem value="repair">Repair</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Sub Activity*</InputLabel>
                    <MuiSelect
                      label="Sub Activity*"
                      value={activity.subActivity}
                      onChange={(e) => handleActivityChange(index, 'subActivity', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={menuProps}
                    >
                      <MenuItem value=""><em>Select Sub Activity</em></MenuItem>
                      <MenuItem value="electrical">Electrical</MenuItem>
                      <MenuItem value="plumbing">Plumbing</MenuItem>
                      <MenuItem value="hvac">HVAC</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Category of Hazards*</InputLabel>
                    <MuiSelect
                      label="Category of Hazards*"
                      value={activity.categoryOfHazards}
                      onChange={(e) => handleActivityChange(index, 'categoryOfHazards', e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={menuProps}
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
                  sx={fieldStyles}
                />
              </div>
            ))}

            <Button
              onClick={handleAddActivity}
              className="bg-[#C72030] hover:bg-[#A61B28] text-white px-6 py-2 rounded-lg font-medium"
            >
              + Add Activity
            </Button>

            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: '#6b7280', '&.Mui-focused': { color: '#C72030' } }}>Vendor</InputLabel>
              <MuiSelect
                label="Vendor"
                value={permitData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
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
              sx={fieldStyles}
            />
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card className="mb-8 shadow-sm border-0">
        <CardHeader className="bg-white border-b border-gray-100">
          <CardTitle className="flex items-center text-[#C72030] text-lg font-semibold">
            <span className="mr-3 w-2 h-2 bg-[#C72030] rounded-full"></span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
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
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700"
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
          className="bg-[#C72030] hover:bg-[#A61B28] text-white px-12 py-4 text-lg font-semibold rounded-lg"
        >
          Raise a Request
        </Button>
      </div>
    </div>
  );
};

export default AddPermitPage;
