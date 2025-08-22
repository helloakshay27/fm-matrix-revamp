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
  start_hour: number;
  start_min: number;
  end_hour: number;
  end_min: number;
  timings: string;
  total_hour: number;
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
  const [loadingFilteredFMUsers, setLoadingFilteredFMUsers] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);

  // Data states
  const [fmUsers, setFMUsers] = useState<FMUser[]>([]);
  const [filteredFMUsers, setFilteredFMUsers] = useState<FMUser[]>([]);
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
      const r = data; // Direct response structure
      
      // Parse no_of_days based on roster type
      let selectedDays: string[] = [];
      let weekSelection: string[] = [];
      
      if (r.roaster_type === 'Recurring' && r.no_of_days && Array.isArray(r.no_of_days) && r.no_of_days.length > 0) {
        // For recurring: no_of_days: [{ "1": ["2", "1"], "2": ["2"], "3": ["3"] }]
        const recurringData = r.no_of_days[0];
        Object.keys(recurringData).forEach(weekNum => {
          const dayNumbers = recurringData[weekNum];
          dayNumbers.forEach((dayNum: string) => {
            // Map day numbers back to day names (1=Mon, 2=Tue, ..., 7=Sun)
            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const dayName = dayNames[parseInt(dayNum) - 1];
            if (dayName) {
              selectedDays.push(`Week${weekNum}-${dayName}`);
            }
          });
        });
      } else if (r.roaster_type === 'Weekdays' && r.no_of_days && Array.isArray(r.no_of_days)) {
        // For weekdays: extract week numbers
        weekSelection = r.no_of_days.map((weekNum: string) => `${weekNum}${weekNum === '1' ? 'st' : weekNum === '2' ? 'nd' : weekNum === '3' ? 'rd' : 'th'} Week`);
      } else if (r.roaster_type === 'Weekends' && r.no_of_days && Array.isArray(r.no_of_days)) {
        // For weekends: extract weekend numbers  
        weekSelection = r.no_of_days.map((weekendNum: string) => `${weekendNum}${weekendNum === '1' ? 'st' : weekendNum === '2' ? 'nd' : weekendNum === '3' ? 'rd' : 'th'} Weekend`);
      }
      
      // Parse dates
      let periodDates = {
        fromDay: 21,
        fromMonth: 8,
        fromYear: 2025,
        toDay: 19,
        toMonth: 9,
        toYear: 2025
      };
      
      if (r.start_date) {
        const startDate = new Date(r.start_date);
        periodDates.fromDay = startDate.getDate();
        periodDates.fromMonth = startDate.getMonth() + 1;
        periodDates.fromYear = startDate.getFullYear();
      }
      
      if (r.end_date) {
        const endDate = new Date(r.end_date);
        periodDates.toDay = endDate.getDate();
        periodDates.toMonth = endDate.getMonth() + 1;
        periodDates.toYear = endDate.getFullYear();
      }
      
      const departments = r.department_id ? (Array.isArray(r.department_id) ? r.department_id.map(Number) : [Number(r.department_id)]) : [];
      
      setFormData({
        templateName: r.name || '',
        selectedDays,
        dayType: r.roaster_type || 'Weekdays',
        weekSelection,
        location: r.location || '',
        departments,
        shift: r.user_shift_id ? Number(r.user_shift_id) : null,
        selectedEmployees: r.resource_id ? [Number(r.resource_id)] : [],
        rosterType: r.allocation_type || 'Permanent',
        active: r.active !== undefined ? r.active : true
      });
      
      setPeriod(periodDates);
      
      // Fetch filtered users for the departments
      if (departments.length > 0) {
        fetchFilteredFMUsers(departments);
      }
      
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

  // Fetch Shifts from the API
  const fetchShifts = async () => {
    setLoadingShifts(true);
    try {
      const apiUrl = getFullUrl('/pms/admin/user_shifts.json');
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
      console.log('Shifts API Response:', data);

      // Adapt the response to our expected format
      const shiftsData = data.user_shifts || data.shifts || data || [];
      setShifts(shiftsData.map((shift: any) => ({
        id: shift.id,
        start_hour: shift.start_hour,
        start_min: shift.start_min,
        end_hour: shift.end_hour,
        end_min: shift.end_min,
        timings: shift.timings,
        total_hour: shift.total_hour
      })));
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

  // Fetch FM Users for selected departments
  const fetchFilteredFMUsers = async (departmentIds: number[]) => {
    if (!departmentIds || departmentIds.length === 0) {
      setFilteredFMUsers([]);
      return;
    }
    setLoadingFilteredFMUsers(true);
    try {
      const idsParam = departmentIds.join(',');
      const apiUrl = `${API_CONFIG.BASE_URL}/pms/admin/user_roasters/department_roasters.json?department_id=${idsParam}`;
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
      // Adapt response to FMUser[]
      const users = data.fm_users || data.users || data || [];
      setFilteredFMUsers(users.map((user: any) => ({
        id: user.id,
        name: user.name || user.full_name || `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        email: user.email,
        department: user.department ? user.department.department_name : undefined
      })));
    } catch (error) {
      console.error('Error fetching filtered FM users:', error);
      toast.error('Failed to load employees for selected departments');
      setFilteredFMUsers([]);
    } finally {
      setLoadingFilteredFMUsers(false);
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

    // If departments are being changed, fetch filtered users and clear selected employees
    if (field === 'departments') {
      const departmentIds = value as number[];
      setFormData(prev => ({ ...prev, [field]: departmentIds, selectedEmployees: [] }));
      fetchFilteredFMUsers(departmentIds);
    }

    // Clear field error when user starts typing/selecting
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  // Effect to fetch filtered users when initial departments are loaded
  useEffect(() => {
    if (formData.departments.length > 0) {
      fetchFilteredFMUsers(formData.departments);
    }
  }, []);

  // Effect to update location when selectedSite changes
  useEffect(() => {
    if (selectedSite?.name) {
      setCurrentLocation(selectedSite.name);
      setFormData(prev => ({ ...prev, location: selectedSite.name }));
    }
  }, [selectedSite]);

  // Validation
  const validateForm = (): boolean => {
    let hasSelectedDays = false;
    
    if (formData.dayType === 'Recurring') {
      hasSelectedDays = formData.selectedDays.length > 0;
    } else if (formData.dayType === 'Weekdays' || formData.dayType === 'Weekends') {
      hasSelectedDays = formData.weekSelection.length > 0;
    }

    const newErrors = {
      templateName: !formData.templateName.trim(),
      selectedDays: !hasSelectedDays,
      dayType: false,
      location: false, // Location is auto-populated, not required validation
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
      // Build payload for API (matching RosterCreatePage format)
      let payload;
      const baseUserRoaster = {
        name: formData.templateName,
        resource_id: selectedSite?.id || localStorage.getItem('selectedSiteId') || '',
        user_shift_id: formData.shift || '',
        seat_category_id: '1', // Required field
        allocation_type: formData.rosterType,
        roaster_type: formData.dayType,
        active: formData.active
      };

      // Common date format (Rails style for all types - matching RosterCreatePage)
      const commonDateFields = {
        'start_date(3i)': period.fromDay.toString(),
        'start_date(2i)': period.fromMonth.toString(),
        'start_date(1i)': period.fromYear.toString(),
        'end_date(3i)': period.toDay.toString(),
        'end_date(2i)': period.toMonth.toString(),
        'end_date(1i)': period.toYear.toString()
      };

      if (formData.dayType === 'Weekdays') {
        // Weekdays payload
        // Convert week selections to weekday numbers (1-5 for 1st Week to 5th Week)
        const weekdays = formData.weekSelection
          .filter(w => w.match(/^\d/)) // Filter selections that start with digit
          .map(w => w.charAt(0)); // Get first character (week number)
        
        payload = {
          user_roaster: {
            ...baseUserRoaster,
            ...commonDateFields
          },
          department_id: formData.departments.map(String),
          weekdays: weekdays
        };

      } else if (formData.dayType === 'Weekends') {
        // Weekends payload
        // Convert weekend selections to weekend numbers (1-5 for 1st Weekend to 5th Weekend)
        const weekends = formData.weekSelection
          .filter(w => w.match(/^\d/)) // Filter selections that start with digit
          .map(w => w.charAt(0)); // Get first character (weekend number)
        
        payload = {
          user_roaster: {
            ...baseUserRoaster,
            ...commonDateFields
          },
          department_id: formData.departments.map(String),
          weekends: weekends
        };

      } else if (formData.dayType === 'Recurring') {
        // Recurring payload
        // no_of_days: [{ "1": ["2", "1"], "2": ["2"], "3": ["3"] }]
        const recurringData = {};
        for (let weekNum = 1; weekNum <= 5; weekNum++) {
          const daysForWeek = formData.selectedDays
            .filter(d => d.startsWith(`Week${weekNum}-`))
            .map(d => {
              const dayShort = d.split('-')[1];
              // Map short day to number (Mon=1, Tue=2, ..., Sun=7)
              return (
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(dayShort) + 1
              ).toString();
            });
          if (daysForWeek.length > 0) {
            recurringData[weekNum.toString()] = daysForWeek;
          }
        }
        
        payload = {
          user_roaster: {
            ...baseUserRoaster,
            ...commonDateFields
          },
          department_id: formData.departments.map(String),
          no_of_days: [recurringData]
        };

      } else {
        // Default fallback
        payload = {
          user_roaster: {
            ...baseUserRoaster,
            ...commonDateFields
          },
          department_id: formData.departments.map(String),
          no_of_days: []
        };
      }

      // Log payload to console
      console.log('🎯 PATCH API Payload:', JSON.stringify(payload, null, 2));

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
              <p className="text-red-500 text-sm mt-1">
                {formData.dayType === 'Recurring' 
                  ? 'Please select at least one working day'
                  : 'Please select at least one frequency option'
                }
              </p>
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
                  sx: { ...fieldStyles, backgroundColor: "#f5f5f5" },
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
                      {shift.timings} ({shift.total_hour}h)
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

            {formData.departments.length > 0 && (
              <div className="relative">
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ "& .MuiInputBase-root": fieldStyles }}
                >
                  <InputLabel shrink>List Of Selected Employees *</InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.selectedEmployees}
                    onChange={(e) =>
                      handleInputChange(
                        "selectedEmployees",
                        e.target.value as number[]
                      )
                    }
                    input={
                      <OutlinedInput
                        notched
                        label="List Of Selected Employees *"
                      />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as number[]).map((value) => {
                          const user = filteredFMUsers.find(
                            (u) => u.id === value
                          );
                          return (
                            <Chip
                              key={value}
                              label={user?.name || `User ${value}`}
                              size="small"
                              sx={{
                                backgroundColor: "#C72030",
                                color: "white",
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    displayEmpty
                    disabled={
                      loadingFilteredFMUsers ||
                      isSubmitting ||
                      formData.departments.length === 0
                    }
                    error={errors.selectedEmployees}
                  >
                    {filteredFMUsers.length > 0 ? (
                      filteredFMUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Checkbox
                            checked={
                              formData.selectedEmployees.indexOf(user.id) > -1
                            }
                            sx={{
                              color: "#D5DbDB",
                              "&.Mui-checked": {
                                color: "#C72030",
                              },
                            }}
                          />
                          <ListItemText
                            primary={user.name || "No name available"}
                            secondary={user.email}
                          />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <ListItemText
                          primary="No employees found for selected departments"
                          sx={{ fontStyle: "italic", color: "#9ca3af" }}
                        />
                      </MenuItem>
                    )}
                  </MuiSelect>
                  {loadingFilteredFMUsers && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <CircularProgress size={16} />
                    </div>
                  )}
                </FormControl>
                {errors.selectedEmployees && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select at least one employee
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Showing employees from selected departments:{" "}
                  {departments
                    .filter((dept) => formData.departments.includes(dept.id!))
                    .map((dept) => dept.department_name)
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        </Section>

        {/* Show message if no departments selected */}
        {formData.departments.length === 0 && (
          <Section title="Employees" icon={<Users className="w-4 h-4" />}>
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">
                Select Departments First
              </p>
              <p className="text-gray-400 text-sm">
                Please select at least one department to view and select
                employees
              </p>
            </div>
          </Section>
        )}

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
