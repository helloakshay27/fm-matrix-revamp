
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddTrainingRecordDashboard = () => {
  const navigate = useNavigate();
  const [trainingDate, setTrainingDate] = useState<Date>();
  const [formData, setFormData] = useState({
    srNo: '',
    typeOfUser: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    companyName: '',
    empId: '',
    function: '',
    role: '',
    cluster: '',
    circle: '',
    workLocation: '',
    trainingName: '',
    typeOfTraining: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Training record data:', {
      ...formData,
      trainingDate: trainingDate ? format(trainingDate, 'yyyy-MM-dd') : ''
    });
    navigate('/safety/training-list');
  };

  return (
    <div className="p-6 mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Safety &gt; Training List &gt; Add Training Record
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Training Record</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/safety/training-list')}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#A01020]"
          >
            Save Record
          </Button>
        </div>
      </div>

      {/* Training Record Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#C72030] flex items-center">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
            TRAINING RECORD DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1 */}
            <TextField
              label="Sr No"
              placeholder="Auto-generated or enter manually"
              value={formData.srNo}
              onChange={(e) => handleInputChange('srNo', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Type of User*</InputLabel>
              <MuiSelect
                label="Type of User*"
                value={formData.typeOfUser}
                onChange={(e) => handleInputChange('typeOfUser', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="SSO">SSO</MenuItem>
                <MenuItem value="Signin">Signin</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Full Name*"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            {/* Row 2 */}
            <TextField
              label="Email*"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Mobile Number*"
              placeholder="Enter mobile number"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Company / Employer Name*"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            {/* Row 3 */}
            <TextField
              label="Emp ID (Number)*"
              placeholder="Enter employee ID"
              value={formData.empId}
              onChange={(e) => handleInputChange('empId', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Function</InputLabel>
              <MuiSelect
                label="Function"
                value={formData.function}
                onChange={(e) => handleInputChange('function', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Safety">Safety</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Quality">Quality</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Role</InputLabel>
              <MuiSelect
                label="Role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="Safety Manager">Safety Manager</MenuItem>
                <MenuItem value="Safety Officer">Safety Officer</MenuItem>
                <MenuItem value="Safety Coordinator">Safety Coordinator</MenuItem>
                <MenuItem value="Safety Inspector">Safety Inspector</MenuItem>
              </MuiSelect>
            </FormControl>

            {/* Row 4 */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Cluster</InputLabel>
              <MuiSelect
                label="Cluster"
                value={formData.cluster}
                onChange={(e) => handleInputChange('cluster', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="South">South</MenuItem>
                <MenuItem value="East">East</MenuItem>
                <MenuItem value="West">West</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Circle</InputLabel>
              <MuiSelect
                label="Circle"
                value={formData.circle}
                onChange={(e) => handleInputChange('circle', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="Circle A">Circle A</MenuItem>
                <MenuItem value="Circle B">Circle B</MenuItem>
                <MenuItem value="Circle C">Circle C</MenuItem>
                <MenuItem value="Circle D">Circle D</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Work Location*"
              placeholder="Enter work location"
              value={formData.workLocation}
              onChange={(e) => handleInputChange('workLocation', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            {/* Row 5 */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Training Name*</InputLabel>
              <MuiSelect
                label="Training Name*"
                value={formData.trainingName}
                onChange={(e) => handleInputChange('trainingName', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="Fire Safety Training">Fire Safety Training</MenuItem>
                <MenuItem value="Emergency Response Training">Emergency Response Training</MenuItem>
                <MenuItem value="Chemical Safety Training">Chemical Safety Training</MenuItem>
                <MenuItem value="Electrical Safety Training">Electrical Safety Training</MenuItem>
                <MenuItem value="Personal Protective Equipment Training">Personal Protective Equipment Training</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Type of Training Selected*</InputLabel>
              <MuiSelect
                label="Type of Training Selected*"
                value={formData.typeOfTraining}
                onChange={(e) => handleInputChange('typeOfTraining', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="Internal">Internal</MenuItem>
                <MenuItem value="External">External</MenuItem>
              </MuiSelect>
            </FormControl>

            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Training Date*</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-[45px]",
                      !trainingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {trainingDate ? format(trainingDate, "dd/MM/yyyy") : "Select training date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={trainingDate}
                    onSelect={setTrainingDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
