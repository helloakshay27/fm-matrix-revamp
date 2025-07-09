import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Search, RotateCcw, Droplets, FileText, Frown, Toilet } from 'lucide-react';
import { Button } from '@/components/ui/button';
const fieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: {
      xs: '36px',
      md: '45px'
    },
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E0E0E0'
    },
    '&:hover fieldset': {
      borderColor: '#1A1A1A'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: 2
    }
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#C72030'
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: '#FFFFFF',
      padding: '0 4px'
    }
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#1A1A1A',
    fontSize: '14px',
    padding: {
      xs: '8px 14px',
      md: '12px 14px'
    },
    height: 'auto',
    '&::placeholder': {
      color: '#999999',
      opacity: 1
    }
  }
};
const mockSurveyData = [{
  id: 1,
  title: 'Soap Missing',
  icon: Droplets,
  status: 'pending',
  count: 2
}, {
  id: 2,
  title: 'Tissue Paper Missing',
  icon: FileText,
  status: 'pending',
  count: 1
}, {
  id: 3,
  title: 'Foul Smell',
  icon: Frown,
  status: 'pending',
  count: 1
}, {
  id: 4,
  title: 'Wc Choked',
  icon: Toilet,
  status: 'pending',
  count: 0
}];
export const SurveyResponsePage = () => {
  const [formData, setFormData] = useState({
    survey: '',
    dateRange: '01/06/2025 - 09/07/2025',
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: ''
  });
  const [showResults, setShowResults] = useState(false);
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSearch = () => {
    console.log('Search clicked with data:', formData);
    setShowResults(true);
  };
  const handleReset = () => {
    setFormData({
      survey: '',
      dateRange: '01/06/2025 - 09/07/2025',
      site: '',
      building: '',
      wing: '',
      area: '',
      floor: '',
      room: ''
    });
    setShowResults(false);
  };
  return <div className="flex-1 p-4 sm:p-6 md:p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
          <span>Maintenance</span>
          <span className="mx-2">{'>'}</span>
          <span>Survey</span>
          <span className="mx-2">{'>'}</span>
          <span>Response</span>
        </nav>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">SURVEY RESPONSE</h1>
      </div>

      {/* Filters Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 mb-6">
        {/* First Row - Survey and Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth variant="outlined" sx={fieldStyles}>
            <InputLabel shrink>Select Survey</InputLabel>
            <MuiSelect label="Select Survey" displayEmpty value={formData.survey} onChange={e => handleInputChange('survey', e.target.value)}>
              <MenuItem value=""><em>Select Survey</em></MenuItem>
              <MenuItem value="customer-satisfaction">Customer Satisfaction Survey</MenuItem>
              <MenuItem value="facility-maintenance">Facility Maintenance Survey</MenuItem>
              <MenuItem value="employee-feedback">Employee Feedback Survey</MenuItem>
            </MuiSelect>
          </FormControl>

          <TextField label="Date Range" value={formData.dateRange} onChange={e => handleInputChange('dateRange', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
          shrink: true
        }} sx={fieldStyles} />
        </div>

        {/* Second Row - Location Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FormControl fullWidth variant="outlined" sx={fieldStyles}>
            <InputLabel shrink>Select Site</InputLabel>
            <MuiSelect label="Select Site" displayEmpty value={formData.site} onChange={e => handleInputChange('site', e.target.value)}>
              <MenuItem value=""><em>Select Site</em></MenuItem>
              <MenuItem value="site-1">Site 1</MenuItem>
              <MenuItem value="site-2">Site 2</MenuItem>
              <MenuItem value="site-3">Site 3</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={fieldStyles}>
            <InputLabel shrink>Select Building</InputLabel>
            <MuiSelect label="Select Building" displayEmpty value={formData.building} onChange={e => handleInputChange('building', e.target.value)}>
              <MenuItem value=""><em>Select Building</em></MenuItem>
              <MenuItem value="building-a">Building A</MenuItem>
              <MenuItem value="building-b">Building B</MenuItem>
              <MenuItem value="building-c">Building C</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={fieldStyles}>
            <InputLabel shrink>Select Wing</InputLabel>
            <MuiSelect label="Select Wing" displayEmpty value={formData.wing} onChange={e => handleInputChange('wing', e.target.value)}>
              <MenuItem value=""><em>Select Wing</em></MenuItem>
              <MenuItem value="east-wing">East Wing</MenuItem>
              <MenuItem value="west-wing">West Wing</MenuItem>
              <MenuItem value="north-wing">North Wing</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={fieldStyles}>
            <InputLabel shrink>Select Area</InputLabel>
            <MuiSelect label="Select Area" displayEmpty value={formData.area} onChange={e => handleInputChange('area', e.target.value)}>
              <MenuItem value=""><em>Select Area</em></MenuItem>
              <MenuItem value="lobby">Lobby</MenuItem>
              <MenuItem value="workspace">Workspace</MenuItem>
              <MenuItem value="cafeteria">Cafeteria</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        {/* Third Row - Floor and Room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth variant="outlined" sx={fieldStyles}>
            <InputLabel shrink>Select Floor</InputLabel>
            <MuiSelect label="Select Floor" displayEmpty value={formData.floor} onChange={e => handleInputChange('floor', e.target.value)}>
              <MenuItem value=""><em>Select Floor</em></MenuItem>
              <MenuItem value="ground">Ground Floor</MenuItem>
              <MenuItem value="first">1st Floor</MenuItem>
              <MenuItem value="second">2nd Floor</MenuItem>
              <MenuItem value="third">3rd Floor</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={fieldStyles}>
            <InputLabel shrink>Select Room</InputLabel>
            <MuiSelect label="Select Room" displayEmpty value={formData.room} onChange={e => handleInputChange('room', e.target.value)}>
              <MenuItem value=""><em>Select Room</em></MenuItem>
              <MenuItem value="room-101">Room 101</MenuItem>
              <MenuItem value="room-102">Room 102</MenuItem>
              <MenuItem value="conference-a">Conference Room A</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
  <Button onClick={handleSearch} className="bg-[#3B82F6]  text-white px-6 py-2 rounded-md text-[16px]  flex items-center">
    <Search className="w-4 h-4 mr-2" />
    Search
  </Button>

  <Button onClick={handleReset} className="border  text-[#3B82F6]  px-6 py-2 rounded-md text-[16px]  flex items-center">
    <RotateCcw className="w-4 h-4 mr-2" />
    Reset
  </Button>
      </div>

      </div>

      {/* Survey Results Section */}
      {showResults && <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Survey Results</h2>
          <div className="space-y-4">
            {mockSurveyData.map((item, index) => {
          const IconComponent = item.icon;
          return <div key={item.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-4" style={{
              color: '#C72030'
            }}>
                    <span className="font-medium text-sm text-red-700">
                      {index + 1}.
                    </span>
                    <span className="font-medium text-orange-700">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center mb-2">
                        <IconComponent className="w-6 h-6 text-gray-600" />
                      </div>
                      <span className="text-xs text-gray-600">{item.title}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-[#F6F4EE] text-[#C72030] px-2 py-1 rounded text-sm font-medium">
                        {item.count}
                      </span>
                    </div>
                  </div>
                </div>;
        })}
          </div>
        </div>}
    </div>;
};