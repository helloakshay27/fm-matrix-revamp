import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, MapPin, Building2, Clock, Users, Loader2, Save, X } from 'lucide-react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, Chip, Box, OutlinedInput, ListItemText, Checkbox, CircularProgress } from '@mui/material';
import { toast } from 'sonner';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { departmentService, Department } from '@/services/departmentService';
import { RootState } from '@/store/store';

// Section component for consistent layout (matches PatrollingCreatePage)
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
  dayType: 'Weekdays' | 'Weekends' | 'Recurring';
  weekSelection: string[];
  location: string;
  departments: number[];
  shift: number | null;
  selectedEmployees: number[];
  rosterType: 'Permanent';
}

export const RosterCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // Redux state for site information
  const { selectedSite } = useSelector((state: RootState) => state.site);

  // Set document title
  useEffect(() => { 
    document.title = 'Create Roster Template'; 
  }, []);

  // Form state
  const [formData, setFormData] = useState<RosterFormData>({
    templateName: '',
    selectedDays: [],
    dayType: 'Weekdays',
    weekSelection: [],
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
    dayType: false,
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
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
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
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFMUsers();
    fetchDepartments();
    fetchShifts();
    fetchCurrentLocation();
  }, []);

  // Update location when selectedSite changes
  useEffect(() => {
    if (selectedSite?.name) {
      setCurrentLocation(selectedSite.name);
      setFormData(prev => ({ ...prev, location: selectedSite.name }));
    }
  }, [selectedSite]);

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
      // First try to get from Redux state
      if (selectedSite?.name) {
        setCurrentLocation(selectedSite.name);
        setFormData(prev => ({ ...prev, location: selectedSite.name }));
        return;
      }

      // Fallback to localStorage
      const siteId = localStorage.getItem('selectedSiteId');
      const siteName = localStorage.getItem('selectedSiteName');
      const companyName = localStorage.getItem('selectedCompanyName');
      
      let locationName = 'Current Site';
      
      if (siteName && siteName !== 'null' && siteName !== '') {
        locationName = siteName;
      } else if (companyName && companyName !== 'null' && companyName !== '') {
        locationName = companyName;
      }
      
      // Try to get from DOM if localStorage doesn't have it
      if (locationName === 'Current Site') {
        const headerSiteElement = document.querySelector('[data-site-name]');
        if (headerSiteElement) {
          locationName = headerSiteElement.textContent?.trim() || 'Current Site';
        }
      }
      
      setCurrentLocation(locationName);
      setFormData(prev => ({ ...prev, location: locationName }));
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

  // Handle day type selection (Weekdays, Weekends, Recurring)
  const handleDayTypeChange = (type: 'Weekdays' | 'Weekends' | 'Recurring') => {
    setFormData(prev => ({ 
      ...prev, 
      dayType: type,
      selectedDays: [],
      weekSelection: []
    }));
    
    // Auto-select days based on type
    if (type === 'Weekdays') {
      setFormData(prev => ({ 
        ...prev, 
        selectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] 
      }));
    } else if (type === 'Weekends') {
      setFormData(prev => ({ 
        ...prev, 
        selectedDays: ['Saturday', 'Sunday'] 
      }));
    }
    
    if (errors.selectedDays) {
      setErrors(prev => ({ ...prev, selectedDays: false }));
    }
  };

  // Handle week selection for recurring
  const handleWeekToggle = (week: string) => {
    setFormData(prev => {
      const newWeekSelection = prev.weekSelection.includes(week)
        ? prev.weekSelection.filter(w => w !== week)
        : [...prev.weekSelection, week];

      // If "All" is selected, select all other options
      if (week === 'All' && !prev.weekSelection.includes('All')) {
        if (prev.dayType === 'Weekdays') {
          return {
            ...prev,
            weekSelection: ['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week', 'All']
          };
        } else if (prev.dayType === 'Weekends') {
          return {
            ...prev,
            weekSelection: ['1st Weekend', '2nd Weekend', '3rd Weekend', '4th Weekend', '5th Weekend', 'All']
          };
        }
      }
      
      // If "All" is deselected, deselect all other options
      if (week === 'All' && prev.weekSelection.includes('All')) {
        return {
          ...prev,
          weekSelection: []
        };
      }
      
      // If any other option is selected and "All" was already selected, remove "All"
      if (week !== 'All' && prev.weekSelection.includes('All')) {
        const filteredSelection = prev.weekSelection.filter(w => w !== 'All');
        return {
          ...prev,
          weekSelection: newWeekSelection.filter(w => w !== 'All')
        };
      }

      // Check if all individual options are selected (except "All"), then auto-select "All"
      const allOptions = prev.dayType === 'Weekdays' 
        ? ['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week']
        : ['1st Weekend', '2nd Weekend', '3rd Weekend', '4th Weekend', '5th Weekend'];
      
      const hasAllIndividualOptions = allOptions.every(option => 
        newWeekSelection.includes(option)
      );

      if (hasAllIndividualOptions && !newWeekSelection.includes('All')) {
        return {
          ...prev,
          weekSelection: [...newWeekSelection, 'All']
        };
      }

      return {
        ...prev,
        weekSelection: newWeekSelection
      };
    });
  };

  // Handle day toggle for recurring weekly schedule
  const handleRecurringDayToggle = (day: string, week: string) => {
    const dayKey = `${week}-${day}`;
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayKey)
        ? prev.selectedDays.filter(d => d !== dayKey)
        : [...prev.selectedDays, dayKey]
    }));
    
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
    const hasSelectedDays = formData.dayType === 'Recurring' 
      ? formData.selectedDays.length > 0 
      : formData.selectedDays.length > 0;
      
    const newErrors = {
      templateName: !formData.templateName.trim(),
      selectedDays: !hasSelectedDays,
      dayType: false, // dayType is always selected by default
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
          day_type: formData.dayType,
          week_selection: formData.weekSelection,
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
      
      // Navigate back to roster dashboard
      navigate('/roster');
      
    } catch (error) {
      console.error('Error creating roster template:', error);
      toast.error('Failed to create roster template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel/back
  const handleCancel = () => {
    navigate('/roster');
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Loading overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Roster Management"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide uppercase">Create Roster Template</h1>
              {(selectedSite?.name || currentLocation !== 'Current Site') && (
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {selectedSite?.name || currentLocation}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Basic Information Section */}
        <Section title="Basic Information" icon={<Calendar className="w-4 h-4" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <TextField
                label={
                  <>
                    Template Name<span className="text-red-500">*</span>
                  </>
                }
                placeholder="Enter template name"
                value={formData.templateName}
                onChange={(e) => handleInputChange('templateName', e.target.value)}
                fullWidth
                variant="outlined"
                error={errors.templateName}
                helperText={errors.templateName ? 'Template name is required' : ''}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <TextField
                label="Roster Type"
                value="Permanent"
                disabled
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: '#f5f5f5' },
                }}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-4 block">
              Working Days *
            </Label>
            
            {/* Day Type Selection - Enhanced with cards */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Weekdays Card */}
                <div 
                  className={`
                    relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                    ${formData.dayType === 'Weekdays' 
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => !isSubmitting && handleDayTypeChange('Weekdays')}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="dayType"
                      checked={formData.dayType === 'Weekdays'}
                      onChange={() => handleDayTypeChange('Weekdays')}
                      className="text-[#8B5CF6] focus:ring-[#8B5CF6] w-4 h-4"
                      disabled={isSubmitting}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">Weekdays</div>
                      <div className="text-xs text-gray-500 mt-1">Monday - Friday</div>
                    </div>
                    <div className="text-2xl">🗓️</div>
                  </div>
                  {formData.dayType === 'Weekdays' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Weekends Card */}
                <div 
                  className={`
                    relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                    ${formData.dayType === 'Weekends' 
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => !isSubmitting && handleDayTypeChange('Weekends')}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="dayType"
                      checked={formData.dayType === 'Weekends'}
                      onChange={() => handleDayTypeChange('Weekends')}
                      className="text-[#8B5CF6] focus:ring-[#8B5CF6] w-4 h-4"
                      disabled={isSubmitting}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">Weekends</div>
                      <div className="text-xs text-gray-500 mt-1">Saturday - Sunday</div>
                    </div>
                    <div className="text-2xl">🎯</div>
                  </div>
                  {formData.dayType === 'Weekends' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Recurring Card */}
                <div 
                  className={`
                    relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                    ${formData.dayType === 'Recurring' 
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => !isSubmitting && handleDayTypeChange('Recurring')}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="dayType"
                      checked={formData.dayType === 'Recurring'}
                      onChange={() => handleDayTypeChange('Recurring')}
                      className="text-[#8B5CF6] focus:ring-[#8B5CF6] w-4 h-4"
                      disabled={isSubmitting}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">Recurring</div>
                      <div className="text-xs text-gray-500 mt-1">Custom pattern</div>
                    </div>
                    <div className="text-2xl">🔄</div>
                  </div>
                  {formData.dayType === 'Recurring' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Weekdays Selection - Enhanced */}
            {formData.dayType === 'Weekdays' && (
              <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <div className="bg-gradient-to-r from-[#f6f4ee] to-[#f8f6f1] border border-[#D5DbDB] rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#C72030] text-white flex items-center justify-center text-sm font-medium">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#C72030]">Standard Weekdays Selected</h3>
                      <p className="text-sm text-[#1a1a1a] opacity-70">Monday through Friday will be included</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-[#C72030]">Frequency:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week', 'All'].map((week) => (
                        <label 
                          key={week} 
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                            ${formData.weekSelection.includes(week)
                              ? 'border-[#C72030] bg-[#C72030] text-white shadow-md' 
                              : 'border-[#D5DbDB] bg-white text-[#1a1a1a] hover:border-[#C72030] hover:bg-[#f6f4ee]'
                            }
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={formData.weekSelection.includes(week)}
                            onChange={() => handleWeekToggle(week)}
                            disabled={isSubmitting}
                            className="sr-only"
                          />
                          <span className="text-xs font-medium">
                            {week === 'All' ? '🔄 All Weeks' : `📅 ${week}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Visual Day Display */}
                  <div className="border-t border-[#D5DbDB] pt-4">
                    <div className="text-sm font-medium text-[#C72030] mb-3">Days Included:</div>
                    <div className="flex gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                        <div 
                          key={day}
                          className="w-10 h-10 rounded-lg bg-[#C72030] text-white flex items-center justify-center text-xs font-medium shadow-sm"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weekends Selection - Enhanced */}
            {formData.dayType === 'Weekends' && (
              <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <div className="bg-gradient-to-r from-[#f6f4ee] to-[#f8f6f1] border border-[#D5DbDB] rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#C72030] text-white flex items-center justify-center text-sm font-medium">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#C72030]">Weekend Days Selected</h3>
                      <p className="text-sm text-[#1a1a1a] opacity-70">Saturday and Sunday will be included</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-[#C72030]">Frequency:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['1st Weekend', '2nd Weekend', '3rd Weekend', '4th Weekend', '5th Weekend', 'All'].map((weekend) => (
                        <label 
                          key={weekend} 
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                            ${formData.weekSelection.includes(weekend)
                              ? 'border-[#C72030] bg-[#C72030] text-white shadow-md' 
                              : 'border-[#D5DbDB] bg-white text-[#1a1a1a] hover:border-[#C72030] hover:bg-[#f6f4ee]'
                            }
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={formData.weekSelection.includes(weekend)}
                            onChange={() => handleWeekToggle(weekend)}
                            disabled={isSubmitting}
                            className="sr-only"
                          />
                          <span className="text-xs font-medium">
                            {weekend === 'All' ? '🔄 All Weekends' : `🎯 ${weekend}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Visual Day Display */}
                  <div className="border-t border-[#D5DbDB] pt-4">
                    <div className="text-sm font-medium text-[#C72030] mb-3">Days Included:</div>
                    <div className="flex gap-2">
                      {['Sat', 'Sun'].map((day) => (
                        <div 
                          key={day}
                          className="w-10 h-10 rounded-lg bg-[#C72030] text-white flex items-center justify-center text-xs font-medium shadow-sm"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recurring Selection - Completely Enhanced */}
            {formData.dayType === 'Recurring' && (
              <div className="space-y-6 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <div className="bg-gradient-to-r from-[#f6f4ee] to-[#f8f6f1] border border-[#D5DbDB] rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#C72030] text-white flex items-center justify-center text-sm">
                      🔄
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#C72030]">Custom Recurring Pattern</h3>
                      <p className="text-sm text-[#1a1a1a] opacity-70">Select specific days for each week of the month</p>
                    </div>
                  </div>

                  {/* Week Selection Grid */}
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((weekNum) => (
                      <div 
                        key={weekNum} 
                        className="bg-white border border-[#D5DbDB] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f6f4ee] text-[#C72030] flex items-center justify-center text-sm font-bold border border-[#D5DbDB]">
                              {weekNum}
                            </div>
                            <span className="font-medium text-[#1a1a1a]">Week {weekNum}</span>
                          </div>
                          
                          {/* Select All for Week */}
                          <button
                            type="button"
                            onClick={() => {
                              const allDaysForWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `Week${weekNum}-${day}`);
                              const hasAllDays = allDaysForWeek.every(dayKey => formData.selectedDays.includes(dayKey));
                              
                              setFormData(prev => ({
                                ...prev,
                                selectedDays: hasAllDays 
                                  ? prev.selectedDays.filter(d => !allDaysForWeek.includes(d))
                                  : [...prev.selectedDays, ...allDaysForWeek.filter(d => !prev.selectedDays.includes(d))]
                              }));
                            }}
                            disabled={isSubmitting}
                            className={`
                              px-3 py-1 text-xs font-medium rounded-full transition-all duration-200
                              ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].every(day => 
                                formData.selectedDays.includes(`Week${weekNum}-${day}`)
                              )
                                ? 'bg-[#C72030] text-white hover:bg-[#a61e2a]' 
                                : 'bg-[#f6f4ee] text-[#C72030] hover:bg-[#f0ede4] border border-[#D5DbDB]'
                              }
                              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                          >
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].every(day => 
                              formData.selectedDays.includes(`Week${weekNum}-${day}`)
                            ) ? '✓ All Selected' : 'Select All'}
                          </button>
                        </div>
                        
                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-2">
                          {[
                            { short: 'Mon', full: 'Monday' },
                            { short: 'Tue', full: 'Tuesday' },
                            { short: 'Wed', full: 'Wednesday' },
                            { short: 'Thu', full: 'Thursday' },
                            { short: 'Fri', full: 'Friday' },
                            { short: 'Sat', full: 'Saturday' },
                            { short: 'Sun', full: 'Sunday' }
                          ].map((day) => {
                            const isSelected = formData.selectedDays.includes(`Week${weekNum}-${day.short}`);
                            const isWeekend = day.short === 'Sat' || day.short === 'Sun';
                            
                            return (
                              <button
                                key={day.short}
                                type="button"
                                onClick={() => handleRecurringDayToggle(day.short, `Week${weekNum}`)}
                                disabled={isSubmitting}
                                className={`
                                  relative w-full h-12 rounded-lg border-2 transition-all duration-200 text-xs font-medium
                                  ${isSelected
                                    ? 'border-[#C72030] bg-[#C72030] text-white shadow-md hover:bg-[#a61e2a]'
                                    : 'border-[#D5DbDB] bg-[#f6f4ee] text-[#1a1a1a] hover:border-[#C72030] hover:bg-[#f0ede4]'
                                  }
                                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  ${isWeekend ? 'ring-1 ring-[#C72030] ring-opacity-30' : ''}
                                `}
                                title={`${day.full} - Week ${weekNum}`}
                              >
                                <div className="flex flex-col items-center justify-center h-full">
                                  <span className="text-xs">{day.short}</span>
                                  {isSelected && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-[#C72030] rounded-full"></div>
                                    </div>
                                  )}
                                  {isWeekend && !isSelected && (
                                    <div className="absolute -top-0.5 -right-0.5 text-[#C72030] text-xs">•</div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected Count for Week */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-xs text-[#1a1a1a] opacity-70">
                            {(() => {
                              const selectedForWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter(day => 
                                formData.selectedDays.includes(`Week${weekNum}-${day}`)
                              );
                              return selectedForWeek.length > 0 
                                ? `${selectedForWeek.length} day${selectedForWeek.length !== 1 ? 's' : ''} selected`
                                : 'No days selected';
                            })()}
                          </div>
                          
                          {/* Quick Selection Buttons */}
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => `Week${weekNum}-${day}`);
                                const hasAllWeekdays = weekdays.every(dayKey => formData.selectedDays.includes(dayKey));
                                
                                setFormData(prev => ({
                                  ...prev,
                                  selectedDays: hasAllWeekdays 
                                    ? prev.selectedDays.filter(d => !weekdays.includes(d))
                                    : [...prev.selectedDays.filter(d => !weekdays.includes(d)), ...weekdays]
                                }));
                              }}
                              disabled={isSubmitting}
                              className="px-2 py-1 text-xs bg-[#f6f4ee] text-[#C72030] rounded hover:bg-[#f0ede4] transition-colors duration-200 border border-[#D5DbDB]"
                            >
                              Weekdays
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const weekends = ['Sat', 'Sun'].map(day => `Week${weekNum}-${day}`);
                                const hasAllWeekends = weekends.every(dayKey => formData.selectedDays.includes(dayKey));
                                
                                setFormData(prev => ({
                                  ...prev,
                                  selectedDays: hasAllWeekends 
                                    ? prev.selectedDays.filter(d => !weekends.includes(d))
                                    : [...prev.selectedDays.filter(d => !weekends.includes(d)), ...weekends]
                                }));
                              }}
                              disabled={isSubmitting}
                              className="px-2 py-1 text-xs bg-[#f6f4ee] text-[#C72030] rounded hover:bg-[#f0ede4] transition-colors duration-200 border border-[#D5DbDB]"
                            >
                              Weekends
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-[#f6f4ee] rounded-lg border border-[#D5DbDB]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm font-medium text-[#C72030]">Selection Summary</div>
                    </div>
                    <div className="text-xs text-[#1a1a1a] opacity-70">
                      {formData.selectedDays.length > 0 
                        ? `${formData.selectedDays.length} total days selected across all weeks`
                        : 'No days selected yet. Please select days for at least one week.'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errors.selectedDays && (
              <p className="text-red-500 text-sm mt-1">Please select at least one working day</p>
            )}
          </div>
        </Section>

        {/* Location & Department Section */}
        <Section title="Location & Department" icon={<MapPin className="w-4 h-4" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <TextField
                label="Location *"
                value={formData.location}
                disabled
                placeholder="Current site location"
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: { ...fieldStyles, backgroundColor: '#f5f5f5' },
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
                  disabled={loadingDepartments || isSubmitting}
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
                  disabled={loadingShifts || isSubmitting}
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
                  disabled={loadingFMUsers || isSubmitting}
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

      {/* Footer Actions */}
      <div className="flex items-center gap-3 justify-center pt-2">
        <Button
          variant="destructive"
          className="px-8"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Template
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="px-8"
          onClick={() => navigate('/roster')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
