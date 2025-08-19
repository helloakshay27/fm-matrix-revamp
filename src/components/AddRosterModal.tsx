import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Calendar, MapPin, Building2, Clock, Users, Loader2 } from 'lucide-react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, Chip, Box, OutlinedInput, ListItemText, Checkbox, CircularProgress } from '@mui/material';
import { toast } from 'sonner';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { departmentService, Department } from '@/services/departmentService';

// Section component for consistent layout
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-card rounded-lg border border-border shadow-sm">
    <div className="px-6 py-4 border-b border-border flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

// Types
interface FMUser {
  id: number;
  name: string;
  email?: string;
  department?: string;
}

interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}

interface RosterFormData {
  templateName: string;
  selectedDays: string[];
  location: string;
  departments: number[];
  shift: number | null;
  selectedEmployees: number[];
  rosterType: 'Permanent';
}

interface AddRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddRosterModal: React.FC<AddRosterModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState<RosterFormData>({
    templateName: '',
    selectedDays: [],
    location: '',
    departments: [],
    shift: null,
    selectedEmployees: [],
    rosterType: 'Permanent'
  });

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFMUsers, setLoadingFMUsers] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);

  // Data states
  const [fmUsers, setFMUsers] = useState<FMUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('');

  // Error states
  const [errors, setErrors] = useState({
    templateName: false,
    selectedDays: false,
    location: false,
    departments: false,
    shift: false,
    selectedEmployees: false
  });

  // Constants
  const days = [
    'Monday', 
    'Tuesday', 
    'Wednesday', 
    'Thursday', 
    'Friday', 
    'Saturday', 
    'Sunday'
  ];

  // MUI select styles to match PatrollingCreatePage
  const fieldStyles = {
    backgroundColor: '#fafbfc',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e1e5e9',
      borderWidth: '1px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#8b5cf6',
      borderWidth: '2px',
    },
    minHeight: '56px',
  };

  // Fetch data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchFMUsers();
      fetchDepartments();
      fetchShifts();
      fetchCurrentLocation();
    }
  }, [isOpen]);

  // Fetch FM Users
  const fetchFMUsers = async () => {
    setLoadingFMUsers(true);
    try {
      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.FM_USERS);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('FM Users API Response:', data);
      
      // Adapt the response to our expected format
      const users = data.fm_users || data.users || data || [];
      setFMUsers(users.map((user: any) => ({
        id: user.id,
        name: user.name || user.full_name || `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        department: user.department
      })));
    } catch (error) {
      console.error('Error fetching FM Users:', error);
      toast.error('Failed to load FM users');
      setFMUsers([]);
    } finally {
      setLoadingFMUsers(false);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const departmentData = await departmentService.fetchDepartments();
      setDepartments(departmentData);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Fetch Shifts (mock data for now - replace with actual API when available)
  const fetchShifts = async () => {
    setLoadingShifts(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock shift data - replace with actual API call
      const mockShifts = [
        { id: 1, name: 'Morning Shift', start_time: '09:00', end_time: '17:00' },
        { id: 2, name: 'Evening Shift', start_time: '17:00', end_time: '01:00' },
        { id: 3, name: 'Night Shift', start_time: '01:00', end_time: '09:00' },
        { id: 4, name: 'Extended Shift', start_time: '10:00', end_time: '20:00' }
      ];
      setShifts(mockShifts);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast.error('Failed to load shifts');
      setShifts([]);
    } finally {
      setLoadingShifts(false);
    }
  };

  // Fetch Current Location (from site context)
  const fetchCurrentLocation = async () => {
    try {
      const siteId = localStorage.getItem('selectedSiteId');
      const siteName = localStorage.getItem('selectedSiteName');
      
      if (siteName) {
        setCurrentLocation(siteName);
        setFormData(prev => ({ ...prev, location: siteName }));
      } else {
        setCurrentLocation('Current Site');
        setFormData(prev => ({ ...prev, location: 'Current Site' }));
      }
    } catch (error) {
      console.error('Error fetching current location:', error);
      setCurrentLocation('Current Site');
      setFormData(prev => ({ ...prev, location: 'Current Site' }));
    }
  };

  // Handle day selection
  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
    
    // Clear day error when user selects a day
    if (errors.selectedDays) {
      setErrors(prev => ({ ...prev, selectedDays: false }));
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof RosterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing/selecting
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors = {
      templateName: !formData.templateName.trim(),
      selectedDays: formData.selectedDays.length === 0,
      location: !formData.location.trim(),
      departments: formData.departments.length === 0,
      shift: formData.shift === null,
      selectedEmployees: formData.selectedEmployees.length === 0
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error);
    
    if (hasErrors) {
      const errorFields = [];
      if (newErrors.templateName) errorFields.push('Template Name');
      if (newErrors.selectedDays) errorFields.push('Working Days');
      if (newErrors.location) errorFields.push('Location');
      if (newErrors.departments) errorFields.push('Department');
      if (newErrors.shift) errorFields.push('Shift');
      if (newErrors.selectedEmployees) errorFields.push('Selected Employees');

      toast.error(`Please fill in the following required fields: ${errorFields.join(', ')}`, {
        duration: 5000,
      });
    }

    return !hasErrors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build payload structure
      const payload = {
        roster_template: {
          name: formData.templateName,
          working_days: formData.selectedDays,
          location: formData.location,
          department_ids: formData.departments,
          shift_id: formData.shift,
          employee_ids: formData.selectedEmployees,
          roster_type: formData.rosterType,
          active: true,
          created_at: new Date().toISOString()
        }
      };

      // Log payload to console as requested
      console.log('🎯 Roster Template Payload:', JSON.stringify(payload, null, 2));
      console.log('📊 Payload Summary:', {
        templateName: payload.roster_template.name,
        workingDaysCount: payload.roster_template.working_days.length,
        departmentCount: payload.roster_template.department_ids.length,
        employeeCount: payload.roster_template.employee_ids.length,
        location: payload.roster_template.location,
        shiftId: payload.roster_template.shift_id,
        rosterType: payload.roster_template.roster_type
      });

      // Here you would make the actual API call to create the roster
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Roster template created successfully!');
      onSuccess();
      
      // Reset form
      setFormData({
        templateName: '',
        selectedDays: [],
        location: currentLocation,
        departments: [],
        shift: null,
        selectedEmployees: [],
        rosterType: 'Permanent'
      });
      
    } catch (error) {
      console.error('Error creating roster template:', error);
      toast.error('Failed to create roster template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create Roster Template</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information Section */}
          <Section title="Basic Information" icon={<Calendar className="w-4 h-4" />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="templateName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Template Name *
                </Label>
                <TextField
                  id="templateName"
                  fullWidth
                  variant="outlined"
                  value={formData.templateName}
                  onChange={(e) => handleInputChange('templateName', e.target.value)}
                  placeholder="Enter template name"
                  error={errors.templateName}
                  helperText={errors.templateName ? 'Template name is required' : ''}
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Roster Type
                </Label>
                <TextField
                  fullWidth
                  variant="outlined"
                  value="Permanent"
                  disabled
                  sx={{ '& .MuiInputBase-root': { ...fieldStyles, backgroundColor: '#f5f5f5' } }}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Working Days *
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {days.map(day => (
                  <label 
                    key={day} 
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.selectedDays.includes(day)
                        ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6]'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } ${errors.selectedDays ? 'border-red-300' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
              {errors.selectedDays && (
                <p className="text-red-500 text-sm mt-1">Please select at least one working day</p>
              )}
            </div>
          </Section>

          {/* Location & Department Section */}
          <Section title="Location & Department" icon={<MapPin className="w-4 h-4" />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Location *
                </Label>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData.location}
                  disabled
                  placeholder="Current site location"
                  sx={{ '& .MuiInputBase-root': { ...fieldStyles, backgroundColor: '#f5f5f5' } }}
                  InputProps={{
                    startAdornment: <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                  }}
                />
              </div>

              <div className="relative">
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Department *</InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.departments}
                    onChange={(e) => handleInputChange('departments', e.target.value as number[])}
                    input={<OutlinedInput notched label="Department *" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as number[]).map((value) => {
                          const dept = departments.find(d => d.id === value);
                          return (
                            <Chip 
                              key={value} 
                              label={dept?.department_name || `ID: ${value}`} 
                              size="small" 
                              sx={{ backgroundColor: '#8B5CF6', color: 'white' }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    displayEmpty
                    disabled={loadingDepartments}
                    error={errors.departments}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        <Checkbox checked={formData.departments.indexOf(dept.id!) > -1} />
                        <ListItemText primary={dept.department_name} />
                      </MenuItem>
                    ))}
                  </MuiSelect>
                  {loadingDepartments && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <CircularProgress size={16} />
                    </div>
                  )}
                </FormControl>
                {errors.departments && (
                  <p className="text-red-500 text-sm mt-1">Please select at least one department</p>
                )}
              </div>
            </div>
          </Section>

          {/* Shift & Employees Section */}
          <Section title="Shift & Employees" icon={<Clock className="w-4 h-4" />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Shift *</InputLabel>
                  <MuiSelect
                    value={formData.shift || ''}
                    onChange={(e) => handleInputChange('shift', Number(e.target.value))}
                    label="Shift *"
                    notched
                    displayEmpty
                    disabled={loadingShifts}
                    error={errors.shift}
                  >
                    <MenuItem value="">Select Shift</MenuItem>
                    {shifts.map((shift) => (
                      <MenuItem key={shift.id} value={shift.id}>
                        {shift.name} ({shift.start_time} - {shift.end_time})
                      </MenuItem>
                    ))}
                  </MuiSelect>
                  {loadingShifts && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <CircularProgress size={16} />
                    </div>
                  )}
                </FormControl>
                {errors.shift && (
                  <p className="text-red-500 text-sm mt-1">Please select a shift</p>
                )}
              </div>

              <div className="relative">
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>List Of Selected Employees *</InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.selectedEmployees}
                    onChange={(e) => handleInputChange('selectedEmployees', e.target.value as number[])}
                    input={<OutlinedInput notched label="List Of Selected Employees *" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as number[]).map((value) => {
                          const user = fmUsers.find(u => u.id === value);
                          return (
                            <Chip 
                              key={value} 
                              label={user?.name || `User ${value}`} 
                              size="small" 
                              sx={{ backgroundColor: '#8B5CF6', color: 'white' }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    displayEmpty
                    disabled={loadingFMUsers}
                    error={errors.selectedEmployees}
                  >
                    {fmUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <Checkbox checked={formData.selectedEmployees.indexOf(user.id) > -1} />
                        <ListItemText 
                          primary={user.name} 
                          secondary={user.email || user.department}
                        />
                      </MenuItem>
                    ))}
                  </MuiSelect>
                  {loadingFMUsers && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <CircularProgress size={16} />
                    </div>
                  )}
                </FormControl>
                {errors.selectedEmployees && (
                  <p className="text-red-500 text-sm mt-1">Please select at least one employee</p>
                )}
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Template'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
