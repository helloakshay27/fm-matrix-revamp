import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, MapPin, Building2, Clock, Users, Loader2, Save, X, Edit } from 'lucide-react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, Chip, Box, OutlinedInput, ListItemText, Checkbox, CircularProgress } from '@mui/material';
import { toast } from 'sonner';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { departmentService, Department } from '@/services/departmentService';
import { RootState } from '@/store/store';

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
  dayType: 'Weekdays' | 'Weekends' | 'Recurring';
  weekSelection: string[];
  location: string;
  departments: number[];
  shift: number | null;
  selectedEmployees: number[];
  rosterType: 'Permanent';
  active: boolean;
}

export const RosterEditPage: React.FC = () => {
  // Arrays for select period dropdowns
  const daysArr = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthsArr = Array.from({ length: 12 }, (_, i) => i + 1);
  const yearsArr = Array.from({ length: 5 }, (_, i) => 2023 + i);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Redux state for site information
  const { selectedSite } = useSelector((state: RootState) => state.site);

  // Set document title
  useEffect(() => {
    document.title = 'Edit Roster Template';
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
    rosterType: 'Permanent',
    active: true
  });

  // Period selection state
  const [period, setPeriod] = useState({
    fromDay: 19,
    fromMonth: 8,
    fromYear: 2025,
    toDay: 18,
    toMonth: 9,
    toYear: 2025
  });

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // MUI select styles
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
      borderColor: '#C72030',
      borderWidth: '2px',
    },
  };

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchRosterTemplate();
      fetchFMUsers();
      fetchDepartments();
      fetchShifts();
      fetchCurrentLocation();
    }
  }, [id]);

  

  // Fetch existing roster template
  const fetchRosterTemplate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/admin/user_roasters/${id}.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });
      if (!response.ok) throw new Error('Failed to fetch roster template');
      const data = await response.json();
      const r = data.user_roaster || data;
      setFormData({
        templateName: r.name || '',
        selectedDays: r.working_days || [],
        dayType: r.roaster_type || 'Weekdays',
        weekSelection: r.week_selection || [],
        location: r.location || '',
        departments: r.department_id ? r.department_id.map(Number) : [],
        shift: r.user_shift_id ? Number(r.user_shift_id) : null,
        selectedEmployees: r.resource_id ? [Number(r.resource_id)] : [],
        rosterType: r.allocation_type || 'Permanent',
        active: r.active !== undefined ? r.active : true
      });
      setPeriod({
        fromDay: Number(r['start_date(3i)']) || 19,
        fromMonth: Number(r['start_date(2i)']) || 8,
        fromYear: Number(r['start_date(1i)']) || 2025,
        toDay: Number(r['end_date(3i)']) || 18,
        toMonth: Number(r['end_date(2i)']) || 9,
        toYear: Number(r['end_date(1i)']) || 2025
      });
    } catch (error) {
      console.error('Error fetching roster template:', error);
      toast.error('Failed to load roster template');
      // navigate('/roster');
    } finally {
      setIsLoading(false);
    }
  };

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

      // Adapt the response to our expected format
      const users = data.fm_users || data.users || data || [];
      setFMUsers(users.map((user: any) => ({
        id: user.id,
        name: user.name || user.full_name || `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        email: user.email,
        department: user.department ? user.department.department_name : undefined
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

  // Fetch Shifts
  const fetchShifts = async () => {
    setLoadingShifts(true);
    try {
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

  // Fetch Current Location
  const fetchCurrentLocation = async () => {
    try {
      if (selectedSite?.name) {
        setCurrentLocation(selectedSite.name);
        return;
      }

      const siteName = localStorage.getItem('selectedSiteName');
      const companyName = localStorage.getItem('selectedCompanyName');

      let locationName = 'Current Site';

      if (siteName && siteName !== 'null' && siteName !== '') {
        locationName = siteName;
      } else if (companyName && companyName !== 'null' && companyName !== '') {
        locationName = companyName;
      }

      setCurrentLocation(locationName);
    } catch (error) {
      console.error('Error fetching current location:', error);
      setCurrentLocation('Current Site');
    }
  };

  // Handle day type selection
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
      dayType: false,
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
      // Build PATCH payload for API
      let payload: any = {};
      const baseUserRoaster = {
        name: formData.templateName,
        resource_id: formData.selectedEmployees[0]?.toString() || '',
        user_shift_id: formData.shift?.toString() || '',
        seat_category_id: '1',
        'start_date(3i)': period.fromDay.toString(),
        'start_date(2i)': period.fromMonth.toString(),
        'start_date(1i)': period.fromYear.toString(),
        'end_date(3i)': period.toDay.toString(),
        'end_date(2i)': period.toMonth.toString(),
        'end_date(1i)': period.toYear.toString(),
        allocation_type: formData.rosterType,
        roaster_type: formData.dayType
      };

      // Example logic for weekdays/weekends/recurring
      if (formData.dayType === 'Recurring') {
        // Recurring payload
        // Example: { "1": ["1", "4"], ... } for weekNum: [dayNums]
        const recurring = [{}];
        for (let weekNum = 1; weekNum <= 5; weekNum++) {
          const daysForWeek = formData.selectedDays
            .filter(d => d.startsWith(`Week${weekNum}-`))
            .map(d => {
              const dayShort = d.split('-')[1];
              // Map short day to number (Mon=1, Tue=2, ... Sun=7)
              return (
                ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(dayShort) + 1
              ).toString();
            });
          if (daysForWeek.length > 0) {
            recurring[0][weekNum.toString()] = daysForWeek;
          }
        }
        payload = {
          user_roaster: {
            ...baseUserRoaster
          },
          department_id: formData.departments.map(String),
          no_of_days: '',
          recurring
        };
      } else if (formData.dayType === 'Weekends') {
        // Weekends payload
        // weekends: [weekendNum]
        // For demo, use weekSelection as weekend numbers (1-5)
        const weekends = formData.weekSelection
          .filter(w => w.match(/^[1-5]/))
          .map(w => w[0]);
        payload = {
          user_roaster: {
            ...baseUserRoaster
          },
          department_id: formData.departments.map(String),
          weekends
        };
      } else {
        // Weekdays or other types (default)
        payload = {
          user_roaster: {
            ...baseUserRoaster
          },
          department_id: formData.departments.map(String)
        };
      }

      console.log('🎯 PATCH Roster Template Payload:', JSON.stringify(payload, null, 2));

      // PATCH API call
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/admin/user_roasters/${id}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('API error');

      toast.success('Roster template updated successfully!');
      navigate(`/roster/detail/${id}`);

    } catch (error) {
      console.error('Error updating roster template:', error);
      toast.error('Failed to update roster template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(`/roster/detail/${id}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading roster template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 relative">
      {/* Loading overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Roster Details"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide uppercase">Edit Roster Template</h1>
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
            <Label className="text-sm font-medium text-gray-700 mb-4 block mt-6">
              Working Days *
            </Label>

            {/* Day Type Selection - Compact inline */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-6">
                {/* Weekdays Option */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dayType"
                    checked={formData.dayType === 'Weekdays'}
                    onChange={() => handleDayTypeChange('Weekdays')}
                    className="text-[#C72030] focus:ring-[#C72030] w-4 h-4"
                    disabled={isSubmitting}
                  />
                  <span className="font-medium text-gray-800">Weekdays</span>
                  <span className="text-sm text-gray-500">(Mon-Fri)</span>
                </label>

                {/* Weekends Option */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dayType"
                    checked={formData.dayType === 'Weekends'}
                    onChange={() => handleDayTypeChange('Weekends')}
                    className="text-[#C72030] focus:ring-[#C72030] w-4 h-4"
                    disabled={isSubmitting}
                  />
                  <span className="font-medium text-gray-800">Weekends</span>
                  <span className="text-sm text-gray-500">(Sat-Sun)</span>
                </label>

                {/* Recurring Option */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dayType"
                    checked={formData.dayType === 'Recurring'}
                    onChange={() => handleDayTypeChange('Recurring')}
                    className="text-[#C72030] focus:ring-[#C72030] w-4 h-4"
                    disabled={isSubmitting}
                  />
                  <span className="font-medium text-gray-800">Recurring</span>
                  <span className="text-sm text-gray-500">(Custom)</span>
                </label>
              </div>
            </div>

            {/* Weekdays Selection - Compact */}
            {formData.dayType === 'Weekdays' && (
              <div className="space-y-3 p-4 bg-[#f6f4ee] border border-[#D5DbDB] rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-sm font-medium text-[#C72030]">Frequency:</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week', 'All'].map((week) => (
                    <label
                      key={week}
                      className={`
                        flex items-center gap-2 px-3 py-1 rounded-md border-2 cursor-pointer transition-all duration-200
                        ${formData.weekSelection.includes(week)
                          ? 'border-[#C72030] bg-[#C72030] text-white'
                          : 'border-[#D5DbDB] bg-white text-[#1a1a1a] hover:border-[#C72030]'
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
                        {week === 'All' ? 'All Weeks' : week}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-[#1a1a1a] opacity-70 mt-2">
                  Days: Mon, Tue, Wed, Thu, Fri
                </div>
              </div>
            )}

            {/* Weekends Selection - Compact */}
            {formData.dayType === 'Weekends' && (
              <div className="space-y-3 p-4 bg-[#f6f4ee] border border-[#D5DbDB] rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-sm font-medium text-[#C72030]">Frequency:</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['1st Weekend', '2nd Weekend', '3rd Weekend', '4th Weekend', '5th Weekend', 'All'].map((weekend) => (
                    <label
                      key={weekend}
                      className={`
                        flex items-center gap-2 px-3 py-1 rounded-md border-2 cursor-pointer transition-all duration-200
                        ${formData.weekSelection.includes(weekend)
                          ? 'border-[#C72030] bg-[#C72030] text-white'
                          : 'border-[#D5DbDB] bg-white text-[#1a1a1a] hover:border-[#C72030]'
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
                        {weekend === 'All' ? 'All Weekends' : weekend}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-[#1a1a1a] opacity-70 mt-2">
                  Days: Sat, Sun
                </div>
              </div>
            )}

            {/* Recurring Selection - Compact */}
            {formData.dayType === 'Recurring' && (
              <div className="space-y-4 p-4 bg-[#f6f4ee] border border-[#D5DbDB] rounded-lg">
                <div className="text-sm font-medium text-[#C72030] mb-3">Custom Weekly Pattern</div>

                {[1, 2, 3, 4, 5].map((weekNum) => (
                  <div key={weekNum} className="bg-white border border-[#D5DbDB] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Week {weekNum}</span>
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
                          px-2 py-1 text-xs rounded transition-all duration-200
                          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].every(day =>
                          formData.selectedDays.includes(`Week${weekNum}-${day}`)
                        )
                            ? 'bg-[#C72030] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-[#C72030] hover:text-white'
                          }
                        `}
                      >
                        All
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
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
                        return (
                          <button
                            key={day.short}
                            type="button"
                            onClick={() => handleRecurringDayToggle(day.short, `Week${weekNum}`)}
                            disabled={isSubmitting}
                            className={`
                              w-full h-8 rounded text-xs font-medium transition-all duration-200
                              ${isSelected
                                ? 'bg-[#C72030] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-[#C72030] hover:text-white'
                              }
                            `}
                            title={`${day.full} - Week ${weekNum}`}
                          >
                            {day.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="text-xs text-[#1a1a1a] opacity-70">
                  {formData.selectedDays.length > 0
                    ? `${formData.selectedDays.length} days selected across all weeks`
                    : 'No days selected yet'
                  }
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
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter location"
                fullWidth
                variant="outlined"
                error={errors.location}
                helperText={errors.location ? 'Location is required' : ''}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                  startAdornment: <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                }}
                disabled={isSubmitting}
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
                            sx={{ backgroundColor: '#C72030', color: 'white' }}
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
                      <Checkbox
                        checked={formData.departments.indexOf(dept.id!) > -1}
                        sx={{
                          color: '#D5DbDB',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
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
                            label={user?.email || `User ${value}`}
                            size="small"
                            sx={{ backgroundColor: '#C72030', color: 'white' }}
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
                      <Checkbox
                        checked={formData.selectedEmployees.indexOf(user.id) > -1}
                        sx={{
                          color: '#D5DbDB',
                          '&.Mui-checked': {
                            color: '#C72030',
                          },
                        }}
                      />
                      <ListItemText
                        primary={user.email || 'No email available'}
                        secondary={user.name}
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
        <Section title="Select Period" icon={<Calendar className="w-4 h-4" />}>
          <div className="flex flex-col gap-2 mb-4">
            <div className="font-semibold text-lg">Select Period</div>
            <div className="flex items-center gap-4">
              <span className="font-medium">From</span>
              <select
                value={period.fromDay}
                onChange={e => setPeriod(prev => ({ ...prev, fromDay: Number(e.target.value) }))}
                className="border rounded px-2 py-1"
                disabled={isSubmitting}
              >
                {daysArr.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                value={period.fromMonth}
                onChange={e => setPeriod(prev => ({ ...prev, fromMonth: Number(e.target.value) }))}
                className="border rounded px-2 py-1"
                disabled={isSubmitting}
              >
                {monthsArr.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={period.fromYear}
                onChange={e => setPeriod(prev => ({ ...prev, fromYear: Number(e.target.value) }))}
                className="border rounded px-2 py-1"
                disabled={isSubmitting}
              >
                {yearsArr.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="mx-2 font-semibold">To</span>
              <select
                value={period.toDay}
                onChange={e => setPeriod(prev => ({ ...prev, toDay: Number(e.target.value) }))}
                className="border rounded px-2 py-1"
                disabled={isSubmitting}
              >
                {daysArr.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                value={period.toMonth}
                onChange={e => setPeriod(prev => ({ ...prev, toMonth: Number(e.target.value) }))}
                className="border rounded px-2 py-1"
                disabled={isSubmitting}
              >
                {monthsArr.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={period.toYear}
                onChange={e => setPeriod(prev => ({ ...prev, toYear: Number(e.target.value) }))}
                className="border rounded px-2 py-1"
                disabled={isSubmitting}
              >
                {yearsArr.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Status Section */}
        <Section title="Status" icon={<Calendar className="w-4 h-4" />}>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="text-[#C72030] focus:ring-[#C72030] w-4 h-4"
                disabled={isSubmitting}
              />
              <span className="font-medium text-gray-800">Active Template</span>
              <span className="text-sm text-gray-500">(Template will be available for use)</span>
            </label>
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
              Updating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Update Template
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="px-8"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
